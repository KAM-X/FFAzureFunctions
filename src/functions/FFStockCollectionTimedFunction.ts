import { app, InvocationContext, Timer, output } from "@azure/functions";
import { container } from "../cosmosClientInstance";
import { StockDataRepository } from "../repositories/stockRepository";
import { StockDataService } from "../services/stockDataService";

const wpsAction = output.generic({
    type: 'webPubSub',
    name: 'action',
    hub: 'ffhub'
});

export async function FFStockCollectionTimedFunction(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('WS Timer function processed request.');

    const stockRepository = new StockDataRepository(container);
    const stockDataService = new StockDataService(stockRepository);

    const newStockDataList = await stockDataService.fetchDataAndStore();
    const responseDataJSON = JSON.stringify(newStockDataList);

    context.extraOutputs.set(wpsAction, {
        actionName: 'sendToAll',
        data: responseDataJSON,
        dataType: 'text',
    });
}

app.timer('FFStockCollectionTimedFunction', {
    schedule: '0 */1 * * * *',
    extraOutputs: [wpsAction],
    handler: FFStockCollectionTimedFunction
});
