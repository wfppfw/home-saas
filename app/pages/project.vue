<script setup>
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'

definePageMeta({
  layout: 'home',
})

const { data: sections } = await useAsyncData('search-sections', () => {
  return queryCollectionSearchSections('content')
})

// 颜色配置
const colorClasses = [
  {
    light: 'bg-rose-100 text-rose-700',
    dark: 'dark:bg-rose-600/80 dark:text-rose-100',
  },
  {
    light: 'bg-sky-100 text-sky-700',
    dark: 'dark:bg-sky-600/80 dark:text-sky-100',
  },
  {
    light: 'bg-emerald-100 text-emerald-700',
    dark: 'dark:bg-emerald-600/80 dark:text-emerald-100',
  },
  {
    light: 'bg-amber-100 text-amber-700',
    dark: 'dark:bg-amber-600/80 dark:text-amber-100',
  },
]

// 示例数据
const tags = ['技术', '生活', '旅行', '随笔', '前端', '设计', '阅读', '美食']
const articles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  date: `2024-0${i % 9 + 1}-${i % 28 + 1}`,
  title: `文章标题 ${i + 1} - 关于1现代前端开发的思考与实践`,
}))

// 搜索相关逻辑
const searchQuery = ref('')
const isSuggestionsOpen = ref(false)
const activeIndex = ref(-1)
const searchRef = ref(null)
let searchTimeout = null

// 防抖处理搜索
function performSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    isSuggestionsOpen.value = searchQuery.value.length > 0
  }, 300)
}

// 过滤建议结果
const suggestions = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query)
    return { tags: [], articles: [] }

  return {
    tags: tags.filter(tag => tag.toLowerCase().includes(query)),
    articles: articles.filter(article =>
      article.title.toLowerCase().includes(query),
    ),
  }
})

// 键盘导航处理
function handleKeydown(e) {
  const totalItems = suggestions.value.tags.length + suggestions.value.articles.length
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % totalItems
  }
  else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + totalItems) % totalItems
  }
  else if (e.key === 'Enter' && activeIndex.value >= 0) {
    navigateToItem(activeIndex.value)
  }
  else if (e.key === 'Escape') {
    isSuggestionsOpen.value = false
  }
}

// 跳转逻辑
function navigateToTag(tag) {
  navigateTo(`/tags/${encodeURIComponent(tag)}`)
}

function navigateToArticle(id) {
  navigateTo(`/articles/${id}`)
}

function navigateToItem(index) {
  const tagCount = suggestions.value.tags.length
  if (index < tagCount) {
    navigateToTag(suggestions.value.tags[index])
  }
  else {
    const articleIndex = index - tagCount
    navigateToArticle(suggestions.value.articles[articleIndex].id)
  }
  isSuggestionsOpen.value = false
}

// 点击外部关闭下拉
onClickOutside(searchRef, () => {
  isSuggestionsOpen.value = false
})
</script>

<template>
  <div class="mx-auto max-w-[800px] p-8 px-4 dark:bg-gray-900">
    <!-- 搜索区域 -->
    <div ref="searchRef" class="mb-8">
      <div class="relative mb-6 flex">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文章..."
          class="w-full border-2 border-gray-200 rounded-full py-4 pl-6 pr-12 text-base transition dark:border-gray-700 focus:border-blue-300 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
          @input="performSearch"
          @focus="isSuggestionsOpen = true"
          @keydown="handleKeydown"
        >
        <button class="absolute right-4 top-1/2 cursor-pointer border-none bg-transparent p-2 -translate-y-1/2">
          <svg class="h-6 w-6 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </button>

        <!-- 下拉建议 -->
        <Transition name="suggestion">
          <div
            v-if="isSuggestionsOpen && (suggestions.tags.length > 0 || suggestions.articles.length > 0)"
            class="absolute left-0 right-0 top-full z-50 mt-2 max-h-[400px] w-full overflow-auto border rounded-xl bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <!-- 标签建议 -->
            <div v-if="suggestions.tags.length > 0">
              <div class="p-2 text-sm text-gray-500 font-medium dark:text-gray-400">
                匹配标签 ({{ suggestions.tags.length }})
              </div>
              <div
                v-for="(tag, index) in suggestions.tags"
                :key="tag"
                class="flex cursor-pointer items-center px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
                :class="{ 'bg-blue-50 dark:bg-gray-700': index === activeIndex }"
                @mousedown="navigateToTag(tag)"
              >
                <span class="text-sm">#{{ tag }}</span>
              </div>
            </div>

            <!-- 文章建议 -->
            <div v-if="suggestions.articles.length > 0">
              <div class="p-2 text-sm text-gray-500 font-medium dark:text-gray-400">
                匹配文章 ({{ suggestions.articles.length }})
              </div>
              <div
                v-for="(article, index) in suggestions.articles"
                :key="article.id"
                class="flex cursor-pointer items-center px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
                :class="{
                  'bg-blue-50 dark:bg-gray-700':
                    index + suggestions.tags.length === activeIndex,
                }"
                @mousedown="navigateToArticle(article.id)"
              >
                <span class="truncate text-sm">{{ article.title }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 标签区域 -->
      <div class="cursor-my-pointer flex flex-wrap gap-2">
        <span
          v-for="(tag, index) in tags"
          :key="tag"
          class="cursor-my-pointer rounded px-3 py-1 text-sm font-medium transition hover:brightness-95 dark:hover:brightness-125"
          :class="[
            colorClasses[index % 4].light,
            colorClasses[index % 4].dark,
          ]"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="overflow-y-auto pr-2">
      <div
        v-for="article in articles"
        :key="article.id"
        class="group mb-3 border-b border-gray-100 p-5 transition dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        <div class="flex flex-col items-start gap-2 md:flex-row md:items-center">
          <span class="text-xs text-gray-400 md:min-w-[80px] md:text-sm dark:text-gray-500">
            {{ article.date }}
          </span>
          <div class="mx-2 hidden h-1 w-1 rounded-full bg-gray-400 md:block dark:bg-gray-500" />
          <h3
            class="text-lg text-gray-600 font-medium transition dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200"
          >
            {{ article.title }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.dark ::-webkit-scrollbar-track {
  background: #1a202c;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* 过渡动画 */
.suggestion-enter-active,
.suggestion-leave-active {
  transition: all 0.2s ease;
}
.suggestion-enter-from,
.suggestion-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
