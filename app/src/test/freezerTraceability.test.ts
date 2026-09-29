import { describe, it, expect, beforeEach } from 'vitest';
import {
  getFreezerItems,
  getFreezerLogs,
  registerCdaEntry,
  processQrScan,
  resetFreezerStore,
  getNextAvailableBatchColor,
  getActiveBatchesForItem,
} from '../services/freezerTraceabilityStore';

describe('Sistema de Rastreamento de Itens do Freezer (CDA ➔ Degelo ➔ Produção)', () => {
  beforeEach(() => {
    localStorage.clear();
    resetFreezerStore();
  });

  it('inicializa limpo para operação real sem itens fictícios', () => {
    const items = getFreezerItems();
    expect(items.length).toBe(0);
  });

  it('permite dar entrada em item do CDA gerando etiqueta local e QR Code', () => {
    const res = registerCdaEntry({
      itemName: 'Picanha Nobre Bife de Tira (Peça 1.2kg)',
      category: 'Carnes Nobres',
      cdaBatchNumber: 'CDA-TEST-1234',
      cdaExpiryDate: '20/11/2026',
      quantity: 12,
      unit: 'kg',
      operatorReceived: 'Ivan (Gerente)',
      temperatureCheck: '-18.9°C',
    });

    expect(res.success).toBe(true);
    expect(res.item).toBeDefined();
    expect(res.item?.batchColor).toBe('AZUL'); // Primeiro lote deste item
    expect(res.item?.currentStage).toBe('FREEZER');
    expect(res.item?.qrCode).toContain('TK-FRZ-MNR-');
    expect(res.item?.localBatchNumber).toContain('MNR-L01-');
  });

  it('aplica rigorosamente a regra de no máximo 3 lotes ativos simultâneos por item', () => {
    const itemName = 'Teste Peixe Nobre Exclusivo';

    // 1º lote: AZUL
    const l1 = registerCdaEntry({
      itemName,
      category: 'Pescados',
      cdaBatchNumber: 'CDA-L1',
      cdaExpiryDate: '10/11/2026',
      quantity: 10,
      unit: 'kg',
      operatorReceived: 'Ivan',
    });
    expect(l1.success).toBe(true);
    expect(l1.item?.batchColor).toBe('AZUL');

    // 2º lote: VERDE
    const l2 = registerCdaEntry({
      itemName,
      category: 'Pescados',
      cdaBatchNumber: 'CDA-L2',
      cdaExpiryDate: '15/11/2026',
      quantity: 10,
      unit: 'kg',
      operatorReceived: 'Pabricio',
    });
    expect(l2.success).toBe(true);
    expect(l2.item?.batchColor).toBe('VERDE');

    // 3º lote: AMBAR
    const l3 = registerCdaEntry({
      itemName,
      category: 'Pescados',
      cdaBatchNumber: 'CDA-L3',
      cdaExpiryDate: '20/11/2026',
      quantity: 10,
      unit: 'kg',
      operatorReceived: 'Patricia',
    });
    expect(l3.success).toBe(true);
    expect(l3.item?.batchColor).toBe('AMBAR');

    // 4º lote: DEVE SER BLOQUEADO!
    const l4 = registerCdaEntry({
      itemName,
      category: 'Pescados',
      cdaBatchNumber: 'CDA-L4',
      cdaExpiryDate: '25/11/2026',
      quantity: 10,
      unit: 'kg',
      operatorReceived: 'Ivan',
    });
    expect(l4.success).toBe(false);
    expect(l4.error).toContain('Limite de 3 lotes ativos atingido');
  });

  it('fluxo completo do QR Code: 1ª leitura vai para DEGELO, 2ª leitura vai para PRODUÇÃO', () => {
    // Registra um item de teste
    const reg = registerCdaEntry({
      itemName: 'Matrinxã Especial Teste',
      category: 'Pescados',
      cdaBatchNumber: 'CDA-MAT-99',
      cdaExpiryDate: '30/11/2026',
      quantity: 8,
      unit: 'peças',
      operatorReceived: 'Mádio',
    });
    const qrCode = reg.item!.qrCode;

    // 1ª Leitura: Freezer -> Degelo
    const scan1 = processQrScan(qrCode, 'Mádio (Chefe Cozinha)', 'QR_CAMERA');
    expect(scan1.success).toBe(true);
    expect(scan1.fromStage).toBe('FREEZER');
    expect(scan1.toStage).toBe('DEGELO');
    expect(scan1.item?.currentStage).toBe('DEGELO');
    expect(scan1.item?.enteredDegeloAt).toBeDefined();

    // 2ª Leitura: Degelo -> Produção
    const scan2 = processQrScan(qrCode, 'Esmael (Sub Chefe)', 'QR_CAMERA');
    expect(scan2.success).toBe(true);
    expect(scan2.fromStage).toBe('DEGELO');
    expect(scan2.toStage).toBe('PRODUCAO');
    expect(scan2.item?.currentStage).toBe('PRODUCAO');
    expect(scan2.item?.enteredProducaoAt).toBeDefined();

    // 3ª Leitura: Já em produção
    const scan3 = processQrScan(qrCode, 'Mádio', 'QR_CAMERA');
    expect(scan3.success).toBe(false);
    expect(scan3.message).toContain('já se encontra em produção');
  });

  it('registra histórico de auditoria térmica para cada movimentação', () => {
    const initialLogsCount = getFreezerLogs().length;

    registerCdaEntry({
      itemName: 'Insumo Log Test',
      category: 'Geral',
      cdaBatchNumber: 'CDA-LOG',
      cdaExpiryDate: '10/12/2026',
      quantity: 5,
      unit: 'kg',
      operatorReceived: 'Ivan',
    });

    const logsAfterEntry = getFreezerLogs();
    expect(logsAfterEntry.length).toBe(initialLogsCount + 1);
    expect(logsAfterEntry[0].fromStage).toBe('ENTRADA_CDA');
    expect(logsAfterEntry[0].toStage).toBe('FREEZER');
  });
});
