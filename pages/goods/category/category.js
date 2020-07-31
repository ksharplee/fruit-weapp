// pages/goods/category/category.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    categoryId: '0',
    mainActiveIndex: 0,
    cateList: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      categoryId: options.categoryId,
      mainActiveIndex: +options.index,
    });
    if (!this.store.data.cateList.length) {
      this.loadPageData();
    }
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

  loadPageData() {
    app.getApi('/g/cateList').then((res) => {
      this.store.data.cateList = res.data.map((item) => {
        return {
          id: item.id,
          text: item.dnames,
          dLevel: item.dLevel,
          children: item.child
            ? item.child.map((subItem) => {
                return {
                  id: subItem.id,
                  text: subItem.dnames,
                  dLevel: subItem.dLevel,
                  image: subItem.image,
                  parentId: subItem.parentId,
                };
              })
            : [],
        };
      });
      this.update();
    });
  },

  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickItem({ detail = {} }) {
    const categoryId = this.data.categoryId === detail.id ? null : detail.id;

    this.setData({ categoryId });
  },

  getCategoryGoods(e) {
    const { index } = e.currentTarget.dataset;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (index || index === 0) {
      prevPage.setData({
        searchCategory: true,
        mainActiveIndex: this.data.mainActiveIndex,
        categoryName: this.data.cateList[this.data.mainActiveIndex].children[index].text,
        categoryId: this.data.cateList[this.data.mainActiveIndex].children[index].id
      });
    } else {
      prevPage.setData({
        searchCategory: true,
        mainActiveIndex: this.data.mainActiveIndex,
        categoryName: this.data.cateList[this.data.mainActiveIndex].text,
        categoryId: this.data.cateList[this.data.mainActiveIndex].id,
      });
    }
    wx.navigateBack()
  },
});
