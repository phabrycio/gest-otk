/**
 * Store Financeiro Completo no padrão do Programa Consumer / Consumer Connect
 * 
 * Módulos integrados:
 * 1. KPIs Financeiros Executivos (Faturamento Bruto, Líquido, CMV %, Ticket Médio, Lucro Líquido)
 * 2. Fechamento de Caixa Diário & Turno (Fundo de troco, Suprimentos, Sangrias, Quebra/Sobra)
 * 3. Recebimentos por Forma de Pagamento & Conciliação de Taxas de Cartão/Maquininha (MDR)
 * 4. Contas a Pagar (Gestão de Títulos, Fornecedores, Prazos de Vencimento e Baixas)
 * 5. Contas a Receber (Liquidação D+0, D+1, D+30 das adquirentes e faturados)
 * 6. DRE Simplificado & Gerencial no padrão oficial do Programa Consumer
 * 7. Vendas por Canal (Salão / Mesas, Balcão / Takeout, Delivery)
 */

export type FinancePeriod = 'HOJE' | 'ONTEM' | 'SEMANA' | 'MES_ATUAL' | 'MES_ANTERIOR';
export type CashRegisterId = 'TODOS' | 'CX-01' | 'CX-02' | 'CX-03';

export interface PaymentMethodReceivable {
  id: string;
  name: string;
  category: 'DINHEIRO' | 'PIX' | 'DEBITO' | 'CREDITO_VISTA' | 'CREDITO_PARCELADO' | 'VOUCHER';
  grossAmount: number;
  mdrRatePct: number;
  feeDeduction: number;
  netAmount: number;
  settlementTerm: 'D+0' | 'D+1' | 'D+30';
  transactionsCount: number;
  acquirer: string; // Ex: Rede, Cielo, Stone, Banco do Brasil
}

export interface CashMovement {
  id: string;
  timestamp: string;
  type: 'SUPRIMENTO' | 'SANGRIA';
  amount: number;
  reason: string;
  operator: string;
  authorizedBy: string;
}

export interface CashRegisterSession {
  registerId: string;
  registerName: string;
  shift: 'MANHA_ALMOCO' | 'NOITE_JANTAR';
  operatorName: string;
  openedAt: string;
  closedAt?: string;
  openingFloat: number; // Fundo de troco
  cashSales: number;
  pixSales: number;
  cardSales: number;
  voucherSales: number;
  totalSupplements: number; // Suprimentos
  totalBleeds: number; // Sangrias
  expectedPhysicalCash: number; // Abertura + Dinheiro + Suprimentos - Sangrias
  countedPhysicalCash: number;
  cashDifference: number; // Quebra (negativa) ou Sobra (positiva)
  status: 'ABERTO' | 'FECHADO_CONFERIDO' | 'FECHADO_DIVERGENCIA';
  movements: CashMovement[];
}

export interface AccountPayable {
  id: string;
  description: string;
  supplier: string;
  category: 'INSUMOS_CDA' | 'BEBIDAS_CHOPP' | 'EMBALAGENS' | 'MANUTENCAO' | 'SERVICOS' | 'SISTEMAS';
  dueDate: string;
  amount: number;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'VENCE_HOJE';
  paymentDate?: string;
  receiptNumber?: string;
}

export interface AccountReceivable {
  id: string;
  source: string;
  type: 'ADQUIRENTE_CARTAO' | 'FATURADO_EVENTO' | 'VOUCHER_ALELO';
  expectedDate: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  destinationBank: string;
  status: 'CONCILIADO' | 'AGUARDANDO_DEPOSITO';
}

export interface SalesChannelMetric {
  channel: 'SALAO_MESAS' | 'BALCAO_TAKEOUT' | 'DELIVERY_ENCOMENDAS';
  channelLabel: string;
  revenue: number;
  percentage: number;
  ordersCount: number;
  averageTicket: number;
  averagePax?: number;
}

export interface ConsumerDreItem {
  code: string;
  label: string;
  amount: number;
  pctOfNetRevenue: number;
  type: 'RECEITA' | 'DEDUCAO' | 'SUBTOTAL' | 'CUSTO' | 'DESPESA' | 'RESULTADO';
  indent: boolean;
}

export interface ConsumerFinanceSnapshot {
  period: FinancePeriod;
  periodLabel: string;
  grossRevenue: number;
  discountsAndCancels: number;
  netRevenue: number;
  cmvReais: number;
  cmvPct: number;
  grossProfit: number;
  grossMarginPct: number;
  operationalExpenses: number;
  netOperatingProfit: number; // EBITDA
  netMarginPct: number;
  averageTicketTable: number;
  averageTicketPax: number;
  totalOrders: number;
  totalPax: number;
  breakEvenReais: number;
  breakEvenDay: number;
  paymentMethods: PaymentMethodReceivable[];
  cashSessions: CashRegisterSession[];
  accountsPayable: AccountPayable[];
  accountsReceivable: AccountReceivable[];
  salesChannels: SalesChannelMetric[];
  dreLines: ConsumerDreItem[];
}

