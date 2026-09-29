/**
 * storeEscalaService.ts
 * Gestão de Escala de Trabalho com 4 Turnos Operacionais da Loja:
 * - 08:00: Equipe de Abertura (Cozinha mise en place, estoque, salão abertura)
 * - 10:00: Equipe de Atendentes (Garçons, cumins, recepção do salão)
 * - 12:00: Equipe de Gestão e Líderes (Gerente geral, chef de cozinha, líderes de salão/bar)
 * - 14:00: Equipe de Fechamento (Equipe noturna, fechamento, higienização, encerramento de caixa)
 *
 * Suporta importação futura de planilha Excel / CSV enviada pelo RH,
 * cadastro manual e visualização organizada por posto/estação.
 */

export type StoreWorkShiftId = 'ABERTURA_08H' | 'ATENDENTES_10H' | 'GESTAO_12H' | 'FECHAMENTO_14H';

export interface StoreShiftDefinition {
  id: StoreWorkShiftId;
  name: string;
  arrivalTime: string;
  badgeColor: string;
  borderColor: string;
  bgColor: string;
  description: string;
  targetStations: string[];
}

export const STORE_SHIFTS: Record<StoreWorkShiftId, StoreShiftDefinition> = {
  ABERTURA_08H: {
    id: 'ABERTURA_08H',
    name: 'Equipe de Abertura',
    arrivalTime: '08:00',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    borderColor: 'border-amber-300',
    bgColor: 'from-amber-500/10 to-amber-500/5',
    description: 'Chegada às 08h: Recebimento de insumos, mise-en-place da cozinha, calibração de chopeiras e abertura do salão',
    targetStations: ['Cozinha Quente/Fria', 'Pré-Preparo', 'Higienização', 'Estoque / Recebimento', 'Abertura Salão']
  },
  ATENDENTES_10H: {
    id: 'ATENDENTES_10H',
    name: 'Equipe de Atendentes',
    arrivalTime: '10:00',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    borderColor: 'border-blue-300',
    bgColor: 'from-blue-500/10 to-blue-500/5',
    description: 'Chegada às 10h: Alinhamento de mesas, polimento de taças, briefing de atendimento e atendimento no almoço',
    targetStations: ['Salão Principal', 'Varanda / Deck', 'Bar Salão', 'Recepção / Hostess']
  },
  GESTAO_12H: {
    id: 'GESTAO_12H',
    name: 'Equipe de Gestão & Líderes',
    arrivalTime: '12:00',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    borderColor: 'border-purple-300',
    bgColor: 'from-purple-500/10 to-purple-500/5',
    description: 'Chegada às 12h: Gestão do pico de movimento, controle de CMV, auditorias ANVISA, coordenação de equipe e caixa',
    targetStations: ['Gerência Geral', 'Chefia de Cozinha', 'Liderança de Salão', 'Coordenação de Bar']
  },
  FECHAMENTO_14H: {
    id: 'FECHAMENTO_14H',
    name: 'Equipe de Fechamento',
    arrivalTime: '14:00',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderColor: 'border-emerald-300',
    bgColor: 'from-emerald-500/10 to-emerald-500/5',
    description: 'Chegada às 14h: Atendimento do jantar, contagem de chopp/garrafas no bar, fechamento de caixa e higienização final',
    targetStations: ['Salão Jantar', 'Cozinha Noturna', 'Fechamento de Bar', 'Higienização & Encerramento']
  }
};

export interface ShiftScheduleEntry {
  id: string;
  employeeName: string;
  role: string;
  department: 'SALAO' | 'COZINHA' | 'BAR' | 'GESTAO' | 'HIGIENIZACAO';
  shiftId: StoreWorkShiftId;
  station: string; // Onde o colaborador está escalado (ex: "Grelha Carnes", "Praça A - Mesas 1 a 10", "Chopeiras", "Recepção")
  date: string; // YYYY-MM-DD
  status: 'ESCALADO' | 'PRESENTE' | 'FOLGA' | 'ATESTADO' | 'TROCA_SOLICITADA';
  source: 'RH_EXCEL' | 'MANUAL';
  notes?: string;
}

