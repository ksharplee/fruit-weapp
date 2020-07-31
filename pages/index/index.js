//index.js
//获取应用实例
const app = getApp();

app.create(app.store, {
  data: {
    device: null,
    userInfo: null,
    banners: [],
    goods: [],
    cartList: null,
    noticeList: null,
    noticeInfo: 0,
  },

  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    }
    this.setData({
      imgWidth: (this.store.data.device.windowWidth - 50) / 2,
    });
    this.loadPageData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        info: this.store.data.cartList.length,
      });
    }
    this.setData({
      noticeInfo: this.store.data.noticeList.filter((item) => item.dStatus === '0').length,
    });
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },

  /**
   * 加载页面数据
   *
   */
  async loadPageData() {
    if (!app.globalData.sessionId) {
      await app.login();
    }
    let promises = [
      app.getApi('/i/getAd'),
      app.getApi('/i/getGoods', { num: 10 }),
    ];
    if (app.isObject(this.store.data.userInfo)) {
      promises = promises.concat([
        app.getApi('/n/lists', { userId: this.store.data.userInfo.id }),
        app.getApi('/c/lists', { userId: this.store.data.userInfo.id }),
      ]);
    }
    Promise.all(promises).then((res) => {
      this.setData({
        banners: res[0].data,
        goods: res[1].data,
      });
      if (app.isObject(this.store.data.userInfo)) {
        this.store.data.noticeList = res[2].data;
        this.store.data.cartList = res[3].data;
        this.setData({
          noticeInfo: res[2].data.filter((item) => item.dStatus === '0').length,
        });
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
          this.getTabBar().setData({
            info: res[3].data.length,
          });
        }
        this.update();
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  onClickLeft() {
    wx.navigateTo({
      url: '/pages/register/register',
    });
  },

  onClickRight() {
    wx.navigateTo({
      url: '/pages/notice/list/list',
    });
  },
});
