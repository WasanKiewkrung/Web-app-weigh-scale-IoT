export interface ReceiptItem {
  description: string;
  qty: number;
  price: number;
  total: number;
}

export interface Receipt {
  receiptNo: string;
  sellerName: string;
  sellerDetail: string;
  customerName: string;
  customerAddress?: string;
  shippingMethod: string;
  shippingCost: number;
  items: ReceiptItem[];
  totalProduct: number;
  totalAll: number;
  status?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
