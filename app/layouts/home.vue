<template>
  <main class="min-h-screen flex flex-col pt-20 text-center">
    <Header />
    <div class="ml-10 mr-10 flex-1">
      <slot />
    </div>
    <Message />
    <SimpleBackTop />
    <Footer />
  </main>
</template>
