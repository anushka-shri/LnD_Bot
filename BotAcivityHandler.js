const {AcivityHandler, CardFactory, ActivityHandler} = require('botbuilder')


class BotActivityHandler extends ActivityHandler {
    constructor(userState,conversationState, rootDialog)
    {
        super();
		if (!conversationState) throw new Error("Conversation state required.")
		if (!userState) throw new Error('User state required.');
        
		this.conversationState = conversationState;
		this.userState = userState;
        this.rootDialog = rootDialog;
        this.accessor = this.conversationState.createProperty('DialogAccessor');
        this.onMessage(async (context, next) =>{
            await this.rootDialog.run(context, this.accessor);
            await next();
        });

        //event is triggereed when member is also user and 
        // to send card we use partial activity as a context
        this.onConversationUpdate(async(context, next) =>{
           
            if(context.activity.membersAdded && context.activity.membersAdded[1].id == context.activity.from.id){
                await context.sendActivity({
									attachments: [
										CardFactory.adaptiveCard({
											type: 'AdaptiveCard',
											$schema:
												'http://adaptivecards.io/schemas/adaptive-card.json',
											version: '1.3',
											body: [
												{
													type: 'Container',
												},
												{
													type: 'Image',
													url: 'https://codecrush.unomaha.edu/img/robby-wave-800x600.gif',
												},
												{
													type: 'TextBlock',
													text: "Welcome User! I'm your assisstant.",
													wrap: true,
													size: 'Medium',
													weight: 'Bolder',
													color: 'Accent',
												},
											],
										}),
									],
								});
               
                await context.sendActivity({
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
            await next();
            
        });
    }

    //to trigger above we event we have to pass method to this class run method

    async run(context) {
        await super.run(context);
		await this.conversationState.saveChanges(context, false);
		await this.userState.saveChanges(context, false);
    }
}

module.exports.BotActivityHandler = BotActivityHandler;