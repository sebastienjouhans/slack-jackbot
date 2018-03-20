module.exports = function(controller, dialogflowMiddleware) {

    controller.hears(['help_intent'], 'direct_message,direct_mention,mention', dialogflowMiddleware.hears, function(bot, message) {
        bot.reply(message, "this is the help section, here are some example of what you can ask for.\n * 1. templates\n * 2. wifi");
    });

};
