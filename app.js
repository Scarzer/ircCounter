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
    query = require('querystring'),
    emitter = require('events').EventEmitter
    ductTape = new emitter()

var command = /^![a-zA-Z0-9]*/
    

var config = {
    server: "irc.insomniairc.net",
    botName: "Senseus",
    userName: "Senseus",
    realName: "Senseus Valderin",
    password : "mcBot",
    channels : ['#OmicronMC']
    
};

var stat = {
    startTime : Date(),
    uptime : Date.now(),
    timesUsed : 0,
    mostOnline : 0,
    lastCaller : "Windy"
    
}

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
        // Find the div with the online players!
        var foo = leBody(".online-players");
        var people = foo[0].children
        console.log(people)
        for (var things in people){
            if (people[things].hasOwnProperty('attribs')){
                // If the child is a player, proceed!
                if(people[things].attribs['class'] === 'online-player-heads'){
                    var kids = people[things].children;
                    // For every name, pop out the query name, and push it into the array!
                    for(var name in kids){
                        if(kids[name].hasOwnProperty('attribs')){
                            var string = kids[name].attribs['href']
                            currPlayers.push(query.parse(string).name)
                        }
                    }
                }
             }

        }
        console.log(currPlayers)
        ductTape.emit('currPlayers', currPlayers);

    })

}



var irc = require("irc");

var bot = new irc.Client(config.server, config.botName, {
    channels: config.channels,
    password: config.password
});


bot.on('join', function(channel, nick, message){
    if(config.botname === nick){
        bot.send('/ns identify mcBot')
    }
});

bot.addListener("message", function(from, to, text, message){
    var regText = text.match(command)

    if(to === config.botName){
        console.log("Messaged recieved")
        bot.say(from, "Thank you for your message");
        console.log(text)
    }


    if(regText){
        if(regText[0] === '!list') getPlayers() // Call the function for the callback!
        else if(regText[0] === '!info') ductTape.emit('printInfo', from)
        else if(regText[0] === '!stat') ductTape.emit('printStat', from)
    }

});


//////////// Listeners!

ductTape.on('currPlayers', function(currPlayers){
    var printer = "Currently, "
    switch(currPlayers.length){
        case(0):
            printer = printer + "there is no body online!"
            break

        case(1):
            printer = printer + "there is only one person online: "
            break

        default:
            printer = printer + "there are " + currPlayers.length + " people online: "
    }

    bot.say(config.channels[0], printer + currPlayers)
    stat.lastCaller = caller;
    stat.timesUsed++;
    // Check if most amount of players seen!
    if(currPlayers.length > stat.mostOnline) stat.mostOnline = currPlayers.length
})

ductTape.on('printInfo', function(caller){
    var printer = "Thank you " + caller + " for asking about what" +
        " I can do. My commands are: !list, !info, !stat"
    bot.say(config.channels[0], printer)
    stat.lastCaller = caller;
    stat.timesUsed++;

})

ductTape.on('printStat', function(caller){
    var printer = "Thank you " + caller + " for asking about my credantials.\n" 
    // Time Parser
    var diff = timez = Date.now() - stat.uptime
    var hh = Math.floor(diff / 1000 / 60 / 60);
    timez -= hh * 1000 * 60 * 60;
    var mm = Math.floor(diff / 1000 / 60);
    timez -= mm * 1000 * 60;
    var ss = Math.floor(diff / 1000);
    timez -= ss * 1000;
    
    // Build up message
    printer = printer + "I have been online since " + stat.startTime + ","
    printer = printer + "That calculates to be " + hh + ":" + mm + ":" + ss + ","
    printer = printer + "I have been called " + stat.timesUsed + " times,"
    printer = printer + "The most people I've seen online is " + stat.mostOnline + ","
    printer = printer + "Before you, the last person to call me was " + stat.lastCaller + ","

    bot.say(config.channels[0], printer);
    stat.lastCaller = caller;
    stat.timesUsed++;

})





