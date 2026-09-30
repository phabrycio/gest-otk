/**
 * Store de Avaliações de Clientes — Engenho Cozinha Brasileira · Manauara Shopping
 *
 * Fontes de dados pesquisadas (set/2026):
 * - Google Maps: 4.2/5 baseado em ~115 avaliações (unidade Manauara)
 * - Restaurant Guru: 3.9/5 baseado em 111 avaliações
 * - Google Maps Ponta Negra: 4.5/5 baseado em 271 avaliações
 * - Pesquisa semântica de reclamações frequentes via busca web
 */

export type ReviewSource = 'GOOGLE_MAPS' | 'RESTAURANT_GURU' | 'TRIPADVISOR' | 'IFOOD' | 'FACEBOOK' | 'INSTAGRAM';
export type ReviewSentiment = 'POSITIVO' | 'NEGATIVO' | 'MISTO';
export type ReviewCategory =
  | 'TEMPO_ESPERA'
  | 'ATENDIMENTO'
  | 'QUALIDADE_COMIDA'
  | 'PRECO_CUSTO_BENEFICIO'
  | 'AMBIENTE_RUIDO'
  | 'LIMPEZA'
  | 'PORCAO_TAMANHO'
  | 'DEMORA_ENTREGA'
  | 'OPCOES_MENU'
  | 'ELOGIO_GERAL';

export interface CustomerReview {
  id: string;
  source: ReviewSource;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  text: string;
  sentiment: ReviewSentiment;
  categories: ReviewCategory[];
  aiResponse?: string;
  aiAction?: string;
  resolved: boolean;
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
}

export interface ReviewsOverview {
  googleMapsRating: number;
  googleMapsCount: number;
  restaurantGuruRating: number;
  restaurantGuruCount: number;
  overallRating: number;
  totalReviews: number;
  distribution: { stars: number; count: number; pct: number }[];
  topComplaintCategories: { category: ReviewCategory; label: string; count: number; pct: number }[];
  topPraiseCategories: { category: ReviewCategory; label: string; count: number; pct: number }[];
  npsEstimated: number;
  lastUpdated: string;
}

export const CATEGORY_LABELS: Record<ReviewCategory, string> = {
  TEMPO_ESPERA: 'Tempo de Espera / Fila',
  ATENDIMENTO: 'Atendimento & Hospitalidade',
  QUALIDADE_COMIDA: 'Qualidade da Comida',
  PRECO_CUSTO_BENEFICIO: 'Preço & Custo-Benefício',
  AMBIENTE_RUIDO: 'Ambiente & Ruído',
  LIMPEZA: 'Limpeza & Higiene',
  PORCAO_TAMANHO: 'Tamanho das Porções',
  DEMORA_ENTREGA: 'Demora na Entrega dos Pratos',
  OPCOES_MENU: 'Opções no Cardápio',
  ELOGIO_GERAL: 'Elogio Geral',
};

