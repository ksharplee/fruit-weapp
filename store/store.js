export default {
  data: {
    device: null,
    userInfo: null,
    categories: [],
    cartChanged: false,
    noticeList: [],
    cartList: [],
    addressList: [],
    fixedFooter: 0,
    addressChanged: true,
    cateList: [],
    selectedGoods: [],
    orderDetail: {},
    orderChanged: true,
    goodsSearchStr: ''
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // logs: [],
    // b: {
    //   arr: [{ name: '数值项目1' }],
    //   //深层节点也支持函数属性
    //   fnTest: function () {
    //     return this.motto.split('').reverse().join('')
    //   }
    // },
    // firstName: 'dntss',
    // lastName: 'zhang',
    // fullName: function () {
    //   return this.firstName + this.lastName
    // },
    // pureProp: 'pureProp',
    // globalPropTest: 'abc', //更改我会刷新所有页面,不需要再组件和页面声明data依赖
    // ccc: { ddd: 1 }, //更改我会刷新所有页面,不需要再组件和页面声明data依赖
    // roleDefault: 0, //默认角色
    // goodsSpecData: {goods:[]} //采购商搜索条形码数据
  },
  globalData: ['globalPropTest', 'ccc.ddd'],
  logMotto: function () {
    console.log(this.data.motto);
  },

  //默认 false，为 true 会无脑更新所有实例
  //updateAll: true
};
