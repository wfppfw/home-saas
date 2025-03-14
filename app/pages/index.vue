<script setup>
import { SimpleStartBg } from '#components'
import * as THREE from 'three'

definePageMeta({
  layout: 'home',
  scrollToTop: true, // 进入该页面时自动滚动到顶部
})

// 粒子动画配置
const PARTICLE_CONFIG = {
  count: 500,
  radius: 5,
  speed: 0.3,
  color: 0x4F46E5,
  explosion: {
    force: 0.5, // 爆炸力度
    radius: 2.0, // 影响半径
    duration: 1.5, // 效果持续时间（秒）
  },
}
// 新增粒子物理属性存储
let particlePositions = new Float32Array(0) // 初始化为空缓冲区
let particleVelocities = new Float32Array(0)
// eslint-disable-next-line prefer-const
let explosionStartTime = 0
let isExploding = false

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

// 初始化粒子系统（修改部分）
// eslint-disable-next-line unused-imports/no-unused-vars
function initParticles() {
  const totalSize = PARTICLE_CONFIG.count * 3

  // 创建新缓冲区
  particlePositions = new Float32Array(totalSize)
  particleVelocities = new Float32Array(totalSize)

  const positions = new Float32Array(totalSize)

  for (let i = 0; i < totalSize; i += 3) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * PARTICLE_CONFIG.radius
    positions[i] = Math.cos(angle) * radius
    positions[i + 1] = Math.sin(angle) * radius
    positions[i + 2] = (Math.random() - 0.5) * 2

    // 初始化速度
    particleVelocities[i] = (Math.random() - 0.5) * 0.01
    particleVelocities[i + 1] = (Math.random() - 0.5) * 0.01
    particleVelocities[i + 2] = (Math.random() - 0.5) * 0.01
  }

  // 将初始位置复制到持久化缓冲区
  particlePositions.set(positions)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // 保持原有材质设置...
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

// 新增鼠标点击处理
function handleClick(event) {
  if (!renderer)
    return

  // 转换鼠标坐标到三维空间
  const mouse = new THREE.Vector2()
  const rect = renderer.domElement.getBoundingClientRect()

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)

  // 获取点击位置（假设在z=0平面）
  const targetZ = 0
  const direction = new THREE.Vector3()
  raycaster.ray.direction.clone(direction)
  const distance = (targetZ - raycaster.ray.origin.z) / direction.z
  const clickPoint = raycaster.ray.origin.clone().add(direction.multiplyScalar(distance))

  // 触发爆炸效果
  applyExplosionForce(clickPoint)
}

// 新增爆炸效果逻辑
// 修改 applyExplosionForce 函数中的距离计算
function applyExplosionForce(center) {
  const positions = particles.geometry.attributes.position.array

  for (let i = 0; i < positions.length; i += 3) {
    const dx = positions[i] - center.x
    const dy = positions[i + 1] - center.y
    const dz = positions[i + 2] - center.z
    const distanceSq = dx * dx + dy * dy + dz * dz // 先计算平方距离

    // 添加安全阈值 (0.0001)
    if (distanceSq < PARTICLE_CONFIG.explosion.radius ** 2 && distanceSq > 0.0001) {
      const distance = Math.sqrt(distanceSq)
      const force = PARTICLE_CONFIG.explosion.force * (1 - distance / PARTICLE_CONFIG.explosion.radius)

      // 标准化方向向量
      const invDistance = 1 / distance
      particleVelocities[i] += dx * invDistance * force
      particleVelocities[i + 1] += dy * invDistance * force
      particleVelocities[i + 2] += dz * invDistance * force
    }
    else if (distanceSq <= 0.0001) {
      // 极近距离时赋予随机方向
      const angle = Math.random() * Math.PI * 2
      particleVelocities[i] += Math.cos(angle) * force
      particleVelocities[i + 1] += Math.sin(angle) * force
    }
  }
}

