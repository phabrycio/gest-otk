/**
 * virtualStockStore.ts
 *
 * Gerenciamento central do Estoque Virtual Inteligente do Engenho
 *
 * Regras de Negócio Fundamentais:
 * 1. Fichas Técnicas Integradas: Conecta todas as receitas oficiais do cardápio.
 * 2. Vendas dão baixa no estoque: Cada prato vendido busca seus insumos na ficha técnica
 *    e deduz as frações correspondentes do estoque virtual.
 * 3. Entradas de Notas AF / NF: Adicionam itens ao estoque físico/virtual e atualizam o custo médio.
 * 4. Notas de Transferência de Material do CDA: Registram entrada de insumos vindos da matriz CDA.
 * 5. Suporte a Estado Limpo (Zero Slate): Inicializa pronto para operação real sem dados fictícios.
 */

import type {
  VirtualStockItem,
  NfRecord,
  NfItem,
  Recipe,
  SalesImport,
  CancellationRecord,
  StockMovement,
  MovementType,
  StockCategory,
  StockUnit,
} from '../types/stock.types';
import { computeItemStatus } from './stockEngine';
import { OFFICIAL_ENGENHO_MENU } from '../data/menuRecipesData';

import salesAnalyticsJson from '../data/salesAnalyticsData.json';

const STORAGE_KEY_VIRTUAL_STOCK = 'tk_virtual_stock_items_v2';
const STORAGE_KEY_MOVEMENTS = 'tk_virtual_stock_movements_v2';
const STORAGE_KEY_NF_RECORDS = 'tk_virtual_stock_nfs_v2';
const STORAGE_KEY_CDA_TRANSFERS = 'tk_virtual_stock_cda_transfers_v2';

export interface CdaMaterialTransfer {
  id: string;
  transferNumber: string; // Ex: "TRANSF-CDA-2026-0928"
  date: string;
  origin: string; // "CDA Central Matriz"
  destination: string; // "Engenho Manauara"
  receivedBy: string;
  transporterOrDriver?: string;
  totalItemsCount: number;
  items: Array<{
    name: string;
    qty: number;
    unit: StockUnit;
    category?: StockCategory;
    unitCost?: number;
    totalValue?: number;
  }>;
  status: 'RECEBIDO_CONFIRMADO' | 'PENDENTE';
  notes?: string;
}

/**
 * Cria o catálogo inicial de itens de estoque no Dia 1 de operação (inicia zerado para operação real).
 */
export function buildInitialStockCatalog(): VirtualStockItem[] {
  return [];
}

/**
 * Cria o catálogo oficial de estoque a partir das 98.393 vendas reais do Engenho.
 * Cada item possui seu Estoque Mínimo (Ponto de Pedido) e Estoque Ideal calculados
 * matematicamente para impedir rupturas no salão.
 */
