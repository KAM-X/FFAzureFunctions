import { HttpRequest, HttpRequestParams } from "@azure/functions";
import { StockDataRepository } from "../src/repositories/stockRepository";
import { StockDataService } from "../src/services/stockDataService";
import {  mock, mockReset   } from 'jest-mock-extended';
import { FFRetrievalFunction } from "../src/functions/FFRetrievalFunction";
import { StockData } from "../src/models/stockData";
import axios from "axios";
import { StockDataAPI_DTO } from "../src/models/stockDataAPI_DTO";

// External dependency mocks
const mockRepository = mock<StockDataRepository>();
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock the container import (used in repository)
jest.mock("../src/cosmosClientInstance", () => ({
  container: jest.fn()
}));

// Mock the entire modules for repository to replace the actual implementation with mock
jest.mock("../src/repositories/stockRepository", () => ({
  StockDataRepository: function () {
    return mockRepository;
  }
}));

beforeEach(() => {
  mockReset(mockRepository);
});

describe("FFRetrievalFunction and StockDataService tests", () => {
  it('fetches and saves stock data successfully', async () => {
    // Arrange
    const stockDataService = new StockDataService(mockRepository);
    const timestamp = new Date();
    const fakeStockData: StockData = {
      id: `AAPL-${timestamp.toISOString()}`,
      symbol: 'AAPL',
      timestamp: timestamp,
      volume: 100,
      high: 10,
      low: 5,
      close: 8,
      open: 6,
    };
    const fakeStockDataFromAPI: StockDataAPI_DTO = {
      t: timestamp.getTime() / 1000, // current timestamp in seconds
      v: 100,
      h: 10,
      l: 5,
      c: 8,
      o: 6,
    };
    const fakeResponse = { data: { data: [fakeStockDataFromAPI] } };
    mockAxios.get.mockResolvedValue(fakeResponse);

    // Act
    await stockDataService.fetchStockData('AAPL');

    // Assert
    expect(mockRepository.save).toHaveBeenCalledWith(fakeStockData);
  });

});