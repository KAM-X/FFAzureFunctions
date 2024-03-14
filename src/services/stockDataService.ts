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

  // async giveDataForStock(stockReqDTO: any): Promise<any> {
  //   try {
  //     // get data from repo
  //     // return await this.repository.getDataForStock(stockReqDTO);
  //   }
  //   catch (error) {
  //     console.error("Error getting stock data:", error);
  //     // Handle error appropriately
  //   }
  // }
  // Inside stockDataService
  async getStockData(symbolName: string, startDatetime: string, endDatetime: string): Promise<StockData> {
    // Implement logic to retrieve and process stock data

    return {
      id: 'kok',
      timestamp: 12,
      volume: 12,
      high: 12,
      low: 12,
      close: 12,
      open: 12
    };
  }
}
