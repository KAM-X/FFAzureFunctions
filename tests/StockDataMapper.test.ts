import { StockDataMapper } from '../src/mappers/stockDataMapper';
import { StockDataAPI_DTO } from '../src/models/stockDataAPI_DTO';
import { StockData } from '../src/models/stockData';
import { StockDataPersistence } from '../src/persistence/stockDataPersistence';

describe('StockDataMapper', () => {
  describe('toStockData', () => {
    it('should map API response to StockData', () => {
      const apiResponse: StockDataAPI_DTO = {
        t: 1617600000, // Sample timestamp
        v: 1000,
        h: 150,
        l: 100,
        c: 120,
        o: 130,
      };

      const symbol = 'AAPL';
      const expectedStockData: StockData = {
        id: expect.any(String),
        symbol: 'AAPL',
        timestamp: new Date(1617600000 * 1000),
        volume: 1000,
        high: 150,
        low: 100,
        close: 120,
        open: 130,
      };

      const result = StockDataMapper.toStockData(apiResponse, symbol);

      expect(result).toEqual(expectedStockData);
    });
  });

  describe('persistenceToStockData', () => {
    it('should map persistence data to StockData', () => {
      const persistenceData: StockDataPersistence = {
        id: '1',
        symbol: 'AAPL',
        timestamp: new Date().toISOString(),
        volume: 1000,
        high: 150,
        low: 100,
        close: 120,
        open: 130,
      };

      const expectedStockData: StockData = {
        id: '1',
        symbol: 'AAPL',
        timestamp: new Date(persistenceData.timestamp),
        volume: 1000,
        high: 150,
        low: 100,
        close: 120,
        open: 130,
      };

      const result = StockDataMapper.persistenceToStockData(persistenceData);

      expect(result).toEqual(expectedStockData);
    });
  });

  describe('stockDataToPersistence', () => {
    it('should map StockData to persistence data', () => {
      const stockData: StockData = {
        id: '1',
        symbol: 'AAPL',
        timestamp: new Date(),
        volume: 1000,
        high: 150,
        low: 100,
        close: 120,
        open: 130,
      };

      const expectedPersistenceData: StockDataPersistence = {
        id: '1',
        symbol: 'AAPL',
        timestamp: stockData.timestamp.toISOString(),
        volume: 1000,
        high: 150,
        low: 100,
        close: 120,
        open: 130,
      };

      const result = StockDataMapper.stockDataToPersistence(stockData);

      expect(result).toEqual(expectedPersistenceData);
    });
  });
});
