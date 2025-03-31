<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const videoSrc = '/video/1.mp4' // 替换为实际视频地址

// 响应式状态
const isTheaterMode = ref(false)
const showCustomControls = ref(false)
const isPlaying = ref(false)
const isMuted = ref(true)
const currentTime = ref(0)
const videoDuration = ref(0)
const currentProgress = ref(0)
const controlsTimer = ref(null)
const videoPlayer = ref(null)

// 进入剧场模式
async function enterTheaterMode() {
  isTheaterMode.value = true
  await nextTick()
  try {
    // 尝试自动播放（需静音）
    await videoPlayer.value.play()
    isPlaying.value = true
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log('自动播放被阻止:', error)
  }
  startControlsTimer()
}

// 退出剧场模式
function exitTheaterMode() {
  isTheaterMode.value = false
  videoPlayer.value.pause()
  resetVideoState()
}

// 重置视频状态
function resetVideoState() {
  isPlaying.value = false
  currentTime.value = 0
  videoDuration.value = 0
  currentProgress.value = 0
}

// 播放/暂停切换
function togglePlay() {
  if (videoPlayer.value.paused) {
    videoPlayer.value.play()
    isPlaying.value = true
  }
  else {
    videoPlayer.value.pause()
    isPlaying.value = false
  }
  // showCustomControls.value = true
  startControlsTimer()
}

// 静音切换
function toggleMute() {
  isMuted.value = !isMuted.value
  videoPlayer.value.muted = isMuted.value
}

// 进度条拖动
function seekVideo(e) {
  const seekTime = (e.target.value / 100) * videoDuration.value
  videoPlayer.value.currentTime = seekTime
}

// 更新时间显示
function updateProgress() {
  currentTime.value = videoPlayer.value.currentTime
  currentProgress.value = (currentTime.value / videoDuration.value) * 100 || 0
}

// 格式化时间显示
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

// 控制条自动隐藏逻辑
function startControlsTimer() {
  clearTimeout(controlsTimer.value)
  controlsTimer.value = setTimeout(() => {
    showCustomControls.value = false
  }, 3000)
}

// 初始化视频元数据
onMounted(() => {
  videoPlayer.value.addEventListener('loadedmetadata', () => {
    videoDuration.value = videoPlayer.value.duration
  })
})

// 清理定时器
onBeforeUnmount(() => {
  clearTimeout(controlsTimer.value)
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
})
</script>

<template>
  <div>
    <!-- 触发按钮 -->
    <button @click="enterTheaterMode">
      开始沉浸式播放
    </button>

    <!-- 伪全屏容器   @mousemove="showCustomControls = true" -->
    <div
      v-show="isTheaterMode"
      class="theater-container"

      @mouseleave="startControlsTimer"
    >
      <!-- 视频元素 -->
      <video
        ref="videoPlayer"
        class="theater-video"
        :src="videoSrc"
        :muted="isMuted"
        preload="auto"
        playsinline
        webkit-playsinline
        @timeupdate="updateProgress"
        @click="togglePlay"
      />

      <!-- 自定义控制条 -->

      <transition name="fade">
        <div v-show="showCustomControls" class="custom-controls">
          <!-- 进度条 -->
          <div class="progress-container">
            <input
              v-model="currentProgress"
              type="range"
              class="progress-bar"
              min="0"
              :max="videoDuration"
              @input="seekVideo"
            >
          </div>

          <!-- 控制区 -->
          <div class="control-bar">
            <div class="left-controls">
              <button @click="togglePlay">
                {{ isPlaying ? '⏸' : '▶' }}
              </button>
              <span class="time-display">
                {{ formatTime(currentTime) }} / {{ formatTime(videoDuration) }}
              </span>
            </div>

            <div class="right-controls">
              <button @click="toggleMute">
                {{ isMuted ? '🔇' : '🔊' }}
              </button>
              <button @click="exitTheaterMode">
                ⨉
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* 剧场模式容器 */
.theater-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

/* 视频元素样式 */
.theater-video {
  width: 100%;
  height: calc(100vh - 60px); /* 留出控制条空间 */
  object-fit: contain;
  cursor: pointer;
}

/* 自定义控制条 */
.custom-controls {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 20px 15px 10px;
  position: absolute;
  bottom: 0;
  width: 100%;
  transition: opacity 0.3s;
}

/* 进度条样式 */
.progress-container {
  width: 100%;
  padding: 5px 0;
}

.progress-bar {
  width: 100%;
  height: 5px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

/* 控制栏布局 */
.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.left-controls,
.right-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 按钮样式 */
button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  padding: 5px;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.8;
}

/* 时间显示 */
.time-display {
  color: white;
  font-family: monospace;
  font-size: 0.9em;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
