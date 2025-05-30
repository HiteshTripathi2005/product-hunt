export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();

  if (
    isAuthenticated.value &&
    (to.path === "/login" || to.path === "/register")
  ) {
    return navigateTo("/");
  }
});
