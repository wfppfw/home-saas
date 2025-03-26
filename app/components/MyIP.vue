<!-- components/IpQuery.vue -->
<script setup lang="ts">
const { $colorMode } = useNuxtApp()

// 状态管理
const inputIp = ref('')
const result = ref<any>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// 获取本地 IP 结果
async function fetchLocalIp() {
  inputIp.value = ''
  await fetchIpData()
}

// 查询 IP 数据
async function fetchIpData() {
  error.value = null
  isLoading.value = true

  try {
    const { data, error: fetchError } = await useFetch('/api/ipinfo', {
      query: inputIp.value ? { ip: inputIp.value } : undefined,
    })

    if (fetchError.value) {
      throw new Error(fetchError.value.message)
    }

    result.value = data.value?.data
  }
  catch (err: any) {
    error.value = err.message || '查询失败，请重试'
  }
  finally {
    isLoading.value = false
  }
}

// 初始化加载
onMounted(fetchLocalIp)
</script>

<template>
  <div
    class="mx-auto max-w-2xl rounded-xl p-6 shadow-lg transition-all duration-300"
    :class="[
      $colorMode.preference === 'dark'
        ? 'bg-gray-800 text-gray-100'
        : 'bg-white text-gray-800',
    ]"
  >
    <!-- 查询输入区 -->
    <div class="mb-6 flex flex-col gap-4 md:flex-row">
      <div class="relative flex-1">
        <input
          v-model="inputIp"
          type="text"
          placeholder="输入 IP 地址"
          class="w-full border rounded-lg px-4 py-3 transition-all focus:outline-none focus:ring-2"
          :class="[
            $colorMode.preference === 'dark'
              ? 'bg-gray-700 border-gray-600 focus:ring-blue-400'
              : 'bg-gray-50 border-gray-300 focus:ring-blue-500',
          ]"
        >
        <span
          v-if="!inputIp"
          class="absolute right-3 top-3 text-sm opacity-50"
          :class="$colorMode.preference === 'dark' ? 'text-gray-400' : 'text-gray-500'"
        >
          本地 IP
        </span>
      </div>

      <div class="flex gap-2">
        <button
          :disabled="isLoading"
          class="flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors"
          :class="[
            $colorMode.preference === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white',
            isLoading ? 'opacity-50 cursor-not-allowed' : '',
          ]"
          @click="fetchIpData"
        >
          <span v-if="!isLoading">🔍 查询</span>
          <span v-else>⌛ 查询中...</span>
        </button>

        <button
          class="rounded-lg px-4 py-3 font-medium transition-colors"
          :class="[
            $colorMode.preference === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
          ]"
          @click="fetchLocalIp"
        >
          当前
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-800/20 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- 结果展示 -->
    <div
      v-if="result"
      class="animate-fade-in space-y-4"
    >
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div
          class="rounded-lg bg-opacity-20 p-4"
          :class="[
            $colorMode.preference === 'dark'
              ? 'bg-gray-700'
              : 'bg-gray-100',
          ]"
        >
          <p class="mb-1 text-sm opacity-70">
            国家/地区
          </p>
          <p class="font-medium">
            {{ result.country }} ({{ result.countryCode }})
          </p>
        </div>

        <div
          class="rounded-lg bg-opacity-20 p-4"
          :class="[
            $colorMode.preference === 'dark'
              ? 'bg-gray-700'
              : 'bg-gray-100',
          ]"
        >
          <p class="mb-1 text-sm opacity-70">
            地理位置
          </p>
          <p class="font-medium">
            {{ result.regionName }} · {{ result.city }}
          </p>
        </div>

        <div
          class="rounded-lg bg-opacity-20 p-4"
          :class="[
            $colorMode.preference === 'dark'
              ? 'bg-gray-700'
              : 'bg-gray-100',
          ]"
        >
          <p class="mb-1 text-sm opacity-70">
            时区
          </p>
          <p class="font-medium">
            {{ result.timezone }} (UTC{{ result.offset >= 0 ? '+' : '' }}{{ result.offset / 3600 }})
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          class="rounded-lg bg-opacity-20 p-4"
          :class="[
            $colorMode.preference === 'dark'
              ? 'bg-gray-700'
              : 'bg-gray-100',
          ]"
        >
          <p class="mb-1 text-sm opacity-70">
            网络提供商
          </p>
          <p class="font-medium">
            {{ result.isp }}
          </p>
          <p class="mt-1 text-sm opacity-70">
            {{ result.org }}
          </p>
        </div>

        <div
          class="rounded-lg bg-opacity-20 p-4"
          :class="[
            $colorMode.preference === 'dark'
              ? 'bg-gray-700'
              : 'bg-gray-100',
          ]"
        >
          <p class="mb-1 text-sm opacity-70">
            坐标
          </p>
          <p class="font-medium">
            {{ result.lat }}, {{ result.lon }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
