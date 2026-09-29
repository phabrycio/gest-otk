import React, { useState } from 'react';
import { Package, Truck, UtensilsCrossed, Cpu, Beer } from 'lucide-react';
import { InventoryView } from './InventoryView';
import { CdaHubView } from './CdaHubView';
import { TechnicalRecipesView } from './TechnicalRecipesView';
import VirtualStockView from './VirtualStockView';
import ChoppBarView from './bar/ChoppBarView';
import { WeeklySalesPredictionView } from './WeeklySalesPredictionView';
import { InventoryItem, StockLoss, CdaRequisition, CorporateTicket } from '../types';

interface SuprimentosHubViewProps {
  inventory: InventoryItem[];
  losses: StockLoss[];
  requisition: CdaRequisition;
  tickets: CorporateTicket[];
  initialSubView?: 'VIRTUAL' | 'PEDIDO_MAXIMO_CDA' | 'CHOPP_BAR' | 'ESTOQUE' | 'CDA' | 'FICHAS';
  onAddLoss: (loss: Omit<StockLoss, 'id' | 'time'>) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onOpenCopilot: (prompt?: string) => void;
}

export const SuprimentosHubView: React.FC<SuprimentosHubViewProps> = ({
  inventory,
  losses,
  requisition,
  tickets,
  initialSubView = 'VIRTUAL',
  onAddLoss,
  onUpdateStock,
  onOpenCopilot,
}) => {
  const [subView, setSubView] = useState<'VIRTUAL' | 'PEDIDO_MAXIMO_CDA' | 'CHOPP_BAR' | 'ESTOQUE' | 'CDA' | 'FICHAS'>(initialSubView);

  React.useEffect(() => {
    if (initialSubView) {
      setSubView(initialSubView);
    }
  }, [initialSubView]);

  return (
    <div className="space-y-4">
      {/* Seletor Segmentado de Suprimentos & Bar */}
      <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center max-w-3xl mx-auto overflow-x-auto gap-1">
        <button
          onClick={() => setSubView('VIRTUAL')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            subView === 'VIRTUAL'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-slate-700" />
          <span>Estoque Teórico</span>
        </button>

        <button
          onClick={() => setSubView('PEDIDO_MAXIMO_CDA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            subView === 'PEDIDO_MAXIMO_CDA'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
          title="Regra: Pedido ao CDA = Estoque Máximo (-) Estoque Atual"
        >
          <Package className="w-3.5 h-3.5 text-indigo-600" />
          <span>Pedido Máximo CDA (12 Sem.)</span>
        </button>

        <button
          onClick={() => setSubView('CHOPP_BAR')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            subView === 'CHOPP_BAR'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Beer className="w-3.5 h-3.5 text-amber-600" />
          <span>Bar & Chopeiras</span>
        </button>

        <button
          onClick={() => setSubView('ESTOQUE')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            subView === 'ESTOQUE'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-slate-700" />
          <span>Estoque Curva A & Perdas</span>
        </button>

        <button
          onClick={() => setSubView('CDA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            subView === 'CDA'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-slate-700" />
          <span>Hub CDA & Doca</span>
        </button>

        <button
          onClick={() => setSubView('FICHAS')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            subView === 'FICHAS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-slate-700" />
          <span>Fichas Técnicas & Cardápio</span>
        </button>
      </div>

      {subView === 'VIRTUAL' && (
        <VirtualStockView />
      )}

      {subView === 'PEDIDO_MAXIMO_CDA' && (
        <WeeklySalesPredictionView onOpenCopilot={onOpenCopilot} />
      )}

      {subView === 'CHOPP_BAR' && (
        <ChoppBarView />
      )}

      {subView === 'ESTOQUE' && (
        <InventoryView
          inventory={inventory}
          losses={losses}
          onAddLoss={onAddLoss}
          onUpdateStock={onUpdateStock}
          onOpenCopilot={onOpenCopilot}
        />
      )}

      {subView === 'CDA' && (
        <CdaHubView
          requisition={requisition}
          tickets={tickets}
          onOpenCopilot={onOpenCopilot}
        />
      )}

      {subView === 'FICHAS' && (
        <TechnicalRecipesView
          onOpenCopilot={onOpenCopilot}
        />
      )}
    </div>
  );
};
