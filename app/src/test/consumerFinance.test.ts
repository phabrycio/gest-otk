import { describe, it, expect } from 'vitest';
import {
  getConsumerFinanceSnapshot,
  MOCK_PAYMENT_METHODS_MONTH,
  MOCK_ACCOUNTS_PAYABLE,
  MOCK_SALES_CHANNELS,
} from '../services/consumerFinanceStore';
import { queryOperationalBrain } from '../services/predictive12WeeksStore';

describe('Painel Financeiro Completo (Padrão Programa Consumer & Consumer Connect)', () => {
  it('deve gerar o snapshot financeiro do mês inicializado limpo sem dados fictícios', () => {
    const snapshot = getConsumerFinanceSnapshot('MES_ATUAL');

    expect(snapshot.period).toBe('MES_ATUAL');
    expect(snapshot.grossRevenue).toBe(0);
    expect(snapshot.netRevenue).toBe(0);
    expect(snapshot.cmvReais).toBe(0);
    expect(snapshot.grossProfit).toBe(0);
    expect(snapshot.cashSessions.length).toBe(0);
    expect(snapshot.accountsPayable.length).toBe(0);
  });

  it('deve calcular corretamente o faturamento quando sessões reais de caixa são registradas', () => {
    localStorage.setItem(
      'tk_cash_sessions_v1',
      JSON.stringify([
        {
          id: 'cx-test-1',
          registerId: 'CX-01',
          cashierName: 'Caixa Balcão',
          openedAt: '2026-09-28T10:00:00Z',
          openingFloat: 200,
          cashSales: 350,
          pixSales: 450,
          cardSales: 1200,
          voucherSales: 100,
          totalSupplements: 0,
          totalBleeds: 200,
          expectedPhysicalCash: 350,
          declaredPhysicalCash: 350,
          cashDifference: 0,
          status: 'FECHADO',
        },
      ])
    );

    const snapshot = getConsumerFinanceSnapshot('MES_ATUAL');
    expect(snapshot.grossRevenue).toBe(2100); // 350 + 450 + 1200 + 100
    expect(snapshot.cashSessions.length).toBe(1);

    localStorage.removeItem('tk_cash_sessions_v1');
  });

  it('o Cérebro IA (queryOperationalBrain) deve responder perguntas sobre o financeiro de forma limpa e segura', () => {
    const reply = queryOperationalBrain('mostre o relatório financeiro do programa consumer');

    expect(reply).not.toBeNull();
    expect(reply).toContain('Painel Financeiro (Consumer & Connect)');
    expect(reply).toContain('Faturamento Bruto de Hoje');
    expect(reply).toContain('R$ 0,00');
  });
});
