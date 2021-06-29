<template>
  <div class="banner" v-if="list.length">
    <van-swipe :height="height" :autoplay="4000">
      <van-swipe-item
        v-for="(item, index) in list"
        :key="index"
      >
        <a :style="getBannerItemStyle(item)" @click="handleClick"></a>
      </van-swipe-item>

      <!-- 自定义指示器 -->
      <template #indicator="{ active }" v-if="list.length > 1">
        <div class="custom-indicator">
          <span
            class="custom-indicator-item"
            :class="{ 'active': active === index }"
            v-for="(item, index) in list"
            :key="index"
          >
          </span>
        </div>
      </template>

    </van-swipe>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from "vant";

export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },

  props: {
    // width、height 不要加 px
    height: {
      type: Number,
      // 只能是px, vant组件内部转化不了vw
      default: 160,
    },

    list: {
      type: Array,
      required: true,
    },
  },

  methods: {
    getBannerItemStyle(item) {
      return {
        // background: `url(${item.image}) center center / cover no-repeat`,
        background: `url(${item.image}) no-repeat`,
        backgroundSize: '100% 100%',
      };
    },

    handleClick(event) {
      console.log('event', event);
    },

  },
};
</script>

<style lang="scss">
  .banner {
    a {
      display: block;
      height: 100%;
      background-color: #f2f3f5;
    }

    .custom-indicator {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);

      &-item {
        display: inline-block;
        width: 13px;
        height: 13px;
        margin: 0 10px;
        background-color: rgba(255, 255, 255, .3);
        border-radius: 50%;

        &.active {
          background-color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
</style>

