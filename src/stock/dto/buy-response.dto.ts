type ProcessSummary = {
  totalStocksBought: number;
  totalPriceSpent: number;
  isFailedByOutOfBalance: boolean;
};

export interface BuyResponseDTO {
  stock: string;
  estimatedAmount: number;
  processSummary: ProcessSummary;
}
