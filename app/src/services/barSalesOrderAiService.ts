/**
 * barSalesOrderAiService.ts
 *
 * Módulo de Inteligência de Vendas de Bebidas do Bar & Cálculo Preditivo de Pedidos CDA:
 *
 * Regras de Negócio Estabelecidas:
 * 1. Apenas bebidas do bar (Drinks, Cervejas, Chopp, Sucos, Água, Refrigerantes, Destilados).
 * 2. Análise histórica dos últimos 2 meses por dia da semana (Segunda a Domingo).
 * 3. Margem de segurança de +10% adicionada à média de consumo diário.
 * 4. Cálculo de Domingo de manhã:
 *    - Soma do consumo previsto para a próxima semana (com os 10% de margem).
 *    - Compara Estoque Atual (contagem física em mãos no domingo) com Estoque Máximo autorizado pelo CDA.
 *    - Quantidade a Pedir ao CDA = min(Necessidade, Estoque Máximo - Estoque Atual).
 * 5. Alerta Automático para o Gerente:
 *    - Se Média Prevista Semanal (+10%) > Estoque Máximo CDA:
 *      Dispara ALERTA CRÍTICO: "Solicitar ao CDA aumento de estoque máximo de X para Y devido ao aumento de consumo!".
 * 6. Suporte a contagem de estoque por setor/cargo (Bar, Cozinha, Caixa, etc.).
 */

export interface BarBeverageSalesRecord {
  id: string;
  itemId: string;
  itemName: string;
  category: 'REFRIGERANTE' | 'CERVEJA' | 'CHOPP' | 'SUCO' | 'AGUA' | 'DRINK' | 'DESTILADO' | 'CACHACA';
  unit: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: 'DOMINGO' | 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO';
  quantitySold: number;
}

export interface BarItemPlanning {
  id: string;
  cdaCode: string;
  name: string;
  category: 'REFRIGERANTE' | 'CERVEJA' | 'CHOPP' | 'SUCO' | 'AGUA' | 'DRINK' | 'DESTILADO' | 'CACHACA';
  unit: string;
  maxStockCda: number; // Quantidade máxima autorizada pelo CDA por semana
  currentStock: number; // Contagem física em mãos no domingo
  // Médias diárias calculadas dos últimos 2 meses
  dailyAverage: {
    SEGUNDA: number;
    TERCA: number;
    QUARTA: number;
    QUINTA: number;
    SEXTA: number;
    SABADO: number;
    DOMINGO: number;
  };
  totalWeeklyAvgRaw: number; // Soma das médias da semana
  safetyMarginPct: number; // Padrão 10%
  weeklyDemandWithSafety: number; // totalWeeklyAvgRaw * 1.10
  calculatedOrderQty: number; // Pedido regular para a próxima semana
  requiresCdaCapIncrease: boolean; // Se demanda prevista > Estoque Máximo CDA
  suggestedNewCdaMax: number; // Novo teto sugerido para o Gerente pedir ao CDA
  responsibleRole: string; // Ex: 'CHEFE_BAR'
  responsibleName: string; // Ex: 'Pedro - Chefe do Bar'
  lastCountDate?: string;
}

const STORAGE_KEY_BAR_PLANNING = 'tk_bar_planning_items_v1';
const STORAGE_KEY_BAR_SALES = 'tk_bar_sales_history_v1';
const STORAGE_KEY_SECTOR_COUNTS = 'tk_sector_stock_counts_v1';

export interface SectorCountRecord {
  id: string;
  sector: 'BAR' | 'COZINHA' | 'CAIXA' | 'COMISSARIA';
  countedByRole: string;
  countedByName: string;
  date: string;
  items: Array<{
    itemId: string;
    itemName: string;
    unit: string;
    countedQuantity: number;
    notes?: string;
  }>;
}

/**
 * Itens padrão de bebidas do Bar para inicializar a esteira
 */
