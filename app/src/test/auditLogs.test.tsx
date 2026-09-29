import { describe, it, expect, beforeEach } from 'vitest';
import { getAuditLogs, logSystemAction, filterAuditLogs } from '../services/auditLogStore';

describe('Audit Log & Master Admin Trilha Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes audit logs store cleanly and validates schema on log creation', () => {
    const initialLogs = getAuditLogs();
    expect(Array.isArray(initialLogs)).toBe(true);

    const log = logSystemAction({
      userId: 'user-system',
      userName: 'Sistema Engenho',
      userRole: 'SISTEMA',
      restaurantId: 'rest-engenho-manauara',
      restaurantName: 'Engenho Manauara',
      module: 'SISTEMA',
      action: 'Inicialização de Turno',
      details: 'Sistema iniciado em modo operacional limpo.',
      severity: 'INFO',
    });

    expect(log.id).toBeDefined();
    expect(log.userName).toBe('Sistema Engenho');
    expect(log.action).toBe('Inicialização de Turno');
    expect(log.module).toBe('SISTEMA');
    expect(log.severity).toBe('INFO');
    expect(log.description).toBeDefined();
    expect(new Date(log.timestamp).getTime()).not.toBeNaN();
  });

  it('records a new audit log action for Master Admin Pabricio and persists to local cache', () => {
    const newLog = logSystemAction({
      userId: 'user-pabricio',
      userName: 'Pabricio',
      userRole: 'Gerente em Treinamento (Master Admin)',
      restaurantId: 'rest-engenho-manauara',
      restaurantName: 'Engenho Manauara',
      module: 'CONFIGURACOES',
      action: 'Alteração de Parâmetro de Loja',
      details: 'Pabricio ajustou a tolerância de temperatura do freezer CDA para -18°C.',
      severity: 'AVISO',
      metadata: { param: 'freezer_temp_min', value: -18 },
    });

    expect(newLog.id).toBeDefined();
    expect(newLog.userName).toBe('Pabricio');
    expect(newLog.description).toContain('Pabricio ajustou a tolerância');

    const allLogs = getAuditLogs();
    expect(allLogs[0].id).toBe(newLog.id);
    expect(allLogs[0].userName).toBe('Pabricio');
  });

  it('filters audit logs accurately by user name, module and severity', () => {
    logSystemAction({
      userId: 'user-pedro',
      userName: 'Pedro',
      userRole: 'Chefe do Bar',
      module: 'ESTOQUE',
      action: 'Sangria de Barril de Chopp',
      details: 'Pedro registrou sangria de 50L de Chopp Brahma.',
      severity: 'INFO',
    });

    logSystemAction({
      userId: 'user-pabricio',
      userName: 'Pabricio',
      userRole: 'Gerente em Treinamento',
      module: 'AUTH',
      action: 'Bloqueio de Sessão',
      details: 'Pabricio bloqueou o terminal de gestão.',
      severity: 'CRITICO',
    });

    const pedroLogs = filterAuditLogs({
      searchQuery: 'Pedro',
      userId: '',
      module: 'TODOS',
      severity: 'TODAS',
      dateRange: 'TODOS',
    });
    expect(pedroLogs.some(l => l.userName === 'Pedro')).toBe(true);
    expect(pedroLogs.every(l => l.userName.includes('Pedro') || l.description.includes('Pedro'))).toBe(true);

    const criticalLogs = filterAuditLogs({
      searchQuery: '',
      userId: '',
      module: 'TODOS',
      severity: 'CRITICO',
      dateRange: 'TODOS',
    });
    expect(criticalLogs.every(l => l.severity === 'CRITICO')).toBe(true);
  });
});
