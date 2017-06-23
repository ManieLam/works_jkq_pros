// pages/collect/index/index.js
const App = getApp();
var that;
const Auth = require('../../../utils/Auth.js');
const HttpRequire = require('../../../utils/api.js')

Page({
    data: {
        colData: {},
        hasMore: {
            hasMore: false,
            nohasMore_title: '',
        },
        isColList: true,
        modal_options: { title: '', content: '' }
    },

    onLoad: function(options) {
        that = this;
        let imgWidth = null;
        wx.getSystemInfo({
            success: res => {
                //  that.setData({ winWidth: res.windowWidth});
                imgWidth = Math.floor((res.windowWidth - 30) / 3);
            }
        })

        that.setData({
            imgWidth: imgWidth,
            // token: token,
            user: Auth.user(),
            colData: {
                items: [],
                params: {},
                paginate: {
                    hasMore: false,
                }
            }
        })

        // 请求接口
        that.listLink = 'api/mag.fav.list.json';
        that.unColLink = 'api/mag.food.unfav.json';

    },
    onShow() {
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

    getList(options = {}) {
        if (!that.data.user) {
            that.needAuth(() => {
                that.getList();
            })
        } else {
            let setName = 'colData';
            let setObj = that.data[setName];
            let params = Object.assign(setObj.params, options)
            HttpRequire.getCollect({
                api: that.listLink + '?access_token=' + Auth.token(),
                data: params,
            }).then(res => {
                // wx.setNavigationBarTitle({ title: res.page_title ||''})
                if (res.errcode == 0) {
                    if (!res.next_cursor) {
                        setObj.items = [];
                    }
                    let newData = res.foods;
                    let next_cursor = res.next_cursor;

                    setObj.paginate.hasMore = next_cursor ? true : false;
                    setObj.items = [...setObj.items, ...newData];

                    setObj.items.map(data => {
                        data.thumbnail = data.thumbnail ? data.thumbnail + '?imageView2/2/h/125' : '';
                    })

                    let nohasMore_title = !newData.length ? '暂无收藏' : '没有更多了'

                    that.setData({
                        [setName]: setObj,
                        hasMore: setObj.paginate.hasMore,
                        next_cursor: next_cursor,
                        "hasMore.nohasMore_title": nohasMore_title,
                    })
                }

            }, err => {})
        }

    },

    setColOrUnCol(e) {
        let access_token = Auth.token();
        let params = {
            post_id: e.currentTarget.dataset.id,
        }
        wx.showModal({
            title: '取消收藏',
            content: '确认取消收藏吗？',
            success: function(res) {
                if (res.confirm) {
                    that.postColOrUncol(params);
                }
            }
        })

    },
    // 收藏页只有取消收藏的功能
    postColOrUncol(params) {
        let access_token = Auth.token();
        HttpRequire.postCollect({
            api: that.unColLink + "?access_token=" + access_token,
            data: params,
            method: 'POST',
        }).then(res => {
            if (res.errcode == 0) {
                //移除数据
                let isUnCol_id = params.post_id;
                let datas = that.data.colData.items;

                let unCol_index = datas.findIndex(items => {
                    return items.id == isUnCol_id
                })
                datas.splice(unCol_index, 1);
                that.setData({
                    "colData.items": datas
                })
            } else {
                App.showErrToast(res.errmsg)
            }
        }, err => {
            console.info("err::", err);
            App.showErrToast(err.errmsg);
        })

    },
    navigateToDetail(e) {
        let aid = e.currentTarget.dataset.aid;
        wx.navigateTo({
            url: '/pages/home/detail/index?aid=' + aid,
        })
    },

    // onPullDownRefresh: function() {
    //     wx.stopPullDownRefresh();
    //     that.getList()
    // },

    onReachBottom: function() {
        if (that.data.next_cursor) {
            that.getList({ cursor: that.data.next_cursor })
        }
    },

    onShareAppMessage: function() {

    }
})