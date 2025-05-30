<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <AppLoader size="lg" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">{{ error }}</div>
      <Button @click="fetchUserProfile()">Try Again</Button>
    </div>

    <!-- Profile Content -->
    <div v-else-if="user">
      <!-- Profile Header -->
      <div
        class="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 mb-8"
      >
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <!-- Avatar -->
          <div class="relative">
            <div
              class="w-24 h-24 rounded-full overflow-hidden border-4 border-border/20"
            >
              <img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="w-full h-full object-cover"
                @error="handleAvatarError"
              />
              <div
                v-else
                class="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold"
              >
                {{ user.name?.charAt(0)?.toUpperCase() || "U" }}
              </div>
            </div>
          </div>

          <!-- User Info -->
          <div class="flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center mb-4">
              <div>
                <h1 class="text-2xl font-bold text-foreground">
                  {{ user.name }}
                </h1>
                <p class="text-muted-foreground">{{ user.email }}</p>
              </div>
            </div>

            <!-- Bio -->
            <p v-if="user.bio" class="text-foreground mb-4">{{ user.bio }}</p>

            <!-- Stats -->
            <div class="flex flex-col md:flex-row gap-1 md:gap-6 text-sm">
              <div class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span class="font-medium">{{ totalProducts }}</span>
                <span class="text-muted-foreground">Products</span>
              </div>

              <div class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span class="font-medium">{{ totalUpvotes }}</span>
                <span class="text-muted-foreground">Upvoted</span>
              </div>

              <div class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span class="text-muted-foreground"
                  >Joined {{ formatJoinDate(user.createdAt) }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-border mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="setActiveTab('products')"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'products'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
            ]"
          >
            Products ({{ totalProducts }})
          </button>

          <button
            @click="setActiveTab('upvoted')"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'upvoted'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
            ]"
          >
            Upvoted ({{ totalUpvotes }})
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Products Tab -->
        <div v-if="activeTab === 'products'">
          <!-- Add Product Button (only for own profile) -->
          <div
            v-if="isOwnProfile && userProducts.length === 0"
            class="text-center py-12"
          >
            <svg
              class="w-16 h-16 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 class="text-lg font-medium text-foreground mb-2">
              No products yet
            </h3>
            <p class="text-muted-foreground mb-6">
              Share your amazing products with the community!
            </p>
            <Button @click="$router.push('/create')">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Your First Product
            </Button>
          </div>

          <!-- Products Grid -->
          <div
            v-else-if="userProducts.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ProductCard
              v-for="product in userProducts"
              :key="product._id"
              :product="product"
              @click="$router.push(`/products/${product._id}`)"
            />
          </div>

          <!-- Empty State for Other Users -->
          <div v-else class="text-center py-12">
            <svg
              class="w-16 h-16 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 class="text-lg font-medium text-foreground mb-2">
              No products yet
            </h3>
            <p class="text-muted-foreground">
              {{ user.name }} hasn't shared any products yet.
            </p>
          </div>
        </div>

        <!-- Upvoted Tab -->
        <div v-if="activeTab === 'upvoted'">
          <!-- Upvoted Products Grid -->
          <div
            v-if="upvotedProducts.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ProductCard
              v-for="product in upvotedProducts"
              :key="product._id"
              :product="product"
              @click="$router.push(`/products/${product._id}`)"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg
              class="w-16 h-16 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
            <h3 class="text-lg font-medium text-foreground mb-2">
              No upvoted products
            </h3>
            <p class="text-muted-foreground">
              {{
                isOwnProfile
                  ? "You haven't upvoted any products yet."
                  : `${user.name} hasn't upvoted any products yet.`
              }}
            </p>
            <Button
              v-if="isOwnProfile"
              variant="outline"
              @click="$router.push('/')"
              class="mt-4"
            >
              Discover Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard.vue";

// Route params
const route = useRoute();
const userId = route.params.id;

// Use the user profile composable
const {
  user,
  userProducts,
  upvotedProducts,
  isLoading,
  error,
  activeTab,
  isOwnProfile,
  totalProducts,
  totalUpvotes,
  fetchUserProfile,
  setActiveTab,
  formatJoinDate,
} = useUserProfile(userId);

// Methods
const handleAvatarError = () => {
  // Handle avatar loading error
};

// Meta tags
useHead({
  title: computed(() =>
    user.value ? `${user.value.name} - Profile` : "Profile"
  ),
  meta: [
    {
      name: "description",
      content: computed(() =>
        user.value
          ? `View ${user.value.name}'s profile and products`
          : "User profile"
      ),
    },
  ],
});

// Fetch user profile on mount
onMounted(() => {
  fetchUserProfile(userId);
});
</script>
