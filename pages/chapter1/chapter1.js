// pages/chapter1/chapter1.js
const app = getApp()
const { getTileImage } = require('../../utils/tileMapper')

Page({
  data: {
    currentLevel: 1,
    progress: 0,
    score: 0,
    timeLeft: 30,
    levelCompleted: false,
    guideText: '欢迎来到长沙麻将的世界！咱们长沙人不打字牌，快把它们找出来！',
    
    // 第一关：找茬游戏
    tiles: [],
    
    // 第二关：起手胡
    handTiles: [],
    options: []
  },
  
  // 麻将牌图片映射方法
  getTileImage,
  

  onLoad() {
    // 检查是否有保存的关卡进度
    const savedLevel = wx.getStorageSync('chapter1_currentLevel')
    if (savedLevel && savedLevel === 2) {
      this.initLevel2()
    } else {
      this.initLevel1()
    }
  },

  initLevel1() {
    // 生成混合的牌
    const validTiles = ['一万', '二万', '三万', '一条', '二条', '三条', '一筒', '二筒', '三筒']
    const invalidTiles = ['东', '南', '西', '北', '中', '发', '白', '春', '梅']
    
    const tiles = []
    let id = 0
    
    // 随机选择一些有效牌和无效牌
    for (let i = 0; i < 6; i++) {
      const tileText = validTiles[Math.floor(Math.random() * validTiles.length)]
      tiles.push({
        id: id++,
        text: tileText,
        image: getTileImage(tileText),
        isValid: true,
        removed: false
      })
    }
    
    for (let i = 0; i < 6; i++) {
      const tileText = invalidTiles[Math.floor(Math.random() * invalidTiles.length)]
      tiles.push({
        id: id++,
        text: tileText,
        image: getTileImage(tileText),
        isValid: false,
        removed: false
      })
    }
    
    // 打乱顺序
    tiles.sort(() => Math.random() - 0.5)
    
    this.setData({ tiles })
    this.startTimer()
  },

  startTimer() {
    this.timer = setInterval(() => {
      if (this.data.timeLeft > 0) {
        this.setData({
          timeLeft: this.data.timeLeft - 1
        })
      } else {
        this.gameOver()
      }
    }, 1000)
  },

  onTileTap(e) {
    const id = e.currentTarget.dataset.id
    const tiles = this.data.tiles
    const tile = tiles.find(t => t.id === id)
    
    if (tile.removed) return
    
    if (!tile.isValid) {
      // 正确：移除无效牌
      tile.removed = true
      const newScore = this.data.score + 10
      
      this.setData({
        tiles,
        score: newScore
      })
      
      // 检查是否完成
      const allInvalidRemoved = tiles.filter(t => !t.isValid).every(t => t.removed)
      if (allInvalidRemoved) {
        this.completeLevel1()
      }
    } else {
      // 错误：点击了有效牌
      wx.showToast({
        title: '这是有效牌哦！',
        icon: 'none'
      })
      this.setData({
        score: Math.max(0, this.data.score - 5)
      })
    }
  },

  completeLevel1() {
    clearInterval(this.timer)
    this.setData({
      levelCompleted: true,
      progress: 50,
      guideText: '干得漂亮！现在来学习起手胡吧！'
    })
    
    wx.showToast({
      title: '第一关完成！',
      icon: 'success'
    })
  },

  gameOver() {
    clearInterval(this.timer)
    wx.showModal({
      title: '时间到！',
      content: '再试一次吧',
      showCancel: false,
      success: () => {
        this.setData({
          timeLeft: 30,
          score: 0
        })
        this.initLevel1()
      }
    })
  },

  onNextTap() {
    if (this.data.currentLevel === 1) {
      this.initLevel2()
    } else {
      this.completeChapter()
    }
  },

  initLevel2() {
    // 保存关卡进度
    wx.setStorageSync('chapter1_currentLevel', 2)
    
    // 生成一个起手胡的牌型
    const scenarios = [
      {
        tiles: ['二万', '二万', '二万', '二万', '五条', '五条', '五条', '五条', '八筒', '八筒', '八筒', '八筒', '五万', '五万'],
        answer: '板板胡',
        options: ['板板胡', '四喜', '六六顺', '普通牌']
      },
      {
        tiles: ['一万', '一万', '一万', '一万', '三条', '三条', '三条', '五筒', '五筒', '五筒', '七万', '七万', '七万', '二条'],
        answer: '四喜',
        options: ['板板胡', '四喜', '六六顺', '普通牌']
      }
    ]
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    
    this.setData({
      currentLevel: 2,
      levelCompleted: false,
      handTiles: scenario.tiles,
      options: scenario.options,
      correctAnswer: scenario.answer,
      guideText: '看看这手牌，你能认出来吗？',
      progress: 50
    })
  },

  onOptionTap(e) {
    const answer = e.currentTarget.dataset.answer
    
    if (answer === this.data.correctAnswer) {
      this.setData({
        levelCompleted: true,
        progress: 100,
        guideText: '恭喜你！第一章完成了！'
      })
      
      wx.showToast({
        title: '回答正确！',
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: '再想想哦',
        icon: 'none'
      })
    }
  },

  completeChapter() {
    // 更新全局进度
    if (!app.globalData.completedChapters.includes(1)) {
      app.globalData.completedChapters.push(1)
    }
    if (app.globalData.currentChapter === 1) {
      app.globalData.currentChapter = 2
    }
    app.saveProgress()
    
    // 清除章节内的关卡进度
    wx.removeStorageSync('chapter1_currentLevel')
    
    wx.showModal({
      title: '🎉 章节完成',
      content: '你已经掌握了基础知识，继续加油！',
      showCancel: false,
      success: () => {
        wx.navigateBack()
      }
    })
  },

  onBackTap() {
    wx.navigateBack()
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
})
