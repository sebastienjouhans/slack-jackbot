module.exports = function(controller, dialogflowMiddleware) {

    controller.hears(['wifi_intent'], 'direct_message', dialogflowMiddleware.hears, function(bot, message) {
        controller.storage.teams.save({id: message.team, foo:'bar'}, function(err) { console.log(err) });
        console.log(message.confidence);
        if(message.confidence >.5)
        {
            bot.reply(message, "the wifi credential for guest are\nSSID: oneConnectGuest\nPassword: 1618ac1618"); 
        }
        else
        {
            bot.reply(message, "I am sorry, I am not sure what you mean. I am still learning!"); 
        }
    });

};
