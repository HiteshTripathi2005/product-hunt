import { ref, computed } from "vue";

export const useProductDetail = (productId) => {
  // State
  const product = ref(null);
  const isLoading = ref(true);
  const error = ref(null);
  const imageError = ref(false);
  const avatarError = ref(false);

  // Image slider state
  const currentImageIndex = ref(0);
  const carouselApi = ref(null);

  // Composables
  const { isAuthenticated, user } = useAuth();

  // Computed
  const isUpvoted = computed(() => {
    if (!isAuthenticated.value) {
      return false;
    }

    // Check for both id and _id properties
    const userId = user.value?.id || user.value?._id;
    if (!userId) {
      return false;
    }
    if (!product.value?.upvotes) {
      return false;
    }

    const hasUpvoted = product.value.upvotes.some((upvote) => {
      // Handle different data structures:
      // 1. upvote.user is a string (user ID)
      // 2. upvote.user is an object with _id property
      // 3. upvote.user is an object with id property
      let upvoteUserId;

      if (typeof upvote.user === "string") {
        upvoteUserId = upvote.user;
      } else if (upvote.user && typeof upvote.user === "object") {
        upvoteUserId = upvote.user._id || upvote.user.id;
      }

      return upvoteUserId === userId;
    });

    return hasUpvoted;
  });

  // Methods
  const fetchProductDetails = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await $fetch(`/api/products/${productId}`);
      if (response.success) {
        product.value = response.data.product;

        // Add upvote count if not already present
        if (
          product.value &&
          !product.value.upvoteCount &&
          product.value.upvotes
        ) {
          product.value.upvoteCount = product.value.upvotes.length;
        }

        // Reset image slider to first image
        resetImageSlider();
      } else {
        throw new Error(response.message || "Failed to fetch product details");
      }
    } catch (err) {
      console.error("Fetch product details error:", err);
      error.value =
        err.data?.message || err.message || "Failed to fetch product details";
      product.value = null;
    } finally {
      isLoading.value = false;
    }
  };
  const handleUpvote = async () => {
    if (!isAuthenticated.value) {
      // Redirect to login page for guest users
      await navigateTo("/login");
      return;
    }

    try {
      // Send API request
      await $fetch(`/api/products/${productId}/upvote`, {
        method: "POST",
      });

      // Refresh the page to get updated data
      await fetchProductDetails();
    } catch (error) {
      console.error("Upvote failed:", error);
    }
  };

  const handleImageError = (event) => {
    event.target.style.display = "none";
  };

  const handleAvatarError = (event) => {
    avatarError.value = true;
  };

  // Image slider methods
  const onCarouselInit = (api) => {
    carouselApi.value = api;

    // Listen for carousel changes to update current index
    api.on("select", () => {
      currentImageIndex.value = api.selectedScrollSnap();
    });
  };

  const setCarouselIndex = (index) => {
    if (carouselApi.value) {
      carouselApi.value.scrollTo(index);
    }
    currentImageIndex.value = index;
  };

  // Reset image index when product changes
  const resetImageSlider = () => {
    currentImageIndex.value = 0;
    if (carouselApi.value) {
      carouselApi.value.scrollTo(0);
    }
  };

  return {
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
  };
};
