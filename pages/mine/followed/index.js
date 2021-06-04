import ActivityList from '/components/ActivityList.vue';
import Empty        from 'vant/es/empty';

Page({
  components: {
    ActivityList,
    [Empty.name]: Empty,
  },
})
