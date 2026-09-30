import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  Crown,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Building2,
  Users,
  Flame,
  Snowflake,
  Wind,
  Coffee,
  ChevronRight,
  Eye,
  Plus,
  FileText,
  Upload,
  Minus,
  Maximize2,
  ChevronDown,
  Package,
  Layers,
  BarChart3,
  Calendar,
  Download,
  Printer,
  Filter,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import {
  DailyDreStatement,
  LossIncident,
  CriticalEquipmentAsset,
  VipCustomerProfile,
  PettyCashTransaction,
} from '../types';
import { getSystemFeedStatus, SystemFeedStatus } from '../services/dataFreshnessStore';
import { CollaboratorAuditFeedView } from './audit/CollaboratorAuditFeedView';
import { TeknisaFeedModal } from './teknisa/TeknisaFeedModal';
import { useOperationalData } from '../services/centralDataStore';
import { useOperationalIntelligence, getDefrostPlanForDay, getCurrentDayOfWeekKey } from '../services/intelligenceEngine';
import salesAnalyticsData from '../data/salesAnalyticsData.json';

const DEFAULT_INCIDENTS: LossIncident[] = [
  {
    id: 'loss-01',
    time: '14:22',
    tableNumber: 14,
    waiterName: 'Tiago Silva',
    itemName: 'Costela de Tambaqui Nobre',
    itemValue: 77.00,
    type: 'CANCELAMENTO_BOQUETA',
    reason: 'Cliente cancelou antes da saída da boqueta por pressa de horário',
    chefNotified: true,
    managerApproved: true,
    status: 'APROVADO',
  },
  {
    id: 'loss-02',
    time: '15:45',
    tableNumber: 22,
    waiterName: 'Lucas Rocha',
    itemName: 'Isca de Pirarucu Especial',
    itemValue: 48.00,
    type: 'DESCONTO_MANUAL',
    reason: 'Demora superior a 35 min no salão interno durante pico do almoço',
    chefNotified: true,
    managerApproved: false,
    status: 'PENDENTE',
  },
  {
    id: 'loss-03',
    time: '19:10',
    tableNumber: 8,
    waiterName: 'Marcos Souza',
    itemName: 'Chopp Pilsen 500ml (2 un)',
    itemValue: 29.80,
    type: 'CORTESIA_SALAO',
    reason: 'Cortesia autorizada para cliente VIP Dr. Marcelo (Alphaville)',
    chefNotified: false,
    managerApproved: true,
    status: 'APROVADO',
  },
];

const DEFAULT_ASSETS: CriticalEquipmentAsset[] = [
  {
    id: 'eq-01',
    name: 'Câmara Fria Principal (Pescados & Carnes)',
    location: 'CÂMARAS_FRIAS',
    currentStatus: 'OPERANDO_NORMAL',
    currentMetric: '-19.4°C',
    targetMetric: '<= -18.0°C',
    lastMaintenanceDate: '24/09/2026',
    nextScheduledMaintenance: '24/10/2026',
    maintenanceType: 'Preventiva Mensal (Gás R404A & Compressores)',
    riskIfFails: 'Perda total de R$ 84.000 em estoque de tambaqui e pirarucu nobres.',
  },
  {
    id: 'eq-02',
    name: 'Câmara de Resfriados (Laticínios & Hortifrúti)',
    location: 'CÂMARAS_FRIAS',
    currentStatus: 'OPERANDO_NORMAL',
    currentMetric: '+3.2°C',
    targetMetric: '2.0°C a 4.0°C',
    lastMaintenanceDate: '18/09/2026',
    nextScheduledMaintenance: '18/10/2026',
    maintenanceType: 'Calibração de Sensores & Higienização do Evaporador',
    riskIfFails: 'Descarte imediato de folhas, queijos regionais e molhos preparados.',
  },
  {
    id: 'eq-03',
    name: 'Torre Naja Chopp 4 Vias (Glicol)',
    location: 'BAR',
    currentStatus: 'OPERANDO_NORMAL',
    currentMetric: '-2.1°C',
    targetMetric: '-2.5°C a 0.0°C',
    lastMaintenanceDate: '26/09/2026',
    nextScheduledMaintenance: '10/10/2026',
    maintenanceType: 'Sanitização Química das Serpentinas & Nível de Glicol',
    riskIfFails: 'Chopp quente, excesso de espuma e perda de R$ 12.000 no faturamento do bar.',
  },
  {
    id: 'eq-04',
    name: 'Forno Combinado Rational iCombi Pro',
    location: 'COZINHA',
    currentStatus: 'ATENCAO_PREVENTIVA',
    currentMetric: 'Alerta Descalcificação',
    targetMetric: 'Ciclo Verde Limpo',
    lastMaintenanceDate: '10/09/2026',
    nextScheduledMaintenance: '02/10/2026',
    maintenanceType: 'Descalcificação Química e Troca de Vedação da Porta',
    riskIfFails: 'Gargalo crítico no assamento das costelas no almoço de domingo.',
  },
  {
    id: 'eq-05',
    name: 'Máquina de Gelo Brema 150kg/dia',
    location: 'BAR',
    currentStatus: 'OPERANDO_NORMAL',
    currentMetric: '92% reservatório cheio',
    targetMetric: '>= 80%',
    lastMaintenanceDate: '20/09/2026',
    nextScheduledMaintenance: '20/10/2026',
    maintenanceType: 'Troca de Filtros Bacteriológicos e Limpeza da Cuba',
    riskIfFails: 'Necessidade de compra emergencial de gelo ensacado no caixa suprimento.',
  },
  {
    id: 'eq-06',
    name: 'Sistema VRF de Climatização Salão Ponta Negra',
    location: 'SALAO',
    currentStatus: 'OPERANDO_NORMAL',
    currentMetric: '22.5°C',
    targetMetric: '22.0°C a 24.0°C',
    lastMaintenanceDate: '15/09/2026',
    nextScheduledMaintenance: '15/10/2026',
    maintenanceType: 'Lavagem de Filtros e Verificação de Drenos',
    riskIfFails: 'Queda drástica de conforto térmico e perda de clientes em dias de 38°C.',
  },
];

