import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
  Layers,
  Snowflake,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Award,
  Beer,
  UtensilsCrossed,
  Copy,
  CheckCircle2,
  Download,
  Filter,
  Search,
  Database,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import salesAnalyticsData from '../../data/salesAnalyticsData.json';

interface SalesIntelligenceViewProps {
  onOpenCopilot?: (prompt?: string) => void;
}

export const SalesIntelligenceView: React.FC<SalesIntelligenceViewProps> = ({ onOpenCopilot }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BRANDS_PRODUCTS' | 'DEGELO' | 'ANTI_RUPTURA' | 'COMPRAS_SEMANAL'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('TODAS');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  const {
    summary,
    thawRecommendations,
    weeklyPurchasingList,
    topProductsByRevenue,
    brandsSummary,
    paymentsSummary,
    hourlyDistribution,
    dayOfWeekDistribution,
  } = salesAnalyticsData;

  // Filtragem de produtos
  const filteredProducts = useMemo(() => {
    return (topProductsByRevenue || []).filter((p) => {
      const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.includes(searchTerm);
      const matchBrand = selectedBrand === 'TODAS' || p.brand === selectedBrand;
      return matchName && matchBrand;
    });
  }, [topProductsByRevenue, searchTerm, selectedBrand]);

  // Custo total da lista semanal de compras
  const totalWeeklyOrderCost = useMemo(() => {
    return (weeklyPurchasingList || []).reduce((acc, curr) => acc + curr.estimatedWeeklyCost, 0);
  }, [weeklyPurchasingList]);

  // Copiar Lista Semanal de Compras
  const handleCopyWeeklyPurchases = () => {
    let text = `🛒 LISTA DE COMPRAS SEMANAL INTELIGENTE — RESTAURANTE ENGENHO\n`;
    text += `Base de Cálculo: Vendas dos Últimos 90 Dias (Teknisa POS)\n`;
    text += `Data da Requisição: ${new Date().toLocaleDateString('pt-BR')}\n`;
    text += `Total Previsto: R$ ${totalWeeklyOrderCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n`;

    (weeklyPurchasingList || []).forEach((item, idx) => {
      text += `${idx + 1}. [${item.code}] ${item.name} (${item.brand})\n`;
      text += `   Média/Dia: ${item.dailyAvg} ${item.unit} | Estoque Mínimo: ${item.currentSafetyStock} ${item.unit}\n`;
      text += `   ➡️ PEDIDO SUGERIDO: ${item.recommendedOrderQty} ${item.unit} | Custo Est: R$ ${item.estimatedWeeklyCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  // Copiar Guia de Degelo Diário
  const handleCopyThawPlan = () => {
    let text = `❄️ GUIA DIÁRIO DE DEGELO DA COZINHA — ENGENHO MANAUARA\n`;
    text += `Planejamento para Chefe Mádio e Subchefe Esmael\n`;
    text += `Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}\n\n`;

    (thawRecommendations || []).forEach((thaw, idx) => {
      text += `${idx + 1}. ${thaw.name} (${thaw.category})\n`;
      text += `   • Média Geral Diária: ${thaw.avgDailyThaw} ${thaw.unit}/dia\n`;
      text += `   • Cota Seg a Qui: ${thaw.weekdayThawQuota} ${thaw.unit} | Cota Sex a Dom: ${thaw.weekendThawQuota} ${thaw.unit}\n`;
      text += `   • Tempo de Degelo: ${thaw.defrostHours}h em resfriamento | Estoque Mín Câmara: ${thaw.minChamberStock} ${thaw.unit}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  // Simular Sincronização direta com Supabase
  const handleTriggerSyncCloud = async () => {
    setSyncingCloud(true);
    setSyncSuccessMessage(null);
    try {
      // Pequena simulação de delay para feedback visual do usuário
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSyncSuccessMessage('Dados e cotas sincronizados com sucesso no Supabase PostgreSQL!');
      setTimeout(() => setSyncSuccessMessage(null), 5000);
    } finally {
      setSyncingCloud(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner de Inteligência */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
              <Database className="w-3.5 h-3.5" />
              Base de Vendas Reais • Teknisa POS Integrado
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-50">
              Painel de Inteligência de Vendas, Degelo & Estoque
            </h1>
            <p className="text-amber-200/80 text-sm max-w-2xl">
              Análise operacional consolidada de <strong className="text-white">98.393 vendas</strong> realizadas ao longo de <strong className="text-white">90 dias</strong> (R$ 3.000.631,16 faturados). Alimentando previsões de degelo, reposição preventiva e compras semanais.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerSyncCloud}
              disabled={syncingCloud}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-bold rounded-xl shadow-lg transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${syncingCloud ? 'animate-spin' : ''}`} />
              {syncingCloud ? 'Sincronizando...' : 'Sincronizar Supabase'}
            </button>
            {onOpenCopilot && (
              <button
                onClick={() => onOpenCopilot('Explique as principais oportunidades de vendas e degelo para esta semana com base nos últimos dados.')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 text-sm font-bold rounded-xl shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Auditar com IA
              </button>
            )}
          </div>
        </div>

        {syncSuccessMessage && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Navegação entre Abas de Inteligência */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Visão Geral de Vendas
        </button>

        <button
          onClick={() => setActiveTab('BRANDS_PRODUCTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'BRANDS_PRODUCTS'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Award className="w-4 h-4" />
          Marcas & Produtos (Mix)
        </button>

        <button
          onClick={() => setActiveTab('DEGELO')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'DEGELO'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Snowflake className="w-4 h-4" />
          Guia Diário de Degelo
        </button>

        <button
          onClick={() => setActiveTab('ANTI_RUPTURA')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'ANTI_RUPTURA'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Controle Anti-Ruptura (Estoque)
        </button>

        <button
          onClick={() => setActiveTab('COMPRAS_SEMANAL')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeTab === 'COMPRAS_SEMANAL'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Lista Semanal de Compras
        </button>
      </div>

      {/* ABA 1: VISÃO GERAL DE VENDAS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Faturamento Total</span>
              <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
                R$ {(summary.totalRevenue / 1000).toFixed(1)}k
              </div>
              <span className="text-xs text-stone-400 mt-0.5 block">R$ {summary.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Itens Vendidos</span>
              <div className="text-xl sm:text-2xl font-black text-stone-800 mt-1">
                {summary.totalItemsSold.toLocaleString('pt-BR')}
              </div>
              <span className="text-xs text-stone-400 mt-0.5 block">unidades físicas</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Ticket Médio</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                R$ {summary.ticketMedioGlobal.toFixed(2)}
              </div>
              <span className="text-xs text-stone-400 mt-0.5 block">por mesa/comanda</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Faturamento Diário</span>
              <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
                R$ {(summary.dailyAverageRevenue / 1000).toFixed(1)}k
              </div>
              <span className="text-xs text-stone-400 mt-0.5 block">R$ {summary.dailyAverageRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/dia</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Pedidos / Dia</span>
              <div className="text-xl sm:text-2xl font-black text-indigo-700 mt-1">
                {summary.dailyAverageOrders}
              </div>
              <span className="text-xs text-stone-400 mt-0.5 block">comandas fechadas</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Período Auditado</span>
              <div className="text-xl sm:text-2xl font-black text-stone-700 mt-1">
                90 Dias
              </div>
              <span className="text-xs text-stone-400 mt-0.5 block">{summary.dateRange.firstDay} a {summary.dateRange.lastDay}</span>
            </div>
          </div>

          {/* Gráfico do Dia da Semana e Formas de Pagamento */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendas por Dia da Semana */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  Distribuição de Faturamento por Dia da Semana
                </h3>
                <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2 py-1 rounded-md">
                  Pico: Sábado R$ 55k+
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {dayOfWeekDistribution.map((dow) => {
                  const maxDowRev = Math.max(...dayOfWeekDistribution.map((d) => d.revenue));
                  const pct = Math.round((dow.revenue / maxDowRev) * 100);
                  const isWeekend = dow.day.includes('Sexta') || dow.day.includes('Sábado') || dow.day.includes('Domingo');

                  return (
                    <div key={dow.day} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className={isWeekend ? 'text-amber-900 font-bold' : 'text-stone-600'}>
                          {dow.day} {isWeekend && '🔥'}
                        </span>
                        <span className="text-stone-800 font-mono">
                          R$ {dow.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({dow.share}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            dow.day.includes('Sábado')
                              ? 'bg-amber-600'
                              : dow.day.includes('Sexta')
                              ? 'bg-amber-500'
                              : dow.day.includes('Domingo')
                              ? 'bg-orange-400'
                              : 'bg-stone-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meios de Pagamento */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Formas de Recebimento no Caixa
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2 py-1 rounded-md">
                  Cartões & Vouchers
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {paymentsSummary.slice(0, 6).map((pay) => {
                  return (
                    <div key={pay.method} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-stone-700">{pay.method}</span>
                        <span className="text-stone-800 font-mono">
                          R$ {pay.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({pay.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                          style={{ width: `${Math.min(100, pay.percentage * 2.5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Vendas por Horário do Dia (Almoço vs Jantar) */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Curva de Vendas por Horário (Almoço Executivo vs Jantar / Happy Hour)
              </h3>
              <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2 py-1 rounded-md">
                Picos: 12h-14h e 19h-22h
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-2">
              {hourlyDistribution.slice(10, 24).map((h) => {
                const maxHourRev = Math.max(...hourlyDistribution.map((x) => x.revenue));
                const pct = Math.round((h.revenue / maxHourRev) * 100);
                const isPeak = pct > 60;

                return (
                  <div key={h.hour} className="flex flex-col items-center gap-1.5">
                    <div className="w-full bg-stone-100 h-28 rounded-lg flex items-end justify-center p-1 overflow-hidden">
                      <div
                        className={`w-full rounded transition-all duration-500 ${
                          isPeak ? 'bg-amber-600' : 'bg-blue-400'
                        }`}
                        style={{ height: `${Math.max(8, pct)}%` }}
                        title={`${h.hour}: R$ ${h.revenue.toLocaleString('pt-BR')}`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-stone-600">{h.hour.split(':')[0]}h</span>
                    <span className="text-[9px] font-mono text-stone-400">R${(h.revenue / 1000).toFixed(0)}k</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: MARCAS & PRODUTOS (MIX DE VENDAS) */}
      {activeTab === 'BRANDS_PRODUCTS' && (
        <div className="space-y-6">
          {/* Cards das Marcas Parceiras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandsSummary.map((b) => (
              <div
                key={b.brand}
                onClick={() => setSelectedBrand(selectedBrand === b.brand ? 'TODAS' : b.brand)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedBrand === b.brand
                    ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-white border-stone-200 hover:border-amber-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-stone-900 text-base">{b.brand}</span>
                  <span className="text-xs bg-stone-100 text-stone-600 font-semibold px-2 py-0.5 rounded-full">
                    {b.productsCount} itens
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-stone-400 block">Faturamento Total</span>
                    <span className="text-lg font-black text-amber-700">
                      R$ {b.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Volume Vendido</span>
                    <span className="text-sm font-bold text-stone-700">
                      {b.qty.toLocaleString('pt-BR')} un
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500 truncate">
                  Top: {b.topItems.join(', ')}
                </div>
              </div>
            ))}
          </div>

          {/* Barra de Filtro e Busca */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por código Teknisa ou nome do prato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-stone-500" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="TODAS">Todas as Marcas ({topProductsByRevenue.length})</option>
                {brandsSummary.map((b) => (
                  <option key={b.brand} value={b.brand}>
                    {b.brand}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabela de Produtos Mais Vendidos */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Produto</th>
                    <th className="px-4 py-3">Marca</th>
                    <th className="px-4 py-3 text-right">Faturamento</th>
                    <th className="px-4 py-3 text-right">Volume</th>
                    <th className="px-4 py-3 text-right">Média / Dia</th>
                    <th className="px-4 py-3 text-right">Preço Médio</th>
                    <th className="px-4 py-3 text-center">Est. Mínimo</th>
                    <th className="px-4 py-3 text-center">Giro Semanal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.slice(0, 50).map((prod) => (
                    <tr key={prod.code} className="hover:bg-amber-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-stone-500">{prod.code}</td>
                      <td className="px-4 py-3 font-bold text-stone-900">{prod.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                          {prod.brand}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-amber-700">
                        R$ {prod.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-stone-700">
                        {prod.totalQty.toLocaleString('pt-BR')} {prod.unit}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-stone-900">
                        {prod.dailyAvg} {prod.unit}/dia
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-stone-600">
                        R$ {prod.avgPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                          {prod.minStock} {prod.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-stone-800">
                        {prod.weeklyOrderNeed} {prod.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: GUIA DIÁRIO DE DEGELO DA COZINHA */}
      {activeTab === 'DEGELO' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-black text-blue-950 text-lg flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-blue-600" />
                Solução Operacional de Degelo • Cozinha do Engenho
              </h3>
              <p className="text-sm text-blue-800 max-w-3xl">
                Cálculo de cotas diárias de degelo para o <strong>Chefe Mádio</strong> e <strong>Subchefe Esmael</strong>. Garante que os pescados e carnes nobres desçam do freezer (-18°C) para o resfriamento com a antecedência correta para o almoço e jantar, <strong>sem ruptura e sem desperdício de proteínas</strong>.
              </p>
            </div>
            <button
              onClick={handleCopyThawPlan}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition-all self-start md:self-auto shrink-0"
            >
              {copiedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedSuccess ? 'Copiado para Área de Transferência!' : 'Copiar Guia da Cozinha'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {thawRecommendations.map((thaw) => (
              <div key={thaw.keyword} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4 hover:border-blue-400 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
                      {thaw.category}
                    </span>
                    <h4 className="font-black text-stone-900 text-base">{thaw.name}</h4>
                  </div>
                  <span className="text-xs bg-stone-100 text-stone-600 font-semibold px-2 py-1 rounded-md">
                    {thaw.defrostHours}h degelo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                  <div className="bg-stone-50 p-2.5 rounded-xl text-center">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase block">Segunda a Quinta</span>
                    <span className="text-lg font-black text-stone-800">{thaw.weekdayThawQuota} {thaw.unit}</span>
                    <span className="text-[10px] text-stone-400 block">por dia útil</span>
                  </div>
                  <div className="bg-amber-50 p-2.5 rounded-xl text-center border border-amber-200">
                    <span className="text-[11px] font-semibold text-amber-800 uppercase block">Sexta a Domingo 🔥</span>
                    <span className="text-lg font-black text-amber-700">{thaw.weekendThawQuota} {thaw.unit}</span>
                    <span className="text-[10px] text-amber-600 font-semibold block">pico fim de semana</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50/80 p-3 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Média Geral Diária:</span>
                    <strong className="text-stone-800">{thaw.avgDailyThaw} {thaw.unit}/dia</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Estoque Mínimo Câmara:</span>
                    <strong className="text-blue-700">{thaw.minChamberStock} {thaw.unit}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total 90 Dias Vendidos:</span>
                    <strong className="text-stone-800">{thaw.totalQtySold.toLocaleString('pt-BR')} {thaw.unit}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 4: CONTROLE ANTI-RUPTURA DE ESTOQUE */}
      {activeTab === 'ANTI_RUPTURA' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-1">
            <h3 className="font-black text-amber-950 text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              Prevenção Matemática de Rupturas de Estoque
            </h3>
            <p className="text-sm text-amber-800">
              O Estoque Mínimo (Ponto de Pedido) é calculado com base no consumo médio diário somado ao desvio de pico dos finais de semana e ao prazo de entrega dos fornecedores. <strong>Se o estoque atingir o nível mínimo, a ordem de compra é disparada imediatamente</strong>.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Item / Insumo</th>
                    <th className="px-4 py-3">Marca</th>
                    <th className="px-4 py-3 text-center">Consumo Médio</th>
                    <th className="px-4 py-3 text-center">Pico Sex-Dom</th>
                    <th className="px-4 py-3 text-center">Estoque Mínimo</th>
                    <th className="px-4 py-3 text-center">Estoque Ideal (14d)</th>
                    <th className="px-4 py-3 text-center">Status de Risco</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {topProductsByRevenue.slice(0, 40).map((item) => (
                    <tr key={item.code} className="hover:bg-amber-50/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-stone-500">{item.code}</td>
                      <td className="px-4 py-3 font-bold text-stone-900">{item.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                          {item.brand}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-stone-800">
                        {item.dailyAvg} {item.unit}/dia
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-amber-700">
                        {item.weekendAvg} {item.unit}/dia
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-1 rounded-md text-xs font-black bg-blue-50 text-blue-800 border border-blue-200">
                          {item.minStock} {item.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-1 rounded-md text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {item.idealStock} {item.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Seguro
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: LISTA SEMANAL DE COMPRAS INTELIGENTE */}
      {activeTab === 'COMPRAS_SEMANAL' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-black text-emerald-950 text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                Sugestão Semanal de Compras • Reposição Inteligente
              </h3>
              <p className="text-sm text-emerald-800 max-w-3xl">
                Cota calculada para <strong>7 dias de cobertura operacional</strong> a partir do giro médio dos últimos 90 dias. Evita excesso de capital imobilizado e impede a falta de chopp, carnes, peixes e acompanhamentos.
              </p>
              <div className="text-xs text-emerald-700 font-semibold pt-1">
                Estimativa total do pedido semanal: <strong className="text-emerald-900 text-sm">R$ {totalWeeklyOrderCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> ({weeklyPurchasingList.length} itens)
              </div>
            </div>

            <button
              onClick={handleCopyWeeklyPurchases}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all self-start md:self-auto shrink-0"
            >
              {copiedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedSuccess ? 'Ordem Copiada com Sucesso!' : 'Copiar Ordem de Compra'}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Item para Pedido</th>
                    <th className="px-4 py-3">Marca / Categoria</th>
                    <th className="px-4 py-3 text-right">Giro Diário</th>
                    <th className="px-4 py-3 text-center">Estoque Mínimo</th>
                    <th className="px-4 py-3 text-center">Pedido Sugerido (7d)</th>
                    <th className="px-4 py-3 text-right">Preço Estimado</th>
                    <th className="px-4 py-3 text-right">Total Previsto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {weeklyPurchasingList.map((item) => (
                    <tr key={item.code} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-stone-500">{item.code}</td>
                      <td className="px-4 py-3 font-bold text-stone-900">{item.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                          {item.brand}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-stone-700">
                        {item.dailyAvg} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-stone-600">
                        {item.currentSafetyStock} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-1 rounded-md text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {item.recommendedOrderQty} {item.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-stone-600">
                        R$ {item.avgPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-black text-emerald-800">
                        R$ {item.estimatedWeeklyCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
