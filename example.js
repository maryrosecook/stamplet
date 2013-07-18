var stamplet = require('./index');

stamplet.addGenerator('repeatThreeTimes', function(array){
    var first = array.shift();

    return [first, first, first];
});

stamplet.addInterpolater('randomSeason', function(value){
    var seasons = ["Spring", "Summer", "Winter", "Fall"];

    return seasons[Math.floor(Math.random() * seasons.length)];
});

var obj = {
    "users{{repeatThreeTimes}}":[{ 
        favoriteSeason: "{{ randomSeason }}",
        leastFavoriteSeason: "{{ randomSeason }}",
        string: "{{ randomString }}" // built in interpolater... only one right now
    }]
}


console.log(stamplet.generate(JSON.stringify(obj)));
