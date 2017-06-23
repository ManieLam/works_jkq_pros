// pages/category/index/index.js
var App = getApp();
let HttpRequire = require('../../../utils/api.js');
let that;
let isPull = false; //下拉加载
let isLoading = false; //加载更多
let firstCursor = 0;
let isFirst = 0;

Page({

    data: {
        // columnData: {
        //     scroll: "",
        // },
        isDone: false,
        leftData: [], //左栏分类
        rightData: {
            items: [],
            params: {},
            // paginate: { hasMore: false },
        }, //右栏列表,带分页
        linheightId: 12, //填入默认第一个分类的id
    },
    onLoad: function(options) {
        that = this;
        // 接口
        that.catLink = 'api/mag.food.list.json';
        that.getList();
    },
    getList(options = {}) {
        //if (isLoading || this.data.isDone) return
        let params = Object.assign({}, that.data.rightData.params, {
            food_cat_id: that.data.linheightId
        }, options);
        isLoading = true
        HttpRequire.call({
            api: that.catLink,
            data: params
        }).then(res => {
            let setName = 'rightData';
            let setObj = that.data[setName];
            wx.setNavigationBarTitle({ title: res.page_title })
            if (res.errcode == 0 && res) {
                setObj.items = isPull ? [].concat(res.foods, setObj.items) : [...setObj.items, ...res.foods];

                if (isFirst == 1) {
                    res.next_cursor = firstCursor;
                    firstCursor = 0;
                }
                that.setData({
                    leftData: res.food_cats,
                    linheightId: res.current_food_cat.id,
                    rightData: setObj,
                    rightData_items: setObj.items,
                    next_cursor: res.next_cursor,
                    next_first: res.next_first,
                    isDone: res.next_cursor === 0 ? true : false,
                    share_title: res.share_title,
                })
            }

            isPull = false;
            isLoading = false;
            wx.stopPullDownRefresh();

        }, err => {
            isPull = false
            isLoading = false
            wx.stopPullDownRefresh()
        })
    },
    clickbtn: function(e) {
        // 左侧点击事件
        let linheightId = e.target.id;
        isFirst = 0;
        this.setData({
            linheightId: linheightId,
            "rightData.params": {},
            "rightData.items": [],
        });
        that.getList();

    },
    navigateToDetail(e) {
        let aid = e.currentTarget.dataset.aid;
        wx.navigateTo({
            url: '/pages/home/detail/index?aid=' + aid,
        })
    },

    onPullDownRefresh: function() {
        isFirst++;
        // console.log("isFirst:", isFirst);
        if (isFirst == 1) {
            firstCursor = this.data.next_cursor;
        }
        isPull = true;
        if (this.data.next_first) {
            that.getList({ first: this.data.next_first });
        }

    },

    onReachBottom: function() {
        // console.log("next_cursor:", this.data.next_cursor);
        if (this.data.next_cursor) {
            that.getList({ cursor: this.data.next_cursor });
        }
    },

    onShareAppMessage(options) {
        return {
            title: that.data.share_title,
            path: "/pages/category/index/index"
        }
    }
})