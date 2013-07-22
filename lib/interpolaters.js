// it is a cool idea to allow interpolaters to take args.  Our suggestion for approach:
  // pass positional args as actual args to actual interpolator eg
  //       "randomString": function(strLength, someOtherArg){
  //          strLength = parseInt(strLength || 5, 10);

  // will need to write parser for splitting up args in JSON template
  // might be good to make interpolator templates same structure as generators
  // i.e. use parens around args

module.exports = {
    "randomString": function(){
        var strLength = 5;

        str = "";
        for(var i = 0; i < strLength; i++){
            str = str.concat(randomLetter());
        }
        return str;

        function randomLetter(){
            var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m'];
                alphabet.push('n','o','p','q','r','s','t','u','v','w','x','y','z');

            return alphabet[Math.floor(Math.random()*alphabet.length)];
        }
    }
};
