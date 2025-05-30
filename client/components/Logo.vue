<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <rect
      width="32"
      height="32"
      rx="8"
      :fill="variant === 'dark' ? '#18181b' : '#ffffff'"
    />
    <path
      d="M8 12L16 8L24 12V20C24 21.1046 23.1046 22 22 22H10C8.89543 22 8 21.1046 8 20V12Z"
      :fill="variant === 'dark' ? '#ffffff' : '#3b82f6'"
    />
    <path
      d="M12 16L16 14L20 16V18H12V16Z"
      :fill="variant === 'dark' ? '#3b82f6' : '#ffffff'"
    />
    <circle
      cx="16"
      cy="12"
      r="2"
      :fill="variant === 'dark' ? '#ef4444' : '#ef4444'"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: string | number;
  variant?: "light" | "dark";
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 32,
  variant: "light",
  className: "",
});
</script>
