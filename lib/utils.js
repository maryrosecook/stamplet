// Object Extensions
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

// Utilties
var utils = {
    isObject: function(value){
        return value === Object(value);
    },

    isArray: function (value){
        return Array.isArray(value);
    },

    isString: function(value){
        return typeof value === "string"; 
    },
    
    // not a generic enough to clone any object, but since
    // we're targeting JSON we can get away with it
    clone: function(obj){
        return JSON.parse(JSON.stringify(obj));
    }
}

module.exports = utils;
