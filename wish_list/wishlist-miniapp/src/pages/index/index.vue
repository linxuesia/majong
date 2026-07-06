<template>
  <view class="index-page">
    <!-- 顶部区域：问候 + 好友入口 -->
    <view class="index-page__header">
      <view class="index-page__greeting">
        <view class="index-page__hello">我的心愿单</view>
        <view class="index-page__subtitle">{{ totalCount }} 个心愿 · {{ claimedCount }} 个已被认领</view>
      </view>
      <!-- 好友入口按钮 -->
      <view class="index-page__friends-entry" @click="goToFriends">
        <view class="index-page__friends-avatars">
          <image
            v-for="(friend, idx) in topFriends"
            :key="idx"
            class="index-page__friends-avatar"
            :class="{ 'index-page__friends-avatar--overlap': idx > 0 }"
            :src="friend.friendAvatar || '/static/tab-profile.png'"
            mode="aspectFill"
          />
        </view>
        <view class="index-page__friends-info">
          <text class="index-page__friends-label">好友心愿</text>
          <text class="index-page__friends-count">{{ friendCount }} 位好友</text>
        </view>
        <text class="index-page__friends-arrow">›</text>
      </view>
    </view>

    <!-- 心愿列表：双列瀑布流 -->
    <view v-if="wishStore.items.length > 0" class="index-page__waterfall">
      <view class="index-page__col">
        <wish-card
          v-for="item in leftCol"
          :key="item._id"
          :item="item"
          @click="goToDetail"
        />
      </view>
      <view class="index-page__col">
        <wish-card
          v-for="item in rightCol"
          :key="item._id"
          :item="item"
          @click="goToDetail"
        />
      </view>
    </view>

    <!-- 加载更多 -->
    <view v-if="wishStore.loading" class="index-page__loading">
      <text>加载中...</text>
    </view>
    <view v-else-if="!wishStore.hasMore && wishStore.items.length > 0" class="index-page__nomore">
      <text>— 已经到底啦 —</text>
    </view>

    <!-- 空状态 -->
    <empty-state
      v-else-if="!wishStore.loading"
      title="还没有心愿"
      description="把你喜欢的东西都丢进来吧"
      action-text="添加第一个心愿"
      @action="goToAdd"
    />

    <!-- 悬浮添加按钮 -->
    <view class="index-page__fab" @click="goToAdd">
      <text class="index-page__fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { useWishStore } from '@/store/wish'
import { useUserStore } from '@/store/user'
import { useFriendStore } from '@/store/friend'
import type { WishItem } from '@/types'

const wishStore = useWishStore()
const userStore = useUserStore()
const friendStore = useFriendStore()

const totalCount = computed(() => wishStore.items.length)
const claimedCount = computed(() => wishStore.items.filter(i => i.status === 'claimed').length)
const friendCount = computed(() => friendStore.friends.length)

const topFriends = computed(() => friendStore.friends.slice(0, 3))

// 简单的瀑布流分列：按索引奇偶分配
const leftCol = computed(() => wishStore.items.filter((_, i) => i % 2 === 0))
const rightCol = computed(() => wishStore.items.filter((_, i) => i % 2 === 1))

onMounted(() => {
  if (userStore.isLoggedIn) {
    wishStore.fetchMyWishes(true)
    friendStore.fetchFriends()
  }
})

onPullDownRefresh(async () => {
  await Promise.all([
    wishStore.fetchMyWishes(true),
    friendStore.fetchFriends()
  ])
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  wishStore.fetchMyWishes()
})

function goToAdd() {
  if (!userStore.checkLogin()) return
  uni.navigateTo({ url: '/pages/add-item/add-item' })
}

function goToDetail(item: WishItem) {
  uni.navigateTo({
    url: `/pages/item-detail/item-detail?id=${item._id}`
  })
}

function goToFriends() {
  uni.switchTab({ url: '/pages/friends/friends' })
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  padding-bottom: 24rpx;

  // 顶部区域
  &__header {
    padding: 32rpx 28rpx 24rpx;
    background: linear-gradient(160deg, #FF6B6B 0%, #FF9A76 100%);
  }

  &__greeting {
    margin-bottom: 28rpx;
  }

  &__hello {
    font-size: 40rpx;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 2rpx;
  }

  &__subtitle {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 8rpx;
  }

  // 好友入口
  &__friends-entry {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 20rpx;
    padding: 20rpx 24rpx;
    backdrop-filter: blur(10px);
    transition: background-color 0.2s;

    &:active {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  &__friends-avatars {
    display: flex;
    align-items: center;
    position: relative;
    width: 120rpx;
    height: 64rpx;
  }

  &__friends-avatar {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    border: 3rpx solid rgba(255, 255, 255, 0.6);
    background-color: rgba(255, 255, 255, 0.3);
    position: relative;
    z-index: 1;

    &--overlap {
      margin-left: -20rpx;
    }
  }

  &__friends-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
  }

  &__friends-label {
    font-size: 28rpx;
    font-weight: 600;
    color: #ffffff;
  }

  &__friends-count {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 4rpx;
  }

  &__friends-arrow {
    font-size: 36rpx;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 300;
    margin-right: 4rpx;
  }

  // 瀑布流布局
  &__waterfall {
    display: flex;
    padding: 20rpx 16rpx;
    gap: 16rpx;
  }

  &__col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  &__loading,
  &__nomore {
    text-align: center;
    padding: 32rpx 0;
    font-size: 24rpx;
    color: #bbbbbb;
    letter-spacing: 2rpx;
  }

  // 悬浮按钮
  &__fab {
    position: fixed;
    right: 36rpx;
    bottom: 200rpx;
    width: 108rpx;
    height: 108rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF6B6B, #FF9A76);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 32rpx rgba(255, 107, 107, 0.45);
    z-index: 100;
    transition: transform 0.2s;

    &:active {
      transform: scale(0.9);
    }
  }

  &__fab-icon {
    font-size: 52rpx;
    color: #ffffff;
    font-weight: 300;
    line-height: 1;
    margin-top: -4rpx;
  }
}
</style>