export function buildRealSalesStockCatalog(): VirtualStockItem[] {
  const topProducts = (salesAnalyticsJson.topProductsByRevenue || []).slice(0, 45);
  const now = new Date().toISOString();

  return topProducts.map((p: any) => {
    let cat: StockCategory = 'CARNES_NOBRES';
    let sector: any = 'COZINHA_FREEZER_SECO';
    let responsible = 'Mádio / Esmael (Cozinha)';
    const n = p.name.toUpperCase();

    if (n.includes('CHOPP') || n.includes('CERVEJA')) {
      cat = 'BEBIDAS_DESTILADOS';
      sector = 'BAR_BEBIDAS';
      responsible = 'Pedro (Bartender)';
    } else if (n.includes('COCA') || n.includes('AGUA') || n.includes('SUCO') || n.includes('RED BULL')) {
      cat = 'BEBIDAS_NAOALCOOLICAS';
      sector = 'BAR_BEBIDAS';
      responsible = 'Pedro (Bartender)';
    } else if (n.includes('VINHO') || n.includes('CHANDON') || n.includes('ESPUMANTE')) {
      cat = 'BEBIDAS_VINHOS';
      sector = 'VINHOS_CACHACAS_CHARCUT';
      responsible = 'Anne / Elendia (Comissária)';
    } else if (n.includes('PIRARUCU') || n.includes('TAMBAQUI') || n.includes('PEIXE')) {
      cat = 'PESCADOS_REGIONAIS';
      sector = 'COZINHA_FREEZER_SECO';
      responsible = 'Mádio (Chefe Cozinha)';
    } else if (n.includes('CAMARAO') || n.includes('POLVO')) {
      cat = 'FRUTOS_DO_MAR';
      sector = 'COZINHA_FREEZER_SECO';
      responsible = 'Mádio (Chefe Cozinha)';
    } else if (n.includes('JOELHO') || n.includes('COSTELA SUINA')) {
      cat = 'AVES_SUINOS';
      sector = 'COZINHA_FREEZER_SECO';
      responsible = 'Esmael (Subchefe)';
    } else if (n.includes('QUEIJO') || n.includes('COALHO')) {
      cat = 'QUEIJOS_LATICINIOS';
      sector = 'COZINHA_FREEZER_SECO';
      responsible = 'Mádio (Chefe Cozinha)';
    } else if (n.includes('PUDIM') || n.includes('SOBREMESA') || n.includes('BOMBOM') || n.includes('EXPRESSO') || n.includes('CAFE')) {
      cat = 'DOCES_CAIXA';
      sector = 'CAIXA_BOMBONS_BALAS';
      responsible = 'Amanda (Caixa)';
    }

    const minStock = p.minStock || Math.ceil(p.dailyAvg * 4);
    const idealStock = p.idealStock || Math.ceil(p.dailyAvg * 14);
    const virtualQty = Math.round((minStock + idealStock) / 2);
    const unitCost = Math.round(p.avgPrice * 0.32 * 100) / 100;

    return {
      id: `stock-${p.code}`,
      cdaCode: p.code,
      name: p.name,
      category: cat,
      sector,
      responsiblePerson: responsible,
      unit: (p.unit ? p.unit.toLowerCase() : 'un') as StockUnit,
      minStock,
      safetyStock: Math.ceil(minStock * 0.8),
      idealStock,
      maxStock: Math.ceil(idealStock * 1.5),
      virtualQty,
      reservedQty: 0,
      availableQty: virtualQty,
      averageCost: unitCost,
      lastCost: unitCost,
      primarySupplier: 'CDA',
      orderLeadTimeDays: 2,
      minOrderQty: 1,
      orderQtyMultiple: 1,
      status: 'SAFE',
      daysUntilRuptura: p.dailyAvg > 0 ? Math.round(virtualQty / p.dailyAvg) : null,
      errorMarginPct: 5,
      lastMovementAt: now,
    };
  });
}

export function loadRealSalesStockItems(): VirtualStockItem[] {
  const items = buildRealSalesStockCatalog();
  saveVirtualStockItems(items);
  return items;
}

/**
 * Retorna os itens de estoque virtual salvos no storage ou inicializa o catálogo base
 */
export function getVirtualStockItems(): VirtualStockItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VIRTUAL_STOCK);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Salva a lista de itens de estoque virtual e emite evento
 */
export function saveVirtualStockItems(items: VirtualStockItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_VIRTUAL_STOCK, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('virtual_stock_updated', { detail: items }));
  } catch (err) {
    console.error('Falha ao salvar itens de estoque virtual:', err);
  }
}

/**
 * Retorna o histórico de movimentações (ledger de estoque)
 */
export function getStockMovements(): StockMovement[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Registra uma movimentação no ledger
 */
function recordMovement(movement: StockMovement): void {
  if (typeof window === 'undefined') return;
  try {
    const movements = getStockMovements();
    movements.unshift(movement);
    localStorage.setItem(STORAGE_KEY_MOVEMENTS, JSON.stringify(movements.slice(0, 150)));
  } catch (err) {
    console.error('Falha ao salvar movimentação:', err);
  }
}

/**
 * Retorna as NFs / AFs confirmadas
 */
export function getConfirmedNfRecords(): NfRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NF_RECORDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const getNfRecords = getConfirmedNfRecords;

/**
 * Salva registro de NF
 */
function recordNfRecord(nf: NfRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getConfirmedNfRecords();
    list.unshift(nf);
    localStorage.setItem(STORAGE_KEY_NF_RECORDS, JSON.stringify(list.slice(0, 50)));
  } catch (err) {
    console.error('Falha ao salvar NF record:', err);
  }
}

