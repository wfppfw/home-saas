<script setup>
import * as THREE from 'three'

definePageMeta({
  layout: 'home',
})

// 粒子动画配置
const PARTICLE_CONFIG = {
  count: 500,
  radius: 5,
  speed: 0.3,
  color: 0x4F46E5,
}

const canvasContainer = ref(null)
const skills = ref(['TypeScript', 'React', 'Node.js', 'Vue', 'Uno', 'Nuxt', 'Tree3D'])

// Three.js 初始化
let scene, camera, renderer, particles

function initThree() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  canvasContainer.value.appendChild(renderer.domElement)

  // 创建粒子几何体
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(PARTICLE_CONFIG.count * 3)

  for (let i = 0; i < PARTICLE_CONFIG.count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10
    positions[i + 1] = (Math.random() - 0.5) * 10
    positions[i + 2] = (Math.random() - 0.5) * 10
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // 粒子材质
  const material = new THREE.PointsMaterial({
    size: 0.05,
    color: PARTICLE_CONFIG.color,
    transparent: true,
    opacity: 0.8,
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  camera.position.z = 5
}

// 动画循环
function animate() {
  requestAnimationFrame(animate)

  particles.rotation.x += 0.001
  particles.rotation.y += 0.001

  const positions = particles.geometry.attributes.position.array
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.005
  }
  particles.geometry.attributes.position.needsUpdate = true

  renderer.render(scene, camera)
}

// 响应式调整
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 技能标签随机样式
function getTagStyle(index) {
  return {
    '--delay': `${index * 0.1}s`,
    '--x-offset': `${Math.cos(index) * 20}px`,
    '--y-offset': `${Math.sin(index) * 10}px`,
  }
}

onMounted(() => {
  if (window.innerWidth > 768) { // 仅在桌面端启用 Three.js
    initThree()
    animate()
    window.addEventListener('resize', onWindowResize)
  }
})
</script>

<template>
  <section class="hero-section">
    <!-- 动态背景容器 -->
    <div ref="canvasContainer" class="background-canvas" />

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 个人品牌区 -->
      <div class="branding">
        <div class="animated-logo">
          <!-- 使用 SVG 制作科技感 logo -->
          <svg viewBox="0 0 100 100" class="logo-svg">
            <path
              d="M50 10 L90 50 L50 90 L10 50 Z"
              class="hexagon"
              fill="none"
              stroke="#4F46E5"
              stroke-width="2"
            />
            <path
              d="M50 30 L70 50 L50 70 L30 50 Z"
              class="inner-hex"
              fill="none"
              stroke="#4F46E5"
              stroke-width="1"
            />
          </svg>
        </div>
        <h1 class="title">
          <span class="gradient-text">Alex Wang</span>
          <span class="subtitle">Full Stack Developer (〃▽〃)</span>
        </h1>
      </div>

      <!-- 动态技能标签云 -->
      <div class="skill-cloud">
        <div
          v-for="(skill, index) in skills"
          :key="index"
          class="skill-tag"
          :style="getTagStyle(index)"
        >
          {{ skill }}
        </div>
      </div>

      <!-- CTA 按钮组 -->
      <div class="cta-group">
        <NuxtLink to="/projects" class="cta-button glow-effect">
          <Icon name="ph:rocket-launch" class="icon" />
          查看项目
        </NuxtLink>
        <NuxtLink to="/contact" class="cta-button secondary">
          <Icon name="ph:chat-circle-dots" class="icon" />
          快速联系
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  @apply relative min-h-screen flex items-center justify-center overflow-hidden;
}

.background-canvas {
  @apply absolute inset-0 z-0;
}

.content-layer {
  @apply relative z-10 text-center max-w-4xl px-4;
}

.branding {
  @apply mb-12 animate-fade-in-up;
}

.logo-svg {
  @apply w-24 h-24 mx-auto mb-6;
  filter: drop-shadow(0 0 8px rgba(79, 70, 229, 0.3));
}

.title {
  @apply text-5xl font-bold mb-4;
}

.subtitle {
  @apply block text-xl text-gray-400 mt-2;
}

.skill-cloud {
  @apply flex flex-wrap justify-center gap-3 mb-12 max-w-2xl mx-auto;
}

.skill-tag {
  @apply px-4 py-2 bg-gray-200 rounded-full text-sm backdrop-blur-sm dark:bg-gray-800;
  animation: float 4s ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes float {
  0%,
  100% {
    transform: translate(var(--x-offset), var(--y-offset));
  }
  50% {
    transform: translate(calc(var(--x-offset) * -1), calc(var(--y-offset) * -1));
  }
}

.cta-button {
  @apply inline-flex items-center px-8 py-3 rounded-lg font-medium transition-all;
  &.glow-effect {
    @apply bg-indigo-600 text-white;
    &:hover {
      box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
    }
  }
  &.secondary {
    @apply bg-gray-700 text-gray-300 ml-4;
  }
  .icon {
    @apply mr-2 text-lg;
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .title {
    @apply text-3xl;
  }
  .skill-cloud {
    @apply gap-2;
  }
  .skill-tag {
    @apply text-xs px-3 py-1;
  }
  .cta-group {
    @apply flex flex-col gap-4;
  }
  .cta-button {
    @apply justify-center;
    &.secondary {
      @apply ml-0;
    }
  }
}
</style>
