<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import colornames from '/assets/colornames.ts' // CSS颜色名称映射表

// 颜色转换核心逻辑
const colorConverter = {
  /**
   * HEX转RGB
   * @param {string} hex HEX颜色值
   * @returns {object} RGB对象 { r, g, b }
   */
  hexToRgb(hex) {
    hex = hex.replace(/^#/, '')
    const len = hex.length
    if (![3, 4, 6, 8].includes(len))
      return null

    // 处理缩写格式
    if (len === 3 || len === 4) {
      hex = hex.split('').map(c => c + c).join('')
    }

    const values = hex.match(/.{2}/g).map(v => Number.parseInt(v, 16))
    return {
      r: values[0],
      g: values[1],
      b: values[2],
      a: values[3] !== undefined ? values[3] / 255 : 1,
    }
  },

  /**
   * RGB转HEX
   * @param {number} r 红色值 (0-255)
   * @param {number} g 绿色值 (0-255)
   * @param {number} b 蓝色值 (0-255)
   * @param {number} a 透明度 (0-1)
   * @returns {string} HEX颜色值
   */
  rgbToHex(r, g, b, a = 1) {
    const components = [r, g, b]
    if (a < 1)
      components.push(Math.round(a * 255))
    return `#${components.map(c =>
      c.toString(16).padStart(2, '0'),
    ).join('')}`
  },

  /**
   * RGB转HSL
   * @param {number} r 红色值 (0-255)
   * @param {number} g 绿色值 (0-255)
   * @param {number} b 蓝色值 (0-255)
   * @returns {object} HSL对象 { h, s, l }
   */

  rgbToHsl(r, g, b) {
  // 规范化输入值为0-1范围
    r = r / 255
    g = g / 255
    b = b / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0 // 初始化h
    let s = 0 // 初始化s
    const l = (max + min) / 2 // 使用const声明l（亮度固定）

    if (max !== min) {
      const d = max - min
      // 计算饱和度（根据亮度分段公式）
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      // 计算色相（避免链式条件判断，增强可读性）
      if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0)
      }
      else if (max === g) {
        h = (b - r) / d + 2
      }
      else if (max === b) {
        h = (r - g) / d + 4
      }
      h *= 60 // 转换为0-360度
    }

    // 返回四舍五入后的整数值
    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  },
  /**
   * HSL转RGB
   * @param {number} h 色相 (0-360)
   * @param {number} s 饱和度 (0-100)
   * @param {number} l 明度 (0-100)
   * @returns {object} RGB对象 { r, g, b }
   */
  hslToRgb(h, s, l) {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    }
    else {
      const hue2rgb = (p, q, t) => {
        if (t < 0)
          t += 1
        if (t > 1)
          t -= 1
        if (t < 1 / 6)
          return p + (q - p) * 6 * t
        if (t < 1 / 2)
          return q
        if (t < 2 / 3)
          return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  },

  /**
   * RGB转CMYK
   * @param {number} r 红色值 (0-255)
   * @param {number} g 绿色值 (0-255)
   * @param {number} b 蓝色值 (0-255)
   * @returns {object} CMYK对象 { c, m, y, k }
   */
  rgbToCmyk(r, g, b) {
    const rPrime = r / 255
    const gPrime = g / 255
    const bPrime = b / 255
    const k = 1 - Math.max(rPrime, gPrime, bPrime)

    if (k === 1)
      return { c: 0, m: 0, y: 0, k: 100 }

    return {
      c: Math.round(((1 - rPrime - k) / (1 - k)) * 100),
      m: Math.round(((1 - gPrime - k) / (1 - k)) * 100),
      y: Math.round(((1 - bPrime - k) / (1 - k)) * 100),
      k: Math.round(k * 100),
    }
  },

  /**
   * CMYK转RGB
   * @param {number} c 青色 (0-100)
   * @param {number} m 品红 (0-100)
   * @param {number} y 黄色 (0-100)
   * @param {number} k 黑色 (0-100)
   * @returns {object} RGB对象 { r, g, b }
   */
  cmykToRgb(c, m, y, k) {
    k /= 100
    return {
      r: Math.round(255 * (1 - c / 100) * (1 - k)),
      g: Math.round(255 * (1 - m / 100) * (1 - k)),
      b: Math.round(255 * (1 - y / 100) * (1 - k)),
    }
  },

  /**
   * 解析颜色名称
   * @param {string} name CSS颜色名称
   * @returns {string} HEX颜色值或null
   */
  nameToHex(name) {
    return colornames[name.toLowerCase()] || null
  },

  /**
   * 验证和解析颜色字符串
   * @param {string} value 颜色字符串
   * @returns {object} 解析后的颜色对象或null
   */
  parseColorString(value) {
    value = value.trim().toLowerCase()

    // 处理颜色名称
    if (/^[a-z]+$/.test(value)) {
      const hex = this.nameToHex(value)
      return hex ? this.hexToRgb(hex) : null
    }

    // 处理HEX格式
    if (value.startsWith('#')) {
      return this.hexToRgb(value)
    }

    // 处理RGB(A)格式
    const rgbMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*([\d.]+))?\)/i)
    if (rgbMatch) {
      return {
        r: +rgbMatch[1],
        g: +rgbMatch[2],
        b: +rgbMatch[3],
        a: rgbMatch[5] ? +rgbMatch[5] : 1,
      }
    }

    // 处理HSL(A)格式
    const hslMatch = value.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(,\s*([\d.]+))?\)/i)
    if (hslMatch) {
      const rgb = this.hslToRgb(+hslMatch[1], +hslMatch[2], +hslMatch[3])
      return { ...rgb, a: hslMatch[5] ? +hslMatch[5] : 1 }
    }

    // 处理CMYK格式
    const cmykMatch = value.match(/cmyk\((\d+)%,\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\)/i)
    if (cmykMatch) {
      const rgb = this.cmykToRgb(+cmykMatch[1], +cmykMatch[2], +cmykMatch[3], +cmykMatch[4])
      return { ...rgb, a: 1 }
    }

    return null
  },
}

