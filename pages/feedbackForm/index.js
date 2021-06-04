import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import * as api from '/api';
import Button   from 'vant/es/button';
import {
  uploadImage,
  initLogin,
  removeLocalKey,
} from '/common/utils';

// 工具栏配置
const toolbarOptions = [
  [
    'bold', // 粗体
    'italic', // 斜体
  ],
  [
    {
      'header': 1, // h1
    },
    {
      'header': 2, // h2
    },
  ],
  [
    {
      'list': 'ordered', // 有序列表
    }, 
    {
      'list': 'bullet', // 无序列表
    },
  ],
  [
    { 
      'align': [], // text-align
    },
  ],
  [
    'image',
  ],
];

// 富文本编辑器选项事件处理函数
const handlers = {
  //覆盖自带的图片上传
  image(val) {
    // val true 发生image点击
    if (!val) return;

    // 获取编辑器
    const quillInstance = this.quill;

    // 选择图片 start
    qh.chooseImage({
      image: {
        multiple: false,
        compress: true,
        max: 1,
      },

      types: [
        'photo',
        'camera',
      ],
      success(chooseImageRes) {
        console.log('chooseImageRes', chooseImageRes)

        const { tempFilePaths, tempFiles } = chooseImageRes;
        const size = tempFiles[0].size;
        console.log('size', `${size / (1 * 1024 * 1024)}M`);
        if (size > 5 * 1024 * 1024) {
          qh.showToast({
            // 安卓拍一张照片, 平均4M左右
            title: '请上传小于5M的图片',
          });
          return;
        }

        qh.showLoading({
          title: '上传中...',
        });

        // 上传图片接口 start
        uploadImage(tempFilePaths[0])
        .then(({ data }) => {
          // 这里先隐藏, 若先qh.showToast(), 最后qh.hideLoading(), toast会看不见(小程序内置的方法有问题)
          qh.hideLoading();
          console.log('上传图片接口', data);
          const { code, msg } = JSON.parse(data);

          if (code === 200) {
            const { data: { url_https } } = JSON.parse(data);
            // 获取光标所在位置
            let length = quillInstance.getSelection(true).index;
            //插入图片
            quillInstance.insertEmbed(length, 'image', url_https);
            // 调整光标到最后
            quillInstance.setSelection(length + 1);
          } else {
            qh.showToast({
              title: msg,
            });

            if (code === 401) {
              // 先清除本地存储的token
              removeLocalKey('access_token')
              .then(data => {
                // 再重新登录
                return initLogin();
              })
              .then(data => {
                // 给予提示
                qh.showToast({
                  title: '请重新上传',
                });
              })
              .catch(e => {
                console.log('token异常, 进行登录错误', e);
              });
            }
          }

        })
        .catch(e => {
          qh.hideLoading();
          console.log('e', e);
          qh.showToast({
            title: e.errmsg,
          });
        })
        // 上传图片接口 end

      },
    });
    // 选择图片 end

  },

};


