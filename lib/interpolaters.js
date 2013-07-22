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
