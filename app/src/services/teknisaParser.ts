// ============================================================
// PARSER DE RELATÓRIOS TEKNISA ODHEN PDV
// Tk Gestão e Tecnologia
//
// Suporta:
//  - Relatório de Vendas por Período (CSV ; ou , )
//  - Relatório de Cancelamentos / Devoluções
//  - Arquivos XLS convertidos para CSV
// ============================================================

import type { SalesImport, CancellationRecord } from '../types/stock.types';

// ---- Utilitários ----

/** Converte valor BR "1.234,56" para float 1234.56 */
function parseBRFloat(value: string): number {
  if (!value || value.trim() === '') return 0;
  return parseFloat(value.trim().replace(/\./g, '').replace(',', '.')) || 0;
}

/** Converte data BR "DD/MM/YYYY" para ISO "YYYY-MM-DD" */
function parseDate(value: string): string {
  const cleaned = value?.trim() ?? '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned; // já está em ISO
  const [d, m, y] = cleaned.split('/');
  if (!d || !m || !y) return cleaned;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

/** Detecta o separador do CSV (ponto e vírgula ou vírgula) */
function detectSeparator(line: string): string {
  return (line.match(/;/g) || []).length > (line.match(/,/g) || []).length ? ';' : ',';
}

/** Normaliza o nome da coluna (remove acentos, espaços, BOM, maiúsculas) */
function normalizeHeader(h: string): string {
  return h
    .trim()
    .replace(/^\uFEFF/, '') // BOM
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s.]/g, '_');
}

// ---- Mapeamento de colunas Teknisa → campos internos ----
// O Teknisa pode ter variações de nome dependendo da versão
const SALES_COL_MAP: Record<string, string> = {
  // Data / hora
  'data': 'date',
  'data_emissao': 'date',
  'hora': 'time',
  'hora_emissao': 'time',

  // Pedido / mesa
  'num_pedido': 'orderId',
  'numero_pedido': 'orderId',
  'pedido': 'orderId',
  'num_mesa': 'tableNumber',
  'mesa': 'tableNumber',
  'numero_mesa': 'tableNumber',

  // Produto
  'cod_produto': 'productCode',
  'codigo_produto': 'productCode',
  'codigo': 'productCode',
  'desc_produto': 'dishName',
  'descricao_produto': 'dishName',
  'descricao': 'dishName',
  'produto': 'dishName',

  // Quantidades e valores
  'qtd': 'qty',
  'quantidade': 'qty',
  'vlunitario': 'unitPrice',
  'vl_unitario': 'unitPrice',
  'valor_unitario': 'unitPrice',
  'vltotal': 'totalValue',
  'vl_total': 'totalValue',
  'valor_total': 'totalValue',
  'desconto': 'discount',
  'vldesconto': 'discount',
  'vlliquido': 'netValue',
  'vl_liquido': 'netValue',
  'valor_liquido': 'netValue',

  // Operacional
  'operador': 'waiterName',
  'garcom': 'waiterName',
  'turno': 'shift',
  'tipopagto': 'paymentType',
  'tipo_pagto': 'paymentType',
  'tipo_pagamento': 'paymentType',
  'status': 'status',
  'observacao': 'observation',
  'obs': 'observation',

  // Cancelamentos
  'motivo': 'reason',
  'motivo_cancelamento': 'reason',
  'aprovador': 'approver',
  'consumoinsumo': 'consumptionStatus',
  'consumo_insumo': 'consumptionStatus',
  'insumo_consumido': 'consumptionStatus',
};

const CANCEL_COL_MAP: Record<string, string> = { ...SALES_COL_MAP };

// ---- Normalização de status de consumo ----
function parseConsumptionStatus(value: string): 'INSUMO_CONSUMIDO' | 'INSUMO_NAO_CONSUMIDO' {
  const v = value?.toLowerCase().trim() ?? '';
  if (v === 'sim' || v === 's' || v === 'yes' || v === '1' || v === 'true') {
    return 'INSUMO_CONSUMIDO';
  }
  return 'INSUMO_NAO_CONSUMIDO';
}

