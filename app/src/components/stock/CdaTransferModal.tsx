import React, { useState } from 'react';
import { X, Plus, Package, Calendar, User, ArrowDownLeft, Trash2, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import type { StockUnit } from '../../types/stock.types';
import { recordCdaMaterialTransfer } from '../../services/virtualStockStore';

interface CdaTransferModalProps {
  onClose: () => void;
  onSuccess: (count: number) => void;
  currentUserName?: string;
}

const COMMON_CDA_SUGGESTIONS = [
  { name: 'Costela de Tambaqui Nobre', unit: 'kg' as StockUnit, defaultQty: 25, defaultCost: 44.0 },
  { name: 'Lombo de Tambaqui com Osso', unit: 'kg' as StockUnit, defaultQty: 20, defaultCost: 52.0 },
  { name: 'Filé de Pirarucu Fresco sem Pele', unit: 'kg' as StockUnit, defaultQty: 18, defaultCost: 38.0 },
  { name: 'Camarão Rosa GG Regional', unit: 'kg' as StockUnit, defaultQty: 12, defaultCost: 85.0 },
  { name: 'Picanha Nobre Bife de Tira', unit: 'kg' as StockUnit, defaultQty: 15, defaultCost: 78.0 },
  { name: 'Filé Mignon Resfriado', unit: 'kg' as StockUnit, defaultQty: 14, defaultCost: 102.0 },
  { name: 'Tucupi Pasteurizado (Galão)', unit: 'L' as StockUnit, defaultQty: 20, defaultCost: 18.0 },
  { name: 'Farinha do Uarini Ovinha', unit: 'kg' as StockUnit, defaultQty: 30, defaultCost: 25.0 },
  { name: 'Manteiga de Garrafa Artesanal', unit: 'L' as StockUnit, defaultQty: 10, defaultCost: 48.0 },
];

export const CdaTransferModal: React.FC<CdaTransferModalProps> = ({
  onClose,
  onSuccess,
  currentUserName,
}) => {
  const [transferNumber, setTransferNumber] = useState(
    () => `TRANSF-CDA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [receivedBy, setReceivedBy] = useState(currentUserName || 'Ivan (Gerente)');
  const [transporter, setTransporter] = useState('Logística Própria CDA');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{ name: string; qty: number; unit: StockUnit; unitCost: number }>>([
    { name: 'Costela de Tambaqui Nobre', qty: 25, unit: 'kg', unitCost: 44.0 },
    { name: 'Filé de Pirarucu Fresco sem Pele', qty: 18, unit: 'kg', unitCost: 38.0 },
    { name: 'Tucupi Pasteurizado (Galão)', qty: 20, unit: 'L', unitCost: 18.0 },
  ]);

  const [newItemName, setNewItemName] = useState(COMMON_CDA_SUGGESTIONS[0].name);
  const [newItemQty, setNewItemQty] = useState(10);
  const [newItemUnit, setNewItemUnit] = useState<StockUnit>('kg');
  const [newItemCost, setNewItemCost] = useState(40);

  const handleAddItem = () => {
    if (!newItemName.trim() || newItemQty <= 0) return;
    setItems((prev) => [
      ...prev,
      {
        name: newItemName.trim(),
        qty: Number(newItemQty),
        unit: newItemUnit,
        unitCost: Number(newItemCost),
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectSuggestion = (s: typeof COMMON_CDA_SUGGESTIONS[0]) => {
    setNewItemName(s.name);
    setNewItemUnit(s.unit);
    setNewItemQty(s.defaultQty);
    setNewItemCost(s.defaultCost);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const res = recordCdaMaterialTransfer({
      transferNumber,
      items,
      receivedBy,
      driverOrTransporter: transporter,
      notes,
    });

    onSuccess(res.processedCount);
    onClose();
  };

  const totalValue = items.reduce((acc, it) => acc + it.qty * it.unitCost, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl text-white flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Nota de Transferência de Material CDA
              </h3>
              <p className="text-[11px] text-slate-400">
                Entrada de insumos transferidos do Centro de Distribuição (CDA Matriz) para o Engenho
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Nº da Nota de Transferência:</label>
              <input
                type="text"
                value={transferNumber}
                onChange={(e) => setTransferNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Recebido Por:</label>
              <input
                type="text"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Transporte / Motorista:</label>
              <input
                type="text"
                value={transporter}
                onChange={(e) => setTransporter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Adicionar Insumo */}
          <div className="bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              Adicionar Insumo da Transferência:
            </span>

            {/* Sugestões Rápidas */}
            <div className="flex flex-wrap gap-1.5">
              {COMMON_CDA_SUGGESTIONS.slice(0, 5).map((s) => (
                <button
                  type="button"
                  key={s.name}
                  onClick={() => handleSelectSuggestion(s)}
                  className="text-[10px] px-2 py-1 rounded-lg bg-slate-700/60 hover:bg-blue-600/40 text-slate-300 hover:text-white border border-slate-600 transition-colors"
                >
                  + {s.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Nome do Insumo"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  placeholder="Qtd"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(Number(e.target.value))}
                  className="w-20 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
                <select
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value as StockUnit)}
                  className="w-20 px-1 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="un">un</option>
                  <option value="cx">cx</option>
                </select>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Itens Prontos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Itens da Nota de Transferência ({items.length}):</span>
              <span className="text-emerald-400">Total: R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-800/90 border border-slate-700/80 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="font-semibold text-white">{it.name}</span>
                    <span className="text-slate-400">({it.qty} {it.unit})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300 font-mono">
                      R$ {(it.qty * it.unitCost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <button type="button" onClick={() => handleRemoveItem(idx)} className="text-slate-500 hover:text-rose-400 p-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Observações da Carga:</label>
            <input
              type="text"
              placeholder="Ex: Carga conferida em temperatura adequada, lacres íntegros."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          {/* Rodapé do Modal */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Gera entrada auditada no Estoque Virtual</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={items.length === 0}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <ArrowDownLeft className="w-4 h-4" />
                Confirmar Entrada no Estoque
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
