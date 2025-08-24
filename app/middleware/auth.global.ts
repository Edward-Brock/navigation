import { authClient } from '~/utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const router = useRouter()
  const { data: session } = await authClient.useSession(useFetch)

  // 需要登录的受保护页面（支持多个路径）
  const protectedRoutes = [/^\/dashboard/, /^\/settings/]

  if (session.value) {
    // 登录用户不应访问登录或注册页面
    if (to.path === '/auth/login' || to.path === '/auth/signup') {
      return router.push('/')
    }
  }
  else {
    // 如果用户未登录，且访问的是受保护页面，则跳转到首页
    if (protectedRoutes.some(regex => regex.test(to.path))) {
      return router.push('/auth/login')
    }
  }
})
