<template>
  <view class="detail-page">
    <!-- 加载状态 -->
    <view v-if="loading" class="detail-page__loading">
      <text>加载中...</text>
    </view>

    <template v-else-if="item">
      <!-- 商品图片 -->
      <view class="detail-page__image-section">
        <swiper
          class="detail-page__swiper"
          indicator-dots
          indicator-color="rgba(255,255,255,0.5)"
          indicator-active-color="#ffffff"
          circular
        >
          <swiper-item>
            <image
              class="detail-page__swiper-image"
              :src="item.imageUrl || '/static/empty.png'"
              mode="aspectFill"
            />
          </swiper-item>
        </swiper>
        <view class="detail-page__image-count">1/1</view>
      </view>

      <!-- 商品信息 -->
      <view class="detail-page__info">
        <view class="detail-page__price-row">
          <text class="detail-page__price">
            {{ item.price > 0 ? `¥${item.price.toFixed(2)}` : '价格待定' }}
          </text>
          <view
            class="detail-page__status-tag"
            :class="`detail-page__status-tag--${item.status}`"
          >
            {{ statusText }}
          </view>
        </view>
        <view class="detail-page__title">{{ item.title }}</view>
        <view v-if="item.description" class="detail-page__desc">{{ item.description }}</view>

        <!-- 标签信息 -->
        <view class="detail-page__tags">
          <view class="detail-page__tag">{{ item.category }}</view>
          <view class="detail-page__tag">{{ priorityText }}</view>
          <view v-if="item.originalUrl" class="detail-page__tag detail-page__tag--link" @click="copyLink">
            查看原链接
          </view>
        </view>

        <!-- 认领信息 -->
        <view v-if="item.status === 'claimed' && item.claimedByName" class="detail-page__claimer-info">
          <view class="detail-page__claimer-label">认领人</view>
          <view class="detail-page__claimer-name">{{ item.claimedByName }}</view>
        </view>

        <!-- 时间信息 -->
        <view class="detail-page__time">
          <text>添加于 {{ formatTime(item.createdAt) }}</text>
        </view>
      </view>

      <!-- 认领按钮（仅好友查看时显示） -->
      <view v-if="isFriendView" class="detail-page__claim-section">
        <claim-button
          :status="claimStatus"
          :wish-id="item._id"
          @claim="handleClaim"
          @cancel="handleCancelClaim"
        />
      </view>

      <!-- 操作按钮（仅自己的心愿显示） -->
      <view v-if="isOwner" class="detail-page__actions">
        <button class="detail-page__action-btn detail-page__action-btn--edit" @click="goEdit">
          编辑
        </button>
        <button class="detail-page__action-btn detail-page__action-btn--delete" @click="handleDelete">
          删除
        </button>
      </view>
    </template>

    <!-- 加载失败 -->
    <view v-else class="detail-page__error">
      <text>商品不存在或已删除</text>
      <button class="detail-page__back-btn" @click="goBack">返回</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useWishStore } from '@/store/wish'
import { useClaimStore } from '@/store/claim'
import { useUserStore } from '@/store/user'
import type { WishItem } from '@/types'

const wishStore = useWishStore()
const claimStore = useClaimStore()
const userStore = useUserStore()

const item = ref<WishItem | null>(null)
const loading = ref(true)
const isFriendView = ref(false)

const isOwner = computed(() => {
  return item.value && userStore.userInfo && item.value.userId === userStore.userInfo._id
})

