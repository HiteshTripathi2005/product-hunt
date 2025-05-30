<template>
  <div
    class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-gray-600 dark:text-white"
        >
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-white">
          Or
          <NuxtLink
            to="/register"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            create a new account
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

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <Label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </Label>
            <div class="mt-1">
              <Input
                id="email"
                v-model="loginForm.email"
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
                v-model="loginForm.password"
                type="password"
                required
                placeholder="Enter your password"
                class="w-full"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span v-if="isLoading">Signing in...</span>
              <span v-else>Sign in</span>
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

definePageMeta({
  title: "Login",
  middleware: "guest",
  layout: "default",
});

// Use composables
const { login, isLoading, error, clearError } = useAuth();
const { form: loginForm, resetForm } = useLoginForm();

// Handle login form submission
const handleLogin = async () => {
  try {
    clearError();
    await login(loginForm);
    resetForm();
  } catch (err) {
    // Error is handled by the composable
    console.error("Login failed:", err);
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
