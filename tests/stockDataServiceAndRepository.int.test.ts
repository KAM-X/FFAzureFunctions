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
});