Page({
  components: {
    QuillEditor,
    [Button.name]: Button,
  },

  data() {
    return {
      id: this.$route.query.id,
      activity_name: this.$route.query.activity_name,
      activity_id: this.$route.query.activity_id,
      // activity_name: '哈哈哈哈哈',
      // activity_id: 11,

      submitLoading: false,

      options: {
        // 打印信息
        // debug: 'info',
        modules: {
          // toolbar: [
          //   'head',
          //   'bold',
          //   'italic',
          //   'underline',
          //   // 'image',
          // ],

          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: handlers, // 选项事件处理函数
          },
        },
        placeholder: '请输入内容',
        // 是否只读, 不可编辑
        // readOnly: true,
        theme: 'snow',
      },

      form: {
        name: '',
        content: '',

        exampleContent: `乔布斯第一次见到计算机终端，就是在这里。“就是我爸爸带我去埃姆斯中心的时候，我觉得自己彻底爱上它了。

        后来，生产潜射弹道导弹的洛克希德公司的导弹与空间部门在NASA隔壁成立；几百米外就是西屋电气公司，生产导弹系统所需的电子管和变压器。

        1951年，时任斯坦福大学教授、副校长的弗雷德·特曼（Frederick Terman）筹建了斯坦福工业园，并为民用技术的初创企业提供风险资本。斯坦福工业园的第一家租户便是瓦里安联合公司，也就是乔布斯的母亲担任记账员的地方。

        到1980年，整个园区的700英亩土地全部租完，有90多家公司入驻，25万名员工在此工作。包括著名的惠普公司。1965年乔布斯10岁时，惠普已经有9000名员工，是优秀工程师梦寐以求入职的一流企业。

        半导体是这个地区最重要的一个行业，这也是“硅谷”名称的由来。1956年晶体管的发明者威廉·肖克利（William Shockley）在山景城创立肖克利半导体实验室。此后，仙童（Fairchild）、英特尔（Intel）、AMD、国民半导体等公司纷纷出现。短短几年间，这一地区就出现了50多家半导体企业。

        国防工业带动民用科技迅猛发展，硅谷成了工程师和创业者的天堂。乔布斯后来回忆说：“住在我周围的父亲们研究的大都是很酷的东西，比如太阳能光伏电池、雷达。我对这些东西充满了惊奇，经常向他们问这问那。”这些邻居中最重要的一个人是惠普的一个工程师拉里·朗，超级无线电爱好者、铁杆电子迷。他时常会带东西给乔布斯玩，他制作的碳精话筒让乔布斯叹为观止。拉里最终把那只令乔布斯魂牵梦萦的炭精话筒送给了他。

        拉里还让乔布斯迷上了希思工具盒（Heath Kits），这是当时广受欢迎的、需要自己组装的工具套装，用来制作无线电设备和其他电子设备。

        拉里还让乔布斯加入了惠普探索者俱乐部。该俱乐部每周二的晚上在公司餐厅进行一次聚会，有大概15个学生参加。惠普会从实验室请一个工程师来给大家讲讲他正在研究的东西。乔布斯回忆：“我爸爸会开车送我去。我感觉那儿就是我的天堂。”

        有一次聚会结束后，他拦住了惠普的一名激光工程师（他的父亲那时在一家激光公司工作，所以他对激光特别感兴趣），获得了参观他们全息摄影实验室的机会。在那里他见到了当时惠普正在开发的小型计算机。这是乔布斯第一次见到台式计算机。“它身形巨大，大概有40磅重，但它真的很美，我爱上了它。”

        探索者俱乐部的孩子们被鼓励做一些项目，乔布斯决定做一台频率计数器。他需要一些惠普制造的零件，于是他拿起电话打给了惠普的CEO：“那个时候，所有的电话号码都是登记在册的，所以我在电话簿上寻找住在帕洛奥图的比尔·休利特，然后打到了他家。他接了电话并和我聊了20分钟。之后他给了我那些零件，还给了我一份工作，就在他们制造频率计数器的工厂。”乔布斯第一年的暑假就在那里工作。“我爸爸早上开车送我去，晚上再把我接回家。`,
      },

    }
  },

  onLoad() {
    // 设置title
    qh.setNavigationBarTitle({
      title: this.activity_name,
    });

    if (this.id) {
      // 若有id说明是二次编辑, 此页为必须登录, 才可展示页面
      initLogin()
      .then(data => {
        console.log('初始化登录成功后', data);
        this.fetchData();
      })
      .catch(e => {
        console.log('初始化登录失败后', e);
      });
    }
  },

  methods: {
    handleReady(Quill) {
      console.log('Quill初始化完成', Quill);
    },

    fetchData() {
      api.getFeedbackDetail(this.id, {
        act_id: this.activity_id,
      })
      .then(({ data }) => {
        console.log('意见反馈详情', data);
        const { code, msg } = data;

        if (code === 200) {
          const { data: { name, content }} = data;
          this.form.name = name;
          this.form.content = content;
          this.$refs.customEditor.setHTML(this.form.content);
        } else {
          qh.showToast({
            title: `${msg}`,
          });

          if (code === 401) {
            // 先清除本地存储的token
            removeLocalKey('access_token')
            .then(data => {
              // 再重新登录
              return initLogin();
            })
            .then(data => {
              // 登录成功后 刷新接口(代替刷新页面)
              this.fetchData();
            })
            .catch(e => {
              console.log('token异常, 进行登录错误', e);
            })
          }

        }

      })
      .catch(e => {
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    handleSubmit() {
      if (!this.form.name) {
        qh.showToast({
          title: '请输入标题',
        });
        return;
      }

      if (!this.form.content) {
        qh.showToast({
          title: '请输入内容',
        });
        return;
      }

      if (this.id) {
        this.updateActivityFeedback();
      } else {
        this.addActivityFeedback();
      }
    },

    addActivityFeedback() {
      if (this.submitLoading) return;
      this.submitLoading = true;

      api.addActivityFeedback(this.activity_id, this.form)
      .then(({ data }) => {
        console.log('add接口', data);
        const { code, msg } = data;

        if (code === 200) {
          qh.showToast({
            icon: 'success',
            title: '提交成功',
            duration: 300,
            success: res => {
              this.submitLoading = false;
              // 返回上一页
              qh.navigateBack({
                delta: 1,
              });
            },
          });

        } else {
          this.submitLoading = false;
          qh.showToast({
            title: `${msg}`,
          });

          if (code === 401) {
            // 先清除本地存储的token
            removeLocalKey('access_token')
            .then(data => {
              // 再重新登录
              return initLogin();
            }).then(data => {
              // 登录成功后 重新提交
              this.handleSubmit();
            }).catch(e => {
              console.log('token异常, 进行登录错误', e);
            });
          }

        }

      })
      .catch(e => {
        this.submitLoading = false;
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    updateActivityFeedback() {
      if (this.submitLoading) return;
      this.submitLoading = true;

      api.updateActivityFeedback(this.id, Object.assign(
        this.form,
        {
          act_id: Number(this.activity_id),
        })
      )
      .then(({ data }) => {
        console.log('update接口', data);
        const { code, msg } = data;

        if (code === 200) {
          qh.showToast({
            icon: 'success',
            title: '更新成功',
            // 将持续时间设置短些, 可快速走回调, 返回上一页(此方法toast显示完毕后, 才会走回调)
            duration: 300,
            success: res => {
              // 放置在此处, 不放置在最后, 是为了防止以下情况:
              // loading消失, 此时还没走到toast的回调, 即返回上一页, 可以重复点击
              this.submitLoading = false;
              // 返回上一页
              qh.navigateBack({
                delta: 1,
              });
            },
          })

        } else {
          this.submitLoading = false;
          qh.showToast({
            title: `${msg}`,
          });

          if (code === 401) {
            // 先清除本地存储的token
            removeLocalKey('access_token')
            .then(data => {
              // 再重新登录
              return initLogin();
            }).then(data => {
              // 登录成功后 重新提交
              this.handleSubmit();
            }).catch(e => {
              console.log('token异常, 进行登录错误', e);
            });
          }

        }

      })
      .catch(e => {
        this.submitLoading = false;
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

  }
})
