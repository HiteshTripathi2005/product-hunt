export const useCreateProduct = () => {
  // Form state
  const form = ref({
    name: "",
    tagline: "",
    description: "",
    websiteUrl: "",
    category: "",
  });

  const logoFile = ref(null);
  const imagesFiles = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // File input refs
  const logoInput = ref(null);
  const imagesInput = ref(null);

  // Reset form
  const resetForm = () => {
    form.value = {
      name: "",
      tagline: "",
      description: "",
      websiteUrl: "",
      category: "",
    };
    logoFile.value = null;
    imagesFiles.value = [];
    error.value = null;

    // Clear file inputs
    if (logoInput.value) logoInput.value.value = "";
    if (imagesInput.value) imagesInput.value.value = "";
  };

  // Handle logo file change
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        error.value = "Logo file size must be less than 5MB";
        if (logoInput.value) logoInput.value.value = "";
        return;
      }
      logoFile.value = file;
      error.value = null;
    }
  };
  // Handle images files change
  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      error.value = "You can upload maximum 5 images";
      if (imagesInput.value) imagesInput.value.value = "";
      return;
    }

    // At least 1 image is required
    if (files.length === 0) {
      error.value = "At least 1 product image is required";
      return;
    }

    // Validate each file
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        error.value = "Each image file size must be less than 5MB";
        if (imagesInput.value) imagesInput.value.value = "";
        return;
      }
    }

    imagesFiles.value = files;
    error.value = null;
  };
  // Create product
  const createProduct = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      // Create FormData for file upload
      const formData = new FormData();

      // Add form fields according to server API
      formData.append("name", form.value.name);
      formData.append("tagline", form.value.tagline);
      formData.append("description", form.value.description);
      formData.append("websiteUrl", form.value.websiteUrl);
      formData.append("category", form.value.category);

      // Add logo file (required)
      if (logoFile.value) {
        formData.append("logo", logoFile.value);
      }

      // Add images files (required, 1-5 files)
      imagesFiles.value.forEach((file) => {
        formData.append("images", file);
      });

      // Make API call to create product
      const response = await $fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.success) {
        // Reset form on success
        resetForm();
        return response;
      } else {
        error.value = response.message || "Failed to create product";
        return null;
      }
    } catch (err) {
      console.error("Create product error:", err);
      error.value =
        err.data?.message || err.message || "Failed to create product";
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  // Validate form
  const isFormValid = computed(() => {
    return (
      form.value.name.trim() &&
      form.value.tagline.trim() &&
      form.value.description.trim() &&
      form.value.websiteUrl.trim() &&
      form.value.category &&
      logoFile.value &&
      imagesFiles.value.length > 0
    );
  });

  return {
    // State
    form,
    logoFile,
    imagesFiles,
    isLoading,
    error,
    logoInput,
    imagesInput,

    // Computed
    isFormValid,

    // Methods
    handleLogoChange,
    handleImagesChange,
    createProduct,
    resetForm,
  };
};