// 颜色格式配置
const colorFormats = [
  {
    name: 'hex',
    label: 'HEX',
    placeholder: '#RRGGBBAA',
    pattern: /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
  },
  {
    name: 'rgb',
    label: 'RGB(A)',
    placeholder: 'rgb(255, 0, 0)',
    pattern: /^rgba?\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}(,\s*[\d.]+)?\s*\)$/,
  },
  {
    name: 'hsl',
    label: 'HSL(A)',
    placeholder: 'hsl(360, 100%, 50%)',
    pattern: /^hsla?\(\s*\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%(,\s*[\d.]+)?\s*\)$/,
  },
  {
    name: 'cmyk',
    label: 'CMYK',
    placeholder: 'cmyk(0%, 100%, 100%, 0%)',
    pattern: /^cmyk\(\s*\d{1,3}%,\s*\d{1,3}%,\s*\d{1,3}%,\s*\d{1,3}%\s*\)$/,
  },
  {
    name: 'name',
    label: '颜色名称',
    placeholder: 'red',
    pattern: /^[a-z]+$/i,
  },
]

// 响应式状态
const colorPickerValue = ref('#ff0000')
const colorInputs = reactive({
  hex: '#ff0000',
  rgb: 'rgb(255, 0, 0)',
  hsl: 'hsl(0, 100%, 50%)',
  cmyk: 'cmyk(0%, 100%, 100%, 0%)',
  name: 'red',
})

const currentColor = reactive({
  hex: '#ff0000',
  rgb: 'rgb(255, 0, 0)',
  rgba: 'rgba(255, 0, 0, 1)',
  hsl: 'hsl(0, 100%, 50%)',
  hsla: 'hsla(0, 100%, 50%, 1)',
  cmyk: 'cmyk(0%, 100%, 100%, 0%)',
  name: 'red',
})

const colorHistory = ref([])
const colorSchemes = ref({})

// 调色板相关
const colorCanvas = ref(null)
const selectedColor = ref(null)

// 图片取色相关
const dragOver = ref(false)
const imageUrl = ref('')
const imageElement = ref(null)
const zoomVisible = ref(false)
const zoomPosition = reactive({ x: 0, y: 0 })
const zoomStyle = ref({})

// 输入验证
function isValidFormat(format) {
  const pattern = colorFormats.find(f => f.name === format)?.pattern
  return pattern?.test(colorInputs[format])
}

