// example repository class, modify if needed

import { Container } from "@azure/cosmos";
import { StockData } from "../models/stockData";
import { StockDataMapper } from "../mappers/stockDataMapper";

export interface IStockDataRepository {
    save(stockData: StockData): Promise<void>;
    getRealTimeData(symbol: string): Promise<StockData>;
    findBySymbolForPeriod(symbol: string, startDate: Date, endDate: Date): Promise<StockData[]>;
}

export class StockDataRepository implements IStockDataRepository {
    private container: Container;

    constructor(container: Container) {
        this.container = container;
    }

    public async save(stockData: StockData): Promise<void> {
        await this.container.items.create(stockData);
    }

    public async getRealTimeData(symbol: string): Promise<StockData> {
        const querySpec = {
            query: "SELECT TOP 1 * FROM c WHERE c.symbol = @symbol ORDER BY c.timestamp DESC",
            parameters: [
                {
                    name: "@symbol",
                    value: symbol
                }
            ]
        };
        
        try {
            const { resources: items } = await this.container.items.query(querySpec).fetchAll();
            const data = StockDataMapper.persistenceToStockData(items[0]);
            return data;
        } catch (error) {
            console.error("Error querying items:", error.message);
        }
    }
    
    public async findBySymbolForPeriod(symbol: string, startDate: Date, endDate: Date): Promise<StockData[]> {
        const querySpec = {
            query: "SELECT * FROM c WHERE c.timestamp >= @startTimestamp AND c.timestamp <= @endTimestamp AND c.symbol = @symbol ORDER BY c.timestamp DESC",
            parameters: [
                {
                    name: "@startTimestamp",
                    value: startDate.toISOString(),
                },
                {
                    name: "@endTimestamp",
                    value: endDate.toISOString(),
                },
                {
                    name: "@symbol",
                    value: symbol,
                },
            ],
        };
        
        try {
            const { resources: items } = await this.container.items.query(querySpec).fetchAll();
            const data = items.map((item) => StockDataMapper.persistenceToStockData(item));
            return data;
        } catch (error) {
            console.error("Error querying items:", error.message);
        }
    }
}