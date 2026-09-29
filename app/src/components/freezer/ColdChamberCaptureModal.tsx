// ============================================================
// MODAL: CAPTURA & ENVIO DE FOTO DO TERMÔMETRO DA CÂMARA FRIA
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import React, { useState } from 'react';
import {
  X,
  Camera,
  Upload,
  ThermometerSnowflake,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import type { ChamberShift } from '../../types/coldChamber.types';
import { addColdChamberReading, generateThermometerPhotoSvg } from '../../services/coldChamberStore';

interface ColdChamberCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserName: string;
}

export const ColdChamberCaptureModal: React.FC<ColdChamberCaptureModalProps> = ({
  isOpen,
  onClose,
  currentUserName,
}) => {
  const [temperature, setTemperature] = useState<string>('-19.4');
  const [shift, setShift] = useState<ChamberShift>('MANHA_ABERTURA');
  const [chamberName, setChamberName] = useState('Câmara Fria Principal (Congelados)');
  const [selectedOperator, setSelectedOperator] = useState('Mádio (Chefe de Cozinha)');
  const [notes, setNotes] = useState('');
  const [customPhotoBase64, setCustomPhotoBase64] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const tempNum = parseFloat(temperature) || -19.0;
  const isConformant = tempNum <= -18 && tempNum >= -22;

  // Lida com upload de arquivo de foto real do celular/câmera
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const role =
      selectedOperator.includes('Mádio')
        ? 'Chefe de Cozinha'
        : selectedOperator.includes('Esmael')
        ? 'Sub Chefe de Cozinha'
        : selectedOperator.includes('Patricia')
        ? 'Supervisora de Loja'
        : 'Gerente Geral / Em Treinamento';

    const loginId = selectedOperator.toLowerCase().replace(/[^a-z]/g, '') + '.engenho';

    addColdChamberReading({
      temperature: tempNum,
      shift,
      chamberName,
      photoUrl: customPhotoBase64 || undefined,
      notes: notes.trim() || undefined,
      takenBy: {
        userId: `user-${Date.now()}`,
        userName: selectedOperator,
        userRole: role,
        loginId,
      },
    });

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Nova Leitura da Câmara Fria por Foto
              </h3>
              <p className="text-xs text-slate-400">
                Envio da foto do display com registro de login, data e hora
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successToast && (
          <div className="p-3 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Foto enviada com sucesso! Aguardando vistos da supervisora e gerente.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Pré-visualização do Display / Foto */}
          <div className="rounded-xl overflow-hidden border border-slate-700 bg-black/60 shadow-inner flex flex-col items-center justify-center p-3">
            <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-400" />
              <span>Display do Termômetro Industrial (Foto Oficial)</span>
            </p>

            <img
              src={
                customPhotoBase64 ||
                generateThermometerPhotoSvg(
                  tempNum,
                  chamberName,
                  new Date().toLocaleDateString('pt-BR'),
                  new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                )
              }
              alt="Display do Termômetro"
              className="max-h-44 w-auto rounded-lg shadow-md border border-slate-800"
            />

            {/* Botão de Upload da Câmera do Smartphone / Arquivo */}
            <div className="mt-3 flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1.5 transition active:scale-95">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>{customPhotoBase64 ? 'Trocar Foto Real' : 'Carregar Foto da Câmera'}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {customPhotoBase64 && (
                <button
                  type="button"
                  onClick={() => setCustomPhotoBase64(null)}
                  className="px-2.5 py-1.5 rounded-lg bg-red-950/60 text-red-300 text-xs border border-red-800/60 hover:bg-red-900"
                >
                  Restaurar Display Digital
                </button>
              )}
            </div>
          </div>

          {/* Campos de Dados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Temperatura Lida no Display (°C) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-sm font-bold text-white focus:outline-none ${
                    isConformant ? 'border-emerald-500' : 'border-amber-500 text-amber-300'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">°C</span>
              </div>
              <span
                className={`text-[10px] mt-1 block font-medium ${
                  isConformant ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isConformant ? '✓ Faixa Conforme (-18°C a -22°C)' : '⚠️ Atenção: Fora da faixa padrão'}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Turno de Leitura *</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ChamberShift)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="MANHA_ABERTURA">Abertura (Manhã • 08h)</option>
                <option value="NOITE_FECHAMENTO">Fechamento (Noite • 23h)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Responsável pelo Envio da Foto *
              </label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Mádio (Chefe de Cozinha)">Mádio (Chefe de Cozinha)</option>
                <option value="Esmael (Sub Chefe de Cozinha)">Esmael (Sub Chefe)</option>
                <option value="Patricia (Supervisora)">Patricia (Supervisora de Loja)</option>
                <option value="Ivan (Gerente Geral)">Ivan (Gerente Geral)</option>
                <option value="Pabricio (Gerente em Treinamento)">Pabricio (Gerente em Treinamento)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Câmara Fria</label>
              <select
                value={chamberName}
                onChange={(e) => setChamberName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Câmara Fria Principal (Congelados)">Câmara Principal (Congelados)</option>
                <option value="Câmara de Resfriados (0°C a 4°C)">Câmara de Resfriados (0°C a 4°C)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Observações Operacionais (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Degelo automático operando, porta com vedação 100%..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/50 flex items-center gap-1.5 transition active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Salvar Foto e Registrar Leitura</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