// 颜色更新逻辑
function updateAllFormats(sourceFormat, value) {
  try {
    // 解析颜色值
    // eslint-disable-next-line prefer-const
    let color = colorConverter.parseColorString(value)
    if (!color)
      return

    // 更新当前颜色状态
    const hex = colorConverter.rgbToHex(color.r, color.g, color.b, color.a)
    const hsl = colorConverter.rgbToHsl(color.r, color.g, color.b)
    const cmyk = colorConverter.rgbToCmyk(color.r, color.g, color.b)
    const name = Object.entries(colornames).find(([n, h]) => h === hex.slice(0, 7))?.[0] || ''

    Object.assign(currentColor, {
      hex,
      rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
      rgba: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${color.a})`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      name,
    })

    // 更新输入框（排除当前修改的输入框）
    colorFormats.forEach((format) => {
      if (format.name !== sourceFormat) {
        colorInputs[format.name] = currentColor[format.name] || ''
      }
    })

    // 更新颜色选择器
    colorPickerValue.value = hex
    addToHistory(hex)
    generateColorSchemes(color)
  }
  catch (error) {
    console.error('颜色更新错误:', error)
  }
}

// 历史记录管理
function addToHistory(color) {
  if (!colorHistory.value.includes(color)) {
    colorHistory.value = [color, ...colorHistory.value].slice(0, 6)
  }
}

// 调色板初始化
onMounted(() => {
  const canvas = colorCanvas.value
  const ctx = canvas.getContext('2d')

  // 设置画布尺寸
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  // 创建水平渐变（色相）
  const hueGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  hueGradient.addColorStop(0, '#ff0000')
  hueGradient.addColorStop(0.17, '#ffff00')
  hueGradient.addColorStop(0.34, '#00ff00')
  hueGradient.addColorStop(0.51, '#00ffff')
  hueGradient.addColorStop(0.68, '#0000ff')
  hueGradient.addColorStop(0.85, '#ff00ff')
  hueGradient.addColorStop(1, '#ff0000')

  // 创建垂直渐变（明度）
  const brightnessGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  brightnessGradient.addColorStop(0, 'rgba(255,255,255,1)')
  brightnessGradient.addColorStop(0.5, 'rgba(255,255,255,0)')
  brightnessGradient.addColorStop(0.5, 'rgba(0,0,0,0)')
  brightnessGradient.addColorStop(1, 'rgba(0,0,0,1)')

  // 绘制调色板
  ctx.fillStyle = hueGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = brightnessGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
})

// 从调色板取色
function getColorFromCanvas(event) {
  const canvas = colorCanvas.value
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const ctx = canvas.getContext('2d')
  const pixel = ctx.getImageData(x, y, 1, 1).data
  const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`
  selectedColor.value = { hex: colorConverter.rgbToHex(pixel[0], pixel[1], pixel[2]) }
  updateAllFormats('rgb', color)
}

// 图片处理逻辑
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file)
    imageUrl.value = URL.createObjectURL(file)
}

function handleFileDrop(event) {
  dragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file?.type.startsWith('image/')) {
    imageUrl.value = URL.createObjectURL(file)
  }
}

function getColorFromImage(event) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = imageElement.value.naturalWidth
  canvas.height = imageElement.value.naturalHeight
  ctx.drawImage(imageElement.value, 0, 0)

  const rect = imageElement.value.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  const x = (event.clientX - rect.left) * scaleX
  const y = (event.clientY - rect.top) * scaleY

  const pixel = ctx.getImageData(x, y, 1, 1).data
  updateAllFormats('rgb', `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`)
}

function handleImageHover(event) {
  zoomVisible.value = true
  zoomPosition.x = event.clientX
  zoomPosition.y = event.clientY

  const rect = imageElement.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  zoomStyle.value = {
    backgroundImage: `url(${imageUrl.value})`,
    backgroundPosition: `-${x * 2}px -${y * 2}px`,
    backgroundSize: `${rect.width * 2}px ${rect.height * 2}px`,
  }
}

// 颜色方案生成
function generateColorSchemes(baseColor) {
  const hsl = colorConverter.rgbToHsl(baseColor.r, baseColor.g, baseColor.b)

  colorSchemes.value = {
    单色方案: generateMonochromatic(hsl),
    互补色: generateComplementary(hsl),
    类似色: generateAnalogous(hsl),
    三色方案: generateTriadic(hsl),
    分裂互补: generateSplitComplementary(hsl),
    四色方案: generateTetradic(hsl),
  }
  // eslint-disable-next-line no-console
  console.log('colorSchemes.value')
}