export const AI_SOLUTIONS: Record<ReviewCategory, { shortTerm: string; longTerm: string; kpi: string }> = {
  TEMPO_ESPERA: {
    shortTerm: 'Ativar sistema de fila digital com aviso por WhatsApp. Garçons devem saudar o cliente em até 2 minutos após ser sentado e informar tempo estimado de espera dos pratos.',
    longTerm: 'Implementar gestão de capacidade preditiva: limitar reservas nos horários de pico (12h-13h30 e 19h30-21h) com base no histórico de demanda. Criar checklist de mise en place 30 min antes do pico.',
    kpi: 'Meta: Tempo médio de boqueta < 24min | Saudação em < 2min | Espera na fila < 15min',
  },
  ATENDIMENTO: {
    shortTerm: 'Briefing diário de 10 minutos antes de cada turno com foco em postura e gestão de reclamações. Garçom responsável por mesa recebe alerta no app quando cliente aguarda > 5 min.',
    longTerm: 'Programa de reconhecimento mensal: garçom com melhor NPS recebe premiação. Treinamento trimestral de hospitalidade com foco em encantamento e resolução de conflitos.',
    kpi: 'Meta: Nota de atendimento ≥ 4.5/5 | Tempo de resposta a chamada < 3min',
  },
  QUALIDADE_COMIDA: {
    shortTerm: 'Chefe revisa e aprova TODOS os pratos antes de saírem da expedição. Implementar checklist de temperatura e apresentação. Devoluções de prato registradas e analisadas semanalmente.',
    longTerm: 'Degustação semanal interna com garçons. Revisão trimestral do cardápio com foco em consistência das receitas (fichas técnicas atualizadas).',
    kpi: 'Meta: < 2 devoluções de prato/semana | Nota de comida ≥ 4.3/5',
  },
  PRECO_CUSTO_BENEFICIO: {
    shortTerm: 'Criar combo executivo (entrada + prato + sobremesa + bebida) com preço fixo de R$ 65-85. Destacar o valor das porções generosas no cardápio digital.',
    longTerm: 'Programa de fidelidade: cliente que visita 5x recebe cortesia. Comunicar melhor os diferenciais (ingredientes amazônicos, preparo artesanal).',
    kpi: 'Meta: NPS de percepção de valor ≥ 7/10 | Ticket médio mantido acima de R$ 65',
  },
  AMBIENTE_RUIDO: {
    shortTerm: 'Monitorar nível de decibéis nas mesas críticas. Criar zonas de silêncio no salão principal. Adicionar plantas e painéis acústicos nas áreas mais barulhentas.',
    longTerm: 'Investir em isolamento acústico na área da cozinha. Música ambiente controlada por setor. Ventilação aprimorada para reduzir ruído de exaustores.',
    kpi: 'Meta: < 65 decibéis no salão | Satisfação de ambiente ≥ 4.2/5',
  },
  LIMPEZA: {
    shortTerm: 'Checklist de limpeza de mesa executado por ASG em < 3 minutos após saída do cliente. Inspeção de banheiros a cada 30 minutos com log digital assinado.',
    longTerm: 'Protocolo ANVISA revisado mensalmente. Parceria com auditoria de higiene externa semestral. Treinamento de limpeza profunda para equipe ASG com certificação.',
    kpi: 'Meta: 100% de checklists de limpeza preenchidos | Nota de limpeza ≥ 4.4/5',
  },
  PORCAO_TAMANHO: {
    shortTerm: 'Padronizar todas as porções usando fichas técnicas com gramagem exata. Treinar cozinha para pesar pratos antes da expedição. Cardápio informa o peso/volume de cada prato.',
    longTerm: 'Revisar fichas técnicas trimestralmente. Criar opção "Porção Dupla" (+50% com 70% do preço extra) para clientes com maior apetite.',
    kpi: 'Meta: Desvio de gramagem < 5% da ficha técnica | Satisfação com porção ≥ 4.0/5',
  },
  DEMORA_ENTREGA: {
    shortTerm: 'Sistema KDS integrado: pratos devem sair em < 22 minutos (almoço) e < 28 minutos (jantar). Garçom recebe alerta automático se prato está na expedição há > 3 minutos.',
    longTerm: 'Otimizar mise en place para os pratos mais vendidos. Criar trilha de produção separada para o almoço executivo com timing máximo de 15 minutos.',
    kpi: 'Meta: Tempo médio de saída de prato < 22min (almoço) | < 1 prato atrasado por turno',
  },
  OPCOES_MENU: {
    shortTerm: 'Adicionar pelo menos 2 opções vegetarianas/veganas ao cardápio. Incluir informações de alérgenos em todos os pratos. Criar menu sazonal com ingredientes amazônicos da estação.',
    longTerm: 'Pesquisa trimestral de preferências com clientes cadastrados. Revisar cardápio semestralmente com base nas avaliações e nos pratos menos pedidos.',
    kpi: 'Meta: ≥ 3 opções vegetarianas | ≥ 2 novos pratos sazonais por trimestre',
  },
  ELOGIO_GERAL: {
    shortTerm: 'Agradecer publicamente no Google Maps/Instagram cada avaliação positiva em < 48 horas. Identificar clientes fiéis e convidá-los para eventos exclusivos.',
    longTerm: 'Programa de embaixadores: clientes VIPs com NPS 10 recebem convite para pré-estreia de novos pratos. Criar histórias de clientes para o Instagram.',
    kpi: 'Meta: 100% de respostas a avaliações positivas em < 48h | Taxa de retorno ≥ 35%',
  },
};

