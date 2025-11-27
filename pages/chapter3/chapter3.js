// pages/chapter3/chapter3.js
const app = getApp()
const { getTileImage } = require('../../utils/tileMapper')

Page({
  data: {
    currentLevel: 1,
    progress: 0,
    score: 0,
    levelCompleted: false,
    guideText: '欢迎来到大胡的世界！这些特殊牌型可以让你的分数翻倍！',
    
    // 第一关：牌型识别
    displayTiles: [],
    patternOptions: [],
    correctPattern: '',
    currentScenario: 0,
    
    // 第二关：大胡叠加
    finalTiles: [],
    patternTags: [],
    correctTags: [],
    multiplier: 1
  },
  
  // 麻将牌图片映射方法
  getTileImage,

  onLoad(options) {
    const app = getApp()
    
    // 开发模式：支持直接跳转到指定关卡
    if (app.globalData.DEV_MODE && options.level) {
      const level = parseInt(options.level)
      if (level === 3) {
        this.initLevel3()
      } else {
        this.initLevel1()
      }
      return
    }
    
    // 检查是否有保存的关卡进度
    const savedLevel = wx.getStorageSync('chapter3_currentLevel')
    if (savedLevel && savedLevel === 3) {
      this.initLevel3()
    } else {
      this.initLevel1()
    }
  },

  // ========== 第一关：牌型识别 ==========
  initLevel1() { 
    this.generatePattern()
  },

  generatePattern() {
    const patterns = [
      {
        name: '碰碰胡',
        tiles: ['一万', '一万', '一万', '三条', '三条', '三条', '五筒', '五筒', '五筒', '七万', '七万', '七万', '二条', '二条'],
        desc: '全是刻子（三张相同）',
        options: ['碰碰胡', '清一色', '将将胡', '七小对']
      },
      {
        name: '将将胡',
        tiles: ['二万', '二万', '二万', '五万', '五万', '五万', '八万', '八万', '八万', '二条', '二条', '二条', '五条', '五条'],
        desc: '全是258',
        options: ['碰碰胡', '将将胡', '清一色', '缺一色']
      },
      {
        name: '清一色',
        tiles: ['一条', '二条', '三条', '四条', '五条', '六条', '七条', '八条', '九条', '一条', '二条', '三条', '五条', '五条'],
        desc: '只有一种花色',
        options: ['清一色', '碰碰胡', '将将胡', '缺一色']
      },
      {
        name: '七小对',
        tiles: ['一万', '一万', '三万', '三万', '五万', '五万', '七万', '七万', '九万', '九万', '二条', '二条', '五筒', '五筒'],
        desc: '七个对子',
        options: ['七小对', '碰碰胡', '将将胡', '清一色']
      },
      {
        name: '缺一色',
        tiles: ['一万', '二万', '三万', '四条', '五条', '六条', '七条', '八条', '九条', '二筒', '三筒', '四筒', '五万', '五万'],
        desc: '缺少一种花色',
        options: ['缺一色', '清一色', '碰碰胡', '将将胡']
      },
      {
        name: '全求人',
        tiles: ['一万', '二万', '三万', '四条', '五条', '六条', '七筒', '八筒', '九筒', '二万', '二万', '二万', '五条', '五条'],
        desc: '全靠吃碰（单钓）',
        options: ['全求人', '碰碰胡', '清一色', '七小对'],
        hint: '假设前面都是吃碰的，最后单钓胡牌'
      }
    ]

    const pattern = patterns[this.data.currentScenario % patterns.length]
    
    this.setData({
      displayTiles: pattern.tiles,
      patternOptions: pattern.options,
      correctPattern: pattern.name,
      currentPatternDesc: pattern.desc,
      currentPatternHint: pattern.hint || '',
      guideText: `看看这手牌，是什么特殊牌型？`
    })
  },

  onPatternSelect(e) {
    const selected = e.currentTarget.dataset.pattern
    
    if (selected === this.data.correctPattern) {
      const newScore = this.data.score + 20
      const newScenario = this.data.currentScenario + 1
      const isComplete = newScenario >= 5
      
      wx.showModal({
        title: '✓ 回答正确',
        content: `${this.data.correctPattern}：${this.data.currentPatternDesc}`,
        showCancel: false,
        confirmText: isComplete ? '下一关' : '继续',
        success: () => {
          if (isComplete) {
            // 完成第一关，直接进入第三关（跳过第二关）
            this.setData({
              levelCompleted: true,
              progress: 50,
              guideText: '太棒了！你已经认识了各种大胡牌型！'
            })
            this.initLevel3()
          } else {
            this.setData({
              score: newScore,
              currentScenario: newScenario
            })
            this.generatePattern()
          }
        }
      })
    } else {
      wx.showModal({
        title: '✗ 回答错误',
        content: `提示：${this.data.currentPatternDesc}`,
        showCancel: false,
        confirmText: '继续',
        success: () => {
          this.setData({
            score: Math.max(0, this.data.score - 5)
          })
        }
      })
    }
  },

  // ========== 第二关：将将胡挑战 ==========
  initLevel2() {
    // 保存关卡进度
    wx.setStorageSync('chapter3_currentLevel', 2)
    
    // 258牌
    const tiles258 = [
      '二万', '五万', '八万',
      '二条', '五条', '八条',
      '二筒', '五筒', '八筒'
    ]
    
    // 非258牌
    const tilesOther = [
      '一万', '三万', '四万', '六万', '七万', '九万',
      '一条', '三条', '四条', '六条', '七条', '九条',
      '一筒', '三筒', '四筒', '六筒', '七筒', '九筒'
    ]
    
    const tiles = []
    let id = 0
    
    // 确保有至少14张258的牌
    for (let i = 0; i < 14; i++) {
      const tile = tiles258[Math.floor(Math.random() * tiles258.length)]
      tiles.push({
        id: id++,
        text: tile,
        is258: true,
        selected: false
      })
    }
    
    // 添加6张非258的牌
    for (let i = 0; i < 6; i++) {
      const tile = tilesOther[Math.floor(Math.random() * tilesOther.length)]
      tiles.push({
        id: id++,
        text: tile,
        is258: false,
        selected: false
      })
    }
    
    // 打乱顺序
    tiles.sort(() => Math.random() - 0.5)
    
    this.setData({
      currentLevel: 2,
      levelCompleted: false,
      jiangjiangTiles: tiles,
      selectedTiles: [],
      targetCount: 14,
      progress: 33,
      guideText: '将将胡挑战！选出14张258的牌，打出其他牌！'
    })
  },

  onJiangjiangTileTap(e) {
    const id = e.currentTarget.dataset.id
    const tiles = this.data.jiangjiangTiles.map(t => {
      if (t.id === id) {
        return { ...t, selected: !t.selected }
      }
      return t
    })
    
    const selectedCount = tiles.filter(t => t.selected).length
    
    this.setData({
      jiangjiangTiles: tiles,
      selectedTiles: tiles.filter(t => t.selected)
    })
    
    // 如果选够14张，自动检查
    if (selectedCount === this.data.targetCount) {
      setTimeout(() => {
        this.checkJiangjiang()
      }, 300)
    }
  },

  checkJiangjiang() {
    const selected = this.data.jiangjiangTiles.filter(t => t.selected)
    const allCorrect = selected.every(t => t.is258)
    
    if (allCorrect && selected.length === this.data.targetCount) {
      this.setData({
        levelCompleted: true,
        progress: 66,
        guideText: '完美！你成功组成了将将胡！'
      })
      
      wx.showModal({
        title: '✓ 将将胡成功',
        content: '完美！你成功组成了将将胡！',
        showCancel: false,
        confirmText: '下一关',
        success: () => {
          // 完成第二关，进入第三关
          this.initLevel3()
        }
      })
    } else {
      wx.showModal({
        title: '✗ 选择错误',
        content: '有些牌不是258哦，请重新选择',
        showCancel: false,
        confirmText: '重选',
        success: () => {
          this.setData({
            jiangjiangTiles: this.data.jiangjiangTiles.map(t => ({ ...t, selected: false })),
            selectedTiles: []
          })
        }
      })
    }
  },

  // ========== 第二关：大胡叠加 ==========
  initLevel3() {
    // 保存关卡进度
    wx.setStorageSync('chapter3_currentLevel', 3)
    
    const scenarios = [
      {
        tiles: ['一条', '一条', '一条', '二条', '二条', '二条', '三条', '三条', '三条', '四条', '四条', '四条', '五条', '五条'],
        correctTags: ['清一色', '碰碰胡'],
        multiplier: 12
      },
      {
        tiles: ['二万', '二万', '二万', '五万', '五万', '五万', '八万', '八万', '八万', '二条', '二条', '二条', '五条', '五条'],
        correctTags: ['将将胡', '碰碰胡'],
        multiplier: 12
      },
      {
        tiles: ['二筒', '二筒', '五筒', '五筒', '八筒', '八筒', '二万', '二万', '五万', '五万', '八万', '八万', '五条', '五条'],
        correctTags: ['将将胡', '七小对'],
        multiplier: 12
      }
    ]
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    
    const allTags = [
      { id: 1, name: '碰碰胡', selected: false },
      { id: 2, name: '将将胡', selected: false },
      { id: 3, name: '清一色', selected: false },
      { id: 4, name: '七小对', selected: false },
      { id: 5, name: '缺一色', selected: false },
      { id: 6, name: '全求人', selected: false }
    ]
    
    this.setData({
      currentLevel: 3,
      levelCompleted: false,
      finalTiles: scenario.tiles,
      patternTags: allTags,
      correctTags: scenario.correctTags,
      multiplier: 1,
      progress: 50,
      guideText: '这手牌有多个大胡！选出所有符合的牌型标签！'
    })
  },

  onTagTap(e) {
    const id = e.currentTarget.dataset.id
    const tags = this.data.patternTags.map(t => {
      if (t.id === id) {
        return { ...t, selected: !t.selected }
      }
      return t
    })
    
    this.setData({
      patternTags: tags
    })
  },

  onCheckTags() {
    const selectedTags = this.data.patternTags.filter(t => t.selected).map(t => t.name)
    
    if (selectedTags.length === 0) {
      wx.showModal({
        title: '提示',
        content: '请至少选择一个牌型标签',
        showCancel: false,
        confirmText: '确定'
      })
      return
    }
    
    // 检查是否完全匹配
    const correctSet = new Set(this.data.correctTags)
    const selectedSet = new Set(selectedTags)
    
    const allCorrect = selectedTags.every(t => correctSet.has(t)) && 
                       this.data.correctTags.every(t => selectedSet.has(t))
    
    if (allCorrect) {
      this.setData({
        levelCompleted: true,
        progress: 100,
        multiplier: this.data.multiplier * 6,
        guideText: `完美！${this.data.correctTags.join('+')}，超级加倍！`
      })
      
      // 显示爆炸特效
      wx.showModal({
        title: '🎉 大胡叠加',
        content: `${this.data.correctTags.join('+')}！\n\n倍数：×${this.data.multiplier * 6}`,
        showCancel: false,
        confirmText: '完成章节',
        success: () => {
          // 完成第三关，完成整个章节
          this.completeChapter()
        }
      })
    } else {
      const missing = this.data.correctTags.filter(t => !selectedSet.has(t))
      const extra = selectedTags.filter(t => !correctSet.has(t))
      
      let hint = ''
      if (missing.length > 0) {
        hint = `还缺少：${missing.join('、')}`
      }
      if (extra.length > 0) {
        hint += (hint ? '\n' : '') + `多选了：${extra.join('、')}`
      }
      
      wx.showModal({
        title: '✗ 回答错误',
        content: hint || '再仔细看看这手牌',
        showCancel: false,
        confirmText: '重选'
      })
    }
  },

  // ========== 通用方法 ==========
  onNextTap() {
    if (this.data.currentLevel === 1) {
      this.initLevel3()
    } else {
      this.completeChapter()
    }
  },

  completeChapter() {
    // 更新全局进度
    if (!app.globalData.completedChapters.includes(3)) {
      app.globalData.completedChapters.push(3)
    }
    if (app.globalData.currentChapter === 3) {
      app.globalData.currentChapter = 4
    }
    app.saveProgress()
    
    // 清除章节内的关卡进度
    wx.removeStorageSync('chapter3_currentLevel')
    
    wx.showModal({
      title: '🎉 章节完成',
      content: '你已经掌握了所有大胡牌型！继续学习特色规则吧！',
      showCancel: false,
      success: () => {
        wx.navigateBack()
      }
    })
  },

  onBackTap() {
    wx.navigateBack()
  }
})
