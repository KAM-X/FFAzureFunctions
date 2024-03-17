// example repository class, modify if needed

import { CosmosClient } from "@azure/cosmos";
import { StockData } from "../models/stockData";

const endpoint = "<your-cosmos-db-endpoint>";
const key = "<your-cosmos-db-key>";
const client = new CosmosClient({ endpoint, key });
const database = client.database("YourDatabase");
const container = database.container("StockData");

export interface IStockDataRepository {
    save(stockData: StockData): Promise<void>;
}

export class StockDataRepository implements IStockDataRepository {
    public async save(stockData: StockData): Promise<void> {
        try {
            await container.items.create(stockData);
        } catch (error) {
            console.error("Error saving stock data:", error);
        }
    }
}
