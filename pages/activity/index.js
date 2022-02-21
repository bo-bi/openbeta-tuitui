import * as api  from '/api';
import Banner    from '/components/Banner.vue';
import Skeleton  from 'vant/es/skeleton';
import Empty     from 'vant/es/empty';
import Button    from 'vant/es/button';
import Swipe     from 'vant/es/swipe';
import SwipeItem from 'vant/es/swipe-item';
import Icon      from 'vant/es/icon';
import { 
  initLogin,
  removeLocalKey,
  filterAllSpace,
  filterAllTag,
} from '/common/utils';
import {
  activityStateList,
} from '/common/data';

Page({
  components: {
    Banner,
    [Skeleton.name]: Skeleton,
    [Empty.name]: Empty,
    [Button.name]: Button,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Icon.name]: Icon,
  },

  data() {
    return {
      id: this.$route.query.id,
      // id: 11,
      activityDetail: {},
      imageList: [],
      questionnaire_id: '',
      currentActivityState: {},
      isShowEmpty: false,

      // 关注
      followLoading: false,

      // 已报名
      signedUpUserListLoading: false,
      signedUpUserList: [],

      // 筛选通过分页
      filterPassedUserListLoading: false,
      filterPassedUserListPage: 1,
      filterPassedUserList: [],
      filterPassedUserListHasMore: true,

      // 贡献榜分页
      contributionUserListLoading: false,
      contributionUserListPage: 1,
      contributionUserList: [],
      contributionUserListHasMore: true,

      // 报告列表
      isShowReport: false,
      reportListLoading: false,
      reportList: [],

      defaultAvatar: 'https://p4.ssl.qhimg.com/d/inn/2c29efb0f3ff/default-avatar.jpg',
    }
  },
  onLoad: function () {
    // Do some initialize when page load.

    // 此页为必须登录, 才可展示页面(随后放在onShow中, 每次进入页面数据都是最新的)
    initLogin()
    .then((data) => {
      console.log('初始化登录成功后', data);
      this.fetchData(true);
    })
    .catch(e => {
      console.log('初始化登录失败后', e);
    });

    // 模拟筛选通过列表点击加载
    // this.getList();
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
      title: this.activityDetail.name,
      path: `/pages/activity/index?id=${this.id}`,
      // imageUrl: this.activityDetail.main_image,
    }
  },

  methods: {
    fetchData(isFetchList = false) {
      return api.getActivityDetail(this.id)
      .then(({ data }) => {
        console.log('活动详情', data);
        const { code, msg } = data;

        if (code === 200) {
          // data.data.status = 2;
          // data.data.reg_status = 1;
          this.activityDetail = data.data;
          this.imageList = JSON.parse(this.activityDetail.image);
          this.questionnaire_id =
            this.activityDetail.link.slice(this.activityDetail.link.indexOf('sv/') + 3);

          // 设置title
          qh.setNavigationBarTitle({
            title: this.activityDetail.name,
          });

          // 获取不到 globalData 中的数据
          // const appInstance = getApp();
          // const activityStateList = appInstance.globalData.get('activityStateList');
          this.currentActivityState =
            activityStateList.filter(activityState => activityState.value === this.activityDetail.status)[0];

          if (isFetchList) this.fetchList();

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
              // 登录成功后 刷新接口(代替刷新页面)
              this.fetchData(true);
            }).catch(e => {
              console.log('token异常, 进行登录错误', e);
            });
          }

          if (code === 405) {
            // 活动不存在或下线
            this.isShowEmpty = true;
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

    fetchList() {
      // 请求已报名接口
      if ([3, 4, 5, 6].includes(this.activityDetail.status)) {
        this.getActivitySignedUpUserList();
      }

      // 请求 筛选通过 和 贡献榜 接口
      if ([4, 5, 6].includes(this.activityDetail.status)) {
        // 关注接口会刷新接口, 重置数组(这里暂时关注接口不刷新下方3个列表接口, 列表接口响应太频繁)
        this.filterPassedUserListPage = 1;
        this.filterPassedUserList = [];
        this.contributionUserListPage = 1;
        this.contributionUserList = [];

        this.getActivityFilterPassedUserList();
        this.getActivityContributionList();
      }

      // 请求 报告列表 接口
      if (this.activityDetail.status === 6) {
        this.getActivityReportList();
      }
    },

    handleUpdateFollowStatus() {
      if (this.followLoading) return;
      this.followLoading = true;

      const { attention_status, id } = this.activityDetail;
      const type = attention_status === 2 ? 'cancel' : 'add';

      api.updateFollowStatus(type, id)
      .then(({ data }) => {
        console.log('关注接口', data);
        const { code, msg } = data;

        if (code === 200) {
          this.fetchData()
          .then(data => {
            this.followLoading = false;

            qh.showToast({
              icon: 'success',
              title: type === 'cancel' ? '取消关注成功' : '关注成功',
            });
          });
        } else {
          this.followLoading = false;
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
              // 登录成功后 刷新接口(代替刷新页面)
              this.fetchData();
            }).catch(e => {
              console.log('token异常, 进行登录错误', e);
            });
          }

        }

      })
      .catch(e => {
        this.followLoading = false;
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    getActivitySignedUpUserList() {
      if (this.signedUpUserListLoading) return;
      this.signedUpUserListLoading = true;

      api.getActivitySignedUpUserList(this.id, {
        limit: 8,
      })
      .then(({ data }) => {
        console.log('已报名用户接口', data);
        const { code, msg } = data;

        if (code === 200) {
          // 模拟数据start
          // data.data = [
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01547e7fd54c9cbfeb.jpg",
          //     "name": "张三",
          //     "uid": 3
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01c339310ec6b6883d.jpg",
          //     "name": "李四",
          //     "uid": 2
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "",
          //     "name": "王六",
          //     "uid": 1
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01219ecfbfd2211064.jpg",
          //     "name": "王六",
          //     "uid": 4
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01c339310ec6b6883d.jpg",
          //     "name": "王六",
          //     "uid": 5
          //   },
          // ];
          // 模拟数据end
          this.signedUpUserList = data.data;
        } else {
          qh.showToast({
            title: `${msg}`,
          });
        }

        this.signedUpUserListLoading = false;
      })
      .catch(e => {
        this.signedUpUserListLoading = false;
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    getList() {
      if (this.filterPassedUserListLoading) return;
      this.filterPassedUserListLoading = true;

      api.getActivityList({
        page: this.filterPassedUserListPage,
        limit: 18,
      })
      .then(({ data: { data } }) => {
        console.log('列表接口', data)

        const { list, total } = data;

        this.filterPassedUserList = this.filterPassedUserList.concat(list);
        this.filterPassedUserListPage ++;

        if (this.filterPassedUserList.length >= total) {
          this.filterPassedUserListHasMore = false;
        }

        this.filterPassedUserListLoading = false;
      })
      .catch(e => {
        this.filterPassedUserListLoading = false;
        console.log('e', e);
      })

    },

    getActivityFilterPassedUserList() {
      if (this.filterPassedUserListLoading) return;
      this.filterPassedUserListLoading = true;

      api.getActivityFilterPassedUserList(this.id, {
        page: this.filterPassedUserListPage,
        limit: 18,
      })
      .then(({ data }) => {
        console.log('筛选通过接口', data);
        const { code, msg } = data;

        if (code === 200) {
          const { data: { list, total }} = data;
          // 模拟数据start
          // const list = [
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01547e7fd54c9cbfeb.jpg",
          //     "name": "张三",
          //     "uid": 3
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01c339310ec6b6883d.jpg",
          //     "name": "李四",
          //     "uid": 2
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "",
          //     "name": "王六",
          //     "uid": 1
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01219ecfbfd2211064.jpg",
          //     "name": "王六",
          //     "uid": 4
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01c339310ec6b6883d.jpg",
          //     "name": "王六",
          //     "uid": 5
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01c339310ec6b6883d.jpg",
          //     "name": "adas",
          //     "uid": 6
          //   },
          // ];

          // const total = 5;
          // 模拟数据end
          this.filterPassedUserList = this.filterPassedUserList.concat(list);
          this.filterPassedUserListPage ++;

          if (this.filterPassedUserList.length >= total) {
            this.filterPassedUserListHasMore = false;
          }
        } else {
          qh.showToast({
            title: `${msg}`,
          });
        }

        this.filterPassedUserListLoading = false;
      })
      .catch(e => {
        this.filterPassedUserListLoading = false;
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    getActivityContributionList() {
      if (this.contributionUserListLoading) return;
      this.contributionUserListLoading = true;

      api.getActivityContributionList(this.id, {
        page: this.contributionUserListPage,
        limit: 18,
      })
      .then(({ data }) => {
        console.log('贡献榜接口', data);
        const { code, msg } = data;

        if (code === 200) {
          const { data: { list, total }} = data;
          // 模拟数据start
          // const list = [
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01547e7fd54c9cbfeb.jpg",
          //     "count": 6,
          //     "name": "张三",
          //     "uid": 3
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01c339310ec6b6883d.jpg",
          //     "count": 6,
          //     "name": "李四",
          //     "uid": 2
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "",
          //     "count": 6,
          //     "name": "王六",
          //     "uid": 1
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01219ecfbfd2211064.jpg",
          //     "count": 6,
          //     "name": "王六",
          //     "uid": 4
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01c339310ec6b6883d.jpg",
          //     "count": 6,
          //     "name": "王六",
          //     "uid": 5
          //   },
          //   {
          //     "act_id": 9,
          //     "avatar_url": "https://p480.ssl.qhimgs4.com/t01c339310ec6b6883d.jpg",
          //     "count": 6,
          //     "name": "adas",
          //     "uid": 6
          //   },
          // ];

          // const total = 5;
          // 模拟数据end
          this.contributionUserList = this.contributionUserList.concat(list);
          this.contributionUserListPage ++;

          if (this.contributionUserList.length >= total) {
            this.contributionUserListHasMore = false;
          }
        } else {
          qh.showToast({
            title: `${msg}`,
          });
        }

        this.contributionUserListLoading = false;
      })
      .catch(e => {
        this.contributionUserListLoading = false;
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    getActivityReportList() {
      api.getActivityReportList(this.id, {
        limit: 100,
      })
      .then(({ data }) => {
        console.log('报告列表接口', data);
        const { code, msg } = data;

        if (code === 200) {
          this.reportList = data.data;
        } else {
          qh.showToast({
            title: `${msg}`,
          });
        }

        this.isShowReport = true;
      })
      .catch(e => {
        this.isShowReport = true;
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    handleClickStateButton() {
      const { id, name, reg_status, status, cid } = this.activityDetail;

      if (reg_status === 2 && status === 4) {
        qh.navigateTo({
          url: `/pages/feedbackForm/index?activity_id=${id}&activity_name=${name}`,
        });
        return;
      }

      if (status === 2) {
        cid ?
        qh.navigateTo({
          url: `/pages/convention/index?id=${cid}&questionnaire_id=${this.questionnaire_id}`,
        }) :
        qh.alert({
          title: '提示',
          message: '即将跳转问卷小程序, 进行报名, 提交成功后, 即完成报名.',
          buttonName: '确定',
          success: res => {
            console.log('用户点击确定', res);
            qh.navigateToMiniProgram({
              appId: '7652669648848144',
              path: `pages/view/index?id=${this.questionnaire_id}`,
              success: res => {
                console.log('跳转小程序成功', res);
              },
            });
          },
        });
        return;
      }

      qh.alert({
        title: '提示',
        message: this.currentActivityState.detailMessage,
        buttonName: '好的',
      });
    },

    handleGoToHomePage() {
      qh.navigateBack({
        delta: 1,
      });
    },

    handlePreviewImage(e) {
      if (e.target.nodeName == 'IMG') {
        // console.log('src', [e.target.currentSrc]);
        qh.previewImage({
          images: [e.target.currentSrc],
          current: e.target.currentSrc,
        });
      } else {
        // console.log("点击内容不为img")
      }
    },

    handleGoToReportDetail(id) {
      qh.navigateTo({
        url: `/pages/handpicked/report-detail/index?id=${id}`,
      });
    },

    handleGoToReportList() {
      qh.navigateTo({
        url: `/pages/handpicked/report-list/index?id=${this.id}`,
      });
    },

    handleExplainContribution() {
      qh.alert({
        title: '产品体验贡献榜',
        message: '指筛选通过的用户提交产品反馈的次数',
        buttonName: '确认',
        success () {
          console.log('用户点击确定');
        },
      })
    },

    filterAllSpace,

    filterAllTag,

  }
})
