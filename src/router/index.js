import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import OverView from '@/components/OverView.vue'
import Crud from '@/components/Crud.vue'
import WatchList from '@/components/WatchList.vue'
import PlayList from '@/components/PlayList.vue'
import Blog from '@/components/Blog.vue'
import Customers from '@/components/Customers.vue'
import Settings from '@/components/Settings.vue'
import Profile from '@/components/Profile.vue'
import AuthView from '@/views/AuthView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'auth',
    //   component: AuthView,
    //   beforeEnter: (to, from, next) => {
    //     const userStore = useUserStore()
    //     if (!userStore.token) {
    //       next()
    //     } else {
    //       next({ name: 'overview' })
    //     }
    //   },
    //   children: [
    //     {
    //       path: 'login',
    //       name: 'login',
    //       component: () => import('../components/AuthLogin.vue'),
    //     },
    //     {
    //       path: 'signup',
    //       name: 'signup',
    //       component: () => import('../components/AuthSignUp.vue'),
    //     },
    //     {
    //       path: 'forgetPwd',
    //       name: 'forgetPwd',
    //       component: () => import('../components/AuthForgetPwd.vue'),
    //     },
    //     {
    //       path: 'changePwd',
    //       name: 'changePwd',
    //       component: () => import('../components/AuthResetPwd.vue'),
    //     },
    //   ],
    // },
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardView,
      children: [
        {
          path: '',
          name: 'overview',
          component: OverView,
        },
        {
          path: '/Crud',
          name: 'crud',
          component: Crud,
        },
        {
          path: '/WatchList',
          name: 'watchlist',
          component: WatchList,
        },
        {
          path: '/PlayList/:id',
          name: 'playlist',
          component: PlayList,
          props: true,
        },
        {
          path: '/Blog',
          name: 'blog',
          component: Blog,
        },
        {
          path: '/Customers',
          name: 'customers',
          component: Customers,
        },
        {
          path: '/Settings',
          name: 'settings',
          component: Settings,
        },
        {
          path: '/Profile',
          name: 'Profile',
          component: Profile,
        },
      ],
    },
  ],
})

export default router
