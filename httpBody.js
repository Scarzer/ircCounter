var http = require('http'),
    cheerio = require('cheerio'),
    request = require('request'),
    query = require('querystring');
    
function parsePlayers(){
    var currPlayers = [],
        leBody = {};
        return request('http://destiny.justin-mp.net/Minecraft/', function(error, response, body){
            leBody = cheerio.load(body);
            var foo = leBody(".online-player-heads");
            var people = foo[0].children
            for(things in people){
               if (people[things].hasOwnProperty('attribs')){
                    var string = people[things].attribs['href'];
                    currPlayers.push(query.parse(string).name)
                }
            }
        return currPlayers

        })
}

            
