const {
	ComponentDialog,
	WaterfallDialog,
	ChoicePrompt,
	ChoiceFactory,
	NumberPrompt,
	TextPrompt,
} = require('botbuilder-dialogs');

const { CardFactory } = require('botbuilder');
const { AddCDialog } = require('../Constants/dialogIDs');
const { showCertificate } = require('../cards/cards2');
let user = require('./userProfile');

const ChoicePromptDialog = 'ChoicePromptDialog';
const NumberPromptDialog = 'NumberPromptDialog';
const TextPromptDialog = 'TextPromptDialog';
     
const AddCDialogWF1 = 'AddCDialogWF1';
class ADDCDialog extends ComponentDialog {
	constructor(userState, conversationState) {
		super(AddCDialog);

		if (!conversationState) throw new Error('conversation state required');
		this.conversationState = conversationState;
		this.userState = userState;
		this.userProfileAccessor = this.userState.createProperty('UserProfileState');
		

		this.addDialog(new ChoicePrompt(ChoicePromptDialog));
		this.addDialog(new NumberPrompt(NumberPromptDialog));
		this.addDialog(new TextPrompt(TextPromptDialog));

		this.addDialog(
			new WaterfallDialog(AddCDialogWF1, [
				this.CertificateInput.bind(this),
				this.ProviderInput.bind(this),
				this.sendConfirmation.bind(this),
			]),
		);

		this.initialDialogId = AddCDialogWF1;
	}   

	async CertificateInput(stepContext) {
		await stepContext.context.sendActivity(
			'Please enter your course details correctly !',
		);
		return await stepContext.prompt(
			NumberPromptDialog,
			`Enter Certificate No. :`,
		);
	}

	async ProviderInput(stepContext) {
		stepContext.values.certificateNum = stepContext.result;
		await stepContext.context.sendActivity(
			`${stepContext.values.certificateNum} added successfully`,
		);

		return await stepContext.prompt(
			TextPromptDialog,
			'Please enter your course provider !',
		);
	}

	async sendConfirmation(stepContext) {
		stepContext.values.Provider = stepContext.result;
		let userProfile = await this.userProfileAccessor.get(
			stepContext.context,
			{},
		);
		userProfile.certificateNo = stepContext.values.certificateNum;
		userProfile.certificateProvider = stepContext.values.Provider;

		  //store data in object
		user.certificates.push({
			"CertificateNo": userProfile.certificateNo,
			"Provider": userProfile.certificateProvider
		});
		  await stepContext.context.sendActivity({
				attachments: [
					CardFactory.adaptiveCard(
						showCertificate(
							userProfile.certificateNo,
							userProfile.certificateProvider,
						),
					),
				],
		  });
		return await stepContext.context.sendActivity({
				attachments: [
					CardFactory.heroCard(
						'Here are some suggestions: ',
						null,
						CardFactory.actions([
							{
								type: 'imBack',
								title: 'Portfolio',
								value: 'Portfolio',
							},
							{
								type: 'imBack',
								title: 'Add Certificates',
								value: 'Add Certificates',
							},
							{
								type: 'imBack',
								title: 'Add Skills',
								value: 'Add Skills',
							},
						]),
					),
				],
			});
	}

	async sendHelpSuggestions(stepContext) {
		await stepContext.context.sendActivity(
			'hello i can help you,please apply leave or you want to check your leave status',
		);
		await stepContext.context.sendActivity({
			attachments: [
				CardFactory.heroCard(
					'Here are some suggestions: ',
					null,
					CardFactory.actions([
						{
							type: 'imBack',
							title: 'Portfolio',
							value: 'Portfolio',
						},
						{
							type: 'imBack',
							title: 'Add Certificates',
							value: 'Add Certificates',
						},
						{
							type: 'imBack',
							title: 'Add Skills',
							value: 'add skills',
						},
					]),
				),
			],
		});

		return await stepContext.endDialog();
	}
}

module.exports.ADDCDialog = ADDCDialog;