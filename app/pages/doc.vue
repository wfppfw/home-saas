<script setup>
import { computed, ref } from 'vue'

definePageMeta({
  layout: 'home',
})
// 工具数据
const tools = ref([
  {
    name: 'JSON 格式化',
    category: 'code',
    icon: '🧑💻',
    desc: 'JSON数据格式化与验证工具',
    url: '#',
  },
  // 其他工具数据...
])

// 分类配置
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'code', name: '编程开发' },
  { id: 'design', name: '设计工具' },
  { id: 'test', name: '测试工具' },
])

const selectedCategory = ref('all')
const searchQuery = ref('')

// 分类样式配置
const categoryClasses = {
  code: 'bg-blue-100 text-blue-800',
  design: 'bg-purple-100 text-purple-800',
  test: 'bg-green-100 text-green-800',
}

const categoryNames = {
  code: '编程开发',
  design: '设计工具',
  test: '测试工具',
}

// 过滤后的工具列表
const filteredTools = computed(() => {
  return tools.value.filter((tool) => {
    const matchCategory = selectedCategory.value === 'all'
      || tool.category === selectedCategory.value
    const matchSearch = tool.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      || tool.desc.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchSearch
  })
})

function openTool(url) {
  window.open(url)
}
</script>

<template>
  <div class="p-5">
    <!-- 搜索和分类过滤 -->
    <div class="mx-auto mb-8 max-w-1200px flex flex-wrap gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索工具..."
        class="min-w-300px flex-1 border-2 border-gray-200 rounded-lg p-3"
      >

      <div class="flex flex-wrap gap-3">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="border rounded-full px-4 py-2 transition-all"
          :class="[
            selectedCategory === cat.id
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-gray-300',
          ]"
          @click="selectedCategory = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- 工具卡片网格 -->
    <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] mx-auto max-w-1200px gap-5">
      <div
        v-for="tool in filteredTools"
        :key="tool.name"
        class="cursor-pointer rounded-xl bg-white p-5 shadow-md transition-transform hover:translate-y--2"
        @click="openTool(tool.url)"
      >
        <div class="text-primary mb-4 text-2xl">
          {{ tool.icon }}
        </div>
        <h3 class="mb-2 text-lg font-semibold">
          {{ tool.name }}
        </h3>
        <p class="mb-4 text-gray-600">
          {{ tool.desc }}
        </p>
        <span
          class="rounded-full px-3 py-1 text-sm"
          :class="categoryClasses[tool.category]"
        >
          {{ categoryNames[tool.category] }}
        </span>
      </div>
    </div>
  </div>
</template>

  <style>
  /* 需要自定义的动画 */
.hover\:translate-y--2:hover {
  transform: translateY(-0.5rem);
}
</style>