// ---- Normalização de motivo de cancelamento ----
function parseCancelReason(value: string): CancellationRecord['reason'] {
  const v = value?.toUpperCase().replace(/\s+/g, '_').trim() ?? '';
  if (v.includes('QUALIDADE') || v.includes('RUIM') || v.includes('ERRO_PREPARO'))
    return 'QUALIDADE';
  if (v.includes('DESISTENCIA') || v.includes('DESISTÊNCIA') || v.includes('CLIENTE_DESISTIU'))
    return 'DESISTENCIA_CLIENTE';
  if (v.includes('DEVOLUCAO') || v.includes('DEVOLVIDO') || v.includes('DEVOLU'))
    return 'DEVOLUCAO';
  if (v.includes('ERRO') || v.includes('LANCAMENTO') || v.includes('GARCOM'))
    return 'ERRO_LANCAMENTO';
  if (v.includes('DESPERDICIO') || v.includes('VENCIMENTO'))
    return 'DESPERDICIO';
  return 'OUTRO';
}

// ---- Normalização de turno ----
function parseShift(value: string): 'ALMOCO' | 'JANTAR' | 'DIA_TODO' | string {
  const v = value?.toUpperCase().trim() ?? '';
  if (v.includes('ALMO') || v === 'A') return 'ALMOCO';
  if (v.includes('JANT') || v === 'J') return 'JANTAR';
  if (v.includes('DIA') || v.includes('TODO')) return 'DIA_TODO';
  return v || 'DIA_TODO';
}

// ---- Status de item de venda ----
function parseLineStatus(value: string): 'ENTREGUE' | 'CANCELADO' | 'PENDENTE' {
  const v = value?.toUpperCase().trim() ?? '';
  if (v === 'CANCELADO' || v === 'C' || v === 'CANCEL') return 'CANCELADO';
  if (v === 'ENTREGUE' || v === 'E' || v === 'OK') return 'ENTREGUE';
  return 'ENTREGUE';
}

// ============================================================
// PARSER PRINCIPAL — Relatório de Vendas Teknisa
// ============================================================

export interface TeknisaSalesParseResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  data?: SalesImport;
  rawRowCount: number;
  unmappedColumns: string[];
}

