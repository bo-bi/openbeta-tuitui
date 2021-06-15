Page({
  onLoad: function () {
    // Do some initialize when page load.
    console.log('onLoad -- 监听页面加载')
    setTimeout(() => {
      this.updateData();
    }, 3000);
  },

  onShow: function () {
    // Do something when page show.
    console.log('onShow -- 监听页面显示');
  },

  onReady: function () {
    // Do something when page ready.
    console.log('onReady -- 监听页面初次渲染完成');
  },

  onHide: function () {
    // Do something when page hide.
    console.log('onHide -- 监听页面隐藏');
  },

  onUnload: function () {
    // Do something when page close.
    console.log('onUnload -- 监听页面卸载');
  },

  onShareAppMessage: function () {
    // 用户点击右上角转发
    return {
      title: '快来试下这是360er内测~',
      // path: '/page/user?id=123',
      path: '/page/mine/index?id=456',
      imageUrl: 'http://p4.music.126.net/VDUjBvzZdMV8Hn_lYTt8fw==/109951165756214678.jpg'
    }
  },
})
