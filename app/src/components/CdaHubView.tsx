import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  ThermometerSnowflake, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Send, 
  Wrench, 
  ShieldCheck, 
  FileCheck,
  TrendingUp,
  Calculator,
  Sparkles,
  BarChart3,
  ArrowUpRight,
  Info,
  Layers,
  Calendar
} from 'lucide-react';
import { CdaRequisition, CorporateTicket } from '../types';
import { 
  INITIAL_PREDICTIVE_ITEMS, 
  calculatePredictiveItem,
  PredictiveOrderItem 
} from '../data/cdaPredictiveData';

interface CdaHubViewProps {
  requisition: CdaRequisition;
  tickets: CorporateTicket[];
  onOpenCopilot: (prompt?: string) => void;
}

export const CdaHubView: React.FC<CdaHubViewProps> = ({ requisition, tickets, onOpenCopilot }) => {
  const [activeTab, setActiveTab] = useState<'PEDIDOS' | 'DOCA' | 'CHAMADOS'>('PEDIDOS');
  const [dockTemp, setDockTemp] = useState('-19.4');
  const [dockConfirmed, setDockConfirmed] = useState(false);
  
  // Margem de segurança fixa em 10% por padrão conforme diretriz da diretoria
  const [bufferPct, setBufferPct] = useState<number>(10);
  const [isAnalyticalMode, setIsAnalyticalMode] = useState<boolean>(true);
  const [selectedItemDetail, setSelectedItemDetail] = useState<string | null>(null);

  // Calcula todos os itens preditivos com base nos últimos meses + 10% de buffer
  const calculatedItems = useMemo(() => {
    return INITIAL_PREDICTIVE_ITEMS.map((item: PredictiveOrderItem) => 
      calculatePredictiveItem(item, bufferPct)
    );
  }, [bufferPct]);

  const totalSuggested = useMemo(() => {
    return calculatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  }, [calculatedItems]);

  return (
    <div className="space-y-4">
      {/* Topo do Hub CDA */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#0a2e23]" />
            <h2 className="text-base font-bold text-slate-900 font-serif">Hub CDA & Abastecimento da Matriz</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Logística preditiva centralizada com o Centro de Distribuição e setores corporativos do Grupo Engenho.
          </p>
        </div>

        {/* Sub-abas */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('PEDIDOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'PEDIDOS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pedidos CDA (IA Preditiva)
          </button>
          <button
            onClick={() => setActiveTab('DOCA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'DOCA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Recebimento Doca
          </button>
          <button
            onClick={() => setActiveTab('CHAMADOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CHAMADOS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Chamados Matriz
          </button>
        </div>
      </div>

      {activeTab === 'PEDIDOS' && (
        <div className="space-y-4">
          {/* Card de Alerta de Janela de Corte & Regra dos 10% */}
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-emerald-500/10 border border-amber-300 rounded-2xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-800 shrink-0">
                <Clock className="w-5 h-5 text-amber-700" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                    Horário de Corte do CDA: Hoje às 15:00
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Regra +10% de Segurança Ativa
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Garante entrega na sexta-feira às 08h30 (Doca 2) para suprir a demanda da <strong>Feijoada de Sábado</strong> e do <strong>Almoço de Domingo</strong> sem ruptura.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto self-end lg:self-center">
              <button
                onClick={() => onOpenCopilot('Explique como o cálculo preditivo analisou os últimos 3 meses para sugerir o pedido com 10% a mais e quais os riscos de desabastecimento.')}
                className="px-3.5 py-2 rounded-xl bg-[#0a2e23] hover:bg-[#123e30] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Auditar com Copiloto IA</span>
              </button>
            </div>
          </div>

          {/* Banner Didático da Fórmula de Cálculo */}
          <div className="bg-emerald-950 text-white rounded-2xl p-4 border border-emerald-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Calculator className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-100 flex items-center gap-2">
                    <span>Fórmula Preditiva Homologada do Grupo Engenho:</span>
                    <span className="px-2 py-0.2 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                      Demanda = (Média Semanal dos Últimos 3 Meses) × 1,10 (+10%)
                    </span>
                  </p>
                  <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                    O sistema consolida as vendas dos últimos 3 meses (Junho, Julho e Agosto), extrai o consumo médio semanal de cada insumo e adiciona <strong>10% de margem contra picos de salão</strong> antes de abater o estoque em loja.
                  </p>
                </div>
              </div>

              {/* Controles: Seletor de Margem e Modo Analítico */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 text-xs">
                  <span className="text-[10px] text-emerald-200 px-1.5 font-medium">Margem:</span>
                  <button
                    onClick={() => setBufferPct(10)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      bufferPct === 10 ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-100 hover:text-white'
                    }`}
                  >
                    +10% (Padrão)
                  </button>
                  <button
                    onClick={() => setBufferPct(15)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      bufferPct === 15 ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-100 hover:text-white'
                    }`}
                    title="Recomendado em fins de semana de chuva forte ou feriado prolongado"
                  >
                    +15% (Pico)
                  </button>
                  <button
                    onClick={() => setBufferPct(5)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      bufferPct === 5 ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-100 hover:text-white'
                    }`}
                  >
                    +5%
                  </button>
                </div>

                <button
                  onClick={() => setIsAnalyticalMode(!isAnalyticalMode)}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isAnalyticalMode ? 'Visão Simples' : 'Ver Vendas 3 Meses'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabela de Sugestão Preditiva */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                  <span>Sugestão Preditiva de Reposição Semanal</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-sans font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Base: Trimestre Passado (12 semanas)
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Análise preditiva por insumo com <strong>+{bufferPct}%</strong> de margem de proteção contra rupturas no Shopping Ponta Negra.
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-[#0a2e23]">
                  Total do Pedido: R$ {totalSuggested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-400 block">{calculatedItems.length} insumos críticos do cardápio</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Item / Código CDA</th>
                    {isAnalyticalMode && (
                      <th className="py-3 px-3">Vendas Últimos 3 Meses (Jun / Jul / Ago)</th>
                    )}
                    <th className="py-3 px-3 text-right">Média Semanal</th>
                    <th className="py-3 px-3 text-right bg-emerald-50/50 text-emerald-900 font-bold">
                      Previsto (+{bufferPct}%)
                    </th>
                    <th className="py-3 px-3 text-right">Estoque Loja</th>
                    <th className="py-3 px-3 text-right">Pedido Sugerido</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {calculatedItems.map((item) => {
                    const isSelected = selectedItemDetail === item.id;
                    return (
                      <React.Fragment key={item.id}>
                        <tr 
                          onClick={() => setSelectedItemDetail(isSelected ? null : item.id)}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                            isSelected ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                item.urgency === 'CRITICA' ? 'bg-rose-500 animate-pulse' :
                                item.urgency === 'ALTA' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} />
                              <div>
                                <span className="font-bold text-slate-900 block">{item.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                                  <span>{item.code}</span>
                                  <span>&bull; Lote mín: {item.minimumPackQuantity} {item.unit}</span>
                                </span>
                              </div>
                            </div>
                          </td>

                          {isAnalyticalMode && (
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1 text-[11px] font-mono">
                                {item.monthlySales.map((m, mIdx) => (
                                  <span key={mIdx} className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                                    {m.salesQuantity.toFixed(0)}
                                  </span>
                                ))}
                                <span className="text-[10px] text-slate-400 ml-1">
                                  ({item.totalQuarterSales.toFixed(0)} {item.unit})
                                </span>
                              </div>
                            </td>
                          )}

                          <td className="py-3 px-3 text-right font-mono text-slate-600">
                            {item.weeklyAverage.toFixed(1)} {item.unit}
                          </td>

                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800 bg-emerald-50/50">
                            <div className="flex items-center justify-end gap-1">
                              <span>{item.projectedWeeklyDemand.toFixed(1)} {item.unit}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded-sm bg-emerald-200 text-emerald-900 font-semibold">
                                +{item.bufferQuantity.toFixed(1)}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-right font-mono text-slate-500">
                            {item.currentStock.toFixed(1)} {item.unit}
                          </td>

                          <td className="py-3 px-3 text-right">
                            <span className="font-bold text-emerald-800 font-mono text-sm">
                              + {item.suggestedQuantity.toFixed(1)} {item.unit}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                            R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>

                        {/* Detalhe Expandido de Cada Item */}
                        {isSelected && (
                          <tr className="bg-slate-50/90 text-xs">
                            <td colSpan={isAnalyticalMode ? 7 : 6} className="p-4 border-y border-slate-200">
                              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                                <div className="space-y-1 max-w-xl">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    <strong className="text-slate-800">Justificativa Operacional do Algoritmo:</strong>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${
                                      item.urgency === 'CRITICA' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      Urgência {item.urgency}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 text-[11px] leading-relaxed">
                                    {item.rationale}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    Memória: Média Semanal ({item.weeklyAverage.toFixed(1)}) + {bufferPct}% ({item.bufferQuantity.toFixed(1)}) = {item.projectedWeeklyDemand.toFixed(1)} - Estoque ({item.currentStock.toFixed(1)}) = Necessidade Bruta ({item.rawNeeded.toFixed(1)}) ➔ Lote Fechado: {item.suggestedQuantity.toFixed(1)} {item.unit}.
                                  </p>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenCopilot(`Analise o insumo ${item.name} (${item.code}) do Engenho Ponta Negra. Consumo semanal de ${item.weeklyAverage.toFixed(1)} ${item.unit} e estoque atual de ${item.currentStock.toFixed(1)} ${item.unit}. Vale a pena pedir mais que ${item.suggestedQuantity.toFixed(1)} ${item.unit}?`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Simular com IA</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100/90 font-bold border-t border-slate-200 text-slate-900">
                  <tr>
                    <td colSpan={isAnalyticalMode ? 5 : 4} className="py-3 px-4 text-right text-xs">
                      Valor Total da Requisição ao CDA (com +{bufferPct}% de segurança):
                    </td>
                    <td colSpan={2} className="py-3 px-4 text-right font-mono text-base text-[#0a2e23]">
                      R$ {totalSuggested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Rodapé com Transmissão e SLA */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Previsão de entrega confirmada: <strong>Sexta-feira às 08h30 (Doca 2 - Shopping Ponta Negra)</strong></span>
              </div>
              <button
                onClick={() => alert(`Requisição CDA transmitida com sucesso para o Centro de Distribuição! Valor total: R$ ${totalSuggested.toFixed(2)}. Protocolo gerado: CDA-REQ-20260911-01.`)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0a2e23] hover:bg-[#123e30] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Transmitir Requisição ao CDA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DOCA' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Conferência de Carga na Doca (Shopping Ponta Negra)
                </h3>
                <p className="text-xs text-slate-500">Protocolo POP-01: Aferição térmica obrigatória antes do descarregamento</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {requisition.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-sky-900 text-xs font-bold">
                  <ThermometerSnowflake className="w-4 h-4 text-sky-600" />
                  <span>Temperatura do Caminhão Baú Refrigerado</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <input
                    type="text"
                    value={dockTemp}
                    onChange={(e) => setDockTemp(e.target.value)}
                    className="text-2xl font-black text-sky-950 bg-white border border-sky-300 rounded-lg px-2 py-1 w-28 text-center"
                  />
                  <span className="text-xs text-sky-700 font-semibold">°C (Padrão: &le; -18°C)</span>
                </div>
                <p className="text-[10px] text-sky-600 mt-1">
                  Se a temperatura estiver acima de -15°C, recusar imediatamente pescados e carnes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-700">Guia de Remessa / Lacre</span>
                <div className="mt-1 text-xs text-slate-600 space-y-1">
                  <div><strong>Nº Requisição:</strong> {requisition.orderNumber}</div>
                  <div><strong>Volume Estimado:</strong> {requisition.itemsCount} caixas lacradas</div>
                  <div><strong>Valor da Carga:</strong> R$ {requisition.totalValue.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setDockConfirmed(true)}
                className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                  dockConfirmed
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>
                  {dockConfirmed
                    ? '✓ Carga Homologada na Doca e Estoque Incrementado!'
                    : 'Confirmar Temperatura & Liberar Entrada de Mercadorias'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'CHAMADOS' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chamados para a Matriz & Manutenção</h3>
              <p className="text-xs text-slate-500">Acompanhamento de solicitações para Manutenção Predial, TI e RH</p>
            </div>
            <button
              onClick={() => alert('Novo chamado registrado para a equipe corporativa da matriz!')}
              className="px-3 py-1.5 rounded-xl bg-[#0f392b] text-white text-xs font-bold shadow-sm"
            >
              + Novo Chamado
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {tickets.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                <Wrench className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-700">Nenhum chamado aberto no momento</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Todos os equipamentos e chamados corporativos da matriz estão regularizados.
                </p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700 mt-0.5">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{ticket.title}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          {ticket.priority}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Protocolo: {ticket.protocol} &bull; Setor: {ticket.department} &bull; Data: {ticket.date}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      ticket.status === 'CONCLUIDO'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
