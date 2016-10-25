"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.select = select;
exports.selectAttribute = selectAttribute;

var _xvseq = require("xvseq");

var _xvnode = require("xvnode");

function select(node, ...paths) {
    // usually we have a sequence
    var cur = node,
        path;
    while (paths.length > 0) {
        path = paths.shift();
        cur = selectImpl(cur, path);
    }
    cur._isNodeSeq = true;
    return cur;
}

function selectAttribute(node, ...paths) {
    // usually we have a sequence
    var cur = node,
        path;
    while (paths.length > 0) {
        path = paths.shift();
        cur = selectImpl(cur, path, true);
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
    if ((0, _xvseq._isSeq)(node) && !(0, _xvnode._isNode)(node)) return node.map(_ => selectImpl(_, path, attr)).filter(_ => _ !== undefined);
    var attrpath = /^@/.test(path);
    if (attr && !attrpath) path = "@" + path;
    if (attrpath) attr = true;
    var typetest = function (n) {
        return (0, _xvnode._isNode)(n) && n._type == (attr ? 2 : 1);
    };
    if (node._type == 1) {
        var ret;
        if (!(path in node._cache)) {
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
    }
}