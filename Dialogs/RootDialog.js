const {
	ComponentDialog,
	DialogSet,
	DialogTurnStatus,
	WaterfallDialog,
} = require('botbuilder-dialogs');
const { LuisRecognizer,QnAMaker } = require('botbuilder-ai');

const {
	rootDialog,
	AddCDialog,
	skillsDialog,
	portDialog,
	RechargeDialog,
} = require('../Constants/dialogIDs');
const { ADDCDialog } = require('./AddCertificates');
const { SkillsDialog } = require('./AddSkills.js');
const { PortFolioDialog } = require('./Myportfolio');
const { CoursesDialog } = require('./AddCourses');
const { RechargeDialogue } = require('./RechargeDialog.js');

const parseMessage = 'parseMessage';

const luisConfig = {
	applicationId: '8715de13-898a-424e-9a8d-32949a5faeb4',
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
			new WaterfallDialog(parseMessage, [this.selectMessage.bind(this)]),
		);

		this.recognizer = new LuisRecognizer(luisConfig, {
			apiVersion: 'v3',
		});

		this.LnDLuisRecognizer = new LuisRecognizer(
			{
				applicationId: 'd94d832b-37a3-496f-9806-66547af6ad15',
				endpointKey: '317ef520ad4b42149b2bf25394829cb2',
				endpoint:
					'https://manipal-interns-luis-authoring.cognitiveservices.azure.com/',
			},
			{
				apiVersion: 'v3',
			},
		);
    

		this.qnaMaker = new QnAMaker({
			knowledgeBaseId: '799d7881-8f8d-4cd2-8ea3-05024fa503d2',
			endpointKey: '0704a633-c8ab-4766-99e5-2a055d666ec3',
			host: 'https://firstqabot.azurewebsites.net/qnamaker',
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
			if (results.status === DialogTurnStatus.empty) {
				await dialogContext.beginDialog(this.id);
			} else {
				console.log('dialog stack is empty');
			}
		} catch (err) {
			console.log(err);
		}
	}

	async selectMessage(stepContext) {

		let luisresponse = await this.recognizer.recognize(stepContext.context);
		let luisintent = luisresponse.luisResult.prediction.topIntent;
		console.log(luisintent);

		switch (luisintent) {
			case 'l_Anushkaluis':
				{
					console.log('AnushkaLND');

					const luisresponse1 = await this.LnDLuisRecognizer.recognize(
						stepContext.context,
					);

					let luisintent1 = luisresponse1.luisResult.prediction.topIntent;
					console.log(luisintent);

					if (stepContext.options && stepContext.options.interrupt) {
						const stack = stepContext.options.stack;

						if (stepContext.options && stepContext.options.interrupt) {
							switch (luisintent1) {
								case 'Add Certificates':
									return await stepContext.beginDialog(AddCDialog, {
										luisResult: true,
										interrupt: true,
										entities: luisresponse1.luisResult.prediction.entities,
									});
								case 'Add Skills':
									return await stepContext.beginDialog(skillsDialog, {
										luisResult: true,
										interrupt: true,
										entities: luisresponse1.luisResult.prediction.entities,
									});
								case 'Courses':
									return await stepContext.beginDialog('CoursesDialog', {
										luisResult: true,
										interrupt: true,
										entities: luisresponse1.luisResult.prediction.entities,
									});
								case 'Portfolio':
									return await stepContext.beginDialog(portDialog, {
										luisResult: true,
										interrupt: true,
										entities: luisresponse1.luisResult.prediction.entities,
									});
								case 'Recharge':
									return await stepContext.beginDialog(RechargeDialog, {
										interrupt: true,
									});
								default:
									return await stepContext.context.sendActivity('Sorry I am still learning');
							}
						}
						else {
							switch (luisintent1) {
								case 'Add Certificates':
									return await stepContext.beginDialog(AddCDialog, {
										luisResult: true,
										entities: luisresponse1.luisResult.prediction.entities,
									});
								case 'Add Skills':
									return await stepContext.beginDialog(skillsDialog, {
										luisResult: true,
										entities: luisresponse1.luisResult.prediction.entities,
									});
								case 'Courses':
									return await stepContext.beginDialog('CoursesDialog', {
										luisResult: true,
										entities: luisresponse1.luisResult.prediction.entities,
									});
								case 'Portfolio':
									return await stepContext.beginDialog(portDialog, {
										luisResult: true,
										entities: luisresponse1.luisResult.prediction.entities,
									});
								case 'Recharge':
									return await stepContext.beginDialog(RechargeDialog);
								default:
								return	await stepContext.context.sendActivity('Sorry I am still learning');
							}
						}


					}
				}
				break;
			case 'q_qna-anushka':
				{
					console.log('processQnA');

					const results = await this.qnaMaker.getAnswers(stepContext.context);

					if (results.length > 0) {
						return await stepContext.context.sendActivity(
							`${results[0].answer}`,
						);
					} else {
						return await stepContext.context.sendActivity(
							'Sorry, could not find an answer in the Q and A system.',
						);
					}
				}
			default:
				console.log(`Dispatch unrecognized intent: ${intent}.`);
				return await context.sendActivity(`Dispatch unrecognized intent: ${intent}.`);
				
		}


	}

}

module.exports.RootDialog = RootDialog;
