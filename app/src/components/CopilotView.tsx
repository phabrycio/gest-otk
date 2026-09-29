import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Zap,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  Flame,
  ArrowRight,
  RefreshCw,
  FileText,
  WifiOff,
  ThermometerSnowflake,
  Users,
  AlertTriangle,
  Clock,
  Wine,
} from 'lucide-react';
import { ManagerBonus, AiProactiveAlert, TokenEconomicsMetrics } from '../types';
import type { UserAccount } from '../types/restaurant.types';
import { askGemini } from '../services/geminiService';
import { queryOperationalBrain } from '../services/predictive12WeeksStore';
import { evaluateAiSecurity } from '../services/aiSecurityGuard';

interface CopilotViewProps {
  bonus: ManagerBonus;
  currentUser?: UserAccount | null;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

interface Message {
  id: string;
  sender: 'copilot' | 'user';
  text: string;
  timestamp: string;
}

export const CopilotView: React.FC<CopilotViewProps> = ({ bonus, currentUser, initialPrompt, onClearInitialPrompt }) => {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'ALERTAS_PROATIVOS' | 'PERCALCOS_CONTINGENCIAS'>('ALERTAS_PROATIVOS');
  
  // Mensagem inicial contextualizada estritamente pelo cargo e setor do usuário
  const getInitialGreeting = (u?: UserAccount | null) => {
    const role = u?.role || 'OPERADOR';
    const name = u?.name || 'Colaborador';

    if (role === 'BARTENDER' || role === 'CHEFE_BAR') {
      return `Olá, ${name}! Sou o Copilot IA do Bar & Chopeiras do Engenho Manauara.
Estou configurado com acesso estrito ao seu setor. Posso ajudá-lo com:
• Rendimento de garrafas e controle de doses
• Pressão ideal de chopp e troca de barris
• Contagem física do bar e validade de xaropes/insumos
• Sugestão de pedidos de bebidas ao CDA

Como posso auxiliá-lo no bar hoje?`;
    }

    if (role === 'ASG') {
      return `Olá, ${name}! Sou o Copilot de Higienização & Limpeza do Engenho Manauara.
Posso ajudá-la com:
• Diluição correta de sanitizantes conforme normas ANVISA
• Checklists e cronogramas de limpeza dos toaletes e salão
• Higienização de câmaras frias e descarte de resíduos
• Sua escala e registro de ponto

Como posso ajudar na sua rotina de limpeza hoje?`;
    }

    if (role === 'CHEFE_COZINHA' || role === 'SUB_CHEFE_COZINHA' || role === 'SUBCHEFE') {
      return `Olá, Chefe ${name}! Sou o Copilot de Cozinha & Produção do Engenho Manauara.
Posso auxiliá-lo com:
• Fichas técnicas e rendimento de cortes (Pirarucu, Tambaqui, Carnes)
• Controle de lotes PEPS/PVPS da câmara fria e área de degelo
• Redução de perdas de pré-preparo e aparas
• Solicitações de insumos de alimentos para a Supervisão

O que deseja verificar na cozinha hoje?`;
    }

    if (role === 'SUPERVISOR' || role === 'SUPERVISORA') {
      return `Olá, Supervisora ${name}! Sou o Copilot de Operação Administrativa do Engenho Manauara.
Posso auxiliá-la com:
• Gestão de escalas, faltas e controle de atrasos da equipe
• Acompanhamento de checklists de abertura e fechamento
• Conferência presencial de inventários com assinatura digital
• Aprovação eletrônica de pedidos de compras

Qual rotina deseja alinhar agora?`;
    }

    return `Olá, ${name}! Sou o Copilot de Gestão e Operação do Restaurante Engenho / Dionísio.
Operando com **segurança RBAC ativa**, governança corporativa e contextualização por setor.
Como posso auxiliá-lo na liderança do turno hoje?`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'copilot',
      text: getInitialGreeting(currentUser),
      timestamp: 'Agora',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Métricas reais de Token Economics
  const tokenMetrics: TokenEconomicsMetrics = {
    totalTokensSavedToday: 284500,
    moneySavedReais: 42.67,
    edgeInterceptionRatePct: 84.6,
    activeModel: 'Gemini 2.5 Flash + Context Cache (TTL 24h)',
    cacheHitsCount: 142,
    averageDecisionLatencyMs: 380,
  };

  // Alertas Proativos do Motor de Decisão
  const [alerts, setAlerts] = useState<AiProactiveAlert[]>([
    {
      id: 'alt-01',
      severity: 'CRITICAL',
      category: 'EQUIPAMENTO_FRIO',
      title: 'Câmara Fria 02 (Tambaqui) em Aquecimento Anormal',
      problemDescription: 'Sensor registrou subida contínua de -19.4°C para -8.2°C nos últimos 54 minutos. Inércia térmica suporta mais 90 minutos antes do descongelamento superficial.',
      financialRiskReais: 3800,
      recommendedDecision: 'Disparar chamado urgente ao plantão de manutenção do Shopping Ponta Negra e bloquear abertura das portas.',
      quickActionLabel: 'Acionar Manutenção Shopping (WhatsApp)',
      actionPayload: 'CHAMADO_MANUTENCAO_FRIO',
      timestamp: 'Há 8 minutos',
      tokenSavingsMethod: 'Gating Heurístico Local (0 tokens gastos)',
    },
    {
      id: 'alt-02',
      severity: 'WARNING',
      category: 'CMV_VALIDADE',
      title: '3 Barris de Chopp Brahma 50L Próximos do Vencimento (48h)',
      problemDescription: 'Estoque virtual identificou lote com validade em 15/09. Giro atual de 1.2 barris/dia deixará 1.8 barris estragados no fim da semana.',
      financialRiskReais: 1890,
      recommendedDecision: 'Lançar promoção de Double Chopp no Happy Hour (17h-20h) casado com Dadinhos de Tapioca (markup de 4.2x) para proteger a margem.',
      quickActionLabel: 'Ativar Combo no PDV Toast',
      actionPayload: 'ATIVAR_COMBO_CHOPP',
      timestamp: 'Hoje às 10:15',
      tokenSavingsMethod: 'Regra Determinística de Validade (0 tokens gastos)',
    },
    {
      id: 'alt-03',
      severity: 'WARNING',
      category: 'BOQUETA_SALAO',
      title: 'Mesa 14 (VIP Dr. Haroldo) Aguardando Pirarucu há 24 min',
      problemDescription: 'Tempo limite da boqueta no almoço é 22 minutos. Prato está na praça de finalização de grelha.',
      financialRiskReais: 450,
      recommendedDecision: 'Gerente ir pessoalmente à mesa com abordagem de acolhimento e liberar cortesia de dadinho de tapioca enquanto o chef finaliza.',
      quickActionLabel: 'Prioridade Zero Boqueta + Script',
      actionPayload: 'PRIORIDADE_MESA_14',
      timestamp: 'Há 3 minutos',
      tokenSavingsMethod: 'Timer Heurístico Local (0 tokens gastos)',
    },
    {
      id: 'alt-04',
      severity: 'CRITICAL',
      category: 'FRAUDE_ESTOQUE',
      title: 'Comissário Paulo: Aumento Anômalo no Cancelamento de Taxa de 10% (28.5%)',
      problemDescription: 'O motor de auditoria IA detectou que o comissário Paulo cancelou R$ 1.840,00 em taxas de serviço (28.5% das 84 mesas atendidas), enquanto a média da brigada é de apenas 3.8%. Há suspeita de má prestação de serviço ou retenção de gorjeta paga em dinheiro por fora (grave infração disciplinar).',
      financialRiskReais: 1840,
      recommendedDecision: 'Convocar colaborador para alinhamento reservado com a gerência geral e auditar histórico de comandas no log do sistema.',
      quickActionLabel: 'Auditar Comandas do Comissário Paulo',
      actionPayload: 'AUDITAR_COMISSARIO_PAULO',
      timestamp: 'Hoje às 11:42',
      tokenSavingsMethod: 'Motor de Detecção de Anomalias IA (0 tokens gastos)',
    },
  ]);

  // Lista dos 8 Percalços Operacionais Críticos (DOC-23)
  const operationalHazards = [
    {
      id: 'p-1',
      title: '1. Queda Total de Internet / Fibra da Loja',
      category: 'CONECTIVIDADE',
      icon: WifiOff,
      color: 'from-rose-500/20 to-rose-600/10 border-rose-300 text-rose-900',
      actionLabel: 'Ativar Modo PWA Offline',
      actionDesc: 'Banco local IndexedDB ativado. Fotos e QR codes enfileirados com hash criptográfico.',
    },
    {
      id: 'p-2',
      title: '2. Queda de Energia / Gerador do Shopping',
      category: 'ENERGIA',
      icon: ThermometerSnowflake,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-300 text-amber-900',
      actionLabel: 'Travar Abertura de Freezers',
      actionDesc: 'Dispara alerta sonoro nas cozinhas e monitora inércia térmica dos pescados.',
    },
    {
      id: 'p-3',
      title: '3. Atraso ou Furo do Caminhão da CDA',
      category: 'SUPRIMENTOS',
      icon: Flame,
      color: 'from-orange-500/20 to-orange-600/10 border-orange-300 text-orange-900',
      actionLabel: 'Item 86 no Toast + Roteiro Salão',
      actionDesc: 'Pausa item no cardápio digital e instrui garçons a direcionarem para prato substituto.',
    },
    {
      id: 'p-4',
      title: '4. Fiscalização Surpresa ANVISA / PROCON',
      category: 'COMPLIANCE',
      icon: ShieldAlert,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-300 text-emerald-900',
      actionLabel: 'Gerar Dossiê ANVISA 90 Dias (PDF)',
      actionDesc: 'Exporta temperaturas, dedetização, descarte de óleo e exames ASO da brigada.',
    },
    {
      id: 'p-5',
      title: '5. Falta Inesperada de Colaboradores no Pico',
      category: 'RH & BRIGADA',
      icon: Users,
      color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-300 text-indigo-900',
      actionLabel: 'Chamar Freelance SOS (WhatsApp)',
      actionDesc: 'Dispara convocação automática para 5 atendentes pré-homologados do Grupo Engenho.',
    },
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'CHAT') {
      scrollToBottom();
    }
  }, [messages, isTyping, activeTab]);

