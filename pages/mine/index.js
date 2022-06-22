import * as api from '/api';
import Skeleton from 'vant/es/skeleton';
import { 
  initLogin,
  removeLocalKey,
} from '/common/utils';

Page({
  components: {
    [Skeleton.name]: Skeleton,
  },

  data() {
    return {
      myDetail: {},
      defaultAvatar: 'https://p4.ssl.qhimg.com/d/inn/2c29efb0f3ff/default-avatar.jpg',
      panelList: [
        {
          name: '我的活动',
          list: [
            {
              type: 'published',
              name: '我发布的',
              image: 'https://p4.ssl.qhimg.com/d/inn/18a37e0b6c27/published.jpg',
            },
            {
              type: 'joined',
              name: '我参与的',
              image: 'https://p1.ssl.qhimg.com/d/inn/8894d39e4203/joined.png',
            },
            {
              type: 'followed',
              name: '我关注的',
              image: 'https://p5.ssl.qhimg.com/d/inn/baa89b677cc0/followed.jpg',
            },
          ]
        },

        {
          name: '我的内容',
          list: [
            {
              type: 'feedback',
              name: '测评报告',
              image: 'https://p2.ssl.qhimg.com/d/inn/e0b87c129e81/feedback.jpg',
            },
          ]
        },
      ],

    }
  },

  onLoad() {
    // Do some initialize when page load.

    // 此页为必须登录, 才可展示页面
    initLogin()
    .then((data) => {
      console.log('初始化登录成功后', data);
      this.fetchData();
    })
    .catch(e => {
      console.log('初始化登录失败后', e);
    });
  },

  onShow: function() {
    // Do something when page show.
  },

  onReady: function() {
    // Do something when page ready.
  },

  onHide: function() {
    // Do something when page hide.
  },

  onUnload: function() {
    // Do something when page close.
  },

  methods: {
    fetchData() {
      api.getMyDetail()
      .then(({ data }) => {
        console.log('我的详情', data);
        const { code, msg } = data;

        if (code === 200) {
          this.myDetail = data.data;
        } else {
          qh.showToast({
            title: `${msg}`,
          });

          if (code === 401) {
            // login(() => {
            //   // qh.switchTab({
            //   //   url: '/pages/mine/index'
            //   // })
            //   // window.location.reload()
            //   this.fetchData()
            // })

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

    handleOpen(item) {
      const { type } = item;
      const isAdmin = this.myDetail.is_admin === 2;

      if (type === 'published' && !isAdmin) {
        qh.alert({
          title: '提示',
          message: '您还没有发起内测活动的权限，请联系李秋平开启',
          buttonName: '知道了',
        });
        return;
      }

      qh.navigateTo({
        url: `/pages/mine/${type}/index`,
      });
    },

    handleShowTip() {
      qh.alert({
        title: '提示',
        message: '小程序暂不支持更换头像，请您前往推推个人页更换头像',
        buttonName: '好的',
      });
    },

    getToken() {
      qh.getStorage({
        key: ACCESS_TOKEN,
        success(res) {
          console.log(`获取${ACCESS_TOKEN}成功`, res)
        },
      })
    },

    removeToken() {
      qh.removeStorage({
        key: ACCESS_TOKEN,
        success: res => {
          console.log(`删除${ACCESS_TOKEN}成功`, res)
          // 当前是Tab, 刷新当前Tab
          // qh.switchTab({
          //   url: '/pages/home/index'
          // })
          // window.location.reload()
          this.fetchData()
        },
      })
    },

    // 用于模拟接口返回登录过期场景
    setToken() {
      qh.setStorage({
        key: ACCESS_TOKEN,
        data: 'ku1FrHNwJVFUNtXjvG258XwUNOkt+C0tg2J9yN645yQ=',
        success: res => {
          console.log(`设置过期${ACCESS_TOKEN}成功`, res)
          this.fetchData()
        },
      })
    },

  }
})
