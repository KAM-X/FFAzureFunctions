import { StockDataRepository } from '../src/repositories/stockRepository';
import { ClientContext, Container, FeedResponse } from '@azure/cosmos';
import { StockData } from '../src/models/stockData';
import { StockDataMapper } from '../src/mappers/stockDataMapper';
import { database } from '../src/cosmosClientInstance';

jest.mock("@azure/cosmos");

describe('StockDataRepository Integration Tests', () => {
    let containerMock: jest.Mocked<Container>;
    let stockDataRepository: StockDataRepository;
  
    beforeEach(() => {
      containerMock = {
        items: {
          upsert: jest.fn(),
          query: jest.fn().mockReturnThis(), // Mock the query method to return 'this'
        },
        fetchAll: jest.fn(), // Add a mock for the fetchAll method
      } as any;
  
      stockDataRepository = new StockDataRepository(containerMock);
    });
  
    describe('save', () => {
      it('should save stock data to the database', async () => {
        const stockData: StockData = {
          id: 'some-id',
          symbol: 'some-symbol',
          timestamp: new Date(),
          volume: 123456,
          high: 123.45,
          low: 123.45,
          close: 123.45,
          open: 123.45
      };
        //...
      });
    });
});