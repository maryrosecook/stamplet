// STAMPLET
var stamplet = {};

stamplet._interpolaters = [];
stamplet._generators    = [];

stamplet._valueHandler = function(node){
    var functionName;

    if(isString(node) && node.match(/{{.+}}/)){
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

// INTERNALS / UTILS

// http://stackoverflow.com/questions/4647817/javascript-object-rename-key
Object.defineProperty(
    Object.prototype, 
    'renameProperty',
    {
        writable : false, // Cannot alter this property
        enumerable : false, // Will not show up in a for-in loop.
        configurable : false, // Cannot be deleted via the delete operator
        value : function (oldName, newName) {
            // Check for the old property name to 
            // avoid a ReferenceError in strict mode.
            if (this.hasOwnProperty(oldName)) {
                this[newName] = this[oldName];
                delete this[oldName];
            }
            return this;
        }
    }
);

// not a generic enough to clone any object, but since
// we're targeting JSON we can get away with it
function clone(obj){
    return JSON.parse(JSON.stringify(obj));
}

function isObject(value){
    return value === Object(value);
}

function isArray(value){
    return Array.isArray(value);
}

function isString(value){
    return typeof value === "string"; 
}

// Traverse performs a depth-first traversal over an object and returns a copy.
//
// Like Array.map, traverse runs every node through an optional valueHandler,
// giving one the ability to filter and change each node. 
// There is also an optional key handler which is passed the full key/value for
// a node. This must also return a key/value or undefined if there handler is
// no have no affect on the structure.
// You pass in options with keyHanders and valueHandler, if you only want the
// value handler you can pass in a raw funciton. Note that key hanlders don't
// work with Arrays. You're not going to get in index.
var traverse = function(origObj, options){
    var obj = clone(origObj);
    
    // prevent undefined errors later 
    if(!options) options = {};

    // caller is opting to use anon function instead of options.
    if(typeof options === 'function'){
        handlers = {
            keyHandler: null,
            valueHandler: options
        }
    } else {
        handlers = options;
    }

    if(isArray(obj)){
        obj.forEach(function(val, index, array){
            if(isArray(val) || isObject(val)){
                array[index] = traverse(val, handlers);
            } else {
                if(typeof handlers.valueHandler === "function"){
                    array[index] = handlers.valueHandler(val);
                } 
            }
        });
    } else if (isObject(obj)) {
        if(typeof handlers.keyHandler === "function"){
            
            // first change to make sure result isn't undefined.
            var tmp = handlers.keyHandler(obj); 
                
            if(typeof tmp !== "undefined"){
                obj = tmp;
            }
        } 

        for (var key in obj){
            val = obj[key];

            if(isArray(val) || isObject(val)){
                obj[key] = traverse(val, handlers);
            } else {
                if(typeof handlers.valueHandler === "function"){
                    obj[key] = handlers.valueHandler(val);
                } 
            }
        }
    }

    return obj;
}

module.exports.traverse = traverse;


// PRIME GENERATORS
stamplet.addInterpolater("randomString", function(options){
    if(typeof options === "undefined"){
        options = {};
    }

    var length = options.length || 5;

    str = "";
    for(var i = 0; i < length; i++){
        str = str.concat(randomLetter());
    }
    return str;

    function randomLetter(){
        var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m'];
            alphabet.push('n','o','p','q','r','s','t','u','v','w','x','y','z');

        return alphabet[Math.floor(Math.random()*alphabet.length)];
    }
})
