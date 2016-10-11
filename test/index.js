const xvpath = require("../lib/xvpath");
const xvseq = require("xvseq");
const xvnode = require("xvnode");

const assert = require("assert");

const element = xvnode.element,
	attr = xvnode.attribute,
	text = xvnode.text,
	seq = xvseq.seq;
function assertEq(a,b){
	assert.equal(a.toString(),b.toString(),`${a} not equal to ${b}`);
}

var node = element("root",seq(
	element("a",seq(attr("id",1),text("test"))),
	element("b",seq(attr("id",2),text("test")))
));


function partialRight(fn, args){
    return function(...a) {
        return fn.call(this, a.concat(args));
    };
}
const filter = xvseq.filter;
let test = element("a",seq(attr("id",1),text("test")));
assertEq(xvpath.select(node,"a").first(),test);
assertEq(xvpath.select(node,"*",filter(function(_){
	return xvpath.select(_,"@id").first().value() == 1;
})),seq(test));
console.log("All tests passed");
