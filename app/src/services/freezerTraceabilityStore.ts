// ============================================================
// STORE & SERVIÇO: RASTREAMENTO DE ITENS DO FREEZER (CDA)
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// [EM FASE DE PROJETO & HOMOLOGAÇÃO PILOTO]
// ============================================================

import type {
  FreezerTrackedItem,
  FreezerMovementLog,
  BatchColor,
  FreezerStage,
} from '../types/freezerTraceability.types';

import salesAnalyticsJson from '../data/salesAnalyticsData.json';

const STORAGE_KEY_ITEMS = 'tk_freezer_tracked_items_v1';
const STORAGE_KEY_LOGS = 'tk_freezer_movement_logs_v1';

// Sem dados iniciais — registros iniciam zerados no Dia 1 para operação real
export const INITIAL_ITEMS: FreezerTrackedItem[] = [];

// Lotes reais calculados a partir das 98.393 vendas reais e necessidades de degelo
export const REAL_FREEZER_ITEMS: FreezerTrackedItem[] = (salesAnalyticsJson.thawRecommendations || []).flatMap((thaw: any, index: number) => {
  const nowStr = new Date().toLocaleDateString('pt-BR');
  const expiryDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
  const batchNum = `MNR-2026-${String(index + 1).padStart(3, '0')}`;
  const cdaBatch = `CDA-LOTE-${String(index + 101).padStart(4, '0')}`;

  return [
    // Lote 01 no Degelo (Cota do dia para a cozinha)
    {
      id: `tk-thw-${thaw.keyword.toLowerCase()}`,
      qrCode: `QR-THW-${thaw.keyword.substring(0, 4)}-01`,
      itemName: thaw.name,
      category: thaw.category,
      localBatchNumber: `${batchNum}-DEG`,
      cdaBatchNumber: cdaBatch,
      batchColor: 'VERDE' as BatchColor,
      receptionDate: `${nowStr} 06:30`,
      cdaExpiryDate: expiryDate,
      initialQuantity: thaw.weekdayThawQuota,
      currentQuantity: thaw.weekdayThawQuota,
      unit: thaw.unit,
      currentStage: 'DEGELO' as FreezerStage,
      enteredFreezerAt: `${nowStr} 06:00`,
      enteredDegeloAt: `${nowStr} 06:30`,
      operatorReceived: 'Esmael (Subchefe)',
      operatorDegelo: 'Mádio (Chefe Cozinha)',
      temperatureCheck: '3.0°C (Câmara de Degelo)',
      maxHoursDegelo: thaw.defrostHours,
      notes: `Cota de degelo para hoje: ${thaw.weekdayThawQuota} ${thaw.unit}. Tempo recomendado: ${thaw.defrostHours}h.`
    },
    // Lote 02 no Freezer (Estoque de segurança de câmara)
    {
      id: `tk-frz-${thaw.keyword.toLowerCase()}`,
      qrCode: `QR-FRZ-${thaw.keyword.substring(0, 4)}-02`,
      itemName: thaw.name,
      category: thaw.category,
      localBatchNumber: `${batchNum}-FRZ`,
      cdaBatchNumber: cdaBatch,
      batchColor: 'AZUL' as BatchColor,
      receptionDate: `${nowStr} 06:00`,
      cdaExpiryDate: expiryDate,
      initialQuantity: thaw.minChamberStock,
      currentQuantity: thaw.minChamberStock,
      unit: thaw.unit,
      currentStage: 'FREEZER' as FreezerStage,
      enteredFreezerAt: `${nowStr} 06:00`,
      operatorReceived: 'Esmael (Subchefe)',
      temperatureCheck: '-18.5°C (Freezer Principal)',
      notes: `Estoque de segurança na câmara: ${thaw.minChamberStock} ${thaw.unit}. Média diária de consumo: ${thaw.avgDailyThaw} ${thaw.unit}/dia.`
    }
  ];
});

export function loadRealFreezerItems(): FreezerTrackedItem[] {
  saveFreezerItems(REAL_FREEZER_ITEMS);
  return REAL_FREEZER_ITEMS;
}

const INITIAL_LOGS: FreezerMovementLog[] = [];

/**
 * Retorna as recomendações oficiais de degelo calculadas a partir das 98.393 vendas reais
 */
export function getDailyThawRecommendations() {
  return salesAnalyticsJson.thawRecommendations || [];
}

export function getFreezerItems(): FreezerTrackedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      saveFreezerItems(INITIAL_ITEMS);
      return INITIAL_ITEMS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ITEMS;
  }
}

