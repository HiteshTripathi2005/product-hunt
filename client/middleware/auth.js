export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side to avoid SSR issues
  if (process.server) {
    return;
  }

  const { isAuthenticated, isInitialized, getCurrentUser } = useAuth();

  // Wait for auth initialization if not already done
  if (!isInitialized.value) {
    try {
      await getCurrentUser();
    } catch (error) {
      // User not authenticated
      console.log("Auth check failed in middleware");
    }
  }

  // Now check authentication status
  if (!isAuthenticated.value) {
    // Avoid redirect loop if already going to login
    if (to.path !== "/login") {
      // Preserve the intended destination in query params
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
    }
  }
});
