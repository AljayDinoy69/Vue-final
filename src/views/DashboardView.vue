<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { usePhotos } from '../composables/usePhotos';
import PhotoCard from '../components/PhotoCard.vue';
import { PHOTO_CATEGORIES, type PhotoCategory } from '../types/auth';

const router = useRouter();
const { user, logout } = useAuth();

if (!user.value) {
  router.push('/login');
}

const { photos, selectedCategory, isLoading, addPhoto, updatePhoto, deletePhoto } = usePhotos(user.value?.id || '');

const selectedFile = ref<File | null>(null);
const photoTitle = ref('');
const photoDescription = ref('');
const photoCategory = ref<PhotoCategory>('Other');
const uploadError = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
  }
};

const resetForm = () => {
  photoTitle.value = '';
  photoDescription.value = '';
  photoCategory.value = 'Other';
  selectedFile.value = null;
  uploadError.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const handleUpload = async () => {
  if (!selectedFile.value) {
    uploadError.value = 'Please select a file';
    return;
  }
  if (!photoTitle.value) {
    uploadError.value = 'Please enter a title';
    return;
  }
  if (!photoDescription.value) {
    uploadError.value = 'Please enter a description';
    return;
  }

  try {
    await addPhoto(selectedFile.value, photoTitle.value, photoDescription.value, photoCategory.value);
    resetForm();
  } catch (error) {
    uploadError.value = 'Failed to upload photo';
  }
};

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <nav class="bg-white shadow-sm backdrop-blur-md bg-opacity-90 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Photo Gallery
          </h1>
          <div class="flex items-center gap-4">
            <span class="text-gray-600 animate-slide-in">Welcome, {{ user?.name }}</span>
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 button-pop shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            @click="selectedCategory = 'all'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all"
            :class="selectedCategory === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            All Photos
          </button>
          <button
            v-for="category in PHOTO_CATEGORIES"
            :key="category"
            @click="selectedCategory = category"
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            :class="selectedCategory === category 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8 hover-lift">
        <h2 class="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Upload New Photo
        </h2>
        <div class="space-y-4">
          <div class="group">
            <label class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              Photo Title
            </label>
            <input
              v-model="photoTitle"
              type="text"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              placeholder="Enter photo title"
            />
          </div>
          <div class="group">
            <label class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              Description
            </label>
            <textarea
              v-model="photoDescription"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              placeholder="Enter photo description"
            ></textarea>
          </div>
          <div class="group">
            <label class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              Category
            </label>
            <select
              v-model="photoCategory"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
            >
              <option v-for="category in PHOTO_CATEGORIES" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="group">
            <label class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              Select Photo
            </label>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="mt-1 block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
            />
          </div>
          <div v-if="uploadError" class="text-red-500 text-sm animate-fade-in">
            {{ uploadError }}
          </div>
          <button
            @click="handleUpload"
            :disabled="isLoading"
            class="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 button-pop shadow-sm transition-all"
          >
            {{ isLoading ? 'Uploading...' : 'Upload Photo' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <PhotoCard
          v-for="photo in photos"
          :key="photo.id"
          :photo="photo"
          :onUpdate="updatePhoto"
          :onDelete="deletePhoto"
        />
      </div>

      <div v-if="photos.length === 0" class="text-center py-12 text-gray-500 animate-fade-in">
        No photos uploaded yet. Start by uploading your first photo!
      </div>
    </main>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>