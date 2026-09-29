// ============================================================
// TIPOS DO SISTEMA MULTI-UNIDADE & AUTENTICAÇÃO
// Tk Gestão e Tecnologia — Sistema Multi-Restaurante
// ============================================================

// --- Restaurante / Unidade ---

export interface Restaurant {
  id: string;
  name: string;
  shortName: string;
  address: string;
  shoppingMall?: string;
  city: string;
  state: string;
  phone?: string;
  cnpj?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
}

// --- Roles de Usuário ---

export type UserRole =
  | 'DONO'
  | 'PROPRIETARIO'
  | 'GERENTE'
  | 'GERENTE_TREINAMENTO'
  | 'SUPERVISOR'
  | 'SUPERVISORA'
  | 'CHEFE_COZINHA'
  | 'SUB_CHEFE_COZINHA'
  | 'SUBCHEFE'
  | 'CHEFE_BAR'
  | 'BARTENDER'
  | 'COMISSARIA'
  | 'CAIXA'
  | 'CHEFE_FILA'
  | 'ASG'
  | 'OPERADOR';

export const ROLE_ACCESS_LEVELS: Record<UserRole, number> = {
  DONO: 100,
  PROPRIETARIO: 100,
  GERENTE_TREINAMENTO: 100,
  GERENTE: 90,
  SUPERVISOR: 75,
  SUPERVISORA: 75,
  CHEFE_COZINHA: 60,
  SUB_CHEFE_COZINHA: 60,
  SUBCHEFE: 60,
  CHEFE_BAR: 40,
  BARTENDER: 40,
  COMISSARIA: 40,
  CAIXA: 40,
  CHEFE_FILA: 40,
  ASG: 30,
  OPERADOR: 20,
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  DONO: 'Donos (Acesso 100 • Estratégico)',
  PROPRIETARIO: 'Donos (Acesso 100 • Estratégico)',
  GERENTE: 'Gerente (Acesso 90 • Auditor da Unidade)',
  GERENTE_TREINAMENTO: 'Gerente & Criador do Sistema (Master Admin)',
  SUPERVISOR: 'Supervisora (Acesso 75 • Operação Administrativa)',
  SUPERVISORA: 'Supervisora (Acesso 75 • Operação Administrativa)',
  CHEFE_COZINHA: 'Chefe de Cozinha (Acesso 60 • Técnico Cozinha)',
  SUB_CHEFE_COZINHA: 'Subchefe de Cozinha (Acesso 60 • Operação Diária)',
  SUBCHEFE: 'Subchefe de Cozinha (Acesso 60 • Operação Diária)',
  CHEFE_BAR: 'Bartender (Acesso 40 • Bar & Bebidas)',
  BARTENDER: 'Bartender (Acesso 40 • Bar & Bebidas)',
  COMISSARIA: 'Comissária de Salão (Acesso 40)',
  CAIXA: 'Operadora de Caixa (Acesso 40)',
  CHEFE_FILA: 'Chefe de Fila / Hostess (Acesso 40 • Recepção)',
  ASG: 'ASG (Acesso 30 • Limpeza & Higienização)',
  OPERADOR: 'Operador (Acesso 20)',
};

