import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: LoginView
    },
    {
      path: '/register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      component: DashboardView
    },
    {
      path: '/',
      redirect: '/dashboard'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const user = localStorage.getItem('currentUser');

  if (authRequired && !user) {
    return next('/login');
  }

  if (user && publicPages.includes(to.path)) {
    return next('/dashboard');
  }

  next();
});

export default router;