<script setup lang="ts">
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const headers = ref([{ key: '', value: '' }])
const params = ref([{ key: '', value: '' }])
const body = ref('{\n  \n}')
const response = ref()

const formState = reactive({
  url: '/api/mock',
  method: 'GET',
  loading: false,
})

async function sendRequest() {
  formState.loading = true
  try {
    const { data } = await useFetch(formState.url, {
      method: formState.method,
      headers: headers.value.reduce((acc, { key, value }) => {
        if (key)
          acc[key] = value
        return acc
      }, {}),
      query: params.value.reduce((acc, { key, value }) => {
        if (key)
          acc[key] = value
        return acc
      }, {}),
      body: formState.method !== 'GET' ? JSON.parse(body.value) : undefined,
    })

    response.value = data.value
  }
  catch (err) {
    console.error(err)
    response.value = { error: err.message }
  }
  finally {
    formState.loading = false
  }
}

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
  <div class="mx-auto max-w-6xl p-4">
    <div class="mb-6 flex gap-4">
      <select
        v-model="formState.method"
        class="w-24 border rounded px-2 py-1"
      >
        <option v-for="m in methods" :key="m">
          {{ m }}
        </option>
      </select>
      <input
        v-model="formState.url"
        type="text"
        class="flex-1 border rounded px-2 py-1"
        placeholder="Enter URL"
      >
      <button
        :disabled="formState.loading"
        class="rounded bg-blue-500 px-4 py-1 text-white disabled:bg-gray-400 hover:bg-blue-600"
        @click="sendRequest"
      >
        {{ formState.loading ? 'Sending...' : 'Send' }}
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Params Section -->
      <div class="border rounded p-4">
        <div class="mb-2 flex justify-between">
          <h3 class="font-bold">
            Query Parameters
          </h3>
          <button class="text-blue-500" @click="addParam">
            + Add
          </button>
        </div>
        <div v-for="(param, index) in params" :key="index" class="mb-2 flex gap-2">
          <input
            v-model="param.key"
            placeholder="Key"
            class="flex-1 border rounded px-2 py-1"
          >
          <input
            v-model="param.value"
            placeholder="Value"
            class="flex-1 border rounded px-2 py-1"
          >
          <button class="text-red-500" @click="removeParam(index)">
            ×
          </button>
        </div>
      </div>

      <!-- Headers Section -->
      <div class="border rounded p-4">
        <div class="mb-2 flex justify-between">
          <h3 class="font-bold">
            Headers
          </h3>
          <button class="text-blue-500" @click="addHeader">
            + Add
          </button>
        </div>
        <div v-for="(header, index) in headers" :key="index" class="mb-2 flex gap-2">
          <input
            v-model="header.key"
            placeholder="Key"
            class="flex-1 border rounded px-2 py-1"
          >
          <input
            v-model="header.value"
            placeholder="Value"
            class="flex-1 border rounded px-2 py-1"
          >
          <button class="text-red-500" @click="removeHeader(index)">
            ×
          </button>
        </div>
      </div>

      <!-- Body Section -->
      <div class="col-span-2 border rounded p-4">
        <h3 class="mb-2 font-bold">
          Body
        </h3>
        <textarea
          v-model="body"
          class="h-48 w-full border rounded p-2 text-sm font-mono"
          :disabled="formState.method === 'GET'"
        />
      </div>

      <!-- Response Section -->
      <div class="col-span-2 border rounded p-4">
        <h3 class="mb-2 font-bold">
          Response
        </h3>
        <pre class="max-h-96 overflow-auto rounded bg-gray-100 p-4 text-sm">{{
          JSON.stringify(response, null, 2)
        }}</pre>
      </div>
    </div>
  </div>
</template>
