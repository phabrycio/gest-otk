// ============================================================
// TOP BAR CORPORATIVO LIMPO & RESPONSIVO
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Menu,
  Sun,
  Moon,
  ShieldCheck,
  MapPin,
  Lock,
  FileText,
  BookOpen,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { ShiftType } from '../types';
import { OperatorProfile } from './QuickPinModal';
import { getSystemFeedStatus, SystemFeedStatus } from '../services/dataFreshnessStore';
import { TeknisaFeedModal } from './teknisa/TeknisaFeedModal';
import { SidebarTabId } from './AppSidebar';

const TAB_TITLES: Record<SidebarTabId, { title: string; subtitle: string }> = {
  gestao: { title: 'Visão do Dono & DRE', subtitle: 'Demonstrativo de Resultado e Governança' },
  inteligencia_vendas: { title: 'Inteligência de Vendas, Degelo & Estoque', subtitle: 'Teknisa POS • Cotas de Degelo, Prevenção de Ruptura e Compras' },
  financeiro: { title: 'Painel Financeiro', subtitle: 'Fluxo de Caixa, Contas a Pagar e Recebimentos' },
  calendario: { title: 'Calendário & Prazos do Gerente', subtitle: 'Prazos de ANVISA, Laudos, Fiscal e Obrigações da Loja' },
  operacao: { title: 'Salão & Mesas', subtitle: 'Operação de Salão, Checklists e Degelo' },
  cardapio_cliente: { title: 'Cardápio Digital do Cliente', subtitle: 'Menu Virtual Multilíngue (PT, EN, ES) com Comanda do Atendente' },
  suprimentos: { title: 'Estoque Virtual & CDA', subtitle: 'Controle de Insumos, Pedidos e Cobertura' },
  bar: { title: 'Bar & Chopeiras', subtitle: 'Torneiras de Chopp e Auditoria de Garrafas' },
  camara: { title: 'Câmara Fria & Freezer', subtitle: 'Aferições ANVISA e Rastreabilidade CDA' },
  auditoria: { title: 'Auditorias & POPs', subtitle: 'Procedimentos Operacionais Padrão e Qualidade' },
  equipe: { title: 'Equipe & Escala RH', subtitle: 'Quadro de Colaboradores e Turnos' },
  marketing: { title: 'Marketing & Reels', subtitle: 'Reputação Online e Conteúdos Promocionais' },
  email_ia: { title: 'Central de Resposta de E-mails IA', subtitle: 'Redação Inteligente de Respostas Fundamentada nos Dados da Loja' },
  copilot: { title: 'Copilot IA Gemini', subtitle: 'Assistente Operacional e Técnico' },
  fila_espera: { title: 'Fila de Espera & Recepção', subtitle: 'Chamada com Regra dos 2 Minutos e Alocação por Capacidade de Mesas' },
  supervisor_dashboard: { title: 'Painel da Supervisora', subtitle: 'Operação Administrativa, Escalas, Ponto, Checklists e Compras' },
  gerente_auditoria: { title: 'Auditoria do Gerente', subtitle: 'Auditoria Operacional de Inventários, Compras e Indicadores' },
  cozinha_dashboard: { title: 'Ambiente da Cozinha', subtitle: 'Estoque da Cozinha, Câmara Fria, PEPS e Produção' },
  asg_dashboard: { title: 'Ambiente de Limpeza & ASG', subtitle: 'Checklists de Higienização, Cronograma e Ponto Eletrônico' },
};

