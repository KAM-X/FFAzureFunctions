export interface StockData {
  id: string;
  symbol: string;
  timestamp: Date;
  volume: number;
  high: number;
  low: number;
  close: number;
  open: number;
}