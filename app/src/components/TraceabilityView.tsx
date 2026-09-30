import React, { useState } from 'react';
import { QrCode, Camera, ArrowRight, ArrowLeft, AlertTriangle, CheckCircle2, FileText, Sparkles, Clock, ShieldAlert, ChevronRight, Plus, Lock, ThermometerSnowflake } from 'lucide-react';
import { TrackedBatch, TraceMovement, ClosingReconciliation } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';
import { FreezerTraceabilityView } from './freezer/FreezerTraceabilityView';

export const TraceabilityView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MOVIMENTACOES' | 'CONCILIACAO' | 'ENTRADA_NOTA' | 'FREEZER_CDA'>('CONCILIACAO');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraMode, setCameraMode] = useState<'NOTA_FISCAL' | 'DESCONGELAMENTO' | 'DEVOLUCAO'>('NOTA_FISCAL');

  const [fraudLogs, setFraudLogs] = useState<Array<{ id: string; time: string; item: string; chef: string; reason: string }>>([
    {
      id: 'fraud-01',
      time: '11:15',
      item: 'Costela de Tambaqui (5 porções)',
      chef: 'Sous-Chef Geovane Barroso',
      reason: 'A IA detectou linhas de varredura (efeito moiré) indicando fotografia tirada da tela de outro celular/monitor.',
    },
  ]);

  // Lotes rastreados ativos no freezer
  const [batches, setBatches] = useState<TrackedBatch[]>([
    {
      id: 'batch-01',
      batchNumber: 'LOTE-TBQ-20260911',
      cdaInvoiceNumber: 'NF-e 0049281-CDA',
      itemName: 'Costela de Tambaqui Nobre (Porção 400g)',
      initialQuantity: 20,
      currentInFreezer: 15,
      unit: 'porções',
      unitCost: 38.50,
      entryDate: 'Hoje às 08:30 (Reconhecido via Foto da Nota)',
      status: 'ATIVO',
    },
    {
      id: 'batch-02',
      batchNumber: 'LOTE-PIR-20260910',
      cdaInvoiceNumber: 'NF-e 0048992-CDA',
      itemName: 'Filé de Pirarucu Fresco em Lombo',
      initialQuantity: 30,
      currentInFreezer: 18,
      unit: 'kg',
      unitCost: 52.00,
      entryDate: '10/09/2026 às 09:10',
      status: 'ATIVO',
    },
  ]);

  // Histórico de movimentações térmicas
  const [movements, setMovements] = useState<TraceMovement[]>([
    {
      id: 'mov-1',
      batchId: 'batch-01',
      itemName: 'Costela de Tambaqui Nobre (Porção 400g)',
      type: 'RETIRADA_DESCONGELAMENTO',
      quantity: 5,
      unit: 'porções',
      chefName: 'Sous-Chef Geovane Barroso',
      timestamp: '11:15',
      photoCaptured: true,
      qrCodeBypassed: false,
    },
    {
      id: 'mov-2',
      batchId: 'batch-01',
      itemName: 'Costela de Tambaqui Nobre (Porção 400g)',
      type: 'DEVOLUCAO_FREEZER',
      quantity: 2,
      unit: 'porções',
      chefName: 'Sous-Chef Geovane Barroso',
      timestamp: '15:45 (Fim do Almoço)',
      photoCaptured: true,
      qrCodeBypassed: false,
    },
  ]);

  // Conciliação de fechamento calculada em tempo real
  const reconciliations: ClosingReconciliation[] = [
    {
      itemName: 'Costela de Tambaqui Nobre (Porção 400g)',
      withdrawnFromFreezer: 5,
      soldOnPdv: 1, // Vendeu apenas 1 no PDV
      returnedToFreezer: 2, // Voltaram 2 para o freezer
      registeredWaste: 0, // Nenhuma quebra lançada
      discrepancy: 5 - (1 + 2 + 0), // = 2 PORÇÕES SUMIDAS!
      unitCost: 38.50,
      financialImpact: 2 * 38.50,
      status: 'INCONSISTENCIA_GRAVE',
    },
    {
      itemName: 'Filé de Pirarucu Fresco em Lombo (Kg)',
      withdrawnFromFreezer: 12.0,
      soldOnPdv: 10.2,
      returnedToFreezer: 0,
      registeredWaste: 1.8, // 1.8kg registrado como perda na grelha
      discrepancy: 12.0 - (10.2 + 0 + 1.8), // = 0! 100% conciliado
      unitCost: 52.00,
      financialImpact: 0.00,
      status: 'CONFORME',
    },
  ];

  // Simulação de adicionar nova retirada com foto
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState('batch-01');
  const [withdrawQty, setWithdrawQty] = useState('3');
  const [withdrawChef, setWithdrawChef] = useState('Sous-Chef Geovane Barroso');
  const [justificationSent, setJustificationSent] = useState(false);
  const [matrixWarningLogged, setMatrixWarningLogged] = useState(false);

  const handleOpenReceiptCamera = () => {
    setCameraMode('NOTA_FISCAL');
    setShowCameraModal(true);
  };

  const handleOpenCycleCamera = () => {
    setCameraMode('DESCONGELAMENTO');
    setShowCameraModal(true);
  };

  const handleCaptureValidated = (data: {
    photoUrl: string;
    timestamp: string;
    aiValidated: boolean;
    fraudDetected: boolean;
    fraudReason?: string;
  }) => {
    if (data.fraudDetected) {
      const newFraud = {
        id: `fraud-${Date.now()}`,
        time: data.timestamp,
        item: cameraMode === 'NOTA_FISCAL' ? 'Nota Fiscal CDA (OCR)' : 'Costela de Tambaqui Nobre',
        chef: withdrawChef,
        reason: data.fraudReason || '🚨 Tentativa de burlar a câmera: IA detectou pixels de tela/moiré ao invés de produto físico.',
      };
      setFraudLogs((prev) => [newFraud, ...prev]);
      setActiveTab('CONCILIACAO'); // Leva para o fechamento para ver o alerta
    } else {
      if (cameraMode === 'NOTA_FISCAL') {
        const newBatch: TrackedBatch = {
          id: `batch-${Date.now()}`,
          batchNumber: `LOTE-CDA-${Date.now().toString().slice(-4)}`,
          cdaInvoiceNumber: 'NF-e 0049310-CDA',
          itemName: 'Lombo de Pirarucu Fresco (Peça 1kg)',
          initialQuantity: 15,
          currentInFreezer: 15,
          unit: 'kg',
          unitCost: 49.90,
          entryDate: `Hoje às ${data.timestamp} (Validado por IA OCR)`,
          status: 'ATIVO',
        };
        setBatches((prev) => [newBatch, ...prev]);
      } else {
        const batch = batches.find((b) => b.id === selectedBatchId) || batches[0];
        const newMov: TraceMovement = {
          id: `mov-${Date.now()}`,
          batchId: batch.id,
          itemName: batch.itemName,
          type: 'RETIRADA_DESCONGELAMENTO',
          quantity: Number(withdrawQty),
          unit: batch.unit,
          chefName: withdrawChef,
          timestamp: data.timestamp,
          photoCaptured: true,
          qrCodeBypassed: false,
        };
        setMovements((prev) => [newMov, ...prev]);
        setBatches((prev) =>
          prev.map((b) =>
            b.id === batch.id
              ? { ...b, currentInFreezer: Math.max(0, b.currentInFreezer - Number(withdrawQty)) }
              : b
          )
        );
      }
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setShowWithdrawModal(false);
    handleOpenCycleCamera();
  };

  return (
    <div className="space-y-4">
      {/* Topo do Módulo de Rastreabilidade */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-slate-900">Rastreabilidade Total & Ciclo Térmico</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoramento por foto de Nota Fiscal, QR Code de retirada/devolução e auditoria de fechamento com PDV.
          </p>
        </div>

        {/* Sub-abas */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('CONCILIACAO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'CONCILIACAO' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Auditoria Fechamento
          </button>
          <button
            onClick={() => setActiveTab('MOVIMENTACOES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'MOVIMENTACOES' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Ciclo Térmico (Freezer/Pista)
          </button>
          <button
            onClick={() => setActiveTab('ENTRADA_NOTA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ENTRADA_NOTA' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            + Entrada Nota (IA OCR)
          </button>
          <button
            onClick={() => setActiveTab('FREEZER_CDA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'FREEZER_CDA' ? 'bg-[#0a2e23] text-amber-300 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-500" />
            <span>Rastreio Freezer CDA [PROJETO]</span>
          </button>
        </div>
      </div>

      {activeTab === 'FREEZER_CDA' && <FreezerTraceabilityView />}

      {activeTab === 'CONCILIACAO' && (
        <div className="space-y-4">
          {/* Alerta de Inconsistência Gravíssima Identificada */}
          <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5 animate-pulse">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-rose-950">
                    🚨 INCONSISTÊNCIA DETECTADA NO FECHAMENTO DIÁRIO
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                    Desvio Físico
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-rose-900/90 mt-1 leading-relaxed">
                  <strong>Insumo:</strong> Costela de Tambaqui Nobre &bull; <strong>Faltam 2 porções!</strong>
                  <br />
                  Saíram do freezer <strong>5 costelas</strong> às 11:15 (retiradas pelo Sous-Chef Geovane). O sistema PDV registrou a venda de apenas <strong>1 prato</strong>, e retornaram ao freezer apenas <strong>2 costelas</strong> no encerramento.
                  <br />
                  <span className="text-rose-700 font-bold block mt-1">
                    ⚖️ Conta não bate: 5 retiradas - (1 vendida + 2 devolvidas + 0 quebras) = Faltam 2 porções (Prejuízo: R$ 77,00).
                  </span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-rose-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-rose-800 font-semibold">
                Origem: Lote LOTE-TBQ-20260911 (NF-e 0049281-CDA)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setJustificationSent(true);
                    try {
                      const existing = JSON.parse(localStorage.getItem('kitchen_justification_requests') || '[]');
                      existing.unshift({
                        id: `req-${Date.now()}`,
                        item: 'Costela de Tambaqui Nobre',
                        discrepancy: '2 porções (R$ 77,00)',
                        requestedAt: new Date().toLocaleTimeString('pt-BR'),
                        target: 'Sous-Chef Geovane e Chef Sebastião',
                        status: 'AGUARDANDO_RESPOSTA'
                      });
                      localStorage.setItem('kitchen_justification_requests', JSON.stringify(existing));
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer ${
                    justificationSent
                      ? 'bg-emerald-700 text-white'
                      : 'bg-rose-700 hover:bg-rose-800 text-white'
                  }`}
                >
                  {justificationSent ? '✓ Notificação Enviada à Cozinha' : 'Cobrar Justificativa da Cozinha'}
                </button>
                <button
                  onClick={() => {
                    setMatrixWarningLogged(true);
                    try {
                      const warnings = JSON.parse(localStorage.getItem('matrix_audit_warnings') || '[]');
                      warnings.unshift({
                        id: `warn-${Date.now()}`,
                        item: 'Costela de Tambaqui Nobre',
                        impact: 77.00,
                        loggedAt: new Date().toISOString(),
                        reportedBy: 'Ivan / Pabricio (Gerência)',
                        type: 'DIVERGENCIA_CAMARA_PDV'
                      });
                      localStorage.setItem('matrix_audit_warnings', JSON.stringify(warnings));
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    matrixWarningLogged
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                      : 'bg-white border border-rose-300 text-rose-900 hover:bg-rose-50'
                  }`}
                >
                  {matrixWarningLogged ? '✓ Registrado no Relatório Matriz' : 'Registrar em Relatório da Matriz'}
                </button>
              </div>
            </div>
          </div>

          {/* Alerta Específico de Fraude Visual Detectada pela IA */}
          {fraudLogs.length > 0 && (
            <div className="bg-amber-950/10 border border-amber-500/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                    Relatório de Auditoria IA Anti-Fraude (Câmera Blindada)
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-950">
                  {fraudLogs.length} Ocorrência(s)
                </span>
              </div>

              <div className="divide-y divide-amber-200/60">
                {fraudLogs.map((log) => (
                  <div key={log.id} className="py-2 text-xs text-amber-950/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900">{log.item}</span> &bull; Horário: {log.time} &bull; Colaborador: <strong>{log.chef}</strong>
                      <p className="text-[11px] text-amber-900 mt-0.5">{log.reason}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-rose-600 text-white whitespace-nowrap self-start sm:self-auto">
                      Tentativa Bloqueada
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabela de Conciliação de Todos os Itens Controlados */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Conciliação Diária: Movimentações Físicas vs. PDV</h3>
                <p className="text-xs text-slate-500">Auditoria automatizada por Visão Computacional e Vendas Fiscais</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Auditoria Ativa
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Item Controlado</th>
                    <th className="py-3 px-3 text-center">Saiu do Freezer</th>
                    <th className="py-3 px-3 text-center">Vendido no PDV</th>
                    <th className="py-3 px-3 text-center">Voltou ao Freezer</th>
                    <th className="py-3 px-3 text-center">Perda Lançada</th>
                    <th className="py-3 px-3 text-center">Inconsistência (Δ)</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reconciliations.map((rec, idx) => {
                    const hasError = rec.status === 'INCONSISTENCIA_GRAVE';
                    return (
                      <tr key={idx} className={hasError ? 'bg-rose-50/40' : 'hover:bg-slate-50'}>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {rec.itemName}
                        </td>
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-800">
                          {rec.withdrawnFromFreezer}
                        </td>
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-800">
                          {rec.soldOnPdv}
                        </td>
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-800">
                          {rec.returnedToFreezer}
                        </td>
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-800">
                          {rec.registeredWaste}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {hasError ? (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-black">
                              Faltam {rec.discrepancy} un (- R$ {rec.financialImpact.toFixed(2)})
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold">0 (Perfeito)</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {hasError ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-700">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              Divergente
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              100% Conciliado
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MOVIMENTACOES' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Movimentações de Ciclo Térmico</h3>
              <p className="text-xs text-slate-500">Histórico de porções retiradas para descongelamento e devolvidas ao freezer</p>
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Bipar Retirada / Devolução</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {movements.map((mov) => {
              const isWithdraw = mov.type === 'RETIRADA_DESCONGELAMENTO';
              return (
                <div key={mov.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl ${
                        isWithdraw ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                      }`}
                    >
                      {isWithdraw ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{mov.itemName}</span>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${
                            isWithdraw ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                          }`}
                        >
                          {isWithdraw ? 'Retirado p/ Geladeira (+2°C)' : 'Devolvido ao Freezer (-18°C)'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Colaborador: <strong>{mov.chefName}</strong> &bull; Horário: {mov.timestamp} &bull; Foto do Lote Confirmada 📸
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">
                      {isWithdraw ? `-${mov.quantity}` : `+${mov.quantity}`} {mov.unit}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">QR Code Validado</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'ENTRADA_NOTA' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Entrada Automatizada de Insumos por Foto da Nota</h3>
            <p className="text-xs text-slate-500">
              Aponte a câmera para a Nota Fiscal do CDA. A IA lerá os lotes, pesos e adicionará ao Estoque Virtual do Freezer.
            </p>
          </div>

          <div className="p-8 border-2 border-dashed border-emerald-300 bg-emerald-50/30 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-lg">
              <Camera className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">Tirar Foto da Nota Fiscal / Guia CDA</span>
              <span className="text-xs text-slate-500">Suporta NF-e impressa, manifesto de carga e Danfe</span>
            </div>
            <button
              onClick={handleOpenReceiptCamera}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Abrir Câmera Blindada (IA OCR da Nota Fiscal)</span>
            </button>
          </div>

          {/* Lotes Ativos Cadastrados no Freezer */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Lotes Ativos no Freezer (-18°C)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {batches.map((batch) => (
                <div key={batch.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{batch.itemName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {batch.batchNumber}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                    <div>Saldo no Freezer: <strong className="text-slate-900">{batch.currentInFreezer} {batch.unit}</strong></div>
                    <div>Entrada: {batch.initialQuantity} {batch.unit} &bull; {batch.cdaInvoiceNumber}</div>
                    <div className="text-[10px] text-slate-400">{batch.entryDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Retirada/Devolução */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">Bipar Retirada p/ Descongelamento</h3>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-3 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Lote / Insumo no Freezer</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.itemName} (Saldo: {b.currentInFreezer} {b.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Quantidade Retirada</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={withdrawQty}
                  onChange={(e) => setWithdrawQty(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Colaborador da Cozinha</label>
                <input
                  type="text"
                  value={withdrawChef}
                  onChange={(e) => setWithdrawChef(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-800" />
                <span>A foto do lote e QR Code serão carimbados automaticamente com data e hora.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white shadow-md"
                >
                  Confirmar & Iniciar Rastreamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Câmera Anti-Fraude com Bloqueio de Galeria */}
      {showCameraModal && (
        <CameraCaptureModal
          title={cameraMode === 'NOTA_FISCAL' ? 'Leitura Anti-Fraude de Nota Fiscal CDA' : 'Registro de Descongelamento'}
          subtitle={
            cameraMode === 'NOTA_FISCAL'
              ? 'Tire a foto física da Nota Fiscal impressa. Arquivos da galeria estão bloqueados pelo sistema.'
              : 'Tire a foto das porções retiradas do freezer na bancada de inox. Galeria bloqueada.'
          }
          expectedItemName={cameraMode === 'NOTA_FISCAL' ? 'Danfe / NF-e do CDA' : batches.find(b => b.id === selectedBatchId)?.itemName}
          onCaptureValidated={handleCaptureValidated}
          onClose={() => setShowCameraModal(false)}
        />
      )}
    </div>
  );
};
