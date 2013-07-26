module.exports = function inspect_ (obj, opts, depth) {
    if (!opts) opts = {};
    var maxDepth = opts.depth || 5;
    
    if (depth === undefined) depth = 0;
    if (depth > maxDepth) return '...';
    
    function inspect (value) {
        return inspect_(value, opts, depth + 1);
    }
    
    if (typeof obj === 'string') {
        return "'" + obj.replace(/(['\\])/g, '\\$1') + "'";
    }
    else if (typeof HTMLElement !== 'undefined' && obj instanceof HTMLElement) {
        var s = '<' + String(obj.tagName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '="' + quote(attrs[i].value) + '"';
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) s += '...';
        s += '</' + String(obj.tagName).toLowerCase() + '>';
        return s;
    }
    else if (isArray(obj)) {
        var xs = Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
            xs[i] = inspect(obj[i]);
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    else if (typeof obj === 'object' && !isDate(obj) && !isRegExp(obj)) {
        var xs = [];
        for (var key in obj) {
            if ({}.hasOwnProperty.call(obj, key)) {
                if (/[^\w$]/.test(key)) {
                    xs.push(inspect(key) + ': ' + inspect(obj[key]));
                }
                else xs.push(key + ': ' + inspect(obj[key]));
            }
        }
        return '{ ' + xs.join(', ') + ' }';
    }
    else return String(obj);
};

function quote (s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray (obj) {
    return {}.toString.call(obj) === '[object Array]';
}

function isDate (obj) {
    return {}.toString.call(obj) === '[object Date]';
}

function isRegExp (obj) {
    return {}.toString.call(obj) === '[object RegExp]';
}
