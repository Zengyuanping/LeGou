import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime";
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  // 点击支付
  async handleOrderPay() {
    // 1 判断缓存中有没有token
    const token = wx.getStorageSync('token');
    // 2 判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    console.log("已经存在token")
    // 3 创建订单
    // 3.1 准备请求头参数
    const header = { Authorization: token };
    // 3.2 准备 请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))
    const orderParams={order_price,consignee_addr,goods}
    // 4 准备发送请求 创建订单 获取订单编号
    const {order_number} = await request({url:"/my/orders/create",methods:"POST",data:orderParams,header})
    console.log(order_number);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //1 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    //1 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    //1 计算全选
    //every 数组方法 会遍历 会接受一个回调函数，如果每一个回调函数都返回true 那么every方法的返回值就为true
    //只要有一个回调函数返回false，那么不再循环执行，直接返回false
    //空数组 调用every，返回值为true
    // const allChecked=cart.length?cart.every(v=>v.checked):false;

    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    //2 给data赋值
    this.setData({ address });

    //1 总数量 总价格
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice = v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})