// ============================================================
// PARSER E MOTOR DE PLANOS DE AÇÃO PARA AUDITORIAS EM EXCEL
// Tk Gestão e Tecnologia
// ============================================================

import type { AuditReport, AuditItem, AuditStatus, AuditSeverity } from '../types/auditAndOperations.types';

function detectSeparator(line: string): string {
  return (line.match(/;/g) || []).length > (line.match(/,/g) || []).length ? ';' : ',';
}

function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s.]/g, '_');
}

/**
 * Inteligência para gerar Ação Corretiva Automática (5W2H) com base no item auditado
 */
export function generateCorrectiveAction(
  sector: AuditItem['sector'],
  requirement: string,
  evidence?: string
): {
  correctiveAction: string;
  assignedRole: string;
  deadlineDays: number;
  relatedPopCode: string;
} {
  const text = (requirement + ' ' + (evidence || '')).toLowerCase();

  if (text.includes('temperatura') || text.includes('cuba') || text.includes('camara') || text.includes('resfriado')) {
    return {
      correctiveAction: 'Calibrar termômetros digitais, registrar planilha de aferição a cada 2h e acionar manutenção preventiva dos motores das câmaras.',
      assignedRole: 'Sous Chef / Cozinheiro Líder',
      deadlineDays: 1,
      relatedPopCode: 'POP-COZ-03',
    };
  }

  if (text.includes('etiqueta') || text.includes('validade') || text.includes('fefo') || text.includes('peps') || text.includes('lote')) {
    return {
      correctiveAction: 'Auditoria geral de etiquetagem em todas as cubas de mise en place. Descartar imediatamente produtos sem data de abertura e reforçar treinamento FEFO.',
      assignedRole: 'Estoquista / Responsável de Doca',
      deadlineDays: 1,
      relatedPopCode: 'POP-EST-01',
    };
  }

  if (text.includes('higiene') || text.includes('mao') || text.includes('uniforme') || text.includes('touca') || text.includes('adorno')) {
    return {
      correctiveAction: 'Recolher adornos pessoais antes do início do turno, abastecer saboneteira bactericida e álcool 70% em todas as pias de lavagem de mãos.',
      assignedRole: 'Líder de Higiene & Limpeza',
      deadlineDays: 2,
      relatedPopCode: 'POP-HIG-02',
    };
  }

  if (text.includes('descongelamento') || text.includes('peixe') || text.includes('pescado') || text.includes('carne')) {
    return {
      correctiveAction: 'Proibir terminantemente descongelamento em temperatura ambiente. Realizar descongelamento exclusivo sob refrigeração a até 4°C em cubas perfuradas.',
      assignedRole: 'Cozinheiro Líder / Chefe de Partida',
      deadlineDays: 1,
      relatedPopCode: 'POP-COZ-01',
    };
  }

  if (text.includes('boqueta') || text.includes('tempo') || text.includes('atraso') || text.includes('comanda')) {
    return {
      correctiveAction: 'Alinhar tempo de praça e boqueta com temporizador KDS. Pratos quentes devem sair em até 18 minutos no turno.',
      assignedRole: 'Chefe de Fila / Garçom Coordenador',
      deadlineDays: 3,
      relatedPopCode: 'POP-SAL-02',
    };
  }

  // Padrão Geral
  return {
    correctiveAction: `Ajustar processo operacional conforme especificação técnica. Realizar reciclagem com a equipe do setor de ${sector} e registrar evidência fotográfica.`,
    assignedRole: sector === 'COZINHA' ? 'Sous Chef' : sector === 'SALAO' ? 'Chefe de Fila' : 'Gerente de Operações',
    deadlineDays: 3,
    relatedPopCode: `POP-${sector.slice(0, 3)}-01`,
  };
}

/**
 * Parser de Planilhas de Auditoria (Excel salvo como CSV ou exportado de sistemas de qualidade)
 */
