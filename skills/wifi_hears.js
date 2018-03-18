module.exports = function(controller) {

    controller.hears(['^wifi$', '^what is the wifi$', '^what is the wifi password$', '^what are the wifi credentials$'], 'direct_message,direct_mention', function(bot, message) {
        bot.reply(message, "the wifi credential for guest are\nSSID: oneConnectGuest\nPassword: 1618ac1618")
    });

};
