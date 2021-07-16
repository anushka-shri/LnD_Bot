const {
	ComponentDialog,
	DialogSet,
	DialogTurnStatus,
	WaterfallDialog,
} = require('botbuilder-dialogs');
const { LuisRecognizer } = require('botbuilder-ai');

const {
	rootDialog,
	AddCDialog,
	skillsDialog,
	portDialog,
	RechargeDialog
} = require('../Constants/dialogIDs');
const { ADDCDialog } = require('./AddCertificates');
const { SkillsDialog } = require('./AddSkills.js');
const { PortFolioDialog } = require('./Myportfolio');
const { CoursesDialog } = require('./AddCourses');
const { RechargeDialogue } = require('./RechargeDialog.js');

const parseMessage = 'parseMessage';

const luisConfig = {
	applicationId: 'd94d832b-37a3-496f-9806-66547af6ad15',
	endpointKey: '317ef520ad4b42149b2bf25394829cb2',
	endpoint:
		'https://manipal-interns-luis-authoring.cognitiveservices.azure.com/',
};

class RootDialog extends ComponentDialog {
	constructor(userState, conversationState) {
		super(rootDialog);

		if (!conversationState) throw new Error('conversation state required');
		this.conversationState = conversationState;
		this.userState = userState;

		this.addDialog(
			new WaterfallDialog(parseMessage, [this.routeMessage.bind(this)]),
		);

		this.recognizer = new LuisRecognizer(luisConfig, {
			apiVersion: 'v3',
		});

		this.addDialog(new ADDCDialog(userState, conversationState));
		this.addDialog(new SkillsDialog(userState, conversationState));
		this.addDialog(new CoursesDialog(userState, conversationState));
		this.addDialog(new PortFolioDialog(userState, conversationState));
		this.addDialog(new RechargeDialogue(userState, conversationState));
		this.initialDialogId = parseMessage;
	}

	async run(context, accessor) {
		try {
			const dialogSet = new DialogSet(accessor); //to hold all dialog ids we create a new dialog set
			dialogSet.add(this); // refers to current reference object
			const dialogContext = await dialogSet.createContext(context); // hold specific context of that particular dialog
			const results = await dialogContext.continueDialog(); //
			if(results.status === DialogTurnStatus.empty) {
				await dialogContext.beginDialog(this.id);
			} else {
				console.log('dialog stack is empty');
			}
		} catch (err) {
			console.log(err);
		}
	}

	async routeMessage(stepContext) {
		let luisResponse = await this.recognizer.recognize(stepContext.context);
		let luisIntent = luisResponse.luisResult.prediction.topIntent;
		console.log(JSON.stringify(luisResponse.luisResult));
		switch (stepContext.context.activity.text || luisIntent) {
			case 'Add Certificates':
				return await stepContext.beginDialog(AddCDialog, {
					luisResult: true,
					entities: luisResponse.luisResult.prediction.entities,
				});
			case 'Add Skills':
				return await stepContext.beginDialog(skillsDialog, {
					luisResult: true,
					entities: luisResponse.luisResult.prediction.entities,
				});
			case 'Courses':
				return await stepContext.beginDialog('CoursesDialog', {
					luisResult: true,
					entities: luisResponse.luisResult.prediction.entities,
				});
			case 'Portfolio':
				return await stepContext.beginDialog(portDialog, {
					luisResult: true,
					entities: luisResponse.luisResult.prediction.entities,
				});
			case 'Recharge':
				return await stepContext.beginDialog(RechargeDialog);
			default:
				await stepContext.context.sendActivity('Sorry I am still learning');
		}
		return await stepContext.endDialog();
	}
}

module.exports.RootDialog = RootDialog;
