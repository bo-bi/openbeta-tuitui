<template>
  <div
    class="handpicked-report-list-item"
    @click="handleGoToReportDetail(item.report_id || item.id)"
  >

    <div class="crown" v-if="reportListType === 'handpicked'">
      <img class="avatar" :src="item.avatar_url || defaultAvatar" />
    </div>

    <img class="avatar" v-else :src="item.avatar_url || defaultAvatar" />

    <div class="right">
      <p class="content text-overflow-line3">
        <!-- 若内容全为图片, 则显示标题 -->
        {{
          filterAllSpace(filterAllTag(item.content_modify || item.content || '...')) ?
          filterAllSpace(filterAllTag(item.content_modify || item.content || '...')) :
          (item.name_modify ? item.name_modify : item.name)
        }}
      </p>

      <div class="others">
        <span class="time">{{ item.created_at || item.submit_time }}</span>
        <span>浏览{{ item.total_view }}</span>
        <span class="medal">奖章{{ item.medal_count}}</span>
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

    reportListType: {
      type: String,
    },
  },

  data() {
    return {
      defaultAvatar: 'https://p4.ssl.qhimg.com/d/inn/2c29efb0f3ff/default-avatar.jpg',
    }
  },

  methods: {
    handleGoToReportDetail(report_id) {
      qh.navigateTo({
        url: `/pages/handpicked/report-detail/index?id=${report_id}`,
      });
    },

    filterAllTag,

    filterAllSpace,

  },
}
</script>

<style lang="scss">
  .handpicked-report-list-item {
    display: flex;
    padding: 25px 43px 25px 36px;
    margin-top: 8px;
    background-color: #FFF;

    &:first-child {
      margin-top: 0;
    }

    .avatar {
      width: 80px;
      height: 80px;
      background-color: #EFEFEF;
      border-radius: 50%;
      border: 2px solid #D8D8D8;
      box-sizing: border-box;
    }

    .right {
      width: 570px;
      margin-left: 24px;

      .content {
        font-size: 26px;
        color: #181818;
        line-height: 40px;
      }

      .others {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 24px;
        color: #B9B9B9;
        line-height: 34px;

        .time {
          margin-right: auto;
        }

        .medal {
          margin: 0 10px 0 20px;
        }
      }
    }

    .crown {
      position: relative;
      width: 96px;
      height: 112px;
      margin: -26px 0 0 -6px;
      background: url("https://p2.ssl.qhimg.com/t01b777e4174141d557.png") no-repeat;
      background-size: 96px 112px;

      .avatar {
        position: absolute;
        left: 8px;
        top: 29px;
        width: 76px;
        height: 76px;
        border: none;
      }

      & + .right {
        margin-left: 15px;
      }
    }
  }
</style>
