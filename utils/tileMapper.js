// 麻将牌文字到图片的映射关系（单张精灵图布局）
const tileMap = {
  // 万子牌（第1行）
  '一万': { row: 0, col: 0 },
  '二万': { row: 0, col: 1 },
  '三万': { row: 0, col: 2 },
  '四万': { row: 0, col: 3 },
  '五万': { row: 0, col: 4 },
  '六万': { row: 0, col: 5 },
  '七万': { row: 0, col: 6 },
  '八万': { row: 0, col: 7 },
  '九万': { row: 0, col: 8 },
  
  // 条子牌（第2行）
  '一条': { row: 1, col: 0 },
  '二条': { row: 1, col: 1 },
  '三条': { row: 1, col: 2 },
  '四条': { row: 1, col: 3 },
  '五条': { row: 1, col: 4 },
  '六条': { row: 1, col: 5 },
  '七条': { row: 1, col: 6 },
  '八条': { row: 1, col: 7 },
  '九条': { row: 1, col: 8 },
  
  // 筒子牌（第3行）
  '一筒': { row: 2, col: 0 },
  '二筒': { row: 2, col: 1 },
  '三筒': { row: 2, col: 2 },
  '四筒': { row: 2, col: 3 },
  '五筒': { row: 2, col: 4 },
  '六筒': { row: 2, col: 5 },
  '七筒': { row: 2, col: 6 },
  '八筒': { row: 2, col: 7 },
  '九筒': { row: 2, col: 8 },
  
  // 字牌（第4行）
  '北': { row: 3, col: 0 },
  '白': { row: 3, col: 1 },
  '南': { row: 3, col: 2 },
  '中': { row: 3, col: 3 },
  '发': { row: 3, col: 4 },
  '东': { row: 3, col: 5 },
  '西': { row: 3, col: 6 }
};

// 配置：图片加载方式
const LOAD_TYPE = 'sprite'; // sprite: 精灵图, single: 单张图片

// 配置：图片来源类型 (local: 本地图片, network: 网络图片)
const IMAGE_SOURCE_TYPE = 'network'; // 使用网络图片

// 网络图片基础URL (使用网络图片时需要配置)
const NETWORK_IMAGE_BASE_URL = 'https://images.daojia.com/jz/pic/';

// 本地图片基础路径
const LOCAL_IMAGE_BASE_PATH = '/images/';

// 单张精灵图配置
const SPRITE_CONFIG = {
  // 整个精灵图的文件名
  fileName: 'd5601e8b347ca3f3b4431b8869d786e9.png',
  
  // 每个麻将牌在精灵图中的尺寸（像素）
  tileWidth: 66, // 宽度（像素）
  tileHeight: 96, // 高度（像素）
  
  // 精灵图中的行数和列数
  rows: 4,
  cols: 9,
  
  // 图片总尺寸（像素）
  totalWidth: 600,
  totalHeight: 400,
  
  // 调整后的定位偏移量（用于修正显示）
  offsetX: 0,
  offsetY: 0
};

// 获取麻将牌对应的图片信息
const getTileInfo = (tileText) => {
  const tileInfo = tileMap[tileText];
  if (!tileInfo) return null;
  
  if (LOAD_TYPE === 'sprite') {
    // 使用单张精灵图
    const baseUrl = IMAGE_SOURCE_TYPE === 'network' ? NETWORK_IMAGE_BASE_URL : LOCAL_IMAGE_BASE_PATH;
    const sheetPath = `${baseUrl}${SPRITE_CONFIG.fileName}`;
    
    // 计算精灵图中的位置
    const x = tileInfo.col * SPRITE_CONFIG.tileWidth;
    const y = tileInfo.row * SPRITE_CONFIG.tileHeight;
    
    return {
      type: 'sprite',
      sheetPath: sheetPath,
      x: x,
      y: y,
      width: SPRITE_CONFIG.tileWidth,
      height: SPRITE_CONFIG.tileHeight
    };
  } else {
    // 使用单张图片（保留兼容）
    const baseUrl = IMAGE_SOURCE_TYPE === 'network' ? NETWORK_IMAGE_BASE_URL : LOCAL_IMAGE_BASE_PATH;
    const imagePath = `${baseUrl}tiles/${tileText.replace(/[^\w]/g, '')}.png`;
    
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