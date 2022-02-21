<template>
  <div class="handpicked-section-item">
    <p class="title text-overflow-ellipsis">{{ item.name }}</p>

    <span class="more" @click="handleGoToReportList(item.act_id)">...</span>

    <handpicked-report-list-item
      v-for="(subItem, index) in item.child"
      :key="index"
      :item="subItem"
    >
    </handpicked-report-list-item>
  </div>
</template>

<script>
import HandpickedReportListItem from './HandpickedReportListItem.vue';

export default {
  components: {
    HandpickedReportListItem,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  methods: {
    handleGoToReportList(act_id) {
      qh.navigateTo({
        url: `/pages/handpicked/report-list/index?id=${act_id}`,
      });
    },
  }
}
</script>

<style lang="scss">
  .handpicked-section-item {
    position: relative;
    padding: 28px 24px 30px;
    margin-top: 12px;
    background-color: #FFF;
    border-radius: 16px;

    &:first-child {
      margin-top: 0;
    }

    .title {
      width: 500px;
      font-size: 32px;
      font-weight: 500;
      color: #181818;
      height: 44px;
      line-height: 44px;
    }

    .more {
      position: absolute;
      right: 30px;
      top: 10px;
      width: 50px;
      font-size: 40px;
      font-weight: 500;
      text-align: center;
    }

    .handpicked-report-list-item {
      padding: 0;
      margin-bottom: 30px;

      &:nth-child(3) {
        margin-top: 25px;
      }

      &:last-child {
        margin-bottom: 0;
      }

      .right {
        width: 562px;
      }
    }
  }
</style>
