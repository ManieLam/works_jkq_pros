//app.js
var HttpRequire = require('utils/api.js');
var Auth = require('utils/Auth.js');

import storage from 'utils/storage';
// import meta from 'meta'



App({
    globalData: {
        userInfo: null,
        token: null,
        encryptedData: null,
        iv: null,
        code: null,
        appName: '食物保健养身',
    },
    onLaunch() {
        // this.db = db
        this.storage = storage(this);
    },
    showErrToast(title, duration, image) {
        wx.showToast({
            title: title || "必选项未完全填完",
            image: image || '../../../assets/images/icon_cancel.png',
            duration: duration || 1500
        })
    },



})