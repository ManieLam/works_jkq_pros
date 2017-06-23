// pages/home/detail/index.js
const App = getApp();
var that;
var wxParse = require('../../helpers/wxParse/wxParse.js');
const Auth = require('../../../utils/Auth.js');
const HttpRequire = require('../../../utils/api.js');
Page({
    data: {
        is_faved: false,
        detailData: {},
        modal_options: { title: '', content: '' },
    },
    onLoad(options) {
        that = this;
        that.setData({
                aId: options.aid,
                user: Auth.user(),
            })
            //  接口请求
        that.listLink = 'api/mag.food.get.json';
        that.colLink = 'api/mag.food.fav.json';
        that.uncolLink = 'api/mag.food.unfav.json';
        that.getList();
    },

    needAuth(cb) {
        let options = that.data.modal_options;
        wx.showModal({
            title: '授权',
            content: '只有授权用户才能进行此操作，确认授权吗？',
            success: function(res) {
                if (res.confirm) {
                    Auth.checkOrLogin()
                        .then(user => {
                            that.setData({
                                user: user
                            })
                            typeof cb == "function" && cb()
                        })
                }
            },

        })
    },

    getList() {
        let access_token = Auth.token();
        let setName = 'detailData';
        let setObj = that.data[setName];
        let params = {
            id: that.data.aId,
        }
        access_token ? Object.assign(params, {
            access_token: access_token,
        }) : null;
        HttpRequire.call({
            api: that.listLink,
            data: params
        }).then(res => {
            if (res.errcode == 0) {
                var resultList = res.food;
                wx.setNavigationBarTitle({ title: res.page_title })
                resultList.thumbnail = resultList.thumbnail ? resultList.thumbnail + '?imageView2/2/h/400' : '';

                wxParse.wxParse('content', 'html', resultList.content, that, 5);
                let is_faved = resultList.is_faved ? true : false;
                that.setData({
                    detailData: resultList,
                    share_title: res.share_title,
                    page_title: res.page_title,
                    is_faved: is_faved,
                })
            } else {
                console.info("res.errcode", res.errcode)
            }

        }, err => {})

    },
    setColOrUnCol(e) {
        let access_token = Auth.token();
        let params = {
            post_id: e.currentTarget.dataset.id,
        }
        if (!that.data.user) {
            console.info('没有授权')
            that.needAuth(() => {
                that.postColOrUncol(params);
            })
        } else {
            that.postColOrUncol(params);

        }

    },
    postColOrUncol(params) {
        let httpPath = (that.data.is_faved ? that.uncolLink : that.colLink) + "?access_token=" + Auth.token();

        that.setData({ is_faved: !that.data.is_faved })
        HttpRequire.postCollect({
            api: httpPath,
            data: params,
            method: 'POST',
        }).then(res => {
            if (res.errcode == 0) {

                // that.setData({
                //     is_faved: !that.data.is_faved,
                // })
            } else {
                App.showErrToast(res.errmsg)
            }
        }, err => {
            console.info("err::", err);
            App.showErrToast(err.errmsg);
        })
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
        console.info("onPullDownRefresh::", onPullDownRefresh);
        that.getList();
    },

    onReachBottom() {

    },
    onShareAppMessage() {
        // return{
        //     title:that.data.share_title,
        //     path:''
        // }
    }
})