import assert from 'assert';

console.log('🧪 Iniciando teste automatizado do Sistema de Fila de Espera & Regra dos 2 Minutos...');

// Mock das regras do store
class MockWaitingQueue {
  constructor() {
    this.queue = [
      { id: '1', name: 'Família Barbosa', partySize: 6, status: 'WAITING', createdAt: '2026-09-28T10:00:00Z' },
      { id: '2', name: 'Grupo Dionísio', partySize: 14, status: 'WAITING', createdAt: '2026-09-28T10:05:00Z' },
      { id: '3', name: 'Carlos & Ana', partySize: 2, status: 'WAITING', createdAt: '2026-09-28T10:10:00Z' },
      { id: '4', name: 'Mariana Duarte', partySize: 4, status: 'WAITING', createdAt: '2026-09-28T10:12:00Z' },
      { id: '5', name: 'Dra. Beatriz', partySize: 8, status: 'WAITING', createdAt: '2026-09-28T10:15:00Z' },
    ];
    this.tables = [
      { number: '02', capacity: 2, status: 'LIVRE' },
      { number: '04', capacity: 4, status: 'LIVRE' },
      { number: '06', capacity: 6, status: 'LIVRE' },
      { number: '17', capacity: 14, status: 'LIVRE' },
    ];
    this.logs = [];
  }

  findNextCompatibleCustomer(tableCapacity) {
    const waiting = this.queue.filter(c => c.status === 'WAITING');
    return waiting.find(c => c.partySize <= tableCapacity) || null;
  }

  releaseTableAndCallNext(tableNumber) {
    const table = this.tables.find(t => t.number === tableNumber);
    if (!table) return null;

    const candidate = this.findNextCompatibleCustomer(table.capacity);
    if (candidate) {
      candidate.status = 'CALLED';
      candidate.assignedTableNumber = table.number;
      candidate.assignedTableCapacity = table.capacity;
      candidate.calledAt = new Date().toISOString();
      candidate.expiresAt = new Date(Date.now() + 120 * 1000).toISOString();
      table.status = 'CHAMANDO';
      this.logs.push(`Mesa ${table.number} (${table.capacity}p) chamada para ${candidate.name} (${candidate.partySize}p)`);
      return candidate;
    }
    table.status = 'LIVRE';
    return null;
  }

  expireAndAutoAssignNext(customerId) {
    const customer = this.queue.find(c => c.id === customerId);
    if (!customer || customer.status !== 'CALLED') return null;

    const table = this.tables.find(t => t.number === customer.assignedTableNumber);
    customer.status = 'EXPIRED';
    this.logs.push(`Tempo esgotado para ${customer.name}. Vez perdida!`);

    const nextCandidate = this.findNextCompatibleCustomer(table.capacity);
    if (nextCandidate) {
      nextCandidate.status = 'CALLED';
      nextCandidate.assignedTableNumber = table.number;
      nextCandidate.assignedTableCapacity = table.capacity;
      nextCandidate.calledAt = new Date().toISOString();
      nextCandidate.expiresAt = new Date(Date.now() + 120 * 1000).toISOString();
      table.status = 'CHAMANDO';
      this.logs.push(`Mesa ${table.number} repassada automaticamente para ${nextCandidate.name}`);
      return nextCandidate;
    } else {
      table.status = 'LIVRE';
      return null;
    }
  }
}

const q = new MockWaitingQueue();

// TESTE 1: Liberar mesa para 2 pessoas quando na frente tem grupos de 6 e 14 pessoas
console.log('\n--- TESTE 1: Regra de Compatibilidade com Mesa para 2 pessoas ---');
const called1 = q.releaseTableAndCallNext('02');
console.log('Cliente chamado para Mesa 02 (2 pessoas):', called1.name, `(${called1.partySize} pessoas)`);
assert.strictEqual(called1.name, 'Carlos & Ana', 'Deveria pular 6p e 14p e chamar Carlos & Ana (2p)!');
assert.strictEqual(called1.status, 'CALLED');

// TESTE 2: Tempo de 2 minutos esgotado para Carlos & Ana -> Expira e repassa
console.log('\n--- TESTE 2: Expiração dos 2 Minutos & Auto-Repasse ---');
const next = q.expireAndAutoAssignNext('3');
console.log('Carlos & Ana expirou. Próximo compatível:', next ? next.name : 'Nenhum');
// Como não há mais ninguém de 2 pessoas, a mesa 02 fica livre
assert.strictEqual(q.queue.find(c => c.id === '3').status, 'EXPIRED');

// TESTE 3: Liberar mesa para 6 pessoas
console.log('\n--- TESTE 3: Liberar Mesa para 6 pessoas ---');
const called6 = q.releaseTableAndCallNext('06');
console.log('Cliente chamado para Mesa 06 (6 pessoas):', called6.name, `(${called6.partySize} pessoas)`);
// Família Barbosa é 1º da fila e tem 6 pessoas -> cabe perfeitamente!
assert.strictEqual(called6.name, 'Família Barbosa');

console.log('\n✅ Todos os testes da Fila de Espera passaram com 100% de sucesso!');
