-- ============================================================
-- ESQUEMA DO BANCO DE DADOS POSTGRESQL (SUPABASE)
-- Tk Gestão e Tecnologia • Unidade Engenho Manauara
-- Criado por: Pabricio (Criador do Sistema & Master Admin)
-- ============================================================

-- Habilitar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE RESTAURANTES / UNIDADES
CREATE TABLE IF NOT EXISTS public.restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    address TEXT NOT NULL,
    shopping_mall TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'AM',
    phone TEXT,
    cnpj TEXT,
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE USUÁRIOS E OPERADORES
CREATE TABLE IF NOT EXISTS public.user_accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    pin TEXT NOT NULL,
    role TEXT NOT NULL,
    restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    sector TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    badge_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE ITENS DO ESTOQUE VIRTUAL INTELIGENTE
CREATE TABLE IF NOT EXISTS public.stock_items (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE CASCADE,
    cda_code TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    sector TEXT NOT NULL,
    responsible_person TEXT NOT NULL,
    unit TEXT NOT NULL,
    min_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
    current_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
    ideal_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
    unit_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'SAFE',
    last_count_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE RASTREAMENTO DE ITENS DO FREEZER (CDA)
CREATE TABLE IF NOT EXISTS public.freezer_tracked_items (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE CASCADE,
    qr_code TEXT NOT NULL UNIQUE,
    item_name TEXT NOT NULL,
    category TEXT,
    local_batch_number TEXT NOT NULL,
    cda_batch_number TEXT NOT NULL,
    batch_color TEXT NOT NULL, -- 'AZUL', 'VERDE', 'AMBAR'
    reception_date TEXT NOT NULL,
    cda_expiry_date TEXT NOT NULL,
    initial_quantity NUMERIC(12,2) NOT NULL,
    current_quantity NUMERIC(12,2) NOT NULL,
    unit TEXT NOT NULL,
    current_stage TEXT NOT NULL DEFAULT 'FREEZER', -- 'FREEZER', 'DEGELO', 'PRODUCAO'
    entered_freezer_at TEXT NOT NULL,
    entered_degelo_at TEXT,
    entered_producao_at TEXT,
    operator_received TEXT NOT NULL,
    operator_degelo TEXT,
    operator_producao TEXT,
    temperature_check TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE HISTÓRICO DE MOVIMENTAÇÕES TÉRMICAS
CREATE TABLE IF NOT EXISTS public.freezer_movement_logs (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE CASCADE,
    item_id TEXT REFERENCES public.freezer_tracked_items(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    local_batch_number TEXT NOT NULL,
    batch_color TEXT NOT NULL,
    from_stage TEXT NOT NULL,
    to_stage TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    operator TEXT NOT NULL,
    trigger_method TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ÍNDICES PARA ALTA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_restaurant ON public.user_accounts(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_stock_restaurant ON public.stock_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_freezer_restaurant ON public.freezer_tracked_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_freezer_stage ON public.freezer_tracked_items(current_stage);
CREATE INDEX IF NOT EXISTS idx_freezer_qr ON public.freezer_tracked_items(qr_code);

-- DADOS INICIAIS (SEED) DO ENGENHO MANAUARA
INSERT INTO public.restaurants (id, name, short_name, address, shopping_mall, city, state, phone, cnpj)
VALUES (
    'rest-engenho-manauara',
    'Restaurante Engenho Manauara',
    'Engenho Manauara',
    'Av. Mário Ypiranga, 1300 - Adrianópolis',
    'Manauara Shopping',
    'Manaus',
    'AM',
    '(92) 3236-4000',
    '04.821.940/0001-52'
) ON CONFLICT (id) DO NOTHING;

-- USUÁRIOS INICIAIS DA UNIDADE MANAUARA
INSERT INTO public.user_accounts (id, name, username, password, pin, role, restaurant_id, department, sector, badge_color)
VALUES
    ('user-rogerio', 'Rogério', 'rogerio', '123456', '1001', 'PROPRIETARIO', 'rest-engenho-manauara', 'DIRETORIA EXECUTIVA', NULL, 'bg-amber-500 text-amber-950 font-bold'),
    ('user-sidney', 'Sidney', 'sidney', '123456', '1002', 'PROPRIETARIO', 'rest-engenho-manauara', 'DIRETORIA EXECUTIVA', NULL, 'bg-amber-500 text-amber-950 font-bold'),
    ('user-ivan', 'Ivan', 'ivan', '123456', '2001', 'GERENTE', 'rest-engenho-manauara', 'COMANDO TOTAL DA LOJA', NULL, 'bg-emerald-700 text-white font-bold'),
    ('user-pabricio', 'Pabricio', 'pabricio', '123456', '2002', 'GERENTE_TREINAMENTO', 'rest-engenho-manauara', 'CRIADOR DO SISTEMA & MASTER ADMIN', NULL, 'bg-teal-700 text-white font-bold'),
    ('user-patricia', 'Patricia', 'patricia', '123456', '3001', 'SUPERVISOR', 'rest-engenho-manauara', 'SUPERVISÃO DE LOJA', 'GERAL_LOJA', 'bg-indigo-600 text-white font-semibold'),
    ('user-pedro', 'Pedro', 'pedro', '123456', '4001', 'CHEFE_BAR', 'rest-engenho-manauara', 'BAR E BEBIDAS', 'BAR_BEBIDAS', 'bg-purple-600 text-white font-semibold'),
    ('user-madio', 'Mádio', 'madio', '123456', '5001', 'CHEFE_COZINHA', 'rest-engenho-manauara', 'COZINHA PRINCIPAL', 'COZINHA_FREEZER_SECO', 'bg-orange-600 text-white font-semibold'),
    ('user-esmael', 'Esmael', 'esmael', '123456', '5002', 'SUB_CHEFE_COZINHA', 'rest-engenho-manauara', 'COZINHA E PRÉ-PREPARO', 'COZINHA_FREEZER_SECO', 'bg-amber-600 text-white font-semibold'),
    ('user-anne', 'Anne', 'anne', '123456', '6001', 'COMISSARIA', 'rest-engenho-manauara', 'COMISSARIA E SALÃO', 'VINHOS_CACHACAS_CHARCUT', 'bg-rose-600 text-white font-semibold'),
    ('user-elendia', 'Elendia', 'elendia', '123456', '6002', 'COMISSARIA', 'rest-engenho-manauara', 'COMISSARIA E SALÃO', 'VINHOS_CACHACAS_CHARCUT', 'bg-rose-600 text-white font-semibold'),
    ('user-amanda', 'Amanda', 'amanda', '123456', '7001', 'CAIXA', 'rest-engenho-manauara', 'CAIXA E ATENDIMENTO', 'CAIXA_BOMBONS_BALAS', 'bg-blue-600 text-white font-semibold')
ON CONFLICT (id) DO NOTHING;
