-- ============================================================
-- TABELA DE LOGS DE AUDITORIA DO SISTEMA
-- Tk Gestão e Tecnologia • Exclusivo Master Admin (Pabricio)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.system_audit_logs (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE SET NULL,
    user_id TEXT,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    severity TEXT NOT NULL DEFAULT 'INFO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para busca ultrarrápida
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.system_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.system_audit_logs(user_name);
CREATE INDEX IF NOT EXISTS idx_audit_module ON public.system_audit_logs(module);
CREATE INDEX IF NOT EXISTS idx_audit_severity ON public.system_audit_logs(severity);

-- RLS
ALTER TABLE public.system_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read write on audit logs" ON public.system_audit_logs;
CREATE POLICY "Allow anon read write on audit logs" ON public.system_audit_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT ALL ON public.system_audit_logs TO anon, authenticated;
