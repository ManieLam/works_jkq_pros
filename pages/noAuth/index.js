// pages/noAuth/index.js
var App = getApp();
Page({

    data: {
        appName: App.globalData.appName
    },


    reload() {
        wx.navigateBack({
            delta: 1
        })
    },

})