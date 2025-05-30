import { ref, computed } from "vue";

export const useUserProfile = (userId = null) => {
  // State
  const user = ref(null);
  const userProducts = ref([]);
  const upvotedProducts = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const activeTab = ref("products"); // 'products' | 'upvoted'

  // Composables
  const { user: currentUser, isAuthenticated } = useAuth();

  // Computed
  const isOwnProfile = computed(() => {
    if (!userId || !currentUser.value) return true;
    const currentUserId = currentUser.value.id || currentUser.value._id;
    return userId === currentUserId;
  });

  const totalProducts = computed(() => userProducts.value.length);
  const totalUpvotes = computed(() => upvotedProducts.value.length);

  // Methods
  const fetchUserProfile = async (targetUserId = null) => {
    try {
      isLoading.value = true;
      error.value = null;

      const userIdToFetch =
        targetUserId ||
        userId ||
        currentUser.value?.id ||
        currentUser.value?._id;

      if (!userIdToFetch) {
        throw new Error("User ID is required");
      } // Fetch user's products (this also returns user info)
      const productsResponse = await $fetch(
        `/api/products/user/${userIdToFetch}`
      );
      if (productsResponse.success) {
        user.value = productsResponse.data.user;
        userProducts.value = productsResponse.data.products || [];
      } // Fetch user's upvoted products
      const upvotedResponse = await $fetch(
        `/api/products/user/${userIdToFetch}/upvoted`
      );
      if (upvotedResponse.success) {
        upvotedProducts.value = upvotedResponse.data.products || [];
      }
    } catch (err) {
      console.error("Fetch user profile error:", err);
      error.value =
        err.data?.message || err.message || "Failed to fetch user profile";
      user.value = null;
      userProducts.value = [];
      upvotedProducts.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const setActiveTab = (tab) => {
    activeTab.value = tab;
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return {
    // State
    user,
    userProducts,
    upvotedProducts,
    isLoading,
    error,
    activeTab,

    // Computed
    isOwnProfile,
    totalProducts,
    totalUpvotes,

    // Methods
    fetchUserProfile,
    setActiveTab,
    formatJoinDate,
  };
};
