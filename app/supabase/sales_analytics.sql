-- ============================================================
-- ESQUEMA DE INTELIGÊNCIA DE VENDAS, DEGELO & COMPRAS PREVENTIVAS
-- Tk Gestão e Tecnologia • Unidade Engenho Manauara
-- Baseado no processamento de 98.393 vendas reais do Teknisa POS
-- ============================================================

-- 1. SUMÁRIO DIÁRIO DE VENDAS
CREATE TABLE IF NOT EXISTS public.sales_daily_summary (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE CASCADE,
    sale_date TEXT NOT NULL,          -- DD/MM/YYYY
    iso_date DATE NOT NULL,           -- YYYY-MM-DD
    total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_items_sold NUMERIC(12,2) NOT NULL DEFAULT 0,
    orders_count INTEGER NOT NULL DEFAULT 0,
    ticket_medio NUMERIC(12,2) NOT NULL DEFAULT 0,
    top_selling_item TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. VELOCIDADE E CONTROLE ANTI-RUPTURA DE PRODUTOS
CREATE TABLE IF NOT EXISTS public.sales_product_velocity (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE CASCADE,
    product_code TEXT NOT NULL,
    product_name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT 'ENGENHO / REGIONAL',
    unit TEXT NOT NULL DEFAULT 'UN',
    total_qty_sold NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
    avg_selling_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    daily_avg_sales NUMERIC(12,2) NOT NULL DEFAULT 0,
    weekday_avg_sales NUMERIC(12,2) NOT NULL DEFAULT 0,
    weekend_avg_sales NUMERIC(12,2) NOT NULL DEFAULT 0,
    min_safety_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
    ideal_par_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
    weekly_reorder_qty NUMERIC(12,2) NOT NULL DEFAULT 0,
    active_days_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. COTAS DE DEGELO INTELIGENTE (COZINHA & CÂMARA FRIA)
CREATE TABLE IF NOT EXISTS public.kitchen_thaw_quotas (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE CASCADE,
    item_keyword TEXT NOT NULL UNIQUE,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'KG/PORCAO',
    defrost_hours INTEGER NOT NULL DEFAULT 16,
    avg_daily_thaw NUMERIC(12,2) NOT NULL DEFAULT 0,
    weekday_thaw_quota NUMERIC(12,2) NOT NULL DEFAULT 0,
    weekend_thaw_quota NUMERIC(12,2) NOT NULL DEFAULT 0,
    min_cold_chamber_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_sales_daily_date ON public.sales_daily_summary(iso_date DESC);
CREATE INDEX IF NOT EXISTS idx_prod_velocity_rev ON public.sales_product_velocity(total_revenue DESC);
CREATE INDEX IF NOT EXISTS idx_prod_velocity_code ON public.sales_product_velocity(product_code);
CREATE INDEX IF NOT EXISTS idx_thaw_quotas_cat ON public.kitchen_thaw_quotas(category);

-- 5. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.sales_daily_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_product_velocity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchen_thaw_quotas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read write on sales daily" ON public.sales_daily_summary;
CREATE POLICY "Allow anon read write on sales daily" ON public.sales_daily_summary FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read write on product velocity" ON public.sales_product_velocity;
CREATE POLICY "Allow anon read write on product velocity" ON public.sales_product_velocity FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read write on thaw quotas" ON public.kitchen_thaw_quotas;
CREATE POLICY "Allow anon read write on thaw quotas" ON public.kitchen_thaw_quotas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT ALL ON public.sales_daily_summary TO anon, authenticated;
GRANT ALL ON public.sales_product_velocity TO anon, authenticated;
GRANT ALL ON public.kitchen_thaw_quotas TO anon, authenticated;
