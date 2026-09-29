// ============================================================
// SERVIÇO DE LOGS DE AUDITORIA DO SISTEMA (COMPLETO)
// Tk Gestão e Tecnologia • Exclusivo Master Admin (Pabricio)
// ============================================================

import type { SystemAuditLog, AuditLogFilters, AuditLogModule, AuditLogSeverity } from '../types/auditLog.types';
import { getSupabaseClient } from './supabaseClient';

const STORAGE_KEY_AUDIT_LOGS = 'tk_system_audit_logs';

// Mock inicial realista com histórico recente de ações no restaurante
const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [];

/**
 * Retorna todos os logs de auditoria salvos.
 */
export function getAuditLogs(): SystemAuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler logs de auditoria:', e);
    return INITIAL_AUDIT_LOGS;
  }
}

/**
 * Registra um novo evento no log de auditoria do sistema.
 * Persiste localmente e tenta sincronizar com o Supabase.
 */
export function logSystemAction(logData: {
  userId: string;
  userName: string;
  userRole: string;
  restaurantId?: string;
  restaurantName?: string;
  action: string;
  actionLabel?: string;
  module: AuditLogModule | string;
  description?: string;
  details?: string | Record<string, any>;
  metadata?: Record<string, any>;
  severity?: AuditLogSeverity;
}): SystemAuditLog {
  const finalDescription = logData.description || (typeof logData.details === 'string' ? logData.details : '') || logData.action || 'Ação registrada no sistema';
  const finalDetails = logData.details !== undefined ? logData.details : finalDescription;
  const finalMetadata = logData.metadata || (typeof logData.details === 'object' ? logData.details : {});

  const newLog: SystemAuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleString('pt-BR'),
    userId: logData.userId,
    userName: logData.userName,
    userRole: logData.userRole,
    restaurantId: logData.restaurantId,
    restaurantName: logData.restaurantName,
    action: logData.action,
    actionLabel: logData.actionLabel || logData.action,
    module: logData.module,
    description: finalDescription,
    severity: logData.severity || 'INFO',
    ipOrDevice: typeof navigator !== 'undefined' && navigator.userAgent.includes('Mobile') ? 'Dispositivo Móvel' : 'Navegador Web Desktop',
    ipAddress: typeof navigator !== 'undefined' && navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
    details: finalDetails,
    metadata: finalMetadata,
  };

  try {
    const existing = getAuditLogs();
    const updated = [newLog, ...existing].slice(0, 1000); // Mantém até 1000 logs em cache
    localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao salvar log localmente:', e);
  }

  // Sincronização assíncrona com Supabase se disponível
  try {
    const client = getSupabaseClient();
    if (client) {
      client.from('system_audit_logs').insert([{
        id: newLog.id,
        restaurant_id: newLog.restaurantId || null,
        user_id: newLog.userId,
        user_name: newLog.userName,
        user_role: newLog.userRole,
        action: newLog.action,
        module: newLog.module,
        description: finalDescription,
        metadata: finalMetadata,
        severity: newLog.severity,
        created_at: newLog.timestamp,
      }]).then(({ error }: any) => {
        if (error) {
          console.warn('Log arquivado localmente (Supabase pendente):', error.message);
        }
      });
    }
  } catch (err) {
    // Continua normalmente
  }

  return newLog;
}

/**
 * Filtra logs com base nos parâmetros da interface.
 */
export function filterAuditLogs(
  logsOrFilters: SystemAuditLog[] | AuditLogFilters,
  optionalFilters?: AuditLogFilters
): SystemAuditLog[] {
  const logs = Array.isArray(logsOrFilters) ? logsOrFilters : getAuditLogs();
  const filters = Array.isArray(logsOrFilters) ? optionalFilters! : logsOrFilters;

  return logs.filter((log) => {
    // Filtro por texto de busca
    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        log.userName.toLowerCase().includes(q) ||
        log.userRole.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        (log.actionLabel || log.action || '').toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Filtro por Usuário
    if (filters.userId && log.userId !== filters.userId) {
      return false;
    }

    // Filtro por Módulo
    if (filters.module !== 'TODOS' && log.module !== filters.module) {
      return false;
    }

    // Filtro por Gravidade
    if (filters.severity !== 'TODAS' && log.severity !== filters.severity) {
      return false;
    }

    // Filtro por Data
    if (filters.dateRange !== 'TODOS') {
      const logDate = new Date(log.timestamp).getTime();
      const now = Date.now();
      const diffHours = (now - logDate) / (1000 * 60 * 60);

      if (filters.dateRange === 'HOJE' && diffHours > 24) return false;
      if (filters.dateRange === '7DIAS' && diffHours > 24 * 7) return false;
      if (filters.dateRange === '30DIAS' && diffHours > 24 * 30) return false;
    }

    return true;
  });
}
