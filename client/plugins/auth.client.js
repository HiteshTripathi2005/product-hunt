export default defineNuxtPlugin(async () => {
  const { getCurrentUser } = useAuth();

  // Only run on client-side
  if (process.client) {
    try {
      await getCurrentUser();
    } catch (error) {
      // User not authenticated on app start
      console.log("User not authenticated on app start");
    }
  }
});
