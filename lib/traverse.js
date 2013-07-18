var utils = require('./utils');

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
    var obj = utils.clone(origObj);
    
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

    if(utils.isArray(obj)){
        obj.forEach(function(val, index, array){
            if(utils.isArray(val) || utils.isObject(val)){
                array[index] = traverse(val, handlers);
            } else {
                if(typeof handlers.valueHandler === "function"){
                    array[index] = handlers.valueHandler(val);
                } 
            }
        });
    } else if (utils.isObject(obj)) {
        if(typeof handlers.keyHandler === "function"){
            
            // first change to make sure result isn't undefined.
            var tmp = handlers.keyHandler(obj); 
                
            if(typeof tmp !== "undefined"){
                obj = tmp;
            }
        } 

        for (var key in obj){
            val = obj[key];

            if(utils.isArray(val) || utils.isObject(val)){
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

module.exports = traverse;
