// pages/upload_photo_history/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: 1,
    isShow: false,
    maxPages: 1
  },
  getChildrenCode(res) {
    console.log(res)
    this.setData({
      isShow: res.detail
    })
  },
  historyInit(res) {
    console.log(res)
    this.init()
  },
  modify(e) {},
  cancel(e) {
    wx.showModal({
      title: '警告',
      content: '您确定取消该预约吗?',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.url + 'admin/sysfile/' + e.currentTarget.dataset.id,
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
            fail: function (res) {
              console.log(res)
            },
            complete: function (res) {
              console.log(res)
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  previewImage(e) {
    // console.log(e.currentTarget.dataset)
    // console.log('http://townhall.dg.cn' + e.currentTarget.dataset.filepath)
    wx.previewImage({
      urls: [app.globalData.urlDontHaveSSR + e.currentTarget.dataset.filepath],
      complete(re) {
        console.log(re)
      }
    })
  },
  init() {
    wx.request({
      url: app.globalData.url + 'admin/sysfile/pageByWxOpenid',
      header: {
        'Authorization': app.globalData.token_type + ' ' + app.globalData.token
      },
      data: {
        current: this.data.pages,
        uploadType: 2,
        fileType: 'I'
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

  more() {
    let _pages = this.data.pages
    _pages++
    this.setData({
      pages: _pages
    })
    wx.request({
      url: app.globalData.url + 'admin/sysfile/pageByWxOpenid',
      header: {
        'Authorization': app.globalData.token_type + ' ' + app.globalData.token
      },
      data: {
        current: this.data.pages,
        uploadType: 2,
        fileType: 'I'
      },
      success: res => {
        if (res.statusCode == 401) {
          this.setData({
            isShow: true
          })
          return
        }
        let _list = this.data.list;
        _list.push(...res.data.data.records);
        this.setData({
          list: _list,
          maxPages: res.data.data.pages
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    })
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