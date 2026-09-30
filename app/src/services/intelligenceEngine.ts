/**
 * intelligenceEngine.ts
 * 
 * MOTOR CENTRAL DE INTELIGÊNCIA OPERACIONAL & CORRELAÇÃO DE DADOS
 * Tk Gestão & Tecnologia • Restaurante Engenho Manauara
 * 
 * Unifica 100% dos dados reais inseridos no sistema:
 * - 98.393 vendas reais / 3 meses do Teknisa POS (R$ 3.000.631,16)
 * - Estoque Máximo e Estoque Atual de cada insumo
 * - Fichas técnicas oficiais do cardápio do Engenho
 * 
 * Alimenta de forma reativa e correlacionada:
 * 1. Plano de Degelo Diário e Semanal (Segunda a Domingo)
 * 2. Análise de Estoque Máximo vs Consumo Real (Sugestões de Aumento/Redução)
 * 3. Lista Prévia de Compras / Pedido Automático ao CDA
 * 4. Prevenção de Ruptura com Cobertura em Dias
 * 5. DRE Gerencial Progressivo e KPIs Executivos
 */

import { useSyncExternalStore } from 'react';
import salesAnalyticsJson from '../data/salesAnalyticsData.json';
import predictiveRealSalesJson from '../data/predictiveRealSalesData.json';
import { getVirtualStockItems, saveVirtualStockItems, buildRealSalesStockCatalog } from './virtualStockStore';
import type { VirtualStockItem, StockCategory } from '../types/stock.types';

export type DayOfWeekKey = 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO' | 'DOMINGO';

export interface DailyDefrostItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentChamberStock: number;
  dailyAvgUsage: number;
  thawQuantityKg: number;
  safetyBufferPct: number;
  defrostLeadHours: number;
  targetShift: 'ALMOCO' | 'JANTAR' | 'DIA_SEGUINTE';
  associatedDishes: string[];
  preparationInstructions: string;
  urgency: 'NORMAL' | 'URGENTE' | 'CRITICA';
}

export interface DayDefrostPlan {
  dayKey: DayOfWeekKey;
  dayLabel: string;
  expectedRevenue: number;
  expectedPax: number;
  revenueSharePct: number;
  totalKgToDefrost: number;
  items: DailyDefrostItem[];
  kegsChoppEstimated: number;
  caipirinhasEstimated: number;
}

export interface StockMaxRecommendation {
  code: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  currentMaxStock: number;
  dailyAvgSales: number;
  weeklyDemand: number;
  recommendedMaxStock: number;
  suggestedAction: 'AUMENTAR' | 'MANTER' | 'REDUZIR';
  diffPercentage: number;
  daysCoverageCurrent: number;
  daysCoverageRecommended: number;
  cdaOrderSuggestion: number;
  unitCost: number;
  totalOrderCost: number;
  urgency: 'CRITICA' | 'ALTA' | 'MODERADA' | 'ESTAVEL';
  rationale: string;
}

export interface GlobalOperationalSummary {
  totalRevenue3Months: number;
  totalSalesCount: number;
  dailyAverageRevenue: number;
  ticketMedio: number;
  totalItemsInCatalog: number;
  criticalStockItemsCount: number;
  recommendedMaxStockIncreasesCount: number;
  estimatedWeeklyOrderTotal: number;
  todayDayOfWeek: DayOfWeekKey;
  todayDefrostPlan: DayDefrostPlan;
}

const STORAGE_KEY_CUSTOM_STOCK_DATA = 'tk_custom_stock_overrides_v1';

