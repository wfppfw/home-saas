<script setup>
const showModal = ref(false)

function handleConfirm() {
  // 处理确认逻辑
  showModal.value = false
}
</script>

<template>
  <div>
    <button
      class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      @click="showModal = true"
    >
      打开弹窗
    </button>

    <Modal
      v-model:show="showModal"
      title="操作确认"
      width="600px"
    >
      <p class="text-gray-700">
        确认要执行此操作吗？
      </p>

      <template #footer>
        <button
          class="rounded px-4 py-2 text-gray-700 hover:bg-gray-100"
          @click="showModal = false"
        >
          取消
        </button>
        <button
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          @click="handleConfirm"
        >
          确认
        </button>
      </template>
    </Modal>
  </div>
</template>
