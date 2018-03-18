module.exports = function(controller, dialogflowMiddleware) {

    controller.hears(['wifi_intent'], 'direct_message', dialogflowMiddleware.hears, function(bot, message) {
        bot.reply(message, "the wifi credential for guest are\nSSID: oneConnectGuest\nPassword: 1618ac1618"); 
    });

};
