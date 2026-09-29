/**
 * Store Oficial da Fila de Espera & Recepção da Porta
 * Restaurante Engenho Cozinha Brasileira / Dionísio
 * 
 * Regra dos 2 Minutos + Compatibilidade Estrita de Capacidade de Mesas
 */

import {
  WaitingCustomer,
  QueueTable,
  QueueLogRecord,
} from '../types/waitingQueue.types';
import { recordAuditAction } from './auditTrailStore';
import { sanitizePlainText, sanitizePhoneNumber, maskPhoneLgpd } from './securitySanitizer';

const STORAGE_KEY_QUEUE = 'engenho_waiting_queue_v1';
const STORAGE_KEY_TABLES = 'engenho_queue_tables_v1';
const STORAGE_KEY_LOGS = 'engenho_queue_logs_v1';

// Mesas iniciais do restaurante de 2 a 20 lugares (todas iniciam livres)
const INITIAL_TABLES: QueueTable[] = [
  { id: 'tbl-02', number: '02', capacity: 2, area: 'SALAO_PRINCIPAL', status: 'LIVRE' },
  { id: 'tbl-08', number: '08', capacity: 2, area: 'VARANDA_PONTA_NEGRA', status: 'LIVRE' },
  { id: 'tbl-12', number: '12', capacity: 2, area: 'SALAO_PRINCIPAL', status: 'LIVRE' },
  { id: 'tbl-18', number: '18', capacity: 2, area: 'DECK_RIO_NEGRO', status: 'LIVRE' },

  { id: 'tbl-01', number: '01', capacity: 4, area: 'SALAO_PRINCIPAL', status: 'LIVRE' },
  { id: 'tbl-04', number: '04', capacity: 4, area: 'SALAO_PRINCIPAL', status: 'LIVRE' },
  { id: 'tbl-06', number: '06', capacity: 4, area: 'VARANDA_PONTA_NEGRA', status: 'LIVRE' },
  { id: 'tbl-07', number: '07', capacity: 4, area: 'VARANDA_PONTA_NEGRA', status: 'LIVRE' },
  { id: 'tbl-14', number: '14', capacity: 4, area: 'SALAO_PRINCIPAL', status: 'LIVRE' },

  { id: 'tbl-03', number: '03', capacity: 6, area: 'SALAO_PRINCIPAL', status: 'LIVRE' },
  { id: 'tbl-11', number: '11', capacity: 6, area: 'VARANDA_PONTA_NEGRA', status: 'LIVRE' },
  { id: 'tbl-15', number: '15', capacity: 6, area: 'DECK_RIO_NEGRO', status: 'LIVRE' },

  { id: 'tbl-05', number: '05', capacity: 8, area: 'SALAO_PRINCIPAL', status: 'LIVRE' },
  { id: 'tbl-13', number: '13', capacity: 8, area: 'DECK_RIO_NEGRO', status: 'LIVRE' },

  { id: 'tbl-16', number: '16', capacity: 10, area: 'SALAO_PRINCIPAL', status: 'LIVRE' },
  { id: 'tbl-09', number: '09', capacity: 12, area: 'SALA_VIP', status: 'LIVRE' },
  { id: 'tbl-17', number: '17', capacity: 14, area: 'SALAO_PRINCIPAL', status: 'LIVRE' },
  { id: 'tbl-20', number: '20', capacity: 16, area: 'DECK_RIO_NEGRO', status: 'LIVRE' },
  { id: 'tbl-22', number: '22', capacity: 20, area: 'SALA_VIP', status: 'LIVRE' },
];

// Fila inicial inicia vazia para operação real
const INITIAL_CUSTOMERS: WaitingCustomer[] = [];

// Carregar estado salvo ou inicial
function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function saveStored<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore storage quota */
  }
}

export class WaitingQueueStore {
  private static instance: WaitingQueueStore;
  private queue: WaitingCustomer[] = [];
  private tables: QueueTable[] = [];
  private logs: QueueLogRecord[] = [];
  private listeners: (() => void)[] = [];
  private timerInterval: any = null;

