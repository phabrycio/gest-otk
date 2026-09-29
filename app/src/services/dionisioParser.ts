// ============================================================
// PARSER DE RELATÓRIOS DO SISTEMA DIONÍSIO (CRM & RESERVAS)
// Tk Gestão e Tecnologia
// ============================================================

import type { DionisioReservation, DionisioNpsReview, DionisioImportResult } from '../types/auditAndOperations.types';

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
 * Parser de Relatório de Reservas exportado pelo Dionísio
 */
export function parseDionisioReservationsCSV(csvContent: string): {
  success: boolean;
  data: DionisioReservation[];
  errors: string[];
} {
  const lines = csvContent
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '');

  if (lines.length < 2) {
    return { success: false, data: [], errors: ['Arquivo de reservas do Dionísio está vazio.'] };
  }

  const sep = detectSeparator(lines[0]);
  const headers = lines[0].split(sep).map(normalizeHeader);

  const colIdx: Record<string, number> = {};
  headers.forEach((h, idx) => {
    if (h.includes('cliente') || h.includes('nome')) colIdx['customerName'] = idx;
    if (h.includes('data')) colIdx['date'] = idx;
    if (h.includes('hora') || h.includes('horario')) colIdx['time'] = idx;
    if (h.includes('pax') || h.includes('pessoas') || h.includes('qtd')) colIdx['partySize'] = idx;
    if (h.includes('mesa')) colIdx['tableNumber'] = idx;
    if (h.includes('status')) colIdx['status'] = idx;
    if (h.includes('origem') || h.includes('canal')) colIdx['source'] = idx;
    if (h.includes('telefone') || h.includes('celular') || h.includes('whatsapp')) colIdx['customerPhone'] = idx;
    if (h.includes('consumo') || h.includes('total') || h.includes('gasto')) colIdx['spendTotal'] = idx;
  });

  const reservations: DionisioReservation[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(sep);
    if (row.length < 2) continue;

    const get = (key: string) => (colIdx[key] !== undefined ? row[colIdx[key]]?.trim() || '' : '');

    const name = get('customerName');
    if (!name) continue;

    const statusRaw = get('status').toUpperCase();
    let status: DionisioReservation['status'] = 'CONFIRMADA';
    if (statusRaw.includes('CHECK') || statusRaw.includes('PRESENTE')) status = 'CHECK_IN';
    else if (statusRaw.includes('FINAL') || statusRaw.includes('CONCLUIDA')) status = 'FINALIZADA';
    else if (statusRaw.includes('NO') || statusRaw.includes('FALTOU') || statusRaw.includes('NAO_COMPARECEU')) status = 'NO_SHOW';
    else if (statusRaw.includes('CANCEL')) status = 'CANCELADA';

    const sourceRaw = get('source').toUpperCase();
    let source: DionisioReservation['source'] = 'WHATSAPP';
    if (sourceRaw.includes('INSTA')) source = 'INSTAGRAM';
    else if (sourceRaw.includes('SITE')) source = 'SITE';
    else if (sourceRaw.includes('TEL')) source = 'TELEFONE';
    else if (sourceRaw.includes('BALC')) source = 'BALCAO';

    const timeStr = get('time') || '19:30';
    const hour = parseInt(timeStr.slice(0, 2)) || 19;
    const turn = hour < 16 ? 'ALMOCO' : 'JANTAR';

    reservations.push({
      id: `DION-RES-${i}-${Date.now()}`,
      date: get('date') || new Date().toISOString().slice(0, 10),
      time: timeStr,
      customerName: name,
      customerPhone: get('customerPhone') || undefined,
      partySize: parseInt(get('partySize')) || 2,
      tableNumber: get('tableNumber') || undefined,
      status,
      source,
      turn,
      spendTotal: parseFloat(get('spendTotal').replace(',', '.')) || undefined,
    });
  }

  return { success: true, data: reservations, errors: [] };
}

/**
 * Parser de Relatório de NPS / Avaliações do Dionísio
 */
