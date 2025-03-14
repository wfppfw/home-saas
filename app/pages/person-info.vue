<script setup>
import { reactive, ref } from 'vue'

// 校验规则
const validate = {
  nickname: value => value.trim().length >= 2 || '昵称至少2个字符',
  email: (value) => {
    const pattern = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    return pattern.test(value) ? true : '请输入有效的邮箱地址'
  },
  phone: (value) => {
    const pattern = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
    return value ? pattern.test(value) || '请输入有效的手机号码' : true
  },
  password: (newPwd, confirmPwd) => {
    if (newPwd.length < 8)
      return '密码长度至少8位'
    if (newPwd !== confirmPwd)
      return '两次输入的密码不一致'
    return true
  },
}

// 用户数据
const userInfo = ref({
  avatar: '/default-avatar.png',
  nickname: '用户昵称',
  email: 'user@example.com',
  phone: '',
  githubId: '123456',
})

// 编辑状态
const editStates = reactive({
  nickname: false,
  email: false,
  phone: false,
})

// 加载状态
const loadingStates = reactive({
  nickname: false,
  email: false,
  phone: false,
})

// 错误信息
const errors = reactive({
  nickname: '',
  email: '',
  phone: '',
})

// 密码修改相关状态
const isPasswordModalOpen = ref(false)
const isUpdatingPassword = ref(false)
const password = reactive({
  old: '',
  new: '',
  confirm: '',
})
const passwordError = ref('')

// 字段验证方法
function validateField(field) {
  let result
  if (field === 'nickname') {
    result = validate.nickname(userInfo.value[field])
  }
  else if (field === 'email') {
    result = validate.email(userInfo.value[field])
  }
  else if (field === 'phone') {
    result = validate.phone(userInfo.value[field])
  }

  if (typeof result === 'string') {
    errors[field] = result
    return false
  }
  errors[field] = ''
  return true
}

// 处理编辑/保存操作
async function handleEdit(field) {
  if (!editStates[field]) {
    editStates[field] = true
    return
  }

  // 执行验证
  if (!validateField(field))
    return

  try {
    loadingStates[field] = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    editStates[field] = false
    console.warn(`成功保存 ${field}:`, userInfo.value[field])
  }
  catch (error) {
    console.error('保存失败:', error)
    errors[field] = '保存失败，请重试'
  }
  finally {
    loadingStates[field] = false
  }
}

// 密码修改逻辑
async function updatePassword() {
  const result = validate.password(password.new, password.confirm)
  if (typeof result === 'string') {
    passwordError.value = result
    return
  }

  try {
    isUpdatingPassword.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    closePasswordModal()
    console.warn('密码修改成功')
  }
  catch (error) {
    passwordError.value = '密码修改失败，请重试'
  }
  finally {
    isUpdatingPassword.value = false
  }
}

// 关闭密码弹窗
function closePasswordModal() {
  isPasswordModalOpen.value = false
  password.old = ''
  password.new = ''
  password.confirm = ''
  passwordError.value = ''
}

// 头像上传处理
function handleAvatarUpload(e) {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userInfo.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
  else {
    console.error('请选择有效的图片文件')
  }
}

// GitHub绑定相关方法
function bindGithub() {
  // 实现OAuth绑定逻辑
  console.warn('跳转GitHub授权...')
  // 这里通常需要跳转到OAuth授权页面
}

function unbindGithub() {
  // 实现解绑逻辑
//   if (confirm('确定要解绑GitHub账号吗？')) {
//     userInfo.value.githubId = null
//     console.warn('已解绑GitHub账号')
//   }
}
</script>

