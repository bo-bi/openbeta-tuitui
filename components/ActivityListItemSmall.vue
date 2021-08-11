<template>
  <!-- 多条数据分页接口模拟 start -->
  <!-- <div class="activity-list-item-small" @click="handleGoToActivityDetail(item)">
    <div class="info">
      <p class="title text-overflow-ellipsis">
        {{ item.title }}
      </p>

      <p class="time">
        <span>发布时间：</span>
        <b>2021-06-06 12:06:06</b>
      </p>

      <p class="number">
        <span class="recruit">招募人数：16</span>
        <span class="split">｜</span>
        <span class="signed-up">已报名：1</span>
      </p>
    </div>

    <div class="cover">
      <img :src="item.url" />
    </div>

  </div> -->
  <!-- 多条数据分页接口模拟 end -->

  <div class="activity-list-item-small" @click="handleGoToActivityDetail(item)">
    <div class="info">
      <p class="title text-overflow-ellipsis">
        {{ item.name }}
      </p>

      <p class="time">
        <span>发布时间：</span>
        <b>{{ item.created_at }}</b>
      </p>

      <p class="number">
        <span class="recruit">招募人数：{{ item.recruit }}</span>
        <span class="split">｜</span>
        <span class="signed-up">已报名：{{ item.reg_count }}</span>
      </p>
    </div>

    <div class="cover">
      <img :src="item.main_image" />
    </div>

  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    }
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
  .activity-list-item-small {
    display: flex;
    justify-content: space-between;
    height: 220px;
    padding: 40px;
    margin-top: 8px;
    background-color: #FFF;
    box-sizing: border-box;

    &:first-child {
      margin-top: 0;
    }

    .info {
      .title {
        max-width: 415px;
        font-size: 30px;
        font-weight: 500;
        color: #181818;
      }

      .activity,
      .time {
        font-size: 24px;
        font-weight: 500;

        span {
          color: #181818;
          letter-spacing: 1px;
        }

        b {
          color: rgba(0, 0, 0, 0.5);
        }
      }

      .activity {
        max-width: 410px;
        margin-top: 8px;
      }

      .time {
        margin-top: 22px;
      }

      .time {
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

    .cover {
      width: 220px;
      height: 140px;
      background-color: #F2F3F5;
      border-radius: 12px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

  }
</style>
