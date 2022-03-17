import Empty                 from 'vant/es/empty';
import HandpickedSectionList from '/components/HandpickedSectionList.vue';

Page({
  onShareAppMessage: function () {
    return {
      title: '360精选内测报告，邀您查看~',
      path: `/pages/handpicked/index`,
    }
  },

  components: {
    [Empty.name]: Empty,
    HandpickedSectionList,
  },
})
