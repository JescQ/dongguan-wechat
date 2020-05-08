// pages/appointment/index.js
const {
  formatTime,
  urlTobase64,
  base64_encode
} = require('../../utils/util');
import WxValidate from '../../utils/WxValidate'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnDisabled: true,
    haveUserInfo: app.globalData.haveUserInfo,
    CustomBar: app.globalData.CustomBar,
    config: {
      title: "预约"
    },
    WxValidate: null,
    rules: {
      realName: {
        required: true,
        rangelength: [2, 10]
      },
      identityCard: {
        required: true,
        idcard: true,
      },
      company: {
        required: true,
        rangelength: [2, 16]
      },
    },
    message: {
      realName: {
        required: '请输入您的真实姓名',
        rangelength: '长度在2到10个字符'
      },
      identityCard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      company: {
        required: '请输入您的单位名称',
        rangelength: '长度在2到16个字符'
      }
    },
    form: {
      srId: '1171737996198809600',
      realName: '',
      identityCard: '',
      phone: '',
      company: '',
      subType: 1,
      subTime: '',
      identityFrontPhoto: '',
      identityCounterPhoto: '',
      facePhoto: ''
    },
    isShow: false,
    promptStatus: 0,
    curDateTime: {},
    dateAppointment: '2019-08-01',
    timeAppointment: '09:00',
    index: 0,
    time: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    typeAppointment: [{
      name: '场地设备',
      value: 1,
      checked: true
    }, {
      name: '参观',
      value: 2
    }],
    typeAppointmentStatus: 1,
    idPhotoUrl: {
      positive: '',
      negative: '',
    }
  },
  getChildrenCode(res) {
    this.setData({
      isShow: res.detail
    })
  },
  nameInput(e) {
    this.setData({
      'form.realName': e.detail.value
    })
  },
  idInput(e) {
    this.setData({
      'form.identityCard': e.detail.value
    })
  },
  phoneInput(e) {
    this.setData({
      'form.phone': e.detail.value
    })
  },
  companyInput(e) {
    this.setData({
      'form.company': e.detail.value
    })
  },
  typeAppointmentChange(e) {
    this.setData({
      'form.subType': +e.detail.value
    })
  },

  datePicker(e) {
    this.setData({
      dateAppointment: e.detail.value
    })
  },
  timePicker(e) {
    this.setData({
      timeAppointment: this.data.time[e.detail.value]
    })
    console.log(this.data.timeAppointment)
  },
  uploadPhoto() {
    wx.chooseImage({
      count: 1,
      success: res => {
        this.setData({
          'form.facePhoto': urlTobase64(res.tempFilePaths[0])
        })
      },
    })
  },
  positiveId(e) {
    wx.chooseImage({
      count: 1,
      success: res => {
        console.log(this.data)
        this.setData({
          'form.identityFrontPhoto': urlTobase64(res.tempFilePaths[0])
        })
        // wx.request({
        //   url: 'https://api.ai.qq.com/fcgi-bin/ocr/ocr_idcardocr',
        //   data:{
        //     app_id: 2119084178
        //   },
        //   success: _res => {
        //     console.log(_res)
        //   },
        //   fail: _error => {
        //     console.log(_error)
        //   }
        // })
        this.setData({
          'idPhotoUrl.positive': res.tempFilePaths[0]
        })
      }
    })
  },
  negativeId(e) {
    wx.chooseImage({
      count: 1,
      success: res => {
        this.setData({
          'form.identityCounterPhoto': urlTobase64(res.tempFilePaths[0])
        })
        this.setData({
          'idPhotoUrl.negative': res.tempFilePaths[0]
        })
      }
    })
  },

  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  formSubmit(e) {
    console.log(e)

    const params = e.detail.value
    if (!this.data.WxValidate.checkForm(params)) {
      console.log(this.data.WxValidate)
      const error = this.data.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    this.setData({
      'form.subTime': this.data.dateAppointment + ' ' + this.data.timeAppointment + ':00'
    });
    wx.showLoading({
      title: '预约中'
    })
    wx.login({
      success: _res_ => {
        this.setData({
          'form.phone': app.globalData.phone,
          'form.code': _res_.code
        })
        wx.request({
          url: app.globalData.url + 'admin/tsubscribe',
          header: {
            'Authorization': app.globalData.token_type + ' ' + app.globalData.token
          },
          data: this.data.form,
          method: this.data.type == 'add' ? 'POST' : 'PUT',
          success: _res => {
            if (_res.statusCode == 401) {
              this.setData({
                isShow: true
              })
              return
            }
            console.log(_res)
            wx.navigateTo({
              url: '../appointment_success/index?name=' + this.data.form.realName + '&phone=' + this.data.form.phone + '&time=' + this.data.form.subTime + '&type=' + this.data.type,
            })
          },
          fail: _error => {
            console.log(_error)
            wx.showToast({
              title: '预约失败',
              icon: 'cancel'
            })
          },
          complete() {
            wx.hideLoading()
          }
        })

      }
    })
  },

  isShowPhoneCodeStatus(res) {
    console.log(res)
    this.setData({
      isShowPhoneCode: res.detail
    })
  },
  yzm() {
    if (/^1[34578]\d{9}$/.test(this.data.phone)) {
      this.setData({
        isShowPhoneCode: true
      })
    } else {
      this.showModal({
        msg: '请输入有效的手机号码'
      })
    }
  },
  userinfo(res) {
    console.log(res)
    if (res.detail.errMsg == 'getUserInfo:ok') {
      app.globalData.haveUserInfo = true;
      app.globalData.userInfo = res.detail.userInfo;
      console.log(app)
      wx.request({
        url: app.globalData.url + 'admin/user/wxLogin',
        data: {
          code: app.globalData.code,
          encryptedData: res.detail.encryptedData,
          iv: res.detail.iv,
          nickName: app.globalData.userInfo.nickName,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          province: app.globalData.userInfo.province,
          city: app.globalData.userInfo.city,
          country: app.globalData.userInfo.country,
          gender: app.globalData.userInfo.gender
        },
        success: _res => {
          console.log(_res)
          wx.request({
            url: app.globalData.url + 'auth/oauth/token?scope=server&grant_type=client_credentials&randomStr=14761564123426575',
            header: {
              Authorization: 'Basic ' + base64_encode(_res.data.data.clientId + ':' + _res.data.data.clientSecret)
            },
            success: loginSuccessRes => {
              console.log(loginSuccessRes)
              app.globalData.token = loginSuccessRes.data.access_token;
              app.globalData.token_type = loginSuccessRes.data.token_type;
              wx.setStorage({
                key: 'token',
                data: loginSuccessRes.data.access_token,
              })
              wx.setStorage({
                key: 'token_type',
                data: loginSuccessRes.data.token_type,
              })
            }
          })
        }
      })
      // 授权
      this.setData({
        isShowPhoneCode: true,
        haveUserInfo: true
      })
      console.log(this)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // app.globalFunction(app.globalData.token);
    wx.hideShareMenu();
    if (options.type == 'add') {
      console.log(2)
      this.setData({
        type: options.type,
        curDateTime: formatTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
      });
      this.setData({
        dateAppointment: Object.values(this.data.curDateTime.date).join('-')
      })
    } else {
      console.log(3)
      let _option = JSON.parse(options.option)
      console.log(_option)
      let _new = this.data.typeAppointment.map((item, index) => {
        item.checked = false
        if (_option.subType == this.data.typeAppointment[index].value) {
          item.checked = true
        }
        return item
      })
      this.nameInput({
        detail: {
          value: _option.realName
        }
      })
      this.idInput({
        detail: {
          value: _option.identityCard
        }
      })
      this.phoneInput({
        detail: {
          value: _option.phone
        }
      })
      this.companyInput({
        detail: {
          value: _option.company
        }
      })
      this.setData({
        typeAppointment: _new,
        option: _option,
        type: options.type,
        dateAppointment: _option.subTime.slice(0, 10),
        index: this.data.time.indexOf(_option.subTime.slice(11, 16)),
        'config.tilte': '编辑预约',
        'form.subType': +_option.subType
      })
      this.setData({
        timeAppointment: this.data.time[this.data.index],
        'form.id': _option.id
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      WxValidate: new WxValidate(this.data.rules, this.data.message)
    })
    this.setData({
      haveUserInfo: app.globalData.haveUserInfo
    })
    app.globalFunction((state) => {
      this.setData({
        isShow: state
      })
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})