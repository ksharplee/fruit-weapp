// pages/goods/detail/detail.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    active: '#goods',
    goods: {},
    device: null,
    cartList: null,
    userInfo: null,
    showSpec: false,
    specIndex: 0,
    currentSpecIndex: 0,
    goodsNumber: 1,
    submitting: false,
    info: 0,
    selectedGoods: null,
    direct: false,
    goodsRecommend: null,
    reviews: {
      data: [],
      p: 1,
      totalItems: '',
      hasMore: 1,
    },
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
    this.setData({
      info: this.store.data.cartList.length,
      imgWidth: (this.store.data.device.windowWidth - 50) / 2,
    });
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
    const promieses = [
      app.getApi('/g/detail', { id }),
      app.getApi('/g/remarkLists', { p: 1, goodsId: id }),
    ];
    Promise.all(promieses).then((res) => {
      res[0].data.detailDesc = res[0].data.detailDesc.replace(
        /\<img/g,
        '<img style="max-width:100%;height:auto;display:block"'
      );
      this.setData({
        goods: res[0].data,
        reviews: res[1].data,
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
      specIndex: this.data.currentSpecIndex,
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

  onClickPurchase(e) {
    this.setData({
      showSpec: true,
      direct: true,
    });
  },

  switchToCart() {
    if (app.isArray(this.store.data.userInfo)) {
      wx.navigateTo({
        url: '/pages/register/register',
      });
      return;
    }
    if (
      +this.data.goods.BaseGoodDetail[this.data.currentSpecIndex].stockNumber <=
      0
    ) {
      wx.showToast({
        title: '商品已售罄',
        icon: 'none',
      });
      return;
    }
    // goodDetailId,goodId unitId goodNumber jifen times
    const params = {
      userId: this.store.data.userInfo.id,
      goodId: this.data.goods.id,
      unitId: this.data.goods.unitId,
      goodNumber: this.data.goodsNumber,
      goodDetailId: this.data.goods.BaseGoodDetail[this.data.currentSpecIndex]
        .detailId,
      jifen: this.data.goods.BaseGoodDetail[this.data.currentSpecIndex].jifen,
      times: this.data.goods.times,
    };
    if (this.data.goods.startTime) {
      params.startTime = this.data.goods.startTime;
    }
    if (this.data.goods.endTime) {
      params.endTime = this.data.goods.endTime;
    }
    if (this.data.direct) {
      const goods = this.data.goods.BaseGoodDetail[this.data.currentSpecIndex];
      this.store.data.selectedGoods = [
        {
          price: goods.price,
          unitId: this.data.goods.unitId,
          goodNumber: this.data.goodsNumber,
          jifen: goods.jifen,
          times: this.data.goods.times,
          goodId: this.data.goods.id,
          detailId: goods.detailId,
          specName: goods.dnames,
          goodsName: this.data.goods.dnames,
          dno: this.data.goods.dno,
          stockNumber: goods.stockNumber,
          image: this.data.goods.BaseGoodImages.length
            ? this.data.goods.BaseGoodImages[0]
            : '',
          unitName: this.data.goods.unitName,
        },
      ];
      this.update();
      this.setData({
        showSpec: false,
      });
      wx.navigateTo({
        url: '/pages/order/add/add',
        success: () => {
          wx.showToast({
            title: '下单成功',
          });
        },
      });
    } else {
      this.setData({
        submitting: true,
      });
      app
        .getApi('/c/add', params)
        .then((res) => {
          this.setData({
            submitting: false,
            showSpec: false,
          });
          app
            .getApi('/c/lists', { userId: this.store.data.userInfo.id })
            .then((res) => {
              this.store.data.cartList = res.data;
              this.update();
              this.setData({
                submitting: false,
                info: res.data.length,
              });
            });
          wx.showToast({
            title: '添加成功',
          });
        })
        .catch((err) => {
          this.setData({
            submitting: false,
          });
        });
    }
  },

  onChangeNumber(e) {
    this.setData({
      goodsNumber: e.detail,
    });
  },

  onChangeTab(e) {
    this.setData({
      active: e.detail.name,
    });
    wx.pageScrollTo({
      selector: e.detail.name,
      duration: 300,
    });
  },
});