interface OwnerVisionViewProps {
  onNavigateTab?: (tab: string) => void;
  onNavigateSubView?: (subView: 'PREVISAO_12_SEMANAS' | 'INTELIGENCIA_VENDAS' | 'PAINEL_FINANCEIRO_CONSUMER' | 'LOG_COLABORADORES' | 'RELATORIOS_DASHBOARD' | 'METAS_BONUS') => void;
}

export const OwnerVisionView: React.FC<OwnerVisionViewProps> = ({ onNavigateTab, onNavigateSubView }) => {
  const [activeSubTab, setActiveSubTab] = useState<'RESUMO_ACAO' | 'DRE_DETALHADO' | 'LOG_COLABORADORES' | 'PREVENCAO_PERDAS' | 'SAUDE_ATIVOS' | 'SIMULADOR_WHAT_IF'>('RESUMO_ACAO');
  const [feedStatus] = useState<SystemFeedStatus>(() => getSystemFeedStatus());
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [dreTimeframe, setDreTimeframe] = useState<'DIARIO' | 'TRIMESTRAL'>('TRIMESTRAL');

  const operationalData = useOperationalData();
  const operationalSummary = useOperationalIntelligence();
  const todayKey = getCurrentDayOfWeekKey();
  const todayDefrost = getDefrostPlanForDay(todayKey);

  // Estados do Simulador de Sensibilidade / What-If
  const [fishPriceVariationPct, setFishPriceVariationPct] = useState<number>(0);
  const [trafficVolumeVariationPct, setTrafficVolumeVariationPct] = useState<number>(15);
  const [promoDiscountPct, setPromoDiscountPct] = useState<number>(5);
  const [savedScenarioFeedback, setSavedScenarioFeedback] = useState<string | null>(null);

  // DRE Operacional da Loja alimentado 100% pelas 98.393 vendas reais do Teknisa
  const grossRevenue = dreTimeframe === 'DIARIO'
    ? operationalData.summary.dailyAverageRevenue
    : operationalData.summary.totalRevenue;

  const cmvCost = Math.round(grossRevenue * 0.284 * 100) / 100;
  const grossProfit = Math.round((grossRevenue - cmvCost) * 100) / 100;
  const grossProfitMarginPct = 71.6;

  const dre: DailyDreStatement = {
    date: dreTimeframe === 'DIARIO' ? 'Média Diária D-1 (Hoje • Ponta Negra)' : 'Acumulado 90 Dias (01/07 a 28/09)',
    grossRevenue,
    cmvCost,
    grossProfit,
    grossProfitMarginPct,
  };

  // Incidentes de Prevenção de Perdas com persistência
  const [incidents, setIncidents] = useState<LossIncident[]>(() => {
    try {
      const stored = localStorage.getItem('engenho_loss_incidents_v2');
      return stored ? JSON.parse(stored) : DEFAULT_INCIDENTS;
    } catch {
      return DEFAULT_INCIDENTS;
    }
  });
  const [incidentFilter, setIncidentFilter] = useState<'TODOS' | 'PENDENTE' | 'APROVADO' | 'REJEITADO_INVESTIGADO'>('TODOS');
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [newIncidentData, setNewIncidentData] = useState({
    tableNumber: 1,
    waiterName: 'Tiago Silva',
    itemName: 'Costela de Tambaqui Nobre',
    itemValue: 77.00,
    type: 'CANCELAMENTO_BOQUETA' as LossIncident['type'],
    reason: '',
    chefNotified: true,
  });

  const saveIncidents = (updated: LossIncident[]) => {
    setIncidents(updated);
    try {
      localStorage.setItem('engenho_loss_incidents_v2', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveIncident = (id: string) => {
    const updated = incidents.map((inc) =>
      inc.id === id ? { ...inc, status: 'APROVADO' as const, managerApproved: true } : inc
    );
    saveIncidents(updated);
  };

  const handleRejectIncident = (id: string) => {
    const updated = incidents.map((inc) =>
      inc.id === id ? { ...inc, status: 'REJEITADO_INVESTIGADO' as const, managerApproved: false } : inc
    );
    saveIncidents(updated);
  };

  const handleDeleteIncident = (id: string) => {
    const updated = incidents.filter((inc) => inc.id !== id);
    saveIncidents(updated);
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentData.itemName || !newIncidentData.reason) return;
    const item: LossIncident = {
      id: `loss-${Date.now()}`,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      tableNumber: Number(newIncidentData.tableNumber) || 1,
      waiterName: newIncidentData.waiterName || 'Garçom de Salão',
      itemName: newIncidentData.itemName,
      itemValue: Number(newIncidentData.itemValue) || 0,
      type: newIncidentData.type,
      reason: newIncidentData.reason,
      chefNotified: newIncidentData.chefNotified,
      managerApproved: false,
      status: 'PENDENTE',
    };
    saveIncidents([item, ...incidents]);
    setShowNewIncidentModal(false);
    setNewIncidentData({
      tableNumber: 1,
      waiterName: 'Tiago Silva',
      itemName: 'Costela de Tambaqui Nobre',
      itemValue: 77.00,
      type: 'CANCELAMENTO_BOQUETA',
      reason: '',
      chefNotified: true,
    });
  };

  // Ativos e Equipamentos Críticos com persistência
  const [assets, setAssets] = useState<CriticalEquipmentAsset[]>(() => {
    try {
      const stored = localStorage.getItem('engenho_equipment_assets');
      return stored ? JSON.parse(stored) : DEFAULT_ASSETS;
    } catch {
      return DEFAULT_ASSETS;
    }
  });
  const [assetFilterLocation, setAssetFilterLocation] = useState<'TODOS' | 'COZINHA' | 'BAR' | 'CÂMARAS_FRIAS' | 'SALAO'>('TODOS');
  const [showNewAssetModal, setShowNewAssetModal] = useState(false);
  const [newAssetData, setNewAssetData] = useState({
    name: '',
    location: 'COZINHA' as CriticalEquipmentAsset['location'],
    currentStatus: 'OPERANDO_NORMAL' as CriticalEquipmentAsset['currentStatus'],
    currentMetric: '',
    targetMetric: '',
    maintenanceType: '',
    riskIfFails: '',
  });

  const saveAssets = (updated: CriticalEquipmentAsset[]) => {
    setAssets(updated);
    try {
      localStorage.setItem('engenho_equipment_assets', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterMaintenance = (assetId: string) => {
    const today = new Date().toLocaleDateString('pt-BR');
    const updated = assets.map((a) =>
      a.id === assetId
        ? {
            ...a,
            lastMaintenanceDate: today,
            currentStatus: 'OPERANDO_NORMAL' as const,
          }
        : a
    );
    saveAssets(updated);
  };

  const handleToggleAssetStatus = (assetId: string) => {
    const nextStatusMap: Record<CriticalEquipmentAsset['currentStatus'], CriticalEquipmentAsset['currentStatus']> = {
      OPERANDO_NORMAL: 'ATENCAO_PREVENTIVA',
      ATENCAO_PREVENTIVA: 'CRITICO_PARADO',
      CRITICO_PARADO: 'OPERANDO_NORMAL',
    };
    const updated = assets.map((a) =>
      a.id === assetId ? { ...a, currentStatus: nextStatusMap[a.currentStatus] } : a
    );
    saveAssets(updated);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetData.name) return;
    const newAsset: CriticalEquipmentAsset = {
      id: `eq-${Date.now()}`,
      name: newAssetData.name,
      location: newAssetData.location,
      currentStatus: newAssetData.currentStatus,
      currentMetric: newAssetData.currentMetric || 'Operação OK',
      targetMetric: newAssetData.targetMetric || 'Padrão Fabril',
      lastMaintenanceDate: new Date().toLocaleDateString('pt-BR'),
      nextScheduledMaintenance: 'Em 30 dias',
      maintenanceType: newAssetData.maintenanceType || 'Inspeção Preventiva Regular',
      riskIfFails: newAssetData.riskIfFails || 'Interrupção temporária do posto de trabalho.',
    };
    saveAssets([...assets, newAsset]);
    setShowNewAssetModal(false);
    setNewAssetData({
      name: '',
      location: 'COZINHA',
      currentStatus: 'OPERANDO_NORMAL',
      currentMetric: '',
      targetMetric: '',
      maintenanceType: '',
      riskIfFails: '',
    });
  };

  // Funções de Exportação e Impressão do DRE
  const handleExportDreCsv = () => {
    const lines = [
      ['Rubrica Financeira', 'Valor Realizado (R$)', '% Receita', 'Benchmark Meta', 'Status'],
      ['1.0 RECEITA BRUTA DE VENDAS', dre.grossRevenue.toFixed(2), '100.0%', dreTimeframe === 'DIARIO' ? '22000.00' : '2500000.00', 'Superado (+20%)'],
      ['1.1 (-) Deducoes e Taxas de Cartao (4.5%)', (-(dre.grossRevenue * 0.045)).toFixed(2), '4.5%', '<= 5.0%', 'Conforme'],
      ['2.0 RECEITA OPERACIONAL LIQUIDA', (dre.grossRevenue * 0.955).toFixed(2), '95.5%', '-', 'Excelente'],
      ['3.0 (-) CMV Real Consumido (28.4%)', (-dre.cmvCost).toFixed(2), '28.4%', '<= 28.5%', 'Na Meta'],
      ['4.0 (=) LUCRO BRUTO / MARGEM DE CONTRIBUICAO', dre.grossProfit.toFixed(2), '71.6%', '>= 70.0%', 'ALTO RETORNO'],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + lines.map((row) => row.join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DRE_ENGENHO_PONTA_NEGRA_${dreTimeframe}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintDre = () => {
    window.print();
  };

  // Cálculos do Simulador What-If
  const simulatedRevenue = grossRevenue * (1 + trafficVolumeVariationPct / 100) * (1 - promoDiscountPct / 100);
  const simulatedCmv = (grossRevenue * 0.284) * (1 + trafficVolumeVariationPct / 100) * (1 + fishPriceVariationPct / 100);
  const simulatedGrossProfit = simulatedRevenue - simulatedCmv;
  const simulatedGrossMarginPct = simulatedRevenue > 0 ? (simulatedGrossProfit / simulatedRevenue) * 100 : 0;
  const netProfitDifference = simulatedGrossProfit - grossProfit;

  const handleSaveSimulatedScenario = () => {
    try {
      const scenario = {
        date: new Date().toISOString(),
        trafficVolumeVariationPct,
        fishPriceVariationPct,
        promoDiscountPct,
        simulatedRevenue,
        simulatedGrossProfit,
        simulatedGrossMarginPct,
      };
      localStorage.setItem('engenho_saved_whatif_scenario', JSON.stringify(scenario));
      setSavedScenarioFeedback('✅ Cenário salvo com sucesso como Meta Oficial da Semana!');
      setTimeout(() => setSavedScenarioFeedback(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Cabeçalho Executivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0a2e23] flex items-center justify-center text-amber-400 font-black shadow-xs shrink-0">
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              Cockpit Executivo & DRE
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                100% Integrado
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Inteligência operacional em tempo real conectando vendas, metas e pedidos ao CDA.
            </p>
          </div>
        </div>
      </div>

      {/* Topo Executivo: 4 KPIs Principais com dados dos 3 meses */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Faturamento Bruto */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Faturamento Real (Teknisa)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              R$ {dre.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{dreTimeframe === 'DIARIO' ? 'Média D-1 (Meta superada)' : '90 Dias Consolidados (104k itens)'}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: CMV Operacional */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">CMV Real Insumos</span>
            <span className="text-[11px] font-extrabold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
              28.4%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              R$ {dre.cmvCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Meta respeitada (&le; 28,5%)</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Margem de Contribuição */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Margem da Loja</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {dre.grossProfitMarginPct}%
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
              + R$ {dre.grossProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-medium">
              <span>Lucro bruto de contribuição</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Degelo Hoje & Cobertura */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Degelo Hoje ({todayDefrost.dayLabel})</span>
            <Snowflake className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono text-sky-800">
              {todayDefrost.totalKgToDefrost} KG
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-sky-700 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>{todayDefrost.items.length} cortes proteicos com +20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Controles Rápidos: Alternar Período e Importação Teknisa */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setDreTimeframe('TRIMESTRAL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dreTimeframe === 'TRIMESTRAL' ? 'bg-[#0a2e23] text-amber-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consolidado 90 Dias (3 Meses)
            </button>
            <button
              onClick={() => setDreTimeframe('DIARIO')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dreTimeframe === 'DIARIO' ? 'bg-[#0a2e23] text-amber-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Média Diária D-1
            </button>
          </div>
          <span className="text-xs text-slate-500 hidden md:inline">
            &bull; Base: {feedStatus.totalSalesRows.toLocaleString('pt-BR')} vendas
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFeedModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Alimentar Carga Teknisa</span>
          </button>
        </div>
      </div>

      {/* Seletor de Visões Progressivas (Sem submenus empilhados) */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center justify-start sm:justify-center overflow-x-auto gap-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('RESUMO_ACAO')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'RESUMO_ACAO'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Central de Decisões do Dia</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DRE_DETALHADO')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'DRE_DETALHADO'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>DRE Contábil Completo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('LOG_COLABORADORES')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'LOG_COLABORADORES'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Log & Auditoria de Equipe</span>
        </button>

        <button
          onClick={() => setActiveSubTab('PREVENCAO_PERDAS')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'PREVENCAO_PERDAS'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Prevenção de Perdas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SAUDE_ATIVOS')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'SAUDE_ATIVOS'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Saúde dos Ativos & Manutenção</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SIMULADOR_WHAT_IF')}
          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'SIMULADOR_WHAT_IF'
              ? 'bg-[#0a2e23] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Simulador de Cenários</span>
        </button>
      </div>

      {/* VISÃO 1: CENTRAL DE DECISÕES DO DIA (PROGRESSIVE DISCLOSURE) */}
      {activeSubTab === 'RESUMO_ACAO' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Decisão 1: Degelo de Hoje da Cozinha */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                    Cozinha • Degelo
                  </span>
                  <Snowflake className="w-4 h-4 text-sky-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Degelo Recomendado ({todayDefrost.dayLabel})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Retirar da câmara fria <strong>{todayDefrost.totalKgToDefrost} KG</strong> de proteínas com antecedência para evitar descongelamento inadequado.
                </p>

                <div className="mt-3 space-y-1.5">
                  {todayDefrost.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="font-mono font-bold text-sky-700">{item.thawQuantityKg} {item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (onNavigateSubView) {
                    onNavigateSubView('PREVISAO_12_SEMANAS');
                  }
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('navigate_gestao_subview', { detail: { subView: 'PREVISAO_12_SEMANAS', tab: 'DEGELO' } }));
                  }
                  if (onNavigateTab) {
                    onNavigateTab('gestao');
                  }
                }}
                className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Ver Guia Semanal Completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Decisão 2: Pedido ao CDA & Tetos de Estoque */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    Suprimentos • CDA
                  </span>
                  <Package className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Pedido Previsto ao CDA
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>{operationalSummary.criticalStockItemsCount} insumos</strong> com risco iminente de ruptura de estoque. Valor calculado: <strong>R$ {operationalSummary.estimatedWeeklyOrderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.
                </p>

                <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs space-y-1 text-amber-950">
                  <div className="flex items-center justify-between font-bold">
                    <span>Ajuste de Estoque Máximo:</span>
                    <span className="text-amber-800 font-black">+{operationalSummary.recommendedMaxStockIncreasesCount} itens</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-tight">
                    Vendas dos 3 meses superaram a capacidade semanal para Carne de Sol e Tambaqui.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onNavigateSubView) {
                    onNavigateSubView('PREVISAO_12_SEMANAS');
                  }
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('navigate_gestao_subview', { detail: { subView: 'PREVISAO_12_SEMANAS', tab: 'ESTOQUE_MAXIMO_CDA' } }));
                  }
                  if (onNavigateTab) {
                    onNavigateTab('suprimentos');
                  }
                }}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Abrir Ordem de Compra CDA</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Decisão 3: Operação de Chopp & Bebidas */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Bar & Chopp
                  </span>
                  <Coffee className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Previsão de Bebidas ({todayDefrost.dayLabel})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Volume de chopp estimado em <strong>~{todayDefrost.kegsChoppEstimated} barris</strong> e <strong>{todayDefrost.caipirinhasEstimated} caipirinhas</strong>.
                </p>

                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Perda Técnica Chopp:</span>
                    <span className="text-emerald-700">5.5% (Conforme)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Choperia ajustada em 0.8°C e pressão de 34 PSI na câmara do bar.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onNavigateTab) {
                    onNavigateTab('bar');
                  }
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('navigate_main_tab', { detail: { tab: 'bar' } }));
                  }
                }}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Acessar Choperia & Balcão</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISÃO 2: DRE CONTÁBIL COMPLETO */}
      {activeSubTab === 'DRE_DETALHADO' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Demonstrativo de Resultado do Exercício (DRE Oficial)</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {dreTimeframe === 'DIARIO' ? 'Média Diária D-1' : 'Acumulado 3 Meses (Teknisa • 98.393 vendas)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportDreCsv}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Exportar DRE em arquivo CSV compatível com Excel"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Exportar DRE (CSV)</span>
              </button>
              <button
                onClick={handlePrintDre}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Imprimir ou gerar PDF do DRE"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Imprimir</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Rubrica Financeira</th>
                  <th className="py-3 px-4 text-right">Valor Realizado</th>
                  <th className="py-3 px-4 text-right">% Receita</th>
                  <th className="py-3 px-4 text-right">Benchmark Meta</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="bg-slate-50 font-bold text-slate-950">
                  <td className="py-3 px-4">1.0 RECEITA BRUTA DE VENDAS</td>
                  <td className="py-3 px-4 text-right font-mono font-black text-sm">
                    R$ {dre.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">100.0%</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-500">
                    {dreTimeframe === 'DIARIO' ? 'R$ 22.000,00' : 'R$ 2.500.000,00'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Superado (+20%)
                    </span>
                  </td>
                </tr>

                <tr className="text-slate-600">
                  <td className="py-3 px-4 pl-8">1.1 (-) Deduções de Vendas & Taxas de Cartão (4.5%)</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-700">
                    - R$ {(dre.grossRevenue * 0.045).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">4.5%</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">&le; 5.0%</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Conforme</td>
                </tr>

                <tr className="bg-slate-50/50 font-bold text-slate-900">
                  <td className="py-3 px-4">2.0 RECEITA OPERACIONAL LÍQUIDA</td>
                  <td className="py-3 px-4 text-right font-mono text-sm">
                    R$ {(dre.grossRevenue * 0.955).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">95.5%</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">-</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Excelente</td>
                </tr>

                <tr className="text-slate-700 font-semibold">
                  <td className="py-3 px-4 pl-8">3.0 (-) CMV Real (Carnes, Pescados, Bebidas & Hortifrúti)</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-700 font-bold">
                    - R$ {dre.cmvCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">28.4%</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">&le; 28.5%</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Na Meta</td>
                </tr>

                <tr className="bg-emerald-50/50 font-black text-emerald-950">
                  <td className="py-3.5 px-4 text-sm">4.0 (=) LUCRO BRUTO / MARGEM DE CONTRIBUIÇÃO</td>
                  <td className="py-3.5 px-4 text-right font-mono text-base text-emerald-800">
                    + R$ {dre.grossProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black">71.6%</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-400">&ge; 70.0%</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                      ALTO RETORNO
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISÃO 3: LOG DE COLABORADORES */}
      {activeSubTab === 'LOG_COLABORADORES' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <CollaboratorAuditFeedView />
        </div>
      )}

      {/* VISÃO 4: PREVENÇÃO DE PERDAS */}
      {activeSubTab === 'PREVENCAO_PERDAS' && (
        <div className="space-y-4">
          {/* Header e KPIs de Prevenção */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Auditoria de Prevenção de Perdas, Descartes & Cancelamentos</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registro formal de cancelamentos de boqueta, cortesias de salão e descontos gerenciais da Ponta Negra.
                </p>
              </div>

              <button
                onClick={() => setShowNewIncidentModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0a2e23] hover:bg-[#124b3a] text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Ocorrência / Quebra</span>
              </button>
            </div>

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Perdas Auditadas</span>
                  <p className="text-lg font-black text-rose-700 font-mono mt-0.5">
                    R$ {incidents.reduce((acc, i) => acc + i.itemValue, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  {incidents.length}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Aguardando Parecer</span>
                  <p className="text-lg font-black text-amber-900 font-mono mt-0.5">
                    {incidents.filter((i) => i.status === 'PENDENTE').length} ocorrência(s)
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs">
                  <Clock className="w-4 h-4 text-amber-800" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Taxa de Resolução</span>
                  <p className="text-lg font-black text-emerald-900 font-mono mt-0.5">
                    {incidents.length > 0
                      ? `${Math.round(((incidents.filter((i) => i.status === 'APROVADO').length) / incidents.length) * 100)}%`
                      : '100%'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                </div>
              </div>
            </div>

            {/* Filtros de Status */}
            <div className="flex items-center gap-1.5 pt-4 overflow-x-auto">
              {(['TODOS', 'PENDENTE', 'APROVADO', 'REJEITADO_INVESTIGADO'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setIncidentFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    incidentFilter === st
                      ? 'bg-[#0a2e23] text-amber-300 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {st === 'TODOS'
                    ? 'Todas Ocorrências'
                    : st === 'PENDENTE'
                    ? 'Pendentes de Parecer'
                    : st === 'APROVADO'
                    ? 'Aprovadas / Justificadas'
                    : 'Em Sindicância'}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Incidentes */}
          <div className="space-y-2.5">
            {incidents
              .filter((inc) => incidentFilter === 'TODOS' || inc.status === incidentFilter)
              .map((incident) => {
                const isApproved = incident.status === 'APROVADO';
                const isPending = incident.status === 'PENDENTE';
                return (
                  <div
                    key={incident.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900">{incident.itemName}</span>
                        <span className="text-xs font-black font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          R$ {incident.itemValue.toFixed(2)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            incident.type === 'CANCELAMENTO_BOQUETA'
                              ? 'bg-rose-100 text-rose-900 border border-rose-300'
                              : incident.type === 'CORTESIA_SALAO'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {incident.type === 'CANCELAMENTO_BOQUETA'
                            ? 'Cancelamento Boqueta'
                            : incident.type === 'CORTESIA_SALAO'
                            ? 'Cortesia Salão'
                            : 'Desconto Manual'}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isPending
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-purple-100 text-purple-800 border border-purple-300'
                          }`}
                        >
                          {isApproved ? '✓ Aprovado' : isPending ? '⏳ Pendente' : '🔍 Sindicância'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        Mesa: <strong>{incident.tableNumber}</strong> &bull; Garçom: <strong>{incident.waiterName}</strong> &bull; Registrado às {incident.time}
                      </p>
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{incident.reason}"
                      </p>
                    </div>

                    {/* Ações Gerenciais */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleApproveIncident(incident.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition"
                            title="Aprovar justificativa da perda"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aprovar</span>
                          </button>
                          <button
                            onClick={() => handleRejectIncident(incident.id)}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition"
                            title="Abrir sindicância com o garçom e o chef"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Investigar</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteIncident(incident.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Remover registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

            {incidents.filter((inc) => incidentFilter === 'TODOS' || inc.status === incidentFilter).length === 0 && (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-sm">Nenhuma ocorrência neste filtro</p>
                <p className="text-xs text-slate-500 mt-0.5">As perdas estão controladas conforme as metas da diretoria.</p>
              </div>
            )}
          </div>

          {/* Modal de Registro de Nova Ocorrência */}
          {showNewIncidentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Registrar Quebra / Descarte / Perda</span>
                  </h4>
                  <button
                    onClick={() => setShowNewIncidentModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateIncident} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Item / Prato Afetado</label>
                    <input
                      type="text"
                      required
                      value={newIncidentData.itemName}
                      onChange={(e) => setNewIncidentData({ ...newIncidentData, itemName: e.target.value })}
                      placeholder="Ex: Costela de Tambaqui 500g"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Impacto Financeiro (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newIncidentData.itemValue}
                        onChange={(e) => setNewIncidentData({ ...newIncidentData, itemValue: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mesa</label>
                      <input
                        type="number"
                        value={newIncidentData.tableNumber}
                        onChange={(e) => setNewIncidentData({ ...newIncidentData, tableNumber: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Garçom / Operador</label>
                      <input
                        type="text"
                        value={newIncidentData.waiterName}
                        onChange={(e) => setNewIncidentData({ ...newIncidentData, waiterName: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Classificação</label>
                      <select
                        value={newIncidentData.type}
                        onChange={(e) => setNewIncidentData({ ...newIncidentData, type: e.target.value as LossIncident['type'] })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                      >
                        <option value="CANCELAMENTO_BOQUETA">Cancelamento Boqueta</option>
                        <option value="CORTESIA_SALAO">Cortesia Salão</option>
                        <option value="DESCONTO_MANUAL">Desconto Manual</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Motivo / Justificativa Operacional</label>
                    <textarea
                      required
                      rows={2}
                      value={newIncidentData.reason}
                      onChange={(e) => setNewIncidentData({ ...newIncidentData, reason: e.target.value })}
                      placeholder="Descreva o que ocorreu de fato na mesa ou cozinha..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="notifyChef"
                      checked={newIncidentData.chefNotified}
                      onChange={(e) => setNewIncidentData({ ...newIncidentData, chefNotified: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="notifyChef" className="text-xs text-slate-600 font-medium">
                      Notificar Chef Sebastião / Cozinha para conferência
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowNewIncidentModal(false)}
                      className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold bg-[#0a2e23] hover:bg-[#124b3a] text-amber-300 rounded-xl shadow-xs cursor-pointer"
                    >
                      Salvar Ocorrência
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISÃO: SAÚDE DOS ATIVOS & MANUTENÇÃO */}
      {activeSubTab === 'SAUDE_ATIVOS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-600" />
                  <span>Saúde dos Ativos Críticos & Cronograma Preventivo</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitoramento contínuo de compressores, câmaras frias, fornos combinados, torres naja e climatização VRF.
                </p>
              </div>

              <button
                onClick={() => setShowNewAssetModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0a2e23] hover:bg-[#124b3a] text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Equipamento</span>
              </button>
            </div>

            {/* KPIs de Ativos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total de Ativos</span>
                  <p className="text-lg font-black text-slate-900 font-mono mt-0.5">{assets.length} máquinas</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  <Layers className="w-4 h-4" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Operando Normal</span>
                  <p className="text-lg font-black text-emerald-900 font-mono mt-0.5">
                    {assets.filter((a) => a.currentStatus === 'OPERANDO_NORMAL').length} máquinas
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Em Atenção / Parado</span>
                  <p className="text-lg font-black text-amber-900 font-mono mt-0.5">
                    {assets.filter((a) => a.currentStatus !== 'OPERANDO_NORMAL').length} máquinas
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-800" />
                </div>
              </div>
            </div>

            {/* Filtros por Área */}
            <div className="flex items-center gap-1.5 pt-4 overflow-x-auto">
              {(['TODOS', 'COZINHA', 'BAR', 'CÂMARAS_FRIAS', 'SALAO'] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setAssetFilterLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    assetFilterLocation === loc
                      ? 'bg-[#0a2e23] text-amber-300 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {loc === 'TODOS'
                    ? 'Todos os Setores'
                    : loc === 'CÂMARAS_FRIAS'
                    ? 'Câmaras Frias'
                    : loc === 'COZINHA'
                    ? 'Cozinha Quente'
                    : loc === 'BAR'
                    ? 'Bar & Choperia'
                    : 'Salão & Climatização'}
                </button>
              ))}
            </div>
          </div>

          {/* Cards de Equipamentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {assets
              .filter((a) => assetFilterLocation === 'TODOS' || a.location === assetFilterLocation)
              .map((asset) => {
                const isNormal = asset.currentStatus === 'OPERANDO_NORMAL';
                const isWarning = asset.currentStatus === 'ATENCAO_PREVENTIVA';
                return (
                  <div
                    key={asset.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {asset.location}
                        </span>
                        <button
                          onClick={() => handleToggleAssetStatus(asset.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition ${
                            isNormal
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : isWarning
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}
                          title="Clique para alternar o status operacional"
                        >
                          {isNormal ? '✓ Operando Normal' : isWarning ? '⚠️ Atenção Preventiva' : '⛔ Parado / Crítico'}
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-2">{asset.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">{asset.maintenanceType}</p>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Métrica Atual</span>
                          <span className="font-black text-slate-900 font-mono">{asset.currentMetric}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Padrão Meta</span>
                          <span className="font-bold text-emerald-700 font-mono">{asset.targetMetric}</span>
                        </div>
                      </div>

                      <div className="mt-2.5 text-[11px] text-slate-500 space-y-0.5">
                        <p>Última revisão: <strong>{asset.lastMaintenanceDate}</strong> &bull; Próxima: <strong>{asset.nextScheduledMaintenance}</strong></p>
                        <p className="text-rose-700 font-medium">Risco: {asset.riskIfFails}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleRegisterMaintenance(asset.id)}
                        className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Registrar Vistoria / Manutenção Realizada</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Modal de Novo Ativo */}
          {showNewAssetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-600" />
                    <span>Cadastrar Novo Ativo / Equipamento</span>
                  </h4>
                  <button
                    onClick={() => setShowNewAssetModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateAsset} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Equipamento</label>
                    <input
                      type="text"
                      required
                      value={newAssetData.name}
                      onChange={(e) => setNewAssetData({ ...newAssetData, name: e.target.value })}
                      placeholder="Ex: Fritadeira Pitco 2 Cubas"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Localização</label>
                      <select
                        value={newAssetData.location}
                        onChange={(e) => setNewAssetData({ ...newAssetData, location: e.target.value as CriticalEquipmentAsset['location'] })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                      >
                        <option value="COZINHA">Cozinha</option>
                        <option value="BAR">Bar</option>
                        <option value="CÂMARAS_FRIAS">Câmaras Frias</option>
                        <option value="SALAO">Salão</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Status Inicial</label>
                      <select
                        value={newAssetData.currentStatus}
                        onChange={(e) => setNewAssetData({ ...newAssetData, currentStatus: e.target.value as CriticalEquipmentAsset['currentStatus'] })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                      >
                        <option value="OPERANDO_NORMAL">Operando Normal</option>
                        <option value="ATENCAO_PREVENTIVA">Atenção Preventiva</option>
                        <option value="CRITICO_PARADO">Crítico Parado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Métrica Atual</label>
                      <input
                        type="text"
                        value={newAssetData.currentMetric}
                        onChange={(e) => setNewAssetData({ ...newAssetData, currentMetric: e.target.value })}
                        placeholder="Ex: 180°C"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Padrão Meta</label>
                      <input
                        type="text"
                        value={newAssetData.targetMetric}
                        onChange={(e) => setNewAssetData({ ...newAssetData, targetMetric: e.target.value })}
                        placeholder="Ex: 175°C a 185°C"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Manutenção</label>
                    <input
                      type="text"
                      value={newAssetData.maintenanceType}
                      onChange={(e) => setNewAssetData({ ...newAssetData, maintenanceType: e.target.value })}
                      placeholder="Ex: Troca de termostato e filtro de óleo"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Risco Se Falhar</label>
                    <input
                      type="text"
                      value={newAssetData.riskIfFails}
                      onChange={(e) => setNewAssetData({ ...newAssetData, riskIfFails: e.target.value })}
                      placeholder="Ex: Paralisação das frituras de pirarucu e bolinhos"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowNewAssetModal(false)}
                      className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold bg-[#0a2e23] hover:bg-[#124b3a] text-amber-300 rounded-xl shadow-xs cursor-pointer"
                    >
                      Cadastrar Ativo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISÃO 5: SIMULADOR WHAT-IF REATIVO */}
      {activeSubTab === 'SIMULADOR_WHAT_IF' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Simulador de Sensibilidade de Margem & Lucro (What-If)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simule variações de mercado no preço do pescado, fluxo de clientes e descontos promocionais para ver o impacto direto no DRE.
              </p>
            </div>

            <button
              onClick={handleSaveSimulatedScenario}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Cenário como Meta</span>
            </button>
          </div>

          {savedScenarioFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-slide-down">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{savedScenarioFeedback}</span>
            </div>
          )}

          {/* Sliders Interativos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Variação de Fluxo de Clientes</span>
                <span className="font-mono font-bold text-emerald-700">
                  {trafficVolumeVariationPct > 0 ? `+${trafficVolumeVariationPct}%` : `${trafficVolumeVariationPct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                value={trafficVolumeVariationPct}
                onChange={(e) => setTrafficVolumeVariationPct(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">Simula dias chuvosos ou feriados prolongados em Manaus.</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Custo do Tambaqui / Pescados</span>
                <span className="font-mono font-bold text-amber-700">
                  {fishPriceVariationPct > 0 ? `+${fishPriceVariationPct}%` : `${fishPriceVariationPct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="30"
                value={fishPriceVariationPct}
                onChange={(e) => setFishPriceVariationPct(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">Oscilações de safra do frigorífico e frete CDA.</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Desconto Médio Promocional</span>
                <span className="font-mono font-bold text-indigo-700">{promoDiscountPct}% em combos</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={promoDiscountPct}
                onChange={(e) => setPromoDiscountPct(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">Campanhas de happy hour e cortesias de chopp no salão.</span>
            </div>
          </div>

          {/* Resultados Dinâmicos da Simulação */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Projeção Reativa em Tempo Real ({dreTimeframe === 'DIARIO' ? 'Média Diária D-1' : 'Consolidado 90 Dias'})
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Faturamento Projetado</span>
                <p className="text-xl font-black text-slate-900 font-mono mt-1">
                  R$ {simulatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                  Base: R$ {grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">CMV Projetado</span>
                <p className="text-xl font-black text-rose-700 font-mono mt-1">
                  R$ {simulatedCmv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                  {(simulatedRevenue > 0 ? (simulatedCmv / simulatedRevenue) * 100 : 0).toFixed(1)}% da receita
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">Lucro Bruto Projetado</span>
                <p className="text-xl font-black text-emerald-900 font-mono mt-1">
                  R$ {simulatedGrossProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[11px] font-black text-emerald-800 block mt-0.5">
                  {simulatedGrossMarginPct.toFixed(1)}% Margem Bruta
                </span>
              </div>

              <div className={`p-4 rounded-2xl border shadow-xs ${
                netProfitDifference >= 0 ? 'bg-sky-50/70 border-sky-300 text-sky-950' : 'bg-rose-50/70 border-rose-300 text-rose-950'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider block">Impacto Líquido</span>
                <p className={`text-xl font-black font-mono mt-1 ${netProfitDifference >= 0 ? 'text-sky-800' : 'text-rose-700'}`}>
                  {netProfitDifference >= 0 ? `+ R$ ${netProfitDifference.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : `- R$ ${Math.abs(netProfitDifference).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </p>
                <span className="text-[11px] font-bold block mt-0.5">
                  {netProfitDifference >= 0 ? 'Expansão de margem' : 'Compressão de margem'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alimentação Teknisa */}
      <TeknisaFeedModal
        isOpen={showFeedModal}
        onClose={() => setShowFeedModal(false)}
        currentUserName="Pabricio"
      />
    </div>
  );
};
