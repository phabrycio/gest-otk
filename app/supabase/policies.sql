ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freezer_tracked_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freezer_movement_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read write on restaurants" ON public.restaurants;
CREATE POLICY "Allow anon read write on restaurants" ON public.restaurants FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read write on user_accounts" ON public.user_accounts;
CREATE POLICY "Allow anon read write on user_accounts" ON public.user_accounts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read write on stock_items" ON public.stock_items;
CREATE POLICY "Allow anon read write on stock_items" ON public.stock_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read write on freezer_tracked_items" ON public.freezer_tracked_items;
CREATE POLICY "Allow anon read write on freezer_tracked_items" ON public.freezer_tracked_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read write on freezer_movement_logs" ON public.freezer_movement_logs;
CREATE POLICY "Allow anon read write on freezer_movement_logs" ON public.freezer_movement_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
