var assert = require('chai').assert,
    stamplet = require('..');

describe('standard interpolaters', function(){
    describe('randomString', function(){
        it('should replace the template with a random 5 digit string', function(){
            var out = stamplet._interpolaters["randomString"].call();
            assert.isNotNull(out.match(/^[a-z]{5}$/));
        });
    });
});
