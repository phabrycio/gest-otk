// ============================================================
// COMPONENTE: ALERTA CRÍTICO DO GERENTE - EXPURGO DE NOTAS (4º MÊS)
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Download, HardDrive, CheckCircle2, ChevronRight, ShieldAlert, Sparkles } from 'lucide-react';
import { getPending4thMonthAlert } from '../../services/receiptArchiveStore';
import type { ReceiptMonthSummary } from '../../types/receiptArchive.types';

interface ManagerReceiptAlertBannerProps {
  onOpenArchiveModal: (targetMonthBucket?: string) => void;
  currentRole?: string;
}

export const ManagerReceiptAlertBanner: React.FC<ManagerReceiptAlertBannerProps> = ({
  onOpenArchiveModal,
  currentRole,
}) => {
  const [pendingMonth, setPendingMonth] = useState<ReceiptMonthSummary | null>(null);

  const checkAlert = () => {
    const alert = getPending4thMonthAlert();
    setPendingMonth(alert);
  };

  useEffect(() => {
    checkAlert();
    const handleUpdate = () => checkAlert();
    window.addEventListener('receipts-updated', handleUpdate);
    return () => window.removeEventListener('receipts-updated', handleUpdate);
  }, []);

  if (!pendingMonth) {
    return null;
  }

  const formattedAmount = pendingMonth.totalAmount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-900/90 via-amber-800/80 to-orange-950/90 border-2 border-amber-500/60 p-4 md:p-5 shadow-2xl backdrop-blur-md text-amber-50 mb-6 animate-pulse-slow">
      {/* Glow e Detalhe de Fundo */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-600/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Ícone e Texto Informativo */}
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-400/40 shrink-0 shadow-inner">
            <AlertTriangle className="w-7 h-7 text-amber-300 animate-bounce" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5" />
                Aviso do Gerente • Retenção de 90 Dias
              </span>
              <span className="text-xs text-amber-200/90 font-mono font-medium">
                Supabase Storage • Limite de 3 Meses Atingido
              </span>
            </div>

            <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
              O 4º Mês ({pendingMonth.monthLabel}) venceu e precisa de Download Local
            </h3>

            <p className="text-xs md:text-sm text-amber-100/90 mt-1 max-w-3xl leading-relaxed">
              Para manter o sistema ágil e evitar cobranças de imagens no Supabase, baixe o lote das{' '}
              <strong className="text-amber-200 font-semibold">{pendingMonth.totalReceipts} notas fiscais</strong>{' '}
              ({formattedAmount} • ~{pendingMonth.totalSizeMb} MB) em seu computador local para liberar espaço no banco online para o próximo mês.
            </p>
          </div>
        </div>

        {/* Botão de Ação Imediata */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
          <button
            onClick={() => onOpenArchiveModal(pendingMonth.monthBucket)}
            className="w-full lg:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg hover:shadow-amber-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Notas (.ZIP) e Liberar Nuvem</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