/**
 * Retorna transferências vindas do CDA
 */
export function getCdaMaterialTransfers(): CdaMaterialTransfer[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CDA_TRANSFERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Salva transferência do CDA
 */
function recordCdaTransferLog(transfer: CdaMaterialTransfer): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getCdaMaterialTransfers();
    list.unshift(transfer);
    localStorage.setItem(STORAGE_KEY_CDA_TRANSFERS, JSON.stringify(list.slice(0, 50)));
  } catch (err) {
    console.error('Falha ao salvar CDA transfer log:', err);
  }
}

/**
 * Localizador inteligente de insumos no catálogo de estoque virtual
 * Realiza match exato, substring e por palavras-chave principais do restaurante (pirarucu, tambaqui, etc.)
 */
export function findMatchingStockItem(
  items: VirtualStockItem[],
  queryName: string,
  cdaCode?: string
): VirtualStockItem | undefined {
  if (cdaCode) {
    const byCode = items.find((i) => i.cdaCode === cdaCode);
    if (byCode) return byCode;
  }

  const q = queryName.trim().toLowerCase();
  // 1. Match exato
  let found = items.find((i) => i.name.toLowerCase() === q);
  if (found) return found;

  // 2. Match por substring
  found = items.find((i) => i.name.toLowerCase().includes(q) || q.includes(i.name.toLowerCase()));
  if (found) return found;

  // 3. Match por palavra-chave principal dos insumos do Engenho
  const keywords = [
    'pirarucu', 'tambaqui', 'matrinxã', 'tucupi', 'uarini', 'picanha',
    'mignon', 'cupim', 'camarão', 'lagosta', 'jambu', 'chopp', 'brahma',
    'castanha', 'parmesão', 'manteiga', 'arroz'
  ];

  for (const kw of keywords) {
    if (q.includes(kw)) {
      found = items.find((i) => i.name.toLowerCase().includes(kw));
      if (found) return found;
    }
  }

  return undefined;
}

/**
 * ENTRADA DE NOTA AF / NF:
 * Adiciona itens ao estoque virtual e atualiza custos médios ponderados.
 */
