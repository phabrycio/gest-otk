/**
 * rhStaffService.ts
 *
 * Sistema Próprio e Completo de RH & Dossiê do Colaborador:
 * - Funcionários Efetivos (CLT)
 * - Músicos da Casa (Cachê, datas de apresentação, estilo musical)
 * - Freelancers para Contratação Esporádica (Diária/Cachê, setor, contato, disponibilidade)
 * - Histórico & Anotações de Dossiê:
 *   * Elogios de Clientes / Gestão
 *   * Punições / Advertências / Feedbacks
 *   * Férias (Período aquisitivo, data de gozo, status)
 *   * Horas Extras & Banco de Horas (Saldo de horas, entradas e saídas)
 *   * Atestados Médicos & Licenças
 *   * Exames Ocupacionais / ASO
 */

export type StaffContractType = 'CLT_EFETIVO' | 'MUSICO_CASA' | 'FREELANCER_EXTRA' | 'ESTAGIO';

export interface StaffFeedbackRecord {
  id: string;
  type: 'ELOGIO' | 'ADVERTENCIA_VERBAL' | 'ADVERTENCIA_ESCRITA' | 'SUSPENSAO' | 'FEEDBACK_GERENCIAL';
  date: string;
  author: string;
  title: string;
  description: string;
  acknowledgedByEmployee?: boolean;
}

export interface StaffVacationRecord {
  id: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: 'PROGRAMADA' | 'EM_GOZO' | 'CONCLUIDA' | 'CANCELADA';
  accrualPeriod: string; // Ex: "2025/2026"
  notes?: string;
}

export interface StaffHourBankEntry {
  id: string;
  date: string;
  type: 'CREDITO_HORA_EXTRA' | 'DEBITO_FOLGA_COMPENSATORIA' | 'PAGAMENTO_HORA_EXTRA';
  hours: number; // Ex: +2.5 ou -4.0
  reason: string;
  registeredBy: string;
}

export interface CompleteStaffMember {
  id: string;
  name: string;
  contractType: StaffContractType;
  role: string;
  department: 'SALAO' | 'COZINHA' | 'BAR' | 'GERENCIA' | 'HIGIENIZACAO' | 'ARTISTICO_MUSICAL' | 'APOIO_EVENTOS';
  shiftArrivalTime: '08:00' | '10:00' | '12:00' | '14:00' | 'ESPORADICO';
  phone: string;
  email?: string;
  cpf?: string;
  pixKey?: string;
  admissionDate: string; // YYYY-MM-DD
  status: 'ATIVO' | 'FERIAS' | 'AFASTADO' | 'DESLIGADO' | 'DISPONIVEL_CHAMADA';
  
  // Financeiro / Pagamento
  baseSalaryOrFee: number; // Salário base (CLT) ou Cachê/Diária (Músicos/Freelancers)
  feeType?: 'MENSAL' | 'POR_APRESENTACAO' | 'POR_DIARIA_TURNO';

  // Banco de Horas
  hourBankBalance: number; // Saldo de horas (positivo = crédito, negativo = débito)
  hourBankHistory: StaffHourBankEntry[];

  // Férias
  vacations: StaffVacationRecord[];

  // Ocorrências e Dossiê
  feedbacksAndPunishements: StaffFeedbackRecord[];

  // Dados Específicos para Músicos
  musicalInfo?: {
    artisticName?: string;
    musicalGenre?: string; // Ex: "MPB", "Sertanejo", "Samba", "Voz e Violão"
    instrument?: string;
    hasSoundEquipment?: boolean;
    usualSchedule?: string; // Ex: "Sextas e Sábados das 20h às 23h"
  };

  // Dados Específicos para Freelancers
  freelanceInfo?: {
    specialty?: string; // Ex: "Garçom de Apoio Eventos", "Cumin Extra", "Pia Noturna"
    rating?: number; // 1 a 5 estrelas
    availabilityDays?: string[]; // Ex: ["SEXTA", "SABADO", "DOMINGO"]
    lastCalledDate?: string;
  };

  notes?: string;
}

const STORAGE_KEY_RH_STAFF = 'tk_rh_complete_staff_v1';

export const INITIAL_RH_STAFF: CompleteStaffMember[] = [];

export function getCompleteStaffMembers(): CompleteStaffMember[] {
  if (typeof window === 'undefined') return INITIAL_RH_STAFF;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RH_STAFF);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_RH_STAFF, JSON.stringify(INITIAL_RH_STAFF));
      return INITIAL_RH_STAFF;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RH_STAFF;
  }
}

export function saveCompleteStaffMembers(list: CompleteStaffMember[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_RH_STAFF, JSON.stringify(list));
  } catch (e) {
    console.error('Falha ao salvar staff de RH', e);
  }
}

export function addStaffMember(data: Omit<CompleteStaffMember, 'id' | 'hourBankBalance' | 'hourBankHistory' | 'vacations' | 'feedbacksAndPunishements'>): CompleteStaffMember {
  const all = getCompleteStaffMembers();
  const created: CompleteStaffMember = {
    ...data,
    id: `staff-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    hourBankBalance: 0,
    hourBankHistory: [],
    vacations: [],
    feedbacksAndPunishements: [],
  };
  all.unshift(created);
  saveCompleteStaffMembers(all);
  return created;
}

export function updateStaffMember(id: string, updates: Partial<CompleteStaffMember>): CompleteStaffMember | null {
  const all = getCompleteStaffMembers();
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  saveCompleteStaffMembers(all);
  return all[idx];
}

export function addStaffFeedback(staffId: string, feedback: Omit<StaffFeedbackRecord, 'id' | 'date'>): CompleteStaffMember | null {
  const all = getCompleteStaffMembers();
  const idx = all.findIndex((m) => m.id === staffId);
  if (idx === -1) return null;

  const newFeedback: StaffFeedbackRecord = {
    ...feedback,
    id: `fb-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
  };

  all[idx].feedbacksAndPunishements.unshift(newFeedback);
  saveCompleteStaffMembers(all);
  return all[idx];
}

export function addStaffHourBankEntry(staffId: string, entry: Omit<StaffHourBankEntry, 'id' | 'date'>): CompleteStaffMember | null {
  const all = getCompleteStaffMembers();
  const idx = all.findIndex((m) => m.id === staffId);
  if (idx === -1) return null;

  const newEntry: StaffHourBankEntry = {
    ...entry,
    id: `hb-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
  };

  all[idx].hourBankHistory.unshift(newEntry);
  // Atualizar saldo
  if (entry.type === 'CREDITO_HORA_EXTRA') {
    all[idx].hourBankBalance = Math.round((all[idx].hourBankBalance + entry.hours) * 10) / 10;
  } else {
    all[idx].hourBankBalance = Math.round((all[idx].hourBankBalance - entry.hours) * 10) / 10;
  }

  saveCompleteStaffMembers(all);
  return all[idx];
}

export function addStaffVacation(staffId: string, vac: Omit<StaffVacationRecord, 'id'>): CompleteStaffMember | null {
  const all = getCompleteStaffMembers();
  const idx = all.findIndex((m) => m.id === staffId);
  if (idx === -1) return null;

  const newVac: StaffVacationRecord = {
    ...vac,
    id: `vac-${Date.now()}`,
  };

  all[idx].vacations.unshift(newVac);
  saveCompleteStaffMembers(all);
  return all[idx];
}
