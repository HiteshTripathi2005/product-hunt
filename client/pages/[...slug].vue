<template>
  <div>
    <!-- This page handles unmatched routes -->
    <h1>Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <NuxtLink to="/">Go Home</NuxtLink>
  </div>
</template>

<script setup>
// Handle .well-known and other unmatched routes silently
const route = useRoute();

// If it's a .well-known request, just return empty response
if (route.path.startsWith("/.well-known/")) {
  // Don't render anything for .well-known requests
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
  });
}
</script>
