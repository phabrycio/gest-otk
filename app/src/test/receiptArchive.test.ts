import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFiscalReceipts,
  getMonthSummaries,
  getPending4thMonthAlert,
  addFiscalReceipt,
  downloadMonthReceiptsZip,
  confirmPurgeAndFreeOnlineStorage,
} from '../services/receiptArchiveStore';
import { getAuditLogs } from '../services/auditLogStore';

describe('Fiscal Receipt Archive & 3-Month Retention Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();

    // Cria notas fiscais de teste para validar a regra de retenção de 90 dias
    const testMonths = ['2026-09-10', '2026-08-15', '2026-07-20', '2026-06-05', '2026-06-12', '2026-06-18', '2026-06-25'];
    testMonths.forEach((d, idx) => {
      addFiscalReceipt({
        receiptNumber: `NF-TEST-${idx + 100}`,
        supplierName: `Fornecedor Teste ${idx}`,
        cnpjOrCpf: '04.238.891/0001-77',
        category: 'CARNES_PESCADOS',
        amount: 500 + idx * 50,
        issueDate: d,
        uploadedBy: 'Ivan (Gerente Geral)',
        imageUrl: '',
        fileName: `NF_${idx}.png`,
      });
    });
  });

  it('loads test fiscal receipts with valid schema and multiple months', () => {
    const receipts = getFiscalReceipts();
    expect(receipts.length).toBeGreaterThanOrEqual(7);

    const first = receipts[0];
    expect(first.id).toBeDefined();
    expect(first.receiptNumber).toBeDefined();
    expect(first.supplierName).toBeDefined();
    expect(first.amount).toBeGreaterThan(0);
    expect(first.category).toBeDefined();
    expect(first.monthBucket).toBeDefined();
    expect(first.status).toBe('ONLINE_ATIVO');
  });

  it('calculates month summaries and flags the 4th month as expired (> 90 days)', () => {
    const summaries = getMonthSummaries();
    expect(summaries.length).toBeGreaterThanOrEqual(4);

    // Mês atual (index 0) e meses recentes (< 3) devem estar online ativo
    expect(summaries[0].isExpired4thMonth).toBe(false);
    expect(summaries[1].isExpired4thMonth).toBe(false);
    expect(summaries[2].isExpired4thMonth).toBe(false);

    // 4º Mês (index 3 - Junho 2026) deve estar vencido para download e expurgo
    const fourthMonth = summaries[3];
    expect(fourthMonth.isExpired4thMonth).toBe(true);
    expect(fourthMonth.status).toBe('PENDENTE_DOWNLOAD_EXPURGO');
    expect(fourthMonth.totalReceipts).toBeGreaterThanOrEqual(4);
    expect(fourthMonth.totalAmount).toBeGreaterThan(0);
  });

  it('detects pending 4th month alert for the manager dashboard', () => {
    const alert = getPending4thMonthAlert();
    expect(alert).not.toBeNull();
    expect(alert?.isExpired4thMonth).toBe(true);
    expect(alert?.monthBucket).toBe('2026-06');
    expect(alert?.status).toBe('PENDENTE_DOWNLOAD_EXPURGO');
  });

  it('adds a new fiscal receipt and generates audit log', () => {
    const newReceipt = addFiscalReceipt({
      receiptNumber: '998877',
      supplierName: 'Distribuidora Panair Teste',
      cnpjOrCpf: '01.234.567/0001-89',
      category: 'HORTIFRUTI_FEIRA',
      amount: 850.50,
      issueDate: '2026-09-26',
      uploadedBy: 'Ivan (Gerente Geral)',
      imageUrl: '',
      fileName: 'NF_998877.png',
      notes: 'Compra de teste de hortifruti',
    });

    expect(newReceipt.id).toBeDefined();
    expect(newReceipt.receiptNumber).toBe('998877');
    expect(newReceipt.amount).toBe(850.50);
    expect(newReceipt.status).toBe('ONLINE_ATIVO');

    // Confere se está salvo no store
    const all = getFiscalReceipts();
    expect(all[0].id).toBe(newReceipt.id);

    // Confere se gerou log de auditoria
    const logs = getAuditLogs();
    const receiptLog = logs.find((l) => l.action === 'INSERCAO_NOTA_FISCAL');
    expect(receiptLog).toBeDefined();
    expect(receiptLog?.description).toContain('998877');
  });

  it('generates zip file with CSV and JSON manifest for a month', async () => {
    // Mock seguro de URL.createObjectURL e click para o jsdom
    if (!global.URL.createObjectURL) {
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    } else {
      vi.spyOn(global.URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    }
    if (!global.URL.revokeObjectURL) {
      global.URL.revokeObjectURL = vi.fn();
    } else {
      vi.spyOn(global.URL, 'revokeObjectURL').mockImplementation(() => {});
    }
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const result = await downloadMonthReceiptsZip('2026-06', 'Ivan (Gerente Geral)');
    expect(result.success).toBe(true);
    expect(result.fileName).toContain('2026_06');
    expect(result.totalFiles).toBeGreaterThanOrEqual(4);

    // Confere se registrou log de auditoria do download local
    const logs = getAuditLogs();
    const zipLog = logs.find((l) => l.action === 'BACKUP_LOCAL_NOTAS_ZIP');
    expect(zipLog).toBeDefined();
  });

  it('confirms local backup and purges online images to free Supabase cloud storage', () => {
    const { purgedCount, freedKb } = confirmPurgeAndFreeOnlineStorage('2026-06', 'Ivan (Gerente Geral)');
    expect(purgedCount).toBeGreaterThanOrEqual(4);
    expect(freedKb).toBeGreaterThan(0);

    // Confere se o status mudou para ARQUIVADO_LOCAL_EXPURGADO
    const receipts = getFiscalReceipts();
    const juneReceipts = receipts.filter((r) => r.monthBucket === '2026-06');
    juneReceipts.forEach((r) => {
      expect(r.status).toBe('ARQUIVADO_LOCAL_EXPURGADO');
      expect(r.localArchivedBy).toBe('Ivan (Gerente Geral)');
      expect(r.localArchivedAt).toBeDefined();
      expect(r.imageUrl).toContain('data:image/svg+xml;base64');
    });

    // Verifica se o alerta do 4º mês foi resolvido após o expurgo
    const alertAfterPurge = getPending4thMonthAlert();
    expect(alertAfterPurge).toBeNull();

    // Confere se registrou o log crítico de auditoria de expurgo
    const logs = getAuditLogs();
    const purgeLog = logs.find((l) => l.action === 'EXPURGO_STORAGE_NOTAS');
    expect(purgeLog).toBeDefined();
    expect(purgeLog?.severity).toBe('AVISO');
  });
});
