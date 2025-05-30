<template>
  <div>
    <AppLoader v-if="!isInitialized" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { isInitialized } = useAuth();
</script>
