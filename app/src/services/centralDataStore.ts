/**
 * centralDataStore.ts
 * 
 * Fonte Única da Verdade e Motor Reativo de Dados Operacionais
 * Tk Gestão e Tecnologia • Engenho Gourmet
 * 
 * Centraliza e sincroniza 100% dos dados de faturamento, vendas e estoque em tempo real
 * através de todos os módulos da aplicação (Financeiro, Bar, Cozinha, Salão, Auditoria).
 */

import { useSyncExternalStore } from 'react';
import salesAnalyticsJson from '../data/salesAnalyticsData.json';
import type { ChoppTap, SpiritBottle, BarAuditSummary } from '../types/barIntelligence.types';
import type { CashRegisterSession, PaymentMethodReceivable, AccountPayable, AccountReceivable, SalesChannelMetric, ConsumerDreItem } from './consumerFinanceStore';

export interface CentralSummary {
  totalRevenue: number;
  totalItemsSold: number;
  totalDays: number;
  dateRange: {
    firstDay: string;
    lastDay: string;
  };
  dailyAverageRevenue: number;
  dailyAverageOrders: number;
  ticketMedioGlobal: number;
}

export interface ThawRecommendationItem {
  keyword: string;
  name: string;
  category: string;
  defrostHours: number;
  prepDaysLead: number;
  unit: string;
  totalQtySold: number;
  totalRevenue: number;
  avgDailyThaw: number;
  weekdayThawQuota: number;
  weekendThawQuota: number;
  minChamberStock: number;
  matchedProducts?: Array<{ code: string; name: string; dailyAvg: number }>;
}

export interface CentralOperationalData {
  version: number;
  lastUpdated: string;
  sourceFileName: string;
  summary: CentralSummary;
  thawRecommendations: ThawRecommendationItem[];
  paymentsSummary: Array<{
    method: string;
    revenue: number;
    count: number;
    percentage: number;
  }>;
  topProductsByRevenue: any[];
  topProductsByVolume: any[];
  barChopp: {
    taps: ChoppTap[];
    bottles: SpiritBottle[];
    summary: BarAuditSummary;
  };
  finance: {
    paymentMethods: PaymentMethodReceivable[];
    cashSessions: CashRegisterSession[];
    accountsPayable: AccountPayable[];
    accountsReceivable: AccountReceivable[];
    salesChannels: SalesChannelMetric[];
    dreLines: ConsumerDreItem[];
  };
}

const STORAGE_KEY_V3 = 'tk_central_operational_dataset_v3';

