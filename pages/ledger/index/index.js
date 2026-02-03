// pages/ledger/index/index.js
Page({
  data: {
    // 用户信息
    userInfo: null,
    
    // 加入房间相关
    showJoinRoomInput: false,
    roomId: '',
    
    // 历史房间
    historyRooms: []
  },

  onLoad() {
    // 加载用户信息
    this.loadUserInfo();
    
    // 加载历史房间
    this.loadHistoryRooms();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('mahjongLedgerUserInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  // 处理用户授权
  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo;
      this.setData({ userInfo });
      
      // 保存用户信息到本地存储
      wx.setStorageSync('mahjongLedgerUserInfo', userInfo);
      
      wx.showToast({ title: '授权成功', icon: 'success' });
    } else {
      wx.showToast({ title: '授权失败', icon: 'none' });
    }
  },

  // 加载历史房间
  loadHistoryRooms() {
    const historyRooms = wx.getStorageSync('mahjongLedgerHistoryRooms') || [];
    this.setData({ historyRooms });
  },

  // 创建房间
  onCreateRoom() {
    // 生成随机房间号
    const roomId = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 创建房间数据
    const roomData = {
      id: roomId,
      name: `房间 ${roomId}`,
      createdAt: new Date().toLocaleString(),
      lastAccessTime: new Date().toLocaleString()
    };
    
    // 保存到历史房间
    this.saveToHistory(roomData);
    
    // 导航到房间页面
    wx.navigateTo({
      url: `/pages/ledger/room/room?id=${roomId}&name=${roomData.name}`
    });
  },

  // 加入房间
  onJoinRoom() {
    this.setData({ showJoinRoomInput: true });
  },

  // 取消加入房间
  cancelJoinRoom() {
    this.setData({ showJoinRoomInput: false, roomId: '' });
  },

  // 房间号输入
  onRoomIdChange(e) {
    this.setData({ roomId: e.detail.value });
  },

  // 确认加入房间
  confirmJoinRoom() {
    const roomId = this.data.roomId;
    
    if (!roomId) {
      wx.showToast({ title: '请输入房间号', icon: 'none' });
      return;
    }
    
    // 创建房间数据
    const roomData = {
      id: roomId,
      name: `房间 ${roomId}`,
      lastAccessTime: new Date().toLocaleString()
    };
    
    // 保存到历史房间
    this.saveToHistory(roomData);
    
    // 导航到房间页面
    wx.navigateTo({
      url: `/pages/ledger/room/room?id=${roomId}&name=${roomData.name}`
    });
    
    // 重置输入
    this.setData({ showJoinRoomInput: false, roomId: '' });
  },

  // 加入历史房间
  joinHistoryRoom(e) {
    const roomId = e.currentTarget.dataset.id;
    const room = this.data.historyRooms.find(r => r.id === roomId);
    
    if (room) {
      // 更新最后访问时间
      room.lastAccessTime = new Date().toLocaleString();
      this.saveToHistory(room);
      
      // 导航到房间页面
      wx.navigateTo({
        url: `/pages/ledger/room/room?id=${room.id}&name=${room.name}`
      });
    }
  },

  // 进入本地模式
  enterLocalMode() {
    // 生成本地模式房间号
    const roomId = 'local_' + Date.now().toString();
    
    // 创建本地模式房间数据
    const roomData = {
      id: roomId,
      name: '本地模式',
      lastAccessTime: new Date().toLocaleString(),
      isLocal: true
    };
    
    // 保存到历史房间
    this.saveToHistory(roomData);
    
    // 导航到房间页面
    wx.navigateTo({
      url: `/pages/ledger/room/room?id=${roomId}&name=本地模式&local=true`
    });
  },

  // 保存到历史房间
  saveToHistory(roomData) {
    let historyRooms = wx.getStorageSync('mahjongLedgerHistoryRooms') || [];
    
    // 检查是否已存在
    const existingIndex = historyRooms.findIndex(r => r.id === roomData.id);
    
    if (existingIndex !== -1) {
      // 更新现有房间
      historyRooms[existingIndex] = roomData;
    } else {
      // 添加新房间
      historyRooms.unshift(roomData);
      
      // 限制历史房间数量
      if (historyRooms.length > 10) {
        historyRooms = historyRooms.slice(0, 10);
      }
    }
    
    // 保存到本地存储
    wx.setStorageSync('mahjongLedgerHistoryRooms', historyRooms);
    
    // 更新页面数据
    this.setData({ historyRooms });
  }
});