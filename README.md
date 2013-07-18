#Stamplet

Stamplet's job is to take a piece of specially-templatted json like this:

```
{
  "users{{repeat(3)}}":[
    { "someString": "{{ randomString 5 }}" }
  ]
}
```

and return this:
```
{
  "users":[
    { someString: "alske" },
    { someString: "bfkdt" },
    { someString: "qlcys" },
  ]
}
```
### Templates
Templates use a double curly bracket syntax like Mustache or Handlerbars. When
stamplet sees an embedded template, it looks up a generator or interpolater
function with that name and then calls that funciton to transform the json.

### Genenerators and Interators
In short, generators operate on the overall structure of an object and are found
in the keys of a json object. Interpolaters fill in the values at the "leaves"
of an object and are embedded in the values of an object.

### Customization
Stamplet is designed to be extended with custom generators and interpolaters:

```
stamplet.addGenerator('myGenerator', function(node){
  // manipulate the node
});

stamplet.addInterpolater('myInterpolater', function(value){
  // return new value
});
```

### Running Tests
``` mocha test ```
or
``` npm test ```

### Generating Documentation
``` docco lib/*.js ```
(html documentation will be exported to docs)
