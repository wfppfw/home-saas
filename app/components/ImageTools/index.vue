<!-- components/ImageTools/ImageTools.vue 主组件 -->
<script setup>
import { computed, ref, shallowRef } from 'vue'
import AiImage from './AiImage.vue'
// import ErrorToast from './components/ErrorToast.vue'
import ConverterTab from './ConverterTab.vue'
import ResizerTab from './ResizerTab.vue'

const tabs = [
  { id: 'convert', label: '格式转换', component: ConverterTab },
  { id: 'resize', label: '尺寸调整', component: ResizerTab },
  { id: 'ai', label: 'AI图片生成', component: AiImage },
]

const activeTab = ref('convert')
const errorMessage = ref('')

const activeComponent = computed(() =>
  tabs.find(t => t.id === activeTab.value)?.component,
)

function showError(message) {
  errorMessage.value = message
  setTimeout(() => errorMessage.value = '', 3000)
}
</script>

<template>
  <div class="min-h-screen min-w-4xl p-4 dark:bg-gray-900 dark:text-gray-100">
    <!-- Tab导航 -->
    <div class="smax-w-8xl mb-6 flex gap-2 border-b px-4 dark:border-gray-700">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="rounded-t-lg px-4 py-2 transition-colors"
        :class="{
          'bg-blue-500 text-white': activeTab === tab.id,
          'hover:bg-gray-200 dark:hover:bg-gray-700': activeTab !== tab.id,
        }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 错误提示 -->
    <!-- <ErrorToast :message="errorMessage" /> -->

    <!-- 内容区域 -->
    <component
      :is="activeComponent"
      class="animate-fade-in"
      @error="showError"
    />
  </div>
</template>
