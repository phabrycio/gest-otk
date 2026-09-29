import React, { useState, useMemo } from 'react';
import {
  Globe,
  UtensilsCrossed,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Clock,
  Scale,
  Sparkles,
  Flame,
  Fish,
  Wine,
  IceCream,
  CircleDot,
  ChefHat,
  Bell,
  ArrowRight,
  ArrowLeft,
  X,
  Copy,
  Check,
  HelpCircle,
  LogOut,
  Info,
  ShieldCheck,
  ChevronRight,
  Store,
  Layers
} from 'lucide-react';
import customerMenuJson from '../../data/customerMenuData.json';
import {
  SupportedLanguage,
  CustomerMenuItem,
  CartItem,
  MeatCookingPoint,
  CustomerOrderSummary,
} from '../../data/customerMenuTypes';
import { UI_TRANSLATIONS } from '../../data/customerMenuTranslations';

const ALL_MENU_ITEMS = customerMenuJson as CustomerMenuItem[];

interface CustomerVirtualMenuViewProps {
  onExitToApp?: () => void;
}

export const CustomerVirtualMenuView: React.FC<CustomerVirtualMenuViewProps> = ({ onExitToApp }) => {
  // State: Language & Onboarding
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('pt');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('tk_customer_onboarding_done') === 'true';
  });
  const [onboardingStep, setOnboardingStep] = useState<number>(0); // 0 = Language, 1 = Welcome, 2 = Choose & Customise, 3 = Finalize & Call Waiter
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // State: Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyRegional, setOnlyRegional] = useState<boolean>(false);

  // State: Customization Modal
  const [customizingItem, setCustomizingItem] = useState<CustomerMenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [selectedMeatPoint, setSelectedMeatPoint] = useState<MeatCookingPoint>('AO_PONTO');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // State: Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');

  // State: Finalized Order / Comanda em Português
  const [finalizedOrder, setFinalizedOrder] = useState<CustomerOrderSummary | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [waiterCalledAlert, setWaiterCalledAlert] = useState<boolean>(false);

  const t = UI_TRANSLATIONS[selectedLanguage];

  // Categorias disponíveis traduzidas
  const categories = useMemo(() => {
    return [
      { id: 'ALL', label: { pt: 'Todos os Itens', en: 'All Items', es: 'Todos los Platos' }, icon: UtensilsCrossed },
      { id: 'EXECUTIVO', label: { pt: 'Menu Executivo', en: 'Executive Lunch', es: 'Menú Ejecutivo' }, icon: Clock },
      { id: 'PESCADOS_AMAZONIA', label: { pt: 'Pescados Nobres', en: 'Amazonian Fish', es: 'Pescados Amazónicos' }, icon: Fish },
      { id: 'CARNES_BRASIL', label: { pt: 'Carnes & Brasa', en: 'Prime Meats & Grill', es: 'Carnes y Parrilla' }, icon: Flame },
      { id: 'ENTRADAS_PETISCOS', label: { pt: 'Petiscos & Boteco', en: 'Appetizers & Tapas', es: 'Tapas y Entradas' }, icon: CircleDot },
      { id: 'MASSAS_RISOTOS', label: { pt: 'Massas & Pizzas', en: 'Pastas & Pizzas', es: 'Pastas y Pizzas' }, icon: ChefHat },
      { id: 'SOBREMESAS', label: { pt: 'Sobremesas', en: 'Desserts', es: 'Postres' }, icon: IceCream },
      { id: 'BEBIDAS_DRINKS', label: { pt: 'Chopp & Drinks', en: 'Draft Beer & Drinks', es: 'Cerveza y Cócteles' }, icon: Wine },
      { id: 'VINHOS_ESPUMANTES', label: { pt: 'Carta de Vinhos', en: 'Wine List', es: 'Carta de Vinos' }, icon: Sparkles },
      { id: 'CHARCUTARIA', label: { pt: 'Charcutaria', en: 'Charcuterie', es: 'Charcutería' }, icon: Layers },
    ];
  }, []);

  // Filtro de itens do cardápio
  const filteredItems = useMemo(() => {
    return ALL_MENU_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesRegional = !onlyRegional || item.isRegionalAmazonico;

      const title = item.name[selectedLanguage].toLowerCase();
      const desc = item.description[selectedLanguage].toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || title.includes(query) || desc.includes(query);

      return matchesCat && matchesRegional && matchesSearch;
    });
  }, [selectedCategory, onlyRegional, searchQuery, selectedLanguage]);

  // Abertura de modal de item
  const handleOpenItem = (item: CustomerMenuItem) => {
    setCustomizingItem(item);
    setItemQuantity(1);
    setSelectedMeatPoint('AO_PONTO');
    setSpecialNotes('');
  };

  // Adicionar ao carrinho
  const handleAddToCart = () => {
    if (!customizingItem) return;

    const newItem: CartItem = {
      cartId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      menuItem: customizingItem,
      quantity: itemQuantity,
      meatPoint: customizingItem.requiresMeatPoint ? selectedMeatPoint : undefined,
      notes: specialNotes.trim() ? specialNotes.trim() : undefined,
      unitPrice: customizingItem.price,
      totalPrice: customizingItem.price * itemQuantity,
    };

    setCart((prev) => [...prev, newItem]);
    setCustomizingItem(null);
  };

  // Atualizar quantidade no carrinho
  const updateCartQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0
              ? { ...item, quantity: newQty, totalPrice: newQty * item.unitPrice }
              : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  // Total do carrinho
  const cartTotalAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [cart]);

  const cartTotalItemsCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Finalizar pedido e abrir Comanda em Português
  const handleFinalizeOrder = () => {
    if (cart.length === 0) return;

    const summary: CustomerOrderSummary = {
      orderId: `ENG-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName.trim() || 'Cliente na Mesa',
      tableNumber: tableNumber.trim() || 'Mesa Balcão',
      selectedLanguage,
      items: [...cart],
      totalAmount: cartTotalAmount,
    };

    setFinalizedOrder(summary);
    setIsCartOpen(false);
  };

  // Copiar comanda em texto formatado para o garçom
  const handleCopyTicketText = () => {
    if (!finalizedOrder) return;

    const lines = [
      `=========================================`,
      `ENGENHO COZINHA BRASILEIRA — MANAUARA`,
      `COMANDA DO CLIENTE (#${finalizedOrder.orderId})`,
      `Data/Hora: ${finalizedOrder.createdAt}`,
      `Cliente: ${finalizedOrder.customerName}`,
      `Mesa: ${finalizedOrder.tableNumber}`,
      `Idioma original do cliente: ${finalizedOrder.selectedLanguage.toUpperCase()}`,
      `-----------------------------------------`,
      `ITENS DO PEDIDO:`,
    ];

    finalizedOrder.items.forEach((item, idx) => {
      lines.push(`${idx + 1}. [${item.quantity}x] ${item.menuItem.name.pt} — R$ ${item.totalPrice.toFixed(2)}`);
      if (item.meatPoint) {
        const meatLabelPT =
          item.meatPoint === 'MAL_PASSADO'
            ? 'MAL PASSADO'
            : item.meatPoint === 'AO_PONTO'
            ? 'AO PONTO'
            : 'BEM PASSADO';
        lines.push(`   * PONTO DA CARNE: ${meatLabelPT}`);
      }
      if (item.notes) {
        lines.push(`   * OBS: ${item.notes}`);
      }
    });

    lines.push(`-----------------------------------------`);
    lines.push(`TOTAL ESTIMADO: R$ ${finalizedOrder.totalAmount.toFixed(2)}`);
    lines.push(`=========================================`);

    navigator.clipboard.writeText(lines.join('\n'));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Simulação de chamar garçom
  const handleCallWaiter = () => {
    setWaiterCalledAlert(true);
    setTimeout(() => setWaiterCalledAlert(false), 5000);
  };

  // Resetar e novo pedido
  const handleResetOrder = () => {
    setFinalizedOrder(null);
    setCart([]);
    setCustomerName('');
    setTableNumber('');
  };

  // Concluir Onboarding
  const finishOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('tk_customer_onboarding_done', 'true');
    setShowHelpModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* ========================================================================= */}
      {/* TOPO: BARRA SUPERIOR & SELETOR DE IDIOMA                                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo e Nome */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a2e23] via-[#104a37] to-[#15634a] border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-black tracking-tight text-white">
                  Engenho
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  {t.digitalMenuBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Controles: Seletor de Idioma, Ajuda, Carrinho e Saída */}
          <div className="flex items-center gap-2">
            {/* Seletor de Idiomas */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setSelectedLanguage('pt')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedLanguage === 'pt'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Português (Brasil)"
              >
                <span>🇧🇷</span>
                <span className="hidden md:inline">PT</span>
              </button>
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedLanguage === 'en'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                <span>🇺🇸</span>
                <span className="hidden md:inline">EN</span>
              </button>
              <button
                onClick={() => setSelectedLanguage('es')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedLanguage === 'es'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Español"
              >
                <span>🇪🇸</span>
                <span className="hidden md:inline">ES</span>
              </button>
            </div>

            {/* Botão de Ajuda / Onboarding */}
            <button
              onClick={() => {
                setOnboardingStep(1);
                setShowHelpModal(true);
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
              title={t.helpButton}
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Botão do Carrinho */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">{t.cartTitle}</span>
              {cartTotalItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 text-[11px] font-black flex items-center justify-center">
                  {cartTotalItemsCount}
                </span>
              )}
            </button>

            {/* Botão de Retorno Gerencial */}
            {onExitToApp && (
              <button
                onClick={onExitToApp}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors cursor-pointer"
                title={t.adminReturn}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MODAL DE ONBOARDING MULTI-IDIOMA (PRIMEIRO ACESSO OU AJUDA)               */}
      {/* ========================================================================= */}
      {(!hasCompletedOnboarding || showHelpModal) && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={finishOnboarding}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 border border-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Passo 0: Escolha de Idioma */}
            {onboardingStep === 0 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center mx-auto shadow-inner">
                  <Globe className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-black text-white">
                    {t.selectLanguageTitle}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {t.selectLanguageDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedLanguage('pt');
                      setOnboardingStep(1);
                    }}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500 transition-all text-center space-y-2 cursor-pointer group"
                  >
                    <div className="text-3xl">🇧🇷</div>
                    <div className="font-bold text-sm text-white group-hover:text-emerald-300">Português</div>
                    <div className="text-[10px] text-slate-400">Cardápio em PT-BR</div>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedLanguage('en');
                      setOnboardingStep(1);
                    }}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500 transition-all text-center space-y-2 cursor-pointer group"
                  >
                    <div className="text-3xl">🇺🇸</div>
                    <div className="font-bold text-sm text-white group-hover:text-blue-300">English</div>
                    <div className="text-[10px] text-slate-400">Full English Menu</div>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedLanguage('es');
                      setOnboardingStep(1);
                    }}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-500 transition-all text-center space-y-2 cursor-pointer group"
                  >
                    <div className="text-3xl">🇪🇸</div>
                    <div className="font-bold text-sm text-white group-hover:text-amber-300">Español</div>
                    <div className="text-[10px] text-slate-400">Carta en Español</div>
                  </button>
                </div>
              </div>
            )}

            {/* Passo 1: Boas-vindas & Conceito */}
            {onboardingStep === 1 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto shadow-inner">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-black text-white">
                    {t.onboardingStep1Title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                    {t.onboardingStep1Desc}
                  </p>
                </div>

                <div className="bg-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 text-left border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>{t.officialCatalogBadge}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {t.officialCatalogDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setOnboardingStep(0)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    {t.back}
                  </button>
                  <button
                    onClick={() => setOnboardingStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>{t.next}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Passo 2: Escolha & Personalização */}
            {onboardingStep === 2 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/40 flex items-center justify-center mx-auto shadow-inner">
                  <Flame className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-black text-white">
                    {t.onboardingStep2Title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                    {t.onboardingStep2Desc}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mx-auto mb-1" />
                    <span className="font-bold text-white text-[11px]">{t.meatPointRare}</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mx-auto mb-1" />
                    <span className="font-bold text-white text-[11px]">{t.meatPointMedium}</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mx-auto mb-1" />
                    <span className="font-bold text-white text-[11px]">{t.meatPointWellDone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setOnboardingStep(1)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    {t.back}
                  </button>
                  <button
                    onClick={() => setOnboardingStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>{t.next}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Passo 3: Finalização & Atendente */}
            {onboardingStep === 3 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-black text-white">
                    {t.onboardingStep3Title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                    {t.onboardingStep3Desc}
                  </p>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-200 text-left space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.smartTicketTranslationTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {t.smartTicketTranslationDesc}
                  </p>
                </div>

                <button
                  onClick={finishOnboarding}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm transition-all shadow-lg cursor-pointer"
                >
                  {t.startExploring}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CORPO PRINCIPAL DO CARDÁPIO DIGITAL                                      */}
      {/* ========================================================================= */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
        {/* Banner de Boas-vindas da Casa */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#07241b] via-[#0a2e23] to-[#041912] border border-emerald-900/60 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 rounded-full inline-block">
              Engenho Cozinha Brasileira • Manauara
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white leading-tight">
              {selectedLanguage === 'pt' && 'Descubra os Sabores Autênticos do Brasil e da Amazônia'}
              {selectedLanguage === 'en' && 'Discover Authentic Flavors of Brazil and the Amazon'}
              {selectedLanguage === 'es' && 'Descubra los Sabores Auténticos de Brasil y la Amazonía'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              {selectedLanguage === 'pt' && 'Parrilla nobre a carvão, tambaquis e pirarucus frescos de manejo sustentável, chopps geladíssimos e alta coquetelaria regional.'}
              {selectedLanguage === 'en' && 'Artisanal charcoal grill, wild sustainable Amazonian fish, sub-zero draft beer, and signature regional cocktails.'}
              {selectedLanguage === 'es' && 'Parrilla tradicional a carbón, pescados amazónicos sustentables, cerveza tirada bajo cero y coctelería regional de autor.'}
            </p>
          </div>
        </div>

        {/* Barra de Busca e Filtro Rápido */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setOnlyRegional(!onlyRegional)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
              onlyRegional
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <span>{t.regionalOnly}</span>
          </button>
        </div>

        {/* Carrossel de Categorias */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label[selectedLanguage]}</span>
              </button>
            );
          })}
        </div>

        {/* Grade de Produtos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              {filteredItems.length} {selectedLanguage === 'pt' ? 'pratos encontrados' : selectedLanguage === 'en' ? 'dishes found' : 'platos encontrados'}
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 space-y-3">
              <UtensilsCrossed className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">
                {selectedLanguage === 'pt' && 'Nenhum prato encontrado com esses termos'}
                {selectedLanguage === 'en' && 'No dishes found matching your search'}
                {selectedLanguage === 'es' && 'No se encontraron platos con esa búsqueda'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setOnlyRegional(false);
                }}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                {selectedLanguage === 'pt' ? 'Limpar filtros' : selectedLanguage === 'en' ? 'Clear filters' : 'Limpiar filtros'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-slate-700 hover:shadow-xl transition-all group"
                >
                  <div className="flex gap-4 items-start">
                    {/* Imagem do Prato */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 relative shadow-inner">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name[selectedLanguage]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-800">
                          <UtensilsCrossed className="w-8 h-8 text-slate-600" />
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                          {item.subcategory}
                        </span>
                        {item.isRegionalAmazonico && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                            {t.regionalBadge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold font-serif text-white tracking-tight leading-snug">
                        {item.name[selectedLanguage]}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {item.description[selectedLanguage]}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {item.prepTimeMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Scale className="w-3 h-3 text-slate-500" /> {item.portionWeightGrams}g
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rodapé com Preço e Botão Adicionar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">{t.priceLabel}</p>
                      <p className="text-lg font-black text-amber-400">
                        R$ {item.price.toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenItem(item)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.addToOrder}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL DE PERSONALIZAÇÃO DE ITEM (PONTO DA CARNE & OBSERVAÇÕES)           */}
      {/* ========================================================================= */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCustomizingItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 border border-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Imagem e Título */}
            <div className="flex gap-4 items-center">
              {customizingItem.imageUrl && (
                <img
                  src={customizingItem.imageUrl}
                  alt={customizingItem.name[selectedLanguage]}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-700 shrink-0"
                />
              )}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-md inline-block">
                  {customizingItem.subcategory}
                </span>
                <h3 className="text-lg font-serif font-black text-white">
                  {customizingItem.name[selectedLanguage]}
                </h3>
                <p className="text-base font-bold text-amber-400">
                  R$ {customizingItem.price.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-800">
              {customizingItem.description[selectedLanguage]}
            </p>

            {/* Seletor de Ponto da Carne (se o item exigir) */}
            {customizingItem.requiresMeatPoint && (
              <div className="space-y-3 pt-1">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>{t.selectMeatPoint}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMeatPoint('MAL_PASSADO')}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedMeatPoint === 'MAL_PASSADO'
                        ? 'bg-rose-950/70 border-rose-500 text-white shadow-xs'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-xs text-rose-400">{t.meatPointRare}</span>
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {t.meatPointRareDesc}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMeatPoint('AO_PONTO')}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedMeatPoint === 'AO_PONTO'
                        ? 'bg-amber-950/70 border-amber-500 text-white shadow-xs'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-xs text-amber-400">{t.meatPointMedium}</span>
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {t.meatPointMediumDesc}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMeatPoint('BEM_PASSADO')}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedMeatPoint === 'BEM_PASSADO'
                        ? 'bg-slate-700/80 border-slate-400 text-white shadow-xs'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-xs text-slate-200">{t.meatPointWellDone}</span>
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {t.meatPointWellDoneDesc}
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Campo de Observações Especiais */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200">
                {t.specialInstructions}
              </label>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder={t.specialInstructionsPlaceholder}
                rows={2}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Quantidade e Confirmação */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center bg-slate-800 rounded-2xl border border-slate-700 p-1">
                <button
                  type="button"
                  onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-black text-sm text-white">
                  {itemQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setItemQuantity((q) => q + 1)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
              >
                <span>{t.confirmAdd}</span>
                <span>• R$ {(customizingItem.price * itemQuantity).toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER / MODAL DO CARRINHO DE PEDIDO                                     */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl">
            {/* Header do Carrinho */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-black text-base text-white">
                  {t.cartTitle}
                </h3>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
                  {cartTotalItemsCount} {t.itemsCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 border border-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de Itens do Carrinho */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">{t.cartEmpty}</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {t.cartEmptySubtitle}
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white">
                          {item.menuItem.name[selectedLanguage]}
                        </h4>
                        <p className="text-[10px] text-amber-400 font-semibold">
                          R$ {item.unitPrice.toFixed(2)} / un
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Detalhes de Ponto e Notas */}
                    {(item.meatPoint || item.notes) && (
                      <div className="bg-slate-900/80 p-2 rounded-xl text-[11px] space-y-1 border border-slate-750">
                        {item.meatPoint && (
                          <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>
                              {selectedLanguage === 'pt' && (item.meatPoint === 'MAL_PASSADO' ? 'Mal Passado' : item.meatPoint === 'AO_PONTO' ? 'Ao Ponto' : 'Bem Passado')}
                              {selectedLanguage === 'en' && (item.meatPoint === 'MAL_PASSADO' ? 'Rare' : item.meatPoint === 'AO_PONTO' ? 'Medium' : 'Well Done')}
                              {selectedLanguage === 'es' && (item.meatPoint === 'MAL_PASSADO' ? 'Poco Hecho' : item.meatPoint === 'AO_PONTO' ? 'Al Punto' : 'Bien Cocido')}
                            </span>
                          </div>
                        )}
                        {item.notes && (
                          <p className="text-slate-400 italic">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    )}

                    {/* Controle de Qtd */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center bg-slate-900 rounded-xl border border-slate-700">
                        <button
                          onClick={() => updateCartQty(item.cartId, -1)}
                          className="p-1.5 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 font-bold text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.cartId, 1)}
                          className="p-1.5 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-black text-sm text-white">
                        R$ {item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rodapé: Nome, Mesa e Botão Finalizar */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-800 bg-slate-900/95 space-y-4 shadow-xl">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      {t.customerNameLabel}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t.customerNamePlaceholder}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      {t.tableNumberLabel}
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder={t.tableNumberPlaceholder}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{t.subtotal}</span>
                    <span>R$ {cartTotalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-black text-white">
                    <span>{t.total}</span>
                    <span className="text-amber-400">R$ {cartTotalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleFinalizeOrder}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                >
                  <Bell className="w-4 h-4 text-slate-950" />
                  <span>{t.finalizeButton}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TELA DE FINALIZAÇÃO & COMANDA EM PORTUGUÊS PARA O ATENDENTE / GARÇOM       */}
      {/* ========================================================================= */}
      {finalizedOrder && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
            {/* Aviso no Idioma do Cliente */}
            <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 text-center space-y-1.5">
              <div className="inline-flex p-2 bg-amber-400/20 text-amber-300 rounded-xl mb-1">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-black text-amber-300">
                {t.callWaiterTitle}
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed max-w-md mx-auto">
                {t.callWaiterInstructions}
              </p>
            </div>

            {/* ALERTA DE GARÇOM CHAMADO */}
            {waiterCalledAlert && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl text-center text-xs text-emerald-300 font-bold animate-fade-in">
                {t.waiterCalledAlertPrefix}{finalizedOrder.tableNumber}{t.waiterCalledAlertSuffix}
              </div>
            )}

            {/* COMANDA OFICIAL EM PORTUGUÊS PARA O GARÇOM / PDV */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl border border-slate-200 font-mono text-xs">
              {/* Header da Comanda */}
              <div className="border-b-2 border-dashed border-slate-300 pb-3 text-center space-y-1">
                <p className="font-black text-sm tracking-wider uppercase text-slate-950">
                  ENGENHO COZINHA BRASILEIRA
                </p>
                <p className="text-[10px] text-slate-500 font-sans">
                  Manauara Shopping • Pedido do Cliente (Tablet / QR Code)
                </p>
                <div className="flex items-center justify-between text-[11px] pt-2 text-slate-700 font-bold font-sans">
                  <span>MESA: <strong className="text-black text-sm">{finalizedOrder.tableNumber}</strong></span>
                  <span>HORA: <strong>{finalizedOrder.createdAt}</strong></span>
                </div>
                <div className="text-left text-[11px] text-slate-700 font-sans">
                  <span>CLIENTE: <strong className="text-black">{finalizedOrder.customerName}</strong></span>
                </div>
              </div>

              {/* Lista dos Itens 100% em Português */}
              <div className="space-y-3 py-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                  ITENS PARA LANÇAMENTO NO SISTEMA (TEKNISA):
                </p>

                {finalizedOrder.items.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-2 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-slate-950">
                        {item.quantity}x {item.menuItem.name.pt}
                      </span>
                      <span className="font-bold text-slate-900">
                        R$ {item.totalPrice.toFixed(2)}
                      </span>
                    </div>

                    {/* Ponto da carne formatado em Português */}
                    {item.meatPoint && (
                      <p className="text-rose-700 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded-sm inline-block">
                        ➔ PONTO DA CARNE:{' '}
                        {item.meatPoint === 'MAL_PASSADO'
                          ? 'MAL PASSADO'
                          : item.meatPoint === 'AO_PONTO'
                          ? 'AO PONTO'
                          : 'BEM PASSADO'}
                      </p>
                    )}

                    {/* Observação especial do cliente */}
                    {item.notes && (
                      <p className="text-slate-600 text-[11px] italic bg-slate-50 px-2 py-0.5 rounded-sm">
                        ➔ OBS: {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Total da Comanda */}
              <div className="border-t-2 border-dashed border-slate-300 pt-3 flex items-center justify-between text-base font-black text-slate-950">
                <span>TOTAL A LANÇAR:</span>
                <span className="text-emerald-700">R$ {finalizedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Ações da Tela */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleCallWaiter}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Bell className="w-4 h-4" />
                <span>{t.callWaiterAtTable}</span>
              </button>

              <button
                onClick={handleCopyTicketText}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-all"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? t.ticketCopied : t.copyTicket}</span>
              </button>

              <button
                onClick={handleResetOrder}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                {t.newOrder}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerVirtualMenuView;