export const DEFAULT_BAR_PLANNING_ITEMS: BarItemPlanning[] = [
  {
    id: 'bev-coca-lata',
    cdaCode: 'CDA-BEV-001',
    name: 'Coca-Cola Lata 350ml',
    category: 'REFRIGERANTE',
    unit: 'Lata 350ml',
    maxStockCda: 600,
    currentStock: 0,
    dailyAverage: {
      SEGUNDA: 0,
      TERCA: 0,
      QUARTA: 0,
      QUINTA: 0,
      SEXTA: 0,
      SABADO: 0,
      DOMINGO: 0,
    },
    totalWeeklyAvgRaw: 0,
    safetyMarginPct: 10,
    weeklyDemandWithSafety: 0,
    calculatedOrderQty: 0,
    requiresCdaCapIncrease: false,
    suggestedNewCdaMax: 600,
    responsibleRole: 'CHEFE_BAR',
    responsibleName: 'Pedro (Chefe do Bar)',
  },
  {
    id: 'bev-coca-zero',
    cdaCode: 'CDA-BEV-002',
    name: 'Coca-Cola Zero Lata 350ml',
    category: 'REFRIGERANTE',
    unit: 'Lata 350ml',
    maxStockCda: 400,
    currentStock: 0,
    dailyAverage: {
      SEGUNDA: 0,
      TERCA: 0,
      QUARTA: 0,
      QUINTA: 0,
      SEXTA: 0,
      SABADO: 0,
      DOMINGO: 0,
    },
    totalWeeklyAvgRaw: 0,
    safetyMarginPct: 10,
    weeklyDemandWithSafety: 0,
    calculatedOrderQty: 0,
    requiresCdaCapIncrease: false,
    suggestedNewCdaMax: 400,
    responsibleRole: 'CHEFE_BAR',
    responsibleName: 'Pedro (Chefe do Bar)',
  },
  {
    id: 'bev-agua-sem-gas',
    cdaCode: 'CDA-BEV-003',
    name: 'Água Mineral Crystal Sem Gás 500ml',
    category: 'AGUA',
    unit: 'Garrafa 500ml',
    maxStockCda: 500,
    currentStock: 0,
    dailyAverage: {
      SEGUNDA: 0,
      TERCA: 0,
      QUARTA: 0,
      QUINTA: 0,
      SEXTA: 0,
      SABADO: 0,
      DOMINGO: 0,
    },
    totalWeeklyAvgRaw: 0,
    safetyMarginPct: 10,
    weeklyDemandWithSafety: 0,
    calculatedOrderQty: 0,
    requiresCdaCapIncrease: false,
    suggestedNewCdaMax: 500,
    responsibleRole: 'CHEFE_BAR',
    responsibleName: 'Pedro (Chefe do Bar)',
  },
  {
    id: 'bev-agua-com-gas',
    cdaCode: 'CDA-BEV-004',
    name: 'Água Mineral Crystal Com Gás 500ml',
    category: 'AGUA',
    unit: 'Garrafa 500ml',
    maxStockCda: 350,
    currentStock: 0,
    dailyAverage: {
      SEGUNDA: 0,
      TERCA: 0,
      QUARTA: 0,
      QUINTA: 0,
      SEXTA: 0,
      SABADO: 0,
      DOMINGO: 0,
    },
    totalWeeklyAvgRaw: 0,
    safetyMarginPct: 10,
    weeklyDemandWithSafety: 0,
    calculatedOrderQty: 0,
    requiresCdaCapIncrease: false,
    suggestedNewCdaMax: 350,
    responsibleRole: 'CHEFE_BAR',
    responsibleName: 'Pedro (Chefe do Bar)',
  },
  {
    id: 'bev-suco-laranja',
    cdaCode: 'CDA-BEV-005',
    name: 'Suco Natural de Laranja 300ml (Polpa/Insumo)',
    category: 'SUCO',
    unit: 'Litros',
    maxStockCda: 120,
    currentStock: 0,
    dailyAverage: {
      SEGUNDA: 0,
      TERCA: 0,
      QUARTA: 0,
      QUINTA: 0,
      SEXTA: 0,
      SABADO: 0,
      DOMINGO: 0,
    },
    totalWeeklyAvgRaw: 0,
    safetyMarginPct: 10,
    weeklyDemandWithSafety: 0,
    calculatedOrderQty: 0,
    requiresCdaCapIncrease: false,
    suggestedNewCdaMax: 120,
    responsibleRole: 'CHEFE_BAR',
    responsibleName: 'Pedro (Chefe do Bar)',
  },
  {
    id: 'bev-cerveja-heineken',
    cdaCode: 'CDA-BEV-006',
    name: 'Cerveja Heineken Long Neck 330ml',
    category: 'CERVEJA',
    unit: 'Garrafa 330ml',
    maxStockCda: 450,
    currentStock: 0,
    dailyAverage: {
      SEGUNDA: 0,
      TERCA: 0,
      QUARTA: 0,
      QUINTA: 0,
      SEXTA: 0,
      SABADO: 0,
      DOMINGO: 0,
    },
    totalWeeklyAvgRaw: 0,
    safetyMarginPct: 10,
    weeklyDemandWithSafety: 0,
    calculatedOrderQty: 0,
    requiresCdaCapIncrease: false,
    suggestedNewCdaMax: 450,
    responsibleRole: 'CHEFE_BAR',
    responsibleName: 'Pedro (Chefe do Bar)',
  },
  {
    id: 'bev-chopp-brahma',
    cdaCode: 'CDA-BEV-007',
    name: 'Chopp Brahma Claro Barril 50L',
    category: 'CHOPP',
    unit: 'Barril 50L',
    maxStockCda: 12,
    currentStock: 0,
    dailyAverage: {
      SEGUNDA: 0,
      TERCA: 0,
      QUARTA: 0,
      QUINTA: 0,
      SEXTA: 0,
      SABADO: 0,
      DOMINGO: 0,
    },
    totalWeeklyAvgRaw: 0,
    safetyMarginPct: 10,
    weeklyDemandWithSafety: 0,
    calculatedOrderQty: 0,
    requiresCdaCapIncrease: false,
    suggestedNewCdaMax: 12,
    responsibleRole: 'CHEFE_BAR',
    responsibleName: 'Pedro (Chefe do Bar)',
  },
  {
    id: 'bev-gin-tanqueray',
    cdaCode: 'CDA-BEV-008',
    name: 'Gin Tanqueray London Dry 750ml (Drinks)',
    category: 'DRINK',
    unit: 'Garrafa 750ml',
    maxStockCda: 10,
    currentStock: 0,
    dailyAverage: {
      SEGUNDA: 0,
      TERCA: 0,
      QUARTA: 0,
      QUINTA: 0,
      SEXTA: 0,
      SABADO: 0,
      DOMINGO: 0,
    },
    totalWeeklyAvgRaw: 0,
    safetyMarginPct: 10,
    weeklyDemandWithSafety: 0,
    calculatedOrderQty: 0,
    requiresCdaCapIncrease: false,
    suggestedNewCdaMax: 10,
    responsibleRole: 'CHEFE_BAR',
    responsibleName: 'Pedro (Chefe do Bar)',
  },
  {
    id: 'bev-cachaca-jambu',
    cdaCode: 'CDA-BEV-009',
    name: 'Cachaça de Jambu Regional 1000ml (Caipirinhas)',
    category: 'CACHACA',
    unit: 'Garrafa 1000ml',
    maxStockCda: 12,
    currentStock: 0,
    dailyAverage: {
      SEGUNDA: 0,
      TERCA: 0,
      QUARTA: 0,
      QUINTA: 0,
      SEXTA: 0,
      SABADO: 0,
      DOMINGO: 0,
    },
    totalWeeklyAvgRaw: 0,
    safetyMarginPct: 10,
    weeklyDemandWithSafety: 0,
    calculatedOrderQty: 0,
    requiresCdaCapIncrease: false,
    suggestedNewCdaMax: 12,
    responsibleRole: 'CHEFE_BAR',
    responsibleName: 'Pedro (Chefe do Bar)',
  },
];

