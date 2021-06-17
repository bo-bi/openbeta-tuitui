Page({
  methods: {
    login() {
      qh.login({
        success(res) {
          console.log('res', res)
          // 再将获得到的数据, 发送接口获得个人信息
          /**
           * {
           *  "appid":"723038392984431", // 小程序ID
           *  "msgSignature":"s8bdfd3036255f7001e71fd29a2b141df21472677", // 消息体签名
           *  "nonce":"F85QMVN2h", // 随机字符串
           *  "timeStamp":"1594265911", // 11位时间戳
           *  "encrypt":"fafOPXXZzQemsQ%3D", // 经过加密的消息体，encrypt经过⼀系列解密步骤后，得
           *  到ticket
           * }
           */
        },
      })
    },
  },
})
