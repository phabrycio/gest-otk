import React, { useState, useRef } from 'react';
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload,
  Plus,
  Sparkles,
  Users,
  BookOpen,
  Brain,
  Filter,
  FileSpreadsheet,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Check,
  RotateCcw,
  Building2,
  Shield,
  Truck,
  Calendar,
  MapPin,
} from 'lucide-react';
import {
  INITIAL_AUDIT_REPORT,
  INITIAL_UNIT_EMPLOYEES,
  INITIAL_UNIT_PROCESSES,
  INITIAL_MANAGEMENT_INSIGHTS,
} from '../../data/unitOperationsData';
import { parseExcelAuditCSV, SAMPLE_EXCEL_AUDIT_CSV } from '../../services/auditParser';
import type {
  AuditReport,
  AuditItem,
  UnitEmployee,
  OperationalProcess,
  ManagementInsight,
  ActionStatus,
} from '../../types/auditAndOperations.types';

type TabView = 'AUDITORIA' | 'PROCESSOS' | 'FUNCIONARIOS' | 'INSIGHTS_IA';

export default function AuditoriaProcessosView() {
  const [activeTab, setActiveTab] = useState<TabView>('AUDITORIA');
  const [auditReport, setAuditReport] = useState<AuditReport>(INITIAL_AUDIT_REPORT);
  const [employees, setEmployees] = useState<UnitEmployee[]>(INITIAL_UNIT_EMPLOYEES);
  const [processes, setProcesses] = useState<OperationalProcess[]>(INITIAL_UNIT_PROCESSES);
  const [insights] = useState<ManagementInsight[]>(INITIAL_MANAGEMENT_INSIGHTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // Filtros de POPs e Equipe
  const [popShiftFilter, setPopShiftFilter] = useState<string>('TODOS');
  const [popSectorFilter, setPopSectorFilter] = useState<string>('TODOS');
  const [expandedPopId, setExpandedPopId] = useState<string | null>(null);
  const [empShiftFilter, setEmpShiftFilter] = useState<string>('TODOS');

  // Modais de criação rápida
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddProcessModal, setShowAddProcessModal] = useState(false);

  // Form states funcionário
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpSector, setNewEmpSector] = useState<UnitEmployee['sector']>('COZINHA');
  const [newEmpShift, setNewEmpShift] = useState<UnitEmployee['shift']>('ALMOCO');

  // Form states processo
  const [newProcCode, setNewProcCode] = useState('');
  const [newProcTitle, setNewProcTitle] = useState('');
  const [newProcSector, setNewProcSector] = useState<OperationalProcess['sector']>('COZINHA');
  const [newProcDescription, setNewProcDescription] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload de arquivo de auditoria Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const res = parseExcelAuditCSV(content, file.name);
      if (res.success && res.data) {
        setAuditReport(res.data);
        setImportNotification(`Auditoria "${res.data.title}" importada com sucesso! ${res.data.nonConformitiesCount} pendências geraram plano de ação.`);
      } else {
        setImportNotification('Não foi possível ler o arquivo. Certifique-se de que é uma planilha CSV exportada do Excel.');
      }
    };
    reader.readAsText(file, 'ISO-8859-1');
  };

  const loadSampleAudit = () => {
    const res = parseExcelAuditCSV(SAMPLE_EXCEL_AUDIT_CSV, 'Auditoria_Engenho_Modelo.xlsx');
    if (res.data) {
      setAuditReport(res.data);
      setImportNotification('Amostra de auditoria carregada com plano de ação corretivo gerado pela IA!');
    }
  };

  // Atualiza status da ação corretiva
  const toggleActionStatus = (itemId: string) => {
    setAuditReport((prev) => ({
      ...prev,
      items: prev.items.map((it) => {
        if (it.id !== itemId) return it;
        const nextStatus: ActionStatus =
          it.actionStatus === 'PENDENTE'
            ? 'EM_ANDAMENTO'
            : it.actionStatus === 'EM_ANDAMENTO'
            ? 'CONCLUIDO'
            : 'PENDENTE';
        return { ...it, actionStatus: nextStatus };
      }),
    }));
  };

  // Adicionar novo colaborador
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpRole) return;

    const newEmp: UnitEmployee = {
      id: `emp-${Date.now()}`,
      name: newEmpName,
      role: newEmpRole,
      sector: newEmpSector,
      shift: newEmpShift,
      activeStatus: 'ATIVO',
      assignedProcesses: [],
      openActionItemsCount: 0,
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setShowAddEmployeeModal(false);
    setNewEmpName('');
    setNewEmpRole('');
  };

  // Adicionar novo processo
  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcTitle) return;

    const newProc: OperationalProcess = {
      id: `proc-${Date.now()}`,
      code: newProcCode || `POP-${newProcSector.slice(0, 3)}-${Date.now().toString().slice(-2)}`,
      title: newProcTitle,
      sector: newProcSector,
      frequency: 'POR_TURNO',
      responsibleRole: 'Líder de Setor',
      description: newProcDescription || 'Procedimento operacional da unidade.',
      criticalPoints: ['Cumprimento obrigatório no início e término de turno.'],
      linkedAuditNonConformitiesCount: 0,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };

    setProcesses((prev) => [newProc, ...prev]);
    setShowAddProcessModal(false);
    setNewProcCode('');
    setNewProcTitle('');
    setNewProcDescription('');
  };

  const filteredAuditItems = auditReport.items.filter((it) => {
    if (filterSeverity === 'ALL') return true;
    if (filterSeverity === 'PENDENTES') return it.status === 'NAO_CONFORME' && it.actionStatus !== 'CONCLUIDO';
    if (filterSeverity === 'CONCLUIDOS') return it.actionStatus === 'CONCLUIDO';
    if (filterSeverity === 'CRITICAS') return it.severity === 'CRITICA';
    return it.severity === filterSeverity;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.txt"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Seletor Superior de Abas */}
      <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('AUDITORIA')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'AUDITORIA'
              ? 'bg-[#0a2e23] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Auditorias & Ações</span>
        </button>

        <button
          onClick={() => setActiveTab('INSIGHTS_IA')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'INSIGHTS_IA'
              ? 'bg-[#0a2e23] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-amber-400" />
          <span>Decisões & Insights IA</span>
        </button>

        <button
          onClick={() => setActiveTab('PROCESSOS')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'PROCESSOS'
              ? 'bg-[#0a2e23] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Processos (POPs) ({processes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('FUNCIONARIOS')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'FUNCIONARIOS'
              ? 'bg-[#0a2e23] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>Brigada ({employees.length})</span>
        </button>
      </div>

      {/* Alerta de Notificação */}
      {importNotification && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-800 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{importNotification}</span>
          </div>
          <button onClick={() => setImportNotification(null)} className="text-emerald-700 font-bold text-xs p-1">
            ✕
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 1: AUDITORIAS & PLANO DE AÇÃO CORRETIVA */}
      {/* ============================================================ */}
      {activeTab === 'AUDITORIA' && (
        <div className="space-y-4">
          {/* Card Principal do Score da Auditoria */}
          <div className="bg-gradient-to-br from-[#0a2e23] to-[#144838] text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide border border-amber-400/30">
                    Auditoria Interna & Boas Práticas
                  </span>
                  <span className="text-emerald-200/80 text-xs">{auditReport.auditDate}</span>
                </div>
                <h2 className="text-xl font-black mt-1 text-white">{auditReport.title}</h2>
                <p className="text-xs text-emerald-100/80 mt-0.5 max-w-xl">
                  {auditReport.aiExecutiveSummary}
                </p>
              </div>

              {/* Score Circular / Indicador */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shrink-0">
                <div className="text-center">
                  <span className="block text-2xl font-black text-amber-300 leading-none">
                    {auditReport.overallScore}%
                  </span>
                  <span className="text-[9px] font-bold text-emerald-200 uppercase tracking-wide mt-1 block">
                    Conformidade
                  </span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-left text-[11px] space-y-0.5">
                  <div className="text-emerald-300 font-bold">✓ {auditReport.conformitiesCount} Conformes</div>
                  <div className="text-rose-300 font-bold">⚠ {auditReport.nonConformitiesCount} Não Conformes</div>
                  <div className="text-red-400 font-bold">🚨 {auditReport.criticalCount} Crítica</div>
                </div>
              </div>
            </div>

            {/* Ações de Importação */}
            <div className="flex flex-wrap gap-2.5 mt-5 pt-4 border-t border-emerald-800/60 relative z-10">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-98"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Importar Planilha Excel da Auditoria</span>
              </button>

              <button
                onClick={loadSampleAudit}
                className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-colors border border-white/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Carregar Modelo Excel de Demonstração</span>
              </button>
            </div>
          </div>

          {/* Barra de Filtros de Auditoria */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'ALL', label: 'Todos os Itens' },
                { id: 'PENDENTES', label: 'Pendências em Aberto' },
                { id: 'CRITICAS', label: 'Críticas' },
                { id: 'ALTA', label: 'Alta Severidade' },
                { id: 'CONCLUIDOS', label: 'Ações Concluídas' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterSeverity(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap text-[11px] transition-colors ${
                    filterSeverity === f.id
                      ? 'bg-[#0a2e23] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold shrink-0">
              {filteredAuditItems.length} de {auditReport.items.length} itens
            </span>
          </div>

          {/* Lista de Itens Auditados & Plano de Ação 5W2H */}
          <div className="space-y-3">
            {filteredAuditItems.map((item) => {
              const isNc = item.status === 'NAO_CONFORME';
              const isCrit = item.severity === 'CRITICA';
              const isAlta = item.severity === 'ALTA';
              const isDone = item.actionStatus === 'CONCLUIDO';

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border p-4 shadow-sm transition-all ${
                    isCrit && !isDone
                      ? 'border-red-300 bg-red-50/20 ring-1 ring-red-200'
                      : isNc && !isDone
                      ? 'border-amber-200 bg-amber-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                            item.sector === 'COZINHA'
                              ? 'bg-amber-100 text-amber-800'
                              : item.sector === 'SALAO'
                              ? 'bg-blue-100 text-blue-800'
                              : item.sector === 'DOCA_ESTOQUE'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.sector.replace('_', ' ')}
                        </span>

                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                            item.status === 'CONFORME'
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCrit
                              ? 'bg-red-100 text-red-800 font-black'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status === 'CONFORME' ? 'CONFORME' : `NÃO CONFORME (${item.severity})`}
                        </span>

                        {item.relatedPopCode && (
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">
                            {item.relatedPopCode}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-800 leading-tight">
                        {item.requirement}
                      </h4>

                      {item.evidenceNotes && (
                        <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-2 mt-1">
                          <strong>Constatação do auditor:</strong> {item.evidenceNotes}
                        </p>
                      )}
                    </div>

                    {/* Status da Ação */}
                    {isNc && (
                      <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
                        <button
                          onClick={() => toggleActionStatus(item.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : item.actionStatus === 'EM_ANDAMENTO'
                              ? 'bg-amber-500 text-white'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Ação Concluída</span>
                            </>
                          ) : item.actionStatus === 'EM_ANDAMENTO' ? (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Em Andamento</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Pendente</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Detalhe do Plano de Ação 5W2H Gerado pela IA */}
                  {item.correctiveAction && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2">
                      <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">
                        <div className="flex items-center gap-1 text-[11px] font-black text-emerald-800 uppercase tracking-wide">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Plano de Ação Corretiva (IA):</span>
                        </div>
                        <p className="text-slate-700 font-medium mt-1 leading-relaxed">
                          {item.correctiveAction}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                        <div className="bg-slate-50 rounded-lg p-2">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Quem executa</span>
                          <span className="font-bold text-slate-800">
                            {item.assignedEmployeeName || item.assignedRole || 'Gerente de Turno'}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Prazo de Resolução</span>
                          <span className="font-bold text-slate-800">
                            {item.deadlineDays ? `${item.deadlineDays} dia(s)` : 'Imediato'}
                            {item.dueDate ? ` (até ${item.dueDate})` : ''}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Procedimento Relacionado</span>
                          <span className="font-bold text-emerald-700">{item.relatedPopCode || 'POP Geral'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 2: DECISÕES E INSIGHTS CRUZADOS DA IA */}
      {/* ============================================================ */}
      {activeTab === 'INSIGHTS_IA' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Cruzamento de Vendas, Auditorias & Decisões da Loja
                </h3>
                <p className="text-xs text-slate-500">
                  A IA correlacionou relatórios do <strong>Teknisa Odhen PDV</strong>, reservas do <strong>Dionísio</strong>, a <strong>Auditoria em Excel</strong> e a escala dos funcionários.
                </p>
              </div>
            </div>

            {/* Badges dos Sistemas Ativos */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Teknisa PDV (Vendas & Cancelamentos)
              </span>
              <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                Dionísio (Reservas, WhatsApp & NPS)
              </span>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Auditoria Interna Excel
              </span>
              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Brigada ({employees.length} Colaboradores)
              </span>
            </div>
          </div>

          {/* Cards de Insights da IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((ins) => (
              <div
                key={ins.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                        ins.priority === 'ALTA'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      Prioridade {ins.priority}
                    </span>

                    <div className="flex gap-1">
                      {ins.sources.map((s) => (
                        <span key={s} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-2">{ins.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ins.description}</p>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 mt-3 text-xs text-emerald-800 font-semibold">
                    💰 {ins.impactEstimate}
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                  <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wide">Ações Recomendadas:</p>
                  {ins.actionPlan.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700 text-[11px]">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 3: PROCESSOS OPERACIONAIS DA LOJA (POPs) */}
      {/* ============================================================ */}
      {activeTab === 'PROCESSOS' && (
        <div className="space-y-4">
          {/* Banner Master Operacional: Restaurante de Shopping R$ 1M+ */}
          <div className="bg-gradient-to-r from-[#0a2e23] via-[#0e3b2e] to-[#124b3a] rounded-2xl p-4 sm:p-5 text-white shadow-md border border-emerald-800/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Faturamento &gt; R$ 1.000.000 / mês
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-emerald-100 border border-white/15">
                    Shopping Ponta Negra (Piso L2)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    Doca CDA 15h00 & Fábricas
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">
                  Procedimentos Operacionais Padronizados (POPs) da Unidade
                </h3>
                <p className="text-xs text-emerald-100/80 mt-0.5 max-w-2xl">
                  <strong>Horário da Loja:</strong> Seg a Sáb das 11h às 23h • Domingo das 12h às 22h. 
                  Operação dividida rigorosamente entre as turmas de <strong>08h00</strong>, <strong>10h00</strong>, <strong>12h00</strong> e <strong>14h00</strong>.
                </p>
              </div>

              <button
                onClick={() => setShowAddProcessModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo POP</span>
              </button>
            </div>

            {/* 4 Grupos de Entrada - Filtro Rápido */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-emerald-700/50 text-xs">
              <button
                onClick={() => setPopShiftFilter('TODOS')}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  popShiftFilter === 'TODOS'
                    ? 'bg-white text-slate-900 font-bold border-white shadow-xs'
                    : 'bg-black/20 text-emerald-100 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-[10px] text-slate-400">Todos os Horários</div>
                <div className="font-black text-sm mt-0.5">20 POPs</div>
              </button>

              <button
                onClick={() => setPopShiftFilter('08:00')}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  popShiftFilter === '08:00'
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                    : 'bg-black/20 text-emerald-100 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-[10px] opacity-80 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 08h00 (Abertura)
                </div>
                <div className="font-bold text-xs mt-0.5">Pré-Preparo & Exaustão</div>
              </button>

              <button
                onClick={() => setPopShiftFilter('10:00')}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  popShiftFilter === '10:00'
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                    : 'bg-black/20 text-emerald-100 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-[10px] opacity-80 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 10h00 (Mise en Place)
                </div>
                <div className="font-bold text-xs mt-0.5">Salão, Bar & Pistas</div>
              </button>

              <button
                onClick={() => setPopShiftFilter('12:00')}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  popShiftFilter === '12:00'
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                    : 'bg-black/20 text-emerald-100 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-[10px] opacity-80 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 12h00 (Pico Almoço)
                </div>
                <div className="font-bold text-xs mt-0.5">KDS & Boqueta Rápida</div>
              </button>

              <button
                onClick={() => setPopShiftFilter('14:00')}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  popShiftFilter === '14:00'
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                    : 'bg-black/20 text-emerald-100 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-[10px] opacity-80 font-bold flex items-center gap-1">
                  <Truck className="w-3 h-3" /> 14h00 (Doca & Noite)
                </div>
                <div className="font-bold text-xs mt-0.5">CDA 15h & Fechamento</div>
              </button>
            </div>
          </div>

          {/* Barra de Filtros por Setor */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-2 rounded-xl border border-slate-200/80 text-xs">
            <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Setor:
            </span>
            {(['TODOS', 'COZINHA', 'SALAO', 'BAR', 'DOCA_ESTOQUE', 'ANVISA_HIGIENE', 'ADMIN_CAIXA'] as const).map((sec) => (
              <button
                key={sec}
                onClick={() => setPopSectorFilter(sec)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  popSectorFilter === sec
                    ? 'bg-[#0a2e23] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec === 'TODOS' ? 'Todos os Setores' : sec}
              </button>
            ))}
          </div>

          {/* Grid de POPs Filtrados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {processes
              .filter((proc) => {
                const matchesShift =
                  popShiftFilter === 'TODOS' ||
                  proc.entryShiftHour === popShiftFilter ||
                  proc.entryShiftHour === 'TODOS';
                const matchesSector =
                  popSectorFilter === 'TODOS' || proc.sector === popSectorFilter;
                return matchesShift && matchesSector;
              })
              .map((proc) => {
                const isExpanded = expandedPopId === proc.id;

                return (
                  <div
                    key={proc.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-slate-900 text-amber-300 font-mono text-[11px] font-black px-2.5 py-0.5 rounded-md">
                            {proc.code}
                          </span>
                          {proc.entryShiftHour && (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Clock className="w-3 h-3 text-emerald-600" />
                              {proc.entryShiftHour === 'TODOS'
                                ? 'Todos os Turnos'
                                : `Entrada ${proc.entryShiftHour}`}
                            </span>
                          )}
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            {proc.sector}
                          </span>
                        </div>

                        {proc.linkedAuditNonConformitiesCount > 0 ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {proc.linkedAuditNonConformitiesCount} pendência auditada
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            100% Conforme
                          </span>
                        )}
                      </div>

                      {/* Título e Responsável */}
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">{proc.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          <strong>Responsável:</strong> {proc.responsibleRole}
                        </p>
                      </div>

                      {/* Janela de Execução */}
                      {proc.executionWindow && (
                        <div className="text-[11px] font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span><strong>Janela de Execução:</strong> {proc.executionWindow}</span>
                        </div>
                      )}

                      {/* Regras Específicas de Shopping */}
                      {proc.shoppingRules && (
                        <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 space-y-0.5">
                          <div className="font-bold flex items-center gap-1.5 text-amber-800">
                            <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Regra Exclusiva do Shopping Center:</span>
                          </div>
                          <p className="leading-relaxed text-amber-950/90 text-[11px]">
                            {proc.shoppingRules}
                          </p>
                        </div>
                      )}

                      {/* Descrição */}
                      <p className="text-xs text-slate-600 leading-relaxed">{proc.description}</p>

                      {/* Pontos Críticos de Controle (PCC) */}
                      <div className="bg-slate-50 rounded-xl p-2.5 space-y-1 text-[11px] border border-slate-100">
                        <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wide">
                          Pontos Críticos de Controle (PCC):
                        </span>
                        {proc.criticalPoints.map((pcc, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-slate-600">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{pcc}</span>
                          </div>
                        ))}
                      </div>

                      {/* Accordion Expandido: Passo a Passo e EPIs */}
                      {isExpanded && (
                        <div className="space-y-2.5 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
                          {proc.stepByStep && proc.stepByStep.length > 0 && (
                            <div className="space-y-1 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-xs">
                              <span className="font-bold text-emerald-900 text-[11px] uppercase tracking-wide block mb-1">
                                📋 Passo a Passo de Execução Sequencial:
                              </span>
                              {proc.stepByStep.map((step, idx) => (
                                <p key={idx} className="text-slate-700 text-[11px] leading-relaxed">
                                  {step}
                                </p>
                              ))}
                            </div>
                          )}

                          {proc.materialsAndPPE && proc.materialsAndPPE.length > 0 && (
                            <div className="text-[11px] bg-slate-100/70 p-2.5 rounded-xl text-slate-700">
                              <span className="font-bold text-slate-800 block mb-1">
                                🦺 Materiais, Produtos Químicos e EPIs Obrigatórios:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {proc.materialsAndPPE.map((mat, idx) => (
                                  <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] text-slate-700">
                                    {mat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Botão de Expandir Passo a Passo */}
                    <button
                      onClick={() => setExpandedPopId(isExpanded ? null : proc.id)}
                      className="w-full mt-2 py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                          <span>Recolher Detalhes</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Ver Passo a Passo &amp; EPIs ({proc.stepByStep?.length || 0} passos)</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 4: FUNCIONÁRIOS DA UNIDADE */}
      {/* ============================================================ */}
      {activeTab === 'FUNCIONARIOS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="font-black text-sm text-slate-900">Quadro de Funcionários da Unidade</h3>
              <p className="text-xs text-slate-500">
                Brigada completa dividida pelos horários de chegada (08h, 10h, 12h, 14h) para atendimento aos POPs.
              </p>
            </div>
            <button
              onClick={() => setShowAddEmployeeModal(true)}
              className="bg-[#0a2e23] hover:bg-[#185341] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Adicionar Colaborador</span>
            </button>
          </div>

          {/* Filtro por Turma de Entrada */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-2 rounded-xl border border-slate-200/80 text-xs">
            <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Entrada:
            </span>
            {(['TODOS', 'TURMA_08H', 'TURMA_10H', 'TURMA_12H', 'TURMA_14H'] as const).map((sh) => (
              <button
                key={sh}
                onClick={() => setEmpShiftFilter(sh)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  empShiftFilter === sh
                    ? 'bg-[#0a2e23] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sh === 'TODOS'
                  ? 'Toda a Brigada'
                  : sh === 'TURMA_08H'
                  ? 'Turma 08:00 (Abertura)'
                  : sh === 'TURMA_10H'
                  ? 'Turma 10:00 (Mise en Place)'
                  : sh === 'TURMA_12H'
                  ? 'Turma 12:00 (Pico Almoço)'
                  : 'Turma 14:00 (Doca CDA & Fechamento)'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {employees
              .filter((emp) => empShiftFilter === 'TODOS' || emp.shift === empShiftFilter)
              .map((emp) => (
                <div
                  key={emp.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{emp.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{emp.role}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          emp.sector === 'COZINHA'
                            ? 'bg-amber-100 text-amber-800'
                            : emp.sector === 'SALAO'
                            ? 'bg-blue-100 text-blue-800'
                            : emp.sector === 'DOCA_ESTOQUE'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {emp.sector}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 rounded-xl p-2.5">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Chegada</span>
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          {emp.entryTime || emp.shift}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Ações Auditoria</span>
                        <span className={`font-bold ${emp.openActionItemsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {emp.openActionItemsCount} pendência(s)
                        </span>
                      </div>
                      {emp.npsScore && (
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">NPS Salão</span>
                          <span className="font-bold text-emerald-700">{emp.npsScore} ★</span>
                        </div>
                      )}
                      {emp.cancelationErrorsCount !== undefined && (
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Erros Teknisa</span>
                          <span className="font-bold text-slate-700">{emp.cancelationErrorsCount} un</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {emp.assignedProcesses.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">POPs Sob Responsabilidade:</span>
                      <div className="flex flex-wrap gap-1">
                        {emp.assignedProcesses.map((pop) => (
                          <span key={pop} className="bg-slate-100 text-slate-700 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                            {pop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CADASTRAR NOVO FUNCIONÁRIO */}
      {/* ============================================================ */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-slate-900">Novo Colaborador da Unidade</h3>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-bold block mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Cargo / Função</label>
                <input
                  type="text"
                  required
                  value={newEmpRole}
                  onChange={(e) => setNewEmpRole(e.target.value)}
                  placeholder="Ex: Garçom de Salão / Cozinheiro de Praça"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Setor</label>
                  <select
                    value={newEmpSector}
                    onChange={(e) => setNewEmpSector(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white"
                  >
                    <option value="COZINHA">Cozinha</option>
                    <option value="SALAO">Salão</option>
                    <option value="BAR">Bar</option>
                    <option value="DOCA_ESTOQUE">Doca / Estoque</option>
                    <option value="LIMPEZA">Limpeza / Steward</option>
                    <option value="GERENCIA">Gerência</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-bold block mb-1">Turno Principal</label>
                  <select
                    value={newEmpShift}
                    onChange={(e) => setNewEmpShift(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white"
                  >
                    <option value="ALMOCO">Almoço</option>
                    <option value="JANTAR">Jantar</option>
                    <option value="ESCALA_6X1">Escala 6x1</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0a2e23] hover:bg-[#185341] text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CADASTRAR NOVO PROCESSO (POP) */}
      {/* ============================================================ */}
      {showAddProcessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-slate-900">Novo Processo Operacional (POP)</h3>
              <button onClick={() => setShowAddProcessModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProcess} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Código</label>
                  <input
                    type="text"
                    value={newProcCode}
                    onChange={(e) => setNewProcCode(e.target.value)}
                    placeholder="Ex: POP-COZ-05"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Setor</label>
                  <select
                    value={newProcSector}
                    onChange={(e) => setNewProcSector(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white"
                  >
                    <option value="COZINHA">Cozinha</option>
                    <option value="SALAO">Salão</option>
                    <option value="BAR">Bar</option>
                    <option value="DOCA_ESTOQUE">Doca & Estoque</option>
                    <option value="ANVISA_HIGIENE">ANVISA & Higiene</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Título do Procedimento</label>
                <input
                  type="text"
                  required
                  value={newProcTitle}
                  onChange={(e) => setNewProcTitle(e.target.value)}
                  placeholder="Ex: Fechamento Seguro de Gás e Fritadeiras"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Descrição do Processo</label>
                <textarea
                  rows={3}
                  value={newProcDescription}
                  onChange={(e) => setNewProcDescription(e.target.value)}
                  placeholder="Descreva as instruções passo a passo para o time..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProcessModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0a2e23] hover:bg-[#185341] text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Salvar Processo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
