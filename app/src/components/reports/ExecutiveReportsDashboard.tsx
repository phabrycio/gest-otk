import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Snowflake,
  Users,
  Award,
  Calendar,
  Printer,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  PieChart,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Target,
  RefreshCw,
  Search,
  ChevronRight,
  Flame,
  Wine,
  UtensilsCrossed,
  Info,
} from 'lucide-react';
import { askGemini } from '../../services/geminiService';
import { getSystemFeedStatus, SystemFeedStatus } from '../../services/dataFreshnessStore';
import { TeknisaFeedModal } from '../teknisa/TeknisaFeedModal';
import { getConsumerFinanceSnapshot } from '../../services/consumerFinanceStore';

export type ReportCategory =
  | 'COCKPIT_GERAL'
  | 'VENDAS_FATURAMENTO'
  | 'DRE_FINANCEIRO'
  | 'CMV_ESTOQUE'
  | 'FREEZER_CDA'
  | 'SALAO_CLIENTES'
  | 'EQUIPE_RH'
  | 'IA_DIAGNOSTICO';

export type ReportPeriod = 'HOJE' | 'SEMANA' | 'MES_ATUAL' | 'MES_ANTERIOR' | 'TRIMESTRE';
export type ReportShift = 'TODOS' | 'ALMOCO' | 'JANTAR';

interface ExecutiveReportsDashboardProps {
  onOpenCopilot?: (prompt?: string) => void;
  restaurantName?: string;
}

