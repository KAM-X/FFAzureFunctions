import { StockData } from "../models/stockData";
import { StockDataAPI_DTO } from "../models/stockDataAPI_DTO";
import { StockDataPersistence } from "../persistence/stockDataPersistence";

export class StockDataMapper {
  public static toStockData(apiResponse: StockDataAPI_DTO, symbol: string, id?: string): StockData {
    const timestamp = new Date(apiResponse.t * 1000);
    const stockDataID = id || (symbol + "-" + timestamp.toISOString());

    return {
      timestamp: timestamp,
      id: stockDataID,
      symbol: symbol,
      volume: apiResponse.v,
      high: apiResponse.h,
      low: apiResponse.l,
      close: apiResponse.c,
      open: apiResponse.o,
    };
  }

  public static persistenceToStockData(persistenceData: StockDataPersistence): StockData {
    return {
      timestamp: new Date(persistenceData.timestamp),
      id: persistenceData.id,
      symbol: persistenceData.symbol,
      volume: persistenceData.volume,
      high: persistenceData.high,
      low: persistenceData.low,
      close: persistenceData.close,
      open: persistenceData.open,
    };
  }

  public static stockDataToPersistence(stockData: StockData): StockDataPersistence {
    return {
      timestamp: stockData.timestamp.toISOString(),
      id: stockData.id,
      symbol: stockData.symbol,
      volume: stockData.volume,
      high: stockData.high,
      low: stockData.low,
      close: stockData.close,
      open: stockData.open,
    };
  }
}