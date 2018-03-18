/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

module.exports = function(controller, dialogflowMiddleware) {

    // controller.hears(['^templates$'], 'direct_message,direct_mention', function(bot, message) {
    //     bot.reply(message, "Hi there, you're on workspace: " + message.team)
    // });

    controller.hears(['templates_intent'], 'direct_message', dialogflowMiddleware.hears, function(bot, message) {
        bot.reply(message, 'Hello!');
    });

};
