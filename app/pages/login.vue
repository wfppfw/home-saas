<script setup>
import { computed, ref } from 'vue'

const tabs = ['登录', '注册']
const activeTab = ref('登录')

const showModal = ref(false)

const modalContent = [
  {
    title: '用户协议',
    content: `<!-- 章节标题：添加下边距 -->
<h2 style="margin-bottom: 1em !important;font-size: 1.5em; color:#003366 !important; font-weight: bold;">第一章 总则</h2>

<ol>
  <li>
    <!-- 条款编号：添加上边距 -->
    <h3 style="margin-top: 1em !important; font-size: 1.17em; font-weight: bold;"><button class="citation-flag" data-index="2"><button class="citation-flag" data-index="6"> 1.1</h3>
    <!-- 段落首行缩进 -->
    <p style="text-indent: 2em !important;"><button class="citation-flag" data-index="1"><button class="citation-flag" data-index="5"> 本协议由三体人月球基地党分支（以下简称“平台方”）与用户共同缔结，具有法律效力。用户注册、登录或使用本平台服务，即表示完全接受本协议所有条款。</p>
  </li>
  <li>
    <h3 style="margin-top: 1em !important; font-size: 1.17em; font-weight: bold;">1.2</h3>
    <p style="text-indent: 2em !important;">本协议内容包括协议正文及所有平台已经发布的或将来可能发布的各类规则（如隐私政策、服务条款等）。</p>
  </li>
</ol>

<br />
<!-- 第二章结构 -->
<h2 style=" color:#003366 !important;margin-bottom: 1em !important;font-size: 1.5em; font-weight: bold;">第二章 用户权利与义务</h2>

<!-- 条款标题：统一上边距 -->
<h3 style="margin-top: 1em !important; font-size: 1.17em; font-weight: bold;">2.1 用户应保证：</h3>

<!-- 列表项缩进：通过padding-left实现 -->
<ul>
  <li style="padding-left: 20px !important;"><button class="citation-flag" data-index="8"> 提供真实、准确的注册信息，并及时更新；</li>
  <li style="padding-left: 20px !important;">不得利用平台从事违法活动（如散布谣言、侵犯他人隐私等）；</li>
  <li style="padding-left: 20px !important;">未成年人用户需在监护人同意后注册，且监护人需对未成年人行为负责。</li>
</ul>

<h3 style="margin-top: 1em !important; font-size: 1.17em; font-weight: bold;">2.2 平台方有权：</h3>
<ul>
  <li style="padding-left: 20px !important;">根据法律法规或政策调整，修订本协议及隐私政策，并通过站内通知、邮件等方式告知用户；</li>
  <li style="padding-left: 20px !important;">对违反协议的用户采取警告、限制功能、终止服务等措施。</li>
</ul>


<br />

<!-- 其他章节统一应用相同样式 -->
<h2 style=" color:#003366 !important;margin-bottom: 1em !important;font-size: 1.5em; font-weight: bold;">第三章 服务内容</h2>
<h3 style="margin-top: 1em !important; font-size: 1.17em; font-weight: bold;">3.1 本平台提供的服务包括但不限于：</h3>
<ul>
  <li style="padding-left: 20px !important;">内容发布与分享；</li>
  <li style="padding-left: 20px !important;">在线交易与支付；</li>
  <li style="padding-left: 20px !important;">个性化推荐服务。</li>
</ul>

<h3 style="margin-top: 1em !important; font-size: 1.17em; font-weight: bold;">3.2 平台方保留随时变更、中断或终止部分或全部服务的权利，且不承担由此产生的责任。</h3>


<br />
<h2 style=" color:#003366 !important;margin-bottom: 1em !important;font-size: 1.5em; font-weight: bold;">第四章 知识产权</h2>
<h3 style="margin-top: 1em !important; font-size: 1.17em; font-weight: bold;">4.1 平台内容（包括但不限于文字、图片、音频、视频等）的知识产权归平台方或其合作方所有，用户不得擅自复制、传播或商用。</h3>

<h3 style="margin-top: 1em !important; font-size: 1.17em; font-weight: bold;">4.2 用户在平台发布的内容，授权平台方在法律允许范围内进行使用。</h3>


<br />
<h2 style=" color:#003366 !important;margin-bottom: 1em !important;font-size: 1.5em; font-weight: bold;">第五章 责任限制</h2>
<h3 style="margin-top: 1em !important; font-size: 1.17em; font-weight: bold;">5.1 平台方对因不可抗力（如自然灾害、黑客攻击等）导致的服务中断不承担责任。</h3>

<h3 style="margin-top: 1em !important; font-size: 1.17em; font-weight: bold;">5.2 用户因使用第三方链接或服务产生的风险，由用户自行承担。</h3>`,
  },
  {
    title: '隐私政策',
    content: `<!-- 章节标题：设置字体大小、颜色和间距 -->
<h2 style=" color:#003366 !important;font-size:1.5em !important; font-weight:bold !important; color:#003366 !important; margin-bottom:1em !important;"><button class="citation-flag" data-index="6"><button class="citation-flag" data-index="7"><button class="citation-flag" data-index="9"> 第一章 个人信息收集与使用</h2>
<ol>
  <li>
    <!-- 子标题：统一样式与间距 -->
    <h3 style="font-size:1.17em !important; font-weight:bold !important; color:#333 !important; margin-top:1em !important;"><button class="citation-flag" data-index="6"><button class="citation-flag" data-index="9"> 1.1 信息收集范围：</h3>
    <ul>
      <!-- 列表项缩进 -->
      <li style="padding-left:20px !important;"><button class="citation-flag" data-index="8"> 必要信息 ：注册时需提供网络昵称、用来填写导致浪费宝贵的30秒时间等；</li>
      <li style="padding-left:20px !important;">可选信息 ：用户主动提供的头像、邮箱等；</li>
      <li style="padding-left:20px !important;">自动收集信息 ：通过Cookie或同类技术记录设备型号、浏览记录等。</li>
    </ul>
  </li>
  <li>
    <h3 style="font-size:1.17em !important; font-weight:bold !important; color:#333 !important; margin-top:1em !important;">1.2 信息使用目的：</h3>
    <ul>
      <li style="padding-left:20px !important;">提供并优化服务功能；</li>
      <li style="padding-left:20px !important;">遵守法律法规要求（如配合司法机关调查）；</li>
      <li style="padding-left:20px !important;">在获得用户同意后，向合作方共享脱敏数据。</li>
    </ul>
  </li>
</ol>
<br />
<!-- 第二章结构 -->
<h2 style=" color:#003366 !important;font-size:1.5em !important; font-weight:bold !important; color:#003366 !important; margin-bottom:1em !important;">第二章 数据共享与披露</h2>
<ol>
  <li>
    <h3 style="font-size:1.17em !important; font-weight:bold !important; color:#333 !important; margin-top:1em !important;">2.1 平台方仅在以下情形共享用户信息：</h3>
    <ul>
      <li style="padding-left:20px !important;">获得用户明确同意；</li>
      <li style="padding-left:20px !important;">根据法律法规或司法机关要求；</li>
      <li style="padding-left:20px !important;">为保护用户或公众权益所必需（如紧急安全事件）。</li>
    </ul>
  </li>
  <li>
    <h3 style="font-size:1.17em !important; font-weight:bold !important; color:#333 !important; margin-top:1em !important;">2.2 第三方合作：</h3>
    <!-- 段落首行缩进 -->
    <p style="text-indent:2em !important;"><button class="citation-flag" data-index="1"><button class="citation-flag" data-index="5"> 平台可能委托第三方处理数据（如云存储服务），要求其遵守保密义务。</p>
  </li>
</ol>
<br />
<!-- 后续章节统一应用相同样式 -->
<h2 style=" color:#003366 !important;font-size:1.5em !important; font-weight:bold !important; color:#003366 !important; margin-bottom:1em !important;">第三章 数据存储与安全</h2>
<ol>
  <li>
    <h3 style="font-size:1.17em !important; font-weight:bold !important; color:#333 !important; margin-top:1em !important;">3.1 用户信息存储于中国境内服务器，并采用加密技术、防火墙等措施保障安全9。</h3>
  </li>
  <li>
    <h3 style="font-size:1.17em !important; font-weight:bold !important; color:#333 !important; margin-top:1em !important;">3.2 个人信息保存期限：</h3>
    <p style="text-indent:2em !important;">除非法律法规另有要求，信息仅在实现目的所必需的最短时间内保留。</p>
  </li>
</ol>
<br />
<h2 style=" color:#003366 !important;font-size:1.5em !important; font-weight:bold !important; color:#003366 !important; margin-bottom:1em !important;">第四章 用户权利</h2>
<ol>
  <li>
    <h3 style="font-size:1.17em !important; font-weight:bold !important; color:#333 !important; margin-top:1em !important;">4.1 用户可行使以下权利：</h3>
    <ul>
      <li style="padding-left:20px !important;">访问与更正 ：通过平台“账户设置”修改个人信息；</li>
      <li style="padding-left:20px !important;">删除权 ：在符合法定条件时，要求删除个人信息；</li>
      <li style="padding-left:20px !important;">撤回同意 ：通过关闭功能或联系客服终止信息处理。</li>
    </ul>
  </li>
  <li>
    <h3 style="font-size:1.17em !important; font-weight:bold !important; color:#333 !important; margin-top:1em !important;">4.2 用户可通过以下方式联系平台：</h3>
    <ul>
      <li style="padding-left:20px !important;">客服邮箱：wfppfw12138@163.com；</li>
      <li style="padding-left:20px !important;">电话：110-119-120。</li>
    </ul>
  </li>
</ol>
<br />
<h2 style="font-size:1.5em !important; font-weight:bold !important; color:#003366 !important; margin-bottom:1em !important;">第五章 变更与生效</h2>
<ol>
  <li>
    <h3 style="font-size:1.17em !important; font-weight:bold !important; color:#333 !important; margin-top:1em !important;">5.1 本政策更新后，平台将通过显著通知方式告知用户，用户继续使用服务视为接受更新内容。</h3>
  </li>
  <li>
    <h3 style="font-size:1.17em !important; font-weight:bold !important; color:#333 !important; margin-top:1em !important;">5.2 本政策自发布之日起生效，解释权归平台方所有。</h3>
  </li>
</ol>
<br />
<h2 style="font-size:1.5em !important; font-weight:bold !important; color:#003366 !important; margin-bottom:1em !important;">附则</h2>
<ul>
  <!-- 附则列表项缩进 -->
  <li style="padding-left:20px !important;">未成年人保护 ：平台严格遵守《未成年人网络保护条例》，限制未成年人使用高风险功能，并要求监护人同意。</li>
  <li style="padding-left:20px !important;">争议解决 ：因本协议产生的争议，双方应协商解决；协商不成，提交平台方所在地有管辖权的法院诉讼。</li>
</ul>`,
  },
]