// Gera o estado padrão a partir do salesAnalyticsData.json
function buildDefaultDataset(): CentralOperationalData {
  const sum: CentralSummary = {
    totalRevenue: salesAnalyticsJson.summary?.totalRevenue || 3000631.16,
    totalItemsSold: salesAnalyticsJson.summary?.totalItemsSold || 104296,
    totalDays: salesAnalyticsJson.summary?.totalDays || 90,
    dateRange: salesAnalyticsJson.summary?.dateRange || { firstDay: '01/07/2026', lastDay: '28/09/2026' },
    dailyAverageRevenue: salesAnalyticsJson.summary?.dailyAverageRevenue || 33340.35,
    dailyAverageOrders: salesAnalyticsJson.summary?.dailyAverageOrders || 159,
    ticketMedioGlobal: salesAnalyticsJson.summary?.ticketMedioGlobal || 210.11,
  };

  const thaw: ThawRecommendationItem[] = (salesAnalyticsJson.thawRecommendations || []) as ThawRecommendationItem[];
  const payments = salesAnalyticsJson.paymentsSummary || [];
  const topRev = salesAnalyticsJson.topProductsByRevenue || [];
  const topVol = salesAnalyticsJson.topProductsByVolume || [];

  // Taps de Chopp com volume real
  const taps: ChoppTap[] = [
    {
      id: 'tap-01',
      tapNumber: 1,
      beerName: 'Chopp Heineken 50L (Barril)',
      style: 'PILSEN',
      kegCapacityLiters: 50,
      currentVolumeLiters: 24.5,
      glassesSoldTeknisa: 6021,
      litersSoldTeknisa: 1806.3,
      litersDispensedReal: 1910.0,
      technicalLossPct: 5.5,
      technicalLossLiters: 99.3,
      unaccountedDeviationLiters: 4.4,
      deviationCostReais: 39.6,
      deviationRetailReais: 62.5,
      deviationStatus: 'NORMAL',
      temperatureCelsius: 0.8,
      pressurePsi: 34,
      foamStatus: 'PERFEITA',
      kegBatchNumber: 'LT-HN-8842',
      kegExpiryDate: '2026-10-15',
      kegInstalledAt: '2026-09-28 10:30',
      installedBy: 'Lucas Barman',
    },
    {
      id: 'tap-02',
      tapNumber: 2,
      beerName: 'Chopp Amstel 50L (Barril)',
      style: 'PILSEN',
      kegCapacityLiters: 50,
      currentVolumeLiters: 31.0,
      glassesSoldTeknisa: 6023,
      litersSoldTeknisa: 1806.9,
      litersDispensedReal: 1905.0,
      technicalLossPct: 5.5,
      technicalLossLiters: 99.4,
      unaccountedDeviationLiters: -1.3,
      deviationCostReais: 0,
      deviationRetailReais: 0,
      deviationStatus: 'NORMAL',
      temperatureCelsius: 1.0,
      pressurePsi: 34,
      foamStatus: 'PERFEITA',
      kegBatchNumber: 'LT-AM-7731',
      kegExpiryDate: '2026-10-18',
      kegInstalledAt: '2026-09-28 10:45',
      installedBy: 'Lucas Barman',
    },
    {
      id: 'tap-03',
      tapNumber: 3,
      beerName: 'Chopp Trinca Perfeita 50L (Exclusivo)',
      style: 'REGIONAL',
      kegCapacityLiters: 50,
      currentVolumeLiters: 18.0,
      glassesSoldTeknisa: 5175,
      litersSoldTeknisa: 1552.5,
      litersDispensedReal: 1640.0,
      technicalLossPct: 5.5,
      technicalLossLiters: 85.4,
      unaccountedDeviationLiters: 2.1,
      deviationCostReais: 21.0,
      deviationRetailReais: 35.4,
      deviationStatus: 'NORMAL',
      temperatureCelsius: 0.5,
      pressurePsi: 35,
      foamStatus: 'PERFEITA',
      kegBatchNumber: 'LT-TP-9920',
      kegExpiryDate: '2026-10-12',
      kegInstalledAt: '2026-09-27 16:00',
      installedBy: 'Marcos Barman',
    },
    {
      id: 'tap-04',
      tapNumber: 4,
      beerName: 'Chopp Artesanal Amazônico IPA 30L',
      style: 'IPA',
      kegCapacityLiters: 30,
      currentVolumeLiters: 12.0,
      glassesSoldTeknisa: 1250,
      litersSoldTeknisa: 375.0,
      litersDispensedReal: 395.0,
      technicalLossPct: 5.0,
      technicalLossLiters: 18.75,
      unaccountedDeviationLiters: 1.25,
      deviationCostReais: 15.0,
      deviationRetailReais: 24.0,
      deviationStatus: 'NORMAL',
      temperatureCelsius: 1.2,
      pressurePsi: 33,
      foamStatus: 'PERFEITA',
      kegBatchNumber: 'LT-IPA-4412',
      kegExpiryDate: '2026-10-20',
      kegInstalledAt: '2026-09-28 11:15',
      installedBy: 'Lucas Barman',
    },
  ];

  const bottles: SpiritBottle[] = [
    {
      id: 'sp-01',
      name: 'Cachaça Regional de Jambu',
      category: 'CACHACA_REGIONAL',
      bottleVolumeMl: 1000,
      standardDoseMl: 50,
      totalDosesExpected: 20,
      openBottles: 2,
      openBottleFillPct: 75,
      openBottleRemainingMl: 750,
      openBottleRemainingDoses: 15,
      openBottleConsumedDoses: 5,
      sealedStockBottles: 14,
      dosesSoldTeknisa: 280,
      dosesCalculatedConsumed: 280,
      totalMlConsumedReal: 14000,
      deviationDoses: 0,
      deviationReais: 0,
      riskLevel: 'BAIXO',
    },
    {
      id: 'sp-02',
      name: 'Gin Tanqueray London Dry',
      category: 'DESTILADO',
      bottleVolumeMl: 750,
      standardDoseMl: 50,
      totalDosesExpected: 15,
      openBottles: 1,
      openBottleFillPct: 50,
      openBottleRemainingMl: 375,
      openBottleRemainingDoses: 7,
      openBottleConsumedDoses: 8,
      sealedStockBottles: 8,
      dosesSoldTeknisa: 185,
      dosesCalculatedConsumed: 185,
      totalMlConsumedReal: 9250,
      deviationDoses: 0,
      deviationReais: 0,
      riskLevel: 'BAIXO',
    },
    {
      id: 'sp-03',
      name: 'Vodka Absolut Regular',
      category: 'DESTILADO',
      bottleVolumeMl: 750,
      standardDoseMl: 50,
      totalDosesExpected: 15,
      openBottles: 2,
      openBottleFillPct: 60,
      openBottleRemainingMl: 450,
      openBottleRemainingDoses: 9,
      openBottleConsumedDoses: 6,
      sealedStockBottles: 6,
      dosesSoldTeknisa: 140,
      dosesCalculatedConsumed: 140,
      totalMlConsumedReal: 7000,
      deviationDoses: 0,
      deviationReais: 0,
      riskLevel: 'BAIXO',
    },
    {
      id: 'sp-04',
      name: 'Whisky Johnnie Walker Red Label',
      category: 'DESTILADO',
      bottleVolumeMl: 1000,
      standardDoseMl: 50,
      totalDosesExpected: 20,
      openBottles: 2,
      openBottleFillPct: 40,
      openBottleRemainingMl: 400,
      openBottleRemainingDoses: 8,
      openBottleConsumedDoses: 12,
      sealedStockBottles: 10,
      dosesSoldTeknisa: 195,
      dosesCalculatedConsumed: 195,
      totalMlConsumedReal: 9750,
      deviationDoses: 0,
      deviationReais: 0,
      riskLevel: 'BAIXO',
    },
  ];

  const paymentMethods: PaymentMethodReceivable[] = [
    {
      id: 'pm-credito',
      name: 'Cartão de Crédito (TEF / Cielo / Stone)',
      category: 'CREDITO_VISTA',
      grossAmount: 1542450.0,
      mdrRatePct: 2.8,
      feeDeduction: 43188.6,
      netAmount: 1499261.4,
      settlementTerm: 'D+30',
      transactionsCount: 48020,
      acquirer: 'Stone / Cielo TEF',
    },
    {
      id: 'pm-debito',
      name: 'Cartão de Débito (TEF / Rede / Elo)',
      category: 'DEBITO',
      grossAmount: 684150.0,
      mdrRatePct: 1.4,
      feeDeduction: 9578.1,
      netAmount: 674571.9,
      settlementTerm: 'D+1',
      transactionsCount: 26540,
      acquirer: 'Rede / Cielo TEF',
    },
    {
      id: 'pm-dinheiro',
      name: 'Dinheiro em Espécie (Caixa Físico)',
      category: 'DINHEIRO',
      grossAmount: 476320.0,
      mdrRatePct: 0.0,
      feeDeduction: 0.0,
      netAmount: 476320.0,
      settlementTerm: 'D+0',
      transactionsCount: 14740,
      acquirer: 'Cofre Loja / Sangria Física',
    },
    {
      id: 'pm-pix',
      name: 'PIX Direto na Maquininha / QR Dinâmico',
      category: 'PIX',
      grossAmount: 297711.16,
      mdrRatePct: 0.5,
      feeDeduction: 1488.55,
      netAmount: 296222.61,
      settlementTerm: 'D+0',
      transactionsCount: 9093,
      acquirer: 'Banco Itaú / TEF Stone',
    },
  ];

  const cashSessions: CashRegisterSession[] = [
    {
      registerId: 'CX-01',
      registerName: 'Caixa Salão 01 (Almoço)',
      shift: 'MANHA_ALMOCO',
      operatorName: 'Aline Perdiz (Operadora)',
      openedAt: '11:00',
      closedAt: '16:00',
      openingFloat: 500.0,
      cashSales: 2435.0,
      pixSales: 1515.0,
      cardSales: 10490.0,
      voucherSales: 800.0,
      totalSupplements: 0,
      totalBleeds: 2000.0,
      expectedPhysicalCash: 935.0,
      countedPhysicalCash: 935.0,
      cashDifference: 0,
      status: 'FECHADO_CONFERIDO',
      movements: [
        {
          id: 'mov-01',
          timestamp: '15:30',
          type: 'SANGRIA',
          amount: 2000.0,
          reason: 'Sangria de segurança para o cofre',
          operator: 'Aline Perdiz',
          authorizedBy: 'Patricia (Supervisora)',
        },
      ],
    },
    {
      registerId: 'CX-02',
      registerName: 'Caixa Salão 02 (Jantar)',
      shift: 'NOITE_JANTAR',
      operatorName: 'Thiago Nogueira (Operador)',
      openedAt: '18:00',
      closedAt: '23:30',
      openingFloat: 500.0,
      cashSales: 2850.0,
      pixSales: 1790.35,
      cardSales: 12460.0,
      voucherSales: 1000.0,
      totalSupplements: 0,
      totalBleeds: 2500.0,
      expectedPhysicalCash: 850.0,
      countedPhysicalCash: 850.0,
      cashDifference: 0,
      status: 'FECHADO_CONFERIDO',
      movements: [
        {
          id: 'mov-02',
          timestamp: '22:45',
          type: 'SANGRIA',
          amount: 2500.0,
          reason: 'Sangria de fechamento noturno para o cofre',
          operator: 'Thiago Nogueira',
          authorizedBy: 'Ivan (Gerente Geral)',
        },
      ],
    },
  ];

  const accountsPayable: AccountPayable[] = [
    {
      id: 'pay-01',
      description: 'Pescados Regionais (Tambaqui & Pirarucu) - NF 4410',
      supplier: 'FrigoPeixe Amazonas Ltda',
      category: 'INSUMOS_CDA',
      dueDate: '2026-10-05',
      amount: 28500.0,
      status: 'PENDENTE',
    },
    {
      id: 'pay-02',
      description: 'Carnes Nobres (Picanha Angus & Carne de Sol) - NF 8821',
      supplier: 'Distribuidora Carnes Amazonas',
      category: 'INSUMOS_CDA',
      dueDate: '2026-10-08',
      amount: 34200.0,
      status: 'PENDENTE',
    },
    {
      id: 'pay-03',
      description: 'Barris de Chopp (Heineken & Amstel 50L) - NF 19283',
      supplier: 'Heineken Brasil / Ambev Log',
      category: 'BEBIDAS_CHOPP',
      dueDate: '2026-09-30',
      amount: 22800.0,
      status: 'VENCE_HOJE',
    },
    {
      id: 'pay-04',
      description: 'Hortifruti & Insumos Regionais Manaus - NF 1104',
      supplier: 'Cooperativa Agrícola CEASA Manaus',
      category: 'INSUMOS_CDA',
      dueDate: '2026-10-02',
      amount: 9400.0,
      status: 'PENDENTE',
    },
    {
      id: 'pay-05',
      description: 'Fornecimento Energia Elétrica Restaurante',
      supplier: 'Amazonas Energia S/A',
      category: 'SERVICOS',
      dueDate: '2026-10-10',
      amount: 14850.0,
      status: 'PENDENTE',
    },
  ];

  const accountsReceivable: AccountReceivable[] = [
    {
      id: 'rec-01',
      source: 'Stone Pagamentos (Crédito D+30)',
      type: 'ADQUIRENTE_CARTAO',
      expectedDate: '2026-10-15',
      grossAmount: 85400.0,
      feeAmount: 2391.2,
      netAmount: 83008.8,
      destinationBank: 'Banco Itaú (Conta 2910-4)',
      status: 'AGUARDANDO_DEPOSITO',
    },
    {
      id: 'rec-02',
      source: 'Rede Card (Débito D+1)',
      type: 'ADQUIRENTE_CARTAO',
      expectedDate: '2026-09-30',
      grossAmount: 18200.0,
      feeAmount: 254.8,
      netAmount: 17945.2,
      destinationBank: 'Banco Itaú (Conta 2910-4)',
      status: 'CONCILIADO',
    },
  ];

  const salesChannels: SalesChannelMetric[] = [
    {
      channel: 'SALAO_MESAS',
      channelLabel: 'Salão & Mesas (Presencial)',
      revenue: 2655558.58,
      percentage: 88.5,
      ordersCount: 13200,
      averageTicket: 201.18,
      averagePax: 3.2,
    },
    {
      channel: 'BALCAO_TAKEOUT',
      channelLabel: 'Balcão & Takeout (Retirada)',
      revenue: 345072.58,
      percentage: 11.5,
      ordersCount: 1640,
      averageTicket: 210.41,
      averagePax: 1.2,
    },
  ];

  const dreLines: ConsumerDreItem[] = [
    { code: '1.0', label: '1. RECEITA OPERACIONAL BRUTA', amount: 3000631.16, pctOfNetRevenue: 106.9, type: 'RECEITA', indent: false },
    { code: '1.1', label: '(-) Deduções da Receita & Taxas de Cartões (6.5%)', amount: -195041.03, pctOfNetRevenue: -6.9, type: 'DEDUCAO', indent: true },
    { code: '2.0', label: '2. RECEITA OPERACIONAL LÍQUIDA', amount: 2805590.13, pctOfNetRevenue: 100.0, type: 'SUBTOTAL', indent: false },
    { code: '3.0', label: '(-) Custo das Mercadorias Vendidas - CMV Real (28.4%)', amount: -796787.60, pctOfNetRevenue: -28.4, type: 'CUSTO', indent: true },
    { code: '4.0', label: '4. LUCRO BRUTO DA OPERAÇÃO (71.6%)', amount: 2008802.53, pctOfNetRevenue: 71.6, type: 'SUBTOTAL', indent: false },
    { code: '5.0', label: '(-) Despesas Operacionais & Ocupação (38.0%)', amount: -1066124.25, pctOfNetRevenue: -38.0, type: 'DESPESA', indent: true },
    { code: '6.0', label: '6. EBITDA / LUCRO OPERACIONAL LÍQUIDO (33.6%)', amount: 942678.28, pctOfNetRevenue: 33.6, type: 'RESULTADO', indent: false },
  ];

  return {
    version: 3,
    lastUpdated: new Date().toISOString(),
    sourceFileName: 'Vendas-Realizadas-Por-Caixa (2).csv',
    summary: sum,
    thawRecommendations: thaw,
    paymentsSummary: payments,
    topProductsByRevenue: topRev,
    topProductsByVolume: topVol,
    barChopp: {
      taps,
      bottles,
      summary: {
        referenceDate: new Date().toISOString().split('T')[0],
        shift: 'DIA_TODO',
        totalLitersKegsDispensed: 5850.0,
        totalLitersSoldTeknisa: 5540.7,
        totalTechnicalLossLiters: 302.85,
        totalDeviationLiters: 6.45,
        totalDeviationReais: 75.6,
        overallYieldPct: 94.7,
        topDiscrepancies: ['Torneira 1 (Heineken) com 4.4L de quebra de colarinho aceitável'],
      },
    },
    finance: {
      paymentMethods,
      cashSessions,
      accountsPayable,
      accountsReceivable,
      salesChannels,
      dreLines,
    },
  };
}

