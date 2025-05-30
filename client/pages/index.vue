<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1
        class="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-4"
      >
        Discover Amazing Products
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Explore the best new products, tools, and services curated by our
        community
      </p>
    </div>

    <!-- Search and Filters -->
    <div class="mb-8">
      <div class="max-w-4xl mx-auto">
        <!-- Search Bar -->
        <div class="relative mb-4">
          <input
            v-model="searchTerm"
            @input="handleSearch"
            type="text"
            placeholder="Search products..."
            class="w-full px-4 py-3 pl-12 text-sm border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <!-- Category Filter -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-foreground">Category:</label>
            <select
              v-model="selectedCategory"
              @change="handleCategoryFilter"
              class="px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Categories</option>
              <option
                v-for="category in categories"
                :key="category.name"
                :value="category.name"
              >
                {{ category.name }} ({{ category.count }})
              </option>
            </select>
          </div>
          <!-- Sort Options -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-foreground">Sort by:</label>
            <select
              v-model="sortBy"
              @change="handleSort"
              class="px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="createdAt">Latest</option>
              <option value="upvoteCount">Most Upvoted</option>
              <option value="name">Name</option>
            </select>
          </div>

          <!-- Clear Filters Button -->
          <div class="flex items-center">
            <Button
              @click="handleClearFilters"
              variant="ghost"
              size="sm"
              v-if="searchTerm || selectedCategory"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && products.length === 0" class="text-center py-12">
      <div class="inline-flex items-center space-x-2">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"
        ></div>
        <span class="text-muted-foreground">Loading products...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">
        <svg
          class="w-12 h-12 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
        </svg>
        <p class="text-sm">{{ error }}</p>
      </div>
      <Button @click="handleRetry" variant="outline"> Try Again </Button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!isLoading && products.length === 0"
      class="text-center py-12"
    >
      <div class="text-muted-foreground mb-4">
        <svg
          class="w-12 h-12 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <p class="text-sm">No products found</p>
        <p class="text-xs mt-1">Try adjusting your search or filters</p>
      </div>
    </div>
    <!-- Products Display -->
    <div v-else>
      <!-- Results Summary -->
      <div class="text-sm text-muted-foreground mb-6 text-center">
        Showing {{ products.length }} of {{ totalProducts }} products
        <span v-if="searchTerm || selectedCategory" class="font-medium">
          (filtered)
        </span>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard
          v-for="product in products"
          :key="product._id"
          :product="product"
          @click="handleProductClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard.vue";

// Set layout
definePageMeta({
  layout: "default",
});

// Set page metadata
useSeoMeta({
  title: "Explore - ProductHunt",
  description: "Discover and explore amazing products",
});

// Composables
const {
  products,
  isLoading,
  error,
  totalProducts,
  fetchProducts,
  fetchCategories,
  filterByCategory,
  searchProducts,
  sortProducts,
  clearFilters,
  currentCategory,
  currentSearch,
  currentSort,
} = useProducts();

// State
const searchTerm = ref("");
const selectedCategory = ref("");
const sortBy = ref("createdAt");
const categories = ref([]);
const searchTimeout = ref(null);

// Load initial data
onMounted(async () => {
  await Promise.all([fetchProducts(), loadCategories()]);
});

// Load categories
const loadCategories = async () => {
  try {
    const categoryData = await fetchCategories();
    categories.value = categoryData || [];
  } catch (err) {
    console.error("Failed to load categories:", err);
  }
};

// Handle search with debouncing
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    searchProducts(searchTerm.value.trim());
  }, 500);
};

// Handle category filter
const handleCategoryFilter = () => {
  filterByCategory(selectedCategory.value);
};

// Handle sorting
const handleSort = () => {
  sortProducts(sortBy.value);
};

// Clear all filters
const handleClearFilters = () => {
  searchTerm.value = "";
  selectedCategory.value = "";
  sortBy.value = "createdAt";
  clearFilters();
};

// Handle product click (navigate to product detail)
const handleProductClick = (product) => {
  navigateTo(`/products/${product._id}`);
};

// Retry loading products
const handleRetry = async () => {
  await fetchProducts();
};

// Cleanup timeout on unmount
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
