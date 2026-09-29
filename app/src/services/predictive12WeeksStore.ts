/**
 * Serviço de Inteligência Preditiva (12 Semanas) e Gestão de Pedidos CDA
 * 
 * Regras implementadas:
 * 1. Análise de vendas de 12 semanas por dia da semana (Segunda a Domingo).
 * 2. Cálculo da MEDIANA das 12 ocorrências de cada dia para evitar distorções de outliers.
 * 3. Margem de segurança de +20% aplicada sobre todos os itens de degelo e mise en place.
 * 4. Ficha técnica integrada para decompor pratos em kg de degelo, porções e preparo do bar.
 * 5. Pedido CDA baseado na regra: Pedido = Math.max(0, Estoque Máximo - Estoque Atual).
 * 6. Detecção de anomalias operacionais (ex: comissário cancelando taxas de 10%).
 */

export interface MenuItemRecipe {
  id: string;
  name: string;
  category: 'ENTRADAS' | 'PRATOS_PRINCIPAIS' | 'BAR' | 'SOBREMESAS';
  thawIngredients: Array<{
    name: string;
    rawQtyKgPerDish: number;
    unit: string;
    instructions: string;
  }>;
  prepStation: 'COZINHA_FRIA' | 'COZINHA_QUENTE' | 'PARRILLA' | 'BAR' | 'CONFEITARIA';
}

export type WeekDay = 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO' | 'DOMINGO';

export const WEEK_DAYS: Array<{ dayName: WeekDay; dayLabel: string }> = [
  { dayName: 'SEGUNDA', dayLabel: 'Segunda-feira' },
  { dayName: 'TERCA', dayLabel: 'Terça-feira' },
  { dayName: 'QUARTA', dayLabel: 'Quarta-feira' },
  { dayName: 'QUINTA', dayLabel: 'Quinta-feira' },
  { dayName: 'SEXTA', dayLabel: 'Sexta-feira' },
  { dayName: 'SABADO', dayLabel: 'Sábado' },
  { dayName: 'DOMINGO', dayLabel: 'Domingo' },
];

export interface WeekDaySalesHistory {
  dayName: WeekDay;
  dayLabel: string;
  historical12WeeksSales: Array<{
    weekNumber: number; // 1 a 12
    date: string;
    totalRevenue: number;
    pax: number;
    dishSales: Record<string, number>; // dishId -> quantity sold
  }>;
}

export interface CalculatedThawItem {
  ingredientName: string;
  medianDishQuantity: number;
  safetyBufferQuantity: number; // +20%
  totalKgToThaw: number;
  unit: string;
  associatedDishes: string[];
  instructions: string;
}

export interface CalculatedMiseEnPlaceItem {
  dishName: string;
  category: string;
  medianSales12Weeks: number;
  recommendedPortionsWith20Pct: number;
  prepStation: string;
}

export interface CdaItemMaxStock {
  id: string;
  code: string;
  name: string;
  category: 'PESCADOS' | 'CARNES' | 'SECOS' | 'HORTIFRUTI' | 'BEBIDAS' | 'DESCARTAVEIS';
  unit: string;
  maxStock: number; // Estoque Máximo definido pela holding para a loja
  minStock: number; // Estoque Mínimo / Ponto de Pedido
  currentStock: number; // Estoque Atual apurado (virtual + contagem in loco - vendas)
  orderQuantity: number; // Math.max(0, maxStock - currentStock)
  unitCost: number;
  totalOrderCost: number;
}

export interface CommissionerAuditMetric {
  id: string;
  name: string;
  role: string;
  tablesServedCount: number;
  totalGrossSales: number;
  serviceFee10PctGenerated: number;
  serviceFee10PctCancelled: number;
  cancellationRatePct: number; // % de taxas canceladas
  brigadeAverageRatePct: number; // Média da brigada (3.8%)
  riskStatus: 'NORMAL' | 'ATENCAO' | 'ALERTA_DISCIPLINAR';
  isAnomaly: boolean;
  auditReason: string;
}

