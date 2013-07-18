#Stamplet

Stamplet's job is to take a piece of specially-templatted json like this:

```javascript
{
  "users{{repeat(3)}}":[
    { "someString": "{{ randomString 5 }}" }
  ]
}
```
and return this:
```javascript
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
In short, generators operate on overall structure and are found
in the keys of a json object. Interpolaters fill in the values at the "leaves"
of a structure and are embedded in the values of an object.

### Customization
Stamplet is designed to be extended with custom generators and interpolaters:

```javascript
stamplet.addGenerator('myGenerator', function(node){
  // return the new object or array
});

stamplet.addInterpolater('myInterpolater', function(value){
  // return new value
});
```
### Installation
```
git clone https://github.com/tjlahr/stamplet.git
cd stamplet
npm install
```

### Running Examples
``` node example.js ```

### Running Tests
``` npm test ```

### Generating Documentation
``` docco script/*.js ```
(html documentation will be exported to docs)
