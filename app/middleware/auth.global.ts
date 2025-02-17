// app/middleware/auth.global.ts
import { authClient } from '~/utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const router = useRouter()
  const { data: session } = await authClient.useSession(useFetch)
  const { data: signupData, error: signupError } = await useFetch('/api/auth/check-signup-availability')

  // 需要登录的受保护页面（支持多个路径）
  const protectedRoutes = [/^\/dashboard/]

  if (signupError.value) {
    console.error('Error checking signup availability:', signupError.value)
    // 可以根据需求进行进一步处理，这里简单返回
    return
  }

  const canRegister = signupData.value?.canRegister as boolean

  if (session.value) {
    // 如果用户已登录，不允许访问登录和注册页面，重定向到 /dashboard
    if (to.path === '/auth/login' || to.path === '/auth/signup') {
      return router.push('/dashboard')
    }
  }
  else {
    // 如果用户未登录，且访问的是受保护页面，则跳转到首页
    if (protectedRoutes.some(regex => regex.test(to.path))) {
      return router.push('/')
    }

    // 如果用户未登录，且注册可用性为真，并且当前访问的不是注册页面，则跳转到注册页面
    if (canRegister && to.path !== '/auth/signup') {
      return router.push('/auth/signup')
    }
  }

  // 检查是否访问注册页面
  if (to.path === '/auth/signup') {
    if (!canRegister) {
      // 如果不允许注册，重定向到首页
      return router.push('/')
    }
  }
})
