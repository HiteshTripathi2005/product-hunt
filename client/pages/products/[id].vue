<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <AppLoader size="lg" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">{{ error }}</div>
      <Button @click="$router.push('/')">Back to Products</Button>
    </div>

    <!-- Product Content -->
    <div v-else-if="product">
      <!-- Back Navigation -->
      <div class="mb-6">
        <Button variant="ghost" @click="$router.push('/')">
          <span class="mr-2">←</span> Back to Products
        </Button>
      </div>

      <!-- Product Header -->
      <div class="flex flex-col md:flex-row md:items-start mb-8 gap-6">
        <!-- Logo and Basic Info -->
        <div class="flex-shrink-0">
          <img
            :src="product.logo"
            :alt="`${product.name} logo`"
            class="w-32 h-32 rounded-xl object-cover border border-border/20"
            @error="handleImageError"
          />
        </div>

        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <h1
                class="text-3xl font-bold tracking-tight text-foreground mb-2"
              >
                {{ product.name }}
              </h1>
              <p class="text-xl text-muted-foreground mb-4">
                {{ product.tagline }}
              </p>

              <div class="flex flex-wrap gap-2 mb-4">
                <!-- Category Badge -->
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                >
                  {{ product.category }}
                </span>

                <!-- Featured Badge -->
                <span
                  v-if="product.featured"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                >
                  Featured
                </span>
              </div>
            </div>
            <!-- Upvote Button -->
            <div class="flex-shrink-0">
              <button
                @click="handleUpvote"
                class="flex flex-col items-center space-y-1 p-3 rounded-lg border transition-all duration-200"
                :class="[
                  !isAuthenticated
                    ? 'opacity-70 cursor-pointer border-border bg-gray-50 dark:bg-gray-800 hover:opacity-80'
                    : isUpvoted
                    ? 'bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-700 dark:hover:bg-green-900/30'
                    : 'hover:bg-primary/10 border-border',
                ]"
                :title="
                  !isAuthenticated
                    ? 'Login to upvote this product'
                    : isUpvoted
                    ? 'Remove upvote'
                    : 'Upvote this product'
                "
              >
                <!-- Upvote Icon -->
                <svg
                  class="w-6 h-6 transition-colors"
                  :class="
                    !isAuthenticated
                      ? 'text-gray-400'
                      : isUpvoted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground'
                  "
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
                <!-- Upvote Count -->
                <span
                  class="text-sm font-medium transition-colors"
                  :class="
                    !isAuthenticated
                      ? 'text-gray-400'
                      : isUpvoted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground'
                  "
                >
                  {{ product.upvoteCount || 0 }}
                </span>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mt-4">
            <a
              :href="product.websiteUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 h-10"
            >
              Visit Website
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <!-- Product Description -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">About</h2>
        <div class="prose prose-slate dark:prose-invert max-w-none">
          <p class="whitespace-pre-line">{{ product.description }}</p>
        </div>
      </div>
      <!-- Product Images Carousel -->
      <div v-if="product.images && product.images.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Product Images</h2>
        <!-- Carousel -->
        <Carousel
          class="w-full max-w-4xl mx-auto"
          :opts="{
            align: 'start',
            loop: product.images.length > 1,
            skipSnaps: false,
          }"
          @init-api="onCarouselInit"
        >
          <CarouselContent class="-ml-1">
            <CarouselItem
              v-for="(image, index) in product.images"
              :key="index"
              class="pl-1"
            >
              <div
                class="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg"
              >
                <img
                  :src="image"
                  :alt="`${product.name} screenshot ${index + 1}`"
                  class="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
                  @error="handleImageError"
                />

                <!-- Image Counter -->
                <div
                  v-if="product.images.length > 1"
                  class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm"
                >
                  {{ index + 1 }} / {{ product.images.length }}
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <!-- Navigation Buttons (only show if more than 1 image) -->
          <CarouselPrevious
            v-if="product.images.length > 1"
            class="left-4 bg-white/90 hover:bg-white border-0 shadow-lg"
          />
          <CarouselNext
            v-if="product.images.length > 1"
            class="right-4 bg-white/90 hover:bg-white border-0 shadow-lg"
          />
        </Carousel>

        <!-- Thumbnail Navigation (only show if more than 1 image) -->
        <div
          v-if="product.images.length > 1"
          class="flex gap-3 mt-6 overflow-x-auto pb-2 justify-center scrollbar-hide"
        >
          <button
            v-for="(image, index) in product.images"
            :key="index"
            @click="setCarouselIndex(index)"
            class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            :class="
              index === currentImageIndex
                ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                : 'border-border/20 hover:border-border/40 shadow-sm'
            "
          >
            <img
              :src="image"
              :alt="`${product.name} thumbnail ${index + 1}`"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </button>
        </div>
      </div>

      <!-- Product Creator -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Created by</h2>
        <div class="flex items-start gap-4 p-4 border rounded-lg bg-card">
          <div
            class="relative w-12 h-12 rounded-full overflow-hidden border border-border/20"
          >
            <img
              v-if="product.submittedBy?.avatar"
              :src="product.submittedBy.avatar"
              :alt="product.submittedBy.name"
              class="w-full h-full object-cover"
              @error="handleAvatarError"
            />
            <div
              v-else
              class="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-base font-medium"
            >
              {{ product.submittedBy?.name?.charAt(0)?.toUpperCase() || "U" }}
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium">
              {{ product.submittedBy?.name || "Unknown" }}
            </h3>
            <p
              v-if="product.submittedBy?.bio"
              class="text-sm text-muted-foreground mt-1"
            >
              {{ product.submittedBy.bio }}
            </p>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <CommentsSection :product-id="productId" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import CommentsSection from "~/components/CommentsSection.vue";

// Route params
const route = useRoute();
const productId = route.params.id;

// Use the product detail composable
const {
  // State
  product,
  isLoading,
  error,
  imageError,
  avatarError,
  currentImageIndex,
  carouselApi,

  // Computed
  isUpvoted,

  // Methods
  fetchProductDetails,
  handleUpvote,
  handleImageError,
  handleAvatarError,
  onCarouselInit,
  setCarouselIndex,
  resetImageSlider,
} = useProductDetail(productId);

// Composables for authentication
const { isAuthenticated } = useAuth();

// Fetch data on component mount
onMounted(() => {
  fetchProductDetails();
});
</script>
