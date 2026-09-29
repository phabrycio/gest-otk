import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  RefreshCw, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  XCircle, 
  User, 
  Clock, 
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { SystemAuditLog, AuditLogModule, AuditLogSeverity } from '../../types/auditLog.types';
import { getAuditLogs } from '../../services/auditLogStore';

interface AuditLogsViewProps {
  currentUserName: string;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ currentUserName }) => {
  const [logs, setLogs] = useState<SystemAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('TODOS');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('TODAS');
  const [timeRange, setTimeRange] = useState<'HOJE' | '7DIAS' | 'TODOS'>('TODOS');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filtragem dos logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Busca textual
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const detailsText = typeof log.details === 'string' ? log.details : (log.description || '');
        const matchesUser = log.userName.toLowerCase().includes(query);
        const matchesAction = log.action.toLowerCase().includes(query);
        const matchesDetails = detailsText.toLowerCase().includes(query);
        const matchesRole = log.userRole.toLowerCase().includes(query);
        const matchesRestaurant = log.restaurantName?.toLowerCase().includes(query);
        if (!matchesUser && !matchesAction && !matchesDetails && !matchesRole && !matchesRestaurant) {
          return false;
        }
      }

      // Módulo
      if (selectedModule !== 'TODOS' && log.module !== selectedModule) {
        return false;
      }

      // Gravidade
      if (selectedSeverity !== 'TODAS' && log.severity !== selectedSeverity) {
        return false;
      }

      // Período
      if (timeRange === 'HOJE') {
        const logDate = new Date(log.timestamp);
        const today = new Date();
        const isToday = 
          logDate.getDate() === today.getDate() &&
          logDate.getMonth() === today.getMonth() &&
          logDate.getFullYear() === today.getFullYear();
        if (!isToday) return false;
      } else if (timeRange === '7DIAS') {
        const logDate = new Date(log.timestamp).getTime();
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (logDate < sevenDaysAgo) return false;
      }

      return true;
    });
  }, [logs, searchQuery, selectedModule, selectedSeverity, timeRange]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = logs.length;
    const critical = logs.filter(l => l.severity === 'CRITICO' || l.severity === 'AVISO').length;
    const usersSet = new Set(logs.map(l => l.userId));
    return {
      total,
      critical,
      uniqueUsers: usersSet.size,
      lastAction: logs[0] ? new Date(logs[0].timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'
    };
  }, [logs]);

  // Exportação CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;

    const headers = ['ID', 'Data/Hora', 'Usuário', 'Cargo', 'Restaurante', 'Módulo', 'Ação', 'Severidade', 'Detalhes', 'IP'];
    const rows = filteredLogs.map(l => {
      const detailsStr = typeof l.details === 'string' ? l.details : (l.description || '');
      return [
        `"${l.id}"`,
        `"${new Date(l.timestamp).toLocaleString('pt-BR')}"`,
        `"${l.userName}"`,
        `"${l.userRole}"`,
        `"${l.restaurantName || 'Geral'}"`,
        `"${l.module}"`,
        `"${l.action.replace(/"/g, '""')}"`,
        `"${l.severity}"`,
        `"${detailsStr.replace(/"/g, '""')}"`,
        `"${l.ipAddress || l.ipOrDevice || 'Interno'}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `auditoria_sistema_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityBadge = (severity: AuditLogSeverity) => {
    switch (severity) {
      case 'CRITICO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Crítico
          </span>
        );
      case 'AVISO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Atenção
          </span>
        );
      case 'SUCESSO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sucesso
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Info className="w-3.5 h-3.5" />
            Info
          </span>
        );
    }
  };

  const getModuleBadge = (mod: string) => {
    const map: Record<string, { label: string; color: string }> = {
      AUTH: { label: 'Acesso & PIN', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
      AUTENTICACAO: { label: 'Acesso & PIN', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
      ESTOQUE: { label: 'Estoque', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
      FREEZER: { label: 'Freezer CDA', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
      FREEZER_CDA: { label: 'Freezer CDA', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
      CONFIGURACOES: { label: 'Config / Lojas', color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
      FINANCEIRO: { label: 'Financeiro', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
      RELATORIOS: { label: 'Relatórios', color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
      SISTEMA: { label: 'Sistema', color: 'bg-slate-500/10 text-slate-300 border-slate-500/20' },
    };
    const item = map[mod] || { label: mod, color: 'bg-slate-500/10 text-slate-300 border-slate-500/20' };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${item.color}`}>
        {item.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com badge de confidencialidade */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Lock className="w-3 h-3" />
                Área Restrita do Administrador Master
              </span>
              <span className="text-xs text-slate-400">ISO 27001 / Trilha Imutável</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              Auditoria & Rastreabilidade de Usuários
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Registro completo de todas as operações, trocas de usuário, movimentações de estoque, etiquetas CDA e alterações de parâmetros do restaurante.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700"
              title="Atualizar lista"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              Atualizar
            </button>

            <button
              onClick={handleExportCSV}
              disabled={filteredLogs.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Indicadores rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
            <div className="text-xs text-slate-400 font-medium">Total de Registros</div>
            <div className="text-xl font-bold text-white mt-0.5">{stats.total}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
            <div className="text-xs text-slate-400 font-medium">Usuários Distintos</div>
            <div className="text-xl font-bold text-slate-200 mt-0.5">{stats.uniqueUsers}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
            <div className="text-xs text-amber-400/90 font-medium">Alertas / Críticos</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">{stats.critical}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
            <div className="text-xs text-slate-400 font-medium">Última Ação</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{stats.lastAction}</div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por usuário (ex: Pabricio, Pedro), ação, detalhe ou loja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Filtros em Linha */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Módulo */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="TODOS">Todos os Módulos</option>
              <option value="AUTH">Acesso & PIN</option>
              <option value="ESTOQUE">Estoque</option>
              <option value="FREEZER">Freezer CDA</option>
              <option value="CONFIGURACOES">Configurações & Lojas</option>
              <option value="FINANCEIRO">Financeiro</option>
              <option value="RELATORIOS">Relatórios</option>
              <option value="SISTEMA">Sistema</option>
            </select>

            {/* Severidade */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="TODAS">Todas as Severidades</option>
              <option value="INFO">Apenas Info</option>
              <option value="SUCESSO">Apenas Sucesso</option>
              <option value="AVISO">Avisos</option>
              <option value="CRITICO">Críticos</option>
            </select>

            {/* Período */}
            <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setTimeRange('HOJE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeRange === 'HOJE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('7DIAS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeRange === '7DIAS' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                7 Dias
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('TODOS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeRange === 'TODOS' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tudo
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Exibindo <strong>{filteredLogs.length}</strong> de <strong>{logs.length}</strong> registros</span>
          {filteredLogs.length !== logs.length && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedModule('TODOS');
                setSelectedSeverity('TODAS');
                setTimeRange('TODOS');
              }}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Resetar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm">Carregando trilha de auditoria criptografada...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Info className="w-10 h-10 text-slate-600" />
            <p className="text-base font-semibold text-slate-300">Nenhum evento registrado com os filtros aplicados</p>
            <p className="text-xs text-slate-500">Tente buscar por outro termo ou selecione outro módulo.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const dateObj = new Date(log.timestamp);
              const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
              const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

              return (
                <div 
                  key={log.id} 
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                >
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Lado Esquerdo: Usuário, Ação e Módulo */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs shrink-0 mt-0.5">
                        {log.userName.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-sm">
                            {log.userName}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-medium">
                            {log.userRole}
                          </span>
                          {log.restaurantName && (
                            <span className="text-xs text-slate-500 font-normal">
                              • {log.restaurantName}
                            </span>
                          )}
                          {getModuleBadge(log.module)}
                          {getSeverityBadge(log.severity)}
                        </div>

                        <div className="text-sm text-slate-200 font-medium">
                          {log.action}
                        </div>

                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {typeof log.details === 'string' ? log.details : (log.description || log.action)}
                        </p>
                      </div>
                    </div>

                    {/* Lado Direito: Data/Hora e Botão Expandir */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-semibold text-slate-300 flex items-center sm:justify-end gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formattedTime}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {formattedDate}
                        </div>
                      </div>

                      <div className="text-slate-400 hover:text-white transition-colors p-1">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Detalhes expandidos */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-4 pt-1 bg-slate-950/40 border-t border-slate-800/50 text-xs text-slate-300 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                        <div>
                          <span className="text-slate-500 block text-[11px]">ID do Evento:</span>
                          <span className="font-mono text-slate-300 text-[11px]">{log.id}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">ID do Usuário:</span>
                          <span className="font-mono text-slate-300 text-[11px]">{log.userId}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Origem / IP:</span>
                          <span className="font-mono text-slate-300 text-[11px]">{log.ipAddress || 'Aplicação Interna (Web/Mobile)'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Timestamp ISO:</span>
                          <span className="font-mono text-slate-300 text-[11px]">{log.timestamp}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px] mb-1">Descrição Completa da Operação:</span>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 text-xs leading-relaxed">
                          {typeof log.details === 'string' ? log.details : (log.description || log.action)}
                        </div>
                      </div>

                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div>
                          <span className="text-slate-500 block text-[11px] mb-1">Metadados / Payload da Ação:</span>
                          <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
