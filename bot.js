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



// Sample controller config - REQUIRED FOR INTERACTIVE BUTTONS
var controller = Botkit.slackbot({
  debug: true,
  interactive_replies: true, // tells botkit to send button clicks into conversations
 // json_file_store: './db_slackbutton_bot/',
}).configureSlackApp(
  {
    clientId: process.env.slackClientId,
    clientSecret: process.env.slackClientSecret,
    // Set scopes as needed. https://api.slack.com/docs/oauth-scopes
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
  }
);


var slackBot = controller.spawn({
  token: process.env.slackBotUserOAuthAccessToken,
});

var dialogflowMiddleware = require('botkit-middleware-dialogflow')({
    token: process.env.dialogflowDeveloperToken,
});

controller.middleware.receive.use(dialogflowMiddleware.receive);



//slackBot.startRTM();

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
      debug('-----------------------ERROR: ' + err);
    } else {
      res.send('Success!');
      debug('-----------------------Success!');
    }
  });
  //controller.startTicking();
});


//REQUIRED FOR INTERACTIVE MESSAGES
controller.storage.teams.all(function(err,teams) {

  if (err) {
    throw new Error(err);
  }

  // connect all teams with bots up to slack!
  for (var t  in teams) {
    if (teams[t].bot) {
      controller.spawn(teams[t]).startRTM(function(err, bot) {
        if (err) {
          console.log('Error connecting bot to Slack:',err);
        } else {
            console.log(bot);
          trackBot(bot);
        }
      });
    }
  }

});