/**
 * Retorna os itens de planejamento do bar
 */
export function getBarPlanningItems(): BarItemPlanning[] {
  if (typeof window === 'undefined') return DEFAULT_BAR_PLANNING_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BAR_PLANNING);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BAR_PLANNING, JSON.stringify(DEFAULT_BAR_PLANNING_ITEMS));
      return DEFAULT_BAR_PLANNING_ITEMS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BAR_PLANNING_ITEMS;
  }
}

/**
 * Salva a lista de itens e recalcula os pedidos e alertas
 */
export function saveBarPlanningItems(items: BarItemPlanning[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_BAR_PLANNING, JSON.stringify(items));
  } catch (err) {
    console.error('Falha ao salvar planejamento do bar', err);
  }
}

/**
 * Atualiza a contagem física (feita no domingo de manhã pelo líder do bar)
 */
export function updatePhysicalStockCount(itemId: string, countedStock: number): BarItemPlanning | null {
  const all = getBarPlanningItems();
  const idx = all.findIndex((i) => i.id === itemId);
  if (idx === -1) return null;

  const item = all[idx];
  item.currentStock = Math.max(0, countedStock);
  item.lastCountDate = new Date().toISOString();

  // Recalcular quantidade do pedido semanal:
  // Se CDA autoriza maxStockCda e temos currentStock, o pedido para atingir o teto é (maxStockCda - currentStock)
  const roomInStock = Math.max(0, item.maxStockCda - item.currentStock);
  item.calculatedOrderQty = Math.round(roomInStock);

  // Alerta de aumento de estoque máximo ao CDA
  // Se a demanda semanal média (+10%) for superior ao teto autorizado pelo CDA
  if (item.weeklyDemandWithSafety > item.maxStockCda) {
    item.requiresCdaCapIncrease = true;
    item.suggestedNewCdaMax = Math.ceil((item.weeklyDemandWithSafety * 1.05) / 10) * 10; // arredondar para cima de 10 em 10
  } else {
    item.requiresCdaCapIncrease = false;
  }

  all[idx] = item;
  saveBarPlanningItems(all);
  return item;
}

