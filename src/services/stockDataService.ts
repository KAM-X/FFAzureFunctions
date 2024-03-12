// example service class, modify if needed, otherwise extend

import axios from "axios";
import { StockDataMapper } from "../mappers/stockDataMapper";
import { IStockDataRepository } from "../repositories/stockRepository";

export class StockDataService {
    private repository: IStockDataRepository;

    constructor(stockDataRepo: IStockDataRepository) {
        this.repository = stockDataRepo;
    }

    async fetchDataAndStore(): Promise<void> {
        try {
            const response = await axios.get("https://api.thirdparty.com/stock/data");
            const stockData = StockDataMapper.toStockData(response.data);
            await this.repository.save(stockData);
        } catch (error) {
            console.error("Error fetching and storing stock data:", error);
            // Handle error appropriately
        }
    }

    async giveDataForStock(stockReqDTO: any): Promise<any> {
      try {
        // get data from repo
        // return await this.repository.getDataForStock(stockReqDTO);
      }
      catch (error) {
        console.error("Error getting stock data:", error);
        // Handle error appropriately
      }
    }
}
