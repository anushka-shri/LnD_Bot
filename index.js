const restify = require('restify');

const {
	BotFrameworkAdapter,
	ConversationState,
	UserState,
	MemoryStorage,
} = require('botbuilder');

const { BotActivityHandler } = require('./BotAcivityHandler.js');
// adapter init

const { RootDialog } = require('./Dialogs/RootDialog');

const adapter = new BotFrameworkAdapter({
	appId: process.env.MicrosoftAppId,
	appPassword: process.env.MicrosoftAppPassword,
}); // for local development we dont need that

//adapter error handler

adapter.onTurnError = async (context, error) => {
	console.log('error occured => ', error);

	//send message to user about the error

	await context.sendActivity('Bot encountered an error');
	// context has function called sendActivity and it takes string as a argument.
};

//create server

let server = restify.createServer();
server.listen(3978, () => {
	console.log(`${server.name} listening to ${server.url}`);
});

const memory = new MemoryStorage();
let conversationState = new ConversationState(memory);
let userState = new UserState(memory);
// activity handler object

const rootDialog = new RootDialog(userState, conversationState);
const mainBot = new BotActivityHandler(
	userState,
	conversationState,
	rootDialog,
);

server.post('/api/messages', (req, res) => {
	adapter.processActivity(req, res, async (context) => {
		await mainBot.run(context);
	}); // process all activities coming from user
});
