<template>
  <div class="banner" v-if="list.length">
    <van-swipe class="banner-swipe" :autoplay="4000">
      <van-swipe-item
        v-for="(item, index) in list"
        :key="index"
      >
        <template v-if="typeof item === 'string'">
          <a :style="getBannerItemStyle(item)" @click="handleClick()"></a>
        </template>
        <template v-else>
          <a :style="getBannerItemStyle(item.image)" @click="handleClick(item)"></a>
        </template>
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
import Swipe     from 'vant/es/swipe';
import SwipeItem from 'vant/es/swipe-item';

export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },

  props: {
    // width、height 不要加 px
    // height: {
    //   type: Number,
    //   // 只能是px, vant组件内部转化不了vw, 所以这里暂时不用传height属性, 用css写, 可转化为vw
    //   default: 160,
    // },

    list: {
      type: Array,
      required: true,
    },
  },

  methods: {
    getBannerItemStyle(image) {
      return {
        // background: `url(${item.image}) center center / cover no-repeat`,
        background: `url(${image}) no-repeat`,
        backgroundSize: '100% 100%',
      };
    },

    handleClick(item) {
      if (!item) return;
      const { type, advid, image_long } = item;

      switch(type) {
        case 1:
          // 活动
          qh.navigateTo({
            url: `/pages/activity/index?id=${advid}`
          });
          break;
        case 2:
          // 公约
          qh.navigateTo({
            url: `/pages/convention/index?id=${advid}`
          });
          break;
        case 3:
          // 长图
          qh.navigateTo({
            url: `/pages/longImage/index?url=${image_long}`
          });
          break;
      }
    },

  },
};
</script>

<style lang="scss">
  .banner {
    &-swipe {
      .van-swipe-item {
        height: 330px;

        a {
          display: block;
          height: 100%;
          background-color: #f2f3f5;
        }
      }
    }

    .custom-indicator {
      position: absolute;
      left: 50%;
      bottom: 12px;
      transform: translateX(-50%);

      &-item {
        display: inline-block;
        width: 16px;
        height: 16px;
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

