import React, { useState, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  Search, 
  ChefHat, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Scale, 
  Boxes,
  CheckCircle2,
  Fish,
  Flame,
  Wine,
  IceCream,
  CircleDot
} from 'lucide-react';
import { 
  OFFICIAL_ENGENHO_MENU, 
  DishItem, 
  getMenuStats, 
  getAllIngredientsSummary,
  IngredientSummary 
} from '../data/menuRecipesData';

interface TechnicalRecipesViewProps {
  onOpenCopilot?: (prompt?: string) => void;
}

export const TechnicalRecipesView: React.FC<TechnicalRecipesViewProps> = ({ onOpenCopilot }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDishId, setExpandedDishId] = useState<string | null>('dish-01');
  const [activeTab, setActiveTab] = useState<'DISHES' | 'INGREDIENTS_MASTER'>('DISHES');

  const stats = useMemo(() => getMenuStats(), []);
  const allIngredients = useMemo<IngredientSummary[]>(() => getAllIngredientsSummary(), []);

  // Categorias disponíveis
  const categories = [
    { id: 'ALL', label: 'Todos os Pratos', icon: UtensilsCrossed },
    { id: 'EXECUTIVO', label: 'Menu Executivo', icon: Clock },
    { id: 'PESCADOS_AMAZONIA', label: 'Pescados da Amazônia', icon: Fish },
    { id: 'CARNES_BRASIL', label: 'Carnes & Brasa', icon: Flame },
    { id: 'ENTRADAS_PETISCOS', label: 'Entradas & Petiscos', icon: CircleDot },
    { id: 'MASSAS_RISOTOS', label: 'Massas, Risotos & Pizzas', icon: ChefHat },
    { id: 'SOBREMESAS', label: 'Sobremesas', icon: IceCream },
    { id: 'BEBIDAS_DRINKS', label: 'Drinks & Chopp', icon: Wine },
    { id: 'VINHOS_ESPUMANTES', label: 'Carta de Vinhos', icon: Sparkles },
    { id: 'CHARCUTARIA', label: 'Charcutaria', icon: Layers },
  ];

  // Filtro de pratos
  const filteredDishes = useMemo(() => {
    return OFFICIAL_ENGENHO_MENU.filter((dish: DishItem) => {
      const matchesCat = selectedCategory === 'ALL' || dish.category === selectedCategory;
      const matchesSearch = 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Filtro do catálogo de insumos
  const filteredIngredients = useMemo<IngredientSummary[]>(() => {
    if (!searchQuery.trim()) return allIngredients;
    return allIngredients.filter((ing: IngredientSummary) => 
      ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.dishesUsedIn.some((d: string) => d.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allIngredients, searchQuery]);

  const toggleExpand = (dishId: string) => {
    setExpandedDishId(prev => (prev === dishId ? null : dishId));
  };

  const getOriginBadge = (origin: 'CDA_MATRIZ' | 'FEIRA_PANAIR' | 'DISTRIBUIDOR_LOCAL') => {
    switch (origin) {
      case 'CDA_MATRIZ':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">CDA Matriz</span>;
      case 'FEIRA_PANAIR':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Feira Panair (Fundo Fixo)</span>;
      case 'DISTRIBUIDOR_LOCAL':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Distribuidor Local Manaus</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Informativo & KPI Bar */}
      <div className="bg-gradient-to-br from-[#0a2e23] via-[#0d3b2d] to-[#134e3a] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold tracking-wider uppercase border border-amber-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Fichas Técnicas Homologadas
                </span>
                <span className="text-xs text-emerald-200/70 font-medium">Unidade Shopping Ponta Negra</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                Cardápio Oficial & Engenharia de Insumos
              </h2>
              <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
                Padronização de porções, fichas de rendimento, alérgenos e controle rigoroso de CMV de todos os pratos regionais e clássicos – Tk Gestão e Tecnologia.
              </p>
            </div>

            <button
              onClick={() => onOpenCopilot?.("Analise a engenharia de cardápio do Engenho Ponta Negra, identifique quais pratos possuem o maior CMV e sugira melhorias nas negociações com o CDA e Panair.")}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0a2e23] font-bold text-xs transition-all shadow-md flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0a2e23]" />
              <span>Auditar CMV com IA</span>
            </button>
          </div>

          {/* Cards de Métricas Principais */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-200/80 font-medium">Pratos Ativos no Sistema</p>
              <p className="text-xl font-bold text-white mt-0.5">{stats.totalDishes} Pratos</p>
              <p className="text-[10px] text-emerald-300/70 mt-1">100% com ficha técnica cadastrada</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-200/80 font-medium">CMV Médio Ponderado</p>
              <p className="text-xl font-bold text-amber-300 mt-0.5">{stats.averageCmv.toFixed(1)}%</p>
              <p className="text-[10px] text-emerald-300/70 mt-1">Meta corporativa: ≤ 27.5%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-200/80 font-medium">Insumos Mapeados</p>
              <p className="text-xl font-bold text-white mt-0.5">{stats.totalUniqueIngredients} Itens</p>
              <p className="text-[10px] text-emerald-300/70 mt-1">CDA Matriz, Panair & Local</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <p className="text-[11px] text-emerald-200/80 font-medium">Margem Média / Prato</p>
              <p className="text-xl font-bold text-emerald-300 mt-0.5">R$ {stats.averageMarginReais.toFixed(2)}</p>
              <p className="text-[10px] text-emerald-300/70 mt-1">Contribuição direta bruta</p>
            </div>
          </div>
        </div>
      </div>

      {/* Switch de Visão: Pratos / Catálogo Mestre de Insumos */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('DISHES')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'DISHES'
                ? 'bg-[#0a2e23] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Fichas dos Pratos ({stats.totalDishes})</span>
          </button>
          <button
            onClick={() => setActiveTab('INGREDIENTS_MASTER')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'INGREDIENTS_MASTER'
                ? 'bg-[#0a2e23] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Catálogo Mestre de Insumos ({stats.totalUniqueIngredients})</span>
          </button>
        </div>

        {/* Input de Busca */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'DISHES' ? "Buscar prato ou insumo (ex: jambu)..." : "Buscar insumo específico..."}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0a2e23]/20 focus:border-[#0a2e23]"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: FICHAS TÉCNICAS DOS PRATOS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'DISHES' && (
        <div className="space-y-4">
          {/* Seletor de Categorias */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Listagem de Pratos */}
          <div className="grid grid-cols-1 gap-4">
            {filteredDishes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Nenhum prato encontrado</p>
                <p className="text-xs text-slate-400">Tente buscar por outro termo ou selecione 'Todos os Pratos'.</p>
              </div>
            ) : (
              filteredDishes.map((dish) => {
                const isExpanded = expandedDishId === dish.id;
                const isCmvHealthy = dish.cmvPct <= dish.targetCmvPct;

                return (
                  <div
                    key={dish.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                      isExpanded ? 'border-[#0a2e23]/30 ring-2 ring-[#0a2e23]/5' : 'border-slate-200/80'
                    }`}
                  >
                    {/* Header do Card do Prato */}
                    <div 
                      onClick={() => toggleExpand(dish.id)}
                      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs relative">
                          {dish.imageUrl ? (
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-full h-full object-cover rounded-xl transition-transform hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-[#0a2e23]">
                              {dish.category === 'PESCADOS_AMAZONIA' && <Fish className="w-6 h-6 text-emerald-700" />}
                              {dish.category === 'CARNES_BRASIL' && <Flame className="w-6 h-6 text-amber-700" />}
                              {dish.category === 'ENTRADAS_PETISCOS' && <CircleDot className="w-6 h-6 text-orange-700" />}
                              {dish.category === 'MASSAS_RISOTOS' && <ChefHat className="w-6 h-6 text-yellow-700" />}
                              {dish.category === 'SOBREMESAS' && <IceCream className="w-6 h-6 text-pink-700" />}
                              {dish.category === 'BEBIDAS_DRINKS' && <Wine className="w-6 h-6 text-purple-700" />}
                              {dish.category === 'VINHOS_ESPUMANTES' && <Wine className="w-6 h-6 text-rose-700" />}
                              {dish.category === 'EXECUTIVO' && <Clock className="w-6 h-6 text-blue-700" />}
                              {dish.category === 'CHARCUTARIA' && <Layers className="w-6 h-6 text-amber-800" />}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 font-serif">{dish.name}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              {dish.categoryLabel}
                            </span>
                            {dish.subcategory && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                {dish.subcategory}
                              </span>
                            )}
                            {dish.isRegionalAmazonico && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                🌿 Regional Manaus
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                            {dish.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> Boqueta: {dish.prepTimeMinutes} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Scale className="w-3 h-3 text-slate-400" /> Porção: {dish.portionWeightGrams}g
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3 text-slate-400" /> {dish.ingredients.length} insumos
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dados Financeiros e CMV */}
                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Preço Venda</p>
                          <p className="text-base font-bold text-slate-900">R$ {dish.sellingPrice.toFixed(2)}</p>
                          <p className="text-[10px] text-slate-500">Custo: R$ {dish.totalCost.toFixed(2)}</p>
                        </div>

                        <div className="text-right pl-3 border-l border-slate-200">
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">CMV Real / Meta</p>
                          <div className="flex items-center justify-end gap-1.5">
                            <span className={`text-base font-black ${isCmvHealthy ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {dish.cmvPct.toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-slate-400">/ {dish.targetCmvPct}%</span>
                          </div>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded-sm ${
                            isCmvHealthy ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {isCmvHealthy ? 'No Alvo' : 'Atenção CMV'}
                          </span>
                        </div>

                        <div className="p-1 rounded-full bg-slate-100 text-slate-600">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Detalhamento da Ficha Técnica Aberta */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-6 space-y-5 animate-fade-in">
                        {dish.imageUrl && (
                          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-full sm:w-48 h-36 object-cover rounded-lg border border-slate-200 shadow-xs shrink-0"
                            />
                            <div className="space-y-1.5 flex-1 text-left w-full">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                                {dish.majorCategory || 'Menu Oficial'} &bull; {dish.subcategory || dish.categoryLabel}
                              </span>
                              <h4 className="text-base font-serif font-bold text-slate-900">{dish.name}</h4>
                              <p className="text-xs text-slate-600 leading-relaxed">{dish.description}</p>
                            </div>
                          </div>
                        )}
                        {/* Alérgenos e Destaques */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="font-semibold text-slate-700">Alérgenos Declarados:</span>
                            <div className="flex flex-wrap gap-1">
                              {dish.allergens.map((alg, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                                  {alg}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-3">
                            <span>Margem Contribuição Bruta: <strong className="text-emerald-700 font-bold">R$ {dish.marginContributionReais.toFixed(2)}</strong></span>
                            <span>Markup Multiplicador: <strong className="text-slate-800 font-bold">{(dish.sellingPrice / dish.totalCost).toFixed(2)}x</strong></span>
                          </div>
                        </div>

                        {/* Tabela Detalhada de Insumos da Receita */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                          <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ChefHat className="w-4 h-4 text-[#0a2e23]" />
                              <span className="text-xs font-bold text-slate-800">Composição de Insumos & Gramaturas Homologadas</span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {dish.ingredients.length} insumos listados
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  <th className="py-2.5 px-4">Insumo / Ingrediente</th>
                                  <th className="py-2.5 px-3">Origem / Fornecedor</th>
                                  <th className="py-2.5 px-3 text-right">Qtd. Porção</th>
                                  <th className="py-2.5 px-3 text-right">Custo Unitário</th>
                                  <th className="py-2.5 px-4 text-right">Custo no Prato</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {dish.ingredients.map((ing) => (
                                  <tr key={ing.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-2.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#0a2e23]" />
                                      <span>{ing.name}</span>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      {getOriginBadge(ing.supplierOrigin)}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-900">
                                      {ing.quantity} {ing.unit}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                                      R$ {ing.unitCost.toFixed(3)} /{ing.unit}
                                    </td>
                                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                                      R$ {ing.totalCost.toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="bg-slate-100/90 font-bold border-t border-slate-200 text-slate-900">
                                  <td colSpan={4} className="py-2.5 px-4 text-right text-xs">
                                    Custo Total de Insumos (Custo Boqueta):
                                  </td>
                                  <td className="py-2.5 px-4 text-right font-mono text-sm text-[#0a2e23]">
                                    R$ {dish.totalCost.toFixed(2)}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>

                        {/* Ações Rápidas de Gestão da Ficha Técnica */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Ficha auditada conforme Procedimento Operacional Padrão (POP-PROD-01)</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onOpenCopilot?.(`Explique a ficha técnica do prato ${dish.name} do Engenho Ponta Negra, detalhando cada insumo e como manter o CMV em ${dish.targetCmvPct}%.`)}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-medium text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>Pedir Instruções ao Copiloto</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: CATÁLOGO MESTRE DE INSUMOS DO RESTAURANTE                           */}
      {/* ========================================================================= */}
      {activeTab === 'INGREDIENTS_MASTER' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-[#0a2e23]" />
                  <span>Matriz Geral de Insumos & Origem de Abastecimento</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lista consolidada de todos os insumos consumidos nos pratos do Engenho Ponta Negra e onde são comprados.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                {filteredIngredients.length} Insumos Listados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Nome do Insumo</th>
                    <th className="py-3 px-3">Canal de Compras</th>
                    <th className="py-3 px-3 text-right">Custo Referência</th>
                    <th className="py-3 px-4">Pratos que Utilizam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredIngredients.map((item: IngredientSummary, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.name}
                      </td>
                      <td className="py-3 px-3">
                        {getOriginBadge(item.origin)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                        R$ {item.unitCost.toFixed(3)} /{item.unit}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.dishesUsedIn.map((dishName: string, dIdx: number) => (
                            <span 
                              key={dIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {dishName}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
