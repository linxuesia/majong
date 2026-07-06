/** 用户信息 */
export interface User {
  _id: string
  openId: string
  nickName: string
  avatarUrl: string
  gender: number
  phone?: string
  createdAt: string
  updatedAt: string
}

/** 心愿商品 */
export interface WishItem {
  _id: string
  userId: string
  title: string
  description: string
  imageUrl: string
  price: number
  originalUrl: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'claimed' | 'completed' | 'cancelled'
  claimedBy?: string
  claimedByName?: string
  createdAt: string
  updatedAt: string
}

/** 认领记录 */
export interface Claim {
  _id: string
  wishId: string
  wishTitle: string
  wishImageUrl: string
  wishPrice: number
  claimerId: string
  claimerName: string
  claimerAvatar: string
  ownerId: string
  ownerName: string
  ownerAvatar: string
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

/** 好友关系 */
export interface FriendRelation {
  _id: string
  userId: string
  friendId: string
  friendName: string
  friendAvatar: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

/** 登录返回数据 */
export interface LoginResult {
  token: string
  userInfo: User
}

/** 通用 API 响应 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/** 分页参数 */
export interface PageParams {
  page: number
  pageSize: number
}

/** 分页响应 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/** 添加心愿参数 */
export interface AddWishParams {
  title: string
  description: string
  imageUrl: string
  price: number
  originalUrl: string
  category: string
  priority: 'low' | 'medium' | 'high'
}

/** 编辑心愿参数 */
export interface EditWishParams extends Partial<AddWishParams> {
  id: string
}

/** 链接解析结果 */
export interface ParsedProduct {
  title: string
  description: string
  imageUrl: string
  price: number
  originalUrl: string
  platform: string
}

/** 价格区间 */
export interface PriceRange {
  min: number
  max: number
}
