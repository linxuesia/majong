<template>
  <view class="empty-state">
    <image
      class="empty-state__image"
      :src="image || '/static/empty.png'"
      mode="aspectFit"
    />
    <view class="empty-state__title">{{ title }}</view>
    <view v-if="description" class="empty-state__desc">{{ description }}</view>
    <button
      v-if="actionText"
      class="empty-state__action"
      @click="$emit('action')"
    >
      {{ actionText }}
    </button>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  image?: string
  actionText?: string
}>()

defineEmits<{
  (e: 'action'): void
}>()
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;

  &__image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 40rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 16rpx;
  }

  &__desc {
    font-size: 26rpx;
    color: #999999;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 40rpx;
  }

  &__action {
    padding: 16rpx 64rpx;
    background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 500;
    border-radius: 44rpx;
    border: none;

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.85;
    }
  }
}
</style>
