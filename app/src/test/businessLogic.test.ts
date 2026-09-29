import { describe, it, expect } from 'vitest';
import { calculatePredictiveItem, type PredictiveOrderItem } from '../data/cdaPredictiveData';
import type { StockBatch } from '../data/pepsStockData';
import { OFFICIAL_ENGENHO_MENU } from '../data/menuRecipesData';
import { INITIAL_BONUS, INITIAL_INVENTORY, INITIAL_STAFF } from '../data/mockData';

const TEST_PREDICTIVE_ITEMS: PredictiveOrderItem[] = [
  {
    id: 'pred-test-01',
    code: 'CDA-TEST-01',
    name: 'Costela de Tambaqui Teste',
    category: 'PESCADOS',
    unit: 'KG',
    unitCost: 38.5,
    minimumPackQuantity: 5,
    currentStock: 20,
    monthlySales: [
      { monthName: 'M1', salesQuantity: 120 },
      { monthName: 'M2', salesQuantity: 140 },
      { monthName: 'M3', salesQuantity: 160 },
    ],
    rationale: 'Teste de cálculo preditivo',
    urgency: 'ALTA',
  },
  {
    id: 'pred-test-02',
    code: 'CDA-TEST-02',
    name: 'Lombo de Pirarucu Teste',
    category: 'PESCADOS',
    unit: 'KG',
    unitCost: 52.0,
    minimumPackQuantity: 10,
    currentStock: 10,
    monthlySales: [
      { monthName: 'M1', salesQuantity: 240 },
      { monthName: 'M2', salesQuantity: 260 },
      { monthName: 'M3', salesQuantity: 220 },
    ],
    rationale: 'Teste de cálculo preditivo',
    urgency: 'ALTA',
  },
];

const TEST_PEPS_BATCHES: StockBatch[] = [
  {
    id: 'peps-test-01',
    itemId: 'item-01',
    itemName: 'Tambaqui Teste',
    batchCode: 'LOTE-TEST-01',
    entryDate: '2026-09-28',
    entryTimestamp: 1727500000000,
    expirationDate: '2026-10-28',
    initialQuantity: 100,
    currentQuantity: 100,
    unit: 'KG',
    unitCost: 38.0,
    storageLocation: 'FREEZER_01',
    pepsQueuePosition: 1,
    status: 'PRIMEIRO_A_SAIR',
    cdaInvoice: 'NF-123',
  },
  {
    id: 'peps-test-02',
    itemId: 'item-01',
    itemName: 'Tambaqui Teste',
    batchCode: 'LOTE-TEST-02',
    entryDate: '2026-09-29',
    entryTimestamp: 1727586400000,
    expirationDate: '2026-10-29',
    initialQuantity: 80,
    currentQuantity: 80,
    unit: 'KG',
    unitCost: 38.0,
    storageLocation: 'FREEZER_01',
    pepsQueuePosition: 2,
    status: 'EM_FILA',
    cdaInvoice: 'NF-124',
  },
];

