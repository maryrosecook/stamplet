var stamplet = require('./index.js');

stamplet.addInterpolater("helloWorld", function(){
    return "hello world";
});

stamplet.addGenerator('repeatTenTimes', function(array){
    var first = array.shift();

    var result = [];

    for(var i=0; i < 10; i++){
        result.push(first);
    }

    return result;
});

var obj = {
    a: "{{randomString}}",
    "b{{repeatTenTimes}}": [{ string: "{{randomString}}"}]
}

console.log(stamplet.generate(JSON.stringify(obj)));