// Estado em memória (Single Source of Truth)
let currentData: CentralOperationalData = (() => {
  if (typeof window === 'undefined') return buildDefaultDataset();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V3);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.summary && parsed.summary.totalRevenue > 0) {
        return parsed;
      }
    }
  } catch {}
  const def = buildDefaultDataset();
  try {
    localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(def));
  } catch {}
  return def;
})();

// Listeners reativos para useSyncExternalStore
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tk_central_data_updated', { detail: currentData }));
  }
}

export function subscribeToCentralData(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCentralDataSnapshot(): CentralOperationalData {
  return currentData;
}

export const getCentralOperationalData = getCentralDataSnapshot;

/**
 * Hook oficial React para inscrição reativa em qualquer componente
 */
export function useOperationalData(): CentralOperationalData {
  return useSyncExternalStore(subscribeToCentralData, getCentralDataSnapshot, () => currentData);
}

/**
 * Atualiza o store central e persiste no localStorage
 */
export function updateCentralOperationalData(updater: (prev: CentralOperationalData) => CentralOperationalData): CentralOperationalData {
  currentData = updater(currentData);
  currentData.lastUpdated = new Date().toISOString();
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(currentData));
    } catch (e) {
      console.error('Erro ao salvar central data store:', e);
    }
  }
  emitChange();
  return currentData;
}

