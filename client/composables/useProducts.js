export const useProducts = () => {
  // State
  const allProducts = ref([]); // Store all products from server
  const filteredProducts = ref([]); // Store filtered products for display
  const isLoading = ref(false);
  const error = ref(null);
  const totalProducts = ref(0);

  // Filter state
  const currentCategory = ref("");
  const currentSearch = ref("");
  const currentSort = ref("createdAt");
  const showFeaturedOnly = ref(false);

  // Fetch all products from API (no server-side filtering)
  const fetchProducts = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch("/api/products");

      if (response.success) {
        allProducts.value = response.data.products;
        totalProducts.value = response.data.totalProducts;
        applyFilters(); // Apply current filters after fetching
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      error.value =
        err.data?.message || err.message || "Failed to fetch products";
      allProducts.value = [];
      filteredProducts.value = [];
      totalProducts.value = 0;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Apply client-side filters
  const applyFilters = () => {
    let filtered = [...allProducts.value];

    // Category filter
    if (currentCategory.value) {
      filtered = filtered.filter(
        (product) => product.category === currentCategory.value
      );
    }

    // Featured filter
    if (showFeaturedOnly.value) {
      filtered = filtered.filter((product) => product.featured);
    }

    // Search filter
    if (currentSearch.value) {
      const searchTerm = currentSearch.value.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.tagline.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort products
    switch (currentSort.value) {
      case "upvoteCount":
        filtered.sort((a, b) => {
          if (b.upvoteCount === a.upvoteCount) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return b.upvoteCount - a.upvoteCount;
        });
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "createdAt":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    filteredProducts.value = filtered;
  };

  // Filter methods
  const filterByCategory = (category) => {
    currentCategory.value = category;
    applyFilters();
  };

  const searchProducts = (searchTerm) => {
    currentSearch.value = searchTerm;
    applyFilters();
  };

  const sortProducts = (sortBy) => {
    currentSort.value = sortBy;
    applyFilters();
  };

  const toggleFeatured = (showFeatured) => {
    showFeaturedOnly.value = showFeatured;
    applyFilters();
  };

  const clearFilters = () => {
    currentCategory.value = "";
    currentSearch.value = "";
    currentSort.value = "createdAt";
    showFeaturedOnly.value = false;
    applyFilters();
  };

  // Fetch single product
  const fetchProduct = async (id) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch(`/api/products/${id}`);

      if (response.success) {
        return response.data.product;
      } else {
        throw new Error(response.message || "Failed to fetch product");
      }
    } catch (err) {
      console.error("Fetch product error:", err);
      error.value =
        err.data?.message || err.message || "Failed to fetch product";
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await $fetch("/api/products/categories");

      if (response.success) {
        return response.data.categories;
      } else {
        throw new Error(response.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
      return [];
    }
  }; // Toggle upvote for a product (requires authentication)
  const toggleUpvote = async (productId) => {
    try {
      const response = await $fetch(`/api/products/${productId}/upvote`, {
        method: "POST",
      });

      if (response.success) {
        const isUpvoted = response.data.isUpvoted;
        const { user } = useAuth();
        const currentUserId = user.value?.id;

        // Helper function to update product upvote data
        const updateProductUpvotes = (product) => {
          if (!product) return;

          // Update upvote count based on server response
          if (isUpvoted) {
            product.upvoteCount += 1;
            // Add current user to upvotes array for UI state
            if (!product.upvotes) product.upvotes = [];
            const existingUpvote = product.upvotes.find((upvote) => {
              const upvoteUserId =
                typeof upvote.user === "object" ? upvote.user._id : upvote.user;
              return upvoteUserId === currentUserId;
            });
            if (!existingUpvote) {
              product.upvotes.push({
                user: currentUserId,
                createdAt: new Date().toISOString(),
              });
            }
          } else {
            product.upvoteCount -= 1;
            // Remove current user from upvotes array for UI state
            if (product.upvotes) {
              product.upvotes = product.upvotes.filter((upvote) => {
                const upvoteUserId =
                  typeof upvote.user === "object"
                    ? upvote.user._id
                    : upvote.user;
                return upvoteUserId !== currentUserId;
              });
            }
          }
        };

        // Update in allProducts array
        const allProductIndex = allProducts.value.findIndex(
          (p) => p._id === productId
        );
        if (allProductIndex !== -1) {
          updateProductUpvotes(allProducts.value[allProductIndex]);
        }

        // Update in filteredProducts array
        const filteredProductIndex = filteredProducts.value.findIndex(
          (p) => p._id === productId
        );
        if (filteredProductIndex !== -1) {
          updateProductUpvotes(filteredProducts.value[filteredProductIndex]);
        }

        return response.data;
      } else {
        throw new Error(response.message || "Failed to toggle upvote");
      }
    } catch (err) {
      console.error("Toggle upvote error:", err);
      throw err;
    }
  };
  // Compute categories from products for filtering
  const categories = computed(() => {
    const categoryMap = {};

    // Count products in each category
    allProducts.value.forEach((product) => {
      if (product.category) {
        if (!categoryMap[product.category]) {
          categoryMap[product.category] = { name: product.category, count: 0 };
        }
        categoryMap[product.category].count++;
      }
    });

    // Convert to array and sort alphabetically
    return Object.values(categoryMap).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  });

  return {
    // State
    products: readonly(filteredProducts), // Return filtered products for display
    allProducts: readonly(allProducts),
    filteredProducts: readonly(filteredProducts),
    isLoading: readonly(isLoading),
    error: readonly(error),
    totalProducts: readonly(totalProducts),
    categories,

    // Filter state
    currentCategory: readonly(currentCategory),
    currentSearch: readonly(currentSearch),
    currentSort: readonly(currentSort),
    showFeaturedOnly: readonly(showFeaturedOnly),

    // Methods
    fetchProducts,
    fetchProduct,
    fetchCategories,
    toggleUpvote,
    filterByCategory,
    searchProducts,
    sortProducts,
    toggleFeatured,
    clearFilters,
    applyFilters,
  };
};
