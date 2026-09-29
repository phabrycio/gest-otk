// ============================================================
// CONTEXTO INTEGRADO PARA IA GEMINI
// Agrega todos os dados ativos das camadas do restaurante para
// alimentar o Copilot e o Assistente de E-mails com fatos reais.
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import { getConsumerFinanceSnapshot } from './consumerFinanceStore';
import { getCalendarDeadlines } from './managerCalendarStore';
import { INITIAL_CHOPP_TAPS, INITIAL_COLD_ROOM_KEGS } from '../data/barChoppData';
import { MOCK_STOCK_ITEMS } from '../data/stockMockData';
import { getSession } from './restaurantStore';
import { getBarManagerCdaAlerts, getBarPlanningItems } from './barSalesOrderAiService';

export interface RestaurantLiveContext {
  restaurantName: string;
  location: string;
  referenceDate: string;
  finance: {
    period: string;
    grossRevenue: number;
    netRevenue: number;
    cmvPct: number;
    totalOrders: number;
    totalPax: number;
    averageTicketTable: number;
    openCashSessionsCount: number;
    pendingPayablesCount: number;
  };
  stock: {
    totalItemsCount: number;
    criticalItemsCount: number;
    criticalItemNames: string[];
  };
  bar: {
    tapsCount: number;
    tapsInfo: string[];
  };
  calendar: {
    pendingDeadlinesCount: number;
    overdueDeadlinesCount: number;
    upcomingDeadlines: Array<{ title: string; dueDate: string; priority: string; responsible: string }>;
  };
}

export function buildRestaurantLiveContext(): RestaurantLiveContext {
  const session = getSession();
  const restaurantName = session?.restaurant?.name || 'Engenho Manauara';
  const location = session?.restaurant?.shoppingMall
    ? `${session.restaurant.shoppingMall} – ${session.restaurant.city}/${session.restaurant.state}`
    : 'Manauara Shopping – Manaus/AM';

  const todayFinance = getConsumerFinanceSnapshot('HOJE');
  const deadlines = getCalendarDeadlines();
  const todayStr = new Date().toISOString().slice(0, 10);

  const pendingDeadlines = deadlines.filter((d) => d.status !== 'CONCLUIDO');
  const overdueDeadlines = pendingDeadlines.filter((d) => d.dueDate < todayStr);
  const criticalStock = MOCK_STOCK_ITEMS.filter((i) => i.status === 'CRITICAL');

  return {
    restaurantName,
    location,
    referenceDate: new Date().toLocaleDateString('pt-BR'),
    finance: {
      period: todayFinance.periodLabel,
      grossRevenue: todayFinance.grossRevenue,
      netRevenue: todayFinance.netRevenue,
      cmvPct: todayFinance.cmvPct,
      totalOrders: todayFinance.totalOrders,
      totalPax: todayFinance.totalPax,
      averageTicketTable: todayFinance.averageTicketTable,
      openCashSessionsCount: todayFinance.cashSessions.filter((c) => c.status === 'ABERTO').length,
      pendingPayablesCount: todayFinance.accountsPayable.filter((p) => p.status !== 'PAGO').length,
    },
    stock: {
      totalItemsCount: MOCK_STOCK_ITEMS.length,
      criticalItemsCount: criticalStock.length,
      criticalItemNames: criticalStock.slice(0, 5).map((i) => i.name),
    },
    bar: {
      tapsCount: INITIAL_CHOPP_TAPS.length,
      tapsInfo: INITIAL_CHOPP_TAPS.map(
        (t) => `Torneira ${t.tapNumber}: ${t.beerName} (Status: ${t.deviationStatus})`
      ),
    },
    calendar: {
      pendingDeadlinesCount: pendingDeadlines.length,
      overdueDeadlinesCount: overdueDeadlines.length,
      upcomingDeadlines: pendingDeadlines.slice(0, 5).map((d) => ({
        title: d.title,
        dueDate: d.dueDate,
        priority: d.priority,
        responsible: d.responsibleName,
      })),
    },
  };
}

import type { UserRole } from '../types/restaurant.types';
import { ROLE_ACCESS_LEVELS } from '../types/restaurant.types';

/**
 * Formata o contexto em texto consolidado para inclusão no System Prompt da IA Gemini,
 * aplicando ISOLAMENTO ESTRITO POR CARGO (RBAC). Perfis operacionais não recebem dados financeiros.
 */
