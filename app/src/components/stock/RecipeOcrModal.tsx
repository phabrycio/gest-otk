import { useState, useRef } from 'react';
import { X, Camera, CheckCircle, Loader2, RefreshCw, ChefHat, Plus, Trash2, Upload, Sparkles, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { extractRecipeWithGemini, getGeminiApiKey, type ExtractedRecipeData, type ExtractedRecipeIngredient } from '../../services/geminiOcr';

interface RecipeOcrModalProps {
  onClose: () => void;
  onRecipeSaved?: (data: ExtractedRecipeData) => void;
}

const EMPTY_RECIPE_DATA: ExtractedRecipeData = {
  dishName: '',
  category: 'PRATO_PRINCIPAL',
  sellingPrice: 0.00,
  yieldQty: 1,
  yieldUnit: 'porção',
  ocrConfidence: 0,
  preparationNotes: '',
  ingredients: [],
};

type ModalState = 'IDLE' | 'OCR_PROCESSING' | 'REVIEW' | 'SAVED';

export default function RecipeOcrModal({ onClose, onRecipeSaved }: RecipeOcrModalProps) {
  const [state, setState] = useState<ModalState>('IDLE');
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [recipeData, setRecipeData] = useState<ExtractedRecipeData>(EMPTY_RECIPE_DATA);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const spreadsheetInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setOcrError(null);
    setState('OCR_PROCESSING');
    setProgress(15);

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 12 : prev));
    }, 200);

    try {
      const extracted = await extractRecipeWithGemini(file);
      clearInterval(progressTimer);
      setProgress(100);
      setRecipeData(extracted);
      setTimeout(() => {
        setState('REVIEW');
      }, 300);
    } catch (err: any) {
      clearInterval(progressTimer);
      console.warn('Erro no OCR da ficha técnica:', err);
      setOcrError(err?.message || 'Falha ao processar a ficha técnica com Gemini Vision. Preencha os campos manualmente.');
      setRecipeData(EMPTY_RECIPE_DATA);
      setProgress(100);
      setTimeout(() => {
        setState('REVIEW');
      }, 400);
    }
  };

  const startManualEntry = () => {
    setOcrError(null);
    setRecipeData({
      ...EMPTY_RECIPE_DATA,
      ingredients: [
        {
          id: `ing-${Date.now()}`,
          itemName: '',
          qty: 1,
          unit: 'kg',
          unitCost: 0,
          prepLossPct: 0,
        },
      ],
    });
    setState('REVIEW');
  };

  const updateIngredient = (id: string, field: keyof ExtractedRecipeIngredient, val: any) => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: val } : ing
      ),
    }));
  };

  const removeIngredient = (id: string) => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i.id !== id),
    }));
  };

  const addIngredient = () => {
    const newIng: ExtractedRecipeIngredient = {
      id: String(Date.now()),
      itemName: 'Novo Ingrediente',
      qty: 0.1,
      unit: 'kg',
      unitCost: 10,
      prepLossPct: 5,
    };
    setRecipeData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIng],
    }));
  };

  // Cálculo de CMV teórico em tempo real
  const totalCmv = recipeData.ingredients.reduce((s, i) => s + i.qty * i.unitCost, 0);
  const cmvPct = recipeData.sellingPrice > 0 ? (totalCmv / recipeData.sellingPrice) * 100 : 0;

  const handleSave = () => {
    if (onRecipeSaved) {
      onRecipeSaved(recipeData);
    }
    setState('SAVED');
  };

  const hasApiKey = Boolean(getGeminiApiKey());

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Inputs ocultos */}
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
      <input
        ref={spreadsheetInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileChange(e as any);
          }
        }}
      />

      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ChefHat className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="font-black text-sm">Cadastrar Ficha Técnica</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-blue-200/90">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>OCR via Gemini Vision · Banco de Fichas Técnicas</span>
                {hasApiKey && (
                  <span className="bg-emerald-500/30 text-emerald-200 px-1 rounded text-[9px] font-bold">CONECTADO</span>
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
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-blue-300">
                <Camera className="w-9 h-9 text-blue-500" />
              </div>

              <div className="text-center">
                <h4 className="font-black text-slate-800 text-base">Digitalizar Ficha Técnica</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Tire uma foto da ficha técnica impressa ou envie uma planilha. A IA extrai o rendimento, gramatura dos insumos e calcula o CMV teórico.
                </p>
              </div>

              <div className="w-full bg-blue-50/60 border border-blue-100 rounded-2xl p-3.5 text-xs text-blue-800 space-y-1.5">
                <p className="font-bold text-[11px] uppercase tracking-wide">O que será estruturado:</p>
                {['Nome e categoria do prato no cardápio', 'Ingredientes, gramaturas e perdas de pré-preparo', 'Cálculo de CMV teórico e margem de contribuição', 'Vinculação direta para baixa automática no estoque'].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              {/* Ações */}
              <div className="w-full space-y-2.5">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all shadow-md shadow-blue-600/20 active:scale-98"
                >
                  <Camera className="w-4 h-4" /> Fotografar Ficha em Papel
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    Enviar Foto/PDF
                  </button>

                  <button
                    onClick={() => spreadsheetInputRef.current?.click()}
                    className="border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                    Planilha Excel/CSV
                  </button>
                </div>

                <button
                  onClick={startManualEntry}
                  className="w-full text-center text-xs text-blue-600 hover:text-blue-800 py-1 font-semibold flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ou clique aqui para digitar a ficha manualmente
                </button>
              </div>
            </div>
          )}

          {/* OCR PROCESSING */}
          {state === 'OCR_PROCESSING' && (
            <div className="p-8 flex flex-col items-center gap-5">
              {previewUrl ? (
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-blue-400 relative shadow-md">
                  <img src={previewUrl} alt="Ficha Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-300 animate-spin" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center border border-blue-200">
                  <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
                </div>
              )}

              <div className="w-full text-center">
                <h4 className="font-black text-slate-800 text-sm mb-1">Gemini Vision Processando Ficha</h4>
                <p className="text-xs text-slate-500">Mapeando ingredientes, gramaturas e perdas de corte...</p>
              </div>

              <div className="w-full">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Estruturando dados</span>
                  <span className="font-bold text-blue-700">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all duration-180"
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
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Modo manual ativado. Você pode ajustar e salvar a ficha técnica abaixo.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-800">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold">Ficha extraída com {recipeData.ocrConfidence}% de precisão.</span>
                </div>
              )}

              {/* Dados Principais */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold">Nome do Prato</label>
                  <input
                    type="text"
                    value={recipeData.dishName}
                    onChange={(e) => setRecipeData({ ...recipeData, dishName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold">Categoria</label>
                    <select
                      value={recipeData.category}
                      onChange={(e) => setRecipeData({ ...recipeData, category: e.target.value as any })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800"
                    >
                      <option value="ENTRADA">Entrada</option>
                      <option value="PRATO_PRINCIPAL">Prato Principal</option>
                      <option value="SOBREMESA">Sobremesa</option>
                      <option value="BEBIDA">Bebida</option>
                      <option value="ACOMPANHAMENTO">Acompanhamento</option>
                      <option value="INSUMO_BASE">Insumo Base (Mise en place)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold">Preço de Venda (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={recipeData.sellingPrice}
                      onChange={(e) => setRecipeData({ ...recipeData, sellingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold">Rendimento</label>
                    <input
                      type="number"
                      value={recipeData.yieldQty}
                      onChange={(e) => setRecipeData({ ...recipeData, yieldQty: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold">Descrição do Rendimento</label>
                    <input
                      type="text"
                      value={recipeData.yieldUnit}
                      onChange={(e) => setRecipeData({ ...recipeData, yieldUnit: e.target.value })}
                      placeholder="Ex: porção (2 pessoas)"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Indicador de CMV Teórico */}
              <div
                className={`rounded-xl p-3 flex items-center justify-between text-xs font-bold border ${
                  cmvPct <= 30
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : cmvPct <= 35
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                <div>
                  <span className="block text-[10px] uppercase tracking-wide opacity-80">CMV Teórico Calculado</span>
                  <span className="text-sm font-black">R$ {totalCmv.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wide opacity-80">Meta &lt; 32%</span>
                  <span className="text-sm font-black">{cmvPct.toFixed(1)}% do Preço</span>
                </div>
              </div>

              {/* Lista de Ingredientes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-wide">
                    {recipeData.ingredients.length} Insumos na Receita
                  </p>
                  <button
                    onClick={addIngredient}
                    className="text-[11px] text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Insumo
                  </button>
                </div>

                {recipeData.ingredients.map((ing) => (
                  <div key={ing.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-slate-300 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <input
                        type="text"
                        value={ing.itemName}
                        onChange={(e) => updateIngredient(ing.id, 'itemName', e.target.value)}
                        className="flex-1 font-bold text-xs text-slate-800 border-b border-transparent focus:border-blue-400 focus:outline-none"
                      />
                      <button
                        onClick={() => removeIngredient(ing.id)}
                        className="p-1 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                      <div className="bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-100">
                        <div className="text-slate-400 font-semibold">Qtd / Un</div>
                        <div className="flex gap-1 mt-0.5">
                          <input
                            type="number"
                            step="0.01"
                            value={ing.qty}
                            onChange={(e) => updateIngredient(ing.id, 'qty', parseFloat(e.target.value) || 0)}
                            className="w-12 bg-white border border-slate-300 rounded px-1 text-xs font-bold"
                          />
                          <span className="font-bold self-center">{ing.unit}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-100">
                        <div className="text-slate-400 font-semibold">Custo R$/un</div>
                        <input
                          type="number"
                          step="0.1"
                          value={ing.unitCost}
                          onChange={(e) => updateIngredient(ing.id, 'unitCost', parseFloat(e.target.value) || 0)}
                          className="w-full mt-0.5 bg-white border border-slate-300 rounded px-1 text-xs font-bold"
                        />
                      </div>

                      <div className="bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-100">
                        <div className="text-slate-400 font-semibold">Perda Pré-preparo</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type="number"
                            value={ing.prepLossPct}
                            onChange={(e) => updateIngredient(ing.id, 'prepLossPct', parseFloat(e.target.value) || 0)}
                            className="w-10 bg-white border border-slate-300 rounded px-1 text-xs font-bold"
                          />
                          <span className="font-bold text-slate-500">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SAVED */}
          {state === 'SAVED' && (
            <div className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base">Ficha Técnica Salva!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  &quot;{recipeData.dishName}&quot; foi cadastrada com {recipeData.ingredients.length} insumos e CMV teórico de R$ {totalCmv.toFixed(2)} ({cmvPct.toFixed(1)}%).
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-2xl text-sm transition-colors shadow-md"
              >
                Concluir e Fechar
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
              <RefreshCw className="w-4 h-4" /> Recarregar
            </button>
            <button
              onClick={handleSave}
              className="flex-2 bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 flex-1 shadow-md transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Salvar Ficha Técnica
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
