export interface MonthlySalesData {
  monthName: string;
  salesQuantity: number;
}

export interface PredictiveOrderItem {
  id: string;
  name: string;
  code: string;
  category: 'PESCADOS' | 'FRUTOS_DO_MAR' | 'CARNES' | 'BEBIDAS' | 'LATICINIOS';
  unit: 'KG' | 'GF' | 'UN' | 'LT';
  unitCost: number;
  currentStock: number;
  minimumPackQuantity: number; // Lote mínimo de compra no CDA
  
  // Histórico de Vendas dos Últimos 3 Meses (Trimestre)
  monthlySales: MonthlySalesData[];
  
  // Rationale e regras de negócio
  rationale: string;
  urgency: 'CRITICA' | 'ALTA' | 'MODERADA';
}

export const INITIAL_PREDICTIVE_ITEMS: PredictiveOrderItem[] = [
  {
    id: 'cda-carne-sol',
    name: 'Carne de Sol de Alcatra',
    code: 'INS-002549',
    category: 'CARNES',
    unit: 'KG',
    unitCost: 48.90,
    currentStock: 35.0,
    minimumPackQuantity: 10,
    monthlySales: [
      { monthName: 'Junho', salesQuantity: 1620 },
      { monthName: 'Julho', salesQuantity: 1690 },
      { monthName: 'Agosto', salesQuantity: 1699 },
    ],
    rationale: 'Item nº 1 em faturamento do restaurante. Consumo médio de 417 kg/mês (35 kg/dia úteis e 65 kg/dia no fim de semana). Buffer de 10% absorve o pico do almoço de domingo.',
    urgency: 'CRITICA',
  },
  {
    id: 'cda-costela-tambaqui',
    name: 'Costela / Filé de Tambaqui de Cativeiro',
    code: 'INS-002568',
    category: 'PESCADOS',
    unit: 'KG',
    unitCost: 38.50,
    currentStock: 18.0,
    minimumPackQuantity: 10,
    monthlySales: [
      { monthName: 'Junho', salesQuantity: 190 },
      { monthName: 'Julho', salesQuantity: 198 },
      { monthName: 'Agosto', salesQuantity: 199 },
    ],
    rationale: 'Prato regional assinatura. Demanda de 49 kg/semana. Requer 18h de degelo controlado na câmara fria.',
    urgency: 'ALTA',
  },
  {
    id: 'cda-lombo-pirarucu',
    name: 'Lombo de Pirarucu Fresco / Congelado',
    code: 'INS-002413',
    category: 'PESCADOS',
    unit: 'KG',
    unitCost: 52.00,
    currentStock: 12.0,
    minimumPackQuantity: 10,
    monthlySales: [
      { monthName: 'Junho', salesQuantity: 215 },
      { monthName: 'Julho', salesQuantity: 225 },
      { monthName: 'Agosto', salesQuantity: 230 },
    ],
    rationale: 'Consumo constante nos pratos Pirarucu Ribeirinho e Filé 2P. Risco de ruptura no jantar de sábado.',
    urgency: 'CRITICA',
  },
  {
    id: 'cda-picanha-angus',
    name: 'Picanha Bovina Angus Certificada',
    code: 'INS-002553',
    category: 'CARNES',
    unit: 'KG',
    unitCost: 89.90,
    currentStock: 15.0,
    minimumPackQuantity: 5,
    monthlySales: [
      { monthName: 'Junho', salesQuantity: 160 },
      { monthName: 'Julho', salesQuantity: 172 },
      { monthName: 'Agosto', salesQuantity: 169 },
    ],
    rationale: 'Item de alto valor agregado e ticket médio elevado. Margem de segurança de 10% protege eventos corporativos.',
    urgency: 'ALTA',
  },
  {
    id: 'cda-joelho-porco',
    name: 'Joelho de Porco Defumado (Eisbein)',
    code: 'INS-005570',
    category: 'CARNES',
    unit: 'KG',
    unitCost: 32.50,
    currentStock: 16.0,
    minimumPackQuantity: 10,
    monthlySales: [
      { monthName: 'Junho', salesQuantity: 310 },
      { monthName: 'Julho', salesQuantity: 330 },
      { monthName: 'Agosto', salesQuantity: 340 },
    ],
    rationale: 'Prato tradicional com altíssima saída no happy hour e fins de semana. Degelo lento de 24h.',
    urgency: 'ALTA',
  },
  {
    id: 'cda-camarao-rosa',
    name: 'Camarão Rosa Eviscerado 30/40',
    code: 'INS-015433',
    category: 'FRUTOS_DO_MAR',
    unit: 'KG',
    unitCost: 68.00,
    currentStock: 20.0,
    minimumPackQuantity: 5,
    monthlySales: [
      { monthName: 'Junho', salesQuantity: 460 },
      { monthName: 'Julho', salesQuantity: 485 },
      { monthName: 'Agosto', salesQuantity: 495 },
    ],
    rationale: 'Insumo das entradas de Camarão Empanado e Moquecas. Giro semanal de 120 kg.',
    urgency: 'CRITICA',
  },
  {
    id: 'cda-file-mignon',
    name: 'Filé Mignon Bovino Limpo (Peça)',
    code: 'INS-002543',
    category: 'CARNES',
    unit: 'KG',
    unitCost: 64.90,
    currentStock: 25.0,
    minimumPackQuantity: 10,
    monthlySales: [
      { monthName: 'Junho', salesQuantity: 340 },
      { monthName: 'Julho', salesQuantity: 355 },
      { monthName: 'Agosto', salesQuantity: 359 },
    ],
    rationale: 'Base para Filé do Engenho e pratos kids. Consumo estável ao longo de toda a semana.',
    urgency: 'MODERADA',
  },
  {
    id: 'cda-queijo-coalho',
    name: 'Queijo Coalho Tradicional de Primeira',
    code: 'INS-008812',
    category: 'LATICINIOS',
    unit: 'KG',
    unitCost: 36.00,
    currentStock: 15.0,
    minimumPackQuantity: 5,
    monthlySales: [
      { monthName: 'Junho', salesQuantity: 260 },
      { monthName: 'Julho', salesQuantity: 275 },
      { monthName: 'Agosto', salesQuantity: 285 },
    ],
    rationale: 'Acompanhamento direto da Carne de Sol e dadinhos de tapioca. Rotação rápida.',
    urgency: 'MODERADA',
  },
  {
    id: 'cda-macaxeira-pre-cozida',
    name: 'Mandioca / Macaxeira Selecionada',
    code: 'INS-009941',
    category: 'CARNES',
    unit: 'KG',
    unitCost: 7.50,
    currentStock: 40.0,
    minimumPackQuantity: 20,
    monthlySales: [
      { monthName: 'Junho', salesQuantity: 370 },
      { monthName: 'Julho', salesQuantity: 390 },
      { monthName: 'Agosto', salesQuantity: 390 },
    ],
    rationale: 'Guarnição dos principais pratos regionais da casa. Giro médio de 96 kg/semana.',
    urgency: 'MODERADA',
  },
];

