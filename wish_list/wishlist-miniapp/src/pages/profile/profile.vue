<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="profile-page__user-card">
      <view v-if="userStore.isLoggedIn && userStore.userInfo" class="profile-page__user-info">
        <image
          class="profile-page__avatar"
          :src="userStore.userInfo.avatarUrl || '/static/tab-profile.png'"
          mode="aspectFill"
          @click="handleChangeAvatar"
        />
        <view class="profile-page__user-detail">
          <view class="profile-page__nickname">{{ userStore.userInfo.nickName }}</view>
          <view class="profile-page__join-time">
            加入于 {{ formatTime(userStore.userInfo.createdAt) }}
          </view>
        </view>
      </view>
      <view v-else class="profile-page__login-hint" @click="handleLogin">
        <image
          class="profile-page__avatar profile-page__avatar--default"
          src="/static/tab-profile.png"
          mode="aspectFill"
        />
        <view class="profile-page__user-detail">
          <view class="profile-page__nickname">点击登录</view>
          <view class="profile-page__join-time">登录后使用全部功能</view>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="profile-page__stats">
      <view class="profile-page__stat-item" @click="goToMyWishes">
        <text class="profile-page__stat-num">{{ wishStore.items.length }}</text>
        <text class="profile-page__stat-label">我的心愿</text>
      </view>
      <view class="profile-page__stat-divider" />
      <view class="profile-page__stat-item" @click="goToMyClaims">
        <text class="profile-page__stat-num">{{ claimStore.myClaims.length }}</text>
        <text class="profile-page__stat-label">我认领的</text>
      </view>
      <view class="profile-page__stat-divider" />
      <view class="profile-page__stat-item" @click="goToReceivedClaims">
        <text class="profile-page__stat-num">{{ claimStore.receivedClaims.length }}</text>
        <text class="profile-page__stat-label">收到的认领</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="profile-page__menu">
      <view class="profile-page__menu-item" @click="goToMyClaims">
        <view class="profile-page__menu-left">
          <text class="profile-page__menu-icon">&#x1F381;</text>
          <text class="profile-page__menu-text">我认领的礼物</text>
        </view>
        <text class="profile-page__menu-arrow">></text>
      </view>
      <view class="profile-page__menu-item" @click="goToReceivedClaims">
        <view class="profile-page__menu-left">
          <text class="profile-page__menu-icon">&#x1F4E6;</text>
          <text class="profile-page__menu-text">收到的认领</text>
        </view>
        <text class="profile-page__menu-arrow">></text>
      </view>
      <view class="profile-page__menu-item" @click="goToMyWishes">
        <view class="profile-page__menu-left">
          <text class="profile-page__menu-icon">&#x2728;</text>
          <text class="profile-page__menu-text">我的心愿清单</text>
        </view>
        <text class="profile-page__menu-arrow">></text>
      </view>
    </view>

    <!-- 设置 -->
    <view class="profile-page__menu">
      <view class="profile-page__menu-item" @click="showAbout">
        <view class="profile-page__menu-left">
          <text class="profile-page__menu-icon">&#x2139;</text>
          <text class="profile-page__menu-text">关于我们</text>
        </view>
        <text class="profile-page__menu-arrow">></text>
      </view>
      <view class="profile-page__menu-item" @click="clearCache">
        <view class="profile-page__menu-left">
          <text class="profile-page__menu-icon">&#x1F5D1;</text>
          <text class="profile-page__menu-text">清除缓存</text>
        </view>
        <text class="profile-page__menu-arrow">></text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="userStore.isLoggedIn" class="profile-page__logout">
      <button class="profile-page__logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import { useWishStore } from '@/store/wish'
import { useClaimStore } from '@/store/claim'

const userStore = useUserStore()
const wishStore = useWishStore()
const claimStore = useClaimStore()

onMounted(() => {
  if (userStore.isLoggedIn) {
    wishStore.fetchMyWishes(true)
    claimStore.fetchMyClaims()
    claimStore.fetchReceivedClaims()
  }
})

onShow(() => {
  if (userStore.isLoggedIn) {
    claimStore.fetchMyClaims()
    claimStore.fetchReceivedClaims()
  }
})

