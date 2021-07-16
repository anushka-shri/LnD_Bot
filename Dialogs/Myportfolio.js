const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');
const { portDialog } = require('../Constants/dialogIDs.js');
const { CancelAndHelpDialog } = require('./CancelAndHelpDialog');
const { myPortfolio } = require('../cards/cards2');
const portDialogWF1 = 'portDialogWF1';

let user = require('./userProfile');


class PortFolioDialog extends CancelAndHelpDialog {
	constructor(userState, conversationState) {
		super(portDialog);

		if (!conversationState) throw new Error('conversation state required');
		this.conversationState = conversationState;
		this.userState = userState;

		this.userProfileAccessor =
			this.userState.createProperty('UserProfileState');

		this.addDialog(
			new WaterfallDialog(portDialogWF1, [
				this.preProcessEntities.bind(this),
				this.showPortFolio.bind(this),
			]),
		);

		this.initialDialogId = portDialogWF1;
	}

	async preProcessEntities(stepContext) {
		try {
			if (stepContext.options && stepContext.options.luisResult) {
				let ViewProfolioEntity = stepContext.options.entities.ViewProfolio
					? stepContext.options.entities.number[0]
					: null;

				stepContext.values.Entities = {
					ViewProfolioEntity,
				};

				return stepContext.next();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async showPortFolio(stepContext) {
		await stepContext.context.sendActivity(
			"Please wait while I'm fetching your details.",
		);

		try {
			let certificateObj = user.certificates.map((el) => {
				return {
					title: JSON.stringify(el.CertificateNo),
					value: el.Provider,
				};
			});

			let skills = user.skills.map((el) => {
				return {
					title: JSON.stringify(el.skills),
					value: el.skills,
				};
			});

			await stepContext.context.sendActivity({
				attachments: [
					CardFactory.adaptiveCard(myPortfolio(user, certificateObj, skills)),
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
		} catch (err) {
			console.log(err);
		}
		return await stepContext.endDialog();
	}
}

module.exports.PortFolioDialog = PortFolioDialog;
