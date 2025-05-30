<template>
  <textarea
    :class="cn(textareaVariants({ variant, size, class: props.class }))"
    v-bind="$attrs"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
import { textareaVariants } from "./index";
import { cn } from "@/lib/utils";

const props = defineProps({
  class: {
    type: [String, Object, Array],
    default: "",
  },
  variant: {
    type: String,
    default: "default",
  },
  size: {
    type: String,
    default: "default",
  },
  modelValue: {
    type: String,
    default: "",
  },
});

defineEmits(["update:modelValue"]);
</script>
