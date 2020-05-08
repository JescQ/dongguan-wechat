// pages/watch_map/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    config: {
      title: "扫码地图"
    }
  },
  aaa(e){
    // console.log(wx.cloud.callFunction)
    // wx.getLocation({
    //   type: 'wgs84',
    //   success(res) {
    //     console.log(res)
    //   }
    // })
    // wx.chooseImage({
    //   success: (res) => {
    //     console.log(res.tempFilePaths)
    //   },
    // })
  },
  longtap(){},
  look(e){
    console.log(e)
    wx.previewImage({
      urls: [e.currentTarget.dataset.ewm],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.globalFunction(app.globalData.token);
    wx.scanCode({
      success: res=> {
        console.log(res)
      },
      fail:error=>{
        console.log(error)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.globalFunction((state) => {
      this.setData({
        isShow: state
      })
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})