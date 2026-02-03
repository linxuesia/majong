// pages/index/index.js
const app = getApp()

Page({
  data: {
    devMode: false,
    currentChapter: 1,
    completedChapters: [],
    chapters: [
      {
        id: 1,
        title: '初入江湖',
        desc: '识牌与开局',
        icon: '🍵'
      },
      {
        id: 2,
        title: '行牌修炼',
        desc: '吃碰杠与258',
        icon: '🏮'
      },
      {
        id: 3,
        title: '大胡风云',
        desc: '特殊牌型',
        icon: '📚'
      },
      {
        id: 4,
        title: '海底与扎鸟',
        desc: '特色规则',
        icon: '🎆'
      },
      {
        id: 5,
        title: '实战演练',
        desc: '模拟对局',
        icon: '🏆'
      }
    ]
  },

  onLoad() {
    this.loadProgress()
  },

  onShow() {
    this.loadProgress()
  },

  loadProgress() {
    this.setData({
      devMode: app.globalData.DEV_MODE,
      currentChapter: app.globalData.currentChapter,
      completedChapters: app.globalData.completedChapters
    })
  },

  // 开发模式工具
  onResetProgress() {
    wx.showModal({
      title: '重置进度',
      content: '确定要重置所有游戏进度吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.currentChapter = 1
          app.globalData.completedChapters = []
          app.saveProgress()
          // 清除所有章节的关卡进度
          wx.removeStorageSync('chapter1_currentLevel')
          wx.removeStorageSync('chapter2_currentLevel')
          wx.removeStorageSync('chapter3_currentLevel')
          this.loadProgress()
          wx.showToast({
            title: '进度已重置',
            icon: 'success'
          })
        }
      }
    })
  },

  onUnlockAll() {
    app.globalData.currentChapter = 5
    app.globalData.completedChapters = [1, 2, 3, 4, 5]
    app.saveProgress()
    this.loadProgress()
    wx.showToast({
      title: '已解锁全部章节',
      icon: 'success'
    })
  },

  onClearStorage() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有本地缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }, 1500)
        }
      }
    })
  },

  onChapterTap(e) {
    const chapterId = e.currentTarget.dataset.id
    
    if (chapterId > this.data.currentChapter) {
      wx.showModal({
        title: '提示',
        content: '请先完成前面的章节',
        showCancel: false,
        confirmText: '确定'
      })
      return
    }

    wx.navigateTo({
      url: `/pages/chapter${chapterId}/chapter${chapterId}`
    })
  },

  onSettingsTap() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  },

  onStartTap() {
    const nextChapter = this.data.currentChapter
    wx.navigateTo({
      url: `/pages/chapter${nextChapter}/chapter${nextChapter}`
    })
  },

  onLedgerTap() {
    wx.navigateTo({
      url: '/pages/ledger/index/index'
    })
  },

  // 分享给好友 - 微信小程序API
  onShareAppMessage() {
    // 注意：个人开发者的小程序可能无法获取分享后的回调数据
    // 因此我们在用户点击分享按钮时就执行解锁逻辑
    this.unlockAllChapters()
    
    return {
      title: '雀神养成记：长沙风云篇 - 一起成为雀神！',
      path: '/pages/index/index',
      imageUrl: 'https://images.daojia.com/jz/pic/69c729e5f514f9bfc1c6a25b1f91e6ad.jpg'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    // 注意：朋友圈分享没有success回调，而且个人开发者可能无法获取分享结果
    // 因此我们在用户点击分享按钮时就执行解锁逻辑
    this.unlockAllChapters()
    
    return {
      title: '雀神养成记：长沙风云篇 - 一起成为雀神！',
      query: 'from=timeline',
      imageUrl: 'https://images.daojia.com/jz/pic/69c729e5f514f9bfc1c6a25b1f91e6ad.jpg'
    }
  },
  
  // 解锁全部章节的方法
  unlockAllChapters() {
    // 解锁全部章节
    app.globalData.currentChapter = 5
    app.globalData.completedChapters = [1, 2, 3, 4, 5]
    app.saveProgress()
    this.loadProgress()
    
    // 显示解锁成功提示
    wx.showToast({
      title: '分享成功，已解锁全部章节！',
      icon: 'success'
    })
  }
})
