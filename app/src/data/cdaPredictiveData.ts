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

export const INITIAL_PREDICTIVE_ITEMS: PredictiveOrderItem[] = [];

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
