import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Volume2,
  Copy,
  GraduationCap,
  Calendar,
  FileSpreadsheet,
  Upload,
  Plus,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react';
import { Employee, ShiftType } from '../types';
import { StaffOnboardingView } from './StaffOnboardingView';
import { CompleteRhDossierView } from './rh/CompleteRhDossierView';
import {
  STORE_SHIFTS,
  StoreWorkShiftId,
  getStoredShiftSchedule,
  saveShiftSchedule,
  importScheduleFromRawText,
  addShiftEntry,
  removeShiftEntry,
  ShiftScheduleEntry
} from '../services/storeEscalaService';

interface StaffRhViewProps {
  staff: Employee[];
  currentShift: ShiftType;
  onOpenCopilot: (prompt?: string) => void;
}

export const StaffRhView: React.FC<StaffRhViewProps> = ({ staff, currentShift, onOpenCopilot }) => {
  const [activeTab, setActiveTab] = useState<'ONBOARDING' | 'ESCALA' | 'DOSSIE'>('DOSSIE');
  const [copied, setCopied] = useState(false);
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<StoreWorkShiftId | 'TODOS'>('TODOS');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Escala persistente gerenciada no storeEscalaService
  const [scheduleEntries, setScheduleEntries] = useState<ShiftScheduleEntry[]>(() => {
    const existing = getStoredShiftSchedule();
    return existing;
  });

  const refreshEntries = () => {
    setScheduleEntries(getStoredShiftSchedule());
  };

  const isLunch = currentShift === 'MANHA_ALMOCO';
  const waitstaff = staff.filter((s) => s.department === 'SALAO' && s.upsellingScore);

  // Form State para adicionar colaborador manualmente
  const [newColab, setNewColab] = useState({
    name: '',
    role: '',
    department: 'SALAO' as ShiftScheduleEntry['department'],
    shiftId: 'ABERTURA_08H' as StoreWorkShiftId,
    station: '',
  });

  const handleCreateColab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColab.name.trim()) return;

    addShiftEntry({
      employeeName: newColab.name.trim(),
      role: newColab.role.trim() || 'Colaborador',
      department: newColab.department,
      shiftId: newColab.shiftId,
      station: newColab.station.trim() || 'A definir',
      date: new Date().toISOString().slice(0, 10),
      status: 'ESCALADO',
      source: 'MANUAL',
    });

    setNewColab({
      name: '',
      role: '',
      department: 'SALAO',
      shiftId: 'ABERTURA_08H',
      station: '',
    });
    setShowAddModal(false);
    refreshEntries();
  };

  const handleImportExcel = () => {
    if (!importText.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    const result = importScheduleFromRawText(importText, today);
    setImportStatus(`Importados com sucesso: ${result.importedCount} colaboradores da escala.`);
    setImportText('');
    refreshEntries();
    setTimeout(() => {
      setImportStatus(null);
      setShowImportModal(false);
    }, 2500);
  };

  // Filtragem dos colaboradores na escala
  const filteredSchedule = scheduleEntries.filter((item) => {
    if (selectedShiftFilter === 'TODOS') return true;
    return item.shiftId === selectedShiftFilter;
  });

  // Roteiro do briefing oficial para o turno
  const briefingScript = `Bom dia, equipe Engenho! Hoje nossa meta operacional é excelência máxima no salão e cozinha.
Atenção especial à rotação dos postos de atendimento, tempo de praça e agilidade nas entregas.
Nas bebidas, destaque para o chopp artesanal e drinks da casa.
Foco na escala, pontualidade nos turnos de 08h, 10h, 12h e 14h, e excelente serviço a todos!`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(briefingScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Seletor Superior de Abas: Dossiê RH Completo x Onboarding x Escala */}
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('DOSSIE')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'DOSSIE'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-700" />
          <span>Dossiê RH & Cadastros</span>
        </button>
        <button
          onClick={() => setActiveTab('ESCALA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'ESCALA'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-700" />
          <span>Escala & Briefing do Turno</span>
        </button>
        <button
          onClick={() => setActiveTab('ONBOARDING')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'ONBOARDING'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-slate-700" />
          <span>Onboarding Brigada & POPs</span>
        </button>
      </div>

      {activeTab === 'DOSSIE' ? (
        <CompleteRhDossierView />
      ) : activeTab === 'ONBOARDING' ? (
        <StaffOnboardingView />
      ) : (
        <div className="space-y-4">
          {/* Topo do Módulo RH com 4 Turnos Oficiais */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-700" />
                <h2 className="text-base font-bold text-slate-900">Escala de Turnos & RH de Loja</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Escala oficial definida pelo RH: 4 turnos diários (08h, 10h, 12h e 14h) para visualização e consulta rápida.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer border border-slate-200"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Colar do Excel RH</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer border border-slate-200"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Adicionar Colaborador</span>
              </button>

              <button
                onClick={() => onOpenCopilot('Analise a distribuição da equipe nos 4 turnos da loja (08h, 10h, 12h e 14h) e sugira melhorias para o salão e bar.')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-700 to-indigo-800 text-white text-xs font-bold shadow-sm hover:from-indigo-800 hover:to-indigo-900 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Otimizar com IA</span>
              </button>
            </div>
          </div>

          {/* Cards dos 4 Turnos Oficiais da Loja */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(Object.values(STORE_SHIFTS) as typeof STORE_SHIFTS[keyof typeof STORE_SHIFTS][]).map((shift) => {
              const count = scheduleEntries.filter((s) => s.shiftId === shift.id).length;
              const isSelected = selectedShiftFilter === shift.id;

              return (
                <div
                  key={shift.id}
                  onClick={() => setSelectedShiftFilter(isSelected ? 'TODOS' : shift.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-gradient-to-br ${shift.bgColor} ${
                    isSelected
                      ? `ring-2 ring-indigo-600 ${shift.borderColor} shadow-md`
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black border bg-white shadow-xs">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {shift.arrivalTime}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${shift.badgeColor}`}>
                      {count} na escala
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900 mt-2">{shift.name}</h3>
                  <p className="text-[10px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {shift.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-semibold text-slate-500">
                    <span>Filtrar este turno</span>
                    <span>{isSelected ? 'Ativo ✓' : 'Ver todos'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Roteiro do Briefing Diário do Turno */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 rounded-2xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500 text-white shadow-sm">
                  <Volume2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Roteiro do Briefing Diário ({isLunch ? 'Turno Almoço' : 'Turno Jantar'})
                  </h3>
                  <p className="text-[11px] text-slate-500">Reúna os colaboradores 15 minutos antes de cada posto</p>
                </div>
              </div>

              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-50 transition-all cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

            <div className="bg-white/90 p-3 rounded-xl border border-amber-200/80 text-xs text-slate-800 leading-relaxed font-serif italic shadow-inner">
              "{briefingScript}"
            </div>
          </div>

          {/* Lista de Colaboradores e Onde Estão Escalados */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Quadro de Escala Operacional {selectedShiftFilter !== 'TODOS' ? `(${STORE_SHIFTS[selectedShiftFilter].name})` : ''}
                </h3>
                <p className="text-xs text-slate-400">
                  {filteredSchedule.length} colaborador(es) listados para consulta imediata de posto e horário
                </p>
              </div>

              {selectedShiftFilter !== 'TODOS' && (
                <button
                  onClick={() => setSelectedShiftFilter('TODOS')}
                  className="text-xs text-indigo-700 font-bold hover:underline cursor-pointer"
                >
                  Limpar filtro de turno
                </button>
              )}
            </div>

            {filteredSchedule.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Nenhuma escala cadastrada para hoje</p>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-0.5">
                  Quando o RH enviar a planilha de escala em Excel, clique em "Colar do Excel RH" para carregar automaticamente todos os colaboradores nos seus respectivos turnos e postos.
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    Colar Dados do RH
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300 transition-all cursor-pointer"
                  >
                    Inserir Manualmente
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredSchedule.map((entry) => {
                  const shiftDef = STORE_SHIFTS[entry.shiftId];
                  return (
                    <div key={entry.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs shrink-0">
                          {entry.employeeName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate">{entry.employeeName}</span>
                          <span className="text-[11px] text-slate-500">
                            {entry.role} &bull; {entry.department}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Turno */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${shiftDef.badgeColor}`}>
                          <Clock className="w-3 h-3" />
                          {shiftDef.arrivalTime} - {shiftDef.name}
                        </span>

                        {/* Posto / Onde está escalado */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {entry.station}
                        </span>

                        <button
                          onClick={() => {
                            removeShiftEntry(entry.id);
                            refreshEntries();
                          }}
                          className="text-slate-300 hover:text-rose-600 transition-all text-xs font-bold p-1 cursor-pointer"
                          title="Remover colaborador da escala"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ranking de Vendas Adicionais (Upselling Salão) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Venda Sugestiva & Desempenho do Salão</h3>
              </div>
              <span className="text-xs text-slate-400">Pontuação de Sobremesas & Bebidas</span>
            </div>

            {waitstaff.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">Nenhum dado de venda sugestiva registrado para o turno atual.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {waitstaff
                  .sort((a, b) => (b.upsellingScore || 0) - (a.upsellingScore || 0))
                  .map((attendant, idx) => (
                    <div key={attendant.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            idx === 0
                              ? 'bg-amber-400 text-amber-950 font-black shadow-sm'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-800'
                              : 'bg-amber-800/30 text-amber-900'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-800 block">{attendant.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {attendant.tablesServedToday} mesas atendidas hoje
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-emerald-700 block">{attendant.upsellingScore} pts</span>
                        <span className="text-[10px] text-slate-400">Ativo</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Colar Planilha Excel do RH */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Importar Escala do RH (Excel)</h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Copie as células da planilha que o RH enviou no Excel e cole no campo abaixo.
              O sistema detecta automaticamente o nome, cargo, posto e o horário do turno (08h, 10h, 12h ou 14h).
            </p>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-mono">
              Formato esperado (separado por coluna ou Tab):<br />
              <span className="text-slate-800 font-bold">Colaborador | Cargo | Turno | Posto/Estação</span><br />
              Exemplo: <em>João Silva | Garçom | 10h | Praça 1 - Mesas 1 a 8</em>
            </div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Cole as linhas da planilha Excel aqui..."
              rows={6}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
            />

            {importStatus && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{importStatus}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportExcel}
                disabled={!importText.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Processar Escala</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Colaborador Manualmente na Escala */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateColab}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Novo Colaborador na Escala</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Nome do Colaborador *</label>
              <input
                type="text"
                required
                value={newColab.name}
                onChange={(e) => setNewColab({ ...newColab, name: e.target.value })}
                placeholder="Ex: Carlos Augusto Silva"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Cargo</label>
                <input
                  type="text"
                  value={newColab.role}
                  onChange={(e) => setNewColab({ ...newColab, role: e.target.value })}
                  placeholder="Ex: Garçom / Cozinheiro"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Setor</label>
                <select
                  value={newColab.department}
                  onChange={(e) => setNewColab({ ...newColab, department: e.target.value as any })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                >
                  <option value="SALAO">Salão</option>
                  <option value="COZINHA">Cozinha</option>
                  <option value="BAR">Bar</option>
                  <option value="GESTAO">Gestão / Líderes</option>
                  <option value="HIGIENIZACAO">Higienização</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Turno Oficial</label>
              <select
                value={newColab.shiftId}
                onChange={(e) => setNewColab({ ...newColab, shiftId: e.target.value as any })}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
              >
                <option value="ABERTURA_08H">08:00 - Equipe de Abertura</option>
                <option value="ATENDENTES_10H">10:00 - Equipe de Atendentes</option>
                <option value="GESTAO_12H">12:00 - Equipe de Gestão e Líderes</option>
                <option value="FECHAMENTO_14H">14:00 - Equipe de Fechamento</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Posto / Onde está escalado</label>
              <input
                type="text"
                value={newColab.station}
                onChange={(e) => setNewColab({ ...newColab, station: e.target.value })}
                placeholder="Ex: Praça 2 (Mesas 11 a 20) / Grelha / Chopeiras"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Salvar na Escala
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
