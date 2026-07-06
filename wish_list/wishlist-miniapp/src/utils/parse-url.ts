import type { ParsedProduct } from '@/types'

/**
 * 支持的电商平台域名映射
 */
const PLATFORM_MAP: Record<string, string> = {
  'item.jd.com': '京东',
  'detail.tmall.com': '天猫',
  'item.taobao.com': '淘宝',
  'm.tb.cn': '淘宝',
  'mobile.yangkeduo.com': '拼多多',
  'pinduoduo.com': '拼多多',
  'detail.vip.com': '唯品会',
  'product.suning.com': '苏宁',
  'goods.kaola.com': '网易考拉',
  'you.163.com': '网易严选',
  'missfresh.cn': '每日优鲜',
  'juejin.cn': '掘金',
  'douyin.com': '抖音',
  'xiaohongshu.com': '小红书'
}

/**
 * 从 URL 中识别电商平台
 */
export function detectPlatform(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    for (const [domain, platform] of Object.entries(PLATFORM_MAP)) {
      if (hostname.includes(domain)) {
        return platform
      }
    }

    // 通用识别
    if (hostname.includes('jd')) return '京东'
    if (hostname.includes('tmall')) return '天猫'
    if (hostname.includes('taobao')) return '淘宝'
    if (hostname.includes('pdd') || hostname.includes('pinduoduo')) return '拼多多'
    if (hostname.includes('vip')) return '唯品会'
    if (hostname.includes('suning')) return '苏宁'
    if (hostname.includes('douyin')) return '抖音'
    if (hostname.includes('xiaohongshu')) return '小红书'

    return '未知平台'
  } catch {
    return '未知平台'
  }
}

/**
 * 解析商品链接
 * 注意：实际项目中需要后端配合完成链接解析
 * 这里提供前端解析逻辑框架
 */
export async function parseProductUrl(url: string): Promise<ParsedProduct> {
  // 验证 URL 格式
  if (!url || !isValidUrl(url)) {
    throw new Error('请输入有效的商品链接')
  }

  const platform = detectPlatform(url)

  try {
    // 调用云函数解析商品信息
    const res = await uniCloud.callFunction({
      name: 'wish-crud',
      data: {
        action: 'parseUrl',
        url
      }
    }) as any

    const result = res.result
    if (result.code === 0 && result.data) {
      return {
        title: result.data.title || '未命名商品',
        description: result.data.description || '',
        imageUrl: result.data.imageUrl || '',
        price: result.data.price || 0,
        originalUrl: url,
        platform
      }
    }

    // 如果云函数解析失败，返回基本信息
    return {
      title: extractTitleFromUrl(url) || `${platform}商品`,
      description: `来自${platform}的商品`,
      imageUrl: '',
      price: 0,
      originalUrl: url,
      platform
    }
  } catch (e) {
    // 云函数调用失败时返回基本信息
    return {
      title: extractTitleFromUrl(url) || `${platform}商品`,
      description: `来自${platform}的商品，请手动补充信息`,
      imageUrl: '',
      price: 0,
      originalUrl: url,
      platform
    }
  }
}

/**
 * 验证 URL 是否有效
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * 从 URL 中尝试提取商品标题
 */
function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    // 尝试从 URL 路径中提取 ID
    const match = pathname.match(/\/(\d{6,})\.html/)
    if (match) {
      return `商品 ${match[1]}`
    }
    return ''
  } catch {
    return ''
  }
}

/**
 * 格式化价格显示
 */
export function formatPrice(price: number): string {
  if (price <= 0) return '价格待定'
  return `¥${price.toFixed(2)}`
}

/**
 * 解析用户输入的价格字符串
 */
export function parsePrice(priceStr: string): number {
  if (!priceStr) return 0
  const num = parseFloat(priceStr.replace(/[¥,，]/g, ''))
  return isNaN(num) ? 0 : Math.max(0, num)
}
