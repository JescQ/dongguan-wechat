// pages/upload_photo_editor_addtext/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    imgViewHeight: 0,
    allColor: ['#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#ffaec9', '#a349a4', '#ffffff', '#c3c3c3'],
    //添加文字
    isChooseFontSize: false,
    isChooseFontColor: false,
    isChooseFontPattern: false,
    allText: {},
    input_value: '',
    // texted:false,
    inputFocus: false
  },

  loadImgOnImage(self) {
    wx.getImageInfo({
      src: self.data.tempImageSrc,
      success: function(res) {
        self.oldScale = 1
        self.initRatio = res.height / self.imgViewHeight //转换为了px 图片原始大小/显示大小
        if (self.initRatio < res.width / (750 * self.deviceRatio)) {
          self.initRatio = res.width / (750 * self.deviceRatio)
        }
        //图片显示大小
        self.scaleWidth = (res.width / self.initRatio)
        self.scaleHeight = (res.height / self.initRatio)

        self.initScaleWidth = self.scaleWidth
        self.initScaleHeight = self.scaleHeight
        self.startX = 750 * self.deviceRatio / 2 - self.scaleWidth / 2;
        self.startY = self.imgViewHeight / 2 - self.scaleHeight / 2;
        self.setData({
          imgWidth: self.scaleWidth,
          imgHeight: self.scaleHeight,
          imgTop: self.startY,
          imgLeft: self.startX
        })
        wx.hideLoading();
      }
    })
  },

  //添加文字
  toTextPage() {
    var self = this
    loadImgOnImage(self)
    self.setData({
      page: 'textPage'
    })
  },
  focusInput() {
    this.setData({
      inputFocus: !this.data.inputFocus,
    })
  },
  inputText(e) {
    var allText = this.data.allText
    allText.someText = e.detail.value
    console.log(allText)
    if (allText.someText.length == 0) {
      allText.someText = "点击输入文字"
    }
    this.setData({
      allText: allText,
      input_value: e.detail.value
    })
  },
  textMoveStart(e) {
    this.textX = e.touches[0].clientX
    this.textY = e.touches[0].clientY
  },
  textMove(e) {
    var allText = this.data.allText
    var dragLengthX = (e.touches[0].clientX - this.textX)
    var dragLengthY = (e.touches[0].clientY - this.textY)
    var minTextL = 0
    var minTextT = 0
    var maxTextL = (750 - 100) * this.deviceRatio
    var maxTextT = this.imgViewHeight - 40 * this.deviceRatio
    var newTextL = allText.textL + dragLengthX
    var newTextT = allText.textT + dragLengthY
    if (newTextL < minTextL) newTextL = minTextL
    if (newTextL > maxTextL) newTextL = maxTextL
    if (newTextT < minTextT) newTextT = minTextT
    if (newTextT > maxTextT) newTextT = maxTextT

    allText.textL = newTextL
    allText.textT = newTextT
    this.setData({
      allText: allText,
      isChooseFontSize: false,
      isChooseFontColor: false,
      isChooseFontPattern: false
    })
    this.textX = e.touches[0].clientX
    this.textY = e.touches[0].clientY
  },
  chooseaddText() {
    var allText = {}
    allText = {
      idx: allText.length - 1,
      someText: "点击输入文字",
      fontColor: this.fontColor ? this.fontColor : 'rgba(20,20,20,0.8)',
      fontSize: this.fontSize ? this.fontSize : 20,
      fontStyle: 'normal',
      fontWeight: 'normal',
      textL: (750 - 200) * this.deviceRatio / 2,
      textT: this.imgViewHeight / 2 - this.scaleHeight / 2 + 20,
      isTextActive: true,
    }
    console.log(allText)
    this.setData({
      allText: allText,
      isChooseFontSize: false,
      isChooseFontColor: false,
      isChooseFontPattern: false
    })
  },
  cancelAddText() {
    var allText = this.data.allText
    allText.isTextActive = false
    console.log(allText)
    this.setData({
      input_value: '',
      allText: allText,
      inputFocus: false,
      isChooseFontSize: false,
      isChooseFontColor: false,
      isChooseFontPattern: false
    })
  },
  competeAddText() {
    var self = this
    var allText = this.data.allText
    console.log(this.data.isTextActive)
    if (allText.isTextActive) {
      console.log(23232323)
      if (allText.someText == "点击输入文字" || allText.someText == "") {
        this.cancelAddText()
      } else {
        wx.showLoading({
          title: '保存文字',
          mask: true,
        })
        allText.isTextActive = false
        var initRatio = self.initRatio
        if (self.initRatio < 1) { //解决问题：小图或者过度裁剪后的图添加文字时文字虚化
          initRatio = 1
        }
        var tempCanvasWidth = self.scaleWidth * initRatio
        var tempCanvasHeight = self.scaleHeight * initRatio

        this.setData({
          allText: allText,
          inputFocus: false,
          isChooseFontSize: false,
          isChooseFontColor: false,
          isChooseFontPattern: false,
          tempCanvasWidth: tempCanvasWidth,
          tempCanvasHeight: tempCanvasHeight
        })

        var ctx = wx.createCanvasContext('tempCanvas')
        ctx.drawImage(self.data.tempImageSrc, 0, 0, tempCanvasWidth, tempCanvasHeight)
        ctx.setFillStyle(allText.fontColor)
        var canvasFontSize = Math.ceil(allText.fontSize * initRatio)
        ctx.font = allText.fontStyle + ' ' + allText.fontWeight + ' ' + canvasFontSize + 'px sans-serif'
        ctx.setTextAlign('left')
        ctx.setTextBaseline('top')
        ctx.fillText(allText.someText, (allText.textL - self.startX) * initRatio, (allText.textT - self.startY + 5) * initRatio)
        ctx.draw()
        //保存图片到临时路径
        saveImgUseTempCanvas(self, 100, null)
      }
    }
    this.saveImgToPhone()

  },
  chooseFontsize() {
    this.setData({
      isChooseFontSize: !this.data.isChooseFontSize,
      isChooseFontColor: false,
      isChooseFontPattern: false
    })
  },
  fontsizeSliderChange(e) {
    this.fontSize = e.detail.value
    var allText = this.data.allText
    if (allText !== {} && (allText.isTextActive)) {
      allText.fontSize = this.fontSize
      this.setData({
        allText: allText
      })
    }
  },
  chooseFontColor() {
    this.setData({
      isChooseFontSize: false,
      isChooseFontColor: !this.data.isChooseFontColor,
      isChooseFontPattern: false
    })
  },
  fontColorChange(e) {
    this.fontColor = e.target.dataset.selected
    var allText = this.data.allText
    if (allText && (allText.isTextActive)) {
      allText.fontColor = this.fontColor
      this.setData({
        allText: allText
      })
    }
  },
  chooseFontPattern() {
    this.setData({
      isChooseFontSize: false,
      isChooseFontColor: false,
      isChooseFontPattern: !this.data.isChooseFontPattern
    })
  },
  fontStyleChange(e) {
    this.fontStyle = e.detail.value ? 'oblique' : 'normal'
    var allText = this.data.allText
    if (allText !== {} && (allText.isTextActive)) {
      allText.fontStyle = this.fontStyle
      this.setData({
        allText: allText
      })
    }
  },
  fontWeightChange(e) {
    this.fontWeight = e.detail.value ? 'bold' : 'normal'
    var allText = this.data.allText
    if (allText !== {} && (allText.isTextActive)) {
      allText.fontWeight = this.fontWeight
      this.setData({
        allText: allText
      })
    }
  },
  textToMainPage() {
    loadImgOnImage(this)
    this.setData({
      allText: [],
      page: 'mainPage'
    })
  },
  //保存照片
  saveImgToPhone() {
    wx.showLoading({
      title: '生成图片中！',
    })
    setTimeout(() => {
      wx.hideLoading();
      wx.navigateTo({
        url: '../upload_photo/index?path=' + this.data.tempImageSrc
      })
    }, 500)
  },
  _save() {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var self = this
    // app.globalFunction(app.globalData.token);
    // self.device = wx.getSystemInfoSync()
    self.device = app.globalData.myDevice
    self.deviceRatio = self.device.windowWidth / 750
    self.imgViewHeight = self.device.windowHeight - 160 * self.deviceRatio - 160 / app.globalData.RpxPx
    self.setData({
      imgViewHeight: self.imgViewHeight,
      // tempCanvasHeight: self.imgViewHeight,
      page: 'mainPage',
      tempImageSrc: self.data.options.path,
      originImageSrc: self.data.options.path
    })
    self.loadImgOnImage(self)
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

function saveImgUseTempCanvas(self, delay, fn) {
  setTimeout(function() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: self.data.tempCanvasWidth,
      height: self.data.tempCanvasHeight,
      destWidth: self.data.tempCanvasWidth,
      destHeight: self.data.tempCanvasHeight,
      fileType: 'png',
      quality: 1,
      canvasId: 'tempCanvas',
      success: function(res) {
        wx.hideLoading();
        console.log(res.tempFilePath)
        self.setData({
          tempImageSrc: res.tempFilePath
        })
        if (fn) {
          fn(self)
        }
      }
    })
  }, delay)
}