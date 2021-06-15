App({
  onLoad () {
    // Do something initial when load.
    console.log('onLoad -- 监听小程序初始化');
    // 可以拿到this
  },

  onShow () {
    // Do something when show.
    console.log('onShow -- 监听小程序启动或切前台');
    // 拿不到this
  },

  onHide () {
    // Do something when hide.
    console.log('onHide -- 监听小程序切后台');
    // 拿不到this
  },

  onUnload () {
    // Do something when unload.
    console.log('onUnload -- 监听小程序销毁');
  },

  onError (msg) {
    console.log(`onError -- 错误监听函数: ${msg}`);
  },

  // 全局共享数据
  globalData: {
    name: '张三',
  },
})
