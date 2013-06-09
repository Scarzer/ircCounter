/**
 *
 * Created with JetBrains WebStorm.
 * User: irvin
 * Date: 5/15/13
 * Time: 1:12 AM
 * To change this template use File | Settings | File Templates.
 */

var command = /![a-zA-Z0-9]*/
    

var config = {
    channels: ["#OmicronMC"],
    server: "irc.insomniairc.net",
    botName: "Countz"
};

var currentUsers = {}

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
