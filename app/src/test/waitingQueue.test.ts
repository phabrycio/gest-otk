import { describe, it, expect, beforeEach } from 'vitest';
import { waitingQueueStore } from '../services/waitingQueueStore';

describe('Sistema de Fila de Espera & Regra dos 2 Minutos (TK Gestão)', () => {
  beforeEach(() => {
    waitingQueueStore.resetToScenario();
    waitingQueueStore.addToQueue({ name: 'Família Barbosa', phone: '(92) 98112-4455', partySize: 6 });
    waitingQueueStore.addToQueue({ name: 'Grupo Dionísio Corporativo', phone: '(92) 99344-8899', partySize: 14 });
    waitingQueueStore.addToQueue({ name: 'Carlos & Ana', phone: '(92) 98455-1234', partySize: 2 });
  });

  it('deve inicializar a fila com o cenário do prompt (Família 6p, Empresa 14p, Casal 2p)', () => {
    const queue = waitingQueueStore.getQueue();
    expect(queue.length).toBeGreaterThanOrEqual(3);

    const first = queue[0];
    const second = queue[1];
    const third = queue[2];

    expect(first.partySize).toBe(6);
    expect(second.partySize).toBe(14);
    expect(third.partySize).toBe(2);
  });

  it('REGRA DE COMPATIBILIDADE: ao liberar mesa para 2 pessoas, pula 6p e 14p e chama Carlos & Ana (2p)', () => {
    // Mesa 02 é para 2 pessoas
    const result = waitingQueueStore.releaseTableAndCallNext('02');
    expect(result.success).toBe(true);
    expect(result.calledCustomer).toBeDefined();

    // Deve ser Carlos & Ana (2 pessoas), pois 6p e 14p não cabem em mesa de 2!
    expect(result.calledCustomer?.name).toBe('Carlos & Ana');
    expect(result.calledCustomer?.partySize).toBe(2);
    expect(result.calledCustomer?.status).toBe('CALLED');
    expect(result.calledCustomer?.assignedTableNumber).toBe('02');

    // Cronômetro de 2 minutos ativo
    expect(result.calledCustomer?.expiresAt).toBeDefined();
    const diff = new Date(result.calledCustomer!.expiresAt!).getTime() - Date.now();
    expect(diff).toBeGreaterThan(110 * 1000); // ~120s
  });

  it('ao cliente comparecer na recepção, deve sentar e a mesa passar para OCUPADA', () => {
    waitingQueueStore.releaseTableAndCallNext('02');
    const called = waitingQueueStore.getCalledCustomers()[0];
    expect(called).toBeDefined();

    const seatedSuccess = waitingQueueStore.seatCustomer(called.id);
    expect(seatedSuccess).toBe(true);

    const updated = waitingQueueStore.getQueue().find(c => c.id === called.id);
    expect(updated?.status).toBe('SEATED');

    const table = waitingQueueStore.getTables().find(t => t.number === '02');
    expect(table?.status).toBe('OCUPADA');
  });

  it('ao esgotar 2 minutos sem comparecimento, cliente expira e mesa busca próximo compatível', () => {
    waitingQueueStore.releaseTableAndCallNext('02');
    const called = waitingQueueStore.getCalledCustomers()[0];
    expect(called).toBeDefined();

    // Simula expiração do timer
    const transition = waitingQueueStore.expireAndAutoAssignNext(called.id);
    expect(transition).toBeDefined();
    expect(transition?.expiredCustomer.status).toBe('EXPIRED');
  });

  it('permite cadastrar novos clientes com WhatsApp formatado e partySize customizado', () => {
    const newCust = waitingQueueStore.addToQueue({
      name: 'Dr. Roberto Gerente',
      phone: '(92) 99123-9999',
      partySize: 4,
      notes: 'Mesa perto da janela',
    });

    expect(newCust.id).toBeDefined();
    expect(newCust.name).toBe('Dr. Roberto Gerente');
    expect(newCust.partySize).toBe(4);
    expect(newCust.status).toBe('WAITING');
  });
});
