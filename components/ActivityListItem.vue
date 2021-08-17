<template>
  <!-- 多条数据分页接口模拟 start -->
  <!-- <div class="activity-list-item" @click="handleGoToActivityDetail(item)">
    <div class="cover">
      <img :src="item.url" />
    </div>

    <div class="basic">
      <div class="info">
        <p class="title text-overflow-ellipsis">
          {{ item.title }} --- {{ item.id }}
        </p>
      </div>
    </div>
  </div> -->
  <!-- 多条数据分页接口模拟 end -->

  <div class="activity-list-item" @click="handleGoToActivityDetail(item)">
    <div class="cover">
      <img :src="item.main_image" />
      <span class="recommend" v-if="item.is_recommend === 1">推荐</span>
    </div>

    <div class="basic">
      <div class="info">
        <p class="title text-overflow-ellipsis">
          {{ item.name }}
        </p>

        <p class="time-remaining">
          <span>剩余时间：</span>
          <b>
            {{ current.days}}天{{ current.hours}}时{{ current.minutes}}分{{ current.seconds}}秒
          </b>
        </p>

        <p class="number">
          <span class="recruit">招募人数：{{ item.recruit }}</span>
          <span class="split">｜</span>
          <span class="signed-up">已报名：{{ item.reg_count }}</span>
        </p>
      </div>
    </div>

    <template v-if="item.reg_status === 2 && currentActivityState.value === 4">
      <div class="state-submit-feedback">
        提交反馈
      </div>
    </template>
    <template v-else>
      <div :class="currentActivityState.type">
        {{ currentActivityState.name }}
      </div>
    </template>
  </div>
</template>

<script>
// import { toRefs }       from 'vue'
import { useCountDown } from '@vant/use';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    }
  },

  setup(props) {
    // 若用 toRefs 取值方式为 item.value.status
    // const { item } = toRefs(props);

    const item = props.item;

    const appInstance = getApp();
    const activityStateList = appInstance.globalData.get('activityStateList');
    const currentActivityState =
      activityStateList.filter(activityState => activityState.value === item.status)[0];

    const countDown = useCountDown({
      // 单位毫秒
      time: item.remainder_time * 1000,
    });

    // 开始倒计时
    countDown.start();

    return {
      currentActivityState,
      current: countDown.current,
    };
  },

  methods: {
    handleGoToActivityDetail(item) {
      const { act_id } = item;

      qh.navigateTo({
        url: `/pages/activity/index?id=${act_id}`,
      });
    },

  },

};
</script>

<style lang="scss">
  .activity-list-item {
    position: relative;
    height: 538px;
    padding: 28px 40px 40px;
    margin-top: 8px;
    background-color: #FFF;
    box-sizing: border-box;

    &:first-child {
      margin-top: 0;
    }

    .cover {
      position: relative;
      width: 670px;
      height: 300px;
      background-color: #F2F3F5;
      border-radius: 12px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }

      .recommend {
        position: absolute;
        right: 0;
        top: 24px;
        width: 96px;
        height: 40px;
        font-size: 24px;
        font-weight: 500;
        color: #FFF;
        line-height: 40px;
        text-align: center;
        letter-spacing: 1px;
        background: linear-gradient(121deg, #FF76A7 0%, #BE4BFF 100%);
        border-radius: 8px 0px 0px 8px;
      }
    }

    .basic {
      .title {
        margin-top: 28px;
        font-size: 34px;
        font-weight: 500;
        color: #181818;
        letter-spacing: 1px;
      }

      .time-remaining {
        margin-top: 8px;
        font-size: 24px;

        span {
          font-weight: 500;
          color: #181818;
          letter-spacing: 1px;
        }

        b {
          color: #F5222D;
        }
      }

      .number {
        margin-top: 18px;
        font-size: 24px;
        font-weight: 500;

        .recruit {
          color: #1B69FF;
        }

        .split {
          margin: 0 4px;
          color: #767676;
        }

        .signed-up {
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }

    [class^="state-"] {
      position: absolute;
      right: 40px;
      bottom: 40px;
      width: 220px;
      height: 76px;
      font-size: 30px;
      font-weight: 500;
      color: #FFF;
      line-height: 76px;
      text-align: center;
      background-color: #3873fa;
      border-radius: 12px;

      &.state-join-now {
        background: linear-gradient(225deg, #FF6A6A 0%, #FF1818 100%);
      }
    }
  }
</style>
