import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { StockDataService } from "../services/stockDataService";
import { IStockDataRepository, StockDataRepository } from "../repositories/stockRepository";

import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });
const databaseName = process.env.DATABASE_NAME;
const containerName = process.env.CONTAINER_NAME;;
const database = client.database(databaseName);
const container = database.container(containerName);
const stockRepository = new StockDataRepository(container);


export async function FFRetrievalFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const stockDataService = new StockDataService(stockRepository);


    if (request.method === 'GET') {
        const symbolName = request.params['symbolName'];
        const startDatetime = request.query.get('startDatetime');
        const endDatetime = request.query.get('endDatetime');

        if (!symbolName || !startDatetime || !endDatetime) {
            return { status: 400, body: "Missing required parameters" };
        }

        try {
            const stockData = await stockDataService.getStockData(symbolName, startDatetime, endDatetime);
            const responseBody = JSON.stringify(stockData);

            return { status: 200, body: responseBody };
        } catch (error) {
            return { status: 500, body: `Error retrieving stock data: ${error.message}` };
        }
    }
    return { status: 400, body: "Bad request" };
};

app.http('FFRetrievalFunction', {
    route: 'v1/stock/{symbolName}',
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: FFRetrievalFunction
});
