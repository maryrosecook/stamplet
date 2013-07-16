var stamplet = {};

// a stack of generators which can be used in geneate
var _generators = {},
    delimiter = /{{.+}}/;

function interpolate(template){
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

        return _generators[generator]();
    }
}

function map(json, fn){
   for(var key in json){
       fn(key, json[key]);
   }
}

// does the actual rendering;
stamplet.generate = function(jsonStr){
    var jsonObj = JSON.parse(jsonStr);

    map(jsonObj, function(key, value){
       jsonObj[key] = interpolate(value);
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

