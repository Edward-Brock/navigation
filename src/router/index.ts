import { createRouter, createWebHistory } from "vue-router";
import { useLoginStore } from '@/stores/login.ts'

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
    meta: {requiresAuth: true},
    redirect: {name: "adminMain"},
    component: () => import('@/views/Admin/Admin.vue'),
    children: [{
      path: 'main',
      name: 'adminMain',
      component: () => import('@/components/Admin/AdminMain.vue'),
    }, {
      path: 'categoryMain',
      name: 'categoryMain',
      component: () => import('@/components/Admin/category/CategoryMain.vue'),
    }, {
      path: 'siteMain',
      name: 'siteMain',
      component: () => import('@/components/Admin/site/SiteMain.vue'),
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

/**
 * 路由守卫
 */
// @ts-ignore
router.beforeEach((to, from, next) => {
  const login = useLoginStore()
  /**
   * 判断该页面是否需要登录
   */
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 如果 Pinia 中授权为真则放行
    if (login.isAuthenticated) {
      next();
    } else {
      // 否则跳转到 login 登录页面
      next({
        path: "/login",
        // 保存我们所在的位置，以便以后再来
        query: {redirect: to.fullPath},
      });
    }
  } else {
    next();
  }
});

export default router