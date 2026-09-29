import React, { useState } from 'react';
import {
  Beer,
  Gauge,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Droplets,
  PlusCircle,
  RefreshCw,
  Wine,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Wrench,
  Check,
  X,
  Camera
} from 'lucide-react';
import { ChoppTap, SpiritBottle, BarAuditSummary } from '../../types/barIntelligence.types';
import {
  INITIAL_CHOPP_TAPS,
  INITIAL_SPIRIT_BOTTLES,
  INITIAL_COLD_ROOM_KEGS,
  INITIAL_BAR_SUMMARY,
  ColdRoomKeg
} from '../../data/barChoppData';
import {
  auditChoppTap,
  diagnoseChoppTap,
  compileBarSummary,
  TapDiagnosis
} from '../../services/choppAuditService';
import BottleOcrModal from './BottleOcrModal';
import { BarSalesOrderPlanningView } from './BarSalesOrderPlanningView';

export default function ChoppBarView() {
  const [taps, setTaps] = useState<ChoppTap[]>(INITIAL_CHOPP_TAPS);
  const [bottles, setBottles] = useState<SpiritBottle[]>(INITIAL_SPIRIT_BOTTLES);
  const [coldRoomKegs, setColdRoomKegs] = useState<ColdRoomKeg[]>(INITIAL_COLD_ROOM_KEGS);
  const [barSummary, setBarSummary] = useState<BarAuditSummary>(INITIAL_BAR_SUMMARY);
  const [activeSubTab, setActiveSubTab] = useState<'PEDIDOS_CDA' | 'TORNEIRAS' | 'DESTILADOS' | 'CAMARA_FRIA' | 'DIAGNOSTICO_IA'>('PEDIDOS_CDA');

  // Modal para Auditoria de Garrafas por OCR
  const [showBottleOcrModal, setShowBottleOcrModal] = useState(false);

  // Modal para Troca de Barril
  const [selectedTapForSwap, setSelectedTapForSwap] = useState<ChoppTap | null>(null);
  const [newKegCapacity, setNewKegCapacity] = useState<number>(50);
  const [newKegBatch, setNewKegBatch] = useState<string>('');
  const [newKegOperator, setNewKegOperator] = useState<string>('Lucas Barman');

  // Modal para Calibração de Pressão/Temperatura
  const [selectedTapForCalibration, setSelectedTapForCalibration] = useState<ChoppTap | null>(null);
  const [calibPressure, setCalibPressure] = useState<number>(34);
  const [calibTemp, setCalibTemp] = useState<number>(1.2);

  // Recalcular resumo sempre que taps ou bottles mudarem
  const handleUpdateTap = (updatedTap: ChoppTap) => {
    const audited = auditChoppTap(updatedTap);
    const newTaps = taps.map(t => t.id === audited.id ? audited : t);
    setTaps(newTaps);
    setBarSummary(compileBarSummary(newTaps, bottles));
  };

  // Engatar novo barril
  const handleConfirmKegSwap = () => {
    if (!selectedTapForSwap) return;
    const updated: ChoppTap = {
      ...selectedTapForSwap,
      kegCapacityLiters: newKegCapacity,
      currentVolumeLiters: newKegCapacity,
      glassesSoldTeknisa: 0,
      litersSoldTeknisa: 0,
      litersDispensedReal: 0,
      technicalLossLiters: 0,
      unaccountedDeviationLiters: 0,
      deviationCostReais: 0,
      deviationRetailReais: 0,
      deviationStatus: 'NORMAL',
      kegBatchNumber: newKegBatch || `LT-${Date.now().toString().slice(-4)}`,
      kegInstalledAt: new Date().toLocaleString('pt-BR'),
      installedBy: newKegOperator,
    };
    handleUpdateTap(updated);
    setSelectedTapForSwap(null);
  };

  // Calibrar Chopeira (Pressão e Temp)
  const handleConfirmCalibration = () => {
    if (!selectedTapForCalibration) return;
    const updated: ChoppTap = {
      ...selectedTapForCalibration,
      pressurePsi: calibPressure,
      temperatureCelsius: calibTemp,
    };
    handleUpdateTap(updated);
    setSelectedTapForCalibration(null);
  };

  // Registrar Sangria Técnica (Limpeza / Abertura de Torneira)
  const handleTechnicalPurge = (tap: ChoppTap, purgeLiters: number) => {
    const updated: ChoppTap = {
      ...tap,
      litersDispensedReal: Number((tap.litersDispensedReal + purgeLiters).toFixed(2)),
      currentVolumeLiters: Number(Math.max(0, tap.currentVolumeLiters - purgeLiters).toFixed(2)),
      technicalLossLiters: Number((tap.technicalLossLiters + purgeLiters).toFixed(2)),
    };
    handleUpdateTap(updated);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Executivo de Chopp & Bar */}
      <div className="bg-gradient-to-r from-[#0a2e23] via-[#0d3b2d] to-[#124b3a] rounded-2xl p-4 sm:p-6 text-white shadow-lg border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Beer className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Chopp & Bar Intelligence
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Cruzamento Teknisa PDV
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Engenho Gourmet
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl">
                Auditoria em tempo real de barris, torneiras, pressão de CO₂, temperatura de serpentina e desvios ocultos entre chopp tirado e copos faturados no caixa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const refreshed = taps.map(t => auditChoppTap(t));
                setTaps(refreshed);
                setBarSummary(compileBarSummary(refreshed, bottles));
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
              title="Recalcular auditoria com vendas do Teknisa"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
              <span>Sincronizar Teknisa</span>
            </button>
          </div>
        </div>

        {/* 4 Cards de Métricas do Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-emerald-700/50">
          <div className="bg-black/20 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between text-emerald-200/80 text-[11px] font-medium">
              <span>Rendimento Chopp</span>
              <Beer className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-xl font-black ${barSummary.overallYieldPct >= 94 ? 'text-emerald-400' : 'text-amber-300'}`}>
                {barSummary.overallYieldPct}%
              </span>
              <span className="text-[10px] text-emerald-300/70">Meta: &gt;94%</span>
            </div>
            <p className="text-[10px] text-emerald-200/60 mt-0.5">
              {barSummary.totalLitersSoldTeknisa}L vendidos / {barSummary.totalLitersKegsDispensed}L saídos
            </p>
          </div>

          <div className="bg-black/20 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between text-emerald-200/80 text-[11px] font-medium">
              <span>Desvio Oculto (L)</span>
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-rose-400">
                {barSummary.totalDeviationLiters.toFixed(2)} L
              </span>
              <span className="text-[10px] text-rose-300/70">~10 copos</span>
            </div>
            <p className="text-[10px] text-rose-200/60 mt-0.5">
              Não justificado por quebra técnica (5.5%)
            </p>
          </div>

          <div className="bg-black/20 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between text-emerald-200/80 text-[11px] font-medium">
              <span>Impacto Financeiro</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-amber-300">
                R$ {barSummary.totalDeviationReais.toFixed(2)}
              </span>
              <span className="text-[10px] text-amber-200/70">Custo</span>
            </div>
            <p className="text-[10px] text-emerald-200/60 mt-0.5">
              Cardápio: ~R$ {(barSummary.totalDeviationReais * 2.3).toFixed(2)}
            </p>
          </div>

          <div className="bg-black/20 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between text-emerald-200/80 text-[11px] font-medium">
              <span>Barris em Operação</span>
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-white">
                {taps.length} Torneiras
              </span>
              <span className="text-[10px] text-emerald-300">
                {taps.reduce((acc, t) => acc + t.currentVolumeLiters, 0).toFixed(1)}L em linha
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/60 mt-0.5">
              +7 barris lacrados na câmara fria
            </p>
          </div>
        </div>
      </div>

      {/* Navegação Secundária do Módulo de Bar */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('PEDIDOS_CDA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'PEDIDOS_CDA'
              ? 'bg-[#0a2e23] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Vendas & Pedido CDA (IA)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('TORNEIRAS')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'TORNEIRAS'
              ? 'bg-[#0a2e23] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Beer className="w-3.5 h-3.5 text-amber-400" />
          <span>Torneiras & Chopeiras ({taps.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DESTILADOS')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'DESTILADOS'
              ? 'bg-[#0a2e23] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Wine className="w-3.5 h-3.5 text-amber-400" />
          <span>Destilados & Drinks ({bottles.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('CAMARA_FRIA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'CAMARA_FRIA'
              ? 'bg-[#0a2e23] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Câmara Fria & Vasilhames</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DIAGNOSTICO_IA')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'DIAGNOSTICO_IA'
              ? 'bg-[#0a2e23] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Diagnóstico & Solução</span>
        </button>
      </div>

      {/* ABA 0: VENDAS DE BEBIDAS & PEDIDOS CDA COM IA */}
      {activeSubTab === 'PEDIDOS_CDA' && (
        <BarSalesOrderPlanningView />
      )}

      {/* ABA 1: TORNEIRAS & CHOPEIRAS */}
      {activeSubTab === 'TORNEIRAS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {taps.map((tap) => {
            const fillPct = Math.min(100, Math.max(0, Math.round((tap.currentVolumeLiters / tap.kegCapacityLiters) * 100)));
            const diagnoses = diagnoseChoppTap(tap);
            const criticalDiag = diagnoses.find(d => d.severity === 'DANGER') || diagnoses.find(d => d.severity === 'WARNING');

            return (
              <div
                key={tap.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  {/* Cabeçalho da Torneira */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-amber-700 text-sm">
                        T{tap.tapNumber}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {tap.beerName}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {tap.style}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Barril {tap.kegCapacityLiters}L
                          </span>
                          {tap.deviationStatus === 'CRITICO' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                              Desvio Alto
                            </span>
                          )}
                          {tap.deviationStatus === 'ATENCAO' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Atenção
                            </span>
                          )}
                          {tap.deviationStatus === 'NORMAL' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Normal
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTapForCalibration(tap);
                        setCalibPressure(tap.pressurePsi);
                        setCalibTemp(tap.temperatureCelsius);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                      title="Calibrar Pressão e Temperatura"
                    >
                      <Wrench className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Nível do Barril Gráfico */}
                  <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-200/70">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-medium">Nível Restante no Barril:</span>
                      <span className="font-bold text-slate-900">
                        {tap.currentVolumeLiters.toFixed(1)}L de {tap.kegCapacityLiters}L ({fillPct}%)
                      </span>
                    </div>

                    <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          fillPct > 40
                            ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                            : fillPct > 15
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                            : 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>Lote: {tap.kegBatchNumber}</span>
                      <span>Validade Aberto: {tap.kegExpiryDate}</span>
                    </div>
                  </div>

                  {/* Telemetria de Chopeira: Pressão & Temperatura */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                      tap.pressurePsi >= 32 && tap.pressurePsi <= 36
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/70 border-amber-200 text-amber-900'
                    }`}>
                      <Gauge className={`w-4 h-4 shrink-0 ${
                        tap.pressurePsi >= 32 && tap.pressurePsi <= 36 ? 'text-emerald-600' : 'text-amber-600'
                      }`} />
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-500 font-medium">Pressão CO₂</div>
                        <div className="text-xs font-bold">
                          {tap.pressurePsi} PSI
                          <span className="text-[9px] font-normal text-slate-500 ml-1">
                            {tap.pressurePsi >= 32 && tap.pressurePsi <= 36 ? '(Ideal)' : '(Ajustar)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                      tap.temperatureCelsius <= 2.0
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50/70 border-rose-200 text-rose-900'
                    }`}>
                      <Thermometer className={`w-4 h-4 shrink-0 ${
                        tap.temperatureCelsius <= 2.0 ? 'text-emerald-600' : 'text-rose-600'
                      }`} />
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-500 font-medium">Temp. Serpentina</div>
                        <div className="text-xs font-bold">
                          {tap.temperatureCelsius.toFixed(1)}°C
                          <span className="text-[9px] font-normal text-slate-500 ml-1">
                            {tap.temperatureCelsius <= 2.0 ? '(Gelado)' : '(Morno)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comparativo Cruzado: Teknisa vs Chopeira */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                      <span>Auditoria Cruzada com Teknisa:</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {tap.glassesSoldTeknisa} copos registrados
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                        <div className="text-[9px] text-slate-500 font-medium">Vendido Caixa</div>
                        <div className="text-xs font-black text-slate-800">{tap.litersSoldTeknisa.toFixed(1)} L</div>
                      </div>

                      <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                        <div className="text-[9px] text-slate-500 font-medium">Saiu Torneira</div>
                        <div className="text-xs font-black text-slate-800">{tap.litersDispensedReal.toFixed(1)} L</div>
                      </div>

                      <div className={`p-2 rounded-lg border ${
                        tap.unaccountedDeviationLiters > 1.0
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-white border-slate-200/70 text-slate-800'
                      }`}>
                        <div className="text-[9px] text-slate-500 font-medium">Desvio Oculto</div>
                        <div className={`text-xs font-black ${
                          tap.unaccountedDeviationLiters > 1.0 ? 'text-rose-600' : 'text-slate-800'
                        }`}>
                          +{tap.unaccountedDeviationLiters.toFixed(2)} L
                        </div>
                      </div>
                    </div>

                    {tap.unaccountedDeviationLiters > 0 && (
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 text-slate-600">
                        <span>Prejuízo Estimado:</span>
                        <span className="font-bold text-rose-600">
                          -R$ {tap.deviationCostReais.toFixed(2)} (Custo) / -R$ {tap.deviationRetailReais.toFixed(2)} (Venda)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Diagnóstico da IA */}
                  {criticalDiag && (
                    <div className={`mt-2.5 p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                      criticalDiag.severity === 'DANGER'
                        ? 'bg-rose-50/80 border-rose-200/90 text-rose-900'
                        : criticalDiag.severity === 'WARNING'
                        ? 'bg-amber-50/80 border-amber-200/90 text-amber-900'
                        : 'bg-emerald-50/80 border-emerald-200/90 text-emerald-900'
                    }`}>
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold">{criticalDiag.title}</div>
                        <div className="text-[10px] opacity-90 mt-0.5">{criticalDiag.cause}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botões de Ação da Torneira */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleTechnicalPurge(tap, 0.3)}
                    className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Registrar descarte de 300ml para sangria da linha"
                  >
                    <Droplets className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sangria (300ml)</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTapForSwap(tap);
                      setNewKegCapacity(tap.kegCapacityLiters);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-[#0a2e23] hover:bg-[#124b3a] text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Engatar Barril</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ABA 2: DESTILADOS & DRINKS */}
      {activeSubTab === 'DESTILADOS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Auditoria de Garrafas Abertas vs Estoque Fechado & Doses (50ml)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  OCR Vision Integrado
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Garrafas fechadas auditadas pelo estoque do sistema. Garrafas abertas inspecionadas por OCR (100%, 75%, 50%, 25%, 10%) e cruzadas com drinks faturados no Teknisa.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Padrão da Casa: 50ml/dose
              </span>
              <button
                type="button"
                onClick={() => setShowBottleOcrModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#0a2e23] hover:bg-[#124b3a] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Auditar Garrafas por Foto (OCR)</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Destilado / Garrafa</th>
                  <th className="py-3 px-3">Garrafa Aberta (OCR)</th>
                  <th className="py-3 px-3">Estoque Lacrado</th>
                  <th className="py-3 px-3 text-center">Faturado Teknisa</th>
                  <th className="py-3 px-3 text-center">Média por Drink</th>
                  <th className="py-3 px-3 text-center">Desvio Doses</th>
                  <th className="py-3 px-3 text-right">Prejuízo R$</th>
                  <th className="py-3 px-4 text-center">Diagnóstico / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bottles.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{b.name}</span>
                        {b.photoOcrVerified && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200" title="Nível avaliado por Visão Computacional">
                            IA Vision
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {b.bottleVolumeMl}ml • {b.totalDosesExpected} doses padrão/garrafa (50ml)
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          (b.openBottleFillPct ?? 100) <= 25
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : (b.openBottleFillPct ?? 100) <= 50
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {b.openBottleFillPct ?? 100}%
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ({b.openBottleRemainingMl ?? b.bottleVolumeMl}ml rest.)
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        {b.openBottleRemainingDoses ?? b.totalDosesExpected} doses restantes na bancada
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-800">{b.sealedStockBottles}</span>
                      <span className="text-slate-500 text-[10px] ml-1">fechada(s)</span>
                      <div className="text-[9px] text-slate-400">
                        {b.sealedStockBottles * b.bottleVolumeMl}ml em estoque
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {b.dosesSoldTeknisa} doses
                      </span>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        faturadas no caixa PDV
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {b.averageDoseServedMl ? (
                        <div className="flex flex-col items-center">
                          <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            b.averageDoseServedMl > 55
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {b.averageDoseServedMl.toFixed(1)} ml
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">
                            {b.averageDoseServedMl > 50 ? `+${(b.averageDoseServedMl - 50).toFixed(1)}ml extra/drink` : 'Conforme'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">50.0 ml</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {b.deviationDoses > 0 ? (
                        <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          +{b.deviationDoses.toFixed(1)} doses
                        </span>
                      ) : (
                        <span className="text-slate-400">0.0</span>
                      )}
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        desvio acumulado
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                      {b.deviationReais > 0 ? (
                        <span className="text-rose-600 font-extrabold">-R$ {b.deviationReais.toFixed(2)}</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">R$ 0,00</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {b.deviationType === 'DOSE_A_OLHO' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Dose "a Olho"
                        </span>
                      )}
                      {b.deviationType === 'SAIDA_SEM_COMANDA' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300 inline-flex items-center gap-1 animate-pulse">
                          <TrendingDown className="w-3 h-3 text-rose-600" />
                          Saída sem Comanda
                        </span>
                      )}
                      {(!b.deviationType || b.deviationType === 'NORMAL') && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Dose Conforme
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Orientação ANVISA & Padrão de Bar Engenho Gourmet: Todos os barmans devem obrigatoriamente utilizar dosador duplo de aço inox (50ml / 25ml). Doses "a olho" acima de 50ml acarretam desvio financeiro e alteram o sabor do coquetel.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowBottleOcrModal(true)}
              className="px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer shrink-0"
            >
              Auditar Garrafas Abertas
            </button>
          </div>
        </div>
      )}

      {/* ABA 3: CÂMARA FRIA & VASILHAMES */}
      {activeSubTab === 'CAMARA_FRIA' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Estoque de Barris Lacrados & Vasilhames em Comodato
                </h3>
                <p className="text-xs text-slate-500">
                  Controle da câmara fria (temperatura mantida a 2°C a 4°C) e vasilhames para devolução à Ambev/Cervejaria.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Câmara Fria: 3.2°C (Ideal)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {coldRoomKegs.map((keg) => (
                <div key={keg.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{keg.beerName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                      {keg.capacityLiters}L
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500">Cheios Lacrados</div>
                      <div className="text-base font-black text-emerald-700">{keg.quantitySealed} barris</div>
                      <div className="text-[9px] text-slate-400">{(keg.quantitySealed * keg.capacityLiters)} Litros</div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-500">Vazios (Troca)</div>
                      <div className="text-base font-black text-amber-700">{keg.quantityEmptyVasilhame} vasilhames</div>
                      <div className="text-[9px] text-slate-400">R$ {(keg.quantityEmptyVasilhame * keg.depositValuePerKegReais).toFixed(0)} comodato</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span>Lote: {keg.batchNumber}</span>
                    <span>Validade: {keg.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: DIAGNÓSTICO & SOLUÇÃO DE DESVIOS DA IA */}
      {activeSubTab === 'DIAGNOSTICO_IA' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900">
                Plano de Ação para Redução de Desvios de Bebidas & Chopp
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  1. Pressão de CO₂ Descalibrada na Torneira 2 (IPA 30L)
                </div>
                <p className="text-amber-800 leading-relaxed">
                  A pressão em 26 PSI e a temperatura de 3.8°C na serpentina estão gerando descarbonatação prévia e colarinho excessivo. Os garçons estão descartando espuma no ralo, causando o desvio de 1.86L (R$ 46,50 de custo / R$ 92,50 no caixa).
                </p>
                <div className="font-semibold text-emerald-800 text-[11px] pt-1">
                  Ação Recomendada: Elevar a pressão do regulador para 34 PSI e regular a vazão compensadora da torneira para vazão suave.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs space-y-1.5">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  2. Discrepância em Doses de Gin Tanqueray (6 doses não faturadas)
                </div>
                <p className="text-rose-800 leading-relaxed">
                  Foram faturados 26 drinks no Teknisa, mas o peso das garrafas abertas indica consumo de 32 doses. Diferença de 300ml sem registro de venda no caixa (prejuízo de R$ 192,00).
                </p>
                <div className="font-semibold text-emerald-800 text-[11px] pt-1">
                  Ação Recomendada: Auditoria cega de balança no início e fim do turno do barman e checklist obrigatório de dosador inox 50ml.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-1.5">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  3. Barril Aberto com Validade Curta (Torneira 4 - Taperebá Sour)
                </div>
                <p className="text-blue-800 leading-relaxed">
                  Restam 11 Litros no barril e o vencimento pós-abertura ocorre em 48 horas (2026-09-24).
                </p>
                <div className="font-semibold text-emerald-800 text-[11px] pt-1">
                  Ação Recomendada: Disparar sugestão ativa pelos garçons no almoço e jantar ou criar combo promocional "Chopp Taperebá + Petisco de Costela" no Teknisa.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TROCAR / ENGATAR BARRIL */}
      {selectedTapForSwap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Beer className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Engatar Novo Barril - Torneira {selectedTapForSwap.tapNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTapForSwap(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Chopp / Estilo</label>
                <input
                  type="text"
                  disabled
                  value={selectedTapForSwap.beerName}
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Capacidade</label>
                  <select
                    value={newKegCapacity}
                    onChange={(e) => setNewKegCapacity(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value={50}>50 Litros</option>
                    <option value={30}>30 Litros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lote do Barril</label>
                  <input
                    type="text"
                    placeholder="Ex: LT-2026-99"
                    value={newKegBatch}
                    onChange={(e) => setNewKegBatch(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Operador Responsável</label>
                <input
                  type="text"
                  value={newKegOperator}
                  onChange={(e) => setNewKegOperator(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                Atenção: Ao engatar um novo barril, a contagem de litros dispensados será zerada e vinculada às novas vendas do Teknisa para este lote.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTapForSwap(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmKegSwap}
                className="px-4 py-1.5 rounded-lg bg-[#0a2e23] hover:bg-[#124b3a] text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Confirmar Engate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CALIBRAÇÃO DE PRESSÃO E TEMPERATURA */}
      {selectedTapForCalibration && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Calibrar Torneira {selectedTapForCalibration.tapNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTapForCalibration(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-700 font-semibold">Pressão de CO₂ (PSI):</label>
                  <span className="font-black text-slate-900">{calibPressure} PSI</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={45}
                  step={1}
                  value={calibPressure}
                  onChange={(e) => setCalibPressure(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>20 PSI (Baixa)</span>
                  <span className="text-emerald-700 font-bold">32-36 PSI (Ideal)</span>
                  <span>45 PSI (Alta)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-700 font-semibold">Temperatura do Chopp (°C):</label>
                  <span className="font-black text-slate-900">{calibTemp.toFixed(1)}°C</span>
                </div>
                <input
                  type="range"
                  min={-1.0}
                  max={6.0}
                  step={0.2}
                  value={calibTemp}
                  onChange={(e) => setCalibTemp(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>-1.0°C</span>
                  <span className="text-emerald-700 font-bold">0.0°C a 1.5°C</span>
                  <span>6.0°C (Morno)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTapForCalibration(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCalibration}
                className="px-4 py-1.5 rounded-lg bg-[#0a2e23] hover:bg-[#124b3a] text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Salvar Calibração</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AUDITORIA DE GARRAFAS ABERTAS COM OCR VISION */}
      <BottleOcrModal
        isOpen={showBottleOcrModal}
        onClose={() => setShowBottleOcrModal(false)}
        currentBottles={bottles}
        onApplyScanResults={(updated) => {
          setBottles(updated);
          setBarSummary(compileBarSummary(taps, updated));
        }}
      />
    </div>
  );
}
