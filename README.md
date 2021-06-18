- app.scss
  是全局css, 相当于global.css, 可放置 全局公共样式、重置UI组件的样式
  此处当global.css
  reset.css 按单独文件引入

- 全局scss
  reset.scss     放置重置UI库的样式, 只在app.scss中引入一次
  variables.scss 放置公共变量、函数, 哪里需要用, 哪里就需要再引一次, 小程序这么不能全局只引入一次, 其他地方就不用引

scss 与 stylus 区别 https://www.cnblogs.com/fiona-zhong/p/13303582.html


小程序组件只能按需引入, 某个页面用某个页面按需引入局部注册使用, 无法注册全局组件
