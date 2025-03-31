<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'clean',
})
const router = useRouter()

// 星星数据
const stars = Array.from({ length: 55 }, () => ({
  size: Math.random() * 2 + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: `${Math.random() * 3 + 1}s`,
}))

// 陨石坑数据
const craters = Array.from({ length: 18 }, () => {
  const size = Math.random() * 30 + 10
  return {
    size,
    x: Math.random() * 90,
    y: Math.random() * 90,
    scale: 0.8 + Math.random() * 0.4,
    border: Math.random() > 0.5,
    shiftX: Math.random() * 8 - 4,
    shiftY: Math.random() * 8 - 4,
  }
})

// 流星功能
const meteors = ref([])
let clickCooldown = false

function createMeteor(x, y) {
  // 根据点击位置生成基础角度
  const baseAngle = x < 50
    ? Math.random() * 30 - 60 // 左侧：-60° ~ -30°
    : Math.random() * 30 - 120 // 右侧：-120° ~ -90°

  return {
    id: Date.now() + Math.random(),
    x: x - Math.random() * 5, // 横向偏移 ±5%
    y: y - Math.random() * 10, // 纵向偏移 ±10%
    length: Math.random() * 100 + 150,
    angle: baseAngle,
    duration: Math.random() * 0.8 + 0.5,
    flip: Math.random() > 0.5, // 50%概率镜像翻转
  }
}

function handleClick(e) {
  if (clickCooldown)
    return

  clickCooldown = true
  setTimeout(() => clickCooldown = false, 500) // 500ms防抖

  const rect = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100

  // 安全区域判断（中心35-65%宽度，40-60%高度）
  const isSafeZone = !(x > 35 && x < 65 && y > 40 && y < 60)

  if (isSafeZone) {
    const meteor = createMeteor(x, y)
    meteors.value.push(meteor)
  }
}

// 样式生成方法
function meteorStyle(meteor) {
  return {
    '--angle': `${meteor.angle}deg`,
    '--length': `${meteor.length}px`,
    'left': `${meteor.x}%`,
    'top': `${meteor.y}%`,
    'animation-duration': `${meteor.duration}s`,
    'z-index': 5,
  }
}

function starStyle(star) {
  return {
    width: `${star.size}px`,
    height: `${star.size}px`,
    left: `${star.x}%`,
    top: `${star.y}%`,
    animationDuration: star.duration,
  }
}

function craterStyle(crater) {
  return {
    width: `${crater.size}px`,
    height: `${crater.size}px`,
    left: `${crater.x}%`,
    top: `${crater.y}%`,
    transform: `scale(${crater.scale})`,
  }
}

function shadowStyle(crater) {
  return {
    width: `${crater.size / 2}px`,
    height: `${crater.size / 2}px`,
    left: `${crater.shiftX}px`,
    top: `${crater.shiftY}px`,
  }
}

function handleBack() {
  router.push('/')
}

onMounted(() => {
  window.addEventListener('click', handleClick)
})

onUnmounted(() => {
  meteors.value = [] // 确保卸载后不再保留引用
  window.removeEventListener('click', handleClick)
})
</script>

<template>
  <div class="bg-space relative min-h-screen overflow-hidden" @click="handleClick">
    <!-- 流星 -->
    <div
      v-for="meteor in meteors"
      :key="meteor.id"
      class="meteor"
      :style="meteorStyle(meteor)"
      :class="{ mirror: meteor.flip }"
      @animationend="() => {
        if (meteors.value && Array.isArray(meteors.value)) {
          meteors.value = meteors.value.filter(m => m.id !== meteor.id)
        }
      }"
    />

    <!-- 动态星星 -->
    <div
      v-for="(star, index) in stars"
      :key="`star-${index}`"
      class="star"
      :style="starStyle(star)"
    />

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 月球容器 -->
      <div class="lunar-container">
        <!-- 月球主体 -->
        <div class="moon">
          <!-- 陨石坑 -->
          <div
            v-for="(crater, index) in craters"
            :key="`crater-${index}`"
            class="crater"
            :class="{ 'has-border': crater.border }"
            :style="craterStyle(crater)"
          >
            <div class="crater-shadow" :style="shadowStyle(crater)" />
          </div>
        </div>

        <!-- 环绕火箭 -->
        <div class="rocket-orbit">
          <div class="rocket-container">
            <div class="rocket unselectable">
              🚀
            </div>
          </div>
        </div>
      </div>

      <!-- 文字内容 -->
      <div class="text-content cursor-my-pointer gradient-text">
        <h1 class="unselectable cursor-my-pointer">
          404
        </h1>
        <p class="description">
          糟糕，页面在月球背面失踪了！
          你可能进入了未知的环形山...
        </p>
      </div>

      <!-- 返回按钮 -->
      <button class="back-button unselectable cursor-my-pointer" @click="handleBack">
        返回地球基地
      </button>
    </div>
  </div>
