// pages/test-sprite/test-sprite.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 所有麻将牌列表
    allTiles: [
      '一万', '二万', '三万', '四万', '五万', '六万', '七万', '八万', '九万',
      '一条', '二条', '三条', '四条', '五条', '六条', '七条', '八条', '九条',
      '一筒', '二筒', '三筒', '四筒', '五筒', '六筒', '七筒', '八筒', '九筒',
      '北', '白', '南', '中', '发', '东', '西'
    ],
    // 配置信息
    spriteConfig: require('../../utils/tileMapper').SPRITE_CONFIG
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('精灵图配置信息:', this.data.spriteConfig);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})