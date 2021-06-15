Page({
  methods: {
    alert() {
      qh.alert({
        message: '欢迎使用推推小程序',
        title: '提示',
        buttonName: '谢谢',
        success() {
          console.log('用户点击确定')
        },
      })
    },

    showModal() {
      qh.showModal({
        title: '标题',
        content: '内容',
        confirmText: '确定',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    },

    prompt() {
      qh.prompt({
        message: "再说⼀遍？",
        title: "提示",
        buttonLabels: ['继续', '不玩了'],
        maxLength: "200",
        success(res) {
          console.log('被点击按钮的索引值', res.buttonIndex)
          console.log('输⼊的值', res.value)
        },
      })
    },

    toast(type) {
      if (type === 'default') {
        // 默认
        qh.showToast({
          title: '默认'
        })
      }

      if (type === 'success') {
        // 成功(icon)
        qh.showToast({
          title: 'success',
          icon: 'success',
        })
      }

      if (type === 'error') {
        // 错误(icon)
        qh.showToast({
          title: 'error',
          icon: 'error',
        })
      }

      if (type === 'loading') {
        // loading(icon)
        qh.showToast({
          title: 'loading',
          icon: 'loading',
        })
      }

      if (type === 'none') {
        // none(icon)
        qh.showToast({
          title: '最多显示两行最多显示两行最多显示两行最多显示两行最多显示两行最多显示两行',
          icon: 'none',
        })
      }

      if (type === 'time') {
        // none(icon)
        qh.showToast({
          title: '5s',
          duration: 5000,
        })
      }
    },

    showLoading() {
      qh.showLoading({
        title: '加载中...',
      })

      setTimeout(() => {
        qh.hideLoading()
      }, 3000)
    },

    modal() {
      qh.modal({
        images: [
          "https://p0.ssl.qhmsg.com/t0116c254112f640f2f.jpg",
          "https://p0.ssl.qhmsg.com/t0166e885204d65ceb2.jpg"
        ],
        title: "更新说明",
        content: "1.功能更新2.功能更新;",
        buttonLabels: ['了解详情', '知道了'],
        success(res) {
          console.log('被点击按钮的索引值', res.buttonIndex)
        },
      })
    },

    showActionSheet() {
      qh.showActionSheet({
        itemList: ['选项一', '选项二', '选项三', '选项四'],
        itemColor: '#333333',
        success(res) {
          console.log('用户点击了第' + (res.tapIndex + 1) + '个按钮')
        },
      })
    },

    datePicker() {
      qh.datePicker({
        title: "请选择时间",
        maxDate: 1905465600000, // 2030-5-20
        minDate: 1274313600000, // 2010-5-20
        activeDate: new Date().getTime(),
        type: 'yyyy-MM-dd',
        success(res) {
          console.log(res)
        },
      })
    },

    // cascaded=false时，例1
    multiPicker1() {
      const range = [
        ['米饭', '馒头', '饼'],
        ['土豆', '白菜', '青椒']
      ]

      // 注意：如果picker列数为1，range数据结构仍会是二维数组：const range = [ ['米饭', '馒头', '饼'] ]
      qh.multiPicker({
        cascaded: false,
        headerText: "想吃什么组合？",
        range,
        success(res) {
          if (res.confirm) {
            console.log('吃' + range[0][res.value[0]] + '和' + range[1][res.value[1]])
          }
        },
      })
    },

    // cascaded=false时，例2
    multiPicker2() {
      const range = [
        [{ txt: '米饭' }, { txt: '馒头' }, { txt: '饼' }],
        [{ txt: '土豆' }, { txt: '白菜' }, { txt: '青椒' }]
      ]

      qh.multiPicker({
        cascaded: false,
        headerText: "想吃什么组合？",
        range,
        rangeKey: 'txt',
        success(res) {
          if (res.confirm) {
            console.log('吃' + range[0][res.value[0]]['txt'] + '和' + range[1][res.value[1]]['txt'])
          }
        },
      })
    },

    // cascaded=true时，例3
    multiPicker3() {
      // 2列range数据结构示例：
      // const range = [
      //   {
      //     txt: '北京',
      //     children: [
      //       {
      //         txt: '朝阳'
      //       },
      //       {
      //         txt: '海淀'
      //       }
      //     ]
      //   },
      //   {
      //     txt: '上海',
      //     children: [
      //       {
      //         txt: '徐汇'
      //       },
      //       {
      //         txt: '杨浦'
      //       }]
      //   }
      // ]

      // 3列range数据结构示例：
      const range = [
        {
          txt: '北京',
          children: [
            {
              txt: '朝阳',
              children: [
                { txt: '望京' },
                { txt: '国贸' }
              ]
            },
            {
              txt: '海淀',
              children: [
                { txt: '中关村' },
                { txt: '五棵松' }
              ]
            }
          ]
        },
        {
          txt: '上海',
          children: [
            {
              txt: '浦东',
              children: [
                { txt: '花木街道' },
                { txt: '洋泾街道' },
              ]
            },
            {
              txt: '黄浦',
              children: [
                { txt: '外滩街道' },
                { txt: '豫园街道' },
                { txt: '小东门街道' },
              ],
            }
          ]
        }
      ]

      qh.multiPicker({
        cascaded: true,
        headerText: "你是哪里人？",
        range,
        rangeKey: 'txt',
        success(res) {
          console.log('res', res)
          if (res.confirm) {
            console.log('我是' + range[res.value[0]]['txt'] + '-' + range[res.value[0]].children[res.value[1]]['txt'] + '人')
          }
        },
      })
    },

    setNavigationBarTitle() {
      qh.setNavigationBarTitle({
        title: '今天星期二',
        textStyle: "black",
      })
    },

    setNavigationBarColor() {
      qh.setNavigationBarColor({
        backgroundColor: '#f7f8fe',
      })
    },

  },
})