<template>
  <div class="mx-auto max-w-3xl p-6">
    <h1 class="mb-8 text-2xl font-bold">
      个人资料设置
    </h1>

    <div class="grid gap-8 md:grid-cols-2">
      <!-- 左侧区块 -->
      <div class="space-y-6">
        <!-- 头像上传 -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-lg font-semibold">
            头像设置
          </h2>
          <div class="flex items-center gap-6">
            <img
              :src="userInfo.avatar"
              class="h-20 w-20 border-2 border-gray-200 rounded-full object-cover"
              alt="用户头像"
            >
            <div class="space-y-2">
              <input
                ref="avatarInput"
                type="file"
                class="hidden"
                accept="image/*"
                @change="handleAvatarUpload"
              >
              <button
                class="rounded-md bg-gray-100 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-200"
                @click="$refs.avatarInput.click()"
              >
                更换头像
              </button>
              <p class="text-sm text-gray-500">
                支持 JPG/PNG 格式
              </p>
            </div>
          </div>
        </div>

        <!-- 社交账号绑定 -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-lg font-semibold">
            账号绑定
          </h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
                <span v-if="userInfo.githubId" class="text-sm text-gray-500">已绑定</span>
              </div>
              <button
                v-if="!userInfo.githubId"
                class="rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
                @click="bindGithub"
              >
                绑定账号
              </button>
              <button
                v-else
                class="border border-red-500 rounded-md px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
                @click="unbindGithub"
              >
                解绑
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧区块 -->
      <div class="rounded-lg bg-white p-6 shadow space-y-6">
        <!-- 昵称 -->
        <div class="space-y-2">
          <label class="text-sm font-medium">昵称</label>
          <div class="flex gap-2">
            <input
              v-if="editStates.nickname"
              v-model="userInfo.nickname"
              class="flex-1 border rounded p-2"
              :class="{ 'border-red-500': errors.nickname }"
              @keyup.enter="handleEdit('nickname')"
            >
            <span v-else class="flex-1 p-2">{{ userInfo.nickname }}</span>
            <button
              class="rounded-md px-4 py-2 transition-colors"
              :class="editStates.nickname
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'"
              @click="handleEdit('nickname')"
            >
              <span v-if="loadingStates.nickname" class="mr-2 inline-block animate-spin">↻</span>
              {{ editStates.nickname ? '保存' : '修改' }}
            </button>
          </div>
          <p v-if="errors.nickname" class="flex items-center gap-1 text-sm text-red-500">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8" />
            </svg>
            {{ errors.nickname }}
          </p>
        </div>

        <!-- 邮箱 -->
        <div class="space-y-2">
          <label class="text-sm font-medium">邮箱</label>
          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <input
                v-if="editStates.email"
                v-model="userInfo.email"
                type="email"
                class="flex-1 border rounded p-2"
                :class="{ 'border-red-500': errors.email }"
                @input="validateField('email')"
                @keyup.enter="handleEdit('email')"
              >
              <span v-else class="flex-1 p-2">{{ userInfo.email }}</span>
              <button
                class="rounded-md px-4 py-2 transition-colors"
                :class="editStates.email
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'"
                @click="handleEdit('email')"
              >
                <span v-if="loadingStates.email" class="mr-2 inline-block animate-spin">↻</span>
                {{ editStates.email ? '保存' : '修改' }}
              </button>
            </div>
            <p v-if="errors.email" class="flex items-center gap-1 text-sm text-red-500">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8" />
              </svg>
              {{ errors.email }}
            </p>
          </div>
        </div>

        <!-- 手机号 -->
        <div class="space-y-2">
          <label class="text-sm font-medium">手机号</label>
          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <input
                v-if="editStates.phone"
                v-model="userInfo.phone"
                type="tel"
                class="flex-1 border rounded p-2"
                :class="{ 'border-red-500': errors.phone }"
                @input="validateField('phone')"
                @keyup.enter="handleEdit('phone')"
              >
              <span v-else class="flex-1 p-2">{{ userInfo.phone || '未绑定' }}</span>
              <button
                class="rounded-md px-4 py-2 transition-colors"
                :class="editStates.phone
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'"
                @click="handleEdit('phone')"
              >
                <span v-if="loadingStates.phone" class="mr-2 inline-block animate-spin">↻</span>
                {{ editStates.phone ? '保存' : '修改' }}
              </button>
            </div>
            <p v-if="errors.phone" class="flex items-center gap-1 text-sm text-red-500">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8" />
              </svg>
              {{ errors.phone }}
            </p>
          </div>
        </div>

        <!-- 修改密码 -->
        <div class="border-t pt-4">
          <button
            class="border border-blue-500 rounded-md px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50"
            @click="isPasswordModalOpen = true"
          >
            修改密码
          </button>

          <!-- 自定义模态框 -->
          <div v-show="isPasswordModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div class="max-w-md w-full rounded-lg bg-white p-6">
              <h3 class="mb-4 text-lg font-semibold">
                修改密码
              </h3>
              <div class="space-y-3">
                <input
                  v-model="password.old"
                  type="password"
                  placeholder="原密码"
                  class="w-full border rounded p-2"
                >
                <input
                  v-model="password.new"
                  type="password"
                  placeholder="新密码（至少8位字符）"
                  class="w-full border rounded p-2"
                >
                <input
                  v-model="password.confirm"
                  type="password"
                  placeholder="确认新密码"
                  class="w-full border rounded p-2"
                >
                <p v-if="passwordError" class="text-sm text-red-500">
                  {{ passwordError }}
                </p>
              </div>
              <div class="mt-6 flex justify-end gap-2">
                <button
                  class="rounded-md px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
                  @click="closePasswordModal"
                >
                  取消
                </button>
                <button
                  class="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                  @click="updatePassword"
                >
                  <span v-if="isUpdatingPassword" class="mr-2 inline-block animate-spin">↻</span>
                  确认修改
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 可选的动画样式 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
