/**
 * 针对新精灵图 (Mahjong by DemChing) 的坐标映射
 * 布局估算：
 * 第 1 行：筒子 1-9
 * 第 2 行：条子 1-9
 * 第 3 行：万子 1-9
 * 第 4 行：东南西北 中发白
 */

const TILE_MAP_V2 = {
  // 筒子 (Row 0)
  '一筒': { r: 0, c: 0 }, '二筒': { r: 0, c: 1 }, '三筒': { r: 0, c: 2 },
  '四筒': { r: 0, c: 3 }, '五筒': { r: 0, c: 4 }, '六筒': { r: 0, c: 5 },
  '七筒': { r: 0, c: 6 }, '八筒': { r: 0, c: 7 }, '九筒': { r: 0, c: 8 },

  // 条子 (Row 1)
  '一条': { r: 1, c: 0 }, '二条': { r: 1, c: 1 }, '三条': { r: 1, c: 2 },
  '四条': { r: 1, c: 3 }, '五条': { r: 1, c: 4 }, '六条': { r: 1, c: 5 },
  '七条': { r: 1, c: 6 }, '八条': { r: 1, c: 7 }, '九条': { r: 1, c: 8 },

  // 万子 (Row 2)
  '一万': { r: 2, c: 0 }, '二万': { r: 2, c: 1 }, '三万': { r: 2, c: 2 },
  '四万': { r: 2, c: 3 }, '五万': { r: 2, c: 4 }, '六万': { r: 2, c: 5 },
  '七万': { r: 2, c: 6 }, '八万': { r: 2, c: 7 }, '九万': { r: 2, c: 8 },

  // 字牌 (Row 3)
  '东': { r: 3, c: 0 }, '南': { r: 3, c: 1 }, '西': { r: 3, c: 2 }, '北': { r: 3, c: 3 },
  '中': { r: 3, c: 4 }, '发': { r: 3, c: 5 }, '白': { r: 3, c: 6 }
};

const CONFIG_V2 = {
  imagePath: '/images/mahjong_v2.jpg', // 请确保图片在此路径
  cols: 9,
  rows: 5,
  // 这里的百分比定位最稳，不受图片实际像素尺寸限制
  unitX: 100 / 8, // (9列，间距数为8)
  unitY: 100 / 4  // (5行，间距数为4)
};

const getTilePosV2 = (text) => {
  const pos = TILE_MAP_V2[text];
  if (!pos) return null;
  return {
    x: pos.c * CONFIG_V2.unitX,
    y: pos.r * CONFIG_V2.unitY,
    image: CONFIG_V2.imagePath
  };
};

module.exports = {
  getTilePosV2,
  TILE_MAP_V2
};
