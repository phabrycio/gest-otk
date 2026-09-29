import { useState, useRef } from 'react';
import { X, Upload, CheckCircle, Loader2, BarChart3, FileSpreadsheet, Sparkles, AlertTriangle, ArrowRight, Users, MessageSquare } from 'lucide-react';
import {
  parseTeknisaSalesCSV,
  parseTeknisaCancellationsCSV,
  detectTeknisaFileType,
  TEKNISA_SALES_CSV_SAMPLE,
  TEKNISA_CANCEL_CSV_SAMPLE,
  type TeknisaSalesParseResult,
} from '../../services/teknisaParser';
import {
  parseDionisioReservationsCSV,
  parseDionisioReviewsCSV,
  DIONISIO_RESERVATIONS_SAMPLE,
  DIONISIO_REVIEWS_SAMPLE,
} from '../../services/dionisioParser';
import type { CancellationRecord, SalesImport } from '../../types/stock.types';
import type { DionisioReservation, DionisioNpsReview } from '../../types/auditAndOperations.types';
import { parseAndApplyCsvSpreadsheet } from '../../services/centralDataStore';

interface SalesImportModalProps {
  onClose: () => void;
  onImportApplied?: (importData: SalesImport) => void;
}

interface ConsumptionItem {
  item: string;
  consumed: number;
  unit: string;
  sourceDish: string;
}

type ModalState = 'IDLE' | 'PROCESSING' | 'PREVIEW' | 'DONE';

