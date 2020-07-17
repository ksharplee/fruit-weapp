// pages/goods/list/list.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    imgWidth: null,
    loading: false,
    list: {
      totalItem: '',
      data: [],
      hasMore: 1,
      p: 1,
    },
    searchStr: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: (this.store.data.device.windowWidth - 50) / 2,
    });
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
  // onShareAppMessage: function () {

  // }

  loadPageData(params) {
    this.setData({
      loading: true,
    });
    app
      .getApi('/g/lists', { searchStr: this.data.searchStr, ...params })
      .then((res) => {
        const list = res.data;
        list.p = list.currentPage;
        this.setData({
          list,
        });
        this.setData({
          loading: false,
        });
        wx.stopPullDownRefresh();
      })
      .catch(() => {
        this.setData({
          loading: false,
        });
        wx.stopPullDownRefresh();
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
});
