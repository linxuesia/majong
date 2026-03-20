const app = getApp()

Page({
  data: {
    currentLevel: 1,
    progress: 0,
    score: 0,
    timeLeft: 120,
    levelCompleted: false,
    guideText: '清一色是长沙麻将的大胡！来挑战一下，看看你能否一眼看出胡哪几张牌？',
    
    questionIndex: 0,
    suit: '', // 当前题目花色
    tiles: [], // 13张手牌
    options: [], // 1-9 选项
    selectedOptions: [], // 用户选中的多个选项
    correctAnswers: [], // 正确的胡牌张数
    explanation: '',
    questions: [],
    gameOver: false,
    showExplanation: false
  },

  onLoad() {
    this.initQuestions()
    this.initLevel()
  },

  initQuestions() {
    const questions = [
      {
        id: 1,
        suit: '万',
        tiles: ['一万', '一万', '一万', '二万', '三万', '四万', '五万', '六万', '七万', '八万', '九万', '九万', '九万'],
        correct: [2, 5, 8],
        explanation: "这是一副标准的‘一四七/二五八/三六九’听牌结构。中间二至八万形成了三组顺子预备，听二、五、八万。"
      },
      {
        id: 2,
        suit: '条',
        tiles: ['二条', '二条', '三条', '三条', '四条', '四条', '五条', '五条', '六条', '六条', '七条', '七条', '八条'],
        correct: [2, 5, 8],
        explanation: "由于手牌全是两两一对（七对预备），当前听二条、五条、八条即可凑成将牌胡牌。"
      },
      {
        id: 3,
        suit: '筒',
        tiles: ['一筒', '一筒', '一筒', '二筒', '三筒', '四筒', '五筒', '六筒', '七筒', '八筒', '九筒', '九筒', '九筒'],
        correct: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        explanation: "恭喜！你遇到了传说中的‘九莲宝灯’！在清一色结构下，1112345678999 这种牌型听该花色的所有牌（1-9通胡）。"
      },
      {
        id: 4,
        suit: '万',
        tiles: ['三万', '三万', '三万', '四万', '五万', '六万', '七万', '七万', '七万', '八万', '八万', '八万', '九万'],
        correct: [3, 6, 9],
        explanation: "三、七、八万都是暗刻。重点在于中间的四五六万顺子和最后的九万，最终听三、六、九万。"
      },
      {
        id: 5,
        suit: '条',
        tiles: ['一条', '二条', '三条', '三条', '三条', '四条', '五条', '六条', '七条', '八条', '九条', '九条', '九条'],
        correct: [1, 4, 7],
        explanation: "典型的长顺子带暗刻结构，听一、四、七条。"
      }
    ]
    
    this.setData({ questions })
  },

  initLevel() {
    const q = this.data.questions[this.data.questionIndex]
    // 生成 1-9 的选项
    const options = []
    for (let i = 1; i <= 9; i++) {
      options.push(`${this.numberToChinese(i)}${q.suit}`)
    }

    this.setData({
      suit: q.suit,
      tiles: q.tiles,
      correctAnswers: q.correct,
      explanation: q.explanation,
      options: options,
      selectedOptions: [],
      showExplanation: false,
      progress: Math.floor((this.data.questionIndex / this.data.questions.length) * 100),
      timeLeft: 120,
      gameOver: false,
      guideText: `观察这组${q.suit}子清一色，请点击下方所有能胡的牌（多选）：`
    })
    
    this.startTimer()
  },

  numberToChinese(num) {
    const map = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九' }
    return map[num]
  },

  startTimer() {
    if (this.timer) clearInterval(this.timer)
    this.timer = setInterval(() => {
      if (this.data.timeLeft > 0) {
        this.setData({ timeLeft: this.data.timeLeft - 1 })
      } else {
        this.gameOver()
      }
    }, 1000)
  },

  onOptionSelect(e) {
    const index = e.currentTarget.dataset.index // 0-8 对应 1-9张
    const tileNum = index + 1
    let selected = this.data.selectedOptions
    
    const pos = selected.indexOf(tileNum)
    if (pos > -1) {
      selected.splice(pos, 1)
    } else {
      selected.push(tileNum)
    }
    
    this.setData({ selectedOptions: selected })
  },

  onSubmit() {
    const { selectedOptions, correctAnswers, explanation } = this.data
    if (selectedOptions.length === 0) {
      wx.showToast({ title: '请至少选择一张牌', icon: 'none' })
      return
    }
    
    clearInterval(this.timer)
    
    // 校验逻辑：长度一致且内容完全匹配
    const isCorrect = selectedOptions.length === correctAnswers.length && 
                      selectedOptions.every(val => correctAnswers.includes(val))
    
    if (isCorrect) {
      const newScore = this.data.score + 20
      this.setData({
        score: newScore,
        showExplanation: true
      })
      
      wx.showModal({
        title: '完全正确！',
        content: explanation,
        showCancel: false,
        success: () => {
          this.goToNextQuestion()
        }
      })
    } else {
      wx.showToast({ title: '漏掉了或者选错了哦，再观察一下！', icon: 'none' })
      this.setData({
        score: Math.max(0, this.data.score - 5),
        selectedOptions: [] // 清空重选
      })
      this.startTimer()
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
      selectedOptions: [],
      showExplanation: false
    })
    this.initLevel()
  },

  completeChapter() {
    if (app.showCelebration) app.showCelebration()
    clearInterval(this.timer)
    this.setData({ progress: 100, levelCompleted: true })
    
    wx.showModal({
      title: '🎉 挑战成功',
      content: `你已通过清一色听牌测验！最终得分：${this.data.score}`,
      showCancel: false,
      success: () => {
        if (!app.globalData.completedChapters.includes(5)) {
          app.globalData.completedChapters.push(5)
        }
        app.saveProgress()
        wx.navigateBack()
      }
    })
  },

  gameOver() {
    clearInterval(this.timer)
    this.setData({ gameOver: true })
    wx.showModal({
      title: '时间到！',
      content: '清一色需要更敏锐的观察力，再试一次吧！',
      showCancel: false,
      success: () => {
        this.setData({ questionIndex: 0, score: 0 })
        this.initLevel()
      }
    })
  },

  onBackTap() {
    wx.navigateBack()
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer)
  }
})
