<template>
  <van-notice-bar
    v-if="text"
    color="#1989fa"
    background="#ecf9ff"
    left-icon="warning-o"
    :text="text"
    :scrollable="isPC ? false : true"
    :wrapable="isPC ? true : false"
  />

  <div class="rate-panel">
    <div class="rate-stars">
      <div class="item">
        <span class="name">满意度打分：</span>

        <van-rate
          class="rate-group"
          v-model="satisfaction"
          :count="10"
          icon="https://p2.ssl.qhimg.com/t015a3b4d80db5bbc59.png"
          void-icon="https://p3.ssl.qhimg.com/t0111c81dd4be9cf1c5.png"
          :readonly="readonly"
        />
      </div>

      <div class="item">
        <span class="name">推荐值打分：</span>

        <van-rate
          class="rate-group"
          v-model="recommend"
          :count="10"
          icon="https://p2.ssl.qhimg.com/t015a3b4d80db5bbc59.png"
          void-icon="https://p3.ssl.qhimg.com/t0111c81dd4be9cf1c5.png"
          :readonly="readonly"
        />
      </div>
    </div>

    <div class="reasons-container">
      <div class="item">
        <p class="title">请输入满意度打分原因：</p>

        <van-field
          class="reason-textarea"
          v-model.trim="satisfaction_reason"
          rows="1"
          autosize
          type="textarea"
          maxlength="100"
          placeholder="必填，最多输入100字"
          :readonly="readonly"
        />

      </div>
      <div class="item">
        <p class="title">请输入推荐值打分原因：</p>

        <van-field
          class="reason-textarea"
          v-model.trim="recommend_reason"
          rows="1"
          autosize
          type="textarea"
          maxlength="100"
          placeholder="必填，最多输入100字"
          :readonly="readonly"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref }   from 'vue';
import { isPC }  from '/common/utils.js';
import Rate      from 'vant/es/rate';
import Field     from 'vant/es/field';
import NoticeBar from 'vant/es/notice-bar';

export default {
  components: {
    [Rate.name]: Rate,
    [Field.name]: Field,
    [NoticeBar.name]: NoticeBar,
  },

  props: {
    readonly: {
      type: Boolean,
      default: false,
    },

    rateData: {
      type: Object,
      default() {
        return {};
      },
    },

    text: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      // 若放置在 setup 中, van-field 高度自适应失效
      satisfaction_reason: '',
      recommend_reason: '',

      isPC: isPC(),
    }
  },

  setup() {
    const satisfaction = ref(0);
    const recommend = ref(0);
    return {
      satisfaction,
      recommend,
    };
  },

  watch: {
    rateData(val) {
      const {
        satisfaction,
        recommend,
        satisfaction_reason,
        recommend_reason,
      } = val;

      this.satisfaction = satisfaction;
      this.recommend = recommend;
      this.satisfaction_reason = satisfaction_reason;
      this.recommend_reason = recommend_reason;
    },
  },

  methods: {
    handleValidate() {
      if (!this.satisfaction) {
        qh.showToast({
          title: '请对满意度打分',
        });
        return;
      }

      if (!this.recommend) {
        qh.showToast({
          title: '请对推荐值打分',
        });
        return;
      }

      if (!this.satisfaction_reason) {
        qh.showToast({
          title: '请填写满意度打分原因',
        });
        return;
      }

      if (!this.recommend_reason) {
        qh.showToast({
          title: '请填写推荐值打分原因',
        });
        return;
      }

      return true;
    },
  },
}
</script>

<style lang="scss">
  .rate-panel {
    padding: 20px 30px;
    background-color: #FFF;

    .rate-stars {
      .item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .name {
          font-size: 30px;
          font-weight: 500;
          color: #000000;
        }

        .rate-group {
          .van-icon__image {
            width: 48px;
            height: 48px;
          }
        }
      }
    }

    .reasons-container {
      height: 215px;
      overflow-y: auto;

      .item {
        .title {
          font-size: 30px;
          font-weight: 500;
          color: #000000;
        }

        .reason-textarea {
          padding: 10px 10px 10px 33px;
          line-height: 38px;

          textarea {
            font-size: 28px;
            color: #000000;

            &::placeholder {
              color: #858585;
            }
          }
        }
      }
    }
  }
</style>
