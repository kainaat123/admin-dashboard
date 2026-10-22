export enum StockStatus {
  OutOfStock = 0,
  InStock = 1,
}

export interface Product {
  id: number;
  name: string;
  image: string;
  status: StockStatus;
  price: number;
  quantity: number;
}

export const STATUS_OPTIONS = [
  { name: 'In Stock', value: StockStatus.InStock },
  { name: 'Out Of Stock', value: StockStatus.OutOfStock },
];
