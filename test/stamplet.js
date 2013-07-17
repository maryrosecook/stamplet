var assert = require('chai').assert,
    stamplet = require('..');
    traverse = stamplet.traverse;

describe('interpolaters', function(){
    describe('randomString', function(){
        var out = stamplet._interpolaters["randomString"].call();
        assert.isNotNull(out.match(/^[a-z]{5}$/));
    });
});

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
            var testJSON = '{"string":"string","number":123}';
            assert.equal(stamplet.generate(testJSON), testJSON);
        });

        describe('interpolaters', function(){
            it("should interpolate {{helloWorld}} in a simple object", function(){
                var inputJSON = '{"string":"{{helloWorld}}","number":123}',
                    outputJSON = '{"string":"hello world","number":123}';

                assert.equal(stamplet.generate(inputJSON), outputJSON);
            });

            it("should overwrite only what's inside of the template delimiter", function(){
                var input = { a: "This is an intact {{helloWorld}} sentence." },
                    output = { a: "This is an intact hello world sentence." };
                
                assert.equal(stamplet.generate(JSON.stringify(input)), JSON.stringify(output));
            });

            it("should be able to handle extra white space in the template", function(){
                var input = { a: "{{       helloWorld    }}" },
                    output = { a: "hello world" };
                
                assert.equal(stamplet.generate(JSON.stringify(input)), JSON.stringify(output));
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

                assert.equal(stamplet.generate(JSON.stringify(input)), JSON.stringify(output));
            });

            it("should interpolate {{helloWorld}} properly while traversing arrays", function(){
                var input = [1, "{{helloWorld}}", 2];
                var output = [1, "hello world", 2];

                assert.equal(stamplet.generate(JSON.stringify(input)), JSON.stringify(output));
            });
        });

        describe('generators', function(){
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

                assert.equal(stamplet.generate(JSON.stringify(input)), JSON.stringify(output));
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

describe('internals / utils', function(){
    describe('traverse', function(){
        it('should return a copy of whatever object is passed in', function(){
            var orig = {},
                copy = traverse(orig);

            orig.prop = "orig";
            copy.prop = "copy";

            assert.notDeepEqual(copy, orig);
        });
        describe("valueHandlers", function(){
            it('should run a callback for every node that it traverses', function(){
                var counter = 0,
                    fiveNodes = {
                        a: 1, 
                        b: 2,
                        c: {
                            d: 3,
                            e: {
                                f: 4,
                                g: 5
                            }
                        }
                    };

                traverse(fiveNodes, function(node){
                    counter++;
                });

                assert.equal(counter, 5);
            });

            it('should work with arrays', function(){
                var counter = 0,
                    fiveNodes = [1,2,[3,[4,5]]];

                traverse(fiveNodes, function(node){
                    counter++;
                });

                assert.equal(counter, 5);
            });

            it('should let the callback overwrite values as it traverses', function(){
                // simple case
                var simpleIn = { a: 'test' }
                    simpleExpected = { a: "hello world" };

                var simpleOut = traverse(simpleIn, function(){
                    return "hello world";
                });

                assert.deepEqual(simpleOut, simpleExpected);

                // returning undefined
                var undefinedIn = { a: 'test' },
                    undefinedExpected = { a: undefined };
                
                var undefinedOut = traverse(simpleIn, function(){});

                assert.deepEqual(undefinedOut, undefinedExpected);

                // nested object
                var nestedIn = {
                    a: "test",
                    b: {
                       d: "test",
                       e: {
                           g: {
                               h: "test"
                           },
                           f: "test"
                       }
                    },
                    c: "test"
                };

                var nestedExpected = {
                    a: "foo",
                    b: {
                        d: "foo",
                        e: {
                            g: {
                                h: "foo"
                            },
                            f: "foo"
                        }
                    },
                    c: "foo"
                }

                var nestedOut = traverse(nestedIn, function(){
                    return "foo";
                });

                assert.deepEqual(nestedOut, nestedExpected);

                // nested array
                var arrayIn = [1, [2, [3, [4, 5], 6]]],
                    arrayExpected = ["foo", ["foo", ["foo", ["foo", "foo"], "foo"]]];

                var arrayOut = traverse(arrayIn, function(){
                    return "foo";
                });

                assert.deepEqual(arrayOut, arrayExpected);
            });

            it('should pass the node into the callback', function(){
                var obj = {
                    a: "string",
                    b: {
                        c: "another string",
                        d: [1, 2, 3],
                        e: {
                            f: "last string"
                        }
                    }
                }

                var results = [obj.a, obj.b.c, 1, 2, 3,  obj.b.e.f]

                traverse(obj, function(node){
                    assert.deepEqual(node, results.shift());
                });
            });
        });

        describe("keyHandlers", function(){
            it('should recive a key/value for a simple node', function(){
                var input = { a: "test" }

                traverse(input, {
                    keyHandler: function(obj){
                        assert.deepEqual(obj,input);
                    }
                }); 
            })

            it('should be able to completely change a node', function(){
                var input = { a: "test" };

                var output = traverse(input, {
                    keyHandler: function(obj){
                       return { b: "completely changed" }
                    }
                });

                assert.deepEqual(output, { b: "completely changed" });
            });

            it('should allow you to mutate deeply nested objects', function(){
                var input = { 
                    a: "string",
                    b: {
                        c: "string",
                        e: {
                            f: "string"
                        },
                        d: 123
                    }
                };

                var expected = { 
                    a: "string",
                    b: {
                        c: "string",
                        newkey: {
                            string: "string",
                            number: 123
                        },
                        d: 123
                    }
                };

                var output = traverse(input, {
                    keyHandler: function(obj){
                        if(obj.e !== undefined){
                            obj.e = {
                                string: "string",
                                number: 123
                            }
                            obj.renameProperty('e', 'newkey');
                        }
                    }
                });

                assert.deepEqual(output, expected);
            });
        });
    });
});
