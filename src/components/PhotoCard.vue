<script setup lang="ts">
import { ref } from 'vue';
import type { Photo, PhotoCategory } from '../types/auth';
import { PHOTO_CATEGORIES } from '../types/auth';
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const props = defineProps<{
  photo: Photo;
  onUpdate: (photoId: string, updates: { 
    title?: string; 
    description?: string;
    category?: PhotoCategory;
    file?: File 
  }) => Promise<void>;
  onDelete: (photoId: string) => void;
}>();

const isEditing = ref(false);
const editedTitle = ref(props.photo.title);
const editedDescription = ref(props.photo.description);
const editedCategory = ref<PhotoCategory>(props.photo.category);
const selectedFile = ref<File | null>(null);
const isLoading = ref(false);

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
  }
};

const handleUpdate = async () => {
  isLoading.value = true;
  try {
    await props.onUpdate(props.photo.id, {
      title: editedTitle.value,
      description: editedDescription.value,
      category: editedCategory.value,
      file: selectedFile.value || undefined
    });
    isEditing.value = false;
    selectedFile.value = null;
  } finally {
    isLoading.value = false;
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editedTitle.value = props.photo.title;
  editedDescription.value = props.photo.description;
  editedCategory.value = props.photo.category;
  selectedFile.value = null;
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden hover-lift animate-fade-in">
    <div class="relative group">
      <img
        :src="photo.url"
        :alt="photo.title"
        class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div class="p-4">
      <div v-if="!isEditing">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-bold text-lg text-gray-800">{{ photo.title }}</h3>
          <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {{ photo.category }}
          </span>
        </div>
        <p class="text-gray-600 text-sm mb-3">{{ photo.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">
            {{ new Date(photo.createdAt).toLocaleDateString() }}
          </span>
          <div class="space-x-2">
            <button
              @click="isEditing = true"
              class="text-blue-500 hover:text-blue-700 button-pop transition-colors"
            >
              Edit
            </button>
            <button
              @click="onDelete(photo.id)"
              class="text-red-500 hover:text-red-700 button-pop transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-else class="space-y-3 animate-fade-in">
        <div class="group">
          <label class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
            Title
          </label>
          <input
            v-model="editedTitle"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div class="group">
          <label class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
            Description
          </label>
          <textarea
            v-model="editedDescription"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          ></textarea>
        </div>
        <div class="group">
          <label class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
            Category
          </label>
          <select
            v-model="editedCategory"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option v-for="category in PHOTO_CATEGORIES" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="group">
          <label class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
            New Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <button
            @click="cancelEdit"
            class="px-3 py-1 text-gray-600 hover:text-gray-800 button-pop transition-colors"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            @click="handleUpdate"
            class="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 button-pop shadow-sm transition-all"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>