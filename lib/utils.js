var _interpolators = [];
var _generators    = [];

stamplet.addInterpolator("randomString", function(options){
    // if !options.length, length = 5
    // str = ""
    // for i in length:
    //   str.push(randomLetter)
    // return str
})

stamplet.addGenerator("repeat", function(obj, args){
   // if !args.numberOfTimes, numberOfTimes = 10
   // firstItem = obj.pop()
   // container = []
   // for i in numberOfTimes
   //   container.push(traverse(obj, ...));
   // return container
})

var interpolate = function(value){
   // if nothingToDo return value
   // functionName = value.match(/pattern/);
   // options      = value.match(/pattern/);
   // return _groupOfFunctions[functionName].call(options);
}

var generate = function(){
    // if nothingToDo = return 
    // functionName = key.match(/pattern/)
    // params = key.match(/pattern/)
    // key = removeTemplate()
    // return _groupOfFunctions[functionName].call(params);
}

var traverse = function(origObj){
    // obj = clone(origObj)
    // for key in obj
    //   val = obj[key]
    //   ===
    //   val = fn(val, key) 
    //   if val isArray or isObj
    //      val = traverse(val)
    //
    //   ===
    //   if key !hasTemplate && val isArray or isObject
    //      val = traverse(val);
    //   if key !hasTemplate && val isPrimitive
    //      val = interpolate(val);
    //   if key hasTemplate
    //      key = removeTemplate(key)
    //      val = generate(val)
    // return obj
}

var processor = function(obj, parentKey){
    //if parentKey hasTemplate
    //  functionName = parentKey.math(/pattern/)
    //  params = parentKey.math(/pattern/)
    //  parentKey = getRidOfTemplate(parentKey)
    //  return _generators[functionName].call(params)
    //if obj hasTemplate
    //  functionName = value.match(/pattern/);
    //  options      = value.match(/pattern/);
    //  return _groupOfFunctions[functionName].call(options);
    //else noop
}

stamplet.generate = function(obj){
    //return traverse(obj, interpolate, generate)
}

var inputJSON = "{...}"

var generatedObj = stamplet.generate(JSON.parse(inputJSON))

var outputJSON = JSON.stringify(generatedObj);
