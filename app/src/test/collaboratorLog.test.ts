import { describe, it, expect, beforeEach } from 'vitest';
import { getAuditLogs, logSystemAction, filterAuditLogs } from '../services/auditLogStore';

describe('Collaborator Operational Audit Log (Gerente & Donos) Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('records collaborator actions with full name, exact date, time, and sector for managers and owners', () => {
    const logMadio = logSystemAction({
      userId: 'user-madio',
      userName: 'Mádio',
      userRole: 'Chefe de Cozinha',
      action: 'LEITURA_CAMARA_MANHA',
      actionLabel: 'Leitura Manhã Câmara Fria',
      module: 'FREEZER_CDA',
      description: 'Mádio registrou a foto da câmara fria: -19.6°C na abertura da cozinha.',
      severity: 'SUCESSO',
    });

    const logPedro = logSystemAction({
      userId: 'user-pedro',
      userName: 'Pedro',
      userRole: 'Chefe do Bar',
      action: 'SANGRIA_BARRIL_CHOPP',
      actionLabel: 'Sangria de Barril 50L',
      module: 'ESTOQUE',
      description: 'Pedro engatou novo barril de Chopp Brahma Claro na chopeira 02.',
      severity: 'INFO',
    });

    const logs = getAuditLogs();
    expect(logs.length).toBeGreaterThanOrEqual(2);

    expect(logMadio.userName).toBe('Mádio');
    expect(logMadio.userRole).toBe('Chefe de Cozinha');
    expect(logMadio.timestamp).toBeDefined();

    expect(logPedro.userName).toBe('Pedro');
    expect(logPedro.userRole).toBe('Chefe do Bar');
  });

  it('allows manager and owners to filter logs specifically by collaborator name', () => {
    logSystemAction({
      userId: 'user-madio',
      userName: 'Mádio',
      userRole: 'Chefe de Cozinha',
      action: 'LEITURA_CAMARA_MANHA',
      actionLabel: 'Leitura Manhã Câmara Fria',
      module: 'FREEZER_CDA',
      description: 'Mádio registrou a foto da câmara fria: -19.6°C na abertura da cozinha.',
      severity: 'SUCESSO',
    });

    logSystemAction({
      userId: 'user-pedro',
      userName: 'Pedro',
      userRole: 'Chefe do Bar',
      action: 'SANGRIA_BARRIL_CHOPP',
      actionLabel: 'Sangria de Barril 50L',
      module: 'ESTOQUE',
      description: 'Pedro engatou novo barril de Chopp.',
      severity: 'INFO',
    });

    const all = getAuditLogs();
    const madioFiltered = filterAuditLogs(all, {
      searchQuery: 'Mádio',
      userId: '',
      module: 'TODOS',
      severity: 'TODAS',
      dateRange: 'TODOS',
    });

    expect(madioFiltered.length).toBeGreaterThanOrEqual(1);
    madioFiltered.forEach((l) => {
      expect(l.userName).toContain('Mádio');
    });
  });

  it('generates real-time audit log with exact timestamp whenever a collaborator feeds the operation', () => {
    const beforeTime = new Date().toISOString();

    const newAction = logSystemAction({
      userId: 'user-pedro',
      userName: 'Pedro',
      userRole: 'Chefe do Bar',
      action: 'SANGRIA_BARRIL_CHOPP',
      actionLabel: 'Sangria de Barril 50L',
      module: 'ESTOQUE',
      description: 'Pedro engatou novo barril de Chopp Brahma Claro na chopeira 02.',
      severity: 'INFO',
    });

    expect(newAction.id).toBeDefined();
    expect(newAction.userName).toBe('Pedro');
    expect(newAction.timestamp >= beforeTime).toBe(true);
    expect(newAction.formattedTime).toBeDefined();
    expect(newAction.ipOrDevice).toBeDefined();

    const allLogs = getAuditLogs();
    expect(allLogs[0].id).toBe(newAction.id);
  });
});
