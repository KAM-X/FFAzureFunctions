import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { StockDataRepository } from "../src/repositories/stockRepository";
import { StockDataService } from "../src/services/stockDataService";
import {  mockDeep, mockReset, mock   } from 'jest-mock-extended';
import { FFRetrievalFunction } from "../src/functions/FFRetrievalFunction";
import { container } from "../src/cosmosClientInstance";
import { CacheService } from "../src/services/cache";

// External dependency mocks
const mockStockDataRepository = mockDeep<StockDataRepository>();
const mockStockDataService = mockDeep<StockDataService>();

// Mock the container import (used in repository)
jest.mock("../src/cosmosClientInstance", () => ({
  container: jest.fn()
}));

jest.mock("../src/stockDataResponseCacheInstance", () => ({
  cacheInstance: {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn()
  }
}));

// Mock the entire modules for repository and service to replace the actual implementations with mocks
jest.mock("../src/repositories/stockRepository", () => ({
  StockDataRepository: function () {
    return mockStockDataRepository;
  }
}));

jest.mock("../src/services/stockDataService", () => ({
  StockDataService: function () {
    return mockStockDataService;
  }
}));

beforeEach(() => {
  // Reset mocks before each test for clean state
  mockReset(mockStockDataRepository);
  mockReset(mockStockDataService);
});

describe("FFRetrievalFunction tests", () => {
  it("returns 400 if required parameters are missing", async () => {
    // Arrange
    const request = { method: 'GET', params: {}, query: new URLSearchParams() } as unknown as HttpRequest;
    const context = {} as any;

    // Act
    const result = await FFRetrievalFunction(request, context);

    // Assert
    expect(result).toEqual({ status: 400, body: "Missing required parameters" });
  });

  it("returns 200 and stock data on successful retrieval", async () => {
    // Arrange
    const request = {
      method: 'GET',
      params: { symbolName: "TEST" },
      query: new URLSearchParams([['startDatetime', '2020-01-01'], ['endDatetime', '2020-01-02']])
    } as unknown as HttpRequest;
    const context = {} as any;

    const mockData = { data: "some stock data" } as any;
    mockStockDataService.getStockData.mockResolvedValue(mockData);

    // Act
    const result = await FFRetrievalFunction(request, context);

    // Assert
    expect(result).toEqual({ status: 200, body: JSON.stringify(mockData) });
    expect(mockStockDataService.getStockData).toHaveBeenCalledWith("TEST", "2020-01-01", "2020-01-02");
  });

  it("returns 500 if there is an error retrieving stock data", async () => {
    // Arrange
    const request = {
      method: 'GET',
      params: { symbolName: "TEST" },
      query: new URLSearchParams([['startDatetime', '2020-01-01'], ['endDatetime', '2020-01-02']])
    } as unknown as HttpRequest;
    const context = {} as any;
    mockStockDataService.getStockData.mockRejectedValue(new Error("Some service error text"));

    // Act
    const result = await FFRetrievalFunction(request, context);

    // Assert
    expect(result).toEqual({ status: 500, body: "Error retrieving stock data: Some service error text" });
  });
});