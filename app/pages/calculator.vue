<script setup>
const currentInput = ref('0')
const equation = ref('')
const angleMode = ref('DEG') // DEG/RAD

definePageMeta({
  layout: 'project',
})

// 基础功能方法
function appendNumber(num) {
  if (currentInput.value === '0' || currentInput.value === 'Error') {
    currentInput.value = num.toString()
  }
  else {
    currentInput.value += num.toString()
  }
}

function appendDecimal() {
  if (!currentInput.value.includes('.')) {
    currentInput.value += currentInput.value ? '.' : '0.'
  }
}

function appendOperator(operator) {
  if (currentInput.value && currentInput.value !== 'Error') {
    equation.value = `${currentInput.value} ${operator} `
    currentInput.value = ''
  }
}

function clear() {
  currentInput.value = '0'
  equation.value = ''
}

function del() {
  if (currentInput.value !== 'Error') {
    currentInput.value = currentInput.value.slice(0, -1)
    if (!currentInput.value)
      currentInput.value = '0'
  }
}

// 科学计算方法
function appendFunction(fn) {
  if (currentInput.value && currentInput.value !== 'Error') {
    equation.value = `${fn}(${currentInput.value})`
    calculateScientific(fn)
  }
}

function appendConstant(constant) {
  if (currentInput.value === '0' || currentInput.value === 'Error') {
    currentInput.value = constant
  }
  else {
    currentInput.value += constant
  }
}

function appendPower() {
  if (currentInput.value && currentInput.value !== 'Error') {
    equation.value = `${currentInput.value}^`
    currentInput.value = ''
  }
}

function appendSquare() {
  if (currentInput.value && currentInput.value !== 'Error') {
    equation.value = `pow(${currentInput.value},2)`
    calculateScientific('pow')
  }
}

function appendFactorial() {
  if (currentInput.value === 'Error')
    return

  const num = Number.parseFloat(currentInput.value)
  if (Number.isInteger(num) && num >= 0) {
    currentInput.value = factorial(num).toString()
  }
  else {
    currentInput.value = 'Error'
  }
}

function toggleAngleMode() {
  angleMode.value = angleMode.value === 'DEG' ? 'RAD' : 'DEG'
}