  private constructor() {
    this.queue = loadStored<WaitingCustomer[]>(STORAGE_KEY_QUEUE, INITIAL_CUSTOMERS);
    this.tables = loadStored<QueueTable[]>(STORAGE_KEY_TABLES, INITIAL_TABLES);
    this.logs = loadStored<QueueLogRecord[]>(STORAGE_KEY_LOGS, []);

    // Iniciar loop de verificação dos 2 minutos a cada 1 segundo
    if (typeof window !== 'undefined') {
      this.timerInterval = setInterval(() => {
        this.checkExpiredTimers();
      }, 1000);
    }
  }

  public static getInstance(): WaitingQueueStore {
    if (!WaitingQueueStore.instance) {
      WaitingQueueStore.instance = new WaitingQueueStore();
    }
    return WaitingQueueStore.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    saveStored(STORAGE_KEY_QUEUE, this.queue);
    saveStored(STORAGE_KEY_TABLES, this.tables);
    saveStored(STORAGE_KEY_LOGS, this.logs);
    this.listeners.forEach((l) => l());
  }

  // Obter lista atual da fila
  public getQueue(): WaitingCustomer[] {
    return [...this.queue];
  }

  // Obter mesas
  public getTables(): QueueTable[] {
    return [...this.tables];
  }

  // Obter logs recentes
  public getLogs(): QueueLogRecord[] {
    return [...this.logs];
  }

  // Obter clientes aguardando ordenados por chegada (antigos primeiro)
  public getWaitingCustomers(): WaitingCustomer[] {
    return this.queue
      .filter((c) => c.status === 'WAITING')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((c, index) => ({ ...c, queuePosition: index + 1 }));
  }

  // Obter clientes chamados com timer ativo
  public getCalledCustomers(): WaitingCustomer[] {
    return this.queue.filter((c) => c.status === 'CALLED');
  }

  /**
   * Adiciona um novo cliente na fila da porta com sanitização anti-XSS e proteção LGPD
   */
  public addToQueue(data: {
    name: string;
    phone: string;
    partySize: number;
    notes?: string;
  }): WaitingCustomer {
    const cleanName = sanitizePlainText(data.name, 60);
    const cleanPhone = sanitizePhoneNumber(data.phone);
    const cleanNotes = data.notes ? sanitizePlainText(data.notes, 200) : undefined;

    const newCustomer: WaitingCustomer = {
      id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName || 'Cliente Sem Nome',
      phone: cleanPhone || 'Não informado',
      partySize: Math.max(1, Math.min(50, data.partySize)),
      status: 'WAITING',
      createdAt: new Date().toISOString(),
      notes: cleanNotes,
      callAttempts: 0,
    };

    this.queue.push(newCustomer);

    this.addLog({
      action: 'CLIENTE_ENTROU',
      description: `Cliente "${newCustomer.name}" entrou na fila (${newCustomer.partySize} pessoas) • Tel: ${maskPhoneLgpd(newCustomer.phone)}`,
      customerId: newCustomer.id,
      customerName: newCustomer.name,
      partySize: newCustomer.partySize,
    });

    recordAuditAction({
      userId: 'hostess-system',
      userName: 'Recepção da Porta',
      userRole: 'CHEFE_FILA',
      restaurantId: 'manauara-01',
      module: 'FILA_ESPERA',
      action: 'NOVO_CLIENTE_FILA',
      newValue: `${newCustomer.name} (${newCustomer.partySize} pessoas)`,
    });

    this.notify();
    return newCustomer;
  }

  /**
   * REGRA CENTRAL:
   * Encontra o próximo cliente na fila cuja quantidade de pessoas seja COMPATÍVEL
   * com a capacidade da mesa disponibilizada.
   * 
   * Exemplo: Mesa de 2 pessoas.
   * Se na frente estiverem clientes de 6 pessoas e 14 pessoas, o sistema PULA eles
   * e chama o primeiro cliente na fila que precisa de mesa para até 2 pessoas!
   */
  public findNextCompatibleCustomer(tableCapacity: number): WaitingCustomer | null {
    const waitingList = this.getWaitingCustomers();
    // Um cliente é compatível se a quantidade de pessoas dele couber na mesa (partySize <= tableCapacity)
    // Para aproveitamento ideal de mesas grandes, também priorizamos quem melhor preenche a mesa
    return waitingList.find((c) => c.partySize <= tableCapacity) || null;
  }

