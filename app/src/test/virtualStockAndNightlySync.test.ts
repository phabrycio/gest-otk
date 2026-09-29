import { describe, it, expect, beforeEach } from 'vitest';
import {
  getVirtualStockItems,
  saveVirtualStockItems,
  recordNfOrAfEntry,
  recordCdaMaterialTransfer,
  recordSalesDeduction,
  getStockMovements,
  clearVirtualStockDataToClean,
  buildInitialStockCatalog,
} from '../services/virtualStockStore';
import {
  getTeknisaScheduleConfig,
  saveTeknisaScheduleConfig,
  executeNightlyTeknisaSync,
  getTeknisaSyncLogs,
  checkAndTriggerNightlySyncIfNeeded,
} from '../services/teknisaNightlySyncService';
import type { NfRecord, SalesImport } from '../types/stock.types';

describe('Virtual Stock & 03:00 AM Nightly Sync Tests', () => {
  beforeEach(() => {
    clearVirtualStockDataToClean();
  });

  it('builds initial stock catalog based on official Engenho recipes with 0 quantity (clean slate)', () => {
    const catalog = buildInitialStockCatalog();
    expect(catalog.length).toBeGreaterThan(10);

    const tambaqui = catalog.find((i) => i.name.toLowerCase().includes('tambaqui'));
    expect(tambaqui).toBeDefined();
    expect(tambaqui?.virtualQty).toBe(0);
    expect(tambaqui?.status).toBe('RUPTURA');
  });

  it('adds items and updates cost upon receiving an AF / NF purchase invoice', () => {
    const mockNf: NfRecord = {
      id: 'nf-test-01',
      nfNumber: 'NF-10492',
      supplier: 'Distribuidor Carnes & Pescados Manaus',
      issueDate: '2026-09-28',
      receiptDate: '2026-09-28',
      totalValue: 1560.0,
      ocrConfidence: 98,
      status: 'CONFIRMADA',
      receivedBy: 'Ivan (Gerente)',
      items: [
        {
          id: 'it-1',
          name: 'Lombo de Tambaqui Nobre com Osso',
          cdaCode: 'CDA-1042',
          qty: 20,
          unit: 'kg',
          unitCost: 50.0,
          totalValue: 1000.0,
          status: 'OK',
        },
      ],
    };

    const res = recordNfOrAfEntry(mockNf, 'Ivan');
    expect(res.updatedItemsCount + res.newItemsCount).toBeGreaterThan(0);

    const items = getVirtualStockItems();
    const tambaqui = items.find((i) => i.name.toLowerCase().includes('tambaqui'));
    expect(tambaqui).toBeDefined();
    expect(tambaqui?.virtualQty).toBe(20);
    expect(tambaqui?.lastCost).toBe(50.0);

    const movements = getStockMovements();
    expect(movements.length).toBeGreaterThan(0);
    expect(movements[0].type).toBe('ENTRADA_NF');
    expect(movements[0].qty).toBe(20);
  });

  it('adds items received from CDA Material Transfers', () => {
    const res = recordCdaMaterialTransfer({
      transferNumber: 'TRANSF-CDA-8821',
      receivedBy: 'Pabricio (Gerente)',
      driverOrTransporter: 'Logística CDA',
      items: [
        { name: 'Costela de Tambaqui Nobre', qty: 30, unit: 'kg', unitCost: 45.0 },
        { name: 'Filé de Pirarucu Fresco sem Pele', qty: 15, unit: 'kg', unitCost: 40.0 },
      ],
    });

    expect(res.processedCount).toBe(2);

    const items = getVirtualStockItems();
    const pirarucu = items.find((i) => i.name.toLowerCase().includes('pirarucu'));
    expect(pirarucu).toBeDefined();
    expect(pirarucu?.virtualQty).toBe(15);

    const movements = getStockMovements();
    const cdaMov = movements.find((m) => m.type === 'TRANSFERENCIA_ENTRADA');
    expect(cdaMov).toBeDefined();
    expect(cdaMov?.qty).toBe(15);
  });

  it('deducts ingredient portions from virtual stock when sales occur via Fichas Técnicas', () => {
    // 1. Dar entrada primeiro para ter estoque
    recordCdaMaterialTransfer({
      transferNumber: 'TRANSF-CDA-SETUP',
      items: [
        { name: 'Lombo de Tambaqui Nobre com Osso', qty: 50, unit: 'kg', unitCost: 52.0 },
        { name: 'Farinha do Uarini Ovinha (Torrada)', qty: 20, unit: 'kg', unitCost: 25.0 },
      ],
    });

    const stockBefore = getVirtualStockItems();
    const tambaquiBefore = stockBefore.find((i) => i.name.toLowerCase().includes('tambaqui'))?.virtualQty || 0;

    // 2. Venda de 10 porções de "Costela de Tambaqui na Brasa" (prato oficial)
    const mockSales: SalesImport = {
      id: 'sale-test-01',
      importDate: '2026-09-28',
      referenceDate: '2026-09-27',
      source: 'TEKNISA_PDV',
      status: 'PROCESSADO',
      totalRevenue: 980.0,
      totalItems: 10,
      totalCancelled: 0,
      importedBy: 'Robô Teknisa 03h',
      lines: [
        {
          id: 'line-1',
          dishName: 'Costela de Tambaqui na Brasa',
          qtyOrdered: 10,
          qtyDelivered: 10,
          qtyCancelled: 0,
          unitPrice: 98.0,
          totalRevenue: 980.0,
          shift: 'ALMOCO',
          date: '2026-09-27',
          theoreticalConsumption: [],
        },
      ],
    };

    const res = recordSalesDeduction(mockSales, 10); // 10% margem
    expect(res.totalDeductionsApplied).toBeGreaterThan(0);

    const stockAfter = getVirtualStockItems();
    const tambaquiAfter = stockAfter.find((i) => i.name.toLowerCase().includes('tambaqui'))?.virtualQty || 0;

    // 400g * 10 = 4kg (+ 10% margem = 4.4kg)
    expect(tambaquiAfter).toBeLessThan(tambaquiBefore);
    expect(tambaquiBefore - tambaquiAfter).toBeCloseTo(4.4, 1);

    const movements = getStockMovements();
    const saleMov = movements.find((m) => m.type === 'CONSUMO_VENDA');
    expect(saleMov).toBeDefined();
    expect(saleMov?.notes).toContain('Costela de Tambaqui');
  });

  it('executes 03:00 AM nightly sync and records audit log and feed status', async () => {
    const log = await executeNightlyTeknisaSync('AGENDADOR_AUTOMATICO_03H');
    expect(log.status).toBe('SUCESSO');
    expect(log.totalSalesRows).toBeGreaterThan(0);
    expect(log.cancellationsCount).toBeGreaterThan(0);

    const logs = getTeknisaSyncLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].id).toBe(log.id);

    const config = getTeknisaScheduleConfig();
    expect(config.lastExecutionDate).toBeDefined();
    expect(config.lastExecutionStatus).toBe('SUCESSO');
  });
});
