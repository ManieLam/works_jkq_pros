var hasFunc = function(a, b) {
        return hasOwnProperty.call(a, b)
    },
    keysFunc = function(a) {
        if (a !== Object(a)) throw new TypeError('Invalid object');
        var b = [];
        for (var c in a) hasFunc(a, c) && b.push(c);
        return b
    },
    each = function(a, b, c) {
        if (null != a)
            if (a.length === +a.length)
                for (var d = 0, e = a.length; d < e; d++) b.call(c, a[d], d, a);
            else {
                var f = keysFunc(a);
                for (var d = 0, e = f.length; d < e; d++) b.call(c, a[f[d]], f[d], a)
            }
    };
module.exports = each;