<script setup>
function handleSuccess({ file, response }) {
  // eslint-disable-next-line no-console
  console.log('上传成功:', file.name, response)
}

function handleError({ file, error }) {
  console.error('上传失败:', file.name, error)
}
</script>

<template>
  <FileUpload
    upload-url="/api/upload"
    :max-size="100 * 1024 * 1024"
    @upload-success="handleSuccess"
    @upload-error="handleError"
  />
</template>
