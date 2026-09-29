// ============================================================
// DADOS MOCKADOS REALISTAS — ESTOQUE VIRTUAL INTELIGENTE
// Restaurante Engenho | Shopping Ponta Negra | Manaus-AM
// ============================================================

import type {
  VirtualStockItem,
  StockBatch,
  Recipe,
  NfRecord,
  SalesImport,
  CancellationRecord,
  StockAlert,
  ForecastedOrder,
  StockHealthScore,
  StockEngineConfig,
} from '../types/stock.types';

// ---- Configuração do Motor ----

export const DEFAULT_ENGINE_CONFIG: StockEngineConfig = {
  globalErrorMarginPct: 8.5,
  prepErrorPct: 5.0,
  teamConsumptionPct: 2.0,
  serviceWastePct: 1.0,
  scaleErrorPct: 0.5,
  criticalDaysThreshold: 2,
  attentionDaysThreshold: 4,
  forecastWindowDays: 7,
  historicalWindowDays: 30,
};

// ---- Catálogo de Insumos ----

export const MOCK_STOCK_ITEMS: VirtualStockItem[] = [];

// ---- Lotes Ativos ----

export const MOCK_BATCHES: StockBatch[] = [];

// ---- Fichas Técnicas ----

export const MOCK_RECIPES: Recipe[] = [];

// ---- NFs Recentes ----

export const MOCK_NF_RECORDS: NfRecord[] = [];

// ---- Relatório de Vendas (Hoje) ----

export const MOCK_SALES_IMPORTS: SalesImport[] = [];

// ---- Cancelamentos / Devoluções ----

export const MOCK_CANCELLATIONS: CancellationRecord[] = [];

// ---- Alertas Ativos ----

export const MOCK_STOCK_ALERTS: StockAlert[] = [];

// ---- Pedido de Reposição Sugerido ----

export const MOCK_FORECASTED_ORDER: ForecastedOrder = {
  id: 'PED-INIT-000',
  generatedAt: new Date().toISOString(),
  referenceDate: new Date().toISOString().slice(0, 10),
  deliveryDateEstimate: new Date().toISOString().slice(0, 10),
  status: 'SUGERIDO',
  totalValue: 0.00,
  notes: 'Nenhum pedido pendente. Registre movimentações ou importe vendas para gerar sugestões.',
  items: [],
};

// ---- Score de Saúde do Estoque ----

export const MOCK_STOCK_HEALTH: StockHealthScore = {
  date: new Date().toISOString().slice(0, 10),
  overall: 100,
  breakdown: {
    coverageDays: 0,
    ruptureDangerCount: 0,
    expiryAlertCount: 0,
    divergencePct: 0,
    cmvRealVsTheoretical: 0,
  },
  grade: 'A',
  aiSummary: 'Sistema inicializado do zero para início da operação real. Cadastre as contagens físicas e registre entradas de notas fiscais.',
};
