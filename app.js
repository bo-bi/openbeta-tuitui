App({
  onLoad () {
    // Do something initial when load.
    console.log('onLoad -- 监听小程序初始化');
    // 可以拿到this

    // 此处便不进行小程序初始化登录了, 而且这里不好定位错误, 在每个页面需要登录的地方, 进行调用, 调用后再进行随后逻辑
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

    // 在这里看下5分钟后小程序能不能销毁, 经测试, 是会清除的
    // 小程序销毁, 将本地存储的token移除(目前取消此操作, 保留登录状态一个礼拜, 不用再每次进入小程序重复登录)
    // qh.removeStorage({
    //   key: 'access_token_product',
    //   success() {
    //     qh.showToast({
    //       title: `小程序销毁, 移除 access_token_product 成功`,
    //     });
    //   },
    //   fail() {
    //     qh.showToast({
    //       title: `小程序销毁, 移除 access_token_product 失败`,
    //     });
    //   },
    // });

    // qh.removeStorage({
    //   key: 'access_token_dev',
    //   success() {
    //     qh.showToast({
    //       title: `小程序销毁, 移除 access_token_dev 成功`,
    //     });
    //   },
    //   fail() {
    //     qh.showToast({
    //       title: `小程序销毁, 移除 access_token_dev 失败`,
    //     });
    //   },
    // });
  },

  onError (msg) {
    console.log(`onError -- 错误监听函数: ${msg}`);
  },

  // 全局共享数据
  globalData: {
    activityStateList: [
      {
        value: 1,
        type: 'state-preheating',
        name: '预热中',
        detailTimeName: '活动开始时间',
        detailMessage: '活动还未开始哦~',
      },

      {
        value: 2,
        type: 'state-join-now',
        name: '立即参加',
        detailTimeName: '报名截止时间',
        detailMessage: '赶快立即参加呀~',
      },

      {
        value: 3,
        type: 'state-filtering',
        name: '名单筛选中',
        detailTimeName: '名单公布时间',
        detailMessage: '名单筛选中哦~',
      },

      {
        value: 4,
        type: 'state-testing',
        name: '内测中',
        detailTimeName: '反馈截止时间',
        detailMessage: '正在内测中哦~',
      },

      {
        value: 5,
        type: 'state-results-summary',
        name: '结果汇总中',
        detailTimeName: '活动结束时间',
        detailMessage: '结果汇总中哦~',
      },

      {
        value: 6,
        type: 'state-finished',
        name: '活动结束',
        detailTimeName: '活动结束时间',
        detailMessage: '活动已结束~',
      },
    ],

  },
})