// 修复后的单色方案生成函数
function generateMonochromatic(baseHsl) {
  return [-40, -20, 0, 20, 40].map((delta) => {
    const adjustedHsl = adjustHSL(baseHsl, 0, 0, delta)
    return convertToColor(adjustedHsl) // 直接转换单个 HSL 对象
  })
}

// 其他方案生成函数（实现类似逻辑）

// 生成互补色方案
function generateComplementary(baseHsl) {
  return [
    baseHsl, // 基准色
    adjustHSL(baseHsl, 180, 0, 0), // 互补色（色相差180度）
  ].map(convertToColor)
}

// 生成类似色方案
function generateAnalogous(baseHsl) {
  return [
    adjustHSL(baseHsl, -30, 0, 0), // 基准色左侧
    adjustHSL(baseHsl, -15, 0, 0),
    baseHsl, // 基准色
    adjustHSL(baseHsl, 15, 0, 0),
    adjustHSL(baseHsl, 30, 0, 0), // 基准色右侧
  ].map(convertToColor)
}

// 生成三色方案
function generateTriadic(baseHsl) {
  return [
    baseHsl, // 基准色
    adjustHSL(baseHsl, 120, 0, 0), // 色相差120度
    adjustHSL(baseHsl, 240, 0, 0), // 色相差240度
  ].map(convertToColor)
}

// 生成分裂互补方案
function generateSplitComplementary(baseHsl) {
  const complementary = adjustHSL(baseHsl, 180, 0, 0)
  return [
    baseHsl, // 基准色
    adjustHSL(complementary, 30, 0, 0), // 互补色右侧偏移
    adjustHSL(complementary, -30, 0, 0), // 互补色左侧偏移
  ].map(convertToColor)
}

// 生成四色方案（矩形方案）
function generateTetradic(baseHsl) {
  return [
    baseHsl, // 基准色
    adjustHSL(baseHsl, 90, 0, 0), // 90度偏移
    adjustHSL(baseHsl, 180, 0, 0), // 互补色
    adjustHSL(baseHsl, 270, 0, 0), // 270度偏移
  ].map(convertToColor)
}
// 辅助函数
function adjustHSL(hsl, hDelta = 0, sDelta = 0, lDelta = 0) {
  return {
    h: (hsl.h + hDelta + 360) % 360,
    s: Math.min(100, Math.max(0, hsl.s + sDelta)),
    l: Math.min(100, Math.max(0, hsl.l + lDelta)),
  }
}

function convertToColor(hsl) {
  const rgb = colorConverter.hslToRgb(hsl.h, hsl.s, hsl.l)
  return {
    hex: colorConverter.rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  }
}

// 事件处理
function handleColorInput(format) {
  if (isValidFormat(format)) {
    updateAllFormats(format, colorInputs[format])
  }
}

function handleColorPicker(event) {
  updateAllFormats('hex', event.target.value)
}

function applyHistoricalColor(color) {
  updateAllFormats('hex', color)
}

function applyColorScheme(color) {
  updateAllFormats('hex', color.hex)
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
  }
  catch (err) {
    console.error('复制失败:', err)
  }
}

// 初始化
updateAllFormats('hex', '#ff0000')
</script>

