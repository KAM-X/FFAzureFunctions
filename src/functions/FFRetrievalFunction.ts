import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { StockDataService } from "../services/stockDataService";
import { StockDataRepository } from "../repositories/stockRepository";
import { container } from "../cosmosClientInstance";
import { cacheInstance as cache} from "../stockDataResponseCacheInstance";

export async function FFRetrievalFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const stockRepository = new StockDataRepository(container);
    const stockDataService = new StockDataService(stockRepository);


    if (request.method === 'GET') {
        const symbolName = request.params['symbolName'];
        const startDatetime = request.query.get('startDatetime');
        const endDatetime = request.query.get('endDatetime');

        if (!symbolName || !startDatetime || !endDatetime) {
            return { status: 400, body: "Missing required parameters" };
        }

        const cacheKey = `${symbolName}-${startDatetime}-${endDatetime}`;

        const cachedResponse = await cache.get(cacheKey);
        if (cachedResponse) {
            return { status: 200, body: cachedResponse, headers: { 'X-Cache': 'hit' } };
        }

        try {
            const stockData = await stockDataService.getStockData(symbolName, startDatetime, endDatetime);
            const responseBody = JSON.stringify(stockData);

            await cache.set(cacheKey, responseBody);

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
