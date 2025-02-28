// app/stores/optionStore.ts
import { defineStore } from 'pinia'
import type { FetchError } from 'ofetch'

// 定义接口
interface OptionConfig {
  project_title: string
  project_github_url: string
  project_license_url: string
  project_license_type: string
  logo_light_mode: string
  logo_dark_mode: string
}

export const useOptionStore = defineStore('option', {
  state: () => ({
    isLoading: true,
    projectTitle: '',
    nowYear: new Date().getFullYear(),
    projectGithubUrl: '',
    projectLicenseUrl: '',
    projectLicenseType: '',
    logoLightMode: '',
    logoDarkMode: '',
    error: null as FetchError | null,
  }),
  actions: {
    // 获取配置数据
    async loadOptions() {
      this.isLoading = true
      this.error = null

      try {
        const response = await fetch('/api/option')
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`)
        }

        const responseData = await response.json()

        // 直接从响应数据中提取所需信息
        this.projectTitle = responseData.project_title || ''
        this.projectGithubUrl = responseData.project_github_url || ''
        this.projectLicenseUrl = responseData.project_license_url || ''
        this.projectLicenseType = responseData.project_license_type || ''
        this.logoLightMode = responseData.logo_light_mode || ''
        this.logoDarkMode = responseData.logo_dark_mode || ''
      }
      catch (err: any) {
        this.error = err as FetchError
        console.error('Failed to load options:', err)
      }
      finally {
        this.isLoading = false
      }
    },
  },
})
