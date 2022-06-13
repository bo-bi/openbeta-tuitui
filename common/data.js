const activityStateList = [
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
    detailMessage: '您好, 很遗憾您已错过报名时间, 无法参加本次测评~',
  },

  {
    value: 5,
    type: 'state-results-summary',
    name: '结果汇总中',
    detailTimeName: '活动结束时间',
    detailMessage: '优质报告筛选中, 快来与我猜一猜究竟会花落谁家!',
  },

  {
    value: 6,
    type: 'state-finished',
    name: '活动结束',
    detailTimeName: '活动结束时间',
    detailMessage: '活动已结束, 一起期待下一次活动开始吧~',
  },
];

export {
  activityStateList,
};