/**
 * Recalcula as médias diárias e a margem de 10% com base nas vendas reais
 */
export function recalculateItemAveragesWithSales(
  itemId: string,
  dailyAverages: BarItemPlanning['dailyAverage'],
  maxStockCda?: number
): BarItemPlanning | null {
  const all = getBarPlanningItems();
  const idx = all.findIndex((i) => i.id === itemId);
  if (idx === -1) return null;

  const item = all[idx];
  item.dailyAverage = dailyAverages;
  if (maxStockCda !== undefined) {
    item.maxStockCda = maxStockCda;
  }

  const rawSum = Object.values(dailyAverages).reduce((acc, val) => acc + val, 0);
  item.totalWeeklyAvgRaw = Math.round(rawSum * 10) / 10;
  // Margem de segurança de +10%
  item.weeklyDemandWithSafety = Math.round(rawSum * 1.10);

  // Pedido padrão baseado no teto do CDA
  const roomInStock = Math.max(0, item.maxStockCda - item.currentStock);
  item.calculatedOrderQty = Math.round(roomInStock);

  // Verificar se o consumo aumentou além do limite CDA
  if (item.weeklyDemandWithSafety > item.maxStockCda) {
    item.requiresCdaCapIncrease = true;
    item.suggestedNewCdaMax = Math.ceil((item.weeklyDemandWithSafety * 1.05) / 10) * 10;
  } else {
    item.requiresCdaCapIncrease = false;
  }

  all[idx] = item;
  saveBarPlanningItems(all);
  return item;
}

/**
 * Retorna todos os alertas de aumento de estoque máximo que devem ser enviados ao Gerente Geral
 */
export function getBarManagerCdaAlerts(): Array<{
  itemId: string;
  itemName: string;
  currentCdaMax: number;
  currentStock: number;
  weeklyDemandPredicted: number;
  suggestedNewCdaMax: number;
  reason: string;
}> {
  const items = getBarPlanningItems();
  return items
    .filter((i) => i.requiresCdaCapIncrease)
    .map((i) => ({
      itemId: i.id,
      itemName: i.name,
      currentCdaMax: i.maxStockCda,
      currentStock: i.currentStock,
      weeklyDemandPredicted: i.weeklyDemandWithSafety,
      suggestedNewCdaMax: i.suggestedNewCdaMax,
      reason: `Os relatórios de vendas dos últimos 2 meses apontam aumento do consumo de ${i.name}. Demanda semanal prevista: ${i.weeklyDemandWithSafety} ${i.unit} (inclui margem de segurança de 10%). Teto CDA atual de ${i.maxStockCda} ${i.unit} gerará ruptura de estoque no salão e bar.`,
    }));
}

/**
 * Registra a contagem de estoque realizada por um setor/cargo
 */
export function recordSectorCount(
  sector: SectorCountRecord['sector'],
  countedByRole: string,
  countedByName: string,
  items: SectorCountRecord['items']
): SectorCountRecord {
  const record: SectorCountRecord = {
    id: `count-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    sector,
    countedByRole,
    countedByName,
    date: new Date().toISOString(),
    items,
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SECTOR_COUNTS);
      const list: SectorCountRecord[] = raw ? JSON.parse(raw) : [];
      list.unshift(record);
      localStorage.setItem(STORAGE_KEY_SECTOR_COUNTS, JSON.stringify(list));
    } catch (e) {
      console.error('Falha ao salvar contagem de setor', e);
    }
  }

  // Se for do Bar, sincroniza o currentStock no planejamento
  if (sector === 'BAR') {
    items.forEach((it) => {
      updatePhysicalStockCount(it.itemId, it.countedQuantity);
    });
  }

  return record;
}

/**
 * Retorna histórico de contagens por setor
 */
export function getSectorCounts(sector?: SectorCountRecord['sector']): SectorCountRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SECTOR_COUNTS);
    const list: SectorCountRecord[] = raw ? JSON.parse(raw) : [];
    if (!sector) return list;
    return list.filter((r) => r.sector === sector);
  } catch {
    return [];
  }
}
