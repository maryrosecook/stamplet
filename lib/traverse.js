// Traverse performs a depth-first traversal over an object and returns a copy.
//
// Like Array.map, traverse runs every node through an optional valueHandler,
// giving one the ability to filter and change each node.
//
// One can also pass in "handler" object that can specifiy an optional keyHandler,
// and optional valueHandler.
//
// - *function valueHanlder(nodeValue)*: Called for every value (or "leaf") of the
// structure.
//
// - *function keyHanlder(obj)*: Called for obj (or "branch") of the
// structure. Gives you more power to transform the structure as you're traversing
// it. Note that keyHandlers are never run over Arrays (which don't have keys).
//
// Usage
//
//  1. traverse(object [Object|Array], valueHandler [Function]);
//  2. traverse(object [Object|Array], {
//      keyHandler: [Function],
//      valueHandler: [Function]
//  });
//
// Returns (possibly mutated) object.
var utils = require('./utils');

var traverse = function(origObj, options){

    // Always work with and return a copy of the passed object.
    var obj = utils.clone(origObj);

    // Handle the callbacks.
    if(!options) options = {};
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

            // For arrays that contain arrays or objects, we recurse.
            // Note that we never call a keyHandlers in an array.
            if(utils.isArray(val) || utils.isObject(val)){
                array[index] = traverse(val, handlers);
            } else {

                // Call valueHandler when we reach a "leaf".
                if(typeof handlers.valueHandler === "function"){
                    array[index] = handlers.valueHandler(val);
                }
            }
        });
    } else if (utils.isObject(obj)) {
        if(typeof handlers.keyHandler === "function"){

            // Run key handler...
            var tmp = handlers.keyHandler(obj);

            // but don't write the structure back if it's undefined.
            if(typeof tmp !== "undefined"){
                obj = tmp;
            }
        }

        for (var key in obj){
            val = obj[key];

            // Recurse for sub objects and arrays, as we would for an array.
            if(utils.isArray(val) || utils.isObject(val)){
                obj[key] = traverse(val, handlers);
            } else {

                // Call valueHandler when we reach a "leaf".
                if(typeof handlers.valueHandler === "function"){
                    obj[key] = handlers.valueHandler(val);
                }
            }
        }
    }

    return obj;
}

module.exports = traverse;
