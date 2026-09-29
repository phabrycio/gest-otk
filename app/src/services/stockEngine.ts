// ============================================================
// MOTOR DE ESTOQUE VIRTUAL — Lógica de cálculo pura
// Tk Gestão e Tecnologia
// ============================================================

import type {
  VirtualStockItem,
  StockEngineConfig,
  StockMovement,
  NfRecord,
  SalesImport,
  CancellationRecord,
  StockAlert,
  ForecastedOrder,
  ForecastedOrderItem,
  StockHealthScore,
} from '../types/stock.types';

// ---- Cálculo de Status de Item ----

export function computeItemStatus(
  item: VirtualStockItem
): VirtualStockItem['status'] {
  const { availableQty, minStock, safetyStock } = item;
  if (availableQty <= 0) return 'RUPTURA';
  if (availableQty <= minStock) return 'CRITICAL';
  if (availableQty <= safetyStock) return 'ATTENTION';
  return 'SAFE';
}

// ---- Estimativa de Dias até Ruptura ----

export function estimateDaysUntilRuptura(
  item: VirtualStockItem,
  avgDailyConsumption: number
): number | null {
  if (avgDailyConsumption <= 0) return null;
  return parseFloat((item.availableQty / avgDailyConsumption).toFixed(1));
}

// ---- Consumo Teórico com Margem de Erro ----
// Aplica os fatores de margem para refletir perdas operacionais reais

export function applyErrorMargin(
  theoreticalConsumption: number,
  config: StockEngineConfig,
  itemErrorMarginPct?: number
): number {
  const margin = itemErrorMarginPct ?? config.globalErrorMarginPct;
  return theoreticalConsumption * (1 + margin / 100);
}

// ---- Calcula consumo por item a partir de importação de vendas ----

export function calcConsumptionFromSales(
  salesImport: SalesImport,
  config: StockEngineConfig
): Map<string, number> {
  const consumptionMap = new Map<string, number>(); // itemId → qty consumed

  for (const line of salesImport.lines) {
    const effectiveQty = line.qtyDelivered; // Só conta o que foi entregue
    for (const consumption of line.theoreticalConsumption) {
      if (!consumption.stockItemId) continue;
      const theoretical = consumption.qty * effectiveQty;
      const withMargin = applyErrorMargin(theoretical, config);
      const current = consumptionMap.get(consumption.stockItemId) ?? 0;
      consumptionMap.set(consumption.stockItemId, current + withMargin);
    }
  }

  return consumptionMap;
}

// ---- Aplica cancelamentos ao mapa de consumo ----
// Cancelamentos com INSUMO_CONSUMIDO → já foram consumidos (nada a devolver)
// Cancelamentos com INSUMO_NAO_CONSUMIDO → deduz do consumo (insumo não saiu)

export function applyCancellations(
  consumptionMap: Map<string, number>,
  cancellations: CancellationRecord[],
  recipes: { id: string; ingredients: Array<{ stockItemId?: string; qty: number }> }[]
): Map<string, number> {
  const adjusted = new Map(consumptionMap);

  for (const cancel of cancellations) {
    if (cancel.consumptionStatus === 'INSUMO_NAO_CONSUMIDO') {
      // Retorna o insumo ao estoque — reduz consumo calculado
      const recipe = recipes.find((r) => r.id === cancel.recipeId);
      if (!recipe) continue;
      for (const ing of recipe.ingredients) {
        if (!ing.stockItemId) continue;
        const qtyToReturn = ing.qty * cancel.qty;
        const current = adjusted.get(ing.stockItemId) ?? 0;
        adjusted.set(ing.stockItemId, Math.max(0, current - qtyToReturn));
      }
    }
    // INSUMO_CONSUMIDO → mantém o consumo (perda operacional)
  }

  return adjusted;
}

// ---- Processa entrada de NF no estoque ----

export function processNfEntry(
  items: VirtualStockItem[],
  nf: NfRecord
): VirtualStockItem[] {
  const updatedItems = items.map((item) => ({ ...item }));

  for (const nfItem of nf.items) {
    if (!nfItem.cdaCode && !nfItem.name) continue;
    const found = updatedItems.find(
      (i) =>
        (nfItem.cdaCode && i.cdaCode === nfItem.cdaCode) ||
        i.name.toLowerCase() === nfItem.name.toLowerCase()
    );
    if (!found) continue;

    found.virtualQty += nfItem.qty;
    found.availableQty = found.virtualQty - found.reservedQty;
    found.lastCost = nfItem.unitCost;
    // Custo médio ponderado
    const totalBefore = found.virtualQty - nfItem.qty;
    found.averageCost =
      totalBefore > 0
        ? (found.averageCost * totalBefore + nfItem.unitCost * nfItem.qty) /
          found.virtualQty
        : nfItem.unitCost;
    found.status = computeItemStatus(found);
    found.lastMovementAt = nf.receiptDate;
  }

  return updatedItems;
}

