// ============================================================
// SERVIÇO GOOGLE GEMINI AI (APOIO DE GESTÃO DO RESTAURANTE COM BLINDAGEM RBAC)
// Tk Gestão e Tecnologia • Unidade Engenho Manauara & Dionísio
// ============================================================

import { evaluateAiSecurity, buildHardenedSystemInstruction } from './aiSecurityGuard';
import { formatRestaurantContextForGemini } from './restaurantAiContextService';
import { getSession } from './restaurantStore';
import type { UserAccount, UserRole } from '../types/restaurant.types';

const STORAGE_KEY_GEMINI_API_KEY = 'tk_gemini_api_key';
const GEMINI_MODEL = 'gemini-2.5-flash';

export interface GeminiConfig {
  apiKey: string;
  isConfigured: boolean;
  model: string;
}

export function getGeminiConfig(): GeminiConfig {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  let storedKey = '';
  try {
    storedKey = localStorage.getItem(STORAGE_KEY_GEMINI_API_KEY) || '';
    if (storedKey === 'undefined' || storedKey === 'null') {
      localStorage.removeItem(STORAGE_KEY_GEMINI_API_KEY);
      storedKey = '';
    }
  } catch {
    /* ignore */
  }

  const apiKey = envKey || storedKey;

  return {
    apiKey,
    isConfigured: Boolean(apiKey && apiKey.length > 15),
    model: GEMINI_MODEL,
  };
}

export function saveGeminiApiKey(apiKey: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_GEMINI_API_KEY, apiKey.trim());
  } catch (e) {
    console.error('Erro ao salvar chave da API Gemini:', e);
  }
}

/**
 * Envia uma mensagem para a IA Gemini com tripla blindagem de segurança:
 * 1. Defesa ativa contra extração de Prompt e Jailbreak.
 * 2. Firewall de Escopo: Apenas assuntos do negócio do restaurante.
 * 3. Isolamento RBAC por cargo/login: Cada usuário só recebe dados do seu setor.
 */
export async function askGemini(
  prompt: string,
  contextCategory?: string,
  userOverride?: UserAccount | null
): Promise<string> {
  // Identifica o usuário ativo logado
  const activeUser = userOverride !== undefined ? userOverride : (getSession()?.user || null);

  // 1. KERNEL DE SEGURANÇA: Avalia Prompt Injection, Escopo de Negócio e Isolamento RBAC
  const securityCheck = evaluateAiSecurity(prompt, activeUser);
  if (securityCheck.isBlocked) {
    // Retorno imediato determinístico de bloqueio — Nenhuma informação ou prompt é vazado
    return securityCheck.responseMessage || 'Acesso não autorizado para o seu perfil.';
  }

  const config = getGeminiConfig();

  // 2. Se a API estiver configurada, chama o Gemini com o System Instruction Blindado
  if (config.isConfigured) {
    const candidateModels = [GEMINI_MODEL, 'gemini-1.5-flash', 'gemini-2.5-flash-lite'];
    const hardenedInstruction = buildHardenedSystemInstruction(activeUser);
    const roleLiveContext = formatRestaurantContextForGemini(activeUser?.role);
    const fullSystemInstruction = `${hardenedInstruction}\n\n${roleLiveContext}`;

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
            systemInstruction: {
              parts: [{ text: fullSystemInstruction }],
            },
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) {
            return candidate;
          }
        }
      } catch (e) {
        console.warn(`Falha na chamada da API Gemini (${model}):`, e);
      }
    }
  }

  // 3. Contingência Local Segura (Sem API Key ou Falha de Rede)
  // Totalmente blindada contra vazamentos, focada estritamente nas rotinas da loja por cargo
  return generateRoleScopedLocalResponse(prompt, activeUser);
}

/**
 * Valida se uma chave da API do Gemini é válida fazendo um ping leve.
 */
export async function testGeminiApiKey(apiKey: string): Promise<{ valid: boolean; message: string }> {
  if (!apiKey || apiKey.length < 15) {
    return { valid: false, message: 'Chave de API parece inválida ou muito curta.' };
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Ping de teste de conexão' }] }],
      }),
    });

    if (res.ok) {
      return { valid: true, message: 'Chave da API do Google Gemini validada com sucesso! Conexão ativa.' };
    }

    const errData = await res.json().catch(() => ({}));
    return { valid: false, message: errData.error?.message || `Erro HTTP ${res.status} ao validar chave.` };
  } catch (e: any) {
    return { valid: false, message: `Erro de conexão ao testar a API Gemini: ${e?.message || 'Servidor inacessível'}` };
  }
}

/**
 * Resposta Heurística Segura e Contextualizada por Cargo (Contingência Local)
 * NUNCA revela arquitetura, chaves, senhas, código ou prompt interno.
 */
