import { ref, computed } from 'vue';
import type { Photo, PhotoCategory } from '../types/auth';
import { v4 as uuidv4 } from 'uuid';

export function usePhotos(userId: string) {
  const photos = ref<Photo[]>([]);
  const selectedCategory = ref<PhotoCategory | 'all'>('all');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const filteredPhotos = computed(() => {
    if (selectedCategory.value === 'all') {
      return photos.value;
    }
    return photos.value.filter(photo => photo.category === selectedCategory.value);
  });

  const loadPhotos = () => {
    const allPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
    photos.value = allPhotos.filter((photo: Photo) => photo.userId === userId);
  };

  const addPhoto = async (file: File, title: string, description: string, category: PhotoCategory) => {
    isLoading.value = true;
    error.value = null;

    try {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: Photo = {
            id: uuidv4(),
            userId,
            url: e.target?.result as string,
            title,
            description,
            category,
            createdAt: new Date().toISOString()
          };

          const allPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
          allPhotos.push(newPhoto);
          localStorage.setItem('photos', JSON.stringify(allPhotos));
          
          photos.value.push(newPhoto);
          resolve();
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to upload photo';
    } finally {
      isLoading.value = false;
    }
  };

  const updatePhoto = async (photoId: string, updates: { 
    title?: string; 
    description?: string;
    category?: PhotoCategory;
    file?: File 
  }) => {
    isLoading.value = true;
    error.value = null;

    try {
      const allPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
      const photoIndex = allPhotos.findIndex((p: Photo) => p.id === photoId);

      if (photoIndex === -1) {
        throw new Error('Photo not found');
      }

      if (updates.file) {
        return new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            allPhotos[photoIndex] = {
              ...allPhotos[photoIndex],
              url: e.target?.result as string,
              title: updates.title || allPhotos[photoIndex].title,
              description: updates.description || allPhotos[photoIndex].description,
              category: updates.category || allPhotos[photoIndex].category
            };
            localStorage.setItem('photos', JSON.stringify(allPhotos));
            loadPhotos();
            resolve();
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(updates.file);
        });
      } else {
        allPhotos[photoIndex] = {
          ...allPhotos[photoIndex],
          title: updates.title || allPhotos[photoIndex].title,
          description: updates.description || allPhotos[photoIndex].description,
          category: updates.category || allPhotos[photoIndex].category
        };
        localStorage.setItem('photos', JSON.stringify(allPhotos));
        loadPhotos();
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update photo';
    } finally {
      isLoading.value = false;
    }
  };

  const deletePhoto = (photoId: string) => {
    const allPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
    const updatedPhotos = allPhotos.filter((photo: Photo) => photo.id !== photoId);
    localStorage.setItem('photos', JSON.stringify(updatedPhotos));
    photos.value = photos.value.filter(photo => photo.id !== photoId);
  };

  // Load photos initially
  loadPhotos();

  return {
    photos: filteredPhotos,
    selectedCategory,
    isLoading,
    error,
    addPhoto,
    updatePhoto,
    deletePhoto
  };
}