import React, { useState, useMemo } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowDownRight, 
  RefreshCw,
  ArrowRightLeft,
  Layers,
  ShieldCheck,
  Sparkles,
  Lock,
} from 'lucide-react';
import { InventoryItem, StockLoss } from '../types';
import { PepsFifoModal } from './PepsFifoModal';
import { getSession } from '../services/restaurantStore';
import { getPermissions } from '../services/permissions';

interface InventoryViewProps {
  inventory: InventoryItem[];
  losses: StockLoss[];
  onAddLoss: (loss: Omit<StockLoss, 'id' | 'time'>) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onOpenCopilot?: (prompt?: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  losses,
  onAddLoss,
  onUpdateStock,
  onOpenCopilot,
}) => {
  const session = useMemo(() => getSession(), []);
  const canViewFullStock = useMemo(() => {
    if (!session) return true;
    return getPermissions(session.user.role).canViewFullStock;
  }, [session]);
  const [showLossModal, setShowLossModal] = useState(false);
  const [showPepsModal, setShowPepsModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || '');
  const [lossQty, setLossQty] = useState('');
  const [lossReason, setLossReason] = useState<StockLoss['reason']>('ERRO_PONTO_PREPARO');
  const [lossNotes, setLossNotes] = useState('');

  const selectedItem = inventory.find((i) => i.id === selectedItemId);
  const calculatedLossValue = selectedItem && lossQty ? Number(lossQty) * selectedItem.unitCost : 0;

  const totalLossValueToday = losses.reduce((acc, curr) => acc + curr.totalValue, 0);

  const handleSaveLoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !lossQty || Number(lossQty) <= 0) return;

    onAddLoss({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      quantity: Number(lossQty),
      unit: selectedItem.unit,
      unitCost: selectedItem.unitCost,
      totalValue: calculatedLossValue,
      reason: lossReason,
      notes: lossNotes || 'Descarte registrado pelo gerente no salão/cozinha',
    });

    // Diminui o estoque do item
    onUpdateStock(selectedItem.id, Math.max(0, selectedItem.currentStock - Number(lossQty)));

    // Reset do modal
    setLossQty('');
    setLossNotes('');
    setShowLossModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Topo do Módulo de Estoque */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0a2e23]" />
            <h2 className="text-base font-bold text-slate-900 font-serif">Auditoria de Estoque & Curva A</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Controle de alto valor financeiro da unidade Shopping Ponta Negra (Carnes, Pescados e Bebidas Nobres).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Botão de Destaque PEPS / FIFO */}
          <button
            onClick={() => setShowPepsModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0a2e23] hover:bg-[#123e30] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Fila PEPS / FIFO por Lote</span>
          </button>

          <button
            onClick={() => setShowLossModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Registrar Quebra</span>
          </button>
        </div>
      </div>

      {/* Banner Informativo de Conformidade PEPS */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-amber-50/40 border border-emerald-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
            <ArrowRightLeft className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-emerald-950 font-bold">Regra Operacional PEPS / FIFO Ativa:</strong>
              <span className="px-1.5 py-0.2 rounded-sm bg-emerald-200/80 text-emerald-900 text-[10px] font-bold">
                100% de Conformidade Sanitária
              </span>
            </div>
            <p className="text-emerald-800/80 text-[11px] mt-0.5">
              O primeiro lote que dá entrada é rigorosamente o primeiro que sai para preparo. Novos lotes são posicionados atrás nas câmaras frias.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPepsModal(true)}
          className="text-xs font-bold text-emerald-900 hover:text-[#0a2e23] underline self-end sm:self-auto cursor-pointer whitespace-nowrap"
        >
          Auditar Fila dos Lotes &rarr;
        </button>
      </div>

      {/* Resumo de Desperdício do Dia */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Total de Perdas Registradas Hoje</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-rose-600">
              R$ {totalLossValueToday.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400">({losses.length} lançamentos)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Itens em Alerta de Ruptura</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-amber-600">
              {inventory.filter((i) => i.status === 'CRITICAL').length} produtos
            </span>
            <span className="text-[10px] text-amber-700">Abaixo do estoque seguro</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">CMV Teórico Projetado</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-emerald-700">29.4%</span>
            <span className="text-[10px] text-emerald-600">Dentro da meta (28% - 32%)</span>
          </div>
        </div>
      </div>

      {/* Tabela de Itens Curva A */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Itens Críticos de Chão de Loja (Curva A)</h3>
          <span className="text-xs text-slate-400 font-mono">Atualizado há 15 min</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Código / Produto</th>
                <th className="py-3 px-3">Categoria</th>
                <th className="py-3 px-3">Estoque Físico</th>
                <th className="py-3 px-3">Fila PEPS (FIFO)</th>
                <th className="py-3 px-3">Estoque Mínimo</th>
                <th className="py-3 px-3">Custo Unitário</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => {
                const isCritical = item.status === 'CRITICAL';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{item.cdaCode}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {canViewFullStock ? (
                        `${item.currentStock.toFixed(1)} ${item.unit}`
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Lock className="w-3 h-3 text-amber-600" /> Oculto (Contagem Cega)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setShowPepsModal(true)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                        title="Clique para ver a fila de lotes PEPS"
                      >
                        <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
                        <span>Lote 1 (Frente)</span>
                      </button>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {item.minStock.toFixed(1)} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      R$ {item.unitCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Ruptura Iminente
                        </span>
                      ) : item.status === 'WARNING' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Atenção
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Seguro
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onUpdateStock(item.id, Math.max(0, item.currentStock - 1))}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-xs"
                          title="Diminuir 1 unidade"
                        >
                          -
                        </button>
                        <button
                          onClick={() => onUpdateStock(item.id, item.currentStock + 1)}
                          className="w-6 h-6 rounded bg-emerald-50 hover:bg-emerald-100 font-bold text-emerald-800 flex items-center justify-center text-xs"
                          title="Adicionar 1 unidade"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico Recente de Perdas Registradas */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Descartes e Quebras de Hoje</h3>
        {losses.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">Nenhuma quebra registrada hoje na loja.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {losses.map((loss) => (
              <div key={loss.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span>{loss.itemName}</span>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      {loss.reason.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{loss.notes}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-rose-600 block">
                    - R$ {loss.totalValue.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {loss.quantity} {loss.unit} &bull; {loss.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Registro de Perda */}
      {showLossModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Registrar Perda / Quebra</h3>
              </div>
              <button
                onClick={() => setShowLossModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLoss} className="space-y-3 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Insumo / Produto</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (R$ {item.unitCost.toFixed(2)}/{item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Quantidade ({selectedItem?.unit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 1.5"
                    value={lossQty}
                    onChange={(e) => setLossQty(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Custo Total</label>
                  <div className="text-xs p-2.5 rounded-xl bg-slate-100 font-bold text-rose-600 border border-slate-200">
                    R$ {calculatedLossValue.toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Motivo do Descarte</label>
                <select
                  value={lossReason}
                  onChange={(e) => setLossReason(e.target.value as StockLoss['reason'])}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="ERRO_PONTO_PREPARO">Erro de Ponto / Queimou no Preparo</option>
                  <option value="VALIDADE_VENCIDA">Validade Vencida / Degradação</option>
                  <option value="ERRO_PEDIDO_SALAO">Erro de Anotação do Garçom</option>
                  <option value="QUEBRA_FISICA">Quebra Física (Queda / Garrafa)</option>
                  <option value="AVARIA_RECEBIMENTO">Avaria no Recebimento da Doca</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Observações / Mesa Envolvida</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Prato refeito com urgência para mesa 12..."
                  value={lossNotes}
                  onChange={(e) => setLossNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLossModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md cursor-pointer"
                >
                  Confirmar Baixa de Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Gestão da Fila PEPS / FIFO */}
      <PepsFifoModal
        isOpen={showPepsModal}
        onClose={() => setShowPepsModal(false)}
        onOpenCopilot={onOpenCopilot}
      />
    </div>
  );
};
