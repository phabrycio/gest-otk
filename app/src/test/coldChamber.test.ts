import { describe, it, expect, beforeEach } from 'vitest';
import {
  getColdChamberReadings,
  addColdChamberReading,
  giveSupervisorCheck,
  giveManagerCheck,
  getWeeklyChamberReport,
  generateThermometerPhotoSvg,
} from '../services/coldChamberStore';
import { getAuditLogs } from '../services/auditLogStore';

describe('Cold Chamber Temperature Photo & Approvals Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts cleanly with zero slate and allows adding initial reading with photo display', () => {
    const initialReadings = getColdChamberReadings(39);
    expect(Array.isArray(initialReadings)).toBe(true);

    const reading = addColdChamberReading({
      temperature: -20.0,
      shift: 'MANHA_ABERTURA',
      chamberName: 'Câmara Fria Principal (Congelados)',
      takenBy: {
        userId: 'user-madio',
        userName: 'Mádio',
        userRole: 'Chefe de Cozinha',
        loginId: 'madio.cozinha',
      },
    });

    expect(reading.id).toBeDefined();
    expect(reading.temperature).toBe(-20.0);
    expect(reading.isConformant).toBe(true);
    expect(reading.photoUrl).toContain('data:image/svg+xml;base64');
    expect(reading.takenBy.userName).toBe('Mádio');
  });

  it('adds a new cold chamber reading with photo, operator login, date and time', () => {
    const newReading = addColdChamberReading({
      temperature: -19.5,
      shift: 'MANHA_ABERTURA',
      chamberName: 'Câmara Fria Principal (Congelados)',
      notes: 'Foto nítida tirada no início do turno.',
      takenBy: {
        userId: 'user-madio',
        userName: 'Mádio',
        userRole: 'Chefe de Cozinha',
        loginId: 'madio.cozinha',
      },
    });

    expect(newReading.id).toBeDefined();
    expect(newReading.temperature).toBe(-19.5);
    expect(newReading.isConformant).toBe(true);
    expect(newReading.status).toBe('PENDENTE_SUPERVISOR');
    expect(newReading.takenBy.userName).toBe('Mádio');
    expect(newReading.supervisorCheck.checked).toBe(false);
    expect(newReading.managerCheck.checked).toBe(false);

    // Confere se registrou log de auditoria oficial
    const logs = getAuditLogs();
    const photoLog = logs.find((l) => l.action === 'LEITURA_FOTO_CAMARA_FRIA');
    expect(photoLog).toBeDefined();
    expect(photoLog?.description).toContain('Mádio');
    expect(photoLog?.description).toContain('-19.5');
  });

  it('records supervisor (Patricia) approval with exact timestamp and audit trail', () => {
    const reading = addColdChamberReading({
      temperature: -19.0,
      shift: 'MANHA_ABERTURA',
      chamberName: 'Câmara Fria Principal',
      takenBy: {
        userId: 'user-madio',
        userName: 'Mádio',
        userRole: 'Chefe de Cozinha',
      },
    });

    const updated = giveSupervisorCheck(reading.id, 'Patricia (Supervisora)', 'Display 100% conferido.');
    expect(updated.supervisorCheck.checked).toBe(true);
    expect(updated.supervisorCheck.checkedBy).toBe('Patricia (Supervisora)');
    expect(updated.supervisorCheck.checkedAt).toBeDefined();
    expect(updated.supervisorCheck.formattedCheckedAt).toBeDefined();

    // Confere log no audit store
    const logs = getAuditLogs();
    const supLog = logs.find((l) => l.action === 'VISTO_SUPERVISOR_CAMARA_FRIA');
    expect(supLog).toBeDefined();
    expect(supLog?.description).toContain('Patricia');
  });

  it('records manager (Ivan / Pabricio) checkbox with date, time and full approval', () => {
    // Primeiro cria uma leitura
    const reading = addColdChamberReading({
      temperature: -19.8,
      shift: 'NOITE_FECHAMENTO',
      takenBy: {
        userId: 'user-esmael',
        userName: 'Esmael',
        userRole: 'Sub Chefe de Cozinha',
      },
    });

    // 1º Nível: Supervisora dá o visto
    giveSupervisorCheck(reading.id, 'Patricia (Supervisora)');

    // 2º Nível: Gerente dá o check
    const fullyApproved = giveManagerCheck(reading.id, 'Ivan (Gerente Geral)', 'Aprovado para relatório de mural.');
    expect(fullyApproved.managerCheck.checked).toBe(true);
    expect(fullyApproved.managerCheck.checkedBy).toBe('Ivan (Gerente Geral)');
    expect(fullyApproved.managerCheck.checkedAt).toBeDefined();
    expect(fullyApproved.managerCheck.formattedCheckedAt).toBeDefined();
    expect(fullyApproved.status).toBe('APROVADO_TOTAL');

    // Confere log do gerente
    const logs = getAuditLogs();
    const mgrLog = logs.find((l) => l.action === 'CHECK_GERENTE_CAMARA_FRIA');
    expect(mgrLog).toBeDefined();
    expect(mgrLog?.description).toContain('Ivan');
  });

  it('compiles weekly report for notice board with photos and signatures', () => {
    const reading = addColdChamberReading({
      temperature: -19.2,
      shift: 'MANHA_ABERTURA',
      takenBy: {
        userId: 'user-madio',
        userName: 'Mádio',
        userRole: 'Chefe de Cozinha',
      },
    });
    giveSupervisorCheck(reading.id, 'Patricia (Supervisora)');
    giveManagerCheck(reading.id, 'Ivan (Gerente Geral)');

    const report = getWeeklyChamberReport(39);
    expect(report.weekNumber).toBe(39);
    expect(report.totalReadings).toBeGreaterThanOrEqual(1);
    expect(report.conformantCount).toBeGreaterThanOrEqual(1);
    expect(report.readings[0].photoUrl).toBeDefined();
    expect(report.signatures.readerName).toBeDefined();
  });
});
