// ============================================================
// STORE LOCAL — Restaurantes, Usuários e Sessão
// Persiste em localStorage simulando banco de dados
// Tk Gestão e Tecnologia
// ============================================================

import type {
  Restaurant,
  UserAccount,
  UserRole,
  ActiveSession,
  StockSector,
} from '../types/restaurant.types';
import { USER_ROLE_BADGE_COLORS } from '../types/restaurant.types';

const STORAGE_KEYS = {
  RESTAURANTS: 'tk_restaurants',
  USERS: 'tk_users',
  SESSION: 'tk_active_session',
  SELECTED_UNIT: 'tk_selected_unit_id',
} as const;

// ============================================================
// SEED DATA — Dados iniciais do sistema
// ============================================================

const SEED_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-engenho-manauara',
    name: 'Engenho Manauara',
    shortName: 'Manauara',
    address: 'Av. Mário Ypiranga, 4000 - Adrianópolis',
    shoppingMall: 'Manauara Shopping',
    city: 'Manaus',
    state: 'AM',
    phone: '(92) 3XXX-XXXX',
    cnpj: '',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const SEED_USERS: UserAccount[] = [
  // 1. Proprietário — Rogério (Acesso total e dashboard completo para análise da loja)
  {
    id: 'user-rogerio',
    name: 'Rogério',
    username: 'rogerio',
    password: '123456',
    pin: '1001',
    matricula: 'DIR-01',
    role: 'DONO',
    restaurantId: 'rest-engenho-manauara',
    department: 'DIRETORIA EXECUTIVA',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.DONO,
    createdAt: new Date().toISOString(),
  },
  // 2. Proprietário — Sidney (Acesso total e dashboard completo para análise da loja)
  {
    id: 'user-sidney',
    name: 'Sidney',
    username: 'sidney',
    password: '123456',
    pin: '1002',
    matricula: 'DIR-02',
    role: 'DONO',
    restaurantId: 'rest-engenho-manauara',
    department: 'DIRETORIA EXECUTIVA',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.DONO,
    createdAt: new Date().toISOString(),
  },
  // 3. Gerente Geral — Ivan (Comando total da loja, decisões operacionais e financeiras • Acesso Full)
  {
    id: 'user-ivan',
    name: 'Ivan',
    username: 'ivan',
    password: '123456',
    pin: '2001',
    matricula: 'GER-01',
    role: 'GERENTE',
    restaurantId: 'rest-engenho-manauara',
    department: 'COMANDO TOTAL DA LOJA',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.GERENTE,
    createdAt: new Date().toISOString(),
  },
  // 4. Gerente em Treinamento — Pabricio (Comando e gestão de loja, rotinas gerenciais executivas • Acesso Full)
  {
    id: 'user-pabricio',
    name: 'Pabricio',
    username: 'pabricio',
    password: 'p4br1c10ju4n',
    pin: '2002',
    matricula: 'MST-01',
    role: 'GERENTE_TREINAMENTO',
    restaurantId: 'rest-engenho-manauara',
    department: 'COMANDO E GESTÃO DE LOJA',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.GERENTE_TREINAMENTO,
    createdAt: new Date().toISOString(),
  },
  // 5. Supervisora de Loja — Patricia (Controle de equipe, estoque, material, contagem e recontagem, baixa de vendas)
  {
    id: 'user-patricia',
    name: 'Patricia',
    username: 'patricia',
    password: '123456',
    pin: '3001',
    matricula: 'SUP-01',
    role: 'SUPERVISORA',
    restaurantId: 'rest-engenho-manauara',
    department: 'SUPERVISÃO DE LOJA',
    sector: 'GERAL_LOJA',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.SUPERVISORA,
    createdAt: new Date().toISOString(),
  },
  // 6. Chefe do Bar — Pedro (Gestão e contagem de todos os itens do bar e chopeiras)
  {
    id: 'user-pedro',
    name: 'Pedro',
    username: 'pedro',
    password: '123456',
    pin: '4001',
    matricula: 'BAR-01',
    role: 'BARTENDER',
    restaurantId: 'rest-engenho-manauara',
    department: 'BAR & CHOPP',
    sector: 'BAR_BEBIDAS',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.BARTENDER,
    createdAt: new Date().toISOString(),
  },
  // 7. Chefe de Cozinha — Mádio (Gestão dos itens da freezer e do estoque seco)
  {
    id: 'user-madio',
    name: 'Mádio',
    username: 'madio',
    password: '123456',
    pin: '5001',
    matricula: 'CHF-01',
    role: 'CHEFE_COZINHA',
    restaurantId: 'rest-engenho-manauara',
    department: 'COZINHA & BRASA',
    sector: 'COZINHA_FREEZER_SECO',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.CHEFE_COZINHA,
    createdAt: new Date().toISOString(),
  },
  // 8. Sub Chefe de Cozinha — Esmael (Gestão compartilhada dos itens de freezer e estoque seco)
  {
    id: 'user-esmael',
    name: 'Esmael',
    username: 'esmael',
    password: '123456',
    pin: '5002',
    matricula: 'CHF-02',
    role: 'SUB_CHEFE_COZINHA',
    restaurantId: 'rest-engenho-manauara',
    department: 'COZINHA & BRASA',
    sector: 'COZINHA_FREEZER_SECO',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.SUB_CHEFE_COZINHA,
    createdAt: new Date().toISOString(),
  },
  // 9. Comissária — Anne (Responsável por cachaças seletas, vinhos e itens de charcutaria)
  {
    id: 'user-anne',
    name: 'Anne',
    username: 'anne',
    password: '123456',
    pin: '6001',
    matricula: 'CMS-01',
    role: 'COMISSARIA',
    restaurantId: 'rest-engenho-manauara',
    department: 'SALÃO & COMISSARIA',
    sector: 'VINHOS_CACHACAS_CHARCUT',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.COMISSARIA,
    createdAt: new Date().toISOString(),
  },
  // 10. Comissária — Elendia (Responsável por cachaças seletas, vinhos e itens de charcutaria)
  {
    id: 'user-elendia',
    name: 'Elendia',
    username: 'elendia',
    password: '123456',
    pin: '6002',
    matricula: 'CMS-02',
    role: 'COMISSARIA',
    restaurantId: 'rest-engenho-manauara',
    department: 'SALÃO & COMISSARIA',
    sector: 'VINHOS_CACHACAS_CHARCUT',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.COMISSARIA,
    createdAt: new Date().toISOString(),
  },
  // 11. Caixa — Amanda (Contagem e verificação rigorosa de validade dos bombons, chocolates e balas do caixa)
  {
    id: 'user-amanda',
    name: 'Amanda',
    username: 'amanda',
    password: '123456',
    pin: '7001',
    matricula: 'CXA-01',
    role: 'CAIXA',
    restaurantId: 'rest-engenho-manauara',
    department: 'FRENTE DE CAIXA',
    sector: 'CAIXA_BOMBONS_BALAS',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.CAIXA,
    createdAt: new Date().toISOString(),
  },
  // 12. ASG — Maria (Higienização sanitária, checklists de limpeza e cronograma)
  {
    id: 'user-maria-asg',
    name: 'Maria (ASG)',
    username: 'maria',
    password: '123456',
    pin: '8001',
    matricula: 'ASG-01',
    role: 'ASG',
    restaurantId: 'rest-engenho-manauara',
    department: 'LIMPEZA & HIGIENIZAÇÃO',
    sector: 'LIMPEZA_HIGIENE',
    isActive: true,
    badgeColor: USER_ROLE_BADGE_COLORS.ASG,
    createdAt: new Date().toISOString(),
  },
];

