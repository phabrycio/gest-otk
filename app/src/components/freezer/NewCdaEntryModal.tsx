// ============================================================
// MODAL: ENTRADA DE ITENS DO CDA NO FREEZER COM ETIQUETA
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// [EM FASE DE PROJETO & HOMOLOGAÇÃO PILOTO]
// ============================================================

import React, { useState } from 'react';
import { X, Plus, Package, Calendar, User, ThermometerSnowflake, AlertTriangle, CheckCircle2, QrCode, ShieldAlert } from 'lucide-react';
import type { FreezerTrackedItem, BatchColor } from '../../types/freezerTraceability.types';
import { BATCH_COLORS_CONFIG } from '../../types/freezerTraceability.types';
import {
  registerCdaEntry,
  getNextAvailableBatchColor,
  getActiveBatchesForItem,
} from '../../services/freezerTraceabilityStore';

interface NewCdaEntryModalProps {
  onClose: () => void;
  onSuccess: (item: FreezerTrackedItem) => void;
}

const COMMON_CDA_ITEMS = [
  { name: 'Costela de Tambaqui Nobre (Porção 400g)', category: 'Pescados Regionais', unit: 'porções', defaultQty: 20 },
  { name: 'Filé de Pirarucu Fresco em Lombo (Peça 1kg)', category: 'Pescados Regionais', unit: 'kg', defaultQty: 15 },
  { name: 'Camarão Regional Rosa GG (Pacote 1kg)', category: 'Frutos do Mar', unit: 'kg', defaultQty: 10 },
  { name: 'Filé de Matrinxã Desossado (Peça 500g)', category: 'Pescados Regionais', unit: 'peças', defaultQty: 18 },
  { name: 'Picanha Nobre Bife de Tira (Peça 1.2kg)', category: 'Carnes Nobres', unit: 'kg', defaultQty: 12 },
  { name: 'Coxa e Sobrecoxa Desossada (Pacote 2kg)', category: 'Aves', unit: 'kg', defaultQty: 16 },
  { name: 'Cupim Selecionado Para Brasa (Peça 1.5kg)', category: 'Carnes Nobres', unit: 'kg', defaultQty: 14 },
];

