// pages/order/review/review.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    orderId: '',
    submitting: false,
    goods: {},
    dStatus: 5,
    content: '',
    files: [],
    anonymous: false,
    index: 0,
    subindex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { index, subindex, id } = options;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    this.setData({
      goods: prevPage.data.list.data[index].BusinessOrderDetail[subindex],
      orderId: id,
      index,
      subindex
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {},

  onChangeRate(e) {
    this.setData({
      dStatus: e.detail,
    });
  },

  onChangeTextarea(e) {
    this.setData({
      content: e.detail,
    });
  },

  onChangeCheckbox(e) {
    this.setData({
      anonymous: e.detail,
    });
  },

  oversize(e) {
    wx.showToast({ title: '上传图片请勿大于4M', icon: 'none' });
  },

  deleteImg(index) {
    const arr = this.data.files.splice(index, 1);
    this.setData({ files: arr });
  },

  afterRead(e) {
    const { file } = e.detail;
    const that = this;
    const arr = JSON.parse(JSON.stringify(this.data.files));
    arr.push({
      url: file.path,
      status: 'uploading',
      message: '上传中',
    });
    this.setData({
      files: arr,
    });
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseUrl + '/u/upload_img',
      filePath: file.path,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
      },
      formData: { dir: 'other' },
      success(res) {
        const data = JSON.parse(res.data);
        // 上传完成需要更新 fileList
        arr[arr.length - 1] = {
          path: data.picPath,
          status: 'done',
          message: '完成',
          deletable: true,
        };
        that.setData({ files: arr });
      },
    });
  },

  onSubmit(e) {
    this.setData({
      submitting: true,
    });
    const params = {
      userId: this.store.data.userInfo.id,
      goodId: this.data.goods.goodId,
      orderId: this.data.orderId,
      userName: this.data.anonymous ? '匿名' : this.store.data.userInfo.userName,
      specName: this.data.goods.goodDetailName,
      image: this.data.files.reduce(
        (acc, item) => acc + item.path + ',',
        ''
      ),
      content: this.data.content,
      dStatus: this.data.dStatus * 2,
    };
    app.getApi('/g/addGoodsRemark', params).then(res => {
      this.setData({
        submitting: false
      })
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.setData({
        [`list.data[${index}].BusinessOrderDetail[${subindex}].isRemark`]: '1'
      })
      wx.navigateBack({
        success: () => {
          wx.showToast({
            title: '评价成功'
          })
        }
      })
    }).catch(err => {
      this.setData({
        submitting: false,
      });
    });
  },
});
