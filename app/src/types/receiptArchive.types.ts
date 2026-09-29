// ============================================================
// TIPOS: ARQUIVAMENTO FISCAL & RETENÇÃO DE NOTAS DE 3 MESES
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

export type ReceiptCategory =
  | 'HORTIFRUTI_FEIRA'
  | 'CARNES_PESCADOS'
  | 'BEBIDAS_BAR_CHOPP'
  | 'MANUTENCAO_REPAROS'
  | 'LIMPEZA_HIGIENE'
  | 'EMBALAGENS_DESCARTAVEIS'
  | 'FUNDO_FIXO_CAIXA'
  | 'OUTROS_INSUMOS';

export const RECEIPT_CATEGORY_LABELS: Record<ReceiptCategory, string> = {
  HORTIFRUTI_FEIRA: 'Hortifruti & Feira da Panair',
  CARNES_PESCADOS: 'Carnes Nobres & Pescados',
  BEBIDAS_BAR_CHOPP: 'Chopp Brahma & Bebidas Bar',
  MANUTENCAO_REPAROS: 'Manutenção & Peças Críticas',
  LIMPEZA_HIGIENE: 'Produtos Químicos & Limpeza',
  EMBALAGENS_DESCARTAVEIS: 'Embalagens Take-Away',
  FUNDO_FIXO_CAIXA: 'Fundo Fixo / Caixa Emergencial',
  OUTROS_INSUMOS: 'Outros Insumos Gerais',
};

export interface FiscalReceipt {
  id: string;                         // ID único (ex: rcpt-202606-001)
  receiptNumber: string;              // Número da NF-e / Cupom / Recibo
  supplierName: string;               // Razão Social ou Fornecedor
  cnpjOrCpf: string;                  // CNPJ / CPF
  category: ReceiptCategory;
  amount: number;                     // Valor em Reais (R$)
  issueDate: string;                  // Data de emissão (ex: 2026-06-18)
  uploadDate: string;                 // Data de inserção no sistema
  uploadedBy: string;                 // Nome do operador/gerente que inseriu
  restaurantId: string;
  restaurantName: string;
  imageUrl: string;                   // Imagem da nota (base64 / storage URL)
  fileName: string;
  fileSizeKb: number;
  monthBucket: string;                // "2026-06", "2026-07", "2026-08", "2026-09"
  monthLabel: string;                 // "Junho / 2026"
  status: 'ONLINE_ATIVO' | 'ARQUIVADO_LOCAL_EXPURGADO';
  localArchivedAt?: string;
  localArchivedBy?: string;
  notes?: string;
}

export interface ReceiptMonthSummary {
  monthBucket: string;                // "2026-06"
  monthLabel: string;                 // "Junho / 2026"
  monthIndex: number;                 // 0 = mês atual, 1 = mês -1, 2 = mês -2, 3 = 4º mês (vencido)
  isExpired4thMonth: boolean;         // true se for o 4º mês que atingiu o limite de 90 dias
  totalReceipts: number;
  totalAmount: number;
  totalSizeMb: number;
  status: 'ONLINE_ATIVO' | 'PENDENTE_DOWNLOAD_EXPURGO' | 'ARQUIVADO_LOCAL';
  receipts: FiscalReceipt[];
}
