<template>
  <!-- 多条数据分页接口模拟 start -->
  <!-- <div class="feedback-list-item" @click="handleGoToDetail(item)">
    <div class="info">
      <p class="title text-overflow-ellipsis">
        {{ item.title }}
      </p>

      <p class="activity">
        <span>提交于：</span>
        <b>扫地机x1000产品内测活动</b>
      </p>

      <p class="time">
        <span>提交时间：</span>
        <b>2021-01-01</b>
      </p>
    </div>

    <div class="cover">
      <img :src="item.url" />
    </div>
  </div> -->
  <!-- 多条数据分页接口模拟 end -->

  <div class="feedback-list-item" @click="handleGoToDetail(item)">
    <div class="info">
      <p class="title text-overflow-ellipsis">
        {{ item.name }}
      </p>

      <p class="activity text-overflow-ellipsis">
        <span>提交于：</span>
        <b>{{ item.act_name }}</b>
      </p>

      <p class="time">
        <span>提交时间：</span>
        <b>{{ item.submit_time }}</b>
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
    },

    type: {
      type: String,
    },
  },

  methods: {
    handleGoToDetail(item) {
      const { id, act_id, act_name } = item;

      if (this.type === 'feedback') {
        qh.navigateTo({
          url: `/pages/feedbackForm/index?id=${id}&activity_id=${act_id}&activity_name=${act_name}`,
        });
      }

      if (this.type === 'draft') {
        qh.navigateTo({
          url: `/pages/draft/index?id=${id}&activity_id=${act_id}&activity_name=${act_name}`,
        });
      }
    },

  },

};
</script>

<style lang="scss">
  .feedback-list-item {
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
