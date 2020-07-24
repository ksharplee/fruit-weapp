// pages/cart/index/index.js
const app = getApp();

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
        });
    }
  },

  onChange(e) {
    this.setData({
      result: e.detail
    })
  },
});
