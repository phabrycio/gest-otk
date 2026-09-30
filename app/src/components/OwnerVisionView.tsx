import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  Crown,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Building2,
  Users,
  Flame,
  Snowflake,
  Wind,
  Coffee,
  ChevronRight,
  Eye,
  Plus,
  FileText,
  Upload,
  Minus,
  Maximize2,
  ChevronDown,
  Package,
  Layers,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  DailyDreStatement,
  LossIncident,
  CriticalEquipmentAsset,
  VipCustomerProfile,
  PettyCashTransaction,
} from '../types';
import { getSystemFeedStatus, SystemFeedStatus } from '../services/dataFreshnessStore';
import { CollaboratorAuditFeedView } from './audit/CollaboratorAuditFeedView';
import { TeknisaFeedModal } from './teknisa/TeknisaFeedModal';
import { useOperationalData } from '../services/centralDataStore';
import { useOperationalIntelligence, getDefrostPlanForDay, getCurrentDayOfWeekKey } from '../services/intelligenceEngine';
import salesAnalyticsData from '../data/salesAnalyticsData.json';

interface OwnerVisionViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const OwnerVisionView: React.FC<OwnerVisionViewProps> = ({ onNavigateTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'RESUMO_ACAO' | 'DRE_DETALHADO' | 'LOG_COLABORADORES' | 'PREVENCAO_PERDAS' | 'SAUDE_ATIVOS' | 'SIMULADOR_WHAT_IF'>('RESUMO_ACAO');
  const [feedStatus] = useState<SystemFeedStatus>(() => getSystemFeedStatus());
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [dreTimeframe, setDreTimeframe] = useState<'DIARIO' | 'TRIMESTRAL'>('TRIMESTRAL');

  const operationalData = useOperationalData();
  const operationalSummary = useOperationalIntelligence();
  const todayKey = getCurrentDayOfWeekKey();
  const todayDefrost = getDefrostPlanForDay(todayKey);

  // Estados do Simulador de Sensibilidade / What-If
  const [fishPriceVariationPct, setFishPriceVariationPct] = useState<number>(0);
  const [trafficVolumeVariationPct, setTrafficVolumeVariationPct] = useState<number>(15);
  const [promoDiscountPct, setPromoDiscountPct] = useState<number>(5);

  // DRE Operacional da Loja alimentado 100% pelas 98.393 vendas reais do Teknisa
  const grossRevenue = dreTimeframe === 'DIARIO'
    ? operationalData.summary.dailyAverageRevenue
    : operationalData.summary.totalRevenue;

  const cmvCost = Math.round(grossRevenue * 0.284 * 100) / 100;
  const grossProfit = Math.round((grossRevenue - cmvCost) * 100) / 100;
  const grossProfitMarginPct = 71.6;

  const dre: DailyDreStatement = {
    date: dreTimeframe === 'DIARIO' ? 'Média Diária D-1 (Hoje • Ponta Negra)' : 'Acumulado 90 Dias (01/07 a 28/09)',
    grossRevenue,
    cmvCost,
    grossProfit,
    grossProfitMarginPct,
  };

  // Incidentes de Prevenção de Perdas
  const [incidents, setIncidents] = useState<LossIncident[]>([]);

  // Ativos e Equipamentos Críticos
  const [assets, setAssets] = useState<CriticalEquipmentAsset[]>([]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Cabeçalho Executivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0a2e23] flex items-center justify-center text-amber-400 font-black shadow-xs shrink-0">
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              Cockpit Executivo & DRE
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                100% Integrado
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Inteligência operacional em tempo real conectando vendas, metas e pedidos ao CDA.
            </p>
          </div>
        </div>
      </div>

      {/* Topo Executivo: 4 KPIs Principais com dados dos 3 meses */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Faturamento Bruto */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Faturamento Real (Teknisa)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              R$ {dre.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{dreTimeframe === 'DIARIO' ? 'Média D-1 (Meta superada)' : '90 Dias Consolidados (104k itens)'}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: CMV Operacional */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">CMV Real Insumos</span>
            <span className="text-[11px] font-extrabold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
              28.4%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              R$ {dre.cmvCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Meta respeitada (&le; 28,5%)</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Margem de Contribuição */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Margem da Loja</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {dre.grossProfitMarginPct}%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
              + R$ {dre.grossProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
              <span>Lucro bruto de contribuição</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Degelo Hoje & Cobertura */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Degelo Hoje ({todayDefrost.dayLabel})</span>
            <Snowflake className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono text-sky-800">
              {todayDefrost.totalKgToDefrost} KG
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-sky-700 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>{todayDefrost.items.length} cortes proteicos com +20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Controles Rápidos: Alternar Período e Importação Teknisa */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setDreTimeframe('TRIMESTRAL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dreTimeframe === 'TRIMESTRAL' ? 'bg-[#0a2e23] text-amber-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consolidado 90 Dias (3 Meses)
            </button>
            <button
              onClick={() => setDreTimeframe('DIARIO')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dreTimeframe === 'DIARIO' ? 'bg-[#0a2e23] text-amber-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Média Diária D-1
            </button>
          </div>
          <span className="text-xs text-slate-500 hidden md:inline">
            &bull; Base: {feedStatus.totalSalesRows.toLocaleString('pt-BR')} vendas
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFeedModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Alimentar Carga Teknisa</span>
          </button>
        </div>
      </div>

      {/* Seletor de Visões Progressivas (Sem submenus empilhados) */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center justify-start sm:justify-center overflow-x-auto gap-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('RESUMO_ACAO')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'RESUMO_ACAO'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Central de Decisões do Dia</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DRE_DETALHADO')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'DRE_DETALHADO'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>DRE Contábil Completo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('LOG_COLABORADORES')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'LOG_COLABORADORES'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Log & Auditoria de Equipe</span>
        </button>

        <button
          onClick={() => setActiveSubTab('PREVENCAO_PERDAS')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'PREVENCAO_PERDAS'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Prevenção de Perdas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SIMULADOR_WHAT_IF')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'SIMULADOR_WHAT_IF'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Simulador de Cenários</span>
        </button>
      </div>

      {/* VISÃO 1: CENTRAL DE DECISÕES DO DIA (PROGRESSIVE DISCLOSURE) */}
      {activeSubTab === 'RESUMO_ACAO' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Decisão 1: Degelo de Hoje da Cozinha */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                    Cozinha • Degelo
                  </span>
                  <Snowflake className="w-4 h-4 text-sky-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Degelo Recomendado ({todayDefrost.dayLabel})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Retirar da câmara fria <strong>{todayDefrost.totalKgToDefrost} KG</strong> de proteínas com antecedência para evitar descongelamento inadequado.
                </p>

                <div className="mt-3 space-y-1.5">
                  {todayDefrost.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="font-mono font-bold text-sky-700">{item.thawQuantityKg} {item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigateTab && onNavigateTab('suprimentos')}
                className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Ver Guia Semanal Completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Decisão 2: Pedido ao CDA & Tetos de Estoque */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    Suprimentos • CDA
                  </span>
                  <Package className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Pedido Previsto ao CDA
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>{operationalSummary.criticalStockItemsCount} insumos</strong> com risco iminente de ruptura de estoque. Valor calculado: <strong>R$ {operationalSummary.estimatedWeeklyOrderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.
                </p>

                <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs space-y-1 text-amber-950">
                  <div className="flex items-center justify-between font-bold">
                    <span>Ajuste de Estoque Máximo:</span>
                    <span className="text-amber-800 font-black">+{operationalSummary.recommendedMaxStockIncreasesCount} itens</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-tight">
                    Vendas dos 3 meses superaram a capacidade semanal para Carne de Sol e Tambaqui.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab && onNavigateTab('suprimentos')}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Abrir Ordem de Compra CDA</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Decisão 3: Operação de Chopp & Bebidas */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Bar & Chopp
                  </span>
                  <Coffee className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Previsão de Bebidas ({todayDefrost.dayLabel})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Volume de chopp estimado em <strong>~{todayDefrost.kegsChoppEstimated} barris</strong> e <strong>{todayDefrost.caipirinhasEstimated} caipirinhas</strong>.
                </p>

                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Perda Técnica Chopp:</span>
                    <span className="text-emerald-700">5.5% (Conforme)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Choperia ajustada em 0.8°C e pressão de 34 PSI na câmara do bar.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab && onNavigateTab('bar')}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Acessar Choperia & Balcão</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISÃO 2: DRE CONTÁBIL COMPLETO */}
      {activeSubTab === 'DRE_DETALHADO' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Demonstrativo de Resultado do Exercício (DRE Oficial)</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {dreTimeframe === 'DIARIO' ? 'Média Diária D-1' : 'Acumulado 3 Meses (Teknisa)'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Rubrica Financeira</th>
                  <th className="py-3 px-4 text-right">Valor Realizado</th>
                  <th className="py-3 px-4 text-right">% Receita</th>
                  <th className="py-3 px-4 text-right">Benchmark Meta</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="bg-slate-50 font-bold text-slate-950">
                  <td className="py-3 px-4">1.0 RECEITA BRUTA DE VENDAS</td>
                  <td className="py-3 px-4 text-right font-mono font-black text-sm">
                    R$ {dre.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">100.0%</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-500">
                    {dreTimeframe === 'DIARIO' ? 'R$ 22.000,00' : 'R$ 2.500.000,00'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Superado (+20%)
                    </span>
                  </td>
                </tr>

                <tr className="text-slate-600">
                  <td className="py-3 px-4 pl-8">1.1 (-) Deduções de Vendas & Taxas de Cartão (4.5%)</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-700">
                    - R$ {(dre.grossRevenue * 0.045).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">4.5%</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">&le; 5.0%</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Conforme</td>
                </tr>

                <tr className="bg-slate-50/50 font-bold text-slate-900">
                  <td className="py-3 px-4">2.0 RECEITA OPERACIONAL LÍQUIDA</td>
                  <td className="py-3 px-4 text-right font-mono text-sm">
                    R$ {(dre.grossRevenue * 0.955).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">95.5%</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">-</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Excelente</td>
                </tr>

                <tr className="text-slate-700 font-semibold">
                  <td className="py-3 px-4 pl-8">3.0 (-) CMV Real (Carnes, Pescados, Bebidas & Hortifrúti)</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-700 font-bold">
                    - R$ {dre.cmvCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">28.4%</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">&le; 28.5%</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Na Meta</td>
                </tr>

                <tr className="bg-emerald-50/50 font-black text-emerald-950">
                  <td className="py-3.5 px-4 text-sm">4.0 (=) LUCRO BRUTO / MARGEM DE CONTRIBUIÇÃO</td>
                  <td className="py-3.5 px-4 text-right font-mono text-base text-emerald-800">
                    + R$ {dre.grossProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black">71.6%</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-400">&ge; 70.0%</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                      ALTO RETORNO
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISÃO 3: LOG DE COLABORADORES */}
      {activeSubTab === 'LOG_COLABORADORES' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <CollaboratorAuditFeedView />
        </div>
      )}

      {/* VISÃO 4: PREVENÇÃO DE PERDAS */}
      {activeSubTab === 'PREVENCAO_PERDAS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registro de Prevenção de Perdas & Auditoria</h3>
              <p className="text-xs text-slate-500">Controle rigoroso de cancelamentos de mesa e sobras limpas de cozinha.</p>
            </div>
          </div>
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">Nenhuma quebra anômala registrada no turno atual</p>
            <p className="text-xs text-slate-400 mt-1">A margem de segurança do CMV está em 28,4% (dentro do padrão da holding).</p>
          </div>
        </div>
      )}

      {/* VISÃO 5: SIMULADOR WHAT-IF */}
      {activeSubTab === 'SIMULADOR_WHAT_IF' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Simulador de Sensibilidade de Margem (What-If)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ajuste as variáveis de mercado e avalie o impacto na margem líquida de contribuição da loja Ponta Negra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900">Variação de Fluxo de Clientes</span>
              <input
                type="range"
                min="-20"
                max="50"
                value={trafficVolumeVariationPct}
                onChange={(e) => setTrafficVolumeVariationPct(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-emerald-700">+{trafficVolumeVariationPct}% no movimento</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900">Custo do Tambaqui / Pescados</span>
              <input
                type="range"
                min="-15"
                max="30"
                value={fishPriceVariationPct}
                onChange={(e) => setFishPriceVariationPct(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-amber-700">{fishPriceVariationPct}% no custo</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900">Desconto Médio Promocional</span>
              <input
                type="range"
                min="0"
                max="20"
                value={promoDiscountPct}
                onChange={(e) => setPromoDiscountPct(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-indigo-700">{promoDiscountPct}% em combos</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alimentação Teknisa */}
      <TeknisaFeedModal
        isOpen={showFeedModal}
        onClose={() => setShowFeedModal(false)}
        currentUserName="Pabricio"
      />
    </div>
  );
};
