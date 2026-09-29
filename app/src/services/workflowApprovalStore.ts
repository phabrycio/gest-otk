// ============================================================
// WORKFLOWS OFICIAIS — COMPRAS & INVENTÁRIO COM ASSINATURA DIGITAL
// Tk Gestão e Tecnologia • Fluxos Oficiais de Governança
// ============================================================

import type { UserAccount, StockSector } from '../types/restaurant.types';
import { recordAuditAction, generateDigitalSignatureHash, DigitalSignatureInfo } from './auditTrailStore';

// ============================================================
// 1. FLUXO OFICIAL DE COMPRAS
// Chefe / Bar (Solicita) ➔ Supervisora (Aprova e Assina) ➔ Gerente (Audita e dá Feedback) ➔ Donos (Estratégico)
// ============================================================

export type PurchaseRequestStatus =
  | 'PENDENTE_SUPERVISORA' // Chefe/Bar solicitou, aguarda conferência e aprovação da Supervisora
  | 'APROVADO_SUPERVISORA' // Supervisora conferiu estoque e assinou digitalmente
  | 'REJEITADO_SUPERVISORA'// Supervisora reprovou com justificativa
  | 'AUDITADO_GERENTE'     // Gerente auditou, validou ou deu feedback gerencial
  | 'ENTREGUE_ESTOQUE';    // Mercadoria recebida e adicionada ao estoque

export interface PurchaseItemRequest {
  id: string;
  itemName: string;
  category: 'CARNES' | 'BEBIDAS' | 'HORTIFRUTI' | 'SECOS' | 'LIMPEZA' | 'OUTROS';
  requestedQuantity: number;
  unit: string;
  estimatedPriceUnit: number;
  currentStock: number;
  urgency: 'NORMAL' | 'ALTA' | 'CRITICA_RUPTURA';
}

export interface PurchaseRequest {
  id: string;
  createdAt: string;
  restaurantId: string;
  sector: StockSector;
  // 1. Solicitante (Chefe ou Bartender)
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  items: PurchaseItemRequest[];
  totalEstimatedAmount: number;
  justification: string;
  status: PurchaseRequestStatus;

  // 2. Aprovação da Supervisora (com Assinatura Digital)
  supervisorReview?: {
    reviewedById: string;
    reviewedByName: string;
    reviewedAt: string;
    matricula: string;
    signature: DigitalSignatureInfo;
    decision: 'APROVADO' | 'REJEITADO';
    notes: string;
  };

  // 3. Auditoria do Gerente (com Feedback)
  managerAudit?: {
    auditedById: string;
    auditedByName: string;
    auditedAt: string;
    feedback: string;
    approvedStrategy: boolean;
  };
}

// ============================================================
// 2. FLUXO OFICIAL DE INVENTÁRIO
// Chefe/Subchefe (Conta) ➔ Supervisora (Confere & Assina Digitalmente • Bloqueia) ➔ Gerente (Audita & Feedback)
// ============================================================

export type InventoryWorkflowStatus =
  | 'CONTAGEM_INICIADA'             // Chefe/Subchefe/Bar iniciou contagem
  | 'CONTAGEM_CONCLUIDA'            // Chefe finalizou sua contagem inicial
  | 'SUPERVISIONADO_E_CONFERIDO'    // Supervisora conferiu fisicamente e assinou (BLOQUEADO)
  | 'AUDITADO_GERENTE_APROVADO'     // Gerente aprovou e assinou documento
  | 'AUDITADO_GERENTE_DIVERGENCIA'; // Gerente reprovou / solicitou recontagem com feedback

export interface CountedInventoryItem {
  itemId: string;
  itemName: string;
  unit: string;
  systemExpectedQuantity: number;
  countedQuantity: number;
  differenceQuantity: number;
  differenceValueEstimate: number;
  notes?: string;
}

export interface InventoryAuditDocument {
  id: string;
  restaurantId: string;
  sector: StockSector;
  createdAt: string;
  status: InventoryWorkflowStatus;
  isLocked: boolean; // Se true, ninguém pode alterar os números contados

