// traverses json and maps a function over it
exports.map  = function(json, fn){
   for(var key in json){
       fn(key, json[key]);
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
