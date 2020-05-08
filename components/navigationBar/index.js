// components/navigationBar/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    config: {
      type: Object,
      title: {
        type: String
      },
      bgc: {
        type: String,
        value: '#fff'
      },
      color: {
        type: String,
        value: '#000'
      }
    },
    type: {
      type: String,
      value: 'add',
      observer(newVal,oldVal,changePath){
        this.setData({
          _type:newVal
        })
        console.log(newVal,oldVal,changePath)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    _type: 'add'
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goBack(e) {
      let pages = getCurrentPages();
      if (pages.length > 1 && pages[pages.length - 1].route.indexOf('appointment_success') < 0) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.reLaunch({
          url: this.data._type == 'add'?'../../pages/index/index':'../../pages/my_appointment_history/index',
          success(res) {
            console.log(res)
          },
          fail(res) {
            console.log(res)
          }
        })
      }
    }
  }
})