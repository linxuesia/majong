# 长沙麻将教学小程序 - 图片优化方案

## 方案概述

本方案将当前文字显示的麻将牌替换为精美的拟物图片，提升用户体验和视觉效果。

## 实现原理

1. **创建映射关系**：建立麻将牌文字到图片路径的映射关系
2. **灵活图片来源**：支持本地图片和网络图片两种模式，可根据需求切换
3. **统一图片资源**：使用统一命名规范的麻将牌图片
4. **修改模板**：将WXML中的文字显示改为图片显示
5. **优化样式**：调整CSS样式，确保图片正确显示

## 图片资源准备

### 图片来源选择

小程序支持两种图片来源方式，各有优缺点：

#### 1. 本地图片

**优点：**
- 加载速度快，不依赖网络
- 用户体验更流畅
- 无网络环境下也能正常显示

**缺点：**
- 增加小程序包体积，可能导致包过大
- 微信小程序对包大小有限制（2MB，超过需分包）
- 更新图片需要重新发布小程序

#### 2. 网络图片

**优点：**
- 不增加小程序包体积
- 可以随时更新图片，无需重新发布小程序
- 支持CDN加速，提高加载速度

**缺点：**
- 依赖网络环境
- 首次加载可能较慢
- 需要额外的服务器资源

**推荐：** 考虑到小程序包大小限制，建议优先使用网络图片。

### 图片命名规范

所有麻将牌图片应按照以下命名规范命名：

```
# 万子牌
wan_1.png - 一万
wan_2.png - 二万
wan_3.png - 三万
wan_4.png - 四万
wan_5.png - 五万
wan_6.png - 六万
wan_7.png - 七万
wan_8.png - 八万
wan_9.png - 九万

# 条子牌
tiao_1.png - 一条
tiao_2.png - 二条
tiao_3.png - 三条
tiao_4.png - 四条
tiao_5.png - 五条
tiao_6.png - 六条
tiao_7.png - 七条
tiao_8.png - 八条
tiao_9.png - 九条

# 筒子牌
tong_1.png - 一筒
tong_2.png - 二筒
tong_3.png - 三筒
tong_4.png - 四筒
tong_5.png - 五筒
tong_6.png - 六筒
tong_7.png - 七筒
tong_8.png - 八筒
tong_9.png - 九筒

# 字牌
zi_dong.png - 东
zi_nan.png - 南
zi_xi.png - 西
zi_bei.png - 北
zi_zhong.png - 中
zi_fa.png - 发
zi_bai.png - 白

# 花牌
hua_chun.png - 春
hua_mei.png - 梅
```

### 图片存放位置

将所有麻将牌图片存放到以下目录：

```
/images/tiles/
```

## 代码实现

### 1. 映射工具

创建了 `utils/tileMapper.js` 文件，用于处理文字到图片的映射，支持本地图片和网络图片切换：

```javascript
// 麻将牌文字到图片的映射关系
const tileMap = {
  '一万': 'wan_1',
  '二万': 'wan_2',
  // ... 其他映射关系
};

// 配置：图片来源类型 (local: 本地图片, network: 网络图片)
const IMAGE_SOURCE_TYPE = 'network'; // 建议使用 network 以减小包大小

// 网络图片基础URL (使用网络图片时需要配置)
const NETWORK_IMAGE_BASE_URL = 'https://example.com/mahjong/tiles/';

// 本地图片基础路径
const LOCAL_IMAGE_BASE_PATH = '/images/tiles/';

// 获取麻将牌对应的图片路径
const getTileImage = (tileText) => {
  const imageName = tileMap[tileText];
  if (!imageName) return '';
  
  if (IMAGE_SOURCE_TYPE === 'network') {
    // 使用网络图片
    return `${NETWORK_IMAGE_BASE_URL}${imageName}.png`;
  } else {
    // 使用本地图片
    return `${LOCAL_IMAGE_BASE_PATH}${imageName}.png`;
  }
};

module.exports = {
  getTileImage,
  tileMap
};
```

#### 配置说明

