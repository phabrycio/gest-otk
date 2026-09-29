// ============================================================
// SERVIÇO DE RESET GERAL E LIMPEZA DE DADOS FICTÍCIOS
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

export const CLEAN_MODE_FLAG = 'tk_clean_mode_v9_total_zero_bar_and_diag';

/**
 * Zera todos os dados fictícios e mocks do armazenamento local (localStorage),
 * deixando o aplicativo pronto para operação real do zero.
 */
export function resetAllAppDataToZero(): void {
  try {
    // 1. Fila de Espera & Porta: zero clientes e logs, mesas liberadas
    localStorage.setItem('engenho_waiting_queue_v1', JSON.stringify([]));
    localStorage.removeItem('engenho_queue_tables_v1');
    localStorage.setItem('engenho_queue_logs_v1', JSON.stringify([]));

    // 2. Bar, Chopeiras & Destilados: zero barris engatados e garrafas abertas
    localStorage.removeItem('tk_bar_chopp_taps_v1');
    localStorage.removeItem('tk_bar_spirit_bottles_v1');
    localStorage.removeItem('tk_bar_kegs_v1');
    localStorage.removeItem('tk_bar_planning_items_v1');
    localStorage.setItem('tk_bar_sales_history_v1', JSON.stringify([]));
    localStorage.setItem('tk_bar_counts_v1', JSON.stringify({}));

    // 3. Workflow de Inventários & Solicitações de Compra: zero solicitações e contagens pendentes
    localStorage.setItem('tk_workflow_purchases_v1', JSON.stringify([]));
    localStorage.setItem('tk_workflow_inventories_v1', JSON.stringify([]));
    localStorage.setItem('tk_sector_stock_counts_v1', JSON.stringify([]));

    // 4. Cozinha & ASG: zero contagens, registros de ponto e ocorrências
    localStorage.setItem('tk_kitchen_counts_v1', JSON.stringify({}));
    localStorage.removeItem('tk_asg_cleaning_tasks_v1');
    localStorage.setItem('tk_asg_clock_records_v1', JSON.stringify([]));
    localStorage.setItem('tk_asg_occurrences_v1', JSON.stringify([]));

    // 5. Câmara Fria: zero leituras fictícias
    localStorage.setItem('tk_cold_chamber_readings_v1', JSON.stringify([]));

    // 6. Rastreamento do Freezer (CDA): zero itens e logs
    localStorage.setItem('tk_freezer_tracked_items_v1', JSON.stringify([]));
    localStorage.setItem('tk_freezer_movement_logs_v1', JSON.stringify([]));

    // 7. Comprovantes Fiscais: zero notas arquivadas
    localStorage.setItem('tk_fiscal_receipts_v1', JSON.stringify([]));

    // 8. Finanças & Caixa: zero sessões e títulos
    localStorage.setItem('tk_cash_sessions_v1', JSON.stringify([]));
    localStorage.setItem('tk_accounts_payable_v1', JSON.stringify([]));
    localStorage.setItem('tk_accounts_receivable_v1', JSON.stringify([]));

    // 9. Cardápio do Cliente / Pedidos Salão: zero pedidos mock
    localStorage.setItem('tk_customer_orders_v1', JSON.stringify([]));

    // 10. Limpa chave Gemini antiga/inválida do cache se presente
    const storedGemini = localStorage.getItem('tk_gemini_api_key');
    if (storedGemini && storedGemini.includes('AQ.Ab8RN6IRKcWw')) {
      localStorage.removeItem('tk_gemini_api_key');
    }

    // 11. Status de Carga Teknisa: resetado para pendente de hoje
    localStorage.setItem(
      'tk_system_feed_status',
      JSON.stringify({
        lastUpdated: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('pt-BR'),
        formattedTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        updatedBy: 'Sistema',
        userRole: 'Administrador',
        periodCompetence: 'Início da Operação Real (Hoje)',
        source: 'IMPORTACAO_MANUAL',
        status: 'PENDENTE_CARGA_HOJE',
        totalSalesRows: 0,
        totalCancellationsRows: 0,
        totalStockDeductions: 0,
        totalCommissionersProcessed: 0,
        notes: 'Sistema inicializado do zero. Aguardando primeira carga de fechamento do Teknisa.',
        filesProcessed: [],
      })
    );

    // 12. Log de Auditoria: marca oficial de inicialização do zero
    localStorage.setItem(
      'tk_system_audit_logs',
      JSON.stringify([
        {
          id: `log-init-${Date.now()}`,
          timestamp: new Date().toISOString(),
          formattedTime: new Date().toLocaleString('pt-BR'),
          userId: 'user-pabricio',
          userName: 'Pabricio',
          userRole: 'Criador do Sistema & Master Admin',
          restaurantId: 'rest-engenho-manauara',
          restaurantName: 'Engenho Manauara',
          action: 'INICIALIZACAO_SISTEMA_ZERO',
          actionLabel: 'Sistema Inicializado do Zero',
          module: 'ADMINISTRACAO',
          description: 'Sistema resetado com sucesso para início da operação real hoje. Dados fictícios apagados.',
          severity: 'SUCESSO',
          ipOrDevice: 'Console Local',
          details: { mode: 'OPERACAO_REAL_ZERO' },
        },
      ])
    );

    // 13. Estoque Virtual & Preditivo 12 Semanas: zero insumos e zero histórico simulado
    localStorage.setItem('tk_virtual_stock_items_v2', JSON.stringify([]));
    localStorage.setItem('tk_virtual_stock_movements_v2', JSON.stringify([]));
    localStorage.setItem('tk_virtual_stock_nfs_v2', JSON.stringify([]));
    localStorage.setItem('tk_virtual_stock_cda_transfers_v2', JSON.stringify([]));
    localStorage.setItem('tk_12weeks_sales_history_v1', JSON.stringify({}));

    // 14. Calendário Gerencial: zero prazos
    localStorage.setItem('tk_manager_calendar_v1', JSON.stringify([]));

    // 15. RH Funcionários: zero fichas
    localStorage.setItem('tk_rh_staff_v1', JSON.stringify([]));

    // 16. Restaurante Store: limpa cache antigo
    localStorage.removeItem('tk_restaurant_state_v1');

    // Marca no storage que a limpeza de inicialização foi realizada
    localStorage.setItem(CLEAN_MODE_FLAG, 'true');
  } catch (err) {
    console.error('Erro ao resetar dados do app:', err);
  }
}

/**
 * Garante que se o usuário abrir o navegador pela primeira vez ou após a atualização,
 * os dados fictícios antigos cacheados sejam automaticamente limpos.
 */
export function ensureCleanProductionSlate(): void {
  try {
    if (typeof localStorage === 'undefined') return;

    // Se estiver em ambiente de teste automatizado (vitest), não interfere
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
      return;
    }

    const isInitialized = localStorage.getItem(CLEAN_MODE_FLAG);
    if (!isInitialized) {
      resetAllAppDataToZero();
    }
  } catch (e) {
    console.error('Falha ao verificar clean slate:', e);
  }
}
