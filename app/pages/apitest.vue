<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

// 接口类型定义
interface Header {
  key: string
  value: string
}

interface Param {
  key: string
  value: string
}
definePageMeta({
  layout: 'project',
})

// 颜色模式管理
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: val => (colorMode.value = val ? 'dark' : 'light'),
})

// 组件状态
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const headers = ref<Header[]>([{ key: '', value: '' }])
const params = ref<Param[]>([{ key: '', value: '' }])
const body = ref('{\n  \n}')
const response = ref<any>()

const formState = reactive({
  url: '/api/mock',
  method: 'GET',
  loading: false,
})

// 请求方法
async function sendRequest() {
  formState.loading = true
  try {
    const { data } = await useFetch(formState.url, {
      method: formState.method as 'GET',
      headers: headers.value.reduce((acc: Record<string, string>, { key, value }) => {
        if (key)
          acc[key] = value
        return acc
      }, {}),
      query: params.value.reduce((acc: Record<string, string>, { key, value }) => {
        if (key)
          acc[key] = value
        return acc
      }, {}),
      body: formState.method !== 'GET' ? JSON.parse(body.value) : undefined,
    })

    response.value = data.value
  }
  catch (err: any) {
    console.error(err)
    response.value = { error: err.message }
  }
  finally {
    formState.loading = false
  }
}

// 参数管理方法
function addHeader() {
  headers.value.push({ key: '', value: '' })
}

function removeHeader(index: number) {
  headers.value.splice(index, 1)
}

function addParam() {
  params.value.push({ key: '', value: '' })
}

function removeParam(index: number) {
  params.value.splice(index, 1)
}
</script>

<template>
  <div
    class="min-h-screen bg-white p-4 text-gray-800 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100"
  >
    <!-- 暗黑模式切换 -->
    <div class="absolute right-4 top-4">
      <button
        class="rounded-full p-2 transition-colors hover:bg-opacity-20"
        :class="isDark ? 'hover:bg-white' : 'hover:bg-black'"
        @click="isDark = !isDark"
      >
        <Icon
          :name="isDark ? 'ph:moon-bold' : 'ph:sun-bold'"
          class="h-6 w-6"
        />
      </button>
    </div>

    <div class="mx-auto max-w-6xl">
      <!-- 请求控制栏 -->
      <div class="mb-6 flex flex-col gap-4 md:flex-row">
        <select
          v-model="formState.method"
          class="border rounded px-2 py-1 md:w-24 dark:border-gray-600 focus:border-transparent dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="m in methods" :key="m">
            {{ m }}
          </option>
        </select>
        <input
          v-model="formState.url"
          type="text"
          class="flex-1 border rounded px-2 py-1 dark:border-gray-600 focus:border-transparent dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter URL"
        >
        <button
          :disabled="formState.loading"
          class="rounded bg-blue-500 px-4 py-1 text-white transition-colors disabled:bg-gray-400 hover:bg-blue-600 dark:hover:bg-blue-400"
          @click="sendRequest"
        >
          {{ formState.loading ? 'Sending...' : 'Send' }}
        </button>
      </div>

      <!-- 主内容区 -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <!-- Query Parameters -->
        <div class="border rounded p-4 dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-2 flex justify-between">
            <h3 class="font-bold">
              Query Parameters
            </h3>
            <button
              class="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
              @click="addParam"
            >
              + Add
            </button>
          </div>
          <div
            v-for="(param, index) in params"
            :key="index"
            class="mb-2 flex gap-2"
          >
            <input
              v-model="param.key"
              placeholder="Key"
              class="flex-1 border rounded px-2 py-1 dark:border-gray-600 focus:border-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
            <input
              v-model="param.value"
              placeholder="Value"
              class="flex-1 border rounded px-2 py-1 dark:border-gray-600 focus:border-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
            <button
              class="text-red-500 hover:text-red-600 dark:hover:text-red-400"
              @click="removeParam(index)"
            >
              ×
            </button>
          </div>
        </div>

        <!-- Headers -->
        <div class="border rounded p-4 dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-2 flex justify-between">
            <h3 class="font-bold">
              Headers
            </h3>
            <button
              class="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
              @click="addHeader"
            >
              + Add
            </button>
          </div>
          <div
            v-for="(header, index) in headers"
            :key="index"
            class="mb-2 flex gap-2"
          >
            <input
              v-model="header.key"
              placeholder="Key"
              class="flex-1 border rounded px-2 py-1 dark:border-gray-600 focus:border-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
            <input
              v-model="header.value"
              placeholder="Value"
              class="flex-1 border rounded px-2 py-1 dark:border-gray-600 focus:border-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
            <button
              class="text-red-500 hover:text-red-600 dark:hover:text-red-400"
              @click="removeHeader(index)"
            >
              ×
            </button>
          </div>
        </div>

        <!-- Body Editor -->
        <div class="col-span-full border rounded p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-2 font-bold">
            Body
          </h3>
          <textarea
            v-model="body"
            class="h-48 w-full border rounded p-2 text-sm font-mono dark:border-gray-600 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            :disabled="formState.method === 'GET'"
          />
        </div>

        <!-- Response Display -->
        <div class="col-span-full border rounded p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-2 font-bold">
            Response
          </h3>
          <pre class="max-h-96 overflow-auto rounded bg-gray-100 p-4 text-sm dark:bg-gray-700 dark:text-gray-200">{{
            JSON.stringify(response, null, 2)
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
