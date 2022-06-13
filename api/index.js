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
  // MessageList.vue setup 中 props 是直接取的值
  switch (type.value || type) {
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
    case 'draft':
      return get(`/api/user/opinion/feedback/draft/list`, params);
    case 'message':
      return get(`/api/user/report/medal/log`, params);
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

const getActivityReportList = (id, params) => {
  return get(`/api/activity/report/${id}`, params);
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

const getSectionList = (params) => {
  return get(`/api/forum/list`, params);
}

const getReportDetail = (id) => {
  return get(`/api/report/show/${id}`);
}

const sendReportViewDot = (id) => {
  return get(`/api/report/show/${id}`, {
    effective_status: 1,
  });
}

const addReportMedal = (id) => {
  return post(`/api/medal/add/${id}`);
}

const cancelReportMedal = (id) => {
  return post(`/api/medal/cancel/${id}`);
}

const getReportList = (id, params) => {
  return get(`/api/report/list/${id}`, params);
}

const getDraftDetail = (params) => {
  return get(`/api/feedback/draft/latest`, params);
}

const addDraft = (id, params) => {
  return post(`/api/feedback/draft/add/${id}`, params);
}

const updateDraft = (id, params) => {
  return post(`/api/feedback/draft/update/${id}`, params);
}

const getSectionDetailByActivityID = (id) => {
  return get(`/api/forum/show/${id}`);
}

const getUnreadMessageNumber = () => {
  return get(`/api/user/medal/unread`);
}

const updateReadMessage = () => {
  return post(`/api/user/medal/mark/read`);
}

const getSignUpState = (id) => {
  return get(`/api/activity/reg/user/${id}`);
}

const getQuestionnaireSettings = (id) => {
  return get(`/api/activity/questionnaire/${id}`);
}

const getQuestionnaireDetail = (id, type) => {
  if (type === 'preview') {
    return get(`/api/questionnaire/show/${id}`);
  } else {
    return get(`/api/activity/form/${id}`);
  }
}

const sendQuestionnaire = (id, params) => {
  return post(`/api/activity/submit/form/${id}`, params);
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
  getActivityReportList,
  getConventionDetail,
  getFeedbackDetail,
  addActivityFeedback,
  updateActivityFeedback,
  getSectionList,
  getReportDetail,
  sendReportViewDot,
  addReportMedal,
  cancelReportMedal,
  getReportList,
  getDraftDetail,
  addDraft,
  updateDraft,
  getSectionDetailByActivityID,
  getUnreadMessageNumber,
  updateReadMessage,
  getSignUpState,
  getQuestionnaireSettings,
  getQuestionnaireDetail,
  sendQuestionnaire,
}
