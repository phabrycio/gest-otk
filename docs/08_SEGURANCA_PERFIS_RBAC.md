# 🛡️ DOC-08: Segurança, Autenticação & Matriz RBAC
### Engenho Gestor 360 – Governança & Controle de Acesso Enterprise

---

## 1. Princípios de Segurança e Conformidade
1. **Segregação de Funções (SoD):** Quem registra uma perda não deve ser o único responsável por homologar o fechamento do CMV.
2. **Trilha de Auditoria Imutável (*Audit Trail*):** Qualquer ajuste de contagem de estoque, cancelamento de prato ou lançamento de perda gera registro inalterável com IP, timestamp, dispositivo e ID do usuário.
3. **Privacidade & LGPD:** Proteção de prontuários médicos, atestados e dados salariais dos colaboradores da loja.

---

## 2. Matriz RBAC (Role-Based Access Control)

| Recurso / Funcionalidade | `GERENTE_GERAL` | `SUBGERENTE` | `CHEF_COZINHA` | `CHEFE_BAR` | `ESTOQUISTA` | `AUDITOR_CDA` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Visualizar Faturamento & Metas** | ✅ Total | ✅ Turno | ❌ | ❌ | ❌ | ✅ Total |
| **Contagem Curva A (Auditoria)** | ✅ Total | ✅ Total | ✅ Cozinha | ✅ Bar/Adega | ✅ Total | 👁️ Apenas Leitura |
| **Aprovar Baixas de Perdas > R$ 100**| ✅ Total | ❌ | ❌ | ❌ | ❌ | 👁️ Auditoria |
| **Gerar & Transmitir Pedido CDA** | ✅ Total | ❌ | 📝 Sugerir | 📝 Sugerir | ❌ | 👁️ Apenas Leitura |
| **Recebimento na Doca (Checklist)**| ✅ Total | ✅ Total | ❌ | ❌ | ✅ Total | 👁️ Apenas Leitura |
| **Gerenciar Escalas & Folgas RH** | ✅ Total | 📝 Sugerir | 📝 Escala Cozinha| ❌ | ❌ | ❌ |
| **Gerar Briefing com IA** | ✅ Total | ✅ Turno | ❌ | ❌ | ❌ | ❌ |
| **Abrir Chamados Corporativos** | ✅ Total | ✅ Total | ✅ Cozinha/Gás | ✅ Bar | ❌ | ❌ |
| **Responder Reviews (Google Maps)** | ✅ Total | 📝 Rascunho | ❌ | ❌ | ❌ | 👁️ Apenas Leitura |
| **Acesso Irrestrito ao Copilot IA**| ✅ Total | ⚠️ Limitado | ⚠️ Operacional | ⚠️ Operacional| ❌ | ❌ |

*Legenda: ✅ Acesso Pleno | 📝 Sugere ou Rascunha | ⚠️ Acesso Restrito ao Contexto | 👁️ Apenas Leitura | ❌ Bloqueado*

---

## 3. Políticas de Segurança em Banco de Dados (Row Level Security - RLS)

```sql
-- Habilita RLS em tabelas com dados financeiros e estratégicos
ALTER TABLE stock_losses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cda_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_briefings ENABLE ROW LEVEL SECURITY;

-- Política: Apenas Gerente Geral e Auditor CDA podem ver valores consolidados de perdas
CREATE POLICY policy_view_stock_losses ON stock_losses
FOR SELECT
USING (
    auth.jwt_role() IN ('GERENTE_GERAL', 'AUDITOR_MATRIZ_CDA')
    OR reported_by_user_id = auth.uid()
);

-- Política: Apenas Gerente Geral pode autorizar ou enviar pedidos oficiais ao CDA
CREATE POLICY policy_submit_cda_requisition ON cda_requisitions
FOR UPDATE
USING (auth.jwt_role() = 'GERENTE_GERAL');
```

---

## 4. Tabela de Trilha de Auditoria (Audit Logs)

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- UPDATE_STOCK, DELETE_ORDER, OVERRIDE_LOSS
    entity_name VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_name, entity_id);
```
