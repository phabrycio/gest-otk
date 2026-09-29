import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Circle, AlertCircle, ThermometerSnowflake, Lock, Flame } from 'lucide-react';
import { ChecklistItem } from '../types';

interface ChecklistsViewProps {
  checklists: ChecklistItem[];
  onToggleCheck: (id: string) => void;
}

export const ChecklistsView: React.FC<ChecklistsViewProps> = ({ checklists, onToggleCheck }) => {
  const [activeCategory, setActiveCategory] = useState<'TODOS' | 'FRIO_ANVISA' | 'SALAO' | 'COZINHA'>('FRIO_ANVISA');

  const filteredChecklists = activeCategory === 'TODOS'
    ? checklists
    : checklists.filter((c) => c.category === activeCategory);

  const completedCount = checklists.filter((c) => c.completed).length;
  const compliancePct = ((completedCount / checklists.length) * 100).toFixed(0);

  return (
    <div className="space-y-4">
      {/* Topo do Módulo de Checklists */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-slate-900">Checklists Operacionais & ANVISA</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Padrão de excelência da loja e garantia da meta de <strong>Segurança de Alimentos (R$ 700,00 de bônus)</strong>.
          </p>
        </div>

        {/* Indicador de Conformidade Geral */}
        <div className="flex items-center gap-3 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Conformidade Hoje</span>
            <span className="text-base font-black text-emerald-900">{compliancePct}%</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {completedCount}/{checklists.length}
          </div>
        </div>
      </div>

      {/* Alerta de Segurança Sanitária */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#0f392b] text-white p-4 rounded-2xl shadow-md border border-emerald-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <ThermometerSnowflake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Aferição Sanitária de Frio (ANVISA / Visa Manaus)
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-amber-950">
                Meta Bônus: R$ 700,00
              </span>
            </h3>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Conclua a aferição das 17h00 nas câmaras frigoríficas para garantir 100% de conformidade técnica hoje.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveCategory('FRIO_ANVISA')}
          className="px-3.5 py-2 rounded-xl bg-[#d97706] hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all"
        >
          Aferir Frio Agora
        </button>
      </div>

      {/* Filtro de Categorias */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('FRIO_ANVISA')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'FRIO_ANVISA'
              ? 'bg-[#0f392b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ❄️ Câmaras & Frio ANVISA
        </button>
        <button
          onClick={() => setActiveCategory('SALAO')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'SALAO'
              ? 'bg-[#0f392b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🍽️ Salão & Ar-Condicionado
        </button>
        <button
          onClick={() => setActiveCategory('COZINHA')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'COZINHA'
              ? 'bg-[#0f392b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🍳 Cozinha & Boqueta
        </button>
        <button
          onClick={() => setActiveCategory('TODOS')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'TODOS'
              ? 'bg-[#0f392b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todos os Itens ({checklists.length})
        </button>
      </div>

      {/* Lista Interativa de Itens */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {filteredChecklists.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleCheck(item.id)}
            className={`p-4 flex items-start justify-between gap-3 cursor-pointer transition-all hover:bg-slate-50 ${
              item.completed ? 'bg-emerald-50/20' : 'bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                role="checkbox"
                aria-checked={item.completed}
                aria-label={item.title}
                className="mt-0.5 text-slate-400 focus:outline-none cursor-pointer"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                )}
              </button>

              <div>
                <span
                  className={`text-xs sm:text-sm font-bold block ${
                    item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </span>

                {item.obs && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.obs}</p>
                )}

                {item.targetTemp && (
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="font-semibold text-slate-600">Padrão: {item.targetTemp}</span>
                    {item.currentTemp && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        Aferido: {item.currentTemp}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                item.completed
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {item.completed ? 'Conforme' : 'Pendente'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