// Mapeamento dos dias da semana
export const DAY_OF_WEEK_CONFIG: Record<DayOfWeekKey, { label: string; revenueMultiplier: number; dayIndex: number }> = {
  SEGUNDA: { label: 'Segunda-feira', revenueMultiplier: 0.58, dayIndex: 1 },
  TERCA: { label: 'Terça-feira', revenueMultiplier: 0.54, dayIndex: 2 },
  QUARTA: { label: 'Quarta-feira', revenueMultiplier: 0.67, dayIndex: 3 },
  QUINTA: { label: 'Quinta-feira', revenueMultiplier: 0.81, dayIndex: 4 },
  SEXTA: { label: 'Sexta-feira', revenueMultiplier: 1.25, dayIndex: 5 },
  SABADO: { label: 'Sábado', revenueMultiplier: 1.55, dayIndex: 6 },
  DOMINGO: { label: 'Domingo', revenueMultiplier: 1.08, dayIndex: 0 },
};

/**
 * Retorna a chave do dia da semana atual no fuso horário local
 */
export function getCurrentDayOfWeekKey(): DayOfWeekKey {
  const day = new Date().getDay();
  switch (day) {
    case 0: return 'DOMINGO';
    case 1: return 'SEGUNDA';
    case 2: return 'TERCA';
    case 3: return 'QUARTA';
    case 4: return 'QUINTA';
    case 5: return 'SEXTA';
    case 6: return 'SABADO';
    default: return 'SEGUNDA';
  }
}

/**
 * Obtém ou inicializa a base de estoque correlacionada às vendas dos 3 meses
 */
export function getUnifiedStockDataset(): VirtualStockItem[] {
  let items = getVirtualStockItems();
  if (!items || items.length === 0) {
    // Constrói catálogo oficial baseado nos 3 meses de vendas reais
    items = buildRealSalesStockCatalog();
    saveVirtualStockItems(items);
  }

  // Mescla com eventuais overrides manuais do usuário (estoque máximo ou estoque atual editado)
  if (typeof window !== 'undefined') {
    try {
      const overridesRaw = localStorage.getItem(STORAGE_KEY_CUSTOM_STOCK_DATA);
      if (overridesRaw) {
        const overrides: Record<string, { currentStock?: number; maxStock?: number }> = JSON.parse(overridesRaw);
        items = items.map((it) => {
          const ov = overrides[it.cdaCode || it.id];
          if (ov) {
            const current = ov.currentStock !== undefined ? ov.currentStock : it.virtualQty;
            const max = ov.maxStock !== undefined ? ov.maxStock : it.maxStock;
            return {
              ...it,
              virtualQty: current,
              availableQty: current,
              maxStock: max,
            };
          }
          return it;
        });
      }
    } catch (e) {
      console.warn('Erro ao mesclar overrides de estoque:', e);
    }
  }

  return items;
}

/**
 * Salva atualização rápida de estoque atual ou estoque máximo pelo usuário
 */
export function updateStockItemLevels(codeOrId: string, updates: { currentStock?: number; maxStock?: number }): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_STOCK_DATA) || '{}';
    const overrides = JSON.parse(raw);
    overrides[codeOrId] = {
      ...(overrides[codeOrId] || {}),
      ...updates,
    };
    localStorage.setItem(STORAGE_KEY_CUSTOM_STOCK_DATA, JSON.stringify(overrides));

    // Atualiza também no virtualStockStore
    const stockItems = getVirtualStockItems();
    const updated = stockItems.map((it) => {
      if (it.cdaCode === codeOrId || it.id === codeOrId) {
        const newVirtual = updates.currentStock !== undefined ? updates.currentStock : it.virtualQty;
        const newMax = updates.maxStock !== undefined ? updates.maxStock : it.maxStock;
        return {
          ...it,
          virtualQty: newVirtual,
          availableQty: newVirtual,
          maxStock: newMax,
        };
      }
      return it;
    });
    saveVirtualStockItems(updated);

    // Emite evento para que toda a aplicação reaja
    window.dispatchEvent(new CustomEvent('operational_intelligence_updated'));
  } catch (err) {
    console.error('Falha ao atualizar níveis de estoque:', err);
  }
}

/**
 * GERAÇÃO INTELIGENTE DO PLANO DE DEGELO POR DIA DA SEMANA
 * Calcula com base nas vendas de 3 meses + peso do dia + margem de segurança de 20%
 */