export const USER_ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  DONO: 'Visão estratégica completa: financeiro, DRE, CMV, compras e todas as unidades',
  PROPRIETARIO: 'Visão estratégica completa: financeiro, DRE, CMV, compras e todas as unidades',
  GERENTE: 'Auditor operacional da unidade: gestão de loja, indicadores, auditoria e feedback',
  GERENTE_TREINAMENTO: 'Master Admin: gestão total, configuração de lojas e governança global',
  SUPERVISOR: 'Gestora administrativa: escalas, tarefas, checklists, valida inventários e aprova compras',
  SUPERVISORA: 'Gestora administrativa: escalas, tarefas, checklists, valida inventários e aprova compras',
  CHEFE_COZINHA: 'Responsável técnico: estoque cozinha, câmara fria, perdas, produção e insumos',
  SUB_CHEFE_COZINHA: 'Operação diária da cozinha (sem alteração de ficha técnica ou aprovação)',
  SUBCHEFE: 'Operação diária da cozinha (sem alteração de ficha técnica ou aprovação)',
  CHEFE_BAR: 'Gestão exclusiva do bar: bebidas, contagem de garrafas, perdas e sugestão de compras',
  BARTENDER: 'Gestão exclusiva do bar: bebidas, contagem de garrafas, perdas e sugestão de compras',
  COMISSARIA: 'Vinhos nobres, cachaças especiais, adega e charcutaria',
  CAIXA: 'Frente de caixa, bombons, balas e controle de validades',
  CHEFE_FILA: 'Recepção e porta: gestão da fila de espera, alocação de mesas e chamada 2min',
  ASG: 'Ambiente simplificado: checklists de limpeza, cronogramas, ocorrências e ponto',
  OPERADOR: 'Operação básica de apoio',
};

export const USER_ROLE_BADGE_COLORS: Record<UserRole, string> = {
  DONO: 'bg-amber-500 text-amber-950 font-bold',
  PROPRIETARIO: 'bg-amber-500 text-amber-950 font-bold',
  GERENTE: 'bg-blue-600 text-white font-bold',
  GERENTE_TREINAMENTO: 'bg-teal-700 text-white font-bold',
  SUPERVISOR: 'bg-teal-600 text-white font-bold',
  SUPERVISORA: 'bg-teal-600 text-white font-bold',
  CHEFE_COZINHA: 'bg-emerald-700 text-white font-bold',
  SUB_CHEFE_COZINHA: 'bg-emerald-600 text-white font-semibold',
  SUBCHEFE: 'bg-emerald-600 text-white font-semibold',
  CHEFE_BAR: 'bg-purple-700 text-white font-bold',
  BARTENDER: 'bg-purple-700 text-white font-bold',
  COMISSARIA: 'bg-rose-600 text-white font-semibold',
  CAIXA: 'bg-sky-600 text-white font-semibold',
  CHEFE_FILA: 'bg-indigo-700 text-white font-bold',
  ASG: 'bg-slate-700 text-white font-bold',
  OPERADOR: 'bg-slate-600 text-white',
};

// --- Setores de Contagem de Estoque ---

export type StockSector =
  | 'COZINHA_FREEZER_SECO'       // Chefe de Cozinha & Sub Chefe — freezer e estoque seco
  | 'BAR_BEBIDAS'               // Bartender / Chefe do Bar — todos os itens do bar
  | 'VINHOS_CACHACAS_CHARCUT'   // Comissárias — cachaças nobres, vinhos e charcutaria
  | 'CAIXA_BOMBONS_BALAS'       // Caixa — bombons, chocolates, balas e validades
  | 'LIMPEZA_HIGIENE'           // ASG — insumos de higienização e materiais
  | 'GERAL_LOJA'                // Supervisora & Gerentes — suprimentos gerais e materiais
  | 'COZINHA'                   // Alias Oficial Cozinha
  | 'BAR';                      // Alias Oficial Bar

export const STOCK_SECTOR_LABELS: Record<StockSector, string> = {
  COZINHA_FREEZER_SECO: 'Cozinha: Freezer & Estoque Seco (Mádio / Esmael)',
  BAR_BEBIDAS: 'Bar: Itens do Bar & Chopeiras (Pedro)',
  VINHOS_CACHACAS_CHARCUT: 'Comissária: Vinhos, Cachaças & Charcutaria (Anne / Elendia)',
  CAIXA_BOMBONS_BALAS: 'Caixa: Bombons, Balas, Chocolates & Validades (Amanda)',
  LIMPEZA_HIGIENE: 'Limpeza: Insumos de Higienização & Manutenção (ASG)',
  GERAL_LOJA: 'Geral da Loja: Suprimentos & Materiais (Patrícia / Gerência)',
  COZINHA: 'Cozinha & Câmaras Frias (Chefe / Subchefe)',
  BAR: 'Bar & Bebidas (Bartender)',
};

