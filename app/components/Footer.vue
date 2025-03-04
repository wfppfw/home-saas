<!-- AppFooter.vue -->
<script setup>
const darkMode = ref(false)

function toggleTheme() {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  darkMode.value = savedTheme === 'dark'
  document.documentElement.classList.toggle('dark', darkMode.value)
})
</script>

<template>
  <footer class="dark:bg-dark-bg dark:border-dark-border mt-auto border-t border-gray-200 bg-white">
    <div class="mx-auto max-w-1200px flex items-center justify-between px-4 py-4">
      <span class="text-sm opacity-80 dark:opacity-70">
        © 2024 Your Website. All rights reserved.
      </span>

      <div class="flex items-center gap-4">
        <button
          class="rounded-full p-2 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Toggle theme"
          @click="toggleTheme"
        >
          <svg class="h-5 w-5">
            <path
              v-if="!darkMode"
              fill="currentColor"
              d="M12 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6zm0-10c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0-4c-.553 0-1-.447-1-1V2c0-.553.447-1 1-1s1 .447 1 1v1c0 .553-.447 1-1 1zm0 16c-.553 0-1-.447-1-1v-1c0-.553.447-1 1-1s1 .447 1 1v1c0 .553-.447 1-1 1zM5.64 6.64c-.195.195-.512.195-.707 0l-.707-.707c-.195-.195-.195-.512 0-.707s.512-.195.707 0l.707.707c.195.195.195.512 0 .707zM18.36 17.36c-.195.195-.512.195-.707 0l-.707-.707c-.195-.195-.195-.512 0-.707s.512-.195.707 0l.707.707c.195.195.195.512 0 .707zM4 12c0-.553-.447-1-1-1H2c-.553 0-1 .447-1 1s.447 1 1 1h1c.553 0 1-.447 1-1zm18 0c0-.553-.447-1-1-1h-1c-.553 0-1 .447-1 1s.447 1 1 1h1c.553 0 1-.447 1-1zM5.64 17.36c-.195-.195-.195-.512 0-.707l.707-.707c.195-.195.512-.195.707 0s.195.512 0 .707l-.707.707c-.195.195-.512.195-.707 0zM18.36 6.64c-.195-.195-.195-.512 0-.707l.707-.707c.195-.195.512-.195.707 0s.195.512 0 .707l-.707.707c-.195.195-.512.195-.707 0z"
            />
            <path
              v-else
              fill="currentColor"
              d="M20.856 13.6c-.236.66-.556 1.282-.95 1.856a8 8 0 1 1-9.39-9.39c.574-.394 1.196-.714 1.856-.95A10 10 0 0 0 12 22c5.523 0 10-4.477 10-10 0-1.37-.276-2.674-.774-3.864-.236.66-.556 1.282-.95 1.856a8 8 0 0 1 .38 9.608z"
            />
          </svg>
        </button>

        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          class="opacity-80 transition-opacity hover:opacity-100"
        >
          <svg class="h-5 w-5">
            <path
              fill="currentColor"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>
