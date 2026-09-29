/**
 * Tipos Oficiais para o Sistema de Fila de Espera e Recepção da Porta
 * Restaurante Dionísio / Engenho Cozinha Brasileira
 */

export type WaitingCustomerStatus =
  | 'WAITING'     // Aguardando na fila por mesa compatível
  | 'CALLED'      // Mesa atribuída e liberada - Cronômetro de 2 minutos ativo
  | 'SEATED'      // Compareceu dentro dos 2 minutos e sentou-se
  | 'EXPIRED'     // Não compareceu em 2 minutos (tempo esgotado / perdeu a vez)
  | 'CANCELLED';  // Desistiu / Cancelado

export interface WaitingCustomer {
  id: string;
  name: string;
  phone: string;
  partySize: number; // 2, 4, 6, 8, 10, 12, 14, 16, 18, 20...
  status: WaitingCustomerStatus;
  createdAt: string; // ISO date
  calledAt?: string; // ISO date
  expiresAt?: string; // ISO date (exatamente 120s após calledAt)
  seatedAt?: string;
  expiredAt?: string;
  assignedTableNumber?: string;
  assignedTableCapacity?: number;
  notes?: string;
  callAttempts: number;
  whatsappUrl?: string;
  queuePosition?: number;
}

export type QueueTableStatus = 'LIVRE' | 'CHAMANDO' | 'OCUPADA' | 'LIMPEZA';

export interface QueueTable {
  id: string;
  number: string;
  capacity: number; // 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
  area: 'SALAO_PRINCIPAL' | 'VARANDA_PONTA_NEGRA' | 'SALA_VIP' | 'DECK_RIO_NEGRO';
  status: QueueTableStatus;
  currentCustomerId?: string;
  currentCustomerName?: string;
  currentCustomerPartySize?: number;
  callExpiresAt?: string;
}

export type QueueActionType =
  | 'CLIENTE_ENTROU'
  | 'MESA_ATRIBUIDA'
  | 'MESA_LIBERADA'
  | 'CHAMADA_DISPARADA'
  | 'CLIENTE_SENTOU'
  | 'TEMPO_ESGOTADO_2MIN'
  | 'PROXIMO_COMPATIVEL_AVISADO'
  | 'CLIENTE_DESISTIU';

export interface QueueLogRecord {
  id: string;
  timestamp: string;
  action: QueueActionType;
  description: string;
  customerId?: string;
  customerName?: string;
  tableNumber?: string;
  partySize?: number;
}
