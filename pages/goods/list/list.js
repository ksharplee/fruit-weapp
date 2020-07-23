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
    active: 0,
    sortStatus: false,
    sortPrice: false,
    sortOption: [
      // 默认时间降序0，时间升序1，价格升序2，价格降序3
      { text: '默认时间降序', value: '0' },
      { text: '时间升序', value: '1' },
      { text: '价格升序', value: '2' },
      { text: '价格降序', value: '3' },
    ],
    goodsOption: [{ text: '全部商品', value: '0' }],
    sort: '0',
    option: '0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: (this.store.data.device.windowWidth - 50) / 2,
    });
    this.loadPageData({p: 1});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
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
      .getApi('/g/lists', {
        searchStr: this.data.searchStr,
        order: this.data.sort,
        ...params,
      })
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

  // onChangeTab(e) {
  //   this.setData({
  //     active: e.detail,
  //   });
  //   if (e.detail !== 1) {
  //     this.setData({
  //       sortStatus: false,
  //     });
  //   }
  //   if (e.detail !== 2) {
  //     this.setData({
  //       sortPrice: false,
  //     });
  //   }
  // },

  // onChangeTabbar(e) {
  //   if (e.currentTarget.dataset.index === '0') {
  //     this.setData({
  //       sort: '0',
  //     });
  //   }
  //   if (e.currentTarget.dataset.index === '1') {
  //     if (this.data.sort === '4') {
  //       this.setData({
  //         sort: '1',
  //       });
  //     } else {
  //       this.setData({
  //         sort: '4',
  //       });
  //     }
  //     this.setData({
  //       sortStatus: !this.data.sortStatus,
  //     });
  //   }
  //   if (e.currentTarget.dataset.index === '2') {
  //     if (this.data.sort === '3') {
  //       this.setData({
  //         sort: '2',
  //       });
  //     } else {
  //       this.setData({
  //         sort: '3',
  //       });
  //     }
  //     this.setData({
  //       sortPrice: !this.data.sortPrice,
  //     });
  //   }
  //   this.setData({
  //     list: {
  //       totalItem: '',
  //       data: [],
  //       hasMore: 1,
  //       p: 1,
  //     },
  //   });
  //   this.loadPageData({ p: 1 });
  // },

  onChangeDropdown(e) {
    this.setData({
      sort: e.detail,
    });
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
});
