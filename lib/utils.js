// Utilties
;(function(exports) {
    exports.isObject = function(value){
        return value === Object(value) && !exports.isArray(value);
    };

    exports.isArray = function (value){
        return Array.isArray(value);
    };

    exports.isString = function(value){
        return typeof value === "string";
    };

    // not a generic enough to clone any object, but since
    // we're targeting JSON we can get away with it
    exports.clone = function(obj){
        return JSON.parse(JSON.stringify(obj));
    };

    exports.renameProperty = function(obj, oldName, newName) {
        // Check for the old property name to
        // avoid a ReferenceError in strict mode.
        if (obj.hasOwnProperty(oldName)) {
            obj[newName] = obj[oldName];
            delete obj[oldName];
        }
    }
}(exports));
