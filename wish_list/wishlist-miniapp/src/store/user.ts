import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { wxLogin, getUserProfile, updateUserInfo, removeToken, getLocalUserInfo } from '@/utils/auth'
import { isMockMode, mockCallFunction } from '@/utils/mock'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<User | null>(getLocalUserInfo())
  const token = ref<string>(uni.getStorageSync('token') || '')
  const isLoggedIn = ref<boolean>(!!token.value)

  /**
   * 微信登录
   */
  async function login() {
    try {
      uni.showLoading({ title: '登录中...', mask: true })
      const result = await wxLogin()
      token.value = result.token
      userInfo.value = result.userInfo
      isLoggedIn.value = true

      // 尝试获取更详细的用户信息
      try {
        const profile = await getUserProfile()
        await updateUserInfo(profile)
        userInfo.value = {
          ...userInfo.value!,
          nickName: profile.nickName,
          avatarUrl: profile.avatarUrl
        }
      } catch {
        // 用户拒绝授权，使用默认信息
        console.log('用户拒绝授权获取详细信息')
      }

      uni.hideLoading()
      return result
    } catch (e) {
      uni.hideLoading()
      uni.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
      throw e
    }
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    try {
      if (isMockMode()) {
        const res = await mockCallFunction({
          name: 'wish-login',
          data: {
            action: 'getUserInfo',
            token: token.value
          }
        })
        if (res.code === 0) {
          userInfo.value = res.data
          uni.setStorageSync('userInfo', res.data)
        }
        return
      }

      const res = await uniCloud.callFunction({
        name: 'wish-login',
        data: {
          action: 'getUserInfo',
          token: token.value
        }
      }) as any

      const result = res.result
      if (result.code === 0) {
        userInfo.value = result.data
        uni.setStorageSync('userInfo', result.data)
      }
    } catch (e) {
      console.error('获取用户信息失败', e)
    }
  }

  /**
   * 退出登录
   */
  function logout() {
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false
    removeToken()
    uni.showToast({
      title: '已退出登录',
      icon: 'none'
    })
  }

  /**
   * 检查登录状态，未登录则跳转登录
   */
  function checkLogin(): boolean {
    if (!isLoggedIn.value || !token.value) {
      uni.showModal({
        title: '提示',
        content: '请先登录',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            login()
          }
        }
      })
      return false
    }
    return true
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    login,
    logout,
    fetchUserInfo,
    checkLogin
  }
})
