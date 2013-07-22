var assert = require('chai').assert;
    traverse = require('../lib/traverse'),
    utils = require('../lib/utils');

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
                        utils.renameProperty(obj, 'e', 'newkey');
                    }
                }
            });

            assert.deepEqual(output, expected);
        });
    });
});
