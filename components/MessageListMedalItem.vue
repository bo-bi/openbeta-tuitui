<template>
  <div
    class="message-list-medal-item"
    @click="handleGoToReportDetail(item.report_id)"
  >
    <div class="info">
      <img class="avatar" :src="item.avatar_url || defaultAvatar" />

      <div class="right">
        <p class="title">给您送了一枚奖章</p>
        <p class="time">{{ item.created_at }}</p>
      </div>
    </div>

    <div class="report-detail">
      <div class="cover">
        <img class="activity-cover" :src="item.main_image" />
      </div>

      <div class="right">
        <p class="title text-overflow-ellipsis">{{ item.name }}</p>
        <p class="content text-overflow-ellipsis">
          {{
            filterAllSpace(filterAllTag(item.content_modify || item.content || '...')) 
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  filterAllTag,
  filterAllSpace,
} from '/common/utils';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      defaultAvatar: 'https://p4.ssl.qhimg.com/d/inn/2c29efb0f3ff/default-avatar.jpg',
    }
  },

  methods: {
    handleGoToReportDetail(id) {
      qh.navigateTo({
        url: `/pages/handpicked/report-detail/index?id=${id}`,
      });
    },

    filterAllTag,

    filterAllSpace,

  },

};
</script>

<style lang="scss">
  .message-list-medal-item {
    padding: 40px;
    margin-top: 8px;
    background-color: #FFF;
    box-sizing: border-box;

    &:first-child {
      margin-top: 0;
    }

    .info {
      display: flex;

      .avatar {
        width: 64px;
        height: 64px;
        background-color: #EFEFEF;
        border-radius: 50%;
        border: 2px solid #D8D8D8;
        box-sizing: border-box;
      }

      .right {
        margin-left: 16px;

        .title {
          position: relative;
          font-size: 30px;
          color: #181818;
          line-height: 42px;

          &::after {
            position: absolute;
            right: -40px;
            content: '';
            width: 30px;
            height: 36px;
            background: url("https://p5.ssl.qhimg.com/t0127dd4becaca61188.png") no-repeat;
            background-size: 100%;
          }
        }

        .time {
          margin-top: 2px;
          font-size: 24px;
          color: rgba(0, 0, 0, 0.5);
          line-height: 34px;
        }
      }
    }

    .report-detail {
      display: flex;
      width: 100%;
      height: 140px;
      margin-top: 15px;
      background-color: #F6F6F6;
      border-radius: 6px;

      .cover {
        width: 220px;
        height: 140px;
        border-radius: 6px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .right {
        width: calc(100% - 220px);
        padding: 24px 20px 0;
        font-size: 28px;
        color: #181818;
        line-height: 40px;
        box-sizing: border-box;

        .content {
          margin-top: 8px;
          font-size: 24px;
          color: #6D6D6D;
          line-height: 40px;
        }
      }
    }
  }
</style>
