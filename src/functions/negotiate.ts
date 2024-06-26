import { app, input } from "@azure/functions";


const connection = input.generic({
    type: 'webPubSubConnection',
    name: 'connection',
    hub: 'ffhub'
});

app.http('negotiate', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [connection],
    handler: async (request, context) => {
        return { body: JSON.stringify(context.extraInputs.get('connection')) };
    },
});
