import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/Auth/RegisterView.vue'
import LoginView from '../views/Auth/LoginView.vue'
import { useAuthStore } from '@/stores/auth'
import CreateView from '@/views/Posts/CreateView.vue'
import UserView from '@/views/Posts/UserView.vue'
import ShowView from '@/views/Posts/ShowView.vue'
import UpdateView from '@/views/Posts/UpdateView.vue'
import VerifyEmail from '@/views/Auth/VerifyEmailView.vue'
import VerifySuccess from '@/views/Auth/VerifySuccess.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {guest:true}
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {guest:true}
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
      meta: {auth:true},
    },
    {
      path: '/posts/:id',
      name: 'show',
      component: ShowView,
    },
      {
      path: '/posts/update/:id',
      name: 'update',
      component: UpdateView,
      meta: {auth:true},
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
      meta: {auth:true},
    },

    {
      path: "/verify-email",
      name: "verify-email",
      component: VerifyEmail,
      meta: { requiresAuth: true },
    },

{
    path: "/verification-success",
    name: "verification-success",
    component: VerifySuccess,
    meta: { requiresAuth: true, hideNav: true },
  },

    
  ],
})

router.beforeEach(async (to,from)=>{
  const authStore = useAuthStore();
  await authStore.getUser();

  if (authStore.user && to.meta.guest) {
    return { name: 'home'};
  } 

  if (!authStore.user && to.meta.auth) {
    return { name: 'login'};
  } 
});

export default router
