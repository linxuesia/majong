import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Claim } from '@/types'
import { isMockMode, mockCallFunction } from '@/utils/mock'

export const useClaimStore = defineStore('claim', () => {
  const myClaims = ref<Claim[]>([])
  const receivedClaims = ref<Claim[]>([])
  const loading = ref<boolean>(false)

  /**
   * 认领心愿
   */
  async function claimWish(wishId: string) {
    try {
      uni.showLoading({ title: '认领中...', mask: true })

      let result: { code: number; data: Claim; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'claim-ops',
          data: {
            action: 'claim',
            wishId
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'claim-ops',
          data: {
            action: 'claim',
            wishId
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        uni.showToast({
          title: '认领成功',
          icon: 'success'
        })
        return result.data as Claim
      } else {
        throw new Error(result.message || '认领失败')
      }
    } catch (e) {
      uni.showToast({
        title: '认领失败，请重试',
        icon: 'none'
      })
      throw e
    } finally {
      uni.hideLoading()
    }
  }

  /**
   * 取消认领
   */
  async function cancelClaim(claimId: string) {
    try {
      uni.showLoading({ title: '取消中...', mask: true })

      let result: { code: number; data: any; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'claim-ops',
          data: {
            action: 'cancel',
            claimId
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'claim-ops',
          data: {
            action: 'cancel',
            claimId
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        myClaims.value = myClaims.value.filter(c => c._id !== claimId)
        uni.showToast({
          title: '已取消认领',
          icon: 'success'
        })
      } else {
        throw new Error(result.message || '取消认领失败')
      }
    } catch (e) {
      uni.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      })
      throw e
    } finally {
      uni.hideLoading()
    }
  }

  /**
   * 获取我的认领列表
   */
  async function fetchMyClaims() {
    if (loading.value) return

    loading.value = true
    try {
      let result: { code: number; data: Claim[]; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'claim-ops',
          data: {
            action: 'getMyClaims'
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'claim-ops',
          data: {
            action: 'getMyClaims'
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        myClaims.value = result.data || []
      }
    } catch (e) {
      console.error('获取认领列表失败', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取我收到的认领（别人认领我的心愿）
   */
  async function fetchReceivedClaims() {
    try {
      let result: { code: number; data: Claim[]; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'claim-ops',
          data: {
            action: 'getReceivedClaims'
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'claim-ops',
          data: {
            action: 'getReceivedClaims'
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        receivedClaims.value = result.data || []
      }
    } catch (e) {
      console.error('获取收到的认领失败', e)
    }
  }

  /**
   * 确认完成认领（心愿所有者确认已收到礼物）
   */
  async function completeClaim(claimId: string) {
    try {
      uni.showLoading({ title: '确认中...', mask: true })

      let result: { code: number; data: any; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'claim-ops',
          data: {
            action: 'complete',
            claimId
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'claim-ops',
          data: {
            action: 'complete',
            claimId
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        receivedClaims.value = receivedClaims.value.map(c =>
          c._id === claimId ? { ...c, status: 'completed' as const } : c
        )
        uni.showToast({
          title: '已确认收到',
          icon: 'success'
        })
      } else {
        throw new Error(result.message || '确认失败')
      }
    } catch (e) {
      uni.showToast({
        title: '操作失败',
        icon: 'none'
      })
      throw e
    } finally {
      uni.hideLoading()
    }
  }

  return {
    myClaims,
    receivedClaims,
    loading,
    claimWish,
    cancelClaim,
    fetchMyClaims,
    fetchReceivedClaims,
    completeClaim
  }
})