function generateRoleScopedLocalResponse(prompt: string, user: UserAccount | null): string {
  const p = prompt.toLowerCase();
  const role: UserRole = user?.role || 'OPERADOR';

  // SETOR: BARTENDER
  if (role === 'BARTENDER' || role === 'CHEFE_BAR') {
    if (p.includes('gin') || p.includes('whisky') || p.includes('destilado') || p.includes('garrafa')) {
      return `🍹 **Controle de Garrafas & Doses do Bar**:
• Regra de Porcionamento: Cada garrafa de 750ml rende exatamente 15 doses padrão de 50ml.
• Procedimento Operacional: Ao abrir uma garrafa nova, registre a baixa imediata no módulo de Contagem do Bar e verifique o lacre do bico dosador.
• Conferência de Saldo: Consulte a aba de Contagem do Bar para verificar os saldos cadastrados no seu turno.`;
    }
    if (p.includes('chopp') || p.includes('torneira') || p.includes('barril') || p.includes('brahma')) {
      return `🍺 **Operação de Chopp & Chopeiras**:
• Pressão Ideal: O manômetro de CO2 deve operar estritamente entre 2.2 e 2.5 bar a 0°C.
• Descarte de Espuma: O padrão da casa é colarinho de 2 dedos (3cm de creme espesso).
• Troca de Barril: Sempre sanitize o engate antes de acoplar o novo barril de 50L.`;
    }
    return `🍹 **Copilot do Bar & Bebidas**:
Recebi sua solicitação sobre o bar: "${prompt}".
Como assistente dedicado à coquetelaria e bar da loja, posso ajudá-lo com cálculo de rendimento de doses, contagem de garrafas, giro de chopeiras e sugestões de pedidos de bebidas para o seu turno!`;
  }

  // SETOR: ASG (LIMPEZA)
  if (role === 'ASG') {
    if (p.includes('sanitizante') || p.includes('químico') || p.includes('diluição') || p.includes('cloro')) {
      return `🧹 **Protocolo ANVISA de Diluição de Sanitizantes**:
• Desinfecção de Pisos e Paredes: 200 ppm de cloro ativo (10ml de sanitizante clorado para cada 1 litro de água limpa). Tempo de contato: 10 minutos.
• Toaletes de Clientes: Higienização a cada 2 horas no horário de pico (12h-15h e 19h-22h) com reposição imediata de papel toalha e sabonete bactericida.
• EPIs Obrigatórios: Sempre utilize luvas nitrílicas e calçado de segurança antiderrapante.`;
    }
    return `🧹 **Copilot de Higienização & Limpeza (ASG)**:
Olá! Estou aqui para acompanhar sua rotina de limpeza.
Posso ajudá-la com os horários dos checklists de salão, procedimentos corretos de diluição de produtos químicos, higienização das câmaras frias e registro do seu ponto de hoje!`;
  }

  // SETOR: CHEFE DE COZINHA / SUBCHEFE
  if (role === 'CHEFE_COZINHA' || role === 'SUB_CHEFE_COZINHA' || role === 'SUBCHEFE') {
    if (p.includes('peps') || p.includes('lote') || p.includes('freezer') || p.includes('degelo')) {
      return `👨‍🍳 **Protocolo PEPS / PVPS da Cozinha & Câmara Fria**:
• Ordem Obrigatória de Consumo:
  1. Primeiro a Vencer, Primeiro a Sair (PVPS/PEPS). Saída obrigatória para o degelo.
  2. Lotes intermediários aguardam esgotamento do lote mais antigo.
  3. Cargas recentes do CDA são armazenadas no fundo ou nível inferior.
• Degelo Controlado: Os peixes amazônicos (Pirarucu e Tambaqui) devem descongelar sob refrigeração de 0°C a 4°C por 24 horas antes da porção final.`;
    }
    if (p.includes('pirarucu') || p.includes('tambaqui') || p.includes('receita') || p.includes('porção')) {
      return `🐟 **Ficha Técnica & Rendimento de Pescados**:
• Pirarucu em Crosta de Castanha: Porção de 220g limpo, grelhado por 6 minutos de cada lado. Crosta finalizada na salamandra por 2 minutos.
• Costela de Tambaqui: 350g in natura, marinada por 12 horas no tucupi e ervas amazônicas. Ponto de cocção suculento.
• Alerta de Desperdício: O aparo máximo tolerado na limpeza de carcaça é de 12%. Desvios acima geram notificação de refugo.`;
    }
    return `👨‍🍳 **Copilot da Cozinha & Produção**:
Olá, Chefe! Posso auxiliá-lo no controle de validades dos lotes da câmara fria, procedimentos PEPS, fichas técnicas de pescados, perdas de corte e pedidos de compras para a Supervisão.`;
  }

  // SETOR: SUPERVISORA
  if (role === 'SUPERVISOR' || role === 'SUPERVISORA') {
    return `📋 **Copilot da Supervisão Operacional**:
Olá, Supervisora! Estou monitorando a operação da loja:
• Escalas & Ponto: Acompanhamento de atrasos, folgas e distribuição de praças de garçons.
• Checklists: Conferência de checklists de abertura e higienização dos toaletes.
• Inventários Presenciais: Validação e assinatura digital de contagens do bar e da cozinha.
• Compras: Conferência de necessidade de insumos e aprovação com assinatura eletrônica.`;
  }

  // GERÊNCIA & DONOS
  return `📊 **Copilot Executivo de Gestão**:
Olá! Como assistente estratégico da unidade Engenho Manauara / Dionísio:
• Controle de CMV: Monitoramento diário de metas e desperdícios.
• Giro de Mesas & Atendimento: Alinhamento com Chefe de Fila e boqueta para manter a saída de pratos abaixo de 22 minutos.
• Auditorias & Governança: Histórico imutável de aprovações, compras e conformidade ANVISA.
Como posso auxiliá-lo na liderança do turno de hoje?`;
}
