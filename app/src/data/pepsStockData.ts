export interface StockBatch {
  id: string;
  itemId: string;
  itemName: string;
  batchCode: string;
  entryDate: string; // ISO ou data legível
  entryTimestamp: number;
  expirationDate: string;
  initialQuantity: number;
  currentQuantity: number;
  unit: string;
  unitCost: number;
  storageLocation: string; // Ex: 'Câmara Fria 1 - Prateleira A (Frente)'
  pepsQueuePosition: number; // 1 = Primeiro que Sai (Mais Antigo)
  status: 'PRIMEIRO_A_SAIR' | 'EM_FILA' | 'ESGOTADO';
  cdaInvoice: string;
}

export interface PepsMovementLog {
  id: string;
  timestamp: string;
  itemName: string;
  batchCode: string;
  quantity: number;
  unit: string;
  operator: string;
  action: 'SAIDA_REGULAR_PEPS' | 'ENTRADA_NOVO_LOTE' | 'VIOLACAO_PEPS_JUSTIFICADA';
  notes: string;
}

export const INITIAL_PEPS_BATCHES: StockBatch[] = [];

export const INITIAL_PEPS_LOGS: PepsMovementLog[] = [];
