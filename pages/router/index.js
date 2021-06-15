Page({
  methods: {
    handleNavigateTo() {
      // 不可以跳转到tabbar所对应的页面
      qh.navigateTo({
        url: '/pages/one/index?id=123',
      })
    },

    handleRedirectTo() {
      qh.redirectTo({
        url: '/pages/one/index?id=456'
      })
    },

    handleSwitchTab() {
      qh.switchTab({
        url: '/pages/mine/index'
      })
    },
  },
})
