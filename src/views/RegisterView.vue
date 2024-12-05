<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import AuthInput from '../components/AuthInput.vue';
import AuthButton from '../components/AuthButton.vue';
import type { RegisterCredentials } from '../types/auth';

const router = useRouter();
const { register, isLoading, error } = useAuth();

const credentials = ref<RegisterCredentials>({
  email: '',
  password: '',
  name: '',
  confirmPassword: ''
});

const validationError = ref<string | null>(null);

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  
  if (credentials.value.password !== credentials.value.confirmPassword) {
    validationError.value = 'Passwords do not match';
    return;
  }

  await register(credentials.value);
  if (!error.value) {
    router.push('/dashboard');
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <AuthInput
            v-model="credentials.name"
            label="Full Name"
          />
          <AuthInput
            v-model="credentials.email"
            label="Email"
            type="email"
          />
          <AuthInput
            v-model="credentials.password"
            label="Password"
            type="password"
          />
          <AuthInput
            v-model="credentials.confirmPassword"
            label="Confirm Password"
            type="password"
            :error="validationError"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <AuthButton :loading="isLoading">Register</AuthButton>

        <div class="text-center">
          <router-link
            to="/login"
            class="text-sm text-blue-500 hover:text-blue-700"
          >
            Already have an account? Sign in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>