import { useState, useRef } from 'react';
import { X, TrendingDown, AlertTriangle, CheckCircle, Upload, Plus, Filter, Sparkles, FileSpreadsheet } from 'lucide-react';
import { MOCK_CANCELLATIONS } from '../../data/stockMockData';
import { parseTeknisaCancellationsCSV, TEKNISA_CANCEL_CSV_SAMPLE } from '../../services/teknisaParser';
import type { CancellationRecord, CancellationReason, CancellationConsumptionStatus } from '../../types/stock.types';

interface CancellationsModalProps {
  onClose: () => void;
  onRecordAdded?: (record: CancellationRecord) => void;
}

export default function CancellationsModal({ onClose, onRecordAdded }: CancellationsModalProps) {
  const [records, setRecords] = useState<CancellationRecord[]>(MOCK_CANCELLATIONS);
  const [filterReason, setFilterReason] = useState<string>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form de novo cancelamento manual
  const [newDish, setNewDish] = useState('');
  const [newTable, setNewTable] = useState('');
  const [newQty, setNewQty] = useState(1);
  const [newValue, setNewValue] = useState(0);
  const [newReason, setNewReason] = useState<CancellationReason>('QUALIDADE_PREPARO');
  const [newConsumption, setNewConsumption] = useState<CancellationConsumptionStatus>('INSUMO_CONSUMIDO');
  const [newWaiter, setNewWaiter] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const totalLoss = records.reduce((acc, r) => acc + (r.consumptionStatus === 'INSUMO_CONSUMIDO' ? r.totalValue : 0), 0);
  const totalCount = records.length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const parsed = parseTeknisaCancellationsCSV(content);
      if (parsed.success && parsed.data && parsed.data.length > 0) {
        setRecords((prev) => [...parsed.data!, ...prev]);
        setImportNotice(`${parsed.data.length} registros de cancelamento importados com sucesso!`);
      } else {
        setImportNotice('Arquivo lido. Verifique o cabeçalho ou use o modelo padrão do Teknisa.');
      }
    };
    reader.readAsText(file, 'ISO-8859-1');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish) return;

    const record: CancellationRecord = {
      id: `CANCEL-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      tableNumber: newTable ? parseInt(newTable) || newTable : undefined,
      dishName: newDish,
      qty: newQty,
      unitValue: newValue / (newQty || 1),
      totalValue: newValue,
      reason: newReason,
      consumptionStatus: newConsumption,
      waiterName: newWaiter || undefined,
      managerApproved: true,
      notes: newNotes || undefined,
      stockImpactApplied: newConsumption === 'INSUMO_CONSUMIDO',
    };

    setRecords((prev) => [record, ...prev]);
    if (onRecordAdded) onRecordAdded(record);
    setShowAddForm(false);
    // Reset form
    setNewDish('');
    setNewTable('');
    setNewValue(0);
    setNewNotes('');
  };

  const loadSample = () => {
    const parsed = parseTeknisaCancellationsCSV(TEKNISA_CANCEL_CSV_SAMPLE);
    if (parsed.data) {
      setRecords((prev) => [...parsed.data!, ...prev]);
      setImportNotice('Amostra de cancelamentos do Teknisa carregada!');
    }
  };

  const filteredRecords = records.filter((r) => {
    if (filterReason === 'ALL') return true;
    if (filterReason === 'INSUMO_CONSUMIDO') return r.consumptionStatus === 'INSUMO_CONSUMIDO';
    if (filterReason === 'INSUMO_NAO_CONSUMIDO') return r.consumptionStatus === 'INSUMO_NAO_CONSUMIDO';
    return r.reason === filterReason;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt,.xls,.xlsx"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 to-rose-700 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <TrendingDown className="w-5 h-5 text-rose-300" />
            <div>
              <h3 className="font-black text-sm">Cancelamentos & Devoluções</h3>
              <p className="text-[10px] text-rose-200/90">Gestão de perdas de insumo e erros operacionais</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Card de Métricas */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-2.5">
              <div className="font-black text-rose-700 text-base">R$ {totalLoss.toFixed(2)}</div>
              <div className="text-rose-500 text-[10px] font-semibold">Prejuízo com Insumo</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
              <div className="font-black text-slate-800 text-base">{totalCount}</div>
              <div className="text-slate-500 text-[10px] font-semibold">Total de Registros</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5">
              <div className="font-black text-amber-800 text-sm">IA Ativa</div>
              <div className="text-amber-600 text-[10px] font-semibold">Margem Calibrada</div>
            </div>
          </div>

          {/* Aviso de Importação */}
          {importNotice && (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importNotice}</span>
              </div>
              <button onClick={() => setImportNotice(null)} className="text-emerald-700 font-bold text-[10px]">
                ✕
              </button>
            </div>
          )}

          {/* Ações de Topo */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Registro</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Importar Planilha</span>
            </button>
            <button
              onClick={loadSample}
              className="border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Amostra Teknisa</span>
            </button>
          </div>

          {/* Formulário de Adição Rápida */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3 text-xs">
              <p className="font-black text-slate-700 uppercase tracking-wide text-[10px]">Lançar Cancelamento Manual</p>
              <div>
                <label className="text-slate-500 text-[10px] font-semibold">Nome do Prato</label>
                <input
                  type="text"
                  required
                  value={newDish}
                  onChange={(e) => setNewDish(e.target.value)}
                  placeholder="Ex: Tambaqui na Brasa com Farofa"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-0.5"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-500 text-[10px] font-semibold">Mesa</label>
                  <input
                    type="text"
                    value={newTable}
                    onChange={(e) => setNewTable(e.target.value)}
                    placeholder="Ex: 12"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-slate-500 text-[10px] font-semibold">Qtd</label>
                  <input
                    type="number"
                    min="1"
                    value={newQty}
                    onChange={(e) => setNewQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-slate-500 text-[10px] font-semibold">Valor Total (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newValue}
                    onChange={(e) => setNewValue(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-0.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 text-[10px] font-semibold">Motivo</label>
                  <select
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold mt-0.5"
                  >
                    <option value="QUALIDADE_PREPARO">Erro de Preparo (Cozinha)</option>
                    <option value="QUALIDADE_APRESENTACAO">Padrão de Apresentação</option>
                    <option value="DEMORA_BOQUETA">Demora na Boqueta</option>
                    <option value="ERRO_PEDIDO_SALAO">Erro do Garçom</option>
                    <option value="DESISTENCIA_CLIENTE">Desistência do Cliente</option>
                    <option value="OUTRO">Outro Motivo</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 text-[10px] font-semibold">Insumo Foi Consumido?</label>
                  <select
                    value={newConsumption}
                    onChange={(e) => setNewConsumption(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold mt-0.5"
                  >
                    <option value="INSUMO_CONSUMIDO">SIM (Debitar Perda)</option>
                    <option value="INSUMO_NAO_CONSUMIDO">NÃO (Não preparado)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-500 text-[10px] font-semibold">Garçom / Atendente</label>
                <input
                  type="text"
                  value={newWaiter}
                  onChange={(e) => setNewWaiter(e.target.value)}
                  placeholder="Nome do operador"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-0.5"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                >
                  Salvar Cancelamento
                </button>
              </div>
            </form>
          )}

          {/* Filtros */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'INSUMO_CONSUMIDO', label: 'Com Perda de Insumo' },
              { id: 'INSUMO_NAO_CONSUMIDO', label: 'Sem Perda' },
              { id: 'QUALIDADE_PREPARO', label: 'Preparo' },
              { id: 'DESISTENCIA_CLIENTE', label: 'Desistência' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterReason(f.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] font-bold transition-colors ${
                  filterReason === f.id
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Lista de Registros */}
          <div className="space-y-2">
            {filteredRecords.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">{item.dishName}</h5>
                    <p className="text-[10px] text-slate-400">
                      {item.date} · {item.time} · Mesa {item.tableNumber || '—'} {item.waiterName ? `· ${item.waiterName}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-rose-600 text-xs block">
                      R$ {item.totalValue.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-400">({item.qty} un)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px]">
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold">
                    {item.reason}
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      item.consumptionStatus === 'INSUMO_CONSUMIDO'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.consumptionStatus === 'INSUMO_CONSUMIDO' ? 'Insumo debitado do estoque' : 'Insumo não preparado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
