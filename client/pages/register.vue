<template>
  <div
    class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
        >
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-white">
          Or
          <NuxtLink
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            sign in to existing account
          </NuxtLink>
        </p>
      </div>
      <Card class="p-8">
        <div
          v-if="error"
          class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md"
        >
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label
                for="firstName"
                class="block text-sm font-medium text-gray-700"
              >
                First Name
              </Label>
              <div class="mt-1">
                <Input
                  id="firstName"
                  v-model="registerForm.firstName"
                  type="text"
                  required
                  placeholder="First name"
                  class="w-full"
                />
              </div>
            </div>

            <div>
              <Label
                for="lastName"
                class="block text-sm font-medium text-gray-700"
              >
                Last Name
              </Label>
              <div class="mt-1">
                <Input
                  id="lastName"
                  v-model="registerForm.lastName"
                  type="text"
                  required
                  placeholder="Last name"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <div>
            <Label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </Label>
            <div class="mt-1">
              <Input
                id="email"
                v-model="registerForm.email"
                type="email"
                required
                placeholder="Enter your email"
                class="w-full"
              />
            </div>
          </div>

          <div>
            <Label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div class="mt-1">
              <Input
                id="password"
                v-model="registerForm.password"
                type="password"
                required
                placeholder="Create a password"
                class="w-full"
              />
            </div>
          </div>

          <div>
            <Label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </Label>
            <div class="mt-1">
              <Input
                id="confirmPassword"
                v-model="registerForm.confirmPassword"
                type="password"
                required
                placeholder="Confirm your password"
                class="w-full"
              />
            </div>
            <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">
              Passwords do not match
            </p>
          </div>

          <div>
            <Label for="bio" class="block text-sm font-medium text-gray-700">
              Bio (Optional)
            </Label>
            <div class="mt-1">
              <textarea
                id="bio"
                v-model="registerForm.bio"
                rows="3"
                placeholder="Tell us about yourself..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                maxlength="200"
              />
              <p class="mt-1 text-xs text-gray-500">
                {{ registerForm.bio.length }}/200 characters
              </p>
            </div>
          </div>

          <div>
            <Label for="avatar" class="block text-sm font-medium text-gray-700">
              Profile Picture
            </Label>
            <div class="mt-1">
              <input
                id="avatar"
                ref="avatarInput"
                type="file"
                accept="image/*"
                required
                @change="handleAvatarChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p class="mt-1 text-xs text-gray-500">
                Upload a profile picture (JPEG, PNG, GIF, WebP - Max 5MB)
              </p>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="agreeToTerms"
              v-model="registerForm.agreeToTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <Label
              for="agreeToTerms"
              class="ml-2 block text-sm text-gray-500 dark:text-gray-300"
            >
              I agree to the
              <a href="#" class="text-indigo-600 hover:text-indigo-500"
                >Terms of Service</a
              >
              and
              <a href="#" class="text-indigo-600 hover:text-indigo-500"
                >Privacy Policy</a
              >
            </Label>
          </div>

          <div>
            <Button
              type="submit"
              :disabled="
                isLoading ||
                passwordMismatch ||
                !registerForm.agreeToTerms ||
                !registerForm.avatar
              "
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span v-if="isLoading">Creating account...</span>
              <span v-else>Create account</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Define page metadata
definePageMeta({
  title: "Register",
  middleware: "guest",
  layout: "default",
});

// Use composables
const { register, isLoading, error, clearError } = useAuth();
const { form: registerForm, passwordMismatch, resetForm } = useRegisterForm();

// Avatar input ref
const avatarInput = ref(null);

// Handle avatar file selection
const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      clearError();
      // You might want to set an error here
      alert("File size must be less than 5MB");
      event.target.value = "";
      registerForm.avatar = null;
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      clearError();
      alert("Please select a valid image file (JPEG, PNG, GIF, WebP)");
      event.target.value = "";
      registerForm.avatar = null;
      return;
    }

    registerForm.avatar = file;
  } else {
    registerForm.avatar = null;
  }
};

// Handle register form submission
const handleRegister = async () => {
  try {
    clearError();
    await register(registerForm);
    resetForm();
  } catch (err) {
    // Error is handled by the composable
    console.error("Registration failed:", err);
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
