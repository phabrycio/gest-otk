// ============================================================
// TIPOS DE GESTÃO DE CHOPP, BEBIDAS E CONTROLE DE DESVIOS (BAR INTELLIGENCE)
// Tk Gestão e Tecnologia
// ============================================================

export type KegStatus = 'ENGATADO' | 'RESERVA_CAMARA' | 'VASILHAME_VAZIO' | 'VENCIDO';

export type FoamStatus = 'PERFEITA' | 'ALERTA_ESPUMA' | 'CHOPP_MORNO' | 'PRESSAO_BAIXA';

export interface ChoppTap {
  id: string;
  tapNumber: number;                     // Torneira 1, 2, 3, 4
  beerName: string;                      // Nome do Chopp (ex: Brahma Claro 50L)
  style: 'PILSEN' | 'IPA' | 'BLACK' | 'WEISS' | 'REGIONAL';
  kegCapacityLiters: number;             // 30 ou 50 Litros
  currentVolumeLiters: number;           // Volume estimado restante no barril
  // Cruzamento com Teknisa
  glassesSoldTeknisa: number;            // Quantidade de copos vendidos no Teknisa (350ml / 500ml)
  litersSoldTeknisa: number;             // Litragem teórica vendida
  litersDispensedReal: number;           // Litragem que efetivamente saiu da torneira
  technicalLossPct: number;              // Quebra técnica padrão aceitável (ex: 5.5% para sangria de linha)
  technicalLossLiters: number;           // Litros aceitáveis de sangria/colarinho
  // Auditoria de Desvio
  unaccountedDeviationLiters: number;    // Desvio oculto = Real - (Vendido + Quebra)
  deviationCostReais: number;            // Custo financeiro do desvio R$
  deviationRetailReais: number;          // Prejuízo em preço de cardápio R$
  deviationStatus: 'NORMAL' | 'ATENCAO' | 'CRITICO';
  // Telemetria da Chopeira
  temperatureCelsius: number;            // Ideal: -0.5°C a +1.5°C
  pressurePsi: number;                   // Ideal: 32 a 36 PSI (2.2 a 2.5 bar)
  foamStatus: FoamStatus;
  // Lote e Validade do Barril
  kegBatchNumber: string;
  kegExpiryDate: string;                 // Barril aberto dura de 3 a 5 dias com qualidade máxima
  kegInstalledAt: string;
  installedBy: string;
}

export interface SpiritBottle {
  id: string;
  name: string;                          // Ex: Gin Tanqueray, Cachaça de Jambu
  category: 'DESTILADO' | 'CACHACA_REGIONAL' | 'VINHO' | 'LICOR' | 'XAROPE';
  bottleVolumeMl: number;                // 750ml, 1000ml
  standardDoseMl: number;                // 50ml por dose padrão da casa
  totalDosesExpected: number;            // 15 doses por garrafa de 750ml (50ml)
  openBottles: number;                   // Quantidade de garrafas abertas na estação
  openBottleFillPct?: number;             // Nível mediano detectado por OCR: 100%, 75%, 50%, 25%, 10%
  openBottleRemainingMl?: number;         // Volume restante estimado em ml na garrafa aberta
  openBottleRemainingDoses?: number;      // Doses restantes na garrafa aberta
  openBottleConsumedDoses?: number;       // Doses consumidas da garrafa aberta
  sealedStockBottles: number;            // Garrafas fechadas no estoque virtual do sistema
  dosesSoldTeknisa: number;              // Drinks/doses faturadas no Teknisa (comanda)
  dosesCalculatedConsumed: number;       // Doses teóricas baixadas pelas fichas de coquetéis
  totalMlConsumedReal?: number;           // Volume real total consumido no bar
  deviationDoses: number;                // Desvio de doses (+ = faltou no inventário real)
  deviationReais: number;                // Prejuízo em R$
  deviationType?: 'NORMAL' | 'DOSE_A_OLHO' | 'SAIDA_SEM_COMANDA';
  averageDoseServedMl?: number;           // Média servida (ex: 65ml indica dose a olho acima de 50ml)
  photoOcrVerified?: boolean;             // Se a medição foi validada por foto OCR Gemini Vision
  riskLevel: 'BAIXO' | 'MEDIO' | 'ALTO';
}

export interface DetectedBottleLevel {
  id: string;
  bottleName: string;
  category: SpiritBottle['category'];
  totalCapacityMl: number;
  fillLevelPct: 100 | 75 | 50 | 25 | 10 | number;
  remainingVolumeMl: number;
  standardDoseMl: number;
  remainingDoses: number;
  consumedDosesInBottle: number;
  confidence: number;
  visualObservation: string;
}

export interface ExtractedBottleScanResult {
  scanDate: string;
  detectedBottles: DetectedBottleLevel[];
  ocrConfidence: number;
  rawAnalysisNotes?: string;
}

export interface BarAuditSummary {
  referenceDate: string;
  shift: 'ALMOCO' | 'JANTAR' | 'DIA_TODO';
  totalLitersKegsDispensed: number;
  totalLitersSoldTeknisa: number;
  totalTechnicalLossLiters: number;
  totalDeviationLiters: number;
  totalDeviationReais: number;
  overallYieldPct: number;               // Aproveitamento do Chopp (% normal: 92% a 95%)
  topDiscrepancies: string[];
}
