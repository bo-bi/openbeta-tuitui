import { ref }      from 'vue';
import Tabs         from 'vant/es/tabs';
import Tab          from 'vant/es/tab';
import Empty        from 'vant/es/empty';
import ActivityList from '/components/ActivityList.vue';

Page({
  components: {
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Empty.name]: Empty,
    ActivityList,
  },

  setup() {
    const activeTab = ref('online');
    return {
      activeTab,
    };
  },

})
