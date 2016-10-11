"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.select = select;
exports.selectAttribute = selectAttribute;

var _xvseq = require("xvseq");

var _xvnode = require("xvnode");

function select(node) {
    // usually we have a sequence
    var cur = node;

    for (var _len = arguments.length, paths = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        paths[_key - 1] = arguments[_key];
    }

    while (paths.length > 0) {
        cur = selectImpl(cur, paths.shift());
    }
    cur._isNodeSeq = true;
    return cur;
}

function selectAttribute(node) {
    // usually we have a sequence
    var cur = node;

    for (var _len2 = arguments.length, paths = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        paths[_key2 - 1] = arguments[_key2];
    }

    while (paths.length > 0) {
        cur = selectImpl(cur, paths.shift(), true);
    }
    cur._isNodeSeq = true;
    return cur;
}

function selectImpl(node, $path, attr) {
    var path = (0, _xvseq._first)($path);
    if (typeof path == "function") {
        // TODO can we cache this?
        return path.call(this, node);
    }
    if ((0, _xvseq._isSeq)(node) && !(0, _xvnode._isNode)(node)) return node.map(function (_) {
        return selectImpl(_, path, attr);
    }).flatten(true);
    var attrpath = /^@/.test(path);
    if (attr && !attrpath) path = "@" + path;
    if (attrpath) attr = true;

    var typetest = function typetest(n) {
        return (0, _xvnode._isNode)(n) && n._type == (attr ? 2 : 1);
    };
    if (node._type == 1) {
        var ret;
        if (!node._cache.hasOwnProperty(path)) {
            var testpath = path.replace(/^@/, "");
            if (testpath == "*") {
                ret = node.filter(function (n) {
                    return typetest(n);
                });
            } else {
                ret = node.filter(function (n) {
                    return typetest(n) && (0, _xvseq._first)(n._name) == testpath;
                });
            }
            node._cache[path] = ret;
        } else {
            ret = node._cache[path];
        }
        return ret;
    } else {
        return (0, _xvseq.seq)();
    }
}