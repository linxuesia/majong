Page({
  data: {
    allTiles: [
      '一万','二万','三万','四万','五万','六万','七万','八万','九万',
      '一条','二条','三条','四条','五条','六条','七条','八条','九条',
      '一筒','二筒','三筒','四筒','五筒','六筒','七筒','八筒','九筒',
      '东','南','西','北','中','发','白'
    ],
    isSelected: false
  },
  toggleSelect() {
    this.setData({ isSelected: !this.data.isSelected });
  }
})
