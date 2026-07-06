"use strict";
const common_vendor = require("../common/vendor.js");
const PLATFORM_MAP = {
  "item.jd.com": "京东",
  "detail.tmall.com": "天猫",
  "item.taobao.com": "淘宝",
  "m.tb.cn": "淘宝",
  "mobile.yangkeduo.com": "拼多多",
  "pinduoduo.com": "拼多多",
  "detail.vip.com": "唯品会",
  "product.suning.com": "苏宁",
  "goods.kaola.com": "网易考拉",
  "you.163.com": "网易严选",
  "missfresh.cn": "每日优鲜",
  "juejin.cn": "掘金",
  "douyin.com": "抖音",
  "xiaohongshu.com": "小红书"
};
function detectPlatform(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    for (const [domain, platform] of Object.entries(PLATFORM_MAP)) {
      if (hostname.includes(domain)) {
        return platform;
      }
    }
    if (hostname.includes("jd")) return "京东";
    if (hostname.includes("tmall")) return "天猫";
    if (hostname.includes("taobao")) return "淘宝";
    if (hostname.includes("pdd") || hostname.includes("pinduoduo")) return "拼多多";
    if (hostname.includes("vip")) return "唯品会";
    if (hostname.includes("suning")) return "苏宁";
    if (hostname.includes("douyin")) return "抖音";
    if (hostname.includes("xiaohongshu")) return "小红书";
    return "未知平台";
  } catch {
    return "未知平台";
  }
}
async function parseProductUrl(url) {
  if (!url || !isValidUrl(url)) {
    throw new Error("请输入有效的商品链接");
  }
  const platform = detectPlatform(url);
  try {
    const res = await common_vendor.nr.callFunction({
      name: "wish-crud",
      data: {
        action: "parseUrl",
        url
      }
    });
    const result = res.result;
    if (result.code === 0 && result.data) {
      return {
        title: result.data.title || "未命名商品",
        description: result.data.description || "",
        imageUrl: result.data.imageUrl || "",
        price: result.data.price || 0,
        originalUrl: url,
        platform
      };
    }
    return {
      title: extractTitleFromUrl(url) || `${platform}商品`,
      description: `来自${platform}的商品`,
      imageUrl: "",
      price: 0,
      originalUrl: url,
      platform
    };
  } catch (e) {
    return {
      title: extractTitleFromUrl(url) || `${platform}商品`,
      description: `来自${platform}的商品，请手动补充信息`,
      imageUrl: "",
      price: 0,
      originalUrl: url,
      platform
    };
  }
}
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}
function extractTitleFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(/\/(\d{6,})\.html/);
    if (match) {
      return `商品 ${match[1]}`;
    }
    return "";
  } catch {
    return "";
  }
}
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const num = parseFloat(priceStr.replace(/[¥,，]/g, ""));
  return isNaN(num) ? 0 : Math.max(0, num);
}
exports.parsePrice = parsePrice;
exports.parseProductUrl = parseProductUrl;
