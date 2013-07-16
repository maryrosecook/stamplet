var assert = require('assert'),
    stamplet = require('../');

describe('stamplet', function(){
    describe('generate', function(){
        it("should output identical json if no template tags are used", function(){
            var testJSON = '{"string":"string","number":123}';
            assert.equal(stamplet.generate(testJSON), testJSON);
        });

        it("should replace {{helloWorld}} with a generated 'hello world' string", function(){
            stamplet.addGenerator('helloWorld', function(){
                return "hello world";
            });

            var inputJSON = '{"string":"{{helloWorld}}","number":123}',
                outputJSON = '{"string":"hello world","number":123}';

            assert.equal(stamplet.generate(inputJSON), outputJSON);
        });
    });

    describe('addGenerator', function(){
        it('should accept a name and a function which accepts options', function(){
            stamplet.addGenerator("generatorName", function(option){
                return "test";
            });
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
