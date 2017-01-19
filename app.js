//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        wx.setStorageSync('logs', logs)
    },
    getUserInfo: function (cb) {
        var that = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function (res) {
                    if (res.code) {
                        //发起网络请求
                        wx.request({
                            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=wx_login',
                            method:'post',
                            header: {"content-type": "application/x-www-form-urlencoded"},
                            data: {
                                code: res.code
                            },
                            success:function(response) {
                                console.log(response);
                                wx.setStorageSync('sessid', response.data.sessid);
                                if (response.data.status == 0) {
                                    wx.navigateTo({
                                        url: '../login/login'
                                    })
                                }
                            }
                        });
                        console.log(res)
                    }

                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo;
                            console.log(res);
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null
    }
});