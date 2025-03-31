<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  videos: {
    type: Array,
    required: true,
    validator: list => list.every(item =>
      item.src && item.id && (!item.actions || item.actions.every(action =>
        action.text && action.nextVideoId,
      )),
    ),
  },
  initialVideoId: {
    type: String,
    required: true,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'play',
  'pause',
  'timeupdate',
  'ended',
  'enter-theater',
  'exit-theater',
  'video-change',
])

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
const currentVideoId = ref(props.initialVideoId)
const showEndActions = ref(false)
const errorMessage = ref('')

const currentVideo = computed(() =>
  props.videos.find(v => v.id === currentVideoId.value) || props.videos[0],
)

// 暴露方法
defineExpose({
  play: () => videoPlayer.value?.play(),
  pause: () => videoPlayer.value?.pause(),
  enterTheaterMode,
  exitTheaterMode,
  setCurrentTime: (time) => { videoPlayer.value.currentTime = time },
})

// 进入剧场模式
async function enterTheaterMode() {
  isTheaterMode.value = true
  emit('enter-theater')
  await nextTick()

  try {
    if (props.autoplay) {
      await videoPlayer.value.play()
      isPlaying.value = true
    }
  }
  catch (error) {
    console.log('Autoplay error:', error)
  }
  startControlsTimer()
}

// 退出剧场模式
function exitTheaterMode() {
  isTheaterMode.value = false
  videoPlayer.value?.pause()
  resetVideoState()
  emit('exit-theater')
}

// 重置视频状态
function resetVideoState() {
  isPlaying.value = false
  currentTime.value = 0
  videoDuration.value = 0
  currentProgress.value = 0
}

// 安全播放方法
async function safePlay() {
  try {
    await videoPlayer.value.play()
    isPlaying.value = true
    errorMessage.value = ''
    emit('play')
  }
  catch (err) {
    console.error('播放失败:', err)
    errorMessage.value = `播放失败：${err.message}`
  }
}

// 播放/暂停切换
function togglePlay() {
  if (!videoPlayer.value)
    return

  if (videoPlayer.value.paused) {
    safePlay()
  }
  else {
    videoPlayer.value.pause()
    isPlaying.value = false
    emit('pause')
  }
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
  emit('timeupdate', currentTime.value)
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

// 视频错误处理
function handleVideoError(e) {
  const errorCode = videoPlayer.value?.error?.code
  const messages = {
    1: '视频加载被中止',
    2: '网络错误导致加载失败',
    3: '视频解码错误',
    4: '视频格式不支持',
  }
  errorMessage.value = messages[errorCode] || '未知视频错误'
}

// 视频结束处理
function handleVideoEnd() {
  if (currentVideo.value.actions?.length) {
    showEndActions.value = true
  }
  emit('ended', currentVideoId.value)
}

// 播放指定视频
function playNextVideo(nextVideoId) {
  const targetVideo = props.videos.find(v => v.id === nextVideoId)
  if (!targetVideo) {
    console.error('找不到指定视频:', nextVideoId)
    return
  }

  showEndActions.value = false
  currentVideoId.value = nextVideoId
  emit('video-change', nextVideoId)
  nextTick(() => {
    videoPlayer.value?.load()
    videoPlayer.value?.play()
  })
}

// 初始化视频元数据
onMounted(() => {
  videoPlayer.value?.addEventListener('loadedmetadata', () => {
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
    <!-- 触发按钮插槽 -->
    <slot name="trigger" :enter-theater="enterTheaterMode">
      <button class="default-trigger" @click="enterTheaterMode">
        开始沉浸式播放
      </button>
    </slot>

    <!-- 剧场模式容器 -->
    <div
      v-show="isTheaterMode"
      class="theater-container"
      @mousemove="showCustomControls = true"
      @mouseleave="startControlsTimer"
    >
      <!-- 视频元素 -->
      <video
        ref="videoPlayer"
        class="theater-video"
        :src="currentVideo.src"
        :muted="isMuted"
        preload="auto"
        playsinline
        webkit-playsinline
        @timeupdate="updateProgress"
        @click="togglePlay"
        @ended="handleVideoEnd"
        @error="handleVideoError"
      />

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
        <button @click="exitTheaterMode">
          关闭
        </button>
      </div>

      <!-- 结束操作区域 -->
      <div v-if="showEndActions" class="end-actions">
        <div
          v-for="(action, index) in currentVideo.actions"
          :key="index"
          class="action-card"
        >
          <button
            class="action-button"
            @click="playNextVideo(action.nextVideoId)"
          >
            {{ action.text }}
          </button>
          <div class="action-description">
            {{ action.description }}
          </div>
        </div>
      </div>

      <!-- 自定义控制条 -->
      <transition name="fade">
        <div v-show="showCustomControls" class="custom-controls">
          <div class="progress-container">
            <input
              v-model.number="currentProgress"
              type="range"
              class="progress-bar"
              min="0"
              :max="100"
              step="0.1"
              @input="seekVideo"
            >
          </div>

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
  z-index: var(--vp-controls-zindex, 9999);
  display: flex;
  flex-direction: column;
}

/* 视频元素样式 */
.theater-video {
  width: 100%;
  height: calc(100vh - 60px);
  object-fit: contain;
  cursor: pointer;
}

/* 自定义控制条 */
.custom-controls {
  background: var(--vp-controls-bg, linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent));
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
  height: var(--vp-progress-height, 5px);
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--vp-progress-thumb-size, 12px);
  height: var(--vp-progress-thumb-size, 12px);
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

/* 错误提示 */
.error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  z-index: 10000;
}

/* 结束操作区域 */
.end-actions {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;
  z-index: 10001;
}

.action-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  min-width: 280px;
  text-align: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.action-card:hover {
  transform: translateY(-5px);
}

.action-button {
  background: #2196f3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.action-button:hover {
  background: #1976d2;
}

.action-description {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
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

/* 默认触发按钮样式 */
.default-trigger {
  padding: 10px 20px;
  background: #2196f3;
  color: white;
  border-radius: 4px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .end-actions {
    flex-direction: column;
    gap: 20px;
    bottom: 60px;
  }

  .action-card {
    min-width: 200px;
    padding: 15px;
  }
}
</style>
