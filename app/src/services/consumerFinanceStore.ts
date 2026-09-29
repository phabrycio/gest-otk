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

// -------------------------------------------------------------
// DADOS MOCKADOS ULTRA-REALISTAS NO PADRÃO DO PROGRAMA CONSUMER
// -------------------------------------------------------------

export const MOCK_PAYMENT_METHODS_MONTH: PaymentMethodReceivable[] = [];

export const MOCK_CASH_SESSIONS: CashRegisterSession[] = [];

export const MOCK_ACCOUNTS_PAYABLE: AccountPayable[] = [];

export const MOCK_ACCOUNTS_RECEIVABLE: AccountReceivable[] = [];

export const MOCK_SALES_CHANNELS: SalesChannelMetric[] = [];

export const MOCK_DRE_LINES: ConsumerDreItem[] = [];

/**
 * Retorna o snapshot financeiro do restaurante conforme o período selecionado
 */
export function getConsumerFinanceSnapshot(period: FinancePeriod = 'MES_ATUAL'): ConsumerFinanceSnapshot {
  let cashSessions: CashRegisterSession[] = [];
  let accountsPayable: AccountPayable[] = [];
  let accountsReceivable: AccountReceivable[] = [];

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

  const grossRevenue = cashSessions.reduce((acc, s) => acc + s.cashSales + s.pixSales + s.cardSales + s.voucherSales, 0);
  const netRevenue = grossRevenue;

  const paymentMethods = MOCK_PAYMENT_METHODS_MONTH.map((pm) => ({
    ...pm,
    grossAmount: 0,
    feeDeduction: 0,
    netAmount: 0,
    transactionsCount: 0,
  }));

  const salesChannels = MOCK_SALES_CHANNELS.map((sc) => ({
    ...sc,
    revenue: 0,
    percentage: 0,
    ordersCount: 0,
    averageTicket: 0,
    averagePax: 0,
  }));

  const dreLines = MOCK_DRE_LINES.map((l) => ({
    ...l,
    amount: 0,
    pctOfNetRevenue: 0,
  }));

  const periodLabels: Record<FinancePeriod, string> = {
    HOJE: 'Hoje (Operação em Andamento)',
    ONTEM: 'Ontem (Fechamento)',
    SEMANA: 'Últimos 7 Dias',
    MES_ATUAL: 'Mês Atual (Operação Real)',
    MES_ANTERIOR: 'Mês Anterior',
  };

  return {
    period,
    periodLabel: periodLabels[period] || 'Operação Real • Aguardando Vendas de Hoje',
    grossRevenue,
    discountsAndCancels: 0,
    netRevenue,
    cmvReais: 0,
    cmvPct: 0,
    grossProfit: 0,
    grossMarginPct: 0,
    operationalExpenses: 0,
    netOperatingProfit: 0,
    netMarginPct: 0,
    averageTicketTable: 0,
    averageTicketPax: 0,
    totalOrders: 0,
    totalPax: 0,
    breakEvenReais: 0,
    breakEvenDay: 0,
    paymentMethods,
    cashSessions,
    accountsPayable,
    accountsReceivable,
    salesChannels,
    dreLines,
  };
}
