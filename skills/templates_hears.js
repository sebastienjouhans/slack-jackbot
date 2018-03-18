module.exports = function(controller, dialogflowMiddleware) {

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
