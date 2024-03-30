import ClemAllTheListsEdited from '@/components/ClemAllTheListsEdited.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
        path : "/",
        name : 'home',
        component: ClemAllTheListsEdited,
      }
  ],
});

export default router;