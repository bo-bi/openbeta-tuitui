- app.scss
  是全局css, 相当于global.css, 可放置 全局公共样式、重置UI组件的样式
  此处当global.css
  reset.css 按单独文件引入

- 全局scss
  reset.scss     放置重置UI库的样式, 只在app.scss中引入一次
  variables.scss 放置公共变量、函数, 哪里需要用, 哪里就需要再引一次, 小程序不能全局只引入一次, 其他地方就不用引

- 重置样式
  reset.css 写在css文件中的样式会被转化为vw
  写在js里的css不会转化为vw还是用px, 用vant的ConfigProvider组件定制样式, 就会是px不会转化, 可以在px不被转化的地方, 想用vw直接写vw, 除非涉及到计算属性只能用px, 当不知道写多少vw时, 可以计算, 也可以在css中写px, 然后看控制面板看转化为了多少vw, 计算方式如下

  我想要是160px
  1vw = 750 / 100 = 7.5px(1vw占屏幕宽的1%)
  160px / 7.5px = 21.333vw

  假如是40vw 750px的稿子
  x / 7.5px = 40vw
  x = 300px

  tab props 设置title-class 不成功, 是因为这个文件的css默认是scoped, 加上了后面这个哈希值, 所以传不进去, 可以写入公共样式内, 如reset.scss、app.scss等, 不会是局部样式
  .aaa[data-v-9bea351e] {
    color: yellow !important;
    font-size: 4vw !important;
  }
  .bbb[data-v-9bea351e] {
    color: yellowgreen !important;
    font-size: 4vw !important;
  }

  更改vant组件内部样式, 不生效, 是因为他们用的也是局部样式, 需要进行样式穿透, scss里用的::v-deep, 还要用新语法, ::v-deep(.child), 才可生效, 参考join的index.scss文件

  ::v-deep(.van-tabs__content) {
    padding-top: 76px;
  }

  ::v-deep(.van-tabs__wrap) {
    z-index: 1;
    position: fixed;
    left: 0;
    top: 0;
    min-width: calc(100% - 80px);
    padding: 0 40px;
    background-color: #FFF;

    div[role=tablist] {
      margin: 0;
      border: none;

      padding-left: 0;
      padding-right: 0;
      // padding: 18px 40px 18px 30px;

      align-items: center;
    }
  }

- 有的vant组件里传入的属性是px单位的, 在页面中是px显示, 是不能转化为vw显示的, 怎么处理?

  如果涉及到计算, 那没有办法, 只能传px
  如果只是用来展示, 可以不传属性, 用样式去写多少vw(需要将px换算成vw), 或者样式中用传的属性同样的值, postcss忽略掉这行css, 不转化为vw(scss 中文文档 https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md)

- 统一下, 凡是无法在reset.css中重置的组件公共样式, 就写在.Vue单文件里进行重置
  注意: 在reset.css 和 .Vue文件中的 style 中写的样式都会被转化为vw
        对于vant某个组件中使用的公共样式变量, 并不是这个组件自身的样式变量, 重置要写在单文件中, 不要写在reset.css中

        比如 list 组件中的加载中的样式是个公共变量, 写在了单文件中进行样式重置

        想重置list组件加载中的样式, 以下变量不写在reset.css中
        --van-loading-text-font-size: 60px !important;
        --van-loading-text-color: red !important;

        将重置样式写入单文件中
        .alpha-list {
          .van-list {
            .van-list__loading {
              line-height: 100px;

              .van-loading__text {
                color: green;
                font-size: 30px;
              }
            }
          }
        }
  备注: 不用vant的 ConfigProvider 重置样式组件, 是因为样式变量是写在js里面的, 不能自动转化为vw, 需要将px换算为vw, 再写到js里面


- import 'vant/lib/index.css';(这里我一次性引入, 并不按需引入单个组件的样式)
  在某一个页面如 home.js 中引入一次, 所有页面就都会引入vant样式
  要引vant的index.css比按需引入样式好在, 若是按需引入, 有些样式丢失, 因为按需引入的组件样式里可能依赖其他样式变量, 但是这个组件样式里没有, 还有一个好处是不需要引入每一个组件的样式

scss 与 stylus 区别 https://www.cnblogs.com/fiona-zhong/p/13303582.html


小程序组件只能按需引入, 某个页面用某个页面按需引入局部注册使用, 无法注册全局组件

- 按需引入组件例子
  1. 第一种
  // 引入组件
  import Button from 'vant/es/button';
  // 引入组件对应的样式，若组件没有样式文件，则无须引入
  import 'vant/es/button/style';

  2. 第二种
  import { Button, Swipe, SwipeItem } from 'vant';
  import 'vant/lib/index.css';

  我看了下 第一种引入组件的方式和第二种引入组件的方式, 打印的组件数据是一摸一样的


