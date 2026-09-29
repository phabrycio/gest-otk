// ============================================================
// TIPOS DO SISTEMA DE ESTOQUE VIRTUAL INTELIGENTE
// Tk Gestão e Tecnologia — Sprint 1
// ============================================================

// --- Catálogo de Insumos ---

import type { StockSector } from './restaurant.types';

export type StockCategory =
  | 'CARNES_NOBRES'
  | 'PESCADOS_REGIONAIS'
  | 'FRUTOS_DO_MAR'
  | 'AVES_SUINOS'
  | 'QUEIJOS_LATICINIOS'
  | 'BEBIDAS_DESTILADOS'
  | 'BEBIDAS_VINHOS'
  | 'BEBIDAS_NAOALCOOLICAS'
  | 'SECOS_ESPECIARIAS'
  | 'HORTIFRUTI_REGIONAL'
  | 'MOLHOS_CONDIMENTOS'
  | 'DESCARTAVEIS_EMBALAGENS'
  | 'HIGIENE_LIMPEZA'
  | 'DOCES_CAIXA'
  | 'CHARCUTARIA';

export type StockUnit = 'kg' | 'g' | 'L' | 'ml' | 'un' | 'cx' | 'fd' | 'pct';

export type StockStatus = 'SAFE' | 'ATTENTION' | 'CRITICAL' | 'RUPTURA';

export interface VirtualStockItem {
  id: string;
  cdaCode: string;
  name: string;
  category: StockCategory;
  sector?: StockSector;       // Setor responsável pela contagem
  responsiblePerson?: string; // Responsável direto (ex: "Amanda (Caixa)", "Pedro (Bar)")
  unit: StockUnit;
  // Níveis de controle
  minStock: number;           // Estoque mínimo — acionar pedido
  safetyStock: number;        // Estoque de segurança — zona de atenção
  idealStock: number;         // Nível ideal (cobertura ~7 dias)
  maxStock: number;           // Capacidade máxima de armazenamento
  // Estoque virtual calculado
  virtualQty: number;         // Qty calculada pelo motor (não física)
  reservedQty: number;        // Reservado para pedidos em andamento
  availableQty: number;       // virtualQty - reservedQty
  // Custo
  averageCost: number;        // Custo médio ponderado
  lastCost: number;           // Custo da última entrada
  // Fornecedor e pedido
  primarySupplier: 'CDA' | 'PANAIR' | 'COMPRA_DIRETA' | 'OUTROS';
  orderLeadTimeDays: number;  // Prazo de entrega do fornecedor
  minOrderQty: number;        // Lote mínimo do pedido
  orderQtyMultiple: number;   // Múltiplo de pedido (ex: caixas de 12)
  // Status e alertas
  status: StockStatus;
  daysUntilRuptura: number | null; // Estimativa de dias até zerar
  lastMovementAt: string;
  // Margem de erro configurável (% de consumo extra não registrado)
  errorMarginPct: number;
}

// --- Lotes (FEFO) ---

export type BatchStatus = 'ATIVO' | 'PARCIAL' | 'ENCERRADO' | 'VENCIDO' | 'BLOQUEADO';

export interface StockBatch {
  id: string;
  itemId: string;
  itemName: string;
  batchNumber: string;           // Número do lote (NF ou gerado)
  nfNumber: string;              // Número da nota fiscal
  nfPhotoUrl?: string;           // Foto da NF arquivada
  supplierName: string;
  entryDate: string;             // Data de entrada no estoque
  expiryDate: string | null;     // Data de validade (null = sem validade definida)
  initialQty: number;
  currentQty: number;
  unit: StockUnit;
  unitCost: number;
  totalValue: number;
  status: BatchStatus;
  daysUntilExpiry: number | null;
  receivedBy: string;            // Operador que lançou a entrada
}

// --- Movimentações (Ledger Imutável) ---

export type MovementType =
  | 'ENTRADA_NF'             // Recebimento de NF
  | 'ENTRADA_COMPRA_DIRETA'  // Compra na Panair/mercado
  | 'CONSUMO_VENDA'          // Consumo calculado pelas vendas × fichas
  | 'CONSUMO_MANUAL'         // Baixa manual (testes, degustação)
  | 'PERDA_QUALIDADE'        // Cancelamento por qualidade
  | 'PERDA_VALIDADE'         // Item vencido descartado
  | 'PERDA_OPERACIONAL'      // Erro de preparo, queda, quebra
  | 'DEVOLUCAO_CLIENTE'      // Prato devolvido pelo cliente
  | 'DEVOLUCAO_FORNECEDOR'   // Devolução para o fornecedor/CDA
  | 'AJUSTE_INVENTARIO'      // Acerto após contagem física
  | 'TRANSFERENCIA_SAIDA'    // Transferência para outra unidade
  | 'TRANSFERENCIA_ENTRADA';  // Recebimento de outra unidade

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  batchId?: string;
  type: MovementType;
  qty: number;
  unit: StockUnit;
  unitCost: number;
  totalValue: number;
  balanceBefore: number;
  balanceAfter: number;
  // Rastreabilidade
  operatorId: string;
  operatorName: string;
  operatorPin: string;          // Hash do PIN
  timestamp: string;
  // Contexto
  nfNumber?: string;
  saleImportId?: string;
  cancellationId?: string;
  notes: string;
  // Integridade
  eventHash: string;            // SHA-256 para trilha imutável
  previousHash: string;
}

