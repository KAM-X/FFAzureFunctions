// example service class, modify if needed, otherwise extend
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { StockDataMapper } from "../mappers/stockDataMapper";
import { IStockDataRepository } from "../repositories/stockRepository";
import { StockData } from '../models/stockData';

export class StockDataService {
  private repository: IStockDataRepository;
  private stockSymbolArray: string[];

  constructor(stockDataRepo: IStockDataRepository) {
    this.repository = stockDataRepo;
    this.stockSymbolArray = ["AMZN", "AAPL", "MSFT"];
  }

  async fetchStockData(symbol: string): Promise<void> {
    try {
      const apiKey = process.env.THIRD_PARTY_API_KEY;
      const response = await axios.get(`https://api.finazon.io/latest/time_series?dataset=us_stocks_essential&ticker=${symbol}&interval=1m&order=desc`, {
        headers: {
          'Authorization': `apiKey ${apiKey}`
        }
      });

      const responseData = response.data;
      const uniqueId: string = uuidv4();
      const stockData = StockDataMapper.toStockData(responseData[0], symbol, uniqueId);

      await this.repository.save(stockData);
    } catch (error) {

      if (error.response) {
        console.error("Error fetching stock data for symbol:", symbol, error);
      }
    }
  }

  async fetchDataAndStore(): Promise<void> {
    for (const symbol of this.stockSymbolArray) {
      await this.fetchStockData(symbol);
    }
  }

  async getStockData(symbolName: string, startDatetimeStr: string, endDatetimeStr: string): Promise<StockData[]> {
    var startDatetime = new Date(startDatetimeStr);
    var endDatetime = new Date(endDatetimeStr);

    return this.repository.findBySymbolForPeriod(symbolName, startDatetime, endDatetime);
  }
}
