'use strict'

const uniID = require('uni-id-common')

exports.main = async (event, context) => {
  const uniIDInstance = uniID.createInstance({ context })
  const db = uniCloud.database()
  const claimCollection = db.collection('claim')
  const wishCollection = db.collection('wish')

  // 鉴权
  const token = event.token || event.uniIdToken
  if (!token) {
    return { code: -1, message: '未登录' }
  }
  const payload = await uniIDInstance.checkToken(token)
  if (payload.errCode) {
    return { code: -1, message: 'token 无效' }
  }
  const uid = payload.uid

  switch (event.action) {
    case 'claim':
      return await claimWish(claimCollection, wishCollection, db, uid, event)
    case 'cancel':
      return await cancelClaim(claimCollection, wishCollection, uid, event)
    case 'complete':
      return await completeClaim(claimCollection, wishCollection, uid, event)
    case 'getMyClaims':
      return await getMyClaims(claimCollection, uid)
    case 'getReceivedClaims':
      return await getReceivedClaims(claimCollection, uid)
    default:
      return { code: -1, message: '未知操作' }
  }
}

/**
 * 认领心愿
 */
async function claimWish(claimCollection, wishCollection, db, uid, event) {
  const { wishId } = event

  if (!wishId) {
    return { code: -1, message: '缺少心愿ID' }
  }

  try {
    // 获取心愿信息
    const wishRes = await wishCollection.doc(wishId).get()
    if (!wishRes.data || wishRes.data.length === 0) {
      return { code: -1, message: '心愿不存在' }
    }

    const wish = wishRes.data[0]

    // 不能认领自己的心愿
    if (wish.userId === uid) {
      return { code: -1, message: '不能认领自己的心愿' }
    }

    // 检查是否已被认领
    if (wish.status === 'claimed' || wish.status === 'completed') {
      return { code: -1, message: '该心愿已被认领' }
    }

    // 获取认领者和所有者信息
    const userCollection = db.collection('user')
    const claimer = await userCollection.doc(uid).get()
    const owner = await userCollection.doc(wish.userId).get()

    const claimerInfo = claimer.data[0] || { nickName: '未知用户', avatarUrl: '' }
    const ownerInfo = owner.data[0] || { nickName: '未知用户', avatarUrl: '' }

    // 创建认领记录
    const claimRecord = {
      wishId: wishId,
      wishTitle: wish.title,
      wishImageUrl: wish.imageUrl,
      wishPrice: wish.price,
      claimerId: uid,
      claimerName: claimerInfo.nickName,
      claimerAvatar: claimerInfo.avatarUrl,
      ownerId: wish.userId,
      ownerName: ownerInfo.nickName,
      ownerAvatar: ownerInfo.avatarUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const claimRes = await claimCollection.add(claimRecord)

    // 更新心愿状态
    await wishCollection.doc(wishId).update({
      status: 'claimed',
      claimedBy: uid,
      claimedByName: claimerInfo.nickName,
      updatedAt: new Date().toISOString()
    })

    return {
      code: 0,
      message: '认领成功',
      data: {
        _id: claimRes.id,
        ...claimRecord
      }
    }
  } catch (e) {
    console.error('认领失败', e)
    return { code: -1, message: '认领失败' }
  }
}

/**
 * 取消认领
 */
async function cancelClaim(claimCollection, wishCollection, uid, event) {
  const { claimId } = event

  if (!claimId) {
    return { code: -1, message: '缺少认领ID' }
  }

  try {
    // 获取认领记录
    const claimRes = await claimCollection.doc(claimId).get()
    if (!claimRes.data || claimRes.data.length === 0) {
      return { code: -1, message: '认领记录不存在' }
    }

    const claim = claimRes.data[0]

    // 只能取消自己的认领
    if (claim.claimerId !== uid) {
      return { code: -1, message: '无权操作' }
    }

    // 更新认领状态
    await claimCollection.doc(claimId).update({
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    })

    // 恢复心愿状态
    await wishCollection.doc(claim.wishId).update({
      status: 'active',
      claimedBy: '',
      claimedByName: '',
      updatedAt: new Date().toISOString()
    })

    return {
      code: 0,
      message: '已取消认领'
    }
  } catch (e) {
    console.error('取消认领失败', e)
    return { code: -1, message: '取消认领失败' }
  }
}

/**
 * 确认完成认领（心愿所有者确认收到礼物）
 */
async function completeClaim(claimCollection, wishCollection, uid, event) {
  const { claimId } = event

  if (!claimId) {
    return { code: -1, message: '缺少认领ID' }
  }

  try {
    // 获取认领记录
    const claimRes = await claimCollection.doc(claimId).get()
    if (!claimRes.data || claimRes.data.length === 0) {
      return { code: -1, message: '认领记录不存在' }
    }

    const claim = claimRes.data[0]

    // 只有心愿所有者可以确认
    if (claim.ownerId !== uid) {
      return { code: -1, message: '无权操作' }
    }

    // 更新认领状态
    await claimCollection.doc(claimId).update({
      status: 'completed',
      updatedAt: new Date().toISOString()
    })

    // 更新心愿状态
    await wishCollection.doc(claim.wishId).update({
      status: 'completed',
      updatedAt: new Date().toISOString()
    })

    return {
      code: 0,
      message: '已确认完成'
    }
  } catch (e) {
    console.error('确认完成失败', e)
    return { code: -1, message: '操作失败' }
  }
}

/**
 * 获取我的认领列表
 */
async function getMyClaims(claimCollection, uid) {
  try {
    const res = await claimCollection
      .where({
        claimerId: uid,
        status: db.command.in(['pending', 'completed'])
      })
      .orderBy('createdAt', 'desc')
      .get()

    return {
      code: 0,
      message: '获取成功',
      data: res.data
    }
  } catch (e) {
    console.error('获取认领列表失败', e)
    return { code: -1, message: '获取失败' }
  }
}

/**
 * 获取收到的认领（别人认领我的心愿）
 */
async function getReceivedClaims(claimCollection, uid) {
  try {
    const res = await claimCollection
      .where({
        ownerId: uid,
        status: db.command.in(['pending', 'completed'])
      })
      .orderBy('createdAt', 'desc')
      .get()

    return {
      code: 0,
      message: '获取成功',
      data: res.data
    }
  } catch (e) {
    console.error('获取收到的认领失败', e)
    return { code: -1, message: '获取失败' }
  }
}
