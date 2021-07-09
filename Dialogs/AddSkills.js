const {
	ComponentDialog,
	WaterfallDialog,
	ChoicePrompt,
	NumberPrompt,
	TextPrompt,
} = require('botbuilder-dialogs');

const { CardFactory } = require('botbuilder');
const { skillsDialog } = require('../Constants/dialogIDs');

const ChoicePromptDialog = 'ChoicePromptDialog';
const NumberPromptDialog = 'NumberPromptDialog';
const TextPromptDialog = 'TextPromptDialog';

const skillsDialogWF1 = 'skillsDialogWF1';
class SkillsDialog extends ComponentDialog {
	constructor(conversationState) {
		super(skillsDialog);

		if (!conversationState) throw new Error('conversation state required');
		this.conversationState = conversationState;

		this.applyLeaveStateAccessor =
			this.conversationState.createProperty('ApplyLeaveState');

		this.addDialog(new ChoicePrompt(ChoicePromptDialog));
		this.addDialog(new NumberPrompt(NumberPromptDialog));
		this.addDialog(new TextPrompt(TextPromptDialog));

		this.addDialog(
			new WaterfallDialog(skillsDialogWF1, [
				this.SkillsInput.bind(this),
				this.ProviderInput.bind(this),
				this.sendConfirmation.bind(this),
				
			]),
		);

		this.initialDialogId = skillsDialogWF1;
	}

	async SkillsInput(stepContext) {
		await stepContext.context.sendActivity('Please enter your skills details');
		return await stepContext.prompt(TextPromptDialog, `Enter Skill details :`);
	}

	async ProviderInput(stepContext) {

		stepContext.values.skillsVal = stepContext.result;
		await stepContext.context.sendActivity(
			`${stepContext.values.skillsVal} added successfully`,
		);

		return await stepContext.prompt(
			TextPromptDialog,
			'Please enter your skills provider !',
		);
	}

	async sendConfirmation(stepContext) {
		stepContext.values.Provider = stepContext.result;
		await stepContext.context.sendActivity(
			`Your request for adding skills - ${stepContext.values.skillsVal} by provider ${stepContext.values.Provider} has been successfully sent.`,
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
							value: 'Add Skills',
						},
					]),
				),
			],
		});

		return await stepContext.endDialog();
	}
}

module.exports.SkillsDialog = SkillsDialog;
