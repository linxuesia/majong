import type { ApiResponse } from '@/types'

const BASE_URL = '' // 云函数调用时不需要 baseURL

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  showLoading?: boolean
  showErrorMessage?: boolean
}

/**
 * 封装 uni.request，带 token 和错误处理
 */
export function request<T = any>(options: RequestOptions): Promise<T> {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    showLoading = false,
    showErrorMessage = true
  } = options

  if (showLoading) {
    uni.showLoading({ title: '加载中...', mask: true })
  }

  const token = uni.getStorageSync('token')
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => {
        if (showLoading) {
          uni.hideLoading()
        }

        const statusCode = res.statusCode
        if (statusCode >= 200 && statusCode < 300) {
          const responseData = res.data as ApiResponse<T>
          if (responseData.code === 0 || responseData.code === 200) {
            resolve(responseData.data)
          } else {
            if (showErrorMessage) {
              uni.showToast({
                title: responseData.message || '请求失败',
                icon: 'none',
                duration: 2000
              })
            }
            reject(new Error(responseData.message || '请求失败'))
          }
        } else if (statusCode === 401) {
          // token 过期，清除登录状态
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          setTimeout(() => {
            // 跳转到登录页或重新登录
            reLogin()
          }, 1500)
          reject(new Error('未授权'))
        } else {
          if (showErrorMessage) {
            uni.showToast({
              title: `请求失败(${statusCode})`,
              icon: 'none',
              duration: 2000
            })
          }
          reject(new Error(`请求失败: ${statusCode}`))
        }
      },
      fail: (err) => {
        if (showLoading) {
          uni.hideLoading()
        }
        if (showErrorMessage) {
          uni.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
        reject(new Error(err.errMsg || '网络异常'))
      }
    })
  })
}

/**
 * GET 请求
 */
export function get<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<T> {
  return request<T>({ url, method: 'GET', data, ...options })
}

/**
 * POST 请求
 */
export function post<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<T> {
  return request<T>({ url, method: 'POST', data, ...options })
}

/**
 * PUT 请求
 */
export function put<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<T> {
  return request<T>({ url, method: 'PUT', data, ...options })
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<T> {
  return request<T>({ url, method: 'DELETE', data, ...options })
}

/**
 * 重新登录
 */
function reLogin() {
  // 通过 eventChannel 或全局事件通知重新登录
  uni.$emit('reLogin')
}

export default request