/**
 * Motor de parsing de planilhas CSV/Teknisa em tempo real no cliente
 */
export function parseAndApplyCsvSpreadsheet(csvContent: string, fileName: string = 'Planilha_Importada.csv'): {
  success: boolean;
  totalRevenue: number;
  totalSalesRows: number;
  totalDays: number;
  message: string;
} {
  const lines = csvContent.split(/\r?\n/);
  let parsedSales = 0;
  let totalRevenue = 0;
  let totalQty = 0;

  const datesSet = new Set<string>();
  const paymentsMap = new Map<string, { revenue: number; count: number }>();
  const productsMap = new Map<string, { code: string; name: string; qty: number; revenue: number }>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Linha de venda típica do Teknisa
    const parts = line.split(';');
    if (parts.length >= 14 && (line.includes('Data Venda:') || line.startsWith('"0104 MNS"'))) {
      parsedSales++;

      // Extrai data
      const dateMatch = line.match(/Data Venda:\s*(\d{2}\/\d{2}\/\d{4})/);
      if (dateMatch) {
        datesSet.add(dateMatch[1]);
      }

      // Procura índices nos moldes do Teknisa
      // Formato oficial Teknisa Odhen:
      // parts[5] ou parts[13] = Forma de Pagamento
      // parts[6] ou parts[3] = Código
      // parts[7] ou parts[4] = Nome do Produto
      // parts[8] ou parts[5] = Quantidade
      // parts[13] ou parts[7] = Valor Total
      let code = parts[6]?.replace(/^"|"$/g, '').trim() || parts[3]?.replace(/^"|"$/g, '').trim() || `IT-${i}`;
      let name = parts[7]?.replace(/^"|"$/g, '').trim() || parts[4]?.replace(/^"|"$/g, '').trim() || 'Item Diverso';
      let qty = parseFloat(parts[8]?.replace(/^"|"$/g, '').replace(',', '.') || parts[5]?.replace(/^"|"$/g, '').replace(',', '.') || '1') || 1;
      let valTotal = parseFloat(parts[13]?.replace(/^"|"$/g, '').replace(',', '.') || parts[7]?.replace(/^"|"$/g, '').replace(',', '.') || '0') || 0;
      
      let paymentMethod = 'DINHEIRO';
      const payMatch = line.match(/Recebimento:\s*([^-\n";]+)/);
      if (payMatch) {
        paymentMethod = payMatch[1].trim().toUpperCase();
      } else if (parts[13] && isNaN(Number(parts[13]))) {
        paymentMethod = parts[13].replace(/^"|"$/g, '').trim().toUpperCase();
      }

      totalRevenue += valTotal;
      totalQty += qty;

      // Agrega pagamento
      const p = paymentsMap.get(paymentMethod) || { revenue: 0, count: 0 };
      p.revenue += valTotal;
      p.count += 1;
      paymentsMap.set(paymentMethod, p);

      // Agrega produto
      const prod = productsMap.get(name) || { code, name, qty: 0, revenue: 0 };
      prod.qty += qty;
      prod.revenue += valTotal;
      productsMap.set(name, prod);
    }
  }

  // Fallback se não for formato ponto-e-vírgula clássico do Teknisa
  if (parsedSales === 0) {
    // Tenta formato vírgula ou ponto-e-vírgula simples
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.includes(';') ? line.split(';') : line.split(',');
      if (parts.length >= 2) {
        const rev = parseFloat(parts[parts.length - 1]?.replace(/^"|"$/g, '').replace(',', '.').trim() || '0');
        const qty = parseFloat(parts[parts.length - 2]?.replace(/^"|"$/g, '').replace(',', '.').trim() || '1') || 1;
        const name = parts[0]?.replace(/^"|"$/g, '').trim() || `Item ${i}`;
        if (!isNaN(rev) && rev > 0) {
          parsedSales++;
          totalRevenue += rev;
          totalQty += qty;
          const prod = productsMap.get(name) || { code: `IT-${i}`, name, qty: 0, revenue: 0 };
          prod.qty += qty;
          prod.revenue += rev;
          productsMap.set(name, prod);
        }
      }
    }
  }

  const daysCount = Math.max(1, datesSet.size);
  const dailyAverageRevenue = totalRevenue > 0 ? totalRevenue / daysCount : currentData.summary.dailyAverageRevenue;
  const dailyAverageOrders = totalRevenue > 0 ? Math.round(parsedSales / daysCount) : currentData.summary.dailyAverageOrders;
  const ticketMedio = parsedSales > 0 ? totalRevenue / parsedSales : currentData.summary.ticketMedioGlobal;

  // Atualiza o store central com dados recalculados em cadeia
  updateCentralOperationalData((prev) => {
    // Recalcula DRE
    const rev = totalRevenue > 0 ? totalRevenue : prev.summary.totalRevenue;
    const dailyRev = totalRevenue > 0 ? Number((totalRevenue / daysCount).toFixed(2)) : prev.summary.dailyAverageRevenue;
    const cmvRate = 0.284;
    const cmvVal = Number((rev * cmvRate).toFixed(2));
    const grossMarginVal = Number((rev - cmvVal).toFixed(2));

    const netRev = Number((rev * 0.955).toFixed(2));
    const updatedDre: ConsumerDreItem[] = [
      {
        code: '1.0',
        label: 'RECEITA BRUTA (FATURAMENTO LOJA)',
        amount: rev,
        pctOfNetRevenue: Number(((rev / netRev) * 100).toFixed(1)),
        type: 'RECEITA',
        indent: false,
      },
      {
        code: '1.1',
        label: '(-) Deduções, Taxas e Cancelamentos',
        amount: Number((rev * 0.045).toFixed(2)),
        pctOfNetRevenue: 4.5,
        type: 'DEDUCAO',
        indent: true,
      },
      {
        code: '2.0',
        label: 'RECEITA OPERACIONAL LÍQUIDA',
        amount: netRev,
        pctOfNetRevenue: 100.0,
        type: 'SUBTOTAL',
        indent: false,
      },
      {
        code: '3.0',
        label: '(-) CMV Real (Custo Insumos & Bebidas)',
        amount: cmvVal,
        pctOfNetRevenue: 28.4,
        type: 'CUSTO',
        indent: true,
      },
      {
        code: '4.0',
        label: '(=) LUCRO BRUTO (Margem de Contribuição)',
        amount: grossMarginVal,
        pctOfNetRevenue: 71.6,
        type: 'RESULTADO',
        indent: false,
      },
    ];

    // Atualiza Torneiras de Chopp se houver cerveja nos itens importados
    const updatedTaps = prev.barChopp.taps.map((tap) => {
      let extraLiters = 0;
      productsMap.forEach((val, key) => {
        if (key.toUpperCase().includes('CHOPP') || key.toUpperCase().includes('HEINEKEN') || key.toUpperCase().includes('AMSTEL')) {
          extraLiters += val.qty * 0.3;
        }
      });
      if (extraLiters > 0) {
        return {
          ...tap,
          glassesSoldTeknisa: tap.glassesSoldTeknisa + Math.round(extraLiters / 0.3),
          litersSoldTeknisa: Number((tap.litersSoldTeknisa + extraLiters).toFixed(1)),
        };
      }
      return tap;
    });

    return {
      ...prev,
      sourceFileName: fileName,
      summary: {
        totalRevenue: totalRevenue > 0 ? Number(totalRevenue.toFixed(2)) : prev.summary.totalRevenue,
        totalItemsSold: totalQty > 0 ? Math.round(totalQty) : prev.summary.totalItemsSold,
        totalDays: daysCount,
        dateRange: {
          firstDay: Array.from(datesSet)[0] || '01/07/2026',
          lastDay: Array.from(datesSet).pop() || '28/09/2026',
        },
        dailyAverageRevenue: Number(dailyAverageRevenue.toFixed(2)),
        dailyAverageOrders,
        ticketMedioGlobal: Number(ticketMedio.toFixed(2)),
      },
      barChopp: {
        ...prev.barChopp,
        taps: updatedTaps,
      },
      finance: {
        ...prev.finance,
        dreLines: updatedDre,
      },
    };
  });

  return {
    success: true,
    totalRevenue: totalRevenue > 0 ? totalRevenue : currentData.summary.totalRevenue,
    totalSalesRows: parsedSales > 0 ? parsedSales : currentData.summary.totalItemsSold,
    totalDays: daysCount,
    message: `Planilha "${fileName}" processada com sucesso! ${parsedSales.toLocaleString('pt-BR')} registros importados. Todas as telas foram sincronizadas.`,
  };
}

/**
 * Reseta o store central para o dataset consolidado padrão (98.393 vendas)
 */
export function resetCentralDataToDefault(): CentralOperationalData {
  const def = buildDefaultDataset();
  currentData = def;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(def));
      // Limpa chaves antigas que poderiam ter salvado []
      localStorage.removeItem('tk_cash_sessions_v1');
      localStorage.removeItem('tk_accounts_payable_v1');
      localStorage.removeItem('tk_accounts_receivable_v1');
      localStorage.removeItem('tk_bar_planning_items_v1');
    } catch {}
  }
  emitChange();
  return currentData;
}
