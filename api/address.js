let apiAddress;

// 推推小程序无正式、测试环境之分, 会将小程序文件下载到本地, 所以接口域名只能写死
if (location.host === 'xxx') {
  window.isProduction = true
  window.environment = 'pro'
  apiAddress = 'https://innertestapi.bbs.360.cn'
} else if (location.host === '10.0.2.2:3360') {
  // 10.0.2.2:3360 为本地启动的服务
  window.isProduction = true
  window.environment = 'test'
  apiAddress = 'http://qainnertestapi.bbs.360.cn'
} else {
  window.isProduction = false
  window.environment = 'dev'
  // apiAddress = 'https://innertestapi.bbs.360.cn'
  apiAddress = 'http://qainnertestapi.bbs.360.cn'
}

window.API_ADDRESS = apiAddress

export default apiAddress
