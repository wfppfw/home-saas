<script setup>
import { computed, nextTick, ref } from 'vue'

definePageMeta({
  layout: 'clean',
})

const auth = useAuthStore()

const userData = ref(null)
// 用户数据
const user = ref({
  // avatar: 'https://avatars.githubusercontent.com/u/20296635?v=4',
  avatar: 'https://avatars.githubusercontent.com/u/20296635?v=4',
  nickname: '',
  email: '',
  github: '',
  githubDisplay: 'github.com/example',
})

async function loadUserData() {
  try {
    // 从 auth store 获取最新数据
    const freshData = auth.getUserInfo()

    // 更新响应式数据
    userData.value = freshData
    user.value = {
      avatar: JSON.parse(freshData?.info).avatar || user.value.avatar,
      nickname: freshData?.username || '',
      email: freshData?.email || '',
      github: freshData?.githubUrl || '',
      githubDisplay: freshData?.githubDisplay || 'github.com/example',
    }

    // 如果需要实时性高的数据，可以在这里添加 API 请求
    // const { data } = await useFetch('/api/userinfo')
    // auth.updateUser(data.value)
  }
  catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

const tabs = [
  { id: 'profile', label: '个人信息', icon: 'user' },
  { id: 'account', label: '账号设置', icon: 'settings' },
  { id: 'notify', label: '信息通知', icon: 'notification' },
  { id: 'privacy', label: '隐私设置', icon: 'user-profile' },
]
const activeTab = ref('profile')
const showDeleteConfirm = ref(false)
const showModal = ref(false)

function openModal() {
  showModal.value = true
}
async function handleConfirm() {
  // 处理确认逻辑
  showModal.value = false
  // 确定修改头像
  try {
    const { data, error: apiError } = await useFetch('/api/updateUser', {
      method: 'POST',
      body: {
        id: JSON.parse(localStorage.getItem('moon_user'))?.id,
        info: { avatar: user.value.avatar },
        username: JSON.parse(localStorage.getItem('moon_user'))?.username,
      },
    })

    if (apiError.value)
      throw apiError.value
    if (data.value.statusCode === 200) {
      // 安全获取并合并数据的函数
      function updateMoonUser(partialData) {
        try {
          // 1. 安全获取旧数据（处理空值）
          const oldData = JSON.parse(
            localStorage.getItem('moon_user') || '{}', // 空值处理
          ) || {} // 双重保障

          // 2. 合并数据（新数据覆盖旧数据）
          const newData = { ...oldData, ...partialData }

          // 3. 安全存储
          localStorage.setItem('moon_user', JSON.stringify(newData))

          return true
        }
        catch (error) {
          console.error('更新moon_user失败:', error)
          return false
        }
      }
      updateMoonUser(data.value.user)
      await loadUserData()
    }
  }
  catch (err) {
    console.log(err)
  }
}

// 编辑状态
const isEditingName = ref(false)
const isEditingEmail = ref(false)
const editName = ref(user.value.nickname)
const editEmail = ref(user.value.email)
const nameError = ref('')
const emailError = ref('')
const nameInput = ref(null)
const emailInput = ref(null)

const isEditing = computed(() => isEditingName.value || isEditingEmail.value)

const headImgList = [
  ['baimao.svg', '白猫'],
  ['bianmu.svg', '边牧'],
  ['buoumao.svg', '布偶猫'],
  ['cangao.svg', '藏獒'],
  ['cangshu.svg', '仓鼠'],
  ['chaiquan.svg', '柴犬'],
  ['fadou.svg', '法斗'],
  ['hashiqi.svg', '哈士奇'],
  ['heimao.svg', '黑猫'],
  ['helanzhu.svg', '荷兰猪'],
  ['jinmao.svg', '金毛'],
  ['jumao.svg', '橘猫'],
  ['kedaya.svg', '可达鸭'],
  ['keji.svg', '柯基'],
  ['lachangquan.svg', '腊肠犬'],
  ['lanmao.svg', '蓝猫'],
  ['nainiumao.svg', '奶牛猫'],
  ['sanhuamao.svg', '三花猫'],
  ['tianyuanquan.svg', '田园犬'],
  ['wumaomao.svg', '无毛猫'],
  ['xianluomao.svg', '暹罗猫'],
  ['yang.svg', '小羊'],
]
// 校验规则
const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

function validateName(value) {
  if (!value.trim())
    return '昵称不能为空'
  if (value.length > 7)
    return '昵称不能超过7个字'
  return ''
}

function validateEmail(value) {
  if (!value.trim())
    return '邮箱不能为空'
  if (!emailRegex.test(value))
    return '邮箱格式不正确'
  return ''
}

// 编辑切换逻辑
async function toggleEdit(type) {
  if (type === 'name') {
    isEditingName.value = !isEditingName.value
    await nextTick()
    if (isEditingName.value) {
      nameInput.value.focus()
      nameInput.value.setSelectionRange(editName.value.length, editName.value.length)
    }
  }
  else if (type === 'email') {
    isEditingEmail.value = !isEditingEmail.value
    await nextTick()
    if (isEditingEmail.value) {
      emailInput.value.focus()
      emailInput.value.setSelectionRange(editEmail.value.length, editEmail.value.length)
    }
  }
}

function cancelEdit() {
  editName.value = user.value.nickname
  editEmail.value = user.value.email
  isEditingName.value = false
  isEditingEmail.value = false
  nameError.value = ''
  emailError.value = ''
}

function saveName() {
  nameError.value = validateName(editName.value)
  if (!nameError.value) {
    user.value.nickname = editName.value.trim()
    isEditingName.value = false
  }
}

function saveEmail() {
  emailError.value = validateEmail(editEmail.value)
  if (!emailError.value) {
    user.value.email = editEmail.value.trim()
    isEditingEmail.value = false
  }
}

function saveChanges() {
  saveName()
  saveEmail()
  if (!nameError.value && !emailError.value) {
    // 这里添加实际保存逻辑
    console.log('保存修改:', user.value)
  }
}

// GitHub 解绑
function unbindGithub() {
  user.value.github = null
  user.value.githubDisplay = ''
}

// 退出登录
function logout() {
  console.log('执行退出登录操作')
}

// 删除账号
function deleteAccount() {
  console.log('执行删除账号操作')
  showDeleteConfirm.value = false
}

onMounted(async () => {
  // userData = auth.getUserInfo()
  await loadUserData()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Modal
      v-model:show="showModal"
      title="头像选择"
      width="700px"
      @close="handleConfirm"
    >
      <!-- 添加头像选择列表 -->

      <div class="avatar-grid max-h-96 overflow-y-auto p-4">
        <div class="grid grid-cols-6 gap-8">
          <!-- 改为5列，间距增大 -->
          <!-- `https://unavatar.io/github/${n}?fallback=https://source.boringavatars.com/beam/64` -->
          <!-- 预置头像 -->
          <div
            v-for="n in headImgList"
            :key="n[0]"
            class="flex flex-col items-center gap-2"
          >
            <div class="group relative h-20 w-20 flex items-center justify-center overflow-hidden rounded-full transition-all">
              <div
                :class="{
                  '!border-blue-500 border-4 scale-110': user.avatar === `./image/${n[0]}`,
                  'group-hover:border-blue-500': user.avatar !== `./image/${n[0]}`,
                }" class="h-full w-full flex items-center justify-center rounded-full"
              >
                <img
                  :src="`./image/${n[0]}`"
                  class="cursor-my-pointer h-12 w-12 object-cover transition-all duration-300 hover:scale-125"
                  @click="user.avatar = `./image/${n[0]}`"
                >
              </div>
            </div>
            <span class="text-center text-xs text-[#666]">{{ n[1] }}</span>
          </div>

          <!-- 自定义上传 -->
          <div class="flex flex-col items-center gap-2">
            <div class="h-20 w-20 flex items-center justify-center">
              <label class="...">
                <!-- 保持原有上传样式 -->
                <input
                  type="file"
                  class="absolute h-full w-full opacity-0"
                  accept="image/*"
                  @change="handleUpload"
                >
                <div class="i-carbon-add transform text-3xl text-gray-400 transition-colors duration-300 group-hover:scale-125 group-hover:text-blue-600" />

              </label>
            </div>
            <span class="text-center text-xs text-[#666]">上传头像</span>
          </div>
        </div>
      </div>

      <!-- 添加头像选择列表 -->
      <template #footer>
        <button
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          @click="handleConfirm"
        >
          确认
        </button>
      </template>
    </Modal>

    <!-- 返回按钮 -->
    <div class="w-full border-b border-gray-200 bg-white p-4">
      <button
        class="cursor-my-pointer flex items-center gap-2 border-none text-gray-600 transition-colors hover:text-blue-600"
        @click="$router.back()"
      >
        <div class="i-carbon-arrow-left text-lg" />
        <span class="text-sm">返回</span>
      </button>
    </div>

    <div class="flex flex-1">
      <!-- 左侧导航 -->
      <div class="ml-8 w-64 bg-gray-50 pt-8 shadow-lg">
        <!-- 增加左边距 -->
        <ul class="px-4 space-y-2">
          <li
            v-for="tab in tabs"
            :key="tab.id"
            class="cursor-my-pointer rounded-lg p-3 text-gray-700 transition-colors"
            :class="{
              'bg-blue-100 text-blue-700 font-semibold': activeTab === tab.id,
              'hover:bg-gray-200': activeTab !== tab.id,
            }"
            @click="activeTab = tab.id"
          >
            <div class="flex items-center gap-2">
              <div :class="`i-carbon-${tab.icon} text-lg`" />
              <span class="text-sm font-medium">{{ tab.label }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- 右侧内容 -->
      <div class="max-w-3xl flex-1 p-8">
        <!-- 个人信息 -->
        <div v-show="activeTab === 'profile'" class="rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div class="flex flex-col items-center gap-8 md:flex-row">
            <!-- 头像部分 -->
            <div class="group cursor-my-pointer relative">
              <!-- 外层容器添加装饰效果 -->
              <div class="relative h-28 w-28 overflow-hidden border-4 border-white rounded-full shadow-lg">
                <!-- 图片容器用于控制缩放 -->
                <div class="h-full w-full transition-transform duration-300 group-hover:scale-140">
                  <img
                    :src="user.avatar"
                    alt="用户头像"
                    class="absolute left-1/2 top-1/2 h-15 w-15 object-cover -translate-x-1/2 -translate-y-1/2"
                  >
                </div>
              </div>

              <div class="absolute bottom-0 right-0 translate-x-[-5px] translate-y-[-5px] rounded-full bg-blue-500 p-1 text-white transition-colors hover:bg-blue-600" @click="openModal">
                <div class="i-carbon-renew text-xs" />
              </div>
            </div>

            <!-- 个人信息表单 -->
            <div class="flex-1 space-y-7">
              <!-- 昵称 -->
              <div class="group relative">
                <div class="flex items-start gap-2">
                  <div class="i-carbon-user mt-1 text-xl text-gray-500" />
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <input
                        v-if="isEditingName"
                        ref="nameInput"
                        v-model="editName"
                        class="pr-7 text-lg text-gray-800 font-semibold"
                        :class="{ 'border-b-2 border-red-500': nameError }"
                        @blur="saveName"
                      >
                      <h1 v-else class="text-lg text-gray-800 font-semibold">
                        {{ user.nickname }}
                      </h1>
                      <button
                        class="i-carbon-edit ml-2 text-gray-500 opacity-0 transition-opacity hover:text-blue-600 group-hover:opacity-100"
                        @click="toggleEdit('name')"
                      />
                    </div>
                    <transition name="fade">
                      <p v-if="nameError" class="mt-1 text-sm text-red-500">
                        {{ nameError }}
                      </p>
                    </transition>
                  </div>
                </div>
              </div>

              <!-- 邮箱 -->
              <div class="group relative">
                <div class="flex items-start gap-2">
                  <div class="i-carbon-email mt-1 text-xl text-gray-500" />
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <input
                        v-if="isEditingEmail"
                        ref="emailInput"
                        v-model="editEmail"
                        class="flex-1 pr-7 text-gray-600"
                        :class="{ 'border-b-2 border-red-500': emailError }"
                        @blur="saveEmail"
                      >
                      <span v-else class="text-gray-600">
                        {{ user.email }}
                      </span>
                      <button
                        class="i-carbon-edit ml-2 text-gray-500 opacity-0 transition-opacity hover:text-blue-600 group-hover:opacity-100"
                        @click="toggleEdit('email')"
                      />
                    </div>
                    <transition name="fade">
                      <p v-if="emailError" class="mt-1 text-sm text-red-500">
                        {{ emailError }}
                      </p>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 保存/取消按钮 -->
          <div v-if="isEditing" class="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-8">
            <button
              class="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-all duration-300 hover:bg-gray-300"
              @click="cancelEdit"
            >
              取消
            </button>
            <button
              class="rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-600"
              @click="saveChanges"
            >
              保存
            </button>
          </div>
        </div>

        <!-- 账号设置 -->
        <div v-show="activeTab === 'account'" class="rounded-2xl bg-white p-8 shadow-lg">
          <h2 class="mb-6 flex items-center gap-2 text-xl text-gray-700 font-bold">
            <div class="i-carbon-settings text-blue-500" />
            账号设置
          </h2>

          <div class="space-y-6">
            <!-- GitHub 绑定 -->
            <div class="flex items-center gap-3">
              <div class="i-carbon-logo-github text-xl text-gray-500" />
              <div class="flex-1">
                <template v-if="user.github">
                  <div class="flex items-center gap-2">
                    <a
                      :href="user.github"
                      target="_blank"
                      class="text-blue-600 transition-colors hover:text-blue-800"
                    >
                      {{ user.githubDisplay }}
                    </a>
                    <button
                      class="text-sm text-red-500 transition-colors hover:text-red-700"
                      @click="unbindGithub"
                    >
                      解绑
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-400">未绑定</span>
                    <a
                      href="/bind-github"
                      class="text-sm text-blue-600 transition-colors hover:text-blue-800"
                    >
                      立即绑定
                    </a>
                  </div>
                </template>
              </div>
            </div>

            <!-- 退出账号 -->
            <div class="border-t border-gray-200 pt-8">
              <button
                class="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
                @click="logout"
              >
                退出账号
              </button>
            </div>

            <!-- 删除账号 -->
            <div class="border-t border-gray-200 pt-4">
              <button
                class="border border-red-500 rounded-md px-4 py-2 text-red-500 transition-colors hover:bg-red-50"
                @click="showDeleteConfirm = true"
              >
                删除账号
              </button>
            </div>
          </div>
        </div>

        <!-- 其他选项卡内容保持不变... -->

        <div v-show="activeTab === 'notify'" class="rounded-2xl bg-white p-8 shadow-lg">
          <h2 class="mb-6 flex items-center gap-2 text-xl text-gray-700 font-bold">
            <div class="i-carbon-notification text-blue-500" />
            信息通知
          </h2>
          <p class="text-gray-500">
            通知偏好设置...
          </p>
        </div>

        <div v-show="activeTab === 'privacy'" class="rounded-2xl bg-white p-8 shadow-lg">
          <h2 class="mb-6 flex items-center gap-2 text-xl text-gray-700 font-bold">
            <div class="i-carbon-user-profile text-blue-500" />
            隐私设置
          </h2>
          <p class="text-gray-500">
            隐私管理设置...
          </p>
        </div>
      </div>
    </div>
    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="max-w-md rounded-lg bg-white p-6">
        <h3 class="mb-4 text-lg font-bold">
          确认删除账号？
        </h3>
        <p class="mb-6 text-gray-600">
          此操作将永久删除您的账号和所有数据！
        </p>
        <div class="flex justify-end gap-4">
          <button
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            @click="showDeleteConfirm = false"
          >
            取消
          </button>
          <button
            class="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            @click="deleteAccount"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 输入框样式 */
input {
  @apply bg-transparent outline-none border-b-2 border-gray-200 focus:border-blue-500 transition-colors duration-300;

  &.error {
    @apply border-red-500;
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* 强制显示编辑按钮 */
.group:hover .i-carbon-edit {
  @apply opacity-100;
}

.avatar-grid {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f5f9;
}

.avatar-grid::-webkit-scrollbar {
  @apply w-2;
}

.avatar-grid::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

.avatar-grid::-webkit-scrollbar-thumb {
  @apply rounded-full bg-blue-500 hover:bg-blue-600;
}
/* 头像悬停动画 */
.avatar-item {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 优化选中状态 */
!border-blue-500 {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