export function parseDionisioReviewsCSV(csvContent: string): {
  success: boolean;
  data: DionisioNpsReview[];
  errors: string[];
} {
  const lines = csvContent
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '');

  if (lines.length < 2) {
    return { success: false, data: [], errors: ['Arquivo de avaliações do Dionísio vazio.'] };
  }

  const sep = detectSeparator(lines[0]);
  const headers = lines[0].split(sep).map(normalizeHeader);

  const colIdx: Record<string, number> = {};
  headers.forEach((h, idx) => {
    if (h.includes('cliente') || h.includes('nome')) colIdx['customerName'] = idx;
    if (h.includes('data')) colIdx['date'] = idx;
    if (h.includes('nota') || h.includes('rating') || h.includes('nps')) colIdx['rating'] = idx;
    if (h.includes('comentario') || h.includes('feedback') || h.includes('opiniao')) colIdx['comment'] = idx;
    if (h.includes('garcom') || h.includes('atendente')) colIdx['waiterMentioned'] = idx;
    if (h.includes('categoria')) colIdx['category'] = idx;
  });

  const reviews: DionisioNpsReview[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(sep);
    if (row.length < 2) continue;

    const get = (key: string) => (colIdx[key] !== undefined ? row[colIdx[key]]?.trim() || '' : '');

    const name = get('customerName');
    if (!name) continue;

    const ratingNum = parseFloat(get('rating')) || 5;
    const npsScore = ratingNum >= 9 ? 'PROMOTOR' : ratingNum >= 7 ? 'NEUTRO' : 'DETRATOR';

    const comment = get('comment');
    let category: DionisioNpsReview['feedbackCategory'] = 'ATENDIMENTO';
    const cLower = comment.toLowerCase();
    if (cLower.includes('prato') || cLower.includes('comida') || cLower.includes('sabor') || cLower.includes('frio')) {
      category = 'COMIDA';
    } else if (cLower.includes('demor') || cLower.includes('espera') || cLower.includes('tempo')) {
      category = 'TEMPO_ESPERA';
    } else if (cLower.includes('ambiente') || cLower.includes('musica') || cLower.includes('ar')) {
      category = 'AMBIENTE';
    }

    reviews.push({
      id: `DION-REV-${i}-${Date.now()}`,
      date: get('date') || new Date().toISOString().slice(0, 10),
      customerName: name,
      customerPhone: get('customerPhone') || undefined,
      rating: ratingNum,
      feedbackCategory: category,
      comment: comment || undefined,
      waiterMentioned: get('waiterMentioned') || undefined,
      npsScore,
      status: 'NOVO',
    });
  }

  return { success: true, data: reviews, errors: [] };
}

// ---- Amostras do Dionísio para Demonstração e Testes ----

export const DIONISIO_RESERVATIONS_SAMPLE = `Data;Hora;Cliente;Telefone;Pax;Mesa;Origem;Status;ConsumoTotal
22/09/2026;19:30;Carlos Eduardo Souza;(92) 98112-3344;4;12;WhatsApp;FINALIZADA;549,60
22/09/2026;20:00;Dra. Luciana Mendonça;(92) 99221-5566;6;VIP-1;Instagram;FINALIZADA;920,00
22/09/2026;20:15;Roberto Albuquerque;(92) 98444-1122;2;05;Site;CHECK_IN;289,00
22/09/2026;20:30;Família Castelo Branco;(92) 98777-9900;8;15;WhatsApp;NO_SHOW;0,00
22/09/2026;21:00;Mariana Vasconcelos;(92) 99333-8877;3;08;WhatsApp;CANCELADA;0,00`;

export const DIONISIO_REVIEWS_SAMPLE = `Data;Cliente;Nota;Comentario;Garcom;Categoria
22/09/2026;Carlos Eduardo Souza;10;Tambaqui perfeito e o atendimento do João Silva foi impecável!;João Silva;Atendimento
22/09/2026;Dra. Luciana Mendonça;9;Excelente ambiente para comemorar aniversário. Risoto de tucupi sensacional.;Pedro Lima;Comida
22/09/2026;Marcos Vinicius;6;Prato principal demorou mais de 40 minutos para sair da boqueta.;Maria Santos;Tempo de Espera
22/09/2026;Renata Guimarães;10;Atendimento acolhedor, ambiente climatizado e drinks muito bem preparados.;Pedro Lima;Ambiente`;
