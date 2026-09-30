import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  Snowflake,
  UtensilsCrossed,
  Wine,
  AlertTriangle,
  Package,
  Layers,
  CheckCircle2,
  Copy,
  Download,
  Info,
  DollarSign,
  ShieldAlert,
  Flame,
  UserCheck,
  ChevronRight,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Edit2,
  Save,
  Clock,
  Send,
  MessageCircle,
} from 'lucide-react';
import {
  WEEK_DAYS,
  WeekDay,
  COMMISSIONER_AUDIT_DATA,
} from '../services/predictive12WeeksStore';
import {
  getDefrostPlanForDay,
  getStockMaxRecommendations,
  updateStockItemLevels,
  useOperationalIntelligence,
  getCurrentDayOfWeekKey,
  DayOfWeekKey,
} from '../services/intelligenceEngine';

interface WeeklySalesPredictionViewProps {
  initialTab?: 'DEGELO' | 'ESTOQUE_MAXIMO_CDA' | 'MISE_EN_PLACE' | 'BAR' | 'AUDITORIA_IA';
  onOpenCopilot?: (prompt?: string) => void;
}

export const WeeklySalesPredictionView: React.FC<WeeklySalesPredictionViewProps> = ({ 
  initialTab = 'DEGELO',
  onOpenCopilot 
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeekKey>(() => getCurrentDayOfWeekKey());
  const [activeTab, setActiveTab] = useState<'DEGELO' | 'ESTOQUE_MAXIMO_CDA' | 'MISE_EN_PLACE' | 'BAR' | 'AUDITORIA_IA'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editCurrentStock, setEditCurrentStock] = useState<number>(0);
  const [editMaxStock, setEditMaxStock] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'AUMENTAR' | 'CRITICA'>('TODOS');

  // Dados do Motor Reativo Central
  const operationalSummary = useOperationalIntelligence();
  const defrostPlan = useMemo(() => getDefrostPlanForDay(selectedDay), [selectedDay]);
  const stockRecommendations = useMemo(() => getStockMaxRecommendations(), [operationalSummary]);

  // Itens filtrados para a tabela de Estoque Máximo & Pedido CDA
  const filteredStockItems = useMemo(() => {
    return stockRecommendations.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase()) || item.code.includes(searchFilter);
      const matchStatus =
        statusFilter === 'TODOS'
          ? true
          : statusFilter === 'AUMENTAR'
          ? item.suggestedAction === 'AUMENTAR'
          : item.urgency === 'CRITICA';
      return matchSearch && matchStatus;
    });
  }, [stockRecommendations, searchFilter, statusFilter]);

  // Totalizadores de Pedido ao CDA
  const totalCdaOrderCost = useMemo(() => {
    return stockRecommendations.reduce((acc, curr) => acc + curr.totalOrderCost, 0);
  }, [stockRecommendations]);

  const itemsToOrderCount = useMemo(() => {
    return stockRecommendations.filter((i) => i.cdaOrderSuggestion > 0).length;
  }, [stockRecommendations]);

  const itemsToIncreaseMaxStockCount = useMemo(() => {
    return stockRecommendations.filter((i) => i.suggestedAction === 'AUMENTAR').length;
  }, [stockRecommendations]);

  // Edição inline de estoque
  const handleStartEdit = (item: (typeof stockRecommendations)[0]) => {
    setEditingItemId(item.code);
    setEditCurrentStock(item.currentStock);
    setEditMaxStock(item.currentMaxStock);
  };

  const handleSaveEdit = (code: string) => {
    updateStockItemLevels(code, {
      currentStock: editCurrentStock,
      maxStock: editMaxStock,
    });
    setEditingItemId(null);
  };

  // Gerador de Texto do Pedido CDA
  const buildCdaOrderText = () => {
    let text = `📦 *ORDEM DE COMPRA & AJUSTES DE ESTOQUE MÁXIMO — ENGENHO MANAUARA*\n`;
    text += `Metodologia: Análise de 3 Meses de Vendas (Teknisa) + Regra (Estoque Máximo - Atual)\n`;
    text += `Data da Requisição: ${new Date().toLocaleDateString('pt-BR')}\n`;
    text += `Total Previsto: R$ ${totalCdaOrderCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n`;

    stockRecommendations
      .filter((i) => i.cdaOrderSuggestion > 0)
      .forEach((item, index) => {
        text += `${index + 1}. *[${item.code}] ${item.name}*\n`;
        text += `   • Estoque Atual: ${item.currentStock} ${item.unit} | Teto Atual: ${item.currentMaxStock} ${item.unit}\n`;
        if (item.suggestedAction === 'AUMENTAR') {
          text += `   ⚠️ RECOMENDAÇÃO IA: Elevar teto para ${item.recommendedMaxStock} ${item.unit} (+${item.diffPercentage}%)\n`;
        }
        text += `   ➡️ *PEDIR AO CDA: ${item.cdaOrderSuggestion} ${item.unit}* (R$ ${item.totalOrderCost.toFixed(2)})\n\n`;
      });

    text += `Total de Itens: ${itemsToOrderCount} insumos com reposição imediata recomendada.\n`;
    return text;
  };

  const handleCopyCdaOrder = () => {
    const text = buildCdaOrderText();
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const handleWhatsAppCdaOrder = () => {
    const text = buildCdaOrderText();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Gerador de Guia de Degelo
  const buildDayDefrostText = () => {
    let text = `❄️ *GUIA DE DEGELO DA COZINHA — ${defrostPlan.dayLabel.toUpperCase()}*\n`;
    text += `Restaurante Engenho Manauara • Planejamento de Proteínas\n`;
    text += `Previsão Operacional: R$ ${defrostPlan.expectedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (~${defrostPlan.expectedPax} PAX)\n`;
    text += `Total para Degelo: *${defrostPlan.totalKgToDefrost} KG* (+20% margem de segurança inclusa)\n\n`;

    defrostPlan.items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}* (${item.category})\n`;
      text += `   • *Retirar para Degelo:* ${item.thawQuantityKg} ${item.unit} (${item.defrostLeadHours}h antes)\n`;
      text += `   • *Turno de Destino:* ${item.targetShift === 'ALMOCO' ? 'Almoço' : item.targetShift === 'JANTAR' ? 'Jantar' : 'Dia Seguinte'}\n`;
      text += `   • *Pratos:* ${item.associatedDishes.join(', ')}\n\n`;
    });
    return text;
  };

  const handleCopyDayDefrost = () => {
    const text = buildDayDefrostText();
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const handleWhatsAppDayDefrost = () => {
    const text = buildDayDefrostText();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Banner Inteligente: Ação Contextual Clara */}
      <div className="bg-gradient-to-r from-[#0a2e23] via-[#0f3d30] to-slate-900 border border-emerald-800/50 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Motor Conectado • 98.393 Vendas Reais do Teknisa Analisadas</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Planejamento Semanal de Degelo & Otimização do Estoque Máximo
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Os dados dos <strong>3 meses de vendas</strong> cruzam o consumo diário com o estoque físico da loja. 
              O sistema calcula as <strong>cotas exatas de degelo para cada dia (Seg a Dom)</strong> e indica 
              quais itens devem ter o <strong>estoque máximo ampliado</strong> para proteger a operação nos dias de maior movimento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleWhatsAppCdaOrder}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              title="Enviar Pedido de Reposição direto no WhatsApp do CDA (Padrão Alô Chefia)"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>WhatsApp CDA</span>
            </button>
            <button
              onClick={handleCopyCdaOrder}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              {copiedSuccess ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSuccess ? 'Ordem Copiada!' : 'Copiar Pedido CDA'}</span>
            </button>
            <button
              onClick={() => onOpenCopilot && onOpenCopilot(`Quais itens correm risco de ruptura de estoque nesta ${defrostPlan.dayLabel}? Mostre os dados de vendas dos últimos 3 meses e o pedido necessário.`)}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Consultar IA</span>
            </button>
          </div>
        </div>

        {/* 3 Métricas Críticas de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-emerald-800/40 text-xs">
          <div className="flex items-center gap-2.5 bg-black/20 p-2.5 rounded-xl border border-emerald-500/20">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-300 shrink-0">
              <Snowflake className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Degelo {defrostPlan.dayLabel}: {defrostPlan.totalKgToDefrost} KG</p>
              <p className="text-slate-300 text-[11px]">{defrostPlan.items.length} cortes proteicos com +20% de reserva</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-black/20 p-2.5 rounded-xl border border-emerald-500/20">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">{itemsToIncreaseMaxStockCount} Itens Exigem Aumento de Teto</p>
              <p className="text-slate-300 text-[11px]">Consumo dos 3 meses superou a capacidade atual</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-black/20 p-2.5 rounded-xl border border-emerald-500/20">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Pedido ao CDA: R$ {totalCdaOrderCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-slate-300 text-[11px]">{itemsToOrderCount} insumos para recompor teto máximo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação Principal das Abas */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center justify-start sm:justify-center overflow-x-auto gap-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('DEGELO')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'DEGELO'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Snowflake className="w-4 h-4" />
          <span>Degelo Semanal (Seg a Dom)</span>
        </button>

        <button
          onClick={() => setActiveTab('ESTOQUE_MAXIMO_CDA')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'ESTOQUE_MAXIMO_CDA'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Estoque Máximo & Pedido CDA ({stockRecommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('MISE_EN_PLACE')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'MISE_EN_PLACE'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Mise en Place & Entradas</span>
        </button>

        <button
          onClick={() => setActiveTab('BAR')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'BAR'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Wine className="w-4 h-4" />
          <span>Preparo do Bar & Chopp</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDITORIA_IA')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'AUDITORIA_IA'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Auditoria IA de Salão</span>
        </button>
      </div>

      {/* ABA 1: DEGELO SEMANAL COMPLETO DE SEGUNDA A DOMINGO */}
      {activeTab === 'DEGELO' && (
        <div className="space-y-4">
          {/* Seletor dos 7 Dias da Semana com Indicadores */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                Selecione o Dia da Semana para ver a cota de degelo:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleWhatsAppDayDefrost}
                  className="text-xs text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Enviar Guia de Degelo direto para os Cozinheiros no WhatsApp (Padrão Alô Chefia)"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Cozinha</span>
                </button>
                <button
                  onClick={handleCopyDayDefrost}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Guia de {defrostPlan.dayLabel}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {(
                [
                  { key: 'SEGUNDA', label: 'Segunda-feira', short: 'Seg' },
                  { key: 'TERCA', label: 'Terça-feira', short: 'Ter' },
                  { key: 'QUARTA', label: 'Quarta-feira', short: 'Qua' },
                  { key: 'QUINTA', label: 'Quinta-feira', short: 'Qui' },
                  { key: 'SEXTA', label: 'Sexta-feira', short: 'Sex' },
                  { key: 'SABADO', label: 'Sábado', short: 'Sáb' },
                  { key: 'DOMINGO', label: 'Domingo', short: 'Dom' },
                ] as const
              ).map((d) => {
                const isSelected = selectedDay === d.key;
                const plan = getDefrostPlanForDay(d.key);
                return (
                  <button
                    key={d.key}
                    onClick={() => setSelectedDay(d.key)}
                    className={`py-3 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#0a2e23] text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/50'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{d.label}</div>
                    <div className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-amber-300' : 'text-slate-900'}`}>
                      {plan.totalKgToDefrost} KG
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                      R$ {plan.expectedRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cartão de Resumo do Dia Selecionado */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-200 text-sky-800 flex items-center justify-center font-black">
                <Snowflake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Cota de Degelo Obrigatória para {defrostPlan.dayLabel}
                </h3>
                <p className="text-slate-600">
                  Previsão de faturamento: <strong>R$ {defrostPlan.expectedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> (~{defrostPlan.expectedPax} clientes). 
                  Descongelamento lento em câmara de resfriamento (+2°C a +4°C).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white border border-sky-300 rounded-xl text-sky-900 font-extrabold text-sm shadow-xs">
                Total: {defrostPlan.totalKgToDefrost} KG
              </span>
            </div>
          </div>

          {/* Tabela de Itens de Degelo */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Proteína / Insumo</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4 text-center">Consumo Médio</th>
                    <th className="py-3 px-4 text-center bg-sky-50 font-black text-sky-950">Tirar para Degelo (+20%)</th>
                    <th className="py-3 px-4 text-center">Antecedência</th>
                    <th className="py-3 px-4">Pratos Atendidos</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {defrostPlan.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-sky-500" />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 font-medium">
                        {item.dailyAvgUsage} {item.unit}/dia
                      </td>
                      <td className="py-3 px-4 text-center bg-sky-50/40">
                        <span className="inline-block py-1 px-3 rounded-lg bg-sky-600 text-white font-black text-sm shadow-xs">
                          {item.thawQuantityKg} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 font-medium">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-[11px]">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {item.defrostLeadHours}h
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {item.associatedDishes.map((dish, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">
                              {dish}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.urgency === 'CRITICA'
                              ? 'bg-rose-100 text-rose-800'
                              : item.urgency === 'URGENTE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.urgency}
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

      {/* ABA 2: ESTOQUE MÁXIMO & LISTA PRÉVIA DE COMPRAS CDA */}
      {activeTab === 'ESTOQUE_MAXIMO_CDA' && (
        <div className="space-y-4">
          {/* Card de Contexto e Regras de Negócio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-700" />
                <span>Auditoria de Estoque Máximo vs Consumo Real de 3 Meses</span>
              </h3>
              <p className="text-xs text-slate-500">
                A IA compara o giro histórico (98.393 vendas) com o Estoque Máximo cadastrado. Se o consumo semanal for maior, a IA recomenda aumentar o teto.
                Você pode clicar no ícone de lápis para editar o Estoque Atual e Estoque Máximo de qualquer item.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleWhatsAppCdaOrder}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Disparar pedido no WhatsApp do CDA (Padrão Alô Chefia)"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp CDA</span>
              </button>
              <button
                onClick={handleCopyCdaOrder}
                className="px-3.5 py-2 bg-[#0a2e23] hover:bg-[#124b3a] text-amber-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Ordem de Compra</span>
              </button>
            </div>
          </div>

          {/* Filtros e Busca Rápida */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setStatusFilter('TODOS')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  statusFilter === 'TODOS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({stockRecommendations.length})
              </button>
              <button
                onClick={() => setStatusFilter('AUMENTAR')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'AUMENTAR' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Aumentar Teto ({itemsToIncreaseMaxStockCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter('CRITICA')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'CRITICA' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Risco Crítico</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrar por nome ou código..."
                className="w-full sm:w-64 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Tabela Interativa de Estoque Máximo & Pedido ao CDA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Código & Insumo</th>
                    <th className="py-3 px-3 text-center">Giro/Dia (3 Meses)</th>
                    <th className="py-3 px-3 text-center">Estoque Atual</th>
                    <th className="py-3 px-3 text-center">Teto Atual</th>
                    <th className="py-3 px-4">Diagnóstico da IA</th>
                    <th className="py-3 px-4 text-center bg-emerald-50/50 font-black text-emerald-950">Pedir ao CDA</th>
                    <th className="py-3 px-4 text-right">Custo Est.</th>
                    <th className="py-3 px-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStockItems.map((item) => {
                    const isEditing = editingItemId === item.code;
                    return (
                      <tr key={item.code} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <span>{item.code}</span>
                            <span>&bull;</span>
                            <span>{item.category}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center font-semibold text-slate-700">
                          {item.dailyAvgSales} {item.unit}/dia
                          <span className="block text-[10px] text-slate-400">~{item.weeklyDemand} {item.unit}/sem</span>
                        </td>

                        <td className="py-3 px-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editCurrentStock}
                              onChange={(e) => setEditCurrentStock(Number(e.target.value))}
                              className="w-16 px-1.5 py-1 text-center font-bold border border-emerald-500 rounded bg-emerald-50"
                            />
                          ) : (
                            <span className="font-bold text-slate-900">
                              {item.currentStock} {item.unit}
                            </span>
                          )}
                          <span className="block text-[10px] text-slate-400">
                            {item.daysCoverageCurrent} dias cob.
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editMaxStock}
                              onChange={(e) => setEditMaxStock(Number(e.target.value))}
                              className="w-16 px-1.5 py-1 text-center font-bold border border-emerald-500 rounded bg-emerald-50"
                            />
                          ) : (
                            <span className="font-bold text-slate-700">
                              {item.currentMaxStock} {item.unit}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {item.suggestedAction === 'AUMENTAR' ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-black text-[11px]">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span>Aumentar Teto p/ {item.recommendedMaxStock} {item.unit} (+{item.diffPercentage}%)</span>
                              </span>
                              <p className="text-[10px] text-slate-500 line-clamp-1">{item.rationale}</p>
                            </div>
                          ) : item.suggestedAction === 'REDUZIR' ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-900 rounded font-bold text-[11px]">
                                <ArrowDownRight className="w-3.5 h-3.5" />
                                <span>Reduzir Teto p/ {item.recommendedMaxStock} {item.unit}</span>
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold text-[11px]">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Teto Equilibrado</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center bg-emerald-50/30">
                          <span
                            className={`inline-block py-1 px-3 rounded-lg font-black text-sm shadow-xs ${
                              item.cdaOrderSuggestion > 0
                                ? 'bg-[#0a2e23] text-amber-300'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {item.cdaOrderSuggestion} {item.unit}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          R$ {item.totalOrderCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEdit(item.code)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer"
                              title="Salvar alterações"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
                              title="Editar estoque atual ou máximo"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Rodapé com Totais */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                Total de <strong>{itemsToOrderCount} insumos</strong> requisitados.
                Fórmula estrita: <strong>Pedido CDA = (Estoque Máximo - Estoque Atual)</strong>.
              </div>
              <div className="text-sm font-black text-slate-900">
                Valor Total Orçado ao CDA: <span className="text-emerald-700 text-base">R$ {totalCdaOrderCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: MISE EN PLACE */}
      {activeTab === 'MISE_EN_PLACE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <span>Mise en Place & Pré-Porcionamento para {defrostPlan.dayLabel}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Metas diárias de porcionamento para cozinha quente, fria e sobremesas (+20% de reserva inclusa).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { dish: 'Carne de Sol do Engenho 2P', qty: selectedDay === 'SABADO' || selectedDay === 'DOMINGO' ? 38 : 22, station: 'COZINHA QUENTE' },
              { dish: 'Pirarucu Ribeirinho & Filé 2P', qty: selectedDay === 'SABADO' || selectedDay === 'DOMINGO' ? 26 : 16, station: 'COZINHA QUENTE' },
              { dish: 'Costela de Tambaqui de Cativeiro', qty: selectedDay === 'SABADO' || selectedDay === 'DOMINGO' ? 24 : 14, station: 'COZINHA QUENTE' },
              { dish: 'Picanha Angus Certificada', qty: selectedDay === 'SABADO' || selectedDay === 'DOMINGO' ? 18 : 10, station: 'GRELHA & CHURRASQUEIRA' },
              { dish: 'Dadinhos de Tapioca c/ Geleia', qty: selectedDay === 'SABADO' || selectedDay === 'DOMINGO' ? 45 : 25, station: 'COZINHA FRIA' },
              { dish: 'Pastéis de Tambaqui (Porção 6un)', qty: selectedDay === 'SABADO' || selectedDay === 'DOMINGO' ? 35 : 18, station: 'COZINHA FRIA' },
            ].map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{p.dish}</h4>
                  <span className="text-[10px] text-slate-500 uppercase">{p.station}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-orange-600">{p.qty} porções</span>
                  <span className="block text-[10px] text-slate-400">Meta +20%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 4: PREPARO DO BAR */}
      {activeTab === 'BAR' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wine className="w-4 h-4 text-purple-600" />
                <span>Previsão de Bebidas & Chopp para {defrostPlan.dayLabel}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Engate preventivo de barris e pré-corte de limão para caipirinhas com base nas 98k vendas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <span className="text-xs text-slate-600 font-medium">Barris de Chopp Sugeridos</span>
              <div className="text-2xl font-black text-amber-800 mt-1">{defrostPlan.kegsChoppEstimated} Barris (50L)</div>
              <p className="text-[11px] text-slate-500 mt-1">Câmara fria do bar em 2°C</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <span className="text-xs text-slate-600 font-medium">Caipirinhas Estimadas</span>
              <div className="text-2xl font-black text-emerald-800 mt-1">{defrostPlan.caipirinhasEstimated} Drinks</div>
              <p className="text-[11px] text-slate-500 mt-1">~{Math.ceil(defrostPlan.caipirinhasEstimated / 10)} kg de limão fatiado</p>
            </div>

            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50">
              <span className="text-xs text-slate-600 font-medium">Chopp Heineken / Amstel</span>
              <div className="text-2xl font-black text-sky-800 mt-1">{(defrostPlan.kegsChoppEstimated * 45).toFixed(0)} L</div>
              <p className="text-[11px] text-slate-500 mt-1">Volume previsto para o turno</p>
            </div>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
              <span className="text-xs text-slate-600 font-medium">Cachaça de Jambu</span>
              <div className="text-2xl font-black text-purple-800 mt-1">
                {Math.max(1, Math.ceil(defrostPlan.caipirinhasEstimated * 0.05))} Garrafas
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Em temperatura ambiente no balcão</p>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: AUDITORIA IA DE COMISSÁRIOS */}
      {activeTab === 'AUDITORIA_IA' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border border-rose-800/60 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">Detecção de Anomalias de Comissários (Taxa de Serviço 10%)</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  A IA cruza o histórico de cancelamentos de taxas de 10% nas comandas com o comportamento da brigada.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {COMMISSIONER_AUDIT_DATA.map((com) => (
              <div
                key={com.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  com.isAnomaly ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{com.name}</h4>
                    <span className="text-xs text-slate-500">({com.role})</span>
                    {com.isAnomaly && (
                      <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full">
                        ANOMALIA DETECTADA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {com.tablesServedCount} mesas atendidas &bull; R$ {com.totalGrossSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} faturados
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Taxa Cancelada</span>
                    <span className={`font-black ${com.isAnomaly ? 'text-rose-700 text-sm' : 'text-slate-700'}`}>
                      R$ {com.serviceFee10PctCancelled.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">% Cancelamento</span>
                    <span className={`font-black text-sm ${com.isAnomaly ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {com.cancellationRatePct}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
