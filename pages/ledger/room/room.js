// pages/ledger/room/room.js
Page({
  data: {
    // 房间信息
    roomId: '',
    roomName: '',
    currentTime: '',
    isLocal: false,
    
    // 玩家列表
    players: [],
    
    // 游戏记录
    gameRecords: [],
    currentRound: 1
  },

  onLoad(options) {
    // 从URL参数中获取房间信息
    const roomId = options.id || '';
    const roomName = options.name || '麻将房间';
    const isLocal = options.local === 'true';
    
    this.setData({
      roomId,
      roomName,
      isLocal
    });
    
    // 加载房间数据
    this.loadRoomData();
    
    // 初始化当前时间
    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 1000);
  },

  // 更新当前时间
  updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString();
    this.setData({ currentTime: timeString });
  },

  // 加载房间数据
  loadRoomData() {
    const storageKey = `mahjongLedgerRoom_${this.data.roomId}`;
    const roomData = wx.getStorageSync(storageKey) || {
      players: [],
      gameRecords: [],
      currentRound: 1
    };
    
    this.setData({
      players: roomData.players,
      gameRecords: roomData.gameRecords,
      currentRound: roomData.currentRound
    });
  },

  // 保存房间数据
  saveRoomData() {
    const storageKey = `mahjongLedgerRoom_${this.data.roomId}`;
    const roomData = {
      players: this.data.players,
      gameRecords: this.data.gameRecords,
      currentRound: this.data.currentRound
    };
    
    wx.setStorageSync(storageKey, roomData);
  },

  // 开始记账
  onStartGame() {
    // 导航到记账页面（这里暂时使用一个简单的弹窗模拟）
    wx.showModal({
      title: '开始记账',
      content: '请输入本局游戏的胜负情况',
      showCancel: false,
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) {
          this.addGameRecord();
        }
      }
    });
  },

  // 查看分数
  onViewScores() {
    wx.showModal({
      title: '玩家分数',
      content: this.data.players.map(p => `${p.name}: ${p.score || 0}分`).join('\n'),
      showCancel: false,
      confirmText: '确定'
    });
  },

  // 添加游戏记录
  addGameRecord() {
    // 模拟游戏记录
    const record = {
      id: Date.now().toString(),
      round: this.data.currentRound,
      time: new Date().toLocaleString(),
      results: this.data.players.map(p => ({
        playerId: p.id,
        name: p.name,
        score: Math.floor(Math.random() * 200) - 100 // 随机分数，-100到100之间
      }))
    };
    
    // 更新玩家分数
    const updatedPlayers = this.data.players.map(player => {
      const result = record.results.find(r => r.playerId === player.id);
      return {
        ...player,
        score: (player.score || 0) + (result ? result.score : 0)
      };
    });
    
    // 更新游戏记录和当前回合
    const updatedRecords = [record, ...this.data.gameRecords];
    const nextRound = this.data.currentRound + 1;
    
    this.setData({
      players: updatedPlayers,
      gameRecords: updatedRecords,
      currentRound: nextRound
    });
    
    // 保存数据
    this.saveRoomData();
    
    // 显示成功提示
    wx.showToast({ title: '记账成功', icon: 'success' });
  },

  // 退出房间
  onExitRoom() {
    wx.showModal({
      title: '退出房间',
      content: '确定要退出当前房间吗？',
      success: (res) => {
        if (res.confirm) {
          // 导航回记账本首页
          wx.navigateBack({
            delta: 1
          });
        }
      }
    });
  }
});