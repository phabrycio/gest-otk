import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  ArrowLeft,
  Edit3,
  Trash2,
  Save,
  X,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  Users,
  AlertTriangle,
  CheckCircle2,
  Settings,
  UserPlus,
  Key,
  Database,
  Cloud,
  Sparkles,
  Cpu,
  Terminal,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Lock,
} from 'lucide-react';
import type { Restaurant, UserAccount, UserRole, StockSector } from '../../types/restaurant.types';
import { USER_ROLE_LABELS, USER_ROLE_BADGE_COLORS, STOCK_SECTOR_LABELS } from '../../types/restaurant.types';
import {
  getRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getUsers,
  getUsersByRestaurant,
  addUser,
  updateUser,
  deleteUser,
} from '../../services/restaurantStore';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  ConnectionTestResult,
} from '../../services/supabaseClient';
import {
  getGeminiConfig,
  saveGeminiApiKey,
  testGeminiApiKey,
  askGemini,
} from '../../services/geminiService';
import { AuditLogsView } from './AuditLogsView';
import { logSystemAction } from '../../services/auditLogStore';
import { resetAllAppDataToZero } from '../../services/appResetService';

interface AdminPanelViewProps {
  onBack: () => void;
  backLabel?: string;
}

type AdminTab = 'RESTAURANTS' | 'USERS' | 'AUDIT_LOGS' | 'INFRA_AI';

const ALL_ROLES: UserRole[] = [
  'PROPRIETARIO',
  'GERENTE',
  'GERENTE_TREINAMENTO',
  'SUPERVISOR',
  'CHEFE_COZINHA',
  'SUB_CHEFE_COZINHA',
  'CHEFE_BAR',
  'COMISSARIA',
  'CAIXA',
  'OPERADOR',
];
const ALL_SECTORS: StockSector[] = [
  'COZINHA_FREEZER_SECO',
  'BAR_BEBIDAS',
  'VINHOS_CACHACAS_CHARCUT',
  'CAIXA_BOMBONS_BALAS',
  'GERAL_LOJA',
];

