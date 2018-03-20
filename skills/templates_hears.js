module.exports = function(controller, dialogflowMiddleware) {

    controller.hears(['templates'], 'direct_message,direct_mention,mention', function (bot, message) {
        var testButtonReply = {
            username: 'jackbot' ,
            text: 'Which templates do you want to know about',
            replace_original: 'true',
            attachments: [
                {
                    fallback: "fallback text",
                    callback_id: '123',
                    attachment_type: 'default',

                    title: 'message title',
                    actions: [
                        {
                          "name": "creative",
                          "text": "creative brief",
                          "type": "button",
                          "value": "whatever you want to pass into the interactive_message_callback"
                        },
                        {
                            "name": "ditch",
                            "text": "ditch deck",
                            "type": "button",
                            "value": "whatever you want to pass into the interactive_message_callback"
                          },
                          {
                            "name": "presentation",
                            "text": "presentation deck",
                            "type": "button",
                            "value": "whatever you want to pass into the interactive_message_callback"
                          },
                          {
                            "name": "creds",
                            "text": "creds deck",
                            "type": "button",
                            "value": "whatever you want to pass into the interactive_message_callback"
                          },
                    ]
                }
            ],
            icon_url: 'http://14379-presscdn-0-86.pagely.netdna-cdn.com/wp-content/uploads/2014/05/ButtonButton.jpg'  
        }
        bot.reply(message, testButtonReply); 
    });



    // controller.on('interactive_message_callback', function(bot, message) {
    //     // These 3 lines are used to parse out the id's
    //     var ids = message.callback_id.split(/\-/);
    //     var user_id = ids[0];
    //     var item_id = ids[1];
    
    //     var callbackId = message.callback_id;
        
    //     // Example use of Select case method for evaluating the callback ID
    //     // Callback ID 123 for weather bot webcam
    //     switch(callbackId) {
    //     case "123":
    //         bot.replyInteractive(message, "Button works!");
    //         break;
    //     // Add more cases here to handle for multiple buttons    
    //     default:
    //         // For debugging
    //         bot.reply(message, 'The callback ID has not been defined');
    //     }
    // });


    controller.middleware.receive.use(function(bot, message, next) {
        if (message.type == 'interactive_message_callback') {
          if (message.actions[0].name.match(/^creative$/)) {
              var reply = message.original_message;
  
              for (var a = 0; a < reply.attachments.length; a++) {
                  reply.attachments[a].actions = null;
              }
  
              var person = '<@' + message.user + '>';
              if (message.channel[0] == 'D') {
                  person = 'You';
              }
  
              reply.attachments.push(
                  {
                      text: person + ' said, ' + message.actions[0].value,
                  }
              );
  
              bot.replyInteractive(message, reply);
    
           }
        }
        
        next();    
        
      });


    controller.hears(['templates_intent'], 'direct_message,direct_mention,mention', dialogflowMiddleware.hears, function(bot, message) {

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