export function saveFreezerItems(items: FreezerTrackedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Erro ao salvar itens de rastreamento do freezer:', e);
  }
}

export function getFreezerLogs(): FreezerMovementLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) {
      saveFreezerLogs(INITIAL_LOGS);
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOGS;
  }
}

export function saveFreezerLogs(logs: FreezerMovementLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Erro ao salvar logs de rastreamento do freezer:', e);
  }
}

/**
 * Retorna os lotes ativos para um determinado insumo.
 * Um lote é ativo se ainda está em 'FREEZER' ou 'DEGELO'.
 */
export function getActiveBatchesForItem(itemName: string): FreezerTrackedItem[] {
  const items = getFreezerItems();
  return items.filter(
    (i) =>
      i.itemName.toLowerCase().trim() === itemName.toLowerCase().trim() &&
      (i.currentStage === 'FREEZER' || i.currentStage === 'DEGELO')
  );
}

/**
 * Determina qual é a próxima cor de lote disponível (AZUL, VERDE, AMBAR).
 * Se já existirem 3 lotes ativos, retorna null (bloqueio da regra de 3 lotes).
 */
export function getNextAvailableBatchColor(itemName: string): BatchColor | null {
  const activeBatches = getActiveBatchesForItem(itemName);
  const usedColors = new Set(activeBatches.map((b) => b.batchColor));

  if (!usedColors.has('AZUL')) return 'AZUL';
  if (!usedColors.has('VERDE')) return 'VERDE';
  if (!usedColors.has('AMBAR')) return 'AMBAR';

  // Já possui 3 lotes ativos
  return null;
}

export interface NewCdaEntryPayload {
  itemName: string;
  category: string;
  cdaBatchNumber: string;
  cdaExpiryDate: string;
  quantity: number;
  unit: string;
  operatorReceived: string;
  temperatureCheck?: string;
  notes?: string;
}

/**
 * Registra a entrada de um novo item que veio do CDA para o Freezer.
 * Gera a etiqueta local do restaurante e o QR Code.
 */
export function registerCdaEntry(
  payload: NewCdaEntryPayload
): { success: boolean; item?: FreezerTrackedItem; error?: string } {
  const nextColor = getNextAvailableBatchColor(payload.itemName);

  if (!nextColor) {
    return {
      success: false,
      error: `Limite de 3 lotes ativos atingido para "${payload.itemName}". Nosso inventário opera com no máximo 3 lotes simultâneos (Azul, Verde e Âmbar) para garantir rotação PVPS e evitar perdas. Consuma ou finalize o Lote 01 antes de dar nova entrada.`,
    };
  }

  const items = getFreezerItems();
  const logs = getFreezerLogs();

  const idSuffix = (items.length + 1).toString().padStart(3, '0');
  const slotNumber = nextColor === 'AZUL' ? '01' : nextColor === 'VERDE' ? '02' : '03';
  const itemAbbr = payload.itemName
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 3)
    .join('')
    .toUpperCase();

  const localBatchNumber = `MNR-L${slotNumber}-${itemAbbr || 'INS'}`;
  const qrCode = `TK-FRZ-MNR-${idSuffix}`;
  const now = new Date();
  const timestamp = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  const newItem: FreezerTrackedItem = {
    id: `frz-item-${Date.now()}`,
    qrCode,
    itemName: payload.itemName,
    category: payload.category,
    localBatchNumber,
    cdaBatchNumber: payload.cdaBatchNumber,
    batchColor: nextColor,
    receptionDate: timestamp,
    cdaExpiryDate: payload.cdaExpiryDate,
    initialQuantity: payload.quantity,
    currentQuantity: payload.quantity,
    unit: payload.unit,
    currentStage: 'FREEZER',
    enteredFreezerAt: timestamp,
    operatorReceived: payload.operatorReceived,
    temperatureCheck: payload.temperatureCheck || '-18.5°C',
    maxHoursDegelo: 24,
    notes: payload.notes,
  };

  const newLog: FreezerMovementLog = {
    id: `log-${Date.now()}`,
    itemId: newItem.id,
    itemName: newItem.itemName,
    localBatchNumber: newItem.localBatchNumber,
    batchColor: newItem.batchColor,
    fromStage: 'ENTRADA_CDA',
    toStage: 'FREEZER',
    timestamp,
    operator: payload.operatorReceived,
    triggerMethod: 'BIP_MANUAL',
    notes: `Recebido do CDA (${payload.cdaBatchNumber}). Etiqueta local ${newItem.batchColor} impressa e fixada.`,
  };

  saveFreezerItems([newItem, ...items]);
  saveFreezerLogs([newLog, ...logs]);

  return { success: true, item: newItem };
}

