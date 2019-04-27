//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        //加载中遮罩层
        spinShow: true,
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    index: function () {
        wx.navigateTo({
            url: '../map/map'
        })
    },
    onLoad: function () {
        //设置watch
        getApp().setWatcher(this);

        // 登录
        wx.login({
            success: res => {
                let that = this;
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    //线上服务器地址
                    url:"http://148.70.100.32/weApp/getopenid",
                    //本地测试后端地址
                    // url: "http://localhost:8080/weApp/getopenid",
                    method: 'GET', //请求方式
                    header: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        code: res.code,  //参数
                    },
                    success: function (res) {
                        console.log(res.data.data);
                        that.setData({
                            spinShow:false
                        })
                        console.log(that.data.spinShow);
                    },
                    fail: function () {
                        console.log("请求数据失败");
                    },
                    complete: function () {
                        // complete
                    }
                })
            }
        })



        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    watch:{
        app:function (newVal, oldVal) {
            console.log(newVal);
        }
    },
    onReady: function () {
        // console.log(this.  .userInfo);
        // app.wxLogin().then(res=>{
        //   console.log(app.globalData.doLogin);
        // })
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
})
