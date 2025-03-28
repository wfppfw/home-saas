<!-- components/RightClickMenu.vue -->
<script setup>
// const { isDark } = useTheme() // 假设使用 useTheme() 管理主题

import { useDark, useToggle } from '@vueuse/core'

const isDark = ref(true)

function toggleDark() {
  const root = document.documentElement
  isDark.value = root.classList.contains('dark')

  if (isDark.value) {
    root.classList.remove('dark')
  }
  else {
    root.classList.add('dark')
  }
  localStorage.setItem('theme', isDark.value ? 'light' : 'dark')
}

function changeMode() {
  toggleDark()
}

const menuRef = ref(null)
const isVisible = ref(false)
const position = reactive({ x: 0, y: 0 })

const savedSelection = ref(null)

// 菜单项配置
const menuItems = [
  {
    icon: '📋',
    label: '复制',
    action: () => {
      let text = ''
      // 优先使用保存的选区
      if (savedSelection.value) {
        const range = savedSelection.value.cloneRange()
        text = range.toString()
      }
      // 备用方案：表单控件处理
      else {
        const activeEl = document.activeElement
        if (activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA') {
          text = activeEl.value.slice(
            activeEl.selectionStart,
            activeEl.selectionEnd,
          )
        }
      }

      if (text) {
        navigator.clipboard.writeText(text)
      }
      else {
        console.warn('没有选中的文本')
      }
    },

  },
  {
    icon: '🔄',
    label: '刷新',
    action: () => location.reload(),
  },
  {
    icon: '⬅️',
    label: '返回',
    action: () => history.back(),
  },
  {
    icon: '➡️',
    label: '前进',
    action: () => history.forward(),
  },
  // {
  //   icon: '🌓',
  //   label: '切换主题',
  //   action: () => changeMode(),
  // },
  // 推荐添加的实用功能：

  //   {
  //     icon: '🌐',
  //     label: '翻译',
  //     action: () => {
  //       const text = window.getSelection().toString()
  //       window.open(`https://translate.google.com/?text=${encodeURIComponent(text)}`)
  //     },
  //   },

  {
    icon: '⬆️',
    label: '回到顶部',
    action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  },

  {
    icon: '🛠️',
    label: '检查 ( 请按F12 )',
    action: () => {},
  },

  // {
  //   icon: '🔍',
  //   label: '页面搜索',
  //   action: () => {
  //     if (typeof window.__NUXT__?.$search === 'function') {
  //       window.__NUXT__.$search()
  //     }
  //   },
  // },

  // {
  //   icon: '📌',
  //   label: '添加书签',
  //   action: () => window.external.AddFavorite(location.href, document.title),
  // },
]

// 新增视口尺寸跟踪
const viewport = reactive({
  width: 0,
  height: 0,
})

// 计算菜单位置
const menuPosition = computed(() => ({
  left: `${position.x}px`,
  top: `${position.y}px`,
}))

// 优化后的显示菜单方法
function showMenu(e) {
  e.preventDefault()
  isVisible.value = true

  // 保存当前文本选区
  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    savedSelection.value = selection.getRangeAt(0)
  }

  nextTick(() => {
    // 获取视口尺寸
    viewport.width = window.innerWidth
    viewport.height = window.innerHeight

    // 获取菜单尺寸
    const menuRect = menuRef.value.getBoundingClientRect()
    const menuWidth = menuRect.width
    const menuHeight = menuRect.height

    // 初始坐标
    let x = e.clientX
    let y = e.clientY

    // 水平方向调整
    if (x + menuWidth > viewport.width) {
      x = Math.max(0, x - menuWidth)
    }

    // 垂直方向调整
    if (y + menuHeight > viewport.height) {
      y = Math.max(0, y - menuHeight)
    }

    // 应用修正后的坐标
    position.x = x
    position.y = y
  })
}

// 隐藏菜单
function hideMenu() {
  isVisible.value = false
}

// 点击外部关闭
function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    hideMenu()
  }
}

// 处理操作
function handleAction(action) {
  action()
  hideMenu()
}

onMounted(() => {
  document.addEventListener('contextmenu', showMenu)
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', hideMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('contextmenu', showMenu)
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', hideMenu)
})
</script>

<template>
  <ClientOnly>
    <div

      v-if="isVisible"
      ref="menuRef"
      class="custom-context-menu"
      :style="menuPosition"
      :class="{ 'dark-mode': isDark }"
    >
      <div
        v-for="(item, index) in menuItems"
        :key="item.label"
        class="menu-item"
        @click="handleAction(item.action)"
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="label">{{ item.label }}</span>
        <div v-if="index < menuItems.length - 1" class="divider" />
      </div>
    </div>
  </ClientOnly>
</template>

  <style scoped>
.custom-context-menu {
  /* 确保菜单不会超出视口 */
  max-height: calc(100vh - 20px);
  overflow-y: auto;
  /* 添加最小间距保护 */
  margin: 10px;
}

.custom-context-menu {
  position: fixed;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 180px;
  z-index: 9999;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.menu-item:hover {
  background: #f5f5f5;
}

.icon {
  margin-right: 12px;
  font-size: 14px;
}

.label {
  font-size: 14px;
  color: #333;
}

.divider {
  position: absolute;
  bottom: -4px;
  left: 16px;
  right: 16px;
  height: 1px;
  background: #eee;
}

/* 暗色模式 */
.dark-mode {
  background: #2d2d2d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .label {
  color: #fff;
}

.dark-mode .menu-item:hover {
  background: #3d3d3d;
}

.dark-mode .divider {
  background: #404040;
}
</style>
