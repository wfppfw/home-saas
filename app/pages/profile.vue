<!-- pages/profile.vue -->
<script setup>
import { validateEmail, validatePhone, validateURL } from '@/utils/validators'

const { $toast } = useNuxtApp()

// 用户数据
const originalUser = {
  avatar: '',
  nickname: '开发者',
  email: 'dev@example.com',
  phone: '',
  github: 'https://github.com/',
}

const user = ref({ ...originalUser })
const isDirty = ref(false)
const isLoading = ref(false)

// 验证规则
const requiredRule = value => !!value?.trim() || '必填项'
const emailRule = value => validateEmail(value) || '邮箱格式不正确'
const phoneRule = value => !value || validatePhone(value) || '手机格式不正确'
const urlRule = value => validateURL(value) || 'URL格式不正确'

// 数据变化监听
watch(() => ({ ...user.value }), (newVal) => {
  isDirty.value = Object.keys(originalUser).some(
    key => originalUser[key] !== newVal[key],
  )
}, { deep: true })

// 保存处理
async function handleSaveAll() {
  if (!isDirty.value)
    return

  try {
    isLoading.value = true
    // 模拟API调用
    await $fetch('/api/user', {
      method: 'POST',
      body: user.value,
    })

    originalUser = { ...user.value }
    isDirty.value = false
    $toast.success('保存成功')
  }
  catch (error) {
    $toast.error(`保存失败: ${error.message}`)
  }
  finally {
    isLoading.value = false
  }
}

// 头像处理
const showAvatarSelector = ref(false)
const presetAvatars = [
  '/avatars/01.png',
  // ...其他预设头像
]

function handleAvatarUpdate(newAvatar) {
  user.value.avatar = newAvatar
}

function triggerFileUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png, image/jpeg'
  input.onchange = handleFileUpload
  input.click()
}

async function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file)
    return

  try {
    const avatarUrl = await uploadAvatar(file)
    handleAvatarUpdate(avatarUrl)
  }
  catch (error) {
    $toast.error(error.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 transition-colors duration-300 dark:bg-gray-900">
    <div class="mx-auto max-w-2xl px-4 py-8 container">
      <!-- 头像部分 -->
      <AvatarSection
        :avatar="user.avatar"
        @update:avatar="handleAvatarUpdate"
      />

      <!-- 个人信息卡片 -->
      <div class="animate-slide-up rounded-xl bg-white p-6 shadow-lg space-y-6 dark:bg-gray-800">
        <InfoItem
          v-model="user.nickname"
          label="昵称"
          icon="i-mdi-account"
          :rules="[requiredRule]"
        />

        <InfoItem
          v-model="user.email"
          label="邮箱"
          icon="i-mdi-email"
          :rules="[requiredRule, emailRule]"
          type="email"
        />

        <InfoItem
          v-model="user.phone"
          label="手机"
          icon="i-mdi-phone"
          :rules="[phoneRule]"
        />

        <InfoItem
          v-model="user.github"
          label="GitHub"
          icon="i-mdi-github"
          :rules="[urlRule]"
          is-link
        />

        <SaveSection
          :is-dirty="isDirty"
          :is-loading="isLoading"
          @save="handleSaveAll"
        />
      </div>
    </div>

    <AvatarSelectorModal
      v-if="showAvatarSelector"
      :preset-avatars="presetAvatars"
      @close="showAvatarSelector = false"
      @select="handlePresetSelect"
      @upload="triggerFileUpload"
    />
  </div>
</template>