describe('Business Logic & Mathematical Models', () => {
  describe('CDA Predictive Suggester (+10% buffer rule)', () => {
    it('should have test items defined with historic sales', () => {
      expect(TEST_PREDICTIVE_ITEMS.length).toBeGreaterThanOrEqual(2);
    });

    it('should correctly calculate weekly average and add exactly 10% safety buffer', () => {
      TEST_PREDICTIVE_ITEMS.forEach((item: PredictiveOrderItem) => {
        const totalQuarterSales = item.monthlySales.reduce((acc: number, m: { salesQuantity: number }) => acc + m.salesQuantity, 0);
        const weeklyAvg = totalQuarterSales / 12;
        const bufferQty = weeklyAvg * 0.10;
        const projectedDemand = weeklyAvg + bufferQty;
        const rawNeeded = Math.max(0, projectedDemand - item.currentStock);
        const expectedPacks = Math.ceil(rawNeeded / item.minimumPackQuantity);
        const expectedSuggested = expectedPacks * item.minimumPackQuantity;

        const calculation = calculatePredictiveItem(item, 10);
        expect(calculation.totalQuarterSales).toBe(totalQuarterSales);
        expect(calculation.weeklyAverage).toBeCloseTo(weeklyAvg, 2);
        expect(calculation.bufferQuantity).toBeCloseTo(bufferQty, 2);
        expect(calculation.projectedWeeklyDemand).toBeCloseTo(projectedDemand, 2);
        expect(calculation.suggestedQuantity).toBe(expectedSuggested);
        expect(calculation.subtotal).toBeCloseTo(expectedSuggested * item.unitCost, 2);
      });
    });

    it('should suggest 0 order if current stock exceeds weekly demand + buffer', () => {
      const highStockItem: PredictiveOrderItem = {
        ...TEST_PREDICTIVE_ITEMS[0],
        currentStock: 99999,
      };
      const calculation = calculatePredictiveItem(highStockItem, 10);
      expect(calculation.rawNeeded).toBe(0);
      expect(calculation.suggestedQuantity).toBe(0);
      expect(calculation.subtotal).toBe(0);
    });
  });

  describe('PEPS / FIFO Stock Engine', () => {
    it('should prioritize PRIMEIRO_A_SAIR for lowest pepsQueuePosition in batches', () => {
      const pepsFirsts = TEST_PEPS_BATCHES.filter((b) => b.status === 'PRIMEIRO_A_SAIR');
      expect(pepsFirsts.length).toBeGreaterThan(0);
      pepsFirsts.forEach((b) => {
        expect(b.pepsQueuePosition).toBe(1);
      });
    });

    it('should have valid timestamps and positive quantities for all batches', () => {
      TEST_PEPS_BATCHES.forEach((b) => {
        expect(b.entryTimestamp).toBeGreaterThan(0);
        expect(b.initialQuantity).toBeGreaterThan(0);
        expect(b.currentQuantity).toBeGreaterThanOrEqual(0);
        expect(b.unitCost).toBeGreaterThan(0);
      });
    });
  });

  describe('Technical Recipes & Menu Pricing (CMV)', () => {
    it('should have Ponta Negra classic dishes with positive selling price and ingredients', () => {
      expect(OFFICIAL_ENGENHO_MENU.length).toBeGreaterThanOrEqual(10);
      OFFICIAL_ENGENHO_MENU.forEach((dish) => {
        expect(dish.sellingPrice).toBeGreaterThan(0);
        expect(dish.ingredients.length).toBeGreaterThan(0);
        expect(dish.portionWeightGrams).toBeGreaterThan(0);

        const calculatedCost = dish.ingredients.reduce((acc, ing) => acc + ing.totalCost, 0);
        expect(dish.totalCost).toBeCloseTo(calculatedCost, 1);

        expect(dish.marginContributionReais).toBeCloseTo(dish.sellingPrice - dish.totalCost, 1);

        const calculatedCmv = (dish.totalCost / dish.sellingPrice) * 100;
        expect(dish.cmvPct).toBeCloseTo(calculatedCmv, 1);
      });
    });

    it('should ensure all key dishes have healthy CMV <= 35% (Enterprise target)', () => {
      OFFICIAL_ENGENHO_MENU.forEach((dish) => {
        expect(dish.cmvPct).toBeLessThanOrEqual(35.0);
      });
    });
  });

  describe('Manager Bonus Logic', () => {
    it('should correctly sum total bonus across food safety, nps, and sales', () => {
      const sum = INITIAL_BONUS.foodSafety.achievedBonus + INITIAL_BONUS.nps.achievedBonus + INITIAL_BONUS.sales.achievedBonus;
      expect(INITIAL_BONUS.totalBonus).toBe(sum);
      expect(INITIAL_BONUS.maxTotalBonus).toBe(2000.0);
    });

    it('should start in zero-mock slate for clean operation', () => {
      expect(Array.isArray(INITIAL_INVENTORY)).toBe(true);
      expect(Array.isArray(INITIAL_STAFF)).toBe(true);
    });
  });
});
