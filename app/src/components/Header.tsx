import React, { useState, useRef, useEffect } from 'react';
import {
  Clock,
  ShieldCheck,
  Sun,
  Moon,
  MapPin,
  Lock,
  User,
  BookOpen,
  Building2,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  LogOut,
  Settings,
  FileSpreadsheet,
  FileText,
  ThermometerSnowflake,
  Users,
  Crown,
  UtensilsCrossed,
  PackageCheck,
  Flame,
} from 'lucide-react';
import { ShiftType } from '../types';
import { OperatorProfile } from './QuickPinModal';
import { getSystemFeedStatus, SystemFeedStatus } from '../services/dataFreshnessStore';
import { TeknisaFeedModal } from './teknisa/TeknisaFeedModal';

interface HeaderProps {
  currentShift: ShiftType;
  onToggleShift: () => void;
  onOpenOnboarding: () => void;
  onOpenAbout: () => void;
  onOpenAnvisa: () => void;
  onOpenPinModal: () => void;
  onOpenRecipes?: () => void;
  onOpenReceipts?: () => void;
  onOpenChamberReport?: () => void;
  onOpenCollaboratorLog?: () => void;
  onOpenAdmin?: () => void;
  canAccessAdmin?: boolean;
  onLogout?: () => void;
  currentOperator: OperatorProfile;
  restaurantLocation?: string;
  activeTab?: string;
  onSelectTab?: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentShift,
  onToggleShift,
  onOpenOnboarding,
  onOpenAbout,
  onOpenAnvisa,
  onOpenPinModal,
  onOpenRecipes,
  onOpenReceipts,
  onOpenChamberReport,
  onOpenCollaboratorLog,
  onOpenAdmin,
  canAccessAdmin,
  onLogout,
  currentOperator,
  restaurantLocation = 'Manauara Shopping',
  activeTab,
  onSelectTab,
}) => {
  const [showExecutiveMenu, setShowExecutiveMenu] = useState(false);
  const [showTeknisaModal, setShowTeknisaModal] = useState(false);
  const [feedStatus, setFeedStatus] = useState<SystemFeedStatus>(() => getSystemFeedStatus());
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora e escuta atualizações de carga diária
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExecutiveMenu(false);
      }
    };

    const handleFeedUpdate = (e: any) => {
      if (e.detail) setFeedStatus(e.detail);
      else setFeedStatus(getSystemFeedStatus());
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('tk_feed_status_updated', handleFeedUpdate);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('tk_feed_status_updated', handleFeedUpdate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2.5">
        <div className="flex items-center justify-between">
          {/* Marca Institucional do Restaurante */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-xs font-sans font-black text-sm text-white border border-amber-500/40 shrink-0">
              TK
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-sans font-bold text-xs sm:text-sm tracking-tight text-white">
                  Tk Gestão e Tecnologia
                </h1>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{restaurantLocation}</span>
              </div>
            </div>
          </div>

          {/* Controles de Topo & Ações Rápidas */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Badge Informativo da Base Teknisa (D-1 Diário) */}
            <button
              onClick={() => setShowTeknisaModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700/80 text-slate-200 transition-colors border border-slate-700 shadow-xs cursor-pointer active:scale-95"
              title={
                feedStatus.totalSalesRows === 0
                  ? 'Base Teknisa: Aguardando primeira carga de fechamento de vendas. Clique para importar.'
                  : `Base Teknisa D-1: Atualizado em ${feedStatus.formattedDate} às ${feedStatus.formattedTime} por ${feedStatus.updatedBy} (${feedStatus.periodCompetence}). Clique para ver detalhes ou carregar novos arquivos Excel.`
              }
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  feedStatus.totalSalesRows === 0 ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span className="text-slate-400 text-[11px] hidden lg:inline">Base Teknisa:</span>
              <span className="font-bold text-white text-[11px]">
                {feedStatus.totalSalesRows === 0
                  ? 'Aguardando Carga'
                  : `${feedStatus.formattedDate} ${feedStatus.formattedTime}`}
              </span>
              {feedStatus.totalSalesRows > 0 && (
                <span className="text-amber-400 text-[10px] hidden md:inline">
                  &bull; {feedStatus.updatedBy}
                </span>
              )}
            </button>

            {/* Dropdown Corporativo / Executivo */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowExecutiveMenu(!showExecutiveMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700/80 text-slate-200 transition-colors border border-slate-700 shadow-xs cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Tk Gestão</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showExecutiveMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 overflow-hidden z-50 animate-fade-in">
                  <div className="p-3 bg-slate-900 text-white border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Tk Gestão e Tecnologia</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Cockpit de Governança & Operação</p>
                  </div>

                  <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowExecutiveMenu(false);
                      setShowTeknisaModal(true);
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-100 flex items-center gap-2.5 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900 shrink-0">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    </span>
                    <div>
                      <span className="block font-bold">Carga Diária Teknisa (Excel D-1)</span>
                      <span className="text-[10px] text-slate-500 font-normal">Vendas, cancelamentos e baixas</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowExecutiveMenu(false);
                      if (onOpenReceipts) onOpenReceipts();
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-100 flex items-center gap-2.5 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900 shrink-0">
                      <FileText className="w-4 h-4 text-amber-700" />
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="block font-bold">Notas & Recibos (3 Meses)</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-700 border border-amber-500/30">
                          Cloud + PC
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal">Retenção de 90 dias & backup local</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowExecutiveMenu(false);
                      if (onOpenChamberReport) onOpenChamberReport();
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-100 flex items-center gap-2.5 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <span className="p-1.5 rounded-lg bg-blue-100 text-blue-900 shrink-0">
                      <ThermometerSnowflake className="w-4 h-4 text-blue-700" />
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="block font-bold">Câmara Fria (Fotos & Vistos)</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-800 border border-blue-500/30">
                          Mural A4
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal">Supervisora + Gerente + Relatório Semanal</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowExecutiveMenu(false);
                      if (onOpenCollaboratorLog) onOpenCollaboratorLog();
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-100 flex items-center gap-2.5 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900 shrink-0">
                      <Users className="w-4 h-4 text-amber-700" />
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="block font-bold">Log de Colaboradores</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-800 border border-amber-500/30">
                          Gerente & Donos
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal">Quem alimentou o sistema, data e hora</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowExecutiveMenu(false);
                      onOpenOnboarding();
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-100 flex items-center gap-2.5 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="block font-bold">Guia do Gerente</span>
                      <span className="text-[10px] text-slate-500 font-normal">Rotina hora a hora & dossiê</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowExecutiveMenu(false);
                      if (onOpenRecipes) onOpenRecipes();
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-100 flex items-center gap-2.5 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900 shrink-0">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                    </span>
                    <div>
                      <span className="block font-bold">Cardápio & Fichas Técnicas</span>
                      <span className="text-[10px] text-slate-500 font-normal">18 pratos homologados & insumos</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowExecutiveMenu(false);
                      onOpenAbout();
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-100 flex items-center gap-2.5 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="block font-bold">Sobre (Pitch Diretoria)</span>
                      <span className="text-[10px] text-slate-500 font-normal">Apresentação ROI para sócios</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowExecutiveMenu(false);
                      onOpenAnvisa();
                    }}
                    className="w-full p-2 rounded-xl text-left hover:bg-slate-100 flex items-center gap-2.5 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <span className="p-1.5 rounded-lg bg-teal-100 text-teal-900 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="block font-bold">Dossiê Sanitário ANVISA</span>
                      <span className="text-[10px] text-slate-500 font-normal">Laudo 90 dias timbrado</span>
                    </div>
                  </button>

                  {canAccessAdmin && onOpenAdmin && (
                    <button
                      onClick={() => {
                        setShowExecutiveMenu(false);
                        onOpenAdmin();
                      }}
                      className="w-full p-2 rounded-xl text-left hover:bg-amber-50 flex items-center gap-2.5 transition-colors text-xs font-semibold text-slate-800 cursor-pointer border-t border-slate-100 mt-1 pt-2"
                    >
                      <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900 shrink-0">
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                      </span>
                      <div>
                        <span className="block font-bold text-amber-950">Painel Master & Auditoria</span>
                        <span className="text-[10px] text-slate-500 font-normal">Lojas, usuários e logs completos</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Acesso Direto Master & Auditoria (Exclusivo Pabricio) */}
          {canAccessAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-all border border-amber-500/30 shadow-xs cursor-pointer active:scale-95"
              title="Acesso Master: Lojas, Usuários e Trilha de Auditoria (Exclusivo Pabricio)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Auditoria Master</span>
            </button>
          )}

          {/* Alternador Rápido de Operador por PIN (Padrão Kiosk Toast) */}
          <button
            onClick={onOpenPinModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700 shadow-xs active:scale-95 cursor-pointer"
            title="Clique para Bloquear ou Alternar Operador com PIN"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline max-w-[130px] truncate">{currentOperator.name}</span>
            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* Alternador de Turno (Almoço / Jantar) */}
          <button
            onClick={onToggleShift}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
              currentShift === 'MANHA_ALMOCO'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-indigo-500/15 text-indigo-200 border border-indigo-500/30 hover:bg-indigo-500/25'
            }`}
            title="Alternar entre Turno de Almoço e Jantar"
          >
            {currentShift === 'MANHA_ALMOCO' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Almoço</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
                <span className="hidden md:inline">Jantar</span>
              </>
            )}
          </button>

          {/* Botão de Logout / Sair */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-rose-500/20 hover:border-rose-500/40 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Sair do Sistema (Fazer Logout)"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xl:inline text-[11px]">Sair</span>
            </button>
          )}
        </div>
      </div>

      {/* Tier 2: Navegação Primária Desktop (Padrão Enterprise SaaS Toast / Restaurant365) */}
      {onSelectTab && (
        <div className="hidden md:flex items-center gap-1 border-t border-slate-800/80 pt-2 pb-1 mt-1">
          {[
            { id: 'gestao', label: 'Dono & DRE', icon: Crown },
            { id: 'operacao', label: 'Salão & Mesas', icon: UtensilsCrossed },
            { id: 'suprimentos', label: 'Estoque & CDA', icon: PackageCheck },
            { id: 'marketing', label: 'Mkt & Reels', icon: Flame },
            { id: 'equipe', label: 'Equipe RH', icon: Users },
            { id: 'copilot', label: 'Assistente IA', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>

      {/* Modal de Alimentação Diária Teknisa */}
      <TeknisaFeedModal
        isOpen={showTeknisaModal}
        onClose={() => setShowTeknisaModal(false)}
        currentUserName={currentOperator.name}
      />
    </header>
  );
};
