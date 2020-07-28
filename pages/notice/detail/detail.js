// pages/notice/detail/detail.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    notice: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadPageData(options.id, +options.index);
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

  loadPageData(id, index) {
    app
      .getApi('/n/detail', { userId: this.store.data.userInfo.id, msgId: id })
      .then((res) => {
        res.data.content = res.data.content.replace(
          /\<img/g,
          '<img style="max-width:750rpx;height:auto;display:block"'
        );
        this.setData({
          notice: res.data,
        });
        this.store.data.noticeList[index].dStatus = '1';
        this.update();
      });
  },
});
