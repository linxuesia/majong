const { getTilePosV2 } = require('../../utils/tileMapperV2.js');

Component({
  properties: {
    tileText: {
      type: String,
      value: '一万',
      observer: 'updateTile'
    },
    width: {
      type: Number,
      value: 80
    },
    height: {
      type: Number,
      value: 108
    },
    selected: {
      type: Boolean,
      value: false
    },
    customClass: {
      type: String,
      value: ''
    }
  },

  data: {
    tilePos: null
  },

  lifetimes: {
    attached() {
      this.updateTile();
    }
  },

  methods: {
    updateTile() {
      const pos = getTilePosV2(this.data.tileText);
      this.setData({
        tilePos: pos
      });
    }
  }
})
