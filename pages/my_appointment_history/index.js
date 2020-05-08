// pages/my_appointment_history/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    config: {
      title: "历史预约"
    },
    isShow: false,
    pages: 1
  },
  getChildrenCode(res) {
    console.log(res)
    this.setData({
      isShow: res.detail
    })
  },
  historyInit() {
    this.init()
  },
  init() {
    wx.request({
      url: app.globalData.url + 'admin/tsubscribe/pageByWxOpenid',
      header: {
        'Authorization': app.globalData.token_type + ' ' + app.globalData.token
      },
      data: {
        current: this.data.pages
      },
      success: res => {
        if (res.statusCode == 401) {
          this.setData({
            isShow: true
          })
          return
        }
        this.setData({
          list: res.data.data.records,
          maxPages: res.data.data.pages
        })
      }
    })
  },
  modify(e) {
    console.log(e.currentTarget.dataset.option)
    wx.navigateTo({
      url: '../appointment/index?option=' + JSON.stringify(e.currentTarget.dataset.option) + '&type=modify'
    })
  },
  cancel(e) {
    wx.showModal({
      title: '警告',
      content: '您确定取消该预约吗?',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.url + 'admin/tsubscribe/' + e.currentTarget.dataset.id,
            header: {
              'Authorization': app.globalData.token_type + ' ' + app.globalData.token
            },
            method: 'DELETE',
            success: (res) => {
              if (res.statusCode == 401) {
                this.setData({
                  isShow: true
                })
              }
              this.init()
            },
            fail: function(res) {
              console.log(res)
            },
            complete: function(res) {
              console.log(res)
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  more() {
    let _pages = this.data.pages
    _pages++
    this.setData({
      pages: _pages
    })
    console.log(this.data.pages)
    wx.request({
      url: app.globalData.url + 'admin/tsubscribe/pageByWxOpenid',
      header: {
        'Authorization': app.globalData.token_type + ' ' + app.globalData.token
      },
      data: {
        current: this.data.pages
      },
      success: res => {
        if (res.statusCode == 401) {
          this.setData({
            isShow: true
          })
        }
        let _list = this.data.list;
        _list.push(...res.data.data.records);
        this.setData({
          list: _list,
          maxPages: res.data.data.pages
        })
        console.log(this.data.list)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    app.globalFunction((state) => {
      console.log(state)
      this.setData({
        isShow: state
      })
      if (!state) {
        this.init()
      }
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