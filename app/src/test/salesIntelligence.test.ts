import { describe, it, expect } from 'vitest';
import salesAnalyticsJson from '../data/salesAnalyticsData.json';
import predictiveRealSalesJson from '../data/predictiveRealSalesData.json';
import { loadRealSalesHistory12Weeks, REAL_HISTORICAL_SALES_12WEEKS } from '../services/predictive12WeeksStore';
import { buildRealSalesStockCatalog, loadRealSalesStockItems } from '../services/virtualStockStore';
import { getDailyThawRecommendations, loadRealFreezerItems } from '../services/freezerTraceabilityStore';

describe('Inteligência Operacional de Vendas, Degelo & Estoque Anti-Ruptura (Teknisa POS)', () => {
  it('contém métricas operacionais consolidadas dos 90 dias de vendas reais', () => {
    const { summary } = salesAnalyticsJson;
    expect(summary.totalRevenue).toBeGreaterThan(2500000);
    expect(summary.totalItemsSold).toBeGreaterThan(90000);
    expect(summary.totalDays).toBe(90);
    expect(summary.dailyAverageRevenue).toBeGreaterThan(25000);
    expect(summary.ticketMedioGlobal).toBeGreaterThan(150);
  });

  it('calcula o plano diário de degelo para carnes nobres e pescados regionais com cotas diferenciadas', () => {
    const thawList = getDailyThawRecommendations();
    expect(thawList.length).toBeGreaterThanOrEqual(10);

    const tambaqui = thawList.find((t) => t.keyword === 'TAMBAQUI');
    expect(tambaqui).toBeDefined();
    expect(tambaqui?.avgDailyThaw).toBeGreaterThan(0);
    expect(tambaqui?.weekendThawQuota).toBeGreaterThanOrEqual(tambaqui?.weekdayThawQuota || 0);
    expect(tambaqui?.minChamberStock).toBeGreaterThan(0);

    const carneDeSol = thawList.find((t) => t.keyword === 'CARNE DE SOL');
    expect(carneDeSol).toBeDefined();
    expect(carneDeSol?.avgDailyThaw).toBeGreaterThan(30);

    const pirarucu = thawList.find((t) => t.keyword === 'PIRARUCU');
    expect(pirarucu).toBeDefined();
    expect(pirarucu?.avgDailyThaw).toBeGreaterThan(0);
  });

  it('gera catálogo de estoque com ponto de pedido (estoque mínimo) e ideal anti-ruptura', () => {
    const realCatalog = buildRealSalesStockCatalog();
    expect(realCatalog.length).toBeGreaterThanOrEqual(30);

    realCatalog.forEach((item) => {
      expect(item.id).toMatch(/^stock-/);
      expect(item.minStock).toBeGreaterThan(0);
      expect(item.idealStock).toBeGreaterThan(item.minStock);
      expect(item.averageCost).toBeGreaterThan(0);
      expect(item.errorMarginPct).toBe(5);
    });

    const loaded = loadRealSalesStockItems();
    expect(loaded.length).toBe(realCatalog.length);
  });

  it('gera a lista semanal de compras inteligente com base no giro dos últimos 90 dias', () => {
    const { weeklyPurchasingList } = salesAnalyticsJson;
    expect(weeklyPurchasingList.length).toBeGreaterThanOrEqual(40);

    weeklyPurchasingList.forEach((order) => {
      expect(order.code).toBeTruthy();
      expect(order.name).toBeTruthy();
      expect(order.recommendedOrderQty).toBeGreaterThan(0);
      expect(order.estimatedWeeklyCost).toBeGreaterThan(0);
    });
  });

  it('mapeia as principais marcas do restaurante (Heineken, Amstel, Coca-Cola, etc.)', () => {
    const { brandsSummary } = salesAnalyticsJson;
    const brands = brandsSummary.map((b) => b.brand);

    expect(brands).toContain('HEINEKEN');
    expect(brands).toContain('AMSTEL');
    expect(brands).toContain('COCA COLA');
  });

  it('carrega o histórico preditivo real de 12 semanas com distribuição de faturamento semanal', () => {
    const history = loadRealSalesHistory12Weeks();
    expect(Object.keys(history)).toEqual([
      'SEGUNDA',
      'TERCA',
      'QUARTA',
      'QUINTA',
      'SEXTA',
      'SABADO',
      'DOMINGO',
    ]);

    // Sábado deve ter faturamento médio superior à Segunda-feira (pico do restaurante)
    const sabado = history.SABADO.historical12WeeksSales;
    const segunda = history.SEGUNDA.historical12WeeksSales;
    expect(sabado.length).toBe(12);
    expect(segunda.length).toBe(12);

    const avgSabado = sabado.reduce((acc, curr) => acc + curr.totalRevenue, 0) / 12;
    const avgSegunda = segunda.reduce((acc, curr) => acc + curr.totalRevenue, 0) / 12;
    expect(avgSabado).toBeGreaterThan(avgSegunda);
  });

  it('carrega lotes reais de câmara fria e degelo no serviço de rastreabilidade', () => {
    const lots = loadRealFreezerItems();
    expect(lots.length).toBeGreaterThan(15);
    const inThaw = lots.filter((l) => l.currentStage === 'DEGELO');
    const inFreezer = lots.filter((l) => l.currentStage === 'FREEZER');
    expect(inThaw.length).toBeGreaterThan(0);
    expect(inFreezer.length).toBeGreaterThan(0);
  });
});
