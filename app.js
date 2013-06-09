/**
 *
 * Created with JetBrains WebStorm.
 * User: irvin
 * Date: 5/15/13
 * Time: 1:12 AM
 * To change this template use File | Settings | File Templates.
 */

var http = require('http'),
    cheerio = require('cheerio'),
    request = require('request'),
    query = require('querystring')

var command = /![a-zA-Z0-9]*/
    

var config = {
    channels: ["#OmicronMC"],
    server: "irc.insomniairc.net",
    botName: "Countz"
};

/////////////////////////////////////////////////////////////////
function getPlayers(){
    var currPlayers = [];
    var leBody = "";
    request('http://destiny.justin-mp.net/Minecraft/', function(error, response, body){
        if(error){
            console.log("There was an error!")
            return 0
        }

        leBody = cheerio.load(body);
        var foo = leBody(".online-player-heads");
        var people = foo[0].children
        for (var things in people){
            if (people[things].hasOwnProperty('attribs')){
                var string = people[things].attribs['href'];
                currPlayers.push(query.parse(string).name)
             }
        }
    })
    return currPlayers

}



var irc = require("irc");

var bot = new irc.Client(config.server, config.botName, {
    channels: config.channels
});

bot.addListener("message", function(from, to, text, message){
    var regText = text.match(command)


    if(to === config.botName){
        console.log("Messaged recieved")
        bot.say(from, "Thank you for your message");
    }


    if(regText){
        if(regText[0] === '!list') console.log("Getting a list of people")
    }

});
