const {
	ComponentDialog,
	WaterfallDialog,
	ChoicePrompt,
	NumberPrompt,
	TextPrompt,
} = require('botbuilder-dialogs');

const { CancelAndHelpDialog } = require('./CancelAndHelpDialog');
const { CardFactory } = require('botbuilder');
const { AddCDialog } = require('../Constants/dialogIDs');
const { showCertificate, showOptions } = require('../cards/cards2');
let user = require('./userProfile');

const ChoicePromptDialog = 'ChoicePromptDialog';
const NumberPromptDialog = 'NumberPromptDialog';
const TextPromptDialog = 'TextPromptDialog';

const AddCDialogWF1 = 'AddCDialogWF1';
class ADDCDialog extends CancelAndHelpDialog {
	constructor(userState, conversationState) {
		super(AddCDialog);

		if (!conversationState) throw new Error('conversation state required');
		this.conversationState = conversationState;
		this.userState = userState;
		this.userProfileAccessor =
			this.userState.createProperty('UserProfileState');

		this.addDialog(new ChoicePrompt(ChoicePromptDialog));
		this.addDialog(new NumberPrompt(NumberPromptDialog));
		this.addDialog(new TextPrompt(TextPromptDialog));

		this.addDialog(
			new WaterfallDialog(AddCDialogWF1, [
				this.preProcessEntities.bind(this),
				this.CertificateInput.bind(this),
				this.ProviderInput.bind(this),
				this.sendConfirmation.bind(this),
			]),
		);

		this.initialDialogId = AddCDialogWF1;
	}

	async preProcessEntities(stepContext) {
		try {
			if (stepContext.options && stepContext.options.luisResult) {
				let numberEntity = stepContext.options.entities.number
					? stepContext.options.entities.number[0]
					: null;

				let certificateNameEntity = stepContext.options.entities.CertificateName
					? stepContext.options.entities.CertificateName[0]
					: null;

				stepContext.values.Entities = {
					numberEntity,
					certificateNameEntity,
				};

				return stepContext.next();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async CertificateInput(stepContext) {
		if (
			stepContext.values.Entities.numberEntity == null &&
			stepContext.values.Entities.certificateNameEntity == null
		) {
			await stepContext.context.sendActivity(
				'Please enter your course details correctly !',
			);
			return await stepContext.prompt(
				NumberPromptDialog,
				`Enter Certificate No. :`,
			);
		} else {
			return await stepContext.next();
		}
	}

	async ProviderInput(stepContext) {
		if (
			stepContext.values.Entities.numberEntity == null &&
			stepContext.values.Entities.certificateNameEntity == null
		) {
			stepContext.values.certificateNum = stepContext.result;
			await stepContext.context.sendActivity(
				`${stepContext.values.certificateNum} added successfully`,
			);

			return await stepContext.prompt(
				TextPromptDialog,
				'Please enter your course provider !',
			);
		} else {
			return await stepContext.next();
		}
	}

	async sendConfirmation(stepContext) {
		if (
			stepContext.values.Entities.numberEntity == null &&
			stepContext.values.Entities.certificateNameEntity == null
		) {
			stepContext.values.Provider = stepContext.result;
			let userProfile = await this.userProfileAccessor.get(
				stepContext.context,
				{},
			);
			userProfile.certificateNo = stepContext.values.certificateNum;
			userProfile.certificateProvider = stepContext.values.Provider;

			//store data in object
			user.certificates.push({
				CertificateNo: userProfile.certificateNo,
				Provider: userProfile.certificateProvider,
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
				
			});
		} else {
			let userProfile = await this.userProfileAccessor.get(
				stepContext.context,
				{},
			);

			(userProfile.certificateNo = stepContext.values.Entities.numberEntity),
				(userProfile.certificateProvider =
					stepContext.values.Entities.certificateNameEntity),
				//store data in object
				user.certificates.push({
					CertificateNo: userProfile.certificateNo,
					Provider: userProfile.certificateProvider,
				});
			await stepContext.context.sendActivity({
				attachments: [
					CardFactory.adaptiveCard(
						showCertificate(
							stepContext.values.Entities.numberEntity,
							stepContext.values.Entities.certificateNameEntity,
						),
					),
				],
			});
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
								title: 'Courses',
								value: 'Courses',
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
							{
								type: 'imBack',
								title: 'Recharge',
								value: 'Recharge',
							},
						]),
					),
				],
			});
		}
		return await stepContext.endDialog();
	}
}

module.exports.ADDCDialog = ADDCDialog;