// ============================================================
// INICIALIZAÇÃO — Garante que seed data existe
// ============================================================

function ensureSeeded(): void {
  try {
    const existingRestaurants = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    if (!existingRestaurants) {
      localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(SEED_RESTAURANTS));
    }
    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    // Atualiza automaticamente se o store estiver vazio ou com mock antigo
    if (!existingUsers || !existingUsers.includes('user-maria-asg')) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    } else {
      // Sincroniza credencial personalizada do usuário Pabricio
      try {
        const users: UserAccount[] = JSON.parse(existingUsers);
        let changed = false;
        const pabricio = users.find((u) => u.username.toLowerCase() === 'pabricio' || u.id === 'user-pabricio');
        if (pabricio && pabricio.password !== 'p4br1c10ju4n') {
          pabricio.password = 'p4br1c10ju4n';
          changed = true;
        }
        if (changed) {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        }
      } catch {
        /* ignore parse error */
      }
    }
  } catch {
    // localStorage indisponível — opera com dados em memória
  }
}

// Executa na importação
ensureSeeded();

// ============================================================
// RESTAURANTES (CRUD)
// ============================================================

export function getRestaurants(): Restaurant[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    return data ? JSON.parse(data) : SEED_RESTAURANTS;
  } catch {
    return SEED_RESTAURANTS;
  }
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return getRestaurants().find((r) => r.id === id);
}

