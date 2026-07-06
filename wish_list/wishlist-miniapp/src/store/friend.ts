import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FriendRelation } from '@/types'
import { isMockMode, mockCallFunction } from '@/utils/mock'

export const useFriendStore = defineStore('friend', () => {
  const friends = ref<FriendRelation[]>([])
  const loading = ref<boolean>(false)

  /**
   * 获取好友列表
   */
  async function fetchFriends() {
    if (loading.value) return

    loading.value = true
    try {
      let result: { code: number; data: FriendRelation[]; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'friend-ops',
          data: {
            action: 'getList'
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'friend-ops',
          data: {
            action: 'getList'
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        friends.value = result.data || []
      }
    } catch (e) {
      console.error('获取好友列表失败', e)
      uni.showToast({
        title: '获取好友列表失败',
        icon: 'none'
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索好友（通过微信搜索）
   */
  async function searchFriend(keyword: string): Promise<FriendRelation[]> {
    try {
      let result: { code: number; data: FriendRelation[]; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'friend-ops',
          data: {
            action: 'search',
            keyword
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'friend-ops',
          data: {
            action: 'search',
            keyword
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        return result.data || []
      }
      return []
    } catch (e) {
      console.error('搜索好友失败', e)
      return []
    }
  }

  /**
   * 添加好友（发送好友请求）
   */
  async function addFriend(friendId: string) {
    try {
      uni.showLoading({ title: '发送中...', mask: true })

      let result: { code: number; data: any; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'friend-ops',
          data: {
            action: 'add',
            friendId
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'friend-ops',
          data: {
            action: 'add',
            friendId
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        uni.showToast({
          title: '好友请求已发送',
          icon: 'success'
        })
      } else {
        throw new Error(result.message || '添加好友失败')
      }
    } catch (e) {
      uni.showToast({
        title: '添加好友失败',
        icon: 'none'
      })
      throw e
    } finally {
      uni.hideLoading()
    }
  }

  /**
   * 通过分享卡片添加好友
   */
  async function addFriendByShare(inviteCode: string) {
    try {
      let result: { code: number; data: any; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'friend-ops',
          data: {
            action: 'addByShare',
            inviteCode
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'friend-ops',
          data: {
            action: 'addByShare',
            inviteCode
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        uni.showToast({
          title: '添加好友成功',
          icon: 'success'
        })
        await fetchFriends()
        return true
      } else {
        throw new Error(result.message || '添加好友失败')
      }
    } catch (e) {
      uni.showToast({
        title: '添加好友失败',
        icon: 'none'
      })
      return false
    }
  }

  /**
   * 删除好友
   */
  async function removeFriend(friendId: string) {
    try {
      let result: { code: number; data: any; message: string }

      if (isMockMode()) {
        result = await mockCallFunction({
          name: 'friend-ops',
          data: {
            action: 'remove',
            friendId
          }
        })
      } else {
        const res = await uniCloud.callFunction({
          name: 'friend-ops',
          data: {
            action: 'remove',
            friendId
          }
        }) as any
        result = res.result
      }

      if (result.code === 0) {
        friends.value = friends.value.filter(f => f.friendId !== friendId)
        uni.showToast({
          title: '已删除好友',
          icon: 'success'
        })
      } else {
        throw new Error(result.message || '删除好友失败')
      }
    } catch (e) {
      uni.showToast({
        title: '删除好友失败',
        icon: 'none'
      })
    }
  }

  return {
    friends,
    loading,
    fetchFriends,
    searchFriend,
    addFriend,
    addFriendByShare,
    removeFriend
  }
})
