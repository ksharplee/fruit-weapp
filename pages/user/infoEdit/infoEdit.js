// pages/user/infoEdit/infoEdit.js
import { validation } from '../../../utils/validate.js';
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    userInfo: null,
    submitting: false,
    dnames: '',
    dnamesErrors: [],
    mobile: '',
    mobileErrors: [],
    email: '',
    sex: '1',
    files: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mobile: this.store.data.userInfo.mobile,
      dnames: this.store.data.userInfo.userName,
      email: this.store.data.userInfo.email,
      sex: this.store.data.userInfo.sex,
      files: [{ path: this.store.data.userInfo.logo }],
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

  oversize(e) {
    wx.showToast({ title: '上传图片请勿大于4M', icon: 'none' });
  },

  deleteImg(e) {
    this.setData({ files: [] });
  },

  afterRead(e) {
    const { file } = e.detail;
    const that = this;
    const { target } = e.currentTarget.dataset;
    this.setData({
      files: [
        {
          url: file.path,
          status: 'uploading',
          message: '上传中',
        },
      ],
    });
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseUrl + '/u/upload_img',
      filePath: file.path,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
      },
      formData: { dir: 'other' },
      success(res) {
        const data = JSON.parse(res.data);
        // 上传完成需要更新 fileList
        const arr = [
          {
            path: data.picPath,
            status: 'done',
            message: '完成',
            deletable: true,
          },
        ];
        that.setData({ [target]: arr });
      },
    });
  },

  onChangeSex(e) {
    this.setData({
      sex: e.detail,
    });
  },

  onSubmit(e) {
    if (this.validateName() && this.validateMobile()) {
      this.setData({
        submitting: true,
      });
      app
        .getApi('/u/edit', {
          id: this.store.data.userInfo.id,
          mobile: this.data.mobile,
          dnames: this.data.dnames,
          email: this.data.email,
          sex: this.data.sex,
          logo: this.data.files[0].path,
        })
        .then((res) => {
          this.setData({
            submitting: false,
          });
          this.store.data.userInfo.mobile = this.data.mobile;
          this.store.data.userInfo.userName = this.data.dnames;
          this.store.data.userInfo.sex = this.data.sex;
          this.store.data.userInfo.email = this.data.email;
          this.store.data.userInfo.logo = this.data.files[0]
            ? this.data.files[0].path
            : '';
          this.update();
          wx.navigateBack({
            success: () => {
              wx.showToast({
                title: '编辑成功',
              });
            },
          });
        })
        .catch((err) => {
          this.setData({
            submitting: false,
          });
        });
    }
  },
});
