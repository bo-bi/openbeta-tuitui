import { ref }      from 'vue';
import * as api     from '/api';
import Skeleton     from 'vant/es/skeleton';
import Tabs         from 'vant/es/tabs';
import Tab          from 'vant/es/tab';
import Empty        from 'vant/es/empty';
import ActivityList from '/components/ActivityList.vue';
import FeedbackList from '/components/FeedbackList.vue';
import {
  initLogin,
  removeLocalKey,
} from '/common/utils';

Page({
  components: {
    [Skeleton.name]: Skeleton,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Empty.name]: Empty,
    ActivityList,
    FeedbackList,
  },

  onLoad() {
    // Do some initialize when page load.

    // 此页为必须登录, 才可展示页面
    initLogin()
    .then((data) => {
      console.log('初始化登录成功后', data);
      this.fetchData();
      this.getUserReportDataStatistics();
    })
    .catch(e => {
      console.log('初始化登录失败后', e);
    });
  },

  onShareAppMessage: function () {
    return {
      title: `${this.userProfile.name}的个人主页`,
      path: `/pages/personalHomePage/index?uid=${this.uid}`,
    }
  },

  setup() {
    const activeTab = ref('personal-joined');
    return {
      activeTab,
    };
  },

  data() {
    return {
      uid: this.$route.query.uid,
      // uid: 2,
      userProfile: {},
      defaultAvatar: 'https://p4.ssl.qhimg.com/d/inn/2c29efb0f3ff/default-avatar.jpg',

      dataStatistics: {},
    }
  },

  watch: {
    'activeTab'(val) {
      // 切换Tab后 列表置为最上方
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
  },

  methods: {
    fetchData() {
      api.getUserProfile({
        uid: this.uid,
      })
      .then(({ data }) => {
        console.log('用户详情', data);
        const { code, msg } = data;

        if (code === 200) {
          this.userProfile = data.data;
          this.userProfile.detail = JSON.parse(this.userProfile.detail);

          // 设置title
          qh.setNavigationBarTitle({
            title: `${this.userProfile.name}的个人主页`,
          });
        } else {
          qh.showToast({
            title: `${msg}`,
          });

          if (code === 401) {
            // 先清除本地存储的token
            removeLocalKey(ACCESS_TOKEN)
            .then(data => {
              // 再重新登录
              return initLogin();
            })
            .then((data) => {
              // 登录成功后 刷新接口(代替刷新页面)
              this.fetchData();
            })
            .catch(e => {
              console.log('token异常, 进行登录错误', e);
            })
          }

        }

      })
      .catch(e => {
        console.log('e', e)
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    getUserReportDataStatistics() {
      api.getUserReportDataStatistics({
        uid: this.uid,
      })
      .then(({ data }) => {
        console.log('报告数据统计接口', data);
        const { code, msg } = data;

        if (code === 200) {
          this.dataStatistics = data.data;
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

    handleShowTip() {
      qh.alert({
        title: '提示',
        message: '小程序暂不支持更换头像，请您前往推推个人页更换头像',
        buttonName: '好的',
      });
    },

    handleToConversation() {
      qh.toConversation({
        chatId: this.userProfile.detail.uid,
        type: '1',
      })
    },

  },
})
