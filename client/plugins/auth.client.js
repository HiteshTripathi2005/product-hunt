export default defineNuxtPlugin(async () => {
  const { getCurrentUser } = useAuth();

  try {
    await getCurrentUser();
  } catch (error) {
    // User not authenticated on app start
  }
});
