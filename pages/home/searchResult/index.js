// pages/searchResult/index.js
var App = getApp();
var that;
let HttpRequire = require("../../../utils/api.js");

Page({
    data: {
        key: '',
        artArr: [],
        resultList: [],
        pageTips: "",
        is_faved: 0,
    },
    onLoad: function(options) {
        that = this;
        that.setData({
            key: options.key,
            post_type: options.post_type,
            resultList: {
                items: [],
                params: {
                    paged: 1,
                },
                paginate: {
                    hasMore: true,
                },
            }
        })
        that.searchLink = 'api/mag.food.search.list.json'
        that.getSearchResult();
    },
    getSearchResult() {
        let searchValue = that.data.key;
        if (searchValue) {
            let setName = 'resultList';
            let setObj = that.data[setName];
            let params = Object.assign(setObj.params, { s: searchValue });

            HttpRequire.call({
                api: that.searchLink,
                data: params,
            }).then(data => {
                if (data.errcode == 0) {
                    wx.setNavigationBarTitle({ title: data.page_title })

                    let nData = data.food
                    if (nData.length) {

                        if (data.current_page == 1) {
                            setObj.items = [];
                        }

                        setObj.items = [...setObj.items, ...nData];
                        let hasMore = data.total_pages > data.current_page ? true : false;

                        setObj.paginate.hasMore = hasMore;
                        hasMore ? setObj.params.paged++ : null;

                        that.setData({
                            [setName]: setObj,
                            share_title: data.share_title,
                            page_title: data.page_title,
                            hasMore: hasMore,
                            pageTips: '搜索' + searchValue,
                        })
                        console.info("getSearchResult::", that.data.resultList)
                    } else {
                        that.setData({ pageTips: '暂无该关键字文章' })
                    }

                }
            }, err => {})

        }

    },

    navigateToArticalDetail(e) {
        const aid = e.currentTarget.dataset.aid;
        wx.navigateTo({
            url: '/pages/home/detail/index?aid=' + aid,
        })
    },

    onPullDownRefresh() {
        wx.stopPullDownRefresh()
        if (that.data.resultList.paginate.hasMore) {
            that.getSearchResult()
        }
    },
    onReachBottom() {
        if (that.data.resultList.paginate.hasMore) {
            that.getSearchResult()
        }
    },


})