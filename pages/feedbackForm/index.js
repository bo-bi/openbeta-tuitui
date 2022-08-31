import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import * as api  from '/api';
import Button    from 'vant/es/button';
import RatePanel from '/components/RatePanel.vue';
import {
  uploadImage,
  initLogin,
  removeLocalKey,
  filterAllSpace,
  filterAllTagExceptImg,
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
              removeLocalKey(ACCESS_TOKEN)
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
    RatePanel,
  },

  data() {
    return {
      id: this.$route.query.id,
      activity_name: this.$route.query.activity_name,
      // 后台接口为强类型, 此处需要严格为数值型
      activity_id: Number(this.$route.query.activity_id),
      // activity_name: '哈哈哈哈哈',
      // activity_id: 11,

      submitLoading: false,

      saveDraftLoading: false,

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

      isFinishGetLatestFeedbackDetail: false,
      latestFeedbackDetail: {},
      rateData: {},
      readonly: false,
      noticeText: '',

      draftDetail: {},
      isApplyDraft: false,
    }
  },

  onLoad() {
    // 设置title
    qh.setNavigationBarTitle({
      title: this.activity_name,
    });

    // 涉及草稿, 此页为必须登录, 才可展示页面
    initLogin()
    .then(data => {
      console.log('初始化登录成功后', data);

      // 有意见反馈表的id, 获取意见反馈表详情
      if (this.id) {
        this.fetchData();
        this.noticeText = '您已填写过打分和原因，本次更新只更新报告内容哦～';
      }

      // 若没有意见反馈表的id, 说明是从活动详情页进入的
      if (!this.id) {
        // 首先查询下这个活动之前是否提交过意见反馈表
        this.getLatestFeedbackDetail()
        .then(data => {
          if (data.code === 405) {
            // 若为405 则说明本活动未提交过意见反馈表, 查询草稿详情
            // 获取草稿详情(若有草稿, 显示是否应用草稿的模态框)
            this.getDraftDetail()
            .then(data => {
              // 405 意见反馈草稿不存在
              if (data.code === 405) return;
              this.handleApplyDraft();
            });

            this.noticeText = '360er请注意：以下打分和原因提交后无法修改，只能更新报告内容哦～';
          } else {
            // 不为405 则说明本活动已提交过意见反馈表, 可进行更新报告
            this.noticeText = '您已填写过打分和原因，本次更新只更新报告内容哦～';
          }
        })
      }
    })
    .catch(e => {
      console.log('初始化登录失败后', e);
    });

  },

  methods: {
    handleReady(Quill) {
      console.log('Quill初始化完成', Quill);
    },

    // 获取详情后(1. 最新意见反馈表详情 2. 根据id查询到的意见反馈表详情 3. 草稿), 同步页面所有内容
    syncAll(data, readonly = true) {
      const {
        name,
        content,
        satisfaction,
        recommend,
        satisfaction_reason,
        recommend_reason,
      } = data;

      // 同步评分 + 原因
      this.rateData = {
        satisfaction,
        recommend,
        satisfaction_reason,
        recommend_reason,
      };

      // 同步内容
      this.form.name = name;
      this.form.content = content;
      this.$refs.customEditor.setHTML(this.form.content);

      // 评分 + 原因 为只读
      this.readonly = readonly;
    },

    getRatePanelComponentData() {
      const {
        satisfaction,
        recommend,
        satisfaction_reason,
        recommend_reason,
      } = this.$refs.ratePanel;

      return {
        satisfaction,
        recommend,
        satisfaction_reason,
        recommend_reason,
      }
    },

    getLatestFeedbackDetail() {
      return api.getLatestFeedbackDetail({
        act_id: this.activity_id,
      })
      .then(({ data }) => {
        console.log('是否提交过意见反馈详情接口', data);
        const { code, msg } = data;

        if (code === 200) {
          this.latestFeedbackDetail = data.data;
          this.syncAll(this.latestFeedbackDetail);
          return data;
        } else if (code === 405) {
          // 405 意见反馈详情不存在 不进行 toast 提示
          return data;
        } else {
          qh.showToast({
            title: `${msg}`,
          });
        }

      })
      .catch(e => {
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      })
      .finally(() => {
        this.isFinishGetLatestFeedbackDetail = true;
      });
    },

    fetchData() {
      api.getFeedbackDetail(this.id, {
        act_id: this.activity_id,
      })
      .then(({ data }) => {
        console.log('意见反馈详情', data);
        const { code, msg } = data;

        if (code === 200) {
          this.syncAll(data.data);
        } else {
          qh.showToast({
            title: `${msg}`,
          });

          if (code === 401) {
            // 先清除本地存储的token
            removeLocalKey(ACCESS_TOKEN)
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

    handleValidate() {
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

      // 输入内容再删除, 可绕过校验
      if (this.form.content === '<p><br></p>') {
        qh.showToast({
          title: '请输入内容',
        });
        return;
      }

      // 换很多行, 再空格多次, 可绕过校验
      if (!filterAllSpace(filterAllTagExceptImg(this.form.content)).trim()) {
        qh.showToast({
          title: '请输入内容',
        });
        return;
      }

      return true;
    },

    handleSubmit(type) {
      /**
       * 若为 更新报告 操作, 则不对评分及原因进行校验,
       * 若是 首次提交 操作, 则需要对评分及原因校验
       *
       * update: 更新报告
       * first:  直接提交
       */
      if (type === 'first' && !this.$refs.ratePanel.handleValidate()) return;
      if (!this.handleValidate()) return;

      if (type === 'update') {
        this.updateActivityFeedback();
      } else {
        this.addActivityFeedback();
      }
    },

    addActivityFeedback() {
      if (this.submitLoading) return;
      this.submitLoading = true;

      api.addActivityFeedback(this.activity_id, Object.assign(
        this.form,
        {
          draft_id: this.isApplyDraft ? this.draftDetail.id : undefined,
        },
        this.getRatePanelComponentData(),
      ))
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
            removeLocalKey(ACCESS_TOKEN)
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

      // 从 我的意见反馈列表 进入, 是用 该意见反馈表id 进行更新
      // 从 活动详情页      进入, 是用获取到的最新详情中的id 进行更新
      api.updateActivityFeedback(
        this.id ? this.id : this.latestFeedbackDetail.id,
        Object.assign(
          this.form,
          {
            act_id: this.activity_id,
          },
          this.getRatePanelComponentData(),
        )
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

              // 在意见反馈列表中对单条进行更新, 返回上一页后需要刷新
              if (this.id) {
                const appInstance = getApp();
                appInstance.globalData.set('isNeedFreshMineFeedbackPage', 1);
              }

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
            removeLocalKey(ACCESS_TOKEN)
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

    getDraftDetail() {
      return api.getDraftDetail({
        act_id: this.activity_id,
      })
      .then(({ data }) => {
        console.log('草稿详情接口', data);
        const { code, msg } = data;

        if (code === 200) {
          this.draftDetail = data.data;
          return data;
        } else if (code === 405) {
          // 405 意见反馈草稿不存在 不进行 toast 提示
          return data;
        } else {
          qh.showToast({
            title: `${msg}`,
          });
        }

      })
      .catch(e => {
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    handleApplyDraft() {
      qh.showModal({
        content: '检测到当前活动保存有草稿，是否应用?',
        confirmText: '应用',
        success: (res) => {
          if (res.confirm) {
            this.syncAll(this.draftDetail, false);

            // 用于提交反馈消耗掉草稿
            this.isApplyDraft = true;
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      })
    },

    handleSaveDraft() {
      if (!this.$refs.ratePanel.handleValidate()) return;
      if (!this.handleValidate()) return;

      if (Object.keys(this.draftDetail).length) {
        // 有草稿, 是否覆盖
        this.handleCoverDraft();
      } else {
        // 没有草稿, 就添加
        this.addDraft();
      }
    },

    handleCoverDraft() {
      qh.showModal({
        content: '您确定要覆盖之前保存的草稿吗?',
        success: (res) => {
          if (res.confirm) {
            // 更新草稿
            this.updateDraft();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      })
    },

    addDraft() {
      if (this.saveDraftLoading) return;
      this.saveDraftLoading = true;

      api.addDraft(this.activity_id, Object.assign(
        this.form,
        this.getRatePanelComponentData(),
      ))
      .then(({ data }) => {
        console.log('添加草稿接口', data);
        const { code, msg } = data;

        if (code === 200) {
          qh.showToast({
            icon: 'success',
            title: '保存成功',
            duration: 300,
            success: res => {
              this.saveDraftLoading = false;
            },
          });
        } else if(code === 405) {
          // 405 表明之前已经有草稿 提示是否覆盖
          // 此时先请求下 草稿详情接口
          // 再用详情接口中数据 去调用更新草稿接口
          this.saveDraftLoading = false;

          this.getDraftDetail()
          .then(data => {
            this.handleCoverDraft();
          });
        } else {
          this.saveDraftLoading = false;
          qh.showToast({
            title: `${msg}`,
          });

          if (code === 401) {
            // 先清除本地存储的token
            removeLocalKey(ACCESS_TOKEN)
            .then(data => {
              // 再重新登录
              return initLogin();
            }).then(data => {
              // 登录成功后 重新保存
              this.handleSaveDraft();
            }).catch(e => {
              console.log('token异常, 进行登录错误', e);
            });
          }

        }

      })
      .catch(e => {
        this.saveDraftLoading = false;
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

    updateDraft() {
      if (this.saveDraftLoading) return;
      this.saveDraftLoading = true;

      api.updateDraft(this.draftDetail.id, Object.assign(
        this.form,
        {
          act_id: this.activity_id,
        },
        this.getRatePanelComponentData(),
      ))
      .then(({ data }) => {
        console.log('更新草稿接口', data);
        const { code, msg } = data;

        if (code === 200) {
          qh.showToast({
            icon: 'success',
            title: '保存成功',
            duration: 300,
            success: res => {
              // 放置在此处, 不放置在最后, 是为了防止以下情况:
              // loading 消失, 此时还没走到 toast 的回调, 可以重复点击, toast 消失后才可继续点击
              this.saveDraftLoading = false;
            },
          })

        } else {
          this.saveDraftLoading = false;
          qh.showToast({
            title: `${msg}`,
          });

          if (code === 401) {
            // 先清除本地存储的token
            removeLocalKey(ACCESS_TOKEN)
            .then(data => {
              // 再重新登录
              return initLogin();
            }).then(data => {
              // 登录成功后 重新保存
              this.handleSaveDraft();
            }).catch(e => {
              console.log('token异常, 进行登录错误', e);
            });
          }

        }

      })
      .catch(e => {
        this.saveDraftLoading = false;
        console.log('e', e);
        qh.showToast({
          title: `${e}`,
        });
      });
    },

  }
})
