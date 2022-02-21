let apiAddress;

const environment = 'dev';

// 推推小程序无正式、测试环境之分, 会将小程序文件下载到本地, 所以接口域名只能写死
if (environment === 'pro') {
  window.isProduction = true
  window.environment = 'pro'
  window.ACCESS_TOKEN = 'access_token_product'
  window.REPORT_VIEW_LIST = 'report_view_list_product'
  apiAddress = 'https://innertestapi.bbs.360.cn'
} else {
  window.isProduction = false
  window.environment = 'dev'
  window.ACCESS_TOKEN = 'access_token_dev'
  window.REPORT_VIEW_LIST = 'report_view_list_dev'
  apiAddress = 'http://qainnertestapi.bbs.360.cn'
}

window.API_ADDRESS = apiAddress

export default apiAddress
