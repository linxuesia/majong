// pages/chapter1/chapter1.js
const app = getApp()

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
    options: [],
    correctAnswer: '',
    currentScenarioIndex: 0,
    totalScenarios: 0
  },
  

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
    const invalidTiles = ['东', '南', '西', '北', '中', '发', '白']
    
    const tiles = []
    let id = 0
    
    // 随机选择一些有效牌和无效牌
    for (let i = 0; i < 8; i++) {
      const tileText = validTiles[Math.floor(Math.random() * validTiles.length)]
      tiles.push({
        id: id++,
        text: tileText,
        isValid: true,
        removed: false
      })
    }
    
    for (let i = 0; i < 4; i++) {
      const tileText = invalidTiles[Math.floor(Math.random() * invalidTiles.length)]
      tiles.push({
        id: id++,
        text: tileText,
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
    
    // 延迟1.5秒后自动进入第二关
    setTimeout(() => {
      this.initLevel2()
    }, 1000)
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
        tiles: ['一万', '一万', '一万', '一万', '二条', '五条', '七条', '四条', '三筒', '八筒', '三筒', '三筒', '七筒', '一条'],
        answer: '四喜',
        options: ['板板胡', '四喜', '六六顺', '普通牌'],
        definition: '四喜：起手就有4张相同的牌（即一个杠牌），是长沙麻将中的一种起手胡牌型。' + 
                   '这种牌型非常少见，也非常吉利，寓意着"四季发财"。'
      },
      {
        tiles: ['五万', '五万', '五万', '六万', '六万', '六万', '八条', '九条', '九筒', '九筒', '四条', '三筒', '八筒', '一条'],
        answer: '六六顺',
        options: ['板板胡', '四喜', '六六顺', '普通牌'],
        definition: '六六顺：起手就有2个刻子（即2组3张相同的牌），是长沙麻将中的一种起手胡牌型。' + 
                   '这种牌型寓意着"六六大顺"，是一种非常好的起手。'
      },
      {
        tiles: ['一万', '二万', '三万', '四万', '九万', '六万', '七条', '六条', '九条', '一筒', '二筒', '三筒', '四筒', '七筒'],
        answer: '板板胡',
        options: ['板板胡', '四喜', '六六顺', '普通牌'],
        definition: '板板胡：起手没有258将牌（即没有二、五、八万，二、五、八条，二、五、八筒），' + 
                   '是长沙麻将中的一种起手胡牌型。这种牌型也被称为"缺将胡"。'
      }
    ]
    
    const currentScenarioIndex = 0
    const scenario = scenarios[currentScenarioIndex]
    
    this.setData({
      currentLevel: 2,
      levelCompleted: false,
      handTiles: scenario.tiles,
      options: scenario.options,
      correctAnswer: scenario.answer,
      guideText: '看看这手牌，你能认出来吗？',
      progress: 50,
      currentScenarioIndex: currentScenarioIndex,
      totalScenarios: scenarios.length,
      scenarios: scenarios
    })
  },

  onOptionTap(e) {
    const answer = e.currentTarget.dataset.answer
    
    if (answer === this.data.correctAnswer) {
      const nextScenarioIndex = this.data.currentScenarioIndex + 1
      const currentScenario = this.data.scenarios[this.data.currentScenarioIndex]
      
      // 显示详细定义
      wx.showModal({
        title: '🎉 回答正确！',
        content: currentScenario.definition,
        showCancel: false,
        confirmText: '继续',
        success: () => {
          // 检查是否还有下一道题
          if (nextScenarioIndex < this.data.totalScenarios) {
            // 显示下一道题
            const scenario = this.data.scenarios[nextScenarioIndex]
            
            // 计算当前进度
            const progress = 50 + Math.round((nextScenarioIndex + 1) / this.data.totalScenarios * 50)
            
            this.setData({
              levelCompleted: false,
              handTiles: scenario.tiles,
              options: scenario.options,
              correctAnswer: scenario.answer,
              guideText: '继续看看下一手牌！',
              progress: progress,
              currentScenarioIndex: nextScenarioIndex
            })
          } else {
            // 所有题目完成，完成章节
            this.setData({
              levelCompleted: true,
              progress: 100,
              guideText: '恭喜你！第一章完成了！'
            })
            
            // 延迟1.5秒后自动完成章节
            setTimeout(() => {
              this.completeChapter()
            }, 1500)
          }
        }
      })
    } else {
      wx.showToast({
        title: '再想想哦',
        icon: 'none'
      })
    }
  },

  completeChapter() {
    // 显示庆祝特效
    app.showCelebration()
    
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
