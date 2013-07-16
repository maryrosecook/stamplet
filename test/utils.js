var assert = require('chai').assert,
    utils = require('../lib/utils');

describe('utils', function(){
    describe('traverse', function(){
        it('returns new objects', function(){
            var originalObj= {};
            var newObj= utils.traverse(originalObj);

            // we should be editing two distince objs
            originalObj.original = "original";
            newObj.new = "new";

            assert.notProperty(originalObj, "new");
            assert.notProperty(newObj, "original");
        });

        it('returns new arrays', function(){
            var originalArr = [];
            var newArr = utils.traverse(originalArr);

            originalArr.push("original");
            newArr.push("new");

            assert.notDeepEqual(newArr, originalArr);
        });

        it('returns an empty object when provided an empty object', function(){
            assert.deepEqual(utils.traverse({}), {});
            assert.deepEqual(utils.traverse([]), []);
        });

        it("returns a copy of basic objects", function(){
            var obj = { a: "test" }
            var newObj = utils.traverse(obj);

            assert.equal(JSON.stringify(newObj), JSON.stringify(obj));
        });

        it("returns a copy of complex objects", function(){
            var obj = { 
                a: "test",
                b: 123,
                c: {
                    d: "test",
                    e: [1, 2, 3]
                }
            }

            var newObj = utils.traverse(obj);
            assert.equal(JSON.stringify(newObj), JSON.stringify(obj));
        });

        describe("passed functions", function(){
            it("should call for each node that's traversed (flat object)", function(){
                var counter = 0,
                    threeNodes = {
                        a: 1,
                        b: 2,
                        c: 3,
                    };

                var newObj = utils.traverse(threeNodes, function(){
                    counter++;
                });

                assert.equal(counter, 3);
            });

            it("should call for each node that's traversed (nested object)", function(){
                var counter = 0,
                    nineNodes = {
                        a: 1,
                        b: {
                            d: 3,
                            e: 4,
                            f: {
                                h: 5,
                                i: 6,
                                j: 7
                            }
                        },
                        c: 2
                    };

                var newObj = utils.traverse(nineNodes, function(){
                    counter++;
                });

                assert.equal(counter, 9);
            });

            it("should call for each node that's traversed (nested with mixed types)", function(){
                var counter = 0,
                    twelveNodes = {
                        a: 1,
                        b: {
                            d: 3,
                            e: [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6
                            ],
                            f: {
                                h: 5,
                                i: 6,
                                j: 7
                            }
                        },
                        c: 2
                    };

                var newObj = utils.traverse(nineNodes, function(){
                    counter++;
                });

                assert.equal(counter, 9);
            });
        });
    });
});
