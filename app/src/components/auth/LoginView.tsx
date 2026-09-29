import React, { useState, useMemo } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
} from 'lucide-react';
import type { Restaurant, UserAccount } from '../../types/restaurant.types';
import { USER_ROLE_LABELS } from '../../types/restaurant.types';
import { authenticateUser, getUsersByRestaurant } from '../../services/restaurantStore';
import { logSystemAction } from '../../services/auditLogStore';

interface LoginViewProps {
  restaurant: Restaurant;
  onLoginSuccess: (user: UserAccount) => void;
  onBack: () => void;
}

export default function LoginView({ restaurant, onLoginSuccess, onBack }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Listar usuários da unidade para o card informativo
  const unitUsers = useMemo(() => getUsersByRestaurant(restaurant.id), [restaurant.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const user = authenticateUser(username, password, restaurant.id);

      if (user) {
        logSystemAction({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          module: 'AUTH',
          action: 'Login no Sistema',
          details: `Login bem-sucedido na unidade ${restaurant.name} (${restaurant.city}).`,
          severity: 'SUCESSO',
          metadata: { username: user.username, role: user.role }
        });
        onLoginSuccess(user);
      } else {
        logSystemAction({
          userId: 'desconhecido',
          userName: username || 'Anônimo',
          userRole: 'Tentativa de Acesso',
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          module: 'AUTH',
          action: 'Falha de Autenticação',
          details: `Tentativa de login falhou com usuário "${username}" na unidade ${restaurant.name}.`,
          severity: 'AVISO',
          metadata: { attemptedUsername: username }
        });
        setErrorMessage('Usuário ou senha inválidos para esta unidade.');
        setIsLoading(false);
      }
    }, 400);
  };

  // Quick login por usuário
  const handleQuickLogin = (user: UserAccount) => {
    setUsername(user.username);
    setPassword(user.password);
    setErrorMessage(null);
    setIsLoading(true);

    logSystemAction({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      module: 'AUTH',
      action: 'Acesso Rápido por Perfil',
      details: `Acesso rápido com perfil de ${user.name} (${user.role}) na unidade ${restaurant.name}.`,
      severity: 'INFO',
      metadata: { username: user.username, role: user.role }
    });

    setTimeout(() => {
      onLoginSuccess(user);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#051c15] via-[#0a2e23] to-[#041711] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Círculos decorativos de iluminação no fundo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Botão Voltar */}
      <div className="w-full max-w-md relative z-10 mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-300/60 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trocar Unidade</span>
        </button>
      </div>

      {/* Cartão Central de Autenticação */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6 relative z-10">
        {/* Cabeçalho da Empresa */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0a2e23] to-[#124b3a] text-amber-400 shadow-md border border-amber-500/30 mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Tk Gestão e Tecnologia
            </h1>
            <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 mt-0.5">
              <Building2 className="w-3 h-3" />
              <span>{restaurant.name}</span>
              {restaurant.shoppingMall && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{restaurant.shoppingMall}</span>
                </>
              )}
            </p>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Acesse com suas credenciais de operador para esta unidade.
          </p>
        </div>

        {/* Mensagem de Erro se houver */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Usuário de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Senha
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-700 accent-[#0a2e23]"
              />
              <span>Manter conectado</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#0a2e23] to-[#124b3a] hover:from-[#0d3b2d] hover:to-[#175a46] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
            ) : (
              <>
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </>
            )}
          </button>
        </form>

        {/* Card Informativo — Operadores desta unidade */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-[11px] text-emerald-900 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-emerald-950">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>Operadores desta Unidade ({unitUsers.length}):</span>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {unitUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleQuickLogin(u)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-emerald-100/80 transition-all text-left cursor-pointer"
              >
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${u.badgeColor}`}>
                  {u.name.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 block truncate text-[11px]">{u.name}</span>
                    {(u.role === 'GERENTE' || u.role === 'GERENTE_TREINAMENTO' || u.role === 'PROPRIETARIO') && (
                      <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 shrink-0">
                        Acesso Full
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {USER_ROLE_LABELS[u.role]}
                    {u.sector ? ' • ' + u.department : ''}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-600/60 shrink-0">
                  @{u.username}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-emerald-800/50 pt-1 border-t border-emerald-200/50">
            Clique em um operador para login rápido. Senhas: Pabricio (p4br1c10ju4n) • Demais (123456)
          </p>
        </div>
      </div>

      {/* Rodapé institucional */}
      <div className="text-center text-[11px] text-emerald-200/60 mt-6 relative z-10">
        Tk Gestão e Tecnologia © 2026 • {restaurant.name}
      </div>
    </div>
  );
}
