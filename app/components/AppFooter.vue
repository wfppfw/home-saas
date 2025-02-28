<script setup lang="ts">
// const columns = [
//   {
//     label: "Resources",
//     children: [
//       {
//         label: "Help center",
//       },
//       {
//         label: "Docs",
//       },
//       {
//         label: "Roadmap",
//       },
//       {
//         label: "Changelog",
//       },
//     ],
//   },
//   {
//     label: "Features",
//     children: [
//       {
//         label: "Affiliates",
//       },
//       {
//         label: "Portal",
//       },
//       {
//         label: "Jobs",
//       },
//       {
//         label: "Sponsors",
//       },
//     ],
//   },
//   {
//     label: "Company",
//     children: [
//       {
//         label: "About",
//       },
//       {
//         label: "Pricing",
//       },
//       {
//         label: "Careers",
//       },
//       {
//         label: "Blog",
//       },
//     ],
//   },
// ];

// const toast = useToast();

// const email = ref("");
// const loading = ref(false);

// function onSubmit() {
//   loading.value = true;

//   toast.add({
//     title: "Subscribed!",
//     description: "You've been subscribed to our newsletter.",
//   });
// }
</script>

<template>
  <USeparator icon="solar:cat-bold" class="h-px" />
  <UFooter :ui="{ top: 'border-b border-[var(--ui-border)]' }">
    <template #left>
      <p class="text-(--ui-text-muted) text-sm">
        Copyright © {{ new Date().getFullYear() }}. All rights reserved.
      </p>
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        to="https://github.com/nuxt-ui-pro/saas"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
