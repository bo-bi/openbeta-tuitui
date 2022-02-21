import * as api from '/api';
import Skeleton from 'vant/es/skeleton';
import Empty    from 'vant/es/empty';
import {
  initLogin,
  removeLocalKey,
  formatDate,
} from '/common/utils';

Page({
  components: {
    [Skeleton.name]: Skeleton,
    [Empty.name]: Empty,
  },

  data() {
    return {
      id: this.$route.query.id,

      isShowEmpty: false,

      detail: {},

      sendMedalLoading: false,

      defaultAvatar: 'https://p4.ssl.qhimg.com/d/inn/2c29efb0f3ff/default-avatar.jpg',

      // 有效浏览
      todayDateString: formatDate(new Date(), 'yyyy-MM-dd'),
    }
  },

  onLoad: function () {
    // Do some initialize when page load.

   // 此页为必须登录, 才可展示页面
   initLogin()
   .then(data => {
     console.log('初始化登录成功后', data);
     this.fetchData();
   })
   .catch(e => {
     console.log('初始化登录失败后', e);
   });
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
      title: this.detail.forum_name,
      path: `/pages/handpicked/report-detail/index?id=${this.id}`,
    }
  },

  methods: {
    fetchData() {
      api.getReportDetail(this.id)
      .then(({ data }) => {
        console.log('报告详情接口', data);
        const { code, msg } = data;

        if (code === 200) {
          this.detail = data.data;

          // 设置title
          qh.setNavigationBarTitle({
            title: this.detail.forum_name,
          });

          // 若有详情, 才进行页面有效打点, 若不存在, 则不打点
          this.handleViewEffectiveDot();
        } else if (code === 405) {
          // 405 报告不存在或下线
          this.isShowEmpty = true;
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
            .then(data => {
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
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    handlePreviewImage(e) {
      if (e.target.nodeName == 'IMG') {
        qh.previewImage({
          images: [e.target.currentSrc],
          current: e.target.currentSrc,
        });
      } else {
        // console.log("点击内容不为img")
      }
    },

    handleSendMedal() {
      const { medal_status, id } = this.detail;

      if (medal_status === 2) {
        qh.showToast({
          title: '已赞赏过哦~',
        });
        return;
      }

      if (this.sendMedalLoading) return;
      this.sendMedalLoading = true;

      api.addReportMedal(id)
      .then(({ data }) => {
        console.log('添加奖章接口', data);
        const { code, msg } = data;

        if (code === 200) {
          this.fetchData();
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
            }).then(data => {
              // 登录成功后 再次发送奖章
              this.handleSendMedal();
            }).catch(e => {
              console.log('token异常, 进行登录错误', e);
            });
          }

        }

        this.sendMedalLoading = false;
      })
      .catch(e => {
        this.sendMedalLoading = false;
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    handleCancelMedal() {
      api.cancelReportMedal(this.id)
      .then(({ data }) => {
        console.log('取消奖章接口', data);
      })
    },

    handleViewEffectiveDot() {
      // 获取本地缓存中的 report_view_list
      qh.getStorage({
        key: REPORT_VIEW_LIST,
        success: (REPORT_VIEW_LIST_RES) => {
          console.log(
            `%c缓存 ${REPORT_VIEW_LIST}`, 'color: #FF5500;', REPORT_VIEW_LIST_RES);

          // 若有这条记录
          if (REPORT_VIEW_LIST_RES && this.id in REPORT_VIEW_LIST_RES) {
            // 这条记录值与今天时间一样
            // 就什么都不做
            if (REPORT_VIEW_LIST_RES[this.id] === this.todayDateString) {
              console.log(
                `%c缓存 ${REPORT_VIEW_LIST} 中已经记录过, 不再打点`, 'color: #FF5500;');
              return;
            }
  
            // 若不一样
            // 请求打点接口, 并更新缓存
            this.sendViewDot(REPORT_VIEW_LIST_RES);
          } 
          // 若没有这条记录
          else {
            // 请求打点接口, 并更新缓存
            this.sendViewDot(REPORT_VIEW_LIST_RES);
          }
        },
      })
    },

    sendViewDot(REPORT_VIEW_LIST_RES) {
      api.sendReportViewDot(this.id)
      .then(({ data }) => {
        console.log('%c有效打点接口', 'color: #FF5500;', data);
        const { code, msg } = data;

        if (code === 200) {
          console.log('%c请求打点接口成功了', 'color: #FF5500;');

          // 更新本地缓存 report_view_list
          qh.setStorage({
            key: REPORT_VIEW_LIST,
            data: Object.assign(REPORT_VIEW_LIST_RES ? REPORT_VIEW_LIST_RES : {}, {
              [this.id]: this.todayDateString,
            }),
            success() {

              qh.getStorage({
                key: REPORT_VIEW_LIST,
                success(res) {
                  console.log(
                    `%c更新缓存 ${REPORT_VIEW_LIST} 成功`, 'color: #FF5500;', res);
                },
              })

            },
          })

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
});
