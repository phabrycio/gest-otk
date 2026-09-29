import { useState, useMemo, useRef } from 'react';
import {
  Package, AlertTriangle, Camera, FileText, TrendingDown,
  Plus, Search, Filter, RefreshCw, ShoppingCart, ChevronDown,
  ChevronRight, CheckCircle, CheckCircle2, XCircle, Clock, Upload,
  BarChart3, Zap, Eye, ArrowUpCircle, ArrowDownCircle,
  Boxes, Flame, Leaf, Wine, Beef, Fish, Star,
  ShieldAlert, Brain, CircleAlert, TrendingUp, Calendar,
  ClipboardList, Send, Lock, ShieldCheck, Check, Sparkles,
  Layers, Users, Shield, ArrowRight, Truck,
} from 'lucide-react';
import type { VirtualStockItem, StockAlert, ForecastedOrder } from '../types/stock.types';
import type { StockSector, UserRole } from '../types/restaurant.types';
import { USER_ROLE_LABELS, STOCK_SECTOR_LABELS } from '../types/restaurant.types';
import { getSession } from '../services/restaurantStore';
import { getPermissions } from '../services/permissions';
import {
  MOCK_STOCK_ITEMS,
  MOCK_STOCK_ALERTS,
  MOCK_FORECASTED_ORDER,
  MOCK_STOCK_HEALTH,
  MOCK_NF_RECORDS,
  MOCK_RECIPES,
  MOCK_CANCELLATIONS,
  MOCK_SALES_IMPORTS,
} from '../data/stockMockData';
import NfOcrModal from './stock/NfOcrModal';
import RecipeOcrModal from './stock/RecipeOcrModal';
import SalesImportModal from './stock/SalesImportModal';
import CancellationsModal from './stock/CancellationsModal';
import StockOrderModal from './stock/StockOrderModal';
import { CdaTransferModal } from './stock/CdaTransferModal';
import {
  getVirtualStockItems,
  getStockMovements,
  getNfRecords,
  getConfirmedNfRecords,
  getCdaMaterialTransfers,
  recordNfOrAfEntry,
  recordSalesDeduction,
} from '../services/virtualStockStore';
import { OFFICIAL_ENGENHO_MENU } from '../data/menuRecipesData';

// ---- Helpers de cor/status ----

