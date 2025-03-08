<!-- pages/login.vue -->
<script setup>
// 表单字段组件
// eslint-disable-next-line unused-imports/no-unused-vars
const FormField = defineProps({
  label: String,
  type: { type: String, default: 'text' },
  required: Boolean,
  modelValue: String,
})

definePageMeta({
  layout: 'clean',
})

const { data: users, refresh } = useFetch('/api/users')

console.warn(users, refresh)
const { $message } = useNuxtApp()
onMounted(() => {
  $message.success('测试消息')
})
// 验证码组件
// eslint-disable-next-line unused-imports/no-unused-vars
const CaptchaField = {
  props: {
    label: String,
    modelValue: String,
    captchaText: String,
    required: Boolean,
  },
  emits: ['update:modelValue', 'refreshCaptcha'],
  template: `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
        <div class="flex gap-3">
          <input
            :type="'text'"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="flex-1 input-field"
            required
          />
          <div 
            class="captcha-code bg-gray-100 rounded-md px-4 py-2 cursor-pointer"
            @click="$emit('refreshCaptcha')"
            v-html="captchaText"
          />
        </div>
      </div>
    `,
}

const activeTab = ref('login')
const captchaText = ref('')

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  captcha: '',
})

// 注册表单数据
const registerForm = reactive({
  username: '',
  password: '',
  captcha: '',
})

// 生成验证码（实际项目应连接后端）
function generateCaptcha() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaText.value = code.split('').join('<span class="mx-1">$&</span>')
}

// 表单提交处理
// eslint-disable-next-line unused-imports/no-unused-vars
async function handleLogin() {
  if (loginForm.captcha.toUpperCase() !== captchaText.value.replace(/<[^>]+>/g, '')) {
    $message.success('验证码错误')
    return
  }
  // 调用登录API
  $message.success('登录成功（模拟）')
}

// eslint-disable-next-line unused-imports/no-unused-vars
async function handleRegister() {
  if (registerForm.captcha.toUpperCase() !== captchaText.value.replace(/<[^>]+>/g, '')) {
    $message.success('验证码错误')
    return
  }
  // 调用注册API
  $message.success('注册成功（模拟）')
}

// 初始化验证码
onMounted(generateCaptcha)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="max-w-md w-full rounded-xl bg-white p-8 shadow-lg transition-all">
      <!-- 切换标签 -->
      <div class="mb-8 flex gap-4">
        <button
          class="px-4 pb-2 text-lg font-medium"
          :class="activeTab === 'login'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'login'"
        >
          登录
        </button>
        <button
          class="px-4 pb-2 text-lg font-medium"
          :class="activeTab === 'register'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'register'"
        >
          注册
        </button>
      </div>
    </div>
  </div>
</template>

  <style>
  /* 自定义样式 */
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md
           focus:ring-2 focus:ring-primary-500 focus:border-primary-500
           transition-all placeholder-gray-400;
}

.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded-md
           hover:bg-primary-700 focus:ring-2 focus:ring-primary-500
           focus:ring-offset-2 transition-all;
}

.captcha-code {
  @apply select-none font-mono tracking-wider
           hover:bg-gray-200 transition-colors;
}
</style>
