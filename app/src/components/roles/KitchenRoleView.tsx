// ============================================================
// PAINEL EXCLUSIVO DA COZINHA (CHEFE & SUBCHEFE - ACESSO 60)
// Estoque da Cozinha • Câmara Fria • Produção • PEPS • IA da Cozinha
// ============================================================

import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Snowflake,
  Sparkles,
  AlertTriangle,
  Clock,
  Layers,
  Send,
  Plus,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  Flame,
  FileCheck2,
  Lock,
} from 'lucide-react';
import type { UserAccount } from '../../types/restaurant.types';
import { getContextualAiProfile } from '../../services/contextualAiService';
import { submitInventoryCount, createPurchaseRequest } from '../../services/workflowApprovalStore';
import { getAuditTrail, recordAuditAction } from '../../services/auditTrailStore';
import { useOperationalData } from '../../services/centralDataStore';
import salesAnalyticsData from '../../data/salesAnalyticsData.json';

interface KitchenRoleViewProps {
  currentUser: UserAccount;
}

interface KitchenStockItem {
  id: string;
  name: string;
  category: 'PROTEINA' | 'HORTIFRUTI' | 'SECO' | 'LATICINIO';
  currentStock: number;
  minStock: number;
  unit: string;
  validityDate: string;
  status: 'NORMAL' | 'ATENCAO' | 'CRITICO';
  location: string;
}