export function formatRestaurantContextForGemini(userRole?: UserRole): string {
  const ctx = buildRestaurantLiveContext();
  const role = userRole || 'OPERADOR';
  const accessLevel = ROLE_ACCESS_LEVELS[role] || 20;

  // 1. BARTENDER / CHEFE DO BAR (Apenas Bar & Bebidas)
  if (role === 'BARTENDER' || role === 'CHEFE_BAR') {
    return `
[DADOS OPERACIONAIS DO SETOR DE BAR & BEBIDAS]:
- Restaurante: ${ctx.restaurantName} (${ctx.location})
- Data de Referência: ${ctx.referenceDate}
- Torneiras de Chopp Ativas: ${ctx.bar.tapsCount} (${ctx.bar.tapsInfo.join(' | ')})
- Planejamento de Bebidas do Bar (Média 2 meses + 10% margem):
  * ${getBarPlanningItems().length} itens monitorados no bar.
  * Alertas de reposição de bebidas: ${getBarManagerCdaAlerts().map((a) => `${a.itemName} (Demanda: ${a.weeklyDemandPredicted})`).join(', ') || 'Estoque de bar em conformidade'}.
- Escopo do Bartender: coquetelaria, drinks autorais, contagem de garrafas, chopeiras, doses, copos e gelo.
    `.trim();
  }

  // 2. ASG (Apenas Limpeza, Higienização e POPs)
  if (role === 'ASG') {
    return `
[DADOS DO SETOR DE HIGIENIZAÇÃO & LIMPEZA (ASG)]:
- Unidade: ${ctx.restaurantName}
- Data de Referência: ${ctx.referenceDate}
- Rotinas de Higienização:
  * Manhã (08h-11h): Pré-abertura, higienização dos sanitários de clientes, salão e boqueta.
  * Tarde (14h-16h): Limpeza intermediária, recolhimento de lixo e higienização de câmara fria/pisos.
  * Noite (22h-00h): Fechamento, desinfecção profunda com sanitizante clorado e encerramento.
- Escopo da ASG: diluição de produtos químicos, cronograma de limpeza, descarte correto de resíduos e POPs ANVISA.
    `.trim();
  }

  // 3. CHEFE DE COZINHA / SUBCHEFE (Estoque Cozinha, Fichas e Perdas)
  if (role === 'CHEFE_COZINHA' || role === 'SUB_CHEFE_COZINHA' || role === 'SUBCHEFE') {
    return `
[DADOS DO SETOR DE COZINHA & CÂMARA FRIA]:
- Restaurante: ${ctx.restaurantName} (${ctx.location})
- Data de Referência: ${ctx.referenceDate}
- Estoque de Insumos da Cozinha: ${ctx.stock.totalItemsCount} insumos cadastrados, ${ctx.stock.criticalItemsCount} itens com necessidade de reposição (${ctx.stock.criticalItemNames.join(', ') || 'Nenhum crítico'}).
- Rastreamento PEPS / PVPS do Freezer: Etiquetas QR Code com controle de lote (Lote 1 Prioridade -> Lote 2 Intermediário -> Lote 3 Recente).
- Fichas Técnicas Ativas: Pirarucu de Casaca, Tambaqui na Brasa, Costela de Tambaqui, Dadinho de Tapioca, Farofa de Uarini.
- Escopo da Cozinha: pré-preparo, mise en place, rendimento de cortes, perdas de produção e segurança de alimentos.
    `.trim();
  }

  // 4. SUPERVISORA DE LOJA (Operação Administrativa)
  if (role === 'SUPERVISOR' || role === 'SUPERVISORA') {
    return `
[DADOS DA OPERAÇÃO ADMINISTRATIVA & SALÃO]:
- Restaurante: ${ctx.restaurantName} (${ctx.location})
- Data de Referência: ${ctx.referenceDate}
- Estoque & Suprimentos: ${ctx.stock.totalItemsCount} insumos, ${ctx.stock.criticalItemsCount} críticos.
- Obrigações e Prazos Administrativos: ${ctx.calendar.pendingDeadlinesCount} pendentes.
- Prazos:
${ctx.calendar.upcomingDeadlines.map((u) => `  * [${u.dueDate}] ${u.title} (Resp: ${u.responsible})`).join('\n')}
- Escopo da Supervisão: escalas, controle de atrasos, checklists de abertura, validação presencial de estoque e aprovação de compras.
    `.trim();
  }

  // 5. GERENTE & DONOS (Acesso 90 e 100 — Dados Completos Estratégicos e Financeiros)
  return `
[DADOS OPERACIONAIS & ESTRATÉGICOS COMPLETOS (ACESSO GERENCIAL / EXECUTIVO)]:
- Restaurante: ${ctx.restaurantName} (${ctx.location})
- Data de Referência: ${ctx.referenceDate}
- Financeiro Hoje: Faturamento Bruto: R$ ${ctx.finance.grossRevenue.toFixed(2)}, Pedidos: ${ctx.finance.totalOrders}, CMV: ${ctx.finance.cmvPct.toFixed(1)}%, Ticket Médio: R$ ${ctx.finance.averageTicketTable.toFixed(2)}
- Caixas Abertos Hoje: ${ctx.finance.openCashSessionsCount}, Contas a Pagar Pendentes: ${ctx.finance.pendingPayablesCount}
- Estoque de Insumos: ${ctx.stock.totalItemsCount} insumos cadastrados, ${ctx.stock.criticalItemsCount} itens necessitando reposição (${ctx.stock.criticalItemNames.join(', ') || 'Nenhum crítico'})
- Bar & Chopeiras: ${ctx.bar.tapsCount} torneiras ativas (${ctx.bar.tapsInfo.join(' | ')})
- Prazos e Obrigações do Gerente: ${ctx.calendar.pendingDeadlinesCount} pendentes, ${ctx.calendar.overdueDeadlinesCount} em atraso.
Próximos prazos:
${ctx.calendar.upcomingDeadlines.map((u) => `  * [${u.dueDate}] ${u.title} (Resp: ${u.responsible}, Prioridade: ${u.priority})`).join('\n')}
- Planejamento de Bebidas do Bar: ${getBarPlanningItems().length} itens monitorados. Alertas CDA: ${getBarManagerCdaAlerts().length} pendentes.
  `.trim();
}
