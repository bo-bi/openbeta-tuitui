import apiAddress from '/api/address'

const get = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    qh.request({
      url: apiAddress + url,
      method: 'GET',
      data,
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
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
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      }
    })
  })
};

export {
  get,
  post,
}
