<template>
  <div class="alpha-list">
    <van-list
      v-model:loading="state.loading"
      :finished="state.finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <alpha-list-item v-for="(item, index) in state.list" :key="index">
        <template #content>{{ index + 1 }}</template>
      </alpha-list-item>
    </van-list>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { List }     from 'vant';
import AlphaListItem from '/components/AlphaListItem.vue';
import * as api from '/api';

export default {
  components: {
    AlphaListItem,
    [List.name]: List,
  },

  data() {
    return {
      // page: 1,
    }
  },

  setup() {
    const state = reactive({
      list: [],
      error: false,
      loading: false,
      finished: false,

      page: 0,
      pageSize: 10,
    });

    const getActivityList = () => {
      api.getActivityList({
        cid: 1,
        page: state.page,
        limit: state.pageSize,
      })
        .then(data => {
          console.log(`${state.page}:`, data)
          state.list = state.list.concat(data.list);

          // 加载状态结束
          state.loading = false;

          // 数据全部加载完成
          if(state.list.length >= data.total) {
            state.finished = true;
          }
        });
    };

    const onLoad = () => {
      // state.page++; 不放在请求接口内部, 是因为保证当前页码是正确的
      state.page++;

      // 异步更新数据
      getActivityList();
    };

    return {
      state,
      onLoad,
    }
  },
}
</script>

<style lang="scss">
  /* 这里重置样式会转化为vw */
  /* 控制下拉列表 “加载中...” 文案 */
  .alpha-list {
    .van-list {
      .van-list__loading {
        // line-height: 100px;

        .van-loading__text {
          font-size: 30px;
          // color: green;
        }
      }
    }
  }
</style>