function statusColor(status: VirtualStockItem['status']) {
  switch (status) {
    case 'RUPTURA':  return { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-500', badge: 'bg-red-600 text-white', light: 'bg-red-50' };
    case 'CRITICAL': return { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-400', badge: 'bg-orange-500 text-white', light: 'bg-orange-50' };
    case 'ATTENTION': return { bg: 'bg-amber-400', text: 'text-amber-600', border: 'border-amber-400', badge: 'bg-amber-400 text-slate-900', light: 'bg-amber-50' };
    default:          return { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-400', badge: 'bg-emerald-500 text-white', light: 'bg-emerald-50' };
  }
}

function alertSeverityColor(severity: StockAlert['severity']) {
  switch (severity) {
    case 'RUPTURA':  return 'border-l-red-600 bg-red-50';
    case 'CRITICAL': return 'border-l-orange-500 bg-orange-50';
    case 'WARNING':  return 'border-l-amber-400 bg-amber-50';
    default:         return 'border-l-blue-400 bg-blue-50';
  }
}

function categoryIcon(cat: VirtualStockItem['category']) {
  switch (cat) {
    case 'CARNES_NOBRES':       return <Beef className="w-3.5 h-3.5 text-red-500" />;
    case 'PESCADOS_REGIONAIS':  return <Fish className="w-3.5 h-3.5 text-blue-500" />;
    case 'FRUTOS_DO_MAR':       return <Star className="w-3.5 h-3.5 text-indigo-500" />;
    case 'BEBIDAS_DESTILADOS':  return <Wine className="w-3.5 h-3.5 text-purple-500" />;
    case 'BEBIDAS_VINHOS':      return <Wine className="w-3.5 h-3.5 text-rose-500" />;
    case 'HORTIFRUTI_REGIONAL': return <Leaf className="w-3.5 h-3.5 text-green-500" />;
    case 'SECOS_ESPECIARIAS':   return <Flame className="w-3.5 h-3.5 text-amber-500" />;
    case 'DOCES_CAIXA':         return <Sparkles className="w-3.5 h-3.5 text-pink-500" />;
    case 'CHARCUTARIA':         return <Beef className="w-3.5 h-3.5 text-amber-600" />;
    default:                    return <Package className="w-3.5 h-3.5 text-slate-400" />;
  }
}

function gradeColor(grade: string) {
  switch (grade) {
    case 'A': return 'text-emerald-600 bg-emerald-100';
    case 'B': return 'text-blue-600 bg-blue-100';
    case 'C': return 'text-amber-700 bg-amber-100';
    case 'D': return 'text-orange-700 bg-orange-100';
    default:  return 'text-red-700 bg-red-100';
  }
}

// ---- Barra de progresso de cobertura ----
function CoverageBar({ qty, min, safety, ideal }: { qty: number; min: number; safety: number; ideal: number }) {
  const pct = Math.min(100, (qty / ideal) * 100);
  const color =
    qty <= 0 ? 'bg-red-600' :
    qty <= min ? 'bg-orange-500' :
    qty <= safety ? 'bg-amber-400' : 'bg-emerald-500';
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 relative overflow-hidden">
      <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      {/* Linha de mínimo */}
      <div className="absolute top-0 h-full border-l border-orange-400/70" style={{ left: `${(min / ideal) * 100}%` }} />
    </div>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

type ActiveTab = 'dashboard' | 'estoque' | 'alertas' | 'pedido' | 'historico';

export default function VirtualStockView() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showNfModal, setShowNfModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showCancellationsModal, setShowCancellationsModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCdaTransferModal, setShowCdaTransferModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados persistentes do estoque virtual inteligente
  const [stockItems, setStockItems] = useState<VirtualStockItem[]>(() => getVirtualStockItems());
  const [movements, setMovements] = useState(() => getStockMovements());
  const [alerts, setAlerts] = useState(MOCK_STOCK_ALERTS);
  const [order] = useState<ForecastedOrder>(MOCK_FORECASTED_ORDER);
  const health = MOCK_STOCK_HEALTH;

  // Sessão e permissões do usuário logado
  const session = useMemo(() => getSession(), []);
  const currentUser = session?.user;
  const userRole: UserRole = currentUser?.role ?? 'PROPRIETARIO';
  const permissions = useMemo(() => getPermissions(userRole), [userRole]);
  const canViewFullStock = permissions.canViewFullStock;

  // Setor selecionado — inicializa com o setor do usuário ou ALL
  const [selectedSector, setSelectedSector] = useState<StockSector | 'ALL'>(
    currentUser?.sector ?? 'ALL'
  );

  // Estados de contagem física (1ª contagem e recontagem)
  const [firstCounts, setFirstCounts] = useState<Record<string, string>>({});
  const [recounts, setRecounts] = useState<Record<string, string>>({});
  const [savedCounts, setSavedCounts] = useState<Record<string, { first?: number; recount?: number; hasDivergence: boolean; verified: boolean }>>({});
  const [amandaCheckedExpiry, setAmandaCheckedExpiry] = useState<Record<string, boolean>>({});

  // Handlers de Integração Real:
  const handleNfConfirmed = (data: any) => {
    const res = recordNfOrAfEntry({
      id: `nf-${Date.now()}`,
      nfNumber: data.nfNumber || `NF-${Date.now()}`,
      supplier: data.supplier || 'Fornecedor Cadastrado',
      issueDate: data.issueDate || new Date().toISOString().slice(0, 10),
      receiptDate: new Date().toISOString().slice(0, 10),
      totalValue: data.totalValue || 0,
      ocrConfidence: data.ocrConfidence || 95,
      status: 'CONFIRMADA',
      receivedBy: currentUser?.name || 'Gerente',
      items: (data.items || []).map((it: any) => ({
        id: it.id || `it-${Date.now()}`,
        name: it.name,
        cdaCode: it.cdaCode,
        qty: Number(it.qty) || 0,
        unit: it.unit || 'kg',
        unitCost: Number(it.unitCost) || 0,
        totalValue: (Number(it.qty) || 0) * (Number(it.unitCost) || 0),
        status: 'OK',
      })),
    }, currentUser?.name || 'Gerente');

    setStockItems(getVirtualStockItems());
    setMovements(getStockMovements());
    setToastMessage(`Nota AF/NF nº ${data.nfNumber} registrada! ${res.updatedItemsCount + res.newItemsCount} itens adicionados/atualizados no estoque.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleSalesApplied = (importData: any) => {
    const res = recordSalesDeduction(importData);
    setStockItems(getVirtualStockItems());
    setMovements(getStockMovements());
    setToastMessage(`Vendas processadas! ${res.totalDeductionsApplied} baixas de insumos aplicadas no estoque virtual via Fichas Técnicas.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleCdaTransferSuccess = (count: number) => {
    setStockItems(getVirtualStockItems());
    setMovements(getStockMovements());
    setToastMessage(`Nota de Transferência CDA recebida! ${count} insumos adicionados ao estoque da loja.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Filtra items considerando busca, status e setor
  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cdaCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'ALL' || item.status === filterStatus;
      const matchesSector = selectedSector === 'ALL' || item.sector === selectedSector;
      return matchesSearch && matchesFilter && matchesSector;
    });
  }, [stockItems, searchQuery, filterStatus, selectedSector]);

  const unreadAlerts = alerts.filter((a) => !a.isRead && !a.isDismissed).length;
  const criticalAlerts = alerts.filter((a) => (a.severity === 'CRITICAL' || a.severity === 'RUPTURA') && !a.isDismissed);

  const dismissAlert = (id: string) =>
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, isDismissed: true } : a));

  const markAllRead = () =>
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));

  const counts = useMemo(() => ({
    SAFE: stockItems.filter((i) => i.status === 'SAFE').length,
    ATTENTION: stockItems.filter((i) => i.status === 'ATTENTION').length,
    CRITICAL: stockItems.filter((i) => i.status === 'CRITICAL').length,
    RUPTURA: stockItems.filter((i) => i.status === 'RUPTURA').length,
  }), [stockItems]);

  const TABS: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'estoque', label: 'Estoque & Contagem', icon: <Boxes className="w-4 h-4" /> },
    { id: 'alertas', label: 'Alertas', icon: <AlertTriangle className="w-4 h-4" />, badge: unreadAlerts },
    { id: 'pedido', label: 'Pedido IA', icon: <Brain className="w-4 h-4" /> },
    { id: 'historico', label: 'Histórico', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">

      {/* ---- Header da seção ---- */}
      <div className="bg-gradient-to-r from-[#0a2e23] to-[#123e30] text-white px-4 py-4 mb-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Boxes className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-base">Estoque Virtual Inteligente</h2>
            </div>
            <p className="text-xs text-emerald-200/80">Motor de rastreabilidade com IA · Tk Gestão e Tecnologia</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black ${gradeColor(health.grade)}`}>
            <span className="text-lg leading-none">{health.grade}</span>
            <div>
              <div className="font-black">{health.overall}/100</div>
              <div className="font-medium opacity-70 text-[10px]">saúde</div>
            </div>
          </div>
        </div>

        {/* Banner de Identificação de Perfil e Setor */}
        <div className="mt-3 bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <span className="font-bold text-amber-300">
                {currentUser?.name || 'Operador'} ({USER_ROLE_LABELS[userRole]})
              </span>
              <span className="text-emerald-200/70 ml-1.5 text-[11px]">
                {currentUser?.sector ? `• Setor: ${STOCK_SECTOR_LABELS[currentUser.sector]}` : '• Acesso Geral'}
              </span>
            </div>
          </div>
          {!canViewFullStock && (
            <span className="text-[10px] font-bold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Contagem Cega Ativa
            </span>
          )}
          {canViewFullStock && (
            <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Estoque Virtual Full
            </span>
          )}
        </div>

        {/* Ações Rápidas de Integração */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
          {[
            { icon: <Camera className="w-4 h-4" />, label: 'Entrada NF / AF', color: 'bg-amber-500 hover:bg-amber-400', action: () => setShowNfModal(true) },
            { icon: <Truck className="w-4 h-4" />, label: 'Transf. CDA', color: 'bg-blue-600 hover:bg-blue-500', action: () => setShowCdaTransferModal(true) },
            { icon: <FileText className="w-4 h-4" />, label: 'Ficha Técnica', color: 'bg-emerald-600 hover:bg-emerald-500', action: () => setShowRecipeModal(true) },
            { icon: <Upload className="w-4 h-4" />, label: 'Baixa Vendas', color: 'bg-purple-600 hover:bg-purple-500', action: () => setShowSalesModal(true) },
            { icon: <TrendingDown className="w-4 h-4" />, label: 'Cancelamento', color: 'bg-rose-600 hover:bg-rose-500', action: () => setShowCancellationsModal(true) },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={`${btn.color} text-white rounded-xl p-2.5 flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs`}
            >
              {btn.icon}
              <span className="text-[10px] font-bold truncate w-full text-center">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Notificação Toast */}
        {toastMessage && (
          <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white p-1">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>


      {/* ---- Tabs ---- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors relative shrink-0 ${
                activeTab === tab.id
                  ? 'border-[#0a2e23] text-[#0a2e23]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-0.5 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB: DASHBOARD                                                */}
      {/* ============================================================ */}
      {activeTab === 'dashboard' && (
        <div className="p-4 space-y-4">

          {/* Alerta urgente top */}
          {criticalAlerts.length > 0 && (
            <div className="bg-red-600 text-white rounded-2xl p-3.5 flex items-start gap-3 shadow-md">
              <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0 animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm">{criticalAlerts[0].title}</p>
                <p className="text-xs text-red-100 mt-0.5 line-clamp-2">{criticalAlerts[0].description}</p>
              </div>
              <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded-lg shrink-0">
                {criticalAlerts.length} crítico{criticalAlerts.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Score cards */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Seguro', count: counts.SAFE, color: 'bg-emerald-500', textColor: 'text-emerald-700', bg: 'bg-emerald-50' },
              { label: 'Atenção', count: counts.ATTENTION, color: 'bg-amber-400', textColor: 'text-amber-700', bg: 'bg-amber-50' },
              { label: 'Crítico', count: counts.CRITICAL, color: 'bg-orange-500', textColor: 'text-orange-700', bg: 'bg-orange-50' },
              { label: 'Ruptura', count: counts.RUPTURA, color: 'bg-red-600', textColor: 'text-red-700', bg: 'bg-red-50' },
            ].map((card) => (
              <button
                key={card.label}
                onClick={() => { setFilterStatus(card.label === 'Seguro' ? 'SAFE' : card.label === 'Atenção' ? 'ATTENTION' : card.label === 'Crítico' ? 'CRITICAL' : 'RUPTURA'); setActiveTab('estoque'); }}
                className={`${card.bg} rounded-2xl p-3 text-center border border-slate-200/60 active:scale-95 transition-transform`}
              >
                <div className={`text-2xl font-black ${card.textColor}`}>{card.count}</div>
                <div className={`text-[10px] font-semibold ${card.textColor} mt-0.5`}>{card.label}</div>
              </button>
            ))}
          </div>

          {/* Saúde do Estoque */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-800 text-sm">Análise IA — Saúde do Estoque</span>
              </div>
              <span className="text-[10px] text-slate-400">Hoje, {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            {/* Score bar */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black ${gradeColor(health.grade)}`}>
                {health.grade}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Score de Saúde</span>
                  <span className="font-bold text-slate-700">{health.overall}/100</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all ${health.overall >= 85 ? 'bg-emerald-500' : health.overall >= 70 ? 'bg-blue-500' : health.overall >= 55 ? 'bg-amber-400' : 'bg-red-500'}`}
                    style={{ width: `${health.overall}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
              🧠 {health.aiSummary}
            </p>

            {/* Métricas */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                { label: 'Cobertura média', value: `${health.breakdown.coverageDays} dias`, icon: <Calendar className="w-3 h-3 text-blue-500" /> },
                { label: 'Itens em risco', value: `${health.breakdown.ruptureDangerCount} itens`, icon: <CircleAlert className="w-3 h-3 text-red-500" /> },
                { label: 'Alertas de validade', value: `${health.breakdown.expiryAlertCount} lote(s)`, icon: <Clock className="w-3 h-3 text-amber-500" /> },
                { label: 'Desvio CMV', value: `+${health.breakdown.cmvRealVsTheoretical}%`, icon: <TrendingUp className="w-3 h-3 text-orange-500" /> },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  {m.icon}
                  <div>
                    <div className="text-[10px] text-slate-400">{m.label}</div>
                    <div className="text-xs font-bold text-slate-700">{m.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Itens Críticos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Itens que exigem ação
              </span>
              <button onClick={() => setActiveTab('estoque')} className="text-xs text-[#0a2e23] font-semibold flex items-center gap-1">
                Ver todos <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {stockItems.filter((i) => i.status !== 'SAFE').length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-500 opacity-60" />
                  Nenhum insumo em estado crítico ou de ruptura no momento.
                </div>
              ) : (
                stockItems.filter((i) => i.status !== 'SAFE').slice(0, 5).map((item) => {
                  const sc = statusColor(item.status);
                  return (
                    <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${sc.bg} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <CoverageBar qty={item.availableQty} min={item.minStock} safety={item.safetyStock} ideal={item.idealStock} />
                          <span className="text-[10px] text-slate-400 shrink-0">{item.availableQty}{item.unit}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${sc.badge}`}>
                        {item.status === 'RUPTURA' ? 'RUPTURA' : item.status === 'CRITICAL' ? `${item.daysUntilRuptura}d` : 'ATENÇÃO'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Pedido IA Preview */}
          <div className="bg-gradient-to-br from-[#0a2e23] to-[#1a5c42] rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm">Pedido IA Sugerido</span>
              <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-black">AUTO</span>
            </div>
            <p className="text-xs text-emerald-200/80 mb-3">
              {order.items.length} itens · Entrega estimada: {order.deliveryDateEstimate} · Total: R$ {order.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="space-y-1.5 mb-3">
              {order.items.filter((i) => i.urgency === 'CRITICO').map((i) => (
                <div key={i.itemId} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                  <AlertTriangle className="w-3 h-3 text-red-300 shrink-0" />
                  <span className="text-xs flex-1 truncate">{i.itemName}</span>
                  <span className="text-xs font-bold text-amber-300">{i.suggestedOrderQty} {i.unit}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowOrderModal(true)}
              className="w-full bg-amber-400 text-slate-900 font-black text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4" />
              Revisar e Aprovar Pedido
            </button>
          </div>

          {/* NFs Recentes */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                NFs Recentes
              </span>
              <button className="text-xs text-[#0a2e23] font-semibold">Ver todas</button>
            </div>
            {getNfRecords().length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <FileText className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                Nenhuma nota fiscal registrada hoje.
              </div>
            ) : (
              getNfRecords().map((nf) => (
                <div key={nf.id} className="px-4 py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{nf.nfNumber}</p>
                      <p className="text-[10px] text-slate-400">{nf.supplier} · {new Date(nf.receiptDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700">R$ {nf.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        nf.status === 'CONFIRMADA' ? 'bg-emerald-100 text-emerald-700' :
                        nf.status === 'COM_DIVERGENCIA' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {nf.status === 'CONFIRMADA' ? '✓ Confirmada' : nf.status === 'COM_DIVERGENCIA' ? '⚠ Divergência' : nf.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: ESTOQUE & CONTAGEM POR SETOR                           */}
      {/* ============================================================ */}
      {activeTab === 'estoque' && (
        <div className="p-4 space-y-3">
          {/* Seletor de Setores de Responsabilidade */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-[11px] font-bold text-slate-500 mb-1.5 px-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Filtrar por Área de Gestão / Setor:</span>
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { id: 'ALL', label: 'Todos os Setores (Visão Geral)' },
                { id: 'COZINHA_FREEZER_SECO', label: 'Cozinha: Freezer & Seco (Mádio / Esmael)' },
                { id: 'BAR_BEBIDAS', label: 'Bar: Itens Gerais & Chopp (Pedro)' },
                { id: 'VINHOS_CACHACAS_CHARCUT', label: 'Comissária: Vinhos & Cachaças (Anne / Elendia)' },
                { id: 'CAIXA_BOMBONS_BALAS', label: 'Caixa: Balas, Bombons & Validades (Amanda)' },
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    selectedSector === sec.id
                      ? 'bg-[#0a2e23] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Destaque para Amanda (Caixa) — Verificação de Validades */}
          {(userRole === 'CAIXA' || selectedSector === 'CAIXA_BOMBONS_BALAS') && (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md border border-blue-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <h3 className="font-bold text-sm">Controle de Validades da Frente de Caixa</h3>
                    <span className="text-[10px] bg-blue-500/40 text-blue-200 px-2 py-0.5 rounded font-black">
                      Amanda (Caixa)
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/80 mt-1">
                    Verificação e registro diário dos itens expostos no balcão: bombons, chocolates e balas.
                  </p>
                </div>
              </div>

              {stockItems.filter((i) => i.category === 'DOCES_CAIXA').length === 0 ? (
                <div className="bg-white/10 rounded-xl p-3 text-center text-xs text-blue-200 mt-3">
                  Nenhum lote de balas ou bombons cadastrado no balcão no momento.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {stockItems
                    .filter((i) => i.category === 'DOCES_CAIXA')
                    .map((it) => (
                      <div key={it.id} className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{it.name}</p>
                          <p className="text-[10px] text-emerald-300 font-semibold">Estoque: {it.availableQty} {it.unit}</p>
                        </div>
                        <button
                          onClick={() => setAmandaCheckedExpiry((prev) => ({ ...prev, [it.id]: true }))}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            amandaCheckedExpiry[it.id]
                              ? 'bg-emerald-500 text-white'
                              : 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                          }`}
                        >
                          {amandaCheckedExpiry[it.id] ? '✓ Aferido' : 'Verificar'}
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Destaque para Supervisora (Patricia) — Lançamentos e Contagem Cega */}
          {userRole === 'SUPERVISOR' && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Painel da Supervisão — Patricia</span>
                </p>
                <p className="text-[11px] text-indigo-700/80 mt-0.5">
                  O estoque virtual é cego. Registre a 1ª contagem; o sistema acusará necessidade de recontagem em divergências.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSalesModal(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Lançar Vendas Diárias</span>
                </button>
                <button
                  onClick={() => setShowNfModal(true)}
                  className="px-3 py-1.5 bg-white border border-indigo-300 text-indigo-800 text-xs font-bold rounded-xl hover:bg-indigo-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Produto</span>
                </button>
              </div>
            </div>
          )}

          {/* Filtros de Busca e Status */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar insumo, código ou responsável..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2e23]/20"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 bg-white text-slate-600 focus:outline-none"
            >
              <option value="ALL">Todos os Status</option>
              <option value="SAFE">Seguro</option>
              <option value="ATTENTION">Atenção</option>
              <option value="CRITICAL">Crítico</option>
              <option value="RUPTURA">Ruptura</option>
            </select>
          </div>

          {/* Lista de Itens com Contagem e Recontagem */}
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const sc = statusColor(item.status);
              const countState = savedCounts[item.id];
              const fCount = firstCounts[item.id] ?? '';
              const rCount = recounts[item.id] ?? '';

              return (
                <div key={item.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${sc.border}`}>
                  <div className="p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {categoryIcon(item.category)}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{item.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {item.cdaCode} · {item.primarySupplier}
                            {item.responsiblePerson && (
                              <span className="text-emerald-700 font-semibold ml-1.5">
                                • {item.responsiblePerson}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg shrink-0 ${sc.badge}`}>
                        {item.status === 'RUPTURA' ? '🔴 RUPTURA' :
                         item.status === 'CRITICAL' ? '🟠 CRÍTICO' :
                         item.status === 'ATTENTION' ? '🟡 ATENÇÃO' : '🟢 OK'}
                      </span>
                    </div>

                    {/* Barra de estoque (com modo cego para supervisores e operadores) */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>
                          Estoque Virtual:{' '}
                          {canViewFullStock ? (
                            <strong className={`${sc.text}`}>{item.availableQty} {item.unit}</strong>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200">
                              <Lock className="w-3 h-3 text-amber-600" /> Oculto (Contagem Cega)
                            </span>
                          )}
                        </span>
                        <span>Ideal: {item.idealStock} {item.unit}</span>
                      </div>
                      <CoverageBar qty={item.availableQty} min={item.minStock} safety={item.safetyStock} ideal={item.idealStock} />
                    </div>

                    {/* Módulo Interativo de Contagem e Recontagem */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 bg-slate-50/70 -mx-3.5 -mb-3.5 p-3 rounded-b-2xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-slate-600">
                            1ª Contagem ({item.unit}):
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Qtd..."
                            value={fCount}
                            onChange={(e) => setFirstCounts((prev) => ({ ...prev, [item.id]: e.target.value }))}
                            className="w-20 px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 font-bold"
                          />
                          <button
                            onClick={() => {
                              const val = parseFloat(fCount);
                              if (isNaN(val)) return;
                              const hasDiv = Math.abs(val - item.virtualQty) > 0.05;
                              setSavedCounts((prev) => ({
                                ...prev,
                                [item.id]: {
                                  first: val,
                                  hasDivergence: hasDiv,
                                  verified: !hasDiv,
                                },
                              }));
                            }}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            Salvar
                          </button>
                        </div>

                        {/* Status da 1ª Contagem */}
                        {countState?.verified && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Contagem Aprovada ({countState.first ?? countState.recount} {item.unit})
                          </span>
                        )}

                        {/* Se divergência detectada -> Recontagem necessária */}
                        {countState?.hasDivergence && (
                          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 p-1.5 rounded-xl">
                            <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              Divergência! Faça a 2ª Contagem:
                            </span>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Recontar..."
                              value={rCount}
                              onChange={(e) => setRecounts((prev) => ({ ...prev, [item.id]: e.target.value }))}
                              className="w-20 px-2 py-1 text-xs border border-amber-400 rounded-lg bg-white focus:outline-none font-bold text-amber-950"
                            />
                            <button
                              onClick={() => {
                                const val = parseFloat(rCount);
                                if (isNaN(val)) return;
                                setSavedCounts((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...prev[item.id],
                                    recount: val,
                                    hasDivergence: false,
                                    verified: true,
                                  },
                                }));
                              }}
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-[10px] font-black cursor-pointer"
                            >
                              Confirmar Recontagem
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">
                Nenhum insumo encontrado para este setor ou filtro selecionado.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: ALERTAS                                                  */}
      {/* ============================================================ */}
      {activeTab === 'alertas' && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">
              {alerts.filter((a) => !a.isDismissed).length} alertas ativos
            </span>
            <button onClick={markAllRead} className="text-xs text-[#0a2e23] font-semibold">
              Marcar todos como lidos
            </button>
          </div>

          {alerts.filter((a) => !a.isDismissed).map((alert) => (
            <div key={alert.id} className={`bg-white rounded-2xl border-l-4 shadow-sm p-4 ${alertSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{alert.title}</p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{alert.description}</p>
                  {alert.suggestedAction && (
                    <div className="mt-2 flex items-start gap-1.5 text-[11px] text-blue-700 bg-blue-50 rounded-lg px-2.5 py-1.5">
                      <Zap className="w-3 h-3 mt-0.5 shrink-0 text-blue-500" />
                      <span>{alert.suggestedAction}</span>
                    </div>
                  )}
                  {alert.financialImpact && (
                    <p className="mt-2 text-[10px] text-slate-400">
                      Impacto financeiro estimado: <strong className="text-slate-600">R$ {alert.financialImpact.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-500 transition-colors shrink-0"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
              {!alert.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-3 right-10" />
              )}
            </div>
          ))}

          {alerts.filter((a) => !a.isDismissed).length === 0 && (
            <div className="text-center py-16">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-600">Nenhum alerta ativo</p>
              <p className="text-xs text-slate-400 mt-1">Tudo sob controle por enquanto.</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: PEDIDO IA                                                */}
      {/* ============================================================ */}
      {activeTab === 'pedido' && (
        <div className="p-4 space-y-4">
          {/* Header do pedido */}
          <div className="bg-gradient-to-br from-[#0a2e23] to-[#1a5c42] rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-amber-400" />
              <span className="font-black text-sm">Pedido Sugerido pela IA</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-semibold">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">{order.notes}</p>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white/10 rounded-xl p-2.5 text-center">
                <div className="font-black text-base">{order.items.length}</div>
                <div className="text-[10px] text-emerald-200">itens</div>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 text-center">
                <div className="font-black text-base">R$ {(order.totalValue / 1000).toFixed(1)}k</div>
                <div className="text-[10px] text-emerald-200">total</div>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 text-center">
                <div className="font-black text-base">{order.deliveryDateEstimate.split('-')[2]}/{order.deliveryDateEstimate.split('-')[1]}</div>
                <div className="text-[10px] text-emerald-200">entrega</div>
              </div>
            </div>
          </div>

          {/* Lista de itens do pedido */}
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.itemId} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        item.urgency === 'CRITICO' ? 'bg-red-100 text-red-700' :
                        item.urgency === 'URGENTE' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {item.urgency}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{item.itemName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{item.reasoning}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-base text-slate-800">{item.suggestedOrderQty} <span className="text-xs font-normal text-slate-400">{item.unit}</span></div>
                    <div className="text-xs text-slate-500">R$ {item.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </div>
                </div>

                {/* Consumo */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Em estoque', value: `${item.currentVirtualQty} ${item.unit}` },
                    { label: 'Consumo/dia', value: `${item.avgDailyConsumption} ${item.unit}` },
                    { label: 'Prev. 7 dias', value: `${item.forecastedConsumption7Days} ${item.unit}` },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-slate-50 rounded-lg px-2 py-1.5 text-center">
                      <div className="text-[9px] text-slate-400">{stat.label}</div>
                      <div className="text-[11px] font-bold text-slate-700">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Botões de ação */}
          <div className="space-y-2">
            <button
              onClick={() => setShowOrderModal(true)}
              className="w-full bg-[#0a2e23] text-white font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4" />
              Aprovar e Enviar para o CDA
            </button>
            <button className="w-full border border-slate-200 text-slate-600 font-semibold text-sm py-3 rounded-2xl flex items-center justify-center gap-2 bg-white">
              <RefreshCw className="w-4 h-4" />
              Regenerar Pedido
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: HISTÓRICO & LEDGER DE MOVIMENTAÇÕES                     */}
      {/* ============================================================ */}
      {activeTab === 'historico' && (
        <div className="p-4 space-y-4">
          {/* Movimentações em Tempo Real (Ledger) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800 text-sm">Movimentações do Estoque Virtual</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {movements.length} registro(s) auditável(is)
              </span>
            </div>

            {movements.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                <p className="text-xs font-bold text-slate-600">Nenhuma movimentação registrada hoje</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                  As entradas de notas fiscais AF e transferências de material vindas do CDA adicionarão itens ao estoque, e as vendas processadas darão baixa automática com base nas fichas técnicas.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {movements.map((m) => (
                  <div key={m.id} className="p-3.5 flex items-start justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          m.type === 'ENTRADA_NF' ? 'bg-amber-100 text-amber-800' :
                          m.type === 'TRANSFERENCIA_ENTRADA' ? 'bg-blue-100 text-blue-800' :
                          m.type === 'CONSUMO_VENDA' ? 'bg-purple-100 text-purple-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {m.type === 'ENTRADA_NF' ? 'Entrada NF/AF' :
                           m.type === 'TRANSFERENCIA_ENTRADA' ? 'Transf. CDA' :
                           m.type === 'CONSUMO_VENDA' ? 'Baixa Vendas' : m.type}
                        </span>
                        <span className="font-bold text-slate-800">{m.itemName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{m.notes}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(m.timestamp).toLocaleTimeString('pt-BR')} &bull; Operador: {m.operatorName} &bull; Saldo: {m.balanceBefore} &rarr; {m.balanceAfter} {m.unit}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`font-mono font-bold ${m.type.startsWith('ENTRADA') || m.type === 'TRANSFERENCIA_ENTRADA' ? 'text-emerald-600' : 'text-purple-600'}`}>
                        {m.type.startsWith('ENTRADA') || m.type === 'TRANSFERENCIA_ENTRADA' ? '+' : '-'}{m.qty} {m.unit}
                      </span>
                      {m.totalValue > 0 && (
                        <p className="text-[10px] text-slate-400">R$ {m.totalValue.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fichas Técnicas Integradas com Baixa Virtual */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800 text-sm">
                  Fichas Técnicas Integradas ({OFFICIAL_ENGENHO_MENU.length} pratos do cardápio oficial)
                </span>
              </div>
              <button
                onClick={() => setShowRecipeModal(true)}
                className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" /> Nova Ficha
              </button>
            </div>
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {OFFICIAL_ENGENHO_MENU.slice(0, 8).map((dish) => (
                <div key={dish.id} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-bold text-slate-800">{dish.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {dish.ingredients.length} insumos mapeados &bull; CMV: {dish.cmvPct.toFixed(1)}% &bull; {dish.categoryLabel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">R$ {dish.sellingPrice.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400">Custo: R$ {dish.totalCost.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- Modais ---- */}
      {showNfModal && (
        <NfOcrModal
          onClose={() => setShowNfModal(false)}
          onNfConfirmed={handleNfConfirmed}
        />
      )}
      {showCdaTransferModal && (
        <CdaTransferModal
          onClose={() => setShowCdaTransferModal(false)}
          onSuccess={handleCdaTransferSuccess}
          currentUserName={currentUser?.name}
        />
      )}
      {showRecipeModal && <RecipeOcrModal onClose={() => setShowRecipeModal(false)} />}
      {showSalesModal && (
        <SalesImportModal
          onClose={() => setShowSalesModal(false)}
          onImportApplied={handleSalesApplied}
        />
      )}
      {showCancellationsModal && <CancellationsModal onClose={() => setShowCancellationsModal(false)} />}
      {showOrderModal && <StockOrderModal order={order} onClose={() => setShowOrderModal(false)} />}
    </div>
  );
}
