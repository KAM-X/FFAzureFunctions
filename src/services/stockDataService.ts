// example service class, modify if needed, otherwise extend
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { StockDataMapper } from "../mappers/stockDataMapper";
import { IStockDataRepository } from "../repositories/stockRepository";
import { StockData } from '../models/stockData';

export class StockDataService {
  private repository: IStockDataRepository;

  constructor(stockDataRepo: IStockDataRepository) {
    this.repository = stockDataRepo;
  }


  async fetchDataAndStore(): Promise<void> {
    try {
      const response = await axios.get("https://api.thirdparty.com/stock/data");
      const responseData = response.data;
      const stockSymbol = "AMZN";
      const uniqueId: string = uuidv4();
      const stockData = StockDataMapper.toStockData(responseData, stockSymbol, uniqueId);

      await this.repository.save(stockData);
    } catch (error) {
      console.error("Error fetching and storing stock data:", error);
      // Handle error appropriately
    }
  }

  async getStockData(symbolName: string, startDatetimeStr: string, endDatetimeStr: string): Promise<StockData[]> {
    var startDatetime = new Date(startDatetimeStr);
    var endDatetime = new Date(endDatetimeStr);

    return this.repository.findBySymbolForPeriod(symbolName, startDatetime, endDatetime);
  }
}