export function parseTeknisaSalesCSV(
  csvContent: string,
  referenceDate?: string,
  fileName?: string
): TeknisaSalesParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const unmappedColumns: string[] = [];

  const lines = csvContent
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '');

  if (lines.length < 2) {
    return { success: false, errors: ['Arquivo vazio ou com apenas cabeçalho.'], warnings: [], rawRowCount: 0, unmappedColumns: [] };
  }

  const separator = detectSeparator(lines[0]);
  const rawHeaders = lines[0].split(separator);
  const headers = rawHeaders.map(normalizeHeader);

  // Mapeia posição de cada coluna conhecida
  const colIndex: Record<string, number> = {};
  headers.forEach((h, i) => {
    const mapped = SALES_COL_MAP[h];
    if (mapped) {
      colIndex[mapped] = i;
    } else {
      // Tenta correspondência parcial
      const partialMatch = Object.keys(SALES_COL_MAP).find((k) => h.includes(k) || k.includes(h));
      if (partialMatch) {
        colIndex[SALES_COL_MAP[partialMatch]] = i;
        warnings.push(`Coluna "${rawHeaders[i]}" mapeada por correspondência parcial como "${SALES_COL_MAP[partialMatch]}".`);
      } else {
        unmappedColumns.push(rawHeaders[i]);
      }
    }
  });

  // Verifica colunas obrigatórias
  const required = ['dishName', 'qty'];
  for (const req of required) {
    if (colIndex[req] === undefined) {
      errors.push(`Coluna obrigatória não encontrada: "${req}". Verifique se o arquivo é um relatório de vendas Teknisa.`);
    }
  }
  if (errors.length > 0) {
    return { success: false, errors, warnings, rawRowCount: lines.length - 1, unmappedColumns };
  }

  const get = (row: string[], field: string): string => {
    const idx = colIndex[field];
    return idx !== undefined ? (row[idx] ?? '').trim() : '';
  };

  // Agrega dados por turno e referência
  let totalRevenue = 0;
  let totalCancelled = 0;
  const processedLines: SalesImport['lines'] = [];
  const detectedDate = referenceDate;

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(separator);
    if (row.length < 2) continue;

    const status = parseLineStatus(get(row, 'status'));
    const qty = parseBRFloat(get(row, 'qty')) || 1;
    const totalValue = parseBRFloat(get(row, 'totalValue'));
    const dishName = get(row, 'dishName');
    const productCode = get(row, 'productCode');

    if (!dishName && !productCode) {
      warnings.push(`Linha ${i + 1}: sem nome de produto. Ignorada.`);
      continue;
    }

    if (status === 'CANCELADO') {
      totalCancelled += qty;
    } else {
      totalRevenue += totalValue;
    }

    const lineId = `LINE-${i}-${Date.now()}`;
    const rowDate = parseDate(get(row, 'date')) || detectedDate || new Date().toISOString().slice(0, 10);
    const rowShift = parseShift(get(row, 'shift')) === 'ALMOCO' ? 'ALMOCO' : 'JANTAR';

    processedLines.push({
      id: lineId,
      dishName: dishName || productCode,
      productCode: productCode || undefined,
      qtyOrdered: qty,
      qtyDelivered: status === 'ENTREGUE' ? qty : 0,
      qtyCancelled: status === 'CANCELADO' ? qty : 0,
      unitPrice: parseBRFloat(get(row, 'unitPrice')),
      totalRevenue: totalValue,
      shift: rowShift,
      date: rowDate,
      status: status as any,
      theoreticalConsumption: [], // será preenchido pelo motor ao cruzar com fichas
    });
  }

  const now = new Date().toISOString();
  const importDate = detectedDate ?? new Date().toISOString().split('T')[0];

  const result: SalesImport = {
    id: `TEKN-${Date.now()}`,
    source: 'TEKNISA_PDV',
    fileName: fileName,
    importDate: now,
    referenceDate: importDate,
    status: 'PROCESSADO',
    totalItems: processedLines.filter((l) => l.status === 'ENTREGUE').length,
    totalCancelled,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    lines: processedLines,
    importedBy: 'Gerente / Teknisa PDV',
    processedAt: now,
    errorMessages: warnings,
  };

  return {
    success: true,
    errors: [],
    warnings,
    data: result,
    rawRowCount: lines.length - 1,
    unmappedColumns,
  };
}

// ============================================================
// PARSER — Relatório de Cancelamentos Teknisa
// ============================================================

export interface TeknisaCancelParseResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  data?: CancellationRecord[];
  rawRowCount: number;
}

