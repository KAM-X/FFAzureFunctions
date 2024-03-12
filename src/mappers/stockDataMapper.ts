// Example of mapper, modify/extend if needed

import { StockData } from "../models/stockData";
import { StockDataDTO } from "../models/stockDataDTO";

export class StockDataMapper {
  public static toStockData(apiResponse: StockDataDTO | any): StockData {
      return {
          id: apiResponse.id || new Date().toISOString(), // Example, adjust based on actual API response
          symbol: apiResponse.symbol,
          price: apiResponse.price,
          timestamp: new Date(apiResponse.timestamp),
      };
  }
}