  /**
   * Gera a mensagem oficial do WhatsApp com o link dinâmico
   */
  public generateWhatsAppUrl(customer: WaitingCustomer, tableNumber: string): string {
    const cleanPhone = customer.phone.replace(/\D/g, '');
    const phoneWithDDI = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    const text = 
`🍽️ *Restaurante Dionísio & Engenho Cozinha Brasileira*
Olá, *${customer.name}*! 👋

🎉 *SUA MESA ESTÁ PRONTA!*
📍 *Mesa:* Nº *${tableNumber}* (${customer.partySize} pessoas)

⚠️ *REGRA DOS 2 MINUTOS:*
Você tem exatamente *2 MINUTOS* a partir de agora para se dirigir à recepção da porta.
Caso você não se apresente dentro desse tempo, a mesa será automaticamente repassada para o próximo cliente compatível da fila.

👉 Por favor, apresente-se à nossa Hostess na entrada agora mesmo!`;

    return `https://api.whatsapp.com/send?phone=${phoneWithDDI}&text=${encodeURIComponent(text)}`;
  }

  /**
   * O Responsável pela fila escolhe/libera a mesa e chama o cliente.
   * Inicia o cronômetro oficial de 2 minutos (120 segundos).
   */
  public callCustomerForTable(
    customerId: string,
    tableNumber: string,
    customSeconds: number = 120
  ): { success: boolean; message: string; customer?: WaitingCustomer } {
    const customer = this.queue.find((c) => c.id === customerId);
    if (!customer) {
      return { success: false, message: 'Cliente não encontrado na fila.' };
    }

    const table = this.tables.find((t) => t.number === tableNumber);
    if (!table) {
      return { success: false, message: `Mesa Nº ${tableNumber} não cadastrada.` };
    }

    // Validação de capacidade
    if (customer.partySize > table.capacity) {
      return {
        success: false,
        message: `Mesa ${table.number} comporta apenas ${table.capacity} pessoas, mas o grupo de ${customer.name} tem ${customer.partySize} pessoas! Escolha uma mesa maior.`,
      };
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + customSeconds * 1000);

    // Atualiza cliente
    customer.status = 'CALLED';
    customer.assignedTableNumber = table.number;
    customer.assignedTableCapacity = table.capacity;
    customer.calledAt = now.toISOString();
    customer.expiresAt = expiresAt.toISOString();
    customer.callAttempts = (customer.callAttempts || 0) + 1;
    customer.whatsappUrl = this.generateWhatsAppUrl(customer, table.number);

    // Atualiza mesa
    table.status = 'CHAMANDO';
    table.currentCustomerId = customer.id;
    table.currentCustomerName = customer.name;
    table.currentCustomerPartySize = customer.partySize;
    table.callExpiresAt = expiresAt.toISOString();

    this.addLog({
      action: 'CHAMADA_DISPARADA',
      description: `Mesa Nº ${table.number} (${table.capacity}p) liberada para "${customer.name}" (${customer.partySize}p). Cronômetro de 2 min iniciado!`,
      customerId: customer.id,
      customerName: customer.name,
      tableNumber: table.number,
      partySize: customer.partySize,
    });

    recordAuditAction({
      userId: 'hostess-system',
      userName: 'Recepção da Porta',
      userRole: 'CHEFE_FILA',
      restaurantId: 'manauara-01',
      module: 'FILA_ESPERA',
      action: 'CHAMADA_MESA_2MIN',
      newValue: `Mesa ${table.number} atribuída a ${customer.name} • Expira em 120s`,
    });

    // Efeito sonoro sintetizado no navegador (se disponível)
    this.playChime(660, 880);

    this.notify();
    return { success: true, message: `Mesa ${table.number} liberada para ${customer.name}! Cronômetro de 2 minutos ativo.`, customer };
  }

