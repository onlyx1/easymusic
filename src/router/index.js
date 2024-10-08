import { createRouter, createWebHistory } from 'vue-router'
import DiscoverMusic from '../views/DiscoverMusic.vue'
import Playlists from '../views/Playlists.vue'
import LatestMusic from '../views/LatestMusic.vue'
import LatestMV from '../views/LatestMV.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'discover',
      component: DiscoverMusic
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: Playlists
    },
    {
      path: '/latest-music',
      name: 'latestMusic',
      component: LatestMusic
    },
    {
      path: '/latest-mv',
      name: 'latestMV',
      component: LatestMV
    }
  ]
})

export default router