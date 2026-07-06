<template>
  <view class="edit-item-page">
    <!-- 加载状态 -->
    <view v-if="loading" class="edit-item-page__loading">
      <text>加载中...</text>
    </view>

    <template v-else>
      <view class="edit-item-page__form">
        <!-- 商品图片 -->
        <view class="edit-item-page__field">
          <view class="edit-item-page__label">商品图片</view>
          <view class="edit-item-page__image-upload" @click="chooseImage">
            <image
              v-if="form.imageUrl"
              class="edit-item-page__image-preview"
              :src="form.imageUrl"
              mode="aspectFill"
            />
            <view v-else class="edit-item-page__image-placeholder">
              <text class="edit-item-page__image-icon">+</text>
              <text class="edit-item-page__image-text">选择图片</text>
            </view>
          </view>
        </view>

        <!-- 商品名称 -->
        <view class="edit-item-page__field">
          <view class="edit-item-page__label">商品名称 <text class="edit-item-page__required">*</text></view>
          <input
            v-model="form.title"
            class="edit-item-page__input"
            placeholder="请输入商品名称"
            maxlength="50"
          />
        </view>

        <!-- 商品描述 -->
        <view class="edit-item-page__field">
          <view class="edit-item-page__label">商品描述</view>
          <textarea
            v-model="form.description"
            class="edit-item-page__textarea"
            placeholder="简单描述一下这个商品"
            maxlength="200"
            :auto-height="true"
          />
        </view>

        <!-- 商品价格 -->
        <view class="edit-item-page__field">
          <view class="edit-item-page__label">商品价格</view>
          <view class="edit-item-page__price-input-wrap">
            <text class="edit-item-page__price-symbol">¥</text>
            <input
              v-model="priceStr"
              class="edit-item-page__price-input"
              type="digit"
              placeholder="0.00"
            />
          </view>
        </view>

        <!-- 商品链接 -->
        <view class="edit-item-page__field">
          <view class="edit-item-page__label">商品链接</view>
          <input
            v-model="form.originalUrl"
            class="edit-item-page__input"
            placeholder="粘贴商品链接（选填）"
          />
        </view>

        <!-- 分类 -->
        <view class="edit-item-page__field">
          <view class="edit-item-page__label">分类</view>
          <view class="edit-item-page__category-wrap">
            <view
              v-for="cat in categories"
              :key="cat"
              class="edit-item-page__category-tag"
              :class="{ 'edit-item-page__category-tag--active': form.category === cat }"
              @click="form.category = cat"
            >
              {{ cat }}
            </view>
          </view>
        </view>

        <!-- 想要程度 -->
        <view class="edit-item-page__field">
          <view class="edit-item-page__label">想要程度</view>
          <view class="edit-item-page__priority-wrap">
            <view
              v-for="p in priorityOptions"
              :key="p.value"
              class="edit-item-page__priority-tag"
              :class="{ 'edit-item-page__priority-tag--active': form.priority === p.value }"
              @click="form.priority = p.value"
            >
              {{ p.label }}
            </view>
          </view>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="edit-item-page__footer">
        <button class="edit-item-page__submit-btn" :loading="submitting" @click="handleSubmit">
          保存修改
        </button>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useWishStore } from '@/store/wish'
import { parsePrice } from '@/utils/parse-url'
import type { WishItem } from '@/types'

const wishStore = useWishStore()

const itemId = ref('')
const loading = ref(true)
const submitting = ref(false)
const priceStr = ref('')

const categories = ['数码', '服饰', '美妆', '家居', '食品', '运动', '图书', '其他']

const priorityOptions = [
  { label: '一般', value: 'low' },
  { label: '想要', value: 'medium' },
  { label: '最想要', value: 'high' }
]

const form = reactive({
  title: '',
  description: '',
  imageUrl: '',
  price: 0,
  originalUrl: '',
  category: '其他',
  priority: 'medium' as 'low' | 'medium' | 'high'
})

onLoad(async (options) => {
  const id = options?.id
  if (id) {
    itemId.value = id
    await loadItem(id)
  }
})

