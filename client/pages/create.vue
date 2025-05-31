<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
    <!-- Show loading while checking authentication -->
    <div
      v-if="!authInitialized"
      class="flex justify-center items-center min-h-[400px]"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
      ></div>
    </div>

    <!-- Show create form once authenticated -->
    <div v-else>
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Create New Product</h1>
        <p class="text-muted-foreground mt-2">
          Share your amazing product with the community
        </p>
      </div>

      <!-- Create Product Form -->
      <Card class="p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Product Name -->
          <div>
            <Label for="name" class="block text-sm font-medium text-foreground">
              Product Name *
            </Label>
            <Input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Enter your product name"
              class="mt-1 w-full"
              maxlength="100"
            />
            <p class="text-xs text-muted-foreground mt-1">
              Maximum 100 characters
            </p>
          </div>

          <!-- Product Tagline -->
          <div>
            <Label
              for="tagline"
              class="block text-sm font-medium text-foreground"
            >
              Tagline *
            </Label>
            <Input
              id="tagline"
              v-model="form.tagline"
              type="text"
              required
              placeholder="A short, catchy description of your product"
              class="mt-1 w-full"
              maxlength="200"
            />
            <p class="text-xs text-muted-foreground mt-1">
              Maximum 200 characters
            </p>
          </div>
          <!-- Product Description -->
          <div>
            <Label
              for="description"
              class="block text-sm font-medium text-foreground"
            >
              Description *
            </Label>
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="4"
              placeholder="Describe what your product does and why it's amazing"
              class="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              maxlength="1000"
            />
            <p class="text-xs text-muted-foreground mt-1">
              Maximum 1000 characters
            </p>
          </div>
          <!-- Product URL -->
          <div>
            <Label
              for="websiteUrl"
              class="block text-sm font-medium text-foreground"
            >
              Website URL *
            </Label>
            <Input
              id="websiteUrl"
              v-model="form.websiteUrl"
              type="url"
              required
              placeholder="https://yourproduct.com"
              class="mt-1 w-full"
            />
          </div>

          <!-- Product Logo -->
          <div>
            <Label for="logo" class="block text-sm font-medium text-foreground">
              Product Logo *
            </Label>
            <div class="mt-1">
              <input
                id="logo"
                ref="logoInput"
                type="file"
                accept="image/*"
                required
                @change="handleLogoChange"
                class="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-foreground hover:file:bg-muted/80"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Upload a square logo (PNG, JPG up to 5MB)
              </p>
            </div>
          </div>
          <!-- Product Images -->
          <div>
            <Label
              for="images"
              class="block text-sm font-medium text-foreground"
            >
              Product Images *
            </Label>
            <div class="mt-1">
              <input
                id="images"
                ref="imagesInput"
                type="file"
                accept="image/*"
                multiple
                required
                @change="handleImagesChange"
                class="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-foreground hover:file:bg-muted/80"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Upload 1-5 product screenshots or images (PNG, JPG up to 5MB
                each)
              </p>
            </div>
          </div>

          <!-- Categories -->
          <div>
            <Label
              for="category"
              class="block text-sm font-medium text-foreground"
            >
              Category *
            </Label>
            <select
              id="category"
              v-model="form.category"
              required
              class="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="AI">AI</option>
              <option value="SaaS">SaaS</option>
              <option value="Devtools">Devtools</option>
              <option value="Productivity">Productivity</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Gaming">Gaming</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <!-- Error Display -->
          <div
            v-if="error"
            class="p-4 bg-red-50 border border-red-200 rounded-md"
          >
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <div class="flex items-center justify-between">
            <Button type="button" variant="outline" @click="$router.back()">
              Cancel
            </Button>
            <Button
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="px-8"
            >
              <span v-if="isLoading">Creating...</span>
              <span v-else>Create Product</span>
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

// Set page metadata
definePageMeta({
  title: "Create Product",
  layout: "default",
  middleware: "auth", // Protect this route
});

// Use auth composable to check initialization state
const { isInitialized } = useAuth();
const authInitialized = computed(() => isInitialized.value);

// Use create product composable
const {
  form,
  logoFile,
  imagesFiles,
  isLoading,
  error,
  logoInput,
  imagesInput,
  isFormValid,
  handleLogoChange,
  handleImagesChange,
  createProduct,
  resetForm,
} = useCreateProduct();

// Handle form submission
const handleSubmit = async () => {
  const response = await createProduct();

  if (response && response.success) {
    await navigateTo("/");
  }
};

// Set page metadata
useSeoMeta({
  title: "Create Product - ProductHunt",
  description: "Share your amazing product with the community",
});
</script>

<style scoped></style>
