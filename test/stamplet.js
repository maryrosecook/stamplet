var assert = require('chai').assert,
    stamplet = require('..');

describe('stamplet', function(){
    describe('generate', function(){
        beforeEach(function(){
            stamplet.addInterpolater("helloWorld", function(){
                return "hello world";
            });

            stamplet.addGenerator('duplicateOnce', function(array){
                var first = array.shift();
                return [first, first];
            });
        });

        it("should output identical json if no template tags are used", function(){
            var object = {"string":"string","number":123};
            assert.equal(stamplet.generate(object), JSON.stringify(object));
        });

        it('should not output JSON if `false', function() {
            var object = {"string":"string","number":123};
            assert.deepEqual(stamplet.generate(object, { json : false }), object);
        });

        it("should output json using generateJSON", function(){
            var object = {"string":"string","number":123};
            assert.equal(stamplet.generateJSON(object), JSON.stringify(object));
        });

        describe('using interpolaters', function(){
            it("should interpolate {{helloWorld}} in a simple object", function(){
                var input = {"string":"{{helloWorld}}","number":123},
                    output = {"string":"hello world","number":123};

                assert.equal(stamplet.generate(input), JSON.stringify(output));
            });

            it("should overwrite only what's inside of the template delimiter", function(){
                var input = { a: "This is an intact {{helloWorld}} sentence." },
                    output = { a: "This is an intact hello world sentence." };

                assert.equal(stamplet.generate(input), JSON.stringify(output));
            });

            it("should be able to handle extra white space in the template", function(){
                var input = { a: "{{       helloWorld    }}" },
                    output = { a: "hello world" };

                assert.equal(stamplet.generate(input), JSON.stringify(output));
            });

            it("should interpolate {{helloWorld}} on a more deeply-nested object", function(){
                var input = {
                    a: "{{helloWorld}}",
                    b: {
                        c: "string",
                        d: "{{helloWorld}}",
                        e: 123
                    }
                }

                var output = {
                    a: "hello world",
                    b: {
                        c: "string",
                        d: "hello world",
                        e: 123
                    }
                }

                assert.equal(stamplet.generate(input), JSON.stringify(output));
            });

            it("should interpolate {{helloWorld}} properly while traversing arrays", function(){
                var input = [1, "{{helloWorld}}", 2];
                var output = [1, "hello world", 2];

                assert.equal(stamplet.generate(input), JSON.stringify(output));
            });
        });

        describe('using generators', function(){
            it("should run the generator when it hits", function(){
                var input = {
                    "twoThings{{duplicateOnce}}": [{ name: "thing" }]
                };

                var output = {
                    "twoThings": [
                        { name: "thing" },
                        { name: "thing" }
                    ]
                }

                debugger;

                assert.equal(stamplet.generate(input), JSON.stringify(output));
            });
        });
    });

    describe('addInterpolater', function(){
        it('should accept a name and a function which accepts options', function(){
            stamplet.addInterpolater("interpolaterName", function(option){
                return "test";
            });

            assert.isFunction(stamplet._interpolaters['interpolaterName']);
        });

        it('should throw a TypeError if you try to pass invalid arguments', function(){
            assert.throws(function(){
                stamplet.addInterpolater(function(option){
                    return "test";
                });
            }, TypeError);

            assert.throws(function(){
                stamplet.addInterpolater("goodName, but no function.");
            }, TypeError);
        });
    });

    describe('addGenerator', function(){
        it('should accept a name and a function which accepts options', function(){
            stamplet.addGenerator("generatorName", function(option){
                return "test";
            });

            assert.isFunction(stamplet._generators['generatorName']);
        });

        it('should throw a TypeError if you try to pass invalid arguments', function(){
            assert.throws(function(){
                stamplet.addGenerator(function(option){
                    return "test";
                });
            }, TypeError);

            assert.throws(function(){
                stamplet.addGenerator("goodName, but no function.");
            }, TypeError);
        });
    });
});
