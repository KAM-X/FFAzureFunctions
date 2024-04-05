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
});
