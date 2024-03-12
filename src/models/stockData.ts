// Example Stock Data model, if needed modify, perhaps for cosmos db storage (might need to be mapped do different object)

export interface StockData {
  id: string; // Unique identifier for Cosmos DB
  symbol: string;
  price: number;
  timestamp: Date;
}