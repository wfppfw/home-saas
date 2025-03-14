<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="text-block">
    <h1 class="title">
      Record the bits and pieces of <span style="color:#4F46E5;">life</span>
    </h1>
    <p class="description">
      I will occasionally update this space with articles and photos (when I'm not feeling lazy (￣▽￣*)ゞ).
    </p>
  </div>
</template>

<style scoped>
.text-block {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
  word-wrap: break-word;
}

.description {
  font-size: 1rem;
  color: #666;
  word-wrap: break-word;
}

@media (max-width: 640px) {
  .title {
    font-size: 1.5rem;
  }

  .description {
    font-size: 0.875rem;
  }
}
</style>