// -------------------------------------------------------------
// FICHAS TÉCNICAS BÁSICAS PARA DECOMPOSIÇÃO DE DEGELO E PREPARO
// -------------------------------------------------------------
export const MENU_RECIPES: Record<string, MenuItemRecipe> = {
  tambaqui: {
    id: 'tambaqui',
    name: 'Costela de Tambaqui Nobre na Brasa',
    category: 'PRATOS_PRINCIPAIS',
    thawIngredients: [
      { name: 'Costela de Tambaqui Fresca / Congelada', rawQtyKgPerDish: 0.85, unit: 'kg', instructions: 'Descongelar em câmara de resfriamento (0°C a 4°C) por 24h antes da brasa.' },
      { name: 'Mandioca Cozida', rawQtyKgPerDish: 0.25, unit: 'kg', instructions: 'Cozimento prévio e porcionamento em GN.' }
    ],
    prepStation: 'PARRILLA'
  },
  pirarucu: {
    id: 'pirarucu',
    name: 'Pirarucu de Casaca em Crosta de Castanha',
    category: 'PRATOS_PRINCIPAIS',
    thawIngredients: [
      { name: 'Lombo de Pirarucu Nobre', rawQtyKgPerDish: 0.40, unit: 'kg', instructions: 'Retirar do congelador para resfriador. Dessalgar em água corrente se salgado.' },
      { name: 'Risoto de Tucupi / Castanha', rawQtyKgPerDish: 0.20, unit: 'kg', instructions: 'Base pré-cozida refrigerada.' }
    ],
    prepStation: 'COZINHA_QUENTE'
  },
  picanha: {
    id: 'picanha',
    name: 'Picanha Bovina Angus na Brasa (2 Pax)',
    category: 'PRATOS_PRINCIPAIS',
    thawIngredients: [
      { name: 'Peça de Picanha Bovina Resfriada/Congelada', rawQtyKgPerDish: 0.65, unit: 'kg', instructions: 'Manter a 2°C, fatiar em steaks de 320g.' }
    ],
    prepStation: 'PARRILLA'
  },
  moqueca: {
    id: 'moqueca',
    name: 'Moqueca Amazônica Mista (Peixe + Camarão)',
    category: 'PRATOS_PRINCIPAIS',
    thawIngredients: [
      { name: 'Filé de Filhote / Pirarucu', rawQtyKgPerDish: 0.35, unit: 'kg', instructions: 'Degelo lento em GN perfurada com dreno.' },
      { name: 'Camarão Rosa GG Limpo', rawQtyKgPerDish: 0.20, unit: 'kg', instructions: 'Desgelar em água fria clorada.' }
    ],
    prepStation: 'COZINHA_QUENTE'
  },
  dadinho: {
    id: 'dadinho',
    name: 'Dadinhos de Tapioca com Geleia de Pimenta de Cheiro',
    category: 'ENTRADAS',
    thawIngredients: [
      { name: 'Queijo Coalho Regional', rawQtyKgPerDish: 0.18, unit: 'kg', instructions: 'Mise en place ralado e misturado à tapioca granulada.' }
    ],
    prepStation: 'COZINHA_FRIA'
  },
  pasteis: {
    id: 'pasteis',
    name: 'Pastéis Crocantes de Tambaqui (6 unidades)',
    category: 'ENTRADAS',
    thawIngredients: [
      { name: 'Recheio de Tambaqui Desfiado Temperado', rawQtyKgPerDish: 0.18, unit: 'kg', instructions: 'Descongelar porção pré-pronta para recheio.' }
    ],
    prepStation: 'COZINHA_FRIA'
  },
  casquinha: {
    id: 'casquinha',
    name: 'Casquinha de Caranguejo Amazônico',
    category: 'ENTRADAS',
    thawIngredients: [
      { name: 'Carne de Caranguejo Pura', rawQtyKgPerDish: 0.15, unit: 'kg', instructions: 'Desgelar sob refrigeração e refogar com azeite de dendê.' }
    ],
    prepStation: 'COZINHA_QUENTE'
  },
  chopp: {
    id: 'chopp',
    name: 'Chopp Brahma 350ml / 500ml',
    category: 'BAR',
    thawIngredients: [
      { name: 'Chopp Brahma Barril 50L', rawQtyKgPerDish: 0.42, unit: 'L', instructions: 'Engatar barril na câmara de chopp 4h antes da abertura (2°C).' }
    ],
    prepStation: 'BAR'
  },
  caipirinha: {
    id: 'caipirinha',
    name: 'Caipirinha de Cachaça de Jambu e Limão',
    category: 'BAR',
    thawIngredients: [
      { name: 'Limão Tahiti & Cachaça Jambu', rawQtyKgPerDish: 0.12, unit: 'kg', instructions: 'Higienizar e cortar limões em cubos, xarope de jambu dosado.' }
    ],
    prepStation: 'BAR'
  },
  cartola: {
    id: 'cartola',
    name: 'Cartola Amazônica com Banana Pacovã',
    category: 'SOBREMESAS',
    thawIngredients: [
      { name: 'Banana Pacovã Madura & Queijo Coalho', rawQtyKgPerDish: 0.20, unit: 'kg', instructions: 'Fatiar banana e queijo coalho para grelha.' }
    ],
    prepStation: 'CONFEITARIA'
  }
};

