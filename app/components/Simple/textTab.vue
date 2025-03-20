<!-- components/Tabs/TabPanel.vue -->
<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(tab => 'id' in tab && 'label' in tab)
    },
  },
  initialTab: {
    type: String,
    default: '',
  },
})

const selectedTab = ref(props.initialTab || props.tabs[0]?.id)
</script>

<template>
  <div class="w-full">
    <!-- Tab 导航 -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="flex space-x-4" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="relative flex cursor-pointer items-center justify-center px-4 py-2 text-sm font-medium transition-colors"
          :class="[
            selectedTab === tab.id
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
          ]"
          @click="selectedTab = tab.id"
        >
          {{ tab.label }}
          <!-- 可选的角标 -->
          <span
            v-if="tab.badge"
            class="ml-2 rounded-full px-2 py-1 text-xs"
            :class="[
              selectedTab === tab.id
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
            ]"
          >
            {{ tab.badge }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab 内容 -->
    <div class="mt-4">
      <transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          :key="selectedTab"
          class="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
        >
          <slot :name="selectedTab" />
        </div>
      </transition>
    </div>
  </div>
</template>
