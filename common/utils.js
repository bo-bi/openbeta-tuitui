import apiAddress from '/api/address'
import * as api   from '/api'

const get = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    qh.getStorage({
      key: 'access_token',
      success(access_token) {
        // 必须有success, complete 才有
      },
      complete(access_token) {
        console.log('get access_token', access_token)

        qh.request({
          url: apiAddress + url,
          method: 'GET',
          data,
          header: {
            Authorization: `Bearer ${access_token}`,
          },
          success(res) {
            resolve(res)
          },
          fail(err) {
            reject(err)
          }
        })
      }
    })
  })
}

const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    qh.getStorage({
      key: 'access_token',
      success(access_token) {
        // 必须有success, complete 才有
      },
      complete(access_token) {
        console.log('post access_token', access_token)

        qh.request({
          url: apiAddress + url,
          method: 'POST',
          data,
          header: {
            Authorization: `Bearer ${access_token}`,
          },
          success(res) {
            resolve(res)
          },
          fail(err) {
            reject(err)
          }
        })
      }
    })
  })
}

const uploadImage = (filePath) => {
  return new Promise((resolve, reject) => {
    qh.getStorage({
      key: 'access_token',
      success(access_token) {
        // 必须有success, complete 才有
      },
      complete(access_token) {
        console.log('uploadImage access_token', access_token)

        qh.uploadFile({
          url: apiAddress + '/api/upload/image',
          filePath,
          name: 'file',
          header: {
            Authorization: `Bearer ${access_token}`,
          },
          success(res) {
            resolve(res)
          },
          fail(err) {
            reject(err)
          }
        })
      }
    })
  })
}

// const login = (callback) => {
//   qh.login({
//     success(res) {

//       api.login(res)
//       .then(({ data }) => {
//         const { code, msg } = data;
//         if (code === 200) {
//           const { data: { access_token } } = data;
//           update_access_token(access_token, callback);
//         } else {
//           qh.showToast({
//             title: `登录失败, ${msg}`,
//           })
//         }

//       })
//       .catch(e => {
//         console.log('e', e)
//         /**
//          * 安卓取 e.data && e.data.detailMessage
//          * ios取 e.errmsg
//          *
//          * 不管自身代码success中错误进入catch
//          *
//          */
//         qh.alert({
//           title: '登录失败提示',
//           message: `${(e.data && e.data.detailMessage) || e.errmsg}`,
//           buttonName: '关闭',
//         });
//       });

//     },
//     fail(e) {
//       qh.showToast({
//         title: `SSO获取失败, ${e.errmsg}`,
//       })
//     }
//   })
// }

// const initLogin = (callback) => {
//   qh.getStorage({
//     key: 'access_token',
//     success(res) {
//       if (res) return
//       login(callback)
//     },
//   })
// }

// const update_access_token = (data, callback) => {
//   qh.setStorage({
//     key: 'access_token',
//     data,
//     success() {
//       qh.showToast({
//         title: `登录成功`,
//       })

//       if (callback) callback()
//     },
//   })
// }

const initLogin = () => {
  return new Promise((resolve, reject) => {
    // 获取本地存储的token start
    qh.getStorage({
      key: 'access_token',
      success: access_token => {
        // 若本地存储存在token 直接resolve出去(若本地存储的token已过期, 需在此处之前先清除)
        if (access_token) return resolve(access_token)

        // 若不存在
        // 获取SSO参数start
        qh.login({
          success: SSO => {

            // 调用登录接口start
            api.login(SSO)
            .then(({ data }) => {
              const { code, msg } = data
              if (code === 200) {
                const { data: { access_token } } = data

                // 将接口返回token存储到本地
                qh.setStorage({
                  key: 'access_token',
                  data: access_token,
                  success: () => {
                    qh.showToast({
                      title: `登录成功`,
                    })

                    resolve(access_token)
                  },
                })

              } else {
                qh.showToast({
                  title: `登录失败, ${msg}`,
                })
                reject('登录接口返回code非200')
              }

            })
            .catch(e => {
              console.log('e', e)
              /**
               * 安卓取 e.data && e.data.detailMessage
               * ios取 e.errmsg
               *
               * 不管自身代码success中错误进入catch
               *
               */
              qh.alert({
                title: '登录失败提示',
                message: `${(e.data && e.data.detailMessage) || e.errmsg}`,
                buttonName: '关闭',
              });
              reject('未能正常调起登录接口')
            })
            // 调用登录接口end
          },
          fail(e) {
            qh.showToast({
              title: `SSO获取失败, ${e.errmsg}`,
            })
            reject('SSO获取失败')
          }
        })
        // 获取SSO参数end
      },
    })
    // 获取本地存储的token end
  })
}

const removeLocalKey = (key) => {
  return new Promise((resolve, reject) => {
    qh.removeStorage({
      key,
      success: res => {
        resolve('删除数据成功')
      },
      fail: e => {
        reject('删除数据失败')
      },
    })
  })
}

function formatDate(timeStamp, fmt) {
  //使用 yyyy-MM-dd
  //把秒转换为毫秒
  if (timeStamp.length == 10) {
    timeStamp += '000'
  }
  fmt = fmt || "yyyy-MM-dd hh:mm:ss"
  let date = new Date(+timeStamp)
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }
  return fmt
}

export {
  get,
  post,
  uploadImage,
  initLogin,
  removeLocalKey,
  formatDate,
}
