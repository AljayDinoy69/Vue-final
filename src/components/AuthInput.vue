<script setup lang="ts">
defineProps<{
  modelValue: string;
  label: string;
  type?: string;
  error?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{ 'border-red-500': error }"
    />
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>