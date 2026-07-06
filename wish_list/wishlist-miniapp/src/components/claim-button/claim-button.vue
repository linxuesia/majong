<template>
  <view class="claim-button">
    <!-- 未认领状态 - 可以认领 -->
    <button
      v-if="status === 'unclaimed'"
      class="claim-button__btn claim-button__btn--claim"
      :loading="loading"
      @click="handleClaim"
    >
      认领心愿
    </button>

    <!-- 已被我认领 - 可以取消 -->
    <button
      v-else-if="status === 'claimed-by-me'"
      class="claim-button__btn claim-button__btn--cancel"
      :loading="loading"
      @click="handleCancel"
    >
      取消认领
    </button>

    <!-- 已被他人认领 -->
    <button
      v-else-if="status === 'claimed-by-other'"
      class="claim-button__btn claim-button__btn--disabled"
      disabled
    >
      已被认领
    </button>

    <!-- 已完成 -->
    <button
      v-else-if="status === 'completed'"
      class="claim-button__btn claim-button__btn--completed"
      disabled
    >
      已完成
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  status: 'unclaimed' | 'claimed-by-me' | 'claimed-by-other' | 'completed'
  wishId: string
}>()

const emit = defineEmits<{
  (e: 'claim', wishId: string): void
  (e: 'cancel', wishId: string): void
}>()

const loading = ref(false)

async function handleClaim() {
  loading.value = true
  try {
    emit('claim', props.wishId)
  } finally {
    loading.value = false
  }
}

async function handleCancel() {
  loading.value = true
  try {
    emit('cancel', props.wishId)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.claim-button {
  width: 100%;

  &__btn {
    width: 100%;
    height: 88rpx;
    border-radius: 44rpx;
    font-size: 30rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 0;

    &::after {
      border: none;
    }

    &--claim {
      background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
      color: #ffffff;
      box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.3);

      &:active {
        opacity: 0.85;
      }
    }

    &--cancel {
      background-color: #ffffff;
      color: #FF6B6B;
      border: 2rpx solid #FF6B6B;

      &:active {
        background-color: #FFF5F5;
      }
    }

    &--disabled {
      background-color: #F5F5F5;
      color: #999999;
    }

    &--completed {
      background: linear-gradient(135deg, #52C41A, #73D13D);
      color: #ffffff;
    }
  }
}
</style>
