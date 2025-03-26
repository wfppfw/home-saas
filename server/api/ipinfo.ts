// server/api/ipinfo.ts
interface IPSource {
  name: string
  handler: (ip: string) => Promise<UnifiedResult>
}

interface UnifiedResult {
  ip: string
  country: string
  countryCode: string
  region: string
  city: string
  isp: string
  lat?: number
  lon?: number
  timezone?: string
}

const PUBLIC_IP_SERVICES = [
  'https://ipv4.icanhazip.com',
  'https://checkip.amazonaws.com',
  'https://api.ipify.org',
]

const IP_SOURCES: IPSource[] = [
  {
    name: 'ipapi.co',
    handler: async (ip) => {
      const url = `https://ipapi.co/${ip}/json/`
      const res: any = await $fetch(url)

      if (res?.error)
        throw new Error(res.reason || 'API error')

      return {
        ip: res.ip,
        country: res.country_name || '',
        countryCode: res.country_code || '',
        region: res.region || '',
        city: res.city || '',
        isp: res.org || '',
        lat: Number(res.latitude) || undefined,
        lon: Number(res.longitude) || undefined,
        timezone: res.timezone || '',
      }
    },
  },
  {
    name: 'ip-api',
    handler: async (ip) => {
      const url = `http://ip-api.com/json/${ip}`
      const res: any = await $fetch(url, {
        params: {
          lang: 'zh-CN',
          fields: '66846719',
        },
      })

      if (res?.status !== 'success')
        throw new Error(res.message || 'API error')

      return {
        ip: res.query,
        country: res.country || '',
        countryCode: res.countryCode || '',
        region: res.regionName || '',
        city: res.city || '',
        isp: res.isp || '',
        lat: res.lat || undefined,
        lon: res.lon || undefined,
        timezone: res.timezone || '',
      }
    },
  },
  {
    name: 'ipapi',
    handler: async (ip) => {
      const url = `https://ipapi.com/ip_api.php?ip=${ip}`
      const res: any = await $fetch(url)

      if (res?.error)
        throw new Error(res.info || 'API error')

      return {
        ip: res.ip,
        country: res.country_name || '',
        countryCode: res.country_code || '',
        region: res.region_name || '',
        city: res.city || '',
        isp: res.isp || '',
        lat: Number(res.latitude) || undefined,
        lon: Number(res.longitude) || undefined,
        timezone: res.timezone || '',
      }
    },
  },
]

async function getPublicIP(): Promise<string> {
  for (const service of PUBLIC_IP_SERVICES) {
    try {
      const ip = await $fetch<string>(service, { timeout: 3000 })
      if (ip && isValidIP(ip))
        return ip.trim()
    }
    catch (error) {
      console.warn(`[Public IP] ${service} failed:`, (error as Error).message)
    }
  }
  throw new Error('Failed to get public IP')
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let clientIp = query.ip as string || getClientIP(event)

  // 处理本地IP情况
  if (isLocalIP(clientIp)) {
    try {
      clientIp = await getPublicIP()
    }
    catch (error) {
      throw createError({
        statusCode: 400,
        message: '无法获取公网IP，请手动输入有效IP地址',
        data: { code: 'MISSING_PUBLIC_IP' },
      })
    }
  }

  if (!isValidIP(clientIp)) {
    throw createError({
      statusCode: 400,
      message: '无效的IP地址格式',
      data: { code: 'INVALID_IP_FORMAT' },
    })
  }

  const storageKey = `ipinfo:${clientIp}`
  const cachedData = await useStorage().getItem<UnifiedResult>(storageKey)
  if (cachedData)
    return { success: true, source: 'cache', data: cachedData }

  const errors: string[] = []

  for (const source of IP_SOURCES) {
    try {
      const result = await Promise.race([
        source.handler(clientIp),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('请求超时')), 3000),
        ),
      ])

      // 验证必要字段
      if (!result.country || !result.isp) {
        throw new Error('返回数据不完整')
      }

      await useStorage().setItem(storageKey, result, { ttl: 3600 })

      return {
        success: true,
        source: source.name,
        isLocal: isLocalIP(clientIp),
        data: result,
      }
    }
    catch (err: any) {
      errors.push(`${source.name}: ${err.message}`)
      console.error(`[IP查询] ${source.name}失败:`, err.message)
    }
  }

  throw createError({
    statusCode: 503,
    message: `所有数据源均不可用: ${errors.join('; ')}`,
    data: { errors },
  })
})

// 工具函数
function isLocalIP(ip: string): boolean {
  return ip === '127.0.0.1'
    || ip === '::1'
    || ip.startsWith('192.168.')
    || ip.startsWith('10.')
    || (ip.startsWith('172.')
      && Number.parseInt(ip.split('.')[1] || 0) >= 16
      && Number.parseInt(ip.split('.')[1] || 0) <= 31)
    || ip.startsWith('fc00::/7') // IPv6私有地址
}

function isValidIP(ip: string): boolean {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  return /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(ip)
    // eslint-disable-next-line regexp/no-unused-capturing-group
    || /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(ip) // 支持IPv6
}

function getClientIP(event: any): string {
  const headers = event.node.req.headers
  const forwardedFor = headers['x-forwarded-for']
    || headers['x-real-ip']
    || headers['cf-connecting-ip']
    || headers['fastly-client-ip']

  if (forwardedFor) {
    const ips = (Array.isArray(forwardedFor) ? forwardedFor : forwardedFor.split(','))
      .map(ip => ip.trim().replace('::ffff:', ''))
      .filter(ip => isValidIP(ip) && !isLocalIP(ip))

    if (ips.length > 0)
      return ips[0]
  }

  const socketIp = event.node.req.socket?.remoteAddress?.replace('::ffff:', '')
  return socketIp || '127.0.0.1'
}
