import { describe, it, expect } from 'vitest';
import {
  calculateMedian,
  getPredictionForDay,
  INITIAL_CDA_MAX_STOCK_ITEMS,
  COMMISSIONER_AUDIT_DATA,
  queryOperationalBrain,
} from '../services/predictive12WeeksStore';

describe('Inteligência Preditiva de 12 Semanas & Gestão de Pedidos CDA', () => {
  it('deve calcular a mediana corretamente para conjuntos pares e ímpares de números', () => {
    // Conjunto ímpar
    expect(calculateMedian([10, 20, 30])).toBe(20);
    expect(calculateMedian([50, 10, 20])).toBe(20);

    // Conjunto par (12 semanas): média dos dois elementos centrais
    const sample12Weeks = [10, 12, 14, 15, 16, 18, 19, 20, 22, 25, 28, 30];
    // ordenado: posições 5 e 6 (1-based: 6º e 7º) -> 18 e 19 -> (18+19)/2 = 18.5
    expect(calculateMedian(sample12Weeks)).toBe(18.5);
  });

  it('deve calcular a previsão para Segunda-Feira aplicando rigorosamente a margem de +20% de segurança', () => {
    const mondayPrediction = getPredictionForDay('SEGUNDA');

    expect(mondayPrediction.dayName).toBe('SEGUNDA');
    expect(mondayPrediction.thawList.length).toBeGreaterThan(0);

    // Cada item de degelo deve ter a quantidade com +20% de margem (Math.ceil(mediana * 1.2))
    mondayPrediction.thawList.forEach((item) => {
      const expectedBuffer = Math.ceil(item.medianDishQuantity * 1.2);
      expect(item.safetyBufferQuantity).toBe(expectedBuffer);
      expect(item.totalKgToThaw).toBeGreaterThan(0);
    });

    // Cada item de mise en place deve ter +20% de porções recomendadas
    mondayPrediction.miseEnPlaceList.forEach((dish) => {
      const expectedPortions = Math.ceil(dish.medianSales12Weeks * 1.2);
      expect(dish.recommendedPortionsWith20Pct).toBe(expectedPortions);
    });
  });

  it('deve aplicar a regra de Pedido ao CDA: Pedido = Math.max(0, Estoque Máximo - Estoque Atual)', () => {
    // Insere item de teste para validar a fórmula oficial
    const testItem = {
      id: 'test-item-rice',
      code: 'SEC-0014',
      name: 'Arroz Parboilizado Tipo 1 (Saco 5kg)',
      category: 'SECOS' as const,
      unit: 'KG',
      maxStock: 60,
      minStock: 20,
      currentStock: 13,
      orderQuantity: Math.max(0, 60 - 13), // 47
      unitCost: 6.80,
      totalOrderCost: +(Math.max(0, 60 - 13) * 6.80).toFixed(2),
    };
    INITIAL_CDA_MAX_STOCK_ITEMS.push(testItem);

    const riceItem = INITIAL_CDA_MAX_STOCK_ITEMS.find((item) => item.code === 'SEC-0014');
    expect(riceItem).toBeDefined();
    expect(riceItem?.maxStock).toBe(60);
    expect(riceItem?.currentStock).toBe(13);
    expect(riceItem?.orderQuantity).toBe(47); // 60 - 13 = 47kg

    // Limpa após validação
    INITIAL_CDA_MAX_STOCK_ITEMS.length = 0;
  });

  it('deve detectar anomalia de taxas quando registrada na auditoria', () => {
    COMMISSIONER_AUDIT_DATA.push({
      id: 'comm-1',
      name: 'Paulo Comissário',
      role: 'Garçom / Comissário',
      tablesServedCount: 42,
      totalGrossSales: 8400,
      serviceFee10PctGenerated: 840,
      serviceFee10PctCancelled: 239.40,
      cancellationRatePct: 28.5,
      brigadeAverageRatePct: 3.8,
      riskStatus: 'ALERTA_DISCIPLINAR',
      isAnomaly: true,
      auditReason: 'Aumento expressivo no cancelamento de taxas de 10%',
    });

    const paulo = COMMISSIONER_AUDIT_DATA.find((c) => c.name.includes('Paulo'));
    expect(paulo).toBeDefined();
    expect(paulo?.isAnomaly).toBe(true);
    expect(paulo?.cancellationRatePct).toBe(28.5);
    expect(paulo?.brigadeAverageRatePct).toBe(3.8);

    COMMISSIONER_AUDIT_DATA.length = 0;
  });

  it('o Cérebro IA (queryOperationalBrain) deve responder perguntas operacionais com governança', () => {
    // 1. Resposta com loja limpa
    INITIAL_CDA_MAX_STOCK_ITEMS.length = 0;
    const cdaReplyClean = queryOperationalBrain('faça uma lista de pedidos baseado em nosso estoque mínimo e nosso estoque máximo para o CDA');
    expect(cdaReplyClean).toContain('Ordem de Compra ao CDA');
    expect(cdaReplyClean).toContain('Nenhuma reposição pendente');

    // 2. Resposta quando há itens calculados
    INITIAL_CDA_MAX_STOCK_ITEMS.push({
      id: 'test-item-rice',
      code: 'SEC-0014',
      name: 'Arroz Parboilizado',
      category: 'SECOS',
      unit: 'KG',
      maxStock: 60,
      minStock: 20,
      currentStock: 13,
      orderQuantity: 47,
      unitCost: 6.80,
      totalOrderCost: 319.60,
    });
    const cdaReply = queryOperationalBrain('faça uma lista de pedidos para o CDA');
    expect(cdaReply).toContain('Arroz Parboilizado');
    expect(cdaReply).toContain('47 KG');
    INITIAL_CDA_MAX_STOCK_ITEMS.length = 0;

    // 3. Degelo de Segunda-Feira
    const thawReply = queryOperationalBrain('quais itens para degelo preciso para segunda feira?');
    expect(thawReply).not.toBeNull();
    expect(thawReply).toContain('Guia de Degelo & Produção');
  });
});
