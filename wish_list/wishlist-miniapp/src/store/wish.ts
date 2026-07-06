import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WishItem, AddWishParams, EditWishParams, PageResult } from '@/types'
import { isMockMode, mockCallFunction } from '@/utils/mock'

export const useWishStore = defineStore('wish', () => {
  const items = ref<WishItem[]>([])
  const loading = ref<boolean>(false)
  const hasMore = ref<boolean>(true)
  const currentPage = ref<number>(1)
  const pageSize = 10

  /**
   * 获取我的心愿清单
   */
  async function fetchMyWishes(reset = false) {
    if (loading.value) return

    if (reset) {
      currentPage.value = 1
      hasMore.value = true
      items.value = []
    }

    if (!hasMore.value) return

    loading.value = true
    try {
      let result: { code: number; data: PageResult<WishItem>; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'wish-crud',
          data: {
            action: 'getList',
            page: currentPage.value,
            pageSize
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'wish-crud',
          data: {
            action: 'getList',
            page: currentPage.value,
            pageSize
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        const data = result.data as PageResult<WishItem>
        if (reset) {
          items.value = data.list
        } else {
          items.value = [...items.value, ...data.list]
        }
        hasMore.value = data.hasMore
        currentPage.value++
      }
    } catch (e) {
      console.error('获取心愿清单失败', e)
      uni.showToast({
        title: '获取心愿清单失败',
        icon: 'none'
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 添加心愿
   */
  async function addWish(params: AddWishParams): Promise<WishItem> {
    try {
      uni.showLoading({ title: '添加中...', mask: true })

      let result: { code: number; data: WishItem; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'wish-crud',
          data: {
            action: 'add',
            ...params
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'wish-crud',
          data: {
            action: 'add',
            ...params
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        const newItem = result.data as WishItem
        items.value.unshift(newItem)
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        })
        return newItem
      } else {
        throw new Error(result.message || '添加失败')
      }
    } catch (e) {
      uni.showToast({
        title: '添加失败，请重试',
        icon: 'none'
      })
      throw e
    } finally {
      uni.hideLoading()
    }
  }

  /**
   * 更新心愿
   */
  async function updateWish(params: EditWishParams): Promise<WishItem> {
    try {
      uni.showLoading({ title: '保存中...', mask: true })

      let result: { code: number; data: WishItem; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'wish-crud',
          data: {
            action: 'update',
            ...params
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'wish-crud',
          data: {
            action: 'update',
            ...params
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        const updatedItem = result.data as WishItem
        const index = items.value.findIndex(item => item._id === updatedItem._id)
        if (index !== -1) {
          items.value[index] = updatedItem
        }
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        return updatedItem
      } else {
        throw new Error(result.message || '更新失败')
      }
    } catch (e) {
      uni.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
      throw e
    } finally {
      uni.hideLoading()
    }
  }

  /**
   * 删除心愿
   */
  async function deleteWish(id: string) {
    try {
      uni.showLoading({ title: '删除中...', mask: true })

      let result: { code: number; data: any; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'wish-crud',
          data: {
            action: 'delete',
            id
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'wish-crud',
          data: {
            action: 'delete',
            id
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        items.value = items.value.filter(item => item._id !== id)
        uni.showToast({
          title: '已删除',
          icon: 'success'
        })
      } else {
        throw new Error(result.message || '删除失败')
      }
    } catch (e) {
      uni.showToast({
        title: '删除失败，请重试',
        icon: 'none'
      })
      throw e
    } finally {
      uni.hideLoading()
    }
  }

  /**
   * 获取好友的心愿清单
   */
  async function fetchFriendWishes(friendId: string, reset = false, priceRange?: { min: number; max: number }): Promise<WishItem[]> {
    try {
      let result: { code: number; data: PageResult<WishItem>; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'wish-crud',
          data: {
            action: 'getFriendList',
            friendId,
            page: reset ? 1 : currentPage.value,
            pageSize,
            priceMin: priceRange?.min,
            priceMax: priceRange?.max
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'wish-crud',
          data: {
            action: 'getFriendList',
            friendId,
            page: reset ? 1 : currentPage.value,
            pageSize,
            priceMin: priceRange?.min,
            priceMax: priceRange?.max
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        const data = result.data as PageResult<WishItem>
        return data.list
      }
      return []
    } catch (e) {
      console.error('获取好友心愿清单失败', e)
      return []
    }
  }

  /**
   * 获取单个心愿详情
   */
  async function fetchWishDetail(id: string): Promise<WishItem | null> {
    try {
      let result: { code: number; data: WishItem; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'wish-crud',
          data: {
            action: 'getDetail',
            id
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'wish-crud',
          data: {
            action: 'getDetail',
            id
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        return result.data as WishItem
      }
      return null
    } catch (e) {
      console.error('获取心愿详情失败', e)
      return null
    }
  }

  return {
    items,
    loading,
    hasMore,
    currentPage,
    fetchMyWishes,
    addWish,
    updateWish,
    deleteWish,
    fetchFriendWishes,
    fetchWishDetail
  }
})
