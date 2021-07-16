const {
	ComponentDialog,
	WaterfallDialog,
	ChoicePrompt,
	NumberPrompt,
	TextPrompt,
} = require('botbuilder-dialogs');

const { CardFactory } = require('botbuilder');
const { skillsDialog } = require('../Constants/dialogIDs.js');
const { showSkills } = require('../cards/cards2');

let user = require('./userProfile');

const { CancelAndHelpDialog } = require('./CancelAndHelpDialog');
const ChoicePromptDialog = 'ChoicePromptDialog';
const NumberPromptDialog = 'NumberPromptDialog';
const TextPromptDialog = 'TextPromptDialog';

const skillsDialogWF1 = 'skillsDialogWF1';

class SkillsDialog extends CancelAndHelpDialog {
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
				this.preProcessEntities.bind(this),
				this.SkillsInput.bind(this),
				this.sendConfirmation.bind(this),
			]),
		);

		this.initialDialogId = skillsDialogWF1;
	}

	async preProcessEntities(stepContext) {
		try {
			if (stepContext.options && stepContext.options.luisResult) {
				let skillsEntity = stepContext.options.entities.SkillsName
					? stepContext.options.entities.SkillsName[0]
					: null;

				stepContext.values.Entities = {
					skillsEntity,
				};

				return stepContext.next();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async SkillsInput(stepContext) {
		if (stepContext.values.Entities.skillsEntity == null) {
			await stepContext.context.sendActivity(
				'Please enter your skills details',
			);
			return await stepContext.prompt(
				TextPromptDialog,
				`Enter Skill details :`,
			);
		} else {
			return await stepContext.next();
		}
	}

	async sendConfirmation(stepContext) {
		if (stepContext.values.Entities.skillsEntity == null) {
			stepContext.values.skills = stepContext.result;
			await stepContext.context.sendActivity(
				`${stepContext.values.skills} added successfully`,
			);

			let userProfile = await this.userProfileAccessor.get(
				stepContext.context,
				{},
			);
			userProfile.skills = stepContext.values.skills;

			//store data in object
			user.skills.push({
				skills: userProfile.skills,
			});
			await stepContext.context.sendActivity({
				attachments: [CardFactory.adaptiveCard(showSkills(userProfile.skills))],
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
			return await stepContext.endDialog();
		} else {
			await stepContext.context.sendActivity(
				`${stepContext.values.Entities.skillsEntity} added successfully`,
			);

			let userProfile = await this.userProfileAccessor.get(
				stepContext.context,
				{},
			);
			userProfile.skills = stepContext.values.Entities.skillsEntity;

			//store data in object
			user.skills.push({
				skills: userProfile.skills,
			});
			await stepContext.context.sendActivity({
				attachments: [
					CardFactory.adaptiveCard(
						showSkills(stepContext.values.Entities.skillsEntity),
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

module.exports.SkillsDialog = SkillsDialog;
