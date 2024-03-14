import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function FFRetrievalFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // const stockDataService = new StockDataService(new StockRepository(), new StockDataMapper());

    if (request.method === 'GET') {
        // Extract symbolName, startDatetime, and endDatetime from the URL
        const symbolName = request.params['symbolName'];
        const startDatetime = request.query.get('startDatetime');
        const endDatetime = request.query.get('endDatetime');

        if (!symbolName || !startDatetime || !endDatetime) {
            return { status: 400, body: "Missing required parameters" };
        }

        try {
            // const stockData = await stockDataService.getStockData(symbolName, startDatetime, endDatetime);
            const stockData = symbolName + " " + startDatetime + " " + endDatetime;
            return { status: 200, body: stockData };
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
