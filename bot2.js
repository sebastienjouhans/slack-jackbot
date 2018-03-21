require('dotenv').config();


if (!process.env.slackClientId) {
    console.log('Error: Specify - slackClientId');
    process.exit(1);
}

if (!process.env.slackClientSecret) {
    console.log('Error: Specify - slackClientSecret');
    process.exit(1);
}

if (!process.env.slackBotUserOAuthAccessToken) {
    console.log('Error: Specify - slackBotUserOAuthAccessToken');
    process.exit(1);
}

if (!process.env.dialogflowDeveloperToken) {
    console.log('Error: Specify - dialogflowDeveloperToken');
    process.exit(1);
}

if (!process.env.port) {
    console.log('Error: Specify port');
    process.exit(1);
}

var Botkit = require('botkit');

var controller = Botkit.slackbot({
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
    rtm_receive_messages: false,
});

var slackBot = controller.spawn({
    token: process.env.slackBotUserOAuthAccessToken,
});

var dialogflowMiddleware = require('botkit-middleware-dialogflow')({
    token: process.env.dialogflowDeveloperToken,
});

controller.middleware.receive.use(dialogflowMiddleware.receive);
slackBot.startRTM();

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