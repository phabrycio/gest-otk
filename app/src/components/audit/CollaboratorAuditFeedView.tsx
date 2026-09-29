// ============================================================
// COMPONENTE: LOG OPERACIONAL DE ATUALIZAÇÕES DOS COLABORADORES
// Visão de Controle para Gerente (Ivan/Pabricio) & Donos (Rogério/Sidney)
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Clock,
  Calendar,
  Search,
  Download,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Eye,
  Building2,
  Sparkles,
  Smartphone,
  Laptop,
  Flame,
  Utensils,
  Wine,
  ShoppingBag,
  DollarSign,
  Crown,
} from 'lucide-react';
import type { SystemAuditLog, AuditLogSeverity } from '../../types/auditLog.types';
import { getAuditLogs } from '../../services/auditLogStore';

interface CollaboratorAuditFeedViewProps {
  currentUserName?: string;
  isOwnerView?: boolean;
}

export const CollaboratorAuditFeedView: React.FC<CollaboratorAuditFeedViewProps> = ({
  currentUserName = 'Gerente',
  isOwnerView = false,
}) => {
  const [logs, setLogs] = useState<SystemAuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>('TODOS');
  const [selectedSector, setSelectedSector] = useState<string>('TODOS');
  const [timeFilter, setTimeFilter] = useState<'HOJE' | '7DIAS' | 'TODOS'>('TODOS');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const loadLogs = () => {
    const data = getAuditLogs();
    setLogs(data);
  };

  useEffect(() => {
    loadLogs();
    const handleUpdate = () => loadLogs();
    window.addEventListener('chamber-readings-updated', handleUpdate);
    window.addEventListener('receipts-updated', handleUpdate);
    window.addEventListener('tk_feed_status_updated', handleUpdate);

    return () => {
      window.removeEventListener('chamber-readings-updated', handleUpdate);
      window.removeEventListener('receipts-updated', handleUpdate);
      window.removeEventListener('tk_feed_status_updated', handleUpdate);
    };
  }, []);

  // Lista dos Colaboradores com Papéis Chave no Restaurante
  const COLLABORATOR_OPTIONS = [
    { value: 'TODOS', label: 'Todos os Colaboradores' },
    { value: 'Mádio', label: 'Mádio • Chefe de Cozinha' },
    { value: 'Esmael', label: 'Esmael • Sub Chefe de Cozinha' },
    { value: 'Patricia', label: 'Patricia • Supervisora de Loja' },
    { value: 'Pedro', label: 'Pedro • Chefe do Bar' },
    { value: 'Amanda', label: 'Amanda • Operadora de Caixa' },
    { value: 'Anne', label: 'Anne • Comissária (Vinhos & Charcutaria)' },
    { value: 'Elendia', label: 'Elendia • Comissária (Charcutaria & Vinhos)' },
    { value: 'Ivan', label: 'Ivan • Gerente Geral' },
    { value: 'Pabricio', label: 'Pabricio • Gerente em Treinamento' },
    { value: 'Rogério', label: 'Rogério • Proprietário' },
    { value: 'Sidney', label: 'Sidney • Proprietário' },
  ];

  // Setores da Operação
  const SECTOR_OPTIONS = [
    { value: 'TODOS', label: 'Todos os Setores' },
    { value: 'FREEZER_CDA', label: 'Cozinha, Freezer & Câmara Fria' },
    { value: 'ESTOQUE', label: 'Estoque, Insumos & Contagens' },
    { value: 'VENDAS_CAIXA', label: 'Caixa & Vendas' },
    { value: 'CHECKLIST_OP', label: 'Salão, Adega & Checklists' },
    { value: 'FINANCEIRO', label: 'Financeiro, Notas & DRE' },
  ];

  // Filtros aplicados
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Filtro por Colaborador
      if (selectedCollaborator !== 'TODOS') {
        const matchName = log.userName.toLowerCase().includes(selectedCollaborator.toLowerCase());
        if (!matchName) return false;
      }

      // 2. Filtro por Setor
      if (selectedSector !== 'TODOS') {
        if (log.module !== selectedSector) return false;
      }

      // 3. Filtro por Período
      if (timeFilter === 'HOJE') {
        const logDate = new Date(log.timestamp);
        const today = new Date();
        const isToday =
          logDate.getDate() === today.getDate() &&
          logDate.getMonth() === today.getMonth() &&
          logDate.getFullYear() === today.getFullYear();
        if (!isToday) return false;
      } else if (timeFilter === '7DIAS') {
        const logTime = new Date(log.timestamp).getTime();
        const limit = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (logTime < limit) return false;
      }

      // 4. Busca Textual Livre
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const detailsText = typeof log.details === 'string' ? log.details : JSON.stringify(log.details || '');
        const match =
          log.userName.toLowerCase().includes(q) ||
          log.userRole.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          (log.actionLabel || '').toLowerCase().includes(q) ||
          log.description.toLowerCase().includes(q) ||
          detailsText.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [logs, selectedCollaborator, selectedSector, timeFilter, searchQuery]);

  // Download do Log em CSV para envio aos Donos / Gerente
  const handleExportCsv = () => {
    const headers = 'ID,DATA_HORA,COLABORADOR,CARGO,ACAO,SETOR,DESCRICAO,DISPOSITIVO\n';
    const rows = filteredLogs.map((l) => {
      const desc = l.description.replace(/"/g, '""');
      return `"${l.id}","${l.formattedTime || l.timestamp}","${l.userName}","${l.userRole}","${l.actionLabel || l.action}","${l.module}","${desc}","${l.ipOrDevice || 'Desktop'}"`;
    }).join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LOG_OPERACIONAL_COLABORADORES_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Ícones e Cores por Colaborador / Cargo
  const getCollaboratorAvatar = (role: string, name: string) => {
    if (name.includes('Mádio') || name.includes('Esmael') || role.includes('Cozinha')) {
      return { bg: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: Utensils };
    }
    if (name.includes('Pedro') || role.includes('Bar')) {
      return { bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Wine };
    }
    if (name.includes('Amanda') || role.includes('Caixa')) {
      return { bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: DollarSign };
    }
    if (name.includes('Anne') || name.includes('Elendia') || role.includes('Comissária')) {
      return { bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: ShoppingBag };
    }
    if (name.includes('Patricia') || role.includes('Supervisora')) {
      return { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: ShieldCheck };
    }
    if (name.includes('Rogério') || name.includes('Sidney') || role.includes('Proprietário')) {
      return { bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', icon: Crown };
    }
    return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: Users };
  };

  return (
    <div className="space-y-4 text-slate-100">
      {/* Banner Superior de Governança Compartilhada */}
      <div className="bg-gradient-to-br from-[#0a2e23] via-[#0f3b2d] to-[#041a13] rounded-3xl p-5 sm:p-6 border border-emerald-800/50 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Auditoria Operacional • Quem Fez o Quê na Loja
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Visão Gerencial (Ivan / Pabricio) & Sócios (Rogério / Sidney)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Log Operacional de Alimentação do Sistema
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-3xl leading-relaxed">
            Cada colaborador que insere ou altera qualquer dado na operação (temperatura da câmara, contagem de estoque, quebras, sangria de chopp, caixinha, checklists e vendas) gera um registro imediato com <strong>Nome, Data, Hora Exata e Dispositivo</strong>.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="self-start lg:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-950/40 flex items-center gap-2 transition active:scale-95 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório (CSV)</span>
        </button>
      </div>

      {/* Cards de Métricas de Auditoria */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Ações Auditadas
          </span>
          <span className="text-2xl font-black text-white font-mono mt-1 block">
            {filteredLogs.length}
          </span>
          <span className="text-[10px] text-emerald-400">100% com carimbo de hora</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Colaboradores Ativos
          </span>
          <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
            {new Set(logs.map((l) => l.userName)).size} nomes
          </span>
          <span className="text-[10px] text-slate-400">Cozinha, Bar, Caixa, Salão</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Última Atualização
          </span>
          <span className="text-sm font-black text-emerald-400 mt-1 block font-mono">
            {logs[0]?.formattedTime ? logs[0].formattedTime.slice(11, 16) : 'Agora'}
          </span>
          <span className="text-[10px] text-slate-400">Por: {logs[0]?.userName || 'Operação'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Transparência aos Sócios
          </span>
          <span className="text-xs font-black text-amber-300 mt-1 block flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Rogério & Sidney</span>
          </span>
          <span className="text-[10px] text-slate-400">Acesso 24/7 sem filtros</span>
        </div>
      </div>

      {/* Barra de Filtros: Colaborador, Setor, Período e Busca Livre */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Seletor de Colaborador */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Colaborador
            </label>
            <select
              value={selectedCollaborator}
              onChange={(e) => setSelectedCollaborator(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition"
            >
              {COLLABORATOR_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Setor */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Setor da Loja
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition"
            >
              {SECTOR_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Período */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Período
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setTimeFilter('HOJE')}
                className={`py-1 rounded-lg font-bold transition ${
                  timeFilter === 'HOJE' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter('7DIAS')}
                className={`py-1 rounded-lg font-bold transition ${
                  timeFilter === '7DIAS' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                7 Dias
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter('TODOS')}
                className={`py-1 rounded-lg font-bold transition ${
                  timeFilter === 'TODOS' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tudo
              </button>
            </div>
          </div>

          {/* Busca Textual */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Busca por Palavra-Chave
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Ex: Chopp, câmara fria, caixa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              >
              </input>
            </div>
          </div>
        </div>
      </div>

      {/* Lista Linha do Tempo dos Logs */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
            <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold">Nenhuma atividade registrada para estes filtros.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const avatar = getCollaboratorAvatar(log.userRole, log.userName);
            const Icon = avatar.icon;
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-sm flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Avatar & Identificação do Colaborador */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-inner ${avatar.bg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                          {log.userName}
                        </span>

                        <span className="text-xs text-slate-400">
                          &bull; {log.userRole}
                        </span>

                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {log.actionLabel || log.action}
                        </span>
                      </div>

                      {/* Descrição Detalhada da Ação */}
                      <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                        {log.description}
                      </p>
                    </div>
                  </div>

                  {/* Carimbo de Data, Hora e Dispositivo */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-amber-300 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{log.formattedTime || new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                    </div>

                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                      <Laptop className="w-3 h-3 text-slate-500" />
                      <span>{log.ipOrDevice || 'Terminal Operacional'}</span>
                    </div>
                  </div>
                </div>

                {/* Detalhes Expansíveis */}
                {log.details && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <span>{isExpanded ? 'Ocultar Metadados' : 'Ver Detalhes do Registro'}</span>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    <span className="text-[10px] text-slate-400">
                      ID Auditoria: {log.id}
                    </span>
                  </div>
                )}

                {isExpanded && log.details && (
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto animate-fade-in">
                    <pre className="whitespace-pre-wrap">
                      {typeof log.details === 'string'
                        ? log.details
                        : JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
