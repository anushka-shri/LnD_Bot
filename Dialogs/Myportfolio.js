const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');
const { portDialog } = require('../Constants/dialogIDs');

const portDialogWF1 = 'portDialogWF1';

let user = require('./userProfile');
const { myPortfolio } = require('../cards/cards2');

class PortFolioDialog extends ComponentDialog {
	constructor(userState, conversationState) {
		super(portDialog);

		if (!conversationState) throw new Error('conversation state required');
		this.conversationState = conversationState;
		this.userState = userState;

		this.userProfileAccessor =
			this.userState.createProperty('UserProfileState');

		this.addDialog(
			new WaterfallDialog(portDialogWF1, [this.showPortFolio.bind(this)]),
		);

		this.initialDialogId = portDialogWF1;
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