  // 1. Quem realizou a contagem (Chefe / Subchefe / Bartender)
  countedBy: {
    userId: string;
    userName: string;
    userRole: string;
    finishedAt: string;
  };

  items: CountedInventoryItem[];
  totalItemsCounted: number;
  itemsWithDivergenceCount: number;

  // 2. Conferência Presencial & Assinatura da Supervisora
  supervisorVerification?: {
    supervisorId: string;
    supervisorName: string;
    matricula: string;
    verifiedAt: string;
    signature: DigitalSignatureInfo;
    statement: string; // "Inventário supervisionado e conferido presencialmente."
    lockTimestamp: string;
  };

  // 3. Auditoria Final do Gerente
  managerAudit?: {
    managerId: string;
    managerName: string;
    auditedAt: string;
    status: 'APROVADO' | 'DIVERGENCIA_SOLICITAR_RECONTAGEM';
    feedback: string;
    actionTaken: string;
    signatureHash: string;
  };
}

// ============================================================
// STORE LOCAL E MÉTODOS DE GOVERNANÇA
// ============================================================

const STORAGE_KEYS = {
  PURCHASES: 'tk_workflow_purchases_v1',
  INVENTORIES: 'tk_workflow_inventories_v1',
};

function getStoredPurchases(): PurchaseRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function savePurchases(data: PurchaseRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(data));
  } catch (err) {
    console.error('Erro ao salvar compras:', err);
  }
}

function getStoredInventories(): InventoryAuditDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORIES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveInventories(data: InventoryAuditDocument[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORIES, JSON.stringify(data));
  } catch (err) {
    console.error('Erro ao salvar inventários:', err);
  }
}

// ============================================================
// OPERAÇÕES DO FLUXO DE COMPRAS
// ============================================================

/**
 * 1. Chefe ou Bartender cria solicitação de insumos
 */