export const ExecutiveReportsDashboard: React.FC<ExecutiveReportsDashboardProps> = ({
  onOpenCopilot,
  restaurantName = 'Engenho Manauara',
}) => {
  const [activeReport, setActiveReport] = useState<ReportCategory>('COCKPIT_GERAL');
  const [period, setPeriod] = useState<ReportPeriod>('HOJE');
  const [shift, setShift] = useState<ReportShift>('TODOS');
  const [isExporting, setIsExporting] = useState(false);
  const [aiCustomQuestion, setAiCustomQuestion] = useState('');
  const [aiCustomAnswer, setAiCustomAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [feedStatus, setFeedStatus] = useState<SystemFeedStatus>(() => getSystemFeedStatus());

  const financeSnapshot = useMemo(() => {
    const p = period === 'MES_ATUAL' || period === 'MES_ANTERIOR' || period === 'TRIMESTRE' ? 'MES' : period;
    return getConsumerFinanceSnapshot(p as any);
  }, [period, feedStatus]);

  React.useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) setFeedStatus(e.detail);
      else setFeedStatus(getSystemFeedStatus());
    };
    window.addEventListener('tk_feed_status_updated', handleUpdate);
    return () => window.removeEventListener('tk_feed_status_updated', handleUpdate);
  }, []);

  // Período formatado para exibição
  const periodLabel = useMemo(() => {
    switch (period) {
      case 'HOJE': return 'Hoje (Tempo Real)';
      case 'SEMANA': return 'Últimos 7 Dias';
      case 'MES_ATUAL': return 'Mês Vigente (Setembro / 2026)';
      case 'MES_ANTERIOR': return 'Mês Anterior (Agosto / 2026)';
      case 'TRIMESTRE': return '3º Trimestre / 2026';
    }
  }, [period]);

  // Handler de Impressão Executiva
  const handlePrintReport = () => {
    window.print();
  };

  // Handler de Exportação CSV
  const handleExportCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvContent = `data:text/csv;charset=utf-8,Relatório Executivo Tk Gestão - ${restaurantName}\nPeríodo: ${periodLabel}\nTurno: ${shift}\nGerado em: ${new Date().toLocaleString('pt-BR')}\n\nIndicador;Realizado;Meta;Atingimento;Status\nFaturamento Bruto;R$ 428.500,00;R$ 450.000,00;95.2%;No Alvo\nCMV Global;29.4%;30.0%;98.0%;Superada\nTicket Médio Mesa;R$ 246,00;R$ 230,00;106.9%;Superada\nTicket Médio Pax;R$ 82,00;R$ 78,00;105.1%;Superada\nTempo Saída Prato;18.2 min;22.0 min;120.8%;Superada\nLabor Cost %;18.4%;20.0%;108.0%;Superada\nNPS / Avaliação Google;4.8★;4.7★;102.1%;Superada\nAcuracidade Estoque;98.4%;98.0%;100.4%;Superada\nRastreabilidade Freezer;100%;100%;100.0%;Superada\n`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `relatorio_executivo_${restaurantName.toLowerCase().replace(/\s+/g, '_')}_${period.toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 400);
  };

  // Consulta IA ao Gemini para análise de relatórios
  const handleAskGeminiReport = async () => {
    if (!aiCustomQuestion.trim()) return;
    setAiLoading(true);
    setAiCustomAnswer(null);
    try {
      const prompt = `Como consultor executivo do restaurante ${restaurantName}, analise a seguinte questão sobre os relatórios operacionais e financeiros da loja (Faturamento: R$ 428.500, CMV: 29.4%, Ticket Médio: R$ 246,00, Labor Cost: 18.4%, Tempo Médio Boqueta: 18.2min): "${aiCustomQuestion}". Forneça um diagnóstico direto para os donos Rogério e Sidney e os gerentes Ivan e Pabricio com plano de ação prático.`;
      const reply = await askGemini(prompt, 'ANALISE_RELATORIOS_EXECUTIVOS');
      setAiCustomAnswer(reply);
    } catch (e: any) {
      setAiCustomAnswer(`Erro ao processar consulta: ${e?.message || 'Servidor indisponível'}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Banner de Acesso Executivo */}
      <div className="bg-gradient-to-r from-[#051c15] via-[#0a2e23] to-[#041711] text-white p-5 rounded-2xl border border-emerald-800/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-black tracking-tight text-white">Central de Relatórios & Inteligência</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Exclusivo: Gerente & Dono
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Cockpit Unificado de Dashboards, Indicadores, Metas & DRE • {restaurantName}
            </p>
          </div>
        </div>

        {/* Ações de Exportação e Impressão */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer disabled:opacity-50"
            title="Exportar dados consolidados em planilha CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isExporting ? 'Exportando...' : 'Exportar CSV'}</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer"
            title="Imprimir relatório gerencial ou salvar como PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Banner de Dados Oficiais Teknisa (Alimentação Diária) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white">Relatórios Alimentados Diariamente via Teknisa (Excel)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {feedStatus.periodCompetence}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Última sincronização em <strong>{feedStatus.formattedDate} às {feedStatus.formattedTime}</strong> • Feita por: <strong className="text-emerald-400">{feedStatus.updatedBy}</strong> ({feedStatus.userRole})
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFeedModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Alimentar Base Teknisa</span>
        </button>
      </div>

      {/* Barra de Filtros Globais */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-800" />
          <span className="text-xs font-bold text-slate-700">Filtros do Dashboard:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor de Período */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['HOJE', 'SEMANA', 'MES_ATUAL', 'MES_ANTERIOR', 'TRIMESTRE'] as ReportPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  period === p
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p === 'HOJE' && 'Hoje'}
                {p === 'SEMANA' && '7 Dias'}
                {p === 'MES_ATUAL' && 'Mês Atual'}
                {p === 'MES_ANTERIOR' && 'Mês Anterior'}
                {p === 'TRIMESTRE' && 'Trimestre'}
              </button>
            ))}
          </div>

          {/* Seletor de Turno */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['TODOS', 'ALMOCO', 'JANTAR'] as ReportShift[]).map((s) => (
              <button
                key={s}
                onClick={() => setShift(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  shift === s
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s === 'TODOS' && 'Todos os Turnos'}
                {s === 'ALMOCO' && 'Almoço'}
                {s === 'JANTAR' && 'Jantar'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Superior de Categorias de Relatórios */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          { id: 'COCKPIT_GERAL' as ReportCategory, label: 'Cockpit 360°', icon: Target, badge: 'Metas' },
          { id: 'VENDAS_FATURAMENTO' as ReportCategory, label: 'Vendas & ABC', icon: DollarSign, badge: 'Comercial' },
          { id: 'DRE_FINANCEIRO' as ReportCategory, label: 'DRE & Lucro', icon: TrendingUp, badge: 'Financeiro' },
          { id: 'CMV_ESTOQUE' as ReportCategory, label: 'CMV & Perdas', icon: Package, badge: 'Estoque' },
          { id: 'FREEZER_CDA' as ReportCategory, label: 'Freezer CDA', icon: Snowflake, badge: 'Lotes' },
          { id: 'SALAO_CLIENTES' as ReportCategory, label: 'Salão & NPS', icon: UtensilsCrossed, badge: 'Clientes' },
          { id: 'EQUIPE_RH' as ReportCategory, label: 'Equipe & RH', icon: Users, badge: 'Bônus' },
          { id: 'IA_DIAGNOSTICO' as ReportCategory, label: 'Consultoria Executiva', icon: Sparkles, badge: 'Diagnóstico' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border cursor-pointer ${
                isActive
                  ? 'bg-[#0a2e23] text-white border-emerald-700 shadow-md scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/80 shadow-xs'
              }`}
            >
              <div className={`p-2 rounded-xl ${isActive ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-100 text-slate-600'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold leading-tight line-clamp-1">{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-semibold ${
                isActive ? 'bg-white/10 text-emerald-200' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 1. COCKPIT GERAL 360° (INDICADORES & METAS CONSOLIDADOS)     */}
      {/* ============================================================ */}
      {activeReport === 'COCKPIT_GERAL' && (
        <div className="space-y-4">
          {/* Card Resumo do Mês */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">Scorecard de Metas & Indicadores Globais</h2>
                <p className="text-xs text-slate-500 mt-0.5">Visão consolidada do restaurante para sócios e gerência ({periodLabel})</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  8 de 9 Metas Batidas (88.9%)
                </span>
              </div>
            </div>

            {/* Grid dos 8 KPIs Vitais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              {/* KPI 1: Faturamento */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span>Faturamento Bruto</span>
                  <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                    {financeSnapshot.grossRevenue > 0 ? `${((financeSnapshot.grossRevenue / 450000) * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
                <p className="text-xl font-black text-emerald-950 font-mono">
                  R$ {financeSnapshot.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${Math.min(100, (financeSnapshot.grossRevenue / 450000) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Meta: R$ 450.000,00</span>
                  <span className="text-slate-600 font-semibold">
                    {financeSnapshot.grossRevenue === 0 ? 'Aguardando Vendas / Carga' : `Pedidos: ${financeSnapshot.totalOrders}`}
                  </span>
                </div>
              </div>

              {/* KPI 2: CMV Global */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span>CMV Global Real</span>
                  <span className="text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">Meta &le;30.0%</span>
                </div>
                <p className="text-xl font-black text-blue-950 font-mono">
                  {financeSnapshot.cmvPct > 0 ? `${financeSnapshot.cmvPct.toFixed(1)}%` : '0.0%'}
                </p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, financeSnapshot.cmvPct * 3.3)}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{financeSnapshot.cmvPct === 0 ? 'Sem insumos consumidos' : `Custo: R$ ${financeSnapshot.cmvReais.toFixed(2)}`}</span>
                  <span className="text-emerald-600 font-bold">
                    {financeSnapshot.cmvPct <= 30.0 ? 'Meta Controlada' : 'Atenção'}
                  </span>
                </div>
              </div>

              {/* KPI 3: Ticket Médio Mesa */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span>Ticket Médio por Mesa</span>
                  <span className="text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                    Pax: R$ {financeSnapshot.averageTicketPax.toFixed(2)}
                  </span>
                </div>
                <p className="text-xl font-black text-amber-950 font-mono">
                  R$ {financeSnapshot.averageTicketTable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (financeSnapshot.averageTicketTable / 230) * 100)}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Meta: R$ 230,00</span>
                  <span className="text-slate-600 font-bold">
                    {financeSnapshot.totalOrders === 0 ? 'Sem mesas fechadas' : `${financeSnapshot.totalOrders} Mesas`}
                  </span>
                </div>
              </div>

              {/* KPI 4: Labor Cost */}
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span>Labor Cost (Folha RH)</span>
                  <span className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">Meta &le;20.0%</span>
                </div>
                <p className="text-xl font-black text-purple-950">18.4%</p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '92%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Folha: R$ 78.844</span>
                  <span className="text-emerald-600 font-bold">Alta Eficiência</span>
                </div>
              </div>

              {/* KPI 5: Tempo Saída Prato Boqueta */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span>Tempo Médio Boqueta</span>
                  <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">Meta &le;22m</span>
                </div>
                <p className="text-xl font-black text-slate-900">18.2 min</p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '82%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Pico do Almoço: 20.4m</span>
                  <span className="text-emerald-600 font-bold">Rápido</span>
                </div>
              </div>

              {/* KPI 6: NPS & Avaliações Google */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span>Avaliações Google / NPS</span>
                  <span className="text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">94% Promotores</span>
                </div>
                <p className="text-xl font-black text-slate-900">4.8★</p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '96%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Meta: 4.7★</span>
                  <span className="text-emerald-600 font-bold">Excelente</span>
                </div>
              </div>

              {/* KPI 7: Rastreio de Freezer CDA */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span>Rastreabilidade CDA (3 Lotes)</span>
                  <span className="text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">100% QR</span>
                </div>
                <p className="text-xl font-black text-slate-900">100%</p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>0 lotes vencidos</span>
                  <span className="text-emerald-600 font-bold">Zero Ruptura</span>
                </div>
              </div>

              {/* KPI 8: Bônus da Gerência */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span>Bônus da Gerência (Ivan/Pabricio)</span>
                  <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">97.5%</span>
                </div>
                <p className="text-xl font-black text-emerald-800">R$ 1.950</p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '97.5%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Teto Máximo: R$ 2.000</span>
                  <span className="text-emerald-600 font-bold">No Bolso</span>
                </div>
              </div>
            </div>
          </div>

          {/* Destaque Executivo dos Proprietários (Rogério & Sidney) */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent p-5 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Resumo Estratégico para Rogério & Sidney (Proprietários)</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Operação do Engenho Manauara saudável, lucrativa e sob controle rígido dos gerentes Ivan e Pabricio.
                  EBITDA atual em <strong>21.3% da receita líquida</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveReport('DRE_FINANCEIRO')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Ver DRE Completa</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. VENDAS, FATURAMENTO & CURVA ABC                           */}
      {/* ============================================================ */}
      {activeReport === 'VENDAS_FATURAMENTO' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Faturamento por Turno */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  Divisão de Vendas por Turno
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">Almoço Executivo & Buffet (11:30 - 15:30)</span>
                    <span className="text-slate-900 font-black">R$ 248.530 (58%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-700 h-full rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700">Jantar, Happy Hour & Bar (18:00 - 23:30)</span>
                    <span className="text-slate-900 font-black">R$ 179.970 (42%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                <p><strong>Total de Mesas Atendidas:</strong> 1.742 mesas</p>
                <p><strong>Total de Clientes (Pax):</strong> 5.225 pessoas</p>
                <p><strong>Ticket Médio por Cliente:</strong> R$ 82,00</p>
              </div>
            </div>

            {/* Faturamento por Categoria */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-blue-700" />
                  Vendas por Categoria de Produto
                </h3>
              </div>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: 'Carnes Nobres & Peixes Amazônicos', val: 'R$ 188.540', pct: 44, color: 'bg-emerald-600' },
                  { label: 'Chopp Brahma, Cervejas & Bar', val: 'R$ 102.840', pct: 24, color: 'bg-amber-500' },
                  { label: 'Entradas, Petiscos & Porções', val: 'R$ 59.990', pct: 14, color: 'bg-blue-500' },
                  { label: 'Vinhos, Cachaças & Destilados', val: 'R$ 47.135', pct: 11, color: 'bg-purple-600' },
                  { label: 'Sobremesas & Cafés', val: 'R$ 30.000', pct: 7, color: 'bg-rose-500' },
                ].map((c) => (
                  <div key={c.label}>
                    <div className="flex justify-between font-bold mb-0.5">
                      <span className="text-slate-700">{c.label}</span>
                      <span className="text-slate-900">{c.val} ({c.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${c.color} h-full rounded-full`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formas de Pagamento */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-700" />
                  Mix de Meios de Pagamento
                </h3>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-emerald-50 text-emerald-950 font-bold">
                  <span>PIX Instantâneo (Taxa 0.49%)</span>
                  <span>R$ 162.830 (38%)</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-blue-50 text-blue-950 font-bold">
                  <span>Cartão de Crédito (Taxa 2.19%)</span>
                  <span>R$ 154.260 (36%)</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-100 text-slate-800 font-bold">
                  <span>Cartão de Débito (Taxa 0.99%)</span>
                  <span>R$ 68.560 (16%)</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-amber-50 text-amber-950 font-bold">
                  <span>Vouchers Refeição (Ticket/Alelo)</span>
                  <span>R$ 42.850 (10%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Curva ABC de Produtos Mais Vendidos */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Curva ABC: Top 8 Produtos em Volume e Margem de Contribuição</span>
              <span className="text-xs text-slate-400 font-normal">Base de dados PDV Toast / Teknisa</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2.5">Classe</th>
                    <th className="py-2.5">Item do Cardápio</th>
                    <th className="py-2.5">Setor</th>
                    <th className="py-2.5 text-right">Qtd Vendida</th>
                    <th className="py-2.5 text-right">Preço Venda</th>
                    <th className="py-2.5 text-right">Faturamento</th>
                    <th className="py-2.5 text-right">Margem Líquida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5"><span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-emerald-100 text-emerald-800">A</span></td>
                    <td className="py-2.5 font-bold text-slate-900">Costela de Tambaqui Nobre na Brasa</td>
                    <td className="py-2.5 text-slate-500">Cozinha Principal</td>
                    <td className="py-2.5 text-right font-mono">482 un</td>
                    <td className="py-2.5 text-right font-mono">R$ 118,00</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-900">R$ 56.876</td>
                    <td className="py-2.5 text-right font-mono text-emerald-700 font-bold">71.5%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5"><span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-emerald-100 text-emerald-800">A</span></td>
                    <td className="py-2.5 font-bold text-slate-900">Chopp Brahma 350ml Gelado</td>
                    <td className="py-2.5 text-slate-500">Bar de Chopp</td>
                    <td className="py-2.5 text-right font-mono">3.410 un</td>
                    <td className="py-2.5 text-right font-mono">R$ 13,90</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-900">R$ 47.399</td>
                    <td className="py-2.5 text-right font-mono text-emerald-700 font-bold">78.2%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5"><span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-emerald-100 text-emerald-800">A</span></td>
                    <td className="py-2.5 font-bold text-slate-900">Pirarucu de Casaca Tradicional</td>
                    <td className="py-2.5 text-slate-500">Cozinha Principal</td>
                    <td className="py-2.5 text-right font-mono">390 un</td>
                    <td className="py-2.5 text-right font-mono">R$ 98,00</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-900">R$ 38.220</td>
                    <td className="py-2.5 text-right font-mono text-emerald-700 font-bold">69.0%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5"><span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-emerald-100 text-emerald-800">A</span></td>
                    <td className="py-2.5 font-bold text-slate-900">Camarão Rosa Empanado com Geleia de Cupuaçu</td>
                    <td className="py-2.5 text-slate-500">Cozinha Principal</td>
                    <td className="py-2.5 text-right font-mono">315 un</td>
                    <td className="py-2.5 text-right font-mono">R$ 89,00</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-900">R$ 28.035</td>
                    <td className="py-2.5 text-right font-mono text-emerald-700 font-bold">66.4%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5"><span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-blue-100 text-blue-800">B</span></td>
                    <td className="py-2.5 font-bold text-slate-900">Caipirinha de Cachaça da Casa com Limão</td>
                    <td className="py-2.5 text-slate-500">Comissaria / Bar</td>
                    <td className="py-2.5 text-right font-mono">820 un</td>
                    <td className="py-2.5 text-right font-mono">R$ 24,00</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-900">R$ 19.680</td>
                    <td className="py-2.5 text-right font-mono text-emerald-700 font-bold">81.0%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5"><span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-blue-100 text-blue-800">B</span></td>
                    <td className="py-2.5 font-bold text-slate-900">Porção de Dadinho de Tapioca com Mel de Engenho</td>
                    <td className="py-2.5 text-slate-500">Cozinha / Petiscos</td>
                    <td className="py-2.5 text-right font-mono">490 un</td>
                    <td className="py-2.5 text-right font-mono">R$ 38,00</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-900">R$ 18.620</td>
                    <td className="py-2.5 text-right font-mono text-emerald-700 font-bold">79.5%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5"><span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-amber-100 text-amber-800">C</span></td>
                    <td className="py-2.5 font-bold text-slate-900">Garrafa Vinho Tinto Alentejano Reserva</td>
                    <td className="py-2.5 text-slate-500">Adega / Comissárias</td>
                    <td className="py-2.5 text-right font-mono">88 un</td>
                    <td className="py-2.5 text-right font-mono">R$ 175,00</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-900">R$ 15.400</td>
                    <td className="py-2.5 text-right font-mono text-emerald-700 font-bold">64.0%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5"><span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-amber-100 text-amber-800">C</span></td>
                    <td className="py-2.5 font-bold text-slate-900">Cartola Amazônica com Sorvete de Castanha</td>
                    <td className="py-2.5 text-slate-500">Sobremesas</td>
                    <td className="py-2.5 text-right font-mono">420 un</td>
                    <td className="py-2.5 text-right font-mono">R$ 32,00</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-900">R$ 13.440</td>
                    <td className="py-2.5 text-right font-mono text-emerald-700 font-bold">74.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. DRE & LUCRATIVIDADE EBITDA                                */}
      {/* ============================================================ */}
      {activeReport === 'DRE_FINANCEIRO' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Demonstrativo do Resultado do Exercício (DRE Gerencial)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Padrão Abrasel & Governança Corporativa • {periodLabel}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Lucro Líquido Real:</span>
                <p className="text-xl font-black text-emerald-700">R$ 81.935,00 (21.3%)</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2.5 text-left">Estrutura de Contas Gerenciais</th>
                    <th className="py-2.5 text-right">Valor Orçado</th>
                    <th className="py-2.5 text-right">Valor Realizado</th>
                    <th className="py-2.5 text-right">% Receita Líq.</th>
                    <th className="py-2.5 text-right">Desvio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr className="bg-emerald-50/40 font-bold text-slate-900">
                    <td className="py-2.5 font-sans">(+) RECEITA BRUTA DE VENDAS</td>
                    <td className="py-2.5 text-right">R$ 450.000,00</td>
                    <td className="py-2.5 text-right text-emerald-950 font-black">R$ 428.500,00</td>
                    <td className="py-2.5 text-right">100.0%</td>
                    <td className="py-2.5 text-right text-amber-700">-R$ 21.500,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-4 text-slate-600 font-sans">(-) Custo da Mercadoria Vendida (CMV Insumos)</td>
                    <td className="py-2 text-right text-slate-500">-R$ 121.230,00</td>
                    <td className="py-2 text-right text-red-600">-R$ 113.129,00</td>
                    <td className="py-2 text-right text-emerald-700 font-bold">26.4%</td>
                    <td className="py-2 text-right text-emerald-700">+R$ 8.101,00</td>
                  </tr>
                  <tr className="bg-emerald-100/80 font-black text-slate-900 border-t-2 border-emerald-700">
                    <td className="py-3 font-sans text-sm">(=) MARGEM OPERACIONAL DE LOJA (Margem de Contribuição)</td>
                    <td className="py-3 text-right">R$ 328.770,00</td>
                    <td className="py-3 text-right text-emerald-800 text-base font-black">R$ 315.371,00</td>
                    <td className="py-3 text-right text-emerald-800 text-sm font-black">73.6%</td>
                    <td className="py-3 text-right text-slate-600 font-normal">-R$ 13.399,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Aviso da Gestão Administrativa Centralizada */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <Building2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Gestão Administrativa & Corporativa Centralizada</span>
                Despesas administrativas e tributárias (Impostos fiscais, RH e folha de pagamento da brigada, aluguel do imóvel, utilidades operacionais e provisão de manutenção preventiva) são apuradas e geridas diretamente pela seção administrativa central da empresa, não onerando a rotina de controle operacional da loja.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Meta de Faturamento Operacional</span>
                <p className="text-sm font-black text-slate-900 mt-0.5">R$ 428.500,00 / mês</p>
                <p className="text-[10px] text-emerald-600 mt-0.5 font-semibold">95.2% da meta máxima atingida</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Margem Operacional de Loja</span>
                <p className="text-sm font-black text-emerald-700 mt-0.5">73.6% (Meta: &ge;70.0%)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">+3.6% acima do benchmark</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Controle de CMV (Insumos)</span>
                <p className="text-sm font-black text-slate-900 mt-0.5">26.4% da Receita</p>
                <p className="text-[10px] text-emerald-600 mt-0.5 font-semibold">Dentro do teto viável (&le;28%)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. CMV, ESTOQUE & AUDITORIA DE PERDAS                        */}
      {/* ============================================================ */}
      {activeReport === 'CMV_ESTOQUE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* CMV Detalhado por Setor */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-700" />
                  CMV Real vs Meta por Setor de Loja
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { setor: 'Cozinha Principal & Carnes Nobres', meta: 30.0, real: 28.2, resp: 'Mádio / Esmael', status: 'EXCELENTE' },
                  { setor: 'Bar de Chopp Brahma & Bebidas', meta: 26.0, real: 24.8, resp: 'Pedro (Chefe do Bar)', status: 'EXCELENTE' },
                  { setor: 'Adega, Cachaças & Charcutaria', meta: 32.0, real: 33.1, resp: 'Anne / Elendia', status: 'ALERTA' },
                  { setor: 'Caixa (Bombons, Balas & Chocolates)', meta: 25.0, real: 22.5, resp: 'Amanda (Caixa)', status: 'EXCELENTE' },
                ].map((s) => (
                  <div key={s.setor} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900">{s.setor}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        s.status === 'EXCELENTE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.real}% (Meta: &le;{s.meta}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
                      <div
                        className={`h-full rounded-full ${s.status === 'EXCELENTE' ? 'bg-emerald-600' : 'bg-amber-500'}`}
                        style={{ width: `${(s.real / s.meta) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Responsável: {s.resp}</span>
                      <span className={s.status === 'EXCELENTE' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                        {s.status === 'EXCELENTE' ? '✓ Margem Protegida' : '⚠ Desvio de +1.1%'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa de Perdas e Desperdícios */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Auditoria de Perdas & Desperdícios (R$ 1.750 no mês)
                </h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { motivo: 'Validade Expirada (Insumos sem giro)', val: 'R$ 640,00', pct: 36, cor: 'bg-red-500' },
                  { motivo: 'Degustação & Cortesia Autorizada', val: 'R$ 520,00', pct: 30, cor: 'bg-amber-500' },
                  { motivo: 'Erro de Preparo / Boqueta', val: 'R$ 410,00', pct: 24, cor: 'bg-orange-500' },
                  { motivo: 'Quebra / Avaria de Vasilhame', val: 'R$ 180,00', pct: 10, cor: 'bg-slate-400' },
                ].map((p) => (
                  <div key={p.motivo} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800">{p.motivo}</span>
                      <span className="text-slate-900 font-mono">{p.val} ({p.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
                      <div className={`${p.cor} h-full rounded-full`} style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Acuracidade do Inventário: 98.4%
                </p>
                <p className="text-[11px] text-emerald-800">
                  Divergência entre a contagem cega dos supervisores e o estoque virtual inteligente está abaixo do limite de tolerância (1.6% vs 2.0%).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. RASTREIO FREEZER & CONTROLE CDA                           */}
      {/* ============================================================ */}
      {activeReport === 'FREEZER_CDA' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Relatório de Rastreabilidade dos 3 Lotes do Freezer</h3>
                <p className="text-xs text-slate-500 mt-0.5">Protocolo de Segurança Térmica CDA & Cozinha • Unidade Manauara</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                100% dos Lotes Mapeados via QR Code
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white uppercase">Lote 1 • Azul</span>
                <p className="text-xs font-bold text-slate-900">Prioridade Máxima (PVPS)</p>
                <p className="text-[11px] text-slate-600">Lote mais antigo em câmara. Deve ser consumido primeiro.</p>
                <p className="text-xs font-black text-blue-900 pt-1 font-mono">14 itens cadastrados</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white uppercase">Lote 2 • Verde</span>
                <p className="text-xs font-bold text-slate-900">Estoque Regulador</p>
                <p className="text-[11px] text-slate-600">Entra em consumo assim que o Lote 1 for baixado na cozinha.</p>
                <p className="text-xs font-black text-emerald-900 pt-1 font-mono">11 itens cadastrados</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-600 text-white uppercase">Lote 3 • Âmbar</span>
                <p className="text-xs font-bold text-slate-900">Lote Recente (CDA)</p>
                <p className="text-[11px] text-slate-600">Chegada mais recente do caminhão refrigerado do CDA.</p>
                <p className="text-xs font-black text-amber-900 pt-1 font-mono">8 itens cadastrados</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Indicadores de Ciclo Térmico & ANVISA RDC 216:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400">Tempo Médio no Degelo:</span>
                  <p className="font-bold text-slate-900">31.4 horas</p>
                  <span className="text-[9px] text-emerald-600">Faixa Segura: 24h a 48h</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400">Temperatura do Degelo:</span>
                  <p className="font-bold text-slate-900">2.8°C</p>
                  <span className="text-[9px] text-emerald-600">Padrão: 0°C a 4°C</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400">Temperatura Freezer:</span>
                  <p className="font-bold text-slate-900">-19.4°C</p>
                  <span className="text-[9px] text-emerald-600">Padrão: &le;-18°C</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400">Itens em Alerta de Validade:</span>
                  <p className="font-bold text-emerald-700">0 itens</p>
                  <span className="text-[9px] text-emerald-600">Sem risco de perda</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. SALÃO, BOQUETA & SATISFAÇÃO (NPS)                         */}
      {/* ============================================================ */}
      {activeReport === 'SALAO_CLIENTES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                Tempos Operacionais
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span>Tempo de Saída de Pratos:</span>
                  <span className="font-black text-emerald-700">18.2 min (Meta &le;22m)</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span>Permanência Média na Mesa:</span>
                  <span className="font-black text-slate-800">54 min</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span>Giro de Mesas no Almoço:</span>
                  <span className="font-black text-slate-800">2.3 giros / mesa</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span>Tempo Resposta Garçom:</span>
                  <span className="font-black text-emerald-700">1.8 min</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Satisfação & Reputação
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-amber-50 text-amber-950 font-bold">
                  <span>Nota Média Google Reviews:</span>
                  <span>4.8 ★ (1.240 avaliações)</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 text-slate-700 font-bold">
                  <span>Net Promoter Score (NPS):</span>
                  <span>+82 (Zona de Excelência)</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50 text-slate-700 font-bold">
                  <span>Avaliações 5 Estrelas:</span>
                  <span>92.4%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-emerald-50 text-emerald-950 font-bold">
                  <span>Reclamações Críticas:</span>
                  <span>Zero no turno de hoje</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-700" />
                Venda Casada & Up-Selling
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span>Conversão de Sobremesas:</span>
                  <span className="font-bold text-emerald-700">38.2% das mesas</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span>Conversão Bebidas Alcoólicas:</span>
                  <span className="font-bold text-emerald-700">64.5% das mesas</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span>Entrada no Pré-Prato:</span>
                  <span className="font-bold text-emerald-700">49.1% das mesas</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                  <span>Café Espresso no Encerramento:</span>
                  <span className="font-bold text-emerald-700">41.0% das mesas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. EQUIPE, PRODUTIVIDADE RH & BÔNUS                         */}
      {/* ============================================================ */}
      {activeReport === 'EQUIPE_RH' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Produtividade de Equipe & Bônus de Liderança</h3>
                <p className="text-xs text-slate-500 mt-0.5">Gestão de Escala, Checklists e Bonificação de Resultados</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-800 text-xs font-black">
                Labor Cost: 18.4% (Meta &le;20%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Quadro de Colaboradores</span>
                <p className="text-xl font-black text-slate-900 mt-1">11 Operadores</p>
                <p className="text-[10px] text-emerald-600 mt-0.5 font-semibold">100% de assiduidade hoje</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Conformidade Checklists</span>
                <p className="text-xl font-black text-emerald-800 mt-1">98.6%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Abertura, Troca e Fechamento</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Bônus Gerencial Batido</span>
                <p className="text-xl font-black text-emerald-800 mt-1">R$ 1.950,00</p>
                <p className="text-[10px] text-emerald-600 mt-0.5 font-semibold">97.5% da meta mensal</p>
              </div>
            </div>

            {/* Setores e Responsáveis */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="p-3 bg-slate-100 text-slate-700 font-bold border-b border-slate-200 flex justify-between">
                <span>Responsabilidade Setorial</span>
                <span>Avaliação de Conformidade</span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Gerência Geral & Treinamento Executivo</p>
                    <p className="text-[11px] text-slate-500">Ivan (Gerente Geral) & Pabricio (Gerente em Treinamento / Criador)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">99.2% Conformidade</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Supervisão de Loja & Salão</p>
                    <p className="text-[11px] text-slate-500">Patricia (Supervisora de Loja)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">98.5% Conformidade</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Cozinha Principal & Pré-Preparo</p>
                    <p className="text-[11px] text-slate-500">Mádio (Chefe de Cozinha) & Esmael (Sub Chefe)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">98.0% Conformidade</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Bar de Chopp Brahma & Bebidas</p>
                    <p className="text-[11px] text-slate-500">Pedro (Chefe do Bar)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">97.8% Conformidade</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Comissaria, Adega & Charcutaria</p>
                    <p className="text-[11px] text-slate-500">Anne & Elendia (Comissárias)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">98.9% Conformidade</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Caixa & Frente de Atendimento</p>
                    <p className="text-[11px] text-slate-500">Amanda (Operadora de Caixa)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">99.5% Conformidade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. PARECER EXECUTIVO DA IA GEMINI                            */}
      {/* ============================================================ */}
      {activeReport === 'IA_DIAGNOSTICO' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-purple-500/30 shadow-md space-y-4">
            <div className="flex items-center gap-3 border-b border-purple-500/20 pb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Diagnóstico Estratégico & Análise de Desempenho</h3>
                <p className="text-xs text-purple-200/70">Inteligência Operacional grounded nos Indicadores Reais do Restaurante</p>
              </div>
            </div>

            {/* 3 Insights Prontos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-purple-500/20 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">1. Proteção de Margem (CMV 29.4%)</span>
                <p className="font-bold text-white">Excelente rendimento das carnes nobres</p>
                <p className="text-purple-200/80 leading-relaxed">
                  O Lombo de Tambaqui e o Pirarucu de Casaca estão com rendimento 4% superior ao projetado. Mantenha o pré-preparo rigoroso do Sous-Chef Esmael.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-purple-500/20 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase">2. Oportunidade no Bar (Chopp)</span>
                <p className="font-bold text-white">Happy Hour pode crescer 15%</p>
                <p className="text-purple-200/80 leading-relaxed">
                  O pico das 18h às 20h tem folga de 6 mesas. Ações com Chopp Brahma em dobro casado com Dadinho de Tapioca protegerão o CMV e aumentarão o faturamento.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-purple-500/20 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase">3. Adega & Vinhos Nobres</span>
                <p className="font-bold text-white">Atenção ao CMV de vinhos (33.1%)</p>
                <p className="text-purple-200/80 leading-relaxed">
                  Negociar bonificação com a importadora para a linha de vinhos alentejanos das comissárias Anne e Elendia para puxar o CMV da adega para ≤30%.
                </p>
              </div>
            </div>

            {/* Pergunta Interativa para a IA sobre Relatórios */}
            <div className="bg-black/30 p-4 rounded-xl border border-purple-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white">Consulta Rápida de Indicadores & Cenários:</h4>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  'Como aumentar o ticket médio no almoço de sábado?',
                  'Como reduzir o CMV do setor de vinhos para 30%?',
                  'Qual o impacto financeiro de estender o Happy Hour?',
                  'Como atingir os R$ 2.000 de bônus neste final de semana?',
                ].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => setAiCustomQuestion(sug)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-200 border border-purple-500/20 transition-all cursor-pointer text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={aiCustomQuestion}
                  onChange={(e) => setAiCustomQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAskGeminiReport(); }}
                  placeholder="Solicite uma análise executiva específica sobre faturamento, CMV ou metas..."
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  onClick={handleAskGeminiReport}
                  disabled={aiLoading || !aiCustomQuestion.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                  <span>{aiLoading ? 'Gerando...' : 'Diagnóstico'}</span>
                </button>
              </div>

              {aiCustomAnswer && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-purple-500/30 text-xs text-purple-100 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-300">
                  {aiCustomAnswer}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alimentação Diária Teknisa */}
      <TeknisaFeedModal
        isOpen={showFeedModal}
        onClose={() => setShowFeedModal(false)}
        currentUserName="Pabricio"
      />
    </div>
  );
};
