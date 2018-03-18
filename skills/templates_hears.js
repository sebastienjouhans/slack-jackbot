module.exports = function(controller, dialogflowMiddleware) {

    controller.hears('templates', 'direct_message,direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask({
                attachments:[
                    {
                        title: 'Which template are you looking for?',
                        callback_id: '123',
                        attachment_type: 'default',
                        actions: [
                            {
                                "name":"creative",
                                "text": "Creative brief",
                                "value": "creative",
                                "type": "button",
                            },
                            {
                                "name":"pitch",
                                "text": "Pitch deck",
                                "value": "pitch",
                                "type": "button",
                            },
                            {
                                "name":"presentation",
                                "text": "Presentation deck",
                                "value": "presentation",
                                "type": "button",
                            },
                            {
                                "name":"creds",
                                "text": "Creds deck",
                                "value": "creds",
                                "type": "button",
                            }
                        ]
                    }
                ]
            },[
                {
                    pattern: "creative",
                    callback: function(reply, convo) {
                        convo.say('path to the cretive brief template');
                        convo.next();
                        // do something awesome here.
                    }
                },
                {
                    pattern: "pitch",
                    callback: function(reply, convo) {
                        convo.say('path to the pitch deck template');
                        convo.next();
                    }
                },
                {
                    pattern: "presentation",
                    callback: function(reply, convo) {
                        convo.say('path to the presentation deck template');
                        convo.next();
                    }
                },
                {
                    pattern: "creds",
                    callback: function(reply, convo) {
                        convo.say('path to the creds deck template');
                        convo.next();
                    }
                },
                {
                    default: true,
                    callback: function(reply, convo) {
                        // do nothing
                    }
                }
            ]);
        });
    });


    controller.hears(['templates_intent'], 'direct_message', dialogflowMiddleware.hears, function(bot, message) {

        if(message.entities){
            switch(message.entities.template_name_entity.toLocaleLowerCase())
            {
                case 'creative': 
                    bot.reply(message, "path to creative brief template"); 
                    break;
                case 'pitch': 
                    bot.reply(message, "path to pitch template");
                    break;
                case 'presentation': 
                    bot.reply(message, "path to presentation template");
                    break;
                case 'creds': 
                    bot.reply(message, "path to creds template");
                    break;
            }
        }
    });
    
};
