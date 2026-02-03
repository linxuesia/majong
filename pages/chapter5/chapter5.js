// pages/chapter5/chapter5.js
const app = getApp()

Page({
  data: {
    currentLevel: 1,
    progress: 0,
    score: 0,
    timeLeft: 90,
    levelCompleted: false,
    guideText: '欢迎来到实战演练！让我们测试一下你的麻将技巧！',
    
    questionIndex: 0,
    questionType: '', // 'discard' 或 'win'
    tiles: [], // 当前手牌
    options: [], // 选项
    selectedOption: null, // 选中的选项
    correctAnswer: null, // 正确答案
    explanation: '', // 题目解说
    questions: [], // 所有题目
    gameOver: false,
    showExplanation: false
  },

  onLoad() {
    this.initQuestions()
    this.initLevel()
  },

  initQuestions() {
    // 设计题目配置，包含两种类型的题目，每种3道题
    const questions = [
      {
        "id": 1,
        "type": "discard",
        "tiles": ["三万", "四万", "五万", "六筒", "七筒", "八筒", "二条", "二条", "二条", "五条", "五条", "五条", "一筒"],
        "description": "当前手牌已有三个顺子/刻子，且有一对“五条”符合258做将规则。你应该打哪一张牌来立即听牌？",
        "options": ["二条", "一筒", "五条", "三万"],
        "correct": 1,
        "explanation": "打掉“一筒”后，手牌剩下三个顺子/刻子，且预留了“五条”对子作为将牌。由于5是258之一，满足长沙麻将平胡的必修条件。"
      },
      {
        "id": 2,
        "type": "discard",
        "tiles": ["二万", "二万", "五万", "五万", "八万", "二筒", "二筒", "五筒", "五筒", "八筒", "八筒", "八条", "八条", "三万"],
        "description": "手牌几乎全部由2、5、8组成，正在冲刺“将将胡”大胡。摸入“三万”后，应打哪张牌？",
        "options": ["二万", "三万", "八万", "八条"],
        "correct": 1,
        "explanation": "“将将胡”是长沙麻将的大胡，要求全副牌都是2、5、8。打掉非258的“三万”可以保持大胡听牌状态，胡牌后收益远高于普通小胡。"
      },
      {
        "id": 3,
        "type": "discard",
        "tiles": ["一万", "二万", "三万", "四万", "五万", "六万", "七万", "八万", "九万", "五万", "五万", "六条", "六条"],
        "description": "你想做“清一色”大胡，但目前仍有两条“六条”。为了保留万子清一色的可能，同时不破坏258做将的平胡底线，应打哪张？",
        "options": ["五万", "六条", "九万", "四万"],
        "correct": 1,
        "explanation": "打掉一张“六条”后，剩下一张单张六条。若此时胡六条，可由“五万”做将（258将）达成小胡；若进万子，则可拆掉六条冲刺大胡。"
      },
      {
        "id": 4,
        "type": "win",
        "tiles": ["二筒", "三筒", "四筒", "五条", "六条", "七条", "八万", "八万", "八万", "三万", "三万", "三万", "六万"],
        "description": "手牌已有四个顺子/刻子。最后剩下一张单张“六万”。若想达成普通平胡，根据258规则，你能胡哪些牌？",
        "options": ["六万", "二万、五万、八万", "任何牌", "不能胡"],
        "correct": [1],
        "explanation": "若胡“六万”凑成对子，因6不是258，不符合平胡规则。必须胡2、5或8万，并将原本的“三万”刻子拆出一对做将，才能满足258将的要求。"
      },
      {
        "id": 5,
        "type": "win",
        "tiles": ["一条", "二条", "三条", "四条", "五条", "六条", "七条", "八条", "九条", "一筒", "一筒", "五筒", "五筒", "五筒"],
        "description": "你听“一筒”，此时摸到最后一张牌（海底捞月）正好是“一筒”。请问能否胡牌？",
        "options": ["不能胡（一筒非258）", "可以胡（海底捞月是大胡，无258限制）", "只能胡五筒"],
        "correct": [1],
        "explanation": "长沙麻将中，“海底捞月”属于大胡牌型。大胡可以“乱将”，即不需要258也可以做将，因此一筒作将完全可以胡牌。"
      }
    ]
    
    this.setData({
      questions: questions
    })
  },

  initLevel() {
    const question = this.data.questions[this.data.questionIndex]
    
    this.setData({
      questionType: question.type,
      tiles: question.tiles,
      guideText: question.description,
      options: question.options,
      correctAnswer: question.correct,
      explanation: question.explanation,
      selectedOption: null,
      showExplanation: false,
      progress: Math.floor((this.data.questionIndex / this.data.questions.length) * 100),
      timeLeft: 90,
      gameOver: false
    })
    
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

  onOptionSelect(e) {
    const index = e.currentTarget.dataset.index
    
    this.setData({
      selectedOption: index
    })
  },

  onSubmit() {
    const selectedOption = this.data.selectedOption
    if (selectedOption === null) return
    
    clearInterval(this.timer)
    
    let isCorrect = false
    if (Array.isArray(this.data.correctAnswer)) {
      // 多选类型（目前都是单选，预留）
      isCorrect = this.data.correctAnswer.includes(selectedOption)
    } else {
      // 单选类型
      isCorrect = selectedOption === this.data.correctAnswer
    }
    
    if (isCorrect) {
      const newScore = this.data.score + 20
      this.setData({
        score: newScore,
        levelCompleted: true,
        showExplanation: true
      })
      
      wx.showModal({
        title: '回答正确！',
        content: this.data.explanation,
        showCancel: false,
        success: () => {
          setTimeout(() => {
            this.goToNextQuestion()
          }, 500)
        }
      })
    } else {
      wx.showToast({
        title: '再想想哦！',
        icon: 'none'
      })
      
      this.setData({
        score: Math.max(0, this.data.score - 5),
        showExplanation: true
      })
      
      setTimeout(() => {
        this.setData({
          showExplanation: false,
          selectedOption: null
        })
        this.startTimer()
      }, 2000)
    }
  },

  goToNextQuestion() {
    const nextIndex = this.data.questionIndex + 1
    
    if (nextIndex >= this.data.questions.length) {
      this.completeChapter()
      return
    }
    
    this.setData({
      questionIndex: nextIndex,
      levelCompleted: false,
      selectedOption: null,
      showExplanation: false,
      timeLeft: 90
    })
    
    this.initLevel()
  },

  completeChapter() {
    // 显示庆祝特效
    app.showCelebration()
    
    clearInterval(this.timer)
    this.setData({
      levelCompleted: true,
      progress: 100,
      guideText: '恭喜你！第五章完成了！你已经掌握了麻将的基本技巧！'
    })
    
    setTimeout(() => {
      this.completeChapterFinish()
    }, 1500)
  },

  completeChapterFinish() {
    if (!app.globalData.completedChapters.includes(5)) {
      app.globalData.completedChapters.push(5)
    }
    if (app.globalData.currentChapter === 5) {
      app.globalData.currentChapter = 6
    }
    app.saveProgress()
    
    wx.showModal({
      title: '🎉 章节完成',
      content: '恭喜你完成了所有麻将课程！你已经掌握了麻将的基本技巧和规则！',
      showCancel: false,
      success: () => {
        wx.navigateBack()
      }
    })
  },

  gameOver() {
    clearInterval(this.timer)
    this.setData({
      gameOver: true
    })
    
    wx.showModal({
      title: '时间到！',
      content: '再试一次吧',
      showCancel: false,
      success: () => {
        this.setData({
          timeLeft: 90,
          score: 0,
          gameOver: false,
          questionIndex: 0
        })
        this.initLevel()
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