export function getActiveRestaurants(): Restaurant[] {
  return getRestaurants().filter((r) => r.isActive);
}

export function addRestaurant(restaurant: Omit<Restaurant, 'id' | 'createdAt'>): Restaurant {
  const newRestaurant: Restaurant = {
    ...restaurant,
    id: `rest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const restaurants = getRestaurants();
  restaurants.push(newRestaurant);
  try {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
  } catch { /* ignore */ }
  return newRestaurant;
}

export function updateRestaurant(id: string, updates: Partial<Restaurant>): Restaurant | null {
  const restaurants = getRestaurants();
  const idx = restaurants.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  restaurants[idx] = { ...restaurants[idx], ...updates };
  try {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
  } catch { /* ignore */ }
  return restaurants[idx];
}

export function deleteRestaurant(id: string): boolean {
  const restaurants = getRestaurants();
  const filtered = restaurants.filter((r) => r.id !== id);
  if (filtered.length === restaurants.length) return false;
  try {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(filtered));
  } catch { /* ignore */ }
  return true;
}

// ============================================================
// USUÁRIOS (CRUD)
// ============================================================

export function getUsers(): UserAccount[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

export function getUserById(id: string): UserAccount | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUsersByRestaurant(restaurantId: string): UserAccount[] {
  return getUsers().filter((u) => u.restaurantId === restaurantId && u.isActive);
}

export function getUsersByRole(role: UserRole): UserAccount[] {
  return getUsers().filter((u) => u.role === role && u.isActive);
}

export function addUser(user: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount {
  const newUser: UserAccount = {
    ...user,
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const users = getUsers();
  users.push(newUser);
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch { /* ignore */ }
  return newUser;
}

export function updateUser(id: string, updates: Partial<UserAccount>): UserAccount | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch { /* ignore */ }
  return users[idx];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
  } catch { /* ignore */ }
  return true;
}

// ============================================================
// AUTENTICAÇÃO
// ============================================================

export function authenticateUser(
  username: string,
  password: string,
  restaurantId: string
): UserAccount | null {
  const users = getUsersByRestaurant(restaurantId);
  const user = users.find(
    (u) =>
      u.username.toLowerCase() === username.trim().toLowerCase() &&
      u.password === password &&
      u.isActive
  );
  return user ?? null;
}

export function authenticateByPin(
  pin: string,
  restaurantId: string
): UserAccount | null {
  const users = getUsersByRestaurant(restaurantId);
  const user = users.find((u) => u.pin === pin && u.isActive);
  return user ?? null;
}

// ============================================================
// SESSÃO
// ============================================================

import { sanitizeUserForSession } from './securitySanitizer';

export function saveSession(session: ActiveSession): void {
  try {
    const sanitizedSession: ActiveSession = {
      ...session,
      user: sanitizeUserForSession(session.user),
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sanitizedSession));
  } catch { /* ignore */ }
}

export function getSession(): ActiveSession | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    // Mantém compatibilidade com tokens antigos
    localStorage.removeItem('engenho_auth_token');
    localStorage.removeItem('engenho_auth_username');
  } catch { /* ignore */ }
}

// ============================================================
// UNIDADE SELECIONADA (persiste entre sessões)
// ============================================================

export function saveSelectedUnit(restaurantId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_UNIT, restaurantId);
  } catch { /* ignore */ }
}

export function getSelectedUnit(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_UNIT);
  } catch {
    return null;
  }
}

// ============================================================
// RESET — Para debug/desenvolvimento
// ============================================================

export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.RESTAURANTS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_UNIT);
    ensureSeeded();
  } catch { /* ignore */ }
}