export const NewCdaEntryModal: React.FC<NewCdaEntryModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [selectedItemName, setSelectedItemName] = useState(COMMON_CDA_ITEMS[0].name);
  const [cdaBatchNumber, setCdaBatchNumber] = useState(`CDA-${Math.floor(1000 + Math.random() * 9000)}-AM`);

  // Data de validade padrão: 30 dias à frente
  const defaultExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  const [cdaExpiryDate, setCdaExpiryDate] = useState(defaultExpiry);

  const selectedItemObj = COMMON_CDA_ITEMS.find((i) => i.name === selectedItemName) || COMMON_CDA_ITEMS[0];
  const [quantity, setQuantity] = useState(selectedItemObj.defaultQty);
  const [unit, setUnit] = useState(selectedItemObj.unit);
  const [operatorReceived, setOperatorReceived] = useState('Ivan (Gerente)');
  const [temperatureCheck, setTemperatureCheck] = useState('-18.8°C');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calcula cor do lote dinamicamente com base na regra de 3 lotes
  const nextColor: BatchColor | null = getNextAvailableBatchColor(selectedItemName);
  const activeBatches = getActiveBatchesForItem(selectedItemName);
  const isBlocked = nextColor === null;

  const handleItemChange = (name: string) => {
    setSelectedItemName(name);
    setErrorMsg(null);
    const item = COMMON_CDA_ITEMS.find((i) => i.name === name);
    if (item) {
      setUnit(item.unit);
      setQuantity(item.defaultQty);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isBlocked) {
      setErrorMsg(`Limite de 3 lotes ativos atingido para este item. Nosso inventário opera com no máximo 3 lotes para garantir rotação PVPS e zero desperdício.`);
      return;
    }

    if (!cdaBatchNumber.trim()) {
      setErrorMsg('Informe o número do lote do CDA.');
      return;
    }

    const res = registerCdaEntry({
      itemName: selectedItemName,
      category: selectedItemObj.category,
      cdaBatchNumber: cdaBatchNumber.trim().toUpperCase(),
      cdaExpiryDate: cdaExpiryDate.split('-').reverse().join('/'),
      quantity: Number(quantity),
      unit,
      operatorReceived,
      temperatureCheck,
      notes: notes.trim() || undefined,
    });

    if (!res.success || !res.item) {
      setErrorMsg(res.error || 'Erro ao registrar entrada.');
      return;
    }

    onSuccess(res.item);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabeçalho */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500 text-slate-950">
              <Plus className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Receber Insumo do CDA no Freezer</h3>
              <p className="text-[11px] text-slate-400">Emissão de Etiqueta Local com QR Code e Cor de Lote</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Seletor de Insumo */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Insumo Recebido do CDA *
            </label>
            <select
              value={selectedItemName}
              onChange={(e) => handleItemChange(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            >
              {COMMON_CDA_ITEMS.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
          </div>

          {/* Banner de Cor de Lote e Regra dos 3 Lotes */}
          {!isBlocked && nextColor && (
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${BATCH_COLORS_CONFIG[nextColor].bgLightClass} ${BATCH_COLORS_CONFIG[nextColor].borderClass}`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: BATCH_COLORS_CONFIG[nextColor].hex }}
                />
                <div>
                  <span className="font-bold block text-slate-900">
                    Etiqueta Atribuída: {BATCH_COLORS_CONFIG[nextColor].name}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {BATCH_COLORS_CONFIG[nextColor].priorityLabel}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-white border border-slate-200 text-slate-700">
                {activeBatches.length + 1} de 3 Lotes Ativos
              </span>
            </div>
          )}

          {/* Alerta de Bloqueio dos 3 Lotes */}
          {isBlocked && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-xs">
                  Regra de Lotes: Limite de 3 Lotes Ativos Atingido!
                </span>
                <p className="text-[11px] text-rose-800 mt-0.5">
                  Já existem 3 lotes ativos (Azul, Verde e Âmbar) deste insumo no inventário. Para garantir a rotação FIFO/PVPS rigorosa e zero perda, finalize ou transfira o Lote 01 para a produção antes de dar nova entrada.
                </p>
              </div>
            </div>
          )}

          {/* Lote CDA & Validade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nº do Lote que vem do CDA *
              </label>
              <input
                type="text"
                value={cdaBatchNumber}
                onChange={(e) => setCdaBatchNumber(e.target.value)}
                placeholder="Ex: CDA-8841-AM"
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Data de Validade (CDA) *
              </label>
              <input
                type="date"
                value={cdaExpiryDate}
                onChange={(e) => setCdaExpiryDate(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Quantidade e Unidade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Quantidade *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Unidade
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Operador e Temperatura do Freezer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Recebido por (Responsável)
              </label>
              <select
                value={operatorReceived}
                onChange={(e) => setOperatorReceived(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Ivan (Gerente)">Ivan (Gerente Geral)</option>
                <option value="Pabricio (Gerente Treinamento)">Pabricio (Gerente Treinamento)</option>
                <option value="Patricia (Supervisora)">Patricia (Supervisora de Loja)</option>
                <option value="Mádio (Chefe Cozinha)">Mádio (Chefe de Cozinha)</option>
                <option value="Esmael (Sub Chefe)">Esmael (Sub Chefe Cozinha)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Aferição Térmica Entrada
              </label>
              <input
                type="text"
                value={temperatureCheck}
                onChange={(e) => setTemperatureCheck(e.target.value)}
                placeholder="Ex: -19.0°C"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Observações do Recebimento (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Carga descarregada na doca 15h, embalagem a vácuo íntegra."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Rodapé / Ações */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isBlocked}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                isBlocked
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#0a2e23] hover:bg-[#123e30]'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Gerar Etiqueta & Cadastrar Lote</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
