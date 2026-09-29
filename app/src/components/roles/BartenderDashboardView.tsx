// ============================================================
// PAINEL EXCLUSIVO DO BARTENDER (ACESSO 40)
// Ambiente 100% Isolado • Bebidas, Estoque de Bar, Contagem & IA do Bar
// ============================================================

import React, { useState } from 'react';
import {
  Beer,
  Wine,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Clock,
  Plus,
  Send,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import type { UserAccount } from '../../types/restaurant.types';
import { getContextualAiProfile } from '../../services/contextualAiService';
import { submitInventoryCount, createPurchaseRequest, listInventories, listPurchaseRequests } from '../../services/workflowApprovalStore';

interface BartenderDashboardViewProps {
  currentUser: UserAccount;
}

interface BeverageItem {
  id: string;
  name: string;
  category: 'DESTILADO' | 'CERVEJA' | 'VINHO' | 'DRINK' | 'INSUMO';
  currentStock: number;
  minStock: number;
  unit: string;
  burnRatePerDay: number;
  daysRemaining: number;
  expiryDate: string;
  salesGrowthPct: number;
  status: 'NORMAL' | 'ATENCAO' | 'CRITICO';
}

export const BartenderDashboardView: React.FC<BartenderDashboardViewProps> = ({ currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'contagem' | 'pedido' | 'ia'>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // IA Contextual do Bar
  const aiProfile = getContextualAiProfile(currentUser);

  // Catálogo de Bebidas do Bar (Isolado de Alimentos da Cozinha)
  const [beverages, setBeverages] = useState<BeverageItem[]>([]);

  // Ranking de Bebidas mais Vendidas
  const rankingDrinks: Array<{ rank: number; name: string; qty: number; category: string; growth: string }> = [];

  // Formulário de Contagem Rápida de Inventário
  const [counts, setCounts] = useState<{ [id: string]: number }>({});

  // Formulário de Solicitação de Compra
  const [newRequestItem, setNewRequestItem] = useState('');
  const [newRequestQty, setNewRequestQty] = useState(1);
  const [newRequestUnit, setNewRequestUnit] = useState('unidades');
  const [newRequestReason, setNewRequestReason] = useState('');

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Enviar contagem oficial para a Supervisora conferir
  const handleSubmitInventory = () => {
    try {
      submitInventoryCount({
        sector: 'BAR',
        counter: currentUser,
        items: beverages.map((b) => ({
          itemId: b.id,
          itemName: b.name,
          unit: b.unit,
          systemExpectedQuantity: b.currentStock,
          countedQuantity: counts[b.id] ?? b.currentStock,
          differenceQuantity: (counts[b.id] ?? b.currentStock) - b.currentStock,
          differenceValueEstimate: 0,
        })),
      });

      showNotification('✅ Contagem enviada com sucesso! Aguardando conferência física da Supervisora.');
      setActiveSubTab('dashboard');
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar contagem.');
    }
  };

  // Enviar solicitação de compra para a Supervisora aprovar
  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestItem || newRequestQty <= 0) return;

    try {
      createPurchaseRequest({
        sector: 'BAR',
        requester: currentUser,
        items: [
          {
            id: `bev-req-${Date.now()}`,
            itemName: newRequestItem,
            category: 'BEBIDAS',
            requestedQuantity: newRequestQty,
            unit: newRequestUnit,
            estimatedPriceUnit: 15,
            currentStock: 0,
            urgency: 'ALTA',
          },
        ],
        justification: newRequestReason,
      });

      showNotification('✅ Solicitação de insumo enviada! A Supervisora receberá para conferência e aprovação.');
      setNewRequestItem('');
      setNewRequestQty(1);
      setActiveSubTab('dashboard');
    } catch (err: any) {
      alert(err.message || 'Erro ao criar solicitação.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-6 text-slate-100">
      {/* Toast de Confirmação */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-black text-sm flex items-center gap-2 border border-emerald-300 animate-slide-left">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner de Identificação & Isolamento */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 p-6 border border-purple-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Beer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">Ambiente do Bartender</h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Acesso 40 • Bar Isolado
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Operador: <strong className="text-white">{currentUser.name}</strong> • Matrícula:{' '}
                <strong className="text-amber-300">{currentUser.matricula || 'BAR-01'}</strong>
              </p>
            </div>
          </div>

          {/* Subtabs de Navegação */}
          <div className="flex items-center gap-1.5 bg-purple-950/80 p-1.5 rounded-xl border border-purple-800/50">
            <button
              onClick={() => setActiveSubTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'dashboard' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white'
              }`}
            >
              Dashboard do Bar
            </button>
            <button
              onClick={() => setActiveSubTab('contagem')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'contagem' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white'
              }`}
            >
              Contagem de Garrafas
            </button>
            <button
              onClick={() => setActiveSubTab('pedido')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'pedido' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white'
              }`}
            >
              Solicitar Bebidas
            </button>
            <button
              onClick={() => setActiveSubTab('ia')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'ia' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              IA do Bar
            </button>
          </div>
        </div>
      </div>

      {/* IA DO BAR: Alertas Contextuais Prontos */}
      <div className="rounded-2xl bg-purple-950/30 border border-purple-800/40 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-black text-white">IA do Bar • Recomendações e Rupturas</h2>
          </div>
          <span className="text-[10px] font-bold text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded-full">
            Tempo Real
          </span>
        </div>

        {aiProfile.alerts.length === 0 ? (
          <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-800/30 text-center">
            <p className="text-xs text-purple-200 font-bold">Nenhum alerta de ruptura ou desvio no momento.</p>
            <p className="text-[11px] text-purple-400 mt-0.5">Dia 1 de operação iniciado. A IA analisará os níveis de estoque e giro em tempo real.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiProfile.alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-purple-900/30 border border-purple-800/30 hover:border-purple-600/50 transition-colors flex items-start gap-2.5"
              >
                <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-white font-bold">{alert.title}</p>
                  <p className="text-[11px] text-purple-100 font-medium leading-relaxed mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONTEÚDO DA SUB-ABA */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Métricas Rápidas do Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/30">
              <p className="text-[11px] font-bold text-purple-300 uppercase">Bebidas Monitoradas</p>
              <p className="text-2xl font-black text-white mt-1">{beverages.length}</p>
              <p className="text-[10px] text-purple-300/80 mt-1">Isoladas do setor da cozinha</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/30">
              <p className="text-[11px] font-bold text-purple-300 uppercase">Itens em Alerta / Ruptura</p>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {beverages.filter((b) => b.status !== 'NORMAL').length}
              </p>
              <p className="text-[10px] text-amber-300/80 mt-1">
                {beverages.some((b) => b.status !== 'NORMAL') ? 'Necessita reposição' : 'Nenhuma ruptura detectada'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/30">
              <p className="text-[11px] font-bold text-purple-300 uppercase">Drink Mais Vendido</p>
              <p className="text-lg font-black text-emerald-400 mt-1 truncate">
                {rankingDrinks[0]?.name || 'Sem vendas registradas'}
              </p>
              <p className="text-[10px] text-emerald-300/80 mt-1">
                {rankingDrinks[0] ? `${rankingDrinks[0].growth} esta semana` : 'Dia 1 de uso operacional'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/30">
              <p className="text-[11px] font-bold text-purple-300 uppercase">Última Contagem</p>
              <p className="text-sm font-black text-purple-200 mt-1">Nenhuma contagem hoje</p>
              <p className="text-[10px] text-purple-300/80 mt-1">Aguardando conferência</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tabela de Estoque de Bebidas */}
            <div className="lg:col-span-2 rounded-2xl bg-purple-950/30 border border-purple-800/40 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wine className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-black text-white">Estoque & Giro de Bebidas</h3>
                </div>
                <button
                  onClick={() => setActiveSubTab('contagem')}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors"
                >
                  Iniciar Nova Contagem
                </button>
              </div>

              {beverages.length === 0 ? (
                <div className="py-12 text-center text-purple-300 bg-purple-900/10 rounded-xl border border-purple-800/20">
                  <Wine className="w-12 h-12 text-purple-500/40 mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">Nenhuma bebida cadastrada no bar</p>
                  <p className="text-xs text-purple-400 mt-1 max-w-sm mx-auto">
                    Dia 1 de operação. Os itens e níveis de estoque aparecerão conforme forem sincronizados pelo Teknisa ou adicionados na contagem física.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-purple-800/40 text-purple-300 text-[11px]">
                        <th className="pb-2.5">Bebida / Insumo</th>
                        <th className="pb-2.5">Estoque</th>
                        <th className="pb-2.5">Consumo/Dia</th>
                        <th className="pb-2.5">Duração Est.</th>
                        <th className="pb-2.5">Tendência</th>
                        <th className="pb-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/30">
                      {beverages.map((bev) => (
                        <tr key={bev.id} className="hover:bg-purple-900/20 transition-colors">
                          <td className="py-3 font-bold text-white">
                            <div>{bev.name}</div>
                            <span className="text-[10px] text-purple-400 font-normal">Val: {bev.expiryDate}</span>
                          </td>
                          <td className="py-3 font-semibold text-purple-100">
                            {bev.currentStock} {bev.unit}
                          </td>
                          <td className="py-3 text-purple-200">
                            {bev.burnRatePerDay} / dia
                          </td>
                          <td className="py-3">
                            <span
                              className={`font-black ${
                                bev.daysRemaining <= 2
                                  ? 'text-rose-400'
                                  : bev.daysRemaining <= 4
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {bev.daysRemaining} {bev.daysRemaining === 1 ? 'dia' : 'dias'}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-emerald-400">
                            +{bev.salesGrowthPct}%
                          </td>
                          <td className="py-3 text-right">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                bev.status === 'CRITICO'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : bev.status === 'ATENCAO'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {bev.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Ranking de Bebidas Mais Vendidas */}
            <div className="rounded-2xl bg-purple-950/30 border border-purple-800/40 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">Ranking de Bebidas (Semana)</h3>
              </div>

              {rankingDrinks.length === 0 ? (
                <div className="py-8 text-center text-purple-300 bg-purple-900/10 rounded-xl border border-purple-800/20">
                  <TrendingUp className="w-10 h-10 text-purple-500/40 mx-auto mb-2" />
                  <p className="text-xs font-bold text-white">Sem vendas registradas nesta semana</p>
                  <p className="text-[11px] text-purple-400 mt-1 max-w-xs mx-auto">
                    O ranking será calculado automaticamente assim que os primeiros drinks forem emitidos.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rankingDrinks.map((drink) => (
                    <div
                      key={drink.rank}
                      className="p-3 rounded-xl bg-purple-900/30 border border-purple-800/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                          {drink.rank}º
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{drink.name}</p>
                          <p className="text-[10px] text-purple-300">{drink.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-purple-100">{drink.qty} un</p>
                        <p className="text-[10px] font-bold text-emerald-400">{drink.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Botão de Sugestão de Pedido */}
              <div className="mt-4 pt-4 border-t border-purple-800/40">
                <button
                  onClick={() => {
                    setNewRequestItem('');
                    setNewRequestQty(1);
                    setNewRequestUnit('unidades');
                    setNewRequestReason('Solicitação de reposição regular do bar');
                    setActiveSubTab('pedido');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Gerar Pedido Sugerido pela IA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA: CONTAGEM DE GARRAFAS */}
      {activeSubTab === 'contagem' && (
        <div className="rounded-2xl bg-purple-950/30 border border-purple-800/40 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-4">
            <div>
              <h2 className="text-base font-black text-white">Contagem Física de Garrafas & Chope</h2>
              <p className="text-xs text-purple-300">
                Passo 1 do Fluxo Oficial: O Bartender conta as bebidas. Em seguida, a Supervisora confere fisicamente e assina.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-900/60 text-purple-200 border border-purple-800/40">
              Setor: BAR
            </span>
          </div>

          {beverages.length === 0 ? (
            <div className="py-12 text-center text-purple-300 bg-purple-900/10 rounded-2xl border border-purple-800/30">
              <Wine className="w-12 h-12 text-purple-500/40 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">Nenhuma bebida para contagem no momento</p>
              <p className="text-xs text-purple-400 mt-1 max-w-sm mx-auto">
                Aguardando carga inicial de catálogo de bebidas do bar ou sincronização com o Teknisa.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beverages.map((bev) => (
                <div
                  key={bev.id}
                  className="p-4 rounded-xl bg-purple-900/30 border border-purple-800/40 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs font-black text-white">{bev.name}</p>
                    <p className="text-[11px] text-purple-300">
                      Estoque no Sistema: <strong>{bev.currentStock} {bev.unit}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={counts[bev.id] ?? bev.currentStock}
                      onChange={(e) =>
                        setCounts({ ...counts, [bev.id]: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-purple-700 text-center font-black text-sm text-amber-300 focus:outline-hidden focus:border-amber-400"
                    />
                    <span className="text-xs text-purple-300">{bev.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-purple-800/40 flex justify-end gap-3">
            <button
              onClick={() => setActiveSubTab('dashboard')}
              className="px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900 text-purple-200 text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitInventory}
              disabled={beverages.length === 0}
              className={`px-5 py-2 rounded-xl font-black text-xs transition-colors flex items-center gap-2 shadow-lg ${
                beverages.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Finalizar e Enviar para Supervisora Conferir</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-ABA: SOLICITAÇÃO DE BEBIDAS */}
      {activeSubTab === 'pedido' && (
        <div className="rounded-2xl bg-purple-950/30 border border-purple-800/40 p-6 space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-purple-800/40 pb-4">
            <h2 className="text-base font-black text-white">Solicitar Bebidas & Insumos do Bar</h2>
            <p className="text-xs text-purple-300">
              Fluxo Oficial de Compras: O Bartender solicita → A Supervisora analisa estoque e aprova com assinatura → O Gerente audita.
            </p>
          </div>

          <form onSubmit={handleCreatePurchase} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Item / Bebida Solicitada</label>
              <input
                type="text"
                required
                value={newRequestItem}
                onChange={(e) => setNewRequestItem(e.target.value)}
                placeholder="Ex: Gin Tanqueray 750ml, Água Tônica, etc."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-700 text-xs text-white focus:outline-hidden focus:border-amber-400 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newRequestQty}
                  onChange={(e) => setNewRequestQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-700 text-xs text-amber-300 font-black focus:outline-hidden focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Unidade de Medida</label>
                <input
                  type="text"
                  required
                  value={newRequestUnit}
                  onChange={(e) => setNewRequestUnit(e.target.value)}
                  placeholder="Ex: garrafas, latas, caixas"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-700 text-xs text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Motivo / Justificativa</label>
              <textarea
                rows={3}
                required
                value={newRequestReason}
                onChange={(e) => setNewRequestReason(e.target.value)}
                placeholder="Justifique a necessidade (ex: alto giro no fim de semana, ruptura iminente)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-700 text-xs text-white focus:outline-hidden focus:border-amber-400 font-medium"
              />
            </div>

            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/40 text-[11px] text-purple-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Solicitante: <strong>{currentUser.name}</strong> • Matrícula:{' '}
                <strong>{currentUser.matricula || 'BAR-01'}</strong> • Registrado na Trilha de Auditoria.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveSubTab('dashboard')}
                className="px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900 text-purple-200 text-xs font-bold transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors flex items-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Enviar Solicitação para Supervisora</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-ABA: IA DO BAR (ASSISTENTE CONTEXTUAL COMPLETO) */}
      {activeSubTab === 'ia' && (
        <div className="rounded-2xl bg-purple-950/30 border border-purple-800/40 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">{aiProfile.title}</h2>
              <p className="text-xs text-purple-300">{aiProfile.subtitle}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">Perguntas Rápidas ao Copilot do Bar:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Como iniciar a contagem física das bebidas?',
                'Qual o fluxo para solicitar reposição ao CDA?',
                'Como registrar divergências de contagem?',
                'Quais as normas ANVISA para guarda de garrafas abertas?',
              ].map((q: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (q.includes('solicitar reposição')) {
                      setActiveSubTab('pedido');
                    } else if (q.includes('contagem')) {
                      setActiveSubTab('contagem');
                    } else {
                      showNotification(`IA do Bar: Resposta processada para "${q}"`);
                    }
                  }}
                  className="p-3 rounded-xl bg-purple-900/30 border border-purple-800/30 hover:border-purple-500 hover:bg-purple-900/50 text-left transition-colors flex items-center justify-between"
                >
                  <span className="text-xs text-purple-100 font-bold">{q}</span>
                  <ArrowUpRight className="w-4 h-4 text-purple-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
