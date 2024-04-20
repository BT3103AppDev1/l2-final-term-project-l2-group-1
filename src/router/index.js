import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import OnlyProfit from '@/views/OnlyProfit.vue'
import Profile from '@/views/Profile.vue'
import NotFound from '@/views/NotFound.vue'
import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
// import ForgotPassword from '@/views/ForgotPassword.vue'


const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration
  },
  // {
  //   path: '/forgotpassword',
  //   name: 'ForgotPassword',
  //   component: ForgotPassword
  // },
  {

    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'Analytics',
    component: About
  },

  {
    path: '/profit',
    name: 'OnlyProfit',
    component: OnlyProfit
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },

  {
    path: '/:catchAll(.*)',
    name:'NotFound',
    component: NotFound,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