// ---- Atualiza estoque com consumo calculado ----

export function applyConsumption(
  items: VirtualStockItem[],
  consumptionMap: Map<string, number>,
  timestamp: string
): VirtualStockItem[] {
  return items.map((item) => {
    const consumed = consumptionMap.get(item.id) ?? 0;
    if (consumed === 0) return item;
    const newQty = Math.max(0, item.virtualQty - consumed);
    return {
      ...item,
      virtualQty: parseFloat(newQty.toFixed(3)),
      availableQty: parseFloat(Math.max(0, newQty - item.reservedQty).toFixed(3)),
      status: computeItemStatus({ ...item, virtualQty: newQty, availableQty: newQty - item.reservedQty }),
      lastMovementAt: timestamp,
    };
  });
}

// ---- Geração de Alertas Inteligentes ----

export function generateAlerts(
  items: VirtualStockItem[],
  batches: { expiryDate: string | null; daysUntilExpiry: number | null; itemName: string; currentQty: number; unitCost: number; batchNumber: string }[],
  config: StockEngineConfig
): StockAlert[] {
  const alerts: StockAlert[] = [];
  const now = new Date().toISOString();

  // Alertas por item
  for (const item of items) {
    if (item.status === 'RUPTURA') {
      alerts.push({
        id: `ALT-GEN-${item.id}-RUPTURA`,
        itemId: item.id, itemName: item.name,
        severity: 'RUPTURA', type: 'RUPTURA_IMINENTE',
        title: `🔴 RUPTURA: ${item.name}`,
        description: `Estoque virtual: ${item.availableQty} ${item.unit}. Item esgotado ou negativo. Risco de 86 imediato.`,
        suggestedAction: 'Retirar do cardápio imediatamente. Acionar fornecedor para entrega emergencial.',
        financialImpact: item.minStock * item.averageCost,
        createdAt: now, isRead: false, isDismissed: false,
      });
    } else if (item.status === 'CRITICAL') {
      const days = item.daysUntilRuptura;
      alerts.push({
        id: `ALT-GEN-${item.id}-CRITICAL`,
        itemId: item.id, itemName: item.name,
        severity: 'CRITICAL', type: 'ESTOQUE_BAIXO',
        title: `🟠 CRÍTICO: ${item.name} — ${days ? `${days} dias` : 'abaixo do mínimo'}`,
        description: `Estoque virtual: ${item.availableQty} ${item.unit}. Mínimo configurado: ${item.minStock} ${item.unit}.`,
        suggestedAction: `Incluir no próximo pedido CDA. Lead time: ${item.orderLeadTimeDays} dia(s).`,
        financialImpact: (item.minStock - item.availableQty) * item.averageCost,
        createdAt: now, isRead: false, isDismissed: false,
      });
    } else if (item.status === 'ATTENTION') {
      alerts.push({
        id: `ALT-GEN-${item.id}-ATTENTION`,
        itemId: item.id, itemName: item.name,
        severity: 'WARNING', type: 'ESTOQUE_BAIXO',
        title: `🟡 ATENÇÃO: ${item.name} — zona de reposição`,
        description: `Estoque virtual: ${item.availableQty} ${item.unit}. Zona de segurança atingida.`,
        suggestedAction: 'Planejar reposição no próximo pedido.',
        createdAt: now, isRead: false, isDismissed: false,
      });
    }
  }

  // Alertas de validade
  for (const batch of batches) {
    if (batch.daysUntilExpiry !== null && batch.daysUntilExpiry <= 3 && batch.currentQty > 0) {
      const riskValue = batch.currentQty * batch.unitCost;
      alerts.push({
        id: `ALT-GEN-EXP-${batch.batchNumber}`,
        itemName: batch.itemName,
        severity: batch.daysUntilExpiry <= 1 ? 'CRITICAL' : 'WARNING',
        type: 'VALIDADE_PROXIMA',
        title: `⏰ Validade em ${batch.daysUntilExpiry} dia(s): ${batch.itemName} (Lote ${batch.batchNumber})`,
        description: `${batch.currentQty} unidades no valor de R$ ${riskValue.toFixed(2)} em risco de vencimento.`,
        suggestedAction: 'Criar promoção urgente ou incluir como prato do dia para escoar o estoque.',
        financialImpact: riskValue,
        createdAt: now, isRead: false, isDismissed: false,
      });
    }
  }

  return alerts;
}

// ---- Geração de Pedido de Reposição ----

