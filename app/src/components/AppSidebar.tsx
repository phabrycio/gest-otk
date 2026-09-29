// ============================================================
// SIDEBAR LATERAL UNIFICADA (WEB DESKTOP & MOBILE DRAWER)
// Tk Gestão e Tecnologia • Isolamento Absoluto de Menus por Cargo
// ============================================================

import React from 'react';
import {
  Crown,
  TrendingUp,
  UtensilsCrossed,
  PackageCheck,
  Beer,
  Snowflake,
  ClipboardCheck,
  Users,
  Flame,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  Lock,
  X,
  ShieldCheck,
  Settings,
  Calendar,
  Mail,
  QrCode,
  FileCheck2,
  Timer,
  BarChart3,
} from 'lucide-react';
import { ShiftType } from '../types';
import { OperatorProfile } from './QuickPinModal';
import type { UserAccount } from '../types/restaurant.types';
import { USER_ROLE_LABELS } from '../types/restaurant.types';
import { getAllowedTabsForUser } from '../services/rbacSecurity';

export type SidebarTabId =
  | 'gestao'
  | 'inteligencia_vendas'
  | 'financeiro'
  | 'gerente_auditoria'
  | 'supervisor_dashboard'
  | 'cozinha_dashboard'
  | 'asg_dashboard'
  | 'calendario'
  | 'fila_espera'
  | 'operacao'
  | 'cardapio_cliente'
  | 'suprimentos'
  | 'bar'
  | 'camara'
  | 'auditoria'
  | 'equipe'
  | 'marketing'
  | 'email_ia'
  | 'copilot';

interface NavItem {
  id: SidebarTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  requiredPermission?: boolean;
}

