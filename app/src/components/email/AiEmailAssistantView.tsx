// ============================================================
// CENTRAL DE RESPOSTA INTELIGENTE DE E-MAILS COM IA GEMINI
// O gerente cola o e-mail recebido e a IA gera uma resposta precisa,
// profissional e fundamentada nos dados reais e prazos da loja.
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Copy,
  Check,
  Send,
  Building2,
  Truck,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { askGemini } from '../../services/geminiService';
import { buildRestaurantLiveContext, formatRestaurantContextForGemini } from '../../services/restaurantAiContextService';

export type EmailSenderType =
  | 'ADMINISTRACAO_SHOPPING'
  | 'FORNECEDOR_CDA'
  | 'CONTABILIDADE_FISCAL'
  | 'CLIENTE_SAC'
  | 'DIRETORIA_SOCIOS'
  | 'VIGILANCIA_ANVISA'
  | 'OUTRO';

interface EmailTypeOption {
  id: EmailSenderType;
  label: string;
  desc: string;
  icon: any;
}

const SENDER_OPTIONS: EmailTypeOption[] = [
  {
    id: 'ADMINISTRACAO_SHOPPING',
    label: 'Shopping / Condomínio',
    desc: 'Operações, laudos de exaustão, dedetização e horários',
    icon: Building2,
  },
  {
    id: 'FORNECEDOR_CDA',
    label: 'Fornecedor / CDA',
    desc: 'Entregas, pedidos de insumos, boletos e notas fiscais',
    icon: Truck,
  },
  {
    id: 'CONTABILIDADE_FISCAL',
    label: 'Contabilidade / Fiscal',
    desc: 'Fechamento de caixa, cupons, SPED e folha de ponto',
    icon: FileSpreadsheet,
  },
  {
    id: 'VIGILANCIA_ANVISA',
    label: 'Vigilância Sanitária / ANVISA',
    desc: 'Boas práticas, alvará, água e relatórios técnicos',
    icon: ShieldCheck,
  },
  {
    id: 'CLIENTE_SAC',
    label: 'Cliente / SAC / Eventos',
    desc: 'Reservas, elogios, reclamações ou dúvidas',
    icon: Users,
  },
  {
    id: 'DIRETORIA_SOCIOS',
    label: 'Diretoria / Sócios',
    desc: 'Reportes de turno, faturamento e justificativas',
    icon: Sparkles,
  },
];

