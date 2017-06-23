module.exports = function(a) {
    return {
        set(b, c, d) {
            d = d || {};
            var f = d.expire || 7;
            try {
                wx.setStorageSync(b, {
                    value: c,
                    version: a.VERSION,
                    expire: Date.now() + 3600 * (24 * f)
                })
            } catch (g) {
                console.error(g)
            }
        },
        get(b) {
            try {
                var c = wx.getStorageSync(b);
                if (c.version === a.VERSION && c.expire > Date.now()) return c.value
            } catch (d) {
                console.error(d)
            }
        },
        remove(b) {
            try {
                wx.removeStorageSync(b)
            } catch (c) {
                console.error(c)
            }
        },
        clear() {
            try {
                wx.clearStorageSync()
            } catch (b) {
                console.error(b)
            }
        }
    }
};