// ============================================================================
// TIPOS DO CARDÁPIO VIRTUAL MULTI-IDIOMA DO CLIENTE (PT / EN / ES)
// Engenho Cozinha Brasileira — Manauara Shopping
// ============================================================================

export type SupportedLanguage = 'pt' | 'en' | 'es';

export interface LocalizedString {
  pt: string;
  en: string;
  es: string;
}

export type MeatCookingPoint = 'MAL_PASSADO' | 'AO_PONTO' | 'BEM_PASSADO';

export interface CustomerMenuItem {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  category: string;
  majorCategory: string;
  subcategory: string;
  price: number;
  imageUrl: string | null;
  prepTimeMinutes: number;
  portionWeightGrams: number;
  isRegionalAmazonico: boolean;
  requiresMeatPoint: boolean;
  allergens: string[];
}

export interface CartItem {
  cartId: string;
  menuItem: CustomerMenuItem;
  quantity: number;
  meatPoint?: MeatCookingPoint;
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerOrderSummary {
  orderId: string;
  createdAt: string;
  customerName: string;
  tableNumber: string;
  selectedLanguage: SupportedLanguage;
  items: CartItem[];
  totalAmount: number;
}
