<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import AuthInput from '../components/AuthInput.vue';
import AuthButton from '../components/AuthButton.vue';
import type { LoginCredentials } from '../types/auth';


const router = useRouter();
const { login, isLoading, error } = useAuth();

const credentials = ref<LoginCredentials>({
  email: '',
  password: ''
});

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  await login(credentials.value);
  if (!error.value) {
    router.push('/dashboard');
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
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
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <AuthButton :loading="isLoading">Sign in</AuthButton>

        <div class="text-center">
          <router-link
            to="/register"
            class="text-sm text-blue-500 hover:text-blue-700"
          >
            Don't have an account? Register
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>