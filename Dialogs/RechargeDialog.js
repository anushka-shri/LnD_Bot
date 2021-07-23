const { MessageFactory, CardFactory } = require('botbuilder');
const {
	ComponentDialog,
	DialogSet,
	DialogTurnStatus,
	WaterfallDialog,
	NumberPrompt,
	TextPrompt,
	ConfirmPrompt,
	ChoicePrompt,
	ChoiceFactory
} = require('botbuilder-dialogs');

const { Channels } = require('botbuilder-core');
const { CancelAndHelpDialog } = require('./CancelAndHelpDialog');
const WATERFALL_DIALOG = 'CERTIFICATE_DIALOG';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';


class RechargeDialogue extends CancelAndHelpDialog {
	constructor(userState, conversationState) {
		super('RechargeDialog');

		this.conversationState = conversationState;
		this.userState = userState;
		this.conversationStateAccessor =
			this.userState.createProperty('UserProfileState');

		this.rechargeStateAccessor =
			this.conversationState.createProperty('rechargeState');

		this.addDialog(new TextPrompt(NAME_PROMPT));
		this.addDialog(new NumberPrompt(NUMBER_PROMPT));
		this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
		this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

		this.addDialog(
			new WaterfallDialog(WATERFALL_DIALOG, [
				this.addRechargeProvider.bind(this),
				this.amountOfRecharge.bind(this),
				this.getPhoneNumber.bind(this),
				this.RechargeProvider.bind(this),
				this.sendConfirmation.bind(this),
				
			]),
		);

		this.initialDialogId = WATERFALL_DIALOG;
	}

	async addRechargeProvider(stepContext) {
		try {

			return await stepContext.prompt(
				NAME_PROMPT,
				'Please provide name of your service provider?',
			);
		} catch (error) {
			console.log(error);
		}
	}

	async amountOfRecharge(stepContext) {
		try {
			let dialogData = await this.rechargeStateAccessor.get(
				stepContext.context,
				{},
			);
			stepContext.values.provider = stepContext.result;
			dialogData.provider = stepContext.values.provider;
			
			return await stepContext.prompt(
				NUMBER_PROMPT,
				'Enter the recharge amount :',
			);
		} catch {
			console.log(error);
		}
	}

	async getPhoneNumber(stepContext) {
		try {
			let dialogData = await this.rechargeStateAccessor.get(
				stepContext.context,
			);
			dialogData.amountVal = stepContext.result;
			return await stepContext.prompt(
				NUMBER_PROMPT,
				'Please enter your Phone Number!',
			);
		} catch (error) {
			console.log(error);
		}
	}

	async RechargeProvider(stepContext) {
		try {
			let dialogData = await this.rechargeStateAccessor.get(
				stepContext.context,
			);
			dialogData.Phno = stepContext.result;
			return await stepContext.prompt(CHOICE_PROMPT, {
				prompt: 'Choose Payment method: ',
				choices: ChoiceFactory.toChoices([
					'Paytm',
					'Net Banking',
					'Credit Card',
					'Debit Card',
				]),
			});
		} catch {
			console.log(error);
		}
	}

	async sendConfirmation(stepContext) {
		try {
			let dialogData = await this.rechargeStateAccessor.get(
				stepContext.context,
			);
			dialogData.Recharge_Provider = stepContext.result.value;
			await stepContext.context.sendActivity(
				`Your Request of Recharge amount ${dialogData.amountVal} for 
                ${dialogData.Phno} by ${dialogData.provider} is successful by payment method ${dialogData.Recharge_Provider}`,
			);
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
							{
								type: 'imBack',
								title: 'Recharge',
								value: 'Recharge',
							},
						]),
					),
				],
			});
		} catch (error) {
			console.log(error);
		}
		return await stepContext.endDialog();
	}
}

module.exports.RechargeDialogue = RechargeDialogue;