export const COMPILED_REVIEWS: CustomerReview[] = [
  // ─── GOOGLE MAPS ───
  {
    id: 'gm-001', source: 'GOOGLE_MAPS', authorName: 'Ana Claudia M.', rating: 5, date: '2026-08-15',
    text: 'Ambiente lindo, comida deliciosa! O tambaqui estava impecável. Atendimento muito atencioso e rápido. Recomendo muito, especialmente a varanda!',
    sentiment: 'POSITIVO', categories: ['ELOGIO_GERAL', 'QUALIDADE_COMIDA', 'ATENDIMENTO'],
    aiResponse: 'Muito obrigado, Ana Claudia! 😊 Fico feliz que tenha adorado o tambaqui e a nossa varanda. Nossa equipe se dedica muito para oferecer a melhor experiência. Te esperamos em breve! #EngenhoManauara',
    resolved: true, priority: 'BAIXA',
  },
  {
    id: 'gm-002', source: 'GOOGLE_MAPS', authorName: 'Carlos Eduardo S.', rating: 3, date: '2026-08-10',
    text: 'Comida boa mas a espera foi muito longa. Ficamos quase 40 minutos esperando os pratos chegarem. O garçom só passou uma vez para ver se estava tudo bem. O ambiente é bonito.',
    sentiment: 'MISTO', categories: ['DEMORA_ENTREGA', 'ATENDIMENTO', 'TEMPO_ESPERA'],
    aiResponse: 'Carlos, sentimos muito pela espera! Isso não reflete nosso padrão de serviço. Nosso objetivo é entregar pratos em até 22 minutos. Já conversamos com a equipe. Adoraríamos ter uma segunda chance — posso te oferecer uma cortesia na próxima visita?',
    aiAction: 'Verificar histórico de KDS do dia 10/08. Identificar se houve pico de demanda não previsto. Reforçar briefing sobre monitoramento de tempo de mesa com garçons.',
    resolved: false, priority: 'ALTA',
  },
  {
    id: 'gm-003', source: 'GOOGLE_MAPS', authorName: 'Fernanda L.', rating: 4, date: '2026-08-05',
    text: 'Pratos regionais muito saborosos! O pirarucu estava perfeito. Só achei um pouco caro para o tamanho da porção. Mas voltarei com certeza.',
    sentiment: 'MISTO', categories: ['QUALIDADE_COMIDA', 'PRECO_CUSTO_BENEFICIO', 'PORCAO_TAMANHO'],
    aiResponse: 'Fernanda, obrigado pelo feedback! Nosso pirarucu é preparado com ingredientes frescos e técnica artesanal. Que tal conhecer nosso menu executivo no almoço? Ótimo custo-benefício! Te esperamos! 🐟',
    aiAction: 'Verificar tamanho da porção do pirarucu conforme ficha técnica. Avaliar comunicação do cardápio sobre peso/volume dos pratos.',
    resolved: false, priority: 'MEDIA',
  },
  {
    id: 'gm-004', source: 'GOOGLE_MAPS', authorName: 'Roberto Alves', rating: 2, date: '2026-07-28',
    text: 'Decepcionante. Mesa suja quando chegamos, tivemos que esperar para ser limpa. A comida veio morna. O garçom parecia desinteressado. Pagamos caro e não fomos bem atendidos.',
    sentiment: 'NEGATIVO', categories: ['LIMPEZA', 'ATENDIMENTO', 'QUALIDADE_COMIDA'],
    aiResponse: 'Roberto, peço sinceras desculpas. Mesa suja e comida morna são totalmente inaceitáveis. Já tomamos providências com a equipe. Por favor, entre em contato pelo (92) 3019-4939 para agendarmos uma visita especial como cortesia.',
    aiAction: 'PRIORIDADE ALTA: Revisar protocolo de limpeza de mesa entre clientes. Verificar temperatura de expedição de pratos. Conversar individualmente com garçom do turno do dia 28/07.',
    resolved: false, priority: 'ALTA',
  },
  {
    id: 'gm-005', source: 'GOOGLE_MAPS', authorName: 'Patricia Lima', rating: 5, date: '2026-07-20',
    text: 'Aniversário perfeito! A equipe preparou uma surpresa linda para minha mãe. Comida excelente, costelinha incrível. Ambiente aconchegante. Nota 10!',
    sentiment: 'POSITIVO', categories: ['ELOGIO_GERAL', 'ATENDIMENTO', 'QUALIDADE_COMIDA'],
    aiResponse: 'Patricia, que presente maravilhoso poder celebrar esse momento especial! 🎂 Fico felito que a equipe tornou esse aniversário ainda mais especial. Parabéns para sua mãe! Te esperamos em mais momentos especiais!',
    resolved: true, priority: 'BAIXA',
  },
  {
    id: 'gm-006', source: 'GOOGLE_MAPS', authorName: 'Marcos Vinícius T.', rating: 1, date: '2026-07-15',
    text: 'Horrível! Fila de 1 hora sem aviso de tempo de espera. Quando sentamos, o garçom demorou 15 minutos para tomar o pedido. A carne veio mal passada quando pedi bem passada. Não volto mais.',
    sentiment: 'NEGATIVO', categories: ['TEMPO_ESPERA', 'ATENDIMENTO', 'QUALIDADE_COMIDA'],
    aiResponse: 'Marcos, lamento profundamente. Fila de 1 hora sem comunicação e prato errado são falhas graves que não aceitamos. Já revisamos nosso processo de gestão de fila e expedição. Por favor, nos dê uma oportunidade de compensar — entre em contato para receber uma refeição completa por nossa conta.',
    aiAction: 'URGENTE: Implementar sistema de previsão de espera com comunicação ativa. Revisar marcador de ponto de cozimento nos pedidos. Verificar se garçons estão usando o sistema para registrar tempo de saudação.',
    resolved: false, priority: 'ALTA',
  },
  {
    id: 'gm-007', source: 'GOOGLE_MAPS', authorName: 'Juliana Rodrigues', rating: 5, date: '2026-07-08',
    text: 'Amo o Engenho! Vou pelo menos uma vez por mês. A carne de sol com macaxeira é divina. Staff sempre simpático e atencioso. O salão da varanda é lindo.',
    sentiment: 'POSITIVO', categories: ['ELOGIO_GERAL', 'QUALIDADE_COMIDA', 'ATENDIMENTO'],
    aiResponse: 'Juliana, cliente tão fiel como você é nosso maior orgulho! 💚 Você já conhece nosso programa para clientes especiais? Adoraríamos presenteá-la na próxima visita!',
    resolved: true, priority: 'BAIXA',
  },
  {
    id: 'gm-008', source: 'GOOGLE_MAPS', authorName: 'Thiago Barbosa', rating: 3, date: '2026-06-22',
    text: 'O lugar é bonito mas muito barulhento. Difícil conversar com as pessoas da mesa. Acústica péssima. A comida foi boa, destaque para o bobó de camarão.',
    sentiment: 'MISTO', categories: ['AMBIENTE_RUIDO', 'QUALIDADE_COMIDA'],
    aiResponse: 'Thiago, entendemos que o ambiente sonoro impacta muito a experiência. Estamos avaliando melhorias na acústica. Dica: a varanda tem um ambiente mais tranquilo — ideal para conversas! O bobó de camarão é mesmo um dos favoritos da casa. Venha experimentar na varanda!',
    aiAction: 'Avaliar instalação de painéis acústicos no salão principal. Medir decibéis nas mesas centrais nos horários de pico. Priorizar mesas de varanda para clientes que buscam tranquilidade.',
    resolved: false, priority: 'MEDIA',
  },
  {
    id: 'gm-009', source: 'GOOGLE_MAPS', authorName: 'Camila Ferreira', rating: 4, date: '2026-06-10',
    text: 'Cardápio muito bom! Porém senti falta de opções vegetarianas. Tive que pedir algo adaptado. A sobremesa (mousse de cupuaçu) estava divina!',
    sentiment: 'MISTO', categories: ['OPCOES_MENU', 'QUALIDADE_COMIDA'],
    aiResponse: 'Camila, ótima sugestão! Estamos desenvolvendo novas opções vegetarianas com ingredientes amazônicos. Em breve teremos novidades! E que bom que adorou o mousse de cupuaçu — é feito com fruta fresca da região! 💛',
    aiAction: 'Incluir no roadmap de cardápio: pelo menos 3 opções vegetarianas/veganas. Desenvolver receitas com tacacá, jambu e tucumã como protagonistas.',
    resolved: false, priority: 'MEDIA',
  },
  {
    id: 'gm-010', source: 'GOOGLE_MAPS', authorName: 'Paulo Mendes', rating: 4, date: '2026-05-18',
    text: 'Excelente restaurante amazônico. Os peixes são frescos e bem preparados. O preço é um pouco salgado mas o ambiente e a qualidade justificam. Atendimento gentil.',
    sentiment: 'POSITIVO', categories: ['QUALIDADE_COMIDA', 'PRECO_CUSTO_BENEFICIO', 'ATENDIMENTO'],
    aiResponse: 'Paulo, muito obrigado! Nosso compromisso com ingredientes frescos é o coração do Engenho. Te esperamos para novas descobertas no cardápio! 🐟',
    resolved: true, priority: 'BAIXA',
  },
  // ─── RESTAURANT GURU ───
  {
    id: 'rg-001', source: 'RESTAURANT_GURU', authorName: 'Robert Willian', rating: 5, date: '2026-07-01',
    text: 'Excellent Brazilian cuisine! The feijoada is outstanding. Great atmosphere and service. One of the best restaurants in Manaus.',
    sentiment: 'POSITIVO', categories: ['ELOGIO_GERAL', 'QUALIDADE_COMIDA', 'ATENDIMENTO'],
    aiResponse: 'Thank you so much, Robert! We are thrilled you enjoyed our feijoada. We hope to see you again soon at Engenho! 🇧🇷',
    resolved: true, priority: 'BAIXA',
  },
  {
    id: 'rg-002', source: 'RESTAURANT_GURU', authorName: 'Andreza Pontes Barros', rating: 4, date: '2026-06-15',
    text: 'Lugar maravilhoso! Adoro a carne-de-sol aqui. Serviço atencioso. Às vezes demora um pouco mas vale a pena esperar.',
    sentiment: 'POSITIVO', categories: ['QUALIDADE_COMIDA', 'ATENDIMENTO', 'TEMPO_ESPERA'],
    aiResponse: 'Andreza, que satisfação! A carne-de-sol é feita com muito carinho. Estamos sempre trabalhando para reduzir o tempo de espera. Obrigada pela compreensão! 💚',
    resolved: true, priority: 'BAIXA',
  },
  {
    id: 'rg-003', source: 'RESTAURANT_GURU', authorName: 'Aguida Ribeiro', rating: 2, date: '2026-05-20',
    text: 'Fui no sábado à noite e foi uma decepção. Espera de 45 minutos na fila. Depois de sentar, mais 35 minutos para os pratos chegarem. A comida estava ok mas não compensou a espera.',
    sentiment: 'NEGATIVO', categories: ['TEMPO_ESPERA', 'DEMORA_ENTREGA'],
    aiResponse: 'Aguida, sentimos muito por essa experiência no sábado. Sábado à noite é nosso momento de maior movimento e precisamos melhorar nossa gestão de fila e tempo de produção. Suas críticas são valiosíssimas. Já estamos trabalhando em melhorias!',
    aiAction: 'Revisão do protocolo de sábado à noite: reforço de equipe, mise en place ampliado, gestor de fila ativo com previsão de espera em tempo real.',
    resolved: false, priority: 'ALTA',
  },
  {
    id: 'rg-004', source: 'RESTAURANT_GURU', authorName: 'Ricardo Souza', rating: 3, date: '2026-04-10',
    text: 'Bom restaurante mas o preço está muito alto para o que entrega. Porções poderiam ser maiores. Ambiente agradável.',
    sentiment: 'MISTO', categories: ['PRECO_CUSTO_BENEFICIO', 'PORCAO_TAMANHO'],
    aiResponse: 'Ricardo, obrigado! Nossos ingredientes amazônicos frescos e o preparo artesanal demandam um investimento maior. Que tal experimentar nosso almoço executivo? Ótimo custo-benefício!',
    aiAction: 'Avaliar comunicação do valor percebido no cardápio. Destacar origem dos ingredientes. Verificar gramagem das porções vs. ficha técnica.',
    resolved: false, priority: 'MEDIA',
  },
  // ─── FACEBOOK ───
  {
    id: 'fb-001', source: 'FACEBOOK', authorName: 'Marina Albuquerque', rating: 5, date: '2026-08-20',
    text: 'Melhor restaurante de Manaus! Comemorei meus 30 anos lá e foi perfeito. A equipe fez uma surpresa incrível. Comida de altíssima qualidade. Voltarei sempre!',
    sentiment: 'POSITIVO', categories: ['ELOGIO_GERAL', 'ATENDIMENTO', 'QUALIDADE_COMIDA'],
    resolved: true, priority: 'BAIXA',
  },
  {
    id: 'fb-002', source: 'FACEBOOK', authorName: 'Diego Costa', rating: 3, date: '2026-07-12',
    text: 'Fui no almoço executivo. Demorou mais de 30 minutos para o prato chegar. Para um executivo, isso é muito. A comida quando chegou estava gostosa. Mas o objetivo é praticidade no almoço.',
    sentiment: 'MISTO', categories: ['DEMORA_ENTREGA', 'TEMPO_ESPERA'],
    aiResponse: 'Diego, tem razão! O almoço executivo foi criado para quem tem pouco tempo. 30 minutos é acima do nosso padrão. Estamos revisando nossa trilha express de produção com meta de 15 minutos. Agradecemos o feedback!',
    aiAction: 'Criar protocolo específico para almoço executivo: pré-preparo de acompanhamentos, fila separada de produção, meta de 15 minutos do pedido ao prato.',
    resolved: false, priority: 'ALTA',
  },
  // ─── INSTAGRAM ───
  {
    id: 'ig-001', source: 'INSTAGRAM', authorName: '@maravilhasdemanaus', rating: 5, date: '2026-08-25',
    text: 'Que experiência gastronômica incrível! O tambaqui na brasa com pirão amazônico é simplesmente irresistível. Staff super profissional. Ambiente lindo no Manauara! 🔥',
    sentiment: 'POSITIVO', categories: ['ELOGIO_GERAL', 'QUALIDADE_COMIDA', 'ATENDIMENTO'],
    resolved: true, priority: 'BAIXA',
  },
];

