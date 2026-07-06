/**
 * 本地 Mock 数据层
 * 让项目在没有 uniCloud 后端的情况下也能完整预览
 */

import type { User, WishItem, Claim, FriendRelation, ParsedProduct } from '@/types'

// ==================== Mock 模式开关 ====================

export const isMockMode = (): boolean => true

// ==================== 工具函数 ====================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function randomDelay(): Promise<void> {
  return delay(300 + Math.random() * 500)
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

function now(): string {
  return new Date().toISOString()
}

// ==================== 模拟用户数据 ====================

const currentUser: User = {
  _id: 'user_001',
  openId: 'mock_openid_001',
  nickName: '心愿达人',
  avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
  gender: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-04-15T00:00:00.000Z'
}

const mockUsers: User[] = [
  currentUser,
  {
    _id: 'user_002',
    openId: 'mock_openid_002',
    nickName: '小明',
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    gender: 1,
    createdAt: '2026-01-05T00:00:00.000Z',
    updatedAt: '2026-04-10T00:00:00.000Z'
  },
  {
    _id: 'user_003',
    openId: 'mock_openid_003',
    nickName: '小红',
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    gender: 0,
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-04-12T00:00:00.000Z'
  },
  {
    _id: 'user_004',
    openId: 'mock_openid_004',
    nickName: '小华',
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    gender: 1,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-04-14T00:00:00.000Z'
  }
]

// ==================== 模拟心愿商品数据 ====================

const mockWishes: WishItem[] = [
  {
    _id: 'wish_001',
    userId: 'user_001',
    title: 'Sony WH-1000XM5 耳机',
    description: '索尼旗舰降噪耳机，音质出色，降噪效果一流，通勤必备',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 2499,
    originalUrl: 'https://item.jd.com/100012345678.html',
    category: '数码',
    priority: 'high',
    status: 'active',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z'
  },
  {
    _id: 'wish_002',
    userId: 'user_001',
    title: '《小王子》精装版',
    description: '经典文学作品精装版，适合收藏和反复阅读',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 68,
    originalUrl: 'https://item.jd.com/100023456789.html',
    category: '书籍',
    priority: 'low',
    status: 'active',
    createdAt: '2026-03-05T14:00:00.000Z',
    updatedAt: '2026-03-05T14:00:00.000Z'
  },
  {
    _id: 'wish_003',
    userId: 'user_001',
    title: 'Nike Air Max 运动鞋',
    description: '经典气垫跑鞋，舒适百搭，日常运动首选',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 899,
    originalUrl: 'https://item.jd.com/100034567890.html',
    category: '服饰',
    priority: 'medium',
    status: 'active',
    createdAt: '2026-03-10T09:00:00.000Z',
    updatedAt: '2026-03-10T09:00:00.000Z'
  },
  {
    _id: 'wish_004',
    userId: 'user_001',
    title: '乐高积木城堡',
    description: '大型乐高城堡套装，拼装乐趣无穷，适合周末消遣',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 599,
    originalUrl: 'https://item.jd.com/100045678901.html',
    category: '玩具',
    priority: 'medium',
    status: 'claimed',
    claimedBy: 'user_003',
    claimedByName: '小红',
    createdAt: '2026-03-15T16:00:00.000Z',
    updatedAt: '2026-04-01T11:00:00.000Z'
  },
  {
    _id: 'wish_005',
    userId: 'user_001',
    title: '星巴克咖啡机',
    description: '家用全自动咖啡机，每天早上来一杯现磨咖啡',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 1299,
    originalUrl: 'https://item.jd.com/100056789012.html',
    category: '家居',
    priority: 'low',
    status: 'active',
    createdAt: '2026-03-20T08:00:00.000Z',
    updatedAt: '2026-03-20T08:00:00.000Z'
  },
  {
    _id: 'wish_006',
    userId: 'user_001',
    title: 'iPad Air',
    description: '苹果平板电脑，看视频、画画、学习都好用',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 4799,
    originalUrl: 'https://item.jd.com/100067890123.html',
    category: '数码',
    priority: 'high',
    status: 'active',
    createdAt: '2026-04-01T12:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z'
  }
]

// ==================== 模拟好友心愿数据 ====================

