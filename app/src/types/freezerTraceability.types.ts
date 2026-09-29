// ============================================================
// TIPOS: SISTEMA DE RASTREAMENTO DE ITENS DO FREEZER (CDA)
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// [EM FASE DE PROJETO & HOMOLOGAÇÃO PILOTO]
// ============================================================

export type BatchColor = 'AZUL' | 'VERDE' | 'AMBAR';

export type FreezerStage = 'FREEZER' | 'DEGELO' | 'PRODUCAO';

export interface BatchColorConfig {
  code: BatchColor;
  batchSlot: number;             // 1, 2 ou 3 (máximo de 3 lotes no inventário)
  name: string;
  colorName: string;
  hex: string;
  badgeClass: string;
  borderClass: string;
  bgLightClass: string;
  textClass: string;
  priorityLabel: string;
  description: string;
}

export const BATCH_COLORS_CONFIG: Record<BatchColor, BatchColorConfig> = {
  AZUL: {
    code: 'AZUL',
    batchSlot: 1,
    name: 'Lote 01 • Azul Safira',
    colorName: 'Azul Safira',
    hex: '#2563eb',
    badgeClass: 'bg-blue-600 text-white',
    borderClass: 'border-blue-500',
    bgLightClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    priorityLabel: 'Prioridade 1 • Primeiro a Vencer (PVPS)',
    description: 'Lote prioritário de consumo imediato. Deve ser enviado ao degelo primeiro.',
  },
  VERDE: {
    code: 'VERDE',
    batchSlot: 2,
    name: 'Lote 02 • Verde Esmeralda',
    colorName: 'Verde Esmeralda',
    hex: '#059669',
    badgeClass: 'bg-emerald-600 text-white',
    borderClass: 'border-emerald-500',
    bgLightClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    priorityLabel: 'Prioridade 2 • Intermediário',
    description: 'Segundo lote na fila de consumo. Aguarda o esgotamento do Lote 01.',
  },
  AMBAR: {
    code: 'AMBAR',
    batchSlot: 3,
    name: 'Lote 03 • Âmbar Ouro',
    colorName: 'Âmbar Ouro',
    hex: '#d97706',
    badgeClass: 'bg-amber-600 text-white',
    borderClass: 'border-amber-500',
    bgLightClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    priorityLabel: 'Prioridade 3 • Mais Recente do CDA',
    description: 'Último lote recebido. Só deve ir para degelo após consumo dos lotes 01 e 02.',
  },
};

export interface FreezerTrackedItem {
  id: string;                         // ID único do pacote/unidade (ex: TK-FRZ-001)
  qrCode: string;                     // Código de leitura escaneável (ex: QR-TK-FRZ-001)
  itemName: string;                   // Nome do insumo (ex: Costela de Tambaqui Nobre)
  category: string;                   // Categoria (ex: Pescados Regionais, Carnes Nobres)
  localBatchNumber: string;           // Lote gerado na unidade (ex: MNR-L01-TBQ)
  cdaBatchNumber: string;             // Lote original que vem do CDA (ex: CDA-8841-AM)
  batchColor: BatchColor;             // 'AZUL' | 'VERDE' | 'AMBAR'
  receptionDate: string;              // Data de recebimento na unidade (ex: 26/09/2026 14:30)
  cdaExpiryDate: string;              // Data de validade original do CDA (ex: 15/10/2026)
  initialQuantity: number;            // Quantidade recebida
  currentQuantity: number;            // Quantidade atual
  unit: string;                       // 'porções' | 'kg' | 'peças'
  currentStage: FreezerStage;         // 'FREEZER' | 'DEGELO' | 'PRODUCAO'
  enteredFreezerAt: string;           // Timestamp de entrada no freezer
  enteredDegeloAt?: string;           // Timestamp de leitura QR para área de degelo
  enteredProducaoAt?: string;         // Timestamp de leitura QR para produção
  operatorReceived: string;           // Quem deu entrada (ex: Ivan / Patricia)
  operatorDegelo?: string;            // Quem bipou para o degelo
  operatorProducao?: string;          // Quem bipou para a produção
  temperatureCheck?: string;          // Ex: "-19.2°C" no freezer, "2.5°C" no degelo
  maxHoursDegelo?: number;            // Tempo máximo recomendado em degelo (ex: 24h)
  notes?: string;
}

export interface FreezerMovementLog {
  id: string;
  itemId: string;
  itemName: string;
  localBatchNumber: string;
  batchColor: BatchColor;
  fromStage: FreezerStage | 'ENTRADA_CDA';
  toStage: FreezerStage;
  timestamp: string;
  operator: string;
  triggerMethod: 'QR_CAMERA' | 'QR_SIMULADOR' | 'BIP_MANUAL';
  notes?: string;
}
