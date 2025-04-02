<script setup>
import { saveAs } from 'file-saver'
import { computed, ref } from 'vue'
import { read, utils, writeFileXLSX } from 'xlsx'

const isDragging = ref(false)
const excelData = ref([])
const headers = ref([])
const currentPage = ref(1)
const pageSize = 10
const editingCell = ref(null)

// 分页计算
const totalPages = computed(() => Math.ceil(excelData.value.length / pageSize))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return excelData.value.slice(start, start + pageSize)
})

// 处理文件
async function processFile(file) {
  const data = await file.arrayBuffer()
  const workbook = read(data)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const jsonData = utils.sheet_to_json(worksheet)

  headers.value = Object.keys(jsonData[0])
  excelData.value = jsonData
}

// 拖拽处理
function handleDragOver() { isDragging.value = true }
function handleDragLeave() { isDragging.value = false }

function handleFileDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file)
    processFile(file)
}

function handleFileSelect(e) {
  const file = e.target.files[0]
  if (file)
    processFile(file)
}

// 编辑功能
function startEditing(row, col) {
  editingCell.value = { row, col }
}

function saveEdit() {
  editingCell.value = null
}

// 导出功能
function exportExcel() {
  const worksheet = utils.json_to_sheet(excelData.value)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  const wbout = writeFileXLSX(workbook, { type: 'buffer' })
  saveAs(new Blob([wbout]), 'exported-data.xlsx')
}
</script>

<template>
  <div class="min-h-screen p-4 dark:bg-gray-900 dark:text-gray-100">
    <!-- 文件操作区 -->
    <div
      class="mb-6 border-2 rounded-lg border-dashed p-6 transition-colors hover:border-blue-400 dark:hover:border-blue-500"
      :class="[
        isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600',
      ]"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleFileDrop"
    >
      <div class="text-center space-y-2">
        <div class="i-carbon-document-export mx-auto text-4xl text-blue-500" />
        <p class="font-medium">
          拖拽 Excel 文件到此区域 或
        </p>
        <label class="inline-block cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          <input
            type="file"
            class="hidden"
            accept=".xlsx, .xls, .csv"
            @change="handleFileSelect"
          >
          选择文件
        </label>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          支持 .xlsx, .xls, .csv 格式
        </p>
      </div>
    </div>

    <!-- 数据展示区 -->
    <ClientOnly>
      <div
        v-if="excelData.length"
        class="overflow-x-auto border rounded-lg shadow-sm dark:border-gray-700"
      >
        <table class="w-full bg-white dark:bg-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                v-for="(header, index) in headers"
                :key="index"
                class="px-4 py-3 text-left text-sm text-gray-700 font-medium dark:text-gray-300"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in paginatedData"
              :key="rowIndex"
              class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td
                v-for="(value, colIndex) in row"
                :key="colIndex"
                class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                @dblclick="startEditing(rowIndex, colIndex)"
              >
                <input
                  v-if="editingCell?.row === rowIndex && editingCell?.col === colIndex"
                  v-model="excelData[rowIndex][headers[colIndex]]"
                  class="border rounded px-2 py-1 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                  @blur="saveEdit"
                  @keyup.enter="saveEdit"
                >
                <span v-else>{{ value }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 分页控制 -->
        <div class="flex items-center justify-between bg-gray-50 p-4 dark:bg-gray-700">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, excelData.length) }} 条，共 {{ excelData.length }} 条
          </div>
          <div class="flex space-x-2">
            <button
              v-for="page in totalPages"
              :key="page"
              class="rounded-md px-3 py-1"
              :class="[
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600',
              ]"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- 操作按钮 -->
    <div v-if="excelData.length" class="mt-6 flex justify-end space-x-3">
      <button
        class="flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        @click="exportExcel"
      >
        <div class="i-carbon-download" />
        导出 Excel
      </button>
    </div>
  </div>
</template>