export function createPurchaseRequest(params: {
  requester: UserAccount;
  sector: StockSector;
  items: PurchaseItemRequest[];
  justification: string;
}): PurchaseRequest {
  const purchases = getStoredPurchases();
  const totalAmount = params.items.reduce(
    (acc, it) => acc + it.requestedQuantity * it.estimatedPriceUnit,
    0
  );

  const newRequest: PurchaseRequest = {
    id: `REQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString(),
    restaurantId: params.requester.restaurantId,
    sector: params.sector,
    requesterId: params.requester.id,
    requesterName: params.requester.name,
    requesterRole: params.requester.role,
    items: params.items,
    totalEstimatedAmount: totalAmount,
    justification: params.justification,
    status: 'PENDENTE_SUPERVISORA',
  };

  purchases.unshift(newRequest);
  savePurchases(purchases);

  // Registro na auditoria imutável
  recordAuditAction({
    userId: params.requester.id,
    userName: params.requester.name,
    userRole: params.requester.role,
    restaurantId: params.requester.restaurantId,
    module: 'COMPRAS',
    action: 'SOLICITACAO_INSUMOS_CRIADA',
    newValue: `Solicitação ${newRequest.id} criada com ${params.items.length} itens (R$ ${totalAmount.toFixed(2)})`,
  });

  return newRequest;
}

/**
 * 2. Supervisora confere o estoque, aprova e assina digitalmente
 */
export function supervisorApprovePurchase(params: {
  requestId: string;
  supervisor: UserAccount;
  matricula: string;
  notes: string;
  decision: 'APROVADO' | 'REJEITADO';
}): PurchaseRequest {
  const purchases = getStoredPurchases();
  const req = purchases.find((p) => p.id === params.requestId);
  if (!req) throw new Error('Solicitação de compra não encontrada.');

  const now = new Date();
  const statement =
    params.decision === 'APROVADO'
      ? `Solicitação conferida presencialmente no estoque e aprovada pela supervisão.`
      : `Solicitação reprovada pela supervisão: ${params.notes}`;

  const sigHash = generateDigitalSignatureHash(
    params.supervisor.name,
    params.matricula,
    'SUPERVISORA',
    `${req.id}|${req.totalEstimatedAmount}|${params.decision}`
  );

  const signature: DigitalSignatureInfo = {
    signedByName: params.supervisor.name,
    signedByRole: 'SUPERVISORA',
    matricula: params.matricula,
    signedAt: now.toISOString(),
    signatureHash: sigHash,
    statement,
  };

  req.status = params.decision === 'APROVADO' ? 'APROVADO_SUPERVISORA' : 'REJEITADO_SUPERVISORA';
  req.supervisorReview = {
    reviewedById: params.supervisor.id,
    reviewedByName: params.supervisor.name,
    reviewedAt: now.toISOString(),
    matricula: params.matricula,
    signature,
    decision: params.decision,
    notes: params.notes,
  };

  savePurchases(purchases);

  // Trilha de auditoria imutável
  recordAuditAction({
    userId: params.supervisor.id,
    userName: params.supervisor.name,
    userRole: 'SUPERVISORA',
    restaurantId: req.restaurantId,
    module: 'COMPRAS',
    action: `COMPRA_${params.decision}_SUPERVISORA`,
    previousValue: 'PENDENTE_SUPERVISORA',
    newValue: req.status,
    digitalSignature: signature,
  });

  return req;
}

/**
 * 3. Gerente audita a compra e fornece feedback gerencial
 */
export function managerAuditPurchase(params: {
  requestId: string;
  manager: UserAccount;
  feedback: string;
  approvedStrategy: boolean;
}): PurchaseRequest {
  const purchases = getStoredPurchases();
  const req = purchases.find((p) => p.id === params.requestId);
  if (!req) throw new Error('Solicitação de compra não encontrada.');

  req.status = 'AUDITADO_GERENTE';
  req.managerAudit = {
    auditedById: params.manager.id,
    auditedByName: params.manager.name,
    auditedAt: new Date().toISOString(),
    feedback: params.feedback,
    approvedStrategy: params.approvedStrategy,
  };

  savePurchases(purchases);

  recordAuditAction({
    userId: params.manager.id,
    userName: params.manager.name,
    userRole: 'GERENTE',
    restaurantId: req.restaurantId,
    module: 'COMPRAS',
    action: 'COMPRA_AUDITADA_GERENCIA',
    newValue: `Gerente audita compra ${req.id}. Feedback: ${params.feedback}`,
  });

  return req;
}

export function listPurchaseRequests(restaurantId?: string): PurchaseRequest[] {
  const all = getStoredPurchases();
  if (!restaurantId) return all;
  return all.filter((p) => p.restaurantId === restaurantId);
}

// ============================================================
// OPERAÇÕES DO FLUXO DE INVENTÁRIO
// ============================================================

/**
 * 1. Chefe/Subchefe/Bartender registra a contagem física
 */
export function submitInventoryCount(params: {
  counter: UserAccount;
  sector: StockSector;
  items: CountedInventoryItem[];
}): InventoryAuditDocument {
  const inventories = getStoredInventories();
  const divergences = params.items.filter((it) => it.differenceQuantity !== 0).length;

  const doc: InventoryAuditDocument = {
    id: `INV-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    restaurantId: params.counter.restaurantId,
    sector: params.sector,
    createdAt: new Date().toISOString(),
    status: 'CONTAGEM_CONCLUIDA',
    isLocked: false,
    countedBy: {
      userId: params.counter.id,
      userName: params.counter.name,
      userRole: params.counter.role,
      finishedAt: new Date().toISOString(),
    },
    items: params.items,
    totalItemsCounted: params.items.length,
    itemsWithDivergenceCount: divergences,
  };

  inventories.unshift(doc);
  saveInventories(inventories);

  recordAuditAction({
    userId: params.counter.id,
    userName: params.counter.name,
    userRole: params.counter.role,
    restaurantId: params.counter.restaurantId,
    module: 'INVENTARIO',
    action: 'CONTAGEM_FISICA_CONCLUIDA',
    newValue: `Contagem ${doc.id} concluída no setor ${params.sector}. Itens: ${params.items.length}. Divergências: ${divergences}`,
  });

  return doc;
}

