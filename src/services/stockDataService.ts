// example service class, modify if needed, otherwise extend
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { StockDataMapper } from '../mappers/stockDataMapper';
import { IStockDataRepository } from '../repositories/stockRepository';
import { StockData } from '../models/stockData';

export class StockDataService {
  private repository: IStockDataRepository;
  private stockSymbolArray: string[];

  constructor(stockDataRepo: IStockDataRepository) {
    this.repository = stockDataRepo;
    this.stockSymbolArray = ['AMZN', 'AAPL'];
    // this.stockSymbolArray = ['AMZN', 'AAPL', 'MSFT'];
  }

  async fetchStockData(symbol: string): Promise<StockData | null> {
    try {
      const apiKey = process.env.THIRD_PARTY_API_KEY;
      const response = await axios.get(
        `https://api.finazon.io/latest/time_series?dataset=us_stocks_essential&ticker=${symbol}&interval=1m&timezone=America/New_York&order=desc`,
        {
          headers: {
            Authorization: `apikey ${apiKey}`,
          },
        }
      );

      const responseData = response.data.data;
      
      if (!responseData || responseData.length === 0) {
        throw new Error(`No stock data found for symbol: ${symbol}`);
      }

      const latestStockData = responseData[0];
      const stockData = StockDataMapper.toStockData(latestStockData, symbol);

      // if the stock data is more than 2 minutes old, don't save it
      const newyorkTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
      const currentTimestamp = new Date(newyorkTime);
      const timeLimit = 2 * 60 * 1000;
      if (currentTimestamp.getTime() - stockData.timestamp.getTime() > timeLimit) {
        console.log(`[${currentTimestamp.toISOString()}] Stock data for symbol: ${symbol} (timestamp: ${stockData.timestamp.toISOString()}) is more than 2 minutes old. Not saving it.`);
        return null;
      }

      await this.repository.save(stockData);

      return stockData;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            console.error(
              `Error 400: Invalid request parameter, date range, market, or ticker for symbol: ${symbol}. Error message: `,
              error.message
            );
            break;
          case 401:
            console.error(
              `Error 401: Unauthorized access or invalid API key for symbol: ${symbol}. Error message: `,
              error.message
            );
            break;
          case 404:
            console.error(
              `Error 404: Endpoint not found for symbol: ${symbol}. Error message: `,
              error.message
            );
            break;
          case 429:
            console.error(
              `Error 429: API rate limit exceeded for symbol: ${symbol}. Please wait and try again later.. Error message: `,
              error.message
            );
            break;
          case 408:
            console.error(
              `Error 408: Request timeout for symbol: ${symbol}. Please try again later.. Error message: `,
              error.message
            );
            break;
          case 503:
            console.error(
              `Error 503: Data unavailable for symbol: ${symbol}. Please try again later.. Error message: `,
              error.message
            );
            break;
          case 500:
            console.error(
              `Error 500: Internal server error for symbol: ${symbol}. Please try again later.. Error message: `,
              error.message
            );
            break;
          default:
            console.error(
              `Unexpected error fetching stock data for symbol: ${symbol}. Error message: `,
              error.message
            );
        }

        
      } else {
        console.error(
          'Error fetching stock data. The error might not be related to a network or HTTP issue.',
          error
        );
      }
      return null;
    }
  }

  async fetchDataAndStore(): Promise<StockData[]> {
    const newStockData: StockData[] = [];

    for (const symbol of this.stockSymbolArray) {
      const stockData = await this.fetchStockData(symbol);

      if (stockData) {
        newStockData.push(stockData);
      }
    }

    return newStockData;
  }

  async getStockData(
    symbolName: string,
    startDatetimeStr: string,
    endDatetimeStr: string
  ): Promise<StockData[]> {
    var startDatetime = new Date(startDatetimeStr);
    var endDatetime = new Date(endDatetimeStr);

    return this.repository.findBySymbolForPeriod(symbolName, startDatetime, endDatetime);
  }
}
