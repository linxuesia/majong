// components/mahjong-tile/mahjong-tile.js
const { getTileInfo } = require('../../utils/tileMapper');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 麻将牌文字
    tileText: {
      type: String,
      value: '',
      observer: function(newVal) {
        this.updateTileInfo(newVal);
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    },
    // 自定义类名
    customClass: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tileInfo: null,
    isSprite: false,
    // 精灵图样式属性
    spriteSheetPath: '',
    spriteX: 0,
    spriteY: 0,
    // 单张图片
    singleImage: ''
  },

  /**
   * 组件生命周期函数，在组件实例进入页面节点树时执行
   */
  attached: function() {
    this.updateTileInfo(this.properties.tileText);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 更新麻将牌信息
    updateTileInfo: function(tileText) {
      if (!tileText) return;
      
      const tileInfo = getTileInfo(tileText);
      if (!tileInfo) return;
      
      if (tileInfo.type === 'sprite') {
        // 精灵图模式 - 使用更精确的样式计算
        // 直接设置各个样式属性，而不是通过对象
        this.setData({
          tileInfo: tileInfo,
          isSprite: true,
          spriteSheetPath: tileInfo.sheetPath,
          spriteX: tileInfo.x,
          spriteY: tileInfo.y,
          singleImage: ''
        });
      } else {
        // 单张图片模式
        this.setData({
          tileInfo: tileInfo,
          isSprite: false,
          singleImage: tileInfo.path
        });
      }
    },
    
    // 点击事件处理
    onTap: function() {
      if (this.properties.disabled) return;
      
      // 触发自定义点击事件
      this.triggerEvent('tap', {
        tileText: this.properties.tileText
      });
    }
  }
});