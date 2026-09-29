// ============================================================
// TIPOS DE AUDITORIAS, PROCESSOS OPERACIONAIS E INTEGRAÇÃO DIONÍSIO
// Tk Gestão e Tecnologia
// ============================================================

// --- Dionísio CRM & Reservas ---

export interface DionisioReservation {
  id: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone?: string;
  partySize: number;
  tableNumber?: string | number;
  status: 'CONFIRMADA' | 'CHECK_IN' | 'FINALIZADA' | 'NO_SHOW' | 'CANCELADA';
  source: 'WHATSAPP' | 'INSTAGRAM' | 'SITE' | 'TELEFONE' | 'BALCAO';
  turn: 'ALMOCO' | 'JANTAR';
  spendTotal?: number;
  specialRequests?: string;
}

export interface DionisioNpsReview {
  id: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  rating: number; // 1 a 10 ou 1 a 5
  feedbackCategory: 'COMIDA' | 'ATENDIMENTO' | 'TEMPO_ESPERA' | 'AMBIENTE' | 'PRECO';
  comment?: string;
  waiterMentioned?: string;
  npsScore: 'PROMOTOR' | 'NEUTRO' | 'DETRATOR';
  status: 'NOVO' | 'RESPONDIDO' | 'CONTATADO_GERENCIA';
}

export interface DionisioImportResult {
  reservations: DionisioReservation[];
  reviews: DionisioNpsReview[];
  totalGuests: number;
  noShowRatePct: number;
  avgRating: number;
}

// --- Auditorias Internas e Qualidade ---

export type AuditSeverity = 'CRITICA' | 'ALTA' | 'MEDIA' | 'LEVE';

export type AuditStatus = 'CONFORME' | 'NAO_CONFORME' | 'OBSERVACAO' | 'NAO_APLICAVEL';

export type ActionStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'VALIDADO_GERENTE';

export interface AuditItem {
  id: string;
  sector: 'COZINHA' | 'SALAO' | 'BAR' | 'DOCA_ESTOQUE' | 'ANVISA_HIGIENE' | 'ADMIN_CAIXA';
  requirement: string;                // O que foi auditado (ex: Temperatura das cubas de pescado)
  status: AuditStatus;
  severity?: AuditSeverity;
  evidenceNotes?: string;             // O que foi constatado pelo auditor
  photoUrl?: string;
  // Plano de Ação Gerado pela IA
  correctiveAction?: string;          // O que deve ser feito
  assignedRole?: string;              // Cargo responsável (ex: Sous Chef, Chefe de Fila)
  assignedEmployeeId?: string;        // Funcionário específico responsável
  assignedEmployeeName?: string;
  deadlineDays?: number;              // Prazo em dias
  dueDate?: string;                   // Data limite
  actionStatus: ActionStatus;
  relatedPopCode?: string;            // Código do POP/Processo da loja (ex: POP-04)
}

export interface AuditReport {
  id: string;
  title: string;                      // Ex: Auditoria Interna de Processos e Boas Práticas - 09/2026
  auditorName: string;                // Consultoria externa ou Gerência de Qualidade
  auditDate: string;
  overallScore: number;               // 0 a 100% de conformidade
  totalItems: number;
  conformitiesCount: number;
  nonConformitiesCount: number;
  criticalCount: number;
  items: AuditItem[];
  aiExecutiveSummary?: string;        // Diagnóstico e prioridades geradas pela IA
  sourceFileName?: string;
}

// --- Processos Operacionais da Unidade (POPs) ---

export interface OperationalProcess {
  id: string;
  code: string;                       // Ex: POP-COZ-01
  title: string;                      // Ex: Recebimento e Descongelamento Seguro de Pescados
  sector: 'COZINHA' | 'SALAO' | 'BAR' | 'DOCA_ESTOQUE' | 'ANVISA_HIGIENE' | 'ADMIN_CAIXA';
  frequency: 'DIARIO_ABERTURA' | 'DIARIO_FECHAMENTO' | 'POR_TURNO' | 'CONTINUO' | 'SEMANAL';
  responsibleRole: string;
  entryShiftHour?: '08:00' | '10:00' | '12:00' | '14:00' | 'TODOS';
  executionWindow?: string;           // Ex: "08:00 às 10:30 (Antes da Abertura da Loja)"
  shoppingRules?: string;             // Exigências e regras de Shopping Center (Doca, Lixo, Horários)
  description: string;
  criticalPoints: string[];           // Pontos críticos de controle (PCC)
  stepByStep?: string[];              // Passo a passo de execução sequencial
  materialsAndPPE?: string[];         // Materiais, produtos químicos (diluições) e EPIs
  linkedAuditNonConformitiesCount: number;
  lastUpdated: string;
}

// --- Funcionário da Unidade ---

export interface UnitEmployee {
  id: string;
  name: string;
  role: string;
  sector: 'COZINHA' | 'SALAO' | 'BAR' | 'DOCA_ESTOQUE' | 'LIMPEZA' | 'GERENCIA' | 'ADMIN_CAIXA';
  shift: 'ALMOCO' | 'JANTAR' | 'FOLGA' | 'ESCALA_6X1' | 'TURMA_08H' | 'TURMA_10H' | 'TURMA_12H' | 'TURMA_14H';
  entryTime?: '08:00' | '10:00' | '12:00' | '14:00' | 'VARIAVEL';
  phone?: string;
  admissionDate?: string;
  activeStatus: 'ATIVO' | 'FERIAS' | 'AFASTADO';
  assignedProcesses: string[];        // Códigos dos POPs sob sua responsabilidade
  openActionItemsCount: number;       // Pendências de auditoria sob sua responsabilidade
  npsScore?: number;                  // Média no Dionísio (se salão)
  cancelationErrorsCount?: number;    // Erros no Teknisa
}

// --- Insights de Gestão Cruzada (Teknisa + Dionísio + Auditoria + Equipe) ---

export interface ManagementInsight {
  id: string;
  category: 'REDUCAO_CUSTO' | 'QUALIDADE_AUDITORIA' | 'AUMENTO_VENDAS' | 'PRODUTIVIDADE_EQUIPE';
  title: string;
  description: string;
  impactEstimate: string;             // Ex: "Economia estimada de R$ 3.800/mês"
  actionPlan: string[];
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  sources: ('TEKNISA' | 'DIONISIO' | 'AUDITORIA' | 'PROCESSOS')[];
}
