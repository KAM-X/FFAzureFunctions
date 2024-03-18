// Example Data from 3rd party API, should be mapped to stockData Model with a mapper

export interface StockDataAPI_DTO {
  t: number; //tiemstamp
  o: number; //opening price
  h: number; //highest price
  l: number; //lowest price
  c: number; //close
  v: number; //volume
}