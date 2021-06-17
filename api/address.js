let apiAddress;

if (location.host === 'faq.admin2.bbs.360.cn') {
  window.isProduction = true
  window.environment = 'pro'
  apiAddress = 'https://faqapi.bbs.360.cn'
} else if (location.host === 'qa.admin2.qihoo.net') {
  window.isProduction = true
  window.environment = 'test'
  apiAddress = '//qafaqapi.bbs.360.cn'
} else {
  window.isProduction = false
  window.environment = 'dev'
  // apiAddress = '//qafaqapi.bbs.360.cn'
  apiAddress = 'http://qawapapi.bbs.360.cn'
}

window.API_ADDRESS = apiAddress

export default apiAddress
