<template>
  <view class="wish-card" @click="handleClick">
    <!-- 大图区域 -->
    <view class="wish-card__image-wrap">
      <image
        class="wish-card__image"
        :src="item.imageUrl || '/static/empty.png'"
        mode="aspectFill"
        lazy-load
      />
      <!-- 渐变遮罩 -->
      <view class="wish-card__overlay" />
      <!-- 底部信息浮层 -->
      <view class="wish-card__float">
        <view class="wish-card__title">{{ item.title }}</view>
        <view class="wish-card__meta">
          <text v-if="item.price > 0" class="wish-card__price">¥{{ formatPrice(item.price) }}</text>
          <text v-else class="wish-card__price wish-card__price--free">想要</text>
          <view v-if="item.claimedByName" class="wish-card__claimer-tag">
            {{ item.claimedByName }} 认领
          </view>
        </view>
      </view>
      <!-- 状态角标 -->
      <view v-if="item.status === 'claimed'" class="wish-card__status-badge wish-card__status-badge--claimed">
        已认领
      </view>
      <view v-else-if="item.status === 'completed'" class="wish-card__status-badge wish-card__status-badge--completed">
        已收到
      </view>
      <!-- 最想要标签 -->
      <view v-if="item.priority === 'high'" class="wish-card__wish-tag">
        ❤️ 最想要
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { WishItem } from '@/types'

const props = defineProps<{
  item: WishItem
}>()

const emit = defineEmits<{
  (e: 'click', item: WishItem): void
}>()

function formatPrice(price: number): string {
  if (price >= 10000) {
    return (price / 10000).toFixed(1) + 'w'
  }
  return price.toFixed(0)
}

function handleClick() {
  emit('click', props.item)
}
</script>

<style lang="scss" scoped>
.wish-card {
  border-radius: 20rpx;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:active {
    transform: scale(0.97);
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  }

  &__image-wrap {
    position: relative;
    width: 100%;
    padding-top: 120%;
    overflow: hidden;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f0ece6;
  }

  &__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 55%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.15) 60%, transparent 100%);
    pointer-events: none;
  }

  &__float {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    z-index: 2;
  }

  &__title {
    font-size: 26rpx;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.2);
    margin-bottom: 10rpx;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__price {
    font-size: 28rpx;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.2);

    &--free {
      font-size: 22rpx;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
      background-color: rgba(255, 255, 255, 0.2);
      padding: 2rpx 14rpx;
      border-radius: 20rpx;
    }
  }

  &__claimer-tag {
    font-size: 20rpx;
    color: #ffffff;
    background-color: rgba(250, 173, 20, 0.85);
    padding: 2rpx 14rpx;
    border-radius: 20rpx;
    backdrop-filter: blur(4px);
  }

  &__status-badge {
    position: absolute;
    top: 16rpx;
    left: 16rpx;
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
    font-size: 20rpx;
    font-weight: 500;
    color: #ffffff;
    backdrop-filter: blur(8px);
    z-index: 3;

    &--claimed {
      background-color: rgba(250, 173, 20, 0.85);
    }

    &--completed {
      background-color: rgba(82, 196, 26, 0.85);
    }
  }

  &__wish-tag {
    position: absolute;
    top: 16rpx;
    right: 16rpx;
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
    font-size: 20rpx;
    font-weight: 500;
    color: #ffffff;
    background-color: rgba(255, 107, 107, 0.85);
    backdrop-filter: blur(8px);
    z-index: 3;
  }
}
</style>
