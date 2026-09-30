import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Timer,
  CheckCircle2,
  Clock,
  Phone,
  UserPlus,
  Send,
  AlertTriangle,
  Flame,
  Tv,
  Smartphone,
  RotateCcw,
  Sparkles,
  ExternalLink,
  X,
  Volume2,
  Check,
  Search,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  WaitingCustomer,
  QueueTable,
  QueueLogRecord,
} from '../../types/waitingQueue.types';
import { waitingQueueStore } from '../../services/waitingQueueStore';

export const WaitingQueueView: React.FC = () => {
  const [queue, setQueue] = useState<WaitingCustomer[]>([]);
  const [tables, setTables] = useState<QueueTable[]>([]);
  const [logs, setLogs] = useState<QueueLogRecord[]>([]);

  // Formulário de novo cliente
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPartySize, setNewPartySize] = useState<number>(2);
  const [newNotes, setNewNotes] = useState('');

  // Filtros da fila
  const [filterStatus, setFilterStatus] = useState<'TODOS' | 'WAITING' | 'CALLED' | 'SEATED' | 'EXPIRED'>('WAITING');
  const [searchQuery, setSearchQuery] = useState('');

  // Modais
  const [showTvMode, setShowTvMode] = useState(false);
  const [showPhoneSimulator, setShowPhoneSimulator] = useState(false);
  const [selectedCustomerForPhone, setSelectedCustomerForPhone] = useState<WaitingCustomer | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [selectedTableForRelease, setSelectedTableForRelease] = useState<QueueTable | null>(null);
  const [manualTableNumber, setManualTableNumber] = useState('');
  const [onTheWayMap, setOnTheWayMap] = useState<Record<string, boolean>>({});

  // Relógio em tempo real para cronômetro regressivo
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    // Sincronizar dados do store
    const updateState = () => {
      setQueue(waitingQueueStore.getQueue());
      setTables(waitingQueueStore.getTables());
      setLogs(waitingQueueStore.getLogs());
    };

    updateState();
    const unsubscribe = waitingQueueStore.subscribe(updateState);

    // Timer a cada 1s para atualizar o cronômetro visual
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  // Formatação de telefone brasileira
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 2) {
      setNewPhone(raw.length ? `(${raw}` : '');
    } else if (raw.length <= 7) {
      setNewPhone(`(${raw.slice(0, 2)}) ${raw.slice(2)}`);
    } else {
      setNewPhone(`(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`);
    }
  };

  // Submeter novo cliente
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    waitingQueueStore.addToQueue({
      name: newName,
      phone: newPhone || '(92) 99123-4567',
      partySize: newPartySize,
      notes: newNotes,
    });

    setNewName('');
    setNewPhone('');
    setNewNotes('');
    setNewPartySize(2);
  };

  // Clientes chamados ativos
  const calledCustomers = useMemo(() => {
    return queue.filter((c) => c.status === 'CALLED');
  }, [queue]);

  // Clientes aguardando ordenados
  const waitingCustomers = useMemo(() => {
    return waitingQueueStore.getWaitingCustomers();
  }, [queue]);

  // Fila filtrada para exibição
  const filteredQueue = useMemo(() => {
    return queue
      .filter((c) => {
        if (filterStatus === 'TODOS') return true;
        return c.status === filterStatus;
      })
      .filter((c) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.assignedTableNumber && c.assignedTableNumber.includes(q))
        );
      })
      .sort((a, b) => {
        // Chamados primeiro, depois aguardando mais antigos
        if (a.status === 'CALLED' && b.status !== 'CALLED') return -1;
        if (b.status === 'CALLED' && a.status !== 'CALLED') return 1;
        if (a.status === 'WAITING' && b.status === 'WAITING') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [queue, filterStatus, searchQuery]);

  // Cálculo do tempo restante em segundos para um cliente chamado
  const getRemainingSeconds = (expiresAtStr?: string) => {
    if (!expiresAtStr) return 0;
    const diff = new Date(expiresAtStr).getTime() - now;
    return Math.max(0, Math.ceil(diff / 1000));
  };

  // Formatar segundos em mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Abrir modal de liberação da mesa
  const handleOpenReleaseModal = (table: QueueTable) => {
    setSelectedTableForRelease(table);
    setManualTableNumber(table.number);
    setShowReleaseModal(true);
  };

  // Executar liberação da mesa com a REGRA DE OURO
  const handleConfirmReleaseTable = (tableNumber: string) => {
    const result = waitingQueueStore.releaseTableAndCallNext(tableNumber);
    setShowReleaseModal(false);
    setSelectedTableForRelease(null);
  };

  // Chamar manualmente um cliente específico para uma mesa
  const handleCallCustomer = (customerId: string, tableNumber: string) => {
    const result = waitingQueueStore.callCustomerForTable(customerId, tableNumber);
    if (!result.success) {
      alert(result.message);
    }
  };

  // Simular clique no WhatsApp
  const handleOpenWhatsApp = (customer: WaitingCustomer) => {
    if (customer.whatsappUrl) {
      window.open(customer.whatsappUrl, '_blank');
    }
  };

  // Estatísticas do Topo
  const totalWaiting = waitingCustomers.length;
  const totalSeated = queue.filter((c) => c.status === 'SEATED').length;
  const totalPeopleWaiting = waitingCustomers.reduce((acc, c) => acc + c.partySize, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* CABEÇALHO DA RECEPÇÃO & FILA */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Efeito Glow decorativo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Recepção da Porta • Dionísio & Engenho
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Fila de Espera Inteligente</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                REGRA DOS 2 MINUTOS
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Sistema automático de chamada com cronômetro estrito de 2 minutos e <strong>alocação por compatibilidade de capacidade</strong> (mesas para 2, 4, 6, 8, 10, 14, 20 lugares).
            </p>
          </div>

          {/* Botões de Ação do Cabeçalho */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowTvMode(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 transition-all shadow-md hover:scale-105 cursor-pointer"
              title="Exibir no painel de TV da recepção para os clientes"
            >
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>Modo Telão / TV da Porta</span>
            </button>

            <button
              onClick={() => {
                if (calledCustomers.length > 0) {
                  setSelectedCustomerForPhone(calledCustomers[0]);
                } else if (waitingCustomers.length > 0) {
                  setSelectedCustomerForPhone(waitingCustomers[0]);
                } else if (queue.length > 0) {
                  setSelectedCustomerForPhone(queue[0]);
                }
                setShowPhoneSimulator(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold border border-indigo-400/40 transition-all shadow-md hover:scale-105 cursor-pointer"
              title="Visualizar a tela do cliente no WhatsApp"
            >
              <Smartphone className="w-4 h-4 text-indigo-200" />
              <span>Ver Celular do Cliente</span>
            </button>

            <button
              onClick={() => waitingQueueStore.resetToScenario()}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
              title="Recarrega o cenário de teste oficial com clientes de 6, 14 e 2 pessoas"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Resetar Demonstração</span>
            </button>
          </div>
        </div>

        {/* CARDS DE KPIS DA FILA */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Aguardando na Fila</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{totalWaiting}</span>
              <span className="text-xs text-slate-400 font-medium">grupos ({totalPeopleWaiting} pessoas)</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Mesas Chamadas (Timer)</span>
              <Timer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400">{calledCustomers.length}</span>
              <span className="text-xs text-amber-300 font-semibold">2 min ativos</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Sentados Hoje</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{totalSeated}</span>
              <span className="text-xs text-emerald-300/80 font-medium">atendidos</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Mesas Livres Agora</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {tables.filter((t) => t.status === 'LIVRE').length}
              </span>
              <span className="text-xs text-slate-400 font-medium">de {tables.length} mesas</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO PRINCIPAL: ALERTA CRÍTICO DE CLIENTES CHAMADOS (TIMER DOS 2 MINUTOS) */}
      {calledCustomers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Timer className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Mesas Liberadas Aguardando Apresentação na Porta (Regra dos 2 Minutos)</span>
            </h2>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {calledCustomers.length} cliente{calledCustomers.length > 1 ? 's' : ''} chamado{calledCustomers.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calledCustomers.map((cust) => {
              const secondsLeft = getRemainingSeconds(cust.expiresAt);
              const progressPct = (secondsLeft / 120) * 100;
              const isUrgent = secondsLeft <= 30;

              return (
                <div
                  key={cust.id}
                  className={`rounded-2xl p-5 border shadow-lg transition-all relative overflow-hidden ${
                    isUrgent
                      ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-400/50 animate-pulse'
                      : 'bg-gradient-to-br from-amber-50/90 to-orange-50/60 border-amber-300 ring-1 ring-amber-300'
                  }`}
                >
                  {/* Barra de progresso do timer no topo */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-slate-200">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        isUrgent ? 'bg-rose-600' : secondsLeft <= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 mt-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-black text-sm tracking-wider shadow-sm">
                          MESA {cust.assignedTableNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                          Capacidade: {cust.assignedTableCapacity} pessoas
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mt-2 flex items-center gap-2">
                        {cust.name}
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          {cust.partySize} {cust.partySize === 1 ? 'pessoa' : 'pessoas'}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {cust.phone}
                      </p>
                    </div>

                    {/* Cronômetro Gigante */}
                    <div className="text-right">
                      <div
                        className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                          isUrgent ? 'text-rose-600' : secondsLeft <= 60 ? 'text-amber-600' : 'text-emerald-700'
                        }`}
                      >
                        {formatTimer(secondsLeft)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {isUrgent ? 'Tempo Quase Esgotado!' : 'Tempo Restante'}
                      </span>
                    </div>
                  </div>

                  {/* Aviso da Regra de Ouro */}
                  <div className="mt-3 bg-white/80 rounded-xl p-2.5 border border-amber-200/80 text-xs text-slate-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Se não comparecer até <strong>00:00</strong>, a mesa será <strong>automaticamente transferida</strong> para o próximo cliente compatível da fila!
                    </span>
                  </div>

                  {/* Ações Rápidas do Atendente */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/80">
                    <button
                      onClick={() => waitingQueueStore.seatCustomer(cust.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Chegou! Sentar à Mesa</span>
                    </button>

                    <button
                      onClick={() => handleOpenWhatsApp(cust)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                      title="Abrir WhatsApp com a mensagem da mesa e aviso dos 2min"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => waitingQueueStore.expireAndAutoAssignNext(cust.id)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs border border-rose-300 transition-all cursor-pointer"
                      title="Expirar imediatamente e passar para o próximo compatível"
                    >
                      <span>Não Chegou / Pular</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GRID PRINCIPAL: FORMULÁRIO DE ENTRADA + FILA ATIVA + MAPA DE MESAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA ESQUERDA (4 colunas): CADASTRO RÁPIDO DO CLIENTE NA PORTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Novo Cliente na Porta</h3>
                <p className="text-xs text-slate-500">Cadastre a chegada para entrar na fila inteligente</p>
              </div>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              {/* Nome do Cliente */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nome do Titular *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pedro Henrique / Família Souza"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Quantidade de Pessoas com Botões Rápidos */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quantidade de Pessoas: <span className="text-indigo-600 font-extrabold">{newPartySize}</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Mesas para 2 a 20</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 20].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setNewPartySize(num)}
                      className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        newPartySize === num
                          ? 'bg-indigo-600 text-white shadow-md scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {num}p
                    </button>
                  ))}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Ou digite:</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newPartySize}
                    onChange={(e) => setNewPartySize(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold text-center"
                  />
                  <span className="text-xs text-slate-500">pessoas</span>
                </div>
              </div>

              {/* WhatsApp do Cliente */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  WhatsApp com DDD *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="(92) 99123-4567"
                    value={newPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  O cliente receberá a mensagem oficial com o cronômetro de 2 minutos assim que a mesa liberar.
                </p>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Observações / Preferências
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cadeira de bebê, aniversário, varanda"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:shadow-indigo-500/20 hover:scale-[1.01]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Colocar Cliente na Fila</span>
              </button>
            </form>
          </div>

          {/* Destaque Explicativo da Regra de Ouro */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-indigo-500/30 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Regra de Compatibilidade de Mesas</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Quando uma mesa é liberada (ex: mesa para <strong>2 pessoas</strong>), o sistema busca o primeiro cliente da fila cujo grupo caiba nela.
            </p>
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 text-[11px] space-y-1.5 font-mono text-slate-300">
              <div className="text-amber-300 font-bold">Exemplo Prático:</div>
              <div>1º na fila: Família (6p) ❌ não cabe</div>
              <div>2º na fila: Empresa (14p) ❌ não cabe</div>
              <div className="text-emerald-400 font-bold">3º na fila: Casal (2p) ✅ COMPATÍVEL!</div>
              <div className="text-xs text-slate-400 pt-1 font-sans">
                A mesa de 2 é enviada diretamente ao Casal com o timer de 2 minutos. Os outros continuam aguardando mesas para 6 e 14.
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA CENTRAL E DIREITA (8 colunas): FILA ATIVA + GRID DE MESAS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PAINEL DE CONTROLE DA FILA */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Fila de Espera em Tempo Real ({filteredQueue.length})
                </h3>
              </div>

              {/* Barra de Pesquisa */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, fone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white w-full sm:w-60"
                />
              </div>
            </div>

            {/* Abas de Filtros de Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'WAITING', label: `Aguardando (${waitingCustomers.length})` },
                { id: 'CALLED', label: `Chamados (${calledCustomers.length})` },
                { id: 'SEATED', label: `Sentados (${totalSeated})` },
                { id: 'TODOS', label: `Todos (${queue.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    filterStatus === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* LISTAGEM DOS CLIENTES NA FILA */}
            {filteredQueue.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">Nenhum cliente nesta lista</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {filterStatus === 'WAITING'
                    ? 'A fila está limpa no momento! Todos os clientes foram atendidos.'
                    : 'Altere os filtros acima para visualizar o histórico.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQueue.map((cust, idx) => {
                  const isCalled = cust.status === 'CALLED';
                  const isWaiting = cust.status === 'WAITING';
                  const isSeated = cust.status === 'SEATED';
                  const isExpired = cust.status === 'EXPIRED';

                  // Tempo decorrido de espera
                  const waitMinutes = Math.floor(
                    (now - new Date(cust.createdAt).getTime()) / (60 * 1000)
                  );

                  return (
                    <div
                      key={cust.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCalled
                          ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
                          : isWaiting
                          ? 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Posição e Dados */}
                        <div className="flex items-start gap-3">
                          {/* Badge de Posição Ordinal */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs font-mono shrink-0 shadow-xs ${
                              isCalled
                                ? 'bg-amber-500 text-white animate-pulse'
                                : isWaiting
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isWaiting && cust.queuePosition ? `${cust.queuePosition}º` : isCalled ? '⏳' : isSeated ? '✅' : '❌'}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-900">
                                {cust.name}
                              </span>

                              {/* Badge de Pessoas */}
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-extrabold flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {cust.partySize} {cust.partySize === 1 ? 'pessoa' : 'pessoas'}
                              </span>

                              {/* Status Badge */}
                              {isCalled && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                  Mesa {cust.assignedTableNumber} • 2min Ativo
                                </span>
                              )}
                              {isSeated && (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                                  Sentado Mesa {cust.assignedTableNumber}
                                </span>
                              )}
                              {isExpired && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                                  Perdeu a Vez (Tempo Esgotado)
                                </span>
                              )}
                            </div>

                            {/* Detalhes de Contato e Tempo */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {cust.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                Espera: <strong className="text-slate-700">{waitMinutes} min</strong>
                              </span>
                              {cust.notes && (
                                <span className="italic text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  "{cust.notes}"
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Ações para o Atendente */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {isWaiting && (
                            <>
                              {/* Seletor Rápido de Mesa para Chamar */}
                              <div className="flex items-center gap-1.5">
                                <select
                                  id={`table-select-${cust.id}`}
                                  className="text-xs px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                                  defaultValue=""
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleCallCustomer(cust.id, e.target.value);
                                    }
                                  }}
                                >
                                  <option value="" disabled>
                                    Atribuir Mesa...
                                  </option>
                                  {tables
                                    .filter((t) => t.status === 'LIVRE' && t.capacity >= cust.partySize)
                                    .map((t) => (
                                      <option key={t.id} value={t.number}>
                                        Mesa {t.number} ({t.capacity}p - {t.area})
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedCustomerForPhone(cust);
                                  setShowPhoneSimulator(true);
                                }}
                                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-all cursor-pointer"
                                title="Pré-visualizar tela do cliente"
                              >
                                <Smartphone className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => waitingQueueStore.cancelCustomer(cust.id, 'Desistência no salão')}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
                                title="Remover da fila / Desistiu"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {isCalled && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => waitingQueueStore.seatCustomer(cust.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Sentou</span>
                              </button>

                              <button
                                onClick={() => handleOpenWhatsApp(cust)}
                                className="p-2 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-all cursor-pointer"
                                title="Reenviar WhatsApp"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* GESTÃO DE MESAS DO RESTAURANTE (2 a 20 LUGARES) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Mesas do Restaurante por Capacidade</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                    {tables.length} mesas cadastradas
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ao liberar qualquer mesa, o sistema chama automaticamente o 1º cliente compatível da fila com a regra dos 2 minutos.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Livre
                </span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Chamando (2min)
                </span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Ocupada
                </span>
              </div>
            </div>

            {/* Grid de Mesas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tables.map((tbl) => {
                const isFree = tbl.status === 'LIVRE';
                const isCalling = tbl.status === 'CHAMANDO';
                const isOccupied = tbl.status === 'OCUPADA';

                return (
                  <div
                    key={tbl.id}
                    className={`rounded-xl p-3 border transition-all text-left relative ${
                      isCalling
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                        : isFree
                        ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-500 hover:shadow-sm'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono font-black text-slate-900">
                          MESA {tbl.number}
                        </span>
                        <div className="text-[11px] font-bold text-indigo-700 mt-0.5">
                          {tbl.capacity} pessoas
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          isCalling
                            ? 'bg-amber-200 text-amber-900 animate-pulse'
                            : isFree
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tbl.status}
                      </span>
                    </div>

                    {isCalling && (
                      <div className="mt-2 text-[11px] text-amber-900 font-semibold truncate">
                        👤 {tbl.currentCustomerName} ({tbl.currentCustomerPartySize}p)
                      </div>
                    )}

                    {isOccupied && (
                      <div className="mt-2 text-[10px] text-slate-500">
                        Em atendimento
                      </div>
                    )}

                    {/* Botão de Liberação / Ação da Mesa */}
                    <div className="mt-3 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => handleOpenReleaseModal(tbl)}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          isFree
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        <span>{isFree ? 'Chamar Fila' : 'Liberar Mesa'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HISTÓRICO RECENTE DE EVENTOS E AUDITORIA DA FILA */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Auditoria & Histórico em Tempo Real da Fila</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Kernel de Segurança Ativo</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
              {logs.slice(0, 8).map((log) => (
                <div key={log.id} className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-start gap-2">
                  <span className="text-slate-400 text-[10px] shrink-0 mt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                  <div className="text-slate-200 text-xs">
                    {log.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: LIBERAÇÃO DE MESA COM PREVISÃO DA REGRA DE COMPATIBILIDADE      */}
      {/* ========================================================================= */}
      {showReleaseModal && selectedTableForRelease && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black font-mono">
                  M{selectedTableForRelease.number}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Liberar Mesa Nº {selectedTableForRelease.number}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Capacidade: <strong>{selectedTableForRelease.capacity} pessoas</strong> • {selectedTableForRelease.area}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReleaseModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulação da Regra de Ouro */}
            {(() => {
              const compatibleCandidate = waitingQueueStore.findNextCompatibleCustomer(
                selectedTableForRelease.capacity
              );

              return (
                <div className="space-y-4">
                  {compatibleCandidate ? (
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Próximo Cliente Compatível Identificado!</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
                        <div>
                          <div className="font-extrabold text-sm text-slate-900">
                            {compatibleCandidate.name}
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            {compatibleCandidate.phone}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-extrabold text-xs">
                            {compatibleCandidate.partySize} pessoas
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {compatibleCandidate.queuePosition}º na fila geral
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-emerald-900 leading-relaxed">
                        Ao confirmar a liberação, o sistema irá automaticamente:
                        <br />• Vincular a <strong>Mesa {selectedTableForRelease.number}</strong> ao cliente.
                        <br />• Disparar a notificação oficial do <strong>WhatsApp</strong>.
                        <br />• Iniciar o <strong>cronômetro oficial de 2 minutos</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-slate-600 text-xs space-y-1">
                      <div className="font-bold text-slate-800">Nenhum cliente compatível aguardando</div>
                      <p>
                        A fila não possui grupos que caibam nesta mesa de {selectedTableForRelease.capacity} pessoas no momento. A mesa ficará com status <strong>LIVRE</strong> no salão.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowReleaseModal(false)}
                      className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmReleaseTable(selectedTableForRelease.number)}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirmar & Chamar (2 Min)</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MODO TELÃO / TV DA PORTA DO RESTAURANTE (KIOSK MODE)            */}
      {/* ========================================================================= */}
      {showTvMode && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
          {/* Header do Telão */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Flame className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  ENGENHO COZINHA BRASILEIRA
                </h1>
                <p className="text-sm sm:text-base text-slate-400">
                  Painel Oficial de Fila de Espera • Recepção Manauara Shopping
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowTvMode(false)}
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span>Fechar Modo TV</span>
            </button>
          </div>

          {/* Área Central: Mesas Chamadas em Destaque Gigante */}
          <div className="my-8 space-y-6">
            <div className="text-center space-y-2">
              <span className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-extrabold uppercase tracking-widest animate-pulse">
                Dirija-se à Recepção da Porta
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-200">
                Mesas Chamadas com Cronômetro de 2 Minutos
              </h2>
            </div>

            {calledCustomers.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 max-w-2xl mx-auto">
                <Timer className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-slate-400">Nenhuma mesa aguardando no momento</h3>
                <p className="text-sm text-slate-500 mt-1">Acompanhe a sua posição na lista abaixo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {calledCustomers.map((cust) => {
                  const secondsLeft = getRemainingSeconds(cust.expiresAt);
                  const isUrgent = secondsLeft <= 30;

                  return (
                    <div
                      key={cust.id}
                      className={`p-8 rounded-3xl border-2 text-center space-y-4 shadow-2xl relative overflow-hidden ${
                        isUrgent
                          ? 'bg-rose-950/70 border-rose-500 animate-pulse'
                          : 'bg-slate-900 border-amber-400'
                      }`}
                    >
                      <div className="inline-block px-5 py-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl font-mono shadow-md">
                        MESA Nº {cust.assignedTableNumber}
                      </div>

                      <div className="text-3xl sm:text-4xl font-black text-white">
                        {cust.name}
                      </div>

                      <div className="text-sm text-slate-400">
                        Grupo para {cust.partySize} pessoas
                      </div>

                      {/* Timer Gigante para a TV */}
                      <div className="bg-slate-950/90 py-4 px-6 rounded-2xl border border-slate-800 inline-block mx-auto">
                        <div
                          className={`text-5xl sm:text-6xl font-black font-mono tracking-wider ${
                            isUrgent ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {formatTimer(secondsLeft)}
                        </div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          Tempo para comparecer à porta
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Próximos na Fila (Lista Compacta) */}
            <div className="mt-8 max-w-4xl mx-auto">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
                Próximos Clientes na Fila de Espera
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {waitingCustomers.slice(0, 8).map((cust, i) => (
                  <div
                    key={cust.id}
                    className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center"
                  >
                    <div className="text-xs font-mono font-bold text-amber-400">
                      {i + 1}º da Fila
                    </div>
                    <div className="text-sm font-extrabold text-white mt-1 truncate">
                      {cust.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {cust.partySize} pessoas
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rodapé do Telão */}
          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-900">
            TK Gestão e Tecnologia • Sistema de Recepção Dionísio & Engenho
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SIMULADOR DA TELA DO CLIENTE NO WHATSAPP                        */}
      {/* ========================================================================= */}
      {showPhoneSimulator && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-700 space-y-4 relative">
            <button
              onClick={() => setShowPhoneSimulator(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Simulador do Celular do Cliente
              </span>
              <h3 className="text-lg font-black text-white">Visualização no Smartphone</h3>
              <p className="text-xs text-slate-400">
                Página que o cliente abre ao clicar no link do WhatsApp
              </p>
            </div>

            {/* Carcaça do Celular */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-4 shadow-inner text-center">
              <div className="w-12 h-1 rounded-full bg-slate-800 mx-auto" />

              {selectedCustomerForPhone ? (
                (() => {
                  const cust = selectedCustomerForPhone;
                  const isCalled = cust.status === 'CALLED';
                  const secondsLeft = getRemainingSeconds(cust.expiresAt);
                  const isUrgent = secondsLeft <= 30;

                  return (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-medium">Restaurante Engenho</div>
                        <h4 className="text-lg font-extrabold text-white">
                          Olá, {cust.name}!
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">
                          Mesa para {cust.partySize} pessoas
                        </span>
                      </div>

                      {isCalled ? (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            🎉 SUA MESA ESTÁ PRONTA!
                          </div>
                          <div className="text-3xl font-black text-amber-300 font-mono">
                            MESA {cust.assignedTableNumber}
                          </div>

                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <div
                              className={`text-4xl font-black font-mono ${
                                isUrgent ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            >
                              {formatTimer(secondsLeft)}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">
                              Tempo restante para comparecer
                            </div>
                          </div>

                          <p className="text-xs text-slate-300">
                            Por favor, dirija-se à nossa recepção na porta agora mesmo para não perder a sua vez.
                          </p>

                          <button
                            onClick={() => {
                              setOnTheWayMap((prev) => ({ ...prev, [cust.id]: true }));
                              try {
                                waitingQueueStore.addLogEntry(
                                  `Cliente ${cust.name} (Mesa ${cust.assignedTableNumber}) confirmou via app que está a caminho da recepção.`,
                                  'CLIENTE_SENTOU'
                                );
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            disabled={!!onTheWayMap[cust.id]}
                            className={`w-full py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all ${
                              onTheWayMap[cust.id]
                                ? 'bg-emerald-700 text-white border border-emerald-500 cursor-default'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-98'
                            }`}
                          >
                            {onTheWayMap[cust.id]
                              ? '✓ Hostess Notificada: Estamos aguardando você na porta!'
                              : 'Estou a Caminho da Porta!'}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                          <Clock className="w-8 h-8 text-blue-400 mx-auto" />
                          <div className="text-sm font-bold text-white">Você está na fila de espera</div>
                          <div className="text-2xl font-black text-blue-400 font-mono">
                            {cust.queuePosition || 1}º LUGAR
                          </div>
                          <p className="text-xs text-slate-400">
                            Assim que uma mesa compatível de {cust.partySize} pessoas for liberada, você receberá a chamada com 2 minutos para se apresentar.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="text-xs text-slate-500 py-8">Nenhum cliente selecionado</div>
              )}
            </div>

            <button
              onClick={() => setShowPhoneSimulator(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              Fechar Simulador
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