const mockFriendWishes: WishItem[] = [
  // 小明的心愿
  {
    _id: 'wish_f001',
    userId: 'user_002',
    title: '机械键盘',
    description: 'Cherry轴体机械键盘，打字手感一流',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 399,
    originalUrl: 'https://item.jd.com/200012345678.html',
    category: '数码',
    priority: 'medium',
    status: 'claimed',
    claimedBy: 'user_001',
    claimedByName: '心愿达人',
    createdAt: '2026-03-08T10:00:00.000Z',
    updatedAt: '2026-04-05T14:00:00.000Z'
  },
  {
    _id: 'wish_f002',
    userId: 'user_002',
    title: 'Switch 游戏',
    description: '塞尔达传说：王国之泪，期待已久的新作',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 299,
    originalUrl: 'https://item.jd.com/200023456789.html',
    category: '数码',
    priority: 'high',
    status: 'active',
    createdAt: '2026-03-12T15:00:00.000Z',
    updatedAt: '2026-03-12T15:00:00.000Z'
  },
  // 小红的心愿
  {
    _id: 'wish_f003',
    userId: 'user_003',
    title: '口红',
    description: 'Dior 999 经典色号，每个女生都值得拥有',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 320,
    originalUrl: 'https://item.jd.com/200034567890.html',
    category: '美妆',
    priority: 'medium',
    status: 'active',
    createdAt: '2026-03-18T11:00:00.000Z',
    updatedAt: '2026-03-18T11:00:00.000Z'
  },
  {
    _id: 'wish_f004',
    userId: 'user_003',
    title: '香水',
    description: 'Chanel N5 经典香水，优雅迷人',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 680,
    originalUrl: 'https://item.jd.com/200045678901.html',
    category: '美妆',
    priority: 'high',
    status: 'active',
    createdAt: '2026-03-22T13:00:00.000Z',
    updatedAt: '2026-03-22T13:00:00.000Z'
  },
  {
    _id: 'wish_f005',
    userId: 'user_003',
    title: '围巾',
    description: 'Burberry 经典格纹围巾，秋冬必备单品',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 199,
    originalUrl: 'https://item.jd.com/200056789012.html',
    category: '服饰',
    priority: 'low',
    status: 'active',
    createdAt: '2026-04-02T09:00:00.000Z',
    updatedAt: '2026-04-02T09:00:00.000Z'
  },
  // 小华的心愿
  {
    _id: 'wish_f006',
    userId: 'user_004',
    title: '篮球鞋',
    description: 'Nike Jordan 1 复古篮球鞋，球场上的经典',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 1299,
    originalUrl: 'https://item.jd.com/200067890123.html',
    category: '服饰',
    priority: 'high',
    status: 'active',
    createdAt: '2026-03-25T10:00:00.000Z',
    updatedAt: '2026-03-25T10:00:00.000Z'
  },
  {
    _id: 'wish_f007',
    userId: 'user_004',
    title: '蓝牙音箱',
    description: 'Marshall 蓝牙音箱，复古外观，音质震撼',
    imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    price: 259,
    originalUrl: 'https://item.jd.com/200078901234.html',
    category: '数码',
    priority: 'low',
    status: 'active',
    createdAt: '2026-04-05T16:00:00.000Z',
    updatedAt: '2026-04-05T16:00:00.000Z'
  }
]

// ==================== 模拟认领数据 ====================

const mockClaims: Claim[] = [
  {
    _id: 'claim_001',
    wishId: 'wish_f001',
    wishTitle: '机械键盘',
    wishImageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    wishPrice: 399,
    claimerId: 'user_001',
    claimerName: '心愿达人',
    claimerAvatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    ownerId: 'user_002',
    ownerName: '小明',
    ownerAvatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    status: 'pending',
    createdAt: '2026-04-05T14:00:00.000Z',
    updatedAt: '2026-04-05T14:00:00.000Z'
  },
  {
    _id: 'claim_002',
    wishId: 'wish_004',
    wishTitle: '乐高积木城堡',
    wishImageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    wishPrice: 599,
    claimerId: 'user_003',
    claimerName: '小红',
    claimerAvatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    ownerId: 'user_001',
    ownerName: '心愿达人',
    ownerAvatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    status: 'pending',
    createdAt: '2026-04-01T11:00:00.000Z',
    updatedAt: '2026-04-01T11:00:00.000Z'
  }
]

