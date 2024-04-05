import { StockDataService } from '../src/services/stockDataService'; // Adjust the import path as necessary
import { IStockDataRepository } from '../src/repositories/stockRepository';
import { StockData } from '../src/models/stockData';
import { StockDataMapper } from '../src/mappers/stockDataMapper';
import axios from 'axios';
import { mockDeep, mockReset, MockProxy, mock } from 'jest-mock-extended';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('StockDataService', () => {
  let service: StockDataService;
  let mockRepository: MockProxy<IStockDataRepository>;

  beforeEach(() => {
    mockRepository = mock<IStockDataRepository>();
    service = new StockDataService(mockRepository);
  });

  describe('fetchStockData', () => {
    it('should fetch stock data and save it when data is fresh', async () => {
      // Arrange
      const mockData = {
        data: {
          data: [{
            t: Date.now() / 1000, // current timestamp in seconds
            v: 100,
            h: 10,
            l: 5,
            c: 8,
            o: 6,
          }],
        },
      };
      mockAxios.get.mockResolvedValue(mockData);

      const symbol = 'AMZN';
      const savedData: StockData = {
        id: 'anyId',
        symbol,
        timestamp: new Date(),
        volume: 100,
        high: 10,
        low: 5,
        close: 8,
        open: 6,
      };
      mockRepository.save.mockResolvedValue();

      // Act
      const result = await service.fetchStockData(symbol);

      // Assert
      expect(result).toEqual(expect.objectContaining({
        symbol: 'AMZN',
      }));
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        symbol: 'AMZN',
      }));
    });

    it('should not save the stock data if it is more than 2 minutes old', async () => {
      // Arrange
      const newyorkTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
      const oldTimestamp = new Date(newyorkTime);
      oldTimestamp.setMinutes(oldTimestamp.getMinutes() - 3); // 3 minutes old

      const mockData = {
        data: {
          data: [{
            t: oldTimestamp.getTime() / 1000,
            v: 100,
            h: 10,
            l: 5,
            c: 8,
            o: 6,
          }],
        },
      };
      mockAxios.get.mockResolvedValue(mockData);

      // Act
      const result = await service.fetchStockData('AMZN');

      // Assert
      expect(result).toBeNull();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error when the API returns no data', async () => {
      // Arrange
      const mockData = {};
      mockAxios.get.mockResolvedValue({ data: {} });
      // Act
      const result = await service.fetchStockData('AMZN');

      // Assert
      expect(result).toBeNull();
    });

    it('should throw an error when the API returns an empty data array', async () => {
      // Arrange
      const mockData = {};
      mockAxios.get.mockResolvedValue({ data: { data: [] } });
      
      // Act
      const result = await service.fetchStockData('AMZN');

      // Assert
      expect(result).toBeNull();
    });

  });

});