</template>

<style scoped>
.unselectable {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 10;
}
.lunar-container {
  margin-bottom: 20px;
}
.rocket {
  font-size: 2.25rem;
  line-height: 1;
  transform: rotate(90deg);
}
/* 流星样式 */
.meteor {
  position: absolute;
  height: 2px;
  width: var(--length);
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 80%);
  transform: rotate(var(--angle));
  transform-origin: left center;
  pointer-events: none;
  animation: meteor-fly linear forwards;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
}

.meteor.mirror {
  transform: rotate(var(--angle)) scaleX(-1);
}

@keyframes meteor-fly {
  0% {
    opacity: 1;
    transform: rotate(var(--angle)) translateX(0);
  }
  100% {
    opacity: 0;
    transform: rotate(var(--angle)) translateX(calc(var(--length) * -1));
  }
}

/* 基础样式 */
.min-h-screen {
  min-height: 100vh;
}
.bg-space {
  background-color: #020617;
}
.relative {
  position: relative;
}
.overflow-hidden {
  overflow: hidden;
}

/* 星星动画 */
.star {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 9999px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.2;
  }
}

/* 月球样式 */
.moon {
  width: 12rem;
  height: 12rem;
  border-radius: 9999px;
  background: linear-gradient(to bottom, #475569 0%, #94a3b8 100%);
  box-shadow: 0 20px 25px -5px rgb(71 85 105 / 0.5);
  position: relative;
  overflow: hidden;
}

.moon::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.3;
  background: repeating-radial-gradient(circle at 50% 50%, transparent 0 5px, rgba(255, 255, 255, 0.05) 5px 10px);
  animation: texture-rotate 60s linear infinite;
}

/* 陨石坑样式 */
.crater {
  position: absolute;
  border-radius: 9999px;
  background-color: rgba(148, 163, 184, 0.3);
}
.has-border {
  border: 2px solid rgba(148, 163, 184, 0.4);
}
.crater-shadow {
  position: absolute;
  border-radius: 9999px;
  background-color: rgba(71, 85, 105, 0.4);
}

/* 火箭动画 */
.rocket-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 320px;
  height: 320px;
  transform: translate(-50%, -50%);
  transform-origin: center center;
  z-index: -1;
}

.rocket-container {
  position: absolute;
  top: 6%;
  left: 80%;
  width: 12rem;
  height: 12rem;
  transform: translate(-50%, -50%);
  animation: orbit 8s linear infinite;
  transform-origin: left center;
}

@keyframes orbit {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* 文字效果 */
.gradient-text {
  font-size: 6rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ff006e, #fb5607, #ff006e, #8338ec, #3a86ff, #80ffdb);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  cursor: pointer;
  position: relative;
  transition:
    transform 0.3s ease,
    filter 0.5s ease;
  animation: gradientFlow 4s linear infinite paused;
}

.gradient-text:hover {
  animation-play-state: running;
  transform: scale(1.05) rotate(-1deg);
  filter: drop-shadow(0 0 10px rgba(255, 0, 110, 0.7)) drop-shadow(0 0 20px rgba(56, 236, 131, 0.5))
    drop-shadow(0 0 30px rgba(58, 134, 255, 0.3));
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 其他通用样式 */
.unselectable {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 10;
}

.description {
  font-size: 0.75rem;
  color: #cbd5e1;
  padding: 0 1rem;
}

.back-button {
  margin-top: 3rem;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  background: linear-gradient(to right, #3b82f6 0%, #6366f1 100%);
  color: white;
  font-weight: 600;
  transition: transform 0.3s;
  box-shadow: 0 20px 25px -5px rgb(59 130 246 / 0.3);
  cursor: pointer;
  border: none;
  outline: none;
}

.back-button:hover {
  transform: scale(1.05);
}
.back-button:active {
  transform: scale(0.98);
}

@keyframes texture-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