export function generateForecastedOrder(
  items: VirtualStockItem[],
  avgDailyConsumptions: Map<string, number>,
  config: StockEngineConfig
): ForecastedOrder {
  const now = new Date();
  const orderItems: ForecastedOrderItem[] = [];

  for (const item of items) {
    const avgDaily = avgDailyConsumptions.get(item.id) ?? 0;
    if (avgDaily <= 0 && item.status === 'SAFE') continue;

    const forecastedConsumption = avgDaily * config.forecastWindowDays;
    const needed = forecastedConsumption - item.availableQty;
    if (needed <= 0 && item.status !== 'CRITICAL' && item.status !== 'RUPTURA') continue;

    const withSafety = Math.max(item.minOrderQty, needed * 1.1);
    // Arredonda ao múltiplo do lote mínimo de pedido
    const roundedQty =
      Math.ceil(withSafety / item.orderQtyMultiple) * item.orderQtyMultiple;

    orderItems.push({
      itemId: item.id,
      itemName: item.name,
      unit: item.unit,
      currentVirtualQty: item.availableQty,
      avgDailyConsumption: parseFloat(avgDaily.toFixed(2)),
      forecastedConsumption7Days: parseFloat(forecastedConsumption.toFixed(2)),
      suggestedOrderQty: roundedQty,
      unitCost: item.averageCost,
      totalCost: parseFloat((roundedQty * item.averageCost).toFixed(2)),
      urgency:
        item.status === 'RUPTURA'
          ? 'CRITICO'
          : item.status === 'CRITICAL'
          ? 'URGENTE'
          : 'NORMAL',
      reasoning: `Consumo médio: ${avgDaily.toFixed(1)} ${item.unit}/dia. Cobertura atual: ${item.daysUntilRuptura ?? 'N/A'} dias. Pedido com 10% de segurança arredondado ao lote de ${item.orderQtyMultiple} ${item.unit}.`,
    });
  }

  const deliveryDate = new Date(now);
  deliveryDate.setDate(deliveryDate.getDate() + 1);

  return {
    id: `PED-SUGE-${Date.now()}`,
    generatedAt: now.toISOString(),
    referenceDate: now.toISOString().split('T')[0],
    deliveryDateEstimate: deliveryDate.toISOString().split('T')[0],
    status: 'SUGERIDO',
    items: orderItems,
    totalValue: orderItems.reduce((sum, i) => sum + i.totalCost, 0),
    notes: `Gerado automaticamente. ${orderItems.filter((i) => i.urgency === 'CRITICO').length} itens em situação crítica.`,
  };
}

// ---- Score de Saúde do Estoque ----

export function computeHealthScore(
  items: VirtualStockItem[],
  batches: { daysUntilExpiry: number | null; currentQty: number }[],
  cmvDeviation: number
): StockHealthScore {
  const now = new Date().toISOString().split('T')[0];

  const rupturaCount = items.filter((i) => i.status === 'RUPTURA').length;
  const criticalCount = items.filter((i) => i.status === 'CRITICAL').length;
  const attentionCount = items.filter((i) => i.status === 'ATTENTION').length;
  const expiryCount = batches.filter(
    (b) => b.daysUntilExpiry !== null && b.daysUntilExpiry <= 3 && b.currentQty > 0
  ).length;

  const avgCoverage =
    items
      .filter((i) => i.daysUntilRuptura !== null)
      .reduce((s, i) => s + (i.daysUntilRuptura ?? 0), 0) /
    Math.max(1, items.filter((i) => i.daysUntilRuptura !== null).length);

  // Score components (each 0–100)
  const coverageScore = Math.min(100, (avgCoverage / 7) * 100);
  const rupturaScore = Math.max(0, 100 - rupturaCount * 30 - criticalCount * 15 - attentionCount * 5);
  const expiryScore = Math.max(0, 100 - expiryCount * 20);
  const cmvScore = Math.max(0, 100 - cmvDeviation * 10);

  const overall = Math.round(
    coverageScore * 0.35 +
    rupturaScore * 0.35 +
    expiryScore * 0.15 +
    cmvScore * 0.15
  );

  const grade =
    overall >= 85 ? 'A' :
    overall >= 70 ? 'B' :
    overall >= 55 ? 'C' :
    overall >= 40 ? 'D' : 'F';

  const aiSummary =
    overall >= 85
      ? 'Estoque saudável. Continue monitorando os itens de Curva A diariamente.'
      : overall >= 70
      ? 'Situação controlada. Alguns itens merecem atenção no próximo pedido CDA.'
      : overall >= 55
      ? 'Atenção necessária. Há itens em zona crítica que exigem ação antes do próximo turno.'
      : overall >= 40
      ? 'Situação crítica. Múltiplos itens abaixo do mínimo. Acione o CDA imediatamente.'
      : 'ALERTA MÁXIMO. Risco de ruptura generalizada. Revisão urgente do estoque e pedido emergencial necessários.';

  return {
    date: now,
    overall,
    breakdown: {
      coverageDays: parseFloat(avgCoverage.toFixed(1)),
      ruptureDangerCount: rupturaCount + criticalCount,
      expiryAlertCount: expiryCount,
      divergencePct: parseFloat(cmvDeviation.toFixed(1)),
      cmvRealVsTheoretical: parseFloat(cmvDeviation.toFixed(1)),
    },
    grade,
    aiSummary,
  };
}
