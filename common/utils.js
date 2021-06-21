import apiAddress from '/api/address'

const get = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    qh.request({
      url: apiAddress + url,
      method: 'GET',
      data,
      success(res) {
        const { data, errno, msg } = res.data;

        if (errno === 0) {
          resolve(data);
        } else {
          reject(msg);

          qh.showToast({
            title: msg,
            icon: 'error',
          });
        }
      },
      fail(err) {
        reject(err);

        qh.showToast({
          title: err.errmsg,
          icon: 'error',
        });
      }
    })
  })
};

const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    qh.request({
      url,
      method: 'POST',
      data,
      success(res) {
        const { data, errno, msg } = res.data;

        if (errno === 0) {
          resolve(data);
        } else {
          reject(msg);

          qh.showToast({
            title: msg,
            icon: 'error',
          });
        }
      },
      fail(err) {
        reject(err);

        qh.showToast({
          title: err.errmsg,
          icon: 'error',
        });
      }
    })
  })
};

export {
  get,
  post,
}
