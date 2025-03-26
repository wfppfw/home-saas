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

// 流星逻辑
const meteors = ref([])
let meteorTimer = null

function generateMeteor() {
  // 极坐标算法生成随机轨迹
  const radius = Math.random() * 50 + 120 // 轨迹半径 120-170px
  const angle = Math.random() * Math.PI * 2 // 随机方向角 0-2π
  const speed = Math.random() * 2 + 1 // 速度 1-3s

  // 随机选择起始边（扩展20%安全边距）
  const side = Math.random() > 0.5 ? 'vertical' : 'horizontal'
  let startX, startY

  if (side === 'vertical') {
    startX = Math.random() > 0.5 ? -20 : 120 // 垂直方向左右延伸
    startY = Math.random() * 140 - 20 // y轴扩展至±20%
  }
  else {
    startY = Math.random() > 0.5 ? -20 : 120 // 水平方向上下延伸
    startX = Math.random() * 140 - 20
  }

  // 极坐标转直角坐标计算终点
  const endX = startX + Math.cos(angle) * radius
  const endY = startY + Math.sin(angle) * radius

  return {
    id: Date.now() + Math.random(),
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    length: Math.random() * 150 + 100, // 增加长度随机性
    duration: speed,
    delay: Math.random() * 3, // 降低延迟上限增强密集度
    angle: angle * 180 / Math.PI, // 转换为CSS角度单位
  }
}

function addMeteor() {
  if (meteors.value.length < 2) {
    meteors.value.push(generateMeteor())
  }
}

function removeMeteor(id) {
  meteors.value = meteors.value.filter(m => m.id !== id)
}

// 样式生成方法
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

function meteorStyle(meteor) {
  const angle = Math.atan2(
    meteor.end.y - meteor.start.y,
    meteor.end.x - meteor.start.x,
  ) * 180 / Math.PI

  return {
    '--length': meteor.length,
    'left': `${meteor.start.x}%`,
    'top': `${meteor.start.y}%`,
    'width': `${meteor.length}px`,
    'transform': `rotate(${angle}deg)`,
    'animation': `meteor-fly ${meteor.duration}s linear ${meteor.delay}s forwards`,
  }
}
// 控制参数 [[4]]
const baseProbability = 0.8 // 基础生成概率（25%/次）
const maxMeteors = 5 // 同屏最大流星数

// 生命周期
onMounted(() => {
  meteorTimer = setInterval(() => {
    if (meteors.value.length >= maxMeteors)
      return

    // 概率判定（伯努利试验）
    if (Math.random() < baseProbability) {
      addMeteor()
    }
  }, 1000) // 基础时间单位1秒
})

onUnmounted(() => {
  clearInterval(meteorTimer)
})

// 路由方法
function handleBack() {
  router.push('/')
}
</script>

<template>
  <div class="bg-space relative min-h-screen overflow-hidden">
    <!-- 流星 -->
    <div
      v-for="meteor in meteors"
      :key="meteor.id"
      class="meteor"
      :style="meteorStyle(meteor)"
      @animationend="() => removeMeteor(meteor.id)"
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
.meteor {
  /* 新增角度变量 */
  --angle: 0deg;
  transform: rotate(var(--angle)) translateX(0);
}

@keyframes meteor-fly {
  to {
    transform: rotate(var(--angle)) translateX(calc(var(--length) * -1px));
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

/* 星星 */
.star {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 9999px;
  animation: pulse 1s infinite;
}

.unselectable {
  -webkit-user-select: none; /* Safari/Chrome */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none; /* 标准属性 */
}

/* 主容器 */
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
/* 月球 */
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

/* 陨石坑 */
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

/* 火箭 */
.rocket-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 320px; /* 明确轨道直径 */
  height: 320px;
  transform: translate(-50%, -50%);
  transform-origin: center center; /* 确保以月球为中心旋转 */
  z-index: -1;
}
.rocket-container {
  position: absolute;
  top: 9%; /* 从轨道顶部开始 */
  left: 80%; /* 水平居中 */

  width: 12rem; /* 月球直径 + 火箭轨道直径 */
  height: 12rem;
  transform: translate(-50%, -50%); /* 中心定位 */
  animation: orbit 8s linear infinite;

  transform-origin: left center; /* 设置旋转中心 */
}
.rocket {
  font-size: 2.25rem;
  line-height: 1;
  transform: rotate(90deg); /* 初始方向调整 */
  /* animation: maintain-orientation 8s linear infinite; */
  transform-origin: center center;

  /* animation: float 3s ease-in-out infinite; */
}
/* 新增加的关键帧动画 */
@keyframes orbit {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@keyframes maintain-orientation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  } /* 抵消轨道旋转 */
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(-90deg);
  }
  50% {
    transform: translateY(-20px) rotate(-90deg);
  }
}

/* 文字 */
.text-content {
  text-align: center;
  margin-bottom: 2rem;
}
/* .title {
  font-size: 6rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background-image: linear-gradient(to right, #e2e8f0 0%, #f1f5f9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
} */

.gradient-text {
  /* 基础样式保持不变 */
  font-size: 6rem;
  font-weight: 700;
  background: linear-gradient(
    90deg,
    #ff006e,
    /* 更鲜艳的品红 */ #fb5607,
    /* 亮橙色 */ #ff006e,
    /* 重复增强效果 */ #8338ec,
    /* 添加紫色 */ #3a86ff,
    /* 亮蓝色 */ #80ffdb /* 霓虹绿 */
  );
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

  /* 添加伪元素光效 */
  &::before {
    content: '';
    position: absolute;
    inset: -5px;
    background: inherit;
    filter: blur(20px);
    opacity: 0.4;
    z-index: -1;
  }

  /* 添加动态边框 */
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #ff006e 20%, #3a86ff 50%, #80ffdb 80%);
    z-index: -1;
    opacity: 0.8;
    animation: borderSpark 1.5s linear infinite;
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    padding: 2px;
    border-radius: 4px;
  }
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

@keyframes borderSpark {
  0% {
    opacity: 0.6;
    filter: hue-rotate(0deg);
  }
  50% {
    opacity: 1;
    filter: hue-rotate(180deg);
  }
  100% {
    opacity: 0.6;
    filter: hue-rotate(360deg);
  }
}

.description {
  font-size: 0.75rem;
  /* line-height: 1.75; */
  color: #cbd5e1;
  padding: 0 1rem;
}

/* 按钮 */
.back-button {
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

/* 动画 */
@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.2;
  }
}
@keyframes spin-20 {
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
@keyframes texture-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes meteor-fly {
  0% {
    opacity: 1;
    transform: rotate(var(--angle)) translateX(0);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(var(--angle)) translateX(calc(var(--length) * -1px));
  }
}

/* 流星样式 */
.meteor {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.7) 20%, transparent 100%);
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.5));
  opacity: 0;
}
</style>
