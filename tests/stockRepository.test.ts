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