interface AppSidebarProps {
  activeTab: SidebarTabId;
  onSelectTab: (tab: SidebarTabId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentShift: ShiftType;
  onToggleShift: () => void;
  currentOperator: OperatorProfile;
  currentUser?: UserAccount | null;
  onOpenPinModal: () => void;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
  canAccessAdmin?: boolean;
  restaurantName?: string;
  restaurantLocation?: string;
  permissions?: {
    canViewStaff?: boolean;
    canViewMarketing?: boolean;
    canViewCopilot?: boolean;
    canAccessAdmin?: boolean;
  } | null;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  currentShift,
  onToggleShift,
  currentOperator,
  currentUser,
  onOpenPinModal,
  onLogout,
  onOpenAdmin,
  canAccessAdmin,
  restaurantName = 'Engenho Manauara',
  restaurantLocation = 'Manauara Shopping',
  permissions,
}) => {
  const isShiftAlmoco = currentShift === 'MANHA_ALMOCO';

  // Obter a lista estrita de abas permitidas pelo Kernel RBAC
  const allowedTabs = React.useMemo(() => {
    return getAllowedTabsForUser(currentUser ?? null);
  }, [currentUser]);

  // Seções Completas com Mapeamento dos Novos Ambientes
  const allNavSections: { title: string; items: NavItem[] }[] = [
    {
      title: 'MEU AMBIENTE OPERACIONAL',
      items: [
        {
          id: 'supervisor_dashboard',
          label: 'Painel da Supervisora',
          icon: FileCheck2,
          badge: 'Gestão',
        },
        {
          id: 'gerente_auditoria',
          label: 'Auditoria do Gerente',
          icon: ShieldCheck,
          badge: 'Auditor',
        },
        {
          id: 'cozinha_dashboard',
          label: 'Painel da Cozinha',
          icon: UtensilsCrossed,
          badge: 'Chef',
        },
        {
          id: 'asg_dashboard',
          label: 'Limpeza & ASG',
          icon: ClipboardCheck,
          badge: 'Tarefas',
        },
      ],
    },
    {
      title: 'GESTÃO & RESULTADOS',
      items: [
        { id: 'gestao', label: 'Visão do Dono & DRE', icon: Crown },
        { id: 'inteligencia_vendas', label: 'Inteligência de Vendas', icon: BarChart3, badge: 'Teknisa' },
        { id: 'financeiro', label: 'Painel Financeiro', icon: TrendingUp },
        { id: 'calendario', label: 'Calendário & Prazos', icon: Calendar },
      ],
    },
    {
      title: 'OPERAÇÃO EM TEMPO REAL',
      items: [
        { id: 'fila_espera', label: 'Fila de Espera & Porta', icon: Timer, badge: '2min' },
        { id: 'operacao', label: 'Salão & Mesas', icon: UtensilsCrossed },
        { id: 'cardapio_cliente', label: 'Cardápio Digital (QR)', icon: QrCode, badge: 'Mesa' },
        { id: 'suprimentos', label: 'Estoque & CDA', icon: PackageCheck },
        { id: 'bar', label: 'Bar & Chopeiras', icon: Beer },
        { id: 'camara', label: 'Câmara Fria & Freezer', icon: Snowflake },
        { id: 'auditoria', label: 'Auditorias & POPs', icon: ClipboardCheck },
      ],
    },
    {
      title: 'PESSOAS & INTELIGÊNCIA',
      items: [
        {
          id: 'equipe',
          label: 'Equipe RH & Escala',
          icon: Users,
          requiredPermission: permissions?.canViewStaff ?? true,
        },
        {
          id: 'marketing',
          label: 'Mkt & Reels Virais',
          icon: Flame,
          requiredPermission: permissions?.canViewMarketing ?? true,
        },
        {
          id: 'email_ia',
          label: 'Resposta de E-mails IA',
          icon: Mail,
          badge: 'Novo',
          requiredPermission: permissions?.canViewCopilot ?? true,
        },
        {
          id: 'copilot',
          label: 'Assistente Copilot IA',
          icon: Sparkles,
          badge: 'Online',
          requiredPermission: permissions?.canViewCopilot ?? true,
        },
      ],
    },
  ];

  // FILTRAGEM RIGOROSA RBAC: Apenas itens permitidos entram no DOM
  const filteredNavSections = allNavSections
    .map((section) => ({
      title: section.title,
      items: section.items.filter((item) => {
        // Deve estar explicitamente na lista permitida do usuário
        if (!allowedTabs.includes(item.id)) return false;
        if (item.requiredPermission === false) return false;
        return true;
      }),
    }))
    .filter((section) => section.items.length > 0);

  const handleItemClick = (id: SidebarTabId) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a2e23] text-slate-100 select-none">
      {/* 1. TOPO: Identificação e Unidade */}
      <div className="p-4 border-b border-emerald-900/60 bg-[#062018]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black tracking-tight text-white leading-tight truncate">
                Tk Gestão & Tec
              </h1>
              <p className="text-[11px] font-bold text-amber-300 truncate">
                {restaurantName}
              </p>
            </div>
          </div>

          {/* Botão fechar (exclusivo mobile) */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/50"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Localização da Loja */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-emerald-300/80 bg-emerald-950/60 px-2.5 py-1.5 rounded-lg border border-emerald-900/40">
          <span className="truncate">{restaurantLocation}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse ml-1" />
        </div>
      </div>

      {/* 2. CONTROLE DE TURNO RÁPIDO */}
      <div className="p-3 border-b border-emerald-900/40 bg-emerald-950/30">
        <button
          onClick={onToggleShift}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-800/50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {isShiftAlmoco ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-blue-300 shrink-0" />
            )}
            <div>
              <p className="text-[10px] text-emerald-300/70 font-bold uppercase tracking-wider">
                Turno da Loja
              </p>
              <p className="text-xs font-black text-white">
                {isShiftAlmoco ? 'Almoço • 11h às 16h' : 'Jantar • 17h às 23h'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 shrink-0">
            Alternar
          </span>
        </button>
      </div>

      {/* 3. LISTA DE NAVEGAÇÃO VERTICAL (DINÂMICA POR CARGO) */}
      <nav aria-label="Menu Principal" className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {filteredNavSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-wider px-2 mb-1">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'text-slate-200 hover:text-white hover:bg-emerald-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-slate-950' : 'text-emerald-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ${
                        isActive
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 4. RODAPÉ: Operador Conectado & Ações */}
      <div className="p-3 border-t border-emerald-900/60 bg-[#062018] space-y-2">
        {/* Cartão do Operador */}
        <button
          onClick={onOpenPinModal}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-900/50 transition-colors text-left cursor-pointer"
          title="Clique para alternar operador por PIN"
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${currentOperator.badgeColor}`}
          >
            {currentOperator.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate">
              {currentOperator.name}
            </p>
            <p className="text-[10px] text-emerald-300/80 truncate">
              {USER_ROLE_LABELS[currentOperator.role as keyof typeof USER_ROLE_LABELS] || currentOperator.role}
              {currentUser?.matricula && (
                <span className="text-amber-300 ml-1">({currentUser.matricula})</span>
              )}
            </p>
          </div>
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        </button>

        {/* Botões Utilitários */}
        <div className="flex items-center gap-1.5 pt-1">
          {canAccessAdmin && onOpenAdmin && (
            <button
              onClick={() => {
                onOpenAdmin();
                onCloseMobile();
              }}
              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-900/40 hover:bg-emerald-900 text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1 border border-emerald-800/40 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Painel Master</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                onCloseMobile();
              }}
              className="py-1.5 px-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-[11px] font-bold text-rose-300 flex items-center justify-center gap-1 border border-rose-900/40 transition-colors shrink-0 cursor-pointer"
              title="Sair do Sistema"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP: Sidebar Fixa Lateral (md:flex) ────────── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col h-screen sticky top-0 border-r border-emerald-900/60 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* ── MOBILE: Off-canvas Drawer com Backdrop (md:hidden) ── */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop blur escuro */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={onCloseMobile}
          />
          {/* Gaveta lateral que desliza suavemente */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slide-right flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
