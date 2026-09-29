import { SupportedLanguage } from './customerMenuTypes';

export interface UiTranslations {
  brandSubtitle: string;
  selectLanguageTitle: string;
  selectLanguageDesc: string;
  onboardingStep1Title: string;
  onboardingStep1Desc: string;
  onboardingStep2Title: string;
  onboardingStep2Desc: string;
  onboardingStep3Title: string;
  onboardingStep3Desc: string;
  startExploring: string;
  skipIntro: string;
  next: string;
  back: string;
  searchPlaceholder: string;
  allCategories: string;
  regionalOnly: string;
  filterByDoneness: string;
  addToOrder: string;
  customizationTitle: string;
  selectMeatPoint: string;
  meatPointRare: string;
  meatPointRareDesc: string;
  meatPointMedium: string;
  meatPointMediumDesc: string;
  meatPointWellDone: string;
  meatPointWellDoneDesc: string;
  specialInstructions: string;
  specialInstructionsPlaceholder: string;
  confirmAdd: string;
  cancel: string;
  cartTitle: string;
  cartEmpty: string;
  cartEmptySubtitle: string;
  itemsCount: string;
  subtotal: string;
  total: string;
  customerNameLabel: string;
  customerNamePlaceholder: string;
  tableNumberLabel: string;
  tableNumberPlaceholder: string;
  finalizeButton: string;
  callWaiterTitle: string;
  callWaiterInstructions: string;
  waiterTicketHeader: string;
  waiterTicketSubheader: string;
  copyTicket: string;
  ticketCopied: string;
  newOrder: string;
  editOrder: string;
  allergensLabel: string;
  prepTimeLabel: string;
  portionWeightLabel: string;
  adminReturn: string;
  helpButton: string;
}