const statusText = computed(() => {
  if (!item.value) return ''
  const map: Record<string, string> = {
    active: '待认领',
    claimed: '已认领',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[item.value.status] || item.value.status
})

const priorityText = computed(() => {
  if (!item.value) return ''
  const map: Record<string, string> = {
    low: '一般',
    medium: '想要',
    high: '最想要'
  }
  return map[item.value.priority] || ''
})

const claimStatus = computed(() => {
  if (!item.value) return 'unclaimed'
  if (item.value.status === 'completed') return 'completed'
  if (item.value.status === 'claimed') {
    if (item.value.claimedBy === userStore.userInfo?._id) {
      return 'claimed-by-me'
    }
    return 'claimed-by-other'
  }
  return 'unclaimed'
})

onLoad((options) => {
  const id = options?.id
  if (id) {
    loadDetail(id)
  }
  // 如果有 friendId 参数，说明是好友查看
  if (options?.friendId) {
    isFriendView.value = true
  }
})

async function loadDetail(id: string) {
  loading.value = true
  try {
    const detail = await wishStore.fetchWishDetail(id)
    item.value = detail
  } catch (e) {
    console.error('加载详情失败', e)
  } finally {
    loading.value = false
  }
}

function formatTime(time: string): string {
  if (!time) return ''
  const date = new Date(time)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function copyLink() {
  if (item.value?.originalUrl) {
    uni.setClipboardData({
      data: item.value.originalUrl,
      success: () => {
        uni.showToast({ title: '链接已复制', icon: 'success' })
      }
    })
  }
}

async function handleClaim(wishId: string) {
  try {
    await claimStore.claimWish(wishId)
    if (item.value) {
      item.value.status = 'claimed'
      item.value.claimedBy = userStore.userInfo?._id
      item.value.claimedByName = userStore.userInfo?.nickName
    }
  } catch {
    // 错误已在 store 中处理
  }
}

async function handleCancelClaim(wishId: string) {
  try {
    // 找到对应的 claim 记录
    const claim = claimStore.myClaims.find(c => c.wishId === wishId)
    if (claim) {
      await claimStore.cancelClaim(claim._id)
    }
    if (item.value) {
      item.value.status = 'active'
      item.value.claimedBy = undefined
      item.value.claimedByName = undefined
    }
  } catch {
    // 错误已在 store 中处理
  }
}

function goEdit() {
  if (item.value) {
    uni.navigateTo({
      url: `/pages/edit-item/edit-item?id=${item.value._id}`
    })
  }
}

function handleDelete() {
  if (!item.value) return
  uni.showModal({
    title: '确认删除',
    content: '删除后不可恢复，确定要删除这个心愿吗？',
    confirmColor: '#FF6B6B',
    success: async (res) => {
      if (res.confirm) {
        try {
          await wishStore.deleteWish(item.value!._id)
          uni.navigateBack()
        } catch {
          // 错误已在 store 中处理
        }
      }
    }
  })
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 200rpx;

  &__loading,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: #999999;
    font-size: 28rpx;
  }

  &__back-btn {
    margin-top: 32rpx;
    padding: 16rpx 48rpx;
    background-color: #FF6B6B;
    color: #ffffff;
    font-size: 28rpx;
    border-radius: 44rpx;
    border: none;

    &::after {
      border: none;
    }
  }

  &__image-section {
    position: relative;
    width: 100%;
    height: 600rpx;
    background-color: #EEEEEE;
  }

  &__swiper {
    width: 100%;
    height: 100%;
  }

  &__swiper-image {
    width: 100%;
    height: 100%;
  }

  &__image-count {
    position: absolute;
    bottom: 20rpx;
    right: 20rpx;
    padding: 4rpx 16rpx;
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    font-size: 22rpx;
    border-radius: 20rpx;
  }

  &__info {
    background-color: #ffffff;
    padding: 32rpx;
    margin-top: -24rpx;
    border-radius: 32rpx 32rpx 0 0;
    position: relative;
  }

  &__price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }

  &__price {
    font-size: 48rpx;
    font-weight: 700;
    color: #FF6B6B;
  }

  &__status-tag {
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    font-weight: 500;

    &--active {
      background-color: #F0F5FF;
      color: #1890FF;
    }

    &--claimed {
      background-color: #FFF7E6;
      color: #FAAD14;
    }

    &--completed {
      background-color: #F6FFED;
      color: #52C41A;
    }

    &--cancelled {
      background-color: #F5F5F5;
      color: #999999;
    }
  }

  &__title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333333;
    line-height: 1.5;
    margin-bottom: 12rpx;
  }

  &__desc {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.6;
    margin-bottom: 24rpx;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-bottom: 24rpx;
  }

  &__tag {
    padding: 8rpx 20rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    color: #666666;
    background-color: #F5F5F5;

    &--link {
      color: #1890FF;
      background-color: #F0F5FF;
    }
  }

  &__claimer-info {
    display: flex;
    align-items: center;
    padding: 24rpx;
    background-color: #FFF7E6;
    border-radius: 16rpx;
    margin-bottom: 24rpx;
  }

  &__claimer-label {
    font-size: 26rpx;
    color: #999999;
    margin-right: 16rpx;
  }

  &__claimer-name {
    font-size: 28rpx;
    font-weight: 500;
    color: #FAAD14;
  }

  &__time {
    font-size: 24rpx;
    color: #999999;
  }

  &__claim-section {
    padding: 32rpx;
    background-color: #ffffff;
    margin-top: 24rpx;
  }

  &__actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 24rpx;
    padding: 24rpx;
    background-color: #ffffff;
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
    z-index: 100;
  }

  &__action-btn {
    flex: 1;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 30rpx;
    font-weight: 500;
    border: none;

    &::after {
      border: none;
    }

    &--edit {
      background-color: #ffffff;
      color: #FF6B6B;
      border: 2rpx solid #FF6B6B;
    }

    &--delete {
      background-color: #F5F5F5;
      color: #999999;
    }
  }
}
</style>
