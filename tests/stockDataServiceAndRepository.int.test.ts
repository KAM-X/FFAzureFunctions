import axios from "axios";
import { StockDataService } from "../src/services/stockDataService";
import { StockDataRepository } from "../src/repositories/stockRepository";
import { StockDataMapper } from "../src/mappers/stockDataMapper";
import { container } from "../src/cosmosClientInstance";
import { StockData } from "../src/models/stockData";

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../src/cosmosClientInstance', () => {
    return {
        container: {
            items: {
                upsert: jest.fn(),
                query: jest.fn().mockImplementation((data) => ({
                    fetchAll: jest.fn(),
                })),
            },
        },
    };
});

jest.mock("../src/mappers/stockDataMapper");

describe('Integration between StockDataService and StockDataRepository', () => {
    let service: StockDataService;
    let repository: StockDataRepository;

    beforeEach(() => {
        jest.clearAllMocks();

        repository = new StockDataRepository(container);
        service = new StockDataService(repository);
    });

    it('Fetches stock data from API and saves it in the database', async () => {
        const symbol = 'AMZN';
        // Arrange
        const fakeStockData = {
            symbol: symbol,
            t: Math.floor(new Date().getTime() / 1000),
            v: 1000,
            o: 100,
            h: 110,
            l: 90,
            c: 105,
        };

        mockAxios.get.mockResolvedValue({ data: { data: [fakeStockData] } });

        (StockDataMapper.toStockData as jest.Mock).mockReturnValue({
            id: '1',
            symbol: fakeStockData.symbol,
            timestamp: new Date(fakeStockData.t * 1000),
            volume: fakeStockData.v,
            open: fakeStockData.o,
            high: fakeStockData.h,
            low: fakeStockData.l,
            close: fakeStockData.c,
        });

        // Act
        const result = await service.fetchStockData('AMZN');

        // Assert
        expect(StockDataMapper.toStockData).toHaveBeenCalledTimes(1);
        expect(container.items.upsert).toHaveBeenCalled();
        expect(result.symbol).toEqual(symbol);
    });

    it('Inserts stock data into database and retrieves it', async () => {

        // Arrange
        const mockStockData: StockData = {
            id: '1',
            symbol: 'AAPL',
            timestamp: new Date('2024-01-01T00:00:00Z'),
            volume: 1500,
            high: 135,
            low: 130,
            close: 132,
            open: 131,
        };

        (StockDataMapper.stockDataToPersistence as jest.Mock).mockReturnValue({
            id: mockStockData.id,
            symbol: mockStockData.symbol,
            timestamp: mockStockData.timestamp.toISOString(),
            volume: mockStockData.volume,
            high: mockStockData.high,
            low: mockStockData.low,
            close: mockStockData.close,
            open: mockStockData.open,
        });

        (container.items.query as jest.Mock).mockImplementation(() => ({
            fetchAll: jest.fn().mockResolvedValue({ resources: [mockStockData] }),
        }));

        (StockDataMapper.persistenceToStockData as jest.Mock).mockImplementation((data) => data);

        const startDate = new Date('2023-12-31');
        const endDate = new Date('2024-01-02');

        // Act
        const retrievedData = await repository.findBySymbolForPeriod('AAPL', startDate, endDate);

        // Assert
        expect(container.items.query).toHaveBeenCalled();
        expect(retrievedData).toEqual(expect.arrayContaining([mockStockData]));
    });

});
