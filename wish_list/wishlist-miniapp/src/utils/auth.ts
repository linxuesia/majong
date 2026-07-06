import type { User, LoginResult } from '@/types'
import { isMockMode, mockCallFunction } from '@/utils/mock'

/**
 * 微信登录，获取 token 和用户信息
 */
export function wxLogin(): Promise<LoginResult> {
  return new Promise((resolve, reject) => {
    if (isMockMode()) {
      // Mock 模式：模拟登录
      setTimeout(async () => {
        try {
          const res = await mockCallFunction({
            name: 'wish-login',
            data: { code: 'mock_code' }
          })
          const result = res as { code: number; data: LoginResult; message: string }
          if (result.code === 0) {
            uni.setStorageSync('token', result.data.token)
            uni.setStorageSync('userInfo', result.data.userInfo)
            resolve(result.data)
          } else {
            reject(new Error(result.message || '登录失败'))
          }
        } catch (e) {
          reject(e)
        }
      }, 500)
      return
    }

    uni.login({
      provider: 'weixin',
      success: async (loginRes) => {
        try {
          // 调用云函数进行登录
          const res = await uniCloud.callFunction({
            name: 'wish-login',
            data: {
              code: loginRes.code
            }
          }) as any

          const result = res.result as { code: number; data: LoginResult; message: string }
          if (result.code === 0) {
            // 保存 token 和用户信息
            uni.setStorageSync('token', result.data.token)
            uni.setStorageSync('userInfo', result.data.userInfo)
            resolve(result.data)
          } else {
            reject(new Error(result.message || '登录失败'))
          }
        } catch (e) {
          reject(e)
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '微信登录失败'))
      }
    })
  })
}

/**
 * 获取用户信息（新版 API，需要用户授权）
 */
export function getUserProfile(): Promise<{ nickName: string; avatarUrl: string }> {
  return new Promise((resolve, reject) => {
    if (isMockMode()) {
      // Mock 模式：直接返回模拟数据
      setTimeout(() => {
        resolve({
          nickName: '心愿达人',
          avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0'
        })
      }, 300)
      return
    }

    uni.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        resolve({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '获取用户信息失败'))
      }
    })
  })
}

/**
 * 更新用户信息到服务端
 */
export async function updateUserInfo(info: { nickName: string; avatarUrl: string }) {
  const token = uni.getStorageSync('token')
  if (!token) {
    throw new Error('未登录')
  }

  if (isMockMode()) {
    // Mock 模式：更新本地存储
    const res = await mockCallFunction({
      name: 'wish-login',
      data: {
        action: 'updateUserInfo',
        token,
        ...info
      }
    })
    const result = res as { code: number; data: User; message: string }
    if (result.code === 0) {
      uni.setStorageSync('userInfo', result.data)
      return result.data
    } else {
      throw new Error(result.message || '更新用户信息失败')
    }
  }

  const res = await uniCloud.callFunction({
    name: 'wish-login',
    data: {
      action: 'updateUserInfo',
      token,
      ...info
    }
  }) as any

  const result = res.result as { code: number; data: User; message: string }
  if (result.code === 0) {
    uni.setStorageSync('userInfo', result.data)
    return result.data
  } else {
    throw new Error(result.message || '更新用户信息失败')
  }
}

/**
 * 获取本地存储的 token
 */
export function getToken(): string {
  return uni.getStorageSync('token') || ''
}

/**
 * 设置 token
 */
export function setToken(token: string) {
  uni.setStorageSync('token', token)
}

/**
 * 移除 token
 */
export function removeToken() {
  uni.removeStorageSync('token')
  uni.removeStorageSync('userInfo')
}

/**
 * 获取本地存储的用户信息
 */
export function getLocalUserInfo(): User | null {
  const info = uni.getStorageSync('userInfo')
  return info || null
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  return !!uni.getStorageSync('token')
}
