// pages/map/map.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        enableZoom: false, //不允许缩放
        longitude: 113.324520,  //中心经度
        latitude: 23.099994, //中心纬度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getLocation()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.map = wx.createMapContext('myMap')
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

    },
    /**
     *  获取当前位置并显示
     */
    getLocation:function () {
        //获取位置
        let that = this
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                //根据坐标获取当前位置名称，显示在顶部，腾讯地图逆地址解析
                console.log(res.latitude);
                console.log(res.longitude);
                that.setData({
                    latitude:res.latitude,
                    longitude:res.longitude,
                    markers: [{
                        callout:{
                            content:'我的位置',
                            color:'#fff',
                            bgColor: "#009fcc",
                            fontSize:16,
                            borderRadius:6,
                            padding:8,
                            display: "ALWAYS",
                        },
                        iconPath: '../../icons/定位点/定位-静态.gif',
                        id: 0,
                        longitude: res.longitude,
                        latitude: res.latitude,
                        width: 20,
                        height: 40
                    }],
                })

            },
        })
    },
    start:function () {
        console.log("start");
    },

})