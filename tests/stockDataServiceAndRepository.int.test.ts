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

});