interface AppTopBarProps {
  activeTab: SidebarTabId;
  onOpenMobileMenu: () => void;
  currentShift: ShiftType;
  onToggleShift: () => void;
  currentOperator: OperatorProfile;
  onOpenPinModal: () => void;
  onOpenAnvisa: () => void;
  onOpenAbout: () => void;
  onOpenOnboarding: () => void;
  onOpenCustomerMenu?: () => void;
  restaurantLocation?: string;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  activeTab,
  onOpenMobileMenu,
  currentShift,
  onToggleShift,
  currentOperator,
  onOpenPinModal,
  onOpenAnvisa,
  onOpenAbout,
  onOpenOnboarding,
  onOpenCustomerMenu,
  restaurantLocation = 'Manauara Shopping',
}) => {
  const [feedStatus, setFeedStatus] = useState<SystemFeedStatus>(() => getSystemFeedStatus());
  const [showTeknisaModal, setShowTeknisaModal] = useState(false);

  useEffect(() => {
    const handleFeedUpdate = (e: any) => {
      if (e.detail) setFeedStatus(e.detail);
      else setFeedStatus(getSystemFeedStatus());
    };
    window.addEventListener('tk_feed_status_updated', handleFeedUpdate);
    return () => window.removeEventListener('tk_feed_status_updated', handleFeedUpdate);
  }, []);

  const tabInfo = TAB_TITLES[activeTab] || { title: 'Tk Gestão', subtitle: 'Engenho Manauara' };
  const isAlmoco = currentShift === 'MANHA_ALMOCO';

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs shrink-0 select-none">
      <div className="px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
        {/* LADO ESQUERDO: Botão de Menu (Mobile) + Título da Seção */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Botão Hamburger (Mobile) */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl bg-[#0a2e23] text-amber-400 hover:bg-[#124b3a] transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
            aria-label="Abrir menu lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight truncate">
                {tabInfo.title}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <MapPin className="w-2.5 h-2.5 text-emerald-700" />
                {restaurantLocation}
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 font-medium truncate mt-0.5">
              {tabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* LADO DIREITO: Ações Rápidas & Status - Limpo e Responsivo */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Status Teknisa - Compacto e Elegante */}
          <button
            onClick={() => setShowTeknisaModal(true)}
            className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200/80 transition-colors shadow-2xs cursor-pointer"
            title="Status de Carga Teknisa (Clique para detalhes/importação)"
            aria-label="Status Teknisa"
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                feedStatus.totalSalesRows === 0 ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
              }`}
            />
            <span className="hidden xl:inline text-[11px] text-slate-500">Teknisa:</span>
            <span className="hidden sm:inline text-[11px] font-bold text-slate-800">
              {feedStatus.totalSalesRows === 0 ? 'Aguardando' : 'Ativo'}
            </span>
          </button>

          {/* Dossiê ANVISA (Desktop/Tablet) */}
          <button
            onClick={onOpenAnvisa}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200/80 transition-colors cursor-pointer"
            title="Dossiê de Boas Práticas Sanitárias ANVISA"
            aria-label="Dossiê ANVISA"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] hidden lg:inline">ANVISA</span>
          </button>

          {/* Cardápio Digital do Cliente (Mesa / QR Code) */}
          {onOpenCustomerMenu && (
            <button
              onClick={onOpenCustomerMenu}
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs bg-[#0a2e23] hover:bg-[#124b3a] text-amber-300 font-bold border border-emerald-700/60 transition-all shadow-xs cursor-pointer active:scale-95"
              title="Abrir Cardápio Digital do Cliente (Mesa / QR Code)"
              aria-label="Cardápio Digital do Cliente"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] hidden sm:inline">Menu Cliente</span>
            </button>
          )}

          {/* Alternador de Turno */}
          <button
            onClick={onToggleShift}
            className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold transition-all cursor-pointer active:scale-95"
            title="Alternar entre Turno de Almoço e Jantar"
            aria-label="Alternar Turno da Loja"
          >
            {isAlmoco ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] hidden sm:inline">Almoço</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] hidden sm:inline">Jantar</span>
              </>
            )}
          </button>

          {/* Operador Conectado (PIN) */}
          <button
            onClick={onOpenPinModal}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors cursor-pointer"
            title="Trocar operador por PIN"
            aria-label="Trocar Operador"
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${currentOperator.badgeColor}`}
            >
              {currentOperator.name.charAt(0)}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-800 truncate max-w-[70px]">
              {currentOperator.name}
            </span>
            <Lock className="w-3 h-3 text-slate-400 hidden sm:inline" />
          </button>
        </div>
      </div>

      {/* Modal de Importação Teknisa */}
      <TeknisaFeedModal
        isOpen={showTeknisaModal}
        onClose={() => setShowTeknisaModal(false)}
        currentUserName={currentOperator.name}
      />
    </header>
  );
};
