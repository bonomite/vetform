<script setup>
onMounted(async () => {
  await getAndSetUserProfile()
})
</script>
<template>
  <div>
    <div class="app">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <Toast />
    </div>
  </div>
</template>
