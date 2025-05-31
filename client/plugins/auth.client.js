export default defineNuxtPlugin(async () => {
  const { getCurrentUser, isInitialized } = useAuth();

  // Only run on client-side
  if (process.client) {
    try {
      // Check if already initialized to avoid duplicate calls
      if (!isInitialized.value) {
        await getCurrentUser();
      }
    } catch (error) {
      // User not authenticated on app start
      console.log("User not authenticated on app start");
    }
  }
});
