import axios from 'axios';
import { StockDataService } from '../src/services/stockDataService';
import { IStockDataRepository } from '../src/repositories/stockRepository';
import { mockDeep } from 'jest-mock-extended';
import { StockData } from '../src/models/stockData';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('StockDataService Integration', () => {
    let repositoryMock: IStockDataRepository;
    let service: StockDataService;

    beforeEach(() => {
        repositoryMock = mockDeep<IStockDataRepository>();
        service = new StockDataService(repositoryMock);
        jest.clearAllMocks();
    });
});