async function loadItem(id: string) {
  loading.value = true
  try {
    const item = await wishStore.fetchWishDetail(id)
    if (item) {
      form.title = item.title
      form.description = item.description
      form.imageUrl = item.imageUrl
      form.price = item.price
      form.originalUrl = item.originalUrl
      form.category = item.category
      form.priority = item.priority
      priceStr.value = item.price > 0 ? item.price.toFixed(2) : ''
    } else {
      uni.showToast({ title: '商品不存在', icon: 'none' })
      setTimeout(() => uni.navigateBack(), 1500)
    }
  } catch (e) {
    console.error('加载商品失败', e)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempPath = res.tempFilePaths[0]
      uni.showLoading({ title: '上传中...' })
      uniCloud.uploadFile({
        filePath: tempPath,
        cloudPath: `wish-images/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
        success: (uploadRes) => {
          form.imageUrl = uploadRes.fileID
          uni.hideLoading()
        },
        fail: () => {
          uni.hideLoading()
          uni.showToast({ title: '图片上传失败', icon: 'none' })
        }
      })
    }
  })
}

async function handleSubmit() {
  if (!form.title.trim()) {
    uni.showToast({ title: '请输入商品名称', icon: 'none' })
    return
  }

  form.price = parsePrice(priceStr.value)

  submitting.value = true
  try {
    await wishStore.updateWish({
      id: itemId.value,
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl,
      price: form.price,
      originalUrl: form.originalUrl.trim(),
      category: form.category,
      priority: form.priority
    })
    uni.navigateBack()
  } catch {
    // 错误已在 store 中处理
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.edit-item-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 160rpx;

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: #999999;
    font-size: 28rpx;
  }

  &__form {
    padding: 24rpx;
  }

  &__field {
    background-color: #ffffff;
    border-radius: 24rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
  }

  &__label {
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 16rpx;
  }

  &__required {
    color: #FF6B6B;
  }

  &__input {
    width: 100%;
    height: 80rpx;
    border: 2rpx solid #EEEEEE;
    border-radius: 16rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: #333333;
    box-sizing: border-box;

    &:focus {
      border-color: #FF6B6B;
    }
  }

  &__textarea {
    width: 100%;
    min-height: 160rpx;
    border: 2rpx solid #EEEEEE;
    border-radius: 16rpx;
    padding: 20rpx 24rpx;
    font-size: 28rpx;
    color: #333333;
    box-sizing: border-box;

    &:focus {
      border-color: #FF6B6B;
    }
  }

  &__image-upload {
    width: 200rpx;
    height: 200rpx;
    border: 2rpx dashed #DDDDDD;
    border-radius: 16rpx;
    overflow: hidden;
  }

  &__image-preview {
    width: 100%;
    height: 100%;
  }

  &__image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #F9F9F9;
  }

  &__image-icon {
    font-size: 56rpx;
    color: #CCCCCC;
    line-height: 1;
  }

  &__image-text {
    font-size: 24rpx;
    color: #999999;
    margin-top: 8rpx;
  }

  &__price-input-wrap {
    display: flex;
    align-items: center;
    border: 2rpx solid #EEEEEE;
    border-radius: 16rpx;
    padding: 0 24rpx;
    height: 80rpx;
    box-sizing: border-box;

    &:focus-within {
      border-color: #FF6B6B;
    }
  }

  &__price-symbol {
    font-size: 32rpx;
    font-weight: 600;
    color: #FF6B6B;
    margin-right: 12rpx;
  }

  &__price-input {
    flex: 1;
    height: 100%;
    font-size: 28rpx;
    color: #333333;
  }

  &__category-wrap,
  &__priority-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  &__category-tag,
  &__priority-tag {
    padding: 12rpx 28rpx;
    border-radius: 999rpx;
    font-size: 26rpx;
    color: #666666;
    background-color: #F5F5F5;
    border: 2rpx solid transparent;
    transition: all 0.2s;

    &--active {
      color: #FF6B6B;
      background-color: #FFF0F0;
      border-color: #FF6B6B;
    }
  }

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24rpx;
    background-color: #ffffff;
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
    z-index: 100;
  }

  &__submit-btn {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
    border-radius: 48rpx;
    border: none;
    box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.3);

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.9;
    }
  }
}
</style>