// --- Nota Fiscal (Entrada de Estoque) ---

export type NfStatus =
  | 'PENDENTE_CONFERENCIA'   // Foto tirada, aguardando confirmação
  | 'CONFIRMADA'             // Dados conferidos e lançados
  | 'COM_DIVERGENCIA'        // Diferença entre pedido e recebido
  | 'DEVOLVIDA';             // NF rejeitada/devolvida

export interface NfItem {
  id: string;
  cdaCode?: string;
  name: string;
  qty: number;
  unit: StockUnit;
  unitCost: number;
  totalValue: number;
  expiryDate?: string;
  batchNumber?: string;
  // Comparação com pedido CDA
  orderedQty?: number;
  divergenceQty?: number;      // Positivo = recebeu mais, negativo = faltou
  divergenceNotes?: string;
  status: 'OK' | 'DIVERGENCIA_QUANTIDADE' | 'ITEM_NAO_PEDIDO' | 'ITEM_FALTANDO';
}

export interface NfRecord {
  id: string;
  nfNumber: string;
  nfSeries?: string;
  supplier: string;
  supplierCnpj?: string;
  issueDate: string;
  receiptDate: string;
  totalValue: number;
  items: NfItem[];
  photoUrl?: string;
  // OCR
  ocrConfidence: number;        // 0–100
  ocrExtractedAt?: string;
  ocrRawText?: string;
  // Status
  status: NfStatus;
  receivedBy: string;
  truckTemperature?: number;    // °C na doca
  notes?: string;
  linkedCdaOrderId?: string;
}

// --- Fichas Técnicas ---

export interface RecipeIngredient {
  id: string;
  stockItemId?: string;        // Vínculo com catálogo de estoque
  itemName: string;
  qty: number;                 // Quantidade por porção
  unit: StockUnit;
  unitCost: number;
  subtotalCost: number;
  // Fatores de perda
  prepLossPct: number;         // % perdido no preparo (limpeza, cocção)
  netQtyAfterLoss: number;     // qty × (1 + prepLossPct/100)
  notes?: string;
}

export interface Recipe {
  id: string;
  dishName: string;
  category: 'ENTRADA' | 'PRATO_PRINCIPAL' | 'SOBREMESA' | 'BEBIDA' | 'ACOMPANHAMENTO' | 'INSUMO_BASE';
  yieldQty: number;            // Quantas porções rende
  yieldUnit: string;           // "porções" ou "kg" ou "litros"
  sellingPrice: number;        // Preço de venda no cardápio
  theoreticalCmv: number;      // CMV teórico total R$
  theoreticalCmvPct: number;   // CMV % sobre preço de venda
  ingredients: RecipeIngredient[];
  // OCR e auditoria
  photoUrl?: string;
  ocrExtractedAt?: string;
  lastReviewDate?: string;
  isActive: boolean;
  notes?: string;
}

// --- Importação de Vendas ---

export type SaleImportStatus = 'PENDENTE' | 'PROCESSADO' | 'COM_ERROS' | 'IGNORADO';

export interface SaleLineItem {
  id: string;
  dishName: string;
  recipeId?: string;           // Vínculo com ficha técnica
  productCode?: string;        // Código Teknisa PDV
  qtyOrdered: number;
  qtyCancelled: number;        // Cancelados (qualidade + desistência)
  qtyDelivered: number;        // Efetivamente servidos
  unitPrice: number;
  totalRevenue: number;
  status?: 'ENTREGUE' | 'CANCELADO' | 'PENDENTE';
  // Consumo calculado
  theoreticalConsumption: Array<{
    stockItemId?: string;
    itemName: string;
    qty: number;
    unit: StockUnit;
  }>;
  shift: 'ALMOCO' | 'JANTAR';
  date: string;
}

export interface SalesImport {
  id: string;
  importDate: string;
  referenceDate: string;       // Data de competência das vendas
  source: 'CSV_PDV' | 'EXCEL' | 'PDF' | 'MANUAL' | 'TEKNISA_PDV';
  fileName?: string;
  status: SaleImportStatus;
  totalRevenue: number;
  totalItems: number;
  totalCancelled: number;
  lines: SaleLineItem[];
  importedBy: string;
  processedAt?: string;
  errorMessages?: string[];
}

// --- Cancelamentos / Devoluções ---

