// Example Stock Data model, if needed modify, perhaps for cosmos db storage (might need to be mapped do different object)

export interface StockData {
  id: string;
  timestamp: number;
  volume: number;
  high: number;
  low: number;
  close: number;
  open: number;
}