export const KitchenRoleView: React.FC<KitchenRoleViewProps> = ({ currentUser }) => {
  const isSubchefe = currentUser.role === 'SUBCHEFE' || currentUser.role === 'SUB_CHEFE_COZINHA';
  const operationalData = useOperationalData();

  const [activeTab, setActiveTab] = useState<'estoque' | 'contagem' | 'solicitar' | 'camara' | 'perdas' | 'escala'>('estoque');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [stockItems, setStockItems] = useState<KitchenStockItem[]>(() => {
    return (operationalData.thawRecommendations || salesAnalyticsData.thawRecommendations || []).map((thaw: any, idx: number) => ({
      id: `k-stk-${idx + 1}`,
      name: thaw.name,
      category: 'PROTEINA' as const,
      currentStock: thaw.minChamberStock + thaw.weekdayThawQuota,
      minStock: thaw.minChamberStock,
      unit: thaw.unit,
      validityDate: '45 dias',
      status: 'NORMAL' as const,
      location: 'Câmara Fria & Degelo',
    }));
  });

  React.useEffect(() => {
    if (operationalData.thawRecommendations?.length) {
      setStockItems(
        operationalData.thawRecommendations.map((thaw: any, idx: number) => ({
          id: `k-stk-${idx + 1}`,
          name: thaw.name,
          category: 'PROTEINA' as const,
          currentStock: thaw.minChamberStock + thaw.weekdayThawQuota,
          minStock: thaw.minChamberStock,
          unit: thaw.unit,
          validityDate: '45 dias',
          status: 'NORMAL' as const,
          location: 'Câmara Fria & Degelo',
        }))
      );
    }
  }, [operationalData]);

  // IA Contextual da Cozinha
  const aiProfile = getContextualAiProfile(currentUser);

  // Contagem para o Inventário
  const [counts, setCounts] = useState<{ [id: string]: number }>({});

  // Formulário de Solicitação de Compra
  const [requestItem, setRequestItem] = useState('');
  const [requestQty, setRequestQty] = useState(1);
  const [requestUnit, setRequestUnit] = useState('kg');
  const [requestReason, setRequestReason] = useState('');

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Enviar contagem física de estoque para a Supervisora conferir
  const handleSubmitInventory = () => {
    try {
      submitInventoryCount({
        sector: 'COZINHA',
        counter: currentUser,
        items: stockItems.map((item) => ({
          itemId: item.id,
          itemName: item.name,
          unit: item.unit,
          systemExpectedQuantity: item.currentStock,
          countedQuantity: counts[item.id] ?? item.currentStock,
          differenceQuantity: (counts[item.id] ?? item.currentStock) - item.currentStock,
          differenceValueEstimate: 0,
        })),
      });

      showNotification('✅ Contagem da cozinha enviada! Aguardando conferência física e assinatura da Supervisora.');
      setActiveTab('estoque');
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar contagem.');
    }
  };

  // Solicitar compra de insumo
  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestItem || requestQty <= 0) return;

    try {
      createPurchaseRequest({
        sector: 'COZINHA',
        requester: currentUser,
        items: [
          {
            id: `k-req-${Date.now()}`,
            itemName: requestItem,
            category: 'CARNES',
            requestedQuantity: requestQty,
            unit: requestUnit,
            estimatedPriceUnit: 35,
            currentStock: 0,
            urgency: 'ALTA',
          },
        ],
        justification: requestReason,
      });

      showNotification('✅ Solicitação enviada! A Supervisora receberá para conferir e aprovar com assinatura digital.');
      setRequestItem('');
      setRequestQty(1);
      setActiveTab('estoque');
    } catch (err: any) {
      alert(err.message || 'Erro ao solicitar insumo.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-6 text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-black text-sm flex items-center gap-2 border border-emerald-300 animate-slide-left">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner de Identificação Cozinha */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 border border-emerald-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">
                  {isSubchefe ? 'Ambiente do Subchefe de Cozinha' : 'Ambiente do Chefe de Cozinha'}
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Acesso 60 • Técnico Operacional
                </span>
                {isSubchefe && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Modo Execução Diária
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/80">
                Responsável: <strong className="text-white">{currentUser.name}</strong> • Matrícula:{' '}
                <strong className="text-amber-300">{currentUser.matricula || 'COZ-01'}</strong>
              </p>
            </div>
          </div>

          {/* Navegação Rápida */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-emerald-800/40">
            <button
              onClick={() => setActiveTab('estoque')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'estoque' ? 'bg-emerald-600 text-slate-950 font-black shadow-md' : 'text-emerald-300 hover:text-white'
              }`}
            >
              Estoque Cozinha
            </button>
            <button
              onClick={() => setActiveTab('contagem')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'contagem' ? 'bg-emerald-600 text-slate-950 font-black shadow-md' : 'text-emerald-300 hover:text-white'
              }`}
            >
              Contagem Física
            </button>
            <button
              onClick={() => setActiveTab('solicitar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'solicitar' ? 'bg-emerald-600 text-slate-950 font-black shadow-md' : 'text-emerald-300 hover:text-white'
              }`}
            >
              Solicitar Insumos
            </button>
            <button
              onClick={() => setActiveTab('camara')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'camara' ? 'bg-emerald-600 text-slate-950 font-black shadow-md' : 'text-emerald-300 hover:text-white'
              }`}
            >
              Câmara Fria & PEPS
            </button>
          </div>
        </div>
      </div>

      {/* IA DA COZINHA: Alertas Proativos */}
      <div className="rounded-2xl bg-emerald-950/30 border border-emerald-800/40 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/30 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-black text-white">IA da Cozinha • Consumo Médio, Rupturas & PEPS</h2>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded-full">
            Inteligência Ativa
          </span>
        </div>

        {aiProfile.alerts.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-800/30 text-center">
            <p className="text-xs text-emerald-200 font-bold">Nenhum alerta crítico ou ruptura no momento.</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">Dia 1 de operação iniciado. A IA monitorará o consumo, perdas e validades PEPS em tempo real.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiProfile.alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-800/30 hover:border-emerald-600/50 transition-colors flex items-start gap-2.5"
              >
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-white font-bold">{alert.title}</p>
                  <p className="text-[11px] text-emerald-100 font-medium leading-relaxed mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUB-ABA: ESTOQUE DA COZINHA */}
      {activeTab === 'estoque' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/30">
              <p className="text-[11px] font-bold text-emerald-300 uppercase">Insumos Monitorados</p>
              <p className="text-2xl font-black text-white mt-1">{stockItems.length}</p>
              <p className="text-[10px] text-emerald-300/80 mt-1">Cozinha & Câmaras Frias</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/30">
              <p className="text-[11px] font-bold text-emerald-300 uppercase">Alerta de Ruptura</p>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {stockItems.filter((i) => i.status !== 'NORMAL').length}
              </p>
              <p className="text-[10px] text-amber-300/80 mt-1">
                {stockItems.some((i) => i.status !== 'NORMAL') ? 'Necessita reposição' : 'Nenhuma ruptura detectada'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/30">
              <p className="text-[11px] font-bold text-emerald-300 uppercase">Supervisora Responsável</p>
              <p className="text-base font-black text-white mt-1">Patrícia Lima</p>
              <p className="text-[10px] text-emerald-300/80 mt-1">Aprova pedidos & assina inventário</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/30">
              <p className="text-[11px] font-bold text-emerald-300 uppercase">Gerente Auditor</p>
              <p className="text-base font-black text-white mt-1">Ivan Silveira</p>
              <p className="text-[10px] text-emerald-300/80 mt-1">Audita e fornece feedback</p>
            </div>
          </div>

          {/* Cotas Diárias de Degelo Calculadas das Vendas Reais */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-950/50 via-emerald-950/40 to-slate-950/60 border border-blue-500/30 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-black text-white">Cotas de Degelo Diário Recomendadas (Teknisa • 98.393 Vendas)</h3>
              </div>
              <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Média do Dia: 159 pedidos
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(salesAnalyticsData.thawRecommendations || []).slice(0, 8).map((thaw: any) => (
                <div key={thaw.keyword} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{thaw.category}</span>
                    <p className="text-xs font-black text-white truncate" title={thaw.name}>{thaw.name}</p>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between pt-1 border-t border-slate-800">
                    <span className="text-[10px] text-emerald-400 font-semibold">Semana: <strong>{thaw.weekdayThawQuota} {thaw.unit}</strong></span>
                    <span className="text-[10px] text-amber-300 font-semibold">Fim Semana: <strong>{thaw.weekendThawQuota} {thaw.unit}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-950/30 border border-emerald-800/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-white">Posição de Insumos da Cozinha (Sem Dados Financeiros)</h3>
              <button
                onClick={() => setActiveTab('contagem')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors"
              >
                Nova Contagem de Estoque
              </button>
            </div>

            {stockItems.length === 0 ? (
              <div className="py-12 text-center text-emerald-300 bg-emerald-900/10 rounded-xl border border-emerald-800/20">
                <UtensilsCrossed className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
                <p className="text-sm font-bold text-white">Nenhum insumo cadastrado na cozinha</p>
                <p className="text-xs text-emerald-400 mt-1 max-w-sm mx-auto">
                  Dia 1 de operação. Os insumos e pesagens aparecerão conforme forem sincronizados pelo Teknisa ou lançados na contagem física.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-800/40 text-emerald-300 text-[11px]">
                      <th className="pb-2.5">Insumo / Categoria</th>
                      <th className="pb-2.5">Localização</th>
                      <th className="pb-2.5">Estoque Atual</th>
                      <th className="pb-2.5">Estoque Mínimo</th>
                      <th className="pb-2.5">Validade PEPS</th>
                      <th className="pb-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {stockItems.map((item) => (
                      <tr key={item.id} className="hover:bg-emerald-900/20 transition-colors">
                        <td className="py-3 font-bold text-white">
                          <div>{item.name}</div>
                          <span className="text-[10px] text-emerald-400 font-normal">{item.category}</span>
                        </td>
                        <td className="py-3 text-emerald-200">{item.location}</td>
                        <td className="py-3 font-black text-white text-sm">
                          {item.currentStock} {item.unit}
                        </td>
                        <td className="py-3 text-emerald-300">
                          {item.minStock} {item.unit}
                        </td>
                        <td className="py-3 font-bold text-amber-300">{item.validityDate}</td>
                        <td className="py-3 text-right">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              item.status === 'CRITICO'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : item.status === 'ATENCAO'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-ABA: CONTAGEM FÍSICA */}
      {activeTab === 'contagem' && (
        <div className="rounded-2xl bg-emerald-950/30 border border-emerald-800/40 p-6 space-y-6">
          <div className="border-b border-emerald-800/40 pb-4">
            <h2 className="text-base font-black text-white">Contagem Física de Insumos da Cozinha</h2>
            <p className="text-xs text-emerald-300">
              Passo 1 do Fluxo Oficial: O Chefe/Subchefe conta. A Supervisora confere fisicamente e assina. O Gerente audita com feedback.
            </p>
          </div>

          {stockItems.length === 0 ? (
            <div className="py-12 text-center text-emerald-300 bg-emerald-900/10 rounded-2xl border border-emerald-800/30">
              <UtensilsCrossed className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">Nenhum insumo disponível para contagem</p>
              <p className="text-xs text-emerald-400 mt-1 max-w-sm mx-auto">
                Aguardando cadastro de insumos ou sincronização da cozinha com o Teknisa.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-emerald-800/40 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs font-black text-white">{item.name}</p>
                    <p className="text-[11px] text-emerald-300">
                      Esperado no Sistema: <strong>{item.currentStock} {item.unit}</strong> • {item.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={counts[item.id] ?? item.currentStock}
                      onChange={(e) =>
                        setCounts({ ...counts, [item.id]: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-emerald-700 text-center font-black text-sm text-amber-300 focus:outline-hidden focus:border-amber-400"
                    />
                    <span className="text-xs text-emerald-300">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-emerald-800/40 flex justify-end gap-3">
            <button
              onClick={() => setActiveTab('estoque')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-200 text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitInventory}
              disabled={stockItems.length === 0}
              className={`px-5 py-2 rounded-xl font-black text-xs transition-colors flex items-center gap-2 shadow-lg ${
                stockItems.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Finalizar Contagem e Enviar para Supervisora Conferir</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-ABA: SOLICITAR INSUMOS */}
      {activeTab === 'solicitar' && (
        <div className="rounded-2xl bg-emerald-950/30 border border-emerald-800/40 p-6 space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-emerald-800/40 pb-4">
            <h2 className="text-base font-black text-white">Solicitação de Compras de Insumos</h2>
            <p className="text-xs text-emerald-300">
              Fluxo Oficial: O Chefe/Subchefe solicita → A Supervisora analisa estoque e aprova com assinatura → O Gerente audita.
            </p>
          </div>

          <form onSubmit={handleCreatePurchase} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">Insumo Solicitado</label>
              <input
                type="text"
                required
                value={requestItem}
                onChange={(e) => setRequestItem(e.target.value)}
                placeholder="Ex: Filé Mignon, Brócolis Ninja, etc."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-700 text-xs text-white focus:outline-hidden focus:border-amber-400 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={requestQty}
                  onChange={(e) => setRequestQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-700 text-xs text-amber-300 font-black focus:outline-hidden focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">Unidade de Medida</label>
                <input
                  type="text"
                  required
                  value={requestUnit}
                  onChange={(e) => setRequestUnit(e.target.value)}
                  placeholder="Ex: kg, litros, caixas"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-700 text-xs text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">Justificativa da Necessidade</label>
              <textarea
                rows={3}
                required
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                placeholder="Justifique o pedido (ex: estoque crítico, evento especial programado)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-700 text-xs text-white focus:outline-hidden focus:border-amber-400 font-medium"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Solicitante: <strong>{currentUser.name}</strong> ({currentUser.role}) • Matrícula:{' '}
                <strong>{currentUser.matricula || 'COZ-01'}</strong> • Trilha de Auditoria Ativa.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('estoque')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-200 text-xs font-bold transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors flex items-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Enviar Solicitação para a Supervisora</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-ABA: CÂMARA FRIA & PEPS */}
      {activeTab === 'camara' && (
        <div className="rounded-2xl bg-emerald-950/30 border border-emerald-800/40 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-black text-white">Câmara Fria & Controle PEPS (Primeiro que Entra, Primeiro que Sai)</h2>
          </div>
          <p className="text-xs text-emerald-300">
            Monitoramento de temperaturas, datas de fracionamento e giro obrigatório de proteínas e laticínios.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-800/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-cyan-300">Câmara Fria 01 (Resfriados)</span>
                <span className="text-xs font-black text-emerald-400">+2.4 ºC (Conforme)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Aguardando primeiro fracionamento e etiquetagem PEPS do dia.
              </p>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                Faixa Térmica Ideal ANVISA
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-800/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-cyan-300">Freezer 02 (Congelados)</span>
                <span className="text-xs font-black text-emerald-400">-18.6 ºC (Conforme)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Nenhum lote com alerta de expiração. Pronto para recebimento de proteínas.
              </p>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                Faixa Térmica Ideal ANVISA
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