export default function SalesImportModal({ onClose, onImportApplied }: SalesImportModalProps) {
  const [state, setState] = useState<ModalState>('IDLE');
  const [progress, setProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<'teknisa_csv' | 'cancel_csv' | 'dionisio_csv'>('teknisa_csv');
  const [fileName, setFileName] = useState<string>('');
  const [parseResult, setParseResult] = useState<TeknisaSalesParseResult | null>(null);
  const [cancelRecords, setCancelRecords] = useState<CancellationRecord[]>([]);
  const [dionisioReservations, setDionisioReservations] = useState<DionisioReservation[]>([]);
  const [dionisioReviews, setDionisioReviews] = useState<DionisioNpsReview[]>([]);
  const [isCancellationFile, setIsCancellationFile] = useState<boolean>(false);
  const [isDionisioFile, setIsDionisioFile] = useState<boolean>(false);
  const [calculatedConsumption, setCalculatedConsumption] = useState<ConsumptionItem[]>([]);
  const [operationalMarginPct, setOperationalMarginPct] = useState<number>(8.5); // Margem de erro configurável pedida pelo usuário

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calcula impacto nos insumos baseado nos pratos do relatório Teknisa
  const deriveIngredientConsumption = (sales: SalesImport, marginPct: number): ConsumptionItem[] => {
    const consumptionMap = new Map<string, { consumed: number; unit: string; dish: string }>();

    sales.lines.forEach((line) => {
      const name = line.dishName.toLowerCase();
      const qtyDelivered = line.qtyDelivered || line.qtyOrdered;

      if (name.includes('tambaqui')) {
        const key = 'Tambaqui fresco em lombo';
        const current = consumptionMap.get(key) || { consumed: 0, unit: 'kg', dish: line.dishName };
        current.consumed += qtyDelivered * 0.450; // 450g por porção
        consumptionMap.set(key, current);

        const farinhaKey = "Farinha d'água de Uarini";
        const fCurrent = consumptionMap.get(farinhaKey) || { consumed: 0, unit: 'kg', dish: line.dishName };
        fCurrent.consumed += qtyDelivered * 0.120;
        consumptionMap.set(farinhaKey, fCurrent);
      } else if (name.includes('filé') || name.includes('mignon')) {
        const key = 'Filé mignon resfriado';
        const current = consumptionMap.get(key) || { consumed: 0, unit: 'kg', dish: line.dishName };
        current.consumed += qtyDelivered * 0.300; // 300g por porção
        consumptionMap.set(key, current);
      } else if (name.includes('camarão') || name.includes('caldeirada')) {
        const key = 'Camarão GG VG (fresco)';
        const current = consumptionMap.get(key) || { consumed: 0, unit: 'kg', dish: line.dishName };
        current.consumed += qtyDelivered * 0.350;
        consumptionMap.set(key, current);

        const tucupiKey = 'Tucupi pasteurizado (galão)';
        const tCurrent = consumptionMap.get(tucupiKey) || { consumed: 0, unit: 'L', dish: line.dishName };
        tCurrent.consumed += qtyDelivered * 0.200;
        consumptionMap.set(tucupiKey, tCurrent);
      } else if (name.includes('pirarucu')) {
        const key = 'Pirarucu filé sem pele';
        const current = consumptionMap.get(key) || { consumed: 0, unit: 'kg', dish: line.dishName };
        current.consumed += qtyDelivered * 0.400;
        consumptionMap.set(key, current);
      } else {
        // Genérico para outros pratos
        const key = `Insumos Base (${line.dishName})`;
        const current = consumptionMap.get(key) || { consumed: 0, unit: 'porções', dish: line.dishName };
        current.consumed += qtyDelivered;
        consumptionMap.set(key, current);
      }
    });

    // Aplica a margem de erro operacional (desperdício / erro de preparo / porcionamento)
    const factor = 1 + marginPct / 100;
    return Array.from(consumptionMap.entries()).map(([item, val]) => ({
      item,
      consumed: Number((val.consumed * factor).toFixed(2)),
      unit: val.unit,
      sourceDish: val.dish,
    }));
  };

  const processCsvText = (text: string, name: string) => {
    setFileName(name);
    setState('PROCESSING');
    setProgress(20);

    const isDion = selectedFormat === 'dionisio_csv' || text.toLowerCase().includes('pax') || text.toLowerCase().includes('cliente');
    const fileType = detectTeknisaFileType(text);
    const isCancel = !isDion && fileType === 'CANCELLATIONS';

    setIsDionisioFile(isDion);
    setIsCancellationFile(isCancel);

    let p = 20;
    const interval = setInterval(() => {
      p += 25;
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);
        if (isDion) {
          const res = parseDionisioReservationsCSV(text);
          setDionisioReservations(res.data);
          const revRes = parseDionisioReviewsCSV(DIONISIO_REVIEWS_SAMPLE);
          setDionisioReviews(revRes.data);
          setParseResult(null);
        } else if (isCancel) {
          const res = parseTeknisaCancellationsCSV(text);
          setCancelRecords(res.data || []);
          setParseResult(null);
        } else {
          const res = parseTeknisaSalesCSV(text, undefined, name);
          setParseResult(res);
          if (res.data) {
            const consumption = deriveIngredientConsumption(res.data, operationalMarginPct);
            setCalculatedConsumption(consumption);
          }
        }
        setState('PREVIEW');
      }
    }, 120);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      processCsvText(content, file.name);
    };
    reader.readAsText(file, 'ISO-8859-1'); // Suporta encoding padrão de relatórios BR
  };

  const loadTeknisaSalesSample = () => {
    processCsvText(TEKNISA_SALES_CSV_SAMPLE, 'Relatorio_Vendas_Teknisa_Odhen_Jantar.csv');
  };

  const loadTeknisaCancelSample = () => {
    processCsvText(TEKNISA_CANCEL_CSV_SAMPLE, 'Relatorio_Cancelamentos_Teknisa_Odhen.csv');
  };

  const loadDionisioSample = () => {
    processCsvText(DIONISIO_RESERVATIONS_SAMPLE, 'Dionisio_Reservas_WhatsApp_Jantar.csv');
  };

  const handleApply = () => {
    if (parseResult?.data) {
      if (onImportApplied) {
        onImportApplied(parseResult.data);
      }
      const syntheticCsv = parseResult.data.lines
        .map((l) => `"${l.productCode || '001'}";"${l.dishName}";${l.qtyOrdered || 1};${l.totalRevenue || 0}`)
        .join('\n');
      parseAndApplyCsvSpreadsheet(syntheticCsv, fileName || 'Teknisa_Importado.csv');
    }
    setState('DONE');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt,.xls,.xlsx"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-purple-200" />
            <div>
              <h3 className="font-black text-sm">Importar Teknisa Odhen PDV</h3>
              <p className="text-[10px] text-purple-200/90">Vendas, cancelamentos e cálculo de estoque virtual</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* IDLE */}
          {state === 'IDLE' && (
            <div className="p-5 space-y-4">
              {/* Formato */}
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wide">Selecione a Origem dos Dados</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'teknisa_csv', label: 'Teknisa Vendas', sub: 'PDV Odhen' },
                    { id: 'cancel_csv', label: 'Cancelamentos', sub: 'Com Motivo' },
                    { id: 'dionisio_csv', label: 'Dionísio CRM', sub: 'Reservas & NPS' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setSelectedFormat(fmt.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        selectedFormat === fmt.id
                          ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold shadow-sm'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <FileSpreadsheet className={`w-4 h-4 mx-auto mb-1 ${selectedFormat === fmt.id ? 'text-purple-600' : 'text-slate-400'}`} />
                      <div className="leading-tight">{fmt.label}</div>
                      <div className="text-[9px] opacity-70 mt-0.5">{fmt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Área de Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl p-6 flex flex-col items-center gap-2.5 text-center bg-purple-50/30 hover:bg-purple-50/50 cursor-pointer transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-700">
                    {selectedFormat === 'dionisio_csv'
                      ? 'Clique para selecionar relatório do Dionísio (Reservas/NPS)'
                      : 'Clique para selecionar relatório do Teknisa (Vendas/Cancelamentos)'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {selectedFormat === 'dionisio_csv'
                      ? 'Planilha CSV exportada do painel Dionísio WhatsApp/Reservas'
                      : 'Exportado do Teknisa Odhen (.csv com separador ";" ou ",")'}
                  </p>
                </div>
              </div>

              {/* Botões de Teste Rápido */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Testar com amostras formatadas:</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={loadTeknisaSalesSample}
                    className="p-2 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 text-[11px] font-bold flex flex-col items-center justify-center gap-1 hover:bg-purple-100 transition-colors text-center"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Teknisa Vendas</span>
                  </button>
                  <button
                    onClick={loadTeknisaCancelSample}
                    className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-[11px] font-bold flex flex-col items-center justify-center gap-1 hover:bg-rose-100 transition-colors text-center"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Cancelamentos</span>
                  </button>
                  <button
                    onClick={loadDionisioSample}
                    className="p-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-[11px] font-bold flex flex-col items-center justify-center gap-1 hover:bg-indigo-100 transition-colors text-center"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Dionísio CRM</span>
                  </button>
                </div>
              </div>

              {/* Configuração de Margem de Erro Operacional */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Margem de Erro Operacional & Desperdício:</span>
                  <span className="font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-lg">
                    +{operationalMarginPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={operationalMarginPct}
                  onChange={(e) => setOperationalMarginPct(parseFloat(e.target.value) || 0)}
                  className="w-full accent-purple-600"
                />
                <p className="text-[10px] text-slate-400 leading-tight">
                  Compensa erros operacionais de preparo, quebras e diferenças de porcionamento na cozinha para manter o estoque virtual seguro.
                </p>
              </div>

              {/* Benefícios */}
              <div className="bg-purple-50/70 rounded-2xl p-3 text-xs text-purple-900 space-y-1 border border-purple-100">
                <p className="font-bold text-[11px] uppercase">O que o sistema faz com o relatório:</p>
                {[
                  'Detecta automaticamente colunas padrão Teknisa Odhen',
                  'Separa pratos entregues dos cancelados/devolvidos',
                  'Cruza quantidades vendidas com as fichas técnicas',
                  'Debita insumos com margem de segurança no estoque virtual',
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-[11px]">
                    <CheckCircle className="w-3 h-3 text-purple-600 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROCESSING */}
          {state === 'PROCESSING' && (
            <div className="p-8 flex flex-col items-center gap-5">
              <div className="w-16 h-16 bg-purple-50 rounded-3xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
              <div className="w-full">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Processando relatório Teknisa…</span>
                  <span className="font-bold text-purple-700">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-2 bg-purple-500 rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  {progress < 40
                    ? 'Normalizando colunas e caracteres BR…'
                    : progress < 75
                    ? 'Vinculando vendas às fichas técnicas…'
                    : 'Calculando baixa no estoque virtual…'}
                </p>
              </div>
            </div>
          )}

          {/* PREVIEW */}
          {state === 'PREVIEW' && (
            <div className="p-4 space-y-4">
              {/* Badge Teknisa detectado */}
              <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-bold text-purple-800">
                    Padrão Teknisa Odhen Reconhecido
                  </span>
                </div>
                <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                  {fileName || 'Relatório Importado'}
                </span>
              </div>

              {/* Se for relatório do Dionísio */}
              {isDionisioFile ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-indigo-50 rounded-xl p-2.5 border border-indigo-100">
                      <div className="font-black text-indigo-700 text-base">{dionisioReservations.length}</div>
                      <div className="text-indigo-500 text-[10px] font-semibold">Reservas Totais</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-2.5 border border-purple-100">
                      <div className="font-black text-purple-700 text-base">
                        {dionisioReservations.reduce((acc, r) => acc + r.partySize, 0)}
                      </div>
                      <div className="text-purple-500 text-[10px] font-semibold">PAX / Clientes</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                      <div className="font-black text-emerald-700 text-sm">9.4 ★</div>
                      <div className="text-emerald-500 text-[10px] font-semibold">Média NPS</div>
                    </div>
                  </div>

                  {/* Lista de Reservas */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-wide">
                      Reservas do Turno (Dionísio CRM)
                    </div>
                    <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                      {dionisioReservations.map((r) => (
                        <div key={r.id} className="p-2.5 text-xs flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{r.customerName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {r.time} · Mesa {r.tableNumber || '—'} · {r.partySize} pessoas · via {r.source}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              r.status === 'FINALIZADA'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'NO_SHOW'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Avaliações Dionísio */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-wide">
                      Feedbacks & Avaliações dos Clientes
                    </div>
                    <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                      {dionisioReviews.map((rev) => (
                        <div key={rev.id} className="p-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800">{rev.customerName}</span>
                            <span className="text-amber-500 font-bold">{rev.rating} / 10 ★</span>
                          </div>
                          {rev.comment && (
                            <p className="text-[11px] text-slate-500 italic mt-0.5">&ldquo;{rev.comment}&rdquo;</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : isCancellationFile ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-100">
                      <div className="font-black text-rose-700 text-base">{cancelRecords.length}</div>
                      <div className="text-rose-500 text-[10px] font-semibold">Itens Cancelados</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                      <div className="font-black text-slate-700 text-base">
                        R$ {cancelRecords.reduce((acc, c) => acc + c.totalValue, 0).toFixed(2)}
                      </div>
                      <div className="text-slate-400 text-[10px] font-semibold">Valor Total Perda</div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-wide">
                      Motivos de Cancelamento (Teknisa)
                    </div>
                    <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                      {cancelRecords.map((cr) => (
                        <div key={cr.id} className="p-2.5 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-800">{cr.dishName}</p>
                              <p className="text-[10px] text-slate-400">
                                Pedido #{cr.orderId || '—'} · Mesa {cr.tableNumber || '—'} · Garçom: {cr.waiterName || '—'}
                              </p>
                            </div>
                            <span className="font-bold text-rose-600 text-xs">R$ {cr.totalValue.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[9px] font-bold">
                              {cr.reason}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Insumo Consumido? <strong className={cr.consumptionStatus === 'INSUMO_CONSUMIDO' ? 'text-amber-600' : 'text-emerald-600'}>
                                {cr.consumptionStatus === 'INSUMO_CONSUMIDO' ? 'SIM (Debitar)' : 'NÃO (Não preparado)'}
                              </strong>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Relatório de Vendas */
                <div className="space-y-3">
                  {/* Resumo do Turno */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      <div className="font-black text-slate-800 text-base">{parseResult?.data?.totalItems || 0}</div>
                      <div className="text-slate-400 text-[10px]">itens vendidos</div>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-100">
                      <div className="font-black text-rose-700 text-base">{parseResult?.data?.totalCancelled || 0}</div>
                      <div className="text-rose-400 text-[10px]">cancelados</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                      <div className="font-black text-emerald-700 text-sm">
                        R$ {((parseResult?.data?.totalRevenue || 0) / 1000).toFixed(1)}k
                      </div>
                      <div className="text-emerald-400 text-[10px]">faturamento</div>
                    </div>
                  </div>

                  {/* Impacto Calculado nos Insumos (com margem operacional) */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-wide">
                        Consumo de Insumos Calculado (+{operationalMarginPct}%)
                      </span>
                      <span className="text-[9px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">
                        Fichas Técnicas × Vendas
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                      {calculatedConsumption.map((c) => (
                        <div key={c.item} className="px-3 py-2 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-700 block leading-tight">{c.item}</span>
                            <span className="text-[9px] text-slate-400">Origem: {c.sourceDish}</span>
                          </div>
                          <span className="text-xs font-black text-rose-600 shrink-0">
                            -{c.consumed} {c.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Linhas de Vendas Teknisa */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-wide">
                      Pratos Identificados no Relatório
                    </div>
                    <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                      {parseResult?.data?.lines.map((line) => (
                        <div key={line.id} className="px-3 py-1.5 flex justify-between items-center text-xs">
                          <span className="text-slate-700 truncate mr-2">{line.dishName}</span>
                          <span className="font-bold text-slate-800 shrink-0">
                            {line.qtyDelivered} un · R$ {line.totalRevenue.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DONE */}
          {state === 'DONE' && (
            <div className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base">Vendas Teknisa Integradas!</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  O estoque virtual foi debitado com base nas fichas técnicas e na margem de segurança operacional de +{operationalMarginPct}%.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-black py-3.5 rounded-2xl text-sm transition-colors shadow-md"
              >
                Fechar e Ver Estoque Atualizado
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {state === 'PREVIEW' && (
          <div className="p-4 border-t border-slate-100 shrink-0 flex gap-2 bg-white">
            <button
              onClick={() => setState('IDLE')}
              className="flex-1 border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl text-xs hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="flex-2 bg-purple-700 hover:bg-purple-600 text-white font-black py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-1.5 flex-1 shadow-md transition-colors"
            >
              <span>Confirmar & Debitar Estoque</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