export const AiEmailAssistantView: React.FC = () => {
  const [incomingEmail, setIncomingEmail] = useState('');
  const [senderType, setSenderType] = useState<EmailSenderType>('ADMINISTRACAO_SHOPPING');
  const [extraInstructions, setExtraInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Resposta gerada
  const [generatedSubject, setGeneratedSubject] = useState<string | null>(null);
  const [generatedBody, setGeneratedBody] = useState<string | null>(null);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  // Exibir contexto da loja
  const [showLiveContext, setShowLiveContext] = useState(false);
  const liveCtx = buildRestaurantLiveContext();

  const handleGenerateResponse = async (refinementNote?: string) => {
    if (!incomingEmail.trim()) {
      setErrorMsg('Por favor, cole o conteúdo do e-mail recebido para que a IA possa analisar.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const liveFacts = formatRestaurantContextForGemini();
      const selectedOption = SENDER_OPTIONS.find((s) => s.id === senderType);

      const prompt = `
Você é o assistente executivo e de comunicação corporativa do restaurante ${liveCtx.restaurantName}.
Sua tarefa é redigir uma resposta de e-mail de alto nível para o e-mail recebido abaixo.

[DADOS REAIS E FATOS DA LOJA PARA VOCÊ USAR NA RESPOSTA]:
${liveFacts}

[TIPO DE REMETENTE / CONTEXTO]:
${selectedOption?.label} - ${selectedOption?.desc}

[E-MAIL RECEBIDO]:
"""
${incomingEmail.trim()}
"""

${extraInstructions ? `[INSTRUÇÕES ESPECÍFICAS DO GERENTE]:\n${extraInstructions}\n` : ''}
${refinementNote ? `[AJUSTE SOLICITADO]:\n${refinementNote}\n` : ''}

[DIRETRIZES DA RESPOSTA]:
1. A resposta deve ser profissional, educada, segura e assertiva.
2. Utilize os dados reais da loja (endereço, nomes, prazos de laudos, status de pedidos) sempre que pertinente à solicitação do e-mail.
3. Se o e-mail pedir comprovantes de dedetização, limpeza de caixa d'água ou exaustores, mencione os prazos e laudos da unidade.
4. Se o e-mail for de fornecedor ou cobrança, posicione de acordo com o departamento financeiro da loja.
5. Formate estritamente no seguinte padrão:

ASSUNTO: [Escreva aqui o assunto sugerido com clareza]

CORPO:
[Escreva aqui o corpo completo do e-mail, incluindo saudação inicial adequada, desenvolvimento do texto, fechamento profissional e assinatura formal da gerência da unidade Engenho]
`.trim();

      const reply = await askGemini(prompt, 'RESPOSTA_EMAIL_INTELIGENTE');

      // Processa a resposta extraindo assunto e corpo
      const subjectMatch = reply.match(/ASSUNTO:\s*(.+)/i);
      const bodyMatch = reply.split(/CORPO:\s*/i);

      if (subjectMatch && bodyMatch.length > 1) {
        setGeneratedSubject(subjectMatch[1].trim());
        setGeneratedBody(bodyMatch[1].trim());
      } else {
        setGeneratedSubject(`Resposta Ref: ${liveCtx.restaurantName}`);
        setGeneratedBody(reply);
      }
    } catch (err: any) {
      setErrorMsg(`Erro ao gerar e-mail com a IA: ${err?.message || 'Falha de conexão'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, type: 'subject' | 'body') => {
    navigator.clipboard.writeText(text);
    if (type === 'subject') {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2500);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2500);
    }
  };

  const handleOpenMailClient = () => {
    if (!generatedBody) return;
    const subject = encodeURIComponent(generatedSubject || `Contato ${liveCtx.restaurantName}`);
    const body = encodeURIComponent(generatedBody);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. Header Corporativo */}
      <div className="bg-gradient-to-r from-[#051c15] via-[#0a2e23] to-[#041711] text-white p-5 rounded-2xl border border-emerald-800/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-black tracking-tight text-white">Central de Resposta de E-mails com IA</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini 2.5 Flash Ativo
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Cole qualquer e-mail recebido e a IA redige uma resposta pronta, fundamentada nos dados reais e prazos da sua loja.
            </p>
          </div>
        </div>

        {/* Botão de Ver Contexto Ativo da Loja */}
        <button
          onClick={() => setShowLiveContext((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/10 cursor-pointer self-start md:self-auto shrink-0"
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-300" />
          <span>Dados Reais Usados</span>
          {showLiveContext ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2. Painel Colapsável de Fatos Ativos que a IA lê */}
      {showLiveContext && (
        <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-2xl p-4 text-xs text-emerald-200/90 space-y-2 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between font-bold text-white border-b border-emerald-900/40 pb-1.5">
            <span>Fatos Ativos da Loja Disponíveis para a IA:</span>
            <span className="text-[10px] text-emerald-400 font-mono">Unidade: {liveCtx.restaurantName}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2 rounded-lg bg-emerald-900/20 border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">Endereço / Local</span>
              <span className="font-bold text-white">{liveCtx.location}</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-900/20 border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">Faturamento de Hoje</span>
              <span className="font-bold text-white">R$ {liveCtx.finance.grossRevenue.toFixed(2)} ({liveCtx.finance.totalOrders} pedidos)</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-900/20 border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">Prazos e Licenças</span>
              <span className="font-bold text-white">{liveCtx.calendar.pendingDeadlinesCount} obrigações registradas</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-900/20 border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">Torneiras do Bar</span>
              <span className="font-bold text-white">{liveCtx.bar.tapsCount} torneiras operando</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Seletor de Tipo de Remetente */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          1. Quem enviou o e-mail? (Define o tom e a regra de negócio)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SENDER_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = senderType === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSenderType(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-[#0a2e23] text-white border-emerald-700 shadow-md ring-1 ring-emerald-500'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold truncate">{opt.label}</span>
                </div>
                <span className={`text-[10px] leading-tight line-clamp-2 ${isSelected ? 'text-emerald-200/80' : 'text-slate-500'}`}>
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Caixa de Colar o E-mail Recebido */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Cole o conteúdo do e-mail recebido abaixo:
          </label>
          {incomingEmail && (
            <button
              onClick={() => setIncomingEmail('')}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar
            </button>
          )}
        </div>

        <textarea
          rows={6}
          value={incomingEmail}
          onChange={(e) => setIncomingEmail(e.target.value)}
          placeholder="Exemplo: 'Prezados lojistas, solicitamos envio do comprovante de dedetização e controle de pragas atualizado referente ao mês de setembro até sexta-feira às 18h sob pena de notificação condominial. Atenciosamente, Administração do Shopping.'"
          className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0a2e23] focus:border-transparent placeholder:text-slate-400 transition-all font-sans leading-relaxed"
        />

        {/* Instruções Adicionais Opcionais */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Orientação extra para a IA (Opcional):
          </label>
          <input
            type="text"
            value={extraInstructions}
            onChange={(e) => setExtraInstructions(e.target.value)}
            placeholder="Ex: 'Diga que a dedetização está agendada para dia 05/10 após o fechamento e anexe os dados do Ivan.'"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0a2e23] placeholder:text-slate-400"
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Botão de Disparo */}
        <button
          onClick={() => handleGenerateResponse()}
          disabled={isLoading || !incomingEmail.trim()}
          className="w-full py-3.5 px-4 rounded-xl bg-[#0a2e23] hover:bg-[#124b3a] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>A IA Gemini está analisando os dados e redigindo a resposta...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Redigir Resposta Perfeita com IA Gemini</span>
            </>
          )}
        </button>
      </div>

      {/* 5. Resultado da Resposta Gerada */}
      {generatedBody && (
        <div className="bg-white p-5 rounded-2xl border border-emerald-300/80 shadow-lg space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-black text-slate-900">Resposta Pronta para Envio</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenMailClient}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                title="Abrir no seu aplicativo de e-mail padrão"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Abrir no E-mail</span>
              </button>

              <button
                onClick={() => handleCopy(`${generatedSubject ? `Assunto: ${generatedSubject}\n\n` : ''}${generatedBody}`, 'body')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {copiedBody ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBody ? 'Copiado!' : 'Copiar E-mail Completo'}</span>
              </button>
            </div>
          </div>

          {/* Campo de Assunto */}
          {generatedSubject && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>ASSUNTO SUGERIDO:</span>
                <button
                  onClick={() => handleCopy(generatedSubject, 'subject')}
                  className="text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedSubject ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSubject ? 'Copiado!' : 'Copiar assunto'}</span>
                </button>
              </div>
              <p className="text-xs font-bold text-slate-900 select-text">{generatedSubject}</p>
            </div>
          )}

          {/* Campo do Corpo do E-mail */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block">CORPO DO E-MAIL:</span>
            <div className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed select-text">
              {generatedBody}
            </div>
          </div>

          {/* Botões de Refinamento Rápido com 1 Clique */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Refinar resposta:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleGenerateResponse('Torne a resposta mais formal e institucional')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                + Formal
              </button>
              <button
                onClick={() => handleGenerateResponse('Torne a resposta mais curta, objetiva e direta')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                + Direto e Curto
              </button>
              <button
                onClick={() => handleGenerateResponse('Adicione um pedido cordial de prorrogação de prazo de 5 dias úteis')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Pedir Prorrogação
              </button>
              <button
                onClick={() => handleGenerateResponse('Destaque que o laudo técnico já foi agendado e será enviado na data prometida')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
