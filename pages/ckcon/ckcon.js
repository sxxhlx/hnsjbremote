// pages/content/content.js

Page({
    data: {
        "content": {
            "title": "text",
            "author": "test",
            "time": "2016-10-10",
            "copyfrom": "河南手机报",
            "content": [{
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }, {
                "type": "text",
                "value": "新闻正文"
            }],
            "reject_reason": [{
                "reason": "退回",
                "time": "2017-01-12 17:36",
                "name": "审稿编辑"
            }]
        },
        cid: 0,
        workflow: [{
            "action": "\u6d4b\u8bd5\u8bb0\u8005:\u65b0\u5efa",
            "time": "2017-01-10 11:42:10"
        }, {"action": "\u5ba1\u7a3f\u7f16\u8f91:\u9a73\u56de", "time": "2017-01-10 11:43:07"}],
        lineLength: 0,
        editorauth: '',
        category: '19',
        subcate: '',
        categories: [],
        sucheckers: [],
        sucheck: '',
        currentCate: '',
        selection: [],
        rejectopen: false,
        optionopen: '0',
        xjuser: {},
        rejectreason: '',
        mainindex: 0,
        subindex: 0,
        suindex: 0
    },
    onLoad: function (options) {
        var that = this;
        // 页面初始化 options为页面跳转所带来的参数
        console.log(options);
        this.setData({
            xjuser: wx.getStorageSync("xjuser")
        });
        this.setData({
            cid: options.id
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=show_workflow&id=' + options.id, //仅为示例，并非真实的接口地址
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                // that.setData({
                //     workflow: res.data
                // });
                // that.setData({
                //     linelength: (res.data.length - 1) * 40
                // });
                console.log(res.data)
            }
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=cats',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    categories: res.data
                });

                console.log(res.data)
            }
        });
        wx.request({
            url: 'https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=sulist',
            method: 'post',
            header: {"content-type": "application/x-www-form-urlencoded"},
            data: {
                sessid: wx.getStorageSync('sessid')
            },
            success: function (res) {
                that.setData({
                    sucheckers: res.data
                });
                console.log(res.data)
            }
        });
        console.log(this.data.workflow.length);
        that.setData({
            lineLength: (this.data.workflow.length - 1) * 100
        });
        if (this.data.xjuser.roleid == '38') {
            this.setData({
                editorauth: 'tocheck'
            })
        } else if (this.data.xjuser.roleid == '36') {
            this.setData({
                editorauth: 'tocsuheck'
            })
        }
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
    openOp: function (e) {
        var opid = e.target.dataset.opid;
        this.setData({
            optionopen: opid
        })
    },
    closeOp: function () {
        this.setData({
            optionopen: 0
        })
    },
    setReject: function (e) {
        this.setData({
            rejectreason: e.detail.value
        })
    },
    rejectNews: function () {
        var that = this;
        if (this.data.rejectreason == '') {
            wx.showModal({
                title: '提示',
                content: '请填写驳回理由',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else {
            wx.showModal({
                title: '确认驳回',
                content: '您确定要驳回这篇稿件吗？',
                success: function (res) {
                    if (res.confirm) {
                        wx.request({
                            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=reject",
                            data: {
                                sessid: wx.getStorageSync('sessid'),
                                id: that.data.cid,
                                reject_reason: that.data.rejectreason,
                                typefrom: that.data.editorauth
                            },
                            success: function (res) {
                                if (res.data.status == 1) {
                                    wx.showModal({
                                        title: '提示',
                                        showCancel: false,
                                        content: '驳回成功',
                                        complete: function (res) {
                                            wx.redirectTo({
                                                url: '../list/list'   //todo:change redirect url
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        return false;
                    }
                }
            });

        }

    },
    changeSelection: function (e) {
        var tmp = e.detail.value;
        this.setData({
            mainindex: tmp
        });

        this.setData({
            selection: this.data.categories[tmp].subcats
        });
        this.setData({
            currentCate: this.data.categories[tmp].catid
        })
    },
    setCate: function (e) {
        var tmp = e.detail.value;
        this.setData({
            currentCate: this.data.selection[tmp].catid
        });
        this.setData({
            subcate: this.data.selection[tmp].catid
        })
    },
    setSu: function (e) {
        var tmp = e.detail.value;
        this.setData({
            sucheck: this.data.sucheckers[tmp].userid
        });
    },
    confirmNews: function () {

        var that = this;

        if (this.data.currentCate == '') {
            wx.showModal({
                title: '提示',
                content: '请选择栏目',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.selection.length > 0 && this.data.subcate == '') {
            wx.showModal({
                title: '提示',
                content: '请选择子栏目',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else {
            wx.showModal({
                title: '确认通过',
                content: '您确定要通过这篇稿件吗？',
                success: function (res) {
                    if (res.confirm) {
                        wx.request({
                            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=pass",
                            data: {
                                sessid: wx.getStorageSync('sessid'),
                                id: that.data.cid,
                                catid: that.data.currentCate,
                                typefrom: that.data.editorauth
                            },
                            success: function (res) {
                                if (res.data.status == 1) {
                                    wx.showModal({
                                        title: '提示',
                                        showCancel: false,
                                        content: '已通过',
                                        complete: function (res) {
                                            wx.redirectTo({
                                                url: '../list/list'   //todo:change redirect url
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        return false;
                    }
                }
            });

        }

    },
    forwardNews: function () {
        console.log(this.data);

        var that = this;

        if (this.data.sucheck == '') {
            console.log('t1');
            wx.showModal({
                title: '提示',
                content: '请选择总编辑',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.currentCate == '') {
            console.log('t2');

            wx.showModal({
                title: '提示',
                content: '请选择栏目',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else if (this.data.selection.length > 0 && this.data.subcate == '') {
            console.log('t3');

            wx.showModal({
                title: '提示',
                content: '请选择子栏目',
                showCancel: false,
                complete: function (res) {
                    return false;
                }
            })
        } else {
            wx.showModal({
                title: '确认转审',
                content: '您确定要转审这篇稿件吗？',
                success: function (res) {
                    if (res.confirm) {
                        wx.request({
                            url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=transcheck",
                            data: {
                                sessid: wx.getStorageSync('sessid'),
                                id: that.data.cid,
                                catid: that.data.currentCate,
                                typefrom: that.data.editorauth,
                                userid: that.data.sucheck
                            },
                            success: function (res) {
                                if (res.data.status == 1) {
                                    wx.showModal({
                                        title: '提示',
                                        showCancel: false,
                                        content: '已转审',
                                        complete: function (res) {
                                            wx.redirectTo({
                                                url: '../list/list'   //todo:change redirect url
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        return false;
                    }
                }
            });

        }

    },
    suNews: function () {
        wx.showModal({
            title: '确认通过',
            content: '您确定要通过这篇稿件吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: "https://www.hnsjb.cn/ycfgwx_api.php?op=remotepost_wx&param=pass",
                        data: {
                            sessid: wx.getStorageSync('sessid'),
                            id: that.data.cid,
                            catid: that.data.content.catid,
                            typefrom: that.data.editorauth
                        },
                        success: function (res) {
                            if (res.data.status == 1) {
                                wx.showModal({
                                    title: '提示',
                                    showCancel: false,
                                    content: '已通过',
                                    complete: function (res) {
                                        wx.redirectTo({
                                            url: '../list/list'   //todo:change redirect url
                                        })
                                    }
                                })
                            }
                        }
                    })
                } else {
                    return false;
                }
            }
        });
    }

});