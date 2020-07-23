// pages/goods/detail/detail.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    device: null,
    cartList: null,
    userInfo: null,
    showSpec: false,
    specIndex: 0,
    currentSpecIndex: 0,
    columns: [],
    goodsNumber: 1,
    submitting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      const prevUserId = scene.split('&')[0];
      const secondUserId = scene.split('&')[1];
      app.globalData.prevUserId = prevUserId;
      app.globalData.secondUserId = secondUserId;
    }
    const { id } = options;
    this.loadPageData(id);
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

  loadPageData(id) {
    app
      .getApi('/g/detail', { id })
      .then((res) => {
        this.setData({
          goods: res.data,
        });
      });
  },

  showSpec() {
    this.setData({
      showSpec: true,
    });
  },

  hideSpec() {
    this.setData({
      showSpec: false,
    });
  },

  onConfirmPicker(e) {
    const { index } = e.detail;
    this.setData({
      specIndex: index,
      showSpec: false,
    });
  },

  changeCurrentSpecIndex(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      currentSpecIndex: index,
    });
  },

  onClickIcon() {
    wx.switchTab({
      url: '/pages/cart/index/index',
    });
  },

  onClickAddToCart() {
    this.setData({
      showSpec: true,
    });
  },

  onClickPurchase(e) {},

  switchToCart() {
    if (app.isArray(this.store.data.userInfo)) {
      wx.navigateTo({
        url: '/pages/register/register',
      });
    }
    // goodDetailId,goodId unitId goodNumber jifen times
    const params = {
      userId: this.store.data.userInfo.id,
      goodId: this.data.goods.id,
      unitId: this.data.goods.unitId,
      goodNumber: this.data.goodsNumber,
      jifen: this.data.goods.BaseGoodDetail[this.data.currentSpecIndex].jifen,
      times: 1
    };
    this.setData({
      submitting: true
    })
    app.getApi('/c/add', params).then((res) => {
      this.setData({
        submitting: false,
      });
      wx.switchTab({
        url: '/pages/cart/index/index',
      });
    }).catch(err => {
      this.setData({
        submitting: false,
      });
    });
  },

  onChangeNumber(e) {
    this.setData({
      goodsNumber: e.detail
    })
  },
});
