import { get, post } from '/common/utils';

// 测试用
const getActivityListWG = (data) => {
  return post('http://qaapiclub.bbs.360.cn/api/resource/imagelist', data);
}

const login = (params) => {
  return post('/api/login', params);
}

const getBannerList = () => {
  return get('/api/index/banner/list');
}

const getActivityList = (type, params) => {
  switch (type.value) {
    case 'index':
      return get('/api/index/activity/list', params);
    case 'joined':
      return get('/api/user/reg/activity/list', params);
    case 'followed':
      return get('/api/user/attention/activity/list', params);
    case 'published':
      return get(`/api/user/send/activity/list`, params);
    case 'feedback':
      return get(`/api/user/opinion/feedback/list`, params);
    default:
      return post('http://qaapiclub.bbs.360.cn/api/resource/imagelist', params);
  }
}

const getMyDetail = () => {
  return get('/api/user/show');
}

const getActivityDetail = (id) => {
  return get(`/api/activity/show/${id}`);
}

const updateFollowStatus = (type, id) => {
  return post(`/api/attention/${type}/${id}`);
}

const getActivitySignedUpUserList = (id, params) => {
  return get(`/api/activity/user/${id}`, params);
}

const getActivityFilterPassedUserList = (id, params) => {
  return get(`/api/activity/pass/user/${id}`, params);
}

const getActivityContributionList = (id, params) => {
  return get(`/api/activity/feedback/user/${id}`, params);
}

const getConventionDetail = (id) => {
  return get(`/api/convention/show/${id}`);
}

const getFeedbackDetail = (id, params) => {
  return get(`/api/feedback/show/${id}`, params);
}

const addActivityFeedback = (id, params) => {
  return post(`/api/feedback/add/${id}`, params);
}

const updateActivityFeedback = (id, params) => {
  return post(`/api/feedback/update/${id}`, params);
}

export {
  getActivityListWG,

  login,
  getBannerList,
  getActivityList,
  getMyDetail,
  getActivityDetail,
  updateFollowStatus,
  getActivitySignedUpUserList,
  getActivityFilterPassedUserList,
  getActivityContributionList,
  getConventionDetail,
  getFeedbackDetail,
  addActivityFeedback,
  updateActivityFeedback,
}
