// ============================================================
// COMPONENTE PRINCIPAL: RASTREAMENTO DE ITENS DO FREEZER (CDA)
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// [EM FASE DE PROJETO & HOMOLOGAÇÃO PILOTO]
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  ThermometerSnowflake,
  QrCode,
  Plus,
  Printer,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Flame,
  Package,
  Layers,
  Sparkles,
  Info,
  Calendar,
  User,
  ShieldCheck,
  RefreshCw,
  Search,
} from 'lucide-react';
import type {
  FreezerTrackedItem,
  FreezerMovementLog,
  BatchColor,
  FreezerStage,
} from '../../types/freezerTraceability.types';
import { BATCH_COLORS_CONFIG } from '../../types/freezerTraceability.types';
import {
  getFreezerItems,
  getFreezerLogs,
  processQrScan,
  resetFreezerStore,
  QrTransitionResult,
} from '../../services/freezerTraceabilityStore';
import { logSystemAction } from '../../services/auditLogStore';
import { FreezerLabelPrintModal } from './FreezerLabelPrintModal';
import { NewCdaEntryModal } from './NewCdaEntryModal';
import { QrScannerSimulatorModal } from './QrScannerSimulatorModal';
import { QrCodeRenderer } from './QrCodeRenderer';

export const FreezerTraceabilityView: React.FC = () => {
  const [items, setItems] = useState<FreezerTrackedItem[]>([]);
  const [logs, setLogs] = useState<FreezerMovementLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColor, setFilterColor] = useState<BatchColor | 'TODOS'>('TODOS');
  const [subTab, setSubTab] = useState<'FLUXO_KANBAN' | 'LOTES_TABELA' | 'LOGS_HISTORICO'>('FLUXO_KANBAN');

  // Modais
  const [selectedLabelItem, setSelectedLabelItem] = useState<FreezerTrackedItem | null>(null);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setItems(getFreezerItems());
    setLogs(getFreezerLogs());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleScanSuccess = (res: QrTransitionResult) => {
    refreshData();
    logSystemAction({
      userId: 'freezer_operator',
      userName: 'Operador de Cozinha',
      userRole: 'Cozinha & Bar',
      module: 'FREEZER',
      action: 'Leitura QR de Lote CDA',
      details: res.message,
      severity: res.success ? 'SUCESSO' : 'AVISO',
      metadata: { targetStage: res.item?.currentStage, itemId: res.item?.id }
    });
    showToast(res.message);
  };

  const handleEntrySuccess = (newItem: FreezerTrackedItem) => {
    setShowNewEntryModal(false);
    refreshData();
    logSystemAction({
      userId: 'cda_receiver',
      userName: newItem.operatorReceived || 'Ivan (Gerente)',
      userRole: 'Gerência / Cozinha',
      module: 'FREEZER',
      action: 'Recebimento de Lote CDA',
      details: `Entrada de ${newItem.initialQuantity} ${newItem.unit} do item "${newItem.itemName}" - Lote ${newItem.localBatchNumber} (${newItem.batchColor}).`,
      severity: 'INFO',
      metadata: { itemId: newItem.id, batchColor: newItem.batchColor, cdaBatch: newItem.cdaBatchNumber, validade: newItem.cdaExpiryDate }
    });
    showToast(`✅ Insumo "${newItem.itemName}" recebido no Freezer com Etiqueta ${newItem.batchColor}!`);
    // Abre a etiqueta para impressão imediata
    setSelectedLabelItem(newItem);
  };

  const handleDirectTransition = (item: FreezerTrackedItem) => {
    const operator = 'Ivan (Gerente)';
    const res = processQrScan(item.qrCode, operator, 'QR_SIMULADOR');
    refreshData();
    logSystemAction({
      userId: 'user-ivan',
      userName: 'Ivan',
      userRole: 'Gerente Geral',
      module: 'FREEZER',
      action: 'Avanço de Estágio do Lote',
      details: res.message,
      severity: res.success ? 'INFO' : 'AVISO',
      metadata: { itemName: item.itemName, qrCode: item.qrCode }
    });
    showToast(res.message);
  };

  const handleResetData = () => {
    if (confirm('Deseja restaurar os dados de demonstração do projeto?')) {
      resetFreezerStore();
      refreshData();
      showToast('Dados do projeto restaurados para o padrão.');
    }
  };

  // Filtros
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.localBatchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cdaBatchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = filterColor === 'TODOS' || item.batchColor === filterColor;
    return matchesSearch && matchesColor;
  });

  // Contagens dos estágios
  const freezerItems = filteredItems.filter((i) => i.currentStage === 'FREEZER');
  const degeloItems = filteredItems.filter((i) => i.currentStage === 'DEGELO');
  const producaoItems = filteredItems.filter((i) => i.currentStage === 'PRODUCAO');

  return (
    <div className="space-y-4 animate-fade-in text-slate-900">
      {/* Toast Notificação */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-[#0a2e23] text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-2.5 animate-bounce text-xs font-semibold max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* BANNER INSTITUCIONAL: EM FASE DE PROJETO */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-emerald-500/10 border-2 border-amber-400/80 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black shrink-0 shadow-sm">
              <ThermometerSnowflake className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-amber-950 font-black text-[10px] uppercase tracking-wider">
                  Em Fase de Projeto & Homologação Piloto
                </span>
                <span className="text-[11px] font-bold text-slate-500">Unidade Manauara</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                Rastreamento de Itens do Freezer (CDA ➔ Degelo ➔ Produção)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScannerModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0a2e23] hover:bg-[#123e30] text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Bipar QR Code</span>
            </button>

            <button
              onClick={() => setShowNewEntryModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Receber do CDA</span>
            </button>
          </div>
        </div>

        {/* Diretriz Operacional das 3 Cores e 2 Bipagens */}
        <p className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-amber-200/80">
          <strong>Como funciona o protocolo:</strong> Todo insumo vindo do CDA recebe uma <strong>etiqueta local</strong> com data de recebimento, validade CDA e <strong>uma cor por lote</strong> — limitado ao <strong>máximo de 3 lotes no inventário</strong> (Azul ➔ Verde ➔ Âmbar). Ao bipar o QR Code pela 1ª vez, o item é transferido para a <strong>Área de Degelo</strong>. Ao bipar novamente na saída do degelo, o item é marcado como <strong>Entregue à Produção na Cozinha</strong>.
        </p>
      </div>

      {/* CARDS DE CORES DOS 3 LOTES (REGRA OPERACIONAL) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(['AZUL', 'VERDE', 'AMBAR'] as BatchColor[]).map((cCode) => {
          const cfg = BATCH_COLORS_CONFIG[cCode];
          const countInColor = items.filter((i) => i.batchColor === cCode && i.currentStage !== 'PRODUCAO').length;
          return (
            <div
              key={cCode}
              className={`p-3.5 rounded-2xl border-2 transition-all ${cfg.bgLightClass} ${cfg.borderClass}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full shadow-xs"
                    style={{ backgroundColor: cfg.hex }}
                  />
                  <span className="font-black text-xs text-slate-900">{cfg.name}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  {countInColor} ativo(s)
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-700 mt-1">{cfg.priorityLabel}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{cfg.description}</p>
            </div>
          );
        })}
      </div>

      {/* METRICAS KPI RESUMIDAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">No Freezer</span>
            <span className="text-xl font-black text-blue-700 font-mono">
              {items.filter((i) => i.currentStage === 'FREEZER').length}
            </span>
            <span className="text-[10px] text-slate-400 block">Congelados CDA</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ThermometerSnowflake className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Em Degelo Ativo</span>
            <span className="text-xl font-black text-amber-700 font-mono">
              {items.filter((i) => i.currentStage === 'DEGELO').length}
            </span>
            <span className="text-[10px] text-slate-400 block">0°C a 4°C Seguro</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Em Produção Hoje</span>
            <span className="text-xl font-black text-emerald-700 font-mono">
              {items.filter((i) => i.currentStage === 'PRODUCAO').length}
            </span>
            <span className="text-[10px] text-slate-400 block">Cocção / Boqueta</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Lotes Ativos</span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {new Set(items.filter((i) => i.currentStage !== 'PRODUCAO').map((i) => i.localBatchNumber)).size} / 3
            </span>
            <span className="text-[10px] text-slate-400 block">Capacidade PVPS</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* BARRA DE NAVEGAÇÃO INTERNA & FILTROS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setSubTab('FLUXO_KANBAN')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'FLUXO_KANBAN'
                ? 'bg-[#0a2e23] text-amber-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Fluxo Térmico (Kanban)
          </button>
          <button
            onClick={() => setSubTab('LOTES_TABELA')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'LOTES_TABELA'
                ? 'bg-[#0a2e23] text-amber-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Tabela de Lotes & Validades
          </button>
          <button
            onClick={() => setSubTab('LOGS_HISTORICO')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'LOGS_HISTORICO'
                ? 'bg-[#0a2e23] text-amber-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Auditoria & Movimentações ({logs.length})
          </button>
        </div>

        {/* Busca e Filtro de Cor */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar insumo ou lote..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <select
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value as any)}
            className="p-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="TODOS">Todas Cores</option>
            <option value="AZUL">Lote 01 (Azul)</option>
            <option value="VERDE">Lote 02 (Verde)</option>
            <option value="AMBAR">Lote 03 (Âmbar)</option>
          </select>

          <button
            onClick={handleResetData}
            title="Restaurar dados piloto"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ABA 1: FLUXO TÉRMICO EM KANBAN (FREEZER ➔ DEGELO ➔ PRODUÇÃO) */}
      {subTab === 'FLUXO_KANBAN' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* COLUNA 1: NO FREEZER */}
          <div className="bg-slate-100/90 rounded-3xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                  <ThermometerSnowflake className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">1. No Freezer (Congelados)</h3>
                  <span className="text-[10px] text-slate-500">Entrada CDA • &lt;= -18°C</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-white text-slate-700 shadow-2xs">
                {freezerItems.length}
              </span>
            </div>

            <div className="space-y-3">
              {freezerItems.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-white/60 rounded-2xl border border-dashed border-slate-300">
                  Nenhum item aguardando no freezer com os filtros atuais.
                </div>
              ) : (
                freezerItems.map((item) => (
                  <ItemKanbanCard
                    key={item.id}
                    item={item}
                    onOpenLabel={() => setSelectedLabelItem(item)}
                    onAdvance={() => handleDirectTransition(item)}
                    advanceLabel="Bipar QR ➔ Degelo"
                    advanceIcon={<Clock className="w-3.5 h-3.5" />}
                  />
                ))
              )}
            </div>
          </div>

          {/* COLUNA 2: ÁREA DE DEGELO */}
          <div className="bg-slate-100/90 rounded-3xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <Clock className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">2. Área de Degelo Controlado</h3>
                  <span className="text-[10px] text-slate-500">Descongelamento seguro • 0°C a 4°C</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-white text-slate-700 shadow-2xs">
                {degeloItems.length}
              </span>
            </div>

            <div className="space-y-3">
              {degeloItems.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-white/60 rounded-2xl border border-dashed border-slate-300">
                  Nenhum item em área de degelo no momento.
                </div>
              ) : (
                degeloItems.map((item) => (
                  <ItemKanbanCard
                    key={item.id}
                    item={item}
                    onOpenLabel={() => setSelectedLabelItem(item)}
                    onAdvance={() => handleDirectTransition(item)}
                    advanceLabel="Bipar QR ➔ Produção"
                    advanceIcon={<Flame className="w-3.5 h-3.5" />}
                  />
                ))
              )}
            </div>
          </div>

          {/* COLUNA 3: PRODUÇÃO NA COZINHA */}
          <div className="bg-slate-100/90 rounded-3xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <Flame className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">3. Em Produção na Cozinha</h3>
                  <span className="text-[10px] text-slate-500">Grelha, Fogão & Boqueta</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-white text-slate-700 shadow-2xs">
                {producaoItems.length}
              </span>
            </div>

            <div className="space-y-3">
              {producaoItems.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-white/60 rounded-2xl border border-dashed border-slate-300">
                  Nenhum lote enviado para produção com os filtros atuais.
                </div>
              ) : (
                producaoItems.map((item) => (
                  <ItemKanbanCard
                    key={item.id}
                    item={item}
                    onOpenLabel={() => setSelectedLabelItem(item)}
                    isCompleted
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: TABELA DE LOTES & VALIDADES */}
      {subTab === 'LOTES_TABELA' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Cor / Lote Local</th>
                  <th className="p-3">Insumo</th>
                  <th className="p-3">Lote CDA</th>
                  <th className="p-3">Recebido na Loja</th>
                  <th className="p-3">Validade CDA</th>
                  <th className="p-3">Qtd</th>
                  <th className="p-3">Estágio Atual</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const colorCfg = BATCH_COLORS_CONFIG[item.batchColor];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0"
                            style={{ backgroundColor: colorCfg.hex }}
                          />
                          <div>
                            <span className="font-bold text-slate-900 block font-mono">
                              {item.localBatchNumber}
                            </span>
                            <span className="text-[10px] text-slate-400">{colorCfg.colorName}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-semibold text-slate-800">
                        {item.itemName}
                        <span className="text-[10px] text-slate-400 block font-normal">{item.category}</span>
                      </td>

                      <td className="p-3 font-mono text-slate-600">{item.cdaBatchNumber}</td>

                      <td className="p-3 text-slate-600 whitespace-nowrap">{item.receptionDate}</td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded font-black text-rose-700 bg-rose-50 border border-rose-200 font-mono">
                          {item.cdaExpiryDate}
                        </span>
                      </td>

                      <td className="p-3 font-bold text-slate-800 whitespace-nowrap">
                        {item.currentQuantity} {item.unit}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                            item.currentStage === 'FREEZER'
                              ? 'bg-blue-100 text-blue-800'
                              : item.currentStage === 'DEGELO'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.currentStage === 'FREEZER'
                            ? '❄️ No Freezer'
                            : item.currentStage === 'DEGELO'
                            ? '🧊 Em Degelo'
                            : '🍳 Em Produção'}
                        </span>
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLabelItem(item)}
                          className="px-2.5 py-1 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600" />
                          <span>Etiqueta</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: LOGS & AUDITORIA DE MOVIMENTAÇÕES TÉRMICAS */}
      {subTab === 'LOGS_HISTORICO' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Histórico de Bipagens & Rastreabilidade Térmica</h3>
              <p className="text-xs text-slate-500">Registro indelével de cada leitura de QR Code, operador e timestamp.</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{logs.length} eventos registrados</span>
          </div>

          <div className="space-y-2">
            {logs.map((log) => {
              const colorCfg = BATCH_COLORS_CONFIG[log.batchColor];
              return (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start sm:items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 mt-1 sm:mt-0"
                      style={{ backgroundColor: colorCfg.hex }}
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">{log.itemName}</span>
                        <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border">
                          {log.localBatchNumber}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600">
                          {log.fromStage} ➔ {log.toStage}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{log.notes}</span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <span className="font-bold text-slate-800 block">{log.timestamp}</span>
                    <span className="text-[10px] text-slate-400 block">Resp: {log.operator}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAIS */}
      {selectedLabelItem && (
        <FreezerLabelPrintModal
          item={selectedLabelItem}
          onClose={() => setSelectedLabelItem(null)}
        />
      )}

      {showNewEntryModal && (
        <NewCdaEntryModal
          onClose={() => setShowNewEntryModal(false)}
          onSuccess={handleEntrySuccess}
        />
      )}

      {showScannerModal && (
        <QrScannerSimulatorModal
          onClose={() => setShowScannerModal(false)}
          onScanSuccess={handleScanSuccess}
          activeItems={items}
        />
      )}
    </div>
  );
};

// ============================================================
// SUB-COMPONENTE: CARD DO KANBAN COM PREVIEW DE ETIQUETA
// ============================================================
interface ItemKanbanCardProps {
  item: FreezerTrackedItem;
  onOpenLabel: () => void;
  onAdvance?: () => void;
  advanceLabel?: string;
  advanceIcon?: React.ReactNode;
  isCompleted?: boolean;
}

const ItemKanbanCard: React.FC<ItemKanbanCardProps> = ({
  item,
  onOpenLabel,
  onAdvance,
  advanceLabel,
  advanceIcon,
  isCompleted,
}) => {
  const colorCfg = BATCH_COLORS_CONFIG[item.batchColor];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm space-y-3 hover:shadow-md transition-all">
      {/* Topo do Card com Cor do Lote */}
      <div className="flex items-center justify-between">
        <span
          className="px-2.5 py-1 rounded-lg text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
          style={{ backgroundColor: colorCfg.hex }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          {colorCfg.name}
        </span>
        <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {item.localBatchNumber}
        </span>
      </div>

      {/* Insumo & Quantidade */}
      <div>
        <h4 className="font-black text-xs text-slate-900 leading-tight">
          {item.itemName}
        </h4>
        <span className="text-[11px] font-bold text-slate-500">
          {item.currentQuantity} {item.unit} &bull; Lote CDA: {item.cdaBatchNumber}
        </span>
      </div>

      {/* Miniatura do QR Code & Datas */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px]">
        <div className="space-y-0.5">
          <div>
            <span className="text-slate-400 block">Recebido na Loja:</span>
            <span className="font-semibold text-slate-800">{item.receptionDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Validade CDA:</span>
            <span className="font-bold text-rose-700">{item.cdaExpiryDate}</span>
          </div>
          {item.enteredDegeloAt && (
            <div>
              <span className="text-slate-400 block">Entrada Degelo:</span>
              <span className="font-bold text-amber-700">{item.enteredDegeloAt}</span>
            </div>
          )}
          {item.enteredProducaoAt && (
            <div>
              <span className="text-slate-400 block">Entrada Produção:</span>
              <span className="font-bold text-emerald-700">{item.enteredProducaoAt}</span>
            </div>
          )}
        </div>

        {/* QR Code Clicável */}
        <button
          onClick={onOpenLabel}
          title="Clique para ver / imprimir etiqueta completa"
          className="flex flex-col items-center p-1 rounded-lg bg-white border border-slate-200 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
        >
          <QrCodeRenderer value={item.qrCode} size={50} />
          <span className="text-[8px] font-bold text-slate-500 mt-0.5">Ver Etiqueta</span>
        </button>
      </div>

      {/* Ações do Card */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <button
          onClick={onOpenLabel}
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
        >
          <Printer className="w-3 h-3 text-slate-500" />
          <span>Etiqueta</span>
        </button>

        {!isCompleted && onAdvance && (
          <button
            onClick={onAdvance}
            className="flex-1 px-3 py-1.5 rounded-xl bg-[#0a2e23] hover:bg-[#123e30] text-amber-300 hover:text-amber-200 text-[11px] font-black flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            {advanceIcon}
            <span>{advanceLabel}</span>
          </button>
        )}

        {isCompleted && (
          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-black text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Na Produção</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default FreezerTraceabilityView;
