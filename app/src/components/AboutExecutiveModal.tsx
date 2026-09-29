import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Zap,
  DollarSign,
  Copy,
  X,
  Sparkles,
  Layers,
  Award,
  CheckCircle2,
  ChevronRight,
  PieChart,
  Target,
} from 'lucide-react';

interface AboutExecutiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutExecutiveModal: React.FC<AboutExecutiveModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pitchScriptText = `PITCH EXECUTIVO PARA A DIRETORIA DO GRUPO ENGENHO:
"Senhores Diretores,
Hoje nós administramos nossos restaurantes com um abismo de informação entre o Centro de Distribuição (CDA) e a ponta física da loja. Nós só descobrimos se tivemos lucro ou prejuízo 15 dias após o fechamento do mês, quando o contador entrega os relatórios. Se houve desvio de peixe nobre ou perda de insumos por validade no dia 05, nós só ficamos sabendo 30 dias depois!

Para resolver isso, desenvolvemos na unidade Ponta Negra a plataforma ENGENHO GESTOR 360.
Ela não é mais um ERP burocrático; ela é o Cockpit de Comando do Gerente com Visão de Dono.

O QUE ELA FAZ QUE NENHUM CONCORRENTE TEM:
1. RASTREABILIDADE COM CÂMERA ANTI-FRAUDE: Bloqueia a galeria do smartphone dos funcionários. Eles só podem tirar foto física em tempo real, e a nossa IA detecta se tentarem fotografar a tela de outro celular. No fechamento, o app confronta: 'Saíram 5 costelas do freezer, venderam 1 e voltaram 2: faltam 2 porções (R$ 77 de prejuízo apurado na hora)'.
2. MARKETING ANTI-DESPERDÍCIO (CMV DINÂMICO): Quando um insumo como o Chopp vai vencer em 48h, a IA nunca dá desconto burro. Ela cruza com a Ficha Técnica e monta um combo de alto markup (Chopp + Dadinho de Tapioca), escoando 100% do lote com margem bruta de R$ 26,70 por venda e CMV em 31%.
3. DRE OPERACIONAL DIÁRIO AO VIVO: A cada mesa fechada ou carga diária, o app calcula na hora o Faturamento Bruto, CMV Real e a Margem Operacional de Loja (+R$ 16.509,00 de margem de contribuição), enquanto despesas corporativas (impostos, RH/folha, aluguel e utilidades) ficam sob gestão da seção administrativa central.
4. REELS VIRAIS BASEADOS NO ALGORITMO: Roteiros segundo a segundo de ASMR e Storytelling humano que trazem famílias do Alphaville e Ponta Negra sem depender de agências lentas.

O IMPACTO FINANCEIRO NA NOSSA REDE:
- Economia direta de R$ 22.400,00 por mês por loja (redução de desperdício, controle de cancelamentos e compras preditivas do CDA).
- Isso representa mais de R$ 268.000,00 por ano por unidade.
- Em 5 restaurantes da rede, estamos falando de MAIS DE R$ 1,3 MILHÃO DE REAIS DE LUCRO LÍQUIDO EXTRA no EBITDA da holding todo ano!

Minha proposta é usar a Ponta Negra como unidade piloto este mês e, comprovados os números, padronizar o Tk Gestão e Tecnologia em todas as casas do Grupo Engenho."`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(pitchScriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Cabeçalho do Pitch Executivo */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Sobre o Tk Gestão e Tecnologia (Apresentação Diretoria)
                </h3>
                <span className="text-[10px] font-black uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  Pitch Corporativo
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                O que este app faz pelo Grupo Engenho e como apresentar aos diretores e sócios.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal com Rolagem */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 text-xs flex-1">
          {/* O Grande Problema da Rede */}
          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 text-rose-950 space-y-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-rose-800">
              <Target className="w-4 h-4 text-rose-600" />
              O Diagnóstico: Por que redes de restaurantes perdem dinheiro silenciosamente?
            </h4>
            <p className="text-[11px] leading-relaxed text-rose-900/90">
              A maioria das redes sofre com a falta de sincronia entre o CDA e as lojas físicas: insumos nobres vencendo na geladeira sem o gerente notar, garçons cancelando pratos na boqueta sem controle, fotos falsas de controle sanitário e relatórios contábeis que só chegam 15 dias após o mês acabar.
            </p>
          </div>

          {/* O Que É o Tk Gestão e Tecnologia */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              A Solução: Um Cockpit de Gestão com IA e Visão de Dono
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-700">
              O <strong>Tk Gestão e Tecnologia</strong> transforma o gerente de loja em um administrador de alta performance. Ele centraliza em um único aplicativo móvel: controle de ponto de equilíbrio diário (DRE), prevenção de perdas, IA para escoamento inteligente de estoque e máquina de marketing de alta conversão.
            </p>
          </div>

          {/* Os 4 Pilares de ROI para Apresentar aos Diretores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <strong className="text-slate-900 text-xs">Câmera Anti-Fraude com IA</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Bloqueia a galeria do celular. Obriga fotos físicas em tempo real de notas fiscais e porções térmicas com detecção de efeito moiré (foto de telas).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-600" />
                <strong className="text-slate-900 text-xs">Combos Anti-Desperdício (CMV)</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Cruza produtos com validade próxima com fichas técnicas de alto markup. Zera o descarte sem queimar margem.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <strong className="text-slate-900 text-xs">DRE Operacional de Loja ao Vivo</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                O gerente e os diretores acompanham a margem operacional de loja ao vivo (Vendas vs CMV), enquanto custos corporativos são geridos pela holding administrativa.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <strong className="text-slate-900 text-xs">Reels Virais com Gatilho Climático</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Roteiros de alta conversão para o algoritmo do Instagram Manaus, com disparo automático quando chove na Ponta Negra.
              </p>
            </div>
          </div>

          {/* Projeção de Retorno Financeiro para a Rede */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
              Impacto no EBITDA do Grupo Engenho (Rede com 5 Lojas)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 block">Economia por Loja</span>
                <span className="text-base font-black text-emerald-400">R$ 22.400 /mês</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 block">Ganho Anual por Loja</span>
                <span className="text-base font-black text-emerald-400">R$ 268.800 /ano</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block">Ganho na Rede (5 Lojas)</span>
                <span className="text-base font-black text-amber-400">+ R$ 1,34 Milhão/ano</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé com Ação de Copiar Roteiro de Fala */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500 font-medium text-center sm:text-left">
            Use este roteiro para conduzir a reunião de apresentação aos diretores.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyPitch}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#0a2e23] hover:bg-[#0f392b] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>{copied ? 'Roteiro Copiado!' : 'Copiar Roteiro de Fala para a Diretoria'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
