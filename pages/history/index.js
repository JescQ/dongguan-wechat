// pages/history/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyType:[
      {
        type: 'video',
        text: '历史视频上传',
        url: '../upload_video_history/index'
      },
      {
        type: 'photo',
        text: '历史图片上传',
        url: '../upload_photo_history/index'
      },
      // {
      //   type: 'appointment',
      //   text: '历史预约',
      //   url: '../my_appointment_history/index'
      // }
    ]
  },

  toHistoryByUrl(e){
    console.log(e)
    const url = e.currentTarget.dataset.url
    console.log(url)
    wx.navigateTo({
      url
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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