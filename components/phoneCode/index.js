// components/phoneCode/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    phone: null,
    phoneCode: null,
    btnText: '发送',
    disabled: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hidePhoneCode(e) {
      this.triggerEvent('isShowPhoneCodeStatus', false)
    },
    phoneInupt(e) {
      this.setData({
        phone: e.detail.value
      })
    },
    getPhoneCode() {
      console.log(this)
      wx.request({
        url: app.globalData.url + 'admin/user/sendCode/' + this.data.phone,
        success: (res) => {
          if (res.data.data) {
            // 获取验证码成功
            this.setData({
              disabled: true
            })
            let i = 59;
            this.setData({
              btnText:  '60s'
            })
            let timer = setInterval(() => {
              console.log(1)
              this.setData({
                btnText: i + 's'
              })
              if (i < 0) {
                clearInterval(this.data.timer)
                this.setData({
                  btnText: '发送',
                  disabled: false
                })
              }
              --i
            }, 1000)
            this.setData({
              timer
            })
          }
        },
        fail: error => {
          console.log(error)
        }
      })
    },
    bindCodeInput(e) {
      this.setData({
        phoneCode: e.detail.value
      })
    },
    submitPhoneCode() {
      wx.login({
        success: _res => {
          wx.request({
            url: app.globalData.url + 'admin/user/validCode/',
            // method: 'post',
            data: {
              code: _res.code,
              phone: this.data.phone,
              kaptcha: this.data.phoneCode
            },
            success: res => {
              console.log(res)
              if (res.data.data) {
                wx.setStorage({
                  key: 'phone',
                  data: this.data.phone,
                })
                app.globalData.phone = this.data.phone
                wx.showToast({
                  title: '验证成功',
                })
                clearInterval(this.data.timer)
                this.triggerEvent('isShowPhoneCodeStatus', !res.data.data)
              } else {
                this.setData({
                  phoneCode: ''
                })
                wx.showModal({
                  title: '验证失败',
                  content: '请重新验证',
                })
              }
            }
          })

        }
      })
    }
  }
})