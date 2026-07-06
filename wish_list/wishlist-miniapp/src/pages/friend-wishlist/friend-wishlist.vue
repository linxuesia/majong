<template>
  <view class="friend-wishlist-page">
    <!-- 好友信息头部 -->
    <view class="friend-wishlist-page__header">
      <view class="friend-wishlist-page__user-row">
        <image
          class="friend-wishlist-page__avatar"
          :src="friendAvatar || '/static/tab-profile.png'"
          mode="aspectFill"
        />
        <view class="friend-wishlist-page__user-info">
          <view class="friend-wishlist-page__name">{{ friendName }} 的心愿</view>
          <view class="friend-wishlist-page__count">{{ items.length }} 个心愿等你发现</view>
        </view>
      </view>
      <!-- 价格筛选 -->
      <view class="friend-wishlist-page__filter-bar">
        <price-filter
          ref="priceFilterRef"
          :max-limit="10000"
          @change="handlePriceChange"
        />
      </view>
    </view>

    <!-- 心愿列表：双列瀑布流 -->
    <view v-if="items.length > 0" class="friend-wishlist-page__waterfall">
      <view class="friend-wishlist-page__col">
        <wish-card
          v-for="item in leftCol"
          :key="item._id"
          :item="item"
          @click="goToDetail"
        />
      </view>
      <view class="friend-wishlist-page__col">
        <wish-card
          v-for="item in rightCol"
          :key="item._id"
          :item="item"
          @click="goToDetail"
        />
      </view>
    </view>

    <!-- 空状态 -->
    <empty-state
      v-else-if="!loading"
      title="好友还没有心愿"
      description="等好友添加心愿后，你就可以认领送礼物啦"
    />

    <!-- 加载状态 -->
    <view v-if="loading" class="friend-wishlist-page__loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useWishStore } from '@/store/wish'
import type { WishItem } from '@/types'

const wishStore = useWishStore()

const friendId = ref('')
const friendName = ref('')
const friendAvatar = ref('')
const items = ref<WishItem[]>([])
const loading = ref(true)
const priceFilterRef = ref()

const leftCol = computed(() => items.value.filter((_, i) => i % 2 === 0))
const rightCol = computed(() => items.value.filter((_, i) => i % 2 === 1))

onLoad((options) => {
  friendId.value = options?.friendId || ''
  friendName.value = decodeURIComponent(options?.friendName || '好友')
  friendAvatar.value = decodeURIComponent(options?.friendAvatar || '')

  uni.setNavigationBarTitle({
    title: `${friendName.value}的心愿`
  })

  loadWishes()
})

async function loadWishes(priceRange?: { min: number; max: number }) {
  if (!friendId.value) return

  loading.value = true
  try {
    const result = await wishStore.fetchFriendWishes(
      friendId.value,
      true,
      priceRange
    )
    items.value = result
  } catch (e) {
    console.error('加载好友心愿失败', e)
  } finally {
    loading.value = false
  }
}

function handlePriceChange(range: { min: number; max: number }) {
  loadWishes(range)
}

function goToDetail(item: WishItem) {
  uni.navigateTo({
    url: `/pages/item-detail/item-detail?id=${item._id}&friendId=${friendId.value}`
  })
}
</script>

<style lang="scss" scoped>
.friend-wishlist-page {
  min-height: 100vh;
  background-color: #f7f5f2;

  &__header {
    background: linear-gradient(160deg, #FF6B6B 0%, #FF9A76 100%);
    padding: 32rpx 28rpx 28rpx;
  }

  &__user-row {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
  }

  &__avatar {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255, 255, 255, 0.5);
    flex-shrink: 0;
    background-color: rgba(255, 255, 255, 0.3);
  }

  &__user-info {
    margin-left: 20rpx;
  }

  &__name {
    font-size: 34rpx;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 6rpx;
  }

  &__count {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.75);
  }

  &__filter-bar {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 16rpx;
    padding: 4rpx;
    backdrop-filter: blur(10px);
  }

  // 瀑布流
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

  &__loading {
    text-align: center;
    padding: 40rpx;
    color: #bbbbbb;
    font-size: 26rpx;
  }
}
</style>
