import React, { useState } from 'react';
import { ShieldCheck, Star, TrendingUp, DollarSign, ChevronRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { ManagerBonus } from '../types';

interface BonusCockpitProps {
  bonus: ManagerBonus;
  onNavigateToTab: (tab: string) => void;
}

export const BonusCockpit: React.FC<BonusCockpitProps> = ({ bonus, onNavigateToTab }) => {
  const [expanded, setExpanded] = useState(false);

  const totalProgress = (bonus.totalBonus / bonus.maxTotalBonus) * 100;

  return (
    <div className="bg-gradient-to-br from-[#164e3b] via-[#0f392b] to-[#07241b] rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-emerald-600/30">
      {/* Topo do Card de Bônus */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-700/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#d97706]/30 text-[#f59e0b] border border-[#d97706]/40">
              <DollarSign className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#fdfbf7] tracking-wide">
              COCKPIT DE BONIFICAÇÃO MENSAL
            </h2>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 capitalize">
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <p className="text-xs text-emerald-200/80 mt-1">
            Acompanhamento em tempo real para garantir seus <strong className="text-amber-300">R$ 2.000,00</strong> de variável no mês.
          </p>
        </div>

        {/* Resumo Financeiro */}
        <div className="flex items-baseline gap-2 bg-emerald-950/60 px-3.5 py-2 rounded-xl border border-emerald-700/50">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/80 block">
              Projetado no Bolso
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-amber-400">
                R$ {bonus.totalBonus.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-emerald-200/70 font-medium">/ R$ {bonus.maxTotalBonus.toFixed(2)}</span>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            {totalProgress.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Barra de Progresso Geral */}
      <div className="mt-3">
        <div className="w-full bg-emerald-950/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-emerald-800/60">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(totalProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Grid com os 3 Pilares */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {/* Pilar 1: Segurança de Alimentos */}
        <div
          onClick={() => onNavigateToTab('checklists')}
          className="bg-emerald-950/40 hover:bg-emerald-950/70 cursor-pointer transition-all border border-emerald-700/40 rounded-xl p-3.5 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Segurança Alimentos (35%)</span>
              </div>
              <span className="text-xs font-black text-amber-400">R$ {bonus.foodSafety.achievedBonus.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-200/90">
              <span>Conformidade:</span>
              <strong className="text-white">{bonus.foodSafety.complianceRate}% (Meta &ge; 95%)</strong>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Aferição Manhã: Conforme (-19.8°C)</span>
            </div>
            {!bonus.foodSafety.eveningAuditDone && (
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-amber-300 font-semibold">
                <AlertCircle className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Pendente aferição vespertina (17h00)</span>
              </div>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-300 group-hover:text-amber-300">
            <span>Ver Checklists ANVISA</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pilar 2: NPS & Avaliações */}
        <div
          onClick={() => onNavigateToTab('marketing')}
          className="bg-emerald-950/40 hover:bg-emerald-950/70 cursor-pointer transition-all border border-emerald-700/40 rounded-xl p-3.5 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-white">NPS / Google (25%)</span>
              </div>
              <span className="text-xs font-black text-amber-400">R$ {bonus.nps.achievedBonus.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-200/90">
              <span>Nota Média:</span>
              <strong className="text-white">{bonus.nps.averageRating} ★ (Meta &ge; 4.6)</strong>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-300">
              <span>Taxa de Resposta &lt; 24h:</span>
              <strong className="text-emerald-400">{bonus.nps.responseRate}%</strong>
            </div>
            {bonus.nps.pendingReviewsCount > 0 && (
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-amber-300 font-semibold">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>1 review recente aguardando aprovação IA</span>
              </div>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-300 group-hover:text-amber-300">
            <span>Responder com IA</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pilar 3: Meta de Vendas */}
        <div
          onClick={() => onNavigateToTab('dashboard')}
          className="bg-emerald-950/40 hover:bg-emerald-950/70 cursor-pointer transition-all border border-emerald-700/40 rounded-xl p-3.5 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Vendas Mês (40%)</span>
              </div>
              <span className="text-xs font-black text-amber-400">R$ {bonus.sales.achievedBonus.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-200/90">
              <span>Faturado:</span>
              <strong className="text-white">
                R$ {(bonus.sales.currentRevenue / 1000).toFixed(1)}k / R$ {(bonus.sales.monthlyTarget / 1000).toFixed(0)}k
              </strong>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-300">
              <span>Projeção Fechamento:</span>
              <strong className="text-emerald-400">R$ {(bonus.sales.projectedRevenue / 1000).toFixed(1)}k (+3%)</strong>
            </div>
            <div className="mt-1 text-[10px] text-emerald-200/70">
              Faltam R$ {((bonus.sales.monthlyTarget - bonus.sales.currentRevenue) / 1000).toFixed(1)}k em {bonus.sales.daysRemaining} dias
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-300 group-hover:text-amber-300">
            <span>Ver Ritmo do Turno</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
