import React, { useState } from 'react';
import { Package, Truck, UtensilsCrossed, Cpu } from 'lucide-react';
import { InventoryView } from './InventoryView';
import { CdaHubView } from './CdaHubView';
import { TechnicalRecipesView } from './TechnicalRecipesView';
import VirtualStockView from './VirtualStockView';
import { WeeklySalesPredictionView } from './WeeklySalesPredictionView';
import { InventoryItem, StockLoss, CdaRequisition, CorporateTicket } from '../types';

interface SuprimentosHubViewProps {
  inventory: InventoryItem[];
  losses: StockLoss[];
  requisition: CdaRequisition;
  tickets: CorporateTicket[];
  initialSubView?: 'CDA' | 'ESTOQUE' | 'VIRTUAL' | 'PEDIDO_MAXIMO_CDA' | 'FICHAS';
  onAddLoss: (loss: Omit<StockLoss, 'id' | 'time'>) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onOpenCopilot: (prompt?: string) => void;
}

export const SuprimentosHubView: React.FC<SuprimentosHubViewProps> = ({
  inventory,
  losses,
  requisition,
  tickets,
  initialSubView = 'CDA',
  onAddLoss,
  onUpdateStock,
  onOpenCopilot,
}) => {
  const [subView, setSubView] = useState<'CDA' | 'ESTOQUE' | 'VIRTUAL' | 'PEDIDO_MAXIMO_CDA' | 'FICHAS'>(initialSubView);

  React.useEffect(() => {
    if (initialSubView) {
      setSubView(initialSubView);
    }
  }, [initialSubView]);

  return (
    <div className="space-y-4">
      {/* Seletor Segmentado Limpo, Focado e Totalmente Responsivo */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-start sm:justify-center overflow-x-auto gap-1.5 scrollbar-none">
        <button
          onClick={() => setSubView('CDA')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            subView === 'CDA'
              ? 'bg-[#0a2e23] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          aria-label="Hub CDA & Doca"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Hub CDA & Doca</span>
        </button>

        <button
          onClick={() => setSubView('ESTOQUE')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            subView === 'ESTOQUE'
              ? 'bg-[#0a2e23] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          aria-label="Estoque Curva A & Perdas"
        >
          <Package className="w-3.5 h-3.5" />
          <span>Estoque Curva A & Perdas</span>
        </button>

        <button
          onClick={() => setSubView('FICHAS')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            subView === 'FICHAS'
              ? 'bg-[#0a2e23] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          aria-label="Fichas Técnicas & Cardápio"
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Fichas Técnicas & Cardápio</span>
        </button>

        <button
          onClick={() => setSubView('VIRTUAL')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            subView === 'VIRTUAL'
              ? 'bg-[#0a2e23] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          aria-label="Estoque Teórico"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Estoque Teórico</span>
        </button>

        <button
          onClick={() => setSubView('PEDIDO_MAXIMO_CDA')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            subView === 'PEDIDO_MAXIMO_CDA'
              ? 'bg-[#0a2e23] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          aria-label="Pedido Máximo CDA (12 Sem.)"
        >
          <Package className="w-3.5 h-3.5" />
          <span>Pedido Máximo (12 Sem.)</span>
        </button>
      </div>

      {/* Conteúdo Dinâmico Limpo */}
      {subView === 'CDA' && (
        <CdaHubView
          requisition={requisition}
          tickets={tickets}
          onOpenCopilot={onOpenCopilot}
        />
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

      {subView === 'FICHAS' && (
        <TechnicalRecipesView
          onOpenCopilot={onOpenCopilot}
        />
      )}

      {subView === 'VIRTUAL' && (
        <VirtualStockView />
      )}

      {subView === 'PEDIDO_MAXIMO_CDA' && (
        <WeeklySalesPredictionView onOpenCopilot={onOpenCopilot} />
      )}
    </div>
  );
};
