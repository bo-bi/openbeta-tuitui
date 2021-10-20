<template>
  <div class="activity-list">
    <slot name="empty" v-if="state.isShowEmpty"></slot>

    <van-pull-refresh
      v-model="state.refreshing"
      :success-text="getTime()"
      success-duration="600"
      @refresh="onRefresh"
    >

      <van-list
        v-model:loading="state.loading"
        v-model:error="state.error"
        error-text="请求失败，点击重新加载"
        :finished="state.finished"
        :finished-text="state.list.length ? '没有更多了' : ''"
        @load="onLoad"
      >

        <!--
          此处的 key 不能使用index, 要使用id, 下拉刷新后会导致新增的活动 状态 和 剩余时间 错误,
          因为使用的是index, 所以 setup 中得到的 item 还是 之前index 的item信息, 故错误
        -->
        <template v-if="size === 'big'">
          <activity-list-item
            v-for="(item, index) in state.list"
            :key="item.act_id"
            :item="item"
          >
          </activity-list-item>
        </template>

        <template v-else-if="size === 'small'">
          <activity-list-item-small
            v-for="(item, index) in state.list"
            :key="item.act_id"
            :item="item"
          >
          </activity-list-item-small>
        </template>

      </van-list>

    </van-pull-refresh>

  </div>
</template>

<script>
import { reactive, toRef }   from 'vue';
import List                  from 'vant/es/list';
import PullRefresh           from 'vant/es/pull-refresh';
import ActivityListItem      from '/components/ActivityListItem.vue';
import ActivityListItemSmall from '/components/ActivityListItemSmall.vue';
import * as api              from '/api';
import {
  removeLocalKey,
  initLogin,
  formatDate,
  isWindows,
} from '/common/utils.js';

export default {
  components: {
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    ActivityListItem,
    ActivityListItemSmall,
  },

  props: {
    type: {
      type: String,
    },

    params: {
      type: Object,
    },

    size: {
      type: String,
      default: 'big',
    },
  },

  data() {
    return {
      // page: 1,
    }
  },

  setup(props) {
    // type、params属性不一定有 所以用 toRef 包裹
    const type = toRef(props, 'type');
    const params = toRef(props, 'params');
    console.log('params', params);
    // console.log('status', params.value.status);

    const state = reactive({
      // 基础属性
      list: [],
      loading: false,
      finished: false,

      // 下拉刷新
      refreshing: false,

      // 用于请求失败显示错误提示, 点击重新触发 load
      error: false,

      // 是否为空
      isShowEmpty: false,

      // 分页
      page: 0,
      pageSize: 10,
    });

    const onLoad = () => {
      // 下拉刷新
      console.log('refreshing', state.refreshing);
      if (state.refreshing) {
        state.page = 0;
      }

      // 不放在请求接口内部, 是因为保证当前页码是正确的
      state.page ++;

      // 请求接口(需登录)
      initLogin()
      .then(data => {
        console.log('初始化登录成功后', data);
        fetchData();
      })
      .catch(e => {
        console.log('初始化登录失败后', e);
      });
    };

    const onRefresh = () => {
      state.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.loading = true;
      onLoad();
    };

    // 多条数据分页接口模拟 start
    // const fetchData = () => {
    //   api.getActivityListWG({
    //     cid: 1,
    //     page: state.page,
    //     limit: state.pageSize,
    //   })
    //   .then(({ data: { data } }) => {

    //     // 下拉刷新
    //     if (state.refreshing) {
    //       state.list = [];
    //       state.refreshing = false;
    //     }

    //     console.log(`第${state.page}页:`, data)
    //     state.list = state.list.concat(data.list);

    //     // 加载状态结束
    //     state.loading = false;

    //     // 数据全部加载完成
    //     if(state.list.length >= data.total) {
    //       state.finished = true;
    //     }
    //   })
    //   .catch((e) => {
    //     console.log('e', e+'')
    //     state.error = true;
    //   });
    // };
    // 多条数据分页接口模拟 end

    const fetchData = () => {
      api.getActivityList(type, {
        page: state.page,
        limit: state.pageSize,
        status: params.value && params.value.status,
      })
      .then(({ data }) => {
        const { code, msg } = data;

        if (code === 200) {
          // data.data.list = [];
          // data.data.total = 0;
          const { data: { list, total } } = data;

          // 是否显示空
          if (!total) {
            state.isShowEmpty = true;
          } else {
            state.isShowEmpty = false;
          }

          // 下拉刷新
          if (state.refreshing) {
            state.list = [];
            state.refreshing = false;
          }

          console.log(`第${state.page}页:`, data);
          state.list = state.list.concat(list);

          // 加载状态结束
          state.loading = false;

          // 数据全部加载完成
          if(state.list.length >= total) {
            state.finished = true;
          }

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
            }).then((data) => {
              // 登录成功后 刷新接口(代替刷新页面)
              fetchData();
            }).catch(e => {
              console.log('token异常, 进行登录错误', e);
            });
          }

        }

      })
      .catch((e) => {
        console.log('e', e);
        state.error = true;
        qh.showToast({
          title: `${e}`,
        });
      });
    };

    return {
      state,
      onLoad,
      onRefresh,
      fetchData,
    }
  },

  mounted() {
    // 临时性解决 windows 端首次进入列表加载不出来
    if (isWindows()) {
      setTimeout(() => {
          console.log('isWindows', isWindows());
          this.onLoad();
      }, 500)
    }
  },

  methods: {
    getTime() {
      console.log(formatDate(+new Date, 'hh:mm'))
      return `最后更新: 今天 ${formatDate(+new Date, 'hh:mm')}`;
    },

  },

}
</script>
