var utils = require('./utils');
    traverse = require('./traverse'),
    stdGenerators = require('./generators'),
    stdInterpolaters = require('./interpolaters');

var stamplet = {};

stamplet._interpolaters = stdInterpolaters || {};
stamplet._generators    = stdGenerators || {};

stamplet._valueHandler = function(node){
    var functionName;

    if(utils.isString(node) && node.match(/{{.+}}/)){
        var substring = node.match(/{{.+}}/)[0],
            functionName = substring.replace("{{","").replace("}}","").trim();

        return node.replace(substring, stamplet._interpolaters[functionName].call());
    }
    
    return node;
}

stamplet._keyHandler = function(node){
    for(var key in node){
        var val = node[key];

        if(key.match(/{{.+}}/)){
            var substring = key.match(/{{.+}}/)[0],
                functionName = substring.replace("{{","").replace("}}","").trim();

            debugger;
            node[key] = stamplet._generators[functionName](val);
            node.renameProperty(key, key.replace(key.match(/{{.+}}/)[0], ""));
        }
    }
}

// push a generator onto the stack... the name that you pass in is what
// will get matched in the template
stamplet.addInterpolater = function(name, fn){
    if(typeof name !== "string" || typeof fn !== "function"){
        throw new TypeError("addInterpolater expects a string and a generator function");
    }

    this._interpolaters[name] = fn;    
};

stamplet.addGenerator = function(name, fn){
    if(typeof name !== "string" || typeof fn !== "function"){
        throw new TypeError("addGenerator expects a string and a generator function");
    }

    this._generators[name] = fn;    
};

stamplet.generate = function(json){
    var obj = traverse.call(this, JSON.parse(json), {
        keyHandler: this._keyHandler,
        valueHandler: this._valueHandler,
    });
    return JSON.stringify(obj);
}

module.exports = stamplet;
