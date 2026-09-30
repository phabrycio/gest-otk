import React, { useState, useMemo } from 'react';
import {
  Star, MessageSquare, AlertTriangle, CheckCircle2, Clock, ChefHat,
  TrendingUp, TrendingDown, Sparkles, Brain, Filter, ExternalLink,
  ThumbsUp, ThumbsDown, Minus, BarChart3, Globe, Send, Eye, EyeOff, X
} from 'lucide-react';
import {
  COMPILED_REVIEWS, REVIEWS_OVERVIEW, AI_SOLUTIONS, CATEGORY_LABELS, getReviewStats,
  type CustomerReview, type ReviewCategory, type ReviewSentiment, type ReviewSource,
} from '../services/reviewsStore';

// ─── Helpers ────────────────────────────────────────────────────────────────

const STAR_COLORS = ['', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981'];
const SOURCE_ICONS: Record<ReviewSource, string> = {
  GOOGLE_MAPS: 'G',
  RESTAURANT_GURU: 'RG',
  TRIPADVISOR: 'TA',
  IFOOD: 'iF',
  FACEBOOK: 'fb',
  INSTAGRAM: 'ig',
};
const SOURCE_COLORS: Record<ReviewSource, string> = {
  GOOGLE_MAPS: '#4285F4',
  RESTAURANT_GURU: '#FF6B35',
  TRIPADVISOR: '#00AA6C',
  IFOOD: '#EA1D2C',
  FACEBOOK: '#1877F2',
  INSTAGRAM: '#E1306C',
};
const SENTIMENT_CONFIG: Record<ReviewSentiment, { icon: React.ReactNode; color: string; label: string }> = {
  POSITIVO: { icon: <ThumbsUp className="w-3 h-3" />, color: '#10B981', label: 'Positivo' },
  NEGATIVO: { icon: <ThumbsDown className="w-3 h-3" />, color: '#EF4444', label: 'Negativo' },
  MISTO: { icon: <Minus className="w-3 h-3" />, color: '#F59E0B', label: 'Misto' },
};
const PRIORITY_COLORS: Record<string, string> = {
  ALTA: '#EF4444', MEDIA: '#F59E0B', BAIXA: '#10B981',
};

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          style={{ width: size, height: size, fill: s <= rating ? STAR_COLORS[rating] : '#E2E8F0', color: s <= rating ? STAR_COLORS[rating] : '#E2E8F0' }}
        />
      ))}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CustomerReviewsDashboardView() {
  const stats = useMemo(() => getReviewStats(), []);
  const [filterSentiment, setFilterSentiment] = useState<ReviewSentiment | 'ALL'>('ALL');
  const [filterSource, setFilterSource] = useState<ReviewSource | 'ALL'>('ALL');
  const [filterResolved, setFilterResolved] = useState<boolean | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<ReviewCategory | null>(null);
  const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'solutions'>('overview');
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set(
    COMPILED_REVIEWS.filter((r) => r.resolved).map((r) => r.id)
  ));

  const filteredReviews = useMemo(() => {
    return COMPILED_REVIEWS.filter((r) => {
      if (filterSentiment !== 'ALL' && r.sentiment !== filterSentiment) return false;
      if (filterSource !== 'ALL' && r.source !== filterSource) return false;
      if (filterResolved !== 'ALL' && resolvedIds.has(r.id) !== filterResolved) return false;
      if (filterPriority !== 'ALL' && r.priority !== filterPriority) return false;
      return true;
    });
  }, [filterSentiment, filterSource, filterResolved, filterPriority, resolvedIds]);

  const pendingCount = COMPILED_REVIEWS.filter((r) => !resolvedIds.has(r.id)).length;

  function toggleResolved(id: string) {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-5 p-1">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Avaliações & Reputação Online
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Compilação de {REVIEWS_OVERVIEW.totalReviews} avaliações · Atualizado em {REVIEWS_OVERVIEW.lastUpdated} · Dados reais de mercado
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
            </span>
          )}
          <a
            href="https://maps.google.com/?q=Engenho+Cozinha+Brasileira+Manauara+Manaus"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver no Google Maps
          </a>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {(['overview', 'reviews', 'solutions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white shadow-sm text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'overview' ? '📊 Visão Geral' : tab === 'reviews' ? '💬 Avaliações' : '🤖 Soluções IA'}
          </button>
        ))}
      </div>

      {/* ════════════════════════ TAB: OVERVIEW ════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Nota Google</span>
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">G</div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{REVIEWS_OVERVIEW.googleMapsRating}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <StarRow rating={Math.round(REVIEWS_OVERVIEW.googleMapsRating)} size={12} />
                <span className="text-[11px] text-slate-500">{REVIEWS_OVERVIEW.googleMapsCount} avaliações</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Rest. Guru</span>
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-700">RG</div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{REVIEWS_OVERVIEW.restaurantGuruRating}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <StarRow rating={Math.round(REVIEWS_OVERVIEW.restaurantGuruRating)} size={12} />
                <span className="text-[11px] text-slate-500">{REVIEWS_OVERVIEW.restaurantGuruCount} avaliações</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">NPS Estimado</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900">{REVIEWS_OVERVIEW.npsEstimated}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {REVIEWS_OVERVIEW.npsEstimated >= 50 ? '🟢 Excelente' : REVIEWS_OVERVIEW.npsEstimated >= 30 ? '🟡 Bom' : '🔴 Crítico'} · {REVIEWS_OVERVIEW.totalReviews} avaliações totais
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Pendentes</span>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-600">{pendingCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {stats.highPriority} alta prioridade · {stats.negative} negativas
              </div>
            </div>
          </div>

          {/* Distribuição de estrelas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                Distribuição de Notas (226 avaliações compiladas)
              </h3>
              <div className="space-y-2.5">
                {[...REVIEWS_OVERVIEW.distribution].reverse().map(({ stars, count, pct }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-14 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-700">{stars}</span>
                    </div>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: STAR_COLORS[stars],
                          opacity: 0.85,
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-16 text-right">{count} ({pct}%)</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Nota média geral</span>
                <div className="flex items-center gap-2">
                  <StarRow rating={Math.round(REVIEWS_OVERVIEW.overallRating)} size={14} />
                  <span className="text-sm font-bold text-slate-800">{REVIEWS_OVERVIEW.overallRating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Principais reclamações */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                Principais Reclamações Identificadas
              </h3>
              <div className="space-y-3">
                {REVIEWS_OVERVIEW.topComplaintCategories.map(({ category, label, count, pct }) => (
                  <button
                    key={category}
                    onClick={() => { setSelectedCategory(category); setActiveTab('solutions'); }}
                    className="w-full group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 group-hover:text-red-600 transition-colors">{label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">{count} menções</span>
                        <Sparkles className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-400 transition-all duration-500 group-hover:bg-red-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Clique em uma categoria para ver a solução IA
              </p>
            </div>
          </div>

          {/* Principais elogios */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-500" />
              Pontos Fortes — O que os clientes mais elogiam
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {REVIEWS_OVERVIEW.topPraiseCategories.map(({ category, label, count, pct }) => (
                <div key={category} className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  <div className="text-xs font-semibold text-emerald-800">{label}</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">{pct}%</div>
                  <div className="text-[11px] text-emerald-600">{count} menções positivas</div>
                  <div className="h-1 bg-emerald-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════ TAB: REVIEWS ════════════════════════ */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {/* Filtros */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">Todos sentimentos</option>
              <option value="POSITIVO">✅ Positivo</option>
              <option value="NEGATIVO">❌ Negativo</option>
              <option value="MISTO">⚠️ Misto</option>
            </select>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">Todas as fontes</option>
              <option value="GOOGLE_MAPS">Google Maps</option>
              <option value="RESTAURANT_GURU">Restaurant Guru</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="INSTAGRAM">Instagram</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">Toda prioridade</option>
              <option value="ALTA">🔴 Alta</option>
              <option value="MEDIA">🟡 Média</option>
              <option value="BAIXA">🟢 Baixa</option>
            </select>
            <select
              value={String(filterResolved)}
              onChange={(e) => setFilterResolved(e.target.value === 'ALL' ? 'ALL' : e.target.value === 'true')}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">Todos os status</option>
              <option value="false">⏳ Pendentes</option>
              <option value="true">✅ Resolvidos</option>
            </select>
            <span className="ml-auto text-xs text-slate-500 font-medium">{filteredReviews.length} avaliação{filteredReviews.length !== 1 ? 'ões' : ''}</span>
          </div>

          {/* Lista de reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredReviews.map((review) => {
              const isResolved = resolvedIds.has(review.id);
              const sentiment = SENTIMENT_CONFIG[review.sentiment];
              return (
                <div
                  key={review.id}
                  className={`bg-white rounded-xl border shadow-xs p-4 space-y-3 transition-all hover:shadow-sm ${
                    isResolved ? 'border-emerald-200 opacity-75' : review.priority === 'ALTA' ? 'border-red-200' : 'border-slate-200'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: SOURCE_COLORS[review.source] }}
                      >
                        {SOURCE_ICONS[review.source]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{review.authorName}</div>
                        <div className="text-[10px] text-slate-400">{new Date(review.date).toLocaleDateString('pt-BR')} · {review.source.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StarRow rating={review.rating} size={12} />
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: sentiment.color + '20', color: sentiment.color }}
                      >
                        {sentiment.icon}
                        {sentiment.label}
                      </span>
                    </div>
                  </div>

                  {/* Texto */}
                  <p className="text-xs text-slate-600 leading-relaxed">{review.text}</p>

                  {/* Categorias */}
                  <div className="flex flex-wrap gap-1">
                    {review.categories.map((cat) => (
                      <span key={cat} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        {CATEGORY_LABELS[cat]}
                      </span>
                    ))}
                  </div>

                  {/* Prioridade + ações */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: PRIORITY_COLORS[review.priority] + '20', color: PRIORITY_COLORS[review.priority] }}
                      >
                        {review.priority}
                      </span>
                      {isResolved && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Respondida
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {(review.aiResponse || review.aiAction) && (
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-semibold transition-colors"
                        >
                          <Brain className="w-3 h-3" />
                          IA Responde
                        </button>
                      )}
                      <button
                        onClick={() => toggleResolved(review.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                          isResolved
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {isResolved ? <><EyeOff className="w-3 h-3" /> Reabrir</> : <><CheckCircle2 className="w-3 h-3" /> Marcar OK</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════ TAB: SOLUÇÕES IA ════════════════════════ */}
      {activeTab === 'solutions' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-bold text-purple-800">Copilot IA — Plano de Ação por Categoria</span>
            </div>
            <p className="text-xs text-purple-700">
              Baseado na análise das {REVIEWS_OVERVIEW.totalReviews} avaliações compiladas, o Copilot identificou as principais causas-raiz e gerou um plano de ação com metas mensuráveis.
            </p>
          </div>

          {/* Seletor de categoria */}
          <div className="flex flex-wrap gap-2">
            {(Object.entries(CATEGORY_LABELS) as [ReviewCategory, string][]).map(([cat, label]) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Cards de solução */}
          <div className="grid grid-cols-1 gap-4">
            {(Object.entries(AI_SOLUTIONS) as [ReviewCategory, typeof AI_SOLUTIONS[ReviewCategory]][])
              .filter(([cat]) => !selectedCategory || cat === selectedCategory)
              .map(([category, solution]) => {
                const complaint = REVIEWS_OVERVIEW.topComplaintCategories.find((c) => c.category === category);
                const praise = REVIEWS_OVERVIEW.topPraiseCategories.find((c) => c.category === category);
                return (
                  <div key={category} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{CATEGORY_LABELS[category]}</div>
                          {complaint && (
                            <span className="text-[10px] text-red-600 font-medium">{complaint.count} reclamações · {complaint.pct}% dos problemas</span>
                          )}
                          {praise && !complaint && (
                            <span className="text-[10px] text-emerald-600 font-medium">{praise.count} elogios · {praise.pct}% dos pontos positivos</span>
                          )}
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-lg bg-blue-50 text-[10px] font-bold text-blue-700">
                        Copilot AI
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                          <Clock className="w-3.5 h-3.5" />
                          Ação Imediata (&lt; 7 dias)
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed bg-amber-50 rounded-lg p-3 border border-amber-100">
                          {solution.shortTerm}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Ação Estrutural (30-90 dias)
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed bg-blue-50 rounded-lg p-3 border border-blue-100">
                          {solution.longTerm}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                          <ChefHat className="w-3.5 h-3.5" />
                          KPI de Sucesso
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50 rounded-lg p-3 border border-emerald-100 font-mono">
                          {solution.kpi}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ─── MODAL: Resposta IA ─── */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedReview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-slate-800">Copilot — Resposta Sugerida</span>
              </div>
              <button onClick={() => setSelectedReview(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Avaliação de {selectedReview.authorName} ({selectedReview.rating}★)</p>
              <p className="text-xs text-slate-600 italic">"{selectedReview.text}"</p>
            </div>
            {selectedReview.aiResponse && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 mb-2">
                  <Send className="w-3.5 h-3.5" />
                  Resposta pública sugerida (Google Maps / Instagram)
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-slate-700 leading-relaxed">
                  {selectedReview.aiResponse}
                </div>
              </div>
            )}
            {selectedReview.aiAction && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Ação operacional interna (para o gerente)
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-slate-700 leading-relaxed">
                  {selectedReview.aiAction}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { toggleResolved(selectedReview.id); setSelectedReview(null); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Marcar como Respondida
              </button>
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
