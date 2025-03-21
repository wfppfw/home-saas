<script setup>
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

// 注册ECharts组件
echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
])

const API_KEY = 'c6a83f36103c408393354aa201e86b2a' // 替换为你的API Key
const cityInput = ref('')
const currentLang = ref('zh')
const weatherData = reactive({ now: null, daily: [], hourly: [] })
const isLoading = ref(false)
const errorMsg = ref('')
const chartInstance = ref(null)
const isGeolocating = ref(false) // 新增定位状态

// 多语言配置
const locales = {
  zh: {
    geolocate: '定位中...',
    geoError: '无法获取位置，请手动搜索',
    geoDenied: '定位权限被拒绝',
    placeholder: '输入城市名称',
    searchBtn: '查询天气',
    humidity: '湿度',
    windSpeed: '风速',
    visibility: '能见度',
    hourlyForecast: '小时预报',
    weeklyForecast: '七日预报',
    loading: '查询中...',
    cityNotFound: '城市不存在',
    fetchError: '数据获取失败',
    tempTrend: '24小时温度趋势',
    temperature: '温度(℃)',
  },
  en: {
    geolocate: 'Detecting location...',
    geoError: 'Location failed, please search manually',
    geoDenied: 'Location permission denied',
    placeholder: 'Enter city name',
    searchBtn: 'Search',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    visibility: 'Visibility',
    hourlyForecast: 'Hourly Forecast',
    weeklyForecast: '7-Day Forecast',
    loading: 'Searching...',
    cityNotFound: 'City not found',
    fetchError: 'Failed to fetch data',
    tempTrend: '24h Temperature Trend',
    temperature: 'Temperature(℃)',
  },
}

const t = key => locales[currentLang.value][key]

// 获取城市ID
async function fetchLocationId(city) {
  const { data } = await useFetch(
    `https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=${API_KEY}&lang=${currentLang.value}`,
  )
  return data.value?.location?.[0]?.id
}

// 获取天气数据
async function fetchWeather() {
  if (!cityInput.value.trim())
    return
  try {
    isLoading.value = true
    errorMsg.value = ''

    const locationId = await fetchLocationId(cityInput.value)
    if (!locationId)
      throw new Error(t('cityNotFound'))

    const apiBase = `https://devapi.qweather.com/v7/weather`
    const [nowRes, dailyRes, hourlyRes] = await Promise.all([
      useFetch(`${apiBase}/now?location=${locationId}&key=${API_KEY}&lang=${currentLang.value}`),
      useFetch(`${apiBase}/7d?location=${locationId}&key=${API_KEY}&lang=${currentLang.value}`),
      useFetch(`${apiBase}/24h?location=${locationId}&key=${API_KEY}&lang=${currentLang.value}`),
    ])

    if (nowRes.data.value?.code === '200')
      weatherData.now = nowRes.data.value.now
    if (dailyRes.data.value?.code === '200')
      weatherData.daily = dailyRes.data.value.daily.slice(0, 7)
    if (hourlyRes.data.value?.code === '200')
      weatherData.hourly = hourlyRes.data.value.hourly.slice(0, 24)
  }
  catch (err) {
    errorMsg.value = err.message || t('fetchError')
  }
  finally {
    isLoading.value = false
  }
}

// 图表配置
const chartOption = computed(() => ({
  title: {
    text: t('tempTrend'),
    left: 'center',
    textStyle: { fontSize: 16, color: '#1f2937' },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    textStyle: { color: '#1f2937' },
    formatter: (params) => {
      const date = new Date(params[0].name)
      const time = date.toLocaleTimeString([currentLang.value], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: currentLang.value === 'en',
      })
      return `${time}<br/>${params[0].marker} ${params[0].value}℃`
    },
  },
  xAxis: {
    type: 'category',
    data: weatherData.hourly.map(h => h.fxTime),
    axisLabel: {
      color: '#6b7280',
      formatter: (value) => {
        const date = new Date(value)
        return date.toLocaleTimeString([currentLang.value], {
          hour: 'numeric',
          hour12: currentLang.value === 'en',
        })
      },
    },
  },
  yAxis: {
    type: 'value',
    name: t('temperature'),
    nameTextStyle: { color: '#6b7280', padding: [0, 20, 0, 0] },
    axisLabel: { color: '#6b7280' },
  },
  series: [{
    data: weatherData.hourly.map(h => h.temp),
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 8,
    lineStyle: { width: 3, color: '#3b82f6' },
    itemStyle: { color: '#3b82f6', borderColor: '#fff', borderWidth: 2 },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
        { offset: 1, color: 'rgba(59, 130, 246, 0)' },
      ]),
    },
  }],
  grid: {
    containLabel: true,
    left: 20,
    right: 20,
    bottom: 20,
    top: 60,
    backgroundColor: '#f8fafc',
  },
}))

// 响应式调整图表
const handleResize = () => chartInstance.value?.resize()

