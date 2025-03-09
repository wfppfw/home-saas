<script setup>
defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
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
  <div class="card">
    <div class="card-image">
      <img :src="imageUrl" alt="Card Image" class="image">
    </div>
    <div class="card-content">
      <h2 class="title">
        {{ title }}
      </h2>
      <p class="description">
        {{ description }}
      </p>
    </div>
  </div>
</template>

  <style scoped>
  .card {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
}

.card-image {
  flex: 0 0 150px;
  height: 150px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  flex: 1;
  padding: 16px;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.description {
  font-size: 0.875rem;
  color: #4a5568;
}

@media (max-width: 640px) {
  .card {
    flex-direction: column;
  }

  .card-image {
    flex: 0 0 100%;
    width: 100%;
    height: 200px;
  }

  .card-content {
    padding: 16px;
    text-align: center;
  }
}
</style>
