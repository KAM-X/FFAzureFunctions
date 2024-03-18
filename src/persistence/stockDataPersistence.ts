export interface StockDataPersistence {
    id: string;
    symbol: string;
    timestamp: string;
    volume: number;
    high: number;
    low: number;
    close: number;
    open: number;
}