// ==================== 模拟好友关系 ====================

const mockFriends: FriendRelation[] = [
  {
    _id: 'friend_001',
    userId: 'user_001',
    friendId: 'user_002',
    friendName: '小明',
    friendAvatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    status: 'accepted',
    createdAt: '2026-02-01T00:00:00.000Z'
  },
  {
    _id: 'friend_002',
    userId: 'user_001',
    friendId: 'user_003',
    friendName: '小红',
    friendAvatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    status: 'accepted',
    createdAt: '2026-02-10T00:00:00.000Z'
  },
  {
    _id: 'friend_003',
    userId: 'user_001',
    friendId: 'user_004',
    friendName: '小华',
    friendAvatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
    status: 'accepted',
    createdAt: '2026-03-01T00:00:00.000Z'
  }
]

// ==================== Mock 数据存储 ====================

const mockDB: Map<string, any[]> = new Map()

function initMockData(): void {
  if (mockDB.size > 0) return

  mockDB.set('users', [...mockUsers])
  mockDB.set('wishes', [...mockWishes, ...mockFriendWishes])
  mockDB.set('claims', [...mockClaims])
  mockDB.set('friends', [...mockFriends])
}

// 确保初始化
initMockData()

// ==================== 模拟云函数调用 ====================

export function mockCallFunction(options: { name: string; data: any }): Promise<any> {
  return new Promise(async (resolve) => {
    await randomDelay()

    const { name, data } = options

    switch (name) {
      case 'wish-login':
        resolve(handleWishLogin(data))
        break
      case 'wish-crud':
        resolve(handleWishCrud(data))
        break
      case 'friend-ops':
        resolve(handleFriendOps(data))
        break
      case 'claim-ops':
        resolve(handleClaimOps(data))
        break
      default:
        resolve({ code: -1, message: `未知云函数: ${name}` })
    }
  })
}

// ==================== wish-login 处理 ====================

function handleWishLogin(data: any) {
  const users = mockDB.get('users')!
  const user = users.find((u: User) => u._id === 'user_001')

  switch (data.action) {
    case 'getUserInfo':
      return { code: 0, data: { ...user }, message: 'ok' }

    case 'updateUserInfo': {
      if (user) {
        user.nickName = data.nickName || user.nickName
        user.avatarUrl = data.avatarUrl || user.avatarUrl
        user.updatedAt = now()
      }
      return { code: 0, data: { ...user }, message: 'ok' }
    }

    default: {
      // 默认登录
      const token = 'mock_token_' + Date.now()
      return {
        code: 0,
        data: {
          token,
          userInfo: { ...user }
        },
        message: 'ok'
      }
    }
  }
}

// ==================== wish-crud 处理 ====================

