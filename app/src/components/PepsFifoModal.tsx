import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Clock, 
  Calendar, 
  Boxes, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowDownRight,
  TrendingDown,
  Info,
  MapPin,
  AlertOctagon
} from 'lucide-react';
import { 
  StockBatch, 
  PepsMovementLog, 
  INITIAL_PEPS_BATCHES, 
  INITIAL_PEPS_LOGS 
} from '../data/pepsStockData';

interface PepsFifoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCopilot?: (prompt?: string) => void;
}

export const PepsFifoModal: React.FC<PepsFifoModalProps> = ({ isOpen, onClose, onOpenCopilot }) => {
  const [batches, setBatches] = useState<StockBatch[]>(INITIAL_PEPS_BATCHES);
  const [logs, setLogs] = useState<PepsMovementLog[]>(INITIAL_PEPS_LOGS);
  const [selectedItemId, setSelectedItemId] = useState<string>('item-1'); // item-1 = Tambaqui
  const [withdrawQty, setWithdrawQty] = useState<string>('');
  const [showViolationWarning, setShowViolationWarning] = useState<boolean>(false);
  const [violationDetails, setViolationDetails] = useState<string>('');
  const [pepsFeedback, setPepsFeedback] = useState<{ type: 'SUCCESS' | 'ERROR'; message: string } | null>(null);

  if (!isOpen) return null;

  // Itens únicos com lotes cadastrados
  const uniqueItems = [
    { id: 'item-1', name: 'Lombo de Tambaqui Nobre Fresco', code: 'PES-0012' },
    { id: 'item-2', name: 'Filé de Pirarucu de Manejo', code: 'PES-0015' },
    { id: 'item-3', name: 'Camarão Rosa GG Limpo Congelado', code: 'MAR-0008' },
    { id: 'item-4', name: 'Picanha Bovina Grill Resfriada', code: 'CAR-0020' },
  ];

  // Filtra lotes do item selecionado ordenados rigorosamente por PEPS (FIFO)
  const itemBatches = batches
    .filter(b => b.itemId === selectedItemId && b.currentQuantity > 0)
    .sort((a, b) => a.entryTimestamp - b.entryTimestamp);

  // Executa retirada respeitando estritamente o PEPS
  const handlePepsWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(withdrawQty);
    if (isNaN(qty) || qty <= 0) return;

    let remainingToWithdraw = qty;
    let newBatches = [...batches];
    const itemBatchesSorted = newBatches
      .filter(b => b.itemId === selectedItemId && b.currentQuantity > 0)
      .sort((a, b) => a.entryTimestamp - b.entryTimestamp);

    if (itemBatchesSorted.length === 0) {
      setPepsFeedback({ type: 'ERROR', message: 'Não há lotes ativos para este item no momento!' });
      setTimeout(() => setPepsFeedback(null), 3500);
      return;
    }

    const currentFirstBatch = itemBatchesSorted[0];

    // Abate lote a lote
    for (const b of itemBatchesSorted) {
      if (remainingToWithdraw <= 0) break;

      const idx = newBatches.findIndex(nb => nb.id === b.id);
      if (idx !== -1) {
        if (newBatches[idx].currentQuantity >= remainingToWithdraw) {
          newBatches[idx].currentQuantity -= remainingToWithdraw;
          remainingToWithdraw = 0;
        } else {
          remainingToWithdraw -= newBatches[idx].currentQuantity;
          newBatches[idx].currentQuantity = 0;
          newBatches[idx].status = 'ESGOTADO';
        }
      }
    }

    // Recalcula posições na fila PEPS para o item
    const remainingActive = newBatches
      .filter(b => b.itemId === selectedItemId && b.currentQuantity > 0)
      .sort((a, b) => a.entryTimestamp - b.entryTimestamp);

    remainingActive.forEach((b, pos) => {
      const idx = newBatches.findIndex(nb => nb.id === b.id);
      if (idx !== -1) {
        newBatches[idx].pepsQueuePosition = pos + 1;
        newBatches[idx].status = pos === 0 ? 'PRIMEIRO_A_SAIR' : 'EM_FILA';
      }
    });

    setBatches(newBatches);

    // Registra log
    const newLog: PepsMovementLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Agora mesmo',
      itemName: currentFirstBatch.itemName,
      batchCode: currentFirstBatch.batchCode,
      quantity: qty,
      unit: currentFirstBatch.unit,
      operator: 'Felipe Abreu (Gerente Geral)',
      action: 'SAIDA_REGULAR_PEPS',
      notes: `Baixa de ${qty} ${currentFirstBatch.unit} efetuada respeitando a fila PEPS a partir do ${currentFirstBatch.batchCode}.`,
    };

    setLogs([newLog, ...logs]);
    setWithdrawQty('');
  };

  // Simulação de tentativa de violação do PEPS
  const handleAttemptViolation = (batch: StockBatch) => {
    if (batch.pepsQueuePosition === 1) {
      setPepsFeedback({
        type: 'SUCCESS',
        message: `✓ O lote ${batch.batchCode} é exatamente o 1º da Fila PEPS! A retirada dele é a correta pela norma ANVISA.`,
      });
      setTimeout(() => setPepsFeedback(null), 4000);
      return;
    }

    const firstBatch = itemBatches.find(b => b.pepsQueuePosition === 1);
    setViolationDetails(
      `Você tentou retirar do lote "${batch.batchCode}" (Entrada: ${batch.entryDate}), porém o lote "${firstBatch?.batchCode}" (Entrada: ${firstBatch?.entryDate}) deu entrada antes e ainda possui ${firstBatch?.currentQuantity} ${firstBatch?.unit} disponíveis! Pela norma ANVISA RDC 216 e padrão Grupo Engenho, o lote mais antigo deve ser esgotado primeiro para evitar perdas e vencimento.`
    );
    setShowViolationWarning(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header do Modal */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0a2e23] to-[#123e30] text-white flex items-start justify-between gap-4 border-b border-emerald-900 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                <ArrowRightLeft className="w-3 h-3" /> Regra PEPS / FIFO Ativa
              </span>
              <span className="text-xs text-emerald-200/80 font-medium">Conformidade ANVISA RDC 216</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
              Primeiro que Entra, Primeiro que Sai (PEPS / PVPS)
            </h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-2xl">
              Garantia de que os lotes mais antigos ou com validade mais próxima sejam consumidos antes dos recém-chegados, prevenindo perdas financeiras e contaminações.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          {pepsFeedback && (
            <div className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between border animate-slide-down ${
              pepsFeedback.type === 'SUCCESS'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <span>{pepsFeedback.message}</span>
              <button onClick={() => setPepsFeedback(null)} className="text-slate-500 hover:text-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {/* Card Didático da Regra Operacional */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-amber-200/60 text-amber-900 shrink-0">
                <Boxes className="w-4 h-4 text-amber-900" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-amber-950 text-xs block">
                  Instrução de Guarda e Acondicionamento nas Câmaras Frias:
                </span>
                <p className="text-amber-900/90 leading-relaxed text-[11px]">
                  <strong>Ao receber nova carga:</strong> armazene os novos lotes <strong>ATRÁS</strong> dos lotes existentes na prateleira. <strong>Ao retirar para preparo:</strong> retire sempre o lote que está na <strong>FRENTE (1º da Fila)</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenCopilot?.("Como orientar a equipe de cozinha do Engenho Ponta Negra a nunca violar a regra do PEPS na câmara de congelados?")}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dicas do Copiloto</span>
            </button>
          </div>

          {/* Seletor de Insumo */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Selecione o Insumo para Auditar a Fila de Lotes PEPS:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {uniqueItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedItemId === item.id
                      ? 'bg-[#0a2e23] text-white border-[#0a2e23] shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-mono opacity-70 block">{item.code}</span>
                  <span className="text-xs font-bold block leading-tight mt-0.5">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fila de Lotes em Ordem Cronológica de Entrada */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0a2e23]" />
                <span>Lotes Ativos em Fila Cronológica de Saída ({itemBatches.length} Lotes)</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Ordenação: Mais Antigo ➔ Mais Recente
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {itemBatches.map((batch) => {
                const isFirst = batch.pepsQueuePosition === 1;
                return (
                  <div
                    key={batch.id}
                    className={`rounded-2xl p-4 border transition-all relative ${
                      isFirst
                        ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-600/10 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    {/* Badge de Posição na Fila PEPS */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isFirst
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isFirst ? '🥇 1º DA FILA (SAÍDA OBRIGATÓRIA)' : `⏳ ${batch.pepsQueuePosition}º DA FILA (RESERVA)`}
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {batch.cdaInvoice}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold text-slate-900 font-mono">{batch.batchCode}</span>
                        <span className="text-base font-black text-slate-900">
                          {batch.currentQuantity.toFixed(1)} {batch.unit}
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            / {batch.initialQuantity} {batch.unit}
                          </span>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-200/60">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> Entrada no Estoque:
                          </span>
                          <strong className="text-slate-700">{batch.entryDate}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" /> Validade Limite:
                          </span>
                          <strong className="text-amber-700">{batch.expirationDate}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> Localização:
                          </span>
                          <span className="text-slate-600 font-medium">{batch.storageLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botão de Ação / Teste de Violação */}
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-end">
                      {!isFirst && (
                        <button
                          onClick={() => handleAttemptViolation(batch)}
                          className="text-[10px] text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Simular tentativa de pegar este lote antes do 1º lote"
                        >
                          <AlertTriangle className="w-3 h-3 text-slate-400" />
                          <span>Simular Tentativa de Baixa Fora de Ordem</span>
                        </button>
                      )}
                      {isFirst && (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Lote Habilitado para Consumo</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formulário de Baixa PEPS Automática */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-700" />
                <span>Efetuar Retirada com Baixa PEPS Automática</span>
              </h4>
              <span className="text-[10px] text-slate-500">
                O sistema desconta primeiro do lote mais antigo
              </span>
            </div>

            <form onSubmit={handlePepsWithdraw} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={withdrawQty}
                  onChange={(e) => setWithdrawQty(e.target.value)}
                  placeholder={`Quantidade a retirar (${itemBatches[0]?.unit || 'KG'})...`}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0a2e23]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0a2e23] hover:bg-[#123e30] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Confirmar Saída PEPS</span>
              </button>
            </form>
          </div>

          {/* Histórico Recente de Movimentações PEPS */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Trilha de Auditoria de Saídas PEPS (Últimos Registros)
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
              {logs.map((log) => (
                <div key={log.id} className="p-3 flex items-start justify-between gap-3 hover:bg-slate-50">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.itemName}</span>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-600 border border-slate-200">
                        {log.batchCode}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        PEPS Respeitado
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{log.notes}</p>
                    <span className="text-[10px] text-slate-400 block">Responsável: {log.operator} &bull; {log.timestamp}</span>
                  </div>

                  <span className="font-mono font-bold text-slate-900 text-xs shrink-0">
                    - {log.quantity} {log.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal de Alerta de Violação PEPS (Pop-up de Guarda) */}
        {showViolationWarning && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-rose-300 space-y-4 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center gap-3 text-rose-700">
                <div className="p-2.5 rounded-2xl bg-rose-100 shrink-0">
                  <AlertOctagon className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Bloqueio Preventivo: Violação do PEPS</h3>
                  <span className="text-[10px] font-bold text-rose-600 uppercase">Regra Sanitária ANVISA RDC 216</span>
                </div>
              </div>

              <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200 text-xs text-slate-700 leading-relaxed">
                {violationDetails}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowViolationWarning(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Entendi, Retirar do 1º Lote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rodapé do Modal */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Auditoria contínua de lotes integrada com a Doca e PDV</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
