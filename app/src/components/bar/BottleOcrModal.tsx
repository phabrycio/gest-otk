import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Wine,
  RefreshCw,
  X,
  Info,
  Layers,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { extractBottleLevelOcr } from '../../services/geminiOcr';
import { SpiritBottle } from '../../types/barIntelligence.types';

interface BottleOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBottles: SpiritBottle[];
  onApplyScanResults: (updatedBottles: SpiritBottle[]) => void;
}

export default function BottleOcrModal({
  isOpen,
  onClose,
  currentBottles,
  onApplyScanResults,
}: BottleOcrModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanResultBottles, setScanResultBottles] = useState<SpiritBottle[]>(currentBottles);
  const [scanNotes, setScanNotes] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      await processImageWithOcr(base64);
    };
    reader.readAsDataURL(file);
  };

  const processImageWithOcr = async (base64: string) => {
    setIsScanning(true);
    try {
      const res = await extractBottleLevelOcr(base64);
      setScanNotes(res.rawAnalysisNotes || 'Medição dos meniscos processada com sucesso.');

      // Cruza com as garrafas existentes do bar
      const updated = currentBottles.map((existing) => {
        const detected = res.detectedBottles.find(
          (d) => d.bottleName.toLowerCase().includes(existing.name.toLowerCase().split(' ')[0].toLowerCase()) ||
                 existing.name.toLowerCase().includes(d.bottleName.toLowerCase().split(' ')[0].toLowerCase())
        );

        if (detected) {
          const fillPct = detected.fillLevelPct;
          const remainingMl = Number((existing.bottleVolumeMl * (fillPct / 100)).toFixed(1));
          const remainingDoses = Number((remainingMl / existing.standardDoseMl).toFixed(2));
          const consumedDoses = Number(((existing.bottleVolumeMl - remainingMl) / existing.standardDoseMl).toFixed(2));
          
          // Calcula consumo real total = doses da garrafa aberta + doses de garrafas fechadas consumidas
          const totalConsumedMl = Number((consumedDoses * existing.standardDoseMl + (existing.dosesSoldTeknisa > 15 ? 750 : 0)).toFixed(1));
          const realDoses = Number((totalConsumedMl / existing.standardDoseMl).toFixed(2));
          const deviationDoses = Number(Math.max(0, realDoses - existing.dosesSoldTeknisa).toFixed(2));
          const averageDose = existing.dosesSoldTeknisa > 0
            ? Number((totalConsumedMl / existing.dosesSoldTeknisa).toFixed(1))
            : 50.0;

          let deviationType: SpiritBottle['deviationType'] = 'NORMAL';
          if (existing.dosesSoldTeknisa === 0 && deviationDoses > 1.0) {
            deviationType = 'SAIDA_SEM_COMANDA';
          } else if (averageDose > 55.0) {
            deviationType = 'DOSE_A_OLHO';
          } else if (deviationDoses > 2.5) {
            deviationType = 'SAIDA_SEM_COMANDA';
          }

          const calculatedRisk: 'BAIXO' | 'MEDIO' | 'ALTO' =
            deviationDoses > 4.0 || averageDose > 62.0 ? 'ALTO' : deviationDoses > 1.5 ? 'MEDIO' : 'BAIXO';

          return {
            ...existing,
            openBottleFillPct: fillPct,
            openBottleRemainingMl: remainingMl,
            openBottleRemainingDoses: remainingDoses,
            openBottleConsumedDoses: consumedDoses,
            totalMlConsumedReal: totalConsumedMl,
            deviationDoses,
            deviationReais: Number((deviationDoses * 30.0).toFixed(2)),
            deviationType,
            averageDoseServedMl: averageDose,
            photoOcrVerified: true,
            riskLevel: calculatedRisk,
          };
        }
        return existing;
      });

      setScanResultBottles(updated);
    } catch (err) {
      console.error('Erro no OCR de garrafas:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Ajuste manual de nível rápido
  const handleSetFillPct = (bottleId: string, pct: number) => {
    setScanResultBottles((prev) =>
      prev.map((b) => {
        if (b.id !== bottleId) return b;
        const remainingMl = Number((b.bottleVolumeMl * (pct / 100)).toFixed(1));
        const remainingDoses = Number((remainingMl / b.standardDoseMl).toFixed(2));
        const consumedDoses = Number(((b.bottleVolumeMl - remainingMl) / b.standardDoseMl).toFixed(2));
        const totalConsumedMl = Number((consumedDoses * b.standardDoseMl + (b.dosesSoldTeknisa > 15 ? 750 : 0)).toFixed(1));
        const realDoses = Number((totalConsumedMl / b.standardDoseMl).toFixed(2));
        const deviationDoses = Number(Math.max(0, realDoses - b.dosesSoldTeknisa).toFixed(2));
        const averageDose = b.dosesSoldTeknisa > 0 ? Number((totalConsumedMl / b.dosesSoldTeknisa).toFixed(1)) : 50;

        let deviationType: SpiritBottle['deviationType'] = 'NORMAL';
        if (b.dosesSoldTeknisa === 0 && deviationDoses > 1.0) {
          deviationType = 'SAIDA_SEM_COMANDA';
        } else if (averageDose > 55.0) {
          deviationType = 'DOSE_A_OLHO';
        } else if (deviationDoses > 2.5) {
          deviationType = 'SAIDA_SEM_COMANDA';
        }

        const calculatedRisk: 'BAIXO' | 'MEDIO' | 'ALTO' =
          deviationDoses > 4.0 || averageDose > 62.0 ? 'ALTO' : deviationDoses > 1.5 ? 'MEDIO' : 'BAIXO';

        return {
          ...b,
          openBottleFillPct: pct,
          openBottleRemainingMl: remainingMl,
          openBottleRemainingDoses: remainingDoses,
          openBottleConsumedDoses: consumedDoses,
          totalMlConsumedReal: totalConsumedMl,
          deviationDoses,
          deviationReais: Number((deviationDoses * 30.0).toFixed(2)),
          deviationType,
          averageDoseServedMl: averageDose,
          photoOcrVerified: true,
          riskLevel: calculatedRisk,
        };
      })
    );
  };

  const handleConfirmAndApply = () => {
    onApplyScanResults(scanResultBottles);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-8 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Camera className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Auditoria de Garrafas Abertas com OCR Gemini Vision
              </h3>
              <p className="text-[11px] text-slate-500">
                Tire foto das garrafas na estação do barman. A IA calcula a mediana de volume (100%, 75%, 50%, 25%, 10%) e cruza com o Teknisa.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload / Captura de Foto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50 hover:bg-emerald-50/40 group"
          >
            <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-700 transition-colors mb-2" />
            <span className="text-xs font-bold text-slate-800">
              Tirar Foto ou Subir Imagem do Bar
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              JPG, PNG ou HEIC da prateleira de destilados
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Como Funciona a Medição:
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                • <strong>Garrafas Fechadas:</strong> Contadas pelo estoque virtual do sistema.<br />
                • <strong>Garrafas Abertas:</strong> A IA avalia a altura do líquido (100%, 75%, 50%, 25%, 10%) e converte para doses padrão (50ml).<br />
                • <strong>Cruzamento Teknisa:</strong> Detecta se a média por drink passou de 50ml (dose a olho) ou se saíram doses sem comanda.
              </p>
            </div>

            <button
              type="button"
              onClick={() => processImageWithOcr('mock-bottle-image')}
              className="py-1.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Simular Análise de Foto da Estação</span>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {isScanning && (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-emerald-700 animate-spin mx-auto" />
            <p className="text-xs font-bold text-emerald-900">
              Processando Níveis de Menisco com Gemini 1.5 Flash Vision...
            </p>
            <p className="text-[10px] text-emerald-700">
              Identificando marcas de destilados, percentual de líquido e convertendo para doses de 50ml.
            </p>
          </div>
        )}

        {/* Lista de Garrafas Detectadas e Auditadas */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Garrafas Auditadas na Estação:</span>
            <span className="text-[10px] text-slate-500 font-normal">
              Dose Padrão da Casa: 50ml
            </span>
          </div>

          {scanResultBottles.map((b) => (
            <div
              key={b.id}
              className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-900">{b.name}</div>
                  <div className="text-[10px] text-slate-500">
                    Capacidade: {b.bottleVolumeMl}ml • {b.sealedStockBottles} fechada(s) no estoque • {b.dosesSoldTeknisa} drinks no Teknisa
                  </div>
                </div>

                <div className="text-right">
                  {b.deviationType === 'DOSE_A_OLHO' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Dose a Olho ({b.averageDoseServedMl}ml/drink)
                    </span>
                  )}
                  {b.deviationType === 'SAIDA_SEM_COMANDA' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-rose-600" />
                      Saída Sem Comanda ({b.deviationDoses} doses)
                    </span>
                  )}
                  {b.deviationType === 'NORMAL' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Dose Precisa (50ml)
                    </span>
                  )}
                </div>
              </div>

              {/* Seletor de Nível da Garrafa Aberta (100%, 75%, 50%, 25%, 10%) */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Nível da Garrafa Aberta:</span>
                  <span className="font-bold text-slate-900">
                    {b.openBottleFillPct}% ({b.openBottleRemainingMl}ml restantes • {b.openBottleRemainingDoses} doses)
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {[100, 75, 50, 25, 10].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSetFillPct(b.id, pct)}
                      className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        b.openBottleFillPct === pct
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>Consumo desta garrafa: {b.openBottleConsumedDoses} doses</span>
                  <span className={b.deviationReais > 0 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {b.deviationReais > 0 ? `Desvio: -R$ ${b.deviationReais.toFixed(2)}` : 'Conforme'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer com Ações */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="text-[11px] text-slate-500">
            {scanNotes && <span>{scanNotes}</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmAndApply}
              className="px-4 py-1.5 rounded-xl bg-[#0a2e23] hover:bg-[#124b3a] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Aplicar Auditoria no Bar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