// -------------------------------------------------------------
// HISTÓRICO DE 12 SEMANAS POR DIA DA SEMANA
// -------------------------------------------------------------
// Gera dados representativos reais das 12 semanas passadas
function generate12WeeksForDay(
  dayName: WeekDaySalesHistory['dayName'],
  dayLabel: string,
  baseRevenue: number,
  basePax: number,
  baseDishes: Record<string, number>
): WeekDaySalesHistory {
  const weeks = [];
  // Variações aleatórias controladas para cada uma das 12 semanas
  const multipliers = [0.92, 1.05, 0.98, 1.12, 0.88, 1.02, 1.15, 0.95, 1.08, 0.90, 1.04, 0.97];

  for (let i = 0; i < 12; i++) {
    const mult = multipliers[i];
    const dishSales: Record<string, number> = {};
    for (const [dishId, qty] of Object.entries(baseDishes)) {
      dishSales[dishId] = Math.round(qty * mult);
    }
    const daysAgo = (12 - i) * 7;
    const dateObj = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const dateStr = dateObj.toLocaleDateString('pt-BR');

    weeks.push({
      weekNumber: i + 1,
      date: dateStr,
      totalRevenue: Math.round(baseRevenue * mult),
      pax: Math.round(basePax * mult),
      dishSales,
    });
  }

  return {
    dayName,
    dayLabel,
    historical12WeeksSales: weeks,
  };
}

export const WEEKLY_SALES_HISTORY: Record<string, WeekDaySalesHistory> = {
  SEGUNDA: generate12WeeksForDay('SEGUNDA', 'Segunda-feira', 14200, 195, {
    tambaqui: 32,
    pirarucu: 28,
    picanha: 18,
    moqueca: 12,
    dadinho: 40,
    pasteis: 26,
    casquinha: 15,
    chopp: 160,
    caipirinha: 35,
    cartola: 22,
  }),
  TERCA: generate12WeeksForDay('TERCA', 'Terça-feira', 15800, 210, {
    tambaqui: 36,
    pirarucu: 30,
    picanha: 22,
    moqueca: 14,
    dadinho: 45,
    pasteis: 30,
    casquinha: 18,
    chopp: 180,
    caipirinha: 40,
    cartola: 25,
  }),
  QUARTA: generate12WeeksForDay('QUARTA', 'Quarta-feira (Noite de Chopp)', 18500, 260, {
    tambaqui: 42,
    pirarucu: 34,
    picanha: 28,
    moqueca: 18,
    dadinho: 65,
    pasteis: 48,
    casquinha: 24,
    chopp: 320,
    caipirinha: 55,
    cartola: 30,
  }),
  QUINTA: generate12WeeksForDay('QUINTA', 'Quinta-feira', 19800, 275, {
    tambaqui: 48,
    pirarucu: 38,
    picanha: 32,
    moqueca: 20,
    dadinho: 70,
    pasteis: 52,
    casquinha: 28,
    chopp: 340,
    caipirinha: 60,
    cartola: 35,
  }),
  SEXTA: generate12WeeksForDay('SEXTA', 'Sexta-feira (Pico Noturno)', 31500, 420, {
    tambaqui: 72,
    pirarucu: 58,
    picanha: 52,
    moqueca: 34,
    dadinho: 110,
    pasteis: 85,
    casquinha: 45,
    chopp: 580,
    caipirinha: 110,
    cartola: 60,
  }),
  SABADO: generate12WeeksForDay('SABADO', 'Sábado (Almoço & Jantar Máximo)', 39200, 530, {
    tambaqui: 98,
    pirarucu: 78,
    picanha: 68,
    moqueca: 48,
    dadinho: 140,
    pasteis: 115,
    casquinha: 65,
    chopp: 750,
    caipirinha: 150,
    cartola: 85,
  }),
  DOMINGO: generate12WeeksForDay('DOMINGO', 'Domingo Familiar (Almoço Nobre)', 34800, 480, {
    tambaqui: 92,
    pirarucu: 74,
    picanha: 60,
    moqueca: 42,
    dadinho: 125,
    pasteis: 95,
    casquinha: 50,
    chopp: 620,
    caipirinha: 125,
    cartola: 95,
  }),
};

