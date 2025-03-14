<!-- components/FileUpload.vue -->
<script setup>
import { computed, reactive, ref } from 'vue'

const props = defineProps({
  maxSize: {
    type: Number,
    default: 50 * 1024 * 1024, // 50MB
  },
  allowedTypes: {
    type: Array,
    default: () => ['*/*'],
  },
  uploadUrl: {
    type: String,
    required: true,
  },
  maxConcurrent: {
    type: Number,
    default: 3,
  },
})

const emit = defineEmits(['upload-success', 'upload-error', 'file-removed', 'all-files-cleared'])

// 组件状态
const fileInput = ref(null)
const files = reactive([])
const isDragging = ref(false)
const activeUploads = ref(0)

// 状态配置
const statusColors = reactive({
  pending: 'text-gray-500',
  uploading: 'text-blue-500',
  completed: 'text-green-500',
  canceled: 'text-red-500',
  error: 'text-red-500',
})

const statusText = reactive({
  pending: '等待上传',
  uploading: '上传中',
  completed: '已完成',
  canceled: '已取消',
  error: '上传失败',
})

// 计算属性
const hasPendingFiles = computed(() =>
  files.some(file => file.status === 'pending'),
)

const isUploading = computed(() =>
  files.some(file => file.status === 'uploading'),
)

const uploadButtonText = computed(() => {
  const pendingCount = files.filter(f => f.status === 'pending').length
  const uploadingCount = files.filter(f => f.status === 'uploading').length

  if (uploadingCount > 0)
    return `上传中 (${uploadingCount}/${pendingCount + uploadingCount})`
  if (pendingCount > 0)
    return `开始上传 (${pendingCount})`
  return '所有文件已上传'
})

// 方法
const generateId = () => crypto.randomUUID()

function validateFile(file) {
  if (file.size > props.maxSize) {
    emit('upload-error', {
      file,
      error: `文件大小超过限制 (${formatFileSize(props.maxSize)})`,
    })
    return false
  }

  const isValidType = props.allowedTypes.some((pattern) => {
    if (pattern === '*/*')
      return true
    const [type, subtype] = pattern.split('/')
    if (subtype === '*')
      return file.type.startsWith(`${type}/`)
    return file.type === pattern
  })

  if (!isValidType) {
    emit('upload-error', {
      file,
      error: `不支持的文件类型: ${file.type}`,
    })
    return false
  }

  return true
}

function handleFiles(newFiles) {
  Array.from(newFiles).forEach((file) => {
    if (!validateFile(file))
      return

    const exists = files.some(f =>
      f.name === file.name
      && f.size === file.size
      && f.lastModified === file.lastModified,
    )

    if (!exists) {
      const preview = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null

      files.push({
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        raw: file,
        progress: 0,
        status: 'pending',
        xhr: null,
        preview,
      })
    }
  })
}

async function startUpload() {
  const pendingFiles = files.filter(f => f.status === 'pending')
  const chunks = []

  while (pendingFiles.length) {
    chunks.push(pendingFiles.splice(0, props.maxConcurrent))
  }

  for (const chunk of chunks) {
    await Promise.allSettled(chunk.map(uploadFile))
  }
}

async function uploadFile(file) {
  if (file.status !== 'pending')
    return

  file.status = 'uploading'
  activeUploads.value++

  const formData = new FormData()
  formData.append('file', file.raw)
  formData.append('metadata', JSON.stringify({
    name: file.name,
    type: file.type,
    size: file.size,
  }))

  try {
    await new Promise((resolve, reject) => {
      file.xhr = new XMLHttpRequest()
      file.xhr.open('POST', props.uploadUrl)

      file.xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          file.progress = Math.round((e.loaded / e.total) * 100)
        }
      })

      file.xhr.onload = () => {
        if (file.xhr.status >= 200 && file.xhr.status < 300) {
          file.status = 'completed'
          emit('upload-success', {
            file,
            response: JSON.parse(file.xhr.responseText),
          })
          resolve()
        }
        else {
          handleUploadError(file, file.xhr)
          reject(new Error('上传失败'))
        }
      }

      file.xhr.onerror = () => {
        handleUploadError(file, file.xhr)
        reject(new Error('网络错误'))
      }

      file.xhr.onabort = () => {
        file.status = 'canceled'
        emit('upload-error', {
          file,
          error: '上传已取消',
        })
        reject(new Error('用户取消'))
      }

      file.xhr.send(formData)
    })
  }
  catch (error) {
    console.error('上传错误:', error)
  }
  finally {
    file.xhr = null
    activeUploads.value--
  }
}

function handleUploadError(file, xhr) {
  file.status = 'error'
  emit('upload-error', {
    file,
    error: xhr.statusText || '未知错误',
    status: xhr.status,
  })
}

