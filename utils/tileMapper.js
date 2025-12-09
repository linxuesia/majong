// 麻将牌文字到图片的映射关系
const tileMap = {
  // 万子牌
  '一万': { sheet: 'wan', index: 0 },
  '二万': { sheet: 'wan', index: 1 },
  '三万': { sheet: 'wan', index: 2 },
  '四万': { sheet: 'wan', index: 3 },
  '五万': { sheet: 'wan', index: 4 },
  '六万': { sheet: 'wan', index: 5 },
  '七万': { sheet: 'wan', index: 6 },
  '八万': { sheet: 'wan', index: 7 },
  '九万': { sheet: 'wan', index: 8 },
  
  // 条子牌
  '一条': { sheet: 'tiao', index: 0 },
  '二条': { sheet: 'tiao', index: 1 },
  '三条': { sheet: 'tiao', index: 2 },
  '四条': { sheet: 'tiao', index: 3 },
  '五条': { sheet: 'tiao', index: 4 },
  '六条': { sheet: 'tiao', index: 5 },
  '七条': { sheet: 'tiao', index: 6 },
  '八条': { sheet: 'tiao', index: 7 },
  '九条': { sheet: 'tiao', index: 8 },
  
  // 筒子牌
  '一筒': { sheet: 'tong', index: 0 },
  '二筒': { sheet: 'tong', index: 1 },
  '三筒': { sheet: 'tong', index: 2 },
  '四筒': { sheet: 'tong', index: 3 },
  '五筒': { sheet: 'tong', index: 4 },
  '六筒': { sheet: 'tong', index: 5 },
  '七筒': { sheet: 'tong', index: 6 },
  '八筒': { sheet: 'tong', index: 7 },
  '九筒': { sheet: 'tong', index: 8 },
  
  // 字牌
  '东': { sheet: 'zi', index: 0 },
  '南': { sheet: 'zi', index: 1 },
  '西': { sheet: 'zi', index: 2 },
  '北': { sheet: 'zi', index: 3 },
  '中': { sheet: 'zi', index: 4 },
  '发': { sheet: 'zi', index: 5 },
  '白': { sheet: 'zi', index: 6 },
  
  // 花牌
  '春': { sheet: 'hua', index: 0 },
  '梅': { sheet: 'hua', index: 1 }
};

// 配置：图片加载方式
const LOAD_TYPE = 'sprite'; // sprite: 精灵图, single: 单张图片

// 配置：图片来源类型 (local: 本地图片, network: 网络图片)
const IMAGE_SOURCE_TYPE = 'network'; // 建议使用 network 以减小包大小

// 网络图片基础URL (使用网络图片时需要配置)
const NETWORK_IMAGE_BASE_URL = 'https://example.com/mahjong/';

// 本地图片基础路径
const LOCAL_IMAGE_BASE_PATH = '/images/';

// 精灵图配置
const SPRITE_CONFIG = {
  // 每个麻将牌在精灵图中的尺寸（像素）
  tileWidth: 80, // 宽度调整为 80px，对应 80rpx
  tileHeight: 100, // 高度调整为 100px，对应 100rpx
  
  // 精灵图文件名
  sheets: {
    wan: 'sprites_wan.png',
    tiao: 'sprites_tiao.png',
    tong: 'sprites_tong.png',
    zi: 'sprites_zi.png',
    hua: 'sprites_hua.png'
  }
};

// 获取麻将牌对应的图片信息
const getTileInfo = (tileText) => {
  const tileInfo = tileMap[tileText];
  if (!tileInfo) return null;
  
  if (LOAD_TYPE === 'sprite') {
    // 使用精灵图
    const baseUrl = IMAGE_SOURCE_TYPE === 'network' ? NETWORK_IMAGE_BASE_URL : LOCAL_IMAGE_BASE_PATH;
    const sheetPath = `${baseUrl}sprites/${SPRITE_CONFIG.sheets[tileInfo.sheet]}`;
    
    // 计算精灵图中的位置
    const row = Math.floor(tileInfo.index / 3); // 假设每行3个牌
    const col = tileInfo.index % 3;
    const x = col * SPRITE_CONFIG.tileWidth;
    const y = row * SPRITE_CONFIG.tileHeight;
    
    return {
      type: 'sprite',
      sheetPath: sheetPath,
      x: x,
      y: y,
      width: SPRITE_CONFIG.tileWidth,
      height: SPRITE_CONFIG.tileHeight
    };
  } else {
    // 使用单张图片
    const baseUrl = IMAGE_SOURCE_TYPE === 'network' ? NETWORK_IMAGE_BASE_URL : LOCAL_IMAGE_BASE_PATH;
    const imagePath = `${baseUrl}tiles/${tileInfo.sheet}_${tileInfo.index + 1}.png`;
    
    return {
      type: 'single',
      path: imagePath
    };
  }
};

// 获取麻将牌对应的图片路径（兼容旧接口）
const getTileImage = (tileText) => {
  const info = getTileInfo(tileText);
  if (!info) return '';
  
  if (info.type === 'single') {
    return info.path;
  } else {
    // 对于精灵图，返回精灵图路径，实际显示需要在组件中处理定位
    return info.sheetPath;
  }
};

module.exports = {
  getTileImage,
  getTileInfo,
  tileMap,
  LOAD_TYPE,
  IMAGE_SOURCE_TYPE,
  NETWORK_IMAGE_BASE_URL,
  LOCAL_IMAGE_BASE_PATH,
  SPRITE_CONFIG
};