<template>
  <div class="mx-auto max-w-6xl p-6 space-y-8">
    <!-- 颜色选择控件 -->
    <div class="rounded-xl bg-white p-4 shadow-sm">
      <div class="flex items-center gap-4">
        <input
          v-model="colorPickerValue"
          type="color"
          class="h-16 w-16 cursor-pointer rounded-lg"
          @input="handleColorPicker"
        >
        <div class="grid grid-cols-6 flex-1 gap-1">
          <div
            v-for="(color, index) in colorHistory"
            :key="index"
            class="aspect-square cursor-pointer border-2 border-white rounded shadow-lg transition-transform hover:scale-110"
            :style="{ backgroundColor: color }"
            @click="applyHistoricalColor(color)"
          />
        </div>
      </div>
    </div>

    <!-- 颜色转换器 -->
    <div class="rounded-xl bg-white p-4 shadow-sm">
      <h2 class="mb-4 text-xl text-gray-800 font-bold">
        颜色转换器
      </h2>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
        <div v-for="format in colorFormats" :key="format.name">
          <label class="mb-2 block text-sm text-gray-700 font-medium">{{ format.label }}</label>
          <input
            v-model="colorInputs[format.name]"
            type="text"
            class="w-full border rounded-md px-3 py-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': !isValidFormat(format.name) }"
            :placeholder="format.placeholder"
            @input="handleColorInput(format.name)"
          >
          <p v-if="!isValidFormat(format.name)" class="mt-1 text-xs text-red-500">
            无效的格式
          </p>
        </div>
      </div>

      <div class="mt-6 flex items-start gap-6">
        <div class="relative h-32 w-32 overflow-hidden rounded-xl shadow-lg">
          <div class="checkerboard-bg absolute inset-0 opacity-20" />
          <div class="absolute inset-0" :style="{ backgroundColor: currentColor.rgba }" />
        </div>
        <div class="grid grid-cols-2 flex-1 gap-3">
          <div
            v-for="(value, key) in currentColor"
            :key="key"
            class="flex items-center rounded-md bg-gray-50 px-3 py-2"
          >
            <span class="w-20 text-sm text-gray-600 font-medium">{{ key }}:</span>
            <span class="break-all text-sm text-gray-800 font-mono">{{ value }}</span>
            <button
              class="ml-2 text-gray-400 transition hover:text-blue-600"
              @click="copyToClipboard(value)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 调色板 -->
    <div class="rounded-xl bg-white p-4 shadow-sm">
      <h2 class="mb-4 text-xl text-gray-800 font-bold">
        调色板选择
      </h2>
      <canvas
        ref="colorCanvas"
        class="h-48 w-full cursor-crosshair border-2 border-gray-200 rounded-lg"
        @click="getColorFromCanvas"
      />
      <div v-if="selectedColor" class="mt-4 flex items-center gap-3">
        <div class="h-8 w-8 border-2 border-white rounded shadow" :style="{ backgroundColor: selectedColor.hex }" />
        <span class="text-sm font-mono">{{ selectedColor.hex }}</span>
      </div>
    </div>

    <!-- 图片取色 -->
    <div class="rounded-xl bg-white p-4 shadow-sm">
      <h2 class="mb-4 text-xl text-gray-800 font-bold">
        图片取色
      </h2>
      <div
        class="border-2 rounded-xl border-dashed p-8 text-center transition-colors"
        :class="dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
        @dragover.prevent="dragOver = true"
        @dragleave="dragOver = false"
        @drop.prevent="handleFileDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileUpload"
        >
        <button
          class="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          @click="$refs.fileInput.click()"
        >
          选择图片
        </button>
        <p class="mt-2 text-sm text-gray-500">
          或拖放图片到此区域
        </p>
      </div>

      <div v-if="imageUrl" ref="imageContainer" class="relative mt-4">
        <img
          ref="imageElement"
          :src="imageUrl"
          class="max-w-full cursor-crosshair rounded-lg shadow"
          @click="getColorFromImage"
          @mousemove="handleImageHover"
          @mouseleave="zoomVisible = false"
        >
        <div
          v-if="zoomVisible"
          class="absolute rounded-lg bg-white p-1 shadow-xl"
          :style="{ left: `${zoomPosition.x + 20}px`, top: `${zoomPosition.y + 20}px` }"
        >
          <div class="h-32 w-32 bg-contain" :style="zoomStyle" />
        </div>
      </div>
    </div>

    <!-- 颜色方案生成 -->
    <div class="rounded-xl bg-white p-4 shadow-sm">
      <h2 class="mb-4 text-xl text-gray-800 font-bold">
        配色方案
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          v-for="(scheme, name) in colorSchemes"
          :key="name"
          class="rounded-lg bg-gray-50 p-4"
        >
          <h3 class="mb-3 text-sm text-gray-700 font-semibold">
            {{ name }}
          </h3>
          <div class="grid grid-cols-5 gap-2">
            <div
              v-for="(color, index) in scheme"
              :key="index"
              class="group relative aspect-square cursor-pointer rounded-lg shadow transition hover:shadow-md"
              :style="{ backgroundColor: color.hex }"
              @click="applyColorScheme(color)"
            >
              <div class="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                <span class="rounded bg-black bg-opacity-75 px-2 py-1 text-xs text-white">{{ color.hex }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  <style>
  .checkerboard-bg {
  background-image: linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
    linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
    linear-gradient(-45deg, transparent 75%, #e5e5e5 75%);
  background-size: 16px 16px;
  background-position:
    0 0,
    0 8px,
    8px -8px,
    -8px 0;
}
</style>
