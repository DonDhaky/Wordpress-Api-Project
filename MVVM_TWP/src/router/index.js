import { createRouter, createWebHistory } from 'vue-router'
import AllTheLists from '@/components/AllTheLists.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AllTheLists // on écrit comme ça si c'est un component
    },
      // component: () => import('../views/AboutView.vue') -----> on écrit comme ça si c'est une vue
  ]
})

export default router