export function parseExcelAuditCSV(
  csvContent: string,
  fileName?: string
): {
  success: boolean;
  data?: AuditReport;
  errors: string[];
} {
  const lines = csvContent
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '');

  if (lines.length < 2) {
    return { success: false, errors: ['O arquivo de auditoria em Excel está vazio ou sem dados.'] };
  }

  const sep = detectSeparator(lines[0]);
  const headers = lines[0].split(sep).map(normalizeHeader);

  const colIdx: Record<string, number> = {};
  headers.forEach((h, idx) => {
    if (h.includes('setor') || h.includes('area') || h.includes('departamento')) colIdx['sector'] = idx;
    if (h.includes('item') || h.includes('requisito') || h.includes('pergunta') || h.includes('criterio')) colIdx['requirement'] = idx;
    if (h.includes('status') || h.includes('resultado') || h.includes('conformidade') || h.includes('avaliacao')) colIdx['status'] = idx;
    if (h.includes('gravidade') || h.includes('severidade') || h.includes('risco') || h.includes('peso')) colIdx['severity'] = idx;
    if (h.includes('evidencia') || h.includes('observacao') || h.includes('constatacao') || h.includes('descricao')) colIdx['evidence'] = idx;
    if (h.includes('responsavel')) colIdx['assignedEmployeeName'] = idx;
  });

  const items: AuditItem[] = [];
  let nonConformitiesCount = 0;
  let criticalCount = 0;
  let conformitiesCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(sep);
    if (row.length < 2) continue;

    const get = (key: string) => (colIdx[key] !== undefined ? row[colIdx[key]]?.trim() || '' : '');

    const requirement = get('requirement');
    if (!requirement) continue;

    const sectorRaw = get('sector').toUpperCase();
    let sector: AuditItem['sector'] = 'COZINHA';
    if (sectorRaw.includes('SALAO') || sectorRaw.includes('ATENDIMENTO')) sector = 'SALAO';
    else if (sectorRaw.includes('BAR') || sectorRaw.includes('BEBIDA')) sector = 'BAR';
    else if (sectorRaw.includes('DOCA') || sectorRaw.includes('ESTOQUE') || sectorRaw.includes('RECEBIMENTO')) sector = 'DOCA_ESTOQUE';
    else if (sectorRaw.includes('ANVISA') || sectorRaw.includes('HIGIENE') || sectorRaw.includes('LIMPEZA')) sector = 'ANVISA_HIGIENE';
    else if (sectorRaw.includes('CAIXA') || sectorRaw.includes('ADMIN')) sector = 'ADMIN_CAIXA';

    const statusRaw = get('status')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    let status: AuditStatus = 'CONFORME';
    if (statusRaw.includes('NAO') || statusRaw.includes('NC') || statusRaw.includes('REPROV') || statusRaw.includes('FALHA')) {
      status = 'NAO_CONFORME';
    } else if (statusRaw.includes('OBS') || statusRaw.includes('ALERTA') || statusRaw.includes('PARCIAL')) {
      status = 'OBSERVACAO';
    } else if (statusRaw.includes('NA') || statusRaw.includes('N/A')) {
      status = 'NAO_APLICAVEL';
    }

    const severityRaw = get('severity')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    let severity: AuditSeverity = 'MEDIA';
    if (severityRaw.includes('CRIT') || severityRaw.includes('GRAVE')) severity = 'CRITICA';
    else if (severityRaw.includes('ALTA') || severityRaw.includes('2')) severity = 'ALTA';
    else if (severityRaw.includes('LEVE') || severityRaw.includes('BAIXA')) severity = 'LEVE';

    const evidence = get('evidence');

    // Se for não conforme ou observação, gera o Plano de Ação Automático
    let correctiveAction: string | undefined;
    let assignedRole: string | undefined;
    let deadlineDays: number | undefined;
    let relatedPopCode: string | undefined;

    if (status === 'NAO_CONFORME' || status === 'OBSERVACAO') {
      const generated = generateCorrectiveAction(sector, requirement, evidence);
      correctiveAction = generated.correctiveAction;
      assignedRole = generated.assignedRole;
      deadlineDays = severity === 'CRITICA' ? 1 : severity === 'ALTA' ? 2 : generated.deadlineDays;
      relatedPopCode = generated.relatedPopCode;

      if (status === 'NAO_CONFORME') nonConformitiesCount++;
      if (severity === 'CRITICA') criticalCount++;
    } else if (status === 'CONFORME') {
      conformitiesCount++;
    }

    items.push({
      id: `AUDIT-ITEM-${i}-${Date.now()}`,
      sector,
      requirement,
      status,
      severity: status === 'CONFORME' ? undefined : severity,
      evidenceNotes: evidence || undefined,
      correctiveAction,
      assignedRole,
      assignedEmployeeName: get('assignedEmployeeName') || undefined,
      deadlineDays,
      actionStatus: status === 'CONFORME' ? 'CONCLUIDO' : 'PENDENTE',
      relatedPopCode,
    });
  }

  const totalEvaluated = conformitiesCount + nonConformitiesCount;
  const overallScore = totalEvaluated > 0 ? Math.round((conformitiesCount / totalEvaluated) * 100) : 100;

  const report: AuditReport = {
    id: `AUDIT-REP-${Date.now()}`,
    title: `Auditoria de Qualidade e Boas Práticas - ${new Date().toLocaleDateString('pt-BR')}`,
    auditorName: 'Consultoria de Qualidade & Processos',
    auditDate: new Date().toISOString().slice(0, 10),
    overallScore,
    totalItems: items.length,
    conformitiesCount,
    nonConformitiesCount,
    criticalCount,
    items,
    sourceFileName: fileName || 'auditoria_processos.xlsx',
    aiExecutiveSummary: `Auditoria avaliou ${items.length} requisitos com índice de conformidade de ${overallScore}%. Foram identificadas ${nonConformitiesCount} Não Conformidades (${criticalCount} críticas). O plano de ação corretiva foi gerado automaticamente para execução imediata pela gerência.`,
  };

  return { success: true, data: report, errors: [] };
}

