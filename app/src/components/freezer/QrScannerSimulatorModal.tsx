// ============================================================
// MODAL: LEITOR / SCANNER DE QR CODE DE RASTREAMENTO TÉRMICO
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// [EM FASE DE PROJETO & HOMOLOGAÇÃO PILOTO]
// ============================================================

import React, { useState } from 'react';
import { X, QrCode, Camera, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, ThermometerSnowflake, Flame, RefreshCw } from 'lucide-react';
import type { FreezerTrackedItem } from '../../types/freezerTraceability.types';
import { BATCH_COLORS_CONFIG } from '../../types/freezerTraceability.types';
import { processQrScan, QrTransitionResult } from '../../services/freezerTraceabilityStore';

interface QrScannerSimulatorModalProps {
  onClose: () => void;
  onScanSuccess: (result: QrTransitionResult) => void;
  activeItems: FreezerTrackedItem[];
}

export const QrScannerSimulatorModal: React.FC<QrScannerSimulatorModalProps> = ({
  onClose,
  onScanSuccess,
  activeItems,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [operatorName, setOperatorName] = useState('Mádio (Chefe Cozinha)');
  const [isScanningCamera, setIsScanningCamera] = useState(true);
  const [scanResult, setScanResult] = useState<QrTransitionResult | null>(null);

  const handleExecuteScan = (codeToScan: string) => {
    if (!codeToScan.trim()) return;

    const res = processQrScan(codeToScan.trim(), operatorName, isScanningCamera ? 'QR_CAMERA' : 'BIP_MANUAL');
    setScanResult(res);

    if (res.success) {
      setTimeout(() => {
        onScanSuccess(res);
      }, 1200);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteScan(manualCode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabeçalho */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500 text-slate-950">
              <Camera className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Leitor de QR Code de Rastreamento</h3>
              <p className="text-[11px] text-slate-400">Transição Térmica: Freezer ➔ Degelo ➔ Produção</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Seletor de Operador */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
            <span className="font-bold text-slate-700">Operador na Leitura:</span>
            <select
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="p-1.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white"
            >
              <option value="Mádio (Chefe Cozinha)">Mádio (Chefe de Cozinha)</option>
              <option value="Esmael (Sub Chefe)">Esmael (Sub Chefe Cozinha)</option>
              <option value="Ivan (Gerente)">Ivan (Gerente Geral)</option>
              <option value="Pabricio (Gerente Treinamento)">Pabricio (Gerente Treinamento)</option>
              <option value="Patricia (Supervisora)">Patricia (Supervisora de Loja)</option>
            </select>
          </div>

          {/* Mira Virtual da Câmera / Scanner com Animação a Laser */}
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-video flex flex-col items-center justify-center p-4 border-2 border-emerald-500/40 shadow-inner">
            {/* Linha de Varredura Laser */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-bounce top-1/3" />

            {/* Marcadores dos 4 Cantos do QR */}
            <div className="w-40 h-40 border-2 border-emerald-400/80 rounded-2xl relative flex items-center justify-center bg-emerald-950/20 backdrop-blur-[1px]">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400" />
              <QrCode className="w-12 h-12 text-emerald-400/50" />
            </div>

            <span className="text-[11px] text-emerald-300/80 font-medium mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Aponte a câmera para a etiqueta do restaurante ou selecione abaixo
            </span>
          </div>

          {/* Feedback de Resultado da Leitura */}
          {scanResult && (
            <div
              className={`p-3.5 rounded-2xl border-2 animate-fade-in ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {scanResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block text-sm">
                    {scanResult.success ? 'Leitura Concluída!' : 'Atenção na Leitura'}
                  </span>
                  <p className="text-xs mt-0.5">{scanResult.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bipagem Manual ou Leitor de Código de Barras USB */}
          <form onSubmit={handleManualSubmit} className="space-y-1.5 pt-1">
            <label className="block font-bold text-slate-700">
              Digitar Código ou Bipar Leitor USB:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ex: TK-FRZ-MNR-001 ou MNR-L01-TBQ"
                className="flex-1 p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#0a2e23] hover:bg-[#123e30] text-white font-bold transition-all active:scale-95 cursor-pointer"
              >
                Bipar
              </button>
            </div>
          </form>

          {/* Acesso Rápido: Bipar Itens Ativos (Freezer ou Degelo) */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 block">
              Simulador Rápido com 1-Clique nos Lotes Ativos:
            </span>
            <div className="space-y-2">
              {activeItems.filter(i => i.currentStage !== 'PRODUCAO').slice(0, 4).map((item) => {
                const colorCfg = BATCH_COLORS_CONFIG[item.batchColor];
                const isFreezer = item.currentStage === 'FREEZER';
                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: colorCfg.hex }}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          {item.itemName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.localBatchNumber} &bull; Estágio: <strong>{item.currentStage}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExecuteScan(item.qrCode)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer ${
                        isFreezer
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      {isFreezer ? (
                        <>
                          <ThermometerSnowflake className="w-3.5 h-3.5" />
                          <span>Mover p/ Degelo</span>
                        </>
                      ) : (
                        <>
                          <Flame className="w-3.5 h-3.5" />
                          <span>Mover p/ Produção</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Concluir / Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
