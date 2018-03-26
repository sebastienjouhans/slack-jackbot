var debug = require('debug')('botkit:create_bot');

module.exports = function(controller) {

  var _bots = {};
  function trackBot(bot) {
    _bots[bot.config.token] = bot;
  }

  controller.on('create_bot',function(bot,config) {
    if (_bots[bot.config.token]) {
      // already online! do nothing.
    } else {
      bot.startRTM(function(err) {
        if (!err) {
          trackBot(bot);
        }
        bot.startPrivateConversation({user: config.createdBy},function(err,convo) {
          if (err) {
            console.log(err);
          } else {
            convo.say('I am a bot that has just joined your team');
            convo.say('You must now /invite me to a channel so that I can be of use!');
          }
        });
      });
    }
  });

}