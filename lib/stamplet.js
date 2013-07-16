var utils = require('./utils');

var stamplet = {};

// a stack of generators which can be used in geneate
var _generators = {},
    delimiter = /{{.+}}/;


// does the actual rendering;
stamplet.generate = function(jsonStr){
    var jsonObj = JSON.parse(jsonStr);

    utils.map(jsonObj, function(key, value){
       jsonObj[key] = utils.interpolate(value, _generators, delimiter);
    });

    return JSON.stringify(jsonObj);
};

// push a generator onto the stack... the name that you pass in is what
// will get matched in the template
stamplet.addGenerator = function(name, fn){
    if(typeof name !== "string" || typeof fn !== "function"){
        throw new TypeError("addGenerator expects a string and a generator function");
    }

    _generators[name] = fn;    
};

module.exports = stamplet;
