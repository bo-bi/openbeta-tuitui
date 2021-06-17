Page({
  methods: {
    set() {
      qh.setStorage({
        key: 'name',
        data: '张三',
        success(res) {
          console.log('存储数据成功')
        },
      })
    },

    get() {
      qh.getStorage({
        key: 'name',
        success(res) {
          console.log('get', res)
        }
      })
    },

    remove() {
      qh.removeStorage({
        key: 'name',
        success(res) {
          console.log('删除数据成功')
        },
      })
    },

  }
})
