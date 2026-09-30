import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { AppSidebar, SidebarTabId } from './components/AppSidebar';
import { AppTopBar } from './components/AppTopBar';
import ChoppBarView from './components/bar/ChoppBarView';
import { GestaoHubView } from './components/GestaoHubView';
import { OperacaoHubView } from './components/OperacaoHubView';
import { SuprimentosHubView } from './components/SuprimentosHubView';
import { StaffRhView } from './components/StaffRhView';
import { MarketingView } from './components/MarketingView';
import { CopilotView } from './components/CopilotView';
import { ManagerCalendarView } from './components/calendar/ManagerCalendarView';
import { AiEmailAssistantView } from './components/email/AiEmailAssistantView';
import CustomerReviewsDashboardView from './components/CustomerReviewsDashboardView';
import { FloatingActions } from './components/FloatingActions';
import { OnboardingModal } from './components/OnboardingModal';
import { AboutExecutiveModal } from './components/AboutExecutiveModal';
import { AnvisaInspectionModal } from './components/AnvisaInspectionModal';
import { QuickPinModal } from './components/QuickPinModal';
import UnitSelectView from './components/auth/UnitSelectView';
import LoginView from './components/auth/LoginView';
import AdminPanelView from './components/auth/AdminPanelView';
import CustomerVirtualMenuView from './components/customer/CustomerVirtualMenuView';
import { SalesIntelligenceView } from './components/sales/SalesIntelligenceView';
import { SupervisorDashboardView } from './components/roles/SupervisorDashboardView';
import { ManagerAuditDashboardView } from './components/roles/ManagerAuditDashboardView';
import { BartenderDashboardView } from './components/roles/BartenderDashboardView';
import { KitchenRoleView } from './components/roles/KitchenRoleView';
import { AsgDashboardView } from './components/roles/AsgDashboardView';
import { WaitingQueueView } from './components/queue/WaitingQueueView';
import { AccessDeniedCard } from './components/common/AccessDeniedCard';
import { getAllowedTabsForUser } from './services/rbacSecurity';
import {
  INITIAL_BONUS,
  INITIAL_INVENTORY,
  INITIAL_LOSSES,
  INITIAL_REQUISITION,
  INITIAL_STAFF,
  INITIAL_CHECKLISTS,
  INITIAL_REVIEWS,
  INITIAL_TICKETS,
} from './data/mockData';
import { ShiftType, StockLoss, InventoryItem } from './types';
import type { Restaurant, UserAccount, ActiveSession } from './types/restaurant.types';
import { USER_ROLE_LABELS } from './types/restaurant.types';
import { getPermissions } from './services/permissions';
import {
  getSession,
  saveSession,
  clearSession,
  getSelectedUnit,
  getUsers,
  saveSelectedUnit,
  getRestaurantById,
} from './services/restaurantStore';
import { ensureCleanProductionSlate } from './services/appResetService';
import { checkAndTriggerNightlySyncIfNeeded } from './services/teknisaNightlySyncService';

// Garante início do zero para o usuário no navegador real
ensureCleanProductionSlate();

// Tipos de tela de autenticação
type AuthScreen = 'UNIT_SELECT' | 'LOGIN' | 'ADMIN' | 'AUTHENTICATED';

interface AppProps {
  initialAuthenticated?: boolean;
}

// Determina a aba padrão exclusiva para o cargo autenticado
function getDefaultTabForRole(role?: string): SidebarTabId {
  if (!role) return 'cardapio_cliente';
  switch (role) {
    case 'BARTENDER':
    case 'CHEFE_BAR':
      return 'bar';
    case 'ASG':
      return 'asg_dashboard';
    case 'CHEFE_COZINHA':
    case 'SUBCHEFE':
    case 'SUB_CHEFE_COZINHA':
      return 'cozinha_dashboard';
    case 'SUPERVISOR':
    case 'SUPERVISORA':
      return 'supervisor_dashboard';
    case 'GERENTE':
      return 'gerente_auditoria';
    case 'DONO':
    case 'CRIADOR_MASTER':
    default:
      return 'gestao';
  }
}

