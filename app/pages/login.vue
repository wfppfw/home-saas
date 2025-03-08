<script setup>
import { computed, ref } from 'vue'

const tabs = ['登录', '注册']
const activeTab = ref('登录')

definePageMeta({
  layout: 'clean',
})

const router = useRouter()

function goBack() {
  router.go(-1) // -1 表示返回上一页
}

const imgLeft = ref('/image/22_open.png')
const imgRight = ref('/image/33_open.png')

// 登录表单相关
const loginForm = ref({
  username: '',
  password: '',
  captcha: '',
})
const isLoggingIn = ref(false)
const loginCaptchaCooldown = ref(0)

// 注册表单相关
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  captcha: '',
})
const isRegistering = ref(false)
const registerCaptchaCooldown = ref(0)

// 添加密码可见性状态
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)

// 焦点状态跟踪
const passwordFocusStates = ref({
  login: false,
  register: false,
  confirm: false,
})

// 处理获得焦点事件
function handlePasswordFocus(type) {
  passwordFocusStates.value[type] = true

  imgLeft.value = '/image/22_close.png'
  imgRight.value = '/image/33_close.png'
//   console.log(`${type}密码框获得焦点`)
  // 这里可以添加相关逻辑，例如：
  // - 显示密码强度提示
  // - 高亮输入框
  // - 触发动画效果
}

// 处理失去焦点事件
function handlePasswordBlur(type) {
  passwordFocusStates.value[type] = false

  imgLeft.value = '/image/22_open.png'
  imgRight.value = '/image/33_open.png'
//   console.log(`${type}密码框失去焦点`)
  // 这里可以添加相关逻辑，例如：
  // - 隐藏密码强度提示
  // - 触发即时验证
  // - 自动隐藏密码（安全考虑）
  // - 保存输入历史
}

// 验证码倒计时计算
const loginCaptchaText = computed(() =>
  loginCaptchaCooldown.value > 0
    ? `${loginCaptchaCooldown.value}s后重获`
    : '获取验证码',
)

const registerCaptchaText = computed(() =>
  registerCaptchaCooldown.value > 0
    ? `${registerCaptchaCooldown.value}s后重获`
    : '获取验证码',
)

// 验证码相关方法
function startCooldown(type) {
  const duration = 60
  if (type === 'login') {
    loginCaptchaCooldown.value = duration
    const timer = setInterval(() => {
      if (loginCaptchaCooldown.value <= 0) {
        clearInterval(timer)
      }
      else {
        loginCaptchaCooldown.value--
      }
    }, 1000)
  }
  else {
    registerCaptchaCooldown.value = duration
    const timer = setInterval(() => {
      if (registerCaptchaCooldown.value <= 0) {
        clearInterval(timer)
      }
      else {
        registerCaptchaCooldown.value--
      }
    }, 1000)
  }
}

function getLoginCaptcha() {
  // 这里添加获取登录验证码的逻辑
  startCooldown('login')
}

function getRegisterCaptcha() {
  // 这里添加获取注册验证码的逻辑
  startCooldown('register')
}

