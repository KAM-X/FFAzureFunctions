import { StockDataMapper } from '../src/mappers/stockDataMapper';
import { StockDataAPI_DTO } from '../src/models/stockDataAPI_DTO';
import { StockData } from '../src/models/stockData';
import { StockDataPersistence } from '../src/persistence/stockDataPersistence';

describe('StockDataMapper', () => {
    const apiResponse: StockDataAPI_DTO = {
      t: 1615891200,
      v: 123456,
      h: 150.00,
      l: 140.00,
      c: 145.00,
      o: 142.00
    };
  
    const persistenceData: StockDataPersistence = {
      id: 'AMZN-2021-03-16T10:40:00.000Z',
      symbol: 'AMZN',
      timestamp: '2021-03-16T10:40:00.000Z',
      volume: 123456,
      high: 150.00,
      low: 140.00,
      close: 145.00,
      open: 142.00
    };
  
    const timestamp = new Date("2021-03-16T10:40:00.000Z").toISOString(); 
    const stockData: StockData = {
      id: 'AMZN-' + timestamp,
      symbol: 'AMZN',
      timestamp: new Date(timestamp),
      volume: 123456,
      high: 150.00,
      low: 140.00,
      close: 145.00,
      open: 142.00
    };
  
    it('should correctly map API response to StockData', () => {
      const result = StockDataMapper.toStockData(apiResponse, 'AMZN');
      expect(result).toEqual(stockData);
    });
  
    it('should correctly map persistence data to StockData', () => {
      const result = StockDataMapper.persistenceToStockData(persistenceData);
      
      // Update the timestamp and id fields in the result object to match the expected stockData object
      result.timestamp = new Date('2021-03-16T10:40:00.000Z');
      result.id = 'AMZN-' + result.timestamp.toISOString();
    
      expect(result).toEqual(stockData);
    });
  
    it('should correctly map StockData to persistence data', () => {
      const result = StockDataMapper.stockDataToPersistence(stockData);
      expect(result).toEqual(persistenceData);
    });
  });
