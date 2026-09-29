import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  CreditCard,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Layers,
  FileText,
  Download,
  Copy,
  Plus,
  Filter,
  ShieldCheck,
  Building2,
  Sparkles,
  PieChart,
  ShoppingBag,
  Store,
  Bike,
  AlertTriangle,
  ChevronRight,
  Printer,
} from 'lucide-react';
import {
  FinancePeriod,
  getConsumerFinanceSnapshot,
  AccountPayable,
  CashMovement,
} from '../../services/consumerFinanceStore';
import { useOperationalData } from '../../services/centralDataStore';

interface ConsumerFinanceDashboardViewProps {
  onOpenCopilot?: (prompt?: string) => void;
}

export const ConsumerFinanceDashboardView: React.FC<ConsumerFinanceDashboardViewProps> = ({
  onOpenCopilot,
}) => {
  const [period, setPeriod] = useState<FinancePeriod>('MES_ATUAL');
  const [activeTab, setActiveTab] = useState<'VISAO_GERAL' | 'FLUXO_CAIXA' | 'RECEBIMENTOS' | 'CONTAS_PAGAR' | 'DRE_GERENCIAL'>('VISAO_GERAL');
  const [payableFilter, setPayableFilter] = useState<'TODOS' | 'VENCE_HOJE' | 'PENDENTE' | 'PAGO' | 'ATRASADO'>('TODOS');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const operationalData = useOperationalData();

  // Estados locais para simular operações interativas no caixa e contas a pagar
  const [snapshot, setSnapshot] = useState(() => getConsumerFinanceSnapshot(period));
  const [showSangriaModal, setShowSangriaModal] = useState(false);
  const [sangriaAmount, setSangriaAmount] = useState('');
  const [sangriaReason, setSangriaReason] = useState('');
  const [sangriaSuccess, setSangriaSuccess] = useState<string | null>(null);

  // Recarrega snapshot automaticamente ao trocar o período ou quando o store central for atualizado
  useEffect(() => {
    setSnapshot(getConsumerFinanceSnapshot(period));
  }, [period, operationalData]);

  const handlePeriodChange = (newPeriod: FinancePeriod) => {
    setPeriod(newPeriod);
    setSnapshot(getConsumerFinanceSnapshot(newPeriod));
  };

  // Dá baixa em uma conta a pagar
  const handlePayAccount = (id: string) => {
    setSnapshot((prev) => ({
      ...prev,
      accountsPayable: prev.accountsPayable.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              status: 'PAGO',
              paymentDate: new Date().toISOString().split('T')[0],
            }
          : acc
      ),
    }));
  };

  // Registra sangria no caixa ativo
  const handleAddSangria = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(sangriaAmount);
    if (isNaN(val) || val <= 0 || !sangriaReason.trim()) return;

    const newMov: CashMovement = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'SANGRIA',
      amount: val,
      reason: sangriaReason,
      operator: 'Thiago Nogueira (Caixa Noturno)',
      authorizedBy: 'Ivan / Pabricio (Gerência)',
    };

    setSnapshot((prev) => {
      const updatedSessions = prev.cashSessions.map((session) => {
        if (session.registerId === 'CX-02') {
          const totalBleeds = session.totalBleeds + val;
          const expected = session.openingFloat + session.cashSales + session.totalSupplements - totalBleeds;
          return {
            ...session,
            totalBleeds,
            expectedPhysicalCash: expected,
            countedPhysicalCash: expected,
            movements: [newMov, ...session.movements],
          };
        }
        return session;
      });

      return {
        ...prev,
        cashSessions: updatedSessions,
      };
    });

    setSangriaSuccess(`Sangria de R$ ${val.toFixed(2)} registrada com sucesso no Caixa 02!`);
    setShowSangriaModal(false);
    setSangriaAmount('');
    setSangriaReason('');
    setTimeout(() => setSangriaSuccess(null), 4000);
  };

  // Copia o DRE formatado para a área de transferência
  const handleCopyDre = () => {
    let text = `📈 DRE GERENCIAL SIMPLIFICADO - RESTAURANTE ENGENHO\n`;
    text += `Padrão Oficial: Programa Consumer / Consumer Connect\n`;
    text += `Período: ${snapshot.periodLabel}\n`;
    text += `--------------------------------------------------------\n`;

    snapshot.dreLines.forEach((line) => {
      const amountStr = `R$ ${Math.abs(line.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      const prefix = line.amount < 0 ? '-' : ' ';
      text += `${line.code.padEnd(5)} ${line.label.padEnd(45)} ${prefix}${amountStr.padStart(14)} (${line.pctOfNetRevenue.toFixed(1)}%)\n`;
    });

    text += `--------------------------------------------------------\n`;
    text += `CMV Realizado: ${snapshot.cmvPct}% (Meta: máx 30.0%)\n`;
    text += `Lucro Operacional Líquido: R$ ${snapshot.netOperatingProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  // Filtro de contas a pagar
  const filteredPayables = snapshot.accountsPayable.filter((acc) => {
    if (payableFilter === 'TODOS') return true;
    return acc.status === payableFilter;
  });

  const totalPayableMonth = snapshot.accountsPayable.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPayableDueToday = snapshot.accountsPayable.filter((a) => a.status === 'VENCE_HOJE').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPayableLate = snapshot.accountsPayable.filter((a) => a.status === 'ATRASADO').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPayablePaid = snapshot.accountsPayable.filter((a) => a.status === 'PAGO').reduce((acc, curr) => acc + curr.amount, 0);

  // Totalizador de taxas de maquininhas (MDR)
  const totalMdrDeduction = snapshot.paymentMethods.reduce((acc, curr) => acc + curr.feeDeduction, 0);
  const totalNetReceivable = snapshot.paymentMethods.reduce((acc, curr) => acc + curr.netAmount, 0);

  return (
    <div className="space-y-6">
      {/* HEADER EXECUTIVO DO CONSUMER CONNECT */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Store className="w-3.5 h-3.5 text-blue-400" />
              <span>Painel Financeiro &bull; Inspirado no Programa Consumer & Consumer Connect</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Gestão Financeira & Fluxo de Caixa do Restaurante
            </h1>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
              Controle unificado de faturamento bruto vs líquido, conciliação de cartões (MDR), sangrias e suprimentos de caixa, contas a pagar por fornecedor e DRE gerencial simplificado.
            </p>
          </div>

          {/* Seletor de Período do Consumer */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => handlePeriodChange('HOJE')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'HOJE' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => handlePeriodChange('ONTEM')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'ONTEM' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Ontem
            </button>
            <button
              onClick={() => handlePeriodChange('SEMANA')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'SEMANA' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              7 Dias
            </button>
            <button
              onClick={() => handlePeriodChange('MES_ATUAL')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'MES_ATUAL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Mês Atual
            </button>
            <button
              onClick={() => handlePeriodChange('MES_ANTERIOR')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'MES_ANTERIOR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Mês Anterior
            </button>
          </div>
        </div>

        {/* Notificação de sucesso de sangria */}
        {sangriaSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{sangriaSuccess}</span>
          </div>
        )}
      </div>

      {/* CARDS DE KPIS EXECUTIVOS (ESTILO CONSUMER CONNECT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento Bruto */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faturamento Bruto</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            R$ {snapshot.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8.4% vs meta do período</span>
          </div>
        </div>

        {/* Receita Líquida */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Receita Líquida</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            R$ {snapshot.netRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Livre de taxas de maquininhas e estornos
          </p>
        </div>

        {/* CMV Realizado */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CMV Operacional</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 flex items-baseline gap-2">
            <span>{snapshot.cmvPct}%</span>
            <span className="text-xs font-normal text-slate-500">
              (R$ {snapshot.cmvReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Meta Consumer: máx 30.0% (Dentro do teto)</span>
          </div>
        </div>

        {/* Lucro Operacional Líquido */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lucro Líquido (EBITDA)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-2">
            R$ {snapshot.netOperatingProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-2">
            Margem Líquida da Loja: {snapshot.netMarginPct.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* NAVEGAÇÃO DE SUB-MÓDULOS (PADRÃO PROGRAMA CONSUMER) */}
      <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex items-center justify-center overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('VISAO_GERAL')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'VISAO_GERAL'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <PieChart className="w-4 h-4 text-blue-600" />
          <span>Visão Geral & Canais</span>
        </button>

        <button
          onClick={() => setActiveTab('FLUXO_CAIXA')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'FLUXO_CAIXA'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Wallet className="w-4 h-4 text-emerald-600" />
          <span>Fechamento & Caixas</span>
        </button>

        <button
          onClick={() => setActiveTab('RECEBIMENTOS')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'RECEBIMENTOS'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <CreditCard className="w-4 h-4 text-indigo-600" />
          <span>Recebimentos & Taxas (MDR)</span>
        </button>

        <button
          onClick={() => setActiveTab('CONTAS_PAGAR')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'CONTAS_PAGAR'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-600" />
          <span>Contas a Pagar</span>
        </button>

        <button
          onClick={() => setActiveTab('DRE_GERENCIAL')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'DRE_GERENCIAL'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <FileText className="w-4 h-4 text-rose-600" />
          <span>DRE Simplificado</span>
        </button>
      </div>

      {/* ABA 1: VISÃO GERAL & CANAIS DE VENDA (CONSUMER CONNECT) */}
      {activeTab === 'VISAO_GERAL' && (
        <div className="space-y-6">
          {/* Mini-grid com Ticket Médio e Ponto de Equilíbrio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Ticket Médio por Mesa</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                R$ {snapshot.averageTicketTable.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Total de <strong>{snapshot.totalOrders.toLocaleString('pt-BR')} comandas</strong> processadas no período.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Ticket Médio por Cliente (PAX)</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                R$ {snapshot.averageTicketPax.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Total de <strong>{snapshot.totalPax.toLocaleString('pt-BR')} pessoas</strong> atendidas no salão e deck.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Ponto de Equilíbrio (Break-Even)</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                R$ {snapshot.breakEvenReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                ✅ Atingido no {snapshot.breakEvenDay}º dia do mês
              </p>
            </div>
          </div>

          {/* Canais de Venda do Restaurante */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-blue-600" />
                  <span>Desempenho por Canal de Venda (Programa Consumer)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Distribuição de pedidos, faturamento e ticket médio por ponto de contato com o cliente.
                </p>
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-200">
                100% Integrado ao PDV
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {snapshot.salesChannels.map((channel) => {
                const Icon =
                  channel.channel === 'SALAO_MESAS'
                    ? Store
                    : channel.channel === 'BALCAO_TAKEOUT'
                    ? ShoppingBag
                    : Bike;

                return (
                  <div
                    key={channel.channel}
                    className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{channel.channelLabel}</h4>
                          <span className="text-[11px] text-slate-500">{channel.ordersCount} pedidos</span>
                        </div>
                      </div>
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-600 text-white">
                        {channel.percentage}%
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-lg font-black text-slate-900">
                        R$ {channel.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                        <span>Ticket Médio:</span>
                        <strong className="text-slate-800">R$ {channel.averageTicket.toFixed(2)}</strong>
                      </div>
                    </div>

                    {/* Barra de progresso percentual */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${channel.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: FECHAMENTO & FLUXO DE CAIXA (SANGRIAS / SUPRIMENTOS) */}
      {activeTab === 'FLUXO_CAIXA' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <span>Controle de Caixas do Dia (Turno Almoço & Jantar)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Acompanhamento em tempo real de fundos de troco, sangrias para o cofre e conferência física.
              </p>
            </div>

            <button
              onClick={() => setShowSangriaModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Registrar Sangria no Caixa</span>
            </button>
          </div>

          {/* Cards dos Caixas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {snapshot.cashSessions.map((session) => {
              const isOpen = session.status === 'ABERTO';

              return (
                <div
                  key={session.registerId}
                  className={`bg-white rounded-2xl border p-5 shadow-xs space-y-4 ${
                    isOpen ? 'border-blue-300 ring-2 ring-blue-50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-base">{session.registerName}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isOpen ? 'CAIXA ABERTO' : 'FECHADO & CONFERIDO'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Operador: <strong>{session.operatorName}</strong> &bull; Aberto às {session.openedAt}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded text-slate-700">
                      {session.registerId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Fundo Abertura</span>
                      <strong className="text-slate-800 text-sm">R$ {session.openingFloat.toFixed(2)}</strong>
                    </div>

                    <div className="bg-emerald-50 p-2.5 rounded-lg">
                      <span className="text-[10px] text-emerald-700 uppercase block font-semibold">Vendas Dinheiro</span>
                      <strong className="text-emerald-900 text-sm">R$ {session.cashSales.toFixed(2)}</strong>
                    </div>

                    <div className="bg-rose-50 p-2.5 rounded-lg">
                      <span className="text-[10px] text-rose-700 uppercase block font-semibold">Sangrias</span>
                      <strong className="text-rose-900 text-sm">- R$ {session.totalBleeds.toFixed(2)}</strong>
                    </div>

                    <div className="bg-blue-50 p-2.5 rounded-lg">
                      <span className="text-[10px] text-blue-700 uppercase block font-semibold">Saldo Esperado</span>
                      <strong className="text-blue-900 text-sm">R$ {session.expectedPhysicalCash.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Histórico de Sangrias e Suprimentos */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Movimentações Registradas no Turno ({session.movements.length}):
                    </span>
                    <div className="space-y-1.5">
                      {session.movements.map((mov) => (
                        <div
                          key={mov.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs border border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                mov.type === 'SANGRIA'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {mov.type}
                            </span>
                            <span className="text-slate-600">{mov.reason}</span>
                            <span className="text-slate-400 text-[10px]">({mov.timestamp})</span>
                          </div>
                          <span
                            className={`font-black ${
                              mov.type === 'SANGRIA' ? 'text-rose-700' : 'text-emerald-700'
                            }`}
                          >
                            {mov.type === 'SANGRIA' ? '-' : '+'} R$ {mov.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 3: RECEBIMENTOS & CONCILIAÇÃO DE TAXAS (MDR) */}
      {activeTab === 'RECEBIMENTOS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>Recebimentos por Forma de Pagamento & Conciliação de Taxas (MDR)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Auditoria automática de descontos contratuais de adquirentes (Rede, Stone, Cielo e PIX Banco do Brasil).
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
              <span>Total Retido em Taxas:</span>
              <strong className="text-rose-600">R$ {totalMdrDeduction.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Forma de Pagamento</th>
                  <th className="py-3 px-4 text-center">Transações</th>
                  <th className="py-3 px-4 text-right">Faturamento Bruto</th>
                  <th className="py-3 px-4 text-center">Taxa MDR (%)</th>
                  <th className="py-3 px-4 text-right text-rose-600">Taxa Retida (R$)</th>
                  <th className="py-3 px-4 text-right font-black text-emerald-800 bg-emerald-50/50">Líquido a Receber</th>
                  <th className="py-3 px-4 text-center">Liquidação</th>
                  <th className="py-3 px-4">Adquirente / Conta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {snapshot.paymentMethods.map((pm) => (
                  <tr key={pm.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {pm.name}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {pm.transactionsCount}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">
                      R$ {pm.grossAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      {pm.mdrRatePct.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-rose-600">
                      - R$ {pm.feeDeduction.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-900 bg-emerald-50/30">
                      R$ {pm.netAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-bold text-slate-700">
                        {pm.settlementTerm}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {pm.acquirer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            <span>
              Líquido consolidado a ser creditado nas contas bancárias do restaurante:
            </span>
            <span className="text-base font-black text-emerald-700">
              R$ {totalNetReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* ABA 4: CONTAS A PAGAR & FORNECEDORES */}
      {activeTab === 'CONTAS_PAGAR' && (
        <div className="space-y-4">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              onClick={() => setPayableFilter('TODOS')}
              className={`bg-white p-3.5 rounded-xl border cursor-pointer transition-all ${
                payableFilter === 'TODOS' ? 'border-slate-800 ring-2 ring-slate-100' : 'border-slate-200'
              }`}
            >
              <span className="text-[11px] font-bold text-slate-500 block">Total Programado</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                R$ {totalPayableMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div
              onClick={() => setPayableFilter('VENCE_HOJE')}
              className={`bg-white p-3.5 rounded-xl border cursor-pointer transition-all ${
                payableFilter === 'VENCE_HOJE' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200'
              }`}
            >
              <span className="text-[11px] font-bold text-amber-600 block">Vence Hoje</span>
              <div className="text-lg font-black text-amber-700 mt-0.5">
                R$ {totalPayableDueToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div
              onClick={() => setPayableFilter('ATRASADO')}
              className={`bg-white p-3.5 rounded-xl border cursor-pointer transition-all ${
                payableFilter === 'ATRASADO' ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200'
              }`}
            >
              <span className="text-[11px] font-bold text-rose-600 block">Vencidos / Atrasados</span>
              <div className="text-lg font-black text-rose-700 mt-0.5">
                R$ {totalPayableLate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div
              onClick={() => setPayableFilter('PAGO')}
              className={`bg-white p-3.5 rounded-xl border cursor-pointer transition-all ${
                payableFilter === 'PAGO' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              <span className="text-[11px] font-bold text-emerald-600 block">Liquidados (Pagos)</span>
              <div className="text-lg font-black text-emerald-700 mt-0.5">
                R$ {totalPayablePaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Tabela de Títulos a Pagar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Lançamentos Financeiros & Títulos de Fornecedores</h4>
                <p className="text-xs text-slate-500">Exibindo registros com filtro ativo: <strong>{payableFilter}</strong></p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenCopilot && onOpenCopilot('Analise o relatório de contas a pagar do restaurante. Quais são os vencimentos mais críticos da semana?')}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auditar com IA</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Descrição do Título</th>
                    <th className="py-3 px-4">Fornecedor</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4 text-center">Vencimento</th>
                    <th className="py-3 px-4 text-right">Valor</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayables.map((item) => {
                    const isDueToday = item.status === 'VENCE_HOJE';
                    const isLate = item.status === 'ATRASADO';
                    const isPaid = item.status === 'PAGO';

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{item.description}</div>
                          {item.receiptNumber && (
                            <span className="text-[10px] text-slate-400 font-mono">{item.receiptNumber}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {item.supplier}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold text-slate-600">
                            {item.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-medium">
                          {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">
                          R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              isPaid
                                ? 'bg-emerald-100 text-emerald-800'
                                : isDueToday
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : isLate
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isPaid ? 'PAGO' : isDueToday ? 'VENCE HOJE' : isLate ? 'ATRASADO' : 'PENDENTE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isPaid ? (
                            <button
                              onClick={() => handlePayAccount(item.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                            >
                              Dar Baixa
                            </button>
                          ) : (
                            <span className="text-emerald-600 text-[11px] font-semibold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Liquidado
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: DRE SIMPLIFICADO & GERENCIAL (PADRÃO PROGRAMA CONSUMER) */}
      {activeTab === 'DRE_GERENCIAL' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Demonstrativo do Resultado do Exercício &bull; Padrão Consumer</span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                DRE Gerencial Simplificado ({snapshot.periodLabel})
              </h3>
              <p className="text-slate-300 text-xs">
                Visualização vertical de receitas, CMV, margem de contribuição e lucro operacional líquido da loja.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyDre}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSuccess ? 'DRE Copiado!' : 'Copiar DRE'}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-16">Conta</th>
                  <th className="py-3 px-4">Descrição da Linha</th>
                  <th className="py-3 px-4 text-right">Valor do Período (R$)</th>
                  <th className="py-3 px-4 text-right">% Receita Líquida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {snapshot.dreLines.map((line) => {
                  const isSubtotal = line.type === 'SUBTOTAL';
                  const isResult = line.type === 'RESULTADO';
                  const isDeduction = line.type === 'DEDUCAO' || line.type === 'CUSTO' || line.type === 'DESPESA';

                  return (
                    <tr
                      key={line.code}
                      className={`transition-colors ${
                        isResult
                          ? 'bg-emerald-50/70 font-black text-emerald-950'
                          : isSubtotal
                          ? 'bg-slate-50 font-extrabold text-slate-900'
                          : 'hover:bg-slate-50/80 text-slate-700'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {line.code}
                      </td>
                      <td className={`py-3 px-4 ${line.indent ? 'pl-8 text-slate-600' : 'font-bold'}`}>
                        {line.label}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono text-sm ${
                          isResult
                            ? 'text-emerald-700 font-black text-base'
                            : isDeduction
                            ? 'text-rose-600 font-semibold'
                            : 'text-slate-900 font-bold'
                        }`}
                      >
                        {line.amount < 0 ? '-' : ''} R$ {Math.abs(line.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500 font-semibold">
                        {line.pctOfNetRevenue.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            <span>
              * Nota: Custos tributários de ICMS/Simples Nacional e folha corporativa são geridos pela holding central.
            </span>
            <div className="text-right">
              <strong>Resultado Operacional da Loja: </strong>
              <span className="text-base font-black text-emerald-700">
                R$ {snapshot.netOperatingProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA REGISTRO DE SANGRIA DE CAIXA */}
      {showSangriaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
              <h4 className="font-black text-sm flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5" />
                <span>Registrar Sangria de Caixa (Recolhimento)</span>
              </h4>
              <button
                onClick={() => setShowSangriaModal(false)}
                className="text-white/80 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={handleAddSangria} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Caixa de Origem
                </label>
                <div className="text-xs font-semibold bg-slate-100 p-2.5 rounded-lg text-slate-800">
                  Caixa 02 - Salão Central (Turno Ativo • Operador: Thiago Nogueira)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Valor da Sangria (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex: 500,00"
                  value={sangriaAmount}
                  onChange={(e) => setSangriaAmount(e.target.value)}
                  className="w-full text-base font-bold p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motivo da Sangria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Recolhimento de excesso de dinheiro para o cofre"
                  value={sangriaReason}
                  onChange={(e) => setSangriaReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSangriaModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-xs"
                >
                  Confirmar Sangria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
