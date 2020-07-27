// pages/user/addressOperation/addressOperation.js
const app = getApp();
import area from "../../../utils/area";
import { validation } from '../../../utils/validate.js';

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    contacter: '',
    contacterErrors: [],
    mobile: '',
    mobileErrors: [],
    areaList: {},
    addressPart: '',
    addressId: '',
    fullAddr: '',
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.edit) {
      wx.setNavigationBarTitle({
        title: '编辑收货地址',
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
  console.log("函数: getAddressPart -> e", e)

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
      target: 'dnames',
      rules: 'required',
      v: this.data.dnames,
      name: '姓名',
    });
    if (!v) {
      this.scrollDown('#dnames');
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
    if (this.validateName() && this.validateMobile()) {
      this.setData({
        submitting: true,
      });
    }
  },
});
