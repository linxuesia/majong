// app.js
App({
  globalData: {
    // 开发模式开关（开发时设为true，发布时设为false）
    DEV_MODE: false,
    
    // 游戏进度
    currentChapter: 1,
    completedChapters: [],
    
    // 规则配置（可自定义）
    gameRules: {
      birdCount: 1,        // 扎鸟数量：1或2
      bankerDouble: true,  // 庄家是否加倍
      baseScore: 20,       // 底分
      allowSmallHu: true   // 是否允许小胡
    },
    
    // 玩家数据
    playerData: {
      coins: 0,
      level: 1,
      achievements: []
    }
  },

  onLaunch() {
    // 开发模式：解锁所有章节
    if (this.globalData.DEV_MODE) {
      this.globalData.currentChapter = 5
      this.globalData.completedChapters = [1, 2, 3, 4, 5]
    } else {
      // 加载本地存储的游戏进度
      const savedProgress = wx.getStorageSync('gameProgress')
      if (savedProgress) {
        this.globalData.currentChapter = savedProgress.currentChapter || 1
        this.globalData.completedChapters = savedProgress.completedChapters || []
        this.globalData.playerData = savedProgress.playerData || this.globalData.playerData
      }
    }
    
    // 加载自定义规则
    const savedRules = wx.getStorageSync('gameRules')
    if (savedRules) {
      this.globalData.gameRules = savedRules
    }
  },

  // 保存游戏进度
  saveProgress() {
    wx.setStorageSync('gameProgress', {
      currentChapter: this.globalData.currentChapter,
      completedChapters: this.globalData.completedChapters,
      playerData: this.globalData.playerData
    })
  },

  // 保存规则配置
  saveRules() {
    wx.setStorageSync('gameRules', this.globalData.gameRules)
  },

  // 显示庆祝特效
  showCelebration() {
    // 创建庆祝容器
    const celebrationContainer = wx.createSelectorQuery().select('.celebration-container')
    celebrationContainer.exec((res) => {
      if (!res[0]) {
        // 如果容器不存在，创建一个
        const page = getCurrentPages()[getCurrentPages().length - 1]
        const pageElement = page.selectComponent('#page-container') || page
        
        // 在页面根元素添加庆祝容器
        const container = wx.createSelectorQuery().select('page')
        container.exec((pageRes) => {
          if (pageRes[0]) {
            // 使用原生JS创建DOM元素（在小程序中需要通过setData实现）
            // 由于小程序的限制，我们使用另一种方式实现特效
            this.createCelebrationAnimation()
          }
        })
      }
    })
  },

  // 创建庆祝动画
  createCelebrationAnimation() {
    // 在小程序中，我们使用wx.createAnimation来实现动画效果
    // 同时结合showToast和showModal的动画效果
    
    // 连续显示多个庆祝图标
    const icons = ['🎉', '🎊', '🎁', '✨', '🏆']
    icons.forEach((icon, index) => {
      setTimeout(() => {
        wx.showToast({
          title: icon,
          icon: 'none',
          duration: 800,
          mask: false
        })
      }, index * 200)
    })
    
    // 添加震动效果
    if (wx.vibrateLong) {
      wx.vibrateLong()
    }
  }
})
