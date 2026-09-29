import { useState } from 'react';
import { X, ShoppingCart, CheckCircle, Send, AlertTriangle, Sparkles, Copy, FileText, ChevronRight } from 'lucide-react';
import type { ForecastedOrder } from '../../types/stock.types';

interface StockOrderModalProps {
  order: ForecastedOrder;
  onClose: () => void;
  onSendOrder?: (order: ForecastedOrder) => void;
}

export default function StockOrderModal({ order, onClose, onSendOrder }: StockOrderModalProps) {
  const [items, setItems] = useState(order.items);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(order.status === 'ENVIADO_CDA');

  const totalValue = items.reduce((acc, it) => acc + it.totalCost, 0);

  const updateQty = (itemId: string, newQty: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.itemId !== itemId) return it;
        return {
          ...it,
          suggestedOrderQty: newQty,
          totalCost: newQty * it.unitCost,
        };
      })
    );
  };

  const handleCopyText = () => {
    const lines = [
      `*PEDIDO DE REPOSIÇÃO - TK GESTÃO & TECNOLOGIA*`,
      `Data: ${new Date().toLocaleDateString('pt-BR')}`,
      `Total Estimado: R$ ${totalValue.toFixed(2)}`,
      `---------------------------------`,
      ...items.map(
        (it) =>
          `• ${it.itemName}: *${it.suggestedOrderQty} ${it.unit}* (R$ ${it.totalCost.toFixed(2)})`
      ),
      `---------------------------------`,
      `Gerado por IA com base em consumo e estoque mínimo.`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSent(true);
    if (onSendOrder) {
      onSendOrder({
        ...order,
        items,
        totalValue,
        status: 'ENVIADO_CDA',
        sentAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-black text-sm">Sugestão de Pedido de Compra</h3>
              <p className="text-[10px] text-emerald-200/90">Previsão de ruptura via IA · CDA & Fornecedores</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Card de Resumo do Pedido */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">
                Valor Total do Pedido
              </span>
              <span className="text-xl font-black text-emerald-900">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                {items.length} itens essenciais com risco de ruptura
              </span>
            </div>
            <div className="text-right space-y-1">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-600" /> Previsão 7 Dias
              </span>
              <p className="text-[10px] text-slate-500">Entrega estimada: 24h a 48h</p>
            </div>
          </div>

          {/* Justificativa da IA */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Como a IA calculou essas quantidades:</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              As quantidades consideram o consumo médio dos últimos turnos, a margem de segurança operacional (+8.5%), e o prazo de entrega (lead time) de cada fornecedor para garantir que o restaurante nunca pare por falta de insumos.
            </p>
          </div>

          {/* Lista de Itens do Pedido */}
          <div className="space-y-2">
            <p className="text-xs font-black text-slate-700 uppercase tracking-wide">
              Itens Sugeridos para Reposição
            </p>

            {items.map((it) => (
              <div
                key={it.itemId}
                className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">{it.itemName}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Estoque Atual: <strong className="text-slate-700">{it.currentVirtualQty} {it.unit}</strong> · Consumo Médio Diário: {it.avgDailyConsumption} {it.unit}/dia
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      it.urgency === 'CRITICO'
                        ? 'bg-red-100 text-red-800'
                        : it.urgency === 'URGENTE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {it.urgency}
                  </span>
                </div>

                <p className="text-[10px] text-amber-700 mt-1 font-medium bg-amber-50/60 rounded px-2 py-1">
                  💡 {it.reasoning}
                </p>

                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-semibold">Qtd Pedido:</span>
                    <input
                      type="number"
                      step="1"
                      value={it.suggestedOrderQty}
                      onChange={(e) => updateQty(it.itemId, parseFloat(e.target.value) || 0)}
                      className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs font-bold text-center"
                    />
                    <span className="text-[10px] font-bold text-slate-600">{it.unit}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 mr-2">R$ {it.unitCost.toFixed(2)}/un</span>
                    <span className="font-black text-emerald-700 text-xs">
                      R$ {it.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 shrink-0 bg-white flex flex-col gap-2">
          {sent ? (
            <div className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 font-bold text-xs p-3 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Pedido enviado com sucesso para CDA / Compras!</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCopyText}
                className="border border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copiado!' : 'Copiar p/ WhatsApp'}</span>
              </button>

              <button
                onClick={handleSend}
                className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Aprovar & Enviar Pedido (R$ {totalValue.toFixed(2)})</span>
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 py-1"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
