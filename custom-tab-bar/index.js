Component({
  data: {
    selected: 0,
    color: '#999faa',
    selectedColor: '#55b5c1',
    list: [
      {
        pagePath: '/pages/index/index',
        iconPath: '../images/icon-tabbar-home.png',
        selectedIconPath: '../images/icon-tabbar-home-active.png',
        text: '首页',
      },
      {
        pagePath: '/pages/goods/list/list',
        iconPath: '../images/icon-tabbar-bag.png',
        selectedIconPath: '../images/icon-tabbar-bag-active.png',
        text: '商品',
      },
      {
        pagePath: '/pages/cart/index/index',
        iconPath: '../images/icon-tabbar-cart.png',
        selectedIconPath: '../images/icon-tabbar-cart-active.png',
        text: '购物车',
      },
      {
        pagePath: '/pages/user/index/index',
        iconPath: '../images/icon-tabbar-user.png',
        selectedIconPath: '../images/icon-tabbar-user-active.png',
        text: '我的',
      },
    ],
    info: 0
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
      this.setData({
        selected: data.index,
      });
    },
  },
});
