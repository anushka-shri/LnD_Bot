const { MessageFactory, CardFactory } = require('botbuilder');
const {
	ComponentDialog,
	DialogSet,
	DialogTurnStatus,
	WaterfallDialog,
	NumberPrompt,
	TextPrompt,
	Dialog,
} = require('botbuilder-dialogs');

const { Channels } = require('botbuilder-core');
const { coursesForm } = require('../cards/cards2');
const { showCourse } = require('../cards/cards2');
let user = require('./userProfile');

const WATERFALL_DIALOG = 'COURSE_DIALOG';

const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';

class CoursesDialog extends ComponentDialog {
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
				this.showForm.bind(this),
				this.displayCourse.bind(this),
				this.applyCourse.bind(this),
			]),
		);

		this.initialDialogId = WATERFALL_DIALOG;
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

			userProfile.courseName = stepContext.context.activity.value.courseName;
			user.courses.push(userProfile.courseName);

			await stepContext.context.sendActivity({
				attachments: [
					CardFactory.adaptiveCard(showCourse(userProfile.courseName)),
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
			`Successfully enrolled in ${userProfile.courseName} course.`,
		);
		await stepContext.context.sendActivity('May I help you any further?');
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
}

module.exports.CoursesDialog = CoursesDialog;