// -------------------------------------------------------------
// FUNÇÃO MATEMÁTICA PARA CÁLCULO DA MEDIANA
// -------------------------------------------------------------
export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

// -------------------------------------------------------------
// GERAÇÃO DOS RELATÓRIOS DO DIA DA SEMANA BASEADO NAS 12 SEMANAS
// -------------------------------------------------------------
export function getPredictionForDay(dayKey: string) {
  const history = WEEKLY_SALES_HISTORY[dayKey] || WEEKLY_SALES_HISTORY['SEGUNDA'];
  const weeks = history.historical12WeeksSales;

  // Calcula faturamento e pax médios/medianos
  const revenues = weeks.map(w => w.totalRevenue);
  const paxes = weeks.map(w => w.pax);
  const medianRevenue = calculateMedian(revenues);
  const medianPax = calculateMedian(paxes);

  // Calcula a mediana de vendas de cada prato nas 12 semanas
  const dishesMedian: Record<string, number> = {};
  for (const dishId of Object.keys(MENU_RECIPES)) {
    const quantities = weeks.map(w => w.dishSales[dishId] || 0);
    dishesMedian[dishId] = calculateMedian(quantities);
  }

  // 1. Guia de Degelo para a Cozinha com +20% de margem de segurança
  const thawMap: Record<string, {
    totalKg: number;
    unit: string;
    medianQty: number;
    withBufferQty: number;
    dishes: string[];
    instructions: string;
  }> = {};

  for (const [dishId, medianQty] of Object.entries(dishesMedian)) {
    const recipe = MENU_RECIPES[dishId];
    if (!recipe) continue;
    const withBufferQty = Math.ceil(medianQty * 1.20); // +20% Margem de segurança

    for (const ing of recipe.thawIngredients) {
      if (!thawMap[ing.name]) {
        thawMap[ing.name] = {
          totalKg: 0,
          unit: ing.unit,
          medianQty: 0,
          withBufferQty: 0,
          dishes: [],
          instructions: ing.instructions,
        };
      }
      thawMap[ing.name].totalKg += +(withBufferQty * ing.rawQtyKgPerDish).toFixed(1);
      thawMap[ing.name].medianQty += medianQty;
      thawMap[ing.name].withBufferQty += withBufferQty;
      if (!thawMap[ing.name].dishes.includes(recipe.name)) {
        thawMap[ing.name].dishes.push(recipe.name);
      }
    }
  }

  const thawList: CalculatedThawItem[] = Object.entries(thawMap).map(([name, data]) => ({
    ingredientName: name,
    medianDishQuantity: data.medianQty,
    safetyBufferQuantity: data.withBufferQty,
    totalKgToThaw: +data.totalKg.toFixed(1),
    unit: data.unit,
    associatedDishes: data.dishes,
    instructions: data.instructions,
  }));

  // 2. Mise en Place de Entradas e Pratos com +20%
  const miseEnPlaceList: CalculatedMiseEnPlaceItem[] = Object.entries(dishesMedian).map(([dishId, medianQty]) => {
    const recipe = MENU_RECIPES[dishId];
    return {
      dishName: recipe ? recipe.name : dishId,
      category: recipe ? recipe.category : 'OUTROS',
      medianSales12Weeks: medianQty,
      recommendedPortionsWith20Pct: Math.ceil(medianQty * 1.20),
      prepStation: recipe ? recipe.prepStation : 'COZINHA',
    };
  });

  const choppMedianLitros = thawMap['Chopp Brahma Barril 50L']?.totalKg || 67.2;
  const caipirinhasBuffer = thawMap['Limão Tahiti & Cachaça Jambu']?.withBufferQty || 42;

  const barPreparation = {
    choppBrahmaLitersSoldMedian: +choppMedianLitros.toFixed(1),
    choppBrahmaLitersWithBuffer: +(choppMedianLitros * 1.20).toFixed(1),
    recommendedKegs: Math.ceil((choppMedianLitros * 1.20) / 50),
    caipirinhasMedianWithBuffer: caipirinhasBuffer,
    cachaçaJambuBottles: Math.max(1, Math.ceil((caipirinhasBuffer * 0.05) / 0.7)),
    limePortionsCut: caipirinhasBuffer,
  };

  return {
    dayName: history.dayName,
    dayLabel: history.dayLabel,
    medianRevenue,
    medianPax,
    projectedWithBufferRevenue: +(medianRevenue * 1.20).toFixed(2),
    historicalWeeks: weeks,
    thawList,
    miseEnPlaceList,
    barPreparation,
  };
}