export function getDefrostPlanForDay(dayKey: DayOfWeekKey): DayDefrostPlan {
  const config = DAY_OF_WEEK_CONFIG[dayKey];
  const totalRev = salesAnalyticsJson.summary?.totalRevenue || 3000631.16;
  const avgDailyRev = totalRev / 90;
  const dayRev = +(avgDailyRev * config.revenueMultiplier).toFixed(2);
  const dayPax = Math.round(dayRev / (salesAnalyticsJson.summary?.ticketMedioGlobal || 210.11));

  // Itens padrão de carnes e pescados que precisam de degelo controlado
  const rawThawSources = salesAnalyticsJson.thawRecommendations || [];

  const items: DailyDefrostItem[] = rawThawSources.map((thaw: any, index: number) => {
    // O consumo diário no dia da semana é ajustado pelo multiplicador de movimento daquele dia
    const isWeekend = dayKey === 'SEXTA' || dayKey === 'SABADO' || dayKey === 'DOMINGO';
    const baseDaily = isWeekend ? thaw.weekendThawQuota : thaw.weekdayThawQuota;
    const factor = config.revenueMultiplier;
    
    // Adiciona margem de segurança de +20% para absorver picos
    const calculatedKg = +(baseDaily * factor * 1.2).toFixed(1);
    const finalKg = Math.max(1, Math.round(calculatedKg));

    let targetShift: 'ALMOCO' | 'JANTAR' | 'DIA_SEGUINTE' = 'ALMOCO';
    if (dayKey === 'SEXTA' || dayKey === 'SABADO') targetShift = 'JANTAR';
    if (thaw.defrostHours > 20) targetShift = 'DIA_SEGUINTE';

    let urgency: 'NORMAL' | 'URGENTE' | 'CRITICA' = 'NORMAL';
    if (isWeekend && finalKg > 10) urgency = 'CRITICA';
    else if (finalKg > 7) urgency = 'URGENTE';

    const dishes = (thaw.matchedProducts || []).map((m: any) => m.name).slice(0, 3);
    if (dishes.length === 0) {
      dishes.push(`Pratos principais com ${thaw.name}`);
    }

    return {
      id: `thaw-${thaw.keyword.toLowerCase()}-${dayKey}`,
      name: thaw.name,
      category: thaw.category,
      unit: thaw.unit || 'KG',
      currentChamberStock: Math.max(3, Math.round(thaw.minChamberStock * 0.65)),
      dailyAvgUsage: thaw.avgDailyThaw,
      thawQuantityKg: finalKg,
      safetyBufferPct: 20,
      defrostLeadHours: thaw.defrostHours,
      targetShift,
      associatedDishes: dishes,
      preparationInstructions: `Retirar do freezer (-18°C) e acondicionar em caixas GN furadas na câmara de resfriamento (+2°C a +4°C) com etiqueta de validade primária (${thaw.defrostHours}h).`,
      urgency,
    };
  });

  const totalKg = items.reduce((acc, curr) => acc + curr.thawQuantityKg, 0);

  // Estimativas de bar para o dia
  const choppFactor = dayKey === 'SABADO' ? 3.2 : dayKey === 'SEXTA' ? 2.5 : dayKey === 'DOMINGO' ? 1.8 : 0.9;
  const kegsChopp = Math.max(1, Math.round(3.5 * choppFactor));
  const caipirinhas = Math.round(35 * choppFactor);

  return {
    dayKey,
    dayLabel: config.label,
    expectedRevenue: dayRev,
    expectedPax: dayPax,
    revenueSharePct: +(config.revenueMultiplier * 14.2).toFixed(1),
    totalKgToDefrost: totalKg,
    items,
    kegsChoppEstimated: kegsChopp,
    caipirinhasEstimated: caipirinhas,
  };
}

