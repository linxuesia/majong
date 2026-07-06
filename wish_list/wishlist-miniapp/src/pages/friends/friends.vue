<template>
  <view class="friends-page">
    <!-- 搜索栏 -->
    <view class="friends-page__search">
      <view class="friends-page__search-wrap">
        <text class="friends-page__search-icon">&#x1F50D;</text>
        <input
          v-model="searchKeyword"
          class="friends-page__search-input"
          placeholder="搜索好友"
          confirm-type="search"
          @confirm="handleSearch"
        />
      </view>
    </view>

    <!-- 好友列表 -->
    <view v-if="friendStore.friends.length > 0" class="friends-page__list">
      <view
        v-for="friend in friendStore.friends"
        :key="friend._id"
        class="friends-page__item"
        @click="goToFriendWishlist(friend)"
      >
        <image
          class="friends-page__avatar"
          :src="friend.friendAvatar || '/static/tab-profile.png'"
          mode="aspectFill"
        />
        <view class="friends-page__info">
          <view class="friends-page__name">{{ friend.friendName }}</view>
          <view class="friends-page__status">
            <text class="friends-page__status-text">好友</text>
          </view>
        </view>
        <view class="friends-page__arrow">
          <text class="friends-page__arrow-icon">></text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <empty-state
      v-else-if="!friendStore.loading"
      title="还没有好友"
      description="分享小程序给好友，一起使用心愿清单吧"
    />

    <!-- 加载状态 -->
    <view v-if="friendStore.loading" class="friends-page__loading">
      <text>加载中...</text>
    </view>

    <!-- 邀请好友按钮 -->
    <view class="friends-page__invite" @click="inviteFriend">
      <text class="friends-page__invite-text">邀请好友使用</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useFriendStore } from '@/store/friend'
import { useUserStore } from '@/store/user'
import type { FriendRelation } from '@/types'

const friendStore = useFriendStore()
const userStore = useUserStore()
const searchKeyword = ref('')

onMounted(() => {
  if (userStore.isLoggedIn) {
    friendStore.fetchFriends()
  }
})

onShow(() => {
  // 每次显示页面时刷新好友列表
  if (userStore.isLoggedIn) {
    friendStore.fetchFriends()
  }
})

function handleSearch() {
  if (!searchKeyword.value.trim()) {
    friendStore.fetchFriends()
    return
  }
  friendStore.searchFriend(searchKeyword.value.trim())
}

function goToFriendWishlist(friend: FriendRelation) {
  uni.navigateTo({
    url: `/pages/friend-wishlist/friend-wishlist?friendId=${friend.friendId}&friendName=${encodeURIComponent(friend.friendName)}&friendAvatar=${encodeURIComponent(friend.friendAvatar || '')}`
  })
}

function inviteFriend() {
  uni.showModal({
    title: '邀请好友',
    content: '分享小程序给微信好友，即可互相查看心愿清单',
    confirmText: '分享',
    confirmColor: '#FF6B6B',
    success: (res) => {
      if (res.confirm) {
        // 使用微信分享能力
        uni.shareAppMessage({
          title: '来看看我的心愿清单吧',
          path: '/pages/index/index',
          imageUrl: '/static/tab-home.png'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.friends-page {
  min-height: 100vh;
  background-color: #F5F5F5;

  &__search {
    padding: 24rpx;
    background-color: #ffffff;
  }

  &__search-wrap {
    display: flex;
    align-items: center;
    background-color: #F5F5F5;
    border-radius: 999rpx;
    padding: 16rpx 28rpx;
  }

  &__search-icon {
    font-size: 28rpx;
    margin-right: 12rpx;
  }

  &__search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
    height: 40rpx;
  }

  &__list {
    padding: 24rpx;
  }

  &__item {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 24rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
    transition: transform 0.2s;

    &:active {
      transform: scale(0.98);
    }
  }

  &__avatar {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: #F0F0F0;
  }

  &__info {
    flex: 1;
    margin-left: 24rpx;
  }

  &__name {
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 8rpx;
  }

  &__status-text {
    font-size: 22rpx;
    color: #52C41A;
    background-color: #F6FFED;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
  }

  &__arrow {
    flex-shrink: 0;
    padding: 16rpx;
  }

  &__arrow-icon {
    font-size: 28rpx;
    color: #CCCCCC;
  }

  &__loading {
    text-align: center;
    padding: 40rpx;
    color: #999999;
    font-size: 26rpx;
  }

  &__invite {
    margin: 40rpx 24rpx;
    padding: 28rpx;
    background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
    border-radius: 24rpx;
    text-align: center;
    box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.2);

    &:active {
      opacity: 0.9;
    }
  }

  &__invite-text {
    font-size: 30rpx;
    font-weight: 600;
    color: #ffffff;
  }
}
</style>
