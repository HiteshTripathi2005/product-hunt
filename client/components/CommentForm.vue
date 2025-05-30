<template>
  <div class="space-y-3">
    <!-- User Avatar & Form -->
    <div class="flex items-start space-x-3">
      <!-- Current User Avatar -->
      <div
        class="relative w-8 h-8 rounded-full overflow-hidden border border-border/20 flex-shrink-0"
      >
        <img
          v-if="user?.avatar"
          :src="user.avatar"
          :alt="user.name"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium"
        >
          {{ user?.name?.charAt(0)?.toUpperCase() || "U" }}
        </div>
      </div>

      <!-- Comment Input -->
      <div class="flex-1">
        <Textarea
          v-model="commentText"
          :placeholder="placeholder"
          :disabled="isSubmitting"
          class="min-h-[80px] resize-none"
          @keydown.ctrl.enter="handleSubmit"
          @keydown.meta.enter="handleSubmit"
        />

        <!-- Character Count -->
        <div class="flex justify-between items-center mt-2">
          <div class="text-xs text-muted-foreground">
            <span :class="{ 'text-red-500': commentText.length > 500 }">
              {{ commentText.length }}/500
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <Button
              v-if="parentCommentId"
              variant="ghost"
              size="sm"
              @click="handleCancel"
              :disabled="isSubmitting"
            >
              Cancel
            </Button>

            <Button
              @click="handleSubmit"
              :disabled="!canSubmit || isSubmitting"
              size="sm"
            >
              <template v-if="isSubmitting">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Posting...
              </template>
              <template v-else>
                {{ parentCommentId ? "Reply" : "Comment" }}
              </template>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Props
const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
  parentCommentId: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: "Write a comment...",
  },
});

// Composables
const { user } = useAuth();
const { addComment } = useComments(props.productId);

// State
const commentText = ref("");
const isSubmitting = ref(false);
const error = ref(null);

// Computed
const canSubmit = computed(() => {
  return (
    commentText.value.trim().length > 0 &&
    commentText.value.length <= 500 &&
    !isSubmitting.value
  );
});

// Emits
const emit = defineEmits(["comment-added", "cancel"]);

// Methods
const handleSubmit = async () => {
  if (!canSubmit.value) return;

  try {
    isSubmitting.value = true;
    error.value = null;

    const comment = await addComment(
      commentText.value.trim(),
      props.parentCommentId
    );

    // Reset form
    commentText.value = "";

    // Emit success
    emit("comment-added", comment);
  } catch (err) {
    error.value = err.message || "Failed to post comment";
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  commentText.value = "";
  error.value = null;
  emit("cancel");
};
</script>
