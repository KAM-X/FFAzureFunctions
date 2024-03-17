import { app } from "@azure/functions";

const { readFile } = require('fs/promises');

app.http('index', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (context: any) => {
        const content = await readFile('src/index.html', 'utf8', (err, data) => {
            if (err) {
                context.err(err)
                return
            }
        });

        return { 
            status: 200,
            headers: { 
                'Content-Type': 'text/html'
            }, 
            body: content, 
        };
    }
});