/**
 *
 * Created with JetBrains WebStorm.
 * User: irvin
 * Date: 5/15/13
 * Time: 1:12 AM
 * To change this template use File | Settings | File Templates.
 */

var config = {
    channels: ["#testingIrvy"],
    server: "irc.freenode.net",
    botName: "Foo-Irvy"
};

var currentUsers = {

}

var irc = require("irc");

var bot = new irc.Client(config.server, config.botName, {
    channels: config.channels
});

bot.addListener("message", function(from, to, text, message){
    bot.say(config.channels[0], "Herro thar " + from);
    console.log(from);
    console.log(to);
    console.log(text);
    console.log(message);
})
