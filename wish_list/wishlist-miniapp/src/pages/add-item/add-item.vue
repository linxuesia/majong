<template>
  <view class="add-item-page">
    <!-- 模式切换 -->
    <view class="add-item-page__tabs">
      <view
        class="add-item-page__tab"
        :class="{ 'add-item-page__tab--active': mode === 'manual' }"
        @click="mode = 'manual'"
      >
        手动添加
      </view>
      <view
        class="add-item-page__tab"
        :class="{ 'add-item-page__tab--active': mode === 'url' }"
        @click="mode = 'url'"
      >
        链接解析
      </view>
    </view>

    <!-- 手动添加模式 -->
    <view v-if="mode === 'manual'" class="add-item-page__form">
      <!-- 商品图片 -->
      <view class="add-item-page__field">
        <view class="add-item-page__label">商品图片</view>
        <view class="add-item-page__image-upload" @click="chooseImage">
          <image
            v-if="form.imageUrl"
            class="add-item-page__image-preview"
            :src="form.imageUrl"
            mode="aspectFill"
          />
          <view v-else class="add-item-page__image-placeholder">
            <text class="add-item-page__image-icon">+</text>
            <text class="add-item-page__image-text">选择图片</text>
          </view>
        </view>
      </view>

      <!-- 商品名称 -->
      <view class="add-item-page__field">
        <view class="add-item-page__label">商品名称 <text class="add-item-page__required">*</text></view>
        <input
          v-model="form.title"
          class="add-item-page__input"
          placeholder="请输入商品名称"
          maxlength="50"
        />
      </view>

      <!-- 商品描述 -->
      <view class="add-item-page__field">
        <view class="add-item-page__label">商品描述</view>
        <textarea
          v-model="form.description"
          class="add-item-page__textarea"
          placeholder="简单描述一下这个商品"
          maxlength="200"
          :auto-height="true"
        />
      </view>

      <!-- 商品价格 -->
      <view class="add-item-page__field">
        <view class="add-item-page__label">商品价格</view>
        <view class="add-item-page__price-input-wrap">
          <text class="add-item-page__price-symbol">¥</text>
          <input
            v-model="priceStr"
            class="add-item-page__price-input"
            type="digit"
            placeholder="0.00"
          />
        </view>
      </view>

      <!-- 商品链接 -->
      <view class="add-item-page__field">
        <view class="add-item-page__label">商品链接</view>
        <input
          v-model="form.originalUrl"
          class="add-item-page__input"
          placeholder="粘贴商品链接（选填）"
        />
      </view>

      <!-- 分类 -->
      <view class="add-item-page__field">
        <view class="add-item-page__label">分类</view>
        <view class="add-item-page__category-wrap">
          <view
            v-for="cat in categories"
            :key="cat"
            class="add-item-page__category-tag"
            :class="{ 'add-item-page__category-tag--active': form.category === cat }"
            @click="form.category = cat"
          >
            {{ cat }}
          </view>
        </view>
      </view>

      <!-- 想要程度 -->
      <view class="add-item-page__field">
        <view class="add-item-page__label">想要程度</view>
        <view class="add-item-page__priority-wrap">
          <view
            v-for="p in priorityOptions"
            :key="p.value"
            class="add-item-page__priority-tag"
            :class="{ 'add-item-page__priority-tag--active': form.priority === p.value }"
            @click="form.priority = p.value"
          >
            {{ p.label }}
          </view>
        </view>
      </view>
    </view>

    <!-- 链接解析模式 -->
    <view v-else class="add-item-page__url-form">
      <view class="add-item-page__field">
        <view class="add-item-page__label">商品链接 <text class="add-item-page__required">*</text></view>
        <textarea
          v-model="urlInput"
          class="add-item-page__textarea add-item-page__textarea--url"
          placeholder="粘贴商品链接，支持淘宝、京东、拼多多等平台"
          :auto-height="false"
        />
        <button class="add-item-page__parse-btn" :loading="parsing" @click="handleParse">
          解析链接
        </button>
      </view>

      <!-- 解析结果预览 -->
      <view v-if="parsedProduct" class="add-item-page__parsed-preview">
        <view class="add-item-page__parsed-header">解析结果</view>
        <view class="add-item-page__parsed-card">
          <image
            v-if="parsedProduct.imageUrl"
            class="add-item-page__parsed-image"
            :src="parsedProduct.imageUrl"
            mode="aspectFill"
          />
          <view class="add-item-page__parsed-info">
            <view class="add-item-page__parsed-title">{{ parsedProduct.title }}</view>
            <view class="add-item-page__parsed-price">
              {{ parsedProduct.price > 0 ? `¥${parsedProduct.price.toFixed(2)}` : '价格待定' }}
            </view>
            <view class="add-item-page__parsed-platform">来自 {{ parsedProduct.platform }}</view>
          </view>
        </view>
        <button class="add-item-page__use-btn" @click="useParsedData">
          使用此信息
        </button>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="add-item-page__footer">
      <button class="add-item-page__submit-btn" :loading="submitting" @click="handleSubmit">
        添加到心愿清单
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useWishStore } from '@/store/wish'
import { parseProductUrl, parsePrice } from '@/utils/parse-url'
import type { ParsedProduct } from '@/types'

