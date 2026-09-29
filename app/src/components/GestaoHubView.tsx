import React, { useState, useEffect } from 'react';
import { Crown, TrendingUp, ClipboardCheck, BarChart3, FileText, Users } from 'lucide-react';
import { OwnerVisionView } from './OwnerVisionView';
import { DashboardView } from './DashboardView';
import { BonusCockpit } from './BonusCockpit';
import AuditoriaProcessosView from './audit/AuditoriaProcessosView';
import { CollaboratorAuditFeedView } from './audit/CollaboratorAuditFeedView';
import { ExecutiveReportsDashboard } from './reports/ExecutiveReportsDashboard';
import { ShiftType, InventoryItem, Employee, ManagerBonus } from '../types';
import { ManagerReceiptAlertBanner } from './receipts/ManagerReceiptAlertBanner';
import { ReceiptArchiveManagerModal } from './receipts/ReceiptArchiveManagerModal';
import { WeeklySalesPredictionView } from './WeeklySalesPredictionView';
import { ConsumerFinanceDashboardView } from './finance/ConsumerFinanceDashboardView';

interface GestaoHubViewProps {
  currentShift: ShiftType;
  inventory: InventoryItem[];
  staff: Employee[];
  bonus: ManagerBonus;
  restaurantName?: string;
  initialSubView?: 'DONO_DRE' | 'PAINEL_FINANCEIRO_CONSUMER' | 'PREVISAO_12_SEMANAS' | 'RELATORIOS_DASHBOARD' | 'METAS_BONUS' | 'AUDITORIAS' | 'LOG_COLABORADORES';
  onNavigateToTab: (tab: any) => void;
  onOpenCopilot: (prompt?: string) => void;
}

export const GestaoHubView: React.FC<GestaoHubViewProps> = ({
  currentShift,
  inventory,
  staff,
  bonus,
  restaurantName = 'Engenho Manauara',
  initialSubView = 'DONO_DRE',
  onNavigateToTab,
  onOpenCopilot,
}) => {
  const [subView, setSubView] = useState<'DONO_DRE' | 'PAINEL_FINANCEIRO_CONSUMER' | 'PREVISAO_12_SEMANAS' | 'RELATORIOS_DASHBOARD' | 'METAS_BONUS' | 'AUDITORIAS' | 'LOG_COLABORADORES'>(initialSubView);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [targetReceiptMonth, setTargetReceiptMonth] = useState<string | undefined>();

  useEffect(() => {
    if (initialSubView) {
      setSubView(initialSubView);
    }
  }, [initialSubView]);

  // Escuta evento global para abrir arquivo fiscal
  useEffect(() => {
    const handleGlobalOpen = (e: any) => {
      if (e.detail?.monthBucket) {
        setTargetReceiptMonth(e.detail.monthBucket);
      }
      setShowReceiptModal(true);
    };
    window.addEventListener('open-receipt-archive', handleGlobalOpen);
    return () => window.removeEventListener('open-receipt-archive', handleGlobalOpen);
  }, []);

  return (
    <div className="space-y-4">
      {/* Alerta Crítico do Gerente: 4º Mês Vencido para Download e Expurgo Cloud */}
      <ManagerReceiptAlertBanner
        onOpenArchiveModal={(bucket) => {
          setTargetReceiptMonth(bucket);
          setShowReceiptModal(true);
        }}
      />

      {/* Seletor Segmentado Corporativo */}
      <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center justify-center max-w-4xl mx-auto overflow-x-auto gap-1 shadow-xs">
        <button
          onClick={() => setSubView('DONO_DRE')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'DONO_DRE'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-500" />
          <span>Visão de Dono & DRE</span>
        </button>

        <button
          onClick={() => setSubView('PAINEL_FINANCEIRO_CONSUMER')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'PAINEL_FINANCEIRO_CONSUMER'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
          title="Painel Financeiro Completo no padrão oficial Programa Consumer & Consumer Connect"
        >
          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          <span>Painel Financeiro (Consumer)</span>
        </button>

        <button
          onClick={() => setSubView('PREVISAO_12_SEMANAS')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'PREVISAO_12_SEMANAS'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
          title="Análise de vendas de 12 semanas, mediana de degelo (+20%) e pedidos ao CDA"
        >
          <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Planejamento 12 Semanas & Degelo</span>
        </button>

        <button
          onClick={() => setSubView('LOG_COLABORADORES')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'LOG_COLABORADORES'
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
          title="Registro de cada colaborador que atualizou o sistema com data, hora e setor"
        >
          <Users className="w-3.5 h-3.5 text-slate-700" />
          <span>Log Colaboradores</span>
        </button>

        <button
          onClick={() => setSubView('RELATORIOS_DASHBOARD')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'RELATORIOS_DASHBOARD'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-slate-700" />
          <span>Relatórios & Metas</span>
        </button>

        <button
          onClick={() => setSubView('METAS_BONUS')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'METAS_BONUS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Metas & Bônus</span>
        </button>

        <button
          onClick={() => setSubView('AUDITORIAS')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            subView === 'AUDITORIAS'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5 text-slate-700" />
          <span>Auditorias & Processos</span>
        </button>

        <button
          onClick={() => setShowReceiptModal(true)}
          className="flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
          title="Gestão de todas as notas fiscais, cupons e recibos dos últimos 3 meses com download local do 4º mês"
        >
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>Notas & Recibos</span>
        </button>
      </div>

      {subView === 'DONO_DRE' ? (
        <OwnerVisionView />
      ) : subView === 'PAINEL_FINANCEIRO_CONSUMER' ? (
        <ConsumerFinanceDashboardView onOpenCopilot={onOpenCopilot} />
      ) : subView === 'PREVISAO_12_SEMANAS' ? (
        <WeeklySalesPredictionView onOpenCopilot={onOpenCopilot} />
      ) : subView === 'LOG_COLABORADORES' ? (
        <CollaboratorAuditFeedView currentUserName="Ivan / Pabricio (Gerência Geral)" />
      ) : subView === 'RELATORIOS_DASHBOARD' ? (
        <ExecutiveReportsDashboard
          onOpenCopilot={onOpenCopilot}
          restaurantName={restaurantName}
        />
      ) : subView === 'METAS_BONUS' ? (
        <div className="space-y-4">
          <BonusCockpit bonus={bonus} onNavigateToTab={onNavigateToTab} />
          <DashboardView
            currentShift={currentShift}
            inventory={inventory}
            staff={staff}
            onNavigateToTab={onNavigateToTab}
            onOpenCopilot={onOpenCopilot}
          />
        </div>
      ) : (
        <AuditoriaProcessosView />
      )}

      {/* Modal de Gestão Fiscal & Arquivo Morto de 3 Meses */}
      <ReceiptArchiveManagerModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        currentUserName="Ivan / Pabricio (Gerência Geral)"
        initialMonthBucket={targetReceiptMonth}
      />
    </div>
  );
};
