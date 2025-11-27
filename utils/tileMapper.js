// 麻将牌文字到图片的映射关系
const tileMap = {
  // 万子牌
  '一万': 'wan_1',
  '二万': 'wan_2',
  '三万': 'wan_3',
  '四万': 'wan_4',
  '五万': 'wan_5',
  '六万': 'wan_6',
  '七万': 'wan_7',
  '八万': 'wan_8',
  '九万': 'wan_9',
  
  // 条子牌
  '一条': 'tiao_1',
  '二条': 'tiao_2',
  '三条': 'tiao_3',
  '四条': 'tiao_4',
  '五条': 'tiao_5',
  '六条': 'tiao_6',
  '七条': 'tiao_7',
  '八条': 'tiao_8',
  '九条': 'tiao_9',
  
  // 筒子牌
  '一筒': 'tong_1',
  '二筒': 'tong_2',
  '三筒': 'tong_3',
  '四筒': 'tong_4',
  '五筒': 'tong_5',
  '六筒': 'tong_6',
  '七筒': 'tong_7',
  '八筒': 'tong_8',
  '九筒': 'tong_9',
  
  // 字牌
  '东': 'zi_dong',
  '南': 'zi_nan',
  '西': 'zi_xi',
  '北': 'zi_bei',
  '中': 'zi_zhong',
  '发': 'zi_fa',
  '白': 'zi_bai',
  
  // 花牌
  '春': 'hua_chun',
  '梅': 'hua_mei'
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
  tileMap,
  IMAGE_SOURCE_TYPE,
  NETWORK_IMAGE_BASE_URL,
  LOCAL_IMAGE_BASE_PATH
};