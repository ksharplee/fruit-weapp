// pages/order/list/list.js
const app = getApp();
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

// Dialog.confirm({
//           title: '确定删除吗？',
//           message: ' ',
// }).then(() => { })

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    searchStr: '',
    list: {
      totalItem: '',
      data: [],
      hasMore: 1,
      p: 1,
    },
    active: '0',
    orderChanged: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      active: options.status ? options.status : '0',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.store.data.orderChanged) {
      this.loadPageData({ p: 1 });
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
  onPullDownRefresh: function () {
    this.setData({
      list: {
        totalItem: '',
        data: [],
        hasMore: 1,
        p: 1,
      },
    });
    this.loadPageData({ p: 1 });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadPageData({
      p: +this.data.list.p + 1,
    });
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {},

  onChangeTab(e) {
    this.setData({
      active: e.detail,
    });
  },

  onInput(e) {
    this.setData({
      searchStr: e.detail,
    });
  },

  onSearch(e) {
    this.loadPageData({ p: 1 });
  },

  onClear(e) {
    this.setData({
      searchStr: '',
    });
    this.loadPageData({ p: 1 });
  },

  loadPageData(params) {
    this.setData({
      loading: true,
    });
    app
      .getApi('/o/lists', {
        userId: this.store.data.userInfo.id,
        searchStr: this.data.searchStr,
        ...params,
      })
      .then((res) => {
        const list = res.data;
        list.p = list.currentPage;
        this.setData({
          list,
          loading: false,
        });
        this.store.data.orderChanged = false;
        this.update();
        wx.stopPullDownRefresh();
      })
      .catch(() => {
        this.setData({
          loading: false,
        });
        wx.stopPullDownRefresh();
      });
  },

  // 取消订单
  onCancle(e) {
    const { id } = e.currentTarget.dataset;
  },

  // 去付款
  onPay(e) {
    const { id } = e.currentTarget.dataset;
  },
});
