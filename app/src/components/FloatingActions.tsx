import React, { useState } from 'react';
import { Plus, X, Trash2, Sparkles, ThermometerSnowflake, QrCode } from 'lucide-react';

interface FloatingActionsProps {
  onOpen86: () => void;
  onOpenLoss: () => void;
  onOpenTempCheck: () => void;
  onOpenTraceability: () => void;
  onOpenCopilot: (prompt?: string) => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpen86,
  onOpenLoss,
  onOpenTempCheck,
  onOpenTraceability,
  onOpenCopilot,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 md:hidden">
      {/* Menu Aberto */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 mb-1 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => handleAction(() => onOpenCopilot('Preciso de socorro imediato no salão com uma mesa difícil.'))}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0f392b] text-white text-xs font-bold shadow-lg border border-emerald-600/40 hover:bg-[#164e3b] transition-all"
          >
            <span>Socorro Copilot IA</span>
            <span className="p-1.5 rounded-full bg-amber-500 text-slate-950">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => handleAction(onOpenTraceability)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-800 text-white text-xs font-bold shadow-lg border border-emerald-500/40 hover:bg-emerald-900 transition-all"
          >
            <span>Rastreabilidade & Inconsistências</span>
            <span className="p-1.5 rounded-full bg-emerald-700 text-amber-400">
              <QrCode className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => handleAction(onOpen86)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-amber-600 text-white text-xs font-bold shadow-lg border border-amber-400/40 hover:bg-amber-700 transition-all"
          >
            <span>Pausar Prato (Lista 86)</span>
            <span className="p-1.5 rounded-full bg-amber-700 text-white font-black text-[10px]">
              86
            </span>
          </button>

          <button
            onClick={() => handleAction(onOpenLoss)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-rose-600 text-white text-xs font-bold shadow-lg border border-rose-400/40 hover:bg-rose-700 transition-all"
          >
            <span>Registrar Quebra</span>
            <span className="p-1.5 rounded-full bg-rose-700 text-white">
              <Trash2 className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => handleAction(onOpenTempCheck)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-sky-700 text-white text-xs font-bold shadow-lg border border-sky-400/40 hover:bg-sky-800 transition-all"
          >
            <span>Aferir Câmaras Frias</span>
            <span className="p-1.5 rounded-full bg-sky-800 text-white">
              <ThermometerSnowflake className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      )}

      {/* Botão Principal Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-13 h-13 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200 focus:outline-none ${
          isOpen
            ? 'bg-slate-800 rotate-45 scale-95'
            : 'bg-gradient-to-tr from-[#d97706] to-[#f59e0b] hover:scale-105 active:scale-95 shadow-amber-600/30'
        }`}
        title="Ações Rápidas de Chão de Loja"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
