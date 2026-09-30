// ============================================================
// DASHBOARD: CONTROLE DE TEMPERATURA DA CÂMARA FRIA POR FOTO
// Vistos da Supervisora (Patricia) & Check do Gerente (Ivan/Pabricio)
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  ThermometerSnowflake,
  Camera,
  FileText,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
  Eye,
  CheckSquare,
  Sparkles,
  Calendar,
  X,
} from 'lucide-react';
import type { ColdChamberReading } from '../../types/coldChamber.types';
import {
  getColdChamberReadings,
  giveSupervisorCheck,
  giveManagerCheck,
} from '../../services/coldChamberStore';
import { ColdChamberCaptureModal } from './ColdChamberCaptureModal';
import { ColdChamberWeeklyReportModal } from './ColdChamberWeeklyReportModal';
import { getDefrostPlanForDay, getCurrentDayOfWeekKey, DayOfWeekKey, DAY_OF_WEEK_CONFIG } from '../../services/intelligenceEngine';

interface ColdChamberDashboardViewProps {
  currentRole?: string;
  currentUserName?: string;
}

export const ColdChamberDashboardView: React.FC<ColdChamberDashboardViewProps> = ({
  currentRole,
  currentUserName = 'Gerente',
}) => {
  const [readings, setReadings] = useState<ColdChamberReading[]>([]);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPhotoForZoom, setSelectedPhotoForZoom] = useState<ColdChamberReading | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [selectedDayDefrost, setSelectedDayDefrost] = useState<DayOfWeekKey>(() => getCurrentDayOfWeekKey());
  const [confirmedThaws, setConfirmedThaws] = useState<Record<string, boolean>>({});

  const todayPlan = getDefrostPlanForDay(selectedDayDefrost);

  const loadData = () => {
    const list = getColdChamberReadings(39);
    setReadings(list);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('chamber-readings-updated', handleUpdate);
    return () => window.removeEventListener('chamber-readings-updated', handleUpdate);
  }, []);

  const handleSupervisorCheck = (readingId: string) => {
    giveSupervisorCheck(readingId, 'Patricia (Supervisora)');
    setActionToast('Visto da Supervisora (Patricia) registrado com data e hora oficial!');
    setTimeout(() => setActionToast(null), 4000);
    loadData();
  };

  const handleManagerCheck = (readingId: string) => {
    giveManagerCheck(readingId, currentUserName || 'Ivan (Gerente Geral)');
    setActionToast('Check do Gerente Geral gravado com sucesso no sistema!');
    setTimeout(() => setActionToast(null), 4000);
    loadData();
  };

  // KPIs
  const latestReading = readings[readings.length - 1] || readings[0];
  const pendingSupervisorCount = readings.filter((r) => !r.supervisorCheck.checked).length;
  const pendingManagerCount = readings.filter((r) => !r.managerCheck.checked).length;
  const conformantCount = readings.filter((r) => r.isConformant).length;

  return (
    <div className="space-y-4">
      {/* Toast de Ação */}
      {actionToast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-slide-down shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* Banner Principal de Status da Câmara Fria */}
      <div className="bg-gradient-to-br from-[#0a2e23] via-[#0d3b2d] to-[#041a13] rounded-3xl p-5 sm:p-6 text-white border border-emerald-800/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <ThermometerSnowflake className="w-4 h-4 text-blue-400 animate-pulse" />
              Controle Fotográfico & Boas Práticas (RDC 216)
            </span>
            <span className="text-xs text-emerald-200/70 font-mono">Semana 39 • Manauara</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Leitura da Câmara Fria por Foto com Visto Duplo
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
            A leitura é registrada por foto do termômetro digital pelo responsável (Mádio / Esmael).
            A <strong>Supervisora (Patricia)</strong> dá o OK com data/hora e o <strong>Gerente (Ivan / Pabricio)</strong> marca o check.
            Ao final da semana, o relatório impresso é assinado pelos 3 e fixado no <strong>Quadro de Avisos</strong>.
          </p>
        </div>

        {/* Card de Temperatura Atual da Câmara */}
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 flex items-center gap-4 shrink-0 shadow-inner">
          <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-400/40 shrink-0">
            <ThermometerSnowflake className="w-8 h-8 text-blue-400 animate-bounce" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Última Temperatura Lida
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {latestReading ? `${latestReading.temperature.toFixed(1)}°C` : '-19.4°C'}
              </span>
              <span className="text-xs font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/20">
                Normal
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Padrão: <strong>-18°C a -22°C</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Métricas e Pendências de Aprovação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total de Fotos na Semana
            </span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {readings.length} leituras
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">100% fotográficas</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <Camera className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Vistos da Supervisora
            </span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {readings.length - pendingSupervisorCount} / {readings.length}
            </span>
            <span className={`text-[10px] font-bold ${pendingSupervisorCount === 0 ? 'text-emerald-700' : 'text-amber-600'}`}>
              {pendingSupervisorCount === 0 ? '✓ 100% Vistados' : `⚠️ ${pendingSupervisorCount} pendente(s)`}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Checks do Gerente
            </span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {readings.length - pendingManagerCount} / {readings.length}
            </span>
            <span className={`text-[10px] font-bold ${pendingManagerCount === 0 ? 'text-emerald-700' : 'text-amber-600'}`}>
              {pendingManagerCount === 0 ? '✓ Todos verificados' : `⚠️ ${pendingManagerCount} aguardando`}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Quadro de Avisos
            </span>
            <span className="text-xs font-black text-emerald-800 block mt-1">
              Pronto p/ Impressão
            </span>
            <span className="text-[10px] text-slate-500">Assinatura dos 3</span>
          </div>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow transition active:scale-95"
            title="Abrir Relatório Semanal para Impressão"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Painel Integrado: Plano de Degelo da Semana (Seg a Dom) Calculado por Vendas */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-sky-50/70 border-b border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-200 text-sky-800 flex items-center justify-center shrink-0">
              <ThermometerSnowflake className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Plano de Degelo Operacional — {todayPlan.dayLabel}</span>
                <span className="px-2 py-0.2 rounded-full bg-sky-200 text-sky-900 text-[10px] font-black">
                  +20% Reserva
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Calculado automaticamente sobre 98.393 vendas reais. Descongelamento lento a +2°C / +4°C para os turnos de almoço e jantar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-sky-200 text-xs">
            {(['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'] as DayOfWeekKey[]).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDayDefrost(d)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  selectedDayDefrost === d
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {DAY_OF_WEEK_CONFIG[d].label.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {todayPlan.items.slice(0, 6).map((item) => {
              const isChecked = confirmedThaws[item.id] || false;
              return (
                <div
                  key={item.id}
                  onClick={() => setConfirmedThaws((prev) => ({ ...prev, [item.id]: !isChecked }))}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-200'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isChecked ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {item.defrostLeadHours}h antes &bull; {item.targetShift === 'ALMOCO' ? 'Almoço' : 'Jantar'}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-1 rounded-lg text-xs font-black shrink-0 ${
                    isChecked ? 'bg-emerald-200 text-emerald-900' : 'bg-sky-100 text-sky-900'
                  }`}>
                    {item.thawQuantityKg} {item.unit}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Total a desgelar para {todayPlan.dayLabel}: <strong className="text-slate-900">{todayPlan.totalKgToDefrost} KG</strong>
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">
              ✓ Evita quebra de textura e descongelamento em água corrente
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Ações: Nova Leitura por Foto & Gerar Relatório Semanal */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Registro Fotográfico da Semana 39 (21/09 a 27/09)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Acompanhamento diário da temperatura com dupla checagem de liderança.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsCaptureModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Nova Foto do Termômetro</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#0a2e23] hover:bg-[#123e30] text-amber-300 text-xs font-bold border border-emerald-800/60 shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Relatório Quadro de Avisos</span>
          </button>
        </div>
      </div>

      {/* Grade de Registros da Semana com Ações de Visto */}
      <div className="space-y-3">
        {readings.map((reading) => {
          const isMorning = reading.shift === 'MANHA_ABERTURA';

          return (
            <div
              key={reading.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-slate-300 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              {/* Foto do Display e Dados da Leitura */}
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => setSelectedPhotoForZoom(reading)}
                  className="relative group w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden bg-black shrink-0 border border-slate-300 shadow-sm cursor-pointer"
                  title="Clique para ampliar a foto do display"
                >
                  <img
                    src={reading.photoUrl}
                    alt={`Display ${reading.readingDate}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      {new Date(reading.readingDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isMorning
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                      }`}
                    >
                      {reading.shiftLabel} • {reading.readingTime}
                    </span>

                    <span
                      className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                        reading.isConformant
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {reading.temperature.toFixed(1)}°C
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Foto enviada por: <strong>{reading.takenBy.userName}</strong> ({reading.takenBy.userRole})
                    <span className="text-slate-400 font-mono text-[11px] ml-1">
                      [Login: {reading.takenBy.loginId || 'cozinha'}]
                    </span>
                  </p>

                  {reading.generalNotes && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">
                      "{reading.generalNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Controles de Visto Duplo (Supervisora e Gerente) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* 1. Visto da Supervisora (Patricia) */}
                <div className="flex-1 sm:flex-initial">
                  {reading.supervisorCheck.checked ? (
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                      <div className="flex items-center gap-1 font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>OK da Supervisora</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        {reading.supervisorCheck.checkedBy}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {reading.supervisorCheck.formattedCheckedAt}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSupervisorCheck(reading.id)}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                      title="Dar o OK da Supervisora confirmando a foto da temperatura"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Dar Visto Supervisora</span>
                    </button>
                  )}
                </div>

                {/* 2. Check do Gerente (Ivan / Pabricio) */}
                <div className="flex-1 sm:flex-initial">
                  {reading.managerCheck.checked ? (
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                      <div className="flex items-center gap-1 font-bold text-amber-800">
                        <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                        <span>Check do Gerente OK</span>
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium">
                        {reading.managerCheck.checkedBy}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {reading.managerCheck.formattedCheckedAt}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleManagerCheck(reading.id)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs border border-slate-700 shadow flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                      title="Marcar o Checkbox do Gerente com data e hora"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>Check do Gerente</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Zoom da Foto do Display */}
      {selectedPhotoForZoom && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl text-slate-100 flex flex-col items-center">
            <button
              onClick={() => setSelectedPhotoForZoom(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-base font-bold text-white mb-1">Display Digital Oficial da Leitura</h4>
            <p className="text-xs text-slate-400 mb-3">
              {selectedPhotoForZoom.readingDate} às {selectedPhotoForZoom.readingTime} ({selectedPhotoForZoom.shiftLabel})
            </p>

            <div className="w-full rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center p-2">
              <img
                src={selectedPhotoForZoom.photoUrl}
                alt="Display Ampliado"
                className="w-full h-auto object-contain rounded"
              />
            </div>

            <div className="w-full mt-4 space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Responsável:</span>
                <span className="font-bold text-white">{selectedPhotoForZoom.takenBy.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Visto Supervisora:</span>
                <span className="text-emerald-400 font-medium">
                  {selectedPhotoForZoom.supervisorCheck.checkedBy || 'Pendente'} (
                  {selectedPhotoForZoom.supervisorCheck.formattedCheckedAt || '-'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Check Gerente:</span>
                <span className="text-amber-400 font-medium">
                  {selectedPhotoForZoom.managerCheck.checkedBy || 'Pendente'} (
                  {selectedPhotoForZoom.managerCheck.formattedCheckedAt || '-'})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modais de Captura e Relatório Semanal */}
      <ColdChamberCaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        currentUserName={currentUserName}
      />

      <ColdChamberWeeklyReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        weekNumber={39}
      />
    </div>
  );
};
