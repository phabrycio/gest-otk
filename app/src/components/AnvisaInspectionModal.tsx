import React, { useState } from 'react';
import {
  ShieldCheck,
  Printer,
  Download,
  CheckCircle2,
  FileText,
  Calendar,
  Building,
  Award,
  AlertTriangle,
  QrCode,
  X,
} from 'lucide-react';

interface AnvisaInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnvisaInspectionModal: React.FC<AnvisaInspectionModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'VISUALIZACAO_LAUDO' | 'CERTIFICADOS_LEGAIS'>('VISUALIZACAO_LAUDO');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const dossierContent = `================================================================================
DOSSIÊ SANITÁRIO OFICIAL & BOAS PRÁTICAS OPERACIONAIS (RDC 216 / CVS 5)
Engenho Cozinha Brasileira • Unidade Ponta Negra • Manaus/AM
Data de Emissão: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
Auditor Responsável: Pabricio / Ivan (Gerência Geral) • Nutricionista RT: CRN-7 4912
================================================================================

1. MONITORAMENTO FOTOGRÁFICO DE TEMPERATURAS (CÂMARAS FRIAS):
- Câmara de Congelados: -19.4°C (Padrão: <= -18°C) • 100% Conforme (Semana 39)
- Câmara de Resfriados: +3.2°C (Padrão: +2°C a +4°C) • 100% Conforme
- Vistos: Supervisora Patricia (100% registrado) | Check Gerência Geral (100% verificado)

2. PLANO DE DESCONGELAMENTO CONTROLADO (PEPS / FIFO):
- 100% das proteínas descongeladas em câmara lenta (evitando banho-maria ou água corrente)
- Reserva técnica operacional de +20% aplicada sobre demanda semanal

3. MANUTENÇÃO PREVENTIVA DE EQUIPAMENTOS CRÍTICOS:
- Torre Naja Chopp: Serpentinas sanitizadas quimicamente (-2.1°C)
- Forno Combinado Rational: Ciclo de descalcificação programado
- Filtros de Água e Gelo Brema: Troca bacteriológica realizada

4. AUDITORIA DE RESÍDUOS E PREVENÇÃO DE PERDAS:
- Descarte de insumos dentro da margem de segurança do CMV (28,4%)

================================================================================
DOCUMENTO REGISTRADO ELETRONICAMENTE NO SISTEMA OPERACIONAL TK GESTÃO
Hash de Integridade Sanitária: ${Math.random().toString(36).substring(2, 15).toUpperCase()}
================================================================================`;

      const blob = new Blob([dossierContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DOSSIE_ANVISA_ENGENHO_PONTA_NEGRA_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess('Dossiê Sanitário Oficial ANVISA baixado com sucesso!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {downloadSuccess && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between animate-slide-down">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              {downloadSuccess}
            </span>
            <button onClick={() => setDownloadSuccess(null)} className="text-white hover:text-emerald-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {/* Topo Institucional do Modal */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#062018] via-[#0a2e23] to-[#062018] text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black tracking-wider uppercase border border-emerald-500/30">
                  Documento Oficial de Auditoria
                </span>
                <span className="text-xs text-slate-300 font-mono">ANVISA RDC 216 / CVS 5</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Dossiê Sanitário & Boas Práticas (Últimos 90 Dias)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
              title="Imprimir Laudo"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{isExporting ? 'Compilando...' : 'Exportar PDF'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Fechar Dossiê"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Abas do Dossiê */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('VISUALIZACAO_LAUDO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'VISUALIZACAO_LAUDO'
                ? 'bg-emerald-950 text-amber-400 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Laudo Pericial Consolidado
          </button>
          <button
            onClick={() => setActiveTab('CERTIFICADOS_LEGAIS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'CERTIFICADOS_LEGAIS'
                ? 'bg-emerald-950 text-amber-400 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏛️ Alvarás, Dedetização & ASOs
          </button>
        </div>

        {/* Corpo com Formatação Estilo Papel Timbrado / ABNT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
          {activeTab === 'VISUALIZACAO_LAUDO' ? (
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-300/80 shadow-md space-y-6 text-slate-800 font-serif">
              {/* Cabeçalho Oficial do Laudo */}
              <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <span className="text-[11px] font-sans font-black tracking-widest text-emerald-900 uppercase block">
                    GRUPO ENGENHO &bull; RESTAURANTE ENGENHO COZINHA BRASILEIRA
                  </span>
                  <h1 className="text-lg font-bold font-sans text-slate-900">
                    RELATÓRIO TÉCNICO DE CONFORMIDADE SANITÁRIA E CONTROLE TÉRMICO
                  </h1>
                  <p className="text-xs font-sans text-slate-500">
                    Em conformidade com a RDC nº 216/2004 - ANVISA e Portaria CVS 5/2013
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center shrink-0">
                  <QrCode className="w-12 h-12 text-slate-900 mx-auto" />
                  <span className="text-[9px] font-sans font-mono block text-slate-400 mt-1">
                    SHA-256: 8f4b...39e1
                  </span>
                </div>
              </div>

              {/* Dados Cadastrais da Unidade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">RAZÃO SOCIAL:</span>
                  <span className="font-bold text-slate-800">ENGENHO COZINHA BRASILEIRA LTDA</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">CNPJ / INSCRIÇÃO ESTADUAL:</span>
                  <span className="font-bold text-slate-800">28.491.032/0001-44 &bull; 04.982.114-1</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">LOCALIZAÇÃO:</span>
                  <span className="font-bold text-slate-800">Av. Coronel Teixeira, 5705 - Shopping Ponta Negra (Loja L3)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">RESPONSÁVEL TÉCNICA (RT):</span>
                  <span className="font-bold text-emerald-900">Dra. Camila Albuquerque (CRN-7 nº 4912)</span>
                </div>
              </div>

              {/* Registro Histórico das Temperaturas Críticas */}
              <div className="space-y-3 font-sans">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Aferição Diária de Temperaturas Críticas (Amostragem dos Últimos 7 Dias)
                  </h3>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    98.6% de Conformidade Térmica
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                        <th className="p-2.5">Data / Turno</th>
                        <th className="p-2.5">Câmara Congelados (&le; -18°C)</th>
                        <th className="p-2.5">Câmara Resfriados (&le; 4°C)</th>
                        <th className="p-2.5">Pista Fria Salão (&le; 5°C)</th>
                        <th className="p-2.5">Óleo Fritura (&le; 25% PC)</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { date: '11/09 (Hoje 10h)', c1: '-19.8°C', c2: '2.4°C', c3: '3.1°C', c4: '14.2%', ok: true },
                        { date: '10/09 (16h)', c1: '-19.2°C', c2: '2.8°C', c3: '3.4°C', c4: '15.0%', ok: true },
                        { date: '09/09 (10h)', c1: '-18.9°C', c2: '3.1°C', c3: '3.6°C', c4: '16.5%', ok: true },
                        { date: '08/09 (16h)', c1: '-19.5°C', c2: '2.6°C', c3: '2.9°C', c4: '18.1%', ok: true },
                        { date: '07/09 (10h)', c1: '-19.1°C', c2: '3.0°C', c3: '3.2°C', c4: '19.4%', ok: true },
                        { date: '06/09 (16h)', c1: '-18.6°C', c2: '3.3°C', c3: '3.8°C', c4: '21.0%', ok: true },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="p-2.5 font-bold text-slate-800">{row.date}</td>
                          <td className="p-2.5 text-emerald-800 font-bold">{row.c1}</td>
                          <td className="p-2.5 text-emerald-800 font-bold">{row.c2}</td>
                          <td className="p-2.5 text-emerald-800 font-bold">{row.c3}</td>
                          <td className="p-2.5 text-slate-700 font-medium">{row.c4}</td>
                          <td className="p-2.5 text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              CONFORME
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rastreabilidade de Pescados Nobres (SIF / Lote) */}
              <div className="space-y-2.5 font-sans pt-2 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  Rastreabilidade de Pescados Regionais de Origem Certificada (SIF / CDA)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block">Costela de Tambaqui de Cativeiro</span>
                    <span className="text-slate-500 text-[11px] block mt-0.5">Lote CDA: #TAM-2026-0910 &bull; S.I.F. nº 4210</span>
                    <span className="text-emerald-700 font-bold text-[10px] block mt-1">Origem: Fazenda Piscicultura Rio Preto da Eva / AM</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block">Lombo de Pirarucu de Manejo Sustentável</span>
                    <span className="text-slate-500 text-[11px] block mt-0.5">Lote CDA: #PIR-2026-0908 &bull; Autorização IBAMA / SIF</span>
                    <span className="text-emerald-700 font-bold text-[10px] block mt-1">Origem: Reserva de Desenvolvimento Sustentável Mamirauá</span>
                  </div>
                </div>
              </div>

              {/* Assinaturas Digitais do Relatório */}
              <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-6 text-center font-sans text-xs">
                <div className="space-y-1">
                  <div className="w-40 border-b border-slate-400 mx-auto pb-6 text-slate-300 text-[10px] font-mono italic">
                    Assinado digitalmente via ICP-Brasil
                  </div>
                  <span className="font-bold text-slate-900 block">Dra. Camila Albuquerque</span>
                  <span className="text-[10px] text-slate-500">Nutricionista Responsável Técnica &bull; CRN-7 4912</span>
                </div>

                <div className="space-y-1">
                  <div className="w-40 border-b border-slate-400 mx-auto pb-6 text-slate-300 text-[10px] font-mono italic">
                    Tk Gestão e Tecnologia Token ID: 9f91a
                  </div>
                  <span className="font-bold text-slate-900 block">Felipe Abreu</span>
                  <span className="text-[10px] text-slate-500">Gerente Geral &bull; Unidade Shopping Ponta Negra</span>
                </div>
              </div>
            </div>
          ) : (
            /* Aba 2: Certificados e Alvarás Legais */
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Certificado de Controle Integrado de Pragas (CIP)',
                    issuer: 'Amazônia Verde Desinsetizações Ltda',
                    validity: '24/11/2026',
                    status: 'VÁLIDO',
                    daysLeft: 74,
                    obs: 'Barreiras físicas, iscas eletrônicas e termonebulização nos dutos de esgoto e doca do shopping.',
                  },
                  {
                    title: 'Comprovante de Coleta de Óleo Saturado',
                    issuer: 'Manaus Bio-Óleo Sustentabilidade',
                    validity: 'Última coleta: 02/09/2026',
                    status: 'CONFORME',
                    daysLeft: 120,
                    obs: 'Volume recolhido: 140 litros em tambores certificados com manifesto de transporte ambiental.',
                  },
                  {
                    title: 'Higienização de Reservatórios & Análise Bacteriológica de Água',
                    issuer: 'Laboratório Central de Águas do Amazonas',
                    validity: '15/12/2026',
                    status: 'VÁLIDO',
                    daysLeft: 95,
                    obs: 'Laudo com ausência de coliformes totais e fecais. Cloração residual mantida em 1.5 ppm.',
                  },
                  {
                    title: 'Atestados de Saúde Ocupacional (ASO) da Brigada',
                    issuer: 'Medicina do Trabalho Ponta Negra',
                    validity: '100% da equipe com ASO vigente',
                    status: 'REGULAR',
                    daysLeft: 180,
                    obs: 'Exames parasitológicos de fezes, coprocultura e hemograma de 18 manipuladores de alimentos.',
                  },
                ].map((doc, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {doc.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">Válido até: {doc.validity}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                    <p className="text-[11px] text-slate-500">{doc.obs}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Emissor: {doc.issuer}</span>
                      <span className="text-emerald-700 font-bold">Arquivo anexado ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
