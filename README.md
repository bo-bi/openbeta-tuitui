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
