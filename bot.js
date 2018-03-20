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

var slackController = Botkit.slackbot({
    clientId: process.env.slackClientId,
    clientSecret: process.env.slackClientSecret,
    debug: true,
    rtm_receive_messages: false,
    redirectUri: 'https://slack-jackbot.herokuapp.com',
    // scopes: ['bot',
    // 'incoming-webhook',
    // 'team:read',
    // 'users:read',
    // 'users.profile:read',
    // 'channels:read',
    // 'im:read',
    // 'im:write',
    // 'groups:read',
    // 'emoji:read',
    // 'chat:write:bot'],
    scopes: ['bot',
    'team:read',
    'users:read',
    'users.profile:read',
    'channels:read',
    'im:read',
    'im:write',
    'groups:read',
    'emoji:read',
    'chat:write:bot'],
});

var slackBot = slackController.spawn({
    token: process.env.slackBotUserOAuthAccessToken,
});

var dialogflowMiddleware = require('botkit-middleware-dialogflow')({
    token: process.env.dialogflowDeveloperToken,
});

slackController.middleware.receive.use(dialogflowMiddleware.receive);
slackBot.startRTM();

var webserver = require(__dirname + '/components/express_webserver.js')(slackController);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(slackController);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(slackController);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(slackController, dialogflowMiddleware);
});



// Setup for the Webserver - REQUIRED FOR INTERACTIVE BUTTONS
// slackController.setupWebserver(process.env.port, function(err,webserver) {
//     slackController.createWebhookEndpoints(slackController.webserver);
//     slackController.createOauthEndpoints(slackController.webserver,function(err,req,res) {
//         if (err) {
//             res.status(500).send('ERROR: ' + err);
//             console.log('-----------------------ERROR: ' + err);
//         } else {
//             res.send('Success!');
//             console.log('-----------------------Success!');
//         }
//     });
//     slackController.startTicking();
// });