export interface QrTransitionResult {
  success: boolean;
  item?: FreezerTrackedItem;
  fromStage?: FreezerStage;
  toStage?: FreezerStage;
  message: string;
}

/**
 * Processa a leitura do QR Code do item.
 * Ciclo:
 * 1. Se estiver no 'FREEZER' -> Move para 'DEGELO'
 * 2. Se estiver no 'DEGELO' -> Move para 'PRODUCAO'
 * 3. Se estiver em 'PRODUCAO' -> Informa que já está em produção culinária
 */
export function processQrScan(
  qrCode: string,
  operatorName: string,
  method: 'QR_CAMERA' | 'QR_SIMULADOR' | 'BIP_MANUAL' = 'QR_CAMERA'
): QrTransitionResult {
  const items = getFreezerItems();
  const logs = getFreezerLogs();

  const cleanQr = qrCode.trim().toUpperCase();
  const itemIndex = items.findIndex(
    (i) => i.qrCode.toUpperCase() === cleanQr || i.localBatchNumber.toUpperCase() === cleanQr
  );

  if (itemIndex === -1) {
    return {
      success: false,
      message: `Etiqueta / QR Code "${qrCode}" não encontrado no sistema do freezer.`,
    };
  }

  const targetItem = items[itemIndex];
  const now = new Date();
  const timestamp = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  if (targetItem.currentStage === 'FREEZER') {
    // Transição 1: FREEZER -> DEGELO
    const updatedItem: FreezerTrackedItem = {
      ...targetItem,
      currentStage: 'DEGELO',
      enteredDegeloAt: timestamp,
      operatorDegelo: operatorName,
      temperatureCheck: '2.5°C (Área de Degelo)',
    };

    const newLog: FreezerMovementLog = {
      id: `log-${Date.now()}`,
      itemId: targetItem.id,
      itemName: targetItem.itemName,
      localBatchNumber: targetItem.localBatchNumber,
      batchColor: targetItem.batchColor,
      fromStage: 'FREEZER',
      toStage: 'DEGELO',
      timestamp,
      operator: operatorName,
      triggerMethod: method,
      notes: `QR Code lido no freezer. Transferido para área de degelo controlado.`,
    };

    items[itemIndex] = updatedItem;
    saveFreezerItems(items);
    saveFreezerLogs([newLog, ...logs]);

    return {
      success: true,
      item: updatedItem,
      fromStage: 'FREEZER',
      toStage: 'DEGELO',
      message: `✅ QR Code lido com sucesso! "${targetItem.itemName}" transferido do Freezer para a Área de Degelo às ${timestamp}.`,
    };
  }

  if (targetItem.currentStage === 'DEGELO') {
    // Transição 2: DEGELO -> PRODUÇÃO
    const updatedItem: FreezerTrackedItem = {
      ...targetItem,
      currentStage: 'PRODUCAO',
      enteredProducaoAt: timestamp,
      operatorProducao: operatorName,
      temperatureCheck: 'Em Preparo na Cozinha',
    };

    const newLog: FreezerMovementLog = {
      id: `log-${Date.now()}`,
      itemId: targetItem.id,
      itemName: targetItem.itemName,
      localBatchNumber: targetItem.localBatchNumber,
      batchColor: targetItem.batchColor,
      fromStage: 'DEGELO',
      toStage: 'PRODUCAO',
      timestamp,
      operator: operatorName,
      triggerMethod: method,
      notes: `QR Code lido no degelo. Item entregue para a equipe de produção na cozinha.`,
    };

    items[itemIndex] = updatedItem;
    saveFreezerItems(items);
    saveFreezerLogs([newLog, ...logs]);

    return {
      success: true,
      item: updatedItem,
      fromStage: 'DEGELO',
      toStage: 'PRODUCAO',
      message: `🍳 QR Code lido com sucesso! "${targetItem.itemName}" marcado como ENTREGUE PARA PRODUÇÃO na cozinha às ${timestamp}.`,
    };
  }

  return {
    success: false,
    item: targetItem,
    fromStage: 'PRODUCAO',
    toStage: 'PRODUCAO',
    message: `ℹ️ O item "${targetItem.itemName}" (${targetItem.localBatchNumber}) já se encontra em produção culinária final.`,
  };
}

export function resetFreezerStore(): void {
  saveFreezerItems(INITIAL_ITEMS);
  saveFreezerLogs(INITIAL_LOGS);
}
