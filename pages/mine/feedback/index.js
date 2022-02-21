import { ref }      from 'vue';
import Tabs         from 'vant/es/tabs';
import Tab          from 'vant/es/tab';
import Empty        from 'vant/es/empty';
import FeedbackList from '/components/FeedbackList.vue';
import MessageList  from '/components/MessageList.vue';
import * as api     from '/api';

Page({
  onLoad() {
    this.getUnreadMessageNumber();
  },

  onShow() {
    // Do something when page show.
    const appInstance = getApp();
    const value = appInstance.globalData.get('isNeedFreshMineFeedbackPage');

    if (value === 1) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.$refs[this.activeTab].handleReset();
    }
  },

  components: {
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Empty.name]: Empty,
    FeedbackList,
    MessageList,
  },

  setup() {
    const activeTab = ref('submitted');
    return {
      activeTab,
    };
  },

  data() {
    return {
      number: 0,
    }
  },

  watch: {
    'activeTab'(val) {
      // 切换Tab后 列表置为最上方
      document.body.scrollTop = document.documentElement.scrollTop = 0;

      if (val === 'message') this.updateReadMessage();
    },
  },

  methods: {
    getUnreadMessageNumber() {
      api.getUnreadMessageNumber()
      .then(({ data }) => {
        console.log('未读消息个数接口', data);
        const { code } = data;

        if (code === 200) {
          this.number = data.data;
        }
      })
    },

    updateReadMessage() {
      api.updateReadMessage()
      .then(({ data }) => {
        console.log('更新已读消息', data);
        const { code } = data;

        if (code === 200) {
          this.number = 0;
        }
      })
    },
  },

})