// 新增定位功能
function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      errorMsg.value = t('geoError')
      resolve(false)
      return
    }

    isGeolocating.value = true
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const { data } = await useFetch(
            `https://geoapi.qweather.com/v2/city/lookup?location=${longitude},${latitude}&key=${API_KEY}&lang=${currentLang.value}`,
          )

          if (data.value?.location?.[0]) {
            cityInput.value = data.value.location[0].name
            await fetchWeather()
          }
        }
        // eslint-disable-next-line unused-imports/no-unused-vars
        catch (err) {
          errorMsg.value = t('geoError')
        }
        finally {
          isGeolocating.value = false
          resolve(true)
        }
      },
      (error) => {
        isGeolocating.value = false
        errorMsg.value = error.PERMISSION_DENIED ? t('geoDenied') : t('geoError')
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    )
  })
}

// 修改后的初始化逻辑
onMounted(async () => {
  await getLocation()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<template>
  <div class="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
    <!-- 语言切换 -->
    <div class="mb-4 flex justify-end">
      <button
        class="border rounded-lg px-3 py-1 text-sm transition-colors dark:border-gray-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
        @click="currentLang = currentLang === 'zh' ? 'en' : 'zh'"
      >
        {{ currentLang === 'zh' ? 'EN' : '中文' }}
      </button>
    </div>

    <!-- 定位状态提示 -->
    <!-- <div v-if="isGeolocating" class="mb-4 rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
      {{ t('geolocate') }}
    </div> -->
    <!-- 搜索栏 -->
    <!-- 修改后的搜索栏 -->
    <div class="mb-8 flex gap-3">
      <div class="relative flex-1">
        <input
          v-model="cityInput"
          :placeholder="t('placeholder')"
          class="w-full border rounded-lg px-4 py-2 outline-none ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2"
          @keyup.enter="fetchWeather"
        >
        <button
          class="absolute right-2 top-2 p-1 text-gray-500 transition-colors hover:text-blue-500"
          :title="t('searchBtn')"
          @click="getLocation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <button
        class="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
        :disabled="isLoading"
        @click="fetchWeather"
      >
        {{ isLoading ? t('loading') : t('searchBtn') }}
      </button>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMsg" class="mb-6 rounded-lg bg-red-100 p-4 text-red-600 dark:bg-red-900 dark:text-red-200">
      {{ errorMsg }}
    </div>

    <!-- 当前天气 -->
    <div v-if="weatherData.now" class="mb-8">
      <div class="flex items-center gap-6">
        <div class="text-5xl text-gray-800 font-bold dark:text-gray-200">
          {{ weatherData.now.temp }}℃
        </div>
        <div>
          <h2 class="text-2xl font-semibold dark:text-gray-200">
            {{ cityInput }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ weatherData.now.text }}
          </p>
        </div>
      </div>
      <div class="grid grid-cols-3 mt-4 gap-4 text-center">
        <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-300">
            {{ t('humidity') }}
          </p>
          <p class="text-lg font-medium dark:text-gray-200">
            {{ weatherData.now.humidity }}%
          </p>
        </div>
        <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-300">
            {{ t('windSpeed') }}
          </p>
          <p class="text-lg font-medium dark:text-gray-200">
            {{ weatherData.now.windSpeed }}km/h
          </p>
        </div>
        <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-300">
            {{ t('visibility') }}
          </p>
          <p class="text-lg font-medium dark:text-gray-200">
            {{ weatherData.now.vis }}km
          </p>
        </div>
      </div>
    </div>

    <!-- 温度图表 -->
    <div v-if="weatherData.hourly.length" class="mb-8">
      <h3 class="mb-4 text-xl font-semibold dark:text-gray-200">
        {{ t('hourlyForecast') }}
      </h3>
      <div class="mb-6 h-64">
        <client-only>
          <VChart
            :option="chartOption"
            :init-options="{ renderer: 'canvas' }"
            class="h-full w-full"
            @chart-ready="(chart) => chartInstance = chart"
          />
        </client-only>
      </div>
    </div>

    <!-- 七天预报 -->
    <div v-if="weatherData.daily.length" class="mb-8">
      <h3 class="mb-4 text-xl font-semibold dark:text-gray-200">
        {{ t('weeklyForecast') }}
      </h3>
      <div class="space-y-3">
        <div
          v-for="day in weatherData.daily"
          :key="day.fxDate"
          class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
        >
          <span class="w-24 dark:text-gray-300">
            {{ new Date(day.fxDate).toLocaleDateString(currentLang, {
              month: 'short',
              day: 'numeric',
            }) }}
          </span>
          <div class="flex items-center gap-2">
            <span class="text-blue-500">{{ day.tempMin }}℃</span>
            <span class="text-red-500">{{ day.tempMax }}℃</span>
          </div>
          <span class="text-gray-600 dark:text-gray-400">{{ day.textDay }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 图表工具提示样式优化 */
.echarts-tooltip {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  border-radius: 0.5rem !important;
  backdrop-filter: blur(4px);
}

/* 暗黑模式适配 */
.dark .echarts-tooltip {
  background: rgba(31, 41, 55, 0.95) !important;
  border: 1px solid #374151 !important;
}
.dark .echarts-tooltip span {
  color: #f3f4f6 !important;
}
</style>
