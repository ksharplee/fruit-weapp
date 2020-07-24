//app.js
import store from './store/store.js';
import create from './utils/create.js';

App({
  create,
  store,
  globalData: {
    userInfo: null,
    // baseUrl: 'https://www.silicone.vip',
    baseUrl: 'http://home.fruit.com',
    sessionId: '',
    openId: '',
    prevUserId: '0',
    secondUserId: '0'
  },

  onLaunch: function () {
    if (wx.canIUse('getUpdateManager')) {
      //小程序版本更新处理
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              },
            });
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content:
                '新版本已经上线啦~，请您删除当前小程序，重新搜索"义数订货"打开哟~',
            });
          });
        }
      });
    }
    wx.getSystemInfo({
      success: (res) => {
        this.store.data.device = res;
      },
      fail: (err) => {
        wx.showToast({
          title: '无法读取设备信息，App展示效果将受到影响',
          icon: 'none',
        });
      }
    });

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync('logs', logs);

    // 登录
    // wx.login({
    //   success: (res) => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     const { code } = res;
    //     wx.request({
    //       url: `${this.globalData.baseUrl}/u/getUserInfo`,
    //       type: 'GET',
    //       data: { code },
    //       header: {
    //         'content-type': 'application/json',
    //       },
    //       success: (res) => {
    //         this.globalData.sessionId = res.sessionId;
    //         this.globalData.openId = res.openid;
    //       },
    //       fail: (err) => {
    //         wx.showToast({
    //           title: '登录失败',
    //           icon: 'none',
    //         });
    //       },
    //     });
    //   },
    // });
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            },
          });
        }
      },
    });
  },

  async getApi(url, params = {}, contentType) {
    wx.showNavigationBarLoading();
    // if (!this.globalData.sessionId) {
    //   await this.login();
    // }
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.baseUrl + url}`,
        method: 'POST',
        header: {
          'Content-Type': contentType
            ? contentType
            : 'application/x-www-form-urlencoded',
          Cookie: `PHPSESSID=${this.globalData.sessionId}`,
        },
        data: params,
        success: (res) => {
          if (res.data.status === 1) {
            resolve(res.data);
          } else if (res.status === -1001) {
            this.login().then(res => {
              this.getApi(url, params, contentType)
            })
          } else {
            wx.showToast({
              title: res.data.info ? res.data.info : '调用失败，请重试',
              icon: 'none',
            });
            reject(res.data.status);
          }
          wx.hideNavigationBarLoading();
        },
        fail: (err) => {
          reject(err);
          wx.showToast({
            title: err.message,
            icon: 'none',
          });
          wx.hideNavigationBarLoading();
        },
      });
    });
  },

  async login() {
    wx.showLoading({
      title: '登录中...'
    })
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          const { code } = res;
          wx.request({
            url: `${this.globalData.baseUrl}/u/getUserInfo`,
            type: 'GET',
            data: { code },
            header: {
              'content-type': 'application/json',
            },
            success: (res) => {
              if (this.isObject(res.data.data)) {
                this.globalData.secondUserId = res.data.data.secondUserId;
                this.globalData.prevUserId = res.data.data.prevUserId;
              }
              this.globalData.sessionId = res.data.sessionId;
              this.globalData.openId = res.data.openId;
              this.store.data.userInfo = res.data.data;
              this.store.update();
              wx.hideLoading()
              resolve(1);
            },
            fail: (err) => {
              wx.hideLoading();
              wx.showToast({
                title: '登录失败',
                icon: 'none',
              });
            },
          });
        },
      });
    });
  },

  isArray(arr) {
    if (Object.prototype.toString.call(arr) == "[object Array]") {
      return true
    }
    return false
  },

  isObject(arr) {
    if (Object.prototype.toString.call(arr) == '[object Object]') {
      return true;
    }
    return false
  },
});