export function recordNfOrAfEntry(
  nf: NfRecord,
  operatorName: string = 'Gerente'
): { updatedItemsCount: number; newItemsCount: number } {
  const stockItems = getVirtualStockItems();
  const now = new Date().toISOString();
  let updatedItemsCount = 0;
  let newItemsCount = 0;

  for (const nfItem of nf.items) {
    if (!nfItem.name) continue;

    let target = findMatchingStockItem(stockItems, nfItem.name, nfItem.cdaCode);

    const balanceBefore = target ? target.virtualQty : 0;
    const qtyToAdd = nfItem.qty;
    const unitCost = nfItem.unitCost || 0;

    if (target) {
      const balanceAfter = target.virtualQty + qtyToAdd;
      const totalCostBefore = target.virtualQty * target.averageCost;
      const totalCostEntry = qtyToAdd * unitCost;

      target.averageCost = balanceAfter > 0 ? (totalCostBefore + totalCostEntry) / balanceAfter : unitCost;
      target.lastCost = unitCost;
      target.virtualQty = balanceAfter;
      target.availableQty = Math.max(0, target.virtualQty - target.reservedQty);
      target.status = computeItemStatus(target);
      target.lastMovementAt = now;
      updatedItemsCount++;

      recordMovement({
        id: `mov-nf-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        itemId: target.id,
        itemName: target.name,
        type: 'ENTRADA_NF',
        qty: qtyToAdd,
        unit: target.unit,
        unitCost,
        totalValue: qtyToAdd * unitCost,
        balanceBefore,
        balanceAfter,
        operatorId: 'op-gerente',
        operatorName,
        operatorPin: '***',
        timestamp: now,
        nfNumber: nf.nfNumber,
        notes: `Entrada por Nota Fiscal / AF nº ${nf.nfNumber} (${nf.supplier})`,
        eventHash: `hash-nf-${Date.now()}`,
        previousHash: '000000',
      });
    } else {
      // Cria novo item no catálogo caso não existisse
      const newItem: VirtualStockItem = {
        id: `item-nf-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        cdaCode: nfItem.cdaCode || `CDA-${Math.floor(1000 + Math.random() * 9000)}`,
        name: nfItem.name,
        category: 'SECOS_ESPECIARIAS',
        unit: nfItem.unit || 'un',
        minStock: 5,
        safetyStock: 10,
        idealStock: 25,
        maxStock: 60,
        virtualQty: qtyToAdd,
        reservedQty: 0,
        availableQty: qtyToAdd,
        averageCost: unitCost,
        lastCost: unitCost,
        primarySupplier: 'CDA',
        orderLeadTimeDays: 2,
        minOrderQty: 1,
        orderQtyMultiple: 1,
        status: computeItemStatus({
          availableQty: qtyToAdd,
          minStock: 5,
          safetyStock: 10,
        } as VirtualStockItem),
        daysUntilRuptura: null,
        lastMovementAt: now,
        errorMarginPct: 5,
      };

      stockItems.push(newItem);
      newItemsCount++;

      recordMovement({
        id: `mov-nf-new-${Date.now()}`,
        itemId: newItem.id,
        itemName: newItem.name,
        type: 'ENTRADA_NF',
        qty: qtyToAdd,
        unit: newItem.unit,
        unitCost,
        totalValue: qtyToAdd * unitCost,
        balanceBefore: 0,
        balanceAfter: qtyToAdd,
        operatorId: 'op-gerente',
        operatorName,
        operatorPin: '***',
        timestamp: now,
        nfNumber: nf.nfNumber,
        notes: `Novo item cadastrado via NF/AF nº ${nf.nfNumber} (${nf.supplier})`,
        eventHash: `hash-nf-new-${Date.now()}`,
        previousHash: '000000',
      });
    }
  }

  saveVirtualStockItems(stockItems);
  recordNfRecord(nf);

  return { updatedItemsCount, newItemsCount };
}

/**
 * ENTRADA DE NOTA DE TRANSFERÊNCIA DE MATERIAL DO CDA:
 * Adiciona ao estoque físico/virtual insumos enviados pelo CDA Matriz.
 */
export function recordCdaMaterialTransfer(
  transferData: {
    transferNumber: string;
    items: Array<{ name: string; qty: number; unit: StockUnit; unitCost?: number }>;
    receivedBy?: string;
    driverOrTransporter?: string;
    notes?: string;
  }
): { processedCount: number; transferId: string } {
  const stockItems = getVirtualStockItems();
  const now = new Date().toISOString();
  let processedCount = 0;

  transferData.items.forEach((transferItem) => {
    let target = findMatchingStockItem(stockItems, transferItem.name);

    const balanceBefore = target ? target.virtualQty : 0;
    const qtyToAdd = transferItem.qty;
    const unitCost = transferItem.unitCost || (target ? target.averageCost : 15);

    if (target) {
      target.virtualQty += qtyToAdd;
      target.availableQty = Math.max(0, target.virtualQty - target.reservedQty);
      target.status = computeItemStatus(target);
      target.lastMovementAt = now;
      processedCount++;

      recordMovement({
        id: `mov-cda-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        itemId: target.id,
        itemName: target.name,
        type: 'TRANSFERENCIA_ENTRADA',
        qty: qtyToAdd,
        unit: target.unit,
        unitCost,
        totalValue: qtyToAdd * unitCost,
        balanceBefore,
        balanceAfter: target.virtualQty,
        operatorId: 'op-gerente',
        operatorName: transferData.receivedBy || 'Gerente',
        operatorPin: '***',
        timestamp: now,
        notes: `Transferência de Material CDA nº ${transferData.transferNumber} recebida com sucesso`,
        eventHash: `hash-cda-${Date.now()}`,
        previousHash: '000000',
      });
    } else {
      const newItem: VirtualStockItem = {
        id: `item-cda-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        cdaCode: `CDA-${Math.floor(1000 + Math.random() * 9000)}`,
        name: transferItem.name,
        category: 'SECOS_ESPECIARIAS',
        unit: transferItem.unit,
        minStock: 5,
        safetyStock: 10,
        idealStock: 25,
        maxStock: 70,
        virtualQty: qtyToAdd,
        reservedQty: 0,
        availableQty: qtyToAdd,
        averageCost: unitCost,
        lastCost: unitCost,
        primarySupplier: 'CDA',
        orderLeadTimeDays: 2,
        minOrderQty: 1,
        orderQtyMultiple: 1,
        status: computeItemStatus({ availableQty: qtyToAdd, minStock: 5, safetyStock: 10 } as VirtualStockItem),
        daysUntilRuptura: null,
        lastMovementAt: now,
        errorMarginPct: 5,
      };

      stockItems.push(newItem);
      processedCount++;

      recordMovement({
        id: `mov-cda-new-${Date.now()}`,
        itemId: newItem.id,
        itemName: newItem.name,
        type: 'TRANSFERENCIA_ENTRADA',
        qty: qtyToAdd,
        unit: newItem.unit,
        unitCost,
        totalValue: qtyToAdd * unitCost,
        balanceBefore: 0,
        balanceAfter: qtyToAdd,
        operatorId: 'op-gerente',
        operatorName: transferData.receivedBy || 'Gerente',
        operatorPin: '***',
        timestamp: now,
        notes: `Novo item recebido por Transferência CDA nº ${transferData.transferNumber}`,
        eventHash: `hash-cda-new-${Date.now()}`,
        previousHash: '000000',
      });
    }
  });

  saveVirtualStockItems(stockItems);

  const transferLog: CdaMaterialTransfer = {
    id: `transfer-${Date.now()}`,
    transferNumber: transferData.transferNumber,
    date: now,
    origin: 'CDA Central Matriz',
    destination: 'Engenho Manauara',
    receivedBy: transferData.receivedBy || 'Gerente de Plantão',
    transporterOrDriver: transferData.driverOrTransporter || 'Logística Própria CDA',
    totalItemsCount: transferData.items.length,
    items: transferData.items,
    status: 'RECEBIDO_CONFIRMADO',
    notes: transferData.notes || 'Carga física conferida e adicionada ao estoque da loja.',
  };

  recordCdaTransferLog(transferLog);

  return { processedCount, transferId: transferLog.id };
}

/**
 * BAIXA DE ESTOQUE VIRTUAL PELAS VENDAS × FICHAS TÉCNICAS:
 * Para cada item/prato vendido no relatório de vendas (Teknisa PDV),
 * localiza sua Ficha Técnica oficial e dá baixa em cada insumo (gramas, ml, unidades).
 */
export function recordSalesDeduction(
  salesImport: SalesImport,
  operationalMarginPct: number = 8.5
): { totalDeductionsApplied: number; affectedItemsCount: number } {
  const stockItems = getVirtualStockItems();
  const now = new Date().toISOString();
  let totalDeductionsApplied = 0;
  const affectedItemIds = new Set<string>();

  // Mapa de pratos do cardápio oficial para lookup rápido
  const menuDishes = OFFICIAL_ENGENHO_MENU;

  for (const line of salesImport.lines) {
    const lineDishNameLower = line.dishName.trim().toLowerCase();
    const qtySold = line.qtyDelivered || line.qtyOrdered;

    if (qtySold <= 0) continue;

    // Busca a ficha técnica correspondente do prato
    const matchedDish = menuDishes.find((dish) => {
      const dName = dish.name.toLowerCase();
      return (
        dName === lineDishNameLower ||
        lineDishNameLower.includes(dName) ||
        dName.includes(lineDishNameLower)
      );
    });

    if (matchedDish && matchedDish.ingredients && matchedDish.ingredients.length > 0) {
      // Aplica baixa para cada ingrediente da ficha técnica
      for (const ing of matchedDish.ingredients) {
        const ingNameLower = ing.name.trim().toLowerCase();

        // Localiza insumo no estoque virtual
        const stockItem = stockItems.find(
          (item) =>
            item.name.toLowerCase() === ingNameLower ||
            item.name.toLowerCase().includes(ingNameLower) ||
            ingNameLower.includes(item.name.toLowerCase())
        );

        if (stockItem) {
          // Converte quantidade da ficha para a unidade do estoque
          let portionQtyInStockUnit = ing.quantity;
          if ((ing.unit === 'g' || ing.unit === 'ml') && (stockItem.unit === 'kg' || stockItem.unit === 'L')) {
            portionQtyInStockUnit = ing.quantity / 1000;
          }

          // Quantidade total consumida com margem de segurança operacional
          const totalConsumed = portionQtyInStockUnit * qtySold * (1 + operationalMarginPct / 100);
          const balanceBefore = stockItem.virtualQty;
          const balanceAfter = Math.max(0, stockItem.virtualQty - totalConsumed);

          stockItem.virtualQty = parseFloat(balanceAfter.toFixed(3));
          stockItem.availableQty = parseFloat(Math.max(0, stockItem.virtualQty - stockItem.reservedQty).toFixed(3));
          stockItem.status = computeItemStatus(stockItem);
          stockItem.lastMovementAt = now;

          affectedItemIds.add(stockItem.id);
          totalDeductionsApplied++;

          recordMovement({
            id: `mov-sale-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            itemId: stockItem.id,
            itemName: stockItem.name,
            type: 'CONSUMO_VENDA',
            qty: parseFloat(totalConsumed.toFixed(3)),
            unit: stockItem.unit,
            unitCost: stockItem.averageCost,
            totalValue: parseFloat((totalConsumed * stockItem.averageCost).toFixed(2)),
            balanceBefore,
            balanceAfter: stockItem.virtualQty,
            operatorId: 'op-pdv-sync',
            operatorName: 'Robô Teknisa / Carga de Vendas',
            operatorPin: '***',
            timestamp: now,
            saleImportId: salesImport.id,
            notes: `Baixa automática pelas vendas: ${qtySold}x "${matchedDish.name}" (Ficha Técnica: ${ing.quantity}${ing.unit}/porção + ${operationalMarginPct}% margem)`,
            eventHash: `hash-sale-${Date.now()}`,
            previousHash: '000000',
          });
        }
      }
    } else {
      // Prato sem ficha técnica exata: tenta encontrar insumo direto pelo nome
      const directStockItem = stockItems.find(
        (item) =>
          item.name.toLowerCase() === lineDishNameLower ||
          item.name.toLowerCase().includes(lineDishNameLower)
      );

      if (directStockItem) {
        const balanceBefore = directStockItem.virtualQty;
        const totalConsumed = qtySold * (1 + operationalMarginPct / 100);
        const balanceAfter = Math.max(0, directStockItem.virtualQty - totalConsumed);

        directStockItem.virtualQty = parseFloat(balanceAfter.toFixed(3));
        directStockItem.availableQty = parseFloat(Math.max(0, directStockItem.virtualQty - directStockItem.reservedQty).toFixed(3));
        directStockItem.status = computeItemStatus(directStockItem);
        directStockItem.lastMovementAt = now;

        affectedItemIds.add(directStockItem.id);
        totalDeductionsApplied++;

        recordMovement({
          id: `mov-sale-direct-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          itemId: directStockItem.id,
          itemName: directStockItem.name,
          type: 'CONSUMO_VENDA',
          qty: parseFloat(totalConsumed.toFixed(3)),
          unit: directStockItem.unit,
          unitCost: directStockItem.averageCost,
          totalValue: parseFloat((totalConsumed * directStockItem.averageCost).toFixed(2)),
          balanceBefore,
          balanceAfter: directStockItem.virtualQty,
          operatorId: 'op-pdv-sync',
          operatorName: 'Robô Teknisa / Carga de Vendas',
          operatorPin: '***',
          timestamp: now,
          saleImportId: salesImport.id,
          notes: `Baixa direta por venda de item: ${qtySold}x "${line.dishName}"`,
          eventHash: `hash-sale-direct-${Date.now()}`,
          previousHash: '000000',
        });
      }
    }
  }

  saveVirtualStockItems(stockItems);

  return {
    totalDeductionsApplied,
    affectedItemsCount: affectedItemIds.size,
  };
}

/**
 * Reseta o estoque virtual para estado limpo (zero absoluto)
 */
export function clearVirtualStockDataToClean(): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanItems = buildInitialStockCatalog();
    localStorage.setItem(STORAGE_KEY_VIRTUAL_STOCK, JSON.stringify(cleanItems));
    localStorage.setItem(STORAGE_KEY_MOVEMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_NF_RECORDS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_CDA_TRANSFERS, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('virtual_stock_updated', { detail: cleanItems }));
  } catch (err) {
    console.error('Falha ao limpar dados de estoque virtual:', err);
  }
}
