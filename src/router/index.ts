import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/Home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: {name: "adminMain"},
    component: () => import('@/views/Admin/Admin.vue'),
    children: [{
      path: 'main',
      name: 'adminMain',
      component: () => import('@/components/Admin/Main.vue'),
    }, {
      path: 'categoryMain',
      name: 'categoryMain',
      component: () => import('@/components/Admin/category/Main.vue'),
    }],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router