// --- Conta de Usuário ---

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  password: string;       // Em produção seria hash — aqui é texto para demo
  pin: string;            // PIN de 4 dígitos para troca rápida
  matricula?: string;     // Matrícula corporativa para assinaturas eletrônicas
  role: UserRole;
  restaurantId: string;   // Unidade à qual pertence
  department: string;
  sector?: StockSector;   // Setor de responsabilidade para contagem
  isActive: boolean;
  badgeColor: string;
  createdAt: string;
}

// --- Permissões Granulares por Cargo (Matriz Oficial) ---

export interface RolePermissions {
  // Executivo & Financeiro
  canViewExecutiveDashboard: boolean; // Dono e Gerente
  canViewFinancialDRE: boolean;       // Dono e Gerente (Supervisora e outros NÃO podem)
  canViewCashFlow: boolean;           // Dono e Gerente
  canViewSales: boolean;              // Dono e Gerente
  canViewDrinksSalesOnly: boolean;    // Bartender (Apenas bebidas)

  // Estoque por Setor
  canViewFullStock: boolean;          // Dono e Gerente
  canViewKitchenStock: boolean;       // Dono, Gerente, Supervisora (👁️), Chefe/Subchefe
  canViewBarStock: boolean;           // Dono, Gerente, Supervisora (👁️), Bartender
  canCountStock: boolean;             // No setor correspondente
  canSuperviseAndSignInventory: boolean; // Supervisora (Assinatura que bloqueia alterações)
  canAuditInventory: boolean;         // Gerente (Audita com feedback e assina)

  // Compras & Suprimentos
  canRequestPurchase: boolean;        // Chefe e Bartender (Solicitam)
  canApprovePurchase: boolean;        // Supervisora (Aprova e assina digitalmente)
  canAuditPurchase: boolean;          // Gerente (Visualiza, audita e dá feedback)
  canManageRecipes: boolean;          // Chefe, Gerente, Dono (Subchefe NÃO altera ficha)

  // Funcionários & Escalas
  canManageAllStaff: boolean;         // Dono, Gerente, Supervisora
  canManageKitchenStaff: boolean;     // Chefe (Equipe da cozinha)
  canManageRosters: boolean;          // Supervisora, Gerente, Dono
  canManageKitchenRoster: boolean;    // Chefe (Escala da cozinha)
  canViewOwnRosterOnly: boolean;      // Bartender, ASG, Caixa (Próprio)

  // Checklists & Limpeza
  canManageAllChecklists: boolean;    // Dono, Gerente, Supervisora
  canManageKitchenChecklists: boolean;// Chefe/Subchefe
  canManageBarChecklists: boolean;    // Bartender
  canManageCleaningChecklists: boolean; // ASG (Limpeza)

  // Auditoria Imutável
  canViewAuditTrail: boolean;         // Dono, Gerente, Supervisora (👁️)
  canSignAudits: boolean;             // Supervisora e Gerente

  // Configurações & Usuários
  canManageUsers: boolean;            // Dono e Gerente Master
  canManageRestaurants: boolean;      // Dono e Gerente Master
  canAccessAdmin: boolean;            // Dono e Gerente Master
  canManageSystemSettings: boolean;   // Dono (Gerente apenas parâmetros operacionais)

  // Legado compatível
  canAddProducts: boolean;
  canImportSales: boolean;
  canRegisterWriteOffs: boolean;
  canApproveWriteOffs: boolean;
  canTransferStock: boolean;
  canRequestRecount: boolean;
  canViewReports: boolean;
  canViewDashboard: boolean;
  canViewFullDashboard: boolean;
  canViewAuditCalendar: boolean;
  canCreateAudit: boolean;
  canViewStaff: boolean;
  canManageStaff: boolean;
  canViewMarketing: boolean;
  canViewCopilot: boolean;
}

// --- Sessão Ativa ---

export interface ActiveSession {
  user: UserAccount;
  restaurant: Restaurant;
  loginAt: string;
  lastActivityAt: string;
}
