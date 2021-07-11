const {
	ComponentDialog,
	WaterfallDialog,
	ChoicePrompt,
	NumberPrompt,
	TextPrompt,
} = require('botbuilder-dialogs');

const { CardFactory } = require('botbuilder');
const { skillsDialog } = require('../Constants/dialogIDs');
const { showSkills } = require('../cards/cards2');
let user = require('./userProfile');

const ChoicePromptDialog = 'ChoicePromptDialog';
const NumberPromptDialog = 'NumberPromptDialog';
const TextPromptDialog = 'TextPromptDialog';

const skillsDialogWF1 = 'skillsDialogWF1';
class SkillsDialog extends ComponentDialog {
	constructor(userState, conversationState) {
		super(skillsDialog);

		if (!conversationState) throw new Error('conversation state required');
		this.conversationState = conversationState;
		this.userState = userState;
		this.userProfileAccessor =
			this.userState.createProperty('UserProfileState');

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
		stepContext.values.skills = stepContext.result;
		await stepContext.context.sendActivity(
			`${stepContext.values.skills} added successfully`,
		);

		return await stepContext.prompt(
			TextPromptDialog,
			'Please enter your skills provider !',
		);
	}

	async sendConfirmation(stepContext) {
		stepContext.values.Provider = stepContext.result;

		let userProfile = await this.userProfileAccessor.get(
			stepContext.context,
			{},
		);
		userProfile.skills = stepContext.values.skills;
		userProfile.skillsProvider = stepContext.values.Provider;

		//store data in object
		user.certificates.push({
			skills: userProfile.skills,
			Provider: userProfile.skillsProvider,
		});
		await stepContext.context.sendActivity({
			attachments: [
				CardFactory.adaptiveCard(
					showSkills(userProfile.skills, userProfile.skillsProvider),
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
							value: 'add skills',
						},
					]),
				),
			],
		});

		return await stepContext.endDialog();
	}
}

module.exports.SkillsDialog = SkillsDialog;