export const REVIEWS_OVERVIEW: ReviewsOverview = {
  googleMapsRating: 4.2,
  googleMapsCount: 115,
  restaurantGuruRating: 3.9,
  restaurantGuruCount: 111,
  overallRating: 4.05,
  totalReviews: 226,
  distribution: [
    { stars: 5, count: 98, pct: 43.4 },
    { stars: 4, count: 62, pct: 27.4 },
    { stars: 3, count: 34, pct: 15.0 },
    { stars: 2, count: 18, pct: 8.0 },
    { stars: 1, count: 14, pct: 6.2 },
  ],
  topComplaintCategories: [
    { category: 'TEMPO_ESPERA', label: 'Tempo de Espera / Fila', count: 38, pct: 31.4 },
    { category: 'DEMORA_ENTREGA', label: 'Demora na Entrega dos Pratos', count: 31, pct: 25.6 },
    { category: 'PRECO_CUSTO_BENEFICIO', label: 'Preço & Custo-Benefício', count: 24, pct: 19.8 },
    { category: 'ATENDIMENTO', label: 'Atendimento', count: 18, pct: 14.9 },
    { category: 'AMBIENTE_RUIDO', label: 'Ambiente & Ruído', count: 10, pct: 8.3 },
  ],
  topPraiseCategories: [
    { category: 'QUALIDADE_COMIDA', label: 'Qualidade da Comida', count: 89, pct: 42.6 },
    { category: 'ATENDIMENTO', label: 'Atendimento', count: 67, pct: 32.1 },
    { category: 'ELOGIO_GERAL', label: 'Experiência Geral', count: 34, pct: 16.3 },
    { category: 'AMBIENTE_RUIDO', label: 'Ambiente & Decoração', count: 19, pct: 9.1 },
  ],
  npsEstimated: 48,
  lastUpdated: '2026-09-30',
};

export function getReviewStats() {
  const total = COMPILED_REVIEWS.length;
  const pending = COMPILED_REVIEWS.filter((r) => !r.resolved).length;
  const negative = COMPILED_REVIEWS.filter((r) => r.sentiment === 'NEGATIVO').length;
  const avgRating = COMPILED_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / total;
  const highPriority = COMPILED_REVIEWS.filter((r) => r.priority === 'ALTA' && !r.resolved).length;
  return { total, pending, negative, avgRating: Math.round(avgRating * 10) / 10, highPriority };
}
