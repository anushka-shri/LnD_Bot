const { CardFactory } = require('botbuilder');
const {
	ComponentDialog,
	WaterfallDialog,
	NumberPrompt,
	TextPrompt,
	Dialog,
} = require('botbuilder-dialogs');

const { CancelAndHelpDialog } = require('./CancelAndHelpDialog');
const { coursesForm } = require('../cards/cards2');
const { showCourse } = require('../cards/cards2');
let user = require('./userProfile');

const WATERFALL_DIALOG = 'COURSE_DIALOG';

const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';

class CoursesDialog extends CancelAndHelpDialog {
	constructor(userState, conversationState) {
		super('CoursesDialog');

		this.conversationState = conversationState;
		this.userState = userState;
		this.userProfileAccessor =
			this.userState.createProperty('UserProfileState');

		this.addDialog(new TextPrompt(NAME_PROMPT));
		this.addDialog(new NumberPrompt(NUMBER_PROMPT));

		this.addDialog(
			new WaterfallDialog(WATERFALL_DIALOG, [
				this.preProcessEntities.bind(this),
				this.showForm.bind(this),
				this.displayCourse.bind(this),
				this.applyCourse.bind(this),
			]),
		);

		this.initialDialogId = WATERFALL_DIALOG;
	}

	async preProcessEntities(stepContext) {
		try {
			if (stepContext.options && stepContext.options.luisResult) {
				let courseNameEntity = stepContext.options.entities.CourseName
					? stepContext.options.entities.CourseName[0]
					: null;

				stepContext.values.Entities = {
					courseNameEntity,
				};

				return stepContext.next();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async showForm(stepContext) {
		try {
			await stepContext.context.sendActivity({
				attachments: [CardFactory.adaptiveCard(coursesForm())],
			});
			return Dialog.EndOfTurn;
		} catch (err) {
			console.log(err);
		}
	}
	async displayCourse(stepContext) {
		try {
			let userProfile = await this.userProfileAccessor.get(
				stepContext.context,
				{},
			);

			userProfile.CourseName = stepContext.context.activity.value.CourseName;
			user.courses.push(userProfile.CourseName);

			await stepContext.context.sendActivity({
				attachments: [
					CardFactory.adaptiveCard(showCourse(userProfile.CourseName)),
				],
			});
			return Dialog.EndOfTurn;
		} catch (err) {
			console.log(err);
		}
	}
	async applyCourse(stepContext) {
		let userProfile = await this.userProfileAccessor.get(stepContext.context);
		console.log(userProfile);
		await stepContext.context.sendActivity(
			` ${userProfile.CourseName} successfully added to your portfolio`,
		);
		await stepContext.context.sendActivity('Here are some suggestions:');
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
							title: 'Recharge',
							value: 'Recharge',
						},
					]),
				),
			],
		});

		return await stepContext.endDialog();
	}
}

module.exports.CoursesDialog = CoursesDialog;
