var debug = require('debug')('botkit:onboarding');

module.exports = function (controller) {

    controller.on('onboard', function (bot) {

        debug('Starting an onboarding experience!');

        bot.startPrivateConversation({user: bot.config.createdBy}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('Hi, I am JackBot, I am here to help. Ask me a question like where is the creative brief template. If you get stuck just type help');
            }
        });
    });

}