/**
 * Função de Cálculo Preditivo com Média Semanal dos Últimos Meses + 10% Buffer de Segurança
 * 
 * Fórmula Oficial do Grupo Engenho:
 * 1. TotalVendasTrimestre = Soma(Mês 1 + Mês 2 + Mês 3)
 * 2. MediaSemanal = TotalVendasTrimestre / 12 semanas
 * 3. DemandaComBuffer = MediaSemanal * (1 + bufferPct / 100) -> bufferPct padrão = 10%
 * 4. SaldoLiquido = DemandaComBuffer - EstoqueAtual
 * 5. PedidoSugerido = Múltiplo do Lote Mínimo de Compra (arredondado para cima)
 */
export const calculatePredictiveItem = (
  item: PredictiveOrderItem,
  bufferPct: number = 10
) => {
  const totalQuarterSales = item.monthlySales.reduce((acc, m) => acc + m.salesQuantity, 0);
  const numberOfWeeks = 12; // 3 meses = 12 semanas padrão contábil
  const weeklyAverage = totalQuarterSales / numberOfWeeks;
  
  // Adiciona 10% (ou percentual configurado) a mais de buffer de segurança
  const bufferQuantity = weeklyAverage * (bufferPct / 100);
  const projectedWeeklyDemand = weeklyAverage + bufferQuantity;
  
  // Diferença necessária para abastecer a loja
  const rawNeeded = Math.max(0, projectedWeeklyDemand - item.currentStock);
  
  // Arredonda para o lote mínimo do CDA (múltiplos de 5kg ou caixas)
  const packs = Math.ceil(rawNeeded / item.minimumPackQuantity);
  const suggestedQuantity = packs * item.minimumPackQuantity;
  
  const subtotal = suggestedQuantity * item.unitCost;

  return {
    ...item,
    totalQuarterSales,
    weeklyAverage,
    bufferPct,
    bufferQuantity,
    projectedWeeklyDemand,
    rawNeeded,
    suggestedQuantity,
    subtotal,
  };
};
