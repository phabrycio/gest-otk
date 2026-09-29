// ============================================================
// RBAC SECURITY & MIDDLEWARE DE AUTORIZAÇÃO CORPORATIVO
// Tk Gestão e Tecnologia • Isolamento Absoluto de Dados
// ============================================================

import type { UserAccount, UserRole, StockSector, RolePermissions } from '../types/restaurant.types';
import { ROLE_ACCESS_LEVELS } from '../types/restaurant.types';
import { getPermissions } from './permissions';
import { recordAuditAction } from './auditTrailStore';

export interface AuthorizationResult {
  allowed: boolean;
  statusCode: 200 | 403;
  reason?: string;
  userRole: UserRole;
  accessLevel: number;
}

/**
 * Validação rigorosa de segurança corporativa no padrão backend/service.
 * Qualquer tentativa indevida gera log automático de violação na Trilha de Auditoria Imutável.
 */
export function authorizeAction(params: {
  user: UserAccount | null;
  requiredPermission: keyof RolePermissions;
  targetModule: string;
  targetSector?: StockSector;
  targetRestaurantId?: string;
}): AuthorizationResult {
  const { user, requiredPermission, targetModule, targetSector, targetRestaurantId } = params;

  // 1. Verificação de autenticação
  if (!user || !user.isActive) {
    return {
      allowed: false,
      statusCode: 403,
      reason: 'Usuário não autenticado ou conta inativa no sistema.',
      userRole: 'OPERADOR',
      accessLevel: 0,
    };
  }

  const accessLevel = ROLE_ACCESS_LEVELS[user.role] ?? 20;

  // 2. Isolamento de Unidade (Multitenancy)
  if (targetRestaurantId && user.restaurantId !== targetRestaurantId && accessLevel < 100) {
    recordSecurityViolation(user, targetModule, 'TENTATIVA_ACESSO_OUTRA_UNIDADE');
    return {
      allowed: false,
      statusCode: 403,
      reason: 'Acesso negado: Tentativa de acessar dados de outra filial sem permissão executiva.',
      userRole: user.role,
      accessLevel,
    };
  }

  // 3. Regra Fundamental: NENHUM dado financeiro/DRE pode ser visto por não-autorizados (< 90)
  const isFinancialModule = ['FINANCEIRO', 'DRE', 'LUCRO_LIQUIDO', 'SALARIOS', 'FLUXO_CAIXA'].includes(
    targetModule.toUpperCase()
  );
  if (isFinancialModule && accessLevel < 90) {
    recordSecurityViolation(user, targetModule, 'TENTATIVA_ACESSO_FINANCEIRO_SIGILOSO');
    return {
      allowed: false,
      statusCode: 403,
      reason: 'Acesso Restrito: Informações financeiras e estratégicas são exclusivas do Gerente e Donos.',
      userRole: user.role,
      accessLevel,
    };
  }

  // 4. Isolamento Setorial de Estoque
  if (targetSector) {
    const isOwnerOrManager = accessLevel >= 90;
    const isSupervisor = accessLevel === 75; // Supervisora pode conferir, mas com visibilidade controlada

    if (!isOwnerOrManager && !isSupervisor && user.sector !== targetSector) {
      recordSecurityViolation(user, targetModule, `TENTATIVA_ACESSO_SETOR_${targetSector}`);
      return {
        allowed: false,
        statusCode: 403,
        reason: `Acesso negado: Seu perfil tem permissão exclusiva para o setor ${user.sector}.`,
        userRole: user.role,
        accessLevel,
      };
    }
  }

  // 5. Verificação da Permissão Granular
  const permissions = getPermissions(user.role);
  const hasPermission = Boolean(permissions[requiredPermission]);

  if (!hasPermission) {
    recordSecurityViolation(user, targetModule, `SEM_PERMISSAO_${String(requiredPermission)}`);
    return {
      allowed: false,
      statusCode: 403,
      reason: `Acesso não concedido para a ação requerida (${String(requiredPermission)}).`,
      userRole: user.role,
      accessLevel,
    };
  }

  return {
    allowed: true,
    statusCode: 200,
    userRole: user.role,
    accessLevel,
  };
}

/**
 * Registra violação de segurança diretamente na Trilha de Auditoria Imutável
 */
function recordSecurityViolation(user: UserAccount, module: string, violationReason: string) {
  try {
    recordAuditAction({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      restaurantId: user.restaurantId,
      module: 'SEGURANCA_RBAC',
      action: `ACESSO_NEGADO_403: ${violationReason}`,
      previousValue: null,
      newValue: `Módulo: ${module} • Bloqueado pelo Kernel de Segurança`,
    });
  } catch {
    /* ignore fallback */
  }
}

/**
 * Retorna as abas do sistema estritamente permitidas para um determinado usuário/cargo.
 * Nenhum outro elemento de interface sequer existirá para o colaborador.
 */
export function getAllowedTabsForUser(user: UserAccount | null): string[] {
  if (!user) return ['cardapio_cliente'];

  const role = user.role;

  // Bartender: Ambiente 100% isolado
  if (role === 'BARTENDER' || role === 'CHEFE_BAR') {
    return ['bar', 'cardapio_cliente'];
  }

  // ASG: Ambiente 100% isolado
  if (role === 'ASG') {
    return ['asg_dashboard', 'operacao', 'cardapio_cliente'];
  }

  // Chefe de Cozinha / Subchefe
  if (role === 'CHEFE_COZINHA' || role === 'SUB_CHEFE_COZINHA' || role === 'SUBCHEFE') {
    return ['cozinha_dashboard', 'suprimentos', 'camara', 'operacao', 'cardapio_cliente'];
  }

  // Supervisora de Loja (Acesso 75)
  if (role === 'SUPERVISOR' || role === 'SUPERVISORA') {
    return [
      'supervisor_dashboard',
      'fila_espera',
      'operacao',
      'suprimentos',
      'bar',
      'camara',
      'equipe',
      'auditoria',
      'cardapio_cliente',
    ];
  }

  // Gerente Geral (Acesso 90)
  if (role === 'GERENTE') {
    return [
      'gestao',
      'financeiro',
      'gerente_auditoria',
      'calendario',
      'fila_espera',
      'operacao',
      'suprimentos',
      'bar',
      'camara',
      'auditoria',
      'equipe',
      'marketing',
      'email_ia',
      'copilot',
      'cardapio_cliente',
    ];
  }

  // Donos & Criador Master (Acesso 100)
  return [
    'gestao',
    'financeiro',
    'gerente_auditoria',
    'supervisor_dashboard',
    'calendario',
    'fila_espera',
    'operacao',
    'suprimentos',
    'bar',
    'camara',
    'auditoria',
    'equipe',
    'marketing',
    'email_ia',
    'copilot',
    'cardapio_cliente',
  ];
}
