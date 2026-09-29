import React, { useState, useRef, useEffect } from 'react';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Clock,
  Layers,
  X,
  RefreshCw,
  Check,
  ShieldCheck,
  Minus,
  Maximize2,
  Minimize2,
  FileText,
  Trash2,
  Bot,
  Play,
  CalendarClock,
  AlertCircle,
  Database,
  TrendingDown,
  CheckCircle,
} from 'lucide-react';
import { getSystemFeedStatus, recordTeknisaFeedUpdate, SystemFeedStatus } from '../../services/dataFreshnessStore';
import {
  getTeknisaScheduleConfig,
  getTeknisaSyncLogs,
  executeNightlyTeknisaSync,
  TeknisaSyncLog,
  TeknisaScheduleConfig,
} from '../../services/teknisaNightlySyncService';

interface TeknisaFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserName: string;
}

export const TeknisaFeedModal: React.FC<TeknisaFeedModalProps> = ({
  isOpen,
  onClose,
  currentUserName,
}) => {
  const [activeTab, setActiveTab] = useState<'AUTO_03H' | 'MANUAL_SHEETS'>('AUTO_03H');
  const [feedStatus, setFeedStatus] = useState<SystemFeedStatus>(getSystemFeedStatus());
  const [scheduleConfig, setScheduleConfig] = useState<TeknisaScheduleConfig>(getTeknisaScheduleConfig());
  const [syncLogs, setSyncLogs] = useState<TeknisaSyncLog[]>(getTeknisaSyncLogs());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRunningNightlyNow, setIsRunningNightlyNow] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Estados de Controle de Janela (Minimizar / Maximizar / Normal)
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Form states para carga manual
  const [responsibleName, setResponsibleName] = useState(currentUserName || 'Pabricio');
  const [periodDate, setPeriodDate] = useState(() => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return yesterday.toISOString().split('T')[0];
  });
  const [selectedSheets, setSelectedSheets] = useState({
    vendas: true,
    cancelamentos: true,
    baixasEstoque: true,
    comissarios: true,
    metas: true,
    escalas: true,
  });

  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string }>>([
    { name: `Teknisa_Fechamento_${periodDate}.xlsx`, size: '2.4 MB' },
    { name: `Teknisa_Cancelamentos_${periodDate}.xlsx`, size: '380 KB' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFeedStatus(getSystemFeedStatus());
      setScheduleConfig(getTeknisaScheduleConfig());
      setSyncLogs(getTeknisaSyncLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Executa rotina noturna sob demanda (simulando ou rodando o processo das 03h)
  const handleTriggerNightlyNow = async () => {
    setIsRunningNightlyNow(true);
    try {
      const newLog = await executeNightlyTeknisaSync('EXECUCAO_MANUAL_GERENTE');
      setSyncLogs(getTeknisaSyncLogs());
      setFeedStatus(getSystemFeedStatus());
      setScheduleConfig(getTeknisaScheduleConfig());
      setSuccessToast(`Rotina das 03h executada com sucesso! ${newLog.totalSalesRows} vendas e ${newLog.cancellationsCount} cancelamentos consolidados.`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningNightlyNow(false);
    }
  };

  const handleSimulateImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated = recordTeknisaFeedUpdate({
        updatedBy: responsibleName,
        userRole: responsibleName === 'Pabricio' ? 'Gerente em Treinamento' : 'Gerente Geral',
        periodCompetence: `Fechamento ${periodDate.split('-').reverse().join('/')} (D-1)`,
        salesCount: Math.floor(1400 + Math.random() * 200),
        cancellationsCount: Math.floor(15 + Math.random() * 15),
        stockDeductionsCount: Math.floor(280 + Math.random() * 50),
        commissionersCount: 18,
        filesProcessed: uploadedFiles.map((f) => f.name),
        notes: `Carga oficial Teknisa consolidada com sucesso por ${responsibleName}.`,
      });

      setFeedStatus(updated);
      setIsProcessing(false);
      setSuccessToast('Base de dados diária do Teknisa atualizada com sucesso!');
      setTimeout(() => {
        setSuccessToast(null);
        setIsMinimized(false);
        onClose();
      }, 1400);
    }, 1100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Se o modal estiver minimizado, renderiza um widget flutuante compacto
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-in slide-in-from-bottom-3 duration-200">
        <div className="bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-3 shadow-2xl flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div
            className="text-left pr-2 cursor-pointer hover:opacity-90"
            onClick={() => setIsMinimized(false)}
            title="Clique para voltar ao normal"
          >
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Alimentação Teknisa (Minimizada)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400">
              Robô das 03:00h ativo &bull; Clique para restaurar
            </p>
          </div>
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              title="Voltar ao normal / Restaurar"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Voltar ao Normal</span>
            </button>
            <button
              onClick={() => {
                setIsMinimized(false);
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`bg-slate-900 border border-slate-700 w-full rounded-2xl sm:rounded-3xl shadow-2xl text-white flex flex-col transition-all duration-200 overflow-hidden ${
          isMaximized ? 'max-w-5xl h-[94vh]' : 'max-w-3xl max-h-[88vh]'
        }`}
      >
        {/* Topo do Modal (Fixed Header) */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 sm:px-6 py-3.5 shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xs shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Integração Automática Teknisa & Carga Diária
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  03:00h Diário Ativo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Download automático de vendas e cancelamentos programado diariamente para às 03h da madrugada
              </p>
            </div>
          </div>

          {/* Botões de Controle de Janela */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors"
              title="Minimizar tela"
            >
              <Minus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Minimizar</span>
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors"
              title={isMaximized ? 'Voltar ao tamanho normal' : 'Maximizar tela'}
            >
              {isMaximized ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tamanho Normal</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Maximizar</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors ml-1"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Abas Superiores de Navegação */}
        <div className="flex items-center border-b border-slate-800 px-4 sm:px-6 bg-slate-900/60 shrink-0">
          <button
            onClick={() => setActiveTab('AUTO_03H')}
            className={`py-3 px-3 border-b-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'AUTO_03H'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>Robô das 03:00h (Download Diário de Vendas & Cancelamentos)</span>
          </button>
          <button
            onClick={() => setActiveTab('MANUAL_SHEETS')}
            className={`py-3 px-3 border-b-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'MANUAL_SHEETS'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Carga Manual de Planilhas (Contingência Excel)</span>
          </button>
        </div>

        {/* Notificação Toast */}
        {successToast && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Corpo Scrollável do Modal */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {activeTab === 'AUTO_03H' ? (
            /* ================= ABA DO ROBÔ NOTURNO DAS 03H ================= */
            <div className="space-y-4">
              {/* Banner de Status do Agendamento */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h4 className="text-sm font-bold text-white">
                      Agendador Noturno de Vendas e Cancelamentos
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    Programado para baixar todos os dias pontualmente às <strong className="text-emerald-400">03:00 da madrugada</strong>.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Portal Teknisa: <code className="text-emerald-300">retail.teknisa.com</code> &bull; Login: <code className="text-emerald-300">{scheduleConfig.username}</code>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerNightlyNow}
                  disabled={isRunningNightlyNow}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Play className={`w-4 h-4 fill-white ${isRunningNightlyNow ? 'animate-spin' : ''}`} />
                  <span>{isRunningNightlyNow ? 'Executando Sincronização...' : 'Executar Sincronização Agora'}</span>
                </button>
              </div>

              {/* Grid com os 4 Pilares da Rotina das 03h */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Database className="w-4 h-4" />
                    <span>1. Vendas & Curva ABC</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Captura faturamento bruto e quantidade vendida por prato/bebida (D-1).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                    <TrendingDown className="w-4 h-4" />
                    <span>2. Cancelamentos / Voids</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Identifica motivos, mesas e garçons em devoluções para auditoria gerencial.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Layers className="w-4 h-4" />
                    <span>3. Estoque & Margem (+10%)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Dedução física e cálculo da média para o pedido de reposição semanal do bar.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                    <Bot className="w-4 h-4" />
                    <span>4. IA Copilot Integrada</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Gera insights no fechamento para a equipe de gestão matinal que chega às 08h/12h.
                  </p>
                </div>
              </div>

              {/* Histórico Auditável de Sincronizações Noturnas */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Histórico de Execuções Noturnas das 03h ({syncLogs.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Retém até 60 dias de fechamentos diários
                  </span>
                </div>

                {syncLogs.length === 0 ? (
                  <div className="p-6 text-center bg-slate-800/40 rounded-xl border border-slate-800">
                    <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold text-slate-300">Nenhum log noturno gravado ainda</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Clique em "Executar Sincronização Agora" acima para iniciar o primeiro ciclo de teste.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {syncLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {log.status}
                            </span>
                            <span className="font-bold text-white">
                              Competência D-1: {log.dateCompetence.split('-').reverse().join('/')}
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              às {log.executedAtHour}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              ({log.triggeredBy === 'AGENDADOR_AUTOMATICO_03H' ? 'Agendador 03h' : 'Manual'})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300">{log.details}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                          <div>
                            <span className="text-[9px] text-slate-400 block uppercase font-bold">Vendas</span>
                            <span className="text-xs font-bold text-emerald-400">{log.totalSalesRows} itens</span>
                          </div>
                          <div className="border-l border-slate-800 pl-3">
                            <span className="text-[9px] text-slate-400 block uppercase font-bold">Faturamento</span>
                            <span className="text-xs font-bold text-white">
                              R$ {log.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="border-l border-slate-800 pl-3">
                            <span className="text-[9px] text-slate-400 block uppercase font-bold">Cancelamentos</span>
                            <span className="text-xs font-bold text-rose-400">{log.cancellationsCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ================= ABA DE CARGA MANUAL (EXCEL CONTINGÊNCIA) ================= */
            <div className="space-y-4">
              {/* Card Compacto do Status Atual */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    Última Carga Registrada no Sistema:
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Base Consolidada
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                  <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Data & Hora</span>
                    <span className="text-xs font-bold text-white block mt-0.5">
                      {feedStatus.formattedDate} às {feedStatus.formattedTime}
                    </span>
                  </div>
                  <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Responsável</span>
                    <span className="text-xs font-bold text-emerald-400 block mt-0.5 truncate">
                      {feedStatus.updatedBy}
                    </span>
                  </div>
                  <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Competência</span>
                    <span className="text-xs font-bold text-slate-200 block mt-0.5 truncate">
                      {feedStatus.periodCompetence}
                    </span>
                  </div>
                  <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Linhas PDV</span>
                    <span className="text-xs font-bold text-amber-400 block mt-0.5">
                      {feedStatus.totalSalesRows} registros
                    </span>
                  </div>
                </div>
              </div>

              {/* Formulário de Nova Carga Manual */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Upload de Relatórios Excel / CSV Teknisa
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Responsável pela Carga:
                    </label>
                    <select
                      value={responsibleName}
                      onChange={(e) => setResponsibleName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Pabricio">Pabricio (Gerente em Treinamento • Master)</option>
                      <option value="Ivan">Ivan (Gerente Geral • Comando de Loja)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Data do Fechamento (Competência D-1):
                    </label>
                    <input
                      type="date"
                      value={periodDate}
                      onChange={(e) => setPeriodDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Seleção dos Módulos a Importar do Excel Teknisa */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5">
                    Planilhas Teknisa contempladas na carga:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                    {[
                      { id: 'vendas', label: '1. Vendas & Curva ABC' },
                      { id: 'cancelamentos', label: '2. Cancelamentos / Voids' },
                      { id: 'baixasEstoque', label: '3. Baixas de CMV / Estoque' },
                      { id: 'comissarios', label: '4. Vendas por Comissário' },
                      { id: 'metas', label: '5. Metas & Faturamento' },
                      { id: 'escalas', label: '6. Escala & Frequência' },
                    ].map((sheet) => {
                      const key = sheet.id as keyof typeof selectedSheets;
                      const isChecked = selectedSheets[key];
                      return (
                        <label
                          key={sheet.id}
                          onClick={() => setSelectedSheets((prev) => ({ ...prev, [key]: !prev[key] }))}
                          className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                              : 'bg-slate-800/40 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                              isChecked ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-600'
                            }`}
                          >
                            {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="text-[11px] font-medium leading-tight truncate">{sheet.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Área de Upload / Dropzone Funcional */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5">
                    Arquivos da Carga (.xlsx / .csv):
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="teknisa-feed-upload"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-xl p-3.5 sm:p-4 text-center bg-slate-800/40 hover:bg-slate-800/70 transition-all cursor-pointer group"
                  >
                    <Upload className="w-6 h-6 text-emerald-400 group-hover:scale-110 mx-auto mb-1.5 transition-transform" />
                    <p className="text-xs font-bold text-slate-200">
                      Clique para selecionar ou arraste os arquivos do Teknisa aqui
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Formatos aceitos: Planilhas de Vendas, Cancelamentos, Baixas e Comissões (.xlsx, .csv)
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-2.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Selecionar Arquivos</span>
                    </button>
                  </div>

                  {/* Lista de Arquivos Prontos para Carga */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Arquivos prontos para importação ({uploadedFiles.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-800/90 border border-slate-700/80 px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-xs text-white truncate font-medium">{file.name}</span>
                              <span className="text-[10px] text-slate-400 shrink-0">({file.size})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                              title="Remover arquivo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé Fixo de Ação */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-900/95 shrink-0 gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Logs auditáveis protegidos e salvos no sistema</span>
            <span className="sm:hidden">Logs auditáveis</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Fechar
            </button>
            {activeTab === 'MANUAL_SHEETS' && (
              <button
                type="button"
                onClick={handleSimulateImport}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>{isProcessing ? 'Processando Planilhas...' : 'Processar & Atualizar Base'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
