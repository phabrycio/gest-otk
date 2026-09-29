// ============================================================
// PAINEL EXCLUSIVO DA SUPERVISORA (ACESSO 75)
// Operação Administrativa • Gestão de Equipe, Inventários & Compras
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ShoppingCart,
  Sparkles,
  Lock,
  FileText,
  ShieldCheck,
  Search,
  PenTool,
  Check,
} from 'lucide-react';
import type { UserAccount } from '../../types/restaurant.types';
import {
  listInventories,
  listPurchaseRequests,
  supervisorSignAndLockInventory,
  supervisorApprovePurchase,
  InventoryAuditDocument,
  PurchaseRequest,
} from '../../services/workflowApprovalStore';
import { getContextualAiProfile } from '../../services/contextualAiService';
import { getAuditTrail } from '../../services/auditTrailStore';

interface SupervisorDashboardViewProps {
  currentUser: UserAccount;
  onNavigateTab?: (tab: string) => void;
}

export const SupervisorDashboardView: React.FC<SupervisorDashboardViewProps> = ({
  currentUser,
  onNavigateTab,
}) => {
  const [inventories, setInventories] = useState<InventoryAuditDocument[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRequest[]>([]);
  const [matriculaInput, setMatriculaInput] = useState(currentUser.matricula || 'SUP-01');
  const [signingInventoryId, setSigningInventoryId] = useState<string | null>(null);
  const [approvingPurchaseId, setApprovingPurchaseId] = useState<string | null>(null);
  const [purchaseNotes, setPurchaseNotes] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // IA Contextual da Supervisora
  const aiProfile = getContextualAiProfile(currentUser);

  const refreshData = () => {
    setInventories(listInventories(currentUser.restaurantId));
    setPurchases(listPurchaseRequests(currentUser.restaurantId));
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('tk_audit_record_created', handleUpdate);
    return () => window.removeEventListener('tk_audit_record_created', handleUpdate);
  }, [currentUser]);

  // Ação de Conferência e Assinatura Digital do Inventário
  const handleSignInventory = (invId: string) => {
    try {
      supervisorSignAndLockInventory({
        inventoryId: invId,
        supervisor: currentUser,
        matricula: matriculaInput.trim() || 'SUP-01',
      });
      setSigningInventoryId(null);
      setSuccessToast('Inventário conferido presencialmente e bloqueado com assinatura digital!');
      setTimeout(() => setSuccessToast(null), 4000);
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Erro ao assinar inventário.');
    }
  };

  // Ação de Aprovação de Solicitação de Compra
  const handleApprovePurchase = (reqId: string, decision: 'APROVADO' | 'REJEITADO') => {
    try {
      supervisorApprovePurchase({
        requestId: reqId,
        supervisor: currentUser,
        matricula: matriculaInput.trim() || 'SUP-01',
        decision,
        notes: purchaseNotes.trim() || (decision === 'APROVADO' ? 'Conferido no estoque.' : 'Rejeitado por estoque suficiente.'),
      });
      setApprovingPurchaseId(null);
      setPurchaseNotes('');
      setSuccessToast(`Solicitação de compra ${decision.toLowerCase()} com assinatura eletrônica!`);
      setTimeout(() => setSuccessToast(null), 4000);
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Erro ao processar compra.');
    }
  };

  const pendingInventories = inventories.filter((i) => !i.isLocked);
  const lockedInventories = inventories.filter((i) => i.isLocked);
  const pendingPurchases = purchases.filter((p) => p.status === 'PENDENTE_SUPERVISORA');
  const reviewedPurchases = purchases.filter((p) => p.status !== 'PENDENTE_SUPERVISORA');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast de Sucesso */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-slide-left">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* HEADER EXCLUSIVO DA SUPERVISORA */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-[#0a2e23] to-[#041711] p-6 sm:p-8 text-white border border-teal-700/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Acesso Nível 75 • Operação Administrativa
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                Matrícula Ativa: {currentUser.matricula || 'SUP-01'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
              Painel de Gestão da Supervisora
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/80 max-w-2xl leading-relaxed">
              Administração diária de colaboradores, escalas, checklists sanitários, conferência física de inventários e aprovação de compras com assinatura eletrônica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center">
              <p className="text-[10px] uppercase font-bold text-teal-200">Inventários Pendentes</p>
              <p className="text-2xl font-black text-amber-300">{pendingInventories.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-center">
              <p className="text-[10px] uppercase font-bold text-teal-200">Compras Pendentes</p>
              <p className="text-2xl font-black text-amber-300">{pendingPurchases.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* IA DA SUPERVISORA (CARDS PROATIVOS CONTEXTUAIS) */}
      <div className="bg-slate-900/90 rounded-3xl border border-teal-800/40 p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{aiProfile.title}</span>
                <span className="text-[10px] bg-teal-400/20 text-teal-300 px-2 py-0.5 rounded-full font-normal">
                  {aiProfile.badge}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">{aiProfile.subtitle}</p>
            </div>
          </div>
        </div>

        {aiProfile.alerts.length === 0 ? (
          <div className="py-4 px-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center text-xs text-slate-400">
            <Check className="w-5 h-5 mx-auto mb-1 text-teal-400" />
            <p className="font-semibold text-slate-300">Nenhum alerta pendente no momento</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Operação supervisionada em conformidade. O assistente reportará desvios operacionais em tempo real.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {aiProfile.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                  alert.type === 'CRITICAL'
                    ? 'bg-rose-950/40 border-rose-800/50 text-rose-100'
                    : alert.type === 'WARNING'
                    ? 'bg-amber-950/40 border-amber-800/50 text-amber-100'
                    : 'bg-teal-950/40 border-teal-800/50 text-teal-100'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold opacity-80">
                    <span>{alert.category}</span>
                    <span>{alert.timestamp}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white leading-snug">{alert.title}</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{alert.message}</p>
                </div>

                {alert.actionLabel && (
                  <button
                    onClick={() => alert.actionTab && onNavigateTab && onNavigateTab(alert.actionTab)}
                    className="mt-3 text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>{alert.actionLabel}</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEÇÃO 1: FLUXO DE COMPRAS (SUPERVISORA CONFERE & APROVA) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                1. Fluxo Oficial de Compras • Aprovação da Supervisora
              </h2>
              <p className="text-xs text-slate-500">
                Chefe/Bar solicita ➔ <strong>Supervisora confere necessidade e aprova com assinatura digital</strong> ➔ Gerente audita.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-xl self-start sm:self-auto">
            {pendingPurchases.length} Solicitações Pendentes
          </span>
        </div>

        {pendingPurchases.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <Check className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
            <p className="font-semibold">Nenhuma solicitação de compra pendente no momento.</p>
            <p className="text-[11px] mt-0.5">Todas as requisições da cozinha e bar foram conferidas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPurchases.map((req) => (
              <div
                key={req.id}
                className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                      {req.sector}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">Pedido #{req.id}</h3>
                    <p className="text-[11px] text-slate-500">
                      Solicitante: <strong>{req.requesterName}</strong> ({req.requesterRole})
                    </p>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                    R$ {req.totalEstimatedAmount.toFixed(2)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Itens Solicitados:</p>
                  {req.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700">
                      <span>• {it.itemName}</span>
                      <span className="font-bold">{it.requestedQuantity} {it.unit}</span>
                    </div>
                  ))}
                  {req.justification && (
                    <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                      Justificativa: "{req.justification}"
                    </p>
                  )}
                </div>

                {approvingPurchaseId === req.id ? (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <input
                      type="text"
                      placeholder="Observações da Supervisora..."
                      value={purchaseNotes}
                      onChange={(e) => setPurchaseNotes(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprovePurchase(req.id, 'APROVADO')}
                        className="flex-1 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Aprovar & Assinar</span>
                      </button>
                      <button
                        onClick={() => handleApprovePurchase(req.id, 'REJEITADO')}
                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer"
                      >
                        Rejeitar
                      </button>
                      <button
                        onClick={() => setApprovingPurchaseId(null)}
                        className="py-2 px-3 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setApprovingPurchaseId(req.id)}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Conferir & Assinar Aprovação</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEÇÃO 2: FLUXO DE INVENTÁRIO (SUPERVISORA CONFERE & BLOQUEIA) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                2. Fluxo Oficial de Inventário • Trava de Bloqueio da Supervisora
              </h2>
              <p className="text-xs text-slate-500">
                Chefe realiza contagem ➔ <strong>Supervisora confere presencialmente e assina (bloqueia o inventário)</strong> ➔ Gerente audita.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl self-start sm:self-auto">
            {pendingInventories.length} Aguardando Assinatura
          </span>
        </div>

        {pendingInventories.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <Check className="w-8 h-8 mx-auto mb-2 text-indigo-500 opacity-60" />
            <p className="font-semibold">Nenhum inventário pendente de conferência física.</p>
            <p className="text-[11px] mt-0.5">Todos os inventários contados já foram assinados e bloqueados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingInventories.map((inv) => (
              <div
                key={inv.id}
                className="border border-indigo-200 rounded-2xl p-5 bg-indigo-50/20 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-md">
                      Setor: {inv.sector}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">Inventário #{inv.id}</h3>
                    <p className="text-[11px] text-slate-500">
                      Contado por: <strong>{inv.countedBy.userName}</strong> ({inv.countedBy.userRole})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700">{inv.totalItemsCounted} Itens Contados</p>
                    <p className="text-[11px] text-rose-600 font-semibold">
                      {inv.itemsWithDivergenceCount} divergências encontradas
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2 text-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Amostra da Contagem:</p>
                  {inv.items.slice(0, 3).map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-700 border-b border-slate-100 pb-1">
                      <span>{it.itemName}</span>
                      <span className="font-mono text-[11px]">
                        Esperado: {it.systemExpectedQuantity} | Contado: <strong>{it.countedQuantity}</strong> {it.unit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Regra de Governança:</strong> Ao clicar no botão abaixo, você declara formalmente que esteve presente fisicamente na área e conferiu os itens. O inventário será <strong>bloqueado permanentemente contra edições</strong> e encaminhado à auditoria do Gerente.
                  </p>
                </div>

                <button
                  onClick={() => handleSignInventory(inv.id)}
                  className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <PenTool className="w-4 h-4 text-amber-300" />
                  <span>Assinar Digitalmente: "Inventário supervisionado e conferido"</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEÇÃO 3: HISTÓRICO DE DOCUMENTOS BLOQUEADOS & ASSINADOS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Documentos Supervisionados e Bloqueados ({lockedInventories.length})</span>
        </h2>

        {lockedInventories.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">Nenhum inventário assinado recentemente.</p>
        ) : (
          <div className="space-y-2">
            {lockedInventories.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{doc.id}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Bloqueado & Assinado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assinado por {doc.supervisorVerification?.supervisorName} (Matrícula: {doc.supervisorVerification?.matricula}) em {new Date(doc.supervisorVerification?.verifiedAt || '').toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-500">
                  Hash: {doc.supervisorVerification?.signature.signatureHash.slice(0, 16)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
