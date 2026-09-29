import React, { useState } from 'react';
import { LayoutGrid, AlertCircle, Clock, Users, ShieldAlert, Sparkles, Plus, CheckCircle2, ChevronRight } from 'lucide-react';
import { RestaurantTable, Item86 } from '../types';

interface FloorPlanViewProps {
  onOpenCopilot: (prompt?: string) => void;
}

const INITIAL_TABLES: RestaurantTable[] = [
  { id: 't-01', number: 1, area: 'SALAO_PRINCIPAL', capacity: 4, status: 'LIVRE', minutesSinceOrder: 0, customerCount: 0, waiterName: '' },
  { id: 't-02', number: 2, area: 'SALAO_PRINCIPAL', capacity: 2, status: 'LIVRE', minutesSinceOrder: 0, customerCount: 0, waiterName: '' },
  { id: 't-03', number: 3, area: 'SALAO_PRINCIPAL', capacity: 6, status: 'LIVRE', minutesSinceOrder: 0, customerCount: 0, waiterName: '' },
  { id: 't-04', number: 4, area: 'SALAO_PRINCIPAL', capacity: 4, status: 'LIVRE', minutesSinceOrder: 0, customerCount: 0, waiterName: '' },
  { id: 't-05', number: 5, area: 'SALAO_PRINCIPAL', capacity: 8, status: 'LIVRE', minutesSinceOrder: 0, customerCount: 0, waiterName: '' },
  { id: 't-06', number: 6, area: 'VARANDA_PONTA_NEGRA', capacity: 4, status: 'LIVRE', minutesSinceOrder: 0, customerCount: 0, waiterName: '' },
  { id: 't-07', number: 7, area: 'VARANDA_PONTA_NEGRA', capacity: 4, status: 'LIVRE', minutesSinceOrder: 0, customerCount: 0, waiterName: '' },
  { id: 't-08', number: 8, area: 'VARANDA_PONTA_NEGRA', capacity: 2, status: 'LIVRE', minutesSinceOrder: 0, customerCount: 0, waiterName: '' },
  { id: 't-09', number: 9, area: 'SALA_VIP', capacity: 12, status: 'LIVRE', minutesSinceOrder: 0, customerCount: 0, waiterName: '', isVip: true },
];