1. **切换图片来源**：修改 `IMAGE_SOURCE_TYPE` 变量
   - `'network'`：使用网络图片
   - `'local'`：使用本地图片

2. **配置网络图片**：修改 `NETWORK_IMAGE_BASE_URL` 为你的图片服务器地址

3. **配置本地图片**：确保图片存放在 `LOCAL_IMAGE_BASE_PATH` 指定的目录

#### 示例配置

```javascript
// 使用网络图片
const IMAGE_SOURCE_TYPE = 'network';
const NETWORK_IMAGE_BASE_URL = 'https://your-cdn.com/mahjong/tiles/';

// 使用本地图片
const IMAGE_SOURCE_TYPE = 'local';
const LOCAL_IMAGE_BASE_PATH = '/images/tiles/';
```

### 2. 页面修改

#### 引入映射工具

在每个页面的JS文件中引入映射工具：

```javascript
const { getTileImage } = require('../../utils/tileMapper')
```

#### 添加映射方法

在Page对象中添加getTileImage方法：

```javascript
Page({
  data: {
    // ... 页面数据
  },
  
  // 麻将牌图片映射方法
  getTileImage,
  
  // ... 其他方法
});
```

#### 修改WXML模板

将文字显示改为图片显示：

```html
<!-- 修改前 -->
<view class="mahjong-tile" wx:for="{{tiles}}" wx:key="index">
  <text>{{item}}</text>
</view>

<!-- 修改后 -->
<view class="mahjong-tile" wx:for="{{tiles}}" wx:key="index">
  <image class="tile-image" src="{{getTileImage(item)}}" mode="aspectFit"></image>
</view>
```

#### 调整CSS样式

添加图片样式：

```css
.tile-image {
  width: 70rpx;
  height: 90rpx;
  border-radius: 6rpx;
}
```

## 已修改页面

- `pages/chapter1/chapter1`
- `pages/chapter2/chapter2`
- `pages/chapter3/chapter3`

## 后续工作

### 1. 选择图片来源方式

根据你的需求和资源情况，选择合适的图片来源方式：

- **如果选择网络图片**：
  - 准备好图片资源，上传到你的服务器或CDN
  - 配置 `NETWORK_IMAGE_BASE_URL` 为你的图片服务器地址
  - 确保图片URL可访问

- **如果选择本地图片**：
  - 准备好图片资源，放入 `/images/tiles/` 目录
  - 确保图片大小合适，避免包过大
  - 考虑使用图片压缩工具优化图片大小

### 2. 配置图片来源

修改 `utils/tileMapper.js` 中的配置：

```javascript
// 选择图片来源类型
const IMAGE_SOURCE_TYPE = 'network'; // 或 'local'

// 如果使用网络图片，配置基础URL
const NETWORK_IMAGE_BASE_URL = 'https://your-cdn.com/mahjong/tiles/';
```

### 3. 测试所有页面

- 确保所有麻将牌都能正确显示为图片
- 测试不同网络环境下的加载情况
- 测试无网络环境下的显示情况（如果使用本地图片）

### 4. 优化图片性能

- **图片压缩**：使用图片压缩工具优化图片大小
- **图片格式**：优先使用PNG格式，确保图片质量和透明度
- **图片尺寸**：根据实际显示尺寸调整图片大小，避免过大
- **CDN加速**：如果使用网络图片，建议使用CDN加速

## 注意事项

1. 图片格式建议使用PNG，确保图片质量和透明度
2. 图片大小建议控制在100KB以内，避免影响加载速度
3. 所有麻将牌图片应保持统一的风格和尺寸
4. 确保图片路径正确，避免出现404错误

## 维护建议

1. 定期检查图片资源，确保所有麻将牌都有对应的图片
2. 根据用户反馈，调整图片风格和大小
3. 考虑添加图片加载失败的容错处理

## 总结

通过本方案，我们将文字显示的麻将牌替换为精美的拟物图片，提升了用户体验和视觉效果。同时，采用了统一的命名规范和映射关系，便于后续维护和扩展。