export type CancellationReason =
  | 'QUALIDADE_PREPARO'        // Erro na cozinha (mal passado, frio, etc.)
  | 'QUALIDADE_APRESENTACAO'   // Apresentação fora do padrão
  | 'DEMORA_BOQUETA'           // Cliente desistiu pela demora
  | 'ERRO_PEDIDO_SALAO'        // Garçom anotou errado
  | 'ALERGIA_ITEM_INCORRETO'   // Item com alérgeno não informado
  | 'PRATO_ERRADO_ENTREGUE'    // Prato trocado na entrega
  | 'DESISTENCIA_CLIENTE'      // Cliente mudou de ideia
  | 'DELIVERY_DANIFICADO'      // Chegou danificado (delivery)
  | 'QUALIDADE'                // Genérico Teknisa
  | 'DEVOLUCAO'                // Genérico Teknisa
  | 'ERRO_LANCAMENTO'          // Genérico Teknisa
  | 'DESPERDICIO'              // Genérico Teknisa
  | 'OUTRO';                   // Outro motivo

export type CancellationConsumptionStatus =
  | 'INSUMO_CONSUMIDO'         // Insumo já foi usado no preparo → perda
  | 'INSUMO_NAO_CONSUMIDO'     // Prato não saiu da cozinha → estoque retorna
  | 'CONSUMO_PARCIAL';         // Saiu mas não comeram — perda parcial

export interface CancellationRecord {
  id: string;
  date: string;
  time: string;
  orderId?: string;
  tableNumber?: number | string;
  dishName: string;
  recipeId?: string;
  productCode?: string;
  qty: number;
  unitValue: number;
  unitPrice?: number;
  totalValue: number;
  reason: CancellationReason;
  reasonDetail?: string;
  consumptionStatus: CancellationConsumptionStatus;
  waiterName?: string;
  chefResponsible?: string;
  managerApproved: boolean;
  approvedBy?: string;
  shift?: 'ALMOCO' | 'JANTAR' | 'DIA_TODO' | string;
  source?: string;
  notes?: string;
  // Impacto no estoque virtual
  stockImpactApplied: boolean;
}

// --- Motor de Estoque Virtual ---

export interface StockEngineConfig {
  // Margem de erro global (% aplicada sobre consumo teórico)
  globalErrorMarginPct: number;     // Default: 8.5%
  // Fatores individuais de margem de erro
  prepErrorPct: number;             // Erro de porcionamento: 5%
  teamConsumptionPct: number;       // Degustação/equipe: 2%
  serviceWastePct: number;          // Queda/derrame no serviço: 1%
  scaleErrorPct: number;            // Erro de aferição: 0.5%
  // Alertas
  criticalDaysThreshold: number;    // Dias para alerta crítico: 2
  attentionDaysThreshold: number;   // Dias para alerta atenção: 4
  // Previsão
  forecastWindowDays: number;       // Janela de previsão: 7 dias
  historicalWindowDays: number;     // Histórico para previsão: 30 dias
}

export interface StockAlert {
  id: string;
  itemId?: string;
  itemName?: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'RUPTURA';
  type:
    | 'ESTOQUE_BAIXO'
    | 'RUPTURA_IMINENTE'
    | 'VALIDADE_PROXIMA'
    | 'DESVIO_ALTO'
    | 'NF_PENDENTE'
    | 'CMV_ACIMA_META'
    | 'CONSUMO_ANOMALO'
    | 'PEDIDO_SUGERIDO';
  title: string;
  description: string;
  suggestedAction?: string;
  financialImpact?: number;
  createdAt: string;
  isRead: boolean;
  isDismissed: boolean;
}

// --- Previsão de Pedidos ---

export interface ForecastedOrder {
  id: string;
  generatedAt: string;
  referenceDate: string;
  deliveryDateEstimate: string;
  status: 'SUGERIDO' | 'APROVADO' | 'ENVIADO_CDA' | 'CANCELADO';
  approvedBy?: string;
  sentAt?: string;
  items: ForecastedOrderItem[];
  totalValue: number;
  notes?: string;
}

export interface ForecastedOrderItem {
  itemId: string;
  itemName: string;
  unit: StockUnit;
  currentVirtualQty: number;
  avgDailyConsumption: number;
  forecastedConsumption7Days: number;
  suggestedOrderQty: number;     // Com +10% de segurança, arredondado ao lote mínimo
  unitCost: number;
  totalCost: number;
  urgency: 'NORMAL' | 'URGENTE' | 'CRITICO';
  reasoning: string;             // Explicação da IA sobre o pedido
}

// --- Dashboard de Saúde do Estoque ---

export interface StockHealthScore {
  date: string;
  overall: number;                 // 0–100
  breakdown: {
    coverageDays: number;          // Média de dias de cobertura do portfólio
    ruptureDangerCount: number;    // Qtd itens em risco de ruptura
    expiryAlertCount: number;      // Itens com validade < 3 dias
    divergencePct: number;         // % divergência virtual vs. físico (última contagem)
    cmvRealVsTheoretical: number;  // Diferença % entre CMV real e teórico
  };
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  aiSummary: string;               // Resumo gerado pela IA
}