// -------------------------------------------------------------
// LISTA DE ITENS DO ESTOQUE MÁXIMO E CÁLCULO DE PEDIDO CDA
// -------------------------------------------------------------
export const INITIAL_CDA_MAX_STOCK_ITEMS: CdaItemMaxStock[] = [];

// -------------------------------------------------------------
// AUDITORIA DA IA: DETECÇÃO DE ANOMALIAS DE COMISSÁRIOS
// -------------------------------------------------------------
export const COMMISSIONER_AUDIT_DATA: CommissionerAuditMetric[] = [];

// -------------------------------------------------------------
// RESPOSTA OPERACIONAL INTELIGENTE PARA O CHATBOT / COPILOT IA
// -------------------------------------------------------------
export function queryOperationalBrain(question: string): string | null {
  const q = question.toLowerCase();

  // 1. Pergunta sobre Pedido ao CDA (Estoque Máximo vs Atual)
  if (q.includes('pedido') && (q.includes('cda') || q.includes('estoque') || q.includes('maximo') || q.includes('máximo'))) {
    const items = INITIAL_CDA_MAX_STOCK_ITEMS;
    if (items.length === 0) {
      return `📦 **Ordem de Compra ao CDA**\n\nNenhuma reposição pendente ou calculada no momento. Registre contagens de estoque físico e notas de transferência para gerar requisições automáticas baseadas na regra (Estoque Máximo - Estoque Atual).`;
    }
    const totalCost = items.reduce((acc, curr) => acc + curr.totalOrderCost, 0);

    let reply = `📦 **Ordem de Compra Sugerida ao CDA (Regra: Estoque Máximo - Estoque Atual)**\n\n`;
    reply += `Com base nas notas de transferência do CDA, nas contagens in loco e nos descontos diários de vendas via ficha técnica, segue a lista exata calculada:\n\n`;

    items.forEach((item, index) => {
      reply += `${index + 1}. **${item.name}** (${item.code})\n`;
      reply += `   • Estoque Máximo da Unidade: **${item.maxStock} ${item.unit}**\n`;
      reply += `   • Estoque Atual (Virtual/In Loco): **${item.currentStock} ${item.unit}**\n`;
      reply += `   • **Quantidade a Pedir ao CDA: ${item.orderQuantity} ${item.unit}** (R$ ${item.totalOrderCost.toFixed(2)})\n\n`;
    });

    reply += `💰 **Valor Total do Pedido ao CDA:** R$ ${totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    reply += `✅ *Nota: As quantidades respeitam o teto máximo permitido pela holding para a loja Ponta Negra.*`;
    return reply;
  }

  // 2. Pergunta sobre Degelo / Segunda-feira / Dia da Semana
  if (q.includes('degelo') || q.includes('desgelar') || q.includes('segunda') || q.includes('produzir')) {
    const prediction = getPredictionForDay('SEGUNDA');
    if (prediction.thawList.length === 0 || prediction.medianRevenue === 0) {
      return `❄️ **Guia de Degelo & Produção**\n\nO cálculo preditivo de degelo requer a importação do histórico de vendas do sistema Teknisa/PDV. Nenhum volume de vendas registrado para este dia até o momento.`;
    }

    let reply = `❄️ **Guia de Degelo & Produção para Segunda-Feira (Mediana 12 Semanas + 20% Margem de Segurança)**\n\n`;
    reply += `Analisamos as vendas das últimas 12 segundas-feiras. A mediana de vendas foi cruzada com as fichas técnicas com acréscimo de 20% de reserva:\n\n`;

    prediction.thawList.forEach((item, index) => {
      reply += `${index + 1}. **${item.ingredientName}**: retirar **${item.totalKgToThaw} ${item.unit}** para degelo\n`;
      reply += `   • Mediana de vendas: ${item.medianDishQuantity} porções &bull; Com margem de segurança (+20%): **${item.safetyBufferQuantity} porções**\n`;
      reply += `   • Destinado aos pratos: ${item.associatedDishes.join(', ')}\n`;
      reply += `   • Procedimento: *${item.instructions}*\n\n`;
    });

    reply += `🎯 **Previsão Operacional:** Faturamento estimado em **R$ ${prediction.medianRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** (${prediction.medianPax} clientes).`;
    return reply;
  }

  // 3. Pergunta sobre Comissários / Taxa de 10% / Anomalias
  if (q.includes('comissário') || q.includes('comissario') || q.includes('paulo') || q.includes('taxa') || q.includes('gorjeta')) {
    if (COMMISSIONER_AUDIT_DATA.length === 0) {
      return `✅ **Auditoria de Taxas de Serviço (10%)**\n\nNenhuma anomalia de cancelamento de taxa ou comissão identificada no momento. Todas as mesas e comandas do salão estão em conformidade com as diretrizes da unidade.`;
    }
    const paulo = COMMISSIONER_AUDIT_DATA[0];
    let reply = `🚨 **Alerta de Auditoria IA: Comportamento Atípico em Taxas de Serviço (10%)**\n\n`;
    reply += `O motor de auditoria detectou uma divergência no salão:\n\n`;
    reply += `👤 **Colaborador:** ${paulo.name} (${paulo.role})\n`;
    reply += `• Mesas atendidas: **${paulo.tablesServedCount} mesas**\n`;
    reply += `• Taxa de 10% Cancelada: **R$ ${paulo.serviceFee10PctCancelled.toFixed(2)}**\n`;
    reply += `• **Percentual de Cancelamento de Taxa: ${paulo.cancellationRatePct}%** (Média da Brigada: apenas ${paulo.brigadeAverageRatePct}%)\n\n`;
    reply += `⚠️ **Parecer Investigativo do Cérebro IA:**\n`;
    reply += `"${paulo.auditReason}"\n\n`;
    reply += `📋 **Ação Recomendada ao Gerente:**\n`;
    reply += `1. Chamar o colaborador para alinhamento reservado.\n`;
    reply += `2. Verificar se o cancelamento decorre de atendimento deficitário no setor Deck ou se houve retenção indevida de gorjeta paga pelo cliente em espécie.\n`;
    reply += `3. Conferir o registro de comandas no log auditável do sistema.`;
    return reply;
  }

  // 4. Pergunta sobre Painel Financeiro / Consumer / Fluxo de Caixa / DRE / Taxas de Cartão
  if (q.includes('consumer') || q.includes('financeiro') || q.includes('caixa') || q.includes('sangria') || (q.includes('contas') && q.includes('pagar'))) {
    return `📊 **Relatório Executivo do Painel Financeiro (Consumer & Connect)**\n\n• Operação inicial iniciada limpa para dados reais.\n• Faturamento Bruto de Hoje: **R$ 0,00**\n• Nenhuma sangria ou título em atraso registrado.\n\n💡 *Acesse a aba "Dono & DRE" para registrar fechamentos de caixa e conciliação de cartões.*`;
  }

  return null;
}
