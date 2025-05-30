<template>
  <div>
    <!-- Redirect to user's profile with their ID -->
    <div v-if="isLoading" class="text-center py-12">
      <AppLoader size="lg" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">{{ error }}</div>
      <Button @click="$router.push('/login')">Login</Button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { Button } from "@/components/ui/button";

// Composables
const { user, isAuthenticated } = useAuth();

// State
const isLoading = ref(true);
const error = ref(null);

// Meta tags
useHead({
  title: "My Profile",
  meta: [
    {
      name: "description",
      content: "View and manage your profile and products",
    },
  ],
});

// Redirect to user's profile page
onMounted(async () => {
  try {
    if (!isAuthenticated.value) {
      error.value = "Please login to view your profile";
      return;
    }

    if (user.value) {
      const userId = user.value.id || user.value._id;
      if (userId) {
        await navigateTo(`/profile/${userId}`);
        return;
      }
    }

    // Wait a bit for auth to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (user.value) {
      const userId = user.value.id || user.value._id;
      if (userId) {
        await navigateTo(`/profile/${userId}`);
        return;
      }
    }

    error.value = "Unable to load profile";
  } catch (err) {
    error.value = "Failed to load profile";
  } finally {
    isLoading.value = false;
  }
});
</script>