const wishStore = useWishStore()

const mode = ref<'manual' | 'url'>('manual')
const submitting = ref(false)
const parsing = ref(false)
const priceStr = ref('')
const urlInput = ref('')
const parsedProduct = ref<ParsedProduct | null>(null)

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

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempPath = res.tempFilePaths[0]
      // 上传到云存储
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

async function handleParse() {
  if (!urlInput.value.trim()) {
    uni.showToast({ title: '请输入商品链接', icon: 'none' })
    return
  }

  parsing.value = true
  try {
    const result = await parseProductUrl(urlInput.value.trim())
    parsedProduct.value = result
    uni.showToast({ title: '解析成功', icon: 'success' })
  } catch (e: any) {
    uni.showToast({ title: e.message || '解析失败', icon: 'none' })
  } finally {
    parsing.value = false
  }
}

function useParsedData() {
  if (!parsedProduct.value) return
  form.title = parsedProduct.value.title
  form.description = parsedProduct.value.description
  form.imageUrl = parsedProduct.value.imageUrl
  form.price = parsedProduct.value.price
  form.originalUrl = parsedProduct.value.originalUrl
  priceStr.value = parsedProduct.value.price > 0 ? parsedProduct.value.price.toFixed(2) : ''
  mode.value = 'manual'
}

async function handleSubmit() {
  if (!form.title.trim()) {
    uni.showToast({ title: '请输入商品名称', icon: 'none' })
    return
  }

  form.price = parsePrice(priceStr.value)

  submitting.value = true
  try {
    await wishStore.addWish({
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
.add-item-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 160rpx;

  &__tabs {
    display: flex;
    background-color: #ffffff;
    padding: 0 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  }

  &__tab {
    flex: 1;
    text-align: center;
    padding: 28rpx 0;
    font-size: 30rpx;
    color: #666666;
    position: relative;
    transition: color 0.3s;

    &--active {
      color: #FF6B6B;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 6rpx;
        border-radius: 3rpx;
        background-color: #FF6B6B;
      }
    }
  }

  &__form,
  &__url-form {
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

    &--url {
      min-height: 200rpx;
    }

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

  &__parse-btn {
    margin-top: 24rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    border-radius: 40rpx;
    border: none;

    &::after {
      border: none;
    }
  }

  &__parsed-preview {
    background-color: #ffffff;
    border-radius: 24rpx;
    padding: 24rpx;
    margin-top: 24rpx;
  }

  &__parsed-header {
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 16rpx;
  }

  &__parsed-card {
    display: flex;
    padding: 20rpx;
    background-color: #F9F9F9;
    border-radius: 16rpx;
  }

  &__parsed-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
    background-color: #EEEEEE;
  }

  &__parsed-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__parsed-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  &__parsed-price {
    font-size: 32rpx;
    font-weight: 700;
    color: #FF6B6B;
  }

  &__parsed-platform {
    font-size: 24rpx;
    color: #999999;
  }

  &__use-btn {
    margin-top: 20rpx;
    height: 72rpx;
    line-height: 72rpx;
    background-color: #ffffff;
    color: #FF6B6B;
    font-size: 28rpx;
    border-radius: 36rpx;
    border: 2rpx solid #FF6B6B;

    &::after {
      border: none;
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
