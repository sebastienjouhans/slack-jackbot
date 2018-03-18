module.exports = function(controller) {

    controller.hears(['^hello$'], 'direct_message,direct_mention', function(bot, message) {
        bot.reply(message, "Hi there, you're on workspace: " + message.team)
    });

    controller.hears(['^goodbye$'], 'direct_message,direct_mention', function(bot, message) {
        bot.reply(message, "Au revoir");
    });

};
