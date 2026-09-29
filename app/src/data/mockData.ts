import { ManagerBonus, InventoryItem, StockLoss, CdaRequisition, Employee, ChecklistItem, CustomerReview, CorporateTicket } from '../types';

export const INITIAL_BONUS: ManagerBonus = {
  foodSafety: {
    weightPct: 35,
    maxBonus: 700.00,
    achievedBonus: 0.00,
    complianceRate: 0.0,
    targetRate: 95.0,
    morningAuditDone: false,
    eveningAuditDone: false,
    status: 'ATTENTION',
  },
  nps: {
    weightPct: 25,
    maxBonus: 500.00,
    achievedBonus: 0.00,
    averageRating: 0.0,
    targetRating: 4.6,
    responseRate: 0.0,
    pendingReviewsCount: 0,
    status: 'ATTENTION',
  },
  sales: {
    weightPct: 40,
    maxBonus: 800.00,
    achievedBonus: 0.00,
    monthlyTarget: 400000.00,
    currentRevenue: 0.00,
    projectedRevenue: 0.00,
    daysRemaining: 30,
    dailyNeededRunRate: 13333.33,
    status: 'ATTENTION',
  },
  totalBonus: 0.00,
  maxTotalBonus: 2000.00,
};

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_LOSSES: StockLoss[] = [];

export const INITIAL_REQUISITION: CdaRequisition = {
  id: 'req-001',
  orderNumber: 'CDA-REQ-NOVO',
  status: 'RASCUNHO',
  deliveryDate: 'Sem requisição ativa hoje',
  totalValue: 0.00,
  itemsCount: 0,
  truckTemperature: 0,
};

export const INITIAL_STAFF: Employee[] = [];

export const INITIAL_CHECKLISTS: ChecklistItem[] = [
  {
    id: 'chk-01',
    category: 'FRIO_ANVISA',
    title: 'Aferição Câmara Congelados (-18°C)',
    isMandatory: true,
    completed: false,
    targetTemp: '-18°C',
    obs: 'Verificar vedação de borracha da porta e evaporador',
  },
  {
    id: 'chk-02',
    category: 'FRIO_ANVISA',
    title: 'Aferição Câmara Resfriados (0°C a 4°C)',
    isMandatory: true,
    completed: false,
    targetTemp: '0°C a 4°C',
    obs: 'Conferir organização por PEPS/PVPS e estrado sanitário',
  },
  {
    id: 'chk-03',
    category: 'COZINHA',
    title: 'Higienização e Sanitização das Bancadas',
    isMandatory: true,
    completed: false,
    obs: 'Solução clorada a 200ppm nas bancadas de corte',
  },
  {
    id: 'chk-04',
    category: 'SALAO',
    title: 'Checklist Abertura Salão & Climatização',
    isMandatory: true,
    completed: false,
    obs: 'Ajuste de termostatos em 22°C e montagem de galheteiros',
  },
];

export const INITIAL_REVIEWS: CustomerReview[] = [];

export const INITIAL_TICKETS: CorporateTicket[] = [];