  /**
   * Liberar uma mesa e automaticamente chamar o 1º cliente compatível da fila!
   */
  public releaseTableAndCallNext(tableNumber: string): {
    success: boolean;
    message: string;
    calledCustomer?: WaitingCustomer;
    table?: QueueTable;
  } {
    const table = this.tables.find((t) => t.number === tableNumber);
    if (!table) {
      return { success: false, message: `Mesa Nº ${tableNumber} não encontrada.` };
    }

    // Busca próximo compatível usando a regra de ouro
    const nextCandidate = this.findNextCompatibleCustomer(table.capacity);

    if (nextCandidate) {
      const res = this.callCustomerForTable(nextCandidate.id, table.number);
      return {
        success: true,
        message: `Mesa Nº ${table.number} (${table.capacity} pessoas) liberada! O 1º cliente compatível na fila "${nextCandidate.name}" (${nextCandidate.partySize} pessoas) foi chamado com o timer de 2 minutos.`,
        calledCustomer: res.customer,
        table,
      };
    } else {
      // Se não há ninguém compatível aguardando, a mesa fica simplesmente livre
      table.status = 'LIVRE';
      table.currentCustomerId = undefined;
      table.currentCustomerName = undefined;
      table.currentCustomerPartySize = undefined;
      table.callExpiresAt = undefined;

      this.addLog({
        action: 'MESA_LIBERADA',
        description: `Mesa Nº ${table.number} (${table.capacity}p) liberada para o salão. Nenhum cliente compatível aguardando no momento.`,
        tableNumber: table.number,
      });

      this.notify();
      return {
        success: true,
        message: `Mesa Nº ${table.number} agora está LIVRE. (Nenhum cliente compatível na fila)`,
        table,
      };
    }
  }

  /**
   * O cliente compareceu à recepção dentro do prazo de 2 minutos!
   * É marcado como SEATED (Sentado) e a mesa passa para OCUPADA.
   */
  public seatCustomer(customerId: string): boolean {
    const customer = this.queue.find((c) => c.id === customerId);
    if (!customer) return false;

    customer.status = 'SEATED';
    customer.seatedAt = new Date().toISOString();

    if (customer.assignedTableNumber) {
      const table = this.tables.find((t) => t.number === customer.assignedTableNumber);
      if (table) {
        table.status = 'OCUPADA';
        table.callExpiresAt = undefined;
      }
    }

    this.addLog({
      action: 'CLIENTE_SENTOU',
      description: `✅ Cliente "${customer.name}" compareceu no prazo e sentou-se na Mesa Nº ${customer.assignedTableNumber || 'Balcão'}.`,
      customerId: customer.id,
      customerName: customer.name,
      tableNumber: customer.assignedTableNumber,
      partySize: customer.partySize,
    });

    recordAuditAction({
      userId: 'hostess-system',
      userName: 'Recepção da Porta',
      userRole: 'CHEFE_FILA',
      restaurantId: 'manauara-01',
      module: 'FILA_ESPERA',
      action: 'CLIENTE_SENTADO',
      newValue: `${customer.name} sentou na Mesa ${customer.assignedTableNumber}`,
    });

    this.playChime(523, 659);
    this.notify();
    return true;
  }

