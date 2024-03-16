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
      // Adjusted to a hypothetical endpoint that takes a symbol
      const baseUrl = "https://api.finazon.io/latest/time_series?dataset=sip_non_pro&ticker=" + symbol + "&interval=1m";
      const urlAPIKey = "?apikey=" + process.env.API_KEY;
      const fullUrl = baseUrl + urlAPIKey;

      const response = await axios.get(fullUrl);
      const responseData = response.data;
      const uniqueId: string = uuidv4();
      const stockData = StockDataMapper.toStockData(responseData, symbol, uniqueId);

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
