// ============================================================
// TIPOS DO SISTEMA DE AUDITORIA & LOGS DE USUÁRIOS
// Tk Gestão e Tecnologia • Exclusivo Master Admin (Pabricio)
// ============================================================

export type AuditLogSeverity = 'INFO' | 'AVISO' | 'CRITICO' | 'SUCESSO';

export type AuditLogModule =
  | 'AUTH'
  | 'ESTOQUE'
  | 'FREEZER'
  | 'CONFIGURACOES'
  | 'FINANCEIRO'
  | 'RELATORIOS'
  | 'SISTEMA'
  | 'AUTENTICACAO'
  | 'FREEZER_CDA'
  | 'VENDAS_CAIXA'
  | 'CHECKLIST_OP'
  | 'USUARIOS_SENHAS'
  | 'RESTAURANTES'
  | 'SISTEMA_INFRA';

export interface SystemAuditLog {
  id: string;
  timestamp: string; // ISO String
  formattedTime?: string; // "26/09/2026 23:45:10"
  userId: string;
  userName: string;
  userRole: string;
  restaurantId?: string;
  restaurantName?: string;
  action: string;
  actionLabel?: string;
  module: AuditLogModule | string;
  description: string;
  details?: string | Record<string, any>;
  metadata?: Record<string, any>;
  severity: AuditLogSeverity;
  ipAddress?: string;
  ipOrDevice?: string;
}

export interface AuditLogFilters {
  searchQuery: string;
  userId: string;
  module: AuditLogModule | 'TODOS';
  severity: AuditLogSeverity | 'TODAS';
  dateRange: 'HOJE' | '7DIAS' | '30DIAS' | 'TODOS';
}
