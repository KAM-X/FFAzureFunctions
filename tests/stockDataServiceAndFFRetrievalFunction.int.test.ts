import { HttpRequest, HttpRequestParams } from "@azure/functions";
import { StockDataRepository } from "../src/repositories/stockRepository";
import {  mock, mockReset   } from 'jest-mock-extended';
import { FFRetrievalFunction } from "../src/functions/FFRetrievalFunction";
import { StockData } from "../src/models/stockData";
import axios from "axios";

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
  it('returns error if stock data fetching fails', async () => {
     // Arrange
     mockRepository.findBySymbolForPeriod.mockImplementation((_x: any, _y: any, _z: any) => { throw new Error('Some error message'); });
     const fakeUserParams: HttpRequestParams = { symbolName: 'AAPL' };
     const fakeUserQuery = new URLSearchParams([['startDatetime', '2023-01-01'], ['endDatetime', '2023-01-02']]);
     const fakeUserRequest = { method: 'GET', params: fakeUserParams, query: fakeUserQuery } as HttpRequest;
     const fakeContext = {} as any;
     const expectedResponse = {
       status: 500,
       body: 'Error retrieving stock data: Some error message'
     };
     
     // Act
     const result = await FFRetrievalFunction(fakeUserRequest, fakeContext);
 
     // Assert
     expect(result).toEqual(expectedResponse);
     expect(mockRepository.findBySymbolForPeriod).toHaveBeenCalledWith('AAPL', expect.any(Date), expect.any(Date));
  });

  it('returns stock data for a given period', async () => {
    // Arrange
    const fakeStockDataArray: StockData[] = [
      {
        id: 'AAPL-2023-01-01',
        symbol: 'AAPL',
        timestamp: new Date('2023-01-01'),
        volume: 100,
        high: 10,
        low: 5,
        close: 8,
        open: 6,
      },
      {
        id: 'AAPL-2023-01-02',
        symbol: 'AAPL',
        timestamp: new Date('2023-01-02'),
        volume: 200,
        high: 20,
        low: 15,
        close: 18,
        open: 16,
      },
    ];
    mockRepository.findBySymbolForPeriod.mockResolvedValue(fakeStockDataArray);
    const fakeUserParams: HttpRequestParams = { symbolName: 'AAPL' };
    const fakeUserQuery = new URLSearchParams([['startDatetime', '2023-01-01'], ['endDatetime', '2023-01-02']]);
    const fakeUserRequest = { method: 'GET', params: fakeUserParams, query: fakeUserQuery } as HttpRequest;
    const fakeContext = {} as any;
    const expectedResponse = {
      status: 200,
      body: JSON.stringify(fakeStockDataArray)
    };
    
    // Act
    const result = await FFRetrievalFunction(fakeUserRequest, fakeContext);

    // Assert
    expect(result).toEqual(expectedResponse);
    expect(mockRepository.findBySymbolForPeriod).toHaveBeenCalledWith('AAPL', expect.any(Date), expect.any(Date));
  });

  it('returns empty data array when stock data not found', async () => {
    // Arrange
    mockRepository.findBySymbolForPeriod.mockResolvedValue([]);
    const fakeUserParams: HttpRequestParams = { symbolName: 'AAPL' };
    const fakeUserQuery = new URLSearchParams([['startDatetime', '2023-01-01'], ['endDatetime', '2023-01-02']]);
    const fakeUserRequest = { method: 'GET', params: fakeUserParams, query: fakeUserQuery } as HttpRequest;
    const fakeContext = {} as any;
    const expectedResponse = {
      status: 200,
      body: JSON.stringify([])
    };
    
    // Act
    const result = await FFRetrievalFunction(fakeUserRequest, fakeContext);

    // Assert
    expect(result).toEqual(expectedResponse);
    expect(mockRepository.findBySymbolForPeriod).toHaveBeenCalledWith('AAPL', expect.any(Date), expect.any(Date));
  });
});