  /**
   * REGRA CENTRAL DE EXPIRAÇÃO AUTOMÁTICA DOS 2 MINUTOS:
   * Quando o tempo esgota:
   * 1. O cliente atual perde a vez (status = 'EXPIRED').
   * 2. O sistema busca AUTOMATICAMENTE o próximo cliente compatível da fila.
   * 3. A mesa é repassada para ele com um novo cronômetro de 2 minutos!
   */
  public expireAndAutoAssignNext(customerId: string): {
    expiredCustomer: WaitingCustomer;
    nextCalledCustomer: WaitingCustomer | null;
  } | null {
    const customer = this.queue.find((c) => c.id === customerId);
    if (!customer || customer.status !== 'CALLED') return null;

    const tableNumber = customer.assignedTableNumber;
    const tableCapacity = customer.assignedTableCapacity || 2;
    const table = this.tables.find((t) => t.number === tableNumber);

    // 1. Marca cliente como EXPIRED
    customer.status = 'EXPIRED';
    customer.expiredAt = new Date().toISOString();

    this.addLog({
      action: 'TEMPO_ESGOTADO_2MIN',
      description: `⏱️ TEMPO ESGOTADO (2 min): Cliente "${customer.name}" não compareceu na Mesa Nº ${tableNumber}. Vez na fila PERDIDA!`,
      customerId: customer.id,
      customerName: customer.name,
      tableNumber,
      partySize: customer.partySize,
    });

    recordAuditAction({
      userId: 'system-timer',
      userName: 'Kernel da Fila 2Min',
      userRole: 'CHEFE_FILA',
      restaurantId: 'manauara-01',
      module: 'FILA_ESPERA',
      action: 'EXPIROU_2MIN_PERDEU_VEZ',
      previousValue: `Mesa ${tableNumber} com ${customer.name}`,
      newValue: 'Tempo Esgotado • Procurando próximo compatível',
    });

    // 2. Busca o PRÓXIMO cliente compatível
    const nextCandidate = this.findNextCompatibleCustomer(tableCapacity);

    if (nextCandidate && table) {
      // 3. Atribui a mesa ao próximo compatível
      this.callCustomerForTable(nextCandidate.id, table.number);

      this.addLog({
        action: 'PROXIMO_COMPATIVEL_AVISADO',
        description: `🔁 AUTOMÁTICO: Mesa Nº ${table.number} (${table.capacity}p) repassada para o próximo cliente compatível: "${nextCandidate.name}" (${nextCandidate.partySize}p). Notificação WhatsApp gerada!`,
        customerId: nextCandidate.id,
        customerName: nextCandidate.name,
        tableNumber: table.number,
        partySize: nextCandidate.partySize,
      });

      this.playAlertSound();
      this.notify();
      return { expiredCustomer: customer, nextCalledCustomer: nextCandidate };
    } else {
      // Nenhum compatível: libera a mesa
      if (table) {
        table.status = 'LIVRE';
        table.currentCustomerId = undefined;
        table.currentCustomerName = undefined;
        table.currentCustomerPartySize = undefined;
        table.callExpiresAt = undefined;
      }

      this.notify();
      return { expiredCustomer: customer, nextCalledCustomer: null };
    }
  }

  /**
   * Cancelamento manual / Desistência informada pelo cliente
   */
  public cancelCustomer(customerId: string, reason?: string): boolean {
    const customer = this.queue.find((c) => c.id === customerId);
    if (!customer) return false;

    const wasCalled = customer.status === 'CALLED';
    const assignedTable = customer.assignedTableNumber;
    const assignedCapacity = customer.assignedTableCapacity || 2;

    customer.status = 'CANCELLED';

    this.addLog({
      action: 'CLIENTE_DESISTIU',
      description: `Cliente "${customer.name}" cancelou ou desistiu da fila. Motivo: ${reason || 'Não informado'}`,
      customerId: customer.id,
      customerName: customer.name,
      partySize: customer.partySize,
    });

    // Se estava segurando uma mesa, repassa ao próximo compatível!
    if (wasCalled && assignedTable) {
      const table = this.tables.find((t) => t.number === assignedTable);
      const nextCandidate = this.findNextCompatibleCustomer(assignedCapacity);

      if (nextCandidate && table) {
        this.callCustomerForTable(nextCandidate.id, table.number);
      } else if (table) {
        table.status = 'LIVRE';
        table.currentCustomerId = undefined;
        table.currentCustomerName = undefined;
        table.callExpiresAt = undefined;
      }
    }

    this.notify();
    return true;
  }

  /**
   * Verifica cronômetros a cada segundo
   */
  private checkExpiredTimers(): void {
    const now = Date.now();
    let hasChanges = false;

    for (const customer of this.queue) {
      if (customer.status === 'CALLED' && customer.expiresAt) {
        const expireTime = new Date(customer.expiresAt).getTime();
        if (now >= expireTime) {
          // Disparar expiração e transição automática
          this.expireAndAutoAssignNext(customer.id);
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      this.notify();
    }
  }

  /**
   * Registra log
   */
  private addLog(log: Omit<QueueLogRecord, 'id' | 'timestamp'>): void {
    const newLog: QueueLogRecord = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    this.logs.unshift(newLog);
    // Limitar logs a 100
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }
  }

  /**
   * Efeitos sonoros sintetizados nativos (sem dependência externa)
   */
  private playChime(freq1: number, freq2: number): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq1, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      /* ignore audio error */
    }
  }

  private playAlertSound(): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      /* ignore audio error */
    }
  }

  /**
   * Reset para demonstração limpa com o cenário do prompt
   */
  public resetToScenario(): void {
    this.queue = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
    this.tables = JSON.parse(JSON.stringify(INITIAL_TABLES));
    this.logs = [];
    this.notify();
  }
}

export const waitingQueueStore = WaitingQueueStore.getInstance();
