<template>
  <div
    class="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <div class="flex flex-col items-center space-y-4">
      <Logo :size="48" />
      <div class="flex items-center space-x-2">
        <div
          class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup></script>
