import { get, post } from '/common/utils';

const getShareInfo = (data) => {
  // return get('https://qawapapi.bbs.360.cn/forum/share/getinfo', data);
  return get('/forum/share/getinfo', data);
}

const getCircleInfo = (data) => {
  return post('http://qaapiclub.bbs.360.cn/api/page/getcircleinfo', data);
}

// 小程序有专门上传文件的api, 不用调用接口
const upload = (data) => {
  return post('http://inn.qiwoo.org/api/uploadfile', data);
}

export {
  getShareInfo,
  getCircleInfo,
  upload,
}
