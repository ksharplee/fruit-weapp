// pages/cart/index/index.js
const app = getApp();
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    userInfo: null,
    cartList: null,
    changed: false,
    result: [],
    checkedAll: false,
    priceTotal: 0,
    edit: false,
    submitting: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // if (app.isArray(this.store.data.userInfo)) {
    //   wx.navigateTo({
    //     url: '/pages/register/register',
    //   });
    // }
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
        info: this.store.data.cartList.length,
      });
    }
    this.loadPageData();
  },

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

  loadPageData() {
    if (this.store.data.cartChanged) {
      app
        .getApi('/c/lists', { userId: this.store.data.userInfo.id })
        .then((res) => {
          this.store.data.cartList = res.data;
          this.store.data.cartChanged = false;
          this.update();
          if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
              info: res.data.length,
            });
          }
          this.setData({
            submitting: false,
          });
        });
    }
  },

  setPriceTotal() {
    let price = 0;
    this.data.result.map((item) => {
      const goods = this.data.cartList[+item];
      // if (+goods.goodNumber > +goods.stockNumber) {
      //   wx.showToast({
      //     title: '商品库存不足',
      //     icon: 'none',
      //   });
      //   this.setData({
      //     [`cartList[${item}].goodNumber`]: goods.stockNumber,
      //   });
      // }
      price += +goods.price * +goods.goodNumber;
    });
    this.setData({
      priceTotal: price * 100,
    });
  },

  onChangeCheckGroup(e) {
    if (e.detail.length === this.data.cartList.length) {
      this.setData({
        checkedAll: true,
      });
    } else {
      this.setData({
        checkedAll: false,
      });
    }
    this.setData({
      result: e.detail,
    });
    this.setPriceTotal();
  },

  onChangeCheckAll(e) {
    if (this.data.result.length < this.store.data.cartList.length) {
      const arr = [...new Array(this.data.cartList.length).keys()];
      this.setData({
        result: arr.map((item) => item + ''),
        checkedAll: !this.data.checkedAll,
      });
    } else {
      this.setData({
        result: [],
        checkedAll: !this.data.checkedAll,
      });
    }
    this.setPriceTotal();
  },

  onChangeNumber(e) {
    const { index } = e.currentTarget.dataset;
    const stockNumber = +this.data.cartList[index].stockNumber;
    app.getApi('/c/edit', {
      userId: this.store.data.userInfo.id,
      goodDetailId: this.data.cartList[index].detailId,
      goodNumber: e.detail,
    }).then(res => {
      this.setData({
        [`cartList[${index}].goodNumber`]: e.detail,
      });
      // if (stockNumber >= e.detail) {
      //   this.setData({
      //     [`cartList[${index}].goodNumber`]: e.detail,
      //   });
      // } else {
      //   wx.showToast({
      //     title: '商品库存不足',
      //     icon: 'none',
      //   });
      //   this.setData({
      //     [`cartList[${index}].goodNumber`]: stockNumber,
      //   });
      // }
      this.setPriceTotal();
    }).catch(err => {
      this.setData({
        [`cartList[${index}].goodNumber`]: stockNumber,
      });
      this.setPriceTotal();
    });
  },

  onClickRight() {
    if (!this.data.cartList.length) {
      return;
    }
    this.setData({
      edit: !this.data.edit,
    });
  },

  onClickButton() {
    if (this.data.edit && this.data.result.length) {
      Dialog.confirm({
        title: '确定删除吗？',
        message: ' ',
      }).then(() => {
        this.setData({
          submitting: true,
        });
        const detailId = this.data.result.map((item) => {
          return this.data.cartList[+item].detailId;
        });
        app
          .getApi('/c/delete', {
            goodDetailId: JSON.stringify(detailId),
            userId: this.store.data.userInfo.id,
          })
          .then((res) => {
            wx.showToast({
              title: '删除成功',
            });
            this.setData({
              result: [],
              checkedAll: false
            })
            this.store.data.cartChanged = true;
            this.update();
            this.loadPageData();
          })
          .catch((err) => {
            this.setData({
              submitting: false,
            });
          });
      });
    }
  },
});
