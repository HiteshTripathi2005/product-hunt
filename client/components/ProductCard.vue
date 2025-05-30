<template>
  <Card
    class="group hover:shadow-lg transition-all duration-200 cursor-pointer"
    @click="handleCardClick"
  >
    <CardContent class="p-6">
      <!-- Product Header -->
      <div class="flex items-start space-x-4 mb-4">
        <!-- Product Logo -->
        <div class="flex-shrink-0">
          <img
            :src="product.logo"
            :alt="`${product.name} logo`"
            class="w-16 h-16 rounded-xl object-cover border border-border/20"
            @error="handleImageError"
          />
        </div>

        <!-- Product Info -->
        <div class="flex-1 min-w-0">
          <h3
            class="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1"
          >
            {{ product.name }}
          </h3>
          <p class="text-sm text-muted-foreground line-clamp-2 mt-1">
            {{ product.tagline }}
          </p>

          <!-- Category Badge -->
          <div class="mt-2">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              {{ product.category }}
            </span>
          </div>
        </div>
      </div>

      <!-- Product Images Preview -->
      <div v-if="product.images && product.images.length > 0" class="mb-4">
        <div class="grid grid-cols-2 gap-2" v-if="product.images.length > 1">
          <img
            v-for="(image, index) in product.images.slice(0, 2)"
            :key="index"
            :src="image"
            :alt="`${product.name} screenshot ${index + 1}`"
            class="w-full h-24 rounded-lg object-cover border border-border/20"
            @error="handleImageError"
          />
        </div>
        <div v-else>
          <img
            :src="product.images[0]"
            :alt="`${product.name} screenshot`"
            class="w-full h-32 rounded-lg object-cover border border-border/20"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Product Footer -->
      <div class="flex items-center justify-between">
        <!-- Submitted By -->
        <div class="flex items-center space-x-2">
          <div
            class="relative w-6 h-6 rounded-full overflow-hidden border border-border/20"
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
              class="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium"
            >
              {{ product.submittedBy?.name?.charAt(0)?.toUpperCase() || "U" }}
            </div>
          </div>
          <span class="text-xs text-muted-foreground">
            by {{ product.submittedBy?.name || "Unknown" }}
          </span>
        </div>

        <!-- Created Date -->
        <div class="text-xs text-muted-foreground">
          {{ formatDate(product.createdAt) }}
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent } from "@/components/ui/card";

// Props
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// Composables
// (No auth composable needed since upvote functionality is removed)

// State
const imageError = ref(false);
const avatarError = ref(false);

// Methods
const handleImageError = (event) => {
  event.target.style.display = "none";
};

const handleAvatarError = (event) => {
  avatarError.value = true;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Emit click event for navigation
const emit = defineEmits(["click"]);

const handleCardClick = () => {
  emit("click", props.product);
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
