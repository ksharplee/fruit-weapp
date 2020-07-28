// pages/user/addressList/addressList.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    userInfo: null,
    addressList: null,
    addressChanged: null,
    selected: '',
    edit: false,
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
  onShow: function () {
    if (this.store.data.addressChanged) {
      this.loadPageData();
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

  loadPageData() {
    app
      .getApi('/u/getUserAddress', { userId: this.store.data.userInfo.id })
      .then((res) => {
        this.store.data.addressList = res.data;
        this.store.data.addressChanged = false;
        this.update();
        const selectedItem = res.data.find((item) => item.isDefault === '1');
        this.setData({
          selected: selectedItem ? selectedItem.id : '',
        });
      });
  },

  addAddress() {
    wx.navigateTo({
      url: '/pages/user/addressOperation/addressOperation',
    });
  },

  onChangeRadioGroup(e) {
    this.setData({
      selected: e.detail,
    });
  },

  navigateToEdit(e) {
    const { index } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/user/addressOperation/addressOperation?index=${index}&&edit=1`,
    });
  },
});
