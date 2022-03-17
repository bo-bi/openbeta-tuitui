import { ref }              from 'vue';
import Tabs                 from 'vant/es/tabs';
import Tab                  from 'vant/es/tab';
import Empty                from 'vant/es/empty';
import HandpickedReportList from '/components/HandpickedReportList.vue';
import * as api             from '/api';

Page({
  onLoad() {
    this.getSectionDetailByActivityID();
  },

  onShareAppMessage: function () {
    return {
      title: `${this.detail.name}，快来查看~`,
      path: `/pages/handpicked/report-list/index?id=${this.id}`,
    }
  },

  components: {
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Empty.name]: Empty,
    HandpickedReportList,
  },

  setup() {
    const activeTab = ref('handpicked');
    return {
      activeTab,
    };
  },

  data() {
    return {
      id: this.$route.query.id,
      detail: {},
    }
  },

  methods: {
    getSectionDetailByActivityID() {
      api.getSectionDetailByActivityID(this.id)
      .then(({ data }) => {
        console.log('板块详情接口', data);
        const { code } = data;

        if (code === 200) {
          this.detail = data.data;

          // 设置title
          qh.setNavigationBarTitle({
            title: this.detail.name,
          });
        }
      })
    },

  },
})
