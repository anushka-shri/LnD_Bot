// for all conditional statements

const {UserState, ConversationState } = require('botbuilder');
const {
	ComponentDialog,
	DialogSet,
	DialogTurnStatus,
	WaterfallDialog,
} = require('botbuilder-dialogs');

const {
	rootDialog,
	AddCDialog,
	skillsDialog,
	portDialog,
} = require('../Constants/dialogIDs');
const { ADDCDialog } = require('./AddCertificates');

const { SkillsDialog } = require('./AddSkills');
const { PortFolioDialog } = require('./Myportfolio');

const parseMessage = 'parseMessage';

class RootDialog extends ComponentDialog {
	constructor(userState, conversationState) {
		super(rootDialog);

		if (!conversationState) throw new Error('conversation state required');
		this.conversationState = conversationState;
		this.userState = userState;

		this.addDialog(
			new WaterfallDialog(parseMessage, [this.routeMessage.bind(this)]),
		);

		this.addDialog(new ADDCDialog(userState, conversationState));
		this.addDialog(new SkillsDialog(conversationState));
		this.addDialog(new PortFolioDialog(userState,conversationState));
		this.initialDialogId = parseMessage;
	}

	async run(context, accessor) {
		try {
			const dialogSet = new DialogSet(accessor); //to hold all dialog ids we create a new dialog set
			dialogSet.add(this); // refers to current reference object
			const dialogContext = await dialogSet.createContext(context); // hold specific context of that particular dialog
			const results = await dialogContext.continueDialog(); //
			if (results && results.status == DialogTurnStatus.empty) {
				await dialogContext.beginDialog(this.id);
			} else {
				console.log('dialog stack is empty');
			}
		} catch (err) {
			console.log(err);
		}
	}
     
	async routeMessage(stepContext) {
		switch (stepContext.context.activity.text.toLowerCase()) {
			case 'add skills':
				return await stepContext.beginDialog(skillsDialog);
			case 'add certificates':
				return await stepContext.beginDialog(AddCDialog);
			case 'portfolio':
				return await stepContext.beginDialog(portDialog);
			default:
				await stepContext.context.sendActivity('Sorry I am still learning');
		}
		return await stepContext.endDialog();
	}
}

module.exports.RootDialog = RootDialog;
      