export type ShiftType = 'MANHA_ALMOCO' | 'NOITE_JANTAR';

export interface ManagerBonus {
  foodSafety: {
    weightPct: number;
    maxBonus: number;
    achievedBonus: number;
    complianceRate: number;
    targetRate: number;
    morningAuditDone: boolean;
    eveningAuditDone: boolean;
    status: 'SECURED' | 'ATTENTION' | 'DANGER';
  };
  nps: {
    weightPct: number;
    maxBonus: number;
    achievedBonus: number;
    averageRating: number;
    targetRating: number;
    responseRate: number;
    pendingReviewsCount: number;
    status: 'SECURED' | 'ATTENTION' | 'DANGER';
  };
  sales: {
    weightPct: number;
    maxBonus: number;
    achievedBonus: number;
    monthlyTarget: number;
    currentRevenue: number;
    projectedRevenue: number;
    daysRemaining: number;
    dailyNeededRunRate: number;
    status: 'SECURED' | 'ON_TRACK' | 'ATTENTION';
  };
  totalBonus: number;
  maxTotalBonus: number;
}

export interface InventoryItem {
  id: string;
  cdaCode: string;
  name: string;
  category: 'CARNES_NOBRES' | 'PESCADOS_REGIONAIS' | 'FRUTOS_DO_MAR' | 'QUEIJOS' | 'BEBIDAS_NOBRES' | 'INSUMOS_REGIONAIS';
  unit: string;
  minStock: number;
  currentStock: number;
  unitCost: number;
  isCurveA: boolean;
  idealStock: number;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

export interface StockLoss {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  reason: 'ERRO_PONTO_PREPARO' | 'VALIDADE_VENCIDA' | 'ERRO_PEDIDO_SALAO' | 'QUEBRA_FISICA' | 'AVARIA_RECEBIMENTO';
  time: string;
  notes: string;
}

export interface CdaRequisition {
  id: string;
  orderNumber: string;
  status: 'RASCUNHO' | 'ENVIADO_CDA' | 'EM_SEPARACAO' | 'EM_TRANSITO' | 'RECEBIDO_TOTAL' | 'RECEBIDO_COM_DIVERGENCIA';
  deliveryDate: string;
  totalValue: number;
  itemsCount: number;
  truckTemperature?: number;
  divergenceNotes?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: 'SALAO' | 'COZINHA' | 'BAR' | 'HIGIENIZACAO';
  shift: ShiftType;
  status: 'PRESENTE' | 'FOLGA_LEGAL' | 'ATRASADO' | 'FALTA_JUSTIFICADA';
  upsellingScore?: number; // Pontuação em vendas de sobremesas/vinhos
  tablesServedToday?: number;
}

export interface ChecklistItem {
  id: string;
  category: 'SALAO' | 'BAR' | 'COZINHA' | 'FRIO_ANVISA' | 'FECHAMENTO';
  title: string;
  isMandatory: boolean;
  completed: boolean;
  targetTemp?: string;
  currentTemp?: string;
  obs?: string;
}

export interface CustomerReview {
  id: string;
  platform: 'GOOGLE_MAPS' | 'TRIPADVISOR' | 'INSTAGRAM';
  author: string;
  rating: number;
  date: string;
  comment: string;
  sentiment: 'POSITIVO' | 'NEUTRO' | 'NEGATIVO';
  suggestedResponse: string;
  finalResponse?: string;
  isAnswered: boolean;
}

export interface CorporateTicket {
  id: string;
  protocol: string;
  department: 'MANUTENCAO' | 'TI_SISTEMAS' | 'RH_MATRIZ' | 'FINANCEIRO';
  priority: 'ALTA' | 'CRITICA' | 'MEDIA';
  title: string;
  status: 'ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
  date: string;
}

export interface RestaurantTable {
  id: string;
  number: number;
  area: 'SALAO_PRINCIPAL' | 'VARANDA_PONTA_NEGRA' | 'SALA_VIP';
  capacity: number;
  status: 'LIVRE' | 'AGUARDANDO_PRATO' | 'CONSUMINDO' | 'SOBREMESA_CONTA' | 'ATRASADA';
  minutesSinceOrder: number;
  customerCount: number;
  waiterName: string;
  isVip?: boolean;
}

export interface Item86 {
  id: string;
  dishName: string;
  reason: 'ESGOTADO' | 'RACIONADO';
  portionsLeft?: number;
  updatedAt: string;
}

export interface TrackedBatch {
  id: string;
  batchNumber: string;
  cdaInvoiceNumber: string;
  itemName: string;
  initialQuantity: number;
  currentInFreezer: number;
  unit: string;
  unitCost: number;
  entryDate: string;
  status: 'ATIVO' | 'ENCERRADO';
}

export interface TraceMovement {
  id: string;
  batchId: string;
  itemName: string;
  type: 'RETIRADA_DESCONGELAMENTO' | 'DEVOLUCAO_FREEZER';
  quantity: number;
  unit: string;
  chefName: string;
  timestamp: string;
  photoCaptured: boolean;
  qrCodeBypassed?: boolean;
}

export interface ClosingReconciliation {
  itemName: string;
  withdrawnFromFreezer: number;
  soldOnPdv: number;
  returnedToFreezer: number;
  registeredWaste: number;
  discrepancy: number; // Retirados - (Vendidos + Devolvidos + Perdas)
  unitCost: number;
  financialImpact: number;
  status: 'CONFORME' | 'INCONSISTENCIA_GRAVE';
}

export interface ExpiryPromoOpportunity {
  id: string;
  targetItem: {
    name: string;
    batchNumber: string;
    currentStock: number;
    unit: string;
    unitCost: number;
    regularPrice: number;
    expiryDate: string;
    daysRemaining: number;
    totalRiskValue: number;
  };
  pairedItem: {
    name: string;
    unitCost: number;
    regularPrice: number;
    markupFactor: number;
  };
  comboPricing: {
    comboName: string;
    promoPrice: number;
    regularTotalPrice: number;
    discountPct: number;
    totalComboCost: number;
    targetCmvPct: number;
    contributionMargin: number;
    projectedRevenue: number;
    recommendedDates: string;
  };
  marketingAssets: {
    instagramCopy: string;
    whatsappVipCopy: string;
    waiterUpsellScript: string;
  };
  status: 'SUGERIDA' | 'ATIVADA_PDV' | 'CONCLUIDA';
}

export interface ReelScene {
  timeframe: string;
  cameraAngle: string;
  action: string;
  audioAndSfx: string;
  onScreenText?: string;
  algorithmicWhy: string;
}

export interface ViralReelScript {
  id: string;
  title: string;
  category: 'ASMR_FOOD_PORN' | 'STORYTELLING_HUMANO' | 'GATILHO_CLIMATICO' | 'DESAFIO_CARDAPIO';
  targetDish: string;
  targetInsumo: string;
  recommendedDayAndTime: string;
  videoDurationSeconds: number;
  idealWeatherTrigger?: string;
  hookThreeSeconds: string;
  storytellingCore: string;
  scenes: ReelScene[];
  algorithmicRationale: {
    dmShareTrigger: string;
    targetAudiencePontaNegra: string;
    competitorGapExploited: string;
    soundStrategy: string;
  };
  conversionProjection: {
    estimatedViews: string;
    estimatedDMShares: string;
    projectedTablesBooked: number;
    projectedRevenueBoost: number;
  };
  captionsAndHashtags: {
    captionText: string;
    strategicHashtags: string[];
  };
}

export interface DailyDreStatement {
  date: string;
  grossRevenue: number;
  cmvCost: number; // Insumos reais consumidos (~26.5%)
  grossProfit: number; // Lucro Operacional Bruto da Loja (Faturamento - CMV)
  grossProfitMarginPct: number; // % Margem Operacional da Loja
  // Despesas administrativas corporativas gerenciadas pela holding/seção administrativa:
  taxesAndCardFees?: number;
  netRevenue?: number;
  laborCost?: number;
  occupancyCost?: number;
  utilitiesCost?: number;
  maintenanceReserve?: number;
  netProfit?: number;
  netProfitMarginPct?: number;
  breakEvenProgressPct?: number;
}

export interface LossIncident {
  id: string;
  time: string;
  tableNumber: number;
  waiterName: string;
  itemName: string;
  itemValue: number;
  type: 'CANCELAMENTO_BOQUETA' | 'CORTESIA_SALAO' | 'DESCONTO_MANUAL';
  reason: string;
  chefNotified: boolean;
  managerApproved: boolean;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO_INVESTIGADO';
}

export interface CriticalEquipmentAsset {
  id: string;
  name: string;
  location: 'COZINHA' | 'BAR' | 'CÂMARAS_FRIAS' | 'SALAO';
  currentStatus: 'OPERANDO_NORMAL' | 'ATENCAO_PREVENTIVA' | 'CRITICO_PARADO';
  currentMetric: string; // Ex: "-19.2°C" ou "Gelo: 92% cheio"
  targetMetric: string; // Ex: "<= -18°C"
  lastMaintenanceDate: string;
  nextScheduledMaintenance: string;
  maintenanceType: string;
  riskIfFails: string;
}

export interface VipCustomerProfile {
  id: string;
  name: string;
  condoResidence: string; // Ex: "Alphaville 2" ou "Jardim das Américas"
  frequency: string; // Ex: "2x a 3x por semana"
  averageTicket: number;
  favoriteTable: string;
  favoriteDish: string;
  drinkPreference: string;
  quirksAndNotes: string;
  lastVisit: string;
  isCurrentlySeated: boolean;
  currentTable?: number;
}

export interface PettyCashTransaction {
  id: string;
  time: string;
  description: string;
  amount: number;
  category: 'HORTIFRUTI_FRESCO' | 'MANUTENCAO_RAPIDA' | 'GELO_EMERGENCIA' | 'OUTROS';
  receiptAttached: boolean;
  authorizedBy: string;
}

export interface StaffDailyObligation {
  id: string;
  moment: 'ABERTURA' | 'PICO' | 'FECHAMENTO';
  task: string;
  standardTime: string;
  criticalRule?: string;
  isMandatory: boolean;
}

export interface StaffRoleOnboarding {
  id: string;
  roleName: string;
  department: 'SALAO' | 'COZINHA' | 'BAR' | 'HIGIENIZACAO';
  iconName: string;
  mission: string;
  goldenRules: string[];
  requiredEpis: string[];
  sourcePopCode: string;
  sevenDayTrack: Array<{
    day: number;
    title: string;
    focus: string;
    tasks: string[];
  }>;
  dailyObligations: StaffDailyObligation[];
}

export interface PopScanResult {
  id: string;
  popTitle: string;
  detectedRole: string;
  extractedObligationsCount: number;
  confidenceScore: number;
  timestamp: string;
  summary: string;
}

export interface AiProactiveAlert {
  id: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  category: 'EQUIPAMENTO_FRIO' | 'CMV_VALIDADE' | 'BOQUETA_SALAO' | 'FRAUDE_ESTOQUE' | 'ANVISA_CONFORMIDADE';
  title: string;
  problemDescription: string;
  financialRiskReais: number;
  recommendedDecision: string;
  quickActionLabel: string;
  actionPayload: string;
  timestamp: string;
  tokenSavingsMethod: string;
}

export interface TokenEconomicsMetrics {
  totalTokensSavedToday: number;
  moneySavedReais: number;
  edgeInterceptionRatePct: number;
  activeModel: string;
  cacheHitsCount: number;
  averageDecisionLatencyMs: number;
}

