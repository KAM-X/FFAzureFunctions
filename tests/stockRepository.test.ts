import { StockDataRepository } from '../src/repositories/stockRepository';
import { Container } from '@azure/cosmos';
import { mockDeep } from 'jest-mock-extended';
import { StockDataMapper } from '../src/mappers/stockDataMapper';

jest.mock('../src/mappers/stockDataMapper', () => ({
  StockDataMapper: {
    stockDataToPersistence: jest.fn().mockReturnValue({
      id: 'mock-id',
      symbol: 'TEST',
      timestamp: '2023-04-03T12:00:00.000Z',
      volume: 1000,
      high: 10.5,
      low: 9.8,
      close: 10.2,
      open: 10.0,
    }),
    persistenceToStockData: jest.fn().mockReturnValue({
      id: 'mock-id',
      symbol: 'TEST',
      timestamp: new Date('2023-04-03T12:00:00Z'),
      volume: 1000,
      high: 10.5,
      low: 9.8,
      close: 10.2,
      open: 10.0,
    })
  }
}));

describe('StockDataRepository', () => {
    let containerMock: Container;
    let stockDataRepository: StockDataRepository;
    let consoleErrorSpy: jest.SpyInstance;
  
    beforeAll(() => {

      containerMock = mockDeep<Container>();
      stockDataRepository = new StockDataRepository(containerMock);
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  
    afterAll(() => {
      consoleErrorSpy.mockRestore();
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
    });

  describe('save', () => {
    it('should upsert stock data successfully', async () => {
      const stockData = {
        id: 'mock-id',
        symbol: 'TEST',
        timestamp: new Date('2023-04-03T12:00:00Z'),
        volume: 1000,
        high: 10.5,
        low: 9.8,
        close: 10.2,
        open: 10.0,
      };

      await stockDataRepository.save(stockData);

      expect(containerMock.items.upsert).toHaveBeenCalledWith({
        id: 'mock-id',
        symbol: 'TEST',
        timestamp: '2023-04-03T12:00:00.000Z',
        volume: 1000,
        high: 10.5,
        low: 9.8,
        close: 10.2,
        open: 10.0,
      });
      expect(StockDataMapper.stockDataToPersistence).toHaveBeenCalledWith(stockData);
    });

    it('should log an error if saving stock data fails', async () => {
        // Arrange
        const error = new Error('Test Error');
        containerMock.items.upsert = jest.fn().mockRejectedValueOnce(error);
  
        // Act
        await stockDataRepository.save({} as any);
  
        // Assess
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error saving stock data:", error);
      });
  });

  describe('getRealTimeData', () => {
    it('should retrieve real-time data for a given symbol', async () => {
      const symbol = 'TEST';
      const mockResponse = {
        resources: [{
          id: 'mock-id',
          symbol: 'TEST',
          timestamp: '2023-04-03T12:00:00.000Z',
          volume: 1000,
          high: 10.5,
          low: 9.8,
          close: 10.2,
          open: 10.0,
        }],
      };

      containerMock.items.query = jest.fn().mockReturnValue({
        fetchAll: jest.fn().mockResolvedValue(mockResponse),
      });
      

      const result = await stockDataRepository.getRealTimeData(symbol);

      expect(containerMock.items.query).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'mock-id',
        symbol: 'TEST',
        timestamp: new Date('2023-04-03T12:00:00Z'),
        volume: 1000,
        high: 10.5,
        low: 9.8,
        close: 10.2,
        open: 10.0,
      });
      expect(StockDataMapper.persistenceToStockData).toHaveBeenCalledWith(mockResponse.resources[0]);
    });

    it('should log an error if querying real-time data fails', async () => {
        // Arrange
        const error = new Error('Query Error');
        containerMock.items.query = jest.fn().mockImplementationOnce(() => {
          throw error;
        });
  
        // Act
        await stockDataRepository.getRealTimeData('TEST');
  
        // Assess
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error querying items:", error.message);
      });
  });
});

