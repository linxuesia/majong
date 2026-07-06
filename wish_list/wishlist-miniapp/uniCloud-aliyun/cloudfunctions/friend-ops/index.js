'use strict'

const uniID = require('uni-id-common')

exports.main = async (event, context) => {
  const uniIDInstance = uniID.createInstance({ context })
  const db = uniCloud.database()
  const friendCollection = db.collection('friend')

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
    case 'getList':
      return await getFriendList(friendCollection, uid)
    case 'search':
      return await searchFriend(db, friendCollection, uid, event)
    case 'add':
      return await addFriend(friendCollection, uid, event)
    case 'addByShare':
      return await addFriendByShare(friendCollection, db, uid, event)
    case 'remove':
      return await removeFriend(friendCollection, uid, event)
    case 'accept':
      return await acceptFriend(friendCollection, uid, event)
    case 'reject':
      return await rejectFriend(friendCollection, uid, event)
    default:
      return { code: -1, message: '未知操作' }
  }
}

/**
 * 获取好友列表
 */
async function getFriendList(friendCollection, uid) {
  try {
    const res = await friendCollection
      .where({
        userId: uid,
        status: 'accepted'
      })
      .orderBy('createdAt', 'desc')
      .get()

    return {
      code: 0,
      message: '获取成功',
      data: res.data
    }
  } catch (e) {
    console.error('获取好友列表失败', e)
    return { code: -1, message: '获取失败' }
  }
}

/**
 * 搜索好友
 */
async function searchFriend(db, friendCollection, uid, event) {
  const { keyword } = event

  if (!keyword || !keyword.trim()) {
    return { code: -1, message: '请输入搜索关键词' }
  }

  try {
    const userCollection = db.collection('user')

    // 搜索用户
    const users = await userCollection
      .where({
        nickName: new RegExp(keyword.trim(), 'i')
      })
      .limit(20)
      .get()

    // 过滤掉自己
    const filteredUsers = users.data.filter(u => u._id !== uid)

    // 查看是否已经是好友
    const friendIds = filteredUsers.map(u => u._id)
    let existingFriends = []
    if (friendIds.length > 0) {
      const friendRes = await friendCollection
        .where({
          userId: uid,
          friendId: db.command.in(friendIds),
          status: 'accepted'
        })
        .get()
      existingFriends = friendRes.data.map(f => f.friendId)
    }

    const result = filteredUsers.map(u => ({
      _id: '',
      userId: uid,
      friendId: u._id,
      friendName: u.nickName,
      friendAvatar: u.avatarUrl,
      status: existingFriends.includes(u._id) ? 'accepted' : 'not_friend',
      createdAt: ''
    }))

    return {
      code: 0,
      message: '搜索成功',
      data: result
    }
  } catch (e) {
    console.error('搜索好友失败', e)
    return { code: -1, message: '搜索失败' }
  }
}

/**
 * 添加好友
 */
async function addFriend(friendCollection, uid, event) {
  const { friendId } = event

  if (!friendId) {
    return { code: -1, message: '缺少好友ID' }
  }

  if (friendId === uid) {
    return { code: -1, message: '不能添加自己为好友' }
  }

  try {
    // 检查是否已经是好友
    const existing = await friendCollection
      .where({
        userId: uid,
        friendId: friendId
      })
      .get()

    if (existing.data && existing.data.length > 0) {
      return { code: -1, message: '已经是好友或已发送请求' }
    }

    // 创建双向好友关系
    await friendCollection.add({
      userId: uid,
      friendId: friendId,
      status: 'accepted',
      createdAt: new Date().toISOString()
    })

    await friendCollection.add({
      userId: friendId,
      friendId: uid,
      status: 'accepted',
      createdAt: new Date().toISOString()
    })

    return {
      code: 0,
      message: '添加好友成功'
    }
  } catch (e) {
    console.error('添加好友失败', e)
    return { code: -1, message: '添加好友失败' }
  }
}

/**
 * 通过分享卡片添加好友
 */
async function addFriendByShare(friendCollection, db, uid, event) {
  const { inviteCode } = event

  if (!inviteCode) {
    return { code: -1, message: '缺少邀请码' }
  }

  try {
    // 通过邀请码查找用户
    const userCollection = db.collection('user')
    const inviter = await userCollection.doc(inviteCode).get()

    if (!inviter.data || inviter.data.length === 0) {
      return { code: -1, message: '用户不存在' }
    }

    const friendId = inviter.data[0]._id

    if (friendId === uid) {
      return { code: -1, message: '不能添加自己为好友' }
    }

    // 检查是否已经是好友
    const existing = await friendCollection
      .where({
        userId: uid,
        friendId: friendId
      })
      .get()

    if (existing.data && existing.data.length > 0) {
      return { code: -1, message: '已经是好友了' }
    }

    // 创建双向好友关系
    await friendCollection.add({
      userId: uid,
      friendId: friendId,
      friendName: inviter.data[0].nickName,
      friendAvatar: inviter.data[0].avatarUrl,
      status: 'accepted',
      createdAt: new Date().toISOString()
    })

    const myInfo = await userCollection.doc(uid).get()

    await friendCollection.add({
      userId: friendId,
      friendId: uid,
      friendName: myInfo.data[0].nickName,
      friendAvatar: myInfo.data[0].avatarUrl,
      status: 'accepted',
      createdAt: new Date().toISOString()
    })

    return {
      code: 0,
      message: '添加好友成功'
    }
  } catch (e) {
    console.error('通过分享添加好友失败', e)
    return { code: -1, message: '添加好友失败' }
  }
}

/**
 * 删除好友
 */
async function removeFriend(friendCollection, uid, event) {
  const { friendId } = event

  if (!friendId) {
    return { code: -1, message: '缺少好友ID' }
  }

  try {
    // 删除双向好友关系
    await friendCollection
      .where({ userId: uid, friendId: friendId })
      .remove()

    await friendCollection
      .where({ userId: friendId, friendId: uid })
      .remove()

    return {
      code: 0,
      message: '删除好友成功'
    }
  } catch (e) {
    console.error('删除好友失败', e)
    return { code: -1, message: '删除好友失败' }
  }
}

/**
 * 接受好友请求
 */
async function acceptFriend(friendCollection, uid, event) {
  const { requestId } = event

  if (!requestId) {
    return { code: -1, message: '缺少请求ID' }
  }

  try {
    await friendCollection.doc(requestId).update({
      status: 'accepted'
    })

    return {
      code: 0,
      message: '已接受好友请求'
    }
  } catch (e) {
    console.error('接受好友请求失败', e)
    return { code: -1, message: '操作失败' }
  }
}

/**
 * 拒绝好友请求
 */
async function rejectFriend(friendCollection, uid, event) {
  const { requestId } = event

  if (!requestId) {
    return { code: -1, message: '缺少请求ID' }
  }

  try {
    await friendCollection.doc(requestId).update({
      status: 'rejected'
    })

    return {
      code: 0,
      message: '已拒绝好友请求'
    }
  } catch (e) {
    console.error('拒绝好友请求失败', e)
    return { code: -1, message: '操作失败' }
  }
}
