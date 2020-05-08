//app.js
import {
  base64_encode
} from './utils/util'
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取设备类型及高度
    this.globalData.myDevice = wx.getSystemInfoSync()



    // 转发
    wx.showShareMenu({
      withShareTicket: true
    })
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        this.globalData.code = res.code;
        getApp().loginCallback(res.code)
        wx.getStorage({
          key: 'phone',
          success: (_res) => {
            this.globalData.phone = _res.data
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // 用户信息授权状态
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              this.globalData.haveUserInfo = true;
              const _this = this;
              wx.getStorage({
                key: 'token',
                success: function(_res) {},
                complete: function(_res) {
                  wx.request({
                    url: _this.globalData.url + 'admin/user/wxLogin',
                    data: {
                      code: _this.globalData.code,
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      nickName: _this.globalData.userInfo.nickName,
                      avatarUrl: _this.globalData.userInfo.avatarUrl,
                      province: _this.globalData.userInfo.province,
                      city: _this.globalData.userInfo.city,
                      country: _this.globalData.userInfo.country,
                      gender: _this.globalData.userInfo.gender
                    },
                    success: _res => {
                      console.log(_res)
                      wx.request({
                        url: _this.globalData.url + 'auth/oauth/token?scope=server&grant_type=client_credentials&randomStr=14761564123426575',
                        header: {
                          Authorization: 'Basic ' + base64_encode(_res.data.data.clientId + ':' + _res.data.data.clientSecret)
                        },
                        success: loginSuccessRes => {
                          console.log(loginSuccessRes)
                          _this.globalData.token = loginSuccessRes.data.access_token;
                          _this.globalData.token_type = loginSuccessRes.data.token_type;
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
                }
              })
              console.log(res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: (error) => {
              this.globalData.haveUserInfo = false
            }
          })
        }
      }
    })
    // 获取设备信息
    wx.getSystemInfo({
      success: e => {
        console.log(e)
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.RpxPx = 750 / e.windowWidth;
      }
    })
  },
  globalFunction(callback) {
    var self = this;
    wx.getStorage({
      key: 'token',
      success: res => {
        // 存在
        self.globalData.token = res.data
        self.globalData.isShowAuthorize = false
        callback(self.globalData.isShowAuthorize)
      },
      fail: error => {
        // 不存在,弹出授权框
        self.globalData.isShowAuthorize = true
        callback(self.globalData.isShowAuthorize)
      }
    })

    // if (!!!token) {
    //   self.globalData.isShowAuthorize = true
    //   wx.showModal({
    //   title: '警告',
    //   content: '操作需要获取你的用户信息！',
    //   showCancel: false,
    //   confirmText: '知道了',
    //   confirmColor: '#54a54b',
    //   success: function (res) {
    //     // 登录
    //     wx.login({
    //       success: res => {
    //         self.globalData.code = res.code;
    //         self.loginCallback(res.code)

    //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //       }
    //     })
    //     //获取用户信息
    //     wx.getSetting({
    //       success: res => {
    //         // 用户信息授权状态
    //         if (res.authSetting['scope.userInfo']) {
    //           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //           wx.getUserInfo({
    //             success: res => {
    //               // 可以将 res 发送给后台解码出 unionId
    //               self.globalData.userInfo = res.userInfo;
    //               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //               // 所以此处加入 callback 以防止这种情况
    //               if (self.userInfoReadyCallback) {
    //                 self.userInfoReadyCallback(res)
    //               }
    //             }
    //           })
    //           callback&&callback();
    //         }
    //       }
    //     })
    //   }
    // })
    // }else{
    //   self.globalData.isShowAuthorize = false
    // }
  },
  globalData: {
    userInfo: null,
    userLocation: null,
    myDevice: null,
    imgUrl: [],
    url: 'https://114.116.102.222/',
    urlDontHaveSSR: 'http://114.116.102.222/',
    isShowAuthorize: false,
    haveUserInfo: false
  }
})