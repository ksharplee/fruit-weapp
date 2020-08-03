// pages/user/index/index.js
const app = getApp();
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    userInfo: null,
    registered: false,
    orderUnpayed: 0,
    orderUnreceived: 0,
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
    if (app.isObject(this.store.data.userInfo)) {
      // wx.navigateTo({
      //   url: '/pages/register/register',
      // });
      this.setData({
        registered: true,
      });
    }
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
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
  onShareAppMessage: function () {},

  navigateToRegister() {
    wx.navigateTo({
      url: '/pages/register/register',
    });
  },

  navigateToInfo() {
    wx.navigateTo({
      url: '/pages/user/info/info',
    });
  },

  applyForAgency() {
    Dialog.confirm({
      title: '确定申请为代理吗？',
      message: ' ',
    }).then(() => {
      app
        .getApi('/u/setUserDaili', {
          id: this.store.data.userInfo.id,
          isDaili: '1',
        })
        .then((res) => {
          this.store.data.userInfo.isDaili = '1';
          this.update();
          wx.showToast({
            title: '申请成功',
          });
        });
    });
  },

  loadPageData() {
    const orderUnpayed = app.getApi('/o/lists', { p: 1, dStatus: '1' });
    const orderUnreceived = app.getApi('/o/lists', { p: 1, dStatus: '8' });
    const promises = [orderUnpayed, orderUnreceived];
    Promise.all(promises).then((res) => {
      this.setData({
        orderUnpayed: +res[0].data.totalItem,
        orderUnreceived: +res[1].data.totalItem,
      });
    });
  },

  navigateToOrderList(e) {
    const { status } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/list/list?status=${status}`,
    });
  },
});