function calculateScientific(fn) {
  try {
    let value = Number.parseFloat(currentInput.value)

    // 处理角度转换
    if (['sin', 'cos', 'tan'].includes(fn)) {
      if (angleMode.value === 'DEG') {
        value = (value * Math.PI) / 180
      }
    }

    let result
    switch (fn) {
      case 'sin':
        result = Math.sin(value)
        break
      case 'cos':
        result = Math.cos(value)
        break
      case 'tan':
        result = Math.tan(value)
        break
      case 'log':
        result = Math.log10(value)
        break
      case 'ln':
        result = Math.log(value)
        break
      case 'sqrt':
        result = Math.sqrt(value)
        break
      case 'pow': {
        // 使用块级作用域
        const [base, exponent] = equation.value.replace('pow(', '').replace(')', '').split(',')
        result = Number.parseFloat(base) ** Number.parseFloat(exponent)
        break
      }
    }

    currentInput.value = Number.isFinite(result) ? result.toString() : 'Error'
    equation.value = ''
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (error) {
    currentInput.value = 'Error'
  }
}

// 主计算函数
function calculate() {
  if (currentInput.value === 'Error')
    return

  try {
    let expression = equation.value + currentInput.value

    // 替换数学符号和常量
    expression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**')
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString())
      .replace(/sqrt\((.*?)\)/g, (_, n) => `Math.sqrt(${n})`)
      .replace(/(sin|cos|tan)\((.*?)\)/g, (_, fn, arg) => {
        let value = Number.parseFloat(arg)
        if (angleMode.value === 'DEG') {
          value = (value * Math.PI) / 180
        }
        return `Math.${fn}(${value})`
      })
      .replace(/log\((.*?)\)/g, 'Math.log10($1)')
      .replace(/ln\((.*?)\)/g, 'Math.log($1)')
      .replace(/pow\((\w+),(\w+)\)/g, 'Math.pow($1,$2)')

    // eslint-disable-next-line no-eval
    const result = eval(expression)
    currentInput.value = Number.isFinite(result) ? result.toString() : 'Error'
    equation.value = ''
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (error) {
    currentInput.value = 'Error'
  }
}

// 阶乘计算函数
function factorial(n) {
  if (n === 0)
    return 1
  if (n > 170)
    return Infinity // 防止数值过大
  return n * factorial(n - 1)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="max-w-xs w-full rounded-2xl bg-white p-6 shadow-xl">
      <!-- 显示区域 -->
      <div class="mb-4 rounded-lg bg-gray-50 p-4 text-right">
        <div class="flex justify-between text-sm text-gray-500">
          <span>{{ angleMode }}</span>
          <span class="max-w-[200px] overflow-hidden truncate">{{ equation || '0' }}</span>
        </div>
        <div class="overflow-hidden truncate text-3xl font-semibold">
          {{ currentInput || '0' }}
        </div>
      </div>

      <!-- 按钮区域 -->
      <div class="grid grid-cols-4 gap-2">
        <!-- 科学功能第一行 -->
        <button class="rounded-lg bg-purple-400 p-2 text-xs text-white transition-colors hover:bg-purple-500" @click="toggleAngleMode">
          {{ angleMode }}
        </button>
        <button class="rounded-lg bg-indigo-400 p-2 text-xs text-white transition-colors hover:bg-indigo-500" @click="appendFunction('sin')">
          sin
        </button>
        <button class="rounded-lg bg-indigo-400 p-2 text-xs text-white transition-colors hover:bg-indigo-500" @click="appendFunction('cos')">
          cos
        </button>
        <button class="rounded-lg bg-indigo-400 p-2 text-xs text-white transition-colors hover:bg-indigo-500" @click="appendFunction('tan')">
          tan
        </button>

        <!-- 科学功能第二行 -->
        <button class="rounded-lg bg-cyan-400 p-2 text-xs text-white transition-colors hover:bg-cyan-500" @click="appendConstant('π')">
          π
        </button>
        <button class="rounded-lg bg-cyan-400 p-2 text-xs text-white transition-colors hover:bg-cyan-500" @click="appendFunction('log')">
          log
        </button>
        <button class="rounded-lg bg-cyan-400 p-2 text-xs text-white transition-colors hover:bg-cyan-500" @click="appendFunction('ln')">
          ln
        </button>
        <button class="rounded-lg bg-cyan-400 p-2 text-xs text-white transition-colors hover:bg-cyan-500" @click="appendFunction('sqrt')">
          √
        </button>

        <!-- 基础功能行 -->
        <button class="col-span-2 rounded-lg bg-red-400 p-3 text-white transition-colors hover:bg-red-500" @click="clear">
          C
        </button>
        <button class="rounded-lg bg-blue-400 p-3 text-white transition-colors hover:bg-blue-500" @click="del">
          ⌫
        </button>
        <button class="rounded-lg bg-orange-400 p-3 text-white transition-colors hover:bg-orange-500" @click="appendOperator('/')">
          ÷
        </button>

        <!-- 数字7-9行 -->
        <button class="rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendNumber(7)">
          7
        </button>
        <button class="rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendNumber(8)">
          8
        </button>
        <button class="rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendNumber(9)">
          9
        </button>
        <button class="rounded-lg bg-orange-400 p-3 text-white transition-colors hover:bg-orange-500" @click="appendOperator('*')">
          ×
        </button>

        <!-- 数字4-6行 -->
        <button class="rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendNumber(4)">
          4
        </button>
        <button class="rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendNumber(5)">
          5
        </button>
        <button class="rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendNumber(6)">
          6
        </button>
        <button class="rounded-lg bg-orange-400 p-3 text-white transition-colors hover:bg-orange-500" @click="appendOperator('-')">
          −
        </button>

        <!-- 数字1-3行 -->
        <button class="rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendNumber(1)">
          1
        </button>
        <button class="rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendNumber(2)">
          2
        </button>
        <button class="rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendNumber(3)">
          3
        </button>
        <button class="rounded-lg bg-orange-400 p-3 text-white transition-colors hover:bg-orange-500" @click="appendOperator('+')">
          +
        </button>

        <!-- 底部行 -->
        <button class="col-span-2 rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendNumber(0)">
          0
        </button>
        <button class="rounded-lg bg-gray-200 p-3 transition-colors hover:bg-gray-300" @click="appendDecimal">
          .
        </button>
        <button class="rounded-lg bg-green-500 p-3 text-white transition-colors hover:bg-green-600" @click="calculate">
          =
        </button>

        <!-- 扩展科学功能 -->
        <button class="rounded-lg bg-amber-400 p-2 text-xs text-white transition-colors hover:bg-amber-500" @click="appendPower">
          x^y
        </button>
        <button class="rounded-lg bg-amber-400 p-2 text-xs text-white transition-colors hover:bg-amber-500" @click="appendSquare">
          x²
        </button>
        <button class="rounded-lg bg-amber-400 p-2 text-xs text-white transition-colors hover:bg-amber-500" @click="appendFactorial">
          x!
        </button>
        <button class="rounded-lg bg-amber-400 p-2 text-xs text-white transition-colors hover:bg-amber-500" @click="appendConstant('e')">
          e
        </button>
      </div>
    </div>
  </div>
</template>

  <style>
  button {
  user-select: none;
  touch-action: manipulation;
  min-height: 3rem;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
