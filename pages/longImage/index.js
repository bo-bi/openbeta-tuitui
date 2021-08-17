Page({
  data() {
    return {
      url: this.$route.query.url,
    }
  },
  onLoad: function () {
    // Do some initialize when page load.
  },
  onShow: function () {
    // Do something when page show.
  },
  onReady: function () {
    // Do something when page ready.
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      imageUrl: 'http://qh.com/image.png'
    }
  },

  methods: {
    handlePreviewImage() {
      qh.previewImage({
        images: [this.url],
      });
    },

  }
})
