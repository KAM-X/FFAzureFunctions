import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { StockDataRepository } from "../src/repositories/stockRepository";
import { StockDataService } from "../src/services/stockDataService";
import {  mockDeep, mockReset   } from 'jest-mock-extended';
import { FFRetrievalFunction } from "../src/functions/FFRetrievalFunction";
import { container } from "../src/cosmosClientInstance";

// External dependency mocks
const mockStockDataRepository = mockDeep<StockDataRepository>();
const mockStockDataService = mockDeep<StockDataService>();

// Mock the container import (used in repository)
jest.mock("../src/cosmosClientInstance", () => ({
  container: jest.fn()
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

beforeEach(() => {
  // Reset mocks before each test to ensure clean state
  mockReset(mockStockDataRepository);
  mockReset(mockStockDataService);
});

describe("FFRetrievalFunction tests", () => {
  
});