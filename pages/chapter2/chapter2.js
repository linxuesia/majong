// pages/chapter2/chapter2.js
const app = getApp()

Page({
  data: {
    currentLevel: 1,
    progress: 0,
    score: 0,
    combo: 0,
    levelCompleted: false,
    guideText: '学习吃碰杠的优先级！记住：碰>吃，而且只能吃上家的牌哦！',
    
    // 第一关：抢答反应堆
    handTiles: [],
    discardTile: '',
    discardFrom: '',
    showActions: false,
    animating: false,
    correctAction: '',
    currentScenarioIndex: 0,
    
    // 第二关：寻找将军
    tingpaiTiles: [],
    candidateTiles: [],
    level2ScenarioIndex: 0,
    
    // 第三关：258将强化训练
    quizTiles: [],
    quizType: '',
    quizIndex: 1,
    quizCorrect: 0,
    quizAnswer: false
  },

  onLoad(options) {
    // 检查是否有保存的关卡进度
    const savedLevel = wx.getStorageSync('chapter2_currentLevel')
    if (savedLevel && savedLevel > 1) {
      if (savedLevel === 2) {
        this.initLevel2()
      } else if (savedLevel === 3) {
        this.initLevel3()
      } else {
        this.initLevel1()
      }
    } else {
      this.initLevel1()
    }
  },

  // ========== 第一关：抢答反应堆 ==========
  initLevel1() {
    this.setData({
      currentScenarioIndex: 0
    })
    this.generateScenario()
  },

  generateScenario() {
    const scenarios = [
      // 场景1：可以碰
      {
        hand: ['二万', '二万', '五条', '六条', '七条', '八筒', '八筒', '八筒'],
        discard: '二万',
        from: '下家',
        correct: '碰',
        reason: '你有一对二万，可以碰！'
      },
      // 场景2：可以吃（上家）
      {
        hand: ['一万', '二万', '五条', '五条', '六筒', '七筒', '八筒', '九筒'],
        discard: '三万',
        from: '上家',
        correct: '吃',
        reason: '上家打出三万，你有一二万，可以吃！'
      },
      // 场景3：不能吃（下家）
      {
        hand: ['一万', '二万', '五条', '五条', '六筒', '七筒', '八筒', '九筒'],
        discard: '三万',
        from: '下家',
        correct: '过',
        reason: '只能吃上家的牌，下家的不能吃！'
      },
      // 场景4：碰优先于吃
      {
        hand: ['三万', '三万', '四万', '五万', '五条', '六条', '七条', '八筒'],
        discard: '三万',
        from: '上家',
        correct: '碰',
        reason: '虽然可以吃，但碰优先于吃！'
      },
      // 场景5：既不能吃也不能碰
      {
        hand: ['一万', '三万', '五条', '七条', '九条', '二筒', '四筒', '六筒'],
        discard: '八万',
        from: '上家',
        correct: '过',
        reason: '这张牌对你没用，过！'
      }
    ]

    let currentIndex = this.data.currentScenarioIndex
    const scenario = scenarios[currentIndex]
    
    // 递增索引，循环使用
    currentIndex = (currentIndex + 1) % scenarios.length
    
    this.setData({
      handTiles: scenario.hand,
      discardTile: scenario.discard,
      discardFrom: scenario.from,
      correctAction: scenario.correct,
      currentReason: scenario.reason,
      showActions: false,
      animating: true,
      currentScenarioIndex: currentIndex
    })

    // 动画后显示按钮
    setTimeout(() => {
      this.setData({
        animating: false,
        showActions: true
      })
    }, 800)
  },

  onActionTap(e) {
    const action = e.currentTarget.dataset.action
    
    if (action === this.data.correctAction) {
      // 正确
      const currentScore = this.data.score
      const newScore = currentScore + 10
      const newCombo = this.data.combo + 1
      const isComplete = newScore >= 50
      
      this.setData({
        score: newScore,
        combo: newCombo,
        showActions: false
      })
      
      if (isComplete) {
        wx.showModal({
          title: '🎉 第一关完成',
          content: this.data.currentReason + `\n\n最终得分：${newScore}分\n\n准备进入第二关！`,
          showCancel: false,
          confirmText: '下一关',
          success: (res) => {
            if (res.confirm) {
              this.setData({
                levelCompleted: true,
                progress: 33,
                guideText: '干得漂亮！现在来学习258将的规则！'
              })
              this.initLevel2()
            }
          }
        })
      } else {
        // 未达到50分，继续答题
        wx.showModal({
          title: '✓ 回答正确',
          content: this.data.currentReason + `\n\n当前得分：${newScore}分`,
          showCancel: false,
          confirmText: '继续',
          success: (res) => {
            if (res.confirm) {
              this.generateScenario()
            }
          }
        })
      }
    } else {
      // 错误
      const newScore = Math.max(0, this.data.score - 5)
      
      this.setData({
        combo: 0,
        score: newScore
      })
      
      wx.showModal({
        title: '✗ 回答错误',
        content: this.data.currentReason + `\n\n当前得分：${newScore}分`,
        showCancel: false,
        confirmText: '继续',
        success: (res) => {
          if (res.confirm) {
            this.generateScenario()
          }
        }
      })
    }
  },

  // ========== 第二关：寻找将军 ==========
  initLevel2() {
    // 保存关卡进度
    wx.setStorageSync('chapter2_currentLevel', 2)
    
    const scenarios = [
      {
        tiles: ['一万', '二万', '三万', '四条', '五条', '六条', '七筒', '八筒', '九筒', '一万', '二万', '三万'],
        candidates: [
          { id: 1, text: '一万', isValid: false },
          { id: 2, text: '二万', isValid: true },
          { id: 3, text: '三万', isValid: false },
          { id: 4, text: '五条', isValid: true },
          { id: 5, text: '六条', isValid: false },
          { id: 6, text: '八筒', isValid: true }
        ]
      },
      {
        tiles: ['一条', '一条', '一条', '三万', '四万', '五万', '六筒', '七筒', '八筒', '九条', '九条', '九条'],
        candidates: [
          { id: 1, text: '一条', isValid: false },
          { id: 2, text: '二条', isValid: true },
          { id: 3, text: '四万', isValid: false },
          { id: 4, text: '五万', isValid: true },
          { id: 5, text: '七筒', isValid: false },
          { id: 6, text: '八筒', isValid: true }
        ]
      }
    ]

    // 获取当前索引，默认从0开始
    const index = this.data.level2ScenarioIndex
    const scenario = scenarios[index]
    
    // 递增索引，循环使用
    const newIndex = (index + 1) % scenarios.length
    
    this.setData({
      currentLevel: 2,
      levelCompleted: false,
      tingpaiTiles: scenario.tiles,
      candidateTiles: scenario.candidates.map(c => ({ ...c, selected: false })),
      progress: 33,
      guideText: '小胡必须用2、5、8作将！选择正确的将牌吧！',
      level2ScenarioIndex: newIndex
    })
  },

  onCandidateTap(e) {
    const id = e.currentTarget.dataset.id
    const candidates = this.data.candidateTiles.map(c => {
      if (c.id === id) {
        return { ...c, selected: !c.selected }
      }
      return { ...c, selected: false }
    })
    
    this.setData({
      candidateTiles: candidates
    })
  },

  onCheckAnswer() {
    const selected = this.data.candidateTiles.find(c => c.selected)
    
    if (!selected) {
      wx.showToast({
        title: '请先选择一张牌',
        icon: 'none'
      })
      return
    }
    
    if (selected.isValid) {
      wx.showModal({
        title: '✓ 回答正确',
        content: selected.text + '是258，可以作小胡的将！',
        showCancel: false,
        confirmText: '下一关',
        success: () => {
          // 先设置完成状态，再进入下一关
          this.setData({
            levelCompleted: true,
            progress: 66,
            guideText: '完全正确！' + selected.text + '是258，可以作将！'
          })
          // 直接进入下一关
          this.initLevel3()
        }
      })
    } else {
      wx.showModal({
        title: '✗ 回答错误',
        content: selected.text + '不是258，不能作小胡的将！小胡必须用2、5、8作将。',
        showCancel: false,
        confirmText: '重新选择',
        success: () => {
          this.setData({
            candidateTiles: this.data.candidateTiles.map(c => ({ ...c, selected: false }))
          })
        }
      })
    }
  },

  // ========== 第三关：258将强化训练 ==========
  initLevel3() {
    // 保存关卡进度
    wx.setStorageSync('chapter2_currentLevel', 3)
    
    this.setData({
      currentLevel: 3,
      levelCompleted: false,
      progress: 66,
      quizIndex: 1,
      quizCorrect: 0,
      guideText: '快速判断能否胡小牌！记住258将的规则！'
    })
    
    this.generateQuiz()
  },

  generateQuiz() {
    // 只包含小胡牌型
    const quizzes = [
      {
        tiles: ['一万', '二万', '三万', '四条', '五条', '六条', '七筒', '八筒', '九筒', '二万', '二万', '二万', '五条', '五条'],
        answer: true,
        reason: '有五条作将（5是258），可以胡小牌'
      },
      {
        tiles: ['一万', '二万', '三万', '四条', '五条', '六条', '七筒', '八筒', '九筒', '三万', '三万', '三万', '六条', '六条'],
        answer: false,
        reason: '六条不是258，不能作小胡的将'
      },
      {
        tiles: ['一万', '二万', '三万', '一条', '二条', '三条', '四筒', '五筒', '六筒', '七万', '八万', '九万', '二条', '二条'],
        answer: true,
        reason: '有二条作将（2是258），可以胡小牌'
      }
    ]

    const quizIndex = this.data.quizIndex - 1
    
    // 防止数组越界
    if (quizIndex >= 0 && quizIndex < quizzes.length) {
      const quiz = quizzes[quizIndex]
      this.setData({
        quizTiles: quiz.tiles,
        quizAnswer: quiz.answer,
        currentQuizReason: quiz.reason
      })
    }
  },

  onQuizAnswer(e) {
    const answer = e.currentTarget.dataset.answer === 'yes'
    const currentIndex = this.data.quizIndex
    
    if (answer === this.data.quizAnswer) {
      const newCorrect = this.data.quizCorrect + 1
      const isLastQuestion = currentIndex >= 3
      
      wx.showModal({
        title: '✓ 回答正确',
        content: this.data.currentQuizReason,
        showCancel: false,
        confirmText: isLastQuestion ? '完成章节' : '下一题',
        success: () => {
          if (isLastQuestion) {
            const accuracy = (newCorrect / 3 * 100).toFixed(0)
            this.setData({
              levelCompleted: true,
              progress: 100,
              guideText: `太棒了！正确率${accuracy}%，你已经掌握了258将的规则！`
            })
            this.completeChapter()
          } else {
            this.setData({
              quizCorrect: newCorrect,
              quizIndex: currentIndex + 1
            })
            this.generateQuiz()
          }
        }
      })
    } else {
      const isLastQuestion = currentIndex >= 3
      
      wx.showModal({
        title: '✗ 回答错误',
        content: this.data.currentQuizReason,
        showCancel: false,
        confirmText: isLastQuestion ? '完成章节' : '下一题',
        success: () => {
          if (isLastQuestion) {
            const accuracy = (this.data.quizCorrect / 3 * 100).toFixed(0)
            this.setData({
              levelCompleted: true,
              progress: 100,
              guideText: `正确率${accuracy}%，继续加油！`
            })
            this.completeChapter()
          } else {
            this.setData({
              quizIndex: currentIndex + 1
            })
            this.generateQuiz()
          }
        }
      })
    }
  },

  // ========== 通用方法 ==========
  onNextTap() {
    if (this.data.currentLevel === 1) {
      this.initLevel2()
    } else if (this.data.currentLevel === 2) {
      this.initLevel3()
    } else {
      this.completeChapter()
    }
  },

  completeChapter() {
    // 更新全局进度
    if (!app.globalData.completedChapters.includes(2)) {
      app.globalData.completedChapters.push(2)
    }
    if (app.globalData.currentChapter === 2) {
      app.globalData.currentChapter = 3
    }
    app.saveProgress()
    
    // 清除章节内的关卡进度
    wx.removeStorageSync('chapter2_currentLevel')
    
    wx.showModal({
      title: '🎉 章节完成',
      content: '你已经掌握了吃碰杠和258将的规则！继续前进吧！',
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
    // 页面卸载时不清除进度，保留给下次进入
  }
})
