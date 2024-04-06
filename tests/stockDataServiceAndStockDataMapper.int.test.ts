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

    it('does not save stock data that is older than 2 minutes', async () => {
        // Arrange
        // Simulate current New York time
        const currentNewYorkTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        const currentDate = new Date(currentNewYorkTime);

        // Simulate stock data timestamp to be 3 minutes before the current New York time
        const oldStockDataTimestamp = new Date(currentDate.getTime() - (3 * 60 * 1000)); // 180,000 milliseconds = 3 minutes

        // Mocked data to simulate response from the API
        const mockData = {
            data: {
                data: [{
                    t: oldStockDataTimestamp.getTime() / 1000, // Convert to seconds since epoch
                    v: 100,
                    h: 105,
                    l: 95,
                    c: 102,
                    o: 100,
                }]
            }
        };

        mockedAxios.get.mockResolvedValue(mockData);

        // Act
        // Attempt to fetch and save the stock data
        const result = await service.fetchStockData('AMZN');

        // Assert
        // Ensure that the stock data is recognized as too old and thus not saved
        expect(result).toBeNull();
        const saveMock = repositoryMock.save as jest.MockedFunction<typeof repositoryMock.save>;
        expect(saveMock).not.toHaveBeenCalled();
    });
});
