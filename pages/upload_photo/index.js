// pages/upload_photo/index.js
const app = getApp();
import WxValidate from '../../utils/WxValidate'
import {
  base64_encode
} from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnDisabled: true,
    haveUserInfo: app.globalData.haveUserInfo,
    isShow: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    title: '发布照片',
    imagePath: '',
    fileName: '',
    remark: '',
    rules: {
      fileName: {
        required: true,
        rangelength: [2, 10]
      }
    },
    message: {
      fileName: {
        required: '请输入图片名称',
        rangelength: '长度在2到10个字符'
      },
    }
  },
  getChildrenCode(res) {
    console.log(res)
    this.setData({
      isShow: res.detail
    })
  },
  goBack() {
    wx.navigateBack({
      url: '../index/index'
    })
  },
  fileNameInput(e) {
    this.setData({
      fileName: e.detail.value
    })
    if (e.detail.value.length > 1) {
      this.setData({
        btnDisabled: false
      })
    } else {
      this.setData({
        btnDisabled: true
      })
    }
  },
  remarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  formSubmit(e) {
    const params = e.detail.value
    if (!this.data.WxValidate.checkForm(params)) {
      console.log(this.data.WxValidate)
      const error = this.data.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    wx.login({
      success: _res_ => {
        wx.uploadFile({
          // url: app.globalData.url + 'admin/sysfile/upload/192.168.1.14/1152588951496822784',
          url: app.globalData.url + 'admin/sysfile/uploadForWx/19.106.81.38/1171737996198809600',
          name: 'file',
          header: {
            'Authorization': app.globalData.token_type + ' ' + app.globalData.token,
            'Content-Type': 'multipart/form-data'
          },
          filePath: this.data.imagePath,
          formData: {
            fileName: this.data.fileName.trim() || this.data.imagePath,
            remark: this.data.remark,
            phone: app.globalData.phone,
            resourceType: 1,
            code: _res_.code
          },
          success: res => {
            console.log(res)
            wx.hideLoading()
            let content = app.globalData.phone ? '图片发布成功,请留意手机短信或者前往历史记录-历史图片上传处查看审核状态!' : '您没有提供手机号码,请留意 历史记录-历史图片上传 查看审核状态!'
            if (JSON.parse(res.data).data) {
              wx.showModal({
                title: '提交成功',
                content,
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.reLaunch({
                      url: '../index/index'
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '上传失败',
                confirmText: '确定'
              })
            }
          },
          fail: error => {
            console.log(error)
            wx.hideLoading()
            wx.showModal({
              title: '上传失败',
              confirmText: '确定'
            })
          },
          complete: () => {}
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
    this.setData({
      imagePath: options.path
    });
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      WxValidate: new WxValidate(this.data.rules, this.data.message)
    })
    app.globalFunction((state) => {
      console.log(state)
      this.setData({
        isShow: state
      })
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      haveUserInfo: app.globalData.haveUserInfo
    })
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