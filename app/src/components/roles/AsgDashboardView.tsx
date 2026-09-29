// ============================================================
// PAINEL EXCLUSIVO DO ASG (ACESSO 30)
// Ambiente Simplificado • Checklists de Limpeza, Cronograma, Ponto & IA
// ============================================================

import React, { useState } from 'react';
import {
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  UserCheck,
  ShieldCheck,
  Flame,
  ArrowRight,
  Plus,
  Send,
  Check,
} from 'lucide-react';
import type { UserAccount } from '../../types/restaurant.types';
import { getContextualAiProfile } from '../../services/contextualAiService';
import { recordAuditAction } from '../../services/auditTrailStore';

interface AsgDashboardViewProps {
  currentUser: UserAccount;
}

interface CleaningTask {
  id: string;
  area: string;
  timeSlot: string;
  priority: 'ALTA' | 'NORMAL' | 'ROTINA';
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
}

export const AsgDashboardView: React.FC<AsgDashboardViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'checklists' | 'cronograma' | 'ocorrencias' | 'ponto'>('checklists');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // IA Contextual da Limpeza
  const aiProfile = getContextualAiProfile(currentUser);

  // Checklists de Limpeza em Tempo Real
  const [tasks, setTasks] = useState<CleaningTask[]>([
    {
      id: 'clean-1',
      area: 'Câmara Fria & Ante-câmara (Desinfecção de piso e prateleiras)',
      timeSlot: '10:30',
      priority: 'ALTA',
      completed: false,
    },
    {
      id: 'clean-2',
      area: 'Banheiro Feminino dos Clientes (Higienização completa e reposição)',
      timeSlot: '11:45',
      priority: 'ALTA',
      completed: false,
    },
    {
      id: 'clean-3',
      area: 'Piso do Salão Principal (Higienização pós-almoço)',
      timeSlot: '15:00',
      priority: 'ALTA',
      completed: false,
    },
    {
      id: 'clean-4',
      area: 'Vestiário dos Funcionários & Armários',
      timeSlot: '14:00',
      priority: 'NORMAL',
      completed: false,
    },
    {
      id: 'clean-5',
      area: 'Banheiro Masculino dos Clientes',
      timeSlot: '11:30',
      priority: 'NORMAL',
      completed: false,
    },
    {
      id: 'clean-6',
      area: 'Área de Descarte de Lixo & Reciclagem Externa',
      timeSlot: '16:30',
      priority: 'ROTINA',
      completed: false,
    },
  ]);

  // Registro de Ponto
  const [clockRecords, setClockRecords] = useState<Array<{ type: string; time: string; date: string; status: string }>>([]);

  // Ocorrências da Limpeza
  const [occurrences, setOccurrences] = useState<Array<{ id: string; desc: string; date: string; status: string }>>([]);
  const [newOccurrence, setNewOccurrence] = useState('');

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Marcar tarefa concluída
  const handleToggleTask = (task: CleaningTask) => {
    const updated = tasks.map((t) => {
      if (t.id === task.id) {
        const nextState = !t.completed;
        const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? now : undefined,
          completedBy: nextState ? currentUser.name : undefined,
        };
      }
      return t;
    });
    setTasks(updated);

    recordAuditAction({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      restaurantId: currentUser.restaurantId,
      module: 'LIMPEZA_CHECKLIST',
      action: !task.completed ? 'CONCLUIR_TAREFA_LIMPEZA' : 'DESMARCAR_TAREFA_LIMPEZA',
      previousValue: task.completed ? 'CONCLUIDA' : 'PENDENTE',
      newValue: !task.completed ? `Concluída por ${currentUser.name} (${currentUser.matricula})` : 'Pendente',
    });

    showNotification(
      !task.completed
        ? `✅ Limpeza de "${task.area}" confirmada no sistema!`
        : `Tarefa marcada como pendente novamente.`
    );
  };

  // Registrar Ponto
  const handleRegisterClock = () => {
    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setClockRecords([
      ...clockRecords,
      { type: 'Registro de Ponto', time: now, date: 'Hoje', status: 'CONFIRMADO' },
    ]);

    recordAuditAction({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      restaurantId: currentUser.restaurantId,
      module: 'PONTO_ELETRONICO',
      action: 'REGISTRO_PONTO_ASG',
      previousValue: null,
      newValue: `Batida de ponto às ${now} por ${currentUser.name} (${currentUser.matricula})`,
    });

    showNotification(`⏰ Ponto eletrônico registrado com sucesso às ${now}!`);
  };

  // Registrar Nova Ocorrência
  const handleCreateOccurrence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOccurrence.trim()) return;

    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setOccurrences([
      {
        id: `occ-${Date.now()}`,
        desc: newOccurrence.trim(),
        date: `Hoje ${now}`,
        status: 'Enviado à Supervisora',
      },
      ...occurrences,
    ]);

    recordAuditAction({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      restaurantId: currentUser.restaurantId,
      module: 'OCORRENCIAS_LIMPEZA',
      action: 'REGISTRAR_OCORRENCIA_ASG',
      previousValue: null,
      newValue: newOccurrence.trim(),
    });

    showNotification('📢 Ocorrência registrada e repassada para a Supervisora!');
    setNewOccurrence('');
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-6 text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-black text-sm flex items-center gap-2 border border-emerald-300 animate-slide-left">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner de Identificação ASG */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 p-6 border border-teal-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">Ambiente de Limpeza & ASG</h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Acesso 30 • Simplificado
                </span>
              </div>
              <p className="text-xs text-teal-200/80">
                Colaboradora: <strong className="text-white">{currentUser.name}</strong> • Matrícula:{' '}
                <strong className="text-amber-300">{currentUser.matricula || 'ASG-01'}</strong>
              </p>
            </div>
          </div>

          {/* Navegação Rápida */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-teal-800/40">
            <button
              onClick={() => setActiveTab('checklists')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'checklists' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-300 hover:text-white'
              }`}
            >
              Checklists ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('cronograma')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cronograma' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-300 hover:text-white'
              }`}
            >
              Cronograma do Turno
            </button>
            <button
              onClick={() => setActiveTab('ocorrencias')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ocorrencias' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-300 hover:text-white'
              }`}
            >
              Ocorrências
            </button>
            <button
              onClick={() => setActiveTab('ponto')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ponto' ? 'bg-teal-600 text-white shadow-md' : 'text-teal-300 hover:text-white'
              }`}
            >
              Meu Ponto & Escala
            </button>
          </div>
        </div>
      </div>

      {/* IA DA LIMPEZA: Alertas Proativos Contextuais */}
      <div className="rounded-2xl bg-teal-950/30 border border-teal-800/40 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600/30 flex items-center justify-center text-teal-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-sm font-black text-white">IA da Limpeza • Prioridades do Turno</h2>
          </div>
          <span className="text-[10px] font-bold text-teal-300 bg-teal-900/50 px-2 py-0.5 rounded-full">
            Tempo Real
          </span>
        </div>

        {aiProfile.alerts.length === 0 ? (
          <div className="p-4 rounded-xl bg-teal-900/20 border border-teal-800/30 text-center">
            <p className="text-xs text-teal-200 font-bold">Nenhum alerta de limpeza ou inconformidade sanitária.</p>
            <p className="text-[11px] text-teal-400 mt-0.5">Dia 1 de operação iniciado. Acompanhe os checklists diários para garantir os padrões ANVISA.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiProfile.alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-teal-900/30 border border-teal-800/30 hover:border-teal-600/50 transition-colors flex items-start gap-2.5"
              >
                <div className="w-6 h-6 rounded-md bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-white font-bold">{alert.title}</p>
                  <p className="text-[11px] text-teal-100 font-medium leading-relaxed mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUB-ABA: CHECKLISTS DE LIMPEZA */}
      {activeTab === 'checklists' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/30">
              <p className="text-[11px] font-bold text-teal-300 uppercase">Limpezas Pendentes</p>
              <p className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</p>
              <p className="text-[10px] text-amber-300/80 mt-1">Requerem atenção no turno</p>
            </div>
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/30">
              <p className="text-[11px] font-bold text-teal-300 uppercase">Concluídas Hoje</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{completedCount}</p>
              <p className="text-[10px] text-emerald-300/80 mt-1">Registradas com auditoria</p>
            </div>
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/30">
              <p className="text-[11px] font-bold text-teal-300 uppercase">Supervisora Responsável</p>
              <p className="text-base font-black text-white mt-1">Patrícia Lima</p>
              <p className="text-[10px] text-teal-300/80 mt-1">Validação administrativa</p>
            </div>
          </div>

          <div className="rounded-2xl bg-teal-950/30 border border-teal-800/40 p-5 space-y-4">
            <h3 className="text-sm font-black text-white">Tarefas de Limpeza & Higienização do Dia</h3>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    task.completed
                      ? 'bg-emerald-950/30 border-emerald-800/40 opacity-80'
                      : 'bg-slate-900/60 border-teal-800/40 hover:border-teal-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                        task.completed
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold ${
                          task.completed ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {task.area}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-teal-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Horário programado: {task.timeSlot}
                        </span>
                        {task.completedAt && (
                          <span className="text-[10px] text-emerald-400 font-bold">
                            • Concluído às {task.completedAt} por {task.completedBy}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      task.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : task.priority === 'ALTA'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {task.completed ? 'CONCLUÍDO' : `PRIORIDADE ${task.priority}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA: CRONOGRAMA DO TURNO */}
      {activeTab === 'cronograma' && (
        <div className="rounded-2xl bg-teal-950/30 border border-teal-800/40 p-6 space-y-4">
          <h2 className="text-base font-black text-white">Cronograma Oficial de Higienização por Turno</h2>
          <p className="text-xs text-teal-300">
            Escala fixa de procedimentos operacionais padronizados (POPs de Higiene da Anvisa).
          </p>

          <div className="space-y-3 mt-4">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-teal-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs font-black text-amber-400">08:00 - 09:30</span>
                <div>
                  <p className="text-xs font-bold text-white">Abertura: Sanitização de Salão & Banheiros</p>
                  <p className="text-[10px] text-teal-300">Desinfecção de maçanetas, mesas e reposição de papel</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded">
                Pendente
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-teal-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs font-black text-amber-400">10:30 - 11:30</span>
                <div>
                  <p className="text-xs font-bold text-white">Câmara Fria & Ante-câmara</p>
                  <p className="text-[10px] text-teal-300">Limpeza de estrados e sanitização antes do fluxo do almoço</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded">
                Pendente
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-teal-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs font-black text-amber-400">15:00 - 16:00</span>
                <div>
                  <p className="text-xs font-bold text-white">Troca de Turno & Salão das 15h</p>
                  <p className="text-[10px] text-teal-300">Aspiração, lavagem com detergente neutro e secagem rápida</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded">
                Pendente
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA: OCORRÊNCIAS */}
      {activeTab === 'ocorrencias' && (
        <div className="rounded-2xl bg-teal-950/30 border border-teal-800/40 p-6 space-y-6 max-w-2xl mx-auto">
          <div>
            <h2 className="text-base font-black text-white">Registrar Ocorrência da Limpeza</h2>
            <p className="text-xs text-teal-300">
              Notifique imediatamente a Supervisora sobre quebra de equipamentos, falta de material ou problemas estruturais.
            </p>
          </div>

          <form onSubmit={handleCreateOccurrence} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-teal-200 mb-1">Descrição do Problema / Ocorrência</label>
              <textarea
                rows={3}
                required
                value={newOccurrence}
                onChange={(e) => setNewOccurrence(e.target.value)}
                placeholder="Ex: Falta de desinfetante clorado, vazamento no lavatório do banheiro, etc."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-teal-700 text-xs text-white focus:outline-hidden focus:border-amber-400 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Enviar Ocorrência para a Supervisora</span>
            </button>
          </form>

          <div className="pt-4 border-t border-teal-800/40 space-y-3">
            <h3 className="text-xs font-black text-white uppercase">Histórico Recente de Ocorrências:</h3>
            {occurrences.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-teal-800/20 text-center text-xs text-slate-400">
                Nenhuma ocorrência registrada no momento.
              </div>
            ) : (
              occurrences.map((occ) => (
                <div
                  key={occ.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-teal-800/30 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{occ.desc}</p>
                    <p className="text-[10px] text-teal-300">{occ.date}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {occ.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-ABA: MEU PONTO & ESCALA */}
      {activeTab === 'ponto' && (
        <div className="rounded-2xl bg-teal-950/30 border border-teal-800/40 p-6 space-y-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-teal-800/40 pb-4">
            <div>
              <h2 className="text-base font-black text-white">Espelho de Ponto Eletrônico</h2>
              <p className="text-xs text-teal-300">
                Colaboradora: {currentUser.name} • Matrícula: {currentUser.matricula || 'ASG-01'}
              </p>
            </div>
            <button
              onClick={handleRegisterClock}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors shadow-lg flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-slate-950" />
              <span>Bater Ponto Agora</span>
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase">Registros de Hoje:</h3>
            {clockRecords.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-teal-800/20 text-center text-xs text-slate-400">
                Nenhum ponto registrado hoje. Clique em "Bater Ponto Agora" ao iniciar ou encerrar suas atividades.
              </div>
            ) : (
              clockRecords.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-teal-800/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white">{rec.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-amber-300">{rec.time}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                      {rec.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-teal-950/60 border border-teal-800/40 text-[11px] text-teal-200">
            <p className="font-bold text-white">Minha Escala Semanal:</p>
            <p className="mt-1">Segunda a Sábado • 08:00 às 16:20 • Folga Fixa: Domingo</p>
          </div>
        </div>
      )}
    </div>
  );
};
