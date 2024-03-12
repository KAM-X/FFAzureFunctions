// Example Data from 3rd party API, should be mapped to stockData Model with a mapper

export interface StockDataDTO {
  id: string;
  symbol: string;
  price: number;
  timestamp: Date;
}