/**
 * 2. Supervisora confere presencialmente e assina digitalmente:
 * "Inventário supervisionado e conferido."
 * Isso TRAVA e BLOQUEIA qualquer alteração sem justificativa!
 */
export function supervisorSignAndLockInventory(params: {
  inventoryId: string;
  supervisor: UserAccount;
  matricula: string;
}): InventoryAuditDocument {
  const inventories = getStoredInventories();
  const doc = inventories.find((inv) => inv.id === params.inventoryId);
  if (!doc) throw new Error('Inventário não localizado.');

  const now = new Date();
  const statement = 'Inventário supervisionado e conferido presencialmente no salão/cozinha.';

  const sigHash = generateDigitalSignatureHash(
    params.supervisor.name,
    params.matricula,
    'SUPERVISORA',
    `${doc.id}|${doc.totalItemsCounted}|${doc.itemsWithDivergenceCount}`
  );

  const signature: DigitalSignatureInfo = {
    signedByName: params.supervisor.name,
    signedByRole: 'SUPERVISORA',
    matricula: params.matricula,
    signedAt: now.toISOString(),
    signatureHash: sigHash,
    statement,
  };

  doc.status = 'SUPERVISIONADO_E_CONFERIDO';
  doc.isLocked = true; // ← BLOQUEIA ALTERAÇÕES
  doc.supervisorVerification = {
    supervisorId: params.supervisor.id,
    supervisorName: params.supervisor.name,
    matricula: params.matricula,
    verifiedAt: now.toISOString(),
    signature,
    statement,
    lockTimestamp: now.toISOString(),
  };

  saveInventories(inventories);

  recordAuditAction({
    userId: params.supervisor.id,
    userName: params.supervisor.name,
    userRole: 'SUPERVISORA',
    restaurantId: doc.restaurantId,
    module: 'INVENTARIO',
    action: 'INVENTARIO_SUPERVISIONADO_E_CONFERIDO',
    previousValue: 'isLocked: false (Aberto para edição)',
    newValue: 'isLocked: true (BLOQUEADO E ASSINADO ELETRONICAMENTE)',
    digitalSignature: signature,
  });

  return doc;
}

/**
 * 3. Gerente audita o inventário, gera feedback obrigatório e assina o documento
 */
export function managerAuditInventory(params: {
  inventoryId: string;
  manager: UserAccount;
  approved: boolean;
  feedback: string;
  actionTaken: string;
}): InventoryAuditDocument {
  const inventories = getStoredInventories();
  const doc = inventories.find((inv) => inv.id === params.inventoryId);
  if (!doc) throw new Error('Inventário não localizado.');

  const sigHash = generateDigitalSignatureHash(
    params.manager.name,
    params.manager.pin,
    'GERENTE',
    `${doc.id}|AUDITORIA|${params.approved}`
  );

  doc.status = params.approved ? 'AUDITADO_GERENTE_APROVADO' : 'AUDITADO_GERENTE_DIVERGENCIA';
  doc.managerAudit = {
    managerId: params.manager.id,
    managerName: params.manager.name,
    auditedAt: new Date().toISOString(),
    status: params.approved ? 'APROVADO' : 'DIVERGENCIA_SOLICITAR_RECONTAGEM',
    feedback: params.feedback,
    actionTaken: params.actionTaken,
    signatureHash: sigHash,
  };

  saveInventories(inventories);

  recordAuditAction({
    userId: params.manager.id,
    userName: params.manager.name,
    userRole: 'GERENTE',
    restaurantId: doc.restaurantId,
    module: 'INVENTARIO',
    action: `INVENTARIO_AUDITADO_${doc.status}`,
    newValue: `Auditoria concluída. Feedback: ${params.feedback}`,
  });

  return doc;
}

export function listInventories(restaurantId?: string): InventoryAuditDocument[] {
  const all = getStoredInventories();
  if (!restaurantId) return all;
  return all.filter((inv) => inv.restaurantId === restaurantId);
}
