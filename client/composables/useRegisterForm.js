export const useRegisterForm = () => {
  const form = reactive({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    avatar: null,
    agreeToTerms: false,
  });

  const passwordMismatch = computed(() => {
    return (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    );
  });

  const resetForm = () => {
    form.firstName = "";
    form.lastName = "";
    form.email = "";
    form.password = "";
    form.confirmPassword = "";
    form.bio = "";
    form.avatar = null;
    form.agreeToTerms = false;
  };

  return {
    form,
    passwordMismatch,
    resetForm,
  };
};
