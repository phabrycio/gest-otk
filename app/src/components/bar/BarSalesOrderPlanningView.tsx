import React, { useState } from 'react';
import {
  Beer,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileText,
  Sparkles,
  ClipboardList,
  Save,
  Send,
  ArrowUpRight,
  Info,
  Droplets,
  Wine,
  RefreshCw,
  Clock,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import {
  BarItemPlanning,
  getBarPlanningItems,
  updatePhysicalStockCount,
  getBarManagerCdaAlerts,
  recordSectorCount
} from '../../services/barSalesOrderAiService';
import { getSession } from '../../services/restaurantStore';

export const BarSalesOrderPlanningView: React.FC = () => {
  const session = getSession();
  const userName = session?.user?.name || 'Pedro';
  const userRole = session?.user?.role || 'CHEFE_BAR';
  const isManagerOrOwner = ['GERENTE', 'GERENTE_TREINAMENTO', 'PROPRIETARIO'].includes(userRole);

  const [items, setItems] = useState<BarItemPlanning[]>(() => getBarPlanningItems());
  const [selectedDay, setSelectedDay] = useState<keyof BarItemPlanning['dailyAverage']>('DOMINGO');
  const [activeTab, setActiveTab] = useState<'PEDIDO_DOMINGO' | 'CONSUMO_DIA' | 'CONTAGEM_FISICA' | 'ALERTAS_GERENTE'>('PEDIDO_DOMINGO');
  const [countedValues, setCountedValues] = useState<Record<string, number>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const managerAlerts = getBarManagerCdaAlerts();

  // Dias da semana
  const DAYS_LIST: Array<{ key: keyof BarItemPlanning['dailyAverage']; label: string; sub: string }> = [
    { key: 'SEGUNDA', label: 'Segunda-feira', sub: 'Abertura de semana' },
    { key: 'TERCA', label: 'Terça-feira', sub: 'Movimento moderado' },
    { key: 'QUARTA', label: 'Quarta-feira', sub: 'Happy hour / Rodízio' },
    { key: 'QUINTA', label: 'Quinta-feira', sub: 'Aquecimento salão' },
    { key: 'SEXTA', label: 'Sexta-feira', sub: 'Pico noturno drinks' },
    { key: 'SABADO', label: 'Sábado', sub: 'Pico almoço e jantar' },
    { key: 'DOMINGO', label: 'Domingo', sub: 'Almoço em família / Fechamento' },
  ];

  const handleStockInputChange = (itemId: string, val: string) => {
    const num = parseFloat(val);
    setCountedValues((prev) => ({
      ...prev,
      [itemId]: isNaN(num) ? 0 : Math.max(0, num),
    }));
  };

  const handleSaveSundayCount = () => {
    const updated = items.map((it) => {
      if (countedValues[it.id] !== undefined) {
        return updatePhysicalStockCount(it.id, countedValues[it.id]) || it;
      }
      return it;
    });

    // Registrar no histórico de contagens por setor
    recordSectorCount(
      'BAR',
      userRole,
      userName,
      items.map((it) => ({
        itemId: it.id,
        itemName: it.name,
        unit: it.unit,
        countedQuantity: countedValues[it.id] ?? it.currentStock,
      }))
    );

    setItems(getBarPlanningItems());
    setSaveSuccessMsg('Contagem física registrada com sucesso! A lista de pedidos para o CDA foi recalculada.');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Topo: Contexto da IA do Bar e Pedido de Domingo */}
      <div className="bg-gradient-to-r from-[#0a2e23] via-[#0d3b2d] to-[#0a2e23] p-5 rounded-2xl border border-emerald-800/80 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black shadow-xs">
                <Beer className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Inteligência de Vendas de Bebidas & Pedidos CDA
              </h2>
            </div>
            <p className="text-xs text-emerald-200/90 mt-1 max-w-2xl leading-relaxed">
              Média de vendas dos últimos 2 meses calculada por dia da semana com <strong>margem de segurança de +10%</strong>.
              A lista de pedidos para a próxima semana é consolidada no domingo de manhã a partir da contagem física em mãos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {managerAlerts.length > 0 && (
              <button
                onClick={() => setActiveTab('ALERTAS_GERENTE')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-sm transition-all cursor-pointer animate-pulse"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{managerAlerts.length} Alerta(s) CDA para o Gerente</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Indicadores Rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-800/60">
          <div className="bg-black/20 p-2.5 rounded-xl border border-white/5">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Itens no Bar</span>
            <span className="text-lg font-black text-white">{items.length} Bebidas</span>
          </div>

          <div className="bg-black/20 p-2.5 rounded-xl border border-white/5">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Margem de Segurança</span>
            <span className="text-lg font-black text-amber-400">+10% Automático</span>
          </div>

          <div className="bg-black/20 p-2.5 rounded-xl border border-white/5">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Dia Oficial do Pedido</span>
            <span className="text-lg font-black text-white">Domingo Manhã</span>
          </div>

          <div className="bg-black/20 p-2.5 rounded-xl border border-white/5">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Demanda vs Teto CDA</span>
            <span className={`text-lg font-black ${managerAlerts.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {managerAlerts.length > 0 ? `${managerAlerts.length} Acima do Teto` : '100% Dentro do Teto'}
            </span>
          </div>
        </div>
      </div>

      {/* Navegação entre as visualizações */}
      <div className="flex bg-white p-1 rounded-xl gap-1 border border-slate-200 shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('PEDIDO_DOMINGO')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'PEDIDO_DOMINGO'
              ? 'bg-[#0a2e23] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
          <span>1. Lista de Pedidos Domingo (CDA)</span>
        </button>

        <button
          onClick={() => setActiveTab('CONSUMO_DIA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'CONSUMO_DIA'
              ? 'bg-[#0a2e23] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span>2. Vendas & Média por Dia da Semana</span>
        </button>

        <button
          onClick={() => setActiveTab('CONTAGEM_FISICA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'CONTAGEM_FISICA'
              ? 'bg-[#0a2e23] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>3. Contagem de Estoque em Mãos</span>
        </button>

        <button
          onClick={() => setActiveTab('ALERTAS_GERENTE')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'ALERTAS_GERENTE'
              ? 'bg-[#0a2e23] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>4. Alertas de Aumento CDA ({managerAlerts.length})</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* ABA 1: LISTA DE PEDIDOS CONSOLIDADA PARA O CDA (DOMINGO DE MANHÃ) */}
      {activeTab === 'PEDIDO_DOMINGO' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Lista de Pedido Semanal do Bar para o CDA (Domingo de Manhã)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cálculo automatizado: <strong>Estoque Máximo CDA - Contagem Atual</strong> = Quantidade exata a pedir.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const text = items
                    .map(
                      (i) =>
                        `${i.name}: Pedir ${i.calculatedOrderQty} ${i.unit} (Estoque Atual: ${i.currentStock} / Teto CDA: ${i.maxStockCda})`
                    )
                    .join('\n');
                  navigator.clipboard.writeText(`PEDIDO CDA - BAR ENGENHO\n\n${text}`);
                  setSaveSuccessMsg('✓ Lista de pedidos para o CDA copiada com sucesso para a área de transferência!');
                  setTimeout(() => setSaveSuccessMsg(null), 3500);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer border border-slate-200"
              >
                Copiar Lista CDA
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/80 rounded-xl border border-dashed border-slate-200 space-y-2">
              <ClipboardList className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700">Nenhuma bebida cadastrada no bar no momento</h4>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                No Dia 1 de operação, cadastre os insumos e bebidas do bar ou registre transferências do CDA para gerar a lista automatizada de reposição.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Bebida / Insumo</th>
                    <th className="py-2.5 px-3">Categoria</th>
                    <th className="py-2.5 px-3 text-center">Teto Máx CDA</th>
                    <th className="py-2.5 px-3 text-center">Contagem Atual</th>
                    <th className="py-2.5 px-3 text-center bg-indigo-50/50">Média Semanal (+10%)</th>
                    <th className="py-2.5 px-3 text-center bg-emerald-50 text-emerald-900">Qtd a Pedir CDA</th>
                    <th className="py-2.5 px-3 text-center">Status CDA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((it) => {
                    return (
                      <tr key={it.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {it.name}
                          <span className="text-[10px] text-slate-400 block font-normal">{it.cdaCode}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold">
                            {it.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                          {it.maxStockCda} {it.unit}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                          {it.currentStock} {it.unit}
                        </td>
                        <td className="py-2.5 px-3 text-center bg-indigo-50/30 font-bold text-indigo-900">
                          {it.weeklyDemandWithSafety} {it.unit}
                        </td>
                        <td className="py-2.5 px-3 text-center bg-emerald-50/50 font-black text-emerald-700 text-sm">
                          {it.calculatedOrderQty} {it.unit}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {it.requiresCdaCapIncrease ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-300">
                              <AlertTriangle className="w-3 h-3" />
                              Aumentar Teto ({it.suggestedNewCdaMax})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Teto Seguro
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ABA 2: VENDAS & MÉDIA POR DIA DA SEMANA (+10% MARGEM) */}
      {activeTab === 'CONSUMO_DIA' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Média de Vendas Diárias (Últimos 2 Meses) + 10% Margem de Segurança
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              A IA calcula exatamente quanto de cada bebida o líder do bar precisa ter disponível por dia da semana para não haver ruptura.
            </p>
          </div>

          {/* Seletor de Dia da Semana */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {DAYS_LIST.map((day) => {
              const isSelected = selectedDay === day.key;
              return (
                <button
                  key={day.key}
                  onClick={() => setSelectedDay(day.key)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0a2e23] text-white border-[#0a2e23] shadow-md ring-2 ring-emerald-500'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
                    {day.label.split('-')[0]}
                  </span>
                  <span className="text-xs font-black block mt-0.5 truncate">{day.label}</span>
                  <span className="text-[9px] opacity-70 block mt-1">{day.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Tabela do Dia Selecionado */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span className="font-bold">
              Visualizando Projeção Diária para: <u>{DAYS_LIST.find((d) => d.key === selectedDay)?.label}</u>
            </span>
            <span className="text-[11px] font-semibold bg-amber-200/80 px-2 py-0.5 rounded">
              Inclui +10% de Reserva Técnica
            </span>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/80 rounded-xl border border-dashed border-slate-200 space-y-2">
              <TrendingUp className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700">Nenhum histórico de consumo diário registrado</h4>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                Conforme as vendas do bar forem registradas pelo Teknisa/PDV, a inteligência calculará automaticamente a média por dia da semana e a margem de segurança de +10%.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Bebida do Bar</th>
                    <th className="py-2.5 px-3">Tipo</th>
                    <th className="py-2.5 px-3 text-center">Média Histórica (2 Meses)</th>
                    <th className="py-2.5 px-3 text-center bg-amber-50 text-amber-950 font-black">
                      Disponibilidade Recomendada (+10%)
                    </th>
                    <th className="py-2.5 px-3">Orientação do Turno</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((it) => {
                    const dayAvg = it.dailyAverage[selectedDay] || 0;
                    const dayWithSafety = Math.ceil(dayAvg * 1.10 * 10) / 10;

                    return (
                      <tr key={it.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{it.name}</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">{it.category}</td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                          {dayAvg} {it.unit}
                        </td>
                        <td className="py-2.5 px-3 text-center bg-amber-50/40 font-black text-amber-900 text-sm">
                          {dayWithSafety} {it.unit}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          Manter pelo menos {dayWithSafety} {it.unit} geladas e prontas para o turno de {selectedDay.toLowerCase()}.
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ABA 3: CONTAGEM DE ESTOQUE EM MÃOS (FEITA PELO LÍDER DO BAR) */}
      {activeTab === 'CONTAGEM_FISICA' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Contagem Física de Estoque em Mãos (Bar & Bebidas)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Realizada no domingo de manhã para confrontar com o teto CDA e gerar o pedido semanal.
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={handleSaveSundayCount}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Contagem & Atualizar Pedido</span>
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/80 rounded-xl border border-dashed border-slate-200 space-y-2">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700">Nenhuma bebida aguardando contagem física</h4>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                Os itens adicionados ao bar aparecerão aqui todos os domingos para a contagem cega em mãos do líder do bar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((it) => {
                const currentVal = countedValues[it.id] !== undefined ? countedValues[it.id] : it.currentStock;

                return (
                  <div key={it.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{it.name}</span>
                        <span className="text-[10px] text-slate-400">Teto CDA: {it.maxStockCda} {it.unit}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {it.unit}
                      </span>
                    </div>

                    <div className="pt-1">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Quantidade Contada em Mãos:
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={currentVal}
                        onChange={(e) => handleStockInputChange(it.id, e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white font-bold"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>Pedido CDA resultante:</span>
                      <span className="font-black text-emerald-700">
                        {Math.max(0, it.maxStockCda - currentVal)} {it.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 4: ALERTAS DE AUMENTO DE ESTOQUE MÁXIMO PARA O GERENTE */}
      {activeTab === 'ALERTAS_GERENTE' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Alertas da IA: Solicitação de Aumento de Estoque Máximo ao CDA
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Quando a média de vendas semanais (+10%) supera o teto autorizado pelo CDA, a IA alerta o gerente para intervir antes da ruptura de estoque.
            </p>
          </div>

          {managerAlerts.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Nenhum item com ruptura prevista</p>
              <p className="text-[11px] text-slate-500">Todos os tetos de estoque máximo do CDA estão adequados ao consumo médio atual.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {managerAlerts.map((alt) => (
                <div
                  key={alt.itemId}
                  className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-rose-600 text-white font-black text-xs">ALERTA CDA</span>
                      <h4 className="text-xs sm:text-sm font-bold text-rose-950">{alt.itemName}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">
                        Teto Atual: <strong className="text-rose-700">{alt.currentCdaMax}</strong> &rarr; Sugerido: <strong className="text-emerald-700">{alt.suggestedNewCdaMax}</strong>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-rose-900 leading-relaxed font-medium">
                    {alt.reason}
                  </p>

                  <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                    <span className="text-rose-700 font-semibold">
                      Demanda Prevista Semanal (+10%): <strong>{alt.weeklyDemandPredicted}</strong>
                    </span>

                    <button
                      onClick={() => {
                        const emailPrompt = `Escreva um e-mail formal para a coordenação do CDA solicitando o aumento de estoque máximo de ${alt.itemName} de ${alt.currentCdaMax} para ${alt.suggestedNewCdaMax} unidades por semana, justificando que a média de vendas dos últimos 2 meses superou a capacidade atual e haverá ruptura de estoque nos finais de semana.`;
                        navigator.clipboard.writeText(emailPrompt);
                        setSaveSuccessMsg(`✓ Prompt copiado para a IA de E-mails! Acesse a aba "Resposta de E-mails IA" para enviar a solicitação de ${alt.itemName} ao CDA.`);
                        setTimeout(() => setSaveSuccessMsg(null), 4500);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Gerar E-mail ao CDA com IA</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
