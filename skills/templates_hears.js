module.exports = function(controller) {

    controller.hears(['^templates$'], 'direct_message,direct_mention', function(bot, message) {
        bot.reply(message, "Hi there, you're on workspace: " + message.team)
    });

};
