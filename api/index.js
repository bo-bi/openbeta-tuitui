import { get, post } from '/common/utils';

const getShareInfo = (data) => {
  // return get('https://qawapapi.bbs.360.cn/forum/share/getinfo', data);
  return get('/forum/share/getinfo', data);
}

const getCircleInfo = (data) => {
  return post('http://qaapiclub.bbs.360.cn/api/page/getcircleinfo', data);
}

export {
  getShareInfo,
  getCircleInfo,
}
