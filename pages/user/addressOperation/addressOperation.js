// pages/user/addressOperation/addressOperation.js
const app = getApp();
import area from '../../../utils/area';
import { validation } from '../../../utils/validate.js';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    addressList: null,
    contacter: '',
    contacterErrors: [],
    mobile: '',
    mobileErrors: [],
    areaList: {},
    addressPart: '',
    addressPartErrors: [],
    addressId: '',
    fullAddr: '',
    fullAddrErrors: [],
    show: false,
    isDefault: false,
    edit: false,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.edit) {
      wx.setNavigationBarTitle({
        title: '编辑收货地址',
      });
      const address = this.store.data.addressList[+options.index];
      this.setData({
        id: address.id,
        contacter: address.contacter,
        mobile: address.mobile,
        addressPart: address.addressPart,
        addressId: address.addressId,
        fullAddr: address.fullAddr,
        isDefault: address.isDefault === '1' ? true : false,
        edit: true
      });
    }
    this.setData({
      areaList: area,
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

  onChangeSwitch(e) {
    this.setData({ isDefault: e.detail });
  },

  hidePopup() {
    this.setData({
      show: false,
    });
  },

  showPopup() {
    this.setData({
      show: true,
    });
  },

  getAddressPart(e) {
    const addressId = e.detail.values[e.detail.values.length - 1].code;
    const addressPart = e.detail.values.map((item) => item.name).join(' ');
    this.setData({
      addressId,
      addressPart,
      show: false,
    });
  },

  changeInput(e) {
    const target = e.currentTarget.dataset.target;
    this.setData({
      [target]: e.detail,
    });
  },

  onBlur(e) {
    const { target, name, rules, params } = e.currentTarget.dataset;
    this.validateInput({ target, rules, v: e.detail.value, name, params });
  },

  validateInput(target) {
    this.setData({
      [`${target.target}Errors`]: validation(
        target.rules.split('|'),
        target.v,
        target.name,
        target.params
      ),
    });
    return !this.data[`${target.target}Errors`].length;
  },

  validateMobile() {
    const v = this.validateInput({
      target: 'mobile',
      rules: 'required|mobile',
      v: this.data.mobile,
      name: '手机号码',
    });
    if (!v) {
      this.scrollDown('#mobile');
    }
    return v;
  },

  validateName() {
    const v = this.validateInput({
      target: 'contacter',
      rules: 'required',
      v: this.data.contacter,
      name: '联系人',
    });
    if (!v) {
      this.scrollDown('#contacter');
    }
    return v;
  },

  validateFullAddr() {
    const v = this.validateInput({
      target: 'fullAddr',
      rules: 'required',
      v: this.data.fullAddr,
      name: '详细地址',
    });
    if (!v) {
      this.scrollDown('#fullAddr');
    }
    return v;
  },

  validateAddressPart() {
    const v = this.validateInput({
      target: 'addressPart',
      rules: 'required',
      v: this.data.addressPart,
      name: '地区',
    });
    if (!v) {
      this.scrollDown('#addressPart');
    }
    return v;
  },

  scrollDown(target) {
    wx.pageScrollTo({
      selector: target,
      duration: 300,
    });
  },

  onSubmit(e) {
    if (this.validateName() && this.validateMobile() && this.validateAddressPart() && this.validateFullAddr()) {
      this.setData({
        submitting: true,
      });
      if (this.data.edit) {
        app
          .getApi('/u/addressEdit', {
            id: this.data.id,
            userId: this.store.data.userInfo.id,
            contacter: this.data.contacter,
            mobile: this.data.mobile,
            addressPart: this.data.addressPart,
            addressId: this.data.addressId,
            fullAddr: this.data.fullAddr,
            isDefault: this.data.isDefault ? '1' : '0',
          })
          .then((res) => {
            this.store.data.addressChanged = true;
            this.update();
            wx.navigateBack({
              success: () => {
                wx.showToast({
                  title: '编辑成功',
                });
              },
            });
          });
      } else {
        app
          .getApi('/u/addressAdd', {
            userId: this.store.data.userInfo.id,
            contacter: this.data.contacter,
            mobile: this.data.mobile,
            addressPart: this.data.addressPart,
            addressId: this.data.addressId,
            fullAddr: this.data.fullAddr,
            isDefault: this.data.isDefault ? '1' : '0',
          })
          .then((res) => {
            this.store.data.addressChanged = true;
            this.update();
            wx.navigateBack({
              success: () => {
                wx.showToast({
                  title: '添加成功',
                });
              },
            });
          });
      }
    }
  },

  onClickRight() {
    Dialog.confirm({
      title: '确定删除吗？',
      message: ' '
    }).then(() => {
      app.getApi('/u/addressdelete', { id: this.data.id }).then(res => {
        this.store.data.addressChanged = true;
        this.update();
        wx.navigateBack({
          success: () => {
            wx.showToast({
              title: '删除成功'
            })
          }
        })
      });
    })
  }
});
