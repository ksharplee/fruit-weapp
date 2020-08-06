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
    orderUnpayed: null,
    orderUnreceived: null,
    orderUnshipped: null,
    orderPartlyShipped: null,
    noticeInfo: null,
    goodsRecommend: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: (this.store.data.device.windowWidth - 50) / 2,
    });
  },

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
      this.loadPageData();
    }
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
        info: this.store.data.cartList.length,
      });
    }
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

  navigateToNotice() {
    wx.navigateTo({
      url: '/pages/notice/list/list',
    });
  },

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
      asyncClose: true,
    })
      .then(() => {
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
            Dialog.close();
          });
      })
      .catch(() => {
        Dialog.close();
      });
  },

  loadPageData() {
    const orderUnpayed = app.getApi('/o/lists', {
      p: 1,
      dStatus: '1',
      userId: this.store.data.userInfo.id,
    });
    const orderUnreceived = app.getApi('/o/lists', {
      p: 1,
      dStatus: '8',
      userId: this.store.data.userInfo.id,
    });
    const orderUnshipped = app.getApi('/o/lists', {
      p: 1,
      dStatus: '4',
      userId: this.store.data.userInfo.id,
    });
    const orderPartlyShipped = app.getApi('/o/lists', {
      p: 1,
      dStatus: '7',
      userId: this.store.data.userInfo.id,
    });
    const promises = [
      orderUnpayed,
      orderUnreceived,
      orderUnshipped,
      orderPartlyShipped,
    ];
    Promise.all(promises).then((res) => {
      this.store.data.orderUnpayed = +res[0].data.totalItem;
      this.store.data.orderUnreceived = +res[1].data.totalItem;
      this.store.data.orderUnshipped = +res[2].data.totalItem;
      this.store.data.orderPartlyShipped = +res[3].data.totalItem;
      this.update();
    });
  },

  navigateToOrderList(e) {
    const { status } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/list/list?status=${status}`,
    });
  },
});
