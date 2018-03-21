module.exports = function(controller, dialogflowMiddleware) {

    controller.hears(['who_is_jm_intent'], 'direct_message,direct_mention,mention', dialogflowMiddleware.hears, function(bot, message) {
        bot.reply(message, "Jack Morton Worldwide is an American multinational brand experience agency. It is a subsidiary of the Interpublic Group of Companies, Inc. (IPG). The company’s current chairman and CEO is Josh McCall.\n\nConference & Incentive Travel Magazine ranked Jack Morton Worldwide as the number one agency based upon 2016 event-based turnover.\nIn 2016, Event Magazine named them the top brand experience agency. https://en.wikipedia.org/wiki/Jack_Morton_Worldwide");
    });

};
