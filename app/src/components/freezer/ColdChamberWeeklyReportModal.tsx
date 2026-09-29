// ============================================================
// RELATÓRIO SEMANAL DE TEMPERATURA PARA QUADRO DE AVISOS
// Assinado por: Responsável pela Leitura, Supervisora e Gerente
// Tk Gestão e Tecnologia • Unidade Engenho Manauara (RDC 216 Anvisa)
// ============================================================

import React, { useRef } from 'react';
import {
  X,
  Printer,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  ShieldCheck,
  ThermometerSnowflake,
  Download,
} from 'lucide-react';
import { getWeeklyChamberReport } from '../../services/coldChamberStore';

interface ColdChamberWeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekNumber?: number;
}

export const ColdChamberWeeklyReportModal: React.FC<ColdChamberWeeklyReportModalProps> = ({
  isOpen,
  onClose,
  weekNumber = 39,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const report = getWeeklyChamberReport(weekNumber);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in print:p-0 print:bg-white print:static print:inset-auto">
      <div className="relative w-full max-w-5xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:rounded-none print:border-none">
        {/* Barra de Ações Superior (Oculta na Impressão) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold">Relatório Semanal de Temperatura para Quadro de Avisos</h3>
              <p className="text-[11px] text-slate-400">
                {report.weekLabel} • Pronto para impressão e assinatura tríplice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Imprimível do Relatório */}
        <div
          ref={printAreaRef}
          className="flex-1 p-6 md:p-8 overflow-y-auto print:overflow-visible print:p-6 text-slate-900 font-sans"
        >
          {/* Cabeçalho Oficial Timbrado do Restaurante */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0a2e23] text-amber-400 flex items-center justify-center font-black text-xl border border-amber-500/30 shrink-0">
                TK
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-950 uppercase tracking-tight leading-none">
                  Restaurante Engenho Manauara
                </h1>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  Unidade Manauara Shopping • Manaus / AM
                </p>
                <p className="text-[10px] text-slate-500">
                  Boas Práticas de Fabricação & Segurança dos Alimentos • RDC 216/2004 ANVISA
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 rounded bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-wider border border-slate-300">
                Quadro de Avisos • Cozinha
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1">{report.weekLabel}</p>
              <p className="text-[10px] text-slate-500">Período: {report.startDate} a {report.endDate}</p>
            </div>
          </div>

          {/* Título do Relatório */}
          <div className="bg-slate-100 rounded-xl p-3 mb-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase">
                Planilha Semanal de Registro Fotográfico de Temperatura da Câmara Fria
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Equipamento: <strong>{report.chamberName}</strong> • Faixa Exigida: <strong>{report.targetTempRange}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-xs">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Total de Leituras:</span>
                <span className="font-extrabold text-slate-900">{report.totalReadings} registros</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Conformidade:</span>
                <span className="font-extrabold text-emerald-700">
                  {((report.conformantCount / (report.totalReadings || 1)) * 100).toFixed(0)}% Conforme
                </span>
              </div>
            </div>
          </div>

          {/* Tabela de Leituras com Fotos e Assinaturas */}
          <div className="overflow-x-auto border border-slate-300 rounded-xl shadow-xs mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                  <th className="p-2.5 border-r border-slate-700">Foto Display</th>
                  <th className="p-2.5 border-r border-slate-700">Dia & Turno</th>
                  <th className="p-2.5 border-r border-slate-700 text-center">Temp. (°C)</th>
                  <th className="p-2.5 border-r border-slate-700">Responsável Leitura (Foto)</th>
                  <th className="p-2.5 border-r border-slate-700">Visto Supervisora</th>
                  <th className="p-2.5">Check do Gerente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.readings.map((r, idx) => {
                  const isMorning = r.shift === 'MANHA_ABERTURA';

                  return (
                    <tr
                      key={r.id}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}
                    >
                      {/* Miniatura da Foto Real do Termômetro */}
                      <td className="p-2 border-r border-slate-200 text-center w-20">
                        <div className="w-16 h-12 rounded border border-slate-300 overflow-hidden bg-black mx-auto flex items-center justify-center">
                          <img
                            src={r.photoUrl}
                            alt={`Foto ${r.readingDate}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Dia & Turno */}
                      <td className="p-2 border-r border-slate-200">
                        <div className="font-bold text-slate-900">
                          {new Date(r.readingDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit',
                          })}
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                            isMorning
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-indigo-100 text-indigo-900'
                          }`}
                        >
                          {r.shiftLabel} • {r.readingTime}
                        </span>
                      </td>

                      {/* Temperatura com Destaque */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-black font-mono ${
                            r.isConformant
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-red-100 text-red-900 border border-red-300'
                          }`}
                        >
                          {r.temperature.toFixed(1)}°C
                        </span>
                        <span className="block text-[9px] text-slate-500 mt-0.5 font-medium">
                          {r.isConformant ? 'Normal' : 'Divergente'}
                        </span>
                      </td>

                      {/* Quem fez a foto */}
                      <td className="p-2 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{r.takenBy.userName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Login: {r.takenBy.loginId || r.takenBy.userName.toLowerCase()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {r.readingDate} às {r.readingTime}
                        </div>
                      </td>

                      {/* Visto da Supervisora */}
                      <td className="p-2 border-r border-slate-200">
                        {r.supervisorCheck.checked ? (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              OK Supervisora
                            </span>
                            <div className="text-[10px] text-slate-700 font-medium">
                              {r.supervisorCheck.checkedBy}
                            </div>
                            <div className="text-[9px] text-slate-400">
                              {r.supervisorCheck.formattedCheckedAt}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Pendente Visto
                          </span>
                        )}
                      </td>

                      {/* Check do Gerente */}
                      <td className="p-2">
                        {r.managerCheck.checked ? (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Check Gerente
                            </span>
                            <div className="text-[10px] text-slate-700 font-medium">
                              {r.managerCheck.checkedBy}
                            </div>
                            <div className="text-[9px] text-slate-400">
                              {r.managerCheck.formattedCheckedAt}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Pendente Check
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Banner de Instrução do Quadro de Avisos */}
          <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3 mb-8 text-amber-950 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Afixação Semanal Obrigatória:</strong> Este relatório impresso deve ser anexado no{' '}
                <strong>Quadro de Avisos da Cozinha / Salão</strong> todos os domingos após a assinatura dos 3 responsáveis abaixo.
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 px-2 py-0.5 rounded">
              Auditoria Anvisa
            </span>
          </div>

          {/* 3 CAMPOS OFICIAIS DE ASSINATURA FÍSICA PARA O QUADRO DE AVISOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t-2 border-slate-900 mt-4">
            {/* 1. Responsável pela Leitura */}
            <div className="flex flex-col items-center text-center">
              <div className="w-full border-b border-slate-800 mb-2 h-10 flex items-end justify-center">
                <span className="text-xs italic text-slate-400 font-serif">Mádio / Esmael</span>
              </div>
              <p className="text-xs font-bold text-slate-900">Responsável pela Leitura</p>
              <p className="text-[10px] text-slate-600">Chefe / Sub Chefe de Cozinha</p>
              <p className="text-[9px] text-slate-400 mt-1">Data: _____/_____/2026</p>
            </div>

            {/* 2. Supervisora */}
            <div className="flex flex-col items-center text-center">
              <div className="w-full border-b border-slate-800 mb-2 h-10 flex items-end justify-center">
                <span className="text-xs italic text-slate-400 font-serif">Patricia</span>
              </div>
              <p className="text-xs font-bold text-slate-900">Supervisora da Loja</p>
              <p className="text-[10px] text-slate-600">Supervisão Operacional & Boas Práticas</p>
              <p className="text-[9px] text-slate-400 mt-1">Data: _____/_____/2026</p>
            </div>

            {/* 3. Gerente Geral */}
            <div className="flex flex-col items-center text-center">
              <div className="w-full border-b border-slate-800 mb-2 h-10 flex items-end justify-center">
                <span className="text-xs italic text-slate-400 font-serif">Ivan / Pabricio</span>
              </div>
              <p className="text-xs font-bold text-slate-900">Gerente Geral / Em Treinamento</p>
              <p className="text-[10px] text-slate-600">Comando Executivo da Loja</p>
              <p className="text-[9px] text-slate-400 mt-1">Data: _____/_____/2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
