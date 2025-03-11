<script setup lang="ts">
const isDark = ref()

onMounted(() => {
  const root = document.documentElement
  isDark.value = root.classList.contains('dark')
})
function toggleDark() {
  const root = document.documentElement
  isDark.value = root.classList.contains('dark')
  root.classList.remove(isDark.value ? 'dark' : '-')
  root.classList.add(isDark.value ? '-' : 'dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
function toggleViewTransition(event: MouseEvent) {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${endRadius}px at ${x}px ${y}px)`,
  ]

  const transition = document.startViewTransition(async () => {
    toggleDark()
    await nextTick()
  })

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}

function toogleTheme(event: MouseEvent) {
  const isSupport
    = document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isSupport) {
    toggleDark()
    return
  }
  toggleViewTransition(event)
}
</script>

<template>
  <div
    title="Toggle Color Scheme"
    @click="toogleTheme"
  >
    <Icon name="ph:sun-bold" class="size-6 shrink-0" :color="isDark === true ? 'yellow' : 'white'" />
  </div>
</template>

<style>

</style>
