import React, { useState } from 'react';
import { LayoutGrid, QrCode, CheckSquare, ThermometerSnowflake, Camera, Timer } from 'lucide-react';
import { FloorPlanView } from './FloorPlanView';
import { TraceabilityView } from './TraceabilityView';
import { ChecklistsView } from './ChecklistsView';
import { FreezerTraceabilityView } from './freezer/FreezerTraceabilityView';
import { ColdChamberDashboardView } from './freezer/ColdChamberDashboardView';
import { WaitingQueueView } from './queue/WaitingQueueView';
import { ChecklistItem } from '../types';

interface OperacaoHubViewProps {
  checklists: ChecklistItem[];
  initialSubView?: 'MESAS' | 'FILA_ESPERA' | 'CAMARA_FRIA' | 'FREEZER_CDA' | 'RASTREIO' | 'CHECKS';
  onToggleCheck: (id: string) => void;
  onOpenCopilot: (prompt?: string) => void;
}

export const OperacaoHubView: React.FC<OperacaoHubViewProps> = ({
  checklists,
  initialSubView = 'MESAS',
  onToggleCheck,
  onOpenCopilot,
}) => {
  const [subView, setSubView] = useState<'MESAS' | 'FILA_ESPERA' | 'CAMARA_FRIA' | 'FREEZER_CDA' | 'RASTREIO' | 'CHECKS'>(initialSubView);

  React.useEffect(() => {
    if (initialSubView) {
      setSubView(initialSubView);
    }
  }, [initialSubView]);

  return (
    <div className="space-y-4">
      {/* Seletor Segmentado de Operação */}
      <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center max-w-4xl mx-auto overflow-x-auto gap-1">
        <button
          onClick={() => setSubView('FILA_ESPERA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'FILA_ESPERA'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Timer className="w-3.5 h-3.5 text-slate-950" />
          <span>Fila da Porta (2min)</span>
        </button>

        <button
          onClick={() => setSubView('MESAS')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'MESAS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-slate-700" />
          <span>Salão & Mesas (Toast 86)</span>
        </button>

        <button
          onClick={() => setSubView('CAMARA_FRIA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'CAMARA_FRIA'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-blue-600" />
          <span>Câmara Fria & Fotos</span>
        </button>

        <button
          onClick={() => setSubView('FREEZER_CDA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'FREEZER_CDA'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-600" />
          <span>Lotes & Freezers</span>
        </button>

        <button
          onClick={() => setSubView('RASTREIO')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'RASTREIO'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <QrCode className="w-3.5 h-3.5 text-slate-700" />
          <span>Rastreio & Câmera</span>
        </button>

        <button
          onClick={() => setSubView('CHECKS')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'CHECKS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Checklists ANVISA</span>
        </button>
      </div>

      {subView === 'FILA_ESPERA' && <WaitingQueueView />}
      {subView === 'CAMARA_FRIA' && <ColdChamberDashboardView />}
      {subView === 'MESAS' && <FloorPlanView onOpenCopilot={onOpenCopilot} />}
      {subView === 'FREEZER_CDA' && <FreezerTraceabilityView />}
      {subView === 'RASTREIO' && <TraceabilityView />}
      {subView === 'CHECKS' && (
        <ChecklistsView checklists={checklists} onToggleCheck={onToggleCheck} />
      )}
    </div>
  );
};
