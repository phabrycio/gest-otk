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
  Sparkles,
  BarChart3,
  Copy,
  Check,
  Search,
  ChevronDown,
  Layers,
  Calendar,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import { CdaRequisition, CorporateTicket } from '../types';
import { 
  getStockMaxRecommendations,
  useOperationalIntelligence,
  updateStockItemLevels,
  StockMaxRecommendation,
} from '../services/intelligenceEngine';

interface CdaHubViewProps {
  requisition: CdaRequisition;
  tickets: CorporateTicket[];
  onOpenCopilot?: (prompt?: string) => void;
}

export const CdaHubView: React.FC<CdaHubViewProps> = ({ requisition, tickets, onOpenCopilot }) => {
  const [activeTab, setActiveTab] = useState<'PEDIDOS' | 'DOCA' | 'CHAMADOS'>('PEDIDOS');
  const [dockTemp, setDockTemp] = useState('-19.4');
  const [dockConfirmed, setDockConfirmed] = useState(false);
  
  // Margem de segurança padrão de 10%
  const [bufferPct, setBufferPct] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [transmittedSuccess, setTransmittedSuccess] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState<string | null>(null);

  // Chamados para a Matriz com Persistência
  const [localTickets, setLocalTickets] = useState<CorporateTicket[]>(() => {
    try {
      const saved = localStorage.getItem('cda_corporate_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return tickets;
  });
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDept, setTicketDept] = useState<'MANUTENCAO' | 'TI_SISTEMAS' | 'RH_MATRIZ' | 'FINANCEIRO'>('MANUTENCAO');
  const [ticketPriority, setTicketPriority] = useState<'MEDIA' | 'ALTA' | 'CRITICA'>('ALTA');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;
    const newTicket: CorporateTicket = {
      id: `ticket-${Date.now()}`,
      protocol: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: ticketTitle.trim(),
      department: ticketDept,
      priority: ticketPriority,
      status: 'ABERTO',
      date: new Date().toLocaleDateString('pt-BR'),
    };
    const updated = [newTicket, ...localTickets];
    setLocalTickets(updated);
    try {
      localStorage.setItem('cda_corporate_tickets', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setTicketTitle('');
    setShowNewTicketModal(false);
  };

  const handleToggleTicketStatus = (id: string) => {
    const updated = localTickets.map((t) =>
      t.id === id
        ? { ...t, status: (t.status === 'CONCLUIDO' ? 'ABERTO' : 'CONCLUIDO') as 'ABERTO' | 'CONCLUIDO' }
        : t
    );
    setLocalTickets(updated);
    try {
      localStorage.setItem('cda_corporate_tickets', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Escuta o motor unificado
  const operationalSummary = useOperationalIntelligence();
  const rawRecommendations = useMemo(() => getStockMaxRecommendations(), [operationalSummary]);

  // Calcula todos os itens preditivos com base nos dados reais do Teknisa + estoque máximo
  const calculatedItems = useMemo(() => {
    return rawRecommendations.map((item) => {
      // Ajuste com base no buffer selecionado (+10% ou +15%)
      const adjustedOrder = Math.max(0, Math.ceil(item.cdaOrderSuggestion * (1 + (bufferPct - 10) / 100)));
      const subtotal = +(adjustedOrder * item.unitCost).toFixed(2);
      return {
        id: item.code,
        code: item.code,
        name: item.name,
        category: item.category,
        unit: item.unit,
        unitCost: item.unitCost,
        currentStock: item.currentStock,
        currentMaxStock: item.currentMaxStock,
        recommendedMaxStock: item.recommendedMaxStock,
        suggestedAction: item.suggestedAction,
        minimumPackQuantity: 1,
        weeklyAverage: item.weeklyDemand,
        suggestedQuantity: adjustedOrder,
        subtotal,
        urgency: item.urgency,
        rationale: item.rationale,
      };
    });
  }, [rawRecommendations, bufferPct]);

  // Filtra por termo de busca
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return calculatedItems;
    const q = searchQuery.toLowerCase();
    return calculatedItems.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.code.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [calculatedItems, searchQuery]);

  const totalSuggested = useMemo(() => {
    return calculatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  }, [calculatedItems]);

  const totalItemsToOrder = useMemo(() => {
    return calculatedItems.filter(item => item.suggestedQuantity > 0).length;
  }, [calculatedItems]);

  const buildOrderText = () => {
    let text = `📋 *PEDIDO DE REPOSIÇÃO SEMANAL - CDA GRUPO ENGENHO*\n`;
    text += `📍 *Unidade:* Engenho Manauara • Shopping Ponta Negra\n`;
    text += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')} • *Margem de Segurança:* +${bufferPct}%\n`;
    text += `--------------------------------------------------\n\n`;

    calculatedItems
      .filter(i => i.suggestedQuantity > 0)
      .forEach((item, index) => {
        text += `${index + 1}. *[${item.code}] ${item.name}*\n`;
        text += `   Estoque Atual: ${item.currentStock} ${item.unit} | Média Semanal: ${item.weeklyAverage.toFixed(1)} ${item.unit}\n`;
        text += `   ➡️ *PEDIR: ${item.suggestedQuantity} ${item.unit}* (R$ ${item.subtotal.toFixed(2)})\n\n`;
      });

    text += `--------------------------------------------------\n`;
    text += `💰 *TOTAL ESTIMADO DO PEDIDO: R$ ${totalSuggested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*\n`;
    text += `⏰ *Horário de Corte:* Hoje às 15:00 • *Entrega Prevista:* Sexta às 08h30 (Doca 2)\n`;
    return text;
  };

  const handleCopyOrder = () => {
    const text = buildOrderText();
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const handleSendWhatsApp = () => {
    const text = buildOrderText();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTransmit = () => {
    setTransmittedSuccess(true);
    setTimeout(() => setTransmittedSuccess(false), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Topo do Hub CDA com Abas Diretas */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#0a2e23]" />
            <h2 className="text-base font-bold text-slate-900 font-serif">Hub CDA & Abastecimento da Matriz</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Logística preditiva centralizada com o Centro de Distribuição do Grupo Engenho.
          </p>
        </div>

        {/* Sub-abas Limpas */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('PEDIDOS')}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'PEDIDOS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pedidos CDA (IA Preditiva)
          </button>
          <button
            onClick={() => setActiveTab('DOCA')}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'DOCA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recebimento Doca
          </button>
          <button
            onClick={() => setActiveTab('CHAMADOS')}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CHAMADOS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chamados Matriz
          </button>
        </div>
      </div>

      {activeTab === 'PEDIDOS' && (
        <div className="space-y-4">
          {/* Feedback de Transmissão */}
          {transmittedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between text-xs font-bold animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Requisição transmitida com sucesso para o Centro de Distribuição! Protocolo: CDA-2026-ENG-0891</span>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-mono">
                R$ {totalSuggested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Cards Executivos de Resumo (Menos é Mais - Substitui os banners poluídos) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                Total Sugerido CDA
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#0a2e23] font-mono mt-0.5">
                R$ {totalSuggested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <Check className="w-3 h-3 text-emerald-600" /> {totalItemsToOrder} insumos para reposição
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                Horário de Corte
              </span>
              <div className="text-lg sm:text-xl font-bold text-amber-900 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Hoje às 15:00</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Entrega: Sexta às 08h30 (Doca 2)
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                Margem de Proteção
              </span>
              <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>+{bufferPct}% Anti-Ruptura</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                Cobre o pico do fim de semana
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                Ações Rápidas
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <button
                  onClick={handleSendWhatsApp}
                  className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Enviar pedido formatado direto no WhatsApp do comprador/CDA (Padrão Alô Chefia)"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={handleCopyOrder}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    copiedSuccess 
                      ? 'bg-emerald-700 text-white shadow-xs' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                  title="Copiar lista de compras para área de transferência"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess ? 'Copiado!' : 'Copiar'}</span>
                </button>

                <button
                  onClick={handleTransmit}
                  className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold bg-[#0a2e23] hover:bg-[#123e30] text-amber-300 shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Transmitir requisição para a Matriz"
                >
                  <Send className="w-3 h-3" />
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Barra de Filtros e Margem Sem Poluição */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar insumo ou código..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Margem:</span>
                <button
                  onClick={() => setBufferPct(10)}
                  className={`px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    bufferPct === 10 ? 'bg-[#0a2e23] text-amber-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  +10% (Padrão)
                </button>
                <button
                  onClick={() => setBufferPct(15)}
                  className={`px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    bufferPct === 15 ? 'bg-[#0a2e23] text-amber-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Para fins de semana de pico ou feriados"
                >
                  +15% (Pico)
                </button>
              </div>

              {onOpenCopilot && (
                <button
                  onClick={() => onOpenCopilot('Explique as sugestões de compra do CDA com base no consumo das últimas semanas e os riscos de ruptura de estoque.')}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="Auditoria com IA"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Copilot IA</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabela de Insumos - 100% Responsiva e Limpa */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Insumo / Código</th>
                    <th className="py-3 px-3 text-right">Giro Semanal Médio</th>
                    <th className="py-3 px-3 text-right">Estoque Loja</th>
                    <th className="py-3 px-3 text-right bg-emerald-50/70 text-emerald-900 font-bold">
                      Pedido Sugerido (+{bufferPct}%)
                    </th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItemDetail === item.id;
                    return (
                      <React.Fragment key={item.id}>
                        <tr 
                          onClick={() => setSelectedItemDetail(isSelected ? null : item.id)}
                          className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${
                                item.urgency === 'CRITICA' ? 'bg-rose-500 animate-pulse' :
                                item.urgency === 'ALTA' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} />
                              <div>
                                <span className="font-bold text-slate-900 block">{item.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {item.code} &bull; Lote mín: {item.minimumPackQuantity} {item.unit}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-right font-mono text-slate-600">
                            {item.weeklyAverage.toFixed(1)} {item.unit}
                          </td>

                          <td className="py-3 px-3 text-right font-mono text-slate-500">
                            {item.currentStock.toFixed(1)} {item.unit}
                          </td>

                          <td className="py-3 px-3 text-right bg-emerald-50/70 font-mono font-bold text-emerald-900">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-sm">+{item.suggestedQuantity.toFixed(1)} {item.unit}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                            R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.urgency === 'CRITICA' ? 'bg-rose-100 text-rose-800' :
                              item.urgency === 'ALTA' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item.urgency}
                            </span>
                          </td>
                        </tr>

                        {/* Rationale Expansível */}
                        {isSelected && (
                          <tr className="bg-slate-50 text-xs">
                            <td colSpan={6} className="p-3.5 border-y border-slate-200">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                                <div className="space-y-1">
                                  <p className="text-slate-800 font-semibold text-xs flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Justificativa do Algoritmo de Reposição:</span>
                                  </p>
                                  <p className="text-slate-600 text-[11px] leading-relaxed">
                                    {item.rationale}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    Cálculo: Média semanal ({item.weeklyAverage.toFixed(1)}) + {bufferPct}% = {(item.weeklyAverage * (1 + bufferPct / 100)).toFixed(1)} - Estoque ({item.currentStock.toFixed(1)}) = Lote de compra: {item.suggestedQuantity.toFixed(1)} {item.unit}.
                                  </p>
                                </div>
                                {onOpenCopilot && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenCopilot(`Analise o insumo ${item.name} (${item.code}). Consumo semanal de ${item.weeklyAverage.toFixed(1)} ${item.unit} e estoque atual de ${item.currentStock.toFixed(1)} ${item.unit}.`);
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
                                  >
                                    Simular com IA
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-right text-xs">
                      Valor Total da Requisição ao CDA:
                    </td>
                    <td colSpan={2} className="py-3 px-4 text-right font-mono text-base text-[#0a2e23]">
                      R$ {totalSuggested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile View: Cards Verticais Compactos (Perfeito para Celulares e Tablets) */}
            <div className="md:hidden divide-y divide-slate-100 p-2">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-3 bg-white hover:bg-slate-50/50 rounded-xl transition-colors space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.code} &bull; Lote mín: {item.minimumPackQuantity} {item.unit}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.urgency === 'CRITICA' ? 'bg-rose-100 text-rose-800' :
                      item.urgency === 'ALTA' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.urgency}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-50 p-2 rounded-lg text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Estoque</span>
                      <span className="font-bold text-slate-700">{item.currentStock} {item.unit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Consumo</span>
                      <span className="font-bold text-slate-700">{item.weeklyAverage.toFixed(1)}</span>
                    </div>
                    <div className="bg-emerald-100/60 rounded py-0.5">
                      <span className="text-[10px] text-emerald-800 font-bold block font-sans">Pedir</span>
                      <span className="font-black text-emerald-900">+{item.suggestedQuantity} {item.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="text-[11px] text-slate-500">Custo estimado:</span>
                    <span className="font-bold font-mono text-slate-900">
                      R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-slate-100 rounded-xl mt-2 flex items-center justify-between text-xs font-bold">
                <span>Total Estimado do Pedido:</span>
                <span className="text-base text-[#0a2e23] font-mono">
                  R$ {totalSuggested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Rodapé com Botão de Transmissão */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Previsão de entrega confirmada: <strong>Sexta-feira às 08h30 (Doca 2)</strong></span>
              </div>
              <button
                onClick={handleTransmit}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0a2e23] hover:bg-[#123e30] text-amber-300 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Transmitir Requisição ao CDA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DOCA' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
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
                className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
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
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chamados para a Matriz & Manutenção</h3>
              <p className="text-xs text-slate-500">Acompanhamento de solicitações para Manutenção Predial, TI e RH</p>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#0a2e23] hover:bg-[#134938] text-amber-300 text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1 transition-all"
            >
              <span>+ Novo Chamado</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {localTickets.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                <Wrench className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-700">Nenhum chamado aberto no momento</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Todos os equipamentos e chamados corporativos da matriz estão regularizados.
                </p>
              </div>
            ) : (
              localTickets.map((ticket) => (
                <div key={ticket.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700 mt-0.5">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{ticket.title}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          ticket.priority === 'CRITICA'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : ticket.priority === 'ALTA'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Protocolo: {ticket.protocol} &bull; Setor: {ticket.department} &bull; Data: {ticket.date}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleTicketStatus(ticket.id)}
                    title="Clique para alternar status entre Aberto e Concluído"
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                      ticket.status === 'CONCLUIDO'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {ticket.status === 'CONCLUIDO' ? '✓ CONCLUÍDO' : 'ABERTO'}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Modal de Abertura de Chamado */}
          {showNewTicketModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Novo Chamado para a Matriz</h3>
                  </div>
                  <button
                    onClick={() => setShowNewTicketModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Título da Solicitação</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Calibração Choperia Naja / Manutenção Câmara Congelados"
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Departamento</label>
                      <select
                        value={ticketDept}
                        onChange={(e) => setTicketDept(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        <option value="MANUTENCAO">Manutenção Predial</option>
                        <option value="TI_SISTEMAS">TI & Sistemas / PDV</option>
                        <option value="RH_MATRIZ">RH Corporativo</option>
                        <option value="FINANCEIRO">Financeiro / Compras</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Prioridade</label>
                      <select
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        <option value="MEDIA">Média (Até 48h)</option>
                        <option value="ALTA">Alta (Até 24h)</option>
                        <option value="CRITICA">Crítica (Imediato)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowNewTicketModal(false)}
                      className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold bg-[#0a2e23] text-amber-300 rounded-xl hover:bg-[#124b3a] shadow-xs cursor-pointer"
                    >
                      Salvar & Abrir Chamado
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
