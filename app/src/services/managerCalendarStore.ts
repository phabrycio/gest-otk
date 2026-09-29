// ============================================================
// STORE DE CALENDÁRIO & PRAZOS OPERACIONAIS DO GERENTE
// Gestão de Licenças, Vencimentos Fiscais, ANVISA, RH e Operação
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

export type DeadlineCategory = 'ANVISA_SANITARIO' | 'FISCAL_CONTABIL' | 'RH_EQUIPE' | 'MANUTENCAO_OPERACAO' | 'OUTROS';
export type DeadlinePriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type DeadlineStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'ATRASADO';

export interface CalendarDeadlineItem {
  id: string;
  title: string;
  description?: string;
  category: DeadlineCategory;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: DeadlinePriority;
  status: DeadlineStatus;
  responsibleName: string;
  isRecurring?: boolean;
  recurrencePeriod?: 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

const STORAGE_KEY = 'tk_manager_calendar_deadlines_v1';

// Prazos operacionais padrão de um restaurante de shopping (iniciam pendentes)
export const INITIAL_CALENDAR_DEADLINES: CalendarDeadlineItem[] = [];

export function getCalendarDeadlines(): CalendarDeadlineItem[] {
  if (typeof window === 'undefined') return INITIAL_CALENDAR_DEADLINES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CALENDAR_DEADLINES));
      return INITIAL_CALENDAR_DEADLINES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CALENDAR_DEADLINES;
  }
}

export function saveCalendarDeadlines(items: CalendarDeadlineItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('tk_calendar_updated', { detail: items }));
  } catch (err) {
    console.error('Falha ao salvar calendário:', err);
  }
}

export function addCalendarDeadline(item: Omit<CalendarDeadlineItem, 'id'>): CalendarDeadlineItem {
  const current = getCalendarDeadlines();
  const newItem: CalendarDeadlineItem = {
    ...item,
    id: `cal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };
  const updated = [newItem, ...current];
  saveCalendarDeadlines(updated);
  return newItem;
}

export function updateCalendarDeadline(id: string, updates: Partial<CalendarDeadlineItem>): CalendarDeadlineItem | null {
  const current = getCalendarDeadlines();
  let updatedItem: CalendarDeadlineItem | null = null;
  const updated = current.map((it) => {
    if (it.id === id) {
      updatedItem = { ...it, ...updates };
      return updatedItem;
    }
    return it;
  });
  if (updatedItem) {
    saveCalendarDeadlines(updated);
  }
  return updatedItem;
}

export function toggleDeadlineCompleted(id: string, completedBy: string = 'Gerente'): CalendarDeadlineItem | null {
  const current = getCalendarDeadlines();
  let updatedItem: CalendarDeadlineItem | null = null;
  const updated = current.map((it) => {
    if (it.id === id) {
      const isNowCompleted = it.status !== 'CONCLUIDO';
      updatedItem = {
        ...it,
        status: isNowCompleted ? 'CONCLUIDO' : 'PENDENTE',
        completedAt: isNowCompleted ? new Date().toISOString() : undefined,
        completedBy: isNowCompleted ? completedBy : undefined,
      };
      return updatedItem;
    }
    return it;
  });
  if (updatedItem) {
    saveCalendarDeadlines(updated);
  }
  return updatedItem;
}

export function deleteCalendarDeadline(id: string): void {
  const current = getCalendarDeadlines();
  const updated = current.filter((it) => it.id !== id);
  saveCalendarDeadlines(updated);
}