export const UI_TRANSLATIONS: Record<SupportedLanguage, UiTranslations> = {
  pt: {
    brandSubtitle: 'Cozinha Brasileira • Manauara Shopping',
    selectLanguageTitle: 'Selecione seu Idioma / Choose Language',
    selectLanguageDesc: 'Escolha como prefere navegar e visualizar nosso cardápio gastronômico:',
    onboardingStep1Title: 'Bem-vindo ao Engenho Cozinha Brasileira!',
    onboardingStep1Desc: 'Navegue pelas nossas categorias exclusivas, conheça os cortes nobres na brasa, peixes amazônicos frescos e drinks artesanais.',
    onboardingStep2Title: 'Escolha seus Itens & Personalize',
    onboardingStep2Desc: 'Selecione a quantidade de cada prato. Para carnes e hambúrgueres, você pode definir o ponto exato (mal passado, ao ponto ou bem passado) e observações especiais.',
    onboardingStep3Title: 'Finalize & Mostre ao Atendente',
    onboardingStep3Desc: 'Quando terminar de escolher, basta chamar o garçom! Sua comanda será exibida formatada em português para lançamento imediato e sem erros no sistema.',
    startExploring: 'Começar a Explorar o Cardápio',
    skipIntro: 'Pular Introdução',
    next: 'Próximo',
    back: 'Voltar',
    searchPlaceholder: 'Buscar prato, ingrediente ou bebida...',
    allCategories: 'Todos os Itens',
    regionalOnly: '🌿 Somente Amazônicos',
    filterByDoneness: 'Ponto da Carne',
    addToOrder: 'Adicionar',
    customizationTitle: 'Personalizar Item',
    selectMeatPoint: 'Selecione o Ponto da Carne:',
    meatPointRare: 'Mal Passado',
    meatPointRareDesc: 'Selado por fora, centro vermelho e bem suculento',
    meatPointMedium: 'Ao Ponto',
    meatPointMediumDesc: 'Dourado por fora, centro rosado no ponto ideal',
    meatPointWellDone: 'Bem Passado',
    meatPointWellDoneDesc: 'Totalmente cozido e uniforme por dentro',
    specialInstructions: 'Observações Especiais (opcional):',
    specialInstructionsPlaceholder: 'Ex: Sem cebola, gelo e limão à parte, molho separado...',
    confirmAdd: 'Adicionar ao Pedido',
    cancel: 'Cancelar',
    cartTitle: 'Seu Pedido',
    cartEmpty: 'Seu carrinho está vazio',
    cartEmptySubtitle: 'Explore o cardápio e adicione os pratos desejados para começar seu pedido.',
    itemsCount: 'itens selecionados',
    subtotal: 'Subtotal:',
    total: 'Total Estimado:',
    customerNameLabel: 'Seu Nome:',
    customerNamePlaceholder: 'Como podemos te chamar?',
    tableNumberLabel: 'Número da Mesa (opcional):',
    tableNumberPlaceholder: 'Ex: 14',
    finalizeButton: 'Finalizar Pedido & Chamar Atendente',
    callWaiterTitle: 'Seu Pedido Está Pronto!',
    callWaiterInstructions: 'Por favor, mostre esta tela ao seu atendente para que ele faça o lançamento oficial do seu pedido no sistema da casa.',
    waiterTicketHeader: 'COMANDA OFICIAL DO CLIENTE',
    waiterTicketSubheader: 'Pronto para lançamento no PDV / Teknisa',
    copyTicket: 'Copiar Comanda em Texto',
    ticketCopied: 'Copiado para a área de transferência!',
    newOrder: 'Fazer Novo Pedido',
    editOrder: 'Alterar Itens',
    allergensLabel: 'Alérgenos:',
    prepTimeLabel: 'Tempo médio:',
    portionWeightLabel: 'Porção:',
    adminReturn: 'Voltar ao Painel Gerencial',
    helpButton: 'Como Fazer o Pedido',
  },
  en: {
    brandSubtitle: 'Brazilian Culinary • Manauara Shopping, Manaus',
    selectLanguageTitle: 'Select Your Preferred Language',
    selectLanguageDesc: 'Choose how you would like to browse our authentic Brazilian menu:',
    onboardingStep1Title: 'Welcome to Engenho Cozinha Brasileira!',
    onboardingStep1Desc: 'Explore our authentic regional dishes, charcoal-grilled prime meats, wild Amazonian fish, and handcrafted cocktails.',
    onboardingStep2Title: 'Choose Your Dishes & Customize',
    onboardingStep2Desc: 'Add items and adjust quantities. For grilled steaks and burgers, choose your exact meat cooking doneness and write any special dietary requests.',
    onboardingStep3Title: 'Review & Show to Your Waiter',
    onboardingStep3Desc: 'When you are done, simply call your waiter! A clear order ticket will appear translated into Portuguese so the staff can enter it directly into the restaurant system with zero confusion.',
    startExploring: 'Start Exploring the Menu',
    skipIntro: 'Skip Intro',
    next: 'Next',
    back: 'Back',
    searchPlaceholder: 'Search dish, ingredient, or drink...',
    allCategories: 'All Categories',
    regionalOnly: '🌿 Amazonian Specials',
    filterByDoneness: 'Meat Doneness',
    addToOrder: 'Add to Order',
    customizationTitle: 'Customize Dish',
    selectMeatPoint: 'Select Meat Cooking Doneness:',
    meatPointRare: 'Rare',
    meatPointRareDesc: 'Seared on the outside, warm red juicy center',
    meatPointMedium: 'Medium',
    meatPointMediumDesc: 'Golden brown outside, tender pink center',
    meatPointWellDone: 'Well Done',
    meatPointWellDoneDesc: 'Fully cooked through, uniformly browned',
    specialInstructions: 'Special Requests (optional):',
    specialInstructionsPlaceholder: 'E.g., No onions, dressing on the side, extra ice and lime...',
    confirmAdd: 'Add to Order',
    cancel: 'Cancel',
    cartTitle: 'Your Order',
    cartEmpty: 'Your order is currently empty',
    cartEmptySubtitle: 'Explore our delicious menu items and add them to your cart to begin.',
    itemsCount: 'items selected',
    subtotal: 'Subtotal:',
    total: 'Estimated Total:',
    customerNameLabel: 'Your Name:',
    customerNamePlaceholder: 'What name should we use for your order?',
    tableNumberLabel: 'Table Number (optional):',
    tableNumberPlaceholder: 'E.g., 14',
    finalizeButton: 'Complete Order & Call Waiter',
    callWaiterTitle: 'Your Order is Ready!',
    callWaiterInstructions: 'Please show this screen to your waiter so they can register your choices immediately into the restaurant system.',
    waiterTicketHeader: 'WAITER ORDER TICKET (EM PORTUGUÊS)',
    waiterTicketSubheader: 'Formatted in Portuguese for seamless POS entry',
    copyTicket: 'Copy Order Text',
    ticketCopied: 'Order copied to clipboard!',
    newOrder: 'Start New Order',
    editOrder: 'Modify Items',
    allergensLabel: 'Allergens:',
    prepTimeLabel: 'Est. prep time:',
    portionWeightLabel: 'Portion:',
    adminReturn: 'Back to Management View',
    helpButton: 'How to Order',
  },
  es: {
    brandSubtitle: 'Cocina Brasileña • Manauara Shopping, Manaus',
    selectLanguageTitle: 'Seleccione su Idioma',
    selectLanguageDesc: 'Elija cómo prefiere explorar y visualizar nuestra carta gastronómica:',
    onboardingStep1Title: '¡Bienvenido a Engenho Cozinha Brasileira!',
    onboardingStep1Desc: 'Descubra nuestros auténticos platos brasileños, carnes nobles a la brasa, pescados frescos del Amazonas y cócteles de autor.',
    onboardingStep2Title: 'Elija sus Platos y Personalice',
    onboardingStep2Desc: 'Seleccione las cantidades deseadas. Para carnes y hamburguesas, elija el término de cocción exacto (poco hecho, al punto o bien cocido) y notas especiales.',
    onboardingStep3Title: 'Finalice y Muestre al Camarero',
    onboardingStep3Desc: 'Al terminar sus elecciones, simplemente llame al camarero. Su comanda se mostrará en portugués para un ingreso inmediato y sin errores al sistema.',
    startExploring: 'Comenzar a Explorar la Carta',
    skipIntro: 'Omitir Introducción',
    next: 'Siguiente',
    back: 'Atrás',
    searchPlaceholder: 'Buscar plato, ingrediente o bebida...',
    allCategories: 'Todas las Categorías',
    regionalOnly: '🌿 Especialidades Amazónicas',
    filterByDoneness: 'Término de Carne',
    addToOrder: 'Agregar',
    customizationTitle: 'Personalizar Plato',
    selectMeatPoint: 'Seleccione el Término de la Carne:',
    meatPointRare: 'Poco Hecho',
    meatPointRareDesc: 'Sellado por fuera, centro rojo y muy jugoso',
    meatPointMedium: 'Al Punto',
    meatPointMediumDesc: 'Dorado por fuera, centro rosado y tierno',
    meatPointWellDone: 'Bien Cocido',
    meatPointWellDoneDesc: 'Totalmente cocido de manera uniforme',
    specialInstructions: 'Observaciones Especiales (opcional):',
    specialInstructionsPlaceholder: 'Ej: Sin cebolla, aderezo aparte, hielo y limón separado...',
    confirmAdd: 'Agregar al Pedido',
    cancel: 'Cancelar',
    cartTitle: 'Su Pedido',
    cartEmpty: 'Su carrito está vacío',
    cartEmptySubtitle: 'Explore nuestra carta y agregue sus platos favoritos para comenzar.',
    itemsCount: 'artículos seleccionados',
    subtotal: 'Subtotal:',
    total: 'Total Estimado:',
    customerNameLabel: 'Su Nombre:',
    customerNamePlaceholder: '¿Cómo podemos llamarle?',
    tableNumberLabel: 'Número de Mesa (opcional):',
    tableNumberPlaceholder: 'Ej: 14',
    finalizeButton: 'Finalizar Pedido y Llamar Camarero',
    callWaiterTitle: '¡Su Pedido está Listo!',
    callWaiterInstructions: 'Por favor, muestre esta pantalla a su camarero para que ingrese sus selecciones directamente al sistema del restaurante.',
    waiterTicketHeader: 'COMANDA OFICIAL PARA EL CAMARERO (EM PORTUGUÊS)',
    waiterTicketSubheader: 'Formateada en portugués para lanzamiento directo al sistema',
    copyTicket: 'Copiar Comanda',
    ticketCopied: '¡Comanda copiada al portapapeles!',
    newOrder: 'Hacer Nuevo Pedido',
    editOrder: 'Modificar Pedido',
    allergensLabel: 'Alérgenos:',
    prepTimeLabel: 'Tiempo estimado:',
    portionWeightLabel: 'Porción:',
    adminReturn: 'Volver al Panel de Gestión',
    helpButton: 'Cómo Ordenar',
  },
};
