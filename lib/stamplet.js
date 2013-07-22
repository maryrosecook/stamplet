// Stamplet's job is to take json and transform is according to embedded
// "generators" and "interpolaters"
//
// It relies heavily on a traverse function which runs a keyHanlder
// and a valueHandler of arbitrary structures.
var utils = require('./utils');
    traverse = require('./traverse'),
    stdGenerators = require('./generators'),
    stdInterpolaters = require('./interpolaters');

var stamplet = {};

// **Interpolaters** like *{{fistName}}* replace the template with a value and
// only are used as values in an array or oject. There are a set of standard
// interpolaters loaded by default from an external file.
stamplet._interpolaters = stdInterpolaters || {};

// **Generators** like *{{repeatChild(10)}}* perform operations on the json
//  structure itself and are only used in the KEYS of objects. There are a set
//  of standard generators loaded by default from an extenal file.
stamplet._generators    = stdGenerators || {};

stamplet.generateJSON = function(object) {
    return stamplet.generate(object, { json : true });
};

// The **keyHandler** receives the entire node of a traversed object. For example
// for an object { a: { b: { c: "example" }}}, the key handler would receive:
//
//  1. { a: { b: { c: "example" }}}
//  2. { b: { c: "example" }}
//  3. { c: "example" }
//
// The keyHandler looks for templates embedded in the keys (e.g. a, b, c) and
// if it finds one, will run the generator with that name. Since generators
// change the structure of the object the keyHandler simply mutates the passed in
// branch (via the generator) and then renames the key so that it no longer
// contains the curly-bracketed template.
var keyHandler = function(branch){
    for(var key in branch){
        var val = branch[key];

        if(key.match(/{{.+}}/)){
            var substring = key.match(/{{.+}}/)[0],
                functionName = substring.replace("{{","").replace("}}","").trim();

            branch[key] = stamplet._generators[functionName](val);
            utils.renameProperty(branch, key, key.replace(key.match(/{{.+}}/)[0], ""));
        }
    }
}

// The **valueHandler** looks for templates embedded in the leaves of a
// structure. For example, with an object { a: { b: { c: "example" }}}, the
// valueHandler would receive:
//
// 1. "example"
//
// The valueHandler takes this value and looks for a template. If it finds one
// it determines the approprate interpolater to call, replaces the template with
// the result and then returns the new value.
var valueHandler = function(leaf){
    var functionName;

    if(utils.isString(leaf) && leaf.match(/{{.+}}/)){
        var substring = leaf.match(/{{.+}}/)[0],
            functionName = substring.replace("{{","").replace("}}","").trim();

        return leaf.replace(substring, stamplet._interpolaters[functionName].call());
    }

    return leaf;
}

// ### Generate
// At it's core, stamplet takes your JSON, converts it to a traversable object
// and traverses it. Each node is passed off the key and value handlers which
// find the templated commands and run generators and interpolaters respectively.
//
// The result is then converted back into JSON and returned.
stamplet.generate = function(object, options){
    options = options || {};
    var obj = traverse.call(this, object, {
        keyHandler: keyHandler,
        valueHandler: valueHandler,
    });
    var result = options.json === false
        ? obj
        : JSON.stringify(obj);
    return result;
}

// ### Extension
// Extend stamplet to fit your needs by passing it custom interpolaters and
// generators.
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


module.exports = stamplet;