const STORAGE_KEY = 'tk_gestao_escala_turnos_v1';

export function getStoredShiftSchedule(): ShiftScheduleEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveShiftSchedule(entries: ShiftScheduleEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Falha ao salvar escala', err);
  }
}

export function addShiftEntry(entry: Omit<ShiftScheduleEntry, 'id'>): ShiftScheduleEntry {
  const all = getStoredShiftSchedule();
  const created: ShiftScheduleEntry = {
    ...entry,
    id: `esc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
  };
  all.push(created);
  saveShiftSchedule(all);
  return created;
}

export function updateShiftEntry(id: string, updates: Partial<ShiftScheduleEntry>): ShiftScheduleEntry | null {
  const all = getStoredShiftSchedule();
  const idx = all.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  saveShiftSchedule(all);
  return all[idx];
}

export function removeShiftEntry(id: string): void {
  const all = getStoredShiftSchedule().filter((e) => e.id !== id);
  saveShiftSchedule(all);
}

/**
 * Importador simples para Excel / CSV colado (Tab-separated ou vírgula/ponto-e-vírgula)
 * Formato esperado de cada linha:
 * Colaborador [TAB/;/,] Cargo [TAB/;/,] Turno(08h/10h/12h/14h) [TAB/;/,] Posto/Estação [TAB/;/,] Setor
 */
export function importScheduleFromRawText(rawText: string, targetDate: string): { importedCount: number; errors: string[] } {
  const lines = rawText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const errors: string[] = [];
  const entries: ShiftScheduleEntry[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Pular cabeçalhos comuns de Excel
    if (line.toLowerCase().includes('colaborador') && line.toLowerCase().includes('cargo')) continue;

    const parts = line.split(/\t|;|,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((p) => p.trim().replace(/^"|"$/g, ''));
    if (parts.length < 2) {
      errors.push(`Linha ${i + 1} ignorada (poucas colunas): "${line}"`);
      continue;
    }

    const [name, role, rawShift, station, rawDept] = parts;
    if (!name) continue;

    // Detectar turno
    let shiftId: StoreWorkShiftId = 'ABERTURA_08H';
    const sLow = (rawShift || '').toLowerCase();
    if (sLow.includes('10') || sLow.includes('atendente')) {
      shiftId = 'ATENDENTES_10H';
    } else if (sLow.includes('12') || sLow.includes('gest') || sLow.includes('lider')) {
      shiftId = 'GESTAO_12H';
    } else if (sLow.includes('14') || sLow.includes('fecha') || sLow.includes('noite')) {
      shiftId = 'FECHAMENTO_14H';
    } else if (sLow.includes('8') || sLow.includes('abert')) {
      shiftId = 'ABERTURA_08H';
    }

    // Detectar departamento
    let dept: ShiftScheduleEntry['department'] = 'SALAO';
    const dLow = ((rawDept || '') + ' ' + role).toLowerCase();
    if (dLow.includes('cozinha') || dLow.includes('chef') || dLow.includes('grelha') || dLow.includes('mise')) {
      dept = 'COZINHA';
    } else if (dLow.includes('bar') || dLow.includes('chopp') || dLow.includes('bebida')) {
      dept = 'BAR';
    } else if (dLow.includes('geren') || dLow.includes('gest') || dLow.includes('lider')) {
      dept = 'GESTAO';
    } else if (dLow.includes('higien') || dLow.includes('limpeza') || dLow.includes('copa')) {
      dept = 'HIGIENIZACAO';
    }

    entries.push({
      id: `esc-imp-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
      employeeName: name,
      role: role || 'Colaborador',
      department: dept,
      shiftId,
      station: station || 'A definir',
      date: targetDate,
      status: 'ESCALADO',
      source: 'RH_EXCEL',
    });
  }

  if (entries.length > 0) {
    const existing = getStoredShiftSchedule();
    // Sobrescrever ou anexar por data
    const filtered = existing.filter((e) => e.date !== targetDate);
    saveShiftSchedule([...filtered, ...entries]);
  }

  return { importedCount: entries.length, errors };
}
