<template>
  <!-- uni-app App.vue 不需要 template 内容，页面由 pages.json 管理 -->
</template>

<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useUserStore } from './store/user'

onLaunch(async () => {
  console.log('App Launch')
  const userStore = useUserStore()
  const token = uni.getStorageSync('token')
  if (token) {
    userStore.token = token
    try {
      await userStore.fetchUserInfo()
    } catch (e) {
      console.error('获取用户信息失败', e)
    }
  }
})
</script>

<style lang="scss">
@import './uni.scss';

page {
  background-color: $bg-color;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  color: $text-primary;
}

.container {
  padding: 24rpx;
}
</style>
