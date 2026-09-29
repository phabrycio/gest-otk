import React from 'react';
import { TrendingUp, AlertTriangle, CloudRain, Users, Sparkles, CheckCircle2, ChevronRight, Package, Truck, FileText, ArrowUpRight } from 'lucide-react';
import { ShiftType, InventoryItem, Employee } from '../types';

interface DashboardViewProps {
  currentShift: ShiftType;
  inventory: InventoryItem[];
  staff: Employee[];
  onNavigateToTab: (tab: string) => void;
  onOpenCopilot: (prompt?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentShift,
  inventory,
  staff,
  onNavigateToTab,
  onOpenCopilot,
}) => {
  const criticalItems = inventory.filter((item) => item.status === 'CRITICAL');
  const staffPresent = staff.filter((s) => s.status === 'PRESENTE' && s.shift === currentShift).length;

  const isLunch = currentShift === 'MANHA_ALMOCO';
  const shiftRevenue = 0.00;
  const shiftTarget = isLunch ? 18000.00 : 16000.00;
  const shiftProgress = shiftTarget > 0 ? (shiftRevenue / shiftTarget) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Banner de Início de Operação (Dia 1) */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-700/80 text-emerald-200 font-bold text-[10px] tracking-wider uppercase border border-emerald-600">
              Operação Inicial
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Engenho Manauara &bull; Operação Iniciada Hoje
            </h2>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
            Tudo pronto para o turno de abertura: confira os checklists matinais de salão e cozinha, registre a presença da brigada e inicie o atendimento com foco nas metas do turno.
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab('checklists')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer whitespace-nowrap"
        >
          Iniciar Checklists
        </button>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Faturamento do Turno */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Faturado ({isLunch ? 'Almoço' : 'Jantar'})</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-bold text-slate-900 block">
              R$ {shiftRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(shiftProgress, 100)}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-emerald-700">{shiftProgress.toFixed(0)}%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Meta: R$ {shiftTarget.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        {/* Alerta de Estoque Crítico */}
        <div
          onClick={() => onNavigateToTab('inventory')}
          className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-sm flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-amber-700 text-xs">
            <span>Risco de Ruptura</span>
            <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-bold text-amber-900 block">
              {criticalItems.length} Itens Curva A
            </span>
            <p className="text-[11px] text-amber-700/90 mt-1 font-medium truncate">
              {criticalItems.map((i) => i.name.split(' ')[0]).join(', ')}
            </p>
            <span className="text-[10px] text-amber-600 flex items-center gap-0.5 mt-1 group-hover:translate-x-0.5 transition-transform">
              Auditar agora <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Brigada no Turno */}
        <div
          onClick={() => onNavigateToTab('staff')}
          className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between cursor-pointer hover:border-slate-400 transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Equipe em Piso</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-bold text-slate-900 block">
              {staffPresent} Presentes
            </span>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              100% Escala Completa
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">Salão, Cozinha & Bar</span>
          </div>
        </div>

        {/* Previsão Meteorológica Manaus / Fluxo Shopping */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-50/70 p-3.5 rounded-xl border border-sky-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-800 text-xs font-semibold">
            <span>Manaus &bull; Ponta Negra</span>
            <CloudRain className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2">
            <span className="text-base sm:text-lg font-bold text-sky-950 block">
              Pancadas à Tarde
            </span>
            <p className="text-[11px] text-sky-700 mt-1">
              <strong>+18% de fluxo</strong> projetado no Shopping Ponta Negra hoje.
            </p>
            <span className="text-[10px] text-sky-600 font-medium mt-1 block">Aumentar mise en place</span>
          </div>
        </div>
      </div>

      {/* Card de Briefing Operacional Inteligente do Dia */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] tracking-wider uppercase">
              Roteiro de Briefing
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Briefing de 5 Minutos: Turno de {isLunch ? 'Almoço' : 'Jantar'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Meta do Turno:</strong> R$ {shiftTarget.toLocaleString('pt-BR')} &bull;{' '}
            <strong>Prato Foco de Venda:</strong> Pirarucu em Crosta de Castanha &bull;{' '}
            <strong>Aviso de Cozinha:</strong> Racionar Lombo de Tambaqui até chegada do caminhão do CDA.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => onOpenCopilot('Gere o roteiro do briefing de 5 minutos para eu reunir a equipe agora no salão.')}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0f392b] to-[#164e3b] text-white text-xs font-bold shadow-md hover:from-[#164e3b] hover:to-[#0f392b] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver Roteiro com IA</span>
          </button>
        </div>
      </div>

      {/* Ações Rápidas do Gerente */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateToTab('inventory')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
        >
          <Package className="w-5 h-5 text-emerald-700 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-900 block">Contagem Curva A</span>
          <span className="text-[10px] text-slate-500">Auditar 20 itens nobres</span>
        </button>

        <button
          onClick={() => onNavigateToTab('cda')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
        >
          <Truck className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-900 block">Pedidos ao CDA</span>
          <span className="text-[10px] text-slate-500">Corte encerra às 15:00</span>
        </button>

        <button
          onClick={() => onNavigateToTab('checklists')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
        >
          <FileText className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-900 block">Aferição Frio 17h</span>
          <span className="text-[10px] text-slate-500">Garantir os R$ 700</span>
        </button>

        <button
          onClick={() => onOpenCopilot('Mesa no salão está reclamando de demora. Como agir agora?')}
          className="p-3 bg-gradient-to-br from-emerald-900 to-[#0f392b] text-white rounded-xl text-left transition-all shadow-sm group hover:from-[#164e3b] hover:to-emerald-900 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white block">Tk Copilot</span>
          <span className="text-[10px] text-emerald-200/80">Consultor de salão & crises</span>
        </button>
      </div>

      {/* Itens em Destaque no Cardápio Hoje */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Monitor de Salão: Pratos Principais</h3>
            <p className="text-xs text-slate-500">Sincronia de preparo e status de saída das comandas no salão</p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Abertura do Turno
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <div>
                <span className="text-xs font-bold text-slate-800">Pirarucu em Crosta de Castanha-do-Brasil</span>
                <span className="text-[11px] text-slate-400 block">Acompanha risoto de tucupi e folhas de jambu</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500">0 pedidos hoje</span>
              <span className="text-[10px] text-slate-400 block">Aguardando comandas</span>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <div>
                <span className="text-xs font-bold text-slate-800">Carne de Sol Artesanal com Queijo Coalho</span>
                <span className="text-[11px] text-slate-400 block">Acompanha pirão de leite e baião de dois</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500">0 pedidos hoje</span>
              <span className="text-[10px] text-slate-400 block">Aguardando comandas</span>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <div>
                <span className="text-xs font-bold text-slate-800">Costela de Tambaqui Nobre na Brasa</span>
                <span className="text-[11px] text-slate-400 block">Acompanha baião e farofa de Uarini</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500">0 pedidos hoje</span>
              <span className="text-[10px] text-slate-400 block">Aguardando comandas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