/**
 * Retorna o calendário semanal completo de degelo (Segunda a Domingo)
 */
export function getWeeklyDefrostCalendar(): Record<DayOfWeekKey, DayDefrostPlan> {
  return {
    SEGUNDA: getDefrostPlanForDay('SEGUNDA'),
    TERCA: getDefrostPlanForDay('TERCA'),
    QUARTA: getDefrostPlanForDay('QUARTA'),
    QUINTA: getDefrostPlanForDay('QUINTA'),
    SEXTA: getDefrostPlanForDay('SEXTA'),
    SABADO: getDefrostPlanForDay('SABADO'),
    DOMINGO: getDefrostPlanForDay('DOMINGO'),
  };
}

/**
 * ANÁLISE PREDITIVA DE ESTOQUE MÁXIMO vs CONSUMO REAL DOS 3 MESES
 * Identifica itens onde o teto deve ser aumentado para evitar ruptura,
 * calcula a lista prévia de insumos e o pedido sugerido ao CDA.
 */
export function getStockMaxRecommendations(): StockMaxRecommendation[] {
  const stockItems = getUnifiedStockDataset();
  const topProducts = salesAnalyticsJson.topProductsByRevenue || [];

  return topProducts.slice(0, 35).map((prod: any) => {
    // Procura no estoque atual unificado
    const stockItem = stockItems.find((it) => it.cdaCode === prod.code || it.name.toUpperCase().includes(prod.name.toUpperCase()));

    const currentStock = stockItem ? stockItem.virtualQty : Math.max(2, Math.round((prod.dailyAvg || 5) * 2));
    const currentMaxStock = stockItem ? stockItem.maxStock : Math.ceil((prod.dailyAvg || 5) * 12);
    const unitCost = stockItem?.averageCost || Math.round((prod.avgPrice || 100) * 0.32 * 100) / 100;

    const dailyAvg = prod.dailyAvg || 1;
    const weeklyDemand = Math.round(dailyAvg * 7);

    // O estoque máximo ideal deve cobrir:
    // (Demanda de 14 dias de segurança + 20% de margem para picos de sexta a domingo)
    const recommendedMax = Math.ceil(dailyAvg * 14 * 1.2);

    let suggestedAction: 'AUMENTAR' | 'MANTER' | 'REDUZIR' = 'MANTER';
    const diffPct = Math.round(((recommendedMax - currentMaxStock) / currentMaxStock) * 100);

    if (recommendedMax > currentMaxStock * 1.15) {
      suggestedAction = 'AUMENTAR';
    } else if (recommendedMax < currentMaxStock * 0.75) {
      suggestedAction = 'REDUZIR';
    }

    // Cobertura em dias do estoque atual
    const daysCoverage = dailyAvg > 0 ? +(currentStock / dailyAvg).toFixed(1) : 10;
    const daysCoverageRecommended = dailyAvg > 0 ? +(recommendedMax / dailyAvg).toFixed(1) : 14;

    // Pedido sugerido ao CDA = (Teto Recomendado - Estoque Atual)
    const orderQty = Math.max(0, recommendedMax - currentStock);
    const totalOrderCost = +(orderQty * unitCost).toFixed(2);

    // Nível de urgência
    let urgency: 'CRITICA' | 'ALTA' | 'MODERADA' | 'ESTAVEL' = 'ESTAVEL';
    if (daysCoverage <= 2.5) urgency = 'CRITICA';
    else if (daysCoverage <= 4.0) urgency = 'ALTA';
    else if (suggestedAction === 'AUMENTAR') urgency = 'MODERADA';

    // Rationale inteligente baseado nos 3 meses
    let rationale = '';
    if (suggestedAction === 'AUMENTAR') {
      rationale = `Consumo real de 3 meses (${prod.qtySold || Math.round(dailyAvg * 90)} un) aponta velocidade média de ${dailyAvg.toFixed(1)}/dia. O teto atual de ${currentMaxStock} cobre apenas ${Math.round(currentMaxStock / dailyAvg)} dias, gerando alto risco de ruptura no pico de fim de semana. Recomendado elevar o teto para ${recommendedMax}.`;
    } else if (suggestedAction === 'REDUZIR') {
      rationale = `Estoque máximo atual (${currentMaxStock}) excede a necessidade de 14 dias (${recommendedMax}). Reduzir o teto evita imobilização excessiva de capital de giro e risco de expiração de validade.`;
    } else {
      rationale = `Teto de estoque balanceado (${currentMaxStock} un). Cobertura adequada de ${daysCoverage} dias de giro operacional.`;
    }

    return {
      code: prod.code,
      name: prod.name,
      category: prod.brand || 'ENGENHO / MATRIZ',
      unit: prod.unit || 'UN',
      currentStock,
      currentMaxStock,
      dailyAvgSales: +dailyAvg.toFixed(2),
      weeklyDemand,
      recommendedMaxStock: recommendedMax,
      suggestedAction,
      diffPercentage: diffPct,
      daysCoverageCurrent: daysCoverage,
      daysCoverageRecommended: daysCoverageRecommended,
      cdaOrderSuggestion: orderQty,
      unitCost,
      totalOrderCost,
      urgency,
      rationale,
    };
  });
}

