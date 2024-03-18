import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import { container } from "../cosmosClientInstance";
import { StockDataRepository } from "../repositories/stockRepository";
import { StockDataService } from "../services/stockDataService";

const wpsAction = output.generic({
    type: 'webPubSub',
    name: 'action',
    hub: 'ffhub'
});


export async function httpTriggerNotificationFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const stockDataRepository = new StockDataRepository(container);
    const stockDataService = new StockDataService(stockDataRepository);

    const symbolName = request.params['symbolName'] || 'AAPL';
    const currentDate = new Date();
    const defaultStartDatetime = new Date(currentDate.setMonth(currentDate.getMonth() - 1)).toISOString();
    const defaultEndDatetime = new Date().toISOString();

    const stockData = await stockDataService.getStockData(symbolName, defaultStartDatetime, defaultEndDatetime);
    const stockDataFirst = stockData[0];
    const responseDataJSON = JSON.stringify(stockDataFirst);

    context.extraOutputs.set(wpsAction, {
        actionName: 'sendToAll',
        data: responseDataJSON,
        dataType: 'text',
    });

    return { body: `Triggered notif with stock data` };
};

app.http('httpTriggerNotificationFunction', {
    methods: ['GET', 'POST'],
    extraOutputs: [wpsAction],
    authLevel: 'anonymous',
    handler: httpTriggerNotificationFunction
});

// function getValue(baseNum, floatNum) {
//     return (baseNum + 2 * floatNum * (Math.random() - 0.5)).toFixed(3);
// }