export function parseTeknisaCancellationsCSV(
  csvContent: string
): TeknisaCancelParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const lines = csvContent
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '');

  if (lines.length < 2) {
    return { success: false, errors: ['Arquivo vazio.'], warnings: [], rawRowCount: 0 };
  }

  const separator = detectSeparator(lines[0]);
  const headers = lines[0].split(separator).map(normalizeHeader);

  const colIndex: Record<string, number> = {};
  headers.forEach((h, i) => {
    const mapped = CANCEL_COL_MAP[h];
    if (mapped) colIndex[mapped] = i;
  });

  const get = (row: string[], field: string): string => {
    const idx = colIndex[field];
    return idx !== undefined ? (row[idx] ?? '').trim() : '';
  };

  const records: CancellationRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(separator);
    if (row.length < 2) continue;

    const dishName = get(row, 'dishName');
    if (!dishName) continue;

    const uPrice = parseBRFloat(get(row, 'unitPrice'));
    const tVal = parseBRFloat(get(row, 'totalValue'));
    records.push({
      id: `CANCEL-TEKN-${i}-${Date.now()}`,
      date: parseDate(get(row, 'date')) || new Date().toISOString().split('T')[0],
      time: get(row, 'time') || '00:00:00',
      orderId: get(row, 'orderId') || undefined,
      tableNumber: get(row, 'tableNumber') || undefined,
      dishName,
      productCode: get(row, 'productCode') || undefined,
      qty: parseBRFloat(get(row, 'qty')) || 1,
      unitValue: uPrice || (tVal > 0 ? tVal : 0),
      unitPrice: uPrice,
      totalValue: tVal,
      reason: parseCancelReason(get(row, 'reason')),
      reasonDetail: get(row, 'reason') || undefined,
      consumptionStatus: parseConsumptionStatus(get(row, 'consumptionStatus')),
      waiterName: get(row, 'waiterName') || undefined,
      managerApproved: Boolean(get(row, 'approver')),
      approvedBy: get(row, 'approver') || undefined,
      shift: parseShift(get(row, 'shift')) as any,
      source: 'TEKNISA_PDV',
      stockImpactApplied: false,
    });
  }

  return {
    success: true,
    errors: [],
    warnings,
    data: records,
    rawRowCount: lines.length - 1,
  };
}

// ============================================================
// VALIDADOR — Verifica se um arquivo parece ser do Teknisa
// ============================================================

export function detectTeknisaFileType(
  csvContent: string
): 'SALES' | 'CANCELLATIONS' | 'UNKNOWN' {
  const firstLine = csvContent.split('\n')[0]?.toLowerCase() ?? '';

  // Cancellamentos têm "motivo" ou "aprovador"
  if (firstLine.includes('motivo') || firstLine.includes('aprovador')) {
    return 'CANCELLATIONS';
  }
  // Vendas têm produto + valor total
  if (
    (firstLine.includes('produto') || firstLine.includes('descricao')) &&
    (firstLine.includes('total') || firstLine.includes('vl'))
  ) {
    return 'SALES';
  }
  return 'UNKNOWN';
}

// ============================================================
// HELPER — Gera CSV de exemplo para o usuário configurar
// ============================================================

export const TEKNISA_SALES_CSV_SAMPLE = `Data;Hora;Num.Pedido;Num.Mesa;Cód.Produto;Desc.Produto;Qtd;VlUnitario;VlTotal;Desconto;VlLiquido;Operador;Turno;TipoPagto;Status;Observacao
22/09/2026;19:32:00;001245;12;1042;Tambaqui na Brasa com Farofa de Uarini;2;179,90;359,80;0,00;359,80;João Silva;Jantar;Crédito;ENTREGUE;
22/09/2026;19:45:00;001246;05;1310;Filé Mignon ao Molho de Cogumelos;1;159,90;159,90;0,00;159,90;Maria Santos;Jantar;Pix;ENTREGUE;
22/09/2026;20:10:00;001247;08;1055;Caldeirada de Camarão Gigante;1;189,90;189,90;0,00;189,90;Pedro Lima;Jantar;Débito;CANCELADO;Reclamação de qualidade`;

export const TEKNISA_CANCEL_CSV_SAMPLE = `Data;Hora;Num.Pedido;Num.Mesa;Cód.Produto;Desc.Produto;Qtd;VlTotal;Motivo;Operador;Aprovador;Turno;ConsumoInsumo
22/09/2026;20:10:00;001247;08;1055;Caldeirada de Camarão Gigante;1;189,90;Qualidade;Pedro Lima;Gerente;Jantar;NÃO
22/09/2026;21:05:00;001263;03;1042;Tambaqui na Brasa;1;179,90;Desistencia Cliente;João Silva;Gerente;Jantar;SIM`;