// ---- Amostra Real de Auditoria em Excel para Teste e Validação Imediata ----

export const SAMPLE_EXCEL_AUDIT_CSV = `Setor;Requisito / Item Auditado;Status;Gravidade;Evidência Constatada pelo Auditor;Responsável
Cozinha;Controle de temperatura das cubas de pescados (Tambaqui e Pirarucu);NÃO CONFORME;CRÍTICA;Cuba de lombo de tambaqui marcando 7.8°C (limite máximo ANVISA é 4°C);Sous Chef
Cozinha;Etiquetagem com data de abertura e validade secundária nas cubas de mise en place;NÃO CONFORME;ALTA;Duas cubas de molho de tucupi pasteurizado sem etiqueta de data de abertura;Chefe de Partida
Doca & Estoque;Aferição de temperatura no recebimento de pescados congelados da CDA;CONFORME;LEVE;Planilha de recebimento assinada com temperatura registrada a -18°C;Estoquista
ANVISA & Higiene;Disponibilidade de sabonete bactericida e papel toalha nas pias da cozinha quente;NÃO CONFORME;MÉDIA;Pia central de higienização de mãos sem papel toalha no momento da inspeção;Líder de Higiene
Salão;Tempo de saída de pratos da boqueta no turno de almoço (meta < 20 min);NÃO CONFORME;MÉDIA;Mesa 12 registrou 28 minutos para entrega do Pirarucu em Crosta;Chefe de Fila
Bar;Validade de sucos naturais de frutas regionais (cupuaçu e graviola);CONFORME;LEVE;Garrafas identificadas com data e hora de extração;Bartender
Cozinha;Descongelamento seguro de lagostas e camarões sob refrigeração;CONFORME;LEVE;Pescados descongelando adequadamente em cuba perfurada a 3°C;Cozinheiro Líder
Doca & Estoque;Armazenamento de caixas de papelão em estrados elevados (> 15cm do piso);NÃO CONFORME;LEVE;Três fardos de farinha de Uarini depositados diretamente sobre o piso;Estoquista`;