function cancelUpload(file) {
  if (file.xhr) {
    file.xhr.abort()
    file.xhr = null
    file.status = 'canceled'
  }
}

function removeFile(file) {
  const index = files.findIndex(f => f.id === file.id)
  if (index !== -1) {
    if (file.status === 'uploading')
      cancelUpload(file)
    if (file.preview)
      URL.revokeObjectURL(file.preview)
    files.splice(index, 1)
    emit('file-removed', file)
  }
}

function clearAllFiles() {
  files.forEach((file) => {
    if (file.status === 'uploading')
      cancelUpload(file)
    if (file.preview)
      URL.revokeObjectURL(file.preview)
  })
  files.splice(0, files.length)
  emit('all-files-cleared')
}

function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || bytes < 0)
    return '0 B'
  if (bytes === 0)
    return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const base = 1024
  let value = bytes
  let unitIndex = 0

  // 循环计算合适单位
  while (value >= base && unitIndex < units.length - 1) {
    value /= base
    unitIndex++
  }

  // 智能格式化数值
  //   const formattedValue = value.toFixed(2)
  //     .replace(/\.?0+$/, '') // 删除末尾的零和小数点
  //     .replace(/(\..*?)0+$/, '$1') // 删除小数点后的多余零

  const formattedValue = value.toFixed(2)
    .replace(/0+$/, '')
    .replace(/\.$/, '')

  return `${formattedValue} ${units[unitIndex]}`
}

// 事件处理
const triggerFileInput = () => fileInput.value.click()

const handleFileSelect = e => handleFiles(e.target.files)

const handleDragOver = () => (isDragging.value = true)
const handleDragLeave = () => (isDragging.value = false)
function handleDrop(e) {
  isDragging.value = false
  handleFiles(e.dataTransfer.files)
}
</script>

<template>
  <div
    class="flex flex-col gap-4 border-2 rounded-lg border-dashed p-6 transition-colors duration-200"
    :class="[isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white']"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      class="hidden"
      @change="handleFileSelect"
    >

    <!-- 拖拽区域 -->
    <div class="flex flex-col items-center justify-center gap-3 py-8 text-center">
      <div
        class="rounded-full bg-blue-100 p-3 transition-transform duration-200"
        :class="{ 'scale-110': isDragging }"
      >
        <svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <div class="space-y-1">
        <p class="text-gray-900 font-medium">
          拖拽文件到此区域 或
          <button
            class="text-blue-600 underline hover:text-blue-500 focus:outline-none"
            type="button"
            @click="triggerFileInput"
          >
            点击上传
          </button>
        </p>
        <p class="text-sm text-gray-500">
          支持多个文件，单个文件最大 {{ formatFileSize(maxSize) }}
        </p>
      </div>
    </div>

    <!-- 文件列表 -->
    <div v-if="files.length" class="space-y-4">
      <TransitionGroup name="file-list">
        <div
          v-for="file in files"
          :key="file.id"
          class="border rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div class="mb-2 flex items-center justify-between gap-3">
            <div class="min-w-0 flex flex-1 items-center gap-3">
              <!-- 文件预览 -->
              <div class="h-12 w-12 flex items-center justify-center overflow-hidden rounded-md bg-gray-100">
                <img v-if="file.preview" :src="file.preview" class="h-full w-full object-cover">
                <svg v-else class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium">
                  {{ file.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatFileSize(file.size) }} •
                  <span :class="statusColors[file.status]">{{ statusText[file.status] }}</span>
                </p>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center gap-2">
              <button
                v-if="file.status === 'uploading'"
                class="rounded-full p-1 text-red-500 hover:bg-red-50"
                title="取消上传"
                @click="cancelUpload(file)"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button
                class="rounded-full p-1 text-gray-400 hover:bg-gray-50"
                :title="file.status === 'pending' ? '取消选择' : '移除文件'"
                @click="removeFile(file)"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- 进度条 -->
          <div v-if="file.status === 'uploading'" class="h-2 rounded bg-gray-200">
            <div
              class="h-full rounded bg-green-500 transition-all duration-300"
              :style="{ width: `${file.progress}%` }"
            />
          </div>
        </div>
      </TransitionGroup>

      <!-- 控制按钮 -->
      <div class="flex gap-3">
        <button
          class="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:opacity-50"
          :disabled="!hasPendingFiles || isUploading"
          @click="startUpload"
        >
          {{ uploadButtonText }}
        </button>
        <button
          class="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          @click="clearAllFiles"
        >
          清空所有文件
        </button>
      </div>
    </div>
  </div>
</template>

  <style>
  .file-list-move {
  transition: transform 0.3s ease;
}

.file-list-enter-active,
.file-list-leave-active {
  transition: all 0.3s;
}

.file-list-enter-from,
.file-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
