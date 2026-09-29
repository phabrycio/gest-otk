// ============================================================
// DADOS OPERACIONAIS DE CHOPP, BEBIDAS E AUDITORIA DO BAR
// Tk Gestão e Tecnologia - Engenho Gourmet
// ============================================================

import { ChoppTap, SpiritBottle, BarAuditSummary } from '../types/barIntelligence.types';

export interface ColdRoomKeg {
  id: string;
  beerName: string;
  brewery: 'AMBEV' | 'ARTESANAL_LOCAL' | 'HEINEKEN';
  capacityLiters: 30 | 50;
  quantitySealed: number;
  quantityEmptyVasilhame: number;
  batchNumber: string;
  expiryDate: string;
  depositValuePerKegReais: number; // Valor do comodato retido
}

export const INITIAL_CHOPP_TAPS: ChoppTap[] = [];

export const INITIAL_SPIRIT_BOTTLES: SpiritBottle[] = [];

export const INITIAL_COLD_ROOM_KEGS: ColdRoomKeg[] = [];

export const INITIAL_BAR_SUMMARY: BarAuditSummary = {
  referenceDate: new Date().toISOString().split('T')[0],
  shift: 'DIA_TODO',
  totalLitersKegsDispensed: 0,
  totalLitersSoldTeknisa: 0,
  totalTechnicalLossLiters: 0,
  totalDeviationLiters: 0,
  totalDeviationReais: 0,
  overallYieldPct: 100,
  topDiscrepancies: [],
};
