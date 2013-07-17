var traverse = require('./index').traverse;
var stamplet = require('./index');
    assert = require('assert');

var obj = { a: "test" };

var output = traverse(obj, {
    keyHandler: function(node){
        return { b: "something" };
    }
});

console.log(output);
