'use strict'

const uniID = require('uni-id-common')

exports.main = async (event, context) => {
  const uniIDInstance = uniID.createInstance({ context })
  const db = uniCloud.database()
  const wishCollection = db.collection('wish')

  // 需要鉴权的操作
  const authActions = ['add', 'update', 'delete', 'getList']
  if (authActions.includes(event.action)) {
    const token = event.token || (event.uniIdToken)
    if (!token) {
      return { code: -1, message: '未登录' }
    }
    const payload = await uniIDInstance.checkToken(token)
    if (payload.errCode) {
      return { code: -1, message: 'token 无效' }
    }
    event.uid = payload.uid
  }

  switch (event.action) {
    case 'add':
      return await addWish(wishCollection, event)
    case 'update':
      return await updateWish(wishCollection, event)
    case 'delete':
      return await deleteWish(wishCollection, event)
    case 'getList':
      return await getList(wishCollection, event)
    case 'getFriendList':
      return await getFriendList(wishCollection, event)
    case 'getDetail':
      return await getDetail(wishCollection, event)
    case 'parseUrl':
      return await parseUrl(event)
    default:
      return { code: -1, message: '未知操作' }
  }
}

/**
 * 添加心愿
 */
async function addWish(wishCollection, event) {
  const { uid, title, description, imageUrl, price, originalUrl, category, priority } = event

  if (!title || !title.trim()) {
    return { code: -1, message: '请输入商品名称' }
  }

  try {
    const wishItem = {
      userId: uid,
      title: title.trim(),
      description: (description || '').trim(),
      imageUrl: imageUrl || '',
      price: Number(price) || 0,
      originalUrl: (originalUrl || '').trim(),
      category: category || '其他',
      priority: priority || 'medium',
      status: 'active',
      claimedBy: '',
      claimedByName: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const res = await wishCollection.add(wishItem)

    return {
      code: 0,
      message: '添加成功',
      data: { _id: res.id, ...wishItem }
    }
  } catch (e) {
    console.error('添加心愿失败', e)
    return { code: -1, message: '添加失败' }
  }
}

/**
 * 更新心愿
 */
async function updateWish(wishCollection, event) {
  const { uid, id, title, description, imageUrl, price, originalUrl, category, priority } = event

  if (!id) {
    return { code: -1, message: '缺少心愿ID' }
  }

  try {
    // 检查是否是自己的心愿
    const wish = await wishCollection.doc(id).get()
    if (!wish.data || wish.data.length === 0) {
      return { code: -1, message: '心愿不存在' }
    }
    if (wish.data[0].userId !== uid) {
      return { code: -1, message: '无权编辑' }
    }

    const updateData = {
      updatedAt: new Date().toISOString()
    }

    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description.trim()
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    if (price !== undefined) updateData.price = Number(price) || 0
    if (originalUrl !== undefined) updateData.originalUrl = originalUrl.trim()
    if (category !== undefined) updateData.category = category
    if (priority !== undefined) updateData.priority = priority

    await wishCollection.doc(id).update(updateData)

    const updated = await wishCollection.doc(id).get()

    return {
      code: 0,
      message: '更新成功',
      data: updated.data[0]
    }
  } catch (e) {
    console.error('更新心愿失败', e)
    return { code: -1, message: '更新失败' }
  }
}

/**
 * 删除心愿
 */
async function deleteWish(wishCollection, event) {
  const { uid, id } = event

  if (!id) {
    return { code: -1, message: '缺少心愿ID' }
  }

  try {
    // 检查是否是自己的心愿
    const wish = await wishCollection.doc(id).get()
    if (!wish.data || wish.data.length === 0) {
      return { code: -1, message: '心愿不存在' }
    }
    if (wish.data[0].userId !== uid) {
      return { code: -1, message: '无权删除' }
    }

    await wishCollection.doc(id).remove()

    // 同时删除相关的认领记录
    const db = uniCloud.database()
    await db.collection('claim').where({ wishId: id }).remove()

    return {
      code: 0,
      message: '删除成功'
    }
  } catch (e) {
    console.error('删除心愿失败', e)
    return { code: -1, message: '删除失败' }
  }
}

/**
 * 获取我的心愿列表
 */
async function getList(wishCollection, event) {
  const { uid, page = 1, pageSize = 10 } = event

  try {
    const skip = (page - 1) * pageSize

    const countRes = await wishCollection
      .where({ userId: uid })
      .count()

    const listRes = await wishCollection
      .where({ userId: uid })
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return {
      code: 0,
      message: '获取成功',
      data: {
        list: listRes.data,
        total: countRes.total,
        page,
        pageSize,
        hasMore: skip + listRes.data.length < countRes.total
      }
    }
  } catch (e) {
    console.error('获取心愿列表失败', e)
    return { code: -1, message: '获取失败' }
  }
}

/**
 * 获取好友的心愿列表
 */
async function getFriendList(wishCollection, event) {
  const { friendId, page = 1, pageSize = 10, priceMin, priceMax } = event

  if (!friendId) {
    return { code: -1, message: '缺少好友ID' }
  }

  try {
    const skip = (page - 1) * pageSize
    let where = { userId: friendId, status: 'active' }

    // 价格筛选
    if (priceMin !== undefined && priceMin > 0) {
      where.price = db.command.gte(Number(priceMin))
    }
    if (priceMax !== undefined && priceMax < 10000) {
      where.price = where.price
        ? db.command.and([where.price, db.command.lte(Number(priceMax))])
        : db.command.lte(Number(priceMax))
    }

    const countRes = await wishCollection.where(where).count()

    const listRes = await wishCollection
      .where(where)
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return {
      code: 0,
      message: '获取成功',
      data: {
        list: listRes.data,
        total: countRes.total,
        page,
        pageSize,
        hasMore: skip + listRes.data.length < countRes.total
      }
    }
  } catch (e) {
    console.error('获取好友心愿列表失败', e)
    return { code: -1, message: '获取失败' }
  }
}

/**
 * 获取心愿详情
 */
async function getDetail(wishCollection, event) {
  const { id } = event

  if (!id) {
    return { code: -1, message: '缺少心愿ID' }
  }

  try {
    const res = await wishCollection.doc(id).get()

    if (!res.data || res.data.length === 0) {
      return { code: -1, message: '心愿不存在' }
    }

    return {
      code: 0,
      message: '获取成功',
      data: res.data[0]
    }
  } catch (e) {
    console.error('获取心愿详情失败', e)
    return { code: -1, message: '获取失败' }
  }
}

/**
 * 解析商品链接
 */
async function parseUrl(event) {
  const { url } = event

  if (!url) {
    return { code: -1, message: '缺少链接' }
  }

  try {
    // 这里可以集成第三方商品解析服务
    // 目前返回基本信息
    const result = {
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
      platform: '未知平台'
    }

    // 简单的 URL 解析逻辑
    if (url.includes('jd.com') || url.includes('jd.hk')) {
      result.platform = '京东'
    } else if (url.includes('tmall.com')) {
      result.platform = '天猫'
    } else if (url.includes('taobao.com') || url.includes('tb.cn')) {
      result.platform = '淘宝'
    } else if (url.includes('pinduoduo.com') || url.includes('yangkeduo.com')) {
      result.platform = '拼多多'
    } else if (url.includes('vip.com')) {
      result.platform = '唯品会'
    } else if (url.includes('douyin.com')) {
      result.platform = '抖音'
    } else if (url.includes('xiaohongshu.com')) {
      result.platform = '小红书'
    }

    return {
      code: 0,
      message: '解析成功',
      data: result
    }
  } catch (e) {
    console.error('解析链接失败', e)
    return { code: -1, message: '解析失败' }
  }
}