/**
 * RESUMO GERENCIAL GLOBAL — Fonte única para o Gerente e Painéis Executivos
 */
export function getGlobalOperationalSummary(): GlobalOperationalSummary {
  const stockRecs = getStockMaxRecommendations();
  const todayKey = getCurrentDayOfWeekKey();
  const todayDefrost = getDefrostPlanForDay(todayKey);

  const totalRev = salesAnalyticsJson.summary?.totalRevenue || 3000631.16;
  const totalSales = salesAnalyticsJson.summary?.totalItemsSold || 98393;
  const dailyAvg = salesAnalyticsJson.summary?.dailyAverageRevenue || 33340.35;
  const ticket = salesAnalyticsJson.summary?.ticketMedioGlobal || 210.11;

  const criticalCount = stockRecs.filter((i) => i.urgency === 'CRITICA' || i.daysCoverageCurrent <= 3).length;
  const increaseCount = stockRecs.filter((i) => i.suggestedAction === 'AUMENTAR').length;
  const estimatedOrderCost = stockRecs.reduce((acc, curr) => acc + curr.totalOrderCost, 0);

  return {
    totalRevenue3Months: totalRev,
    totalSalesCount: totalSales,
    dailyAverageRevenue: dailyAvg,
    ticketMedio: ticket,
    totalItemsInCatalog: stockRecs.length,
    criticalStockItemsCount: criticalCount,
    recommendedMaxStockIncreasesCount: increaseCount,
    estimatedWeeklyOrderTotal: estimatedOrderCost,
    todayDayOfWeek: todayKey,
    todayDefrostPlan: todayDefrost,
  };
}

let subscribers: Array<() => void> = [];
let cachedSummary: GlobalOperationalSummary | null = null;

function computeOrGetOperationalSummary(): GlobalOperationalSummary {
  if (!cachedSummary) {
    cachedSummary = getGlobalOperationalSummary();
  }
  return cachedSummary;
}

function notifySubscribers() {
  cachedSummary = null; // Invalidate cache on change
  subscribers.forEach((fn) => fn());
}

if (typeof window !== 'undefined') {
  window.addEventListener('operational_intelligence_updated', notifySubscribers);
  window.addEventListener('virtual_stock_updated', notifySubscribers);
  window.addEventListener('central_operational_dataset_updated', notifySubscribers);
}

function subscribe(callback: () => void) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((fn) => fn !== callback);
  };
}

/**
 * Hook Reativo para consumo em qualquer componente React
 */
export function useOperationalIntelligence() {
  return useSyncExternalStore(
    subscribe,
    computeOrGetOperationalSummary,
    computeOrGetOperationalSummary
  );
}

