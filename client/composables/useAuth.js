import { ref, reactive, computed, readonly } from "vue";

// Global auth state
const user = ref(null);
const isInitialized = ref(false);
const isAuthenticated = computed(() => user.value !== null);

export const useAuth = () => {
  const isLoading = ref(false);
  const error = ref(null);

  const clearError = () => {
    error.value = null;
  };
  const login = async (formData) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Make API call to login endpoint
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email: formData.email,
          password: formData.password,
        },
      }); // Set user state on successful login
      if (response.success && response.data.user) {
        user.value = response.data.user;
      }

      // Redirect to home page
      if (typeof navigateTo !== "undefined") {
        await navigateTo("/");
      }

      return response;
    } catch (err) {
      console.error("Login error:", err);
      // Set error message for UI
      error.value =
        err.data?.message || err.message || "Login failed. Please try again.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (formData) => {
    try {
      isLoading.value = true;
      error.value = null;

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!formData.agreeToTerms) {
        throw new Error("Please agree to the terms and conditions");
      }

      const registerData = new FormData();

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      registerData.append("name", fullName);
      registerData.append("email", formData.email);
      registerData.append("password", formData.password);

      if (formData.bio) {
        registerData.append("bio", formData.bio);
      }

      if (formData.avatar) {
        registerData.append("avatar", formData.avatar);
      }

      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body: registerData,
      });
      if (response.success && response.data.user) {
        user.value = response.data.user;
      }

      // Redirect to home page
      if (typeof navigateTo !== "undefined") {
        await navigateTo("/");
      }

      return response;
    } catch (err) {
      console.error("Registration error:", err);
      // Set error message for UI
      error.value =
        err.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      isLoading.value = true;

      // Make API call to logout endpoint
      const response = await $fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear user state
      user.value = null;

      // Redirect to home page
      if (typeof navigateTo !== "undefined") {
        await navigateTo("/");
      }

      return response;
    } catch (err) {
      console.error("Logout error:", err);
      // Clear user state even if API call fails
      user.value = null;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const getCurrentUser = async () => {
    try {
      isLoading.value = true;

      const response = await $fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Set user state if successful
      if (response.success && response.data.user) {
        user.value = response.data.user;
      }
      return response;
    } catch (err) {
      console.error("Get current user error:", err);
      user.value = null;
      throw err;
    } finally {
      isLoading.value = false;
      isInitialized.value = true;
    }
  };
  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isInitialized: readonly(isInitialized),
    isLoading: readonly(isLoading),
    error: readonly(error),
    clearError,
    login,
    register,
    logout,
    getCurrentUser,
  };
};

export const useLoginForm = () => {
  const form = reactive({
    email: "",
    password: "",
    rememberMe: false,
  });

  const resetForm = () => {
    form.email = "";
    form.password = "";
    form.rememberMe = false;
  };

  return {
    form,
    resetForm,
  };
};
