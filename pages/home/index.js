// 此处引入一次vant的css, 所有页面无需再按需引入所使用组件的样式
import 'vant/lib/index.css';
import * as api     from '/api';
import Banner       from '/components/Banner.vue';
import ActivityList from '/components/ActivityList.vue';
import Skeleton     from 'vant/es/skeleton';
import Empty        from 'vant/es/empty';

Page({
  components: {
    Banner,
    ActivityList,
    [Skeleton.name]: Skeleton,
    [Empty.name]: Empty,
  },

  data() {
    return {
      bannerList: [],
    }
  },

  onLoad: function () {
    // Do some initialize when page load.
    console.log('onLoad -- 监听页面加载')

    this.getBannerList();
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
    return {
      title: '360新品，邀您体验！',
      path: '/pages/home/index',
      // imageUrl: '',
    }
  },

  methods: {
    getBannerList() {
      api.getBannerList()
      .then(({ data }) => {
        console.log('getBannerList', data);
        const { code, msg } = data;

        if (code === 200) {
          this.bannerList = data.data;
        } else {
          qh.showToast({
            title: `${msg}`,
          });
        }

      })
      .catch(e => {
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

  },
})
