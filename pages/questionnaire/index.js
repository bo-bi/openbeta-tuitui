import { reactive } from 'vue';
import * as api     from '/api';
import Skeleton     from 'vant/es/skeleton';
import Empty        from 'vant/es/empty';
import Button       from 'vant/es/button';
import Icon         from 'vant/es/icon';
import {
  initLogin,
  removeLocalKey,
  copyObject,
} from '/common/utils';

Page({
  onLoad: function () {
    // Do some initialize when page load.

   // 此页为必须登录, 才可展示页面
   initLogin()
   .then(data => {
      console.log('初始化登录成功后', data);

      // 问卷预览
      if (this.type === 'preview') return this.fetchData();

      // 获取报名状态
      this.getSignUpState()
      .then(data => {
        // 数据模拟start
        // data.code = 200;
        // 数据模拟end

        // 报名成功, 展示报名成功状态
        if (data.code === 200) return this.getQuestionnaireSettings();

        // 填写问卷
        this.fetchData();
      });
   })
   .catch(e => {
     console.log('初始化登录失败后', e);
   });
  },

  onShow: function () {
    // Do something when page show.
    console.log('onShow -- 监听页面显示');
  },

  onReady: function () {
    // Do something when page ready.
    console.log('onReady -- 监听页面初次渲染完成');
  },

  onHide: function () {
    // Do something when page hide.
    console.log('onHide -- 监听页面隐藏');
  },

  onUnload: function () {
    // Do something when page close.
    console.log('onUnload -- 监听页面卸载');
  },

  onShareAppMessage: function () {
    return {
      title: `${this.type === 'preview' ? '问卷预览:\n' : ''}${this.questionnaireName}`,
      path: this.type === 'preview' ?
            `/pages/questionnaire/index?qm_id=${this.qm_id}` :
            `/pages/questionnaire/index?activity_id=${this.activity_id}`,
      imageUrl: 'https://p3.ssl.qhimg.com/t011078c28d368b60ca.png',
    }
  },

  components: {
    [Skeleton.name]: Skeleton,
    [Empty.name]: Empty,
    [Button.name]: Button,
    [Icon.name]: Icon,
  },

  setup() {
    const otherStore = reactive({});

    return {
      otherStore,
    }
  },

  data() {
    return {
      isShowEmpty: false,

      settingsData: {},

      activity_id: this.$route.query.activity_id,
      // activity_id: 34,

      qm_id: this.$route.query.qm_id,
      type: this.$route.query.qm_id ? 'preview' : 'activity',
      // qm_id: 41,
      // type: 'preview',

      questionnaireName: '',
      formData: [],
      formList: [],
      // otherStore: {},

      submitLoading: false,
    }
  },

  methods: {
    fetchData() {
      api.getQuestionnaireDetail(this.activity_id || this.qm_id, this.type)
      .then(({ data }) => {
        console.log(`${this.type} 问卷详情接口`, data);

        // 模拟数据 start
        // data.data = {
        //   qm_name: "慕课一下你就知道报名问卷赶快参与吧~",
        //   form: [
        //     {
        //       "field_id": "field1",
        //       "field_type": 1,
        //       "id": 1,
        //       "name": "您的姓名",
        //       "options": null,
        //       "qm_id": 1,
        //       "remark": "",
        //       "required": 1
        //     },

        //     {
        //       "field_id": "field11",
        //       "field_type": 2,
        //       "id": 11,
        //       "name": "您的意见",
        //       "options": null,
        //       "qm_id": 1,
        //       "remark": "",
        //       "required": 1
        //     },
        
        //     // {
        //     //   "field_id": "field2",
        //     //   "field_type": 3,
        //     //   "id": 2,
        //     //   "name": "之前有没有参与过产品的内测或公测？",
        //     //   "options": [
        //     //     "有",
        //     //     "没有"
        //     //   ],
        //     //   "qm_id": 1,
        //     //   "remark": "",
        //     //   "required": 1
        //     // },

        //     {
        //       "field_id": "field22",
        //       "field_type": 6,
        //       "id": 22,
        //       "name": "之前有没有参与过产品的内测或公测(单选+其他)？",
        //       "options": [
        //         "有",
        //         "没有"
        //       ],
        //       "qm_id": 1,
        //       "remark": "",
        //       "required": 1
        //     },
          
        //     // {
        //     //   "field_id": "field3",
        //     //   "field_type": 4,
        //     //   "id": 3,
        //     //   "name": "您使用过以下哪个产品？(多选）",
        //     //   "options": [
        //     //     "小鹅通",
        //     //     "美阅教育",
        //     //     "格子匠",
        //     //     "网易云课堂",
        //     //     "知识星球",
        //     //     "千聊",
        //     //     "CCtalk",
        //     //     "其他（文本框自己填写）"
        //     //   ],
        //     //   "qm_id": 1,
        //     //   "remark": "",
        //     //   "required": 1
        //     // },

        //     {
        //       "field_id": "field33",
        //       "field_type": 7,
        //       "id": 33,
        //       "name": "您最新话哪一个品牌？(多选 + 其他）",
        //       "options": [
        //         "海尔",
        //         "美的",
        //         "格力",
        //       ],
        //       "qm_id": 1,
        //       "remark": "请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定请根据身份证上出生年月确定",
        //       "required": 1
        //     },
        
        //     // {
        //     //   "field_id": "field4",
        //     //   "field_type": 3,
        //     //   "id": 4,
        //     //   "name": "您有体验慕印这款产品嘛？ （https://muyin.360.cn PC端打开，注册登录即可试用）",
        //     //   "options": [
        //     //     "体验过",
        //     //     "正在体验",
        //     //     "没有体验"
        //     //   ],
        //     //   "qm_id": 1,
        //     //   "remark": "",
        //     //   "required": 1
        //     // },
        
        //     // {
        //     //   "field_id": "field5",
        //     //   "field_type": 1,
        //     //   "id": 5,
        //     //   "name": "您对慕印或其他在线学习平台的使用体验、功能方面的建议是？（认真填写加大通过筛选的概率哦）",
        //     //   "options": null,
        //     //   "qm_id": 1,
        //     //   "remark": "",
        //     //   "required": 1
        //     // },
        
        //     // {
        //     //   "field_id": "field6",
        //     //   "field_type": 1,
        //     //   "id": 6,
        //     //   "name": "如果通过筛选，您会留出时间完成全部功能点测评并提出反馈建议嘛?",
        //     //   "options": null,
        //     //   "qm_id": 1,
        //     //   "remark": "",
        //     //   "required": 1
        //     // },
        
        //     // {
        //     //   "field_id": "field7",
        //     //   "field_type": 1,
        //     //   "id": 7,
        //     //   "name": "您的邮箱是（请认真核对准确填写哦）",
        //     //   "options": null,
        //     //   "qm_id": 1,
        //     //   "remark": "",
        //     //   "required": 1
        //     // },
        //   ]
        // };
        // 模拟数据 end

        const { code, msg, data: { qm_name, form } } = data;

        if (code === 200) {
          this.questionnaireName = qm_name;
          this.formData = form;

          let formList = [];

          const typeList = [
            1, // 单行文本
            2, // 多行文本
            3, // 单选
            4, // 多选
            5, // 下拉列表
            6, // 单选 + 其他
            7, // 多选 + 其他
          ];

          this.formData.map((item, index) => {
            formList.push({
              field_id: item.field_id,
              field_type: item.field_type,
              name: `${index + 1}. ${item.name}`,
              number: index + 1,
              required: item.required,
              value: [4, 7].includes(item.field_type) ? [] : '',
              other: '',
            });

            // 过滤 子项options 为有效值
            if (typeList.includes(item.field_type)) {
              this.formData[index].options =
                Array.isArray(this.formData[index].options) ?
                this.formData[index].options.filter(item => item.trim() !== '') : [];
            }
            
            // 单选 + 其他 将其他的值进行映射
            // 因为是radio属性直接绑定value, 故值不能为空字符串, 否则会默认选中其他这一项
            if (item.field_type === 6) {
              this.otherStore[`${item.field_id}_other`] = null;
            }

            // 多选 + 其他 将其他的值进行映射
            if (item.field_type === 7) {
              this.otherStore[`${item.field_id}_other`] = null;
            }
          });

          this.formList = formList;

          console.log('formList', this.formList);
          console.log('otherStore', this.otherStore);
        } else if (code === 405) {
          // 405 问卷不存在
          this.isShowEmpty = true;
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
              this.getSignUpState()
              .then(data => {
                // 报名成功, 展示报名成功状态
                if (data.code === 200) return this.getQuestionnaireSettings();

                // 填写问卷
                this.fetchData();
              });
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

    otherRadioFocus(index, item) {
      this.formList[index].other = this.otherStore[`${item.field_id}_other`];
    },

    otherRadioInput(index, item) {
      this.formList[index].other = this.otherStore[`${item.field_id}_other`];
    },

    otherCheckboxFocus(index, item) {
      this.formList[index].other = this.otherStore[`${item.field_id}_other`];
    },

    otherCheckboxInput(index, item) {
      this.formList[index].other = this.otherStore[`${item.field_id}_other`];
    },

    handleValidate() {
      let customizedIsPass = false;

      let customizedList = this.formList;

      let requiredList = customizedList.filter(item => item.required === 1);

      console.log('requiredList', requiredList)
      
      customizedList = requiredList.every((item, index) => {
        // if (![6, 7].includes(item.field_type)) {
          
        // }

        // console.log(`item ${index+1}`, item.value, item.other)
        console.log('JSON.stringify(item.value)', JSON.stringify(item.value))
        console.log('other', item.other)

        // if (item.field_type === 6 && !Boolean(item.value) && !Boolean(item.other)) {
        if (item.field_type === 6) {

          // 单选
          // 1. 选择子项 value 有值 other没值
          // 2. 选择其他 value 没值 other有值
          // 异常: 选择其他 但是其他没填 即value无值 other也无值
          // if (item.value === '' && !Boolean(item.other)) {
          //   Toast(`请填写 ${item.name} 哦~`);
          //   return;
          // }
          // Toast(`请填写 ${item.name} 哦~`);
          if (item.value === '' || (item.value === null && !Boolean(item.other))) {
            qh.showToast({
              title: `请填写第${item.number}个问题~`,
            })
            return;
          }
        } else if (item.field_type === 7) {
          // 多选
          // 1. 选择子项 value 有值 选择其他且填写了 other有值
          // 2. 不选择子项 value 无值 选择其他且填写了 other有值
          // 异常: 不选择子项 value 无知 选择了其他没填写 other无值

          // 多选 other有值 此时取消勾选
          // if (['[]', '[null]'].includes(JSON.stringify(item.value)) && !Boolean(item.other)) {
          if (!item.value.length || (JSON.stringify(item.value) === '[null]' && !Boolean(item.other))) {
            // Toast(`请填写 ${item.name} 哦~`);
            qh.showToast({
              title: `请填写第${item.number}个问题~`,
            })
            return;
          }
          // Toast(`请填写 ${item.name} 哦~`);
          //   return;
        } else {
          // 无其他项 只需要判断 有没有value值即可
          // 单行文本 单选 复选框
          if (item.value === '' || JSON.stringify(item.value) === '[]') {
            // Toast(`请填写 ${item.name} 哦~`);
            qh.showToast({
              title: `请填写第${item.number}个问题~`,
            })
            return;
          }
        }

        return true;
      });

      // console.log('customizedList', customizedList)

      return customizedList;

      // customizedIsPass = requiredList.every(item => {
      //   console.log('value', JSON.stringify(item.value))
      //   console.log('other', item.other)
      //   // test start
        
      //   // 先判断有其他的类型控件
      //   // 单选 + 其他
      //   // 多选 + 其他
      //   if ([6, 7].includes(item.field_type)) {
      //     // alert(1);
      //     if (
      //       (item.value === ' ' && item.other === '') ||
      //       (item.value === '' && item.other === '') ||
      //       (JSON.stringify(item.value) === '[]' && item.other === '')
      //     ) {
      //       Toast(`请填写 ${item.name} 哦~`);
      //       return;
      //     }
      //   // // } else if(item.value === '') {
      //   // //   Toast(`请填写 ${item.name} 哦~`);
      //   // //   return;
      //   } 
      //   else {
      //     // alert(2)
      //     console.log('item', item)
      //     if(item.value === '') {
      //       Toast(`请填写 ${item.name} 哦呀~`);
      //       return;
      //     }
      //   }

      //   console.log(123);

      //   return (![6, 7].includes(item.field_type) && item.value !== '') ||
      //          (JSON.stringify(item.value) !== '[]' && item.other !== '') ||
      //          (item.value !== ' ' && item.other !== '') ||
      //          (item.value === '' && item.other !== '') ||
      //          (item.value !== '' && item.other !== '');

        // return item.value !== '' &&
        //        JSON.stringify(item.value) !== '[]' &&
        //        JSON.stringify(item.value) !== '[{"type":"other","value":""}]';
               


        // test end

        console.log('item', item.value, item.other)


        if(
          item.value === '' ||
          // JSON.stringify(item.value) === '[]' ||
          // JSON.stringify(item.value) === '[{"type":"other","value":""}]')
          (item.value === ' ' && item.other === '') ||
          (JSON.stringify(item.value) === '[]' && item.other === ''))
        {
          // this.$toast(`请填写${item.title}哦~`);
          // qh.showToast({
          //   title: `请填写${item.name}哦~`
          // })
          Toast(`请填写 ${item.name} 哦~`);
          return;
        } else {
          // 自定义校验
          if(item.fieldid === 'truename') {
            if (this.checkRealName(item) !== 'pass') {
              return;
            };
          }

          if(item.fieldid === 'mobile') {
            if (this.checkMobile(item) !== 'pass') {
              return;
            };
          }
        }

        return item.value !== '' &&
               JSON.stringify(item.value) !== '[]' &&
               JSON.stringify(item.value) !== '[{"type":"other","value":""}]';
      // })

      console.log('customizedIsPass', customizedIsPass)

      if(!customizedIsPass) {
        return 'noPass';
      } else {
        return 'pass';
      }
    },

    handleSubmit() {
      if (!this.handleValidate()) return;

      let submitData = copyObject(this.formList);

      submitData = submitData.map((item, index) => {
        // 单选 + 其他
        // 防止勾选了其他, 后来又取消了勾选其他
        if (item.field_type === 6) {
          // 若value值不为null, 则说明勾选了不为其他的子项, 清除other
          if (item.value !== null) {
            item.other = '';
          }
          // 若value为null, 则说明勾选了其他, 将value值置为空字符串, 发送other
          if (item.value === null) {
            item.value = '';
          }
        }

        // 多选 + 其他
        // 防止勾选了其他, 后来又取消了勾选其他
        if (item.field_type === 7) {
          // 若value值不为other_mark标识

          // 先判断数组中有没有null, 若没有, 说明没有勾选其他, 清除other
          if (!item.value.includes(null)) {
            item.other = '';
          }
          // 再判断数组中如果含有null, 说明勾选了其他, 将数组中的null过滤掉
          if (item.value.includes(null)) {
            item.value = item.value.filter(item => item !== null);
          }
        }

        return {
          field_id: item.field_id,
          value: item.value,
          other: item.other,
        }
      });

      console.log('submitData', submitData)

      if (this.submitLoading) return;
      this.submitLoading = true;

      api.sendQuestionnaire(this.activity_id, {
        question_item: JSON.stringify(submitData),
      })
        .then(({ data }) => {
          console.log('问卷提交接口', data);
          const { code, msg } = data;
  
          if (code === 200) {
            // 展示报名成功
            this.getQuestionnaireSettings();
          } else {
            qh.showToast({
              title: `${msg}`,
            });
          }
          
          this.submitLoading = false;
        })
        .catch(e => {
          this.submitLoading = false;
          console.log('e', e);
          qh.showToast({
            title: `${e}`,
          });
        });
    },

    getSignUpState() {
      return api.getSignUpState(this.activity_id)
      .then(({ data }) => {
        console.log('报名是否成功接口', data);
        const { code, msg } = data;

        if (code === 200) {
          // 隐藏转发按钮
          qh.hideShareMenu();
          return data;
        } else if (code === 405) {
          // 405 未报名、报名不成功等情况 不进行 toast 提示
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

    getQuestionnaireSettings() {
      api.getQuestionnaireSettings(this.activity_id)
      .then(({ data }) => {
        console.log('问卷设置接口', data);
        const { code, msg } = data;

        if (code === 200) {
          this.settingsData = data.data;
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

    handlePreviewImage() {
      qh.previewImage({
        images: [this.settingsData.qr_code_url],
      });
    },

  },
})
