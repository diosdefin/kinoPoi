import { createWebHashHistory, createRouter } from 'vue-router'
import HomeView from './pages/Home.vue'
import AboutView from './pages/About.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView, props: true },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router