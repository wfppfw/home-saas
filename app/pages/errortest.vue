<!-- /pages/[...all].vue -->
<script setup>
// 当访问未匹配路由时，手动抛出错误
throw createError({
  statusCode: 500,
  message: '自定义未找到提示',
})
</script>

<template>
  <div />
</template>
