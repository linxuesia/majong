// pages/chapter4/chapter4.js
const app = getApp()

Page({
  data: {
    currentLevel: 1,
    progress: 0,
    score: 0,
    timeLeft: 30,
    levelCompleted: false,
    guideText: '欢迎来到海底世界！让我们一起探索海底捞月和海底炮的奥秘！',
    
    seaTiles: [],
    targetAction: '',
    correctChoice: '',
    choices: [],
    
    questionIndex: 0,
    questionType: '',
    options: [],
    userAnswer: [],
    correctAnswers: [],
    selectedOption: null,
    correctAnswer: null
  },

  onLoad() {
    const savedLevel = wx.getStorageSync('chapter4_currentLevel')
    if (savedLevel && savedLevel === 2) {
      this.initLevel2()
    } else {
      this.initLevel1()
    }
  },

  initLevel1() {
    const scenarios = [
      {
        seaTiles: ['一万', '二万', '三万', '四万', '五万', '六万', '七万', '八万', '九万', '海底'],
        description: '牌墙最后一张牌，你（庄家）摸到了海底牌，正好凑成胡牌！',
        action: '海底捞月',
        choices: ['海底捞月', '海底炮', '普通胡', '碰牌']
      },
      {
        seaTiles: ['一条', '二条', '三条', '四条', '五条', '六条', '七条', '八条', '九条', '海底'],
        description: '牌墙最后一张牌，你（闲家）摸到了海底牌，打出后被下家胡了！',
        action: '海底炮',
        choices: ['海底捞月', '海底炮', '普通胡', '吃牌']
      },
      {
        seaTiles: ['一筒', '二筒', '三筒', '四筒', '五筒', '六筒', '七筒', '八筒', '九筒', '海底'],
        description: '牌墙最后一张牌，庄家摸到了海底牌，打出后被你（闲家）胡了！',
        action: '海底炮',
        choices: ['海底捞月', '海底炮', '普通胡', '杠牌']
      }
    ]
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    
    this.setData({
      seaTiles: scenario.seaTiles,
      guideText: scenario.description,
      targetAction: scenario.action,
      correctChoice: scenario.action,
      choices: scenario.choices,
      timeLeft: 30,
      gameOver: false,
      currentLevel: 1
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

  onChoiceTap(e) {
    const choice = e.currentTarget.dataset.choice
    
    if (choice === this.data.correctChoice) {
      const newScore = this.data.score + 15
      
      wx.showToast({
        title: '回答正确！',
        icon: 'success'
      })
      
      this.setData({
        score: newScore
      })
      
      this.completeLevel1()
    } else {
      wx.showToast({
        title: '再想想哦！',
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
      progress: 10,
      guideText: '干得漂亮！现在来学习扎鸟翻倍规则吧！'
    })
    
    setTimeout(() => {
      this.initLevel2()
    }, 1500)
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
          timeLeft: this.data.currentLevel === 1 ? 30 : 90,
          score: 0,
          gameOver: false
        })
        if (this.data.currentLevel === 1) {
          this.initLevel1()
        } else {
          this.initLevel2()
        }
      }
    })
  },

  initLevel2() {
    wx.setStorageSync('chapter4_currentLevel', 2)
    
    const questionTypes = ['who', 'position', 'position', 'score', 'allScores']
    const currentType = this.data.questionIndex < questionTypes.length ? questionTypes[this.data.questionIndex] : 'who'
    
    if (currentType === 'who') {
      this.initQuestionWho()
    } else if (currentType === 'position') {
      this.initQuestionPosition()
    } else if (currentType === 'score') {
      this.initQuestionScore()
    } else if (currentType === 'allScores') {
      this.initQuestionAllScores()
    }
    
    this.startTimer()
  },

  initQuestionWho() {
    const selfNumbers = ['1', '5', '9']
    const wrongOptions = [['2', '6'], ['3', '7'], ['4', '8']]
    
    const options = selfNumbers.concat(wrongOptions[Math.floor(Math.random() * wrongOptions.length)]).sort(() => Math.random() - 0.5)
    
    this.setData({
      questionType: 'who',
      questionIndex: 0,
      guideText: '扎鸟时，哪些数字代表中到自己？（可多选）',
      options: options.map(o => ({ text: o, selected: false, correct: selfNumbers.includes(o) })),
      correctAnswers: selfNumbers,
      userAnswer: [],
      levelCompleted: false,
      currentLevel: 2,
      progress: 25,
      timeLeft: 90
    })
  },

  initQuestionPosition() {
    const positions = ['自己', '下家', '对家', '上家']
    const mapping = {
      '1': '自己', '2': '下家', '3': '对家', '4': '上家',
      '5': '自己', '6': '下家', '7': '对家', '8': '上家',
      '9': '自己'
    }
    
    const randomNum = Math.floor(Math.random() * 8) + 1
    const correctPosition = mapping[randomNum]
    
    this.setData({
      questionType: 'position',
      questionIndex: 1,
      guideText: `扎鸟抽到【${randomNum}号】，这位玩家是？`,
      options: positions.map(p => ({ text: p, correct: p === correctPosition })),
      correctAnswer: correctPosition,
      selectedOption: null,
      levelCompleted: false,
      currentLevel: 2,
      progress: 40,
      timeLeft: 90
    })
  },

  initQuestionScore() {
    const baseScores = [10, 20, 30]
    const baseScore = baseScores[Math.floor(Math.random() * baseScores.length)]
    const birdPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const shuffled = birdPositions.sort(() => Math.random() - 0.5)
    const firstBird = shuffled[0]
    const secondBird = shuffled[1]
    
    const mapping = {
      '1': '自己', '2': '下家', '3': '对家', '4': '上家',
      '5': '自己', '6': '下家', '7': '对家', '8': '上家',
      '9': '自己'
    }
    
    const firstWho = mapping[firstBird]
    const secondWho = mapping[secondBird]
    
    let scoreMultiplier = 1
    if (firstWho === '自己') scoreMultiplier++
    if (secondWho === '自己') scoreMultiplier++
    
    this.setData({
      questionType: 'score',
      questionIndex: 2,
      guideText: `底分${baseScore}，扎到${firstBird}号（${firstWho}）和${secondBird}号（${secondWho}），胡牌玩家总分是多少？`,
      options: [baseScore * scoreMultiplier, baseScore * (scoreMultiplier + 1), baseScore * (scoreMultiplier + 2)].sort(() => Math.random() - 0.5),
      correctAnswer: baseScore * scoreMultiplier,
      selectedOption: null,
      levelCompleted: false,
      currentLevel: 2,
      progress: 55,
      timeLeft: 90
    })
  },

  initQuestionAllScores() {
    const baseScores = [10, 20, 30]
    const baseScore = baseScores[Math.floor(Math.random() * baseScores.length)]
    const birdPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const shuffled = birdPositions.sort(() => Math.random() - 0.5)
    const firstBird = shuffled[0]
    const secondBird = shuffled[1]
    
    const mapping = {
      '1': '自己', '2': '下家', '3': '对家', '4': '上家',
      '5': '自己', '6': '下家', '7': '对家', '8': '上家',
      '9': '自己'
    }
    
    const firstWho = mapping[firstBird]
    const secondWho = mapping[secondBird]
    
    const allScores = {
      '自己': 0,
      '下家': baseScore,
      '对家': baseScore,
      '上家': baseScore
    }
    
    if (firstWho === '自己') {
      allScores['下家'] += baseScore
      allScores['对家'] += baseScore
      allScores['上家'] += baseScore
    } else {
      allScores[firstWho] += baseScore
    }
    
    if (secondWho === '自己') {
      allScores['下家'] += baseScore
      allScores['对家'] += baseScore
      allScores['上家'] += baseScore
    } else if (secondWho !== firstWho) {
      allScores[secondWho] += baseScore
    }
    
    const scoreText = `下家给${allScores['下家']}分，对家给${allScores['对家']}分，上家给${allScores['上家']}分`
    
    const wrong1 = `下家给${allScores['下家'] * 2}分，对家给${allScores['对家']}分，上家给${allScores['上家']}分`
    const wrong2 = `下家给${allScores['下家']}分，对家给${allScores['对家'] * 2}分，上家给${allScores['上家']}分`
    
    this.setData({
      questionType: 'allScores',
      questionIndex: 3,
      guideText: `底分${baseScore}，扎到${firstBird}号和${secondBird}号（${firstWho}、${secondWho}），各家要付多少分？`,
      options: [scoreText, wrong1, wrong2],
      correctAnswer: scoreText,
      selectedOption: null,
      levelCompleted: false,
      currentLevel: 2,
      progress: 70,
      timeLeft: 90
    })
  },

  onOptionSelect(e) {
    const index = e.currentTarget.dataset.index
    
    if (this.data.questionType === 'who') {
      const options = this.data.options
      options[index].selected = !options[index].selected
      
      this.setData({
        options: options,
        userAnswer: options.filter(o => o.selected).map(o => o.text)
      })
    } else {
      this.setData({
        selectedOption: index
      })
    }
  },

  onWhoSubmit() {
    const userAnswers = this.data.userAnswer.sort()
    const correctAnswers = this.data.correctAnswers.sort()
    
    const isCorrect = userAnswers.length === correctAnswers.length && 
                      userAnswers.every((v, i) => v === correctAnswers[i])
    
    if (isCorrect) {
      wx.showToast({ title: '回答正确！', icon: 'success' })
      this.setData({ score: this.data.score + 15, levelCompleted: true })
      setTimeout(() => this.goToNextQuestion(), 1500)
    } else {
      wx.showToast({ title: '再想想哦！', icon: 'none' })
      this.setData({ score: Math.max(0, this.data.score - 5) })
    }
  },

  onPositionSubmit() {
    const index = this.data.selectedOption
    if (index === null) return
    
    const selectedOption = this.data.options[index]
    
    if (selectedOption.correct) {
      wx.showToast({ title: '回答正确！', icon: 'success' })
      this.setData({ score: this.data.score + 15, levelCompleted: true })
      setTimeout(() => this.goToNextQuestion(), 1500)
    } else {
      wx.showToast({ title: '再想想哦！', icon: 'none' })
      this.setData({ score: Math.max(0, this.data.score - 5) })
    }
  },

  onScoreSubmit() {
    const index = this.data.selectedOption
    if (index === null) return
    
    const selectedOption = this.data.options[index]
    
    if (selectedOption === this.data.correctAnswer) {
      wx.showToast({ title: '回答正确！', icon: 'success' })
      this.setData({ score: this.data.score + 20, levelCompleted: true })
      setTimeout(() => this.goToNextQuestion(), 1500)
    } else {
      wx.showToast({ title: '再想想哦！', icon: 'none' })
      this.setData({ score: Math.max(0, this.data.score - 5) })
    }
  },

  goToNextQuestion() {
    clearInterval(this.timer)
    
    const questionTypes = ['who', 'position', 'position', 'allScores']
    const nextIndex = this.data.questionIndex + 1
    
    if (nextIndex >= questionTypes.length) {
      this.completeChapter()
      return
    }
    
    this.setData({
      questionIndex: nextIndex,
      levelCompleted: false,
      selectedOption: null,
      userAnswer: [],
      timeLeft: 90
    })
    
    this.initLevel2()
  },

  completeChapter() {
    clearInterval(this.timer)
    this.setData({
      levelCompleted: true,
      progress: 100,
      guideText: '恭喜你！第四章完成了！你已经掌握了海底捞月、海底炮和扎鸟翻倍规则！'
    })
    
    setTimeout(() => {
      this.completeChapterFinish()
    }, 1500)
  },

  completeChapterFinish() {
    if (!app.globalData.completedChapters.includes(4)) {
      app.globalData.completedChapters.push(4)
    }
    if (app.globalData.currentChapter === 4) {
      app.globalData.currentChapter = 5
    }
    app.saveProgress()
    
    wx.removeStorageSync('chapter4_currentLevel')
    
    wx.showModal({
      title: '🎉 章节完成',
      content: '你已经掌握了海底捞月、海底炮和扎鸟翻倍规则！准备好迎接最后的实战演练了吗？',
      showCancel: false,
      success: () => {
        wx.navigateBack()
      }
    })
  },

  onNextTap() {
    if (this.data.currentLevel === 1) {
      this.initLevel2()
    } else {
      this.completeChapterFinish()
    }
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