export default function AdminPanelView({ onBack, backLabel }: AdminPanelViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('RESTAURANTS');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);

  // Restaurant form
  const [showRestForm, setShowRestForm] = useState(false);
  const [editingRestId, setEditingRestId] = useState<string | null>(null);
  const [restForm, setRestForm] = useState({ name: '', shortName: '', address: '', shoppingMall: '', city: '', state: 'AM', phone: '', cnpj: '' });

  // User form
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ name: '', username: '', password: '123456', pin: '', role: 'SUPERVISOR' as UserRole, restaurantId: '', department: '', sector: '' as StockSector | '' });

  // Confirmação de delete
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ---- Infra & IA State ----
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseConfig().url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => getSupabaseConfig().anonKey);
  const [supabaseTesting, setSupabaseTesting] = useState(false);
  const [supabaseResult, setSupabaseResult] = useState<ConnectionTestResult | null>(null);
  const [supabaseSaved, setSupabaseSaved] = useState(false);

  const [geminiKey, setGeminiKey] = useState(() => getGeminiConfig().apiKey);
  const [geminiTesting, setGeminiTesting] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [geminiSaved, setGeminiSaved] = useState(false);

  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiAsking, setAiAsking] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setRestaurants(getRestaurants());
    setUsers(getUsers());
  };

  // ---- Infra & IA Handlers ----
  const handleSaveSupabase = () => {
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setSupabaseSaved(true);
    setTimeout(() => setSupabaseSaved(false), 3000);
  };

  const handleTestSupabase = async () => {
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setSupabaseTesting(true);
    setSupabaseResult(null);
    try {
      const res = await testSupabaseConnection();
      setSupabaseResult(res);
    } catch (e: any) {
      setSupabaseResult({
        connected: false,
        status: 'ERROR',
        message: e?.message || 'Erro inesperado ao testar Supabase.',
      });
    } finally {
      setSupabaseTesting(false);
    }
  };

  const handleSaveGemini = () => {
    saveGeminiApiKey(geminiKey);
    setGeminiSaved(true);
    setTimeout(() => setGeminiSaved(false), 3000);
  };

  const handleTestGemini = async () => {
    saveGeminiApiKey(geminiKey);
    setGeminiTesting(true);
    setGeminiTestResult(null);
    try {
      const res = await testGeminiApiKey(geminiKey);
      setGeminiTestResult(res);
    } catch (e: any) {
      setGeminiTestResult({ valid: false, message: e?.message || 'Falha ao testar chave Gemini.' });
    } finally {
      setGeminiTesting(false);
    }
  };

  const handleAskGeminiSupport = async () => {
    if (!aiQuestion.trim()) return;
    setAiAsking(true);
    setAiAnswer(null);
    try {
      const answer = await askGemini(aiQuestion, 'SUPORTE_TECNICO_MASTER');
      setAiAnswer(answer);
    } catch (e: any) {
      setAiAnswer(`Erro ao consultar Gemini: ${e?.message || 'Servidor indisponível'}`);
    } finally {
      setAiAsking(false);
    }
  };

  const handleCopySchemaSql = () => {
    const sqlScript = `-- SCHEMA POSTGRESQL SUPABASE • Tk Gestão e Tecnologia
CREATE TABLE IF NOT EXISTS restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  address TEXT NOT NULL,
  shopping_mall TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  phone TEXT,
  cnpj TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  pin TEXT NOT NULL,
  role TEXT NOT NULL,
  restaurant_id TEXT REFERENCES restaurants(id),
  department TEXT NOT NULL,
  sector TEXT,
  badge_color TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS freezer_tracked_items (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT REFERENCES restaurants(id),
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  batch_slot INTEGER NOT NULL,
  batch_color TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL,
  cda_validity_date DATE NOT NULL,
  current_location TEXT NOT NULL,
  initial_weight_kg NUMERIC(10,3) NOT NULL,
  current_weight_kg NUMERIC(10,3) NOT NULL,
  status TEXT NOT NULL,
  qr_code_payload TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // ---- Restaurantes ----
  const handleSaveRestaurant = () => {
    if (!restForm.name.trim() || !restForm.city.trim()) return;
    if (editingRestId) {
      updateRestaurant(editingRestId, { ...restForm, isActive: true });
      logSystemAction({
        userId: 'admin_pabricio',
        userName: 'Pabricio',
        userRole: 'Gerente em Treinamento (Master Admin)',
        module: 'CONFIGURACOES',
        action: 'Atualização de Unidade / Loja',
        details: `Atualizou os dados da unidade "${restForm.name}" (${restForm.city}/${restForm.state}).`,
        severity: 'AVISO',
        metadata: { restaurantId: editingRestId, ...restForm }
      });
    } else {
      addRestaurant({ ...restForm, isActive: true });
      logSystemAction({
        userId: 'admin_pabricio',
        userName: 'Pabricio',
        userRole: 'Gerente em Treinamento (Master Admin)',
        module: 'CONFIGURACOES',
        action: 'Criação de Nova Unidade',
        details: `Criou a nova unidade de restaurante "${restForm.name}" no sistema.`,
        severity: 'AVISO',
        metadata: { ...restForm }
      });
    }
    resetRestForm();
    refreshData();
  };

  const handleEditRestaurant = (r: Restaurant) => {
    setEditingRestId(r.id);
    setRestForm({ name: r.name, shortName: r.shortName, address: r.address, shoppingMall: r.shoppingMall || '', city: r.city, state: r.state, phone: r.phone || '', cnpj: r.cnpj || '' });
    setShowRestForm(true);
  };

  const handleDeleteRestaurant = (id: string) => {
    const target = restaurants.find(r => r.id === id);
    deleteRestaurant(id);
    logSystemAction({
      userId: 'admin_pabricio',
      userName: 'Pabricio',
      userRole: 'Gerente em Treinamento (Master Admin)',
      module: 'CONFIGURACOES',
      action: 'Exclusão de Unidade / Loja',
      details: `Removeu a unidade de restaurante "${target?.name || id}" do sistema.`,
      severity: 'CRITICO',
      metadata: { restaurantId: id, restaurantName: target?.name }
    });
    setDeleteConfirm(null);
    refreshData();
  };

  const resetRestForm = () => {
    setShowRestForm(false);
    setEditingRestId(null);
    setRestForm({ name: '', shortName: '', address: '', shoppingMall: '', city: '', state: 'AM', phone: '', cnpj: '' });
  };

  // ---- Usuários ----
  const handleSaveUser = () => {
    if (!userForm.name.trim() || !userForm.username.trim() || !userForm.restaurantId) return;
    const badgeColor = USER_ROLE_BADGE_COLORS[userForm.role];
    if (editingUserId) {
      updateUser(editingUserId, { ...userForm, sector: userForm.sector || undefined, badgeColor });
      logSystemAction({
        userId: 'admin_pabricio',
        userName: 'Pabricio',
        userRole: 'Gerente em Treinamento (Master Admin)',
        module: 'CONFIGURACOES',
        action: 'Atualização de Usuário',
        details: `Alterou permissões/cadastro do colaborador "${userForm.name}" (Cargo: ${userForm.role}).`,
        severity: 'AVISO',
        metadata: { targetUserId: editingUserId, role: userForm.role, department: userForm.department }
      });
    } else {
      addUser({ ...userForm, sector: userForm.sector || undefined, badgeColor, isActive: true });
      logSystemAction({
        userId: 'admin_pabricio',
        userName: 'Pabricio',
        userRole: 'Gerente em Treinamento (Master Admin)',
        module: 'CONFIGURACOES',
        action: 'Criação de Novo Colaborador',
        details: `Cadastrou o colaborador "${userForm.name}" com cargo "${userForm.role}".`,
        severity: 'INFO',
        metadata: { username: userForm.username, role: userForm.role, department: userForm.department }
      });
    }
    resetUserForm();
    refreshData();
  };

  const handleEditUser = (u: UserAccount) => {
    setEditingUserId(u.id);
    setUserForm({ name: u.name, username: u.username, password: u.password, pin: u.pin, role: u.role, restaurantId: u.restaurantId, department: u.department, sector: (u.sector || '') as StockSector | '' });
    setShowUserForm(true);
  };

  const handleDeleteUser = (id: string) => {
    const target = users.find(u => u.id === id);
    deleteUser(id);
    logSystemAction({
      userId: 'admin_pabricio',
      userName: 'Pabricio',
      userRole: 'Gerente em Treinamento (Master Admin)',
      module: 'CONFIGURACOES',
      action: 'Exclusão de Usuário',
      details: `Removeu o acesso do colaborador "${target?.name || id}" (Cargo: ${target?.role || 'N/A'}).`,
      severity: 'CRITICO',
      metadata: { deletedUserId: id, name: target?.name, role: target?.role }
    });
    setDeleteConfirm(null);
    refreshData();
  };

  const resetUserForm = () => {
    setShowUserForm(false);
    setEditingUserId(null);
    setUserForm({ name: '', username: '', password: '123456', pin: '', role: 'SUPERVISOR', restaurantId: '', department: '', sector: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#051c15] via-[#0a2e23] to-[#041711] text-white">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-300/70 hover:text-white text-xs font-semibold mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{backLabel || 'Voltar ao Sistema'}</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-black tracking-tight text-white">Painel Administrativo Master</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Pabricio • Full Access
                </span>
              </div>
              <p className="text-xs text-emerald-300/70 mt-0.5">
                Tk Gestão e Tecnologia — Configuração de Lojas, Usuários, Supabase & IA Gemini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sistema Online
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            { id: 'RESTAURANTS' as AdminTab, label: 'Restaurantes & Lojas', icon: Store, count: restaurants.length },
            { id: 'USERS' as AdminTab, label: 'Usuários & Senhas', icon: Users, count: users.length },
            { id: 'AUDIT_LOGS' as AdminTab, label: 'Trilha de Auditoria & Logs', icon: ShieldCheck, badge: 'Exclusivo' },
            { id: 'INFRA_AI' as AdminTab, label: 'Supabase, Vercel & IA Gemini', icon: Cpu, badge: 'Nuvem & IA' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-950 shadow-lg scale-[1.02]'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {'count' in tab && (
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-emerald-100 text-emerald-900' : 'bg-white/20'
                }`}>{tab.count}</span>
              )}
              {'badge' in tab && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/30 text-amber-200 border border-amber-500/40">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        {/* ========== ABA RESTAURANTES ========== */}
        {activeTab === 'RESTAURANTS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-emerald-300/80">Unidades Cadastradas</h2>
              <button
                onClick={() => setShowRestForm(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Unidade</span>
              </button>
            </div>

            {/* Form de Restaurante */}
            {showRestForm && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-amber-400">
                  {editingRestId ? 'Editar Unidade' : 'Cadastrar Nova Unidade'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={restForm.name} onChange={(e) => setRestForm({ ...restForm, name: e.target.value })} placeholder="Nome do Restaurante *" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <input value={restForm.shortName} onChange={(e) => setRestForm({ ...restForm, shortName: e.target.value })} placeholder="Nome Curto" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <input value={restForm.shoppingMall} onChange={(e) => setRestForm({ ...restForm, shoppingMall: e.target.value })} placeholder="Shopping / Local" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <input value={restForm.address} onChange={(e) => setRestForm({ ...restForm, address: e.target.value })} placeholder="Endereço" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <input value={restForm.city} onChange={(e) => setRestForm({ ...restForm, city: e.target.value })} placeholder="Cidade *" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <input value={restForm.state} onChange={(e) => setRestForm({ ...restForm, state: e.target.value })} placeholder="UF" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <input value={restForm.phone} onChange={(e) => setRestForm({ ...restForm, phone: e.target.value })} placeholder="Telefone" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <input value={restForm.cnpj} onChange={(e) => setRestForm({ ...restForm, cnpj: e.target.value })} placeholder="CNPJ" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={resetRestForm} className="px-4 py-2 rounded-xl bg-white/10 text-white/70 text-xs font-semibold hover:bg-white/20 transition-all cursor-pointer">Cancelar</button>
                  <button onClick={handleSaveRestaurant} className="px-4 py-2 rounded-xl bg-amber-500 text-amber-950 text-xs font-bold hover:bg-amber-400 transition-all flex items-center gap-1.5 cursor-pointer">
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar</span>
                  </button>
                </div>
              </div>
            )}

            {/* Lista de Restaurantes */}
            <div className="space-y-2">
              {restaurants.map((r) => (
                <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-800/50 flex items-center justify-center text-emerald-300 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{r.name}</h4>
                    <p className="text-xs text-emerald-300/60 truncate">{r.shoppingMall ? `${r.shoppingMall} — ` : ''}{r.city}/{r.state}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{getUsersByRestaurant(r.id).length} usuários vinculados</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => handleEditRestaurant(r)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {deleteConfirm === r.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDeleteRestaurant(r.id)} className="px-2 py-1 rounded-lg bg-red-600 text-white text-[10px] font-bold cursor-pointer">Confirmar</button>
                        <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-white/10 text-white/60 text-[10px] font-bold cursor-pointer">Não</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(r.id)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-600/30 flex items-center justify-center text-white/40 hover:text-red-400 transition-all cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== ABA USUÁRIOS ========== */}
        {activeTab === 'USERS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-emerald-300/80">Usuários do Sistema</h2>
              <button
                onClick={() => { setShowUserForm(true); if (restaurants.length > 0 && !userForm.restaurantId) setUserForm(f => ({ ...f, restaurantId: restaurants[0].id })); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Novo Usuário</span>
              </button>
            </div>

            {/* Form de Usuário */}
            {showUserForm && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-amber-400">
                  {editingUserId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Nome Completo *" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <input value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} placeholder="Login (username) *" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <input value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="Senha *" type="password" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <input value={userForm.pin} onChange={(e) => setUserForm({ ...userForm, pin: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="PIN 4 dígitos *" maxLength={4} className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono tracking-widest" />
                  <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })} className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 [&>option]:text-slate-900">
                    {ALL_ROLES.map((r) => <option key={r} value={r}>{USER_ROLE_LABELS[r]}</option>)}
                  </select>
                  <select value={userForm.restaurantId} onChange={(e) => setUserForm({ ...userForm, restaurantId: e.target.value })} className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 [&>option]:text-slate-900">
                    <option value="">Selecione a unidade *</option>
                    {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  <input value={userForm.department} onChange={(e) => setUserForm({ ...userForm, department: e.target.value })} placeholder="Departamento" className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
                  <select value={userForm.sector} onChange={(e) => setUserForm({ ...userForm, sector: e.target.value as StockSector | '' })} className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 [&>option]:text-slate-900">
                    <option value="">Setor de Contagem (opcional)</option>
                    {ALL_SECTORS.map((s) => <option key={s} value={s}>{STOCK_SECTOR_LABELS[s]}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={resetUserForm} className="px-4 py-2 rounded-xl bg-white/10 text-white/70 text-xs font-semibold hover:bg-white/20 transition-all cursor-pointer">Cancelar</button>
                  <button onClick={handleSaveUser} className="px-4 py-2 rounded-xl bg-amber-500 text-amber-950 text-xs font-bold hover:bg-amber-400 transition-all flex items-center gap-1.5 cursor-pointer">
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar</span>
                  </button>
                </div>
              </div>
            )}

            {/* Lista de Usuários agrupados por restaurante */}
            {restaurants.map((r) => {
              const rUsers = users.filter((u) => u.restaurantId === r.id);
              if (rUsers.length === 0) return null;
              return (
                <div key={r.id} className="space-y-2">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2 mt-4">
                    <Building2 className="w-3.5 h-3.5" />
                    {r.name}
                  </h3>
                  {rUsers.map((u) => (
                    <div key={u.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 hover:bg-white/10 transition-all">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${u.badgeColor}`}>
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{u.name}</span>
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${u.badgeColor}`}>
                            {USER_ROLE_LABELS[u.role]}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/40 truncate">
                          @{u.username} • PIN: {u.pin} • {u.department}
                          {u.sector ? ` • Setor: ${STOCK_SECTOR_LABELS[u.sector]}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => handleEditUser(u)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {deleteConfirm === u.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleDeleteUser(u.id)} className="px-2 py-1 rounded-lg bg-red-600 text-white text-[10px] font-bold cursor-pointer">Sim</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded-lg bg-white/10 text-white/60 text-[10px] font-bold cursor-pointer">Não</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(u.id)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-600/30 flex items-center justify-center text-white/40 hover:text-red-400 transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ========== ABA TRILHA DE AUDITORIA & LOGS (EXCLUSIVO PABRICIO) ========== */}
        {activeTab === 'AUDIT_LOGS' && (
          <AuditLogsView currentUserName="Pabricio" />
        )}

        {/* ========== ABA INFRAESTRUTURA & IA (SUPABASE, VERCEL, GEMINI) ========== */}
        {activeTab === 'INFRA_AI' && (
          <div className="space-y-6">
            {/* Status Geral */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-white/50 uppercase">Banco de Dados</p>
                  <p className="text-xs font-black text-white truncate">Supabase PostgreSQL</p>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {supabaseUrl ? 'Configurado' : 'Modo Local Ativo'}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Cloud className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-white/50 uppercase">Hospedagem & CI/CD</p>
                  <p className="text-xs font-black text-white truncate">Vercel Cloud</p>
                  <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    vercel.json Pronto
                  </span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-white/50 uppercase">Apoio Técnico Integrado</p>
                  <p className="text-xs font-black text-white truncate">Gemini 2.5 Flash</p>
                  <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    IA Integrada & Ativa
                  </span>
                </div>
              </div>
            </div>

            {/* SEÇÃO 1: SUPABASE */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Banco de Dados Supabase (PostgreSQL)</h3>
                    <p className="text-[11px] text-emerald-300/60">Configuração de sincronização e persistência na nuvem</p>
                  </div>
                </div>
                <button
                  onClick={handleCopySchemaSql}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'SQL Copiado!' : 'Copiar Schema SQL'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-white/60 uppercase mb-1">Project URL (Supabase)</label>
                  <input
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/60 uppercase mb-1">Anon Public Key</label>
                  <input
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    type="password"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestSupabase}
                    disabled={supabaseTesting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${supabaseTesting ? 'animate-spin' : ''}`} />
                    <span>{supabaseTesting ? 'Testando Conexão...' : 'Testar Conexão'}</span>
                  </button>
                  <button
                    onClick={handleSaveSupabase}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{supabaseSaved ? 'Salvo!' : 'Salvar Localmente'}</span>
                  </button>
                </div>

                <span className="text-[11px] text-white/40">
                  Também configurável via arquivo <code className="text-emerald-300 font-mono">.env</code>
                </span>
              </div>

              {/* Feedback de teste do Supabase */}
              {supabaseResult && (
                <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  supabaseResult.connected
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                }`}>
                  {supabaseResult.connected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">{supabaseResult.message}</p>
                    {supabaseResult.latencyMs && (
                      <p className="text-[10px] text-white/60 mt-0.5">Latência apurada: {supabaseResult.latencyMs}ms</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tabelas do Schema */}
              <div className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-1.5">
                <p className="text-[11px] font-bold text-white/70 uppercase">Tabelas Estruturadas no Schema PostgreSQL:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-emerald-300/80">
                  <div className="p-1.5 rounded-lg bg-white/5">📁 restaurants</div>
                  <div className="p-1.5 rounded-lg bg-white/5">📁 user_accounts</div>
                  <div className="p-1.5 rounded-lg bg-white/5">📁 stock_items</div>
                  <div className="p-1.5 rounded-lg bg-white/5">📁 freezer_tracked_items</div>
                  <div className="p-1.5 rounded-lg bg-white/5">📁 freezer_movement_logs</div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: VERCEL DEPLOYMENT */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Deploy & Hospedagem na Vercel</h3>
                  <p className="text-[11px] text-blue-300/60">Configuração de produção, rotas SPA e variáveis de ambiente</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-[10px] font-bold text-white/50 uppercase">Framework</p>
                  <p className="text-xs font-bold text-white mt-0.5">Vite (React 19 + TS)</p>
                  <p className="text-[10px] text-white/40 mt-1">Configurado em vercel.json</p>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-[10px] font-bold text-white/50 uppercase">Roteamento SPA</p>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">Rewrites: /index.html</p>
                  <p className="text-[10px] text-white/40 mt-1">Evita 404 em recarregamento</p>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-[10px] font-bold text-white/50 uppercase">Build Command</p>
                  <p className="text-xs font-mono font-bold text-amber-300 mt-0.5">npm run build</p>
                  <p className="text-[10px] text-white/40 mt-1">Output: dist/</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 space-y-2">
                <p className="text-xs font-bold text-blue-200">Variáveis a adicionar no Painel da Vercel (Environment Variables):</p>
                <div className="space-y-1 font-mono text-[11px] text-blue-100">
                  <div className="flex items-center justify-between bg-black/30 px-2.5 py-1 rounded">
                    <span>VITE_SUPABASE_URL</span>
                    <span className="text-white/40">URL do projeto no Supabase</span>
                  </div>
                  <div className="flex items-center justify-between bg-black/30 px-2.5 py-1 rounded">
                    <span>VITE_SUPABASE_ANON_KEY</span>
                    <span className="text-white/40">Chave pública anon do Supabase</span>
                  </div>
                  <div className="flex items-center justify-between bg-black/30 px-2.5 py-1 rounded">
                    <span>VITE_GEMINI_API_KEY</span>
                    <span className="text-white/40">Chave da API Google Gemini</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: GOOGLE GEMINI AI - APOIO TÉCNICO INTEGRADO */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Google Gemini AI — Apoio Técnico Integrado</h3>
                  <p className="text-[11px] text-purple-300/60">Assistente técnico oficial para o criador Pabricio e suporte operacional</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase mb-1">Chave de API do Gemini (Google AI Studio)</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    type="password"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleTestGemini}
                      disabled={geminiTesting}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${geminiTesting ? 'animate-spin' : ''}`} />
                      <span>{geminiTesting ? 'Validando...' : 'Testar Chave'}</span>
                    </button>
                    <button
                      onClick={handleSaveGemini}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      {geminiSaved ? 'Salva!' : 'Salvar'}
                    </button>
                  </div>
                </div>
              </div>

              {geminiTestResult && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  geminiTestResult.valid
                    ? 'bg-purple-950/60 border-purple-500/40 text-purple-200'
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                }`}>
                  {geminiTestResult.valid ? <CheckCircle2 className="w-4 h-4 text-purple-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  <span>{geminiTestResult.message}</span>
                </div>
              )}

              {/* Console Interativo de Apoio Técnico */}
              <div className="bg-black/30 rounded-xl p-4 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-white">Console Técnico de Apoio (Criador Pabricio & Gemini)</h4>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Como funciona o rastreamento dos 3 lotes do freezer?',
                    'Como executar o schema.sql no Supabase?',
                    'Qual o papel do Pabricio vs Ivan no sistema?',
                    'Como rodar o deploy na Vercel?',
                  ].map((sug) => (
                    <button
                      key={sug}
                      onClick={() => { setAiQuestion(sug); }}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-200 border border-purple-500/20 transition-all cursor-pointer text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAskGeminiSupport(); }}
                    placeholder="Digite uma dúvida técnica sobre o sistema, banco ou arquitetura..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <button
                    onClick={handleAskGeminiSupport}
                    disabled={aiAsking || !aiQuestion.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiAsking ? 'animate-spin' : ''}`} />
                    <span>{aiAsking ? 'Consultando...' : 'Consultar IA'}</span>
                  </button>
                </div>

                {aiAnswer && (
                  <div className="mt-3 p-3.5 rounded-xl bg-white/5 border border-purple-500/30 text-xs text-purple-100 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-300">
                    {aiAnswer}
                  </div>
                )}
              </div>

              {/* Card de Limpeza de Dados Fictícios / Início do Zero */}
              <div className="bg-red-950/30 rounded-xl p-4 border border-red-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Trash2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Zerar Dados Fictícios & Iniciar do Zero</h4>
                      <p className="text-[11px] text-red-200/70 mt-0.5">
                        Apaga todo histórico simulado (câmara fria, degelo, NFs, perdas, cancelamentos e vendas) mantendo cadastros de equipe e fichas técnicas oficiais.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('ATENÇÃO: Deseja apagar todos os dados fictícios e iniciar o uso do app 100% do zero hoje?')) {
                        resetAllAppDataToZero();
                        alert('✅ Todos os dados fictícios foram apagados! O app foi inicializado do zero para a sua operação real.');
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm self-start sm:self-auto"
                  >
                    Zerar Dados do App
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