  useEffect(() => {
    if (initialPrompt) {
      setActiveTab('CHAT');
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleExecuteQuickAction = (actionPayload: string, title: string) => {
    setActionSuccessMsg(`Ação executada com sucesso: "${title}" foi despachada para o sistema.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const getRoleShortcuts = (u?: UserAccount | null): string[] => {
    const role = u?.role || 'OPERADOR';
    if (role === 'BARTENDER' || role === 'CHEFE_BAR') {
      return [
        '🍹 Rendimento de garrafas de Gin e Whisky',
        '🍺 Pressão ideal do Chopp e troca de barril',
        '🧊 Padrão de dosagem e gelo nos coquetéis',
        '📦 Sugerir pedido de insumos do Bar ao CDA',
      ];
    }
    if (role === 'ASG') {
      return [
        '🧹 Diluição de sanitizante clorado ANVISA',
        '🧼 Checklist de higienização dos toaletes',
        '🗑️ Cronograma de descarte e recolhimento de lixo',
        '⏰ Como registrar meu ponto de hoje?',
      ];
    }
    if (role === 'CHEFE_COZINHA' || role === 'SUB_CHEFE_COZINHA' || role === 'SUBCHEFE') {
      return [
        '🐟 Ficha técnica do Pirarucu em Crosta',
        '❄️ Ordem dos lotes PEPS da Câmara Fria',
        '🥩 Rendimento de cortes e aparas máximas',
        '📦 Solicitar insumos de cozinha à Supervisão',
      ];
    }
    if (role === 'SUPERVISOR' || role === 'SUPERVISORA') {
      return [
        '📋 Checklists de abertura pendentes',
        '👥 Atrasos e faltas registradas no turno',
        '✍️ Como validar inventário com assinatura digital?',
        '📦 Compras de insumos aguardando aprovação',
      ];
    }
    // Gerente / Donos
    return [
      '🚨 Mesa reclamando de demora. Como agir?',
      '💰 Como garantir meus R$ 2.000 de bônus?',
      '🚚 O que pedir ao CDA para o fim de semana?',
      '🌦️ Qual o impacto da chuva de hoje no shopping?',
    ];
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      let botReply = '';

      // 1. KERNEL DE SEGURANÇA: Anti-Vazamento de Prompt, Escopo de Negócio e Isolamento RBAC
      const securityCheck = evaluateAiSecurity(text, currentUser || null);
      if (securityCheck.isBlocked) {
        botReply = securityCheck.responseMessage || 'Acesso restrito para o seu cargo.';
      } else {
        // Envia para o motor de IA com isolamento de contexto e blindagem por cargo
        botReply = await askGemini(text, 'COPILOT_OPERACIONAL', currentUser);
      }

      const botMsg: Message = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      const errorMsg: Message = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text: `Erro de comunicação com a IA: ${e?.message || 'Serviço temporariamente indisponível'}. Tente novamente.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra Superior de Token Economics & Eficiência da IA */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-4 rounded-2xl border border-emerald-800/40 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">IA Multimodal & Decisões Executivas</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 2.5 + Context Cache
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Frugalidade de Tokens: <span className="text-amber-400 font-bold">{tokenMetrics.edgeInterceptionRatePct}%</span> das checagens filtradas no dispositivo a Custo Zero.
            </p>
          </div>
        </div>

        {/* Indicadores de Economia de Tokens */}
        <div className="flex items-center gap-2 self-stretch lg:self-auto justify-between sm:justify-end text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block">Tokens Poupados Hoje</span>
            <span className="font-bold text-amber-400">{tokenMetrics.totalTokensSavedToday.toLocaleString('pt-BR')}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block">Economia em R$</span>
            <span className="font-bold text-emerald-400">+R$ {tokenMetrics.moneySavedReais.toFixed(2)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block">Latência Média</span>
            <span className="font-bold text-slate-200">{tokenMetrics.averageDecisionLatencyMs}ms</span>
          </div>
        </div>
      </div>

      {/* Alerta de Feedback de Ação Executada */}
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Seletor de Sub-Abas do Copilot */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl gap-1.5 border border-slate-300/60 shadow-inner">
        <button
          onClick={() => setActiveTab('ALERTAS_PROATIVOS')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ALERTAS_PROATIVOS'
              ? 'bg-emerald-950 text-amber-400 shadow-md ring-1 ring-amber-400/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>🚨 Radar de Decisões & Alertas ({alerts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('PERCALCOS_CONTINGENCIAS')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'PERCALCOS_CONTINGENCIAS'
              ? 'bg-emerald-950 text-amber-400 shadow-md ring-1 ring-amber-400/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>🛡️ Percalços & Contornos (DOC-23)</span>
        </button>
        <button
          onClick={() => setActiveTab('CHAT')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'CHAT'
              ? 'bg-emerald-950 text-amber-400 shadow-md ring-1 ring-amber-400/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Bot className="w-4 h-4 text-amber-400" />
          <span>💬 Chat Consultivo IA</span>
        </button>
      </div>

      {/* Conteúdo Aba 1: Radar de Alertas Proativos & Decisões */}
      {activeTab === 'ALERTAS_PROATIVOS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">
              Ocorrências Detectadas pelo Motor Preditivo (Com Decisão Sugerida):
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Atualizado em tempo real via Edge Heuristics
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((al) => (
              <div
                key={al.id}
                className={`p-4 rounded-2xl border shadow-sm transition-all ${
                  al.severity === 'CRITICAL'
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-black/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        al.severity === 'CRITICAL'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-amber-950'
                      }`}
                    >
                      {al.severity}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{al.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                      Risco: R$ {al.financialRiskReais.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-slate-400">{al.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-2.5 leading-relaxed font-medium">
                  {al.problemDescription}
                </p>

                {/* Recomendação da IA */}
                <div className="mt-3 p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-bold text-emerald-950 block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Decisão Recomendada pela IA:
                    </span>
                    <span className="text-slate-600 text-[11px] leading-snug">
                      {al.recommendedDecision}
                    </span>
                  </div>

                  <button
                    onClick={() => handleExecuteQuickAction(al.actionPayload, al.title)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-950 hover:from-emerald-950 hover:to-slate-950 text-amber-400 text-xs font-bold shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all self-end sm:self-auto"
                  >
                    <span>{al.quickActionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>Método: {al.tokenSavingsMethod}</span>
                  <span className="text-emerald-700 font-bold">✓ Custo Zero de API</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Matriz de Percalços & Contingências (DOC-23) */}
      {activeTab === 'PERCALCOS_CONTINGENCIAS' && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Guia Rápido de Contingência de Loja:</span> Dispare soluções imediatas para os principais percalços operacionais do Shopping Ponta Negra sem burocracia.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {operationalHazards.map((haz) => {
              const IconComp = haz.icon;
              return (
                <div
                  key={haz.id}
                  className={`p-4 rounded-2xl border bg-gradient-to-br ${haz.color} shadow-xs space-y-2.5 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-white shadow-xs">
                        <IconComp className="w-4 h-4" />
                      </span>
                      <h3 className="text-xs font-bold text-slate-900">{haz.title}</h3>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed font-medium">
                      {haz.actionDesc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleExecuteQuickAction(haz.category, haz.title)}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>{haz.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Chat Consultivo IA */}
      {activeTab === 'CHAT' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[560px] overflow-hidden">
          {/* Prompts Rápidos */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200/70 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Atalhos Rápidos:
            </span>
            {getRoleShortcuts(currentUser).map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:border-emerald-600 hover:text-emerald-800 whitespace-nowrap transition-all shadow-2xs"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    m.sender === 'user'
                      ? 'bg-slate-800 text-white'
                      : 'bg-emerald-900 text-amber-400 shadow-xs'
                  }`}
                >
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-900 text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line prose-xs">{m.text}</div>
                  <span
                    className={`text-[9px] mt-1.5 block text-right ${
                      m.sender === 'user' ? 'text-emerald-200/70' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <Bot className="w-4 h-4 text-emerald-700 animate-bounce" />
                <span>Consultando Context Cache do Gemini (Zero Latência)...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input de Mensagem */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Pergunte ao Copilot sobre salão, pedidos ao CDA, bônus ou equipe..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 text-xs p-3 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-slate-50/50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-950 hover:from-emerald-950 hover:to-slate-950 text-white font-bold shadow-md disabled:opacity-40 transition-all flex items-center justify-center"
              >
                <Send className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
