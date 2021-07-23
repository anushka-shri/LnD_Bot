// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { InputHints } = require('botbuilder');
const { CardFactory } = require('botbuilder');
const {
	rootDialog,
} = require('../Constants/dialogIDs');
const { ComponentDialog, DialogTurnStatus } = require('botbuilder-dialogs');

class CancelAndHelpDialog extends ComponentDialog {
	async onContinueDialog(innerDc) {
		const result = await this.interrupt(innerDc);
		if (result) {
			return result;
		}
		return await super.onContinueDialog(innerDc);
	}

	async interrupt(innerDc) {
		if (innerDc.context.activity.text) {
			const text = innerDc.context.activity.text.toLowerCase();

			switch (text) {
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
				case 'add certificates':
				case 'add skills':
				case 'courses':
				case 'Portfolio':
				case 'recharge': {
					await innerDc.beginDialog(rootDialog);
					return { status: DialogTurnStatus.waiting };
				}
			}
		}
	}
}

module.exports.CancelAndHelpDialog = CancelAndHelpDialog;
