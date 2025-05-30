<template>
  <div
    class="bg-white dark:bg-gray-900 border border-border rounded-lg p-4 mb-4"
  >
    <!-- Comment Author & Date -->
    <div class="flex items-start space-x-3 mb-3">
      <!-- Author Avatar -->
      <div
        class="relative w-8 h-8 rounded-full overflow-hidden border border-border/20 flex-shrink-0"
      >
        <img
          v-if="comment.author?.avatar"
          :src="comment.author.avatar"
          :alt="comment.author.name"
          class="w-full h-full object-cover"
          @error="handleAvatarError"
        />
        <div
          v-else
          class="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium"
        >
          {{ comment.author?.name?.charAt(0)?.toUpperCase() || "U" }}
        </div>
      </div>

      <!-- Author Info & Date -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="text-sm font-semibold text-foreground">
            {{ comment.author?.name || "Unknown User" }}
          </h4>
          <span class="text-xs text-muted-foreground">
            {{ formatDate(comment.createdAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Comment Content -->
    <div class="mb-3">
      <p class="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
        {{ comment.content }}
      </p>
    </div>

    <!-- Comment Actions -->
    <div class="flex items-center gap-4">
      <!-- Reply Button (only for authenticated users and top-level comments) -->
      <Button
        v-if="isAuthenticated && !comment.parentComment"
        variant="ghost"
        size="sm"
        @click="toggleReplyForm"
        class="text-muted-foreground hover:text-foreground p-0 h-auto"
      >
        <svg
          class="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
        Reply
      </Button>

      <!-- Reply Count (for top-level comments with replies) -->
      <span
        v-if="
          !comment.parentComment &&
          comment.replies &&
          comment.replies.length > 0
        "
        class="text-xs text-muted-foreground"
      >
        {{ comment.replies.length }}
        {{ comment.replies.length === 1 ? "reply" : "replies" }}
      </span>
    </div>

    <!-- Reply Form -->
    <div v-if="showReplyForm" class="mt-4 border-t border-border pt-4">
      <CommentForm
        :product-id="comment.product"
        :parent-comment-id="comment._id"
        placeholder="Write a reply..."
        @comment-added="handleReplyAdded"
        @cancel="showReplyForm = false"
        class="pl-2"
      />
    </div>
    <!-- Replies -->
    <div
      v-if="
        !comment.parentComment && comment.replies && comment.replies.length > 0
      "
      class="mt-4 border-t border-border pt-4"
    >
      <div class="pl-4 border-l-2 border-border/30 space-y-3">
        <div
          v-for="reply in comment.replies"
          :key="reply._id"
          class="bg-gray-50 dark:bg-gray-800/50 border border-border rounded-lg p-4"
        >
          <!-- Reply Author & Date -->
          <div class="flex items-start space-x-3 mb-3">
            <!-- Author Avatar -->
            <div
              class="relative w-6 h-6 rounded-full overflow-hidden border border-border/20 flex-shrink-0"
            >
              <img
                v-if="reply.author?.avatar"
                :src="reply.author.avatar"
                :alt="reply.author.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium"
              >
                {{ reply.author?.name?.charAt(0)?.toUpperCase() || "U" }}
              </div>
            </div>

            <!-- Author Info & Date -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h5 class="text-xs font-semibold text-foreground">
                  {{ reply.author?.name || "Unknown User" }}
                </h5>
                <span class="text-xs text-muted-foreground">
                  {{ formatDate(reply.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Reply Content -->
          <div class="pl-9">
            <p
              class="text-xs text-foreground whitespace-pre-wrap leading-relaxed"
            >
              {{ reply.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Button } from "@/components/ui/button";

// Props
const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
});

// Composables
const { isAuthenticated } = useAuth();

// State
const showReplyForm = ref(false);
const avatarError = ref(false);

// Emits
const emit = defineEmits(["reply-added"]);

// Methods
const handleAvatarError = () => {
  avatarError.value = true;
};

const toggleReplyForm = () => {
  showReplyForm.value = !showReplyForm.value;
};

const handleReplyAdded = (reply) => {
  showReplyForm.value = false;
  emit("reply-added", reply);
};
</script>
