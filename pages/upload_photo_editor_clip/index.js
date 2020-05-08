const app = getApp()
Page({
  data: {
    src: '',
    width: 275,//宽度
    height: 250,//高度
    max_width: 400,
    max_height: 400,
    disable_bgc: true,
    disable_width: true,
    disable_height: true,
    disable_rotate: true,//是否禁用旋转
    disable_ratio: false,//锁定比例
    limit_move: true,//是否限制移动
  },
  onLoad: function (options) {
    this.cropper = this.selectComponent("#image-cropper");
    this.cropper.upload();//上传图片
  },
  cropperload(e) {
    console.log('cropper加载完成');
  },
  loadimage(e) {
    wx.hideLoading();
    console.log('图片');
    this.cropper.imgReset();
  },
  clickcut(e) {
    console.log(e.detail);
    //图片预览
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  upload() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '加载中',
        })
        const tempFilePaths = res.tempFilePaths[0];
        //重置图片角度、缩放、位置
        that.cropper.imgReset();
        that.setData({
          src: tempFilePaths
        });
      }
    })
  },
  setCutLeft(e) {
    this.setData({
      cut_left: e.detail.value
    });
    this.setData({
      cut_left: this.cropper.data.cut_left
    });
  },
  switchChangeDisableBgc(e){
    console.log(e)
    if (!e.detail.value) {
      this.setData({
        imgBgc: false,
        disable_bgc: e.detail.value
      });
    } else {
      this.setData({
        disable_bgc: e.detail.value
      });
    }
  },
  switchChangeDisableRotate(e) {
    //开启旋转的同时不限制移动
    if (!e.detail.value) {
      this.setData({
        limit_move: false,
        disable_rotate: e.detail.value
      });
    } else {
      this.setData({
        disable_rotate: e.detail.value
      });
    }
  },
  submit() {
    this.cropper.getImg((obj) => {
      wx.hideLoading();
      app.globalData.imgSrc = obj.url;
      wx.navigateTo({
        url: '../upload_photo_editor_addtext/index?path='+obj.url
      })
    });
  },
  rotate() {
    //在用户旋转的基础上旋转90°
    this.cropper.setAngle(this.cropper.data.angle += 90);
  },
  top() {
    this.data.top = setInterval(() => {
      this.cropper.setTransform({
        y: -3
      });
    }, 1000 / 60)
  },
  bottom() {
    this.data.bottom = setInterval(() => {
      this.cropper.setTransform({
        y: 3
      });
    }, 1000 / 60)
  },
  left() {
    this.data.left = setInterval(() => {
      this.cropper.setTransform({
        x: -3
      });
    }, 1000 / 60)
  },
  right() {
    this.data.right = setInterval(() => {
      this.cropper.setTransform({
        x: 3
      });
    }, 1000 / 60)
  },
  narrow() {
    this.data.narrow = setInterval(() => {
      this.cropper.setTransform({
        scale: -0.02
      });
    }, 1000 / 60)
  },
  enlarge() {
    this.data.enlarge = setInterval(() => {
      this.cropper.setTransform({
        scale: 0.02
      });
    }, 1000 / 60)
  },
  end(e) {
    clearInterval(this.data[e.currentTarget.dataset.type]);
  },
})