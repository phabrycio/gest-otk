// ============================================================
// AUDITORIA IMUTÁVEL — REGISTRO DE TRILHA DE AUDITORIA (AUDIT TRAIL)
// Tk Gestão e Tecnologia • Sistema de Segurança Corporativo
// ============================================================

import type { UserRole } from '../types/restaurant.types';

export interface DigitalSignatureInfo {
  signedByName: string;
  signedByRole: string;
  matricula: string;
  signedAt: string;
  signatureHash: string;
  statement: string; // Ex: "Inventário supervisionado e conferido presencialmente."
}

export interface AuditRecord {
  id: string;
  timestamp: string;      // ISO String
  dateFormatted: string;  // DD/MM/AAAA
  timeFormatted: string;  // HH:mm:ss
  userId: string;
  userName: string;
  userRole: UserRole;
  restaurantId: string;
  ip: string;
  device: string;
  module: string;         // 'FINANCEIRO' | 'ESTOQUE' | 'COMPRAS' | 'INVENTARIO' | 'ESCALAS' | 'SEGURANCA' | 'AUTENTICACAO'
  action: string;         // Ex: 'INVENTARIO_SUPERVISIONADO_E_CONFERIDO', 'SOLICITACAO_COMPRA_CRIADA', 'COMPRA_APROVADA'
  previousValue?: string | null;
  newValue?: string | null;
  digitalSignature?: DigitalSignatureInfo | null;
  isArchived: boolean;
}

const STORAGE_KEY = 'tk_immutable_audit_trail_v1';

// Armazenamento em memória com persistência segura
let memoryAuditRecords: AuditRecord[] = [];

function getDeviceName(): string {
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return 'Mobile iOS (Tablet/App)';
    if (/Android/.test(ua)) return 'Mobile Android (Tablet/App)';
    if (/Windows/.test(ua)) return 'Desktop Workstation (Windows)';
    if (/Mac/.test(ua)) return 'Desktop Workstation (macOS)';
    return 'Web Browser / Terminal PDV';
  }
  return 'Terminal Local (Node/System)';
}

function loadAuditTrail(): AuditRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryAuditRecords = parsed;
        return parsed;
      }
    }
  } catch {
    /* fallback to memory */
  }
  return memoryAuditRecords;
}

function persistAuditTrail(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryAuditRecords));
  } catch (err) {
    console.error('Falha ao persistir trilha de auditoria imutável:', err);
  }
}

/**
 * Registra um evento de auditoria imutável.
 * NUNCA pode ser excluído do sistema.
 */
export function recordAuditAction(params: {
  userId: string;
  userName: string;
  userRole: UserRole;
  restaurantId: string;
  module: string;
  action: string;
  previousValue?: string | null;
  newValue?: string | null;
  digitalSignature?: DigitalSignatureInfo | null;
  ip?: string;
  device?: string;
}): AuditRecord {
  loadAuditTrail();

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('pt-BR');
  const timeFormatted = now.toLocaleTimeString('pt-BR');

  const record: AuditRecord = {
    id: `AUDIT-${now.getTime()}-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: now.toISOString(),
    dateFormatted,
    timeFormatted,
    userId: params.userId,
    userName: params.userName,
    userRole: params.userRole,
    restaurantId: params.restaurantId,
    ip: params.ip || '192.168.10.42 (Rede Local Loja)',
    device: params.device || getDeviceName(),
    module: params.module,
    action: params.action,
    previousValue: params.previousValue ?? null,
    newValue: params.newValue ?? null,
    digitalSignature: params.digitalSignature ?? null,
    isArchived: false,
  };

  memoryAuditRecords.unshift(record); // Mais recente primeiro
  persistAuditTrail();

  // Dispara evento global para componentes reativos
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tk_audit_record_created', { detail: record }));
  }

  return record;
}

/**
 * Consulta registros da trilha de auditoria
 */
export function getAuditTrail(filter?: {
  module?: string;
  userId?: string;
  restaurantId?: string;
  includeArchived?: boolean;
}): AuditRecord[] {
  const records = loadAuditTrail();
  return records.filter((r) => {
    if (!filter?.includeArchived && r.isArchived) return false;
    if (filter?.module && r.module !== filter.module) return false;
    if (filter?.userId && r.userId !== filter.userId) return false;
    if (filter?.restaurantId && r.restaurantId !== filter.restaurantId) return false;
    return true;
  });
}

/**
 * Nenhum registro pode ser excluído!
 * Apenas arquivado para conformidade fiscal e governança corporativa.
 */
export function archiveAuditRecord(id: string, requesterUserId: string): boolean {
  loadAuditTrail();
  const item = memoryAuditRecords.find((r) => r.id === id);
  if (!item) return false;

  item.isArchived = true;
  persistAuditTrail();

  // Registra o próprio arquivamento na trilha
  recordAuditAction({
    userId: requesterUserId,
    userName: 'Sistema Governança',
    userRole: 'DONO',
    restaurantId: item.restaurantId,
    module: 'AUDITORIA',
    action: 'REGISTRO_ARQUIVADO',
    previousValue: `Ativo (ID: ${id})`,
    newValue: 'Arquivado para Histórico Permanente',
  });

  return true;
}

/**
 * Gera hash criptográfico simulado para assinatura eletrônica
 */
export function generateDigitalSignatureHash(
  userName: string,
  matricula: string,
  role: string,
  content: string
): string {
  const payload = `${userName}|${matricula}|${role}|${content}|${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = (hash << 5) - hash + payload.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
  return `TK-SIG-${hex}-${Date.now().toString(36).toUpperCase()}`;
}
