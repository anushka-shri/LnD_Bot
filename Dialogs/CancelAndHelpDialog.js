const { InputHints } = require('botbuilder');
const { rootDialog } = require('../Constants/dialogIDs');
const { ComponentDialog, DialogTurnStatus } = require('botbuilder-dialogs');

class CancelAndHelpDialog extends ComponentDialog {
	async onContinueDialog(innerDc) {
		const result = await this.interrupt(innerDc);
		if(result) {
			return result;
		}
		return await super.onContinueDialog(innerDc);
	}

	async interrupt(innerDc) {
		if (innerDc.context.activity.text) {
			const text = innerDc.context.activity.text;

			switch (text) {
				case 'Yes':
					return await innerDc.continueDialog();
				case 'No':
					await innerDc.cancelAllDialogs();
					return await innerDc.context.sendActivity(
						'How may I help you further?',
					);

				case 'help':
				case '?': {
					const helpMessageText =
						'For queries visit documentation:- https://docs.microsoft.com/en-us/';
					await innerDc.context.sendActivity(
						helpMessageText,
						helpMessageText,
						InputHints.ExpectingInput,
					);
					return { status: DialogTurnStatus.waiting };
				}

				case 'cancel':
				case 'quit': {
					const cancelMessageText = 'Cancelling...';
					await innerDc.context.sendActivity(
						cancelMessageText,
						cancelMessageText,
						InputHints.IgnoringInput,
					);
					return await innerDc.cancelAllDialogs();
				}
				case 'Add Certificates':
				case 'Add Skills':
				case 'Courses':
				case 'Portfolio':
				case 'Recharge': {
					await innerDc.beginDialog(rootDialog, {
						interrupt: true,
					});
					return { status: DialogTurnStatus.waiting };
				}
			}
		}
	}
}

module.exports.CancelAndHelpDialog = CancelAndHelpDialog;
