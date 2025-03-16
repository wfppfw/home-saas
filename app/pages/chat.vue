<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

definePageMeta({
  layout: 'clean',
})

const isSidebarCollapsed = ref(false)
const mobileView = ref(false)
const sidebar = ref(null)
const inputText = ref('')
const chatMessages = ref([])
const currentSummary = ref('当前对话摘要')
const inputRef = ref(null)
const chatContainer = ref(null)
const chatHistory = ref([
  { id: 1, title: '对话历史1' },
  { id: 2, title: '对话历史2' },
])

const aiActions = ['复制', '重新生成', '点赞', '踩']
const actionIcons = [
  'mdi:content-copy',
  'mdi:reload',
  'mdi:thumb-up-outline',
  'mdi:thumb-down-outline',
]

const textareaStyle = computed(() => ({
  minHeight: '4rem',
  maxHeight: window?.innerWidth >= 768 ? '645px' : '425px',
  paddingBottom: '3rem',
}))

// 响应式处理
function checkMobile() {
  mobileView.value = window?.innerWidth < 768
  if (mobileView.value) {
    isSidebarCollapsed.value = true
  }
  else {
    isSidebarCollapsed.value = false
  }
}

// 自动聚焦输入框
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  nextTick(() => {
    inputRef.value?.focus()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function adjustTextareaHeight() {
  nextTick(() => {
    const textarea = inputRef.value
    textarea.style.height = 'auto'
    const newHeight = Math.min(
      textarea.scrollHeight,
      Number.parseInt(textareaStyle.value.maxHeight),
    )
    textarea.style.height = `${newHeight}px`

    chatContainer.value?.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  })
}

const beforeText = [

  {
    content: '从现在开始，你是一只小猫咪，你的名字叫做kitty，每次回答，只有开头和结尾(打招呼和总结)会像猫一样,其他地方保持正常学术性和专业性',
    role: 'user',
  },
  {
    content: '喵~ 你好呀！我是Kitty，一只小猫咪，但我会尽力用专业和学术的方式回答你的问题哦。有什么我可以帮你的吗？喵~',
    role: 'assistant',
  },
]

function startNewChat() {
  chatMessages.value = []
  currentSummary.value = '新对话'
}

const currentType = ref('deepseek-chat')
function changeType() {
  // eslint-disable-next-line no-console
  console.log(currentType.value)
  if (currentType.value === 'deepseek-chat') {
    currentType.value = 'deepseek-reasoner'
  }
  else {
    currentType.value = 'deepseek-chat'
  }
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return '早上好'
  }
  else if (hour >= 12 && hour < 14) {
    return '中午好'
  }
  else if (hour >= 14 && hour < 18) {
    return '下午好'
  }
  else {
    return '晚上好'
  }
}
async function sendMessage() {
  const content = inputText.value.trim()
  if (!content)
    return

  chatMessages.value.push({
    role: 'user',
    content,
  })

  inputText.value = ''

  nextTick(() => {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  })

  const data = await useFetch('/api/chat', {
    method: 'POST',
    body: {
      messages: [...beforeText, ...(chatMessages.value.map((i) => {
        return { role: i.role, content: i.content }
      }))],
      model: currentType.value,
    },
  })

  const assistantMessage = data.data.value.data.choices[0].message
  chatMessages.value.push({ ...assistantMessage })

  nextTick(() => {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  })
}
</script>

<template>
  <div class="h-screen flex bg-[#111]">
    <!-- 左侧侧边栏 -->
    <aside
      ref="sidebar"
      class="h-full border-r border-[#020618] bg-[#0a0a0a] transition-all duration-300"
      :class="[isSidebarCollapsed ? 'w-16' : 'w-64', mobileView ? 'absolute z-30' : 'relative']"
    >
      <div class="h-full flex flex-col">
        <!-- 顶部区域 -->
        <div class="border-b border-[#020618] p-4">
          <div v-if="!isSidebarCollapsed" class="flex items-center justify-between">
            <span class="text-white font-bold">Kitty</span>
            <Icon
              name="mdi:chevron-left"
              class="cursor-pointer text-gray-400 hover:text-white"
              @click="toggleSidebar"
            />
          </div>
          <div v-else class="flex flex-col items-center gap-4">
            <!-- <Icon name="mdi:robot" class="text-2xl text-white" /> -->
            <svg t="1742138985408" class="icon cursor-my-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4540" width="40" height="40" @click="toggleSidebar">
              <path fill="currentColor" d="M284.596383 360.521108c-38.522776 0-69.866443 31.341192-69.866443 69.866443 0 38.530197 31.356035 69.866443 69.866443 69.866443 38.517828 0 69.866443-31.336244 69.866443-69.866443C354.462824 391.8623 323.12658 360.521108 284.596383 360.521108zM284.596383 460.190008c-16.418935 0-29.790089-13.358785-29.790089-29.785141 0-16.438726 13.371154-29.795037 29.790089-29.795037s29.790089 13.356311 29.790089 29.795037C314.386472 446.831225 301.027687 460.190008 284.596383 460.190008zM605.78114 360.521108c-38.522776 0-69.87139 31.341192-69.87139 69.866443 0 38.530197 31.360983 69.866443 69.87139 69.866443 38.537619 0 69.898602-31.336244 69.898602-69.866443C675.677268 391.8623 644.318759 360.521108 605.78114 360.521108zM605.78114 460.190008c-16.411514 0-29.795037-13.358785-29.795037-29.785141 0-16.438726 13.383522-29.795037 29.795037-29.795037 16.438726 0 29.824723 13.356311 29.824723 29.795037C635.60339 446.831225 622.244605 460.190008 605.78114 460.190008zM873.661874 687.643103c0-116.068045 64.379445-156.901396 67.001725-158.50445 9.524318-5.635428 12.653738-17.92551 7.01831-27.449828-5.647797-9.541635-17.950248-12.668581-27.462197-7.033153-3.53513 2.102772-86.636664 52.915629-86.636664 192.987431 0 79.368496 27.108436 130.39163 48.883256 171.393203 15.614935 29.352218 27.929755 52.559395 27.929755 79.084003 0 19.006581-4.136275 32.729021-11.948691 39.734962-7.958372 7.122211-18.355959 6.065878-18.551393 6.065878-0.952432-0.143483-1.929602-0.207803-2.896878-0.207803l-73.757807 0c8.584256-13.437947 13.645751-29.327479 13.645751-46.431671L816.88704 33.903778c0-8.994914-6.001557-16.888966-14.677346-19.308391-8.648576-2.439216-17.873559 1.244346-22.529342 8.942964l-97.870412 161.999998c-30.030053-0.57146-118.272244-1.25919-382.427362-1.25919-56.089577 0-83.85111 0.039582-97.87536 0.138535L111.347793 10.817821c-4.264916-8.205757-13.62596-12.438513-22.53429-10.234313-8.982545 2.191831-15.298282 10.234313-15.298282 19.464243l0 917.209186c0 47.695808 38.792425 86.508024 86.500602 86.508024L466.223899 1023.76496l264.167487 0 145.511795 0c1.316087 0.116271 3.181369 0.235016 5.504314 0.235016 9.798916 0 27.422616-2.179461 42.946017-15.577827 17.324365-14.976682 26.118898-38.626678 26.118898-70.329052 0-36.516484-15.837581-66.33626-32.602856-97.895151C897.143648 801.229878 873.661874 757.019723 873.661874 687.643103zM466.223899 983.700976 160.015824 983.700976c-25.596915 0-46.424249-20.834755-46.424249-46.429197L113.591574 102.125111l58.014232 111.689333c3.671192 7.109841 11.461342 11.226327 19.053585 10.768665 4.020005-0.103902 34.505246-0.227594 108.723187-0.227594 154.031732 0 375.982985 0.482401 391.536073 1.24682 7.589768 0.808949 15.236435-2.820188 19.308391-9.556479l66.583645-110.22234 0 831.460633c0 25.596915-20.819912 46.431671-46.416827 46.431671L466.223899 983.715819 466.223899 983.700976zM480.260517 540.694001l-70.133617 0c-11.058104 0-20.040651 8.962754-20.040651 20.038177 0 11.077895 8.982545 20.040651 20.040651 20.040651l15.204276 0-1.481836 25.505382c-0.658044 11.050683 7.787677 20.520577 18.830938 21.173673 0.390868 0.012369 0.789158 0.027212 1.175078 0.027212 10.541071 0 19.372711-8.23297 19.986226-18.877942l1.617897-27.840696 14.798564 0c11.063052 0 20.038177-8.96028 20.038177-20.038177S491.323571 540.694001 480.260517 540.694001z" p-id="4541" />
            </svg>
            <svg viewBox="0 0 30 30" style="margin-top:20px;" fill="#ABB2BD" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="default_pointer_cs" @click="startNewChat"><defs><clipPath id="clip1325_20400"><rect id="新建会话0730" width="30.000000" height="30.000000" fill="white" fill-opacity="0" /></clipPath></defs><g clip-path="url(#clip1325_20400)"><path id="path" d="M10.51 26.52C10.35 26.52 10.19 26.49 10.04 26.43C9.89 26.37 9.76 26.28 9.64 26.17C9.53 26.06 9.44 25.93 9.37 25.78C9.31 25.63 9.28 25.48 9.28 25.32L9.25 22.87C8.89 22.82 8.53 22.74 8.19 22.62C7.84 22.5 7.51 22.36 7.19 22.19C6.86 22.01 6.56 21.81 6.28 21.58C5.99 21.36 5.73 21.11 5.49 20.83C5.25 20.56 5.04 20.27 4.85 19.96C4.67 19.65 4.51 19.33 4.38 18.99C4.25 18.65 4.16 18.3 4.09 17.95C4.03 17.6 4 17.24 4 16.88L4 10.38C4 9.99 4.03 9.6 4.11 9.21C4.19 8.82 4.31 8.45 4.46 8.08C4.61 7.72 4.8 7.37 5.03 7.04C5.25 6.72 5.5 6.41 5.78 6.13C6.07 5.86 6.38 5.61 6.71 5.39C7.04 5.17 7.4 4.98 7.77 4.83C8.14 4.68 8.52 4.57 8.91 4.49C9.31 4.41 9.7 4.38 10.11 4.38L14.35 4.38C14.5 4.38 14.63 4.4 14.77 4.46C14.9 4.51 15.02 4.59 15.12 4.69C15.22 4.79 15.3 4.9 15.35 5.03C15.41 5.16 15.43 5.3 15.43 5.44C15.43 5.58 15.41 5.71 15.35 5.84C15.3 5.97 15.22 6.09 15.12 6.19C15.02 6.29 14.9 6.37 14.77 6.42C14.63 6.47 14.5 6.5 14.35 6.5L10.11 6.5C9.85 6.5 9.59 6.53 9.34 6.58C9.08 6.62 8.83 6.7 8.6 6.8C8.36 6.89 8.13 7.01 7.91 7.15C7.7 7.3 7.5 7.46 7.31 7.64C7.13 7.82 6.97 8.01 6.82 8.22C6.68 8.44 6.56 8.66 6.46 8.9C6.36 9.13 6.28 9.37 6.23 9.62C6.18 9.87 6.16 10.12 6.16 10.38L6.16 16.88C6.16 17.14 6.18 17.39 6.23 17.65C6.29 17.9 6.36 18.15 6.46 18.39C6.56 18.62 6.69 18.85 6.83 19.07C6.98 19.28 7.15 19.48 7.33 19.66C7.52 19.85 7.72 20.01 7.94 20.15C8.16 20.3 8.39 20.42 8.63 20.52C8.87 20.62 9.13 20.69 9.38 20.74C9.64 20.79 9.9 20.82 10.17 20.82C10.33 20.82 10.49 20.85 10.64 20.91C10.79 20.97 10.92 21.06 11.04 21.17C11.15 21.28 11.24 21.41 11.31 21.56C11.37 21.71 11.4 21.86 11.41 22.02L11.42 23.53L14.15 21.56C14.85 21.07 15.62 20.82 16.48 20.82L19.87 20.82C20.13 20.82 20.38 20.79 20.64 20.74C20.89 20.69 21.14 20.62 21.38 20.52C21.62 20.42 21.85 20.3 22.06 20.16C22.28 20.02 22.48 19.86 22.66 19.68C22.84 19.5 23.01 19.3 23.15 19.09C23.29 18.88 23.42 18.66 23.52 18.42C23.61 18.19 23.69 17.94 23.74 17.69C23.79 17.44 23.82 17.19 23.82 16.94L23.82 13.58C23.82 13.44 23.84 13.3 23.9 13.17C23.95 13.04 24.03 12.93 24.13 12.83C24.23 12.73 24.35 12.65 24.48 12.6C24.62 12.54 24.75 12.52 24.9 12.52C25.04 12.52 25.18 12.54 25.31 12.6C25.44 12.65 25.56 12.73 25.66 12.83C25.76 12.93 25.84 13.04 25.9 13.17C25.95 13.3 25.98 13.44 25.98 13.58L25.98 16.94C25.98 17.33 25.94 17.72 25.86 18.11C25.78 18.5 25.67 18.87 25.51 19.24C25.36 19.6 25.17 19.95 24.95 20.27C24.73 20.6 24.47 20.9 24.19 21.18C23.9 21.46 23.6 21.71 23.26 21.93C22.93 22.15 22.58 22.33 22.21 22.48C21.83 22.63 21.45 22.75 21.06 22.83C20.67 22.9 20.27 22.94 19.87 22.94L17.19 22.94C16.33 22.94 15.56 23.19 14.86 23.69L11.24 26.29C11.02 26.44 10.78 26.52 10.51 26.52Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero" /><rect id="rect" x="17.770508" y="6.396484" rx="1.062250" width="8.060087" height="2.124500" fill="currentColor" fill-opacity="1.000000" class="default_pointer_cs" /><rect id="rect" x="20.718750" y="3.500000" rx="1.081197" width="2.162393" height="7.918844" fill="currentColor" fill-opacity="1.000000" class="default_pointer_cs" /></g>
            </svg>
          </div>
        </div>

        <!-- 对话历史列表 -->
        <div class="flex-1 overflow-y-auto p-2">
          <div
            v-for="item in chatHistory"
            :key="item.id"
            class="flex cursor-pointer items-center gap-2 rounded p-2 text-gray-300 hover:bg-[#1a1a1a]"
          >
            <Icon v-if="!isSidebarCollapsed" name="mdi:message-text-outline" class="shrink-0" />
            <span v-if="!isSidebarCollapsed" class="truncate">{{ item.title }}</span>
          </div>
        </div>

        <!-- 底部个人信息 -->
        <div class="border-t border-[#020618] p-4">
          <div class="flex items-center gap-2 text-gray-400">
            <Icon name="mdi:account-circle" class="shrink-0 text-xl" />
            <span v-if="!isSidebarCollapsed">个人信息</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 右侧主区域 -->
    <main class="relative h-full flex flex-1 flex-col bg-[#1a1a1a]">
      <!-- 移动端侧边栏遮罩 -->
      <div
        v-if="mobileView && !isSidebarCollapsed"
        class="fixed inset-0 z-20 bg-black/50"
        @click="toggleSidebar"
      />

      <!-- 顶部摘要栏 -->
      <div class="sticky top-0 z-10 border-b border-[#020618] bg-[#1a1a1a] p-4">
        <div class="text-sm text-gray-400">
          {{ currentSummary }}
        </div>
      </div>

      <!-- 对话容器 -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <div
          ref="chatContainer"
          class="flex-1 overflow-y-auto p-4"
        >
          <div class="mx-auto h-full max-w-4xl">
            <!-- 无对话时的居中输入 -->

            <div
              v-if="chatMessages.length === 0"
              class="h-full flex flex-col items-center justify-center pb-[120px]"
            >
              <div class="mb-[2rem] text-size-[2rem] font-bold">
                <h1> {{ getGreeting() }} ,  陌生人</h1>
              </div>
              <div class="max-w-2xl w-full">
                <div class="relative mb-4">
                  <textarea
                    ref="inputRef"
                    v-model="inputText"
                    class="w-full resize-none overflow-y-auto rounded-lg bg-[#2a2a2a] p-4 pr-40 text-gray-300 focus:outline-none"
                    :style="textareaStyle"
                    placeholder="有什么我能你的吗?"
                    @input="adjustTextareaHeight"
                    @keydown.enter.prevent="sendMessage"
                  />
                  <!-- 输入框按钮 -->
                  <div class="absolute bottom-3 left-3 flex gap-2">
                    <button class="flex items-center gap-1.5 border border-blue-500/20 rounded-lg bg-blue-500/10 px-3 py-1.5 text-blue-400 transition-colors hover:bg-blue-500/20">
                      <Icon name="mdi:brain" class="h-4 w-4" />
                      <span class="text-sm">深度思考</span>
                    </button>
                    <button class="flex items-center gap-1.5 border border-blue-500/20 rounded-lg bg-blue-500/10 px-3 py-1.5 text-blue-400 transition-colors hover:bg-blue-500/20">
                      <Icon name="mdi:earth" class="h-4 w-4" />
                      <span class="text-sm">联网搜索</span>
                    </button>
                  </div>
                  <div class="absolute bottom-3 right-3 flex gap-2">
                    <button class="rounded p-1.5 text-gray-400 hover:bg-[#3a3a3a] hover:text-white">
                      <Icon name="mdi:paperclip" class="h-5 w-5" />
                    </button>
                    <button
                      class="rounded-50% bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700"
                      @click="sendMessage"
                    >
                      <Icon name="ph:navigation-arrow-bold" class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 对话消息 -->
            <div
              v-else
              class="h-full"
            >
              <div
                v-for="(message, index) in chatMessages"
                :key="index"
                class="group mb-8"
                :class="message.role === 'assistant' ? 'flex gap-4' : 'flex justify-end'"
              >
                <!-- AI消息 -->
                <template v-if="message.role === 'assistant'">
                  <div class="mb-8 w-full flex gap-4">
                    <!-- <Icon name="mdi:robot" class="mt-1 shrink-0 text-2xl text-blue-400" /> -->

                    <svg t="1742138985408" class="icon cursor-my-pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4540" width="30" height="30" @click="toggleSidebar">
                      <path fill="currentColor" d="M284.596383 360.521108c-38.522776 0-69.866443 31.341192-69.866443 69.866443 0 38.530197 31.356035 69.866443 69.866443 69.866443 38.517828 0 69.866443-31.336244 69.866443-69.866443C354.462824 391.8623 323.12658 360.521108 284.596383 360.521108zM284.596383 460.190008c-16.418935 0-29.790089-13.358785-29.790089-29.785141 0-16.438726 13.371154-29.795037 29.790089-29.795037s29.790089 13.356311 29.790089 29.795037C314.386472 446.831225 301.027687 460.190008 284.596383 460.190008zM605.78114 360.521108c-38.522776 0-69.87139 31.341192-69.87139 69.866443 0 38.530197 31.360983 69.866443 69.87139 69.866443 38.537619 0 69.898602-31.336244 69.898602-69.866443C675.677268 391.8623 644.318759 360.521108 605.78114 360.521108zM605.78114 460.190008c-16.411514 0-29.795037-13.358785-29.795037-29.785141 0-16.438726 13.383522-29.795037 29.795037-29.795037 16.438726 0 29.824723 13.356311 29.824723 29.795037C635.60339 446.831225 622.244605 460.190008 605.78114 460.190008zM873.661874 687.643103c0-116.068045 64.379445-156.901396 67.001725-158.50445 9.524318-5.635428 12.653738-17.92551 7.01831-27.449828-5.647797-9.541635-17.950248-12.668581-27.462197-7.033153-3.53513 2.102772-86.636664 52.915629-86.636664 192.987431 0 79.368496 27.108436 130.39163 48.883256 171.393203 15.614935 29.352218 27.929755 52.559395 27.929755 79.084003 0 19.006581-4.136275 32.729021-11.948691 39.734962-7.958372 7.122211-18.355959 6.065878-18.551393 6.065878-0.952432-0.143483-1.929602-0.207803-2.896878-0.207803l-73.757807 0c8.584256-13.437947 13.645751-29.327479 13.645751-46.431671L816.88704 33.903778c0-8.994914-6.001557-16.888966-14.677346-19.308391-8.648576-2.439216-17.873559 1.244346-22.529342 8.942964l-97.870412 161.999998c-30.030053-0.57146-118.272244-1.25919-382.427362-1.25919-56.089577 0-83.85111 0.039582-97.87536 0.138535L111.347793 10.817821c-4.264916-8.205757-13.62596-12.438513-22.53429-10.234313-8.982545 2.191831-15.298282 10.234313-15.298282 19.464243l0 917.209186c0 47.695808 38.792425 86.508024 86.500602 86.508024L466.223899 1023.76496l264.167487 0 145.511795 0c1.316087 0.116271 3.181369 0.235016 5.504314 0.235016 9.798916 0 27.422616-2.179461 42.946017-15.577827 17.324365-14.976682 26.118898-38.626678 26.118898-70.329052 0-36.516484-15.837581-66.33626-32.602856-97.895151C897.143648 801.229878 873.661874 757.019723 873.661874 687.643103zM466.223899 983.700976 160.015824 983.700976c-25.596915 0-46.424249-20.834755-46.424249-46.429197L113.591574 102.125111l58.014232 111.689333c3.671192 7.109841 11.461342 11.226327 19.053585 10.768665 4.020005-0.103902 34.505246-0.227594 108.723187-0.227594 154.031732 0 375.982985 0.482401 391.536073 1.24682 7.589768 0.808949 15.236435-2.820188 19.308391-9.556479l66.583645-110.22234 0 831.460633c0 25.596915-20.819912 46.431671-46.416827 46.431671L466.223899 983.715819 466.223899 983.700976zM480.260517 540.694001l-70.133617 0c-11.058104 0-20.040651 8.962754-20.040651 20.038177 0 11.077895 8.982545 20.040651 20.040651 20.040651l15.204276 0-1.481836 25.505382c-0.658044 11.050683 7.787677 20.520577 18.830938 21.173673 0.390868 0.012369 0.789158 0.027212 1.175078 0.027212 10.541071 0 19.372711-8.23297 19.986226-18.877942l1.617897-27.840696 14.798564 0c11.063052 0 20.038177-8.96028 20.038177-20.038177S491.323571 540.694001 480.260517 540.694001z" p-id="4541" />
                    </svg>
                    <div class="flex-1">
                      <div class="whitespace-pre-wrap text-left text-gray-300">
                        <!-- {{ message.content }} -->
                        <ChatPane :text="message.content" />
                      </div>
                      <div class="mt-2 flex gap-3">
                        <button
                          v-for="(action, actionIndex) in aiActions"
                          :key="actionIndex"
                          class="text-gray-400 transition-colors hover:text-white"
                        >
                          <Icon :name="actionIcons[actionIndex]" class="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 用户消息 -->
                <template v-else>
                  <div class="w-full flex items-center gap-2">
                    <!-- 操作按钮 -->
                    <div class="flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button class="text-gray-400 hover:text-white">
                        <Icon name="mdi:pencil" class="h-4 w-4" />
                      </button>
                      <button class="text-gray-400 hover:text-white">
                        <Icon name="mdi:content-copy" class="h-4 w-4" />
                      </button>
                    </div>
                    <!-- 消息内容 -->
                    <div class="flex flex-1 justify-end">
                      <div class="relative mr-1 max-w-3xl rounded-lg bg-[#2a2a2a] p-2">
                        <div class="text-left text-gray-300">
                          {{ message.content }}
                        </div>
                      </div>
                      <!-- <Icon name="mdi:account-circle" class="shrink-0 text-2xl text-gray-400" /> -->
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域和底部提示语 -->
        <div class="bottom-0 w-full bg-[#1a1a1a]">
          <!-- 有对话时的输入区域 -->
          <div
            v-if="chatMessages.length > 0"
            class="pt-2"
          >
            <div class="relative mx-auto max-w-4xl px-4">
              <div class="relative">
                <textarea
                  ref="inputRef"
                  v-model="inputText"
                  class="w-full resize-none overflow-y-auto rounded-lg bg-[#2a2a2a] p-4 pr-40 text-gray-300 focus:outline-none"
                  :style="textareaStyle"
                  placeholder="输入你的问题..."
                  @input="adjustTextareaHeight"
                  @keydown.enter.prevent="sendMessage"
                />
                <!-- 输入框按钮 -->
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <button
                    :class="[
                      currentType === 'deepseek-reasoner'
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 dark:border-blue-400 dark:bg-blue-400/20 dark:text-blue-200'
                        : 'border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300',
                    ]"
                    @click="changeType"
                  >
                    <Icon name="mdi:brain" class="h-4 w-4" />
                    <span class="text-sm">深度思考</span>
                  </button>
                  <button class="flex items-center gap-1.5 border border-blue-500/20 rounded-lg bg-blue-500/10 px-3 py-1.5 text-blue-400 transition-colors hover:bg-blue-500/20">
                    <Icon name="mdi:earth" class="h-4 w-4" />
                    <span class="text-sm">联网搜索</span>
                  </button>
                </div>
                <div class="absolute bottom-3 right-3 flex gap-2">
                  <button class="rounded p-1.5 text-gray-400 hover:bg-[#3a3a3a] hover:text-white">
                    <Icon name="mdi:paperclip" class="h-5 w-5" />
                  </button>
                  <button
                    class="rounded bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700"
                    @click="sendMessage"
                  >
                    <Icon name="mdi:send" class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 固定底部提示语 -->
          <div class="mx-auto max-w-4xl py-2 text-center">
            <div class="text-xs text-gray-500">
              内容由 AI 生成，请仔细甄别
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}

@media (min-width: 1024px) {
  .max-w-4xl {
    max-width: 56rem;
  }

  [class*='mdi-account-circle'] {
    margin-right: calc((100% - 56rem) / 2 - 1.5rem);
  }

  [class*='mdi-robot'] {
    margin-left: calc((100% - 56rem) / 2 - 1.5rem);
  }
}

textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-thumb {
  background: #3a3a3a;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  aside {
    transition: transform 0.3s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  }
  aside:not(.w-16) {
    transform: translateX(-100%);
  }
  aside.w-16 {
    transform: translateX(0);
  }

  .max-w-4xl {
    padding: 0 1rem;
  }

  [class*='mdi-account-circle'] {
    margin-right: 0.5rem;
  }

  [class*='mdi-robot'] {
    margin-left: 0.5rem;
  }
}

/* 用户消息操作按钮调整 */
.group:hover .opacity-0 {
  opacity: 1 !important;
  transform: translateX(0);
}

.user-message-buttons {
  position: relative;
  right: 0.5rem;
  margin-right: -1rem;
  transition: all 0.2s ease;
}

/* 输入框底部间距优化 */
.sticky.bottom-0 {
  padding-bottom: 0.25rem;
}
</style>
