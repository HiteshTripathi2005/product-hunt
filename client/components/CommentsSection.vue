<template>
  <div class="mt-8">
    <!-- Comments Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold">
        Comments
        <span
          v-if="commentsCount > 0"
          class="text-muted-foreground font-normal"
        >
          ({{ commentsCount }})
        </span>
      </h2>
    </div>

    <ClientOnly>
      <!-- Comment Form (for authenticated users only) -->
      <div v-if="isAuthenticated" class="mb-6">
        <CommentForm
          :product-id="productId"
          @comment-added="handleCommentAdded"
        />
      </div>

      <!-- Login Prompt (for guest users) -->
      <div v-else class="mb-6 p-4 border border-border rounded-lg bg-muted/30">
        <div class="flex items-center gap-3">
          <svg
            class="w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.118 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.118-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span class="text-sm text-muted-foreground">
            <Button
              variant="link"
              class="p-0 h-auto text-primary"
              @click="navigateTo('/login')"
            >
              Login
            </Button>
            to join the conversation
          </span>
        </div>
      </div>
      <template #fallback>
        <div class="mb-6 p-4 border border-border rounded-lg bg-muted/30">
          <div class="flex items-center gap-3">
            <svg
              class="w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.118 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.118-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span class="text-sm text-muted-foreground">
              <Button
                variant="link"
                class="p-0 h-auto text-primary"
                @click="navigateTo('/login')"
              >
                Login
              </Button>
              to join the conversation
            </span>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="flex space-x-3">
          <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-4">{{ error }}</div>
      <Button variant="outline" @click="fetchComments"> Try Again </Button>
    </div>

    <!-- Comments List -->
    <div v-else-if="comments.length > 0" class="space-y-4">
      <Comment
        v-for="comment in topLevelComments"
        :key="comment._id"
        :comment="comment"
        :format-date="formatDate"
        @reply-added="handleReplyAdded"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <svg
        class="w-12 h-12 text-muted-foreground mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.118 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.118-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <p class="text-muted-foreground">
        <ClientOnly>
          {{
            isAuthenticated ? "Be the first to comment!" : "No comments yet."
          }}
          <template #fallback> No comments yet. </template>
        </ClientOnly>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { Button } from "@/components/ui/button";

// Props
const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

// Composables
const { isAuthenticated } = useAuth();
const { comments, isLoading, error, commentsCount, fetchComments, formatDate } =
  useComments(props.productId);

// Computed
const topLevelComments = computed(() => {
  return comments.value.filter((comment) => !comment.parentComment);
});

// Methods
const handleCommentAdded = () => {
  // Refresh comments to show the new comment
  fetchComments();
};

const handleReplyAdded = () => {
  // Refresh comments to show the new reply
  fetchComments();
};

// Fetch comments on mount
onMounted(() => {
  fetchComments();
});
</script>