function formatTime(time: string): string {
  if (!time) return ''
  const date = new Date(time)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

async function handleLogin() {
  try {
    await userStore.login()
    // 登录成功后刷新数据
    wishStore.fetchMyWishes(true)
    claimStore.fetchMyClaims()
    claimStore.fetchReceivedClaims()
  } catch {
    // 错误已在 store 中处理
  }
}

function handleChangeAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempPath = res.tempFilePaths[0]
      uni.showLoading({ title: '上传中...' })
      uniCloud.uploadFile({
        filePath: tempPath,
        cloudPath: `avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
        success: async (uploadRes) => {
          try {
            const { updateUserInfo } = await import('@/utils/auth')
            await updateUserInfo({
              nickName: userStore.userInfo?.nickName || '',
              avatarUrl: uploadRes.fileID
            })
            if (userStore.userInfo) {
              userStore.userInfo.avatarUrl = uploadRes.fileID
            }
            uni.hideLoading()
            uni.showToast({ title: '头像更新成功', icon: 'success' })
          } catch {
            uni.hideLoading()
            uni.showToast({ title: '更新失败', icon: 'none' })
          }
        },
        fail: () => {
          uni.hideLoading()
          uni.showToast({ title: '上传失败', icon: 'none' })
        }
      })
    }
  })
}

function handleLogout() {
  uni.showModal({
    title: '确认退出',
    content: '退出后需要重新登录',
    confirmColor: '#FF6B6B',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        wishStore.items = []
        claimStore.myClaims = []
        claimStore.receivedClaims = []
      }
    }
  })
}

function goToMyWishes() {
  uni.switchTab({ url: '/pages/index/index' })
}

function goToMyClaims() {
  uni.showToast({ title: '我认领的礼物', icon: 'none' })
}

function goToReceivedClaims() {
  uni.showToast({ title: '收到的认领', icon: 'none' })
}

function showAbout() {
  uni.showModal({
    title: '关于心愿清单',
    content: '心愿清单小程序 v1.0.0\n记录你的心愿，让好友送你最想要的礼物',
    showCancel: false
  })
}

function clearCache() {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除本地缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        uni.showToast({ title: '缓存已清除', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: #F5F5F5;

  &__user-card {
    background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
    padding: 48rpx 32rpx;
  }

  &__user-info,
  &__login-hint {
    display: flex;
    align-items: center;
  }

  &__avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255, 255, 255, 0.5);
    flex-shrink: 0;
    background-color: rgba(255, 255, 255, 0.3);

    &--default {
      opacity: 0.7;
    }
  }

  &__user-detail {
    margin-left: 28rpx;
  }

  &__nickname {
    font-size: 36rpx;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8rpx;
  }

  &__join-time {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.7);
  }

  &__stats {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #ffffff;
    margin: 24rpx;
    border-radius: 24rpx;
    padding: 32rpx 0;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  }

  &__stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__stat-num {
    font-size: 44rpx;
    font-weight: 700;
    color: #FF6B6B;
  }

  &__stat-label {
    font-size: 24rpx;
    color: #999999;
    margin-top: 8rpx;
  }

  &__stat-divider {
    width: 2rpx;
    height: 60rpx;
    background-color: #EEEEEE;
  }

  &__menu {
    background-color: #ffffff;
    margin: 24rpx;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  }

  &__menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 28rpx;
    border-bottom: 2rpx solid #F5F5F5;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background-color: #FAFAFA;
    }
  }

  &__menu-left {
    display: flex;
    align-items: center;
  }

  &__menu-icon {
    font-size: 36rpx;
    margin-right: 20rpx;
  }

  &__menu-text {
    font-size: 30rpx;
    color: #333333;
  }

  &__menu-arrow {
    font-size: 28rpx;
    color: #CCCCCC;
  }

  &__logout {
    padding: 24rpx;
  }

  &__logout-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background-color: #ffffff;
    color: #FF4D4F;
    font-size: 30rpx;
    font-weight: 500;
    border-radius: 44rpx;
    border: none;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

    &::after {
      border: none;
    }

    &:active {
      background-color: #FFF5F5;
    }
  }
}
</style>
