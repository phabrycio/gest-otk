import { useState, useRef } from 'react';
import { X, Camera, CheckCircle, AlertCircle, Loader2, RefreshCw, Upload, Edit3, Plus, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { extractNfWithGemini, getGeminiApiKey, type ExtractedNfData, type ExtractedNfItem } from '../../services/geminiOcr';

interface NfOcrModalProps {
  onClose: () => void;
  onNfConfirmed?: (data: ExtractedNfData) => void;
}

const EMPTY_NF_DATA: ExtractedNfData = {
  nfNumber: '',
  supplier: '',
  supplierCnpj: '',
  issueDate: new Date().toISOString().slice(0, 10),
  totalValue: 0.00,
  ocrConfidence: 0,
  items: [],
};

type ModalState = 'IDLE' | 'OCR_PROCESSING' | 'REVIEW' | 'CONFIRMED';

export default function NfOcrModal({ onClose, onNfConfirmed }: NfOcrModalProps) {
  const [state, setState] = useState<ModalState>('IDLE');
  const [progress, setProgress] = useState(0);
  const [truckTemp, setTruckTemp] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [nfData, setNfData] = useState<ExtractedNfData>(EMPTY_NF_DATA);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Gerar preview local
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setOcrError(null);
    setState('OCR_PROCESSING');
    setProgress(15);

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 12 : prev));
    }, 200);

    try {
      const extracted = await extractNfWithGemini(file);
      clearInterval(progressTimer);
      setProgress(100);
      setNfData(extracted);
      setTimeout(() => {
        setState('REVIEW');
      }, 300);
    } catch (err: any) {
      clearInterval(progressTimer);
      console.warn('Erro ao processar imagem via Gemini OCR:', err);
      setOcrError(err?.message || 'Falha ao processar a imagem com Gemini OCR. Preencha os campos manualmente.');
      setNfData(EMPTY_NF_DATA);
      setProgress(100);
      setTimeout(() => {
        setState('REVIEW');
      }, 500);
    }
  };

  const startManualEntry = () => {
    setOcrError(null);
    setNfData({
      ...EMPTY_NF_DATA,
      issueDate: new Date().toISOString().slice(0, 10),
      items: [
        {
          id: `item-${Date.now()}`,
          name: '',
          cdaCode: '',
          qty: 1,
          unit: 'kg',
          unitCost: 0,
          totalValue: 0,
          status: 'OK',
        },
      ],
    });
    setState('REVIEW');
  };

  const updateItem = (id: string, field: keyof ExtractedNfItem, value: any) => {
    setNfData((prev) => {
      const newItems = prev.items.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        if (field === 'qty' || field === 'unitCost') {
          updated.totalValue = Number(updated.qty || 0) * Number(updated.unitCost || 0);
        }
        return updated;
      });
      const newTotal = newItems.reduce((acc, it) => acc + (it.totalValue || 0), 0);
      return { ...prev, items: newItems, totalValue: newTotal };
    });
  };

  const removeItem = (id: string) => {
    setNfData((prev) => {
      const newItems = prev.items.filter((it) => it.id !== id);
      const newTotal = newItems.reduce((acc, it) => acc + (it.totalValue || 0), 0);
      return { ...prev, items: newItems, totalValue: newTotal };
    });
  };

  const addItem = () => {
    const newId = String(Date.now());
    const newItem: ExtractedNfItem = {
      id: newId,
      name: 'Novo Insumo',
      qty: 1,
      unit: 'kg',
      unitCost: 0,
      totalValue: 0,
      status: 'OK',
    };
    setNfData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setEditingItemId(newId);
  };

  const confirmEntry = () => {
    if (onNfConfirmed) {
      onNfConfirmed(nfData);
    }
    setState('CONFIRMED');
  };

  const hasApiKey = Boolean(getGeminiApiKey());

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a2e23] to-[#185341] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-black text-sm">Lançar NF de Recebimento</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-200/80">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>OCR via Gemini 1.5 Flash Vision</span>
                {hasApiKey ? (
                  <span className="bg-emerald-500/30 text-emerald-200 px-1 rounded text-[9px] font-bold">CONECTADO</span>
                ) : (
                  <span className="bg-amber-500/30 text-amber-200 px-1 rounded text-[9px] font-bold">CHAVE LOCAL</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* IDLE */}
          {state === 'IDLE' && (
            <div className="p-6 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-amber-300 shadow-sm">
                <Camera className="w-9 h-9 text-amber-500" />
              </div>

              <div className="text-center">
                <h4 className="font-black text-slate-800 text-base">Fotografar Nota Fiscal</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Tire uma foto ou envie a imagem da NF física/DANFE. A IA lê automaticamente todos os itens, quantidades, valores e validades.
                </p>
              </div>

              {/* Doca & Temperatura */}
              <div className="w-full bg-slate-50 rounded-2xl p-3.5 space-y-3 border border-slate-100">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Temperatura do caminhão na doca (°C) <span className="text-[10px] text-slate-400">(Boas Práticas ANVISA)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={truckTemp}
                    onChange={(e) => setTruckTemp(e.target.value)}
                    placeholder="Ex: -4.5 para congelados ou 4.0 para resfriados"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0a2e23]/20 bg-white"
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="w-full space-y-2.5">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all shadow-md shadow-amber-500/20 active:scale-98"
                >
                  <Camera className="w-4 h-4" />
                  Abrir Câmera & Fotografar NF
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    Enviar da Galeria
                  </button>
                  <button
                    onClick={startManualEntry}
                    className="border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    Digitação Manual
                  </button>
                </div>
              </div>

              <div className="w-full space-y-1.5 text-xs text-slate-600 bg-emerald-50/40 border border-emerald-100 rounded-2xl p-3">
                <p className="font-bold text-emerald-800 text-[11px] uppercase tracking-wide">Extração Automatizada:</p>
                {['Número da NF, Fornecedor e CNPJ', 'Lista de itens, lotes e validades', 'Cálculo de custo unitário e total', 'Entrada direta no Estoque Virtual'].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OCR PROCESSING */}
          {state === 'OCR_PROCESSING' && (
            <div className="p-8 flex flex-col items-center gap-5">
              {previewUrl ? (
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-amber-400 relative shadow-md">
                  <img src={previewUrl} alt="NF Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-amber-300 animate-spin" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-200">
                  <Loader2 className="w-9 h-9 text-emerald-600 animate-spin" />
                </div>
              )}

              <div className="w-full text-center">
                <h4 className="font-black text-slate-800 text-sm mb-1">Gemini Vision OCR em Execução</h4>
                <p className="text-xs text-slate-500">Lendo tabela de produtos, quantidades e valores da NF...</p>
              </div>

              <div className="w-full">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Processando imagem</span>
                  <span className="font-bold text-emerald-700">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* REVIEW */}
          {state === 'REVIEW' && (
            <div className="p-4 space-y-4">
              {ocrError ? (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Aviso: Modo de contingência ativado. Você pode revisar e editar os valores abaixo.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 text-xs text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    OCR concluído com {nfData.ocrConfidence}% de precisão. Revise antes de confirmar.
                  </span>
                </div>
              )}

              {/* Dados da NF editáveis */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-slate-700 uppercase tracking-wide text-[10px]">Dados da Nota Fiscal</span>
                  {truckTemp && (
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Doca: {truckTemp}°C
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold">Número da NF</label>
                    <input
                      type="text"
                      value={nfData.nfNumber}
                      onChange={(e) => setNfData({ ...nfData, nfNumber: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold">Data de Emissão</label>
                    <input
                      type="date"
                      value={nfData.issueDate}
                      onChange={(e) => setNfData({ ...nfData, issueDate: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-semibold">Fornecedor / Razão Social</label>
                  <input
                    type="text"
                    value={nfData.supplier}
                    onChange={(e) => setNfData({ ...nfData, supplier: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-slate-700 font-bold">
                  <span>Valor Total da NF:</span>
                  <span className="text-emerald-700 font-black text-sm">
                    R$ {nfData.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Lista de Itens */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-wide">
                    {nfData.items.length} Itens na Nota
                  </p>
                  <button
                    onClick={addItem}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Item
                  </button>
                </div>

                {nfData.items.map((item) => {
                  const isEditing = editingItemId === item.id;
                  return (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-slate-300 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                              className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-bold"
                            />
                          ) : (
                            <p className="text-xs font-bold text-slate-800 leading-tight">{item.name}</p>
                          )}
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.cdaCode || 'Sem código NCM'}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingItemId(isEditing ? null : item.id)}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                            title="Editar item"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"
                            title="Remover item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                        <div className="bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-100">
                          <div className="text-slate-400 font-semibold">Qtd / Unidade</div>
                          {isEditing ? (
                            <div className="flex gap-1 mt-0.5">
                              <input
                                type="number"
                                step="0.1"
                                value={item.qty}
                                onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                className="w-12 bg-white border border-slate-300 rounded px-1 text-xs font-bold"
                              />
                              <span className="font-bold self-center">{item.unit}</span>
                            </div>
                          ) : (
                            <div className="font-bold text-slate-700">{item.qty} {item.unit}</div>
                          )}
                        </div>

                        <div className="bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-100">
                          <div className="text-slate-400 font-semibold">Custo Unitário</div>
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitCost}
                              onChange={(e) => updateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                              className="w-full mt-0.5 bg-white border border-slate-300 rounded px-1 text-xs font-bold"
                            />
                          ) : (
                            <div className="font-bold text-slate-700">R$ {item.unitCost.toFixed(2)}</div>
                          )}
                        </div>

                        <div className="bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-100">
                          <div className="text-slate-400 font-semibold">Subtotal</div>
                          <div className="font-bold text-emerald-700 mt-0.5">
                            R$ {(item.totalValue || (item.qty * item.unitCost)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONFIRMED */}
          {state === 'CONFIRMED' && (
            <div className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center shadow-inner">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base">NF Lançada no Estoque Virtual!</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {nfData.items.length} itens da NF {nfData.nfNumber} ({nfData.supplier}) foram creditados no estoque virtual com rastreabilidade completa.
                </p>
              </div>

              <div className="w-full bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 space-y-1.5 text-xs text-left">
                {nfData.items.map((item) => (
                  <div key={item.id} className="flex justify-between border-b border-emerald-100/50 pb-1 last:border-0 last:pb-0">
                    <span className="text-slate-700 font-medium truncate mr-3">{item.name}</span>
                    <span className="font-bold text-emerald-700 shrink-0">+{item.qty} {item.unit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full bg-[#0a2e23] hover:bg-[#185341] text-white font-black py-3.5 rounded-2xl text-sm transition-colors shadow-md"
              >
                Concluir e Voltar ao Estoque
              </button>
            </div>
          )}
        </div>

        {/* Footer com ações */}
        {state === 'REVIEW' && (
          <div className="p-4 border-t border-slate-100 shrink-0 flex gap-2 bg-white">
            <button
              onClick={() => setState('IDLE')}
              className="flex-1 border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Recarregar Foto
            </button>
            <button
              onClick={confirmEntry}
              className="flex-2 bg-[#0a2e23] hover:bg-[#185341] text-white font-black py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 flex-1 shadow-md transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Confirmar Entrada (+{nfData.items.length} Itens)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
