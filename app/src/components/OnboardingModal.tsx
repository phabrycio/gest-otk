import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Shield,
  X,
  Sparkles,
  Award,
  ChevronRight,
  Building2,
  AlertTriangle,
  Calendar,
  Layers,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'CRONOGRAMA' | 'DOSSIE' | 'TRILHA_30_DIAS' | 'CONTATOS'>('CRONOGRAMA');
  const [completedTasks, setCompletedTasks] = useState<string[]>([
    't-1',
    't-2',
  ]);

  if (!isOpen) return null;

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const tasksWeek1 = [
    { id: 't-1', text: 'Conhecer todos os membros da brigada (salão, cozinha e bar) pelo nome e turno' },
    { id: 't-2', text: 'Inspecionar as temperaturas matinais das câmaras de congelados (-18°C) e resfriados (+2°C)' },
    { id: 't-3', text: 'Acompanhar a conferência na doca de recebimento das carnes e peixes enviados pelo CDA' },
    { id: 't-4', text: 'Realizar o primeiro Briefing Matinal de 5 Minutos com a equipe antes do almoço' },
    { id: 't-5', text: 'Checar o fechamento de caixa e auditoria de insumos na aba de conciliação diária' },
  ];

  const tasksWeek2 = [
    { id: 't-6', text: 'Dominar o horário de corte do CDA (15h00) e transmissão da requisição preditiva' },
    { id: 't-7', text: 'Responder a 100% das avaliações do Google Maps em menos de 12 horas com a IA' },
    { id: 't-8', text: 'Monitorar os tempos de boqueta no Mapa de Mesas para garantir saída em até 22 min' },
    { id: 't-9', text: 'Auditar as sobras limpas que retornam ao freezer usando a câmera anti-fraude com QR Code' },
  ];

  const tasksWeek3 = [
    { id: 't-10', text: 'Identificar insumos com vencimento em até 48h e ativar combos com CMV controlado' },
    { id: 't-11', text: 'Conhecer os 10 clientes VIPs mais frequentes da Ponta Negra e seus hábitos de consumo' },
    { id: 't-12', text: 'Auditar cancelamentos de pratos após impressão para estancar desperdício invisível' },
    { id: 't-13', text: 'Gravar ou supervisionar a gravação do primeiro Reels de ASMR da Costela de Tambaqui' },
  ];

  const tasksWeek4 = [
    { id: 't-14', text: 'Atingir 100% nas 3 metas do Cockpit de Bonificação (Garantir R$ 2.000,00 no bolso)' },
    { id: 't-15', text: 'Apresentar o DRE consolidado do mês com margem líquida superior a 18% para a diretoria' },
    { id: 't-16', text: 'Operar a loja com autonomia completa, sem necessidade de intervenção da matriz' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Cabeçalho do Modal */}
        <div className="bg-gradient-to-r from-[#0a2e23] via-[#0f392b] to-[#0a2e23] text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Manual de Onboarding do Novo Gerente
                </h3>
                <span className="text-[10px] font-black uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  Ponta Negra
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Tudo o que você precisa saber para liderar o restaurante com excelência e visão de dono.
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

        {/* Sub-navegação do Onboarding */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('CRONOGRAMA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'CRONOGRAMA'
                ? 'bg-[#0a2e23] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Rotina Diária (Hora a Hora)</span>
          </button>
          <button
            onClick={() => setActiveTab('DOSSIE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'DOSSIE'
                ? 'bg-[#0a2e23] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Dossiê da Loja</span>
          </button>
          <button
            onClick={() => setActiveTab('TRILHA_30_DIAS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'TRILHA_30_DIAS'
                ? 'bg-[#0a2e23] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Trilha dos 30 Dias (Checklist)</span>
          </button>
          <button
            onClick={() => setActiveTab('CONTATOS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'CONTATOS'
                ? 'bg-[#0a2e23] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contatos de Emergência</span>
          </button>
        </div>

        {/* Conteúdo com Rolagem */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 text-xs flex-1">
          {/* ABA 1: ROTINA HORA A HORA */}
          {activeTab === 'CRONOGRAMA' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Dica de Ouro do Dono:</strong> Um restaurante de shopping de alta classe não tolera improviso. Se você dominar esses 6 momentos-chave do dia, sua operação fluirá sem estresse e sua bonificação de R$ 2.000 estará garantida.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">09h30 - 10h15 &bull; Abertura & Verificação de Câmaras</span>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">Matinal</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Checar as câmaras frias no app (-18°C e +2°C). Inspecionar salão, aroma do ambiente e nível de gelo do bar.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">11h00 - 11h15 &bull; Briefing de 5 Minutos da Brigada</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Motivação</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Reunir garçons e cozinheiros. Elogiar o ranking de vendas de ontem, conferir a <strong>Lista 86</strong> (itens esgotados) e direcionar o prato do dia.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">11h30 - 15h00 &bull; Pico do Almoço (Postura de Anfitrião)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Show Time</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Ficar visível no salão, saudar clientes VIPs da Ponta Negra, monitorar tempo de saída de pratos ($\le 22$ min no mapa de mesas).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-rose-400 bg-rose-50/40 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950 text-sm">15h00 - 15h30 &bull; JANELA CRÍTICA DO CDA (Corte às 15h)</span>
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase">Não Esquecer</span>
                  </div>
                  <p className="text-rose-900 text-[11px] leading-relaxed">
                    Abrir a aba <strong>Suprimentos $\rightarrow$ Hub CDA</strong>, revisar o pedido preditivo sugerido pela IA e aprovar antes das 15h00 em ponto.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">17h30 - 21h30 &bull; Happy Hour & Pico do Jantar</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">Vendas</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Foco no giro de mesas, chopps e petiscos. Cobrar upselling de sobremesas regionais para elevar o ticket médio.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">22h00 - 23h30 &bull; Fechamento Cego, Auditoria & DRE</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">Conferência</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Conferir caixa cego, conciliar saídas de insumos vs. vendas do PDV (aba Rastreio) e checar o lucro líquido real do dia no DRE.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: DOSSIÊ DA LOJA */}
          {activeTab === 'DOSSIE' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Capacidade & Ambiente</span>
                  <strong className="text-sm text-slate-900 block mt-1">160 Lugares Simultâneos</strong>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Salão principal climatizado a 22°C, varanda com vista da orla do Rio Negro e área de eventos familiares.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Perfil do Cliente</span>
                  <strong className="text-sm text-slate-900 block mt-1">Classes A & B (Alta Renda)</strong>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Moradores de condomínios da Ponta Negra (Alphaville, Jardim das Américas), executivos e turistas gastronômicos.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Fator Climático Manaus</span>
                  <strong className="text-sm text-slate-900 block mt-1">Calor Extremo & Chuva na Orla</strong>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Quando chove à tarde na praia da Ponta Negra, os clientes sobem para o shopping. Ative o post do chopp!
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Carros-Chefe da Cozinha</span>
                  <strong className="text-sm text-slate-900 block mt-1">Tambaqui na Brasa & Pirarucu</strong>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Costela de Tambaqui com farinha de Uarini e Lombo de Pirarucu de Manejo em Crosta de Castanha (Curva A).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: TRILHA DOS 30 DIAS */}
          {activeTab === 'TRILHA_30_DIAS' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-[11px]">
                Marque cada marco conforme você for concluindo durante seus primeiros 30 dias como Gerente Geral:
              </p>

              {/* Semana 1 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Semana 1: Imersão, Equipe & Inspeções Sanitárias
                </h4>
                <div className="space-y-1.5">
                  {tasksWeek1.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 bg-white cursor-pointer hover:bg-slate-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={completedTasks.includes(task.id)}
                        onChange={() => {}}
                        className="rounded text-emerald-800 focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-[11px] ${completedTasks.includes(task.id) ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semana 2 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Semana 2: Domínio do CDA, Tempos de Mesa & NPS
                </h4>
                <div className="space-y-1.5">
                  {tasksWeek2.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 bg-white cursor-pointer hover:bg-slate-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={completedTasks.includes(task.id)}
                        onChange={() => {}}
                        className="rounded text-emerald-800 focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-[11px] ${completedTasks.includes(task.id) ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semana 3 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  Semana 3: Otimização de CMV, Prevenção de Perdas & Marketing
                </h4>
                <div className="space-y-1.5">
                  {tasksWeek3.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 bg-white cursor-pointer hover:bg-slate-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={completedTasks.includes(task.id)}
                        onChange={() => {}}
                        className="rounded text-emerald-800 focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-[11px] ${completedTasks.includes(task.id) ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semana 4 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  Semana 4: Autonomia Total & Bônus de R$ 2.000 Assegurado
                </h4>
                <div className="space-y-1.5">
                  {tasksWeek4.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2.5 bg-white cursor-pointer hover:bg-slate-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={completedTasks.includes(task.id)}
                        onChange={() => {}}
                        className="rounded text-emerald-800 focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-[11px] ${completedTasks.includes(task.id) ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABA 4: CONTATOS DE EMERGÊNCIA */}
          {activeTab === 'CONTATOS' && (
            <div className="space-y-3">
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 text-xs block">CDA Grupo Engenho (Separação & Doca)</strong>
                    <span className="text-[11px] text-slate-500">Logística de hortifrúti, carnes e insumos secos</span>
                  </div>
                  <a href="tel:92981114001" className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white font-bold text-[11px]">
                    (92) 98111-4001
                  </a>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 text-xs block">Plantão Técnico Refrigeração (24 Horas)</strong>
                    <span className="text-[11px] text-slate-500">Câmaras frigoríficas, máquina de gelo e chopeiras</span>
                  </div>
                  <a href="tel:92984009911" className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-[11px]">
                    (92) 98400-9911
                  </a>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 text-xs block">Administração Shopping Ponta Negra</strong>
                    <span className="text-[11px] text-slate-500">Acesso à doca de carga, ar-condicionado central e bombeiros</span>
                  </div>
                  <span className="font-mono text-slate-700 font-bold text-xs">Ramal 2101 / 2109</span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 text-xs block">RH & Departamento Pessoal Matriz</strong>
                    <span className="text-[11px] text-slate-500">Contratações, atestados médicos e folgas legais</span>
                  </div>
                  <a href="tel:9236448800" className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-[11px]">
                    (92) 3644-8800
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Progresso: <strong>{completedTasks.length}</strong> de 16 tarefas da trilha concluídas
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0a2e23] hover:bg-[#0f392b] text-white text-xs font-bold transition-all shadow-sm"
          >
            Entendido, ir para a Operação
          </button>
        </div>
      </div>
    </div>
  );
};
