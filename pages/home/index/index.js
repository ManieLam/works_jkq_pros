// pages/home/index/index.js
var App = getApp();
let that;
var HttpRequire = require("../../../utils/api.js");
Page({
    data: {
        initHeader: {
            indicatorDots: true,
            autoplay: true,
            interval: 5000,
            duration: 500,
            height: 300,
            imgUrls: [],
        },
        initSearch: {
            inputType: 'text',
            placeholder: '搜索食品',
            searchInputShowed: false,
        },
        searchValue: "",
        blockData: { items: [1, 2, 3, 4] },
        hotSearch: [],
    },
    onLoad: function(options) {
        that = this;
        // let imgWidth = null;
        wx.getSystemInfo({
                success: res => {
                    //  that.setData({ winWidth: res.windowWidth});
                    let imgWidth = Math.floor((res.windowWidth - 30) / 3);
                    that.setData({ imgWidth: imgWidth })
                }
            })
            // console.info('imgWidth', imgWidth, imgWidth * 3 / 2);



        // 接口请求
        that.listLink = 'api/mag.home.json';
        that.getList();
    },
    // 搜索
    showInput() {
        that.setData({ "initSearch.searchInputShowed": !that.data.initSearch.searchInputShowed })
    },
    //搜索
    handleInput(e) {
        // console.info(e.detail.value)
        that.setData({ searchValue: e.detail.value })
    },
    clearInput() {
        that.setData({ searchValue: '' });
    },
    getSearchList(e) {
        e.currentTarget.dataset.key ? that.setData({ searchValue: '' }) : '';
        let searchValue = that.data.searchValue || e.currentTarget.dataset.key;
        if (searchValue) {
            wx.navigateTo({
                url: '/pages/home/searchResult/index?key=' + searchValue,
            })
        } else {
            App.showErrToast('输入搜索关键词')
        }

    },
    getList() {
        HttpRequire.call({
            api: that.listLink
        }).then(res => {
            wx.setNavigationBarTitle({
                title: res.page_title,
            })
            let hot_terms = res.hot_terms;
            let sliders = res.sliders;
            hot_terms.map(res => {
                res.image = res.image ? res.image + "?imageView2/2/h/125" : ''
            })
            sliders.map(res => {
                res.image = res.image ? res.image + "?imageView2/2/h/450" : '';
                let split = res.path ? res.path.split('?')[1].split('&') : '';
                if (split.length) {
                    res.openType = split[0].split('=')[1];
                }

            })
            console.info("sliders:::", sliders)
            that.setData({
                share_title: res.share_title,
                page_title: res.page_title,
                "initHeader.imgUrls": sliders,
                "blockData.items": hot_terms,
            })
        }, err => {
            console.info("home-index_err::", err);
        })
    },
    navigateToDetail(e) {
        let aid = e.currentTarget.dataset.aid;
        let path = e.currentTarget.dataset.path;
        wx.navigateTo({
            url: path ? path : '/pages/home/detail/index?aid=' + aid,
        })
    },

    onReady: function() {

    },

    // loadMore() {
    //     that.getList();
    // },
    onShareAppMessage() {
        return {
            title: that.data.share_title || App.globalData.appName,
            path: "/pages/home/index/index",
        }
    },
    // onReachBottom() {
    //     if (that.data.newArticals.paginate.hasMore) {
    //         that.getList()
    //     }
    // },
})