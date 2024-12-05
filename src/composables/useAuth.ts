import { ref, watch } from 'vue';
import type { LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { v4 as uuidv4 } from 'uuid';

export function useAuth() {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Initialize user from localStorage
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }

  // Watch for user changes and update localStorage
  watch(user, (newUser) => {
    if (newUser) {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  });

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: User) => 
        u.email === credentials.email && u.password === credentials.password
      );

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      user.value = foundUser;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed';
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some((u: User) => u.email === credentials.email)) {
        throw new Error('Email already exists');
      }

      const newUser: User = {
        id: uuidv4(),
        email: credentials.email,
        name: credentials.name,
        password: credentials.password
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      user.value = newUser;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Registration failed';
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout
  };
}