// 表单提交处理
async function handleLogin() {
  try {
    isLoggingIn.value = true
    // 添加登录逻辑
    console.warn('登录表单提交:', loginForm.value)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  finally {
    isLoggingIn.value = false
  }
}

async function handleRegister() {
  try {
    isRegistering.value = true
    // 添加注册逻辑
    console.warn('注册表单提交:', registerForm.value)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  finally {
    isRegistering.value = false
  }
}

// 第三方登录处理
function handleWechatLogin() {
  console.warn('微信登录')
}

function handleAlipayLogin() {
  console.warn('支付宝登录')
}

function handleQQLogin() {
  console.warn('QQ登录')
}

function handleGithubLogin() {
  console.warn('支付宝登录')
}
</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center bg-white p-4">
    <button class="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full p-2 text-(base) font-medium ring ring-(inset) transition-colors aria-disabled:cursor-not-allowed disabled:cursor-not-allowed aria-disabled:opacity-75 disabled:opacity-75 focus:outline-hidden focus-visible:ring-(2)" @click="goBack">
      <Icon name="ph:arrow-left-bold" class="size-6 shrink-0 text-black" />
    <!----><!---->
    </button>

    <!-- 装饰图片 -->
    <img :src="imgLeft" class="absolute bottom-0 left-0 hidden w-20 opacity-50 md:block md:w-32" title="22 from Bilibili！(◕‿◕✿)">
    <img :src="imgRight" class="absolute bottom-0 right-0 hidden w-20 opacity-50 md:block md:w-32" title="33 from Bilibili！(◕‿◕✿)">

    <!-- 卡片容器 -->
    <div class="mx-[10rem] max-w-3xl w-full flex flex-col rounded-xl bg-white shadow-xl md:mx-auto">
      <!-- 第一行：响应式布局 -->
      <div class="flex flex-col md:flex-row">
        <!-- 左侧二维码（仅PC显示） -->
        <div class="hidden items-center justify-center border-r bg-gray-50 p-8 md:w-1/2 md:flex">
          <div class="aspect-square max-w-48 w-full flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-200">
            <!-- <span class="text-center text-sm text-gray-500">微信扫一扫<br>快速登录</span> -->
            <img src="/image/login_qrcode.png" class="h-32 w-32 animate-pulse rounded bg-gray-300">
            <span class="text-xs text-gray-400">扫码登录 (●´ω｀●)</span>
          </div>
        </div>

        <!-- 右侧表单 -->
        <div class="w-full flex flex-col p-6 md:w-1/2 md:p-8">
          <!-- Tab切换 -->
          <div class="mb-6 flex gap-2 md:mb-8">
            <button
              v-for="tab in tabs"
              :key="tab"
              class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors" :class="[
                activeTab === tab
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100',
              ]"
              @click="activeTab = tab"
            >
              {{ tab }}
            </button>
          </div>

          <!-- 登录表单 -->
          <form v-if="activeTab === '登录'" class="space-y-4" @submit.prevent="handleLogin">
            <input
              v-model="loginForm.username"
              type="text"
              placeholder="昵称"
              required
              class="w-full border rounded-lg px-4 py-2.5 text-sm text-black outline-none focus:ring-1 focus:ring-blue-500"
            >

            <div class="relative">
              <input
                v-model="loginForm.password"
                :type="showLoginPassword ? 'text' : 'password'"
                placeholder="密码"
                required
                class="w-full border rounded-lg px-4 py-2.5 pr-10 text-sm text-black outline-none focus:ring-1 focus:ring-blue-500"
                @focus="handlePasswordFocus('login')"
                @blur="handlePasswordBlur('login')"
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 rounded-full p-1.5 transition-colors -translate-y-1/2 hover:bg-gray-100"
                @click="showLoginPassword = !showLoginPassword"
              >
                <div
                  class="h-5 w-5 transition-opacity" :class="[
                    showLoginPassword
                      ? 'i-ph-eye-slash-light text-gray-400'
                      : 'i-ph-eye-light text-gray-400',
                  ]"
                />
              </button>
            </div>

            <div class="flex gap-3">
              <input
                v-model="loginForm.captcha"
                type="text"
                placeholder="验证码"
                required
                class="flex-1 border rounded-lg px-4 py-2.5 text-sm text-black outline-none focus:ring-1 focus:ring-blue-500"
              >
              <button
                type="button"
                :disabled="loginCaptchaCooldown > 0"
                class="whitespace-nowrap rounded-lg bg-gray-100 px-4 py-2.5 text-sm transition-colors hover:bg-gray-200 disabled:opacity-50"
                @click="getLoginCaptcha"
              >
                {{ loginCaptchaText }}
              </button>
            </div>
            <button
              type="submit"
              :disabled="isLoggingIn"
              class="w-full rounded-lg bg-blue-600 py-2.5 text-sm text-white font-medium transition-colors hover:bg-blue-700 disabled:opacity-75"
            >
              <span v-if="isLoggingIn">登录中...</span>
              <span v-else>立即登录</span>
            </button>
          </form>

          <!-- 注册表单 -->
          <form v-else class="space-y-4" @submit.prevent="handleRegister">
            <input
              v-model="registerForm.username"
              type="text"
              placeholder="用户昵称"
              required
              class="w-full border rounded-lg px-4 py-2.5 text-sm text-black outline-none focus:ring-1 focus:ring-blue-500"
            >

            <!-- 注册密码输入框 -->
            <div class="relative">
              <input
                v-model="registerForm.password"
                :type="showRegisterPassword ? 'text' : 'password'"
                placeholder="密码"
                required
                class="w-full border rounded-lg px-4 py-2.5 pr-10 text-sm text-black outline-none focus:ring-1 focus:ring-blue-500"
                @focus="handlePasswordFocus('login')"
                @blur="handlePasswordBlur('login')"
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 rounded-full p-1.5 transition-colors -translate-y-1/2 hover:bg-gray-100"
                @click="showRegisterPassword = !showRegisterPassword"
              >
                <div
                  class="h-5 w-5 transition-opacity" :class="[
                    showRegisterPassword
                      ? 'i-ph-eye-slash-light text-gray-400'
                      : 'i-ph-eye-light text-gray-400',
                  ]"
                />
              </button>
            </div>

            <!-- 确认密码输入框 -->
            <div class="relative">
              <input
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="确认密码"
                class="w-full border rounded-lg px-4 py-2.5 pr-10 text-sm text-black outline-none focus:ring-1 focus:ring-blue-500"
                @focus="handlePasswordFocus('login')"
                @blur="handlePasswordBlur('login')"
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 rounded-full p-1.5 transition-colors -translate-y-1/2 hover:bg-gray-100"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <div
                  class="h-5 w-5 transition-opacity" :class="[
                    showConfirmPassword
                      ? 'i-ph-eye-slash-light text-gray-400'
                      : 'i-ph-eye-light text-gray-400',
                  ]"
                />
              </button>
            </div>

            <!-- <input
              v-model="registerForm.email"
              type="email"
              placeholder="邮箱（选填）"
              class="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            > -->
            <div class="flex gap-3">
              <input
                v-model="registerForm.captcha"
                type="text"
                placeholder="验证码"
                required
                class="flex-1 border rounded-lg px-4 py-2.5 text-sm text-black outline-none focus:ring-1 focus:ring-blue-500"
              >
              <button
                type="button"
                :disabled="registerCaptchaCooldown > 0"
                class="whitespace-nowrap rounded-lg bg-gray-100 px-4 py-2.5 text-sm transition-colors hover:bg-gray-200 disabled:opacity-50"
                @click="getRegisterCaptcha"
              >
                {{ registerCaptchaText }}
              </button>
            </div>
            <button
              type="submit"
              :disabled="isRegistering"
              class="w-full rounded-lg bg-blue-600 py-2.5 text-sm text-white font-medium transition-colors hover:bg-blue-700 disabled:opacity-75"
            >
              <span v-if="isRegistering">注册中...</span>
              <span v-else>立即注册</span>
            </button>
          </form>

          <!-- 第三方登录 -->
          <div class="mt-6 border-t border-gray-100 pt-6">
            <p class="mb-4 text-center text-sm text-gray-500">
              其他登录方式
            </p>
            <div class="flex justify-center gap-4">
              <!-- <button
                class="rounded-full p-2.5 transition-colors hover:bg-gray-100"
                @click="handleWechatLogin"
              >
                <div class="i-logos-wechat h-6 w-6 text-green-600" />
              </button> -->
              <button

                @click="handleGithubLogin"
              >
                <Icon name="simple-icons:github" class="size-5 h-6 w-6" color="current" />
              </button>
              <!-- <button
                class="rounded-full p-2.5 transition-colors hover:bg-gray-100"
                @click="handleQQLogin"
              >
                <div class="i-logos-qq h-6 w-6 text-blue-400" />
              </button> -->
            </div>
          </div>
        </div>
      </div>

      <!-- 底部说明 -->
      <div class="border-t bg-gray-50 p-4">
        <p class="text-center text-xs text-gray-500 leading-5">
          注册即代表同意《用户协议》和《隐私政策》<br>
          © {{ new Date().getFullYear() }} on the Moon. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>
