<template>
  <nav
    class="sticky top-0 z-49 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <Logo class="size-6 sm:size-8" />
            <span class="text-lg sm:text-xl font-bold">ProductHunt</span>
          </NuxtLink>
        </div>
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="/"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            :class="{ 'text-foreground': $route.path === '/' }"
          >
            Explore
          </NuxtLink>

          <!-- Create Button -->
          <Button
            @click="handleCreateClick"
            size="sm"
            :variant="isAuthenticated ? 'default' : 'outline'"
            class="flex items-center space-x-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create</span>
            <svg
              v-if="!isAuthenticated"
              class="w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </Button>

          <ClientOnly>
            <!-- Show login button when not authenticated -->
            <template v-if="!isAuthenticated">
              <NuxtLink to="/login">
                <Button size="sm"> Log in </Button>
              </NuxtLink>
            </template>

            <!-- Show user avatar dropdown when authenticated -->
            <template v-else-if="user">
              <DropdownMenu v-model:open="dropdownOpen">
                <DropdownMenuTrigger as-child>
                  <button
                    class="relative h-8 w-8 rounded-full overflow-hidden border border-border/20 hover:border-border/40 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <img
                      v-if="user.avatar && !avatarError"
                      :src="user.avatar"
                      :alt="user.name"
                      class="w-full h-full object-cover"
                      @error="avatarError = true"
                      @load="avatarError = false"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium"
                    >
                      {{ user.name?.charAt(0)?.toUpperCase() || "U" }}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56" align="end">
                  <DropdownMenuLabel class="font-normal">
                    <div class="flex flex-col space-y-1">
                      <p class="text-sm font-medium leading-none">
                        {{ user.name }}
                      </p>
                      <p class="text-xs leading-none text-muted-foreground">
                        {{ user.email }}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleProfileClick">
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleLogout">
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </template>

            <!-- Fallback for SSR - show nothing since app waits for auth -->
            <template #fallback>
              <div class="w-16"></div>
            </template>
          </ClientOnly>
        </div>
        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button
            ref="mobileMenuButton"
            @click.stop="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
            :aria-expanded="mobileMenuOpen"
          >
            <span class="sr-only">{{
              mobileMenuOpen ? "Close main menu" : "Open main menu"
            }}</span>
            <!-- Hamburger icon -->
            <svg
              v-if="!mobileMenuOpen"
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Close icon -->
            <svg
              v-else
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" ref="mobileMenu" class="md:hidden">
        <div
          class="px-2 pt-2 pb-3 space-y-1 border-t bg-background/95"
          @click.stop
        >
          <!-- Mobile navigation links -->
          <NuxtLink
            to="/"
            @click="closeMobileMenu"
            class="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            :class="{ 'text-foreground bg-accent': $route.path === '/' }"
          >
            Explore
          </NuxtLink>

          <!-- Mobile Create Button -->
          <button
            @click="handleMobileCreateClick"
            class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center space-x-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create Product</span>
            <svg
              v-if="!isAuthenticated"
              class="w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </button>

          <ClientOnly>
            <!-- Mobile auth section -->
            <div class="pt-4 pb-3 border-t border-border/20">
              <template v-if="!isAuthenticated">
                <div class="space-y-1">
                  <NuxtLink
                    to="/login"
                    @click="closeMobileMenu"
                    class="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    Log in
                  </NuxtLink>
                  <NuxtLink
                    to="/register"
                    @click="closeMobileMenu"
                    class="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    Sign up
                  </NuxtLink>
                </div>
              </template>

              <template v-else-if="user">
                <div class="flex items-center px-3 py-2">
                  <div class="flex-shrink-0">
                    <div
                      class="relative h-10 w-10 rounded-full overflow-hidden border border-border/20"
                    >
                      <img
                        v-if="user.avatar && !avatarError"
                        :src="user.avatar"
                        :alt="user.name"
                        class="w-full h-full object-cover"
                        @error="avatarError = true"
                        @load="avatarError = false"
                      />
                      <div
                        v-else
                        class="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium"
                      >
                        {{ user.name?.charAt(0)?.toUpperCase() || "U" }}
                      </div>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-base font-medium text-foreground">
                      {{ user.name }}
                    </div>
                    <div class="text-sm font-medium text-muted-foreground">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
                <div class="space-y-1">
                  <NuxtLink
                    to="/profile"
                    @click="closeMobileMenu"
                    class="px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center space-x-2"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>My Profile</span>
                  </NuxtLink>
                  <button
                    @click="handleMobileLogout"
                    class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center space-x-2"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Log out</span>
                  </button>
                </div>
              </template>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Use auth composable
const { user, isAuthenticated, logout } = useAuth();

// Dropdown state management
const dropdownOpen = ref(false);

// Mobile menu state
const mobileMenuOpen = ref(false);

// Template refs
const mobileMenuButton = ref(null);
const mobileMenu = ref(null);

// Avatar error handling
const avatarError = ref(false);

// Toggle mobile menu
const toggleMobileMenu = (event) => {
  event.stopPropagation();
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Close mobile menu
const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// Close menus on route change
const route = useRoute();
watch(
  () => route.path,
  () => {
    dropdownOpen.value = false;
    mobileMenuOpen.value = false;
  }
);

// Reset avatar error when user changes
watch(
  () => user.value,
  () => {
    avatarError.value = false;
  }
);

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (!mobileMenuOpen.value) return;

    const target = event.target;
    const button = mobileMenuButton.value;
    const menu = mobileMenu.value;

    // Don't close if clicking on the button or inside the menu
    if (button && button.contains(target)) return;
    if (menu && menu.contains(target)) return;

    // Close menu if clicking outside
    mobileMenuOpen.value = false;
  };

  // Add event listener
  document.addEventListener("click", handleClickOutside);

  // Cleanup on unmount
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});

// Handle escape key to close mobile menu
onMounted(() => {
  const handleEscKey = (event) => {
    if (event.key === "Escape" && mobileMenuOpen.value) {
      mobileMenuOpen.value = false;
    }
  };

  document.addEventListener("keydown", handleEscKey);

  onUnmounted(() => {
    document.removeEventListener("keydown", handleEscKey);
  });
});

// Handle logout
const handleLogout = async () => {
  try {
    dropdownOpen.value = false; // Close dropdown before logout
    await logout();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Handle profile click
const handleProfileClick = () => {
  dropdownOpen.value = false; // Close dropdown
  navigateTo("/profile");
};

// Handle mobile logout
const handleMobileLogout = async () => {
  try {
    closeMobileMenu(); // Close mobile menu before logout
    await logout();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Handle create button click (desktop)
const handleCreateClick = () => {
  if (isAuthenticated.value) {
    // Navigate to create product page
    navigateTo("/create");
  } else {
    // Navigate to login page for guests
    navigateTo("/login");
  }
};

// Handle create button click (mobile)
const handleMobileCreateClick = () => {
  closeMobileMenu();
  if (isAuthenticated.value) {
    // Navigate to create product page
    navigateTo("/create");
  } else {
    // Navigate to login page for guests
    navigateTo("/login");
  }
};
</script>