// 修改后的动画循环
function animate() {
  requestAnimationFrame(animate)

  // 原有旋转逻辑
  particles.rotation.x += 0.001
  particles.rotation.y += 0.001

  // 新增粒子运动逻辑
  const positions = particles.geometry.attributes.position.array
  const now = Date.now()
  const deltaTime = (now - explosionStartTime) / 1000

  for (let i = 0; i < positions.length; i += 3) {
    // 粒子运动
    positions[i] += particleVelocities[i] || 0
    positions[i + 1] += particleVelocities[i + 1] || 0
    positions[i + 2] += particleVelocities[i + 2] || 0

    // 速度衰减
    if (isExploding) {
      particleVelocities[i] *= 0.98
      particleVelocities[i + 1] *= 0.98
      particleVelocities[i + 2] *= 0.98
    }

    // 边界限制
    if (Math.abs(positions[i]) > 10)
      particleVelocities[i] *= -0.5
    if (Math.abs(positions[i + 1]) > 10)
      particleVelocities[i + 1] *= -0.5
    if (Math.abs(positions[i + 2]) > 10)
      particleVelocities[i + 2] *= -0.5
  }

  // 结束爆炸状态
  if (deltaTime > PARTICLE_CONFIG.explosion.duration) {
    isExploding = false
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

    // 新增点击事件监听
    renderer.domElement.addEventListener('click', handleClick)

    // 桌面端启动
    const code = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'KeyB',
      'KeyA',
    ]

    const input = []

    window.addEventListener('keydown', (e) => {
      input.push(e.code)

      if (input.join('').endsWith(code.join(''))) {
        console.warn('触发彩蛋')
        // 触发彩蛋
      }
    })
  }
})

// 组件卸载时移除监听
onBeforeUnmount(() => {
  renderer.domElement.removeEventListener('click', handleClick)
})
</script>

<template>
  <div>
    <RightMenu />
    <section class="hero-section">
      <!-- 动态背景容器 -->
      <div ref="canvasContainer" class="background-canvas" />

      <!-- 内容层 -->
      <div class="content-layer">
        <!-- 个人品牌区 -->
        <div class="branding">
          <div class="animated-logo">
            <!-- 使用 SVG 制作科技感 logo -->
            <svg viewBox="0 0 120 120" class="logo-svg">
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
            <span class="gradient-text select-none">Alex Wang</span>
            <span class="subtitle select-none">Full Stack Developer (〃▽〃)</span>
          </h1>
        </div>

        <!-- 动态技能标签云 -->
        <div class="skill-cloud">
          <div
            v-for="(skill, index) in skills"
            :key="index"
            class="skill-tag select-none"
            :style="getTagStyle(index)"
          >
            {{ skill }}
          </div>
        </div>

        <!-- CTA 按钮组 -->
        <div class="cta-group">
          <NuxtLink to="/projects" class="cta-button glow-effect">
            <Icon name="ph:rocket-launch" class="icon" />
            View some project
          </NuxtLink>
          <NuxtLink to="/chat" class="cta-button secondary">
            <Icon name="ph:chat-circle-dots" class="icon" />
            Chat with my kitty
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="mx-5 md:mx-20">
      <LazySimpleTextBlock
        title="Record the bits and pieces of life"
        description="I will occasionally update this space with articles and photos (when I'm not feeling lazy (￣▽￣*)ゞ)."
      />
    </div>

    <div class="mx-5 md:mx-20">
      <LazySimpleImgTextBlock
        image-src="/image.jpg"
        title="The auspicious kitty confers heavenly grace upon thee."
        description="The homepage showcases an intentional felinomorphic design system, with stochastic pattern arrangements that may require user experience calibration regarding visual density perception."
        layout="right"
        image-size="small"
      />
    </div>

    <div class="mx-5 mt-20 md:mx-10 md:mt-20">
      <LazySimpleRightTextBlock
        title="Luminous whispers of moonlight brush tenderly across the veil of night."
        description="This digital realm weaves lunar motifs with feline companions, but may their cosmic charm not overwhelm your senses."
      />
    </div>

    <div class="mx-5 mt-20 md:mx-20">
      <LazySimpleTextBlockTemp
        title="Some favorite things"
        description="In addition to furry cats and the moon in the sky, I also like the following..."
      />
    </div>
    <!-- 六卡片 -->
    <div class="mx-5 md:mx-20">
      <LazySimpleSixCard />
    </div>

    <div class="mx-5 mt-20 md:mx-20">
      <LazySimpleTextBlockTemp
        title="What's new lately"
        description="Maybe they’ve posted a new blog entry, or maybe they’ve shared some fun new photos."
      />
    </div>

    <div class="mx-5 md:mx-20">
      <LazySimpleFourCard />
    </div>

    <!-- 自定义参数示例 -->
    <!-- <Divider
      color="rgb(229 231 235)"
      spacing="0 20px"
      custom-class="my-custom-divider"
    /> -->
    <div class="mx-5 h-100 flex md:mx-20">
      <LazySimpleTextBlockContent
        style="transform: translate(-50%);margin-top: 125px;width: 100%;"
        class="absolute left-50% mt-150 transform"
        title="Blank  of  end"
        description="Reserve an expanse of purposeful negative space here to cultivate visual elegance"
      />

      <LazySimpleStartBg />
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
}
.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}
.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}

/* 新增点击反馈效果 */
.background-canvas {
  cursor: url('/pointer.svg'), pointer !important;
  transition: transform 0.3s ease;
}

.background-canvas:active {
  transform: scale(0.98);
}
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
