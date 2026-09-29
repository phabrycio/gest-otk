import React, { useState } from 'react';
import {
  Star,
  Sparkles,
  CheckCircle2,
  Send,
  Coffee,
  TrendingUp,
  Tag,
  Copy,
  Clock,
  Zap,
  Percent,
  DollarSign,
  Beer,
  Utensils,
  Video,
  Film,
  Eye,
  Share2,
  Bookmark,
  Camera,
  Layers,
  CloudRain,
  Sun,
  Flame,
  UserCheck,
  ChevronRight,
  Play,
  Volume2,
  Info,
} from 'lucide-react';
import { CustomerReview, ExpiryPromoOpportunity, ViralReelScript } from '../types';

interface MarketingViewProps {
  reviews: CustomerReview[];
  onAnswerReview: (id: string, responseText: string) => void;
  onOpenCopilot: (prompt?: string) => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({ reviews, onAnswerReview, onOpenCopilot }) => {
  const [activeTab, setActiveTab] = useState<'VIRAL_STUDIO' | 'PROMOS_VALIDADE' | 'REPUTACAO_NPS' | 'HORARIOS_VALE'>('VIRAL_STUDIO');

  // Estado das avaliações do Google
  const [activeReviewId, setActiveReviewId] = useState<string | null>(reviews.find((r) => !r.isAnswered)?.id || null);
  const [responseText, setResponseText] = useState(
    reviews.find((r) => !r.isAnswered)?.suggestedResponse || ''
  );
  const pendingReviews = reviews.filter((r) => !r.isAnswered);

  // Roteiros de Vídeos Virais de Alta Conversão (Diretrizes do Algoritmo Instagram + Manaus/Ponta Negra)
  const [viralScripts, setViralScripts] = useState<ViralReelScript[]>([
    {
      id: 'reel-tambaqui-asmr',
      title: 'O Chiar do Tambaqui na Brasa (ASMR Food Porn)',
      category: 'ASMR_FOOD_PORN',
      targetDish: 'Costela de Tambaqui Nobre na Brasa c/ Farinha de Uarini',
      targetInsumo: 'Costela de Tambaqui (Lote ativo no freezer)',
      recommendedDayAndTime: 'Sexta-feira às 11h15 ou Sábado às 10h45',
      videoDurationSeconds: 14,
      hookThreeSeconds: 'Costela encostando na brasa viva com som estrondoso de TCHIIIISSS e fumaça aromática em 4K 60fps.',
      storytellingCore:
        'Resgate sensorial imediato da memória do almoço de fim de semana manauara. Mostra o corte suculento e a farofa crocante.',
      scenes: [
        {
          timeframe: '00:00 - 00:03',
          cameraAngle: 'Macro Lente (1x a 2cm), 4K a 60fps, iluminação lateral quente de inox',
          action: 'Costela de Tambaqui sendo colocada na grelha incandescente. Gordura natural borbulha instantaneamente.',
          audioAndSfx: 'Som cristalino e alto do TCHIIIISSS da brasa sem música de fundo (ASMR puro).',
          onScreenText: 'Ouça esse som...',
          algorithmicWhy: 'Hook sensorial nos primeiros 3s retém 92% dos usuários que navegam no mudo ou com fone.',
        },
        {
          timeframe: '00:03 - 00:07',
          cameraAngle: 'Plano Detalhe POV (Ponto de Vista do Chef), corte rápido a 45 graus',
          action: 'Faca do chef desliza na carne. Casca dourada crocante por fora e vapor suculento subindo da fibra branca.',
          audioAndSfx: 'Som do corte crocante da casquinha (CRUNCH).',
          algorithmicWhy: 'Gatilho de salivação visual extrema eleva o watch-time.',
        },
        {
          timeframe: '00:07 - 00:10',
          cameraAngle: 'Plano Médio com profundidade de campo rasa (fundo da cozinha suavemente desfocado)',
          action: 'Garfo mergulha a costela suculenta na farofa crocante de farinha de Uarini com banana pacovã.',
          audioAndSfx: 'Entrada sutil de batida acústica instrumental regional animada.',
          algorithmicWhy: 'Contraste de texturas (crocância + suculência) provoca desejo de consumo imediato.',
        },
        {
          timeframe: '00:10 - 00:14',
          cameraAngle: 'Plano Geral do Salão Climatizado do Engenho com a mesa farta para 4 pessoas e vista da orla',
          action: 'Família sorrindo brindando com canecas congeladas de chopp e garçom servindo a mesa.',
          audioAndSfx: 'Locução rápida e calorosa: "Almoço de domingo em Manaus tem endereço certo."',
          onScreenText: 'Manda no grupo da família quem vai com você hoje! 👇',
          algorithmicWhy: 'Call to Action explícito de envio por DM (Sends) impulsiona o algoritmo para aba Explorar.',
        },
      ],
      algorithmicRationale: {
        dmShareTrigger: 'As pessoas enviam no WhatsApp e no Direct dizendo: "Olha nosso almoço de domingo!".',
        targetAudiencePontaNegra: 'Famílias dos condomínios Alphaville, Jardim das Américas e orla da Ponta Negra.',
        competitorGapExploited:
          'Banzeiro é distante e formal demais; Coco Bambu não tem tambaqui na brasa autêntico. O Engenho oferece conforto de shopping + raiz.',
        soundStrategy: 'ASMR puro nos primeiros 7 segundos ativa o córtex gustativo do cérebro em 400ms.',
      },
      conversionProjection: {
        estimatedViews: '48.000+',
        estimatedDMShares: '1.450 envios',
        projectedTablesBooked: 32,
        projectedRevenueBoost: 5800.00,
      },
      captionsAndHashtags: {
        captionText:
          'Aquele barulho que todo manauara reconhece de longe! 🔥 Costela de Tambaqui Nobre grelhada na brasa de carvão, servida com arroz de jambu bem quentinho, feijão de praia e a nossa farofa crocante de Uarini. Mesa posta no salão climatizado do Shopping Ponta Negra (Piso L3). Já marca ou envia pra quem vai dividir essa travessa com você hoje! 🐟✨',
        strategicHashtags: [
          '#OndeComerEmManaus',
          '#RestauranteManaus',
          '#ShoppingPontaNegra',
          '#TambaquiManaus',
          '#EngenhoCozinhaBrasileira',
          '#GastronomiaAmazonica',
        ],
      },
    },
    {
      id: 'reel-pirarucu-storytelling',
      title: 'O Segredo do Pirarucu de Manejo (Storytelling do Chef)',
      category: 'STORYTELLING_HUMANO',
      targetDish: 'Lombo de Pirarucu Fresco em Crosta de Castanha-do-Brasil',
      targetInsumo: 'Filé de Pirarucu Fresco em Lombo',
      recommendedDayAndTime: 'Quarta ou Quinta-feira às 18h30',
      videoDurationSeconds: 28,
      hookThreeSeconds:
        'Sous-Chef Geovane segura uma peça gigante de lombo fresco: "Sabe por que o pirarucu de muita gente tem gosto de barro e o nosso não?"',
      storytellingCore:
        'Pessoas compram de pessoas. Mostra a origem do peixe de manejo sustentável dos rios do Amazonas e a dedicação do chef.',
      scenes: [
        {
          timeframe: '00:00 - 00:04',
          cameraAngle: 'Close-up no rosto sorridente e firme do Sous-Chef Geovane com dólmã bordado do Engenho',
          action: 'Geovane aponta para a fibra branca perfeita do pirarucu fresco na bancada de inox.',
          audioAndSfx: 'Voz limpa e autêntica de Geovane: "Muita gente me pergunta o segredo desse peixe..."',
          onScreenText: 'O segredo que ninguém conta sobre o Pirarucu em Manaus',
          algorithmicWhy: 'Pergunta intrigante quebra o padrão do feed e gera retenção imediata.',
        },
        {
          timeframe: '00:04 - 00:12',
          cameraAngle: 'B-Roll dinâmico em 60fps mostrando a manipulação artesanal do peixe',
          action: 'Cortes precisos do lombo, azeite regional de castanha e folhas frescas de chicória amazônica.',
          audioAndSfx: 'Geovane explicando: "Esse peixe é de manejo de águas correntes limpas do interior. 100% sustentável."',
          onScreenText: '100% Manejo Sustentável • Amazonas',
          algorithmicWhy: 'Gera autoridade moral e justificativa de preço premium contra peixe congelado industrial.',
        },
        {
          timeframe: '00:12 - 00:20',
          cameraAngle: 'Câmera lenta da crosta de castanha tostando na chapa quente',
          action: 'A crosta ganha cor dourada aveludada, servida sobre purê rústico de banana pacovã e redução de tucupi.',
          audioAndSfx: 'Som do peixe selando e música acolhedora de fundo.',
          onScreenText: 'Pirarucu em Crosta de Castanha-do-Brasil',
          algorithmicWhy: 'Apresentação gastronômica sofisticada posiciona o restaurante no topo da gastronomia classe A.',
        },
        {
          timeframe: '00:20 - 00:28',
          cameraAngle: 'Plano médio: Geovane entregando o prato finalizado na mesa e convidando o cliente',
          action: 'Geovane sorri: "Faço questão de assinar o seu prato hoje. Vem pro Engenho Ponta Negra."',
          audioAndSfx: 'Geovane: "Mesa posta e clima perfeito esperando por vocês."',
          onScreenText: 'Vem viver essa experiência no Shopping Ponta Negra (Piso L3)',
          algorithmicWhy: 'Aproximação humana: o cliente vai ao restaurante querendo ser atendido pela equipe do vídeo.',
        },
      ],
      algorithmicRationale: {
        dmShareTrigger: 'Compartilhado por quem busca experiências gastronômicas autênticas e turistas de negócios.',
        targetAudiencePontaNegra: 'Moradores que valorizam sustentabilidade e executivos recebendo visitas em Manaus.',
        competitorGapExploited:
          'Desmonta o Coco Bambu (que usa pescados industriais congelados de fora) ressaltando o frescor ribeirinho do Amazonas.',
        soundStrategy: 'Voz humana acolhedora gera 3x mais comentários e conexões emocionais duradouras.',
      },
      conversionProjection: {
        estimatedViews: '36.000+',
        estimatedDMShares: '890 envios',
        projectedTablesBooked: 24,
        projectedRevenueBoost: 4900.00,
      },
      captionsAndHashtags: {
        captionText:
          'Pessoas compram de pessoas, e cada prato que sai da nossa cozinha tem a assinatura e o coração da nossa equipe! ❤️ O Sous-Chef Geovane conta o motivo pelo qual nosso Lombo de Pirarucu em Crosta de Castanha é considerado inesquecível por quem visita o Engenho Ponta Negra: manejo sustentável, águas correntes e respeito ao ciclo dos rios. Vem provar essa obra de arte amazônica hoje à noite!',
        strategicHashtags: [
          '#PirarucuDeManejo',
          '#CozinhaAmazonica',
          '#ChefManaus',
          '#GastronomiaRegional',
          '#PontaNegraManaus',
          '#EngenhoRestaurante',
        ],
      },
    },
    {
      id: 'reel-chuva-chopp',
      title: 'O Radar do Chopp na Chuva (Gatilho Climático Ponta Negra)',
      category: 'GATILHO_CLIMATICO',
      targetDish: 'Combo Happy Hour: 2 Chopps Gelados + Dadinhos de Tapioca',
      targetInsumo: 'Chopp Brahma / Regional (Escoamento do lote com validade 15/09)',
      recommendedDayAndTime: 'Segunda a Quinta entre 15h30 e 17h30 (Ao soar o alerta de chuva na orla)',
      videoDurationSeconds: 11,
      idealWeatherTrigger: 'Chuva torrencial repentina na praia/orla da Ponta Negra',
      hookThreeSeconds:
        'Vidro panorâmico do shopping mostrando o temporal caindo no Rio Negro: "Começou a chover na Ponta Negra? Vem pra cá..."',
      storytellingCore:
        'Conexão de tempo real. Todo mundo na orla busca abrigo da tempestade; o Engenho oferece refúgio com chopp duplo e petisco.',
      scenes: [
        {
          timeframe: '00:00 - 00:03',
          cameraAngle: 'Câmera contra o vidro panorâmico mostrando as nuvens escuras e a chuva grossa na orla',
          action: 'Gotas escorrendo no vidro com o Rio Negro cinzento ao fundo. Clima dramático de tempestade.',
          audioAndSfx: 'Som forte de trovão e chuva pesada caindo lá fora.',
          onScreenText: 'Começou a chover na Ponta Negra? 🌧️',
          algorithmicWhy: 'Hiperlocalização instantânea: atinge 100% das pessoas que estão no bairro no momento da chuva.',
        },
        {
          timeframe: '00:03 - 00:08',
          cameraAngle: 'Giro de câmera rápido (whip pan) para o bar quente e climatizado do restaurante',
          action: 'Chopeira tirando um chopp cremoso trincando em caneca congelada com espuma perfeita.',
          audioAndSfx: 'Som do chopp jorrando na caneca gelada seguido de batida com som refrescante.',
          onScreenText: 'Corre pro refúgio do Engenho! 🍺',
          algorithmicWhy: 'Quebra sensorial de "chuva chata lá fora" para "conforto e chopp trincando aqui dentro".',
        },
        {
          timeframe: '00:08 - 00:11',
          cameraAngle: 'Close no combo montado com dadinhos dourados crocantes e molho de pimenta',
          action: 'Garçom servindo na mesa de madeira do salão climatizado.',
          audioAndSfx: 'Locução rápida: "Chopp duplo + Dadinhos de Tapioca por R$ 38,90 até as 20h."',
          onScreenText: 'Estacionamento coberto • Piso L3 Shopping Ponta Negra',
          algorithmicWhy: 'Elimina a objeção da chuva e converte tráfego de passagem no shopping em mesas cheias.',
        },
      ],
      algorithmicRationale: {
        dmShareTrigger: 'Enviado por colegas de trabalho e casais: "Olha onde a gente pode esperar a chuva passar!".',
        targetAudiencePontaNegra: 'Pessoas presas no trânsito da orla, caminhantes da praia e frequentadores do shopping.',
        competitorGapExploited:
          'Enquanto os quiosques da orla fecham com a chuva, o Engenho oferece conforto climatizado e estacionamento seco.',
        soundStrategy: 'O trovão inicial desperta atenção mesmo em modo silencioso com as legendas dinâmicas.',
      },
      conversionProjection: {
        estimatedViews: '29.000+',
        estimatedDMShares: '1.100 envios',
        projectedTablesBooked: 28,
        projectedRevenueBoost: 3890.00,
      },
      captionsAndHashtags: {
        captionText:
          'O temporal amazônico chegou na orla da Ponta Negra? Nada de ficar no trânsito! 🌧️🚗 Sobe para o Piso L3 do Shopping Ponta Negra: nosso salão está climatizado, o estacionamento é 100% coberto e nosso Chopp está estupidamente gelado. Hoje tem Combo Happy Hour: 2 Chopps + 1 porção de Dadinhos de Tapioca com geleia de pimenta por apenas R$ 38,90! Te esperamos para brindar enquanto a chuva passa.',
        strategicHashtags: [
          '#ChuvaEmManaus',
          '#PontaNegra',
          '#HappyHourManaus',
          '#ShoppingPontaNegra',
          '#ChoppGeladoManaus',
          '#EngenhoManaus',
        ],
      },
    },
    {
      id: 'reel-desafio-familia',
      title: 'O Desafio da Travessa Família (Engajamento Coletivo)',
      category: 'DESAFIO_CARDAPIO',
      targetDish: 'Travessa Farta do Sertão e das Águas (Serve 4 a 5 pessoas)',
      targetInsumo: 'Carne de Sol de Picanha, Queijo Coalho e Baião de Dois',
      recommendedDayAndTime: 'Sábado ou Domingo às 10h30',
      videoDurationSeconds: 16,
      hookThreeSeconds:
        'Garçom precisa das duas mãos e um leve esforço físico para descer na mesa uma travessa colossal fumegante de 3kg.',
      storytellingCore:
        'Gera o efeito "Uau, isso é gigante!". Provoca marcação massiva de amigos e familiares nos comentários.',
      scenes: [
        {
          timeframe: '00:00 - 00:04',
          cameraAngle: 'Plano Médio com garçom descendo a travessa gigante que quase não cabe na tela',
          action: 'A travessa de barro incandescente bate suave na mesa, com queijo coalho tostado derretendo.',
          audioAndSfx: 'Som do queijo chiar na chapa quente e expressão de surpresa das pessoas na mesa.',
          onScreenText: 'Quem do seu grupo aguenta comer isso sozinho? 👀',
          algorithmicWhy: 'Impacto visual de abundância gera curiosidade e marcação compulsiva de amigos nos comentários.',
        },
        {
          timeframe: '00:04 - 00:10',
          cameraAngle: 'Ângulo Zenital (câmera no topo a 90 graus) revelando todos os detalhes do prato',
          action: 'Garfo puxa o queijo coalho fazendo um fio de 30cm; colher serve o baião bem cremoso com nata.',
          audioAndSfx: 'Música animada e contagiante.',
          onScreenText: 'Picanha de Sol • Queijo Coalho Grelhado • Baião de Dois com Nata • Macaxeira na Manteiga',
          algorithmicWhy: 'O queijo puxando é o maior elemento visual de retenção no food service mundial.',
        },
        {
          timeframe: '00:10 - 00:16',
          cameraAngle: 'Família inteira se servindo junta, rindo e comemorando',
          action: 'Legenda explicativa de custo-benefício surpreendente.',
          audioAndSfx: 'Locução: "Serve 4 a 5 pessoas muito bem. Menos de R$ 48 por pessoa para comer como rei."',
          onScreenText: 'Manda no grupo da família que o almoço tá resolvido! 👨‍👩‍👧‍👦',
          algorithmicWhy: 'Custo por pessoa acessível para classe A/B quebra objeção de preço e garante reservas.',
        },
      ],
      algorithmicRationale: {
        dmShareTrigger: 'Famílias compartilham no grupo de domingo dizendo: "Vamos nesse hoje!".',
        targetAudiencePontaNegra: 'Famílias com filhos, avós e grupos de amigos pós-passeio ou igreja.',
        competitorGapExploited:
          'Muitos concorrentes cobram caro por pratos individuais minúsculos. O Engenho ganha no conceito de banquete farto e afetivo.',
        soundStrategy: 'Áudio dinâmico associado a momentos de celebração e risadas em família.',
      },
      conversionProjection: {
        estimatedViews: '54.000+',
        estimatedDMShares: '2.100 envios',
        projectedTablesBooked: 38,
        projectedRevenueBoost: 7400.00,
      },
      captionsAndHashtags: {
        captionText:
          'Se é pra reunir a família, que seja em volta de uma mesa farta de verdade! 🥩🧀 Nossa Travessa Especial de Carne de Sol de Picanha com Queijo Coalho dourado, Baião de Dois cremoso e macaxeira crocante na manteiga de garrafa serve até 5 pessoas confortavelmente (sai menos de R$ 48 por pessoa!). O almoço de sábado e domingo do Engenho Ponta Negra já virou tradição. Chega cedo ou reserve pelo link da bio!',
        strategicHashtags: [
          '#AlmocoDeDomingo',
          '#FamiliaManaus',
          '#CarneDeSolManaus',
          '#RestauranteFamilia',
          '#ShoppingPontaNegra',
          '#EngenhoCozinhaBrasileira',
        ],
      },
    },
  ]);

  const [promos, setPromos] = useState<ExpiryPromoOpportunity[]>([
    {
      id: 'promo-chopp-01',
      status: 'SUGERIDA',
      targetItem: {
        name: 'Barril Chopp Artesanal da Amazônia 50L',
        batchNumber: 'LOTE-CHOPP-892',
        currentStock: 3,
        unit: 'Barris',
        unitCost: 380.0,
        regularPrice: 22.0,
        expiryDate: '15/09/2026',
        daysRemaining: 4,
        totalRiskValue: 1140.0,
      },
      pairedItem: {
        name: 'Queijo Coalho Grelhado c/ Melaço de Engenho',
        unitCost: 8.5,
        regularPrice: 38.0,
        markupFactor: 4.4,
      },
      comboPricing: {
        comboName: 'Happy Hour Ponta Negra: 2 Canecas Chopp + Queijo Coalho Melaço',
        promoPrice: 59.9,
        regularTotalPrice: 82.0,
        discountPct: 27,
        totalComboCost: 17.2,
        targetCmvPct: 28.7,
        contributionMargin: 42.7,
        projectedRevenue: 4792.0,
        recommendedDates: 'Hoje a Domingo (17h às 20h)',
      },
      marketingAssets: {
        instagramCopy:
          'Calor de Manaus pede chopp trincando! 🍻 Queijo de coalho dourado na brasa com melaço de cana artesanal + 2 canecas zero grau por apenas R$ 59,90 no Happy Hour do Shopping Ponta Negra.',
        whatsappVipCopy:
          'Olá! Reservamos uma mesa no lounge refrigerado pra você hoje: combo exclusivo de Chopp Artesanal + Queijo Coalho com 27% OFF até domingo das 17h às 20h. Responda QUERO para garantir.',
        waiterUpsellScript:
          'Boa noite! Para começar enquanto escolhem os pratos principais, nossa chopeira está a -0.5°C hoje e temos o combo especial de 2 Chopps com Queijo Coalho dourado com desconto de 27%. Posso descer um para a mesa?',
      },
    },
    {
      id: 'promo-camarao-02',
      status: 'SUGERIDA',
      targetItem: {
        name: 'Camarão Regional Fresco Calibre G',
        batchNumber: 'LOTE-CAM-441',
        currentStock: 12.5,
        unit: 'KG',
        unitCost: 68.0,
        regularPrice: 119.0,
        expiryDate: '16/09/2026',
        daysRemaining: 5,
        totalRiskValue: 850.0,
      },
      pairedItem: {
        name: 'Baião de Dois Cremoso da Terra c/ Nata',
        unitCost: 9.2,
        regularPrice: 46.0,
        markupFactor: 5.0,
      },
      comboPricing: {
        comboName: 'Duo Almoço Executivo: Frigideira de Camarão Alho & Óleo + Baião Cremoso',
        promoPrice: 89.9,
        regularTotalPrice: 135.0,
        discountPct: 33,
        totalComboCost: 26.5,
        targetCmvPct: 29.5,
        contributionMargin: 63.4,
        projectedRevenue: 6293.0,
        recommendedDates: 'Segunda a Sexta no Almoço',
      },
      marketingAssets: {
        instagramCopy:
          'Almoço executivo no capricho! Camarões dourados no alho e azeite com nosso tradicional Baião de Dois cremoso com nata artesanal por R$ 89,90. Conforto e rapidez no Shopping Ponta Negra.',
        whatsappVipCopy:
          'Seu almoço executivo de hoje tem sabor de tradição! Camarão crocante + Baião cremoso para 2 pessoas com 33% OFF exclusivo para clientes VIP Ponta Negra.',
        waiterUpsellScript:
          'Desejam nossa sugestão do chef para o almoço? O chef Sebastião preparou hoje a Frigideira de Camarões no alho acompanhada do nosso Baião com nata fresca, saindo com benefício especial de R$ 89,90.',
      },
    },
  ]);

  const [selectedScriptId, setSelectedScriptId] = useState<string>('reel-tambaqui-asmr');
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeScript = viralScripts.find((s) => s.id === selectedScriptId) || viralScripts[0];
  const activeScene = activeScript.scenes[currentSceneIndex] || activeScript.scenes[0];

  const handleSelectScript = (id: string) => {
    setSelectedScriptId(id);
    setCurrentSceneIndex(0);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleActivatePdv = (promoId: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === promoId ? { ...p, status: 'ATIVADA_PDV' } : p))
    );
    alert('✅ Combo cadastrado e ativado instantaneamente no sistema PDV e no tablet dos garçons!');
  };

  const handleSelectReview = (rev: CustomerReview) => {
    setActiveReviewId(rev.id);
    setResponseText(rev.suggestedResponse || '');
  };

  const handlePublish = (id: string) => {
    onAnswerReview(id, responseText);
    alert('Resposta oficial publicada no Google Maps com sucesso!');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Topo do Módulo de Marketing */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#0a2e23]" />
            <h2 className="text-base font-bold text-slate-900 font-serif">Marketing & Reels Virais</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Roteiros dinâmicos otimizados para atrair clientes, gerar reservas e proteger o CMV.
          </p>
        </div>

        {/* Seletor de Abas */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-stretch md:self-auto overflow-x-auto shadow-xs border border-slate-200">
          <button
            onClick={() => setActiveTab('VIRAL_STUDIO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'VIRAL_STUDIO'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-slate-700" />
            <span>Estúdio de Vídeos</span>
          </button>
          <button
            onClick={() => setActiveTab('PROMOS_VALIDADE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'PROMOS_VALIDADE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-amber-600" />
            <span>Combos & Validades</span>
          </button>
          <button
            onClick={() => setActiveTab('REPUTACAO_NPS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'REPUTACAO_NPS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Reputação Google</span>
          </button>
          <button
            onClick={() => setActiveTab('HORARIOS_VALE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'HORARIOS_VALE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-slate-700" />
            <span>Ações de Vale</span>
          </button>
        </div>
      </div>

      {/* ABA 1: ESTÚDIO DE VÍDEOS VIRAIS (REELS & TIKTOK) */}
      {activeTab === 'VIRAL_STUDIO' && (
        <div className="space-y-4">
          {/* Header Compacto com Ações Diretas */}
          <div className="bg-gradient-to-r from-[#0a2e23] via-[#0d3b2d] to-[#134e3a] text-white p-4 rounded-2xl shadow-sm border border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Roteiros Prontos para Gravar com Smartphone</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-mono">
                    4K 60fps &bull; Formato 9:16
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  Vídeos curtos e magnéticos para gerar salivação e compartilhamento no WhatsApp da família.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => setShowAlgorithmModal(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Diretrizes do Algoritmo</span>
              </button>

              <button
                onClick={() => onOpenCopilot?.("Gere uma nova ideia de vídeo de 15 segundos para o Instagram do Engenho Ponta Negra com foco em sobremesa regional.")}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Criar com IA</span>
              </button>
            </div>
          </div>

          {/* Cards Visuais de Seleção de Vídeo (Estilo Stories / Carrossel) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {viralScripts.map((script) => {
              const isSelected = selectedScriptId === script.id;
              return (
                <button
                  key={script.id}
                  onClick={() => handleSelectScript(script.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#0a2e23] to-[#123e30] text-white ring-2 ring-amber-400 shadow-md scale-[1.01]'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        isSelected 
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {script.category === 'ASMR_FOOD_PORN' && '🔥 ASMR Puro'}
                        {script.category === 'STORYTELLING_HUMANO' && '👨‍🍳 Storytelling'}
                        {script.category === 'GATILHO_CLIMATICO' && '🌧️ Chuva na Orla'}
                        {script.category === 'DESAFIO_CARDAPIO' && '👨‍👩‍👧‍👦 Família'}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                        {script.videoDurationSeconds}s
                      </span>
                    </div>

                    <h4 className="text-xs font-bold leading-snug line-clamp-2">
                      {script.title}
                    </h4>
                  </div>

                  <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                    isSelected ? 'border-white/10 text-emerald-200' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span>Previsto:</span>
                    <strong className={`font-bold ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`}>
                      +{script.conversionProjection.projectedTablesBooked} mesas
                    </strong>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ÁREA PRINCIPAL: STORYBOARD INTERATIVO DE SMARTPHONE + PAINEL EXECUTIVO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Mockup Interativo de Smartphone (Simulador do Reel) - 5 Colunas */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 p-4 rounded-3xl border border-slate-800 shadow-xl text-white">
              {/* Moldura do Celular */}
              <div className="space-y-3">
                {/* Barras de Progresso dos Stories no Topo */}
                <div className="flex items-center gap-1 px-1">
                  {activeScript.scenes.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentSceneIndex(idx)}
                      className={`h-1 flex-1 rounded-full cursor-pointer transition-all ${
                        idx === currentSceneIndex
                          ? 'bg-amber-400'
                          : idx < currentSceneIndex
                          ? 'bg-white/70'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Top Bar do Instagram */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Cena {currentSceneIndex + 1} de {activeScript.scenes.length}</span>
                    <span className="text-slate-400 font-mono font-normal">({activeScene.timeframe})</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono bg-amber-400/15 px-1.5 py-0.2 rounded border border-amber-400/30">
                    Reels Preview
                  </span>
                </div>

                {/* Tela do Smartphone com o Conteúdo da Cena */}
                <div className="relative aspect-[9/13] rounded-2xl bg-gradient-to-t from-black via-slate-950 to-slate-900 p-4 flex flex-col justify-between border border-white/10 overflow-hidden shadow-inner">
                  {/* Dynamic Island / Marca d'água */}
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span>@restauranteengenho</span>
                    <span>Shopping Ponta Negra</span>
                  </div>

                  {/* Texto de Hook na Tela */}
                  <div className="space-y-3 text-center my-auto">
                    {activeScene.onScreenText ? (
                      <div className="inline-block px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-lg tracking-tight rotate-[-1deg]">
                        "{activeScene.onScreenText}"
                      </div>
                    ) : (
                      <div className="inline-block px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-white font-bold text-xs tracking-tight">
                        {activeScript.targetDish}
                      </div>
                    )}

                    {/* Descrição Visual da Ação em 1 Frase Clara */}
                    <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-left space-y-1.5">
                      <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                        Ação da Câmera:
                      </span>
                      <p className="text-xs text-white leading-relaxed font-medium">
                        {activeScene.action}
                      </p>
                    </div>

                    {/* Áudio / Sound Design */}
                    <div className="bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-2 text-left">
                      <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-[11px] text-emerald-200 line-clamp-2">
                        {activeScene.audioAndSfx}
                      </span>
                    </div>
                  </div>

                  {/* Botões Laterais do Instagram + Navegador de Cenas */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <button
                      onClick={() => setCurrentSceneIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentSceneIndex === 0}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      &larr; Anterior
                    </button>

                    <div className="flex items-center gap-1.5">
                      {activeScript.scenes.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSceneIndex(i)}
                          className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                            i === currentSceneIndex ? 'bg-amber-400 w-4' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentSceneIndex(prev => Math.min(activeScript.scenes.length - 1, prev + 1))}
                      disabled={currentSceneIndex === activeScript.scenes.length - 1}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-30 text-slate-950 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <span>Próxima</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel Executivo de Dados & Ações - 7 Colunas */}
            <div className="lg:col-span-7 space-y-3.5">
              {/* Card de Métricas Visuais Grandes */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Impacto Estimado de Conversão
                  </h4>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {activeScript.recommendedDayAndTime}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Visualizações</span>
                    <span className="text-base font-black text-slate-900 mt-0.5 block">
                      {activeScript.conversionProjection.estimatedViews}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Envios no WhatsApp</span>
                    <span className="text-base font-black text-emerald-700 mt-0.5 block">
                      {activeScript.conversionProjection.estimatedDMShares}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Mesas no Salão</span>
                    <span className="text-base font-black text-[#0a2e23] mt-0.5 block">
                      +{activeScript.conversionProjection.projectedTablesBooked} mesas
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Vendas Estimadas</span>
                    <span className="text-base font-black text-amber-700 mt-0.5 block">
                      +R$ {activeScript.conversionProjection.projectedRevenueBoost.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Caixa da Legenda com Botão de Copiar Direto */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Legenda Pronta para o Post do Instagram</span>
                  </span>

                  <button
                    onClick={() => handleCopy(
                      `${activeScript.captionsAndHashtags.captionText}\n\n${activeScript.captionsAndHashtags.strategicHashtags.join(' ')}`,
                      'caption-quick'
                    )}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>{copiedId === 'caption-quick' ? 'Copiada!' : 'Copiar Legenda'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                  "{activeScript.captionsAndHashtags.captionText}"
                </p>

                <div className="flex flex-wrap gap-1">
                  {activeScript.captionsAndHashtags.strategicHashtags.slice(0, 4).map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                      {tag}
                    </span>
                  ))}
                  <span className="text-[10px] text-slate-400 self-center">
                    +{activeScript.captionsAndHashtags.strategicHashtags.length - 4} tags
                  </span>
                </div>
              </div>

              {/* Botões de Ação Imediata do Gerente */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => handleCopy(
                    `ROTEIRO VIRAL: ${activeScript.title}\nDuração: ${activeScript.videoDurationSeconds}s\n\nHook (3s): ${activeScript.hookThreeSeconds}\n\nCENAS:\n` +
                    activeScript.scenes.map((c, i) => `Cena ${i + 1} (${c.timeframe}):\n- Ação: ${c.action}\n- Áudio: ${c.audioAndSfx}\n- Texto: ${c.onScreenText || 'Sem texto'}\n`).join('\n') +
                    `\nLEGENDA:\n${activeScript.captionsAndHashtags.captionText}\n\n${activeScript.captionsAndHashtags.strategicHashtags.join(' ')}`,
                    'script-director'
                  )}
                  className="w-full flex-1 py-2.5 px-4 rounded-xl bg-[#0a2e23] hover:bg-[#123e30] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>{copiedId === 'script-director' ? 'Roteiro Completo Copiado!' : 'Copiar Roteiro para Gravar'}</span>
                </button>

                <button
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  <span>{showTechnicalDetails ? 'Ocultar Detalhes de Lente' : 'Ver Lentes e Câmera'}</span>
                </button>
              </div>

              {/* Seção Sanfonada: Decupagem Completa (Apenas se o usuário pedir) */}
              {showTechnicalDetails && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5 animate-fade-in text-xs">
                  <span className="font-bold text-slate-800 block text-xs">
                    Decupagem Técnica de Gravação (4 Cenas):
                  </span>
                  <div className="space-y-2">
                    {activeScript.scenes.map((scene, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900 text-[11px]">
                          <span>Cena {idx + 1} ({scene.timeframe})</span>
                          <span className="text-[10px] text-slate-400 font-normal">{scene.cameraAngle}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{scene.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MODAL LIMPO DE DIRETRIZES DO ALGORITMO (Abre apenas se o usuário clicar no botão de info) */}
          {showAlgorithmModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-900">Diretrizes do Algoritmo Instagram 2026</h3>
                  </div>
                  <button
                    onClick={() => setShowAlgorithmModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">1. Hook Instantâneo (&le; 3 segundos)</strong>
                    <p className="text-slate-600 text-[11px]">Som ASMR alto de brasa ou corte crocante nos primeiros segundos retém 85%+ da audiência antes de rolar o feed.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">2. Taxa de Envio por DM (Sends)</strong>
                    <p className="text-slate-600 text-[11px]">O Instagram prioriza conteúdos encaminhados em grupos de WhatsApp e mensagens diretas com frases de convite ("Vamos lá hoje?").</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block mb-0.5">3. Conforto & Clima Ponta Negra</strong>
                    <p className="text-slate-600 text-[11px]">Destaque para o salão climatizado e a vista da orla em dias de chuva repentina atrai clientes dos condomínios vizinhos.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => setShowAlgorithmModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#0a2e23] text-white text-xs font-bold cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ABA 2: COMBOS ANTI-DESPERDÍCIO (CMV & VALIDADE) */}
      {activeTab === 'PROMOS_VALIDADE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-emerald-200 text-xs">
                <span>Insumos Salvos da Perda</span>
                <Percent className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black mt-1">R$ 1.322,00</div>
              <p className="text-[11px] text-emerald-200/80 mt-0.5">
                Custo total que seria descartado nos próximos 3 dias.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Receita Extra Projetada</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-slate-900 mt-1">R$ 5.480,00</div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                Margem média de contribuição: 69,2%
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>CMV Médio dos Combos</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-black text-emerald-700 mt-1">29,1%</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Meta do restaurante: CMV &le; 32% (Controlado)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {promos.map((promo) => {
              const isChopp = promo.id === 'promo-chopp-01';
              return (
                <div
                  key={promo.id}
                  className="bg-white rounded-2xl border-2 border-emerald-700/20 p-4 sm:p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-start sm:items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                        {isChopp ? <Beer className="w-5 h-5 text-amber-700" /> : <Utensils className="w-5 h-5 text-emerald-800" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            {promo.comboPricing.comboName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Vence dia {promo.targetItem.expiryDate} ({promo.targetItem.daysRemaining} dias)
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          Período recomendado para venda: <strong>{promo.comboPricing.recommendedDates}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {promo.status === 'ATIVADA_PDV' ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ativo no PDV
                        </span>
                      ) : (
                        <button
                          onClick={() => handleActivatePdv(promo.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ativar Promoção no PDV</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200">
                      <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider block">
                        Item do Estoque Virtual em Risco
                      </span>
                      <strong className="text-slate-900 text-xs block mt-1">{promo.targetItem.name}</strong>
                      <div className="mt-2 space-y-1 text-slate-600 text-[11px]">
                        <div>Lote: <span className="font-mono text-slate-800 font-semibold">{promo.targetItem.batchNumber}</span></div>
                        <div>Estoque em Risco: <strong>{promo.targetItem.currentStock} {promo.targetItem.unit}</strong></div>
                        <div>Custo Unitário: R$ {promo.targetItem.unitCost.toFixed(2)} | Preço normal: R$ {promo.targetItem.regularPrice.toFixed(2)}</div>
                        <div className="text-rose-700 font-bold pt-1 border-t border-rose-200">
                          Prejuízo se descartar: R$ {promo.targetItem.totalRiskValue.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                        Pareamento de Ficha Técnica (Alto Markup)
                      </span>
                      <strong className="text-slate-900 text-xs block mt-1">{promo.pairedItem.name}</strong>
                      <div className="mt-2 space-y-1 text-slate-600 text-[11px]">
                        <div>Custo da Porção: <strong>R$ {promo.pairedItem.unitCost.toFixed(2)}</strong></div>
                        <div>Preço de Cardápio: R$ {promo.pairedItem.regularPrice.toFixed(2)}</div>
                        <div>Fator de Markup: <span className="font-bold text-emerald-800">{promo.pairedItem.markupFactor}x</span></div>
                        <div className="text-emerald-700 font-bold pt-1 border-t border-emerald-200">
                          Compensa o desconto e blinda a margem da loja
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider block">
                        Equação Financeira do Combo
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-base font-black text-emerald-800">
                          R$ {promo.comboPricing.promoPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          R$ {promo.comboPricing.regularTotalPrice.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          -{promo.comboPricing.discountPct}% OFF
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 text-slate-600 text-[11px]">
                        <div>Custo Total do Combo: <strong>R$ {promo.comboPricing.totalComboCost.toFixed(2)}</strong></div>
                        <div>CMV do Combo: <strong className="text-emerald-800">{promo.comboPricing.targetCmvPct}%</strong> (Seguro)</div>
                        <div className="text-slate-900 font-bold pt-1 border-t border-slate-200 flex justify-between">
                          <span>Margem Líquida por Venda:</span>
                          <span className="text-emerald-700">+ R$ {promo.comboPricing.contributionMargin.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Material de Divulgação Gerado pela IA (Multicanal)
                      </span>
                      <span className="text-[11px] text-slate-400">1-clique para copiar</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-purple-700 block">Instagram (Stories/Feed)</span>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                            "{promo.marketingAssets.instagramCopy}"
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(promo.marketingAssets.instagramCopy, `${promo.id}-insta`)}
                          className="mt-2 text-[10px] font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1 self-end"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === `${promo.id}-insta` ? 'Copiado!' : 'Copiar Texto'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-700 block">WhatsApp VIP Ponta Negra</span>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                            "{promo.marketingAssets.whatsappVipCopy}"
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(promo.marketingAssets.whatsappVipCopy, `${promo.id}-wpp`)}
                          className="mt-2 text-[10px] font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1 self-end"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === `${promo.id}-wpp` ? 'Copiado!' : 'Copiar Texto'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-amber-700 block">Script de Salão (Garçons)</span>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                            "{promo.marketingAssets.waiterUpsellScript}"
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(promo.marketingAssets.waiterUpsellScript, `${promo.id}-waiter`)}
                          className="mt-2 text-[10px] font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1 self-end"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === `${promo.id}-waiter` ? 'Copiado!' : 'Copiar Texto'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 3: REPUTAÇÃO GOOGLE (NPS) */}
      {activeTab === 'REPUTACAO_NPS' && (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-950 flex items-center justify-center font-black text-lg">
                4.8
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950">Nota Média Google Maps (Ponta Negra)</h4>
                <p className="text-xs text-amber-800">
                  Meta mensal: <strong>&ge; 4.6 estrelas</strong> e respostas em menos de 24 horas.
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-amber-200 text-amber-950 text-xs font-black uppercase text-center">
              R$ 500,00 de Bônus Assegurado
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900">Avaliações do Restaurante</h3>
                <span className="text-xs text-slate-400">{pendingReviews.length} pendente(s)</span>
              </div>

              <div className="divide-y divide-slate-100 space-y-2">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    <Star className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
                    <p className="font-semibold text-slate-700">Nenhuma avaliação recebida hoje</p>
                    <p className="text-[11px] text-slate-400 mt-1">Conforme novas avaliações forem sincronizadas do Google Maps, elas aparecerão aqui.</p>
                  </div>
                ) : reviews.map((rev) => (
                  <div
                    key={rev.id}
                    onClick={() => handleSelectReview(rev)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      activeReviewId === rev.id
                        ? 'border-emerald-700 bg-emerald-50/30'
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                        <span className="text-[10px] text-slate-400 font-medium">({rev.platform.replace('_', ' ')})</span>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs font-bold">
                        {'★'.repeat(rev.rating)}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">"{rev.comment}"</p>

                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{rev.date}</span>
                      {rev.isAnswered ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Respondido
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                          Aguardando Resposta
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-900">Resposta com Tom Corporativo (IA)</h3>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    SLA &lt; 24h
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  O Copilot redigiu a resposta abaixo no padrão de hospitalidade do Grupo Engenho:
                </p>

                <textarea
                  rows={6}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:border-emerald-600 mt-2 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() =>
                    onOpenCopilot('Reescreva a resposta para a avaliação do cliente com um tom ainda mais caloroso e convite para retorno.')
                  }
                  className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gerar Nova Variação</span>
                </button>

                {activeReviewId && (
                  <button
                    onClick={() => handlePublish(activeReviewId)}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Aprovar & Publicar Resposta</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: HORÁRIOS DE VALE & EVENTOS */}
      {activeTab === 'HORARIOS_VALE' && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 p-4 rounded-2xl border border-amber-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold text-amber-950">Ações para Horários de Vale (15h às 18h no Shopping Ponta Negra)</h3>
          </div>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            Estratégias de cardápio e parcerias para elevar o fluxo de clientes entre o almoço e o jantar:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block">Festival da Tarde: Tapiocas & Cafés Especiais</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Atrair moradores da orla e profissionais em home office com combos de tapioca e café amazônico das 15h às 17h.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block">Happy Hour Ponta Negra (Quarta & Quinta)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Chopp artesanal e petiscos regionais com desconto a partir das 17h para antecipar a ocupação das mesas do jantar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
