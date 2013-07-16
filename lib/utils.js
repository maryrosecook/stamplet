function isObject(value){
    return value === Object(value);
}

function isArray(value){
    return Array.isArray(value);
}

function isJSON(value){
    try {
        JSON.parse(value);
    } catch (e){
        return false;
    }

    return true;
}

// not a generic enough to clone any object, but since
// we're targeting JSON we can get away with it
function clone(obj){
    return JSON.parse(JSON.stringify(obj));
}

// depth first traversal which calls bask
var traverse = function(obj, fn){
    var newObj = clone(obj);
   
    for(var key in newObj){
        if(isObject(newObj[key])){
            traverse(newObj[key], fn);
        }
        if(typeof fn === "function"){
            fn();
        }
    }

    return newObj;
}

exports.traverse = traverse;

// traverses json and maps a function over it
exports.map  = function map(thing, fn){
    // pull out of function
    if(isJSON(thing)){
        map(JSON.parse(thing), fn);
    }

    if(isArray(thing)){
        var array = thing;
        array.forEach(function(val, index, array){
            if(isObject(val) || isArray(val)) {
                fn(index, val);
                map(val, fn);
            } else {
                fn(index, val);
            }
        });
    } else if(isObject(thing)){
        var obj = thing;
        
        for(var key in obj){
            var val = obj[key];
            if(isObject(val) || isArray(val)){
                fn(key, val);
                map(val, fn); 
            } else {
                fn(key, val);
            }
        }
    }

};

// parse the template and replace what you need
exports.interpolate = function(template, generators, delimiter){
    var substr; 

    if(typeof template === "string"){
        substr = template.match(delimiter);
    } else {
        return template;
    }

    if(substr){
        return template.replace(delimiter, generate(substr));
    } else {
        return template;
    }

    function generate(substr){
        var generator;
        if(substr.length === 1){
            generator = substr[0];
            generator = generator.replace(/^{{2}/, "");
            generator = generator.replace(/}{2}$/, "");
        }

        return generators[generator]();
    }
};
