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
    it('correctly integrates fetchStockData with StockDataMapper and saves using repository, validating symbol and timestamp', async () => {
        // Arrange: Set up mocked data and response
        const mockData = { t: Date.now() / 1000 - 60, o: 100, h: 105, l: 95, c: 102, v: 1200 };
        mockedAxios.get.mockResolvedValue({
            data: {
                data: [mockData]
            }
        });

        // Act: Call the function under test
        await service.fetchStockData('AMZN');

        // Assert: Validate that repository.save was called correctly
        const saveMock = repositoryMock.save as jest.MockedFunction<typeof repositoryMock.save>;
        expect(saveMock).toHaveBeenCalledTimes(1);
        const savedStockData: StockData = saveMock.mock.calls[0][0];

        // Validate symbol
        expect(savedStockData.symbol).toEqual('AMZN');

        // Validate timestamp and other properties
        const expectedTimestamp = new Date(mockData.t * 1000);
        expect(savedStockData.timestamp).toEqual(expectedTimestamp);
        expect(savedStockData.open).toEqual(100);
        expect(savedStockData.high).toEqual(105);
        expect(savedStockData.low).toEqual(95);
        expect(savedStockData.close).toEqual(102);
        expect(savedStockData.volume).toEqual(1200);
    });
});
