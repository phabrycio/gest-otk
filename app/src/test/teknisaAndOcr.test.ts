import { describe, it, expect } from 'vitest';
import {
  parseTeknisaSalesCSV,
  parseTeknisaCancellationsCSV,
  detectTeknisaFileType,
  TEKNISA_SALES_CSV_SAMPLE,
  TEKNISA_CANCEL_CSV_SAMPLE,
} from '../services/teknisaParser';
import {
  parseDionisioReservationsCSV,
  parseDionisioReviewsCSV,
  DIONISIO_RESERVATIONS_SAMPLE,
  DIONISIO_REVIEWS_SAMPLE,
} from '../services/dionisioParser';
import {
  parseExcelAuditCSV,
  generateCorrectiveAction,
  SAMPLE_EXCEL_AUDIT_CSV,
} from '../services/auditParser';
import { getGeminiApiKey } from '../services/geminiOcr';

describe('Teknisa, Dionisio, Audit & AI Services Tests', () => {
  it('identifies Gemini API key configured in the environment', () => {
    const key = getGeminiApiKey();
    expect(key).toBeTruthy();
    expect(key.length).toBeGreaterThan(10);
  });

  it('detects Teknisa file types correctly from headers', () => {
    expect(detectTeknisaFileType(TEKNISA_SALES_CSV_SAMPLE)).toBe('SALES');
    expect(detectTeknisaFileType(TEKNISA_CANCEL_CSV_SAMPLE)).toBe('CANCELLATIONS');
    expect(detectTeknisaFileType('colunaA;colunaB\n1;2')).toBe('UNKNOWN');
  });

  it('parses Teknisa Odhen sales report with accurate columns, dishes and totals', () => {
    const res = parseTeknisaSalesCSV(TEKNISA_SALES_CSV_SAMPLE);
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();

    const data = res.data!;
    expect(data.source).toBe('TEKNISA_PDV');
    expect(data.lines.length).toBe(3);
    expect(data.totalItems).toBe(2);
    expect(data.totalCancelled).toBe(1);
    expect(data.totalRevenue).toBe(519.70);
  });

  it('parses Teknisa cancellations report and identifies consumption status', () => {
    const res = parseTeknisaCancellationsCSV(TEKNISA_CANCEL_CSV_SAMPLE);
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();

    const records = res.data!;
    expect(records.length).toBe(2);

    const caldeirada = records.find((r) => r.dishName.includes('Caldeirada'));
    expect(caldeirada).toBeDefined();
    expect(caldeirada?.reason).toBe('QUALIDADE');
    expect(caldeirada?.consumptionStatus).toBe('INSUMO_NAO_CONSUMIDO');

    const tambaqui = records.find((r) => r.dishName.includes('Tambaqui'));
    expect(tambaqui).toBeDefined();
    expect(tambaqui?.consumptionStatus).toBe('INSUMO_CONSUMIDO');
  });

  it('parses Dionisio CRM reservations and reviews reports accurately', () => {
    const res = parseDionisioReservationsCSV(DIONISIO_RESERVATIONS_SAMPLE);
    expect(res.success).toBe(true);
    expect(res.data.length).toBe(5);

    const checkIn = res.data.find((r) => r.status === 'CHECK_IN');
    expect(checkIn).toBeDefined();
    expect(checkIn?.customerName).toContain('Roberto');
    expect(checkIn?.partySize).toBe(2);

    const noShow = res.data.find((r) => r.status === 'NO_SHOW');
    expect(noShow).toBeDefined();

    const reviewsRes = parseDionisioReviewsCSV(DIONISIO_REVIEWS_SAMPLE);
    expect(reviewsRes.success).toBe(true);
    expect(reviewsRes.data.length).toBe(4);
    expect(reviewsRes.data[0].npsScore).toBe('PROMOTOR');
  });

  it('parses Excel Audit reports, detects non-conformities and generates 5W2H action plans', () => {
    const res = parseExcelAuditCSV(SAMPLE_EXCEL_AUDIT_CSV, 'Auditoria_Teste.xlsx');
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();

    const report = res.data!;
    expect(report.totalItems).toBe(8);
    expect(report.nonConformitiesCount).toBe(5);
    expect(report.conformitiesCount).toBe(3);
    expect(report.criticalCount).toBe(1);

    // Item crítico de temperatura de pescado
    const tempItem = report.items.find((it) => it.requirement.includes('temperatura'));
    expect(tempItem).toBeDefined();
    expect(tempItem?.status).toBe('NAO_CONFORME');
    expect(tempItem?.severity).toBe('CRITICA');
    expect(tempItem?.correctiveAction).toBeDefined();
    expect(tempItem?.deadlineDays).toBe(1);

    // Teste de gerador inteligente de ações corretivas
    const autoAction = generateCorrectiveAction('COZINHA', 'Validade e etiquetagem de molhos');
    expect(autoAction.assignedRole).toContain('Estoquista');
    expect(autoAction.relatedPopCode).toBe('POP-EST-01');
  });
});
