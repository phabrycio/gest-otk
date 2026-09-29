// ============================================================
// CALENDÁRIO OPERACIONAL & PRAZOS DO GERENTE
// Gestão de Licenças ANVISA, Fechamentos Fiscais, Ponto RH e Manutenções
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Trash2,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileSpreadsheet,
  Wrench,
  Users,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  CalendarDeadlineItem,
  DeadlineCategory,
  DeadlinePriority,
  getCalendarDeadlines,
  addCalendarDeadline,
  toggleDeadlineCompleted,
  deleteCalendarDeadline,
} from '../../services/managerCalendarStore';

const CATEGORY_LABELS: Record<DeadlineCategory, { label: string; icon: any; color: string }> = {
  ANVISA_SANITARIO: { label: 'ANVISA / Sanitário', icon: ShieldCheck, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  FISCAL_CONTABIL: { label: 'Fiscal & Contábil', icon: FileSpreadsheet, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  RH_EQUIPE: { label: 'RH & Equipe', icon: Users, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  MANUTENCAO_OPERACAO: { label: 'Manutenção & Operação', icon: Wrench, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  OUTROS: { label: 'Outros Prazos', icon: Clock, color: 'text-slate-700 bg-slate-50 border-slate-200' },
};

const PRIORITY_BADGES: Record<DeadlinePriority, { label: string; color: string }> = {
  CRITICA: { label: 'Crítica', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  ALTA: { label: 'Alta', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  MEDIA: { label: 'Média', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  BAIXA: { label: 'Baixa', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export const ManagerCalendarView: React.FC = () => {
  const [deadlines, setDeadlines] = useState<CalendarDeadlineItem[]>(() => getCalendarDeadlines());
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [viewMode, setViewMode] = useState<'AGENDA' | 'MES'>('AGENDA');
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados do formulário de novo prazo
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<DeadlineCategory>('ANVISA_SANITARIO');
  const [newDueDate, setNewDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newDueTime, setNewDueTime] = useState('14:00');
  const [newPriority, setNewPriority] = useState<DeadlinePriority>('ALTA');
  const [newResponsible, setNewResponsible] = useState('Ivan (Gerente Geral)');
  const [newRecurrence, setNewRecurrence] = useState<'NENHUMA' | 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL'>('MENSAL');

  // Navegação do calendário mensal
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) setDeadlines(e.detail);
      else setDeadlines(getCalendarDeadlines());
    };
    window.addEventListener('tk_calendar_updated', handleUpdate);
    return () => window.removeEventListener('tk_calendar_updated', handleUpdate);
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Métricas
  const stats = useMemo(() => {
    const total = deadlines.length;
    const completed = deadlines.filter((d) => d.status === 'CONCLUIDO').length;
    const pending = deadlines.filter((d) => d.status !== 'CONCLUIDO');
    const overdue = pending.filter((d) => d.dueDate < todayStr).length;
    const dueToday = pending.filter((d) => d.dueDate === todayStr).length;
    return { total, completed, pendingCount: pending.length, overdue, dueToday };
  }, [deadlines, todayStr]);

  // Lista filtrada
  const filteredDeadlines = useMemo(() => {
    return deadlines
      .filter((d) => selectedCategory === 'TODOS' || d.category === selectedCategory)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [deadlines, selectedCategory]);

  const handleToggle = (id: string) => {
    toggleDeadlineCompleted(id, 'Gerente');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este prazo do calendário?')) {
      deleteCalendarDeadline(id);
    }
  };

  const handleCreateDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarDeadline({
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      category: newCategory,
      dueDate: newDueDate,
      dueTime: newDueTime || undefined,
      priority: newPriority,
      status: 'PENDENTE',
      responsibleName: newResponsible.trim() || 'Gerente',
      isRecurring: newRecurrence !== 'NENHUMA',
      recurrencePeriod: newRecurrence !== 'NENHUMA' ? newRecurrence : undefined,
    });

    // Limpa form e fecha
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. Header do Calendário */}
      <div className="bg-gradient-to-r from-[#051c15] via-[#0a2e23] to-[#041711] text-white p-5 rounded-2xl border border-emerald-800/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-black tracking-tight text-white">Calendário & Prazos do Gerente</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Organização & Governança
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Gestão visual de alvarás ANVISA, laudos de coifas/água, fechamentos fiscais, folhas de ponto e vistorias.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer self-start md:self-auto shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Prazo / Tarefa</span>
        </button>
      </div>

      {/* 2. Scorecard de Prazos Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Obrigações Ativas</span>
          <p className="text-xl font-black text-slate-900 mt-1">{stats.pendingCount}</p>
          <span className="text-[10px] text-slate-400">Total cadastradas: {stats.total}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Em Atraso</span>
          <p className="text-xl font-black text-rose-700 mt-1">{stats.overdue}</p>
          <span className="text-[10px] text-rose-500">Exige ação imediata</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Vencendo Hoje</span>
          <p className="text-xl font-black text-amber-700 mt-1">{stats.dueToday}</p>
          <span className="text-[10px] text-amber-500">Atenção no turno</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Concluídas</span>
          <p className="text-xl font-black text-emerald-700 mt-1">{stats.completed}</p>
          <span className="text-[10px] text-emerald-600">Em dia no mural</span>
        </div>
      </div>

      {/* 3. Barra de Filtros e Modo de Visualização */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Seletor de Categoria */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('TODOS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'TODOS'
                ? 'bg-[#0a2e23] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({deadlines.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as DeadlineCategory[]).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#0a2e23] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {CATEGORY_LABELS[cat].label}
              </button>
            );
          })}
        </div>

        {/* Alternador de Modo de Visualização */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('AGENDA')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'AGENDA' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Agenda Linear
          </button>
          <button
            onClick={() => setViewMode('MES')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'MES' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Mês Visual
          </button>
        </div>
      </div>

      {/* 4. Conteúdo: Agenda Linear */}
      {viewMode === 'AGENDA' && (
        <div className="space-y-3">
          {filteredDeadlines.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
              <CalendarIcon className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm font-bold text-slate-600">Nenhum prazo cadastrado para este filtro.</p>
              <p className="text-xs">Clique no botão "Novo Prazo / Tarefa" acima para agendar obrigações da sua loja.</p>
            </div>
          ) : (
            filteredDeadlines.map((item) => {
              const catInfo = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.OUTROS;
              const priorityInfo = PRIORITY_BADGES[item.priority] || PRIORITY_BADGES.MEDIA;
              const isOverdue = item.status !== 'CONCLUIDO' && item.dueDate < todayStr;
              const isDueToday = item.status !== 'CONCLUIDO' && item.dueDate === todayStr;
              const isCompleted = item.status === 'CONCLUIDO';

              return (
                <div
                  key={item.id}
                  className={`bg-white p-4 rounded-2xl border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCompleted
                      ? 'border-slate-200 opacity-60 bg-slate-50/50'
                      : isOverdue
                      ? 'border-rose-300 ring-1 ring-rose-200'
                      : isDueToday
                      ? 'border-amber-300 ring-1 ring-amber-200'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Botão de Checkbox */}
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'border-2 border-slate-300 hover:border-emerald-600'
                      }`}
                      title={isCompleted ? 'Marcar como pendente' : 'Marcar como concluído'}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catInfo.color}`}>
                          {catInfo.label}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                        {item.isRecurring && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            Recorrente: {item.recurrencePeriod}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-black text-slate-900 leading-tight ${
                          isCompleted ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-slate-500 leading-snug line-clamp-2">{item.description}</p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium pt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Data: <strong>{new Date(`${item.dueDate}T12:00:00`).toLocaleDateString('pt-BR')}</strong>
                          {item.dueTime ? ` às ${item.dueTime}` : ''}
                        </span>
                        <span>&bull;</span>
                        <span>Resp: <strong>{item.responsibleName}</strong></span>
                        {isCompleted && item.completedAt && (
                          <>
                            <span>&bull;</span>
                            <span className="text-emerald-700 font-semibold">
                              Concluído em {new Date(item.completedAt).toLocaleDateString('pt-BR')} por {item.completedBy}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lado Direito: Status / Excluir */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {isOverdue && (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-[11px] font-black border border-rose-300 flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Vencido!
                      </span>
                    )}

                    {isDueToday && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-black border border-amber-300">
                        Vence Hoje
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Excluir este prazo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 5. Modal de Adicionar Novo Prazo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 bg-[#0a2e23] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black tracking-tight">Adicionar Novo Prazo ou Tarefa</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeadline} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Título do Prazo / Obrigação *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Renovação do Laudo de Potabilidade de Água"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0a2e23]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Descrição / Instruções</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detalhes sobre a empresa terceirizada, exigência do shopping ou documento necessário"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0a2e23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DeadlineCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0a2e23]"
                  >
                    <option value="ANVISA_SANITARIO">ANVISA / Sanitário</option>
                    <option value="FISCAL_CONTABIL">Fiscal & Contábil</option>
                    <option value="RH_EQUIPE">RH & Equipe</option>
                    <option value="MANUTENCAO_OPERACAO">Manutenção & Operação</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Prioridade</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as DeadlinePriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0a2e23]"
                  >
                    <option value="CRITICA">Crítica (Interdição/Multa)</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Média</option>
                    <option value="BAIXA">Baixa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Data Limite *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0a2e23]"
                  >
                  </input>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Horário (Opcional)</label>
                  <input
                    type="time"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0a2e23]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Responsável</label>
                  <input
                    type="text"
                    value={newResponsible}
                    onChange={(e) => setNewResponsible(e.target.value)}
                    placeholder="Ex: Ivan (Gerente Geral)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0a2e23]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Recorrência</label>
                  <select
                    value={newRecurrence}
                    onChange={(e) => setNewRecurrence(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0a2e23]"
                  >
                    <option value="NENHUMA">Não Recorrente (Único)</option>
                    <option value="MENSAL">Mensal</option>
                    <option value="TRIMESTRAL">Trimestral</option>
                    <option value="SEMESTRAL">Semestral</option>
                    <option value="ANUAL">Anual</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0a2e23] hover:bg-[#124b3a] text-white text-xs font-black transition-all shadow-md cursor-pointer"
                >
                  Salvar no Calendário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
