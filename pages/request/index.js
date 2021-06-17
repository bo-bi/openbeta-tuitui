import * as api from '/api';

Page({
  methods: {
    handleGet() {
      api.getShareInfo({
        biz_data: {
          type: 6,
        }
      })
        .then(({ errno, data }) => {
          console.log('data', data);
          console.log('errno', errno);
        })
        .catch(err => {
          console.log('err', err);
        })
    },

    handlePost() {
      api.getCircleInfo({
        target: 'wg',
      })
        .then(({ errno, data }) => {
          console.log('errno', errno);
          console.log('data', data);
        })
        .catch(err => {
          console.loh('err', err)
        })
    },

    async test() {
      let getData = await api.getShareInfo({
        biz_data: {
          type: 6,
        }
      });

      let postData = await api.getCircleInfo({
        target: 'wg',
      });

      console.log('getData', getData);
      console.log('postData', postData);
    },
  },
})
