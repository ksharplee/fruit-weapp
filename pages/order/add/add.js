// pages/order/add/add.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    userInfo: null,
    addressList: null,
    selectedGoods: [],
    priceTotal: 0,
    price: 0,
    addressIndex: 0,
    memo: '',
    useJifen: false,
    points: 0,
    submitting: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadPageData();
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
  // onShareAppMessage: function () { },

  changeMemo(e) {
    this.setData({
      memo: e.detail,
    });
  },

  onChangeSwitch(e) {
    this.setData({
      useJifen: e.detail,
    });
    // if (e.detail) {
    //   this.setData({
    //     priceTotal: this.data.price - +this.store.data.userInfo.jifen * 10,
    //   });
    // } else {
    //   this.setData({
    //     priceTotal: this.data.price,
    //   });
    // }
  },

  loadPageData() {
    // 默认收货地址，已选商品
    if (!this.store.data.addressList.lenth) {
      app
        .getApi('/u/getUserAddress', { userId: this.store.data.userInfo.id })
        .then((res) => {
          this.store.data.addressList = res.data ? res.data : [];
          this.update();
          this.setData({
            addressIndex: this.store.data.addressList.findIndex(
              (item) => item.isDefault === '1'
            ),
          });
        });
    } else {
      this.setData({
        addressIndex: this.store.data.addressList.findIndex(
          (item) => item.isDefault === '1'
        ),
      });
    }
    const price = this.store.data.selectedGoods.reduce(
      (acc, item) =>
        (acc += parseInt(item.price) * parseInt(item.goodNumber) * 100),
      0
    );
    this.setData({
      priceTotal: price,
      price: price,
    });
  },

  changeJifen(e) {
    this.setData({
      points: e.detail,
    });
  },

  checkJifen(e) {
    let jifen = e.detail.value;
    if (jifen > +this.data.userInfo.jifen) {
      wx.showToast({
        title: '您的积分不足',
        icon: 'none',
      });
      jifen = +this.data.userInfo.jifen;
    } else if (jifen < 0) {
      wx.showToast({
        title: '积分不能小于0',
        icon: 'none',
      });
      jifen = 0;
    } else if (jifen / 10 > this.data.price / 100) {
      jifen = (this.data.price / 100) * 10;
      wx.showToast({
        title: `您本单只需消耗积分${jifen}分`,
        icon: 'none',
      });
    }
    this.setData({
      points: jifen,
      priceTotal: this.data.price - jifen * 10,
    });
  },

  // 提交订单
  onClickButton() {
    if (this.addressIndex === -1) {
      wx.showToast({
        title: '请先设置收货地址',
        icon: 'none',
      });
      return;
    }
    this.setData({
      submitting: true,
    });
    const address = this.data.addressList[this.data.addressIndex];
    const freeAmount = this.useJifen ? +this.data.userInfo.jifen * 10 : 0;
    const BusinessOrderDetail = this.data.selectedGoods.map((item) => {
      return {
        goodId: item.goodId,
        goodNo: item.dno,
        goodName: item.goodsName,
        goodDetailId: item.detailId,
        goodDetailName: item.specName,
        unitId: item.unitId,
        unitName: item.unitName,
        goodNumber: item.goodNumber,
        price: item.price,
        amount: +item.price * +item.goodNumber,
        image: item.image,
        jifen: item.jifen,
        times: item.times,
        singleAmountJiFen: +item.jifen * +item.times * +item.goodNumber,
      };
    });
    const params = {
      buyerId: this.data.userInfo.id,
      buyerName: this.data.userInfo.userName,
      contacter: address.contacter,
      amount: this.data.priceTotal / 100,
      addr: address.addressPart + ' ' + address.fullAddr,
      mobile: address.mobile,
      freeAmount,
      actualAmount: (this.data.priceTotal - freeAmount) / 100,
      memo: this.data.memo,
      BusinessOrderDetail: JSON.stringify(BusinessOrderDetail),
      points: Math.floor(this.data.points),
    };
    console.log("函数: onClickButton -> params", params)
    // return
    app
      .getApi('/o/add', params)
      .then((res) => {
        this.setData({
          submitting: false,
        });
        this.store.data.orderDetail = res.data;
        this.store.data.selectedGoods = [];
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        const prevData = prevPage.data;
        if (prevPage.route === 'pages/cart/index/index') {
          // 根据购物车页面的result删除商品
          const arr = JSON.parse(JSON.stringify(this.store.data.cartList));
          prevData.result.map((item) => {
            arr.splice(+item, 1);
          });
          this.store.data.cartList = arr;
        }
        this.update();
        wx.redirectTo({
          url: '/pages/order/detail/detail?loaded=1',
        });
        // wx.redirectTo({
        //   url: `/pages/order/success/success?no=${res.data.orderNo}`,
        //   success: () => {
        //     this.store.data.cartChanged = true;
        //     this.update();
        //   },
        // });
      })
      .catch((err) => {
        this.setData({
          submitting: false,
        });
      });
  },
});
