// ============================================================
// PAINEL DO GERENTE - AUDITOR OPERACIONAL DA UNIDADE (ACESSO 90)
// Auditoria de Inventários, Auditoria de Compras, Indicadores & Feedback
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  Search,
  MessageSquare,
  Lock,
  History,
  Users,
  Eye,
  DollarSign,
  Flame,
  Check,
  X,
  FileText,
} from 'lucide-react';
import type { UserAccount } from '../../types/restaurant.types';
import {
  listInventories,
  listPurchaseRequests,
  managerAuditInventory,
  managerAuditPurchase,
  InventoryAuditDocument,
  PurchaseRequest,
} from '../../services/workflowApprovalStore';
import { getContextualAiProfile } from '../../services/contextualAiService';
import { getAuditTrail, AuditRecord } from '../../services/auditTrailStore';
import salesAnalyticsData from '../../data/salesAnalyticsData.json';

interface ManagerAuditDashboardViewProps {
  currentUser: UserAccount;
  onNavigateTab?: (tab: string) => void;
}

export const ManagerAuditDashboardView: React.FC<ManagerAuditDashboardViewProps> = ({
  currentUser,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'inventarios' | 'compras' | 'indicadores' | 'auditoria_imutavel'>('inventarios');
  const [inventories, setInventories] = useState<InventoryAuditDocument[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [matriculaInput, setMatriculaInput] = useState(currentUser.matricula || 'GER-01');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados de Auditoria de Inventário
  const [auditingInvId, setAuditingInvId] = useState<string | null>(null);
  const [invFeedback, setInvFeedback] = useState('');
  const [invDecision, setInvDecision] = useState<'APROVADO' | 'REPROVADO'>('APROVADO');

  // Estados de Auditoria de Compras
  const [auditingPurchaseId, setAuditingPurchaseId] = useState<string | null>(null);
  const [purchaseAuditNotes, setPurchaseAuditNotes] = useState('');
  const [purchaseApprovalDecision, setPurchaseApprovalDecision] = useState<'HOMOLOGADO' | 'COM_RESSALVAS' | 'REJEITADO'>('HOMOLOGADO');

  // IA Contextual do Gerente
  const aiProfile = getContextualAiProfile(currentUser);

  const refreshData = () => {
    setInventories(listInventories(currentUser.restaurantId));
    setPurchases(listPurchaseRequests(currentUser.restaurantId));
    setAuditLogs(getAuditTrail({ restaurantId: currentUser.restaurantId }));
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('tk_audit_record_created', handleUpdate);
    return () => window.removeEventListener('tk_audit_record_created', handleUpdate);
  }, [currentUser]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Gerente Audita e Assina Inventário Supervisionado
  const handleManagerAuditInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditingInvId || !invFeedback.trim()) {
      alert('Por favor, forneça o parecer/feedback gerencial da auditoria.');
      return;
    }

    try {
      managerAuditInventory({
        inventoryId: auditingInvId,
        manager: currentUser,
        approved: invDecision === 'APROVADO',
        feedback: invFeedback.trim(),
        actionTaken: invDecision === 'APROVADO' ? 'Inventário auditado e aprovado com sucesso' : 'Solicitar recontagem com Supervisora',
      });

      showNotification(`Auditoria de inventário concluída! Decisão: ${invDecision}. Registrado na Trilha Imutável.`);
      setAuditingInvId(null);
      setInvFeedback('');
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Erro ao auditar inventário.');
    }
  };

  // Gerente Audita e Fornece Feedback sobre Compras
  const handleManagerAuditPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditingPurchaseId || !purchaseAuditNotes.trim()) {
      alert('Por favor, informe suas observações de auditoria para o pedido.');
      return;
    }

    try {
      managerAuditPurchase({
        requestId: auditingPurchaseId,
        manager: currentUser,
        feedback: purchaseAuditNotes.trim(),
        approvedStrategy: purchaseApprovalDecision === 'HOMOLOGADO',
      });

      showNotification('Auditoria gerencial de compra registrada com assinatura digital!');
      setAuditingPurchaseId(null);
      setPurchaseAuditNotes('');
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Erro ao auditar compra.');
    }
  };

  const pendingInventoriesForAudit = inventories.filter(
    (i) => i.isLocked && !i.managerAudit
  );

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-6 text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-black text-sm flex items-center gap-2 border border-emerald-300 animate-slide-left">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner de Identificação do Gerente Auditor */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 border border-blue-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">Auditor Operacional da Unidade</h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Gerente • Acesso 90
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Auditor: <strong className="text-white">{currentUser.name}</strong> • Matrícula:{' '}
                <strong className="text-amber-300">{currentUser.matricula || 'GER-01'}</strong> • Unidade:{' '}
                <strong className="text-emerald-400">Engenho Manauara</strong>
              </p>
            </div>
          </div>

          {/* Navegação Rápida entre Visões */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-blue-800/40">
            <button
              onClick={() => setActiveTab('inventarios')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'inventarios' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300 hover:text-white'
              }`}
            >
              Auditoria de Inventários ({pendingInventoriesForAudit.length})
            </button>
            <button
              onClick={() => setActiveTab('compras')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'compras' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300 hover:text-white'
              }`}
            >
              Auditoria de Compras
            </button>
            <button
              onClick={() => setActiveTab('indicadores')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'indicadores' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300 hover:text-white'
              }`}
            >
              Indicadores da Loja
            </button>
            <button
              onClick={() => setActiveTab('auditoria_imutavel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'auditoria_imutavel' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300 hover:text-white'
              }`}
            >
              Trilha Imutável ({auditLogs.length})
            </button>
          </div>
        </div>
      </div>

      {/* IA DO GERENTE: Insights Estratégicos & Desvios */}
      <div className="rounded-2xl bg-blue-950/30 border border-blue-800/40 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-black text-white">IA do Gerente • Alertas de CMV, Rupturas & Auditoria</h2>
          </div>
          <span className="text-[10px] font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded-full">
            Inteligência Analítica
          </span>
        </div>

        {aiProfile.alerts.length === 0 ? (
          <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-800/30 text-center">
            <p className="text-xs text-blue-200 font-bold">Nenhum desvio crítico ou inconformidade gerencial detectada.</p>
            <p className="text-[11px] text-blue-400 mt-0.5">Dia 1 de operação iniciado. A IA auditará inventários, compras e indicadores de CMV em tempo real.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {aiProfile.alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-blue-900/30 border border-blue-800/30 hover:border-blue-600/50 transition-colors flex items-start gap-2.5"
              >
                <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-white font-bold">{alert.title}</p>
                  <p className="text-[11px] text-blue-100 font-medium leading-relaxed mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUB-ABA: AUDITORIA DE INVENTÁRIOS (O PASSO 6 DO FLUXO OFICIAL) */}
      {activeTab === 'inventarios' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/30 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">Fluxo de Inventário: Supervisora Confere → Gerente Audita</h3>
              <p className="text-xs text-blue-300">
                Após a contagem do Chefe/Bartender e a conferência presencial com assinatura da Supervisora, o Gerente valida e emite feedback oficial.
              </p>
            </div>
            <span className="text-xs font-black text-amber-300 bg-amber-950 px-3 py-1.5 rounded-lg border border-amber-800/40">
              {pendingInventoriesForAudit.length} aguardando auditoria
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {inventories.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/40 border border-blue-800/20 text-center">
                <ClipboardCheck className="w-12 h-12 text-blue-500/40 mx-auto mb-3" />
                <p className="text-sm font-bold text-white">Nenhum inventário registrado para auditoria</p>
                <p className="text-xs text-blue-300 mt-1 max-w-sm mx-auto">
                  Dia 1 de operação iniciado. Os inventários aparecerão aqui assim que forem contados pelos setores e conferidos pela Supervisora.
                </p>
              </div>
            ) : (
              inventories.map((inv) => {
                const isLocked = inv.isLocked;
                const isAudited = Boolean(inv.managerAudit);

                return (
                  <div
                    key={inv.id}
                    className="rounded-2xl bg-slate-900/60 border border-blue-800/40 p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">Inventário #{inv.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Setor: {inv.sector}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Contado por: <strong>{inv.countedBy.userName}</strong> ({inv.countedBy.userRole}) em {new Date(inv.countedBy.finishedAt).toLocaleString('pt-BR')}
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                            isAudited
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isLocked
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {inv.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                  {/* Assinatura da Supervisora */}
                  {inv.supervisorVerification && (
                    <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/40 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-teal-400" />
                        <div>
                          <p className="font-bold text-teal-200">
                            Supervisionado e Conferido por: <strong>{inv.supervisorVerification.supervisorName}</strong>
                          </p>
                          <p className="text-[10px] text-teal-400">
                            Matrícula: {inv.supervisorVerification.matricula} • {new Date(inv.supervisorVerification.verifiedAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-teal-300 italic">
                        "{inv.supervisorVerification.statement}"
                      </span>
                    </div>
                  )}

                  {/* Parecer do Gerente se já auditado */}
                  {inv.managerAudit && (
                    <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <div>
                          <p className="font-bold text-blue-200">
                            Auditoria Gerencial: <strong>{inv.managerAudit.managerName}</strong> • Decisão:{' '}
                            <strong className={inv.managerAudit.status === 'APROVADO' ? 'text-emerald-400' : 'text-rose-400'}>
                              {inv.managerAudit.status}
                            </strong>
                          </p>
                          <p className="text-[10px] text-blue-300">
                            Feedback: "{inv.managerAudit.feedback}" • Hash: {inv.managerAudit.signatureHash.slice(0, 16)}...
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                        Auditoria Imutável
                      </span>
                    </div>
                  )}

                  {/* Tabela de Itens Contados */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                          <th className="pb-1">Item</th>
                          <th className="pb-1 text-center">Esperado</th>
                          <th className="pb-1 text-center">Contado</th>
                          <th className="pb-1 text-center">Divergência</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {inv.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="py-2 text-white font-medium">{item.itemName}</td>
                            <td className="py-2 text-center text-slate-300">
                              {item.systemExpectedQuantity} {item.unit}
                            </td>
                            <td className="py-2 text-center font-bold text-white">
                              {item.countedQuantity} {item.unit}
                            </td>
                            <td className="py-2 text-center">
                              <span
                                className={`font-black ${
                                  item.differenceQuantity === 0
                                    ? 'text-emerald-400'
                                    : item.differenceQuantity < 0
                                    ? 'text-rose-400'
                                    : 'text-amber-400'
                                }`}
                              >
                                {item.differenceQuantity > 0 ? `+${item.differenceQuantity}` : item.differenceQuantity} {item.unit}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Ação de Auditoria para Inventários bloqueados aguardando gerente */}
                  {isLocked && !inv.managerAudit && (
                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      {auditingInvId === inv.id ? (
                        <form onSubmit={handleManagerAuditInventory} className="w-full space-y-3 bg-slate-950 p-4 rounded-xl border border-blue-700">
                          <p className="text-xs font-black text-amber-300">Parecer & Feedback Gerencial do Inventário</p>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold cursor-pointer">
                              <input
                                type="radio"
                                name="decision"
                                checked={invDecision === 'APROVADO'}
                                onChange={() => setInvDecision('APROVADO')}
                              />
                              Aprovar Inventário
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-rose-400 font-bold cursor-pointer">
                              <input
                                type="radio"
                                name="decision"
                                checked={invDecision === 'REPROVADO'}
                                onChange={() => setInvDecision('REPROVADO')}
                              />
                              Reprovar com Ressalva
                            </label>
                          </div>
                          <textarea
                            rows={2}
                            required
                            value={invFeedback}
                            onChange={(e) => setInvFeedback(e.target.value)}
                            placeholder="Feedback para o Chefe/Supervisora sobre as divergências..."
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setAuditingInvId(null)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs"
                            >
                              Assinar e Emitir Feedback
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            setAuditingInvId(inv.id);
                            setInvFeedback('Conferência aprovada com CMV dentro da margem permitida.');
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Auditar Inventário & Assinar Documento</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        </div>
      )}

      {/* SUB-ABA: AUDITORIA DE COMPRAS */}
      {activeTab === 'compras' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/30">
            <h3 className="text-sm font-black text-white">Fluxo de Compras: Supervisora Aprova → Gerente Audita</h3>
            <p className="text-xs text-blue-300">
              O Gerente acompanha as compras aprovadas pela Supervisora e audita desperdícios ou desvios de consumo.
            </p>
          </div>

          <div className="space-y-4">
            {purchases.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/40 border border-blue-800/20 text-center">
                <FileCheck2 className="w-12 h-12 text-blue-500/40 mx-auto mb-3" />
                <p className="text-sm font-bold text-white">Nenhuma compra para auditoria no momento</p>
                <p className="text-xs text-blue-300 mt-1 max-w-sm mx-auto">
                  Dia 1 de operação iniciado. As solicitações de compra aprovadas pela Supervisora aparecerão aqui para auditoria gerencial.
                </p>
              </div>
            ) : (
              purchases.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">Pedido #{req.id}</span>
                      <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded">
                        {req.items.length} itens (R$ {req.totalEstimatedAmount.toFixed(2)})
                      </span>
                      <span className="text-[10px] text-blue-300 bg-blue-950 px-2 py-0.5 rounded">
                        Setor: {req.sector}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Solicitante: <strong>{req.requesterName}</strong> • Justificativa: "{req.justification}"
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Itens: {req.items.map((i) => `${i.itemName} (${i.requestedQuantity} ${i.unit})`).join(', ')}
                    </p>
                    {req.supervisorReview && (
                      <p className="text-[11px] text-teal-300 mt-1 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-teal-400" />
                        Aprovado por: <strong>{req.supervisorReview.reviewedByName}</strong> em{' '}
                        {new Date(req.supervisorReview.reviewedAt).toLocaleString('pt-BR')} (
                        {req.supervisorReview.notes})
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    {req.managerAudit ? (
                      <div className="text-right">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          AUDITADO: {req.managerAudit.approvedStrategy ? 'HOMOLOGADO' : 'COM RESSALVAS'}
                        </span>
                        <p className="text-[10px] text-blue-300 mt-1">"{req.managerAudit.feedback}"</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAuditingPurchaseId(req.id);
                          setPurchaseAuditNotes('Conferido com base no consumo médio semanal.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                      >
                        Auditar Compra
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-ABA: INDICADORES DA LOJA */}
      {activeTab === 'indicadores' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/30">
              <p className="text-[11px] font-bold text-blue-300 uppercase">CMV Real da Unidade</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">28.4%</p>
              <p className="text-[10px] text-emerald-300/80 mt-1">Margem de Contribuição: 71.6%</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/30">
              <p className="text-[11px] font-bold text-blue-300 uppercase">Faturamento Diário (D-1)</p>
              <p className="text-2xl font-black text-white mt-1">
                {(salesAnalyticsData.summary?.dailyAverageRevenue || 33340.35).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-[10px] text-blue-300/80 mt-1">Total 90D: R$ 3.000.631,16</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/30">
              <p className="text-[11px] font-bold text-blue-300 uppercase">Ticket Médio & Giro</p>
              <p className="text-2xl font-black text-white mt-1">
                {(salesAnalyticsData.summary?.ticketMedioGlobal || 210.11).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-[10px] text-blue-300/80 mt-1">{salesAnalyticsData.summary?.dailyAverageOrders || 159} pedidos faturados/dia</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/30">
              <p className="text-[11px] font-bold text-blue-300 uppercase">Volume Auditado</p>
              <p className="text-2xl font-black text-white mt-1">104.296</p>
              <p className="text-[10px] text-blue-300/80 mt-1">Itens faturados em 98.393 vendas</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA: TRILHA DE AUDITORIA IMUTÁVEL */}
      {activeTab === 'auditoria_imutavel' && (
        <div className="rounded-2xl bg-slate-900/60 border border-blue-800/40 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-blue-900/40 pb-4">
            <div>
              <h2 className="text-base font-black text-white">Trilha de Auditoria Imutável Corporativa</h2>
              <p className="text-xs text-blue-300">
                Princípio Mandatório: Nenhum registro pode ser excluído, apenas arquivado. Todos os acessos e assinaturas são gravados.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800/50">
              Total: {auditLogs.length} eventos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                  <th className="pb-2">Data / Hora</th>
                  <th className="pb-2">Usuário / Cargo</th>
                  <th className="pb-2">Módulo</th>
                  <th className="pb-2">Ação</th>
                  <th className="pb-2">Novo Valor / Detalhe</th>
                  <th className="pb-2">Dispositivo / IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.slice(0, 30).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 text-slate-400 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 font-bold text-white">
                      <div>{log.userName}</div>
                      <span className="text-[10px] text-blue-400">{log.userRole}</span>
                    </td>
                    <td className="py-2.5 text-slate-300">{log.module}</td>
                    <td className="py-2.5 font-semibold text-amber-300">{log.action}</td>
                    <td className="py-2.5 text-slate-200 max-w-xs truncate">{log.newValue || '-'}</td>
                    <td className="py-2.5 text-[10px] text-slate-400 font-mono">
                      {log.ip} • {log.device.split(' ')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
