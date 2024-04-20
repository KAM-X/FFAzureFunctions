import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cacheInstance as cache } from "../stockDataResponseCacheInstance";

export async function ClearCache(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    cache.clear();

    return { body: 'Cache cleared' };
};

app.http('clearCache', {
    route: 'v1/cache/h34uit34aAhuieHUIFiu3h33s',
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: ClearCache
});
