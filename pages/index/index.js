//index.js
//获取应用实例
const app = getApp()
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        //注册表单
        show: false,
        register: {
            confirm: 'circle', //确认按钮
            formDisabled: false, //表单是否禁用
            btnSubmit: true,    //提交按钮是否可用
            roleText: '学生',
            id: "学号",
            idNum: 'idForStudent',
            phoneError: "",
            idError: '',
            registing: false, //提交状态Loading
            teacher: false,  //是否是老师(默认false)
            teacherCode: null,  //教师注册码
            //需提交的内容
            submit: {
                name: null,
                idForStudent: null,
                idForTeacher: null,
                phone: null,
                role: 1
            }
        },
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
        //获取userInfo
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
        // 登录
        // 登陆遮罩层
        Toast.loading({
            mask: true,
            message: '登陆中...'
        });
        wx.login({
            success: res => {
                let that = this;
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    //线上测试服务器地址
                    // url: "http://148.70.100.32/weApp/getopenid",
                    //本地测试后端地址
                    url: "http://localhost:8080/weApp/getopenid",
                    method: 'GET', //请求方式
                    header: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        code: res.code,  //参数
                        // userInfo: that.data.userInfo    //用户名,头像...
                    },
                    // 异步获取成功
                    success: function (res) {
                        console.log(res.data);
                        if (res.data.code === 1001) {   //未注册
                            //遮罩层显示--未注册--2秒
                            const toast = Toast.fail({
                                mask: true,
                                message: '未注册',
                                selector: '#van-toast'
                            });
                            let second = 2;
                            const timer = setInterval(() => {
                                second--;
                                if (second) {
                                    toast.setData({
                                        message: `请注册`
                                    });
                                } else {
                                    clearInterval(timer);
                                    Toast.clear();
                                    //弹出注册表单
                                    that.setData({
                                        show: true
                                    })
                                }
                            }, 1000);

                        } else if (res.data.code === 1000) {  //登陆成功
                            //遮罩层显示--登陆成功
                            const toast = Toast.success({
                                mask: true,
                                message: '登陆成功',
                                selector: '#van-toast'
                            });
                            let second = 2;
                            const timer = setInterval(() => {
                                second--;
                                if (second) {
                                    toast.setData({
                                        message: `登陆成功`
                                    });
                                } else {
                                    clearInterval(timer);
                                    Toast.clear();
                                }
                            }, 1000);

                        }
                        that.setData({
                            spinShow: false
                        })
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

    },
    watch: {
        submit: function (newVal, oldVal) {
            console.log(newVal);
        }
    },
    onReady: function () {
        // console.log(this.  .userInfo);
        // app.wxLogin().then(res=>{
        //   console.log(app.globalData.doLogin);
        // })
    },
    onChange: function (event) {
        if (event.target.id === 'teacher') {
            this.setData({'register.teacher': event.detail});
            if (this.data.register.teacher === false) {
                this.setData({
                    'register.submit.role': 1,
                    'register.idNum': 'idForStudent',
                    'register.roleText': '学生',
                    'register.id': '学号'
                })
            } else {
                this.setData({
                    'register.submit.role': 2,
                    'register.idNum': 'idForTeacher',
                    'register.roleText': '教师',
                    'register.id': '工号'
                })
            }
        }
    },
    getUserInfo: function (e) {
        // console.log(e)
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    //注册
    register: function () {
        let that = this;
        that.setData({
            'register.registing': true,
            'register.formDisabled': true
        });
        //设置延迟500毫秒,等待数据验证存储到data后再提交
        setTimeout(function () {
            console.log(that.data.register.submit);
            console.log(that.data.userInfo);
            wx.request({
                //本地接口
                url: "http://localhost:8080/weApp/register",
                method: 'POST', //请求方式
                header: {
                    'Content-Type': 'application/json',
                },
                data: {
                    data: that.data.register.submit,  //注册参数
                    userInfo: that.data.userInfo    //用户名,头像...
                },
                // 异步获取成功
                success: function (res) {
                    console.log(res.data);
                    that.setData({
                        'register.registing': false,
                        'register.formDisabled': false
                    });
                }
            })
        }, 500)
    },
    registerConfirm: function () {
        if (this.data.register.confirm === 'circle') {
            this.setData({
                'register.confirm': 'question'
            })
        } else {
            this.setData({
                'register.confirm': 'circle'
            })
        }
    },
    //绑定注册表单输入
    setValue: function (e) {
        //将输入数据绑定到data
        if (e.currentTarget.id !== 'registerConfirm') {
            let target = "register.submit." + e.currentTarget.id;
            this.setData({[target]: e.detail.value});
            //格式验证
            if (e.currentTarget.id === 'phone') {
                //手机号码正则
                let reg = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/;
                if (!reg.test(e.detail.value)) {
                    this.setData({'register.phoneError': '手机号码格式错误'})
                    this.setData({[target]: null});
                } else {
                    this.setData({'register.phoneError': ''})
                }
            } else if (e.currentTarget.id === 'idForStudent') {
                //学号
                let reg = /^([B|Z])(1[0-9]|[20]\d)(0[1-9]|1[0-9]|[20]\d)(0[1-9]|1[0-9]|2[0-9]|[30]\d)(0[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|[60]\d)$/;
                if (!reg.test(e.detail.value)) {
                    this.setData({'register.idError': '请输入正确得学号'})
                    this.setData({[target]: null});
                } else {
                    this.setData({'register.idError': ''})
                }
            } else if (e.currentTarget.id === 'idForTeacher') {
                //工号
                let reg = /^\d{6}$/;
                if (!reg.test(e.detail.value)) {
                    this.setData({'register.idError': '请输入正确得工号'})
                    this.setData({[target]: null});
                } else {
                    this.setData({'register.idError': ''})
                }
            }
        }
        if (e.currentTarget.id === 'registerConfirm') {
            if (this.data.register.confirm === 'circle') {
                this.setData({
                    'register.confirm': 'question'
                })
            } else {
                this.setData({
                    'register.confirm': 'circle'
                })
            }
        }
        if (this.data.register.submit.name !== null && this.data.register.submit.phone !== null && this.data.register.confirm === 'question' && (this.data.register.submit.idForStudent !== null || this.data.register.submit.idForTeacher !== null )) {
            this.setData({
                'register.btnSubmit': false
            })
        } else {
            this.setData({
                'register.btnSubmit': true
            })
        }
    }
})