function handleWishCrud(data: any) {
  const wishes = mockDB.get('wishes')!

  switch (data.action) {
    case 'getList': {
      const page = data.page || 1
      const pageSize = data.pageSize || 10
      const myWishes = wishes.filter((w: WishItem) => w.userId === 'user_001')
      const total = myWishes.length
      const start = (page - 1) * pageSize
      const list = myWishes.slice(start, start + pageSize)
      return {
        code: 0,
        data: {
          list,
          total,
          page,
          pageSize,
          hasMore: start + pageSize < total
        },
        message: 'ok'
      }
    }

    case 'add': {
      const newWish: WishItem = {
        _id: generateId('wish'),
        userId: 'user_001',
        title: data.title,
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        price: data.price || 0,
        originalUrl: data.originalUrl || '',
        category: data.category || '其他',
        priority: data.priority || 'medium',
        status: 'active',
        createdAt: now(),
        updatedAt: now()
      }
      wishes.unshift(newWish)
      return { code: 0, data: { ...newWish }, message: 'ok' }
    }

    case 'update': {
      const index = wishes.findIndex((w: WishItem) => w._id === data.id)
      if (index !== -1) {
        const wish = wishes[index]
        if (data.title !== undefined) wish.title = data.title
        if (data.description !== undefined) wish.description = data.description
        if (data.imageUrl !== undefined) wish.imageUrl = data.imageUrl
        if (data.price !== undefined) wish.price = data.price
        if (data.originalUrl !== undefined) wish.originalUrl = data.originalUrl
        if (data.category !== undefined) wish.category = data.category
        if (data.priority !== undefined) wish.priority = data.priority
        wish.updatedAt = now()
        return { code: 0, data: { ...wish }, message: 'ok' }
      }
      return { code: -1, message: '心愿不存在' }
    }

    case 'delete': {
      const idx = wishes.findIndex((w: WishItem) => w._id === data.id)
      if (idx !== -1) {
        wishes.splice(idx, 1)
        return { code: 0, data: null, message: 'ok' }
      }
      return { code: -1, message: '心愿不存在' }
    }

    case 'getFriendList': {
      const friendId = data.friendId
      const page = data.page || 1
      const pageSize = data.pageSize || 10
      let friendWishes = wishes.filter((w: WishItem) => w.userId === friendId)

      // 价格筛选
      if (data.priceMin !== undefined && data.priceMin !== null) {
        friendWishes = friendWishes.filter((w: WishItem) => w.price >= data.priceMin)
      }
      if (data.priceMax !== undefined && data.priceMax !== null) {
        friendWishes = friendWishes.filter((w: WishItem) => w.price <= data.priceMax)
      }

      const total = friendWishes.length
      const start = (page - 1) * pageSize
      const list = friendWishes.slice(start, start + pageSize)
      return {
        code: 0,
        data: {
          list,
          total,
          page,
          pageSize,
          hasMore: start + pageSize < total
        },
        message: 'ok'
      }
    }

    case 'getDetail': {
      const wish = wishes.find((w: WishItem) => w._id === data.id)
      if (wish) {
        return { code: 0, data: { ...wish }, message: 'ok' }
      }
      return { code: -1, message: '心愿不存在' }
    }

    case 'parseUrl': {
      const parsedProduct: ParsedProduct = {
        title: '模拟解析商品',
        description: '这是一个通过链接解析得到的模拟商品信息',
        imageUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJ32vAbHicTQ3QRibU3y6gKlT3RzFiaL9FJz4fib9EwSjXqg/0',
        price: 199,
        originalUrl: data.url || '',
        platform: '京东'
      }
      return { code: 0, data: parsedProduct, message: 'ok' }
    }

    default:
      return { code: -1, message: `未知 action: ${data.action}` }
  }
}

// ==================== friend-ops 处理 ====================

function handleFriendOps(data: any) {
  const friends = mockDB.get('friends')!
  const users = mockDB.get('users')!

  switch (data.action) {
    case 'getList': {
      const myFriends = friends.filter((f: FriendRelation) => f.userId === 'user_001' && f.status === 'accepted')
      return { code: 0, data: myFriends, message: 'ok' }
    }

    case 'search': {
      const keyword = (data.keyword || '').toLowerCase()
      const matchedUsers = users.filter((u: User) =>
        u._id !== 'user_001' &&
        u.nickName.toLowerCase().includes(keyword)
      )
      const results = matchedUsers.map((u: User) => ({
        _id: generateId('friend_search'),
        userId: 'user_001',
        friendId: u._id,
        friendName: u.nickName,
        friendAvatar: u.avatarUrl,
        status: 'accepted' as const,
        createdAt: now()
      }))
      return { code: 0, data: results, message: 'ok' }
    }

    case 'add': {
      const friendId = data.friendId
      const friendUser = users.find((u: User) => u._id === friendId)
      if (!friendUser) {
        return { code: -1, message: '用户不存在' }
      }
      const alreadyFriend = friends.some(
        (f: FriendRelation) => f.userId === 'user_001' && f.friendId === friendId
      )
      if (alreadyFriend) {
        return { code: -1, message: '已经是好友了' }
      }
      const newFriend: FriendRelation = {
        _id: generateId('friend'),
        userId: 'user_001',
        friendId: friendUser._id,
        friendName: friendUser.nickName,
        friendAvatar: friendUser.avatarUrl,
        status: 'accepted',
        createdAt: now()
      }
      friends.push(newFriend)
      return { code: 0, data: newFriend, message: 'ok' }
    }

    case 'addByShare': {
      // 模拟通过分享链接添加好友
      const inviteCode = data.inviteCode
      const friendUser = users.find((u: User) => u._id !== 'user_001')
      if (!friendUser) {
        return { code: -1, message: '用户不存在' }
      }
      const alreadyFriend = friends.some(
        (f: FriendRelation) => f.userId === 'user_001' && f.friendId === friendUser._id
      )
      if (alreadyFriend) {
        return { code: -1, message: '已经是好友了' }
      }
      const newFriend: FriendRelation = {
        _id: generateId('friend'),
        userId: 'user_001',
        friendId: friendUser._id,
        friendName: friendUser.nickName,
        friendAvatar: friendUser.avatarUrl,
        status: 'accepted',
        createdAt: now()
      }
      friends.push(newFriend)
      return { code: 0, data: newFriend, message: 'ok' }
    }

    case 'remove': {
      const friendId = data.friendId
      const idx = friends.findIndex(
        (f: FriendRelation) => f.userId === 'user_001' && f.friendId === friendId
      )
      if (idx !== -1) {
        friends.splice(idx, 1)
        return { code: 0, data: null, message: 'ok' }
      }
      return { code: -1, message: '好友不存在' }
    }

    default:
      return { code: -1, message: `未知 action: ${data.action}` }
  }
}

