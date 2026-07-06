<template>
  <view class="price-filter">
    <view class="price-filter__header">
      <text class="price-filter__title">价格区间</text>
      <text class="price-filter__range">¥{{ min }} - ¥{{ max }}</text>
      <text v-if="active" class="price-filter__clear" @click="handleClear">清除</text>
    </view>
    <view class="price-filter__slider-wrap">
      <slider
        class="price-filter__slider"
        :min="0"
        :max="maxLimit"
        :step="step"
        :value="currentMin"
        activeColor="#FF6B6B"
        backgroundColor="#EEEEEE"
        block-size="20"
        block-color="#FF6B6B"
        show-value
        @change="onMinChange"
      />
      <slider
        class="price-filter__slider"
        :min="0"
        :max="maxLimit"
        :step="step"
        :value="currentMax"
        activeColor="#FFA07A"
        backgroundColor="#EEEEEE"
        block-size="20"
        block-color="#FFA07A"
        show-value
        @change="onMaxChange"
      />
    </view>
    <view class="price-filter__presets">
      <view
        v-for="preset in presets"
        :key="preset.label"
        class="price-filter__preset"
        :class="{ 'price-filter__preset--active': isPresetActive(preset) }"
        @click="applyPreset(preset)"
      >
        {{ preset.label }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface PricePreset {
  label: string
  min: number
  max: number
}

const props = withDefaults(defineProps<{
  maxLimit?: number
  step?: number
}>(), {
  maxLimit: 10000,
  step: 50
})

const emit = defineEmits<{
  (e: 'change', range: { min: number; max: number }): void
}>()

const currentMin = ref(0)
const currentMax = ref(props.maxLimit)
const active = ref(false)

const min = computed(() => currentMin.value)
const max = computed(() => currentMax.value)

const presets: PricePreset[] = [
  { label: '全部', min: 0, max: props.maxLimit },
  { label: '0-100', min: 0, max: 100 },
  { label: '100-500', min: 100, max: 500 },
  { label: '500-1000', min: 500, max: 1000 },
  { label: '1000-5000', min: 1000, max: 5000 },
  { label: '5000+', min: 5000, max: props.maxLimit }
]

function onMinChange(e: any) {
  currentMin.value = Math.min(e.detail.value, currentMax.value)
  active.value = true
  emitChange()
}

function onMaxChange(e: any) {
  currentMax.value = Math.max(e.detail.value, currentMin.value)
  active.value = true
  emitChange()
}

function applyPreset(preset: PricePreset) {
  currentMin.value = preset.min
  currentMax.value = preset.max
  active.value = !(preset.min === 0 && preset.max === props.maxLimit)
  emitChange()
}

function isPresetActive(preset: PricePreset): boolean {
  return currentMin.value === preset.min && currentMax.value === preset.max
}

function handleClear() {
  currentMin.value = 0
  currentMax.value = props.maxLimit
  active.value = false
  emitChange()
}

function emitChange() {
  emit('change', {
    min: currentMin.value,
    max: currentMax.value
  })
}

function reset() {
  currentMin.value = 0
  currentMax.value = props.maxLimit
  active.value = false
}

defineExpose({
  reset
})
</script>

<style lang="scss" scoped>
.price-filter {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }

  &__title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
    margin-right: 16rpx;
  }

  &__range {
    font-size: 24rpx;
    color: #FF6B6B;
    font-weight: 500;
  }

  &__clear {
    margin-left: auto;
    font-size: 24rpx;
    color: #999999;
    padding: 4rpx 16rpx;
  }

  &__slider-wrap {
    padding: 0 8rpx;
  }

  &__slider {
    margin-bottom: 8rpx;
  }

  &__presets {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-top: 16rpx;
  }

  &__preset {
    padding: 8rpx 24rpx;
    border-radius: 999rpx;
    font-size: 24rpx;
    color: #666666;
    background-color: #F5F5F5;
    border: 2rpx solid transparent;
    transition: all 0.2s ease;

    &--active {
      color: #FF6B6B;
      background-color: #FFF0F0;
      border-color: #FF6B6B;
    }
  }
}
</style>
