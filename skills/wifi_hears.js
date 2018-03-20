module.exports = function(controller, dialogflowMiddleware) {

    controller.hears(['wifi_intent'], 'direct_message', dialogflowMiddleware.hears, function(bot, message) {
        console.log(message.confidence);
        if(message.confidence >.5)
        {
            bot.startConversation(message, function(err, convo) {
                convo.say('the wifi credential for guest are')
                convo.say('SSID: oneConnectGuest');
                convo.say('Password: 1618ac1618');
            }) 
        }
        else
        {
            bot.reply(message, "I am sorry, I am not sure what you mean. I am still learning!"); 
        }
    });

};