const modalVal = ref(['test', 'test'])

function openModal(num) {
  if (num === 0) {
    modalVal.value[0] = modalContent[0].title
    modalVal.value[1] = modalContent[0].content
  }
  if (num === 1) {
    modalVal.value[0] = modalContent[1].title
    modalVal.value[1] = modalContent[1].content
  }
  showModal.value = true
}
function handleConfirm() {
  // 处理确认逻辑
  showModal.value = false
}
definePageMeta({
  layout: 'clean',
  pageTransition: {
    name: 'slide-bottom', // 自定义过渡名称
    mode: 'out-in', // 过渡模式
    duration: 400, // 过渡持续时间(ms)
    css: true, // 启用CSS过渡
  },
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
const errors = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

// 校验用户名
function validateUsername() {
  if (registerForm.value.username.length > 6) {
    errors.username = '用户名不能超过6个字符'
    return false
  }
  errors.username = ''
  return true
}

// 校验密码
function validatePassword() {
  if (registerForm.value.password.length < 6) {
    errors.password = '密码不能少于6位'
    return false
  }
  errors.password = ''
  return true
}

// 校验确认密码
function validateConfirmPassword() {
  if (registerForm.value.confirmPassword !== registerForm.value.password) {
    errors.confirmPassword = '两次输入的密码不一致'
    return false
  }
  errors.confirmPassword = ''
  return true
}

// 提交时整体校验
function handleRegister() {
  const validUsername = validateUsername()
  const validPassword = validatePassword()
  const validConfirm = validateConfirmPassword()

  if (validUsername && validPassword && validConfirm) {
    // 执行注册逻辑
    // eslint-disable-next-line no-console
    console.log('校验通过，提交表单')
  }
}

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

// async function handleRegister() {
//   try {
//     isRegistering.value = true
//     // 添加注册逻辑
//     console.warn('注册表单提交:', registerForm.value)
//     await new Promise(resolve => setTimeout(resolve, 1000))
//   }
//   finally {
//     isRegistering.value = false
//   }
// }

// 第三方登录处理
// function handleWechatLogin() {
//   console.warn('微信登录')
// }

// function handleAlipayLogin() {
//   console.warn('支付宝登录')
// }

// function handleQQLogin() {
//   console.warn('QQ登录')
// }

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
              @input="validateUsername"
              @blur="validateUsername"
            >

            <!-- 注册密码输入框 -->
            <div>
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
              <div v-if="errors.password" class="mt-1 text-xs text-red-500">
                {{ errors.password }}
              </div>
            </div>

            <!-- 确认密码输入框 -->
            <div>
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

              <div v-if="errors.confirmPassword" class="mt-1 text-xs text-red-500">
                {{ errors.confirmPassword }}
              </div>
            </div>

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
                <Icon name="simple-icons:github" class="size-5 h-6 w-6 text-gray-800" color="" />
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
          注册即代表同意<a style="color: #0000EE;" @click="openModal(0)">《用户协议》</a>和<a style="color: #0000EE;" @click="openModal(1)">《隐私政策》</a><br>
          © {{ new Date().getFullYear() }} on the Moon. All rights reserved.
        </p>
      </div>
    </div>

    <Modal
      v-model:show="showModal"
      :title="modalVal[0]"
      width="600px"
      @close="handleConfirm"
    >
      <SimpleTextArea
        width="800px"
        height="500px"
        :content="modalVal[1]"
      />

      <template #footer>
        <button
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          @click="handleConfirm"
        >
          确认
        </button>
      </template>
    </Modal>
  </div>
</template>

<style>
/* 自定义进入/离开动画 */
.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: absolute;
  width: 100%;
  backface-visibility: hidden;
}

.slide-bottom-enter-from {
  opacity: 0;
  transform: translateY(20%);
}

.slide-bottom-leave-to {
  opacity: 0;
  transform: translateY(-10%);
}
</style>