const INITIAL_86_ITEMS: Item86[] = [];

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({ onOpenCopilot }) => {
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [items86, setItems86] = useState<Item86[]>(INITIAL_86_ITEMS);
  const [selectedArea, setSelectedArea] = useState<string>('TODOS');
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [showAdd86Modal, setShowAdd86Modal] = useState(false);
  const [new86Name, setNew86Name] = useState('');
  const [new86Reason, setNew86Reason] = useState<'ESGOTADO' | 'RACIONADO'>('RACIONADO');
  const [new86Portions, setNew86Portions] = useState('4');

  const filteredTables = selectedArea === 'TODOS'
    ? tables
    : tables.filter((t) => t.area === selectedArea);

  const delayedTablesCount = tables.filter((t) => t.status === 'ATRASADA').length;

  const handleAdd86 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!new86Name.trim()) return;

    const newItem: Item86 = {
      id: `86-${Date.now()}`,
      dishName: new86Name,
      reason: new86Reason,
      portionsLeft: new86Reason === 'RACIONADO' ? Number(new86Portions) : undefined,
      updatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setItems86((prev) => [newItem, ...prev]);
    setNew86Name('');
    setShowAdd86Modal(false);
  };

  const handleRemove86 = (id: string) => {
    setItems86((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Topo do Módulo Salão & Lista 86 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-slate-900">Salão Ponta Negra & Lista 86</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapa de mesas em tempo real, controle de tempo de boqueta e pratos esgotados/racionados (Toast Style).
          </p>
        </div>

        <button
          onClick={() => setShowAdd86Modal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar Prato à Lista 86</span>
        </button>
      </div>

      {/* Seção 1: Lista 86 (Toast POS Style) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-black text-xs">
              86
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Lista 86 Oficial (Pratos Esgotados / Racionados na Cozinha)
            </h3>
          </div>
          <span className="text-[10px] text-amber-800 font-semibold">
            Notificação ativa para todos os garçons
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items86.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-white rounded-xl border border-amber-200 shadow-xs flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{item.dishName}</span>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                      item.reason === 'ESGOTADO'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {item.reason}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {item.portionsLeft !== undefined
                    ? `⚠️ Restam apenas ${item.portionsLeft} porções no mise en place`
                    : 'Bloqueado no cardápio de todos os atendentes'}{' '}
                  &bull; Atualizado às {item.updatedAt}
                </span>
              </div>

              <button
                onClick={() => handleRemove86(item.id)}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 p-1 rounded"
                title="Desbloquear prato"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alerta de Tempo de Boqueta */}
      {delayedTablesCount > 0 && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 animate-pulse mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-rose-950">
                Alerta de Tempo de Prato: Mesa 5 excedeu 28 minutos!
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                Mesa com 7 pessoas aguardando saída de pratos da boqueta de carnes. Risco iminente de reclamação.
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              onOpenCopilot(
                'Mesa 5 com 7 pessoas está aguardando prato há 29 minutos. Como agir na boqueta e que cortesia oferecer?'
              )
            }
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ver Conduta Imediata</span>
          </button>
        </div>
      )}

      {/* Filtro de Áreas do Salão */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedArea('TODOS')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedArea === 'TODOS'
              ? 'bg-[#0f392b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todas as Mesas ({tables.length})
        </button>
        <button
          onClick={() => setSelectedArea('SALAO_PRINCIPAL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedArea === 'SALAO_PRINCIPAL'
              ? 'bg-[#0f392b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Salão Principal
        </button>
        <button
          onClick={() => setSelectedArea('VARANDA_PONTA_NEGRA')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedArea === 'VARANDA_PONTA_NEGRA'
              ? 'bg-[#0f392b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Varanda Ponta Negra
        </button>
        <button
          onClick={() => setSelectedArea('SALA_VIP')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedArea === 'SALA_VIP'
              ? 'bg-[#0f392b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Sala VIP
        </button>
      </div>

      {/* Grid Visual de Mesas (Floor Plan) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredTables.map((table) => {
          const isDelayed = table.status === 'ATRASADA';
          const isEating = table.status === 'CONSUMINDO';
          const isDessert = table.status === 'SOBREMESA_CONTA';
          const isFree = table.status === 'LIVRE';

          return (
            <div
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between h-36 ${
                isDelayed
                  ? 'bg-rose-50/80 border-rose-400 hover:border-rose-600 ring-2 ring-rose-300'
                  : isEating
                  ? 'bg-blue-50/60 border-blue-200 hover:border-blue-400'
                  : isDessert
                  ? 'bg-amber-50/60 border-amber-200 hover:border-amber-400'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">
                    Mesa {table.number}
                  </span>
                  {table.isVip && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 font-black text-[9px]">
                      VIP
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {table.area.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                {isFree ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    Mesa Livre ({table.capacity}p)
                  </span>
                ) : (
                  <>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>{table.customerCount} pessoas</span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span
                        className={`font-black ${
                          isDelayed ? 'text-rose-700 animate-pulse' : 'text-slate-500'
                        }`}
                      >
                        ⏱️ {table.minutesSinceOrder} min
                      </span>
                      <span className="text-slate-400 truncate max-w-[70px]">
                        {table.waiterName.split(' ')[0]}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[9px] font-bold uppercase">
                <span
                  className={
                    isDelayed
                      ? 'text-rose-700'
                      : isEating
                      ? 'text-blue-700'
                      : isDessert
                      ? 'text-amber-700'
                      : 'text-slate-400'
                  }
                >
                  {table.status.replace(/_/g, ' ')}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Adicionar Prato à Lista 86 */}
      {showAdd86Modal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-black text-xs">86</span>
                <h3 className="text-base font-bold text-slate-900">Bloquear / Racionar Prato</h3>
              </div>
              <button
                onClick={() => setShowAdd86Modal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd86} className="space-y-3 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nome do Prato / Bebida</label>
                <input
                  type="text"
                  placeholder="Ex: Filé Mignon ao Molho de Vinho"
                  value={new86Name}
                  onChange={(e) => setNew86Name(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tipo de Ação</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNew86Reason('RACIONADO')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      new86Reason === 'RACIONADO'
                        ? 'bg-amber-100 border-amber-400 text-amber-950'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Racionar Porções
                  </button>
                  <button
                    type="button"
                    onClick={() => setNew86Reason('ESGOTADO')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      new86Reason === 'ESGOTADO'
                        ? 'bg-rose-100 border-rose-400 text-rose-950'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Esgotado Total (86)
                  </button>
                </div>
              </div>

              {new86Reason === 'RACIONADO' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Porções Restantes no Mise en Place</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={new86Portions}
                    onChange={(e) => setNew86Portions(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd86Modal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md"
                >
                  Confirmar na Lista 86
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes da Mesa Selecionada */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Mesa {selectedTable.number} {selectedTable.isVip && '⭐ VIP'}
                </h3>
                <span className="text-xs text-slate-400">{selectedTable.area.replace(/_/g, ' ')}</span>
              </div>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Status Atual:</span>
                <strong className="text-slate-900">{selectedTable.status.replace(/_/g, ' ')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tempo de Espera:</span>
                <strong className={selectedTable.status === 'ATRASADA' ? 'text-rose-600 font-black' : 'text-slate-900'}>
                  {selectedTable.minutesSinceOrder} minutos
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Clientes na Mesa:</span>
                <strong className="text-slate-900">{selectedTable.customerCount} pessoas</strong>
              </div>
              <div className="flex justify-between">
                <span>Atendente Responsável:</span>
                <strong className="text-slate-900">{selectedTable.waiterName}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setSelectedTable(null);
                  onOpenCopilot(`Estou na Mesa ${selectedTable.number} que está com ${selectedTable.minutesSinceOrder} min de espera. Que conduta e cortesia devo aplicar agora?`);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0f392b] to-[#164e3b] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Orientação de Conflito com IA</span>
              </button>

              <button
                onClick={() => {
                  alert(`Garçom ${selectedTable.waiterName} acionado para conferir a Mesa ${selectedTable.number}!`);
                  setSelectedTable(null);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Chamar Garçom Responsável
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
