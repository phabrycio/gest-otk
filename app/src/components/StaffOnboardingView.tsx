import React, { useState } from 'react';
import {
  Users,
  Camera,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  AlertTriangle,
  Upload,
  FileText,
  Utensils,
  Flame,
  Wine,
  Sparkle,
  Smile,
  Zap,
  CheckSquare,
  BookOpen,
} from 'lucide-react';
import { StaffRoleOnboarding, PopScanResult } from '../types';

export const StaffOnboardingView: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-garcom');
  const [activeSubTab, setActiveSubTab] = useState<'OBRIGACOES_DIARIAS' | 'TRILHA_7_DIAS' | 'REGRAS_OURO'>('OBRIGACOES_DIARIAS');
  const [showScanModal, setShowScanModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [recentScans, setRecentScans] = useState<PopScanResult[]>([
    {
      id: 'scan-01',
      popTitle: 'POP-SAL-04: Protocolo de Hospitalidade & Atendimento de Mesa',
      detectedRole: 'Garçom de Salão',
      extractedObligationsCount: 8,
      confidenceScore: 98,
      timestamp: 'Hoje às 09:15',
      summary: 'Reconhecidas regras de abordagem em 90s, protocolo de retirada de pratos e upselling de sobremesas.',
    },
    {
      id: 'scan-02',
      popTitle: 'POP-COZ-08: Padrão de Grelha, Ponto de Pescados & Tempo de Boqueta',
      detectedRole: 'Cozinheiro de Praça (Grelha)',
      extractedObligationsCount: 6,
      confidenceScore: 96,
      timestamp: 'Ontem às 16:40',
      summary: 'Mapeadas temperaturas de carvão, corte da Costela de Tambaqui (400g) e tempo de boqueta <= 18min.',
    },
  ]);

  // Funções / Cargos cadastrados
  const [roles, setRoles] = useState<StaffRoleOnboarding[]>([
    {
      id: 'role-garcom',
      roleName: 'Garçom de Salão',
      department: 'SALAO',
      iconName: 'Utensils',
      mission:
        'Atuar como anfitrião e consultor gastronômico da culinária amazônica, garantindo atendimento ágil, caloroso e focado em upselling para famílias da classe A/B.',
      goldenRules: [
        'Abordar a mesa em no máximo 90 segundos após o cliente sentar.',
        'Jamais passar por uma mesa com pratos vazios sem recolhê-los ("mãos cheias ao voltar").',
        'Repetir todo o pedido em voz alta para evitar retrabalho da cozinha.',
        'Oferecer sempre a sobremesa regional (Cartola) e o café amazônico antes de trazer a conta.',
      ],
      requiredEpis: ['Sapato social antiderrapante', 'Avental de sarja limpo', 'Abridor de garrafas', 'Bloco/Tablet de pedidos'],
      sourcePopCode: 'POP-SAL-04 (Matriz Grupo Engenho)',
      sevenDayTrack: [
        { day: 1, title: 'Cultura & Postura', focus: 'Uniforme, apresentação pessoal, rota de fuga e organograma da loja', tasks: ['Apresentar-se ao Maître e Chef', 'Conhecer setores do salão e banheiros', 'Estudar as 6 entradas do cardápio'] },
        { day: 2, title: 'Mise-en-place & Bandeja', focus: 'Decoração de mesas, limpeza de galheteiros e manuseio seguro de bandeja', tasks: ['Aprender montagem padrão de taças e talheres', 'Praticar equilíbrio com 4 copos cheios', 'Abastecer saleiros e pimentas'] },
        { day: 3, title: 'Domínio dos Peixes & Carnes', focus: 'Ingredientes, tempo de preparo e acompanhamentos dos pratos principais', tasks: ['Provar e entender a Costela de Tambaqui', 'Estudar o Pirarucu de Manejo', 'Conhecer os ingredientes do Baião de Dois'] },
        { day: 4, title: 'Bebidas, Chopp & Drinks', focus: 'Temperaturas, tipos de copos e coquetelaria regional com frutas amazônicas', tasks: ['Aprender a servir Chopp com colarinho de 2 dedos', 'Conhecer caipirinhas de cupuaçu e taperebá', 'Memorizar a carta de vinhos'] },
        { day: 5, title: 'Atendimento Prático com Sombra', focus: 'Acompanhar garçom experiente nas mesas mais concorridas', tasks: ['Executar abordagem inicial em 90s', 'Digitar pedidos no tablet sem erro', 'Registrar solicitações especiais na comanda'] },
        { day: 6, title: 'Técnicas de Upselling', focus: 'Como sugerir sobremesas e entradas sem ser insistente', tasks: ['Praticar a sugestão dos Dadinhos de Tapioca', 'Oferecer Cartola Amazônica após o prato', 'Acumular primeiros pontos no ranking'] },
        { day: 7, title: 'Certificação & Autonomia', focus: 'Turno autônomo completo com supervisão final do gerente', tasks: ['Operar praça designada com 5 mesas', 'Conferir contas e formas de pagamento', 'Receber feedback do Gerente Geral'] },
      ],
      dailyObligations: [
        { id: 'ob-g1', moment: 'ABERTURA', task: 'Inspecionar e limpar todos os galheteiros, saleiros e pimentas das mesas', standardTime: '10h30', criticalRule: 'Galheteiros engordurados geram má impressão imediata', isMandatory: true },
        { id: 'ob-g2', moment: 'ABERTURA', task: 'Conferir mise-en-place de talheres polidos, taças e guardanapos de tecido', standardTime: '11h00', criticalRule: 'Usar álcool 70% e pano de microfibra sem fiapos', isMandatory: true },
        { id: 'ob-g3', moment: 'PICO', task: 'Manter tempo de primeira abordagem abaixo de 90 segundos', standardTime: '12h00 - 14h30', criticalRule: 'Oferecer água da casa ou chopp trincando de imediato', isMandatory: true },
        { id: 'ob-g4', moment: 'PICO', task: 'Retirar pratos vazios em no máximo 2 minutos após o término da refeição', standardTime: 'Durante o consumo', criticalRule: 'Mesa limpa convida à sobremesa e ao café', isMandatory: true },
        { id: 'ob-g5', moment: 'FECHAMENTO', task: 'Remover toalhas sujas, varrer praça e recolher cardápios físicos', standardTime: '15h30 / 22h30', criticalRule: 'Deixar salão pronto para o próximo turno', isMandatory: true },
      ],
    },
    {
      id: 'role-cozinheiro',
      roleName: 'Cozinheiro de Praça (Grelha & Pescados)',
      department: 'COZINHA',
      iconName: 'Flame',
      mission:
        'Garantir o ponto perfeito, temperatura e apresentação impecável dos pescados amazônicos e carnes na brasa, cumprindo o tempo limite de boqueta de 18 a 22 minutos.',
      goldenRules: [
        'Nunca colocar carne ou peixe na grelha fria; esperar a brasa incandescer sem labareda alta.',
        'Respeitar rigorosamente a pesagem padrão: Costela de Tambaqui 400g / Pirarucu 300g.',
        'Jamais utilizar tábua de carne crua para cortar alimentos prontos (risco de contaminação cruzada).',
        'Higienizar a espátula e o termômetro a cada troca de insumo.',
      ],
      requiredEpis: ['Dólmã térmico de algodão', 'Avental impermeável', 'Sapato antiderrapante fechado', 'Rede de cabelo / Touca'],
      sourcePopCode: 'POP-COZ-08 (Matriz Grupo Engenho)',
      sevenDayTrack: [
        { day: 1, title: 'Segurança & Boas Práticas', focus: 'Uso de facas, regras da ANVISA e rotação térmica de câmaras', tasks: ['Apresentação à equipe de cozinha', 'Regras de higienização de mãos', 'Mapeamento de extintores e saídas'] },
        { day: 2, title: 'Manejo & Corte dos Peixes', focus: 'Anatomia do Tambaqui e Pirarucu e padrão de desossa', tasks: ['Porcionar costelas no peso exato de 400g', 'Limpar lombo de pirarucu sem quebrar fibras', 'Embalar e etiquetar lotes no freezer'] },
        { day: 3, title: 'A Brasa Perfeita', focus: 'Manejo do carvão, altura de grelha e zonas de calor direto/indireto', tasks: ['Acender braseiro sem uso de combustível tóxico', 'Identificar ponto de brasa incandescente', 'Selar carne de sol sem ressecar'] },
        { day: 4, title: 'Temperos & Guarnições', focus: 'Farofa de Uarini crocante, tucupi aveludado e vinagrete de cheiro', tasks: ['Preparar marinada de chicória e limão', 'Fritar banana pacovã caramelizada', 'Finalizar o Baião cremoso com queijo'] },
        { day: 5, title: 'Ritmo de Boqueta & Sincronia', focus: 'Sincronizar a saída do peixe com as guarnições da praça de caldos', tasks: ['Acompanhar pedidos no visor KDS', 'Manter saída em menos de 22 minutos', 'Montar travessas familiares com padrão visual'] },
        { day: 6, title: 'Pico Real Supervisionado', focus: 'Assumir a grelha durante 2 horas com o Sous-Chef ao lado', tasks: ['Atender 20 pedidos de pratos sem devolução', 'Controlar quebras e desperdício de corte', 'Manter bancada de inox limpa'] },
        { day: 7, title: 'Avaliação & Autonomia', focus: 'Turno solo na praça de peixes com auditoria sensorial do Chef', tasks: ['Entregar pratos com nota máxima de temperatura', 'Fechar a praça com checklist 100% preenchido', 'Receber certificação do cargo'] },
      ],
      dailyObligations: [
        { id: 'ob-c1', moment: 'ABERTURA', task: 'Acender o braseiro e checar a temperatura da câmara de resfriamento (+2°C)', standardTime: '10h15', criticalRule: 'Peixe nunca deve ficar fora de refrigeração antes do preparo', isMandatory: true },
        { id: 'ob-c2', moment: 'ABERTURA', task: 'Conferir mise-en-place de porções pesadas e temperos frescos picados', standardTime: '11h00', criticalRule: 'Falta de porção no pico causa atraso de 30 minutos no salão', isMandatory: true },
        { id: 'ob-c3', moment: 'PICO', task: 'Manter tempo de boqueta de pratos individuais <= 18min e família <= 22min', standardTime: '12h00 - 14h30', criticalRule: 'Atrasos no almoço executivo geram cancelamentos imediatos', isMandatory: true },
        { id: 'ob-c4', moment: 'FECHAMENTO', task: 'Limpar grelha de carvão a quente com escova de cerdas e desengordurante', standardTime: '15h30 / 23h00', criticalRule: 'Grelha carbonizada amarga os pratos do dia seguinte', isMandatory: true },
      ],
    },
    {
      id: 'role-steward',
      roleName: 'Steward / Auxiliar de Higienização',
      department: 'HIGIENIZACAO',
      iconName: 'Sparkle',
      mission:
        'Ser o guardião invisível da segurança sanitária e da rotação limpa de louças, panelas e talheres, garantindo zero ruptura de pratos no salão.',
      goldenRules: [
        'Trocar a água da máquina de lavar louças a cada 2 horas durante o pico.',
        'Sanitizar talheres em solução clorada a 200ppm com secagem natural ao ar (nunca usar pano).',
        'Utilizar luvas térmicas para manusear panelas quentes e luvas de borracha para químicos.',
      ],
      requiredEpis: ['Avental de PVC reforçado', 'Bota de borracha impermeável', 'Luvas de cano longo', 'Óculos de proteção'],
      sourcePopCode: 'POP-HIG-02 (Matriz Grupo Engenho)',
      sevenDayTrack: [
        { day: 1, title: 'Segurança Química & Máquina', focus: 'Diluição de detergentes industriais e secantes', tasks: ['Aprender dosagem da máquina Hobart', 'Conhecer fichas de segurança dos produtos', 'Uso obrigatório de EPIs'] },
        { day: 2, title: 'Circuito Sujo vs. Circuito Limpo', focus: 'Fluxo unidirecional para evitar contaminação de louças lavadas', tasks: ['Separar descarte de restos orgânicos', 'Remover resíduos antes da lavagem mecânica', 'Organizar gavetas de pratos por tamanho'] },
        { day: 3, title: 'Polimento & Sanitização de Talheres', focus: 'Brilho impecável de garfos, facas e taças de chopp', tasks: ['Imersão em sanitizante químico', 'Polimento com álcool e luz branca', 'Separar talheres riscados ou tortos'] },
        { day: 4, title: 'Lavagem de Panelas Pesadas', focus: 'Desengorduramento de caçarolas de barro e tachos de ferro', tasks: ['Remoção de crostas sem danificar o barro', 'Uso correto de fibras sintéticas', 'Organização no estrado de panelas'] },
        { day: 5, title: 'Gestão de Resíduos & Lixeiras', focus: 'Descarte e separação de recicláveis e lixo orgânico', tasks: ['Manter lixeiras com pedal funcionando', 'Substituir sacos com 70% de capacidade', 'Higienizar tambores de lixo externos'] },
        { day: 6, title: 'Ritmo de Pico', focus: 'Garantir que a boqueta nunca fique sem travessas limpas', tasks: ['Manter fluxo contínuo sem acúmulo de pilhas', 'Abastecer aparadores do salão a cada 30 minutos', 'Secagem rápida de travessas'] },
        { day: 7, title: 'Limpeza Geral & Certificação', focus: 'Desinfecção de ralos, pisos e paredes da lavagem', tasks: ['Aplicar cloro nos ralos da cozinha', 'Limpar filtros da máquina de lavar', 'Certificação pelo Chefe de Cozinha'] },
      ],
      dailyObligations: [
        { id: 'ob-s1', moment: 'ABERTURA', task: 'Ligar a máquina de louças e conferir nível de detergente e secante químico', standardTime: '10h15', criticalRule: 'Máquina sem secante deixa manchas esbranquiçadas nos copos', isMandatory: true },
        { id: 'ob-s2', moment: 'PICO', task: 'Trocar a água do tanque da máquina de lavar para manter água transparente', standardTime: '13h00', criticalRule: 'Água saturada de gordura não higieniza os pratos com eficácia', isMandatory: true },
        { id: 'ob-s3', moment: 'FECHAMENTO', task: 'Desmontar braços de lavagem da máquina e limpar o filtro de resíduos', standardTime: '15h45 / 23h15', criticalRule: 'Evita entupimento da bomba de drenagem', isMandatory: true },
      ],
    },
    {
      id: 'role-bartender',
      roleName: 'Bartender / Barman',
      department: 'BAR',
      iconName: 'Wine',
      mission:
        'Entregar chopps trincando em até 3 minutos e coquetéis artesanais amazônicos equilibrados, com apresentação visual sofisticada.',
      goldenRules: [
        'Purgar a chopeira no início do turno para eliminar resíduos de espuma velha.',
        'Servir chopp exclusivamente em canecas congeladas a -12°C com colarinho de 2 dedos.',
        'Medir xaropes e destilados no dosador (jigger); nunca colocar bebida "no olho".',
      ],
      requiredEpis: ['Avental de couro/sarja', 'Sapato antiderrapante', 'Tapete ergonômico de bar'],
      sourcePopCode: 'POP-BAR-01 (Matriz Grupo Engenho)',
      sevenDayTrack: [
        { day: 1, title: 'Equipamentos & Chopeira', focus: 'Pressão de CO2, regulagem de temperatura e troca de barril', tasks: ['Conhecer engate rápido de barril', 'Aferir termômetro da serpentina', 'Manter canecas no freezer'] },
        { day: 2, title: 'Insumos Regionais do Bar', focus: 'Manipulação de polpas amazônicas (cupuaçu, açaí, taperebá)', tasks: ['Preparar xarope artesanal de açúcar', 'Cortar guarnições frescas de limão e hortelã', 'Provar e calibrar acidez das frutas'] },
        { day: 3, title: 'Coquetéis Clássicos & Regionais', focus: 'Fichas técnicas das Caipirinhas da Amazônia e drinks autorais', tasks: ['Executar Caipirinha de Cupuaçu perfeita', 'Preparar Gin Tônica Amazônica com Jambu', 'Memorizar copos adequados para cada drink'] },
        { day: 4, title: 'Velocidade & Tempo de Saída', focus: 'Chopp na mesa em $\le 3$ minutos após comando do garçom', tasks: ['Organizar estações de trabalho rápidas', 'Priorizar saída de chopps para abrir mesas', 'Manter balcão seco e brilhando'] },
        { day: 5, title: 'Controle de Perdas de Chopp', focus: 'Evitar excesso de espuma na sangria de troca de barril', tasks: ['Sangria máxima de 1 caneca por barril novo', 'Registrar litragem consumida no sistema', 'Checar mangueiras de gás'] },
        { day: 6, title: 'Atendimento do Balcão de Espera', focus: 'Encantar clientes aguardando mesa na recepção', tasks: ['Sugerir petiscos enquanto a mesa é liberada', 'Demonstrar hospitalidade e simpatia', 'Conectar com a Hostess'] },
        { day: 7, title: 'Fechamento & Auditoria de Garrafas', focus: 'Contagem de destilados nobres e limpeza de bicos dosadores', tasks: ['Lavar bicos de chopeira com sanitizante', 'Travar freezer de canecas', 'Certificação pelo Gerente de Loja'] },
      ],
      dailyObligations: [
        { id: 'ob-b1', moment: 'ABERTURA', task: 'Purgar a linha da chopeira e aferir se o fluxo de chopp sai a 0°C', standardTime: '10h30', criticalRule: 'Chopp morno arruina a experiência do cliente', isMandatory: true },
        { id: 'ob-b2', moment: 'PICO', task: 'Liberar chopps em no máximo 3 minutos após o pedido ser impresso', standardTime: '12h00 - 14h30', criticalRule: 'Bebida é o primeiro item que deve chegar à mesa', isMandatory: true },
        { id: 'ob-b3', moment: 'FECHAMENTO', task: 'Sanitizar bicos da chopeira e registrar o saldo de barris ativos', standardTime: '15h30 / 22h45', criticalRule: 'Evita azedamento do chopp dentro das torneiras', isMandatory: true },
      ],
    },
    {
      id: 'role-hostess',
      roleName: 'Hostess / Recepcionista',
      department: 'SALAO',
      iconName: 'Smile',
      mission:
        'Ser o primeiro sorriso e a primeira impressão de acolhimento do restaurante, gerenciando a fila de espera e VIPs com graciosidade.',
      goldenRules: [
        'Cumprimentar todo cliente que se aproxima em no máximo 5 segundos com sorriso no rosto.',
        'Identificar moradores dos condomínios nobres da Ponta Negra e avisar o Gerente Geral.',
        'Informar tempos de espera realistas (nunca subestimar para não gerar frustração).',
      ],
      requiredEpis: ['Traje corporativo elegante', 'Sapato de salto confortável / sapatilha social'],
      sourcePopCode: 'POP-REC-01 (Matriz Grupo Engenho)',
      sevenDayTrack: [
        { day: 1, title: 'Postura & Boas-Vindas', focus: 'Tom de voz, postura corporal e frases de acolhimento', tasks: ['Treinar saudação padrão Engenho', 'Conhecer mapa de mesas do salão e varanda', 'Apresentação à equipe de salão'] },
        { day: 2, title: 'Gestão da Fila de Espera', focus: 'Uso do sistema de fila digital e envio de SMS/WhatsApp', tasks: ['Cadastrar clientes na fila sem erros', 'Calcular tempo de giro de mesas por capacidade', 'Oferecer água aromatizada aos clientes na fila'] },
        { day: 3, title: 'Clientes VIPs da Ponta Negra', focus: 'Reconhecimento de moradores do Alphaville e habitués', tasks: ['Estudar lista de 30 clientes VIPs no app', 'Identificar mesas favoritas (ex: Mesa 12 na varanda)', 'Avisar o Gerente quando o VIP chegar'] },
        { day: 4, title: 'Condução à Mesa com Charme', focus: 'Acompanhar o cliente até a mesa e acomodar a família', tasks: ['Puxar a cadeira para idosos e gestantes', 'Entregar cardápios físicos higienizados', 'Apresentar o garçom da praça pelo nome'] },
        { day: 5, title: 'Gerenciamento de Reclamações na Porta', focus: 'Como acalmar clientes impacientes no pico de domingo', tasks: ['Oferecer chopp cortesia na espera longa', 'Manter calma e postura acolhedora', 'Acionar o gerente se a fila ultrapassar 40 minutos'] },
        { day: 6, title: 'Despedida & Pós-Venda', focus: 'Agradecer a visita na saída e convidar para o retorno', tasks: ['Perguntar como foi a experiência', 'Orientar clientes sobre estacionamento do shopping', 'Coletar elogios para o Google Maps'] },
        { day: 7, title: 'Autonomia & Certificação', focus: 'Turno de domingo completo operando a recepção da loja', tasks: ['Controlar fluxo de 160 lugares com precisão', 'Zerar queixas de fila de espera', 'Receber certificação da gerência'] },
      ],
      dailyObligations: [
        { id: 'ob-h1', moment: 'ABERTURA', task: 'Higienizar e alinhar todos os cardápios físicos e checar tablet de reservas', standardTime: '10h45', criticalRule: 'Cardápio sujo ou colado é inaceitável em restaurante A/B', isMandatory: true },
        { id: 'ob-h2', moment: 'PICO', task: 'Receber e cadastrar grupos na fila informando tempo preciso de espera', standardTime: '12h00 - 14h30', criticalRule: 'Distribuir clientes equilibradamente entre as praças dos garçons', isMandatory: true },
        { id: 'ob-h3', moment: 'FECHAMENTO', task: 'Totalizar clientes atendidos, tempos médios de espera e fechar o livro', standardTime: '15h30 / 23h00', criticalRule: 'Gerar relatório de giro para a reunião de turno', isMandatory: true },
      ],
    },
  ]);

  const activeRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleSimulateScanPop = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowScanModal(false);

      const newScan: PopScanResult = {
        id: `scan-${Date.now()}`,
        popTitle: 'POP-SAL-09: Protocolo de Montagem e Desmontagem de Mesa',
        detectedRole: 'Garçom de Salão',
        extractedObligationsCount: 4,
        confidenceScore: 99,
        timestamp: 'Agora mesmo',
        summary: 'A IA Gemini leu a foto do documento impresso, identificou o cargo "Garçom" e adicionou 4 obrigações operacionais ao checklist diário.',
      };

      setRecentScans((prev) => [newScan, ...prev]);
      alert('🎉 Foto do POP processada com sucesso pela IA! As tarefas e obrigações foram atualizadas automaticamente para o cargo de Garçom.');
    }, 1600);
  };

  return (
    <div className="space-y-4">
      {/* Topo do Módulo */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-slate-900">Onboarding da Brigada & Ingestão de POPs por IA</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Trilhas de 7 dias e obrigações diárias de cada cargo geradas automaticamente a partir das fotos dos manuais da matriz.
          </p>
        </div>

        {/* Botão de Leitura de POPs com IA */}
        <button
          onClick={() => setShowScanModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Camera className="w-4 h-4 text-amber-400" />
          <span>Escanear Foto de POP com IA</span>
        </button>
      </div>

      {/* Seletor de Cargos / Funções */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {roles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-800 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-800'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                  {role.department}
                </span>
                <strong className="text-xs font-bold text-slate-900 block line-clamp-1">{role.roleName}</strong>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold mt-2 block">
                {role.dailyObligations.length} tarefas &bull; 7 dias
              </span>
            </button>
          );
        })}
      </div>

      {/* DETALHAMENTO DO CARGO SELECIONADO */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Cabeçalho do Cargo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{activeRole.roleName}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                {activeRole.sourcePopCode}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              <strong>Missão:</strong> {activeRole.mission}
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('OBRIGACOES_DIARIAS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'OBRIGACOES_DIARIAS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Obrigações Diárias
            </button>
            <button
              onClick={() => setActiveSubTab('TRILHA_7_DIAS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'TRILHA_7_DIAS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trilha de 7 Dias (Novo Colaborador)
            </button>
            <button
              onClick={() => setActiveSubTab('REGRAS_OURO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'REGRAS_OURO'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Regras & EPIs
            </button>
          </div>
        </div>

        {/* SUB-ABA 1: OBRIGAÇÕES DIÁRIAS (CHECKLIST DE BOLSO) */}
        {activeSubTab === 'OBRIGACOES_DIARIAS' && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs flex items-center justify-between">
              <span>
                Estas tarefas foram extraídas diretamente do <strong>{activeRole.sourcePopCode}</strong> e compõem a rotina diária de chão de loja.
              </span>
              <span className="font-bold text-[10px] uppercase bg-amber-200 px-2 py-0.5 rounded">
                Rotina Obrigatória
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {activeRole.dailyObligations.map((ob) => (
                <div key={ob.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          ob.moment === 'ABERTURA'
                            ? 'bg-sky-100 text-sky-900'
                            : ob.moment === 'PICO'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        {ob.moment}
                      </span>
                      <strong className="text-slate-900 text-xs">{ob.task}</strong>
                    </div>
                    {ob.criticalRule && (
                      <p className="text-[11px] text-rose-700 font-medium">
                        ⚠️ Regra Crítica: {ob.criticalRule}
                      </p>
                    )}
                  </div>

                  <span className="font-mono text-slate-500 text-[11px] self-end sm:self-auto">
                    Horário Padrão: <strong>{ob.standardTime}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-ABA 2: TRILHA DE 7 DIAS (NOVO CONTRATADO) */}
        {activeSubTab === 'TRILHA_7_DIAS' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Cronograma de formação para colaboradores recém-chegados. O funcionário só assume o posto sozinho após concluir os 7 dias:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeRole.sevenDayTrack.map((track) => (
                <div key={track.day} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-800 text-white font-mono font-bold text-[10px]">
                      Dia {track.day} &bull; {track.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Etapa {track.day}/7</span>
                  </div>

                  <p className="text-[11px] text-slate-700 font-medium">{track.focus}</p>

                  <div className="space-y-1 pt-1">
                    {track.tasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-ABA 3: REGRAS DE OURO & EPIS */}
        {activeSubTab === 'REGRAS_OURO' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                Regras de Ouro Inegociáveis do Cargo
              </h4>
              <ul className="space-y-1.5 pt-1">
                {activeRole.goldenRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-800" />
                EPIs & Uniforme Regulamentar Obrigatório
              </h4>
              <ul className="space-y-1.5 pt-1">
                {activeRole.requiredEpis.map((epi, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{epi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Escaneamento de POPs com IA */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                  <Camera className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Leitor de POPs por IA (Gemini Vision)</h3>
                  <p className="text-[11px] text-slate-500">Tire foto do manual impresso para cadastrar obrigações</p>
                </div>
              </div>
              <button onClick={() => setShowScanModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="border-2 border-dashed border-emerald-400 bg-emerald-50/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-md">
                <Upload className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Fotografar Manual Impresso de POP</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  A IA lerá o texto, identificará o cargo responsável e distribuirá as tarefas na trilha.
                </span>
              </div>

              <button
                onClick={handleSimulateScanPop}
                disabled={isScanning}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>IA Analisando Documento & Extraindo Cargos...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Simular Foto de POP da Matriz</span>
                  </>
                )}
              </button>
            </div>

            {/* Histórico Recente de Ingestão de POPs */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Últimos POPs Ingeridos por IA
              </span>
              <div className="divide-y divide-slate-100 text-xs">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="py-2 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-[11px]">{scan.popTitle}</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {scan.confidenceScore}% precisão
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Função: <strong>{scan.detectedRole}</strong> &bull; {scan.extractedObligationsCount} obrigações criadas
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
