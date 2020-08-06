// pages/order/detail/detail.js
const app = getApp();
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: null,
    iconName: '',
    goodsRecommend: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.loaded) {
      this.setIcon();
    } else {
      this.loadPageData(options.id);
    }
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

  loadPageData(id) {
    app.getApi('/o/detail', { orderId: id }).then((res) => {
      this.setData({
        orderDetail: res.data,
      });
      this.setIcon();
    });
  },

  setIcon() {
    let icon = '';
    switch (this.data.orderDetail.dStatus) {
      case '1':
        // return '待付款';
        icon = 'balance-o';
        break;
      case '2':
      // return '已取消';
      case '6':
        // return '已作废';
        icon = 'close';
        break;
      case '4':
      // return '待发货';
      case '7':
      // return '部分发货';
      case '8':
      // return '待收货';
      case '9':
        // return '已收货';
        icon = 'logistics';
        break;
      case '10':
        // return '已完成';
        icon = 'certificate';
        break;
      default:
        break;
    }
    this.setData({
      iconName: icon,
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
        app
          .getApi('/p/pay', {
            openId: app.globalData.openId,
            orderId: this.data.orderDetail.id,
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
