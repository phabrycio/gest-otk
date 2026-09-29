# 🔌 DOC-06: Especificação de APIs & Contratos de Integração
### Engenho Gestor 360 – Padrão RESTful & OpenAPI 3.1

---

## 1. Diretrizes Globais de API & Segurança
* **Base URL:** `https://api.gestaoengenho.com.br/v1`
* **Autenticação:** Bearer Token (JWT RFC 7519) emitido no cabeçalho `Authorization: Bearer <token>`.
* **Tratamento de Erros:** Padrão RFC 7807 (*Problem Details for HTTP APIs*).
* **Idempotência:** Requisições de mutação crítica (como envio de pedido ao CDA ou baixas de estoque) exigem o header `Idempotency-Key: <UUID>`.

---

## 2. Catálogo de Endpoints Corporativos

### 2.1. Autenticação & Sessão do Turno

#### `POST /auth/quick-login`
Permite ao gerente ou subgerente alternar rapidamente de usuário no tablet do restaurante usando PIN de 6 dígitos.

* **Request Body:**
```json
{
  "pin_code": "482910",
  "device_fingerprint": "tablet-salao-ponta-negra-01"
}
```
* **Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "expires_in": 28800,
  "user": {
    "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "name": "Gerente Geral Ponta Negra",
    "role": "GERENTE_GERAL",
    "permissions": ["INVENTORY_ALL", "CDA_ORDER", "HR_SCALE", "CHECKLIST_APPROVE", "COPILOT_UNLIMITED"]
  }
}
```

---

### 2.2. Cockpit Financeiro & Bônus Mensal do Gerente (Meta R$ 2.000,00)

#### `GET /manager/bonus-dashboard?month=9&year=2026`
Retorna a apuração em tempo real dos 3 pilares de bonificação mensal do gerente da loja.

* **Response (200 OK):**
```json
{
  "reference_period": "Setembro / 2026",
  "max_possible_bonus": 2000.00,
  "current_projected_bonus": 1950.00,
  "bonus_achievement_percentage": 97.5,
  "pillars": {
    "food_safety": {
      "weight_percentage": 35,
      "max_value": 700.00,
      "achieved_value": 700.00,
      "compliance_rate": 98.2,
      "target_rate": 95.0,
      "status": "SECURED",
      "audits_completed": 22,
      "audits_pending_today": 0
    },
    "nps_customer_reviews": {
      "weight_percentage": 25,
      "max_value": 500.00,
      "achieved_value": 500.00,
      "average_rating": 4.8,
      "target_rating": 4.6,
      "response_rate": 100.0,
      "target_response_rate": 100.0,
      "status": "SECURED",
      "pending_reviews_count": 0
    },
    "sales_monthly_target": {
      "weight_percentage": 40,
      "max_value": 800.00,
      "achieved_value": 750.00,
      "target_revenue": 400000.00,
      "current_revenue": 385400.00,
      "progress_percentage": 96.35,
      "projected_final_revenue": 412000.00,
      "days_remaining": 3,
      "daily_needed_run_rate": 4866.67,
      "status": "ON_TRACK"
    }
  },
  "actionable_ai_recommendations": [
    "Faltam R$ 14.600 para garantir 100% dos R$ 800 de vendas. O pico de sábado de feijoada e domingo de almoço familiar cobre com folga.",
    "Mantenha a aferição térmica às 10h30 e 17h00 para blindar os R$ 700 de Segurança dos Alimentos."
  ]
}
```

---

### 2.3. Dashboard Executivo do Turno

#### `GET /dashboard/turn-overview?shift=MANHA_ALMOCO`
Retorna os indicadores consolidados em tempo real para a tela inicial do gerente.

* **Response (200 OK):**
```json
{
  "unit": "Restaurante Engenho - Shopping Ponta Negra",
  "current_date": "2026-09-11",
  "shift": "MANHA_ALMOCO",
  "financials": {
    "revenue_current": 14280.50,
    "revenue_target": 18000.00,
    "target_progress_percentage": 79.33,
    "projected_day_total": 31500.00
  },
  "critical_stock_alerts": [
    {
      "item_name": "Lombo de Tambaqui Fresco",
      "current_stock": 8.5,
      "unit": "KG",
      "status": "CRITICAL",
      "hours_until_stockout": 3.5
    },
    {
      "item_name": "Camarão GG Limpo",
      "current_stock": 12.0,
      "unit": "KG",
      "status": "WARNING",
      "hours_until_stockout": 7.0
    }
  ],
  "cda_status": {
    "next_order_cutoff": "2026-09-11T15:00:00-04:00",
    "pending_delivery_today": true,
    "cda_truck_status": "EM_TRANSITO"
  },
  "checklists_status": {
    "abertura_salao": "CONCLUIDO",
    "abertura_cozinha": "CONCLUIDO",
    "afericao_termica": "CONFORME"
  },
  "staff_on_duty": {
    "scheduled": 14,
    "present": 13,
    "absent": 1,
    "substitute_assigned": true
  }
}
```

---

### 2.3. Estoque: Lançamento de Quebras & Perdas

#### `POST /inventory/losses`
Registra instantaneamente o descarte de um insumo com comprovação fotográfica e recalcula o custo.

* **Content-Type:** `multipart/form-data`
* **Form Fields:**
  * `item_id` (UUID): `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`
  * `quantity` (Number): `2.450`
  * `reason` (String): `ERRO_PONTO_PREPARO`
  * `notes` (String): `Filé de Pirarucu passou do ponto na grelha após pico de pedidos às 13:40`
  * `photo_file` (File): *[anexo jpeg/png]*
* **Response (201 Created):**
```json
{
  "loss_id": "b72b8344-9f2d-45f8-8924-11e2f759c882",
  "item_name": "Filé de Pirarucu Fresco",
  "quantity_lost": 2.450,
  "unit_cost": 48.90,
  "total_financial_loss": 119.80,
  "registered_at": "2026-09-11T13:48:22-04:00",
  "current_remaining_stock": 18.250,
  "status": "AUDITED"
}
```

---

### 2.4. CDA: Sugestão Preditiva & Envio de Pedido

#### `POST /cda/requisitions/generate-smart-order`
Dispara o cálculo automatizado com base no histórico de vendas dos últimos 3 finais de semana e previsão de chuva em Manaus.

* **Request Body:**
```json
{
  "target_delivery_date": "2026-09-13",
  "coverage_days": 3,
  "include_weekend_safety_buffer": true
}
```
* **Response (200 OK):**
```json
{
  "requisition_draft_id": "cda-req-20260911-003",
  "total_items_count": 34,
  "total_estimated_value": 18450.00,
  "ai_justification": "Previsão de chuva moderada em Manaus no sábado aumentará em 18% o fluxo no Shopping Ponta Negra. Demanda aumentada de Pirarucu e Costela.",
  "items": [
    {
      "cda_code": "CAR-0042",
      "item_name": "Carne de Sol Artesanal Bovina",
      "current_stock": 14.0,
      "projected_consumption": 45.0,
      "safety_stock": 10.0,
      "suggested_order_qty": 41.0,
      "unit": "KG",
      "unit_cost": 54.00,
      "subtotal": 2214.00
    },
    {
      "cda_code": "PES-0018",
      "item_name": "Costela de Tambaqui Congelada",
      "current_stock": 8.0,
      "projected_consumption": 38.0,
      "safety_stock": 10.0,
      "suggested_order_qty": 40.0,
      "unit": "KG",
      "unit_cost": 36.50,
      "subtotal": 1460.00
    }
  ]
}
```

#### `POST /cda/requisitions/{id}/submit`
Fecha e transmite a requisição oficial ao ERP central do CDA.

* **Header:** `Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`
* **Response (200 OK):**
```json
{
  "protocol": "CDA-PN-2026-0911-884",
  "status": "ENVIADO_CDA",
  "cutoff_timestamp": "2026-09-11T15:00:00-04:00",
  "delivery_window": "2026-09-13T07:30:00-04:00 às 09:30:00-04:00",
  "receipt_doc_required": true
}
```

---

### 2.5. CDA: Checklist de Recebimento na Doca do Shopping

#### `POST /cda/requisitions/{id}/dock-receipt`
Auditoria no descarregamento das mercadorias com registro de temperatura e divergências.

* **Request Body:**
```json
{
  "truck_temperature_celsius": -19.2,
  "seal_intact": true,
  "cda_invoice_number": "NF-e 0049281-2",
  "items_checked": [
    {
      "item_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "requested_qty": 40.0,
      "delivered_qty": 35.0,
      "divergence_reason": "Corte parcial de estoque no armazém central do CDA",
      "product_temperature_celsius": -18.5
    }
  ],
  "photos_avaria_urls": []
}
```

---

### 2.6. IA Copilot: Assistente Operacional do Gerente

#### `POST /copilot/query`
Conversação operacional com a IA treinada nas regras de negócio do Grupo Engenho.

* **Request Body:**
```json
{
  "conversation_id": "conv-20260911-mgr-01",
  "prompt": "Mesa 12 com 6 pessoas reclamou que a Carne de Sol veio excessivamente salgada e o arroz carreteiro frio. A mesa já está impaciente. Como devo proceder agora no salão?",
  "context": {
    "table_number": 12,
    "waiter_name": "Carlos Silva",
    "turn": "NOITE_JANTAR"
  }
}
```
* **Response (200 OK):**
```json
{
  "suggested_speech": "Boa noite, me chamo [Seu Nome], sou o gerente da casa. Peço sinceras desculpas pelo ocorrido; este não é o padrão de excelência e tempero que praticamos aqui no Engenho. Já providenciei a retirada imediata dos pratos e o nosso chef está preparando uma nova porção com atenção máxima e prioridade zero na cozinha. Enquanto ajustamos, posso oferecer uma rodada de chopp ou bebidas da casa como cortesia?",
  "internal_actions": [
    "Retirar imediatamente os pratos defeituosos da mesa.",
    "Ir pessoalmente à boqueta e falar com o Sous-Chef sobre o lote de carne de sol.",
    "Lançar os 2 pratos estornados como perda no app (motivo: ERRO_PONTO_PREPARO).",
    "Aplicar cortesia das bebidas na comanda no sistema PDV."
  ]
}
```