export function App({ initialAuthenticated }: AppProps = {}) {
  // ---- Estado de Autenticação Multi-Unidade ----
  const [authScreen, setAuthScreen] = useState<AuthScreen>(() => {
    if (initialAuthenticated) return 'AUTHENTICATED';
    // Tenta restaurar sessão salva
    const session = getSession();
    if (session) return 'AUTHENTICATED';
    return 'UNIT_SELECT';
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(() => {
    const session = getSession();
    if (session) return session.restaurant;
    const savedUnitId = getSelectedUnit();
    if (savedUnitId) {
      const r = getRestaurantById(savedUnitId);
      if (r) return r;
    }
    return null;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const session = getSession();
    return session ? session.user : null;
  });

  // ---- Estado da Aplicação ----
  const [currentShift, setCurrentShift] = useState<ShiftType>('MANHA_ALMOCO');
  const [activeTab, setActiveTab] = useState<SidebarTabId>(() => {
    const session = getSession();
    return session ? getDefaultTabForRole(session.user.role) : 'gestao';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [bonus, setBonus] = useState(INITIAL_BONUS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [losses, setLosses] = useState<StockLoss[]>(INITIAL_LOSSES);
  const [checklists, setChecklists] = useState(INITIAL_CHECKLISTS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string | undefined>();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAnvisaModal, setShowAnvisaModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  // Modo Cardápio Digital do Cliente (via link direto / QR Code ou botão no app)
  const [isCustomerMenuMode, setIsCustomerMenuMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.has('menu') || params.has('cardapio') || params.get('mode') === 'cliente';
    }
    return false;
  });

  // Permissões do usuário atual
  const permissions = useMemo(
    () => (currentUser ? getPermissions(currentUser.role) : null),
    [currentUser]
  );

  // Verificação e disparo diário automático das 03:00h do Teknisa
  useEffect(() => {
    checkAndTriggerNightlySyncIfNeeded();
  }, []);

  // Operator profile compatível com o Header/QuickPinModal antigo
  const currentOperator = useMemo(() => {
    if (!currentUser) return { id: '', name: '', role: '', department: '', pin: '', badgeColor: '' };
    return {
      id: currentUser.id,
      name: currentUser.name,
      role: USER_ROLE_LABELS[currentUser.role],
      department: currentUser.department,
      pin: currentUser.pin,
      badgeColor: currentUser.badgeColor,
    };
  }, [currentUser]);

  // ---- Handlers de Autenticação ----
  const handleUnitSelected = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    saveSelectedUnit(restaurant.id);
    setAuthScreen('LOGIN');
  }, []);

  const handleLoginSuccess = useCallback((user: UserAccount) => {
    setCurrentUser(user);
    setActiveTab(getDefaultTabForRole(user.role));
    const restaurant = selectedRestaurant!;
    const session: ActiveSession = {
      user,
      restaurant,
      loginAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    saveSession(session);
    setAuthScreen('AUTHENTICATED');
  }, [selectedRestaurant]);

  const handleLogout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
    setAuthScreen('UNIT_SELECT');
  }, []);

  const handleBackToUnitSelect = useCallback(() => {
    setSelectedRestaurant(null);
    setAuthScreen('UNIT_SELECT');
  }, []);

  const handleOperatorChange = useCallback((newOp: { id: string; name: string; role: string; department: string; pin: string; badgeColor: string }) => {
    // Buscar o UserAccount correspondente no store
    const users = getUsers();
    const found = users.find((u: UserAccount) => u.pin === newOp.pin && u.restaurantId === selectedRestaurant?.id);
    if (found) {
      setCurrentUser(found);
      setActiveTab(getDefaultTabForRole(found.role));
      if (selectedRestaurant) {
        saveSession({
          user: found,
          restaurant: selectedRestaurant,
          loginAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
        });
      }
    }
  }, [selectedRestaurant]);

  // Contenção RBAC: Bloqueia acesso não autorizado caso o usuário tente mudar de aba
  useEffect(() => {
    if (currentUser) {
      const allowed = getAllowedTabsForUser(currentUser);
      if (!allowed.includes(activeTab)) {
        setActiveTab(getDefaultTabForRole(currentUser.role));
      }
    }
  }, [currentUser, activeTab]);

  // ---- Handlers de Dados ----
  const toggleShift = () => {
    setCurrentShift((prev) => (prev === 'MANHA_ALMOCO' ? 'NOITE_JANTAR' : 'MANHA_ALMOCO'));
  };

  const handleAddLoss = (newLossData: Omit<StockLoss, 'id' | 'time'>) => {
    const newLoss: StockLoss = {
      ...newLossData,
      id: `loss-${Date.now()}`,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setLosses((prev) => [newLoss, ...prev]);
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const status = newStock <= item.minStock ? 'CRITICAL' : newStock <= item.minStock * 1.5 ? 'WARNING' : 'SAFE';
          return { ...item, currentStock: newStock, status };
        }
        return item;
      })
    );
  };

  const handleToggleChecklist = (id: string) => {
    setChecklists((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const completed = !item.completed;
          return { ...item, completed };
        }
        return item;
      })
    );

    if (id === 'chk-8') {
      setBonus((prev) => ({
        ...prev,
        foodSafety: {
          ...prev.foodSafety,
          eveningAuditDone: true,
          complianceRate: 100,
          achievedBonus: prev.foodSafety.maxBonus,
          status: 'SECURED',
        },
        totalBonus: prev.foodSafety.maxBonus + prev.nps.achievedBonus + prev.sales.achievedBonus,
      }));
    }
  };

  const handleAnswerReview = (id: string, responseText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isAnswered: true, finalResponse: responseText } : r
      )
    );

    setBonus((prev) => {
      const remainingUnanswered = reviews.filter((r) => r.id !== id && !r.isAnswered).length;
      if (remainingUnanswered === 0) {
        return {
          ...prev,
          nps: {
            ...prev.nps,
            responseRate: 100,
            pendingReviewsCount: 0,
            achievedBonus: prev.nps.maxBonus,
            status: 'SECURED',
          },
          totalBonus: prev.foodSafety.achievedBonus + prev.nps.maxBonus + prev.sales.achievedBonus,
        };
      }
      return prev;
    });
  };

  const handleOpenCopilot = (prompt?: string) => {
    setCopilotInitialPrompt(prompt);
    setActiveTab('copilot');
  };

  const pendingReviewsCount = reviews.filter((r) => !r.isAnswered).length;

  // ============================================================
  // RENDERIZAÇÃO POR TELA DE AUTENTICAÇÃO
  // ============================================================

  // Link Direto: Se o cliente abriu o Cardápio Digital (QR Code na mesa ou link direto)
  if (isCustomerMenuMode) {
    return (
      <CustomerVirtualMenuView
        onExitToApp={() => {
          setIsCustomerMenuMode(false);
          if (typeof window !== 'undefined' && window.history?.replaceState) {
            const url = new URL(window.location.href);
            url.searchParams.delete('menu');
            url.searchParams.delete('cardapio');
            url.searchParams.delete('mode');
            window.history.replaceState({}, '', url.pathname + (url.search || ''));
          }
        }}
      />
    );
  }

  // Tela 1: Seleção de Unidade
  if (authScreen === 'UNIT_SELECT') {
    return (
      <UnitSelectView
        onUnitSelected={handleUnitSelected}
        onOpenAdmin={() => setAuthScreen('ADMIN')}
        onOpenCustomerMenu={() => setIsCustomerMenuMode(true)}
      />
    );
  }

  // Tela Admin
  if (authScreen === 'ADMIN') {
    return (
      <AdminPanelView
        onBack={() => {
          if (currentUser && selectedRestaurant) {
            setAuthScreen('AUTHENTICATED');
          } else {
            handleBackToUnitSelect();
          }
        }}
        backLabel={currentUser ? 'Voltar ao Dashboard da Loja' : 'Voltar à Seleção de Unidade'}
      />
    );
  }

  // Tela 2: Login de Usuário
  if (authScreen === 'LOGIN' && selectedRestaurant) {
    return (
      <LoginView
        restaurant={selectedRestaurant}
        onLoginSuccess={handleLoginSuccess}
        onBack={handleBackToUnitSelect}
      />
    );
  }

  // Tela 3: Dashboard Autenticado
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white antialiased">
      {/* Sidebar Lateral Unificada (Fixa no Desktop, Gaveta Deslizante no Mobile) */}
      <AppSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentShift={currentShift}
        onToggleShift={toggleShift}
        currentOperator={currentOperator}
        currentUser={currentUser}
        onOpenPinModal={() => setShowPinModal(true)}
        onLogout={handleLogout}
        onOpenAdmin={() => setAuthScreen('ADMIN')}
        canAccessAdmin={permissions?.canAccessAdmin ?? false}
        restaurantName={selectedRestaurant?.name || 'Engenho Manauara'}
        restaurantLocation={selectedRestaurant?.shoppingMall ? `${selectedRestaurant.shoppingMall} – ${selectedRestaurant.city}/${selectedRestaurant.state}` : 'Manauara Shopping – Manaus/AM'}
        permissions={permissions}
      />

      {/* Área Central de Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TopBar Corporativo com Hamburger no Mobile e Status da Loja */}
        <AppTopBar
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          currentShift={currentShift}
          onToggleShift={toggleShift}
          currentOperator={currentOperator}
          onOpenPinModal={() => setShowPinModal(true)}
          onOpenAnvisa={() => setShowAnvisaModal(true)}
          onOpenAbout={() => setShowAbout(true)}
          onOpenOnboarding={() => setShowOnboarding(true)}
          onOpenCustomerMenu={() => setActiveTab('cardapio_cliente')}
          restaurantLocation={selectedRestaurant?.shoppingMall ? `${selectedRestaurant.shoppingMall}` : 'Manauara Shopping'}
        />

        {/* Viewport Central com Scroll Vertical Livre e Bloqueio de Deslocamento Lateral */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6 space-y-4">
          {/* AMBIENTE 1: PAINEL DA SUPERVISORA (ACESSO 75) */}
          {activeTab === 'supervisor_dashboard' && currentUser && (
            <SupervisorDashboardView
              currentUser={currentUser}
              onNavigateTab={(tab) => setActiveTab(tab as SidebarTabId)}
            />
          )}

          {/* AMBIENTE 2: AUDITORIA DO GERENTE (ACESSO 90) */}
          {activeTab === 'gerente_auditoria' && currentUser && (
            <ManagerAuditDashboardView
              currentUser={currentUser}
              onNavigateTab={(tab) => setActiveTab(tab as SidebarTabId)}
            />
          )}

          {/* AMBIENTE 3: PAINEL DA COZINHA (CHEFE & SUBCHEFE - ACESSO 60) */}
          {activeTab === 'cozinha_dashboard' && currentUser && (
            <KitchenRoleView currentUser={currentUser} />
          )}

          {/* AMBIENTE 4: LIMPEZA & ASG (ACESSO 30) */}
          {activeTab === 'asg_dashboard' && currentUser && (
            <AsgDashboardView currentUser={currentUser} />
          )}

          {/* PILAR 1: GESTÃO & DONO */}
          {activeTab === 'gestao' && (
            (permissions?.canViewFinancialDRE || permissions?.canViewExecutiveDashboard) ? (
              <GestaoHubView
                currentShift={currentShift}
                inventory={inventory}
                staff={INITIAL_STAFF}
                bonus={bonus}
                restaurantName={selectedRestaurant?.name || 'Engenho Manauara'}
                initialSubView="DONO_DRE"
                onNavigateToTab={(tab) => {
                  if (tab === 'cda' || tab === 'inventory') setActiveTab('suprimentos');
                  else if (tab === 'staff') setActiveTab('equipe');
                  else if (tab === 'marketing') setActiveTab('marketing');
                  else setActiveTab(tab as SidebarTabId);
                }}
                onOpenCopilot={handleOpenCopilot}
              />
            ) : (
              <AccessDeniedCard
                sectionName="Gestão & DRE Executivo"
                requiredRoleLabel="Dono ou Gerente Geral"
                currentRoleLabel={currentUser ? USER_ROLE_LABELS[currentUser.role] : 'Colaborador'}
                currentUserName={currentUser?.name}
                onGoBack={() => setActiveTab('operacao')}
              />
            )
          )}

          {/* PAINEL FINANCEIRO */}
          {activeTab === 'financeiro' && (
            (permissions?.canViewFinancialDRE || permissions?.canViewCashFlow) ? (
              <GestaoHubView
                currentShift={currentShift}
                inventory={inventory}
                staff={INITIAL_STAFF}
                bonus={bonus}
                restaurantName={selectedRestaurant?.name || 'Engenho Manauara'}
                initialSubView="PAINEL_FINANCEIRO_CONSUMER"
                onNavigateToTab={(tab) => {
                  if (tab === 'cda' || tab === 'inventory') setActiveTab('suprimentos');
                  else if (tab === 'staff') setActiveTab('equipe');
                  else if (tab === 'marketing') setActiveTab('marketing');
                  else setActiveTab(tab as SidebarTabId);
                }}
                onOpenCopilot={handleOpenCopilot}
              />
            ) : (
              <AccessDeniedCard
                sectionName="Painel Financeiro & Fechamento de Caixa"
                requiredRoleLabel="Dono ou Gerente Geral"
                currentRoleLabel={currentUser ? USER_ROLE_LABELS[currentUser.role] : 'Colaborador'}
                currentUserName={currentUser?.name}
                onGoBack={() => setActiveTab('operacao')}
              />
            )
          )}

          {/* PAINEL DE INTELIGÊNCIA DE VENDAS, DEGELO & ESTOQUE (TEKNISA POS) */}
          {activeTab === 'inteligencia_vendas' && (
            <SalesIntelligenceView onOpenCopilot={handleOpenCopilot} />
          )}

          {/* CALENDÁRIO & PRAZOS DO GERENTE */}
          {activeTab === 'calendario' && (
            <ManagerCalendarView />
          )}

          {/* FILA DE ESPERA & RECEPÇÃO DA PORTA (REGRA DOS 2 MINUTOS) */}
          {activeTab === 'fila_espera' && (
            <WaitingQueueView />
          )}

          {/* PILAR 2: OPERAÇÃO, SALÃO & MESAS */}
          {activeTab === 'operacao' && (
            <OperacaoHubView
              checklists={checklists}
              initialSubView="MESAS"
              onToggleCheck={handleToggleChecklist}
              onOpenCopilot={handleOpenCopilot}
            />
          )}

          {/* CARDÁPIO DIGITAL DO CLIENTE (MESA / QR CODE) */}
          {activeTab === 'cardapio_cliente' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[calc(100vh-110px)]">
              <CustomerVirtualMenuView onExitToApp={() => setActiveTab('gestao')} />
            </div>
          )}

          {/* PILAR 3: SUPRIMENTOS & HUB CDA */}
          {activeTab === 'suprimentos' && (
            <SuprimentosHubView
              inventory={inventory}
              losses={losses}
              requisition={INITIAL_REQUISITION}
              tickets={INITIAL_TICKETS}
              initialSubView="VIRTUAL"
              onAddLoss={handleAddLoss}
              onUpdateStock={handleUpdateStock}
              onOpenCopilot={handleOpenCopilot}
            />
          )}

          {/* BAR & CHOPPEIRAS / AMBIENTE ISOLADO DO BARTENDER */}
          {activeTab === 'bar' && (
            currentUser && (currentUser.role === 'BARTENDER' || currentUser.role === 'CHEFE_BAR') ? (
              <BartenderDashboardView currentUser={currentUser} />
            ) : (
              <ChoppBarView />
            )
          )}

          {/* CÂMARA FRIA & FREEZERS */}
          {activeTab === 'camara' && (
            <OperacaoHubView
              checklists={checklists}
              initialSubView="CAMARA_FRIA"
              onToggleCheck={handleToggleChecklist}
              onOpenCopilot={handleOpenCopilot}
            />
          )}

          {/* AUDITORIAS & POPS */}
          {activeTab === 'auditoria' && (
            <GestaoHubView
              currentShift={currentShift}
              inventory={inventory}
              staff={INITIAL_STAFF}
              bonus={bonus}
              restaurantName={selectedRestaurant?.name || 'Engenho Manauara'}
              initialSubView="AUDITORIAS"
              onNavigateToTab={(tab) => {
                if (tab === 'cda' || tab === 'inventory') setActiveTab('suprimentos');
                else if (tab === 'staff') setActiveTab('equipe');
                else if (tab === 'marketing') setActiveTab('marketing');
                else setActiveTab(tab as SidebarTabId);
              }}
              onOpenCopilot={handleOpenCopilot}
            />
          )}

          {/* PILAR 4: MARKETING, REELS VIRAIS & REPUTAÇÃO */}
          {activeTab === 'marketing' && permissions?.canViewMarketing && (
            <MarketingView
              reviews={reviews}
              onAnswerReview={handleAnswerReview}
              onOpenCopilot={handleOpenCopilot}
            />
          )}

          {/* MÓDULO DE AVALIAÇÕES & REPUTAÇÃO ONLINE (Google Maps · Restaurant Guru) */}
          {activeTab === 'avaliacoes' && permissions?.canViewMarketing && (
            <CustomerReviewsDashboardView />
          )}

          {/* PILAR 5: EQUIPE & ESCALA RH */}
          {activeTab === 'equipe' && permissions?.canViewStaff && (
            <StaffRhView
              staff={INITIAL_STAFF}
              currentShift={currentShift}
              onOpenCopilot={handleOpenCopilot}
            />
          )}

          {/* CENTRAL DE RESPOSTA DE E-MAILS COM IA */}
          {activeTab === 'email_ia' && permissions?.canViewCopilot && (
            <AiEmailAssistantView />
          )}

          {/* PILAR 6: COPILOT IA */}
          {activeTab === 'copilot' && permissions?.canViewCopilot && (
            <CopilotView
              bonus={bonus}
              currentUser={currentUser}
              initialPrompt={copilotInitialPrompt}
              onClearInitialPrompt={() => setCopilotInitialPrompt(undefined)}
            />
          )}

          {/* Mensagem se não tem permissão para a aba */}
          {((activeTab === 'marketing' && !permissions?.canViewMarketing) ||
            (activeTab === 'avaliacoes' && !permissions?.canViewMarketing) ||
            (activeTab === 'equipe' && !permissions?.canViewStaff) ||
            (activeTab === 'email_ia' && !permissions?.canViewCopilot) ||
            (activeTab === 'copilot' && !permissions?.canViewCopilot)) && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <ShieldCheck className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm font-semibold">Acesso Restrito</p>
              <p className="text-xs mt-1">Seu perfil de <strong>{currentUser ? USER_ROLE_LABELS[currentUser.role] : ''}</strong> não tem acesso a esta área.</p>
            </div>
          )}
        </main>
      </div>

      {/* Botão Flutuante Rápido de Chão de Loja (FAB) */}
      <FloatingActions
        onOpen86={() => setActiveTab('operacao')}
        onOpenLoss={() => setActiveTab('suprimentos')}
        onOpenTempCheck={() => setActiveTab('camara')}
        onOpenTraceability={() => setActiveTab('camara')}
        onOpenCopilot={handleOpenCopilot}
      />

      {/* Modal de Onboarding do Novo Gerente */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Modal de Apresentação Executiva & Pitch para a Diretoria */}
      <AboutExecutiveModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />

      {/* Modal de Dossiê Oficial Sanitário ANVISA (RDC 216) */}
      <AnvisaInspectionModal
        isOpen={showAnvisaModal}
        onClose={() => setShowAnvisaModal(false)}
      />

      {/* Modal de Troca Rápida de Operador por PIN & Bloqueio Kiosk */}
      <QuickPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        currentOperator={currentOperator}
        onOperatorChange={handleOperatorChange}
      />
    </div>
  );
}

export default App;
