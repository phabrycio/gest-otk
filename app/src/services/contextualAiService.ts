// ============================================================
// IA CONTEXTUAL POR CARGO — INSIGHTS PROATIVOS ESPECIALIZADOS
// Tk Gestão e Tecnologia • Inteligência Artificial Especializada
// ============================================================

import type { UserRole, UserAccount } from '../types/restaurant.types';

export interface ContextualAiAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY' | 'ACTION_REQUIRED';
  title: string;
  message: string;
  category: string;
  timestamp: string;
  actionLabel?: string;
  actionTab?: string;
}

export interface ContextualAiProfile {
  role: UserRole;
  title: string;
  subtitle: string;
  badge: string;
  primaryColor: string;
  summaryQuote: string;
  alerts: ContextualAiAlert[];
}

export function getContextualAiProfile(user: UserAccount | null): ContextualAiProfile {
  const role: UserRole = user?.role || 'OPERADOR';

  // 1. SUPERVISORA (Acesso 75)
  if (role === 'SUPERVISOR' || role === 'SUPERVISORA') {
    return {
      role,
      title: 'IA da Supervisão Operacional',
      subtitle: 'Monitoramento contínuo de escalas, presença, checklists e compras',
      badge: 'Supervisora IA • Online',
      primaryColor: 'from-teal-600 to-emerald-700',
      summaryQuote: 'Dia 1 de operação iniciado. Monitorando equipe, escalas e rotinas operacionais em tempo real.',
      alerts: [],
    };
  }

  // 2. GERENTE (Acesso 90)
  if (role === 'GERENTE' || role === 'GERENTE_TREINAMENTO') {
    return {
      role,
      title: 'IA da Auditoria Gerencial',
      subtitle: 'Auditor da Unidade • Indicadores, CMV, rupturas e feedback executivo',
      badge: 'Auditoria Loja • Ativa',
      primaryColor: 'from-blue-600 to-indigo-800',
      summaryQuote: 'Dia 1 de operação iniciado. Acompanhando abertura de caixa, vendas e indicadores da unidade.',
      alerts: [],
    };
  }

  // 3. CHEFE DE COZINHA / SUBCHEFE (Acesso 60)
  if (role === 'CHEFE_COZINHA' || role === 'SUB_CHEFE_COZINHA' || role === 'SUBCHEFE') {
    return {
      role,
      title: 'IA da Cozinha & Produção',
      subtitle: 'Controle de câmara fria, validade PEPS, perdas e reposição',
      badge: 'Cozinha IA • Brasa & Fogão',
      primaryColor: 'from-emerald-700 to-green-900',
      summaryQuote: 'Dia 1 de operação iniciado. Pronto para orientar fichas técnicas, controle de validade e boas práticas ANVISA.',
      alerts: [],
    };
  }

  // 4. BARTENDER / CHEFE DO BAR (Acesso 40)
  if (role === 'CHEFE_BAR' || role === 'BARTENDER') {
    return {
      role,
      title: 'IA Especializada do Bar',
      subtitle: 'Giro de garrafas, chopeiras, coquetelaria e rupturas',
      badge: 'Bar IA • Conectada',
      primaryColor: 'from-purple-700 to-indigo-900',
      summaryQuote: 'Dia 1 de operação iniciado. Monitorando chopeiras, coquetelaria e contagem física do bar.',
      alerts: [],
    };
  }

  // 5. ASG / HIGIENIZAÇÃO (Acesso 30)
  if (role === 'ASG') {
    return {
      role,
      title: 'IA de Limpeza & Higienização Sanitária',
      subtitle: 'Procedimentos ANVISA, cronogramas de limpeza e rotinas de desinfecção',
      badge: 'Limpeza & ANVISA • Ativa',
      primaryColor: 'from-slate-700 to-cyan-900',
      summaryQuote: 'Dia 1 de operação iniciado. Pronto para registrar rotinas e checklists de higienização ANVISA.',
      alerts: [],
    };
  }

  // 6. DONOS (Acesso 100)
  return {
    role,
    title: 'IA Estratégica da Holding & Diretoria',
    subtitle: 'Consolidado Executivo • DRE, Lucratividade, Auditoria e Governança Multi-Loja',
    badge: 'Conselho Executivo • Ativo',
    primaryColor: 'from-amber-600 to-amber-800',
    summaryQuote: 'Dia 1 de operação iniciado. Painel executivo pronto para consolidar as métricas em tempo real.',
    alerts: [],
  };
}