// ==================== claim-ops 处理 ====================

function handleClaimOps(data: any) {
  const claims = mockDB.get('claims')!
  const wishes = mockDB.get('wishes')!
  const users = mockDB.get('users')!

  switch (data.action) {
    case 'claim': {
      const wishId = data.wishId
      const wish = wishes.find((w: WishItem) => w._id === wishId)
      if (!wish) {
        return { code: -1, message: '心愿不存在' }
      }
      if (wish.status === 'claimed') {
        return { code: -1, message: '该心愿已被认领' }
      }

      // 更新心愿状态
      wish.status = 'claimed'
      wish.claimedBy = 'user_001'
      wish.claimedByName = '心愿达人'
      wish.updatedAt = now()

      // 创建认领记录
      const owner = users.find((u: User) => u._id === wish.userId)
      const claimer = users.find((u: User) => u._id === 'user_001')
      const newClaim: Claim = {
        _id: generateId('claim'),
        wishId: wish._id,
        wishTitle: wish.title,
        wishImageUrl: wish.imageUrl,
        wishPrice: wish.price,
        claimerId: 'user_001',
        claimerName: claimer?.nickName || '心愿达人',
        claimerAvatar: claimer?.avatarUrl || '',
        ownerId: wish.userId,
        ownerName: owner?.nickName || '',
        ownerAvatar: owner?.avatarUrl || '',
        status: 'pending',
        createdAt: now(),
        updatedAt: now()
      }
      claims.push(newClaim)
      return { code: 0, data: { ...newClaim }, message: 'ok' }
    }

    case 'cancel': {
      const claimId = data.claimId
      const claimIdx = claims.findIndex((c: Claim) => c._id === claimId)
      if (claimIdx === -1) {
        return { code: -1, message: '认领记录不存在' }
      }
      const claim = claims[claimIdx]

      // 恢复心愿状态
      const wish = wishes.find((w: WishItem) => w._id === claim.wishId)
      if (wish && wish.status === 'claimed') {
        wish.status = 'active'
        wish.claimedBy = undefined
        wish.claimedByName = undefined
        wish.updatedAt = now()
      }

      // 删除认领记录
      claims.splice(claimIdx, 1)
      return { code: 0, data: null, message: 'ok' }
    }

    case 'getMyClaims': {
      const myClaimsList = claims.filter((c: Claim) => c.claimerId === 'user_001')
      return { code: 0, data: myClaimsList, message: 'ok' }
    }

    case 'getReceivedClaims': {
      const receivedClaimsList = claims.filter((c: Claim) => c.ownerId === 'user_001')
      return { code: 0, data: receivedClaimsList, message: 'ok' }
    }

    case 'complete': {
      const claimId = data.claimId
      const claim = claims.find((c: Claim) => c._id === claimId)
      if (!claim) {
        return { code: -1, message: '认领记录不存在' }
      }

      claim.status = 'completed'
      claim.updatedAt = now()

      // 更新心愿状态
      const wish = wishes.find((w: WishItem) => w._id === claim.wishId)
      if (wish) {
        wish.status = 'completed'
        wish.updatedAt = now()
      }

      return { code: 0, data: { ...claim }, message: 'ok' }
    }

    default:
      return { code: -1, message: `未知 action: ${data.action}` }
  }
}