在真机上(我只试了ios), qh.showToast() 和 qh.hideLoading() 若同时存在, 只能走一个, 比如之前出现了loading, 现在有错误出现, 先showToast, 再hideLoading, 则toast不会出现, 直接消失了, 因为hideLoading在最后, 就得先写hideLoading, 再写showToast, 但是这样在模拟器里不是这么表现的, 模拟器变现是对的, showLoading必须hideLoading才可以, showToast和showLoading不会冲突.而且当出现toast后, 后面的东西还可以点.基于以上问题, 所以我用了vant的toast

而且vant的toast还可以禁止点后面的元素

以上的解决方法 可以先qh.hideLoading() 再qh.showToast() 这样就不会有问题, 但是后面的元素可以点
对于qh.showToast这样的方法, 是客户端内置的方法, 层级是最高的, 会显示在最上面, 但是vant的Toast不行, 也就是说app.html和其余页面的html是用两个webview, app.html是看不见的, 但是app.js里面的代码会执行, 所以想在app.js里面弹toast, 只能用内置的qh.showToast(), 因为可以显示在最上面

// vant的Toast 中需要vue, 小程序初始化时找不到vue, 所以在此引入, 登录会不成功, qh.showToast也不会弹
import Toast from 'vant/es/toast'
window.Toast = Toast
无论在app.js里面引入Toast, 还是在utils中引入Toast, App 中的onLoad中用qh.showToast都不会弹toast, 后来让小程序方人员看, 报vue找不到之类的错误

用axios是因为, 有拦截器可以统一处理, 而且network里面可以看到响应, 本身也不大
还是不用axios啦, 虽然有以上优点, 但是返回的错误信息和qh.request不一样(这里可能是ios和安卓返回的错误信息不一致, 不是axios和qh.request返回的错误信息不一致), 主要是写的公共登录方法, 在app.js里调用时, 若接口报错, 会重复执行, 我在App中打印的onLoad, 还有接口错误信心会一直弹.

app.js由于看不到, 调试不便, 引入的Toast或其他, 有的莫名会影响, 也不知道, 在app.js中调用不稳定性大, 最好在app.js里调用简简单单的


qh.setStorage({
    key: 'access_token_dev',
    data: '',
})
set 不能设置空字符串, 否则会报错{errcode: "1", errmsg: " value is empty "}


用异常情况登录后, 重新请求接口来代替刷新页面


当一进入页面就需要token, 比如首页的接口, 在首页的Page的onLoad里面进行initLogin, App的onLoad里面就不需要initLogin

比如分享出去的页面, 商品详情页, 不需要token, 我点收藏活动和立即参加, 就会进行initLogin

在initLogin里面, 我先判断有没有, 然后再如果有就不请求接口, 如果没有就请求登录接口.拿到token, 我再去请求业务接口, 写成一个promise


// 种过期的token, 接口返回已过期, 删除token
qh.setStorage({
  key: 'access_token_dev',
  data: 'ku1FrHNwJVFUNtXjvG258XwUNOkt+C0tg2J9yN645yQ=',
  success (res) {
    console.log(res)
  }
})



此处不能直接给骨架屏添加class, 会有warning
對 Vue component 傳入非 Prop 的 attribute
参考: https://ithelp.ithome.com.tw/articles/10251062

<van-skeleton
  class="panel-skeleton"
  title
  title-width="25%"
  :row="2"
  row-width="['100%']"
  :loading="Object.keys(myDetail).length <= 0"
>
  内容
</van-skeleton>



http可以访问https的资源, https的不能访问http的资源

关于使用的图片
因为打包后, 图片依然存在, 会占用包体积, 所以就不放在 根目录/public 文件夹下了, 都采用线上的
原始图片会放在 根目录/images 下

首页的活动列表使用的是组件(.vue单文件), 当没有登录过小程序的人, 第一次打开这个小程序时, 首先出现的是首页, 首页下面的列表显示 “没有更多了”, 列表出不来, 经反复测试, 发现可能的原因是, 组件先于小程序初始化或首页初始化(不确定到底是哪个初始化)前加载了, 我对首页的组件加了v-if, 在首页的初始化onLoad生命周内增加了开关, 这样解决了问题.


针对于从未使用过的用户, 第一次进入小程序, 首页直接显示“没有更多了”, 列表出不来的问题:

原先猜测setup和小程序初始化的时间有先后, setup早于初始化, 在首页用一个变量当开关, 来控制列表组件的出现, 之前测试有好使的情况, 但是又反映又出现了这种情况.

后来又按照上面这个原因, 将setup中的代码放入到Mounted中, 发现列表出来了, 但是活动状态按钮没出来, 因为活动状态按钮是根据globalData中的数据列过滤出来的, 这才定位到是获取不到globalData中数据的问题, 后来将数据放入到公共js里面存储一份, 才解决了这个问题.

