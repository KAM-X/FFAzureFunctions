import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TestMessage } from "../models/testMessage";
import { MsgService } from "../services/msgService";
import { FakeMessageRepository } from "../repositories/exampleFakeRepo";

export async function FFRetrievalFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const msgRepository = new FakeMessageRepository();
    const msgService = new MsgService(msgRepository);

    // const name = request.query.get('name') || await request.text() || 'world';


    // const message: TestMessage = { name, message: 'Hello, ' + name + '!!!!!!!!!!!!!!!' };

    // return { body: message.message };

    // if method post 
    if (request.method === 'POST') {
        const message: TestMessage = { name: 'John' + Math.random().toString(), message: 'Numbaaaa!' };
        await msgService.saveMsg(message);
    }
    
    const messages = await msgService.getAllMsgs();
    const responseBody = messages.map(m => `${m.name} - ${m.message}`).join('\n');
    // return { body: messages.map(m => m.message).join('\n')};
    return { body: responseBody + '\n\nsucky ducky = ' + messages.length };
};

app.http('FFRetrievalFunction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: FFRetrievalFunction
});
