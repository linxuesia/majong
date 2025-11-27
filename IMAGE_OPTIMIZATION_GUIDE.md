# 长沙麻将教学小程序 - 图片优化方案

## 方案概述

本方案将当前文字显示的麻将牌替换为精美的拟物图片，提升用户体验和视觉效果。

## 实现原理

1. **创建映射关系**：建立麻将牌文字到图片信息的映射关系
2. **灵活图片加载**：支持三种图片加载方式：
   - 单张本地图片
   - 单张网络图片
   - 精灵图（Sprite）技术
3. **统一图片资源**：使用统一命名规范的麻将牌图片
4. **自定义组件**：创建麻将牌自定义组件，自动处理不同加载方式
5. **优化样式**：调整CSS样式，确保图片正确显示

## 图片资源准备

### 图片加载方式

本方案支持三种图片加载方式，可根据需求灵活切换：

#### 1. 单张本地图片

**优点：**
- 加载速度快，不依赖网络
- 用户体验更流畅
- 无网络环境下也能正常显示

**缺点：**
- 增加小程序包体积，可能导致包过大
- 微信小程序对包大小有限制（2MB，超过需分包）
- 更新图片需要重新发布小程序

#### 2. 单张网络图片

**优点：**
- 不增加小程序包体积
- 可以随时更新图片，无需重新发布小程序
- 支持CDN加速，提高加载速度

**缺点：**
- 依赖网络环境
- 首次加载可能较慢
- 需要额外的服务器资源

#### 3. 精灵图（Sprite）技术

**什么是精灵图？**
精灵图是将多个小图片合并成一张大图，通过CSS背景定位来显示不同部分的技术。

**优点：**
- 减少HTTP请求次数，提高加载速度
- 降低服务器压力
- 可以按类别分组（如万子、条子、筒子各一张精灵图）
- 支持本地和网络两种来源
- 比单张图片更节省空间

**缺点：**
- 制作和维护相对复杂
- 修改单个图片需要重新生成精灵图
- 需要精确计算每个图片在精灵图中的位置

**精灵图分组建议：**
- 万子牌：sprites_wan.png
- 条子牌：sprites_tiao.png
- 筒子牌：sprites_tong.png
- 字牌：sprites_zi.png
- 花牌：sprites_hua.png

**推荐：** 考虑到性能和维护成本，建议优先使用**按类别分组的精灵图**技术。

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

创建了 `utils/tileMapper.js` 文件，支持三种图片加载方式：

```javascript
// 麻将牌文字到图片的映射关系
const tileMap = {
  // 万子牌
  '一万': { sheet: 'wan', index: 0 },
  '二万': { sheet: 'wan', index: 1 },
  // ... 其他映射关系
};

// 配置：图片加载方式
const LOAD_TYPE = 'sprite'; // sprite: 精灵图, single: 单张图片

// 配置：图片来源类型 (local: 本地图片, network: 网络图片)
const IMAGE_SOURCE_TYPE = 'network'; // 建议使用 network 以减小包大小

// 网络图片基础URL
const NETWORK_IMAGE_BASE_URL = 'https://example.com/mahjong/';

// 本地图片基础路径
const LOCAL_IMAGE_BASE_PATH = '/images/';

// 精灵图配置
const SPRITE_CONFIG = {
  // 每个麻将牌在精灵图中的尺寸
  tileWidth: 100, // 宽度（像素）
  tileHeight: 140, // 高度（像素）
  
  // 精灵图文件名
  sheets: {
    wan: 'sprites_wan.png',
    tiao: 'sprites_tiao.png',
    tong: 'sprites_tong.png',
    zi: 'sprites_zi.png',
    hua: 'sprites_hua.png'
  }
};
```

#### 配置说明

1. **切换图片加载方式**：修改 `LOAD_TYPE` 变量
   - `'sprite'`：使用精灵图
   - `'single'`：使用单张图片

2. **切换图片来源**：修改 `IMAGE_SOURCE_TYPE` 变量
   - `'network'`：使用网络图片
   - `'local'`：使用本地图片

3. **配置精灵图**：修改 `SPRITE_CONFIG` 对象
   - `tileWidth`：每个麻将牌在精灵图中的宽度
   - `tileHeight`：每个麻将牌在精灵图中的高度
   - `sheets`：精灵图文件名配置

4. **配置图片URL**：
   - 网络图片：修改 `NETWORK_IMAGE_BASE_URL`
   - 本地图片：修改 `LOCAL_IMAGE_BASE_PATH`

#### 示例配置

```javascript
// 使用网络精灵图（推荐）
const LOAD_TYPE = 'sprite';
const IMAGE_SOURCE_TYPE = 'network';
const NETWORK_IMAGE_BASE_URL = 'https://your-cdn.com/mahjong/';

// 使用本地精灵图
const LOAD_TYPE = 'sprite';
const IMAGE_SOURCE_TYPE = 'local';
const LOCAL_IMAGE_BASE_PATH = '/images/';

// 使用单张网络图片
const LOAD_TYPE = 'single';
const IMAGE_SOURCE_TYPE = 'network';
const NETWORK_IMAGE_BASE_URL = 'https://your-cdn.com/mahjong/';
```

### 2. 自定义组件

创建了 `mahjong-tile` 自定义组件，自动处理不同图片加载方式：

#### 组件结构

```
components/mahjong-tile/
├── mahjong-tile.js    # 组件逻辑
├── mahjong-tile.wxml  # 组件模板
├── mahjong-tile.wxss  # 组件样式
└── mahjong-tile.json  # 组件配置
```

#### 组件使用方法

1. **在页面JSON中注册组件**：

```json
{
  "usingComponents": {
    "mahjong-tile": "../../components/mahjong-tile/mahjong-tile"
  }
}
```

2. **在页面WXML中使用组件**：

```html
<!-- 基本使用 -->
<mahjong-tile tile-text="一万" bind:tap="onTileTap"></mahjong-tile>

<!-- 带自定义类名 -->
<mahjong-tile tile-text="二万" custom-class="my-tile" bind:tap="onTileTap"></mahjong-tile>

<!-- 禁用状态 -->
<mahjong-tile tile-text="三万" disabled="true"></mahjong-tile>

<!-- 在循环中使用 -->
<view class="hand-tiles">
  <mahjong-tile 
    wx:for="{{handTiles}}" 
    wx:key="index"
    tile-text="{{item}}"
    bind:tap="onTileTap"
    data-index="{{index}}"
  ></mahjong-tile>
</view>
```

3. **在页面JS中处理点击事件**：

```javascript
Page({
  // ...
  onTileTap(e) {
    const { tileText } = e.detail;
    const { index } = e.currentTarget.dataset;
    console.log('点击了麻将牌:', tileText, '索引:', index);
    // 处理点击逻辑
  }
});
```

### 3. 页面迁移指南

如果您已经在使用旧的图片显示方式，可以按照以下步骤迁移到新的自定义组件：

#### 1. 注册组件

在页面JSON文件中注册mahjong-tile组件：

```json
{
  "usingComponents": {
    "mahjong-tile": "../../components/mahjong-tile/mahjong-tile"
  }
}
```

#### 2. 替换WXML模板

将旧的图片显示方式替换为新的组件：

```html
<!-- 修改前：旧的图片显示方式 -->
<view class="mahjong-tile" wx:for="{{tiles}}" wx:key="index">
  <image class="tile-image" src="{{getTileImage(item)}}" mode="aspectFit"></image>
</view>

<!-- 修改后：使用自定义组件 -->
<mahjong-tile 
  wx:for="{{tiles}}" 
  wx:key="index"
  tile-text="{{item}}"
  bind:tap="onTileTap"
></mahjong-tile>
```

#### 3. 更新JS代码

移除旧的getTileImage方法调用，因为组件内部会自动处理：

```javascript
// 移除这行代码
const { getTileImage } = require('../../utils/tileMapper')

// 移除Page对象中的getTileImage方法
Page({
  data: {
    // ... 页面数据
  },
  
  // 移除这行代码
  // getTileImage,
  
  // ... 其他方法
});
```

#### 4. 调整CSS样式（可选）

新组件已经包含了完整的样式，您可以根据需要调整或移除旧的样式：

```css
/* 可以移除这些旧样式 */
.mahjong-tile {
  /* 旧样式 */
}

.tile-image {
  /* 旧样式 */
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