import { ref, computed } from "vue";

export const useComments = (productId) => {
  // State
  const comments = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const isSubmitting = ref(false);

  // Composables
  const { isAuthenticated, user } = useAuth();

  // Computed
  const commentsCount = computed(() => {
    return comments.value.length;
  });

  // Methods
  const fetchComments = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch(`/api/comments/product/${productId}`);

      if (response.success) {
        comments.value = response.data.comments || [];
      } else {
        throw new Error(response.message || "Failed to fetch comments");
      }
    } catch (err) {
      console.error("Fetch comments error:", err);
      error.value =
        err.data?.message || err.message || "Failed to fetch comments";
      comments.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const addComment = async (content, parentCommentId = null) => {
    if (!isAuthenticated.value) {
      throw new Error("Authentication required");
    }

    try {
      isSubmitting.value = true;
      error.value = null;

      const response = await $fetch("/api/comments", {
        method: "POST",
        body: {
          content,
          productId,
          ...(parentCommentId && { parentCommentId }),
        },
      });

      if (response.success) {
        // Refresh comments to get the updated list
        await fetchComments();
        return response.data.comment;
      } else {
        throw new Error(response.message || "Failed to add comment");
      }
    } catch (err) {
      console.error("Add comment error:", err);
      error.value = err.data?.message || err.message || "Failed to add comment";
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year:
            date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
      }
    }
  };

  return {
    // State
    comments,
    isLoading,
    error,
    isSubmitting,

    // Computed
    commentsCount,

    // Methods
    fetchComments,
    addComment,
    formatDate,
  };
};
