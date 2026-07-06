'use strict'

const uniID = require('uni-id-common')

exports.main = async (event, context) => {
  const uniIDInstance = uniID.createInstance({ context })

  switch (event.action) {
    case 'login':
      return await login(uniIDInstance, event, context)
    case 'updateUserInfo':
      return await updateUserInfo(uniIDInstance, event, context)
    case 'getUserInfo':
      return await getUserInfo(uniIDInstance, event, context)
    default:
      return await login(uniIDInstance, event, context)
  }
}

/**
 * 微信小程序登录
 */
async function login(uniIDInstance, event, context) {
  const { code } = event

  if (!code) {
    return { code: -1, message: '缺少登录凭证' }
  }

  try {
    // 调用微信接口获取 openid
    const wxCloud = uniCloud.importObject('wx-config')
    const wxConfig = await wxCloud.getConfig()

    const wxRes = await uniCloud.httpclient.request(
      'https://api.weixin.qq.com/sns/jscode2session',
      {
        method: 'GET',
        data: {
          appid: wxConfig.appId,
          secret: wxConfig.appSecret,
          js_code: code,
          grant_type: 'authorization_code'
        },
        dataType: 'json'
      }
    )

    const { openid, session_key, unionid } = wxRes.data

    if (!openid) {
      return { code: -1, message: '获取 openid 失败' }
    }

    // 查找或创建用户
    const db = uniCloud.database()
    const userCollection = db.collection('user')

    let user = await userCollection.where({ openId: openid }).get()

    let userId
    if (user.data && user.data.length > 0) {
      // 已有用户，更新登录时间
      userId = user.data[0]._id
      await userCollection.doc(userId).update({
        lastLoginAt: new Date().toISOString()
      })
      user = user.data[0]
    } else {
      // 创建新用户
      const newUser = {
        openId: openid,
        unionId: unionid || '',
        nickName: '微信用户',
        avatarUrl: '',
        gender: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
      const addRes = await userCollection.add(newUser)
      userId = addRes.id
      user = { _id: userId, ...newUser }
    }

    // 生成 token
    const tokenInfo = await uniIDInstance.createToken({
      uid: userId
    })

    return {
      code: 0,
      message: '登录成功',
      data: {
        token: tokenInfo.token,
        userInfo: user
      }
    }
  } catch (e) {
    console.error('登录失败', e)
    return { code: -1, message: '登录失败：' + (e.message || '未知错误') }
  }
}

/**
 * 更新用户信息
 */
async function updateUserInfo(uniIDInstance, event, context) {
  const { token, nickName, avatarUrl } = event

  if (!token) {
    return { code: -1, message: '未登录' }
  }

  try {
    const payload = await uniIDInstance.checkToken(token)
    if (payload.errCode) {
      return { code: -1, message: 'token 无效' }
    }

    const uid = payload.uid
    const db = uniCloud.database()
    const userCollection = db.collection('user')

    const updateData = {
      nickName: nickName || '',
      avatarUrl: avatarUrl || '',
      updatedAt: new Date().toISOString()
    }

    await userCollection.doc(uid).update(updateData)

    const updatedUser = await userCollection.doc(uid).get()

    return {
      code: 0,
      message: '更新成功',
      data: updatedUser.data[0]
    }
  } catch (e) {
    console.error('更新用户信息失败', e)
    return { code: -1, message: '更新失败' }
  }
}

/**
 * 获取用户信息
 */
async function getUserInfo(uniIDInstance, event, context) {
  const { token } = event

  if (!token) {
    return { code: -1, message: '未登录' }
  }

  try {
    const payload = await uniIDInstance.checkToken(token)
    if (payload.errCode) {
      return { code: -1, message: 'token 无效' }
    }

    const uid = payload.uid
    const db = uniCloud.database()
    const userCollection = db.collection('user')
    const user = await userCollection.doc(uid).get()

    return {
      code: 0,
      message: '获取成功',
      data: user.data[0]
    }
  } catch (e) {
    console.error('获取用户信息失败', e)
    return { code: -1, message: '获取失败' }
  }
}
