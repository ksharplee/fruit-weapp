// pages/order/list/list.js
const app = getApp();
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    searchStr: '',
    loading: false,
    list: {
      totalItem: '',
      data: [],
      hasMore: 1,
      p: 1,
    },
    active: '0',
    // orderChanged: null,
    orderUnpayed: null,
    orderUnreceived: null,
    orderUnshipped: null,
    orderPartlyShipped: null,
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
  onReady: function () {
    this.loadPageData({ p: 1 });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (this.store.data.orderChanged) {
    // }
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
    if (this.data.list.hasMore) {
      this.loadPageData({
        p: +this.data.list.p + 1,
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {},

  onChangeTab(e) {
    this.setData({
      active: e.detail.name,
      list: {
        totalItem: '',
        data: [],
        hasMore: 1,
        p: 1,
      },
    });
    this.loadPageData({ p: 1 });
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
        dStatus: this.data.active,
        ...params,
      })
      .then((res) => {
        let list = {
          totalItem: '',
          data: [],
          hasMore: 1,
          p: 1,
        };
        if (params.p === 1) {
          list = res.data;
        } else {
          list.data = this.data.list.data.concat(res.data.data);
          list.p = res.data.p;
          list.hasMore = res.data.hasMore;
          list.totalItem = res.data.totalItem;
        }
        this.setData({
          list,
          loading: false,
        });
        // this.store.data.orderChanged = false;
        // this.update();
        wx.stopPullDownRefresh();
      })
      .catch(() => {
        this.setData({
          loading: false,
        });
        wx.stopPullDownRefresh();
      });
  },

  // 查看订单
  onView(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/detail/detail?id=${id}`,
    });
  },

  // 评价
  navigateToReview(e) {
    const { index, subindex, id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/order/review/review?index=${index}&&subindex=${subindex}&&id=${id}`,
    });
  },

  // 取消订单
  onCancle(e) {
    Dialog.confirm({
      title: '确定取消订单吗？',
      message: ' ',
      asyncClose: true,
    })
      .then(() => {
        const { id, index } = e.currentTarget.dataset;
        app
          .getApi('/o/cancelOrder', { id, dStatus: '2' })
          .then((res) => {
            wx.showToast({
              title: '取消成功',
            });
            if (this.data.active === '0') {
              this.setData({
                [`list.data[${index}].dStatus`]: '2',
              });
            } else {
              const arr = JSON.parse(JSON.stringify(this.data.list.data));
              arr.splice(index, 1);
              this.setData({
                ['list.data']: arr,
              });
            }
            this.store.data.orderUnpayed = this.store.data.orderUnpayed - 1;
            this.update();
            Dialog.close();
          })
          .catch((err) => {
            Dialog.close();
          });
      })
      .catch(() => {
        Dialog.close();
      });
  },

  // 去付款
  onPay(e) {
    Dialog.confirm({
      title: '确定付款吗？',
      message: ' ',
      asyncClose: true,
    })
      .then(() => {
        const { id } = e.currentTarget.dataset;
        app
          .getApi('/p/pay', {
            openId: app.globalData.openId,
            orderId: id,
          })
          .then((res) => {
            var data = res.data;
            wx.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: data.signType,
              paySign: data.paySign,
              success: (res) => {
                app
                  .getApi('/p/pay_success', {
                    orderId: id,
                    userId: this.store.data.userInfo.id,
                  })
                  .then((res) => {
                    this.store.data.orderUnpayed =
                      this.store.data.orderUnpayed - 1;
                    this.update();
                    Dialog.close();
                  });
              },
              fail: (err) => {
                // app
                //   .getApi('/p/pay_success', {
                //     orderId: id,
                //     userId: this.store.data.userInfo.id,
                //   })
                //   .then((res) => {
                //     this.store.data.orderUnpayed =
                //       this.store.data.orderUnpayed - 1;
                //     this.update();
                //     Dialog.close();
                //   });
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                });
                Dialog.stopLoading();
                Dialog.close();
              },
            });
          })
          .catch((err) => {
            Dialog.stopLoading();
            Dialog.close();
          });
      })
      .catch(() => {
        Dialog.close();
      });
  },
});
