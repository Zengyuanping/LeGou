import { request } from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages: 1,

  handleTabItemChange(e) {
    //1 获取被点击的标题索引
    const { index } = e.detail;
    //2 修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //3 赋值到data中
    this.setData({
      tabs
    })
  },

  //获取商品数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // console.log(res);
    //获取总页数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      //拼接了数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
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
    //1 重置数组
    this.setData({
      goodsList:[]
    })
    //2 重置页码
    this.QueryParams.pagenum=1;
    //3 发送请求
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log("页面触底")
    //1 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      //没有下一页数据
      wx.showToast({
        title: '没有更多数据了'        
      });
    } else {
      //还有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})