require('dotenv').config();


if (!process.env.slackClientId || 
    !process.env.slackClientSecret || 
    !process.env.slackBotUserOAuthAccessToken || 
    !process.env.dialogflowDeveloperToken || 
    !process.env.port) {
  console.log('Error: Specify variable in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
  clientId: process.env.slackClientId,
  clientSecret: process.env.slackClientSecret,
  debug: true,
  rtm_receive_messages: false,
  scopes: ['bot',
            'incoming-webhook',
            'team:read',
            'users:read',
            'users.profile:read',
            'channels:read',
            'im:read',
            'im:write',
            'groups:read',
            'emoji:read',
            'chat:write:bot'],
};

bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot(bot_options);

var slackBot = controller.spawn({
  token:process.env.slackBotUserOAuthAccessToken
});

var dialogflowMiddleware = require('botkit-middleware-dialogflow')({
  token: process.env.dialogflowDeveloperToken,
});

// Setup for the Webserver - REQUIRED FOR INTERACTIVE BUTTONS
controller.setupWebserver(process.env.port, function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver);
  controller.createOauthEndpoints(controller.webserver,function(err,req,res) {
    if (err) {
      res.status(500).send('ERROR: ' + err);
      console.log('-----------------------ERROR: ' + err);
    } else {
      res.send('Success!');
      console.log('-----------------------Success!');
    }
  });
  controller.startTicking();
});

controller.middleware.receive.use(dialogflowMiddleware.receive);
slackBot.startRTM();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller, dialogflowMiddleware);
});

