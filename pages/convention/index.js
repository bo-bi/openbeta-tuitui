import * as api from '/api';
import Skeleton from 'vant/es/skeleton';
import Button   from 'vant/es/button';

Page({
  components: {
    [Skeleton.name]: Skeleton,
    [Button.name]: Button,
  },

  data() {
    return {
      id: this.$route.query.id,
      questionnaire_id: this.$route.query.questionnaire_id,
      // id: 17,
      // id: 18,
      // questionnaire_id: 'a6955c6ff4c5d',
      detail: {},
      countDown: 5,
      isTimeUp: false,
    }
  },

  onLoad: function () {
    // Do some initialize when page load.
    this.fetchData();
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

  methods: {
    fetchData() {
      api.getConventionDetail(this.id)
      .then(({ data }) => {
        console.log('公约详情', data);
        const { code, msg } = data;

        if (code === 200) {
          this.detail = data.data;

          // 设置title
          qh.setNavigationBarTitle({
            title: this.detail.name,
          });

          const timer = setInterval(() => {
            this.countDown --;
    
            if (this.countDown === 0) {
              clearInterval(timer)
              this.isTimeUp = true;
            }
          }, 1000);

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

    handleGoBack() {
      qh.navigateBack({
        delta: 1,
      });
    },

    handleGoToSignUp() {
      if (!this.isTimeUp) return;

      qh.alert({
        title: '提示',
        message: '即将跳转问卷小程序, 进行报名, 提交成功后, 即完成报名.',
        buttonName: '确定',
        success: res => {
          console.log('用户点击确定', res);
          this.handleNavigateToMiniProgram();
        },
      });
    },

    handleNavigateToMiniProgram() {
      const ua = window.navigator.userAgent;
      const isAndroid = ua.indexOf('Android') > 0;
      const isIOS = ua.indexOf('iPhone') > 0;

      // qh.navigateBack() 被告知不支持回调, 所以不可在其回调中跳转小程序
      // 目前小程序安卓会走跳转小程序的回调, IOS不会走跳转小程序的回调
      if (isAndroid) {
        qh.navigateToMiniProgram({
          appId: '7652669648848144',
          path: `pages/view/index?id=${this.questionnaire_id}`,
          success: res => {
            console.log('安卓 跳转小程序成功', res);

            qh.navigateBack({
              delta: 1,
            });
          },
        });
      }

      if (isIOS) {
        qh.navigateToMiniProgram({
          appId: '7652669648848144',
          path: `pages/view/index?id=${this.questionnaire_id}`,
          success: res => {
            console.log('IOS 跳转小程序成功', res);
          },
        });

        qh.navigateBack({
          delta: 1,
        });
      }
    },

  }
})
