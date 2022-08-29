<template>
  <div class="comment-box">
    <div class="fake flex-center van-hairline--top">
      <input
        class="edit-input"
        type="text" 
        placeholder="请写下你的评论吧~"
        v-model="content"
        @click="handleGetFocus"
      >
    </div>

    <ActionSheet
      v-model:show="show"
      :duration="0.1"
      :round="false"
    >
      <div class="real">
        <div class="flex-between">
          <!-- 绑定文本最后要 trim() 一下-->
          <input
            class="edit-input"
            :class="{ 'special': isShowSendButton }"
            type="text"
            placeholder="请写下你的评论吧~"
            ref="editInput"
            v-model="content"
          >

          <Button
            class="send-button"
            v-show="isShowSendButton"
            :loading="sendLoading"
            loading-text="发送中..."
            :disabled="disabled"
            @click="handleSend"
          >
            发送
          </Button>
        </div>
      </div>
    </ActionSheet>
  </div>
</template>

<script setup>
import {
  ref,
  nextTick,
  watch,
} from 'vue';
import ActionSheet from 'vant/es/action-sheet';
import Button      from 'vant/es/button';

console.log('ActionSheet', ActionSheet)

// 是否弹起键盘
let show = ref(false);
// 编辑内容
let content = ref('');
// 为了获取refs dom
const editInput = ref(null);
// 是否显示发送按钮
let isShowSendButton = ref(false);
// 发送按钮是否置灰
let disabled = ref(false);
// 发送按钮loading
let sendLoading = ref(false);

const handleGetFocus = async () => {
  // 1. setup中如何修改值: 修改其 value 属性
  show.value = true;
  /**
   * 2. setup中如何获取refs dom: 
   * <1>. 初始化ref dom变量 const editInput = ref(null);
   * <2>. HTML赋值 ref="editInput"
   * <3>. nextTick后获取其value属性 editInput.value
   */
  await nextTick();
  editInput.value.focus();
};

watch(content, (newValue, oldValue) => {
  console.log(`newValue: ${newValue}\noldValue: ${oldValue}`);
  // 显示发送按钮
  isShowSendButton.value = true;
  // 光标移动到最左边 隐藏发送按钮
  if (newValue === '') {
    isShowSendButton.value = false;
  }
  // 发送按钮是否禁止点击
  disabled.value = newValue.trim() ? false : true;
});

const handleSend = () => {
  console.log('发送');
}
</script>

<style lang="scss">
  .comment-box {
    .fake {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 16px 36px;
    }

    .edit-input {
      width: 100%;
      height: 72px;
      padding: 14px 40px;
      font-size: 28px;
      color: rgba(0, 0, 0, 0.9);
      background-color: #F3F3F3;
      border-radius: 39px;

      &::placeholder {
        font-size: 28px;
      }
    }

    .real {
      padding: 16px 36px;
      height: 176px;

      .edit-input {
        &.special {
          width: 495px;
          transition: width 0.3s;
        }
      }

      .send-button {
        width: 160px;
        height: 72px;
        font-size: 30px;
        font-weight: 500;
        color: #FFF;
        line-height: 72px;
        background-color: #1C69FE;
        border-radius: 36px;
        border: none;
      }
    }
  }
</style>
