// Example of mapper, modify/extend if needed

import { StockData } from "../models/stockData";
import { StockDataAPI_DTO } from "../models/stockDataAPI_DTO";

export class StockDataMapper {
  public static toStockData(apiResponse: StockDataAPI_DTO, symbol: string, id: string): StockData {
    return {
      id: symbol + "-" + id.toString(),
      symbol: symbol,
      timestamp: apiResponse.t,
      volume: apiResponse.v,
      high: apiResponse.h,
      low: apiResponse.l,
      close: apiResponse.c,
      open: apiResponse.o,
    };
  }

  public static persistenceToStockData(persistenceData: any): StockData {
    return {
      id: persistenceData.id,
      symbol: persistenceData.symbol,
      timestamp: persistenceData.timestamp,
      volume: persistenceData.volume,
      high: persistenceData.high,
      low: persistenceData.low,
      close: persistenceData.close,
      open: persistenceData.apiResponse,
    };
  }
}