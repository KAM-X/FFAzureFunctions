// Example of mapper, modify/extend if needed

import { StockData } from "../models/stockData";
import { StockDataAPI_DTO } from "../models/stockDataAPI_DTO";

export class StockDataMapper {
  public static toStockData(apiResponse: StockDataAPI_DTO, symbol: string, id: number): StockData {
    return {
      id: id.toString() + "-" + symbol,
      timestamp: apiResponse.t,
      volume: apiResponse.v,
      high: apiResponse.h,
      low: apiResponse.l,
      close: apiResponse.c,
      open: apiResponse.o,
    };
  }
}