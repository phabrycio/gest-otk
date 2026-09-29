import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  Snowflake,
  UtensilsCrossed,
  Wine,
  AlertTriangle,
  Package,
  Layers,
  CheckCircle2,
  Copy,
  Download,
  Info,
  DollarSign,
  ShieldAlert,
  Flame,
  UserCheck,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import {
  WEEK_DAYS,
  WeekDay,
  getPredictionForDay,
  INITIAL_CDA_MAX_STOCK_ITEMS,
  COMMISSIONER_AUDIT_DATA,
  CdaItemMaxStock,
} from '../services/predictive12WeeksStore';

interface WeeklySalesPredictionViewProps {
  onOpenCopilot?: (prompt?: string) => void;
}

export const WeeklySalesPredictionView: React.FC<WeeklySalesPredictionViewProps> = ({ onOpenCopilot }) => {
  const [selectedDay, setSelectedDay] = useState<WeekDay>('SEGUNDA');
  const [activeTab, setActiveTab] = useState<'DEGELO' | 'MISE_EN_PLACE' | 'BAR' | 'PEDIDO_CDA' | 'AUDITORIA_IA'>('DEGELO');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Dados calculados para o dia da semana selecionado
  const prediction = getPredictionForDay(selectedDay);

  // Lista de itens para pedido do CDA
  const cdaItems = INITIAL_CDA_MAX_STOCK_ITEMS;
  const totalCdaOrderCost = cdaItems.reduce((acc, curr) => acc + curr.totalOrderCost, 0);
  const totalCdaItemsToOrder = cdaItems.filter((i) => i.orderQuantity > 0).length;

  const handleCopyCdaOrder = () => {
    let text = `📦 ORDEM DE COMPRA CDA - ENGENHO MANAUARA\n`;
    text += `Metodologia: Estoque Máximo da Unidade (-) Estoque Atual Virtual\n`;
    text += `Data da Requisição: ${new Date().toLocaleDateString('pt-BR')}\n\n`;

    cdaItems.forEach((item, index) => {
      text += `${index + 1}. [${item.code}] ${item.name}\n`;
      text += `   Estoque Máx: ${item.maxStock} ${item.unit} | Estoque Atual: ${item.currentStock} ${item.unit}\n`;
      text += `   ➡️ PEDIR AO CDA: ${item.orderQuantity} ${item.unit} (R$ ${item.totalOrderCost.toFixed(2)})\n\n`;
    });

    text += `TOTAL ESTIMADO DO PEDIDO: R$ ${totalCdaOrderCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    text += `Status: Aprovado pela Gerência Geral\n`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Cérebro da Gestão IA & Explicação Metodológica */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Cérebro da Gestão IA &bull; Inteligência Preditiva de 12 Semanas</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Planejamento Diário & Estoque Máximo do CDA
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Análise estatística baseada na <strong>mediana de vendas das últimas 12 semanas</strong> para cada dia específico.
              A mediana previne distorções causadas por picos anômalos. Em seguida, o sistema adiciona automaticamente uma{' '}
              <strong className="text-emerald-300">+20% de margem de segurança</strong> para absorver flutuações e eliminar rupturas de estoque ou desperdícios de mise en place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenCopilot && onOpenCopilot('Hoje é dia de pedidos para o CDA, faça uma lista de pedidos baseado em nosso estoque mínimo e nosso estoque máximo, baseado em nosso estoque atual.')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Perguntar ao Cérebro IA</span>
            </button>
          </div>
        </div>

        {/* Resumo Rápido dos Pilares Operacionais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-indigo-800/40 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Mediana 12 Semanas</p>
              <p className="text-slate-400">Elimina outliers e eventos fora da curva</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">+20% Margem de Segurança</p>
              <p className="text-slate-400">Garante mise en place sem risco de ruptura</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Fórmula CDA Estrita</p>
              <p className="text-slate-400">Pedido = Estoque Máx (-) Estoque Atual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor dos 7 Dias da Semana */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            Selecione o Dia para Análise Histórica & Degelo:
          </span>
          <span className="text-xs text-slate-400">
            Amostra: 12 {selectedDay.toLowerCase()}s passadas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {WEEK_DAYS.map((day) => {
            const isSelected = selectedDay === day.dayName;
            return (
              <button
                key={day.dayName}
                onClick={() => setSelectedDay(day.dayName)}
                className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="text-xs font-extrabold">{day.dayLabel}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  12 semanas auditadas
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini-Cockpit do Dia Selecionado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Faturamento Mediano</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            R$ {prediction.medianRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Base: 12 {prediction.dayLabel.toLowerCase()}s
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Fluxo Mediano de Clientes</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {prediction.medianPax} PAX
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Média por mesa: ~3.4 pessoas
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Itens em Degelo Crítico</span>
            <Snowflake className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-700 mt-1">
            {prediction.thawList.length} Insumos
          </div>
          <p className="text-[11px] text-sky-600 font-medium mt-1">
            Com margem +20% inclusa
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Previsão Chopp Brahma</span>
            <Wine className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {prediction.barPreparation.choppBrahmaLitersWithBuffer} L
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ~{prediction.barPreparation.recommendedKegs} Barril(is) de 50L
          </p>
        </div>
      </div>

      {/* Navegação entre Visões Especializadas */}
      <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex items-center justify-center overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('DEGELO')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'DEGELO'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Snowflake className="w-4 h-4 text-sky-600" />
          <span>Degelo do Dia (+20%)</span>
        </button>

        <button
          onClick={() => setActiveTab('MISE_EN_PLACE')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'MISE_EN_PLACE'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 text-orange-600" />
          <span>Mise en Place & Entradas</span>
        </button>

        <button
          onClick={() => setActiveTab('BAR')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'BAR'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Wine className="w-4 h-4 text-purple-600" />
          <span>Preparo do Bar</span>
        </button>

        <button
          onClick={() => setActiveTab('PEDIDO_CDA')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'PEDIDO_CDA'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Package className="w-4 h-4 text-indigo-600" />
          <span>Lista Máxima Pedido CDA</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDITORIA_IA')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'AUDITORIA_IA'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Auditoria IA de Comissários</span>
        </button>
      </div>

      {/* CONTEÚDO 1: GUIA DE DEGELO DA COZINHA */}
      {activeTab === 'DEGELO' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-sky-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-sky-600" />
                <span>Degelo Recomendado para {prediction.dayLabel}</span>
              </h3>
              <p className="text-xs text-slate-600">
                Retirar da câmara de congelados (-18°C) para desgelo lento na câmara de resfriados (0° a 4°C).
                Margem de segurança de +20% já calculada sobre a mediana das últimas 12 semanas.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-sky-200 rounded-lg text-xs font-semibold text-sky-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{prediction.thawList.length} itens calculados</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Insumo Bruto para Degelo</th>
                  <th className="py-3 px-4 text-center">Mediana 12 Sem.</th>
                  <th className="py-3 px-4 text-center text-emerald-700 bg-emerald-50/50">+20% Margem</th>
                  <th className="py-3 px-4 text-right font-black text-sky-900">Total a Degelar</th>
                  <th className="py-3 px-4">Pratos que Utilizam</th>
                  <th className="py-3 px-4">Procedimento Seguro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prediction.thawList.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-sky-500" />
                      {item.ingredientName}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 font-medium">
                      {item.medianDishQuantity} porções
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-emerald-50/30">
                      {item.safetyBufferQuantity} porções
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block py-1 px-2.5 rounded-lg bg-sky-100 text-sky-900 font-extrabold text-sm">
                        {item.totalKgToThaw} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex flex-wrap gap-1">
                        {item.associatedDishes.map((d, dIdx) => (
                          <span key={dIdx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px]">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] italic">
                      {item.instructions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p>
              <strong>Por que a margem de 20%?</strong> Em dias de pico ou mesas extras não programadas, a equipe de cozinha não precisará recorrer ao descongelamento rápido em micro-ondas ou água corrente, mantendo a conformidade rígida com os padrões da ANVISA e evitando queixas de textura ou perda de suculência nas carnes e peixes.
            </p>
          </div>
        </div>
      )}

      {/* CONTEÚDO 2: MISE EN PLACE & PORCIONAMENTO */}
      {activeTab === 'MISE_EN_PLACE' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-orange-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                <span>Mise en Place & Produção Diária ({prediction.dayLabel})</span>
              </h3>
              <p className="text-xs text-slate-600">
                Quantidades exatas a serem pré-porcionadas e preparadas para atender o serviço sem ruptura de estoque.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-orange-200 rounded-lg text-xs font-semibold text-orange-800">
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <span>Base: Mediana + 20%</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item de Venda / Mise en Place</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4 text-center">Mediana Histórica</th>
                  <th className="py-3 px-4 text-center font-black text-orange-900 bg-orange-50/50">Produzir no Dia (+20%)</th>
                  <th className="py-3 px-4">Praça Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prediction.miseEnPlaceList.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.dishName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-semibold">
                      {item.medianSales12Weeks} porções
                    </td>
                    <td className="py-3 px-4 text-center font-black text-orange-950 bg-orange-50/30">
                      <span className="inline-block py-1 px-3 rounded-lg bg-orange-100 text-orange-900 text-sm font-black">
                        {item.recommendedPortionsWith20Pct} porções
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md font-semibold text-slate-700 text-[11px]">
                        {item.prepStation.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO 3: PREPARO DO BAR & BEBIDAS */}
      {activeTab === 'BAR' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                <Wine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Planejamento e Preparação do Bar ({prediction.dayLabel})
                </h3>
                <p className="text-xs text-slate-500">
                  Mediana de 12 semanas cruzada com fichas técnicas de coquetelaria e volume de chopeiras.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Chopp Brahma */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-900">Chopp Brahma 50L</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded">
                    Chopeiras
                  </span>
                </div>
                <div className="text-3xl font-black text-amber-950">
                  {prediction.barPreparation.recommendedKegs} Barris
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>• Mediana 12 semanas: <strong>{prediction.barPreparation.choppBrahmaLitersSoldMedian} Litros</strong></p>
                  <p>• Com margem de +20%: <strong>{prediction.barPreparation.choppBrahmaLitersWithBuffer} Litros</strong></p>
                  <p className="text-[11px] text-amber-800 italic mt-2">
                    Deixar 1 barril em repouso na câmara fria a 1°C para engate rápido durante o pico de salão.
                  </p>
                </div>
              </div>

              {/* Caipirinhas & Coquetéis */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-emerald-900">Caipirinhas de Jambu</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2 py-0.5 rounded">
                    Coquetelaria
                  </span>
                </div>
                <div className="text-3xl font-black text-emerald-950">
                  {prediction.barPreparation.caipirinhasMedianWithBuffer} Doses
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>• Cachaça de Jambu: <strong>{prediction.barPreparation.cachaçaJambuBottles} garrafas</strong></p>
                  <p>• Limões Taiti Cortados: <strong>{prediction.barPreparation.limePortionsCut} porções</strong></p>
                  <p className="text-[11px] text-emerald-800 italic mt-2">
                    Pré-cortar limões em cubos sem o miolo branco para evitar amargor na coqueteleira.
                  </p>
                </div>
              </div>

              {/* Outros Insumos Críticos */}
              <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-sky-900">Gelo & Xaropes</span>
                  <span className="text-[10px] bg-sky-200 text-sky-900 font-extrabold px-2 py-0.5 rounded">
                    Mise en Place
                  </span>
                </div>
                <div className="text-3xl font-black text-sky-950">
                  45 kg Gelo
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>• Gelo em cubos cristal: <strong>3 sacos de 15kg</strong></p>
                  <p>• Xarope de açúcar 1:1: <strong>2 litros prontos</strong></p>
                  <p className="text-[11px] text-sky-800 italic mt-2">
                    Garante abastecimento contínuo das 2 cubas do balcão principal e deck externo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO 4: LISTA DE ESTOQUE MÁXIMO DE PEDIDO AO CDA */}
      {activeTab === 'PEDIDO_CDA' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
          <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
                <Package className="w-3.5 h-3.5" />
                <span>Regra Corporativa: Pedido = Estoque Máximo - Estoque Atual</span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Ordem de Compra & Abastecimento Semanal do CDA
              </h3>
              <p className="text-slate-300 text-xs max-w-2xl">
                Alimentado pelo estoque virtual com base nas transferências anteriores do CDA, contagens in loco e baixas diárias automáticas por ficha técnica.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCdaOrder}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSuccess ? 'Copiado!' : 'Copiar Ordem do CDA'}</span>
              </button>
            </div>
          </div>

          {/* Destaque do Exemplo do Usuário (Arroz 60kg vs 13kg) */}
          <div className="p-4 bg-amber-50/70 border-b border-amber-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-700">
              <p className="font-bold text-amber-950">
                Regra Aplicada em Tempo Real (Exemplo do Arroz Parboilizado):
              </p>
              <p className="text-slate-600 mt-0.5">
                "O estoque máximo do arroz para a nossa unidade é <strong>60 kg</strong>. Na contagem in loco/virtual havia apenas <strong>13 kg</strong>.
                Portanto, a quantidade exata a entrar na lista de pedidos ao CDA é <strong>47 kg</strong> (60 - 13)."
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Código & Insumo</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4 text-center">Estoque Máximo CDA</th>
                  <th className="py-3 px-4 text-center">Estoque Atual (Virtual)</th>
                  <th className="py-3 px-4 text-center font-black text-indigo-900 bg-indigo-50/60">Qtd. a Pedir ao CDA</th>
                  <th className="py-3 px-4 text-right">Custo Estimado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cdaItems.map((item) => {
                  const isRiceExample = item.code === 'CDA-SEC-01';
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isRiceExample ? 'bg-amber-50/30 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {item.name}
                          {isRiceExample && (
                            <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 text-[10px] rounded font-bold">
                              Exemplo
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.code}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {item.maxStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-center bg-indigo-50/30">
                        <span className="inline-block py-1 px-3 rounded-lg bg-indigo-600 text-white font-extrabold text-sm shadow-xs">
                          {item.orderQuantity} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        R$ {item.totalOrderCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-600">
              Total de <strong>{totalCdaItemsToOrder} itens</strong> a serem requisitados na remessa do CDA desta semana.
            </div>
            <div className="text-base font-black text-slate-900">
              Total Orçado: <span className="text-indigo-600">R$ {totalCdaOrderCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO 5: AUDITORIA IA DE COMISSÁRIOS & TAXA DE 10% */}
      {activeTab === 'AUDITORIA_IA' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-rose-900/90 to-slate-900 border border-rose-800 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 text-xs font-semibold">
                  <span>Alerta de Auditoria Disciplinar &bull; Cérebro IA Ativo</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Detecção de Anomalia Crítica: Cancelamento Excessivo da Taxa de Serviço (10%)
                </h3>
                <p className="text-rose-100 text-xs max-w-3xl leading-relaxed">
                  A IA cruzou os relatórios de fechamento de comanda por comissário com o log auditável do sistema.
                  Foi identificado um desvio estatístico severo em um dos colaboradores do salão.
                </p>
              </div>
            </div>
          </div>

          {/* Lista de Comissários Auditados */}
          <div className="grid grid-cols-1 gap-4">
            {COMMISSIONER_AUDIT_DATA.map((com) => {
              const isAnomaly = com.isAnomaly;
              return (
                <div
                  key={com.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                    isAnomaly ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                          isAnomaly ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {com.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{com.name}</h4>
                          <span className="text-xs text-slate-500">({com.role})</span>
                          {isAnomaly && (
                            <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded-full">
                              ALERTA DE ANOMALIA
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {com.tablesServedCount} mesas atendidas &bull; R$ {com.totalGrossSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} faturados
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Taxa Cancelada</span>
                        <span className={`font-black ${isAnomaly ? 'text-rose-700 text-base' : 'text-slate-700'}`}>
                          R$ {com.serviceFee10PctCancelled.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Taxa de Cancelamento</span>
                        <span className={`font-black text-base ${isAnomaly ? 'text-rose-700' : 'text-emerald-700'}`}>
                          {com.cancellationRatePct}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes do Parecer da IA */}
                  <div
                    className={`mt-4 p-3.5 rounded-xl text-xs ${
                      isAnomaly ? 'bg-rose-50 border border-rose-200 text-rose-900' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    <p className="font-bold flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Parecer Investigativo do Cérebro IA:
                    </p>
                    <p className="leading-relaxed">{com.auditReason}</p>

                    {isAnomaly && (
                      <div className="mt-3 pt-2.5 border-t border-rose-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-rose-800">
                          Média da Brigada: apenas {com.brigadeAverageRatePct}% de cancelamento
                        </span>
                        <button
                          onClick={() => onOpenCopilot && onOpenCopilot('O comissário Paulo teve um aumento expressivo no cancelamento de taxas no período. O que a gerência deve fazer?')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Abrir Investigação com Copilot IA</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