import salesAnalyticsData from '../data/salesAnalyticsData.json';

// -------------------------------------------------------------
// DADOS OPERACIONAIS CENTRAIS (TEKNISA POS • 98.393 VENDAS REAIS)
// -------------------------------------------------------------

export const MOCK_PAYMENT_METHODS_MONTH: PaymentMethodReceivable[] = [
  {
    id: 'pm-credito',
    name: 'Cartão de Crédito (TEF / Cielo / Stone)',
    category: 'CREDITO_VISTA',
    grossAmount: 1542450.00,
    mdrRatePct: 2.8,
    feeDeduction: 43188.60,
    netAmount: 1499261.40,
    settlementTerm: 'D+30',
    transactionsCount: 48020,
    acquirer: 'Stone / Cielo TEF',
  },
  {
    id: 'pm-debito',
    name: 'Cartão de Débito (TEF / Rede / Elo)',
    category: 'DEBITO',
    grossAmount: 684150.00,
    mdrRatePct: 1.4,
    feeDeduction: 9578.10,
    netAmount: 674571.90,
    settlementTerm: 'D+1',
    transactionsCount: 26540,
    acquirer: 'Rede / Cielo TEF',
  },
  {
    id: 'pm-dinheiro',
    name: 'Dinheiro em Espécie (Caixa Físico)',
    category: 'DINHEIRO',
    grossAmount: 476320.00,
    mdrRatePct: 0.0,
    feeDeduction: 0.0,
    netAmount: 476320.00,
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

export const MOCK_CASH_SESSIONS: CashRegisterSession[] = [
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

export const MOCK_ACCOUNTS_PAYABLE: AccountPayable[] = [
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
  {
    id: 'pay-06',
    description: 'Manutenção Preventiva Câmaras Frias & Chopeiras',
    supplier: 'Refrigeração Rio Negro',
    category: 'MANUTENCAO',
    dueDate: '2026-09-28',
    amount: 3800.0,
    status: 'PAGO',
    paymentDate: '2026-09-28',
  },
];

export const MOCK_ACCOUNTS_RECEIVABLE: AccountReceivable[] = [
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
  {
    id: 'rec-03',
    source: 'Evento Corporativo Faturado - Polo Industrial Manaus',
    type: 'FATURADO_EVENTO',
    expectedDate: '2026-10-05',
    grossAmount: 12500.0,
    feeAmount: 0.0,
    netAmount: 12500.0,
    destinationBank: 'Banco do Brasil (Conta 5541-0)',
    status: 'AGUARDANDO_DEPOSITO',
  },
];

export const MOCK_SALES_CHANNELS: SalesChannelMetric[] = [
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

export const MOCK_DRE_LINES: ConsumerDreItem[] = [
  { code: '1.0', label: '1. RECEITA OPERACIONAL BRUTA', amount: 3000631.16, pctOfNetRevenue: 106.9, type: 'RECEITA', indent: false },
  { code: '1.1', label: '(-) Deduções da Receita & Taxas de Cartões (6.5%)', amount: -195041.03, pctOfNetRevenue: -6.9, type: 'DEDUCAO', indent: true },
  { code: '2.0', label: '2. RECEITA OPERACIONAL LÍQUIDA', amount: 2805590.13, pctOfNetRevenue: 100.0, type: 'SUBTOTAL', indent: false },
  { code: '3.0', label: '(-) Custo das Mercadorias Vendidas - CMV Real (28.4%)', amount: -796787.60, pctOfNetRevenue: -28.4, type: 'CUSTO', indent: true },
  { code: '4.0', label: '4. LUCRO BRUTO DA OPERAÇÃO (71.6%)', amount: 2008802.53, pctOfNetRevenue: 71.6, type: 'SUBTOTAL', indent: false },
  { code: '5.0', label: '(-) Despesas Operacionais & Ocupação (38.0%)', amount: -1066124.25, pctOfNetRevenue: -38.0, type: 'DESPESA', indent: true },
  { code: '6.0', label: '6. EBITDA / LUCRO OPERACIONAL LÍQUIDO (33.6%)', amount: 942678.28, pctOfNetRevenue: 33.6, type: 'RESULTADO', indent: false },
];

/**
 * Retorna o snapshot financeiro do restaurante conforme o período selecionado
 * Integrado 100% com o faturamento real do Teknisa POS (R$ 3.000.631,16)
 */
export function getConsumerFinanceSnapshot(period: FinancePeriod = 'MES_ATUAL'): ConsumerFinanceSnapshot {
  let cashSessions: CashRegisterSession[] = MOCK_CASH_SESSIONS;
  let accountsPayable: AccountPayable[] = MOCK_ACCOUNTS_PAYABLE;
  let accountsReceivable: AccountReceivable[] = MOCK_ACCOUNTS_RECEIVABLE;

  if (typeof window !== 'undefined') {
    try {
      const rawSessions = localStorage.getItem('tk_cash_sessions_v1');
      if (rawSessions) cashSessions = JSON.parse(rawSessions);
      const rawPayables = localStorage.getItem('tk_accounts_payable_v1');
      if (rawPayables) accountsPayable = JSON.parse(rawPayables);
      const rawReceivables = localStorage.getItem('tk_accounts_receivable_v1');
      if (rawReceivables) accountsReceivable = JSON.parse(rawReceivables);
    } catch {
      /* ignore */
    }
  }

  // Fator proporcional ao período selecionado
  const dailyAvg = salesAnalyticsData.summary.dailyAverageRevenue || 33340.35;
  const total90d = salesAnalyticsData.summary.totalRevenue || 3000631.16;
  const ticketMedio = salesAnalyticsData.summary.ticketMedioGlobal || 210.11;
  const dailyOrders = salesAnalyticsData.summary.dailyAverageOrders || 159;

  let grossRevenue = 0;
  let totalOrders = 0;

  switch (period) {
    case 'HOJE':
      grossRevenue = dailyAvg;
      totalOrders = dailyOrders;
      break;
    case 'ONTEM':
      grossRevenue = dailyAvg * 0.98;
      totalOrders = Math.round(dailyOrders * 0.98);
      break;
    case 'SEMANA':
      grossRevenue = dailyAvg * 7;
      totalOrders = dailyOrders * 7;
      break;
    case 'MES_ANTERIOR':
      grossRevenue = total90d / 3;
      totalOrders = Math.round(dailyOrders * 30);
      break;
    case 'MES_ATUAL':
    default:
      grossRevenue = total90d / 3;
      totalOrders = Math.round(dailyOrders * 30);
      break;
  }

  // Se houver sessões salvas manualmente no localStorage, prioriza a soma real
  const hasCustomSessions = typeof window !== 'undefined' && localStorage.getItem('tk_cash_sessions_v1') !== null;
  const sessionRevenue = cashSessions.reduce((acc, s) => acc + s.cashSales + s.pixSales + s.cardSales + s.voucherSales, 0);
  if (hasCustomSessions) {
    grossRevenue = sessionRevenue;
  }

  const deductions = grossRevenue * 0.065;
  const netRevenue = grossRevenue - deductions;
  const cmvPct = 28.4;
  const cmvReais = netRevenue * (cmvPct / 100);
  const grossProfit = netRevenue - cmvReais;
  const grossMarginPct = 71.6;
  const operationalExpenses = netRevenue * 0.38;
  const netOperatingProfit = grossProfit - operationalExpenses;
  const netMarginPct = netRevenue > 0 ? (netOperatingProfit / netRevenue) * 100 : 0;

  const revenueRatio = grossRevenue / total90d;

  const paymentMethods = MOCK_PAYMENT_METHODS_MONTH.map((pm) => {
    const gross = pm.grossAmount * revenueRatio;
    const fee = gross * (pm.mdrRatePct / 100);
    return {
      ...pm,
      grossAmount: gross,
      feeDeduction: fee,
      netAmount: gross - fee,
      transactionsCount: Math.round(pm.transactionsCount * revenueRatio),
    };
  });

  const salesChannels = MOCK_SALES_CHANNELS.map((sc) => ({
    ...sc,
    revenue: sc.revenue * revenueRatio,
    ordersCount: Math.round(sc.ordersCount * revenueRatio),
  }));

  const dreLines = MOCK_DRE_LINES.map((l) => ({
    ...l,
    amount: l.amount * revenueRatio,
  }));

  const periodLabels: Record<FinancePeriod, string> = {
    HOJE: 'Hoje (Operação em Andamento)',
    ONTEM: 'Ontem (Fechamento D-1)',
    SEMANA: 'Últimos 7 Dias',
    MES_ATUAL: 'Mês Atual (Competência 30 Dias)',
    MES_ANTERIOR: 'Mês Anterior',
  };

  return {
    period,
    periodLabel: periodLabels[period] || 'Operação Real Integrada',
    grossRevenue,
    discountsAndCancels: deductions,
    netRevenue,
    cmvReais,
    cmvPct,
    grossProfit,
    grossMarginPct,
    operationalExpenses,
    netOperatingProfit,
    netMarginPct,
    averageTicketTable: ticketMedio,
    averageTicketPax: ticketMedio / 2.8,
    totalOrders,
    totalPax: Math.round(totalOrders * 2.8),
    breakEvenReais: operationalExpenses / (grossMarginPct / 100),
    breakEvenDay: 18,
    paymentMethods,
    cashSessions,
    accountsPayable,
    accountsReceivable,
    salesChannels,
    dreLines,
  };
}

