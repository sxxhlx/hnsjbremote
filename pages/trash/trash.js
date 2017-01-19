// pages/trash/trash.js
Page({
    data: {
        trash: []
    },
    onLoad: function () {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=show_deleted&offset=0&num=100', //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    trash: res.data
                });
                console.log(res.data)
            }
        });
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    gotoNews: function (e) {
        wx.navigateTo({
            url: '../vcon/vcon?id=' + e.currentTarget.dataset.newsid
        })
    }
});