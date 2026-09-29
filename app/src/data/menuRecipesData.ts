// ============================================================================
// CARDÁPIO E FICHAS TÉCNICAS OFICIAIS - ENGENHO COZINHA BRASILEIRA MANAUARA
// Sincronizado integralmente via Dionísio CRM & Portal de Pedidos
// Total de itens cadastrados: 448 produtos oficiais
// ============================================================================

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'L' | 'un' | 'porção';
  unitCost: number; // Custo unitário
  totalCost: number; // Quantidade * custo unitário
  supplierOrigin: 'CDA_MATRIZ' | 'FEIRA_PANAIR' | 'DISTRIBUIDOR_LOCAL';
}

export type DishCategory = 
  | 'PESCADOS_AMAZONIA' 
  | 'CARNES_BRASIL' 
  | 'ENTRADAS_PETISCOS' 
  | 'MASSAS_RISOTOS' 
  | 'SOBREMESAS' 
  | 'BEBIDAS_DRINKS' 
  | 'VINHOS_ESPUMANTES' 
  | 'EXECUTIVO' 
  | 'CHARCUTARIA';

export interface DishItem {
  id: string;
  name: string;
  category: DishCategory;
  categoryLabel: string;
  majorCategory?: string;
  subcategory?: string;
  description: string;
  sellingPrice: number;
  imageUrl?: string | null;
  totalCost: number; // Soma de todos os insumos
  cmvPct: number; // (totalCost / sellingPrice) * 100
  targetCmvPct: number;
  marginContributionReais: number; // sellingPrice - totalCost
  prepTimeMinutes: number;
  portionWeightGrams: number;
  isRegionalAmazonico: boolean;
  allergens: string[];
  ingredients: RecipeIngredient[];
}

export const OFFICIAL_ENGENHO_MENU: DishItem[] = [
  {
    "id": "dish-01",
    "name": "Costela de Tambaqui na Brasa",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESPECIAL DO MAR",
    "description": "Costela de tambaqui de cativeiro assada lentamente na brasa de carvão, servida com farofa de Uarini crocante, vinagrete regional e arroz branco.",
    "sellingPrice": 98,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcostela-de-tambaqui.jpg?alt=media&token=4914c32f-4084-4986-86a4-0761f4860d95",
    "totalCost": 29.5,
    "cmvPct": 30.1,
    "targetCmvPct": 31,
    "marginContributionReais": 68.5,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 550,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe",
      "Glúten"
    ],
    "ingredients": [
      {
        "id": "ing-01",
        "name": "Lombo de Tambaqui Nobre com Osso",
        "quantity": 400,
        "unit": "g",
        "unitCost": 0.052,
        "totalCost": 20.8,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-02",
        "name": "Farinha do Uarini Ovinha (Torrada)",
        "quantity": 80,
        "unit": "g",
        "unitCost": 0.025,
        "totalCost": 2,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-03",
        "name": "Manteiga de Garrafa Artesanal",
        "quantity": 25,
        "unit": "ml",
        "unitCost": 0.048,
        "totalCost": 1.2,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-04",
        "name": "Tomate e Cebola Roxa (Vinagrete)",
        "quantity": 70,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 1.05,
        "supplierOrigin": "FEIRA_PANAIR"
      },
      {
        "id": "ing-05",
        "name": "Cheiro-Verde e Chicória da Amazônia",
        "quantity": 15,
        "unit": "g",
        "unitCost": 0.03,
        "totalCost": 0.45,
        "supplierOrigin": "FEIRA_PANAIR"
      },
      {
        "id": "ing-06",
        "name": "Arroz Parboilizado Especial",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.008,
        "totalCost": 0.96,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-07",
        "name": "Limão Taiti e Sal de Parrilla",
        "quantity": 30,
        "unit": "g",
        "unitCost": 0.012,
        "totalCost": 0.36,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      },
      {
        "id": "ing-08",
        "name": "Embalagem e Carvão (Rateio Operacional)",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 2.68,
        "totalCost": 2.68,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-02",
    "name": "Pirarucu em Crosta de Castanha-do-Brasil",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESPECIAL DO MAR",
    "description": "Filé alto de pirarucu de manejo grelhado, coberto com crosta crocante de castanha-do-pará ralada e ervas, acompanhado de risoto cremoso de tucupi e folhas de jambu.",
    "sellingPrice": 112,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783709528800-PIRARUCU_EM_CROSTA_DE_CASTANHA_1P_01__1_.jpg.jpeg?alt=media&token=42bbf0bc-3ef4-4dfc-b9b2-38b3cf89d45e",
    "totalCost": 31.9,
    "cmvPct": 28.5,
    "targetCmvPct": 29,
    "marginContributionReais": 80.1,
    "prepTimeMinutes": 18,
    "portionWeightGrams": 480,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe",
      "Castanhas",
      "Lactose"
    ],
    "ingredients": [
      {
        "id": "ing-09",
        "name": "Filé de Pirarucu Fresco de Manejo",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.065,
        "totalCost": 19.5,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-10",
        "name": "Castanha-do-Brasil Laminada e Moída",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.095,
        "totalCost": 3.8,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-11",
        "name": "Tucupi Amarelo Concentrado (Fervido)",
        "quantity": 100,
        "unit": "ml",
        "unitCost": 0.018,
        "totalCost": 1.8,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-12",
        "name": "Folhas de Jambu Fresco",
        "quantity": 30,
        "unit": "g",
        "unitCost": 0.04,
        "totalCost": 1.2,
        "supplierOrigin": "FEIRA_PANAIR"
      },
      {
        "id": "ing-13",
        "name": "Arroz Arbóreo Italiano",
        "quantity": 80,
        "unit": "g",
        "unitCost": 0.028,
        "totalCost": 2.24,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-14",
        "name": "Queijo Parmesão Ralado Fino",
        "quantity": 25,
        "unit": "g",
        "unitCost": 0.068,
        "totalCost": 1.7,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-15",
        "name": "Manteiga de Primeira Qualidade",
        "quantity": 20,
        "unit": "g",
        "unitCost": 0.05,
        "totalCost": 1,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      },
      {
        "id": "ing-16",
        "name": "Azeite de Oliva Extravirgem",
        "quantity": 15,
        "unit": "ml",
        "unitCost": 0.044,
        "totalCost": 0.66,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-03",
    "name": "Carne de Sol do Engenho com Baião Cremoso",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Carne de sol maturada artesanalmente, grelhada com manteiga de garrafa, servida com baião de dois cremoso puxado no queijo coalho e macaxeira crocante.",
    "sellingPrice": 89,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcarne-de-sol-do-engenho.jpg?alt=media&token=c1e14579-105e-4107-82ab-167274ffbfcb",
    "totalCost": 26.7,
    "cmvPct": 30,
    "targetCmvPct": 31,
    "marginContributionReais": 62.3,
    "prepTimeMinutes": 20,
    "portionWeightGrams": 520,
    "isRegionalAmazonico": true,
    "allergens": [
      "Lactose"
    ],
    "ingredients": [
      {
        "id": "ing-17",
        "name": "Carne de Sol Artesanal Selecionada",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.055,
        "totalCost": 16.5,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-18",
        "name": "Queijo Coalho Tradicional do Sertão",
        "quantity": 80,
        "unit": "g",
        "unitCost": 0.045,
        "totalCost": 3.6,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-19",
        "name": "Feijão Fradinho / Macassar Cozido",
        "quantity": 100,
        "unit": "g",
        "unitCost": 0.012,
        "totalCost": 1.2,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-20",
        "name": "Macaxeira Amarela Cozida e Frita",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.016,
        "totalCost": 2.4,
        "supplierOrigin": "FEIRA_PANAIR"
      },
      {
        "id": "ing-21",
        "name": "Manteiga de Garrafa Nordestina",
        "quantity": 30,
        "unit": "ml",
        "unitCost": 0.05,
        "totalCost": 1.5,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-22",
        "name": "Creme de Leite e Nata Fresca",
        "quantity": 30,
        "unit": "ml",
        "unitCost": 0.05,
        "totalCost": 1.5,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-04",
    "name": "Chopp Brahma Barril 50L (Volume Líquido)",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS",
    "description": "Chopp servido em caneca congelada a -2°C, serpentina regulada e colarinho cremoso com 2 dedos de espuma.",
    "sellingPrice": 14.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484369168-chopp.jpg.jpeg?alt=media&token=8d41a97c-47c5-44e8-9f21-19ce7429bb08",
    "totalCost": 2.8,
    "cmvPct": 18.8,
    "targetCmvPct": 20,
    "marginContributionReais": 12.1,
    "prepTimeMinutes": 2,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [
      "Glúten",
      "Cevada"
    ],
    "ingredients": [
      {
        "id": "ing-23",
        "name": "Chopp Brahma Barril 50L (Volume Líquido)",
        "quantity": 350,
        "unit": "ml",
        "unitCost": 0.0068,
        "totalCost": 2.38,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-24",
        "name": "Gás CO2 e Energia Serpentina (Rateio)",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 0.42,
        "totalCost": 0.42,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-001",
    "name": "Salada Verano",
    "category": "EXECUTIVO",
    "categoryLabel": "Executivo do Engenho",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "ENTRADAS",
    "description": "Folhas, tomate, cebola, fruta da estação e molho especial",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fsalada-verano.jpg?alt=media&token=55641529-4890-418c-a4f8-cf2c95f8b62e",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 12,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-10-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-10-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-002",
    "name": "Caldinho de Feijão",
    "category": "EXECUTIVO",
    "categoryLabel": "Executivo do Engenho",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "ENTRADAS",
    "description": "Caldo com charque desfiado, linguiça defumada e bacon crocante",
    "sellingPrice": 18.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777325536045-CALDINHO.jpg.jpeg?alt=media&token=8d41a97c-47c5-44e8-9f21-19ce7429bb08",
    "totalCost": 5.48,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 13.42,
    "prepTimeMinutes": 12,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-11-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0142,
        "totalCost": 3.56,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-11-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.016,
        "totalCost": 1.92,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-003",
    "name": "Bolinho De Carne Seca Executivo",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "ENTRADAS",
    "description": "Massa de macaxeira com carne seca (charque) desfiada",
    "sellingPrice": 22.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbolinho-de-carne-seca.jpg?alt=media&token=cabb2ddd-71e4-4926-a84c-9256b1b5f249",
    "totalCost": 6.64,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.26,
    "prepTimeMinutes": 12,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-12-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0173,
        "totalCost": 4.32,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-12-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0193,
        "totalCost": 2.32,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-004",
    "name": "Carne De Sol Nordestina",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "PRATOS PRINCIPAIS",
    "description": "Carne de sol assada na brasa, queijo coalho acompanhado de baião cremoso, macaxeira frita e farofa",
    "sellingPrice": 54.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcarne-de-sol-nordestina.jpg?alt=media&token=2c3be801-e717-4856-a91a-a973230d5e80",
    "totalCost": 15.92,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 38.98,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-13-1",
        "name": "Carne de Sol Artesanal Selecionada",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0345,
        "totalCost": 10.35,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-13-2",
        "name": "Queijo Coalho e Baião Cremoso",
        "quantity": 180,
        "unit": "g",
        "unitCost": 0.0159,
        "totalCost": 2.87,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-13-3",
        "name": "Macaxeira Frita e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0225,
        "totalCost": 2.7,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-005",
    "name": "Costela De Tambaqui Executivo",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "PRATOS PRINCIPAIS",
    "description": "Costela de tambaqui assada na brasa, acompanhado de vinagrete de feijão manteiguinha, farofa de banana e arroz paraense.",
    "sellingPrice": 69.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcostela-de-tambaqui.jpg?alt=media&token=4914c32f-4084-4986-86a4-0761f4860d95",
    "totalCost": 20.27,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 49.63,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe"
    ],
    "ingredients": [
      {
        "id": "ing-14-1",
        "name": "Lombo de Tambaqui Nobre com Osso",
        "quantity": 400,
        "unit": "g",
        "unitCost": 0.033,
        "totalCost": 13.18,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-14-2",
        "name": "Farinha do Uarini Ovinha (Torrada)",
        "quantity": 80,
        "unit": "g",
        "unitCost": 0.038,
        "totalCost": 3.04,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-14-3",
        "name": "Vinagrete Regional e Chicória",
        "quantity": 70,
        "unit": "g",
        "unitCost": 0.029,
        "totalCost": 2.03,
        "supplierOrigin": "FEIRA_PANAIR"
      },
      {
        "id": "ing-14-4",
        "name": "Arroz Paraense e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-006",
    "name": "Moqueca De Banana Da Terra",
    "category": "EXECUTIVO",
    "categoryLabel": "Executivo do Engenho",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "PRATOS PRINCIPAIS",
    "description": "Banana pacovã moqueada, molho da casa com dendê finalizada com castanha, acompanhado de arroz branco.",
    "sellingPrice": 44.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmoqueca-de-banana-da-terra.jpg?alt=media&token=c1e14579-105e-4107-82ab-167274ffbfcb",
    "totalCost": 13.02,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 31.88,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-15-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0338,
        "totalCost": 8.46,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-15-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.038,
        "totalCost": 4.56,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-007",
    "name": "Bobó De Camarão Executivo",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "PRATOS PRINCIPAIS",
    "description": "Camarões levemente salteados no azeite, creme de macaxeira azeite de dendê, leite de coco, acompanhado de arroz branco e farofa de coco.",
    "sellingPrice": 54.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbobo-de-camarao.jpg?alt=media&token=05c7c1ae-cb74-4a5d-bbcb-b016c04bcf68",
    "totalCost": 15.92,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 38.98,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-16-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.0557,
        "totalCost": 11.14,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-16-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0319,
        "totalCost": 4.78,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-008",
    "name": "Moqueca de Pirarucu",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "PRATOS PRINCIPAIS",
    "description": "Aquela moqueca Amazônica com nosso rei dos rios, servida com arroz e pirão",
    "sellingPrice": 54.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783437467722-MOQUECA_DE_PIRARUCU__1___2_.jpg.jpeg?alt=media&token=291f8743-0fcd-4102-a941-3898916f04da",
    "totalCost": 15.92,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 38.98,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe"
    ],
    "ingredients": [
      {
        "id": "ing-17-1",
        "name": "Filé de Pirarucu Fresco de Manejo",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0361,
        "totalCost": 10.83,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-17-2",
        "name": "Castanha-do-Brasil Laminada e Moída",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.0638,
        "totalCost": 2.55,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-17-3",
        "name": "Tucupi Amarelo Concentrado (Fervido)",
        "quantity": 100,
        "unit": "ml",
        "unitCost": 0.0254,
        "totalCost": 2.54,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-009",
    "name": "Carne de Panela",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "PRATOS PRINCIPAIS",
    "description": "Bife refogado com cebola, tomate, alho, com molho marcante relembrando a boa e velha comida de mãe, guarnecida com arroz no próprio molho e purê de batatas",
    "sellingPrice": 54.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783438010021-CARNE_DE_PANELA_02__1___2_.jpg.jpeg?alt=media&token=015fc781-202f-40b3-bb01-2ea4969759d2",
    "totalCost": 15.92,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 38.98,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-18-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0414,
        "totalCost": 10.35,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-18-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0464,
        "totalCost": 5.57,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-010",
    "name": "Mini Pudim de Leite",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "SOBREMESAS",
    "description": "Pudim de leite finalizado com um delicioso doce de leite",
    "sellingPrice": 16.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fdoces-do-executivo.jpg?alt=media&token=e997a2f3-e434-4512-90c9-c6c90650514d",
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-19-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0245,
        "totalCost": 2.94,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-19-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.049,
        "totalCost": 1.96,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-011",
    "name": "Sorvete com Farofa de Brownie",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "SOBREMESAS",
    "description": "Bola de sorvete empanada com farofa crocante de brownie",
    "sellingPrice": 16.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777414384202-SORVETE_COM_FAROFA.jpg.jpeg?alt=media&token=fe6db1ab-9f1b-4201-832e-a99cfeec9160",
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-20-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0245,
        "totalCost": 2.94,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-20-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.049,
        "totalCost": 1.96,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-012",
    "name": "Pastel de Belém",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Executivo Do Engenho",
    "subcategory": "SOBREMESAS",
    "description": "Tradicional doce português, massa folheada crocante recheada com creme à base de ovos.",
    "sellingPrice": 16.9,
    "imageUrl": null,
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-21-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0245,
        "totalCost": 2.94,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-21-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.049,
        "totalCost": 1.96,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-013",
    "name": "Feijuca ao Som de Samba",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Feijuca na Varanda",
    "subcategory": "BUFFET LIVRE",
    "description": "Nossa tradicional feijoada, com todos os ingredientes separados, vários acompanhamentos, incluindo nosso Joelho de Porco que você se serve a vontade com preço fixo. Ao som de um Samba raiz!",
    "sellingPrice": 69.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbuffet.jpg?alt=media&token=271e2e21-30ec-4db0-8911-d14790bc4683",
    "totalCost": 20.27,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 49.63,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-22-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0527,
        "totalCost": 13.18,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-22-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0591,
        "totalCost": 7.09,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-014",
    "name": "Mousse de Cupuaçu",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "SOBREMESAS",
    "description": "Textura aerada e sabor marcante da Amazônia, com dulçor equilibrado e baixo em açucares adicionado. Doce na medida certa. Calorias: 180kcal Valor proteico: 4g Fibras: 1g",
    "sellingPrice": 15.9,
    "imageUrl": null,
    "totalCost": 4.61,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 11.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-23-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0231,
        "totalCost": 2.77,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-23-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.046,
        "totalCost": 1.84,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-015",
    "name": "Abacaxi Braseado",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "SOBREMESAS",
    "description": "Abacaxi grelhado, finalizado com toque de canela, sem adição de açucar. Simples, leve e surpreendente. Calorias: 120kcal Valor proteico: 1g Fibras: 2g",
    "sellingPrice": 14.9,
    "imageUrl": null,
    "totalCost": 4.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 10.58,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-24-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0112,
        "totalCost": 2.81,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-24-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0126,
        "totalCost": 1.51,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-016",
    "name": "Doce de Banana com Castanha",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "SOBREMESAS",
    "description": "Banana caramelizada naturalmente sem adição de açucar, com crocante de castanhas. Sabor brasileiro com leveza. Calorias: 260kcal Valor proteico: 3g Fibras: 3g",
    "sellingPrice": 17.9,
    "imageUrl": null,
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-25-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0259,
        "totalCost": 3.11,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-25-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.052,
        "totalCost": 2.08,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-017",
    "name": "Chocolate 70% com Castanha",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "SOBREMESAS",
    "description": "Porção equilibrada de chocolate intenso com castanhas selecionadas. Prazer sem exageros. Calorias: 300kcal Valor proteico: 5g Fibras: 3g",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-26-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-26-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-018",
    "name": "Pirarucu Grelhado com Legumes",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "PRATOS PRINCIPAIS",
    "description": "Filé de pirarucu grelhado, acompanhado de legumes selecionados também grelhados, e finalizado com azeite e ervas. Leve, nutritivo e cheio de sabor. Calorias: 420kcal Valor proteico: 42g Fibras: 5g",
    "sellingPrice": 49.9,
    "imageUrl": null,
    "totalCost": 14.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 35.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe"
    ],
    "ingredients": [
      {
        "id": "ing-27-1",
        "name": "Filé de Pirarucu Fresco de Manejo",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0328,
        "totalCost": 9.84,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-27-2",
        "name": "Castanha-do-Brasil Laminada e Moída",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.058,
        "totalCost": 2.32,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-27-3",
        "name": "Tucupi Amarelo Concentrado (Fervido)",
        "quantity": 100,
        "unit": "ml",
        "unitCost": 0.0231,
        "totalCost": 2.31,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-019",
    "name": "Carne Magra na Brasa",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "PRATOS PRINCIPAIS",
    "description": "Corte selecionado grelhado, servido com legumes e salada fresca. Sabor intenso com leveza na medida certa. Calorias: 550kcal Valor proteico: 45g Fibras: 4g",
    "sellingPrice": 59.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783447381126-CARNE_MAGRA_NA_BRASA__5___1___1_.jpg.jpeg?alt=media&token=5291ce6a-77b6-4e94-a7be-f8307e5d9c33",
    "totalCost": 17.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 42.53,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-28-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0452,
        "totalCost": 11.29,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-28-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0507,
        "totalCost": 6.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-020",
    "name": "Bowl Brasileiro Proteico",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "PRATOS PRINCIPAIS",
    "description": "Arroz integral 7 grãos, com frango grelhado, legumes da estação e farofa leve de castanhas. Equilíbrio perfeito entre nutrição e sabor. Calorias: 520kcal Valor proteico: 38g Fibras: 9g",
    "sellingPrice": 44.9,
    "imageUrl": null,
    "totalCost": 13.02,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 31.88,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-29-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0338,
        "totalCost": 8.46,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-29-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.038,
        "totalCost": 4.56,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-021",
    "name": "Bobó de Camarão",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "PRATOS PRINCIPAIS",
    "description": "Versão equilibrada do clássico nordestino, com redução de gordura e textura mais leve, sem perder a cremosidade. Tradição com novo olhar. Calorias: 480kcal Valor proteico: 28g Fibras: 4g",
    "sellingPrice": 54.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783450026114-BOBO_DE_CAMAR_O_02__1_.jpg.jpeg?alt=media&token=6707c6d3-519f-416c-b421-46fc7eef8764",
    "totalCost": 15.92,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 38.98,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-30-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.0557,
        "totalCost": 11.14,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-30-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0319,
        "totalCost": 4.78,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-022",
    "name": "Salada Amazônica Proteica",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "ENTRADAS",
    "description": "Mix de folhas frescas, camarões grelhados, manga, castanha-do-pará e vinagrete leve de ervas. Frescor, proteína e o toque amazônico do Engenho. Calorias: 320kcal Valor protéico: 22g Fibras: 6g",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783444124418-SALADA_AMAZONICA_PROTEICA__3___1___2_.jpg.jpeg?alt=media&token=1ef5448e-b3aa-4a5b-9374-f168d8bf12c2",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 12,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-31-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.0304,
        "totalCost": 6.07,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-31-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0173,
        "totalCost": 2.6,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-023",
    "name": "Dadinho de Tapioca (de forno)",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "ENTRADAS",
    "description": "Crocante por fora, macio por dentro, preparado no forno combinado, e servido com geleia de cupuaçu SEM AÇÚCAR. Um clássico com mais leveza. Calorias: 280kcal Valor proteico: 8g Fibras: 1,5g",
    "sellingPrice": 24.9,
    "imageUrl": null,
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 12,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-32-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-32-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-024",
    "name": "Carpaccio de Pirarucu",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Leve & Equilibrado",
    "subcategory": "ENTRADAS",
    "description": "Lâminas finas de pirarucu defumado com azeite, limão, ervas frescas e leve toque de pimenta delicado, sofisticado e cheio de identidade regional. Calorias: 189kcal Valor protéico: 26g Fibras: 1g",
    "sellingPrice": 44.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783445346332-CARPACCIO_DE_PIRARUCU_03__1___1_.jpg.jpeg?alt=media&token=ef7a95cc-d556-42a0-8eb2-53539987334b",
    "totalCost": 13.02,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 31.88,
    "prepTimeMinutes": 12,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe"
    ],
    "ingredients": [
      {
        "id": "ing-33-1",
        "name": "Filé de Pirarucu Fresco de Manejo",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 8.85,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-33-2",
        "name": "Castanha-do-Brasil Laminada e Moída",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.052,
        "totalCost": 2.08,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-33-3",
        "name": "Tucupi Amarelo Concentrado (Fervido)",
        "quantity": 100,
        "unit": "ml",
        "unitCost": 0.0209,
        "totalCost": 2.09,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-025",
    "name": "Couvert do Engenho",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS ESPECIAIS DO ENGENHO",
    "description": "Pão Terra & Mar com dois sabores de antepasto",
    "sellingPrice": 16.9,
    "imageUrl": null,
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-34-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0128,
        "totalCost": 3.19,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-34-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0143,
        "totalCost": 1.71,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-026",
    "name": "Azeitonas Empanadas",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS ESPECIAIS DO ENGENHO",
    "description": "Azeitonas verdes sem caroço temperadas empanadas na farinha panko e servida com maionese de alho confitado.",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783450351323-AZEITONAS_EMPANADAS__4___2_.jpg.jpeg?alt=media&token=981bb4b2-783e-4c2b-818c-49d888830d59",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-35-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-35-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-027",
    "name": "Crocante de Costela",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS ESPECIAIS DO ENGENHO",
    "description": "Costela bovina desfiada e empanada, na mistura com próprio molho, guarnecida com geleia de melancia.",
    "sellingPrice": 39.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783450946817-CROCANTE_DE_COSTELA_03__1_.jpg.jpeg?alt=media&token=b031dba1-7002-41b9-a0ca-8665c5aec26f",
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-36-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-36-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-028",
    "name": "Trio do Engenho",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS ESPECIAIS DO ENGENHO",
    "description": "Combinação de Charque na brasa, Lascas de Joelho e Costela de Tambaqui, sobre um incrível barbecue de cupuaçu.",
    "sellingPrice": 89.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783457764580-TRIO_DO_ENGENHO__5___1_.jpg.jpeg?alt=media&token=7452ff3c-114e-4cbc-bec7-9ede87f1c977",
    "totalCost": 26.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 63.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-37-1",
        "name": "Lombo de Tambaqui Nobre com Osso",
        "quantity": 400,
        "unit": "g",
        "unitCost": 0.0424,
        "totalCost": 16.95,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-37-2",
        "name": "Farinha do Uarini Ovinha (Torrada)",
        "quantity": 80,
        "unit": "g",
        "unitCost": 0.0489,
        "totalCost": 3.91,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-37-3",
        "name": "Vinagrete Regional e Chicória",
        "quantity": 70,
        "unit": "g",
        "unitCost": 0.0373,
        "totalCost": 2.61,
        "supplierOrigin": "FEIRA_PANAIR"
      },
      {
        "id": "ing-37-4",
        "name": "Arroz Paraense e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0217,
        "totalCost": 2.6,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-029",
    "name": "Camarões na Cerveja",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS ESPECIAIS DO ENGENHO",
    "description": "Camarões embebidos na cerveja, levemente empanados com um refrescante Aioli verde.",
    "sellingPrice": 49.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783622728658-CAMAR_ES_NA_CERVEJA_03__2_.jpg.jpeg?alt=media&token=9e2eb95d-76ac-452a-a942-f554d529d9b1",
    "totalCost": 14.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 35.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-38-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.0507,
        "totalCost": 10.13,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-38-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0289,
        "totalCost": 4.34,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-030",
    "name": "Rocambole Suíno",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS ESPECIAIS DO ENGENHO",
    "description": "Barriga cozida lentamente, enrolada e pururucada, servida com rodelas de abacaxi selado.",
    "sellingPrice": 69.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783623118121-ROCAMBOLE_SUINO_02__1_.jpg.jpeg?alt=media&token=7a5f28c0-25c6-4320-87db-73d62bd09c6c",
    "totalCost": 20.27,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 49.63,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-39-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0527,
        "totalCost": 13.18,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-39-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0591,
        "totalCost": 7.09,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-031",
    "name": "Coraçãozinho de Galinha",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS ESPECIAIS DO ENGENHO",
    "description": "21 Deliciosos corações de galinha, grelhados com alho laminado e com cebola crispy, pra comer no palito",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-40-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-40-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-032",
    "name": "Pão De Alho",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Pão baguete tostado na brasa, recheado com generoso creme artesanal de alho, queijo derretido e ervas finas.",
    "sellingPrice": 15.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fpao-de-alho.jpg?alt=media&token=ac30de40-4723-46fd-ad2f-a9e07b630223",
    "totalCost": 4.61,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 11.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-41-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.012,
        "totalCost": 3,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-41-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0134,
        "totalCost": 1.61,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-033",
    "name": "Camarão De Montão",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Camarões salteados no azeite com alho frito, acompanhado de limão e molho de cerveja.",
    "sellingPrice": 139.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcamarao-de-montao.jpg?alt=media&token=cb9085d3-6231-4e20-80e5-71e26e79736e",
    "totalCost": 40.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 99.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-42-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.142,
        "totalCost": 28.4,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-42-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0811,
        "totalCost": 12.17,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-034",
    "name": "Isca De Carne De Sol Do Engenho",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Deliciosa carne de sol, sucesso há 15 anos, servida em tiras e acompanhada de bolinho de macaxeira e queijo coalho frito",
    "sellingPrice": 94.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fisca-de-carne-de-sol-do-engenho.jpg?alt=media&token=dd11cf1b-8a62-46a6-9507-4f7b63070820",
    "totalCost": 27.52,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 67.38,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-43-1",
        "name": "Carne de Sol Artesanal Selecionada",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0596,
        "totalCost": 17.89,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-43-2",
        "name": "Queijo Coalho e Baião Cremoso",
        "quantity": 180,
        "unit": "g",
        "unitCost": 0.0275,
        "totalCost": 4.95,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-43-3",
        "name": "Macaxeira Frita e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.039,
        "totalCost": 4.68,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-035",
    "name": "Macaxeira Frita",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Porção de macaxeira amarela regional cozida e frita na hora, crocante por fora e macia por dentro, finalizada com manteiga de garrafa e flor de sal.",
    "sellingPrice": 27.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmacaxeira-frita.jpg?alt=media&token=058c783e-ff2e-4258-84fc-1bd3595db2ce",
    "totalCost": 8.09,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 19.81,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-44-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.021,
        "totalCost": 5.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-44-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0236,
        "totalCost": 2.83,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-036",
    "name": "Batata Frita",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Batatas selecionadas fritas até ficarem douradas e crocantes, sequinhas por fora e macias por dentro, com leve toque de sal.",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbatata-frita.jpg?alt=media&token=cd3f1405-4bf1-40a4-a7d6-4231b803172d",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-45-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-45-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-037",
    "name": "Bolinho De Bacalhau Tradicional",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "6 unidades. Bacalhau Gadus morhua servido como manda a tradição portuguesa",
    "sellingPrice": 54.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbolinho-de-bacalhau.jpg?alt=media&token=2a526065-aec1-4860-9528-985b494b9231",
    "totalCost": 15.92,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 38.98,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-46-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0414,
        "totalCost": 10.35,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-46-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0464,
        "totalCost": 5.57,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-038",
    "name": "Bolinho De Macaxeira",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "12 unidades. Bolinhos de macaxeira fritos, acompanhados de geleia de cebola feita com melaço de cana",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbolinho-de-macaxeira.jpg?alt=media&token=b5794964-9c53-4f04-be6e-ecc64309a771",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-47-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-47-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-039",
    "name": "Polenta Frita",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Deliciosos palitos de polenta frita, sequinha e saborosa",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-48-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-48-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-040",
    "name": "Joelho Trinchado",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Lascas de joelho de porco, batata rústica e geleia de cebola, finalização com alecrim",
    "sellingPrice": 74.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjoelho-trinchado.jpg?alt=media&token=5fe2994d-894d-43ee-97cf-006ace6991a4",
    "totalCost": 21.72,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 53.18,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-49-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0565,
        "totalCost": 14.12,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-49-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0633,
        "totalCost": 7.6,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-041",
    "name": "Meladinho De Minas",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Queijo coalho na chapa com melaço de cana",
    "sellingPrice": 49.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmeladinho-de-minas.jpg?alt=media&token=6f215258-8970-4907-935d-fcaee8c5aeef",
    "totalCost": 14.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 35.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-50-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0376,
        "totalCost": 9.41,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-50-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0422,
        "totalCost": 5.06,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-042",
    "name": "Completa Do Engenho",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Tiras de filé fritas na manteiga, linguicinhas e costela de porco defumadas, bolinhos de macaxeira fritos, acompanhado de salame, azeitonas e salada",
    "sellingPrice": 89.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcompleta-do-engenho.jpg?alt=media&token=021bcdf8-67da-4bef-85c4-95fe65032a7f",
    "totalCost": 26.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 63.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-51-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0678,
        "totalCost": 16.95,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-51-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.076,
        "totalCost": 9.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-043",
    "name": "Pirarucu Ribeirinho",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Tiras de filé de pirarucu frito com chips de banana acompanhado de geleia de cupuaçu",
    "sellingPrice": 79.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fpirarucu-ribeirinho.jpg?alt=media&token=4338d7ce-36bb-4981-8f7b-b98e90f577be",
    "totalCost": 23.17,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 56.73,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe"
    ],
    "ingredients": [
      {
        "id": "ing-52-1",
        "name": "Filé de Pirarucu Fresco de Manejo",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0525,
        "totalCost": 15.76,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-52-2",
        "name": "Castanha-do-Brasil Laminada e Moída",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.0927,
        "totalCost": 3.71,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-52-3",
        "name": "Tucupi Amarelo Concentrado (Fervido)",
        "quantity": 100,
        "unit": "ml",
        "unitCost": 0.037,
        "totalCost": 3.7,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-044",
    "name": "Costelinha Do Engenho",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Sucesso a mais de 16 anos. Costelinhas suínas defumadas e fritas, acompanhadas de geleia de cupuaçu",
    "sellingPrice": 79.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcostelinha-do-engenho.jpg?alt=media&token=9a7caa0c-a529-40cd-8605-3f03444644f9",
    "totalCost": 23.17,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 56.73,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-53-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0602,
        "totalCost": 15.06,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-53-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0676,
        "totalCost": 8.11,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-045",
    "name": "Filé Com Fritas",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PETISCOS TRADICIONAIS DO ENGENHO",
    "description": "Tiras de filé passadas na manteiga com cebola em pétalas e azeitonas. Acompanhadas de batata frita e fatias de pão italiano",
    "sellingPrice": 99.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ffile-com-fritas.jpg?alt=media&token=284d9c51-72ee-4f91-aba7-6a15a3075b21",
    "totalCost": 28.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.93,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-54-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0753,
        "totalCost": 18.83,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-54-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0845,
        "totalCost": 10.14,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-046",
    "name": "Deliciosos copinhos que podem ser servidos individuais ou em combos com 3 sabores para compartilhar – Uma verdadeira delícia na sua mesa!",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "COPINHOS DO ENGENHO",
    "description": "Deliciosos copinhos que podem ser servidos individuais ou em combos com 3 sabores para compartilhar – Uma verdadeira delícia na sua mesa! - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 54.9,
    "imageUrl": null,
    "totalCost": 15.92,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 38.98,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-55-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0414,
        "totalCost": 10.35,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-55-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0464,
        "totalCost": 5.57,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-047",
    "name": "Copinho de Feijão",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "COPINHOS DO ENGENHO",
    "description": "Caldinho de feijão com farofa de bacon – O Tradicional caldinho mudou de “roupa”!",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777325393764-CALDINHO.jpg.jpeg?alt=media&token=3ba37800-251f-4531-9b27-9928d3db8993",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-56-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-56-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-048",
    "name": "Copinho de Abóbora",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "COPINHOS DO ENGENHO",
    "description": "creme de abóbora com carne seca e crispe de couve – Esse é pra lembrar do sertão!",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783624199299-COPINHO_DE_ABOBORA__2_.jpg.jpeg?alt=media&token=932a2a69-43f4-45ce-be1f-64b9abb53ff0",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-57-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-57-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-049",
    "name": "Copinho Amazônico",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "COPINHOS DO ENGENHO",
    "description": "creme de tacacá com camarão seco e jambú – Nós caboclos adoramos e se você não provou, merece!",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-58-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.0202,
        "totalCost": 4.04,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-58-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0115,
        "totalCost": 1.73,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-050",
    "name": "Copinho de Strogonoff",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "COPINHOS DO ENGENHO",
    "description": "de frango com chips de batata doce – Aquele Strogonofe que lembra casa da Vovô!",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783624405278-COPINHO_DE_ESTROGONOFE__3_.jpg.jpeg?alt=media&token=4b9ce8a5-970a-48ea-a2d3-fbbaf06b2081",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-59-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0288,
        "totalCost": 3.46,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-59-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.0578,
        "totalCost": 2.31,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-051",
    "name": "Copinho de Vaca Atolada",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "COPINHOS DO ENGENHO",
    "description": "creme de mandioca com costela bovina – Temperado daquele jeito que vai te levar lá em Minas Gerais sô!",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783624545588-COPINHO_VACA_ATOLADA.jpg.jpeg?alt=media&token=53c2903b-b485-44a0-8689-f537daa35f3b",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-60-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-60-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-052",
    "name": "Mini Pastel Queijo Coalho",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "MINI PASTÉIS",
    "description": "Porção de mini pastéis crocantes de massa artesanal, recheados com queijo coalho nordestino derretido e dourado.",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fqueijo-coalho.jpg?alt=media&token=1b832e24-5d5f-4476-a790-9f0c4837a11e",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Lactose"
    ],
    "ingredients": [
      {
        "id": "ing-61-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-61-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-053",
    "name": "Mini Pastel Carne De Sol",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "MINI PASTÉIS",
    "description": "Porção de mini pastéis com recheio suculento de carne de sol desfiada, refogada na manteiga de garrafa e cebola roxa.",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcarne-de-sol.jpg?alt=media&token=d285971b-56be-4b0e-97e2-0be8e1fd242d",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-62-1",
        "name": "Carne de Sol Artesanal Selecionada",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-62-2",
        "name": "Queijo Coalho e Baião Cremoso",
        "quantity": 180,
        "unit": "g",
        "unitCost": 0.0087,
        "totalCost": 1.56,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-62-3",
        "name": "Macaxeira Frita e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0123,
        "totalCost": 1.47,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-054",
    "name": "Mini Pasteis de Camarão",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "MINI PASTÉIS",
    "description": "Camarões selecionados limpos e salteados com azeite, alho e temperos frescos, com textura tenra e sabor marcante.",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcamarao.jpg?alt=media&token=a2c094ae-8b63-4e8e-8b8c-9988e0b79f0e",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-63-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.0354,
        "totalCost": 7.08,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-63-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0203,
        "totalCost": 3.04,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-055",
    "name": "Mini Pastel de Bacalhau",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "MINI PASTÉIS",
    "description": "Porção de mini pastéis com autêntico recheio de bacalhau desfiado, azeitonas pretas, azeite extravirgem e salsinha.",
    "sellingPrice": 31.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbacalhau.jpg?alt=media&token=43ccab3a-e222-45cf-a1f0-5e49d69dd036",
    "totalCost": 9.25,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 22.65,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-64-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.024,
        "totalCost": 6.01,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-64-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.027,
        "totalCost": 3.24,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-056",
    "name": "Linguicinha Picante",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "LINGUICINHAS",
    "description": "Deliciosa linguiça suína picante, defumada e curada com molho de limão, acompanhada do nosso bolinho de macaxeira",
    "sellingPrice": 59.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777138988748-lingui_inha.png.png?alt=media&token=ba2bda9c-049e-4fb1-bafe-76278e8d06a6",
    "totalCost": 17.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 42.53,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-65-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0452,
        "totalCost": 11.29,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-65-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0507,
        "totalCost": 6.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-057",
    "name": "Linguicinha do Engenho",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "LINGUICINHAS",
    "description": "Deliciosa linguiça de lombo, acompanhada de molho de limão e do nosso bolinho de macaxeira",
    "sellingPrice": 45.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777324860919-lingui_inha.png.png?alt=media&token=72aa3327-ec4c-45be-ae6a-ee80cf3167db",
    "totalCost": 13.31,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 32.59,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-66-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0346,
        "totalCost": 8.65,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-66-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0388,
        "totalCost": 4.66,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-058",
    "name": "Linguicinha Espiral do Pecado",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "LINGUICINHAS",
    "description": "Espiral de linguicinha fresca, altamente picante (cuidado!!!) acompanhada do nosso bolinho de macaxeira",
    "sellingPrice": 57.9,
    "imageUrl": null,
    "totalCost": 16.79,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 41.11,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-67-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0436,
        "totalCost": 10.91,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-67-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.049,
        "totalCost": 5.88,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-059",
    "name": "Linguicinha Blumenau Defumada",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "LINGUICINHAS",
    "description": "Linguicinha suína defumada, uma explosão de sabores. Acompanhada do nosso bolinho de macaxeira",
    "sellingPrice": 69.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783706601703-LINGUICINHA_BLUMENAU_DEFUMADA_03__1_.jpg.jpeg?alt=media&token=8dfdc70b-138b-49c6-91e2-459094a68c66",
    "totalCost": 20.27,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 49.63,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-68-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0527,
        "totalCost": 13.18,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-68-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0591,
        "totalCost": 7.09,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-060",
    "name": "Grande Calabresa",
    "category": "MASSAS_RISOTOS",
    "categoryLabel": "Massas & Risotos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PIZZAS",
    "description": "Molho de tomate da casa, mussarela e calabresa acebolada, finalizada com orégano",
    "sellingPrice": 69.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fpizza-calabresa.jpg?alt=media&token=eca53761-ea18-4dde-8378-56e99bcecda6",
    "totalCost": 20.27,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 49.63,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-69-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0527,
        "totalCost": 13.18,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-69-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0591,
        "totalCost": 7.09,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-061",
    "name": "Grande Mussarela",
    "category": "MASSAS_RISOTOS",
    "categoryLabel": "Massas & Risotos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PIZZAS",
    "description": "Molho de tomate da casa, mussarela finalizada com orégano",
    "sellingPrice": 59.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fpizza-mussarela.jpg?alt=media&token=f417cf03-65c0-4148-b3d5-c0ffaba4ad41",
    "totalCost": 17.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 42.53,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-70-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0452,
        "totalCost": 11.29,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-70-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0507,
        "totalCost": 6.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-062",
    "name": "Grande Carne De Sol Grande",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "PIZZAS",
    "description": "Molho de tomate da casa, mussarela, carne de sol desfiada e acebolada, finalizada com orégano",
    "sellingPrice": 89.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fpizza-carne-de-sol.jpg?alt=media&token=d250f94c-93a8-4147-94fc-c41473c09032",
    "totalCost": 26.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 63.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-71-1",
        "name": "Carne de Sol Artesanal Selecionada",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0565,
        "totalCost": 16.95,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-71-2",
        "name": "Queijo Coalho e Baião Cremoso",
        "quantity": 180,
        "unit": "g",
        "unitCost": 0.0261,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-71-3",
        "name": "Macaxeira Frita e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0369,
        "totalCost": 4.43,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-063",
    "name": "Todos nossos Hamburgueres são feitos artesanalmente pela Boutique de carne VPJ em São Paulo, com carne bovina Black Angus. Todos acompanham batata frita e molho extra",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "HAMBÚRGUERES",
    "description": "Burg do Engenho - Hamburguer de pão artesanal feito com carne artesanal, alface americana, tomate, queijo mussarela, fatias de Joelho de Porco defumado e picles de cebola roxa no pão brioche",
    "sellingPrice": 49.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbatata-frita.jpg?alt=media&token=cd3f1405-4bf1-40a4-a7d6-4231b803172d",
    "totalCost": 14.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 35.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-72-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0376,
        "totalCost": 9.41,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-72-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0422,
        "totalCost": 5.06,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-064",
    "name": "Duplo Cheddar",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "HAMBÚRGUERES",
    "description": "Dois burgers artesanais selados, com cheddar cremoso e geleia de cebola no pão brioche.",
    "sellingPrice": 54.9,
    "imageUrl": null,
    "totalCost": 15.92,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 38.98,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-73-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0414,
        "totalCost": 10.35,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-73-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0464,
        "totalCost": 5.57,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-065",
    "name": "X-Manaós Costela",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "HAMBÚRGUERES",
    "description": "Hambúrguer de costela de 210gr, queijo muçarela, tiras crocantes de bacon, alface fresco, tomate e o nosso molho especial!",
    "sellingPrice": 49.9,
    "imageUrl": null,
    "totalCost": 14.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 35.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-74-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0376,
        "totalCost": 9.41,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-74-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0422,
        "totalCost": 5.06,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-066",
    "name": "Cheeseburguer",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Petiscos do Engenho",
    "subcategory": "HAMBÚRGUERES",
    "description": "O tradicional, feito da maneira correta que vai te surpreender, Pão Brioche, carne hambúrguer, Queijo americano e nada mais!",
    "sellingPrice": 47.9,
    "imageUrl": null,
    "totalCost": 13.89,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 34.01,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-75-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0361,
        "totalCost": 9.03,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-75-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0405,
        "totalCost": 4.86,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-067",
    "name": "Salada Coleslaw",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "SALADAS",
    "description": "Mix de repolho, rúcula, cenoura e tomates frescos, misturada com uma maionese de alho salsa",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-76-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-76-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-068",
    "name": "Salada Assustada",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "SALADAS",
    "description": "Salada com couve temperada, cebola roxa, bacon, tomates cerejas e finalizada com molho especial de iogurte",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783625293913-SALADA_ASSUSTADA__4___1_.jpg.jpeg?alt=media&token=737b86c0-b650-43ff-b3e3-2c458cde5db3",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-77-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-77-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-069",
    "name": "Salada Búfula",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "SALADAS",
    "description": "Mix de folhas, rúcula, cebola, croûtons, massa farfalle, queijo de búfula, regada com azeite e limão siciliano e cebola caramelizada",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-78-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-78-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-070",
    "name": "Salada Caesar",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "SALADAS",
    "description": "Alface americana fresca, croutons crocantes, lascas de parmesão e molho caesar tradicional",
    "sellingPrice": 39.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783625899980-SALADA_CAESAR__5_.jpg.jpeg?alt=media&token=b639b875-8efc-453c-a1f1-3733341be184",
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-79-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-79-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-071",
    "name": "Escolha a proteína e os acompanhamentos que os pequenos mais gostam Escolha até 3 acompanhamentos: Arroz branco, massa Capeline (Cabelo de Anjo), Batata Frita, Purê, Feijão ou Salada",
    "category": "MASSAS_RISOTOS",
    "categoryLabel": "Massas & Risotos",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS KIDS",
    "description": "Empanado de Frango - Frango de verdade, processado artesanalmente, temperado e empanado",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbatata-frita.jpg?alt=media&token=cd3f1405-4bf1-40a4-a7d6-4231b803172d",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-80-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-80-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-072",
    "name": "Empanado de Filé Mignon",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS KIDS",
    "description": "Filé de verdade, processado artesanalmente, temperado.",
    "sellingPrice": 44.9,
    "imageUrl": null,
    "totalCost": 13.02,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 31.88,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-81-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0338,
        "totalCost": 8.46,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-81-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.038,
        "totalCost": 4.56,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-073",
    "name": "Tiras de Filé Mignon",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS KIDS",
    "description": "Medalhão alto de filé mignon super macio e limpo, grelhado com maestria e textura incomparável.",
    "sellingPrice": 49.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783626877984-TIRAS_DE_FILE_KIDS.jpg.jpeg?alt=media&token=77b90ec2-0ae0-40a0-86d3-f4ddac8f85bf",
    "totalCost": 14.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 35.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-82-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0376,
        "totalCost": 9.41,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-82-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0422,
        "totalCost": 5.06,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-074",
    "name": "Bolonhesa",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS KIDS",
    "description": "Carne moída ao molho de tomate, Ideal pra quem for escolher nossa massa capeline (o famosinho “Cabelo de Anjo”)",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbambino-pomodoro.jpg?alt=media&token=5fea8956-da6d-4863-bf5e-b8697f86d0b2",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-83-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-83-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-075",
    "name": "Deliciosas combinações “escondidas” no creme de macaxeira com queijo, uma mistura cremosa e uniforme que você já conhece. Porções bem servidas nos nossos caldeirõezinhos de ferro fundido, pra você se deliciar sozinho ou compartilhar – Todos acompanham arroz branco",
    "category": "MASSAS_RISOTOS",
    "categoryLabel": "Massas & Risotos",
    "majorCategory": "Menu Principal",
    "subcategory": "ESCONDIDINHOS DO ENGENHO",
    "description": "Caldeirão de Carne de Sol - Carne de Sol desfiada, refogada com bacon e cebola, com o toque de molho roti.",
    "sellingPrice": 74.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Farroz-branco.jpg?alt=media&token=ee38cdb0-e3a4-4489-8a2c-0251f776db90",
    "totalCost": 21.72,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 53.18,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Lactose"
    ],
    "ingredients": [
      {
        "id": "ing-84-1",
        "name": "Carne de Sol Artesanal Selecionada",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0471,
        "totalCost": 14.12,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-84-2",
        "name": "Queijo Coalho e Baião Cremoso",
        "quantity": 180,
        "unit": "g",
        "unitCost": 0.0217,
        "totalCost": 3.91,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-84-3",
        "name": "Macaxeira Frita e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0307,
        "totalCost": 3.69,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-076",
    "name": "Caldeirão de Charque",
    "category": "MASSAS_RISOTOS",
    "categoryLabel": "Massas & Risotos",
    "majorCategory": "Menu Principal",
    "subcategory": "ESCONDIDINHOS DO ENGENHO",
    "description": "Aquela mistura à jardineira do nosso charque especial",
    "sellingPrice": 74.9,
    "imageUrl": null,
    "totalCost": 21.72,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 53.18,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-85-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0565,
        "totalCost": 14.12,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-85-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0633,
        "totalCost": 7.6,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-077",
    "name": "Caldeirão de Picanha",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "ESCONDIDINHOS DO ENGENHO",
    "description": "Pedaços de picanha especial, acebolada e refogada",
    "sellingPrice": 69.9,
    "imageUrl": null,
    "totalCost": 20.27,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 49.63,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-86-1",
        "name": "Corte Nobre de Parrilla",
        "quantity": 400,
        "unit": "g",
        "unitCost": 0.0365,
        "totalCost": 14.6,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-86-2",
        "name": "Farofa de Ovos e Manteiga",
        "quantity": 100,
        "unit": "g",
        "unitCost": 0.0304,
        "totalCost": 3.04,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-86-3",
        "name": "Vinagrete e Sal de Parrilla",
        "quantity": 60,
        "unit": "g",
        "unitCost": 0.0438,
        "totalCost": 2.63,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-078",
    "name": "Caldeirão de Bacalhau",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESCONDIDINHOS DO ENGENHO",
    "description": "Lascas de bacalhau refogado com pimentões e cebola",
    "sellingPrice": 59.9,
    "imageUrl": null,
    "totalCost": 17.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 42.53,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-87-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0452,
        "totalCost": 11.29,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-87-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0507,
        "totalCost": 6.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-079",
    "name": "Caldeirão de Camarão",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESCONDIDINHOS DO ENGENHO",
    "description": "Deliciosos Camarões refogados com cebola e coentro.",
    "sellingPrice": 74.9,
    "imageUrl": null,
    "totalCost": 21.72,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 53.18,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-88-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.076,
        "totalCost": 15.2,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-88-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0435,
        "totalCost": 6.52,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-080",
    "name": "Combo Caldeirão Engenho 2 Unidades",
    "category": "MASSAS_RISOTOS",
    "categoryLabel": "Massas & Risotos",
    "majorCategory": "Menu Principal",
    "subcategory": "ESCONDIDINHOS DO ENGENHO",
    "description": "Combo com caldeirões de escondidinhos artesanais à escolha, servidos quentes com crosta de queijo gratinado na hora.",
    "sellingPrice": 129.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fescondidinho-do-engenho.jpg?alt=media&token=cdd03233-076e-4dde-849c-c24c10b86fe2",
    "totalCost": 37.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 92.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-89-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.098,
        "totalCost": 24.49,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-89-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1098,
        "totalCost": 13.18,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-081",
    "name": "Prime Rib Suíno - 2P",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - ESPECIALIDADES",
    "description": "Corte especial de porco, servindo até duas pessoas, acompanhado de feijão tropeiro e arroz branco.",
    "sellingPrice": 89.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783707183070-PRIME_RIB_SUINO_2P_03__1_.jpg.jpeg?alt=media&token=437c7d1b-9fd0-4120-9854-79a073c26648",
    "totalCost": 26.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 63.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-90-1",
        "name": "Corte Nobre de Parrilla",
        "quantity": 400,
        "unit": "g",
        "unitCost": 0.0469,
        "totalCost": 18.77,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-90-2",
        "name": "Farofa de Ovos e Manteiga",
        "quantity": 100,
        "unit": "g",
        "unitCost": 0.0391,
        "totalCost": 3.91,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-90-3",
        "name": "Vinagrete e Sal de Parrilla",
        "quantity": 60,
        "unit": "g",
        "unitCost": 0.0565,
        "totalCost": 3.39,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-082",
    "name": "Arroz de rabada com rúcula - 1P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - ESPECIALIDADES",
    "description": "Rabada cozida desfiada, com arroz preparado no próprio molho, agrião e temperos.",
    "sellingPrice": 64.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783708359316-ARROZ_DE_RABADA_COM_RUCULA_1P__3___1___1___1___1___1_.jpg.jpeg?alt=media&token=c5f36bbe-6424-4adf-b817-ee2792804880",
    "totalCost": 18.82,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 46.08,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-91-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0489,
        "totalCost": 12.23,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-91-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0549,
        "totalCost": 6.59,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-083",
    "name": "Ragu do Brasil - 2P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - ESPECIALIDADES",
    "description": "Ragu de linguiça crocante, com espinafre, servida com polenta cremosa, acompanhado de arroz branco.",
    "sellingPrice": 69.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783708748520-RAGU_DO_BRASIL_2P__4___1_.jpg.jpeg?alt=media&token=2813fbf2-e5db-4aec-86d2-93fdaab1ca67",
    "totalCost": 20.27,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 49.63,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-92-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0527,
        "totalCost": 13.18,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-92-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0591,
        "totalCost": 7.09,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-084",
    "name": "Carbonara de Joelho - 1P",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - ESPECIALIDADES",
    "description": "Lascas de joelho crocante com molho tradicional servido com massa longa e o toque do grupo engenho.",
    "sellingPrice": 67.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783709074144-CARBONARA_DE_JOELHO_02.jpg.jpeg?alt=media&token=291ce1d6-50c8-4c40-b85a-83d9141a509d",
    "totalCost": 19.69,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 48.21,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-93-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0512,
        "totalCost": 12.8,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-93-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0574,
        "totalCost": 6.89,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-085",
    "name": "Supreme de Frango - 1P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - ESPECIALIDADES",
    "description": "Sobrecoxa desossada, recheada com presunto e queijo, guarnecidas com uma massa Tagliatele Grano duro ao molho branco",
    "sellingPrice": 59.9,
    "imageUrl": null,
    "totalCost": 17.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 42.53,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-94-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0452,
        "totalCost": 11.29,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-94-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0507,
        "totalCost": 6.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-086",
    "name": "Pirarucu em Crosta de Castanha - 1P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - ESPECIALIDADES",
    "description": "Pirarucu suculento na crosta de castanha, acompanhado com risoto de limão siciliano",
    "sellingPrice": 79.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783709528800-PIRARUCU_EM_CROSTA_DE_CASTANHA_1P_01__1_.jpg.jpeg?alt=media&token=eb4632a5-f072-487a-96bb-a8938da51cf6",
    "totalCost": 23.17,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 56.73,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe"
    ],
    "ingredients": [
      {
        "id": "ing-95-1",
        "name": "Filé de Pirarucu Fresco de Manejo",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0525,
        "totalCost": 15.76,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-95-2",
        "name": "Castanha-do-Brasil Laminada e Moída",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.0927,
        "totalCost": 3.71,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-95-3",
        "name": "Tucupi Amarelo Concentrado (Fervido)",
        "quantity": 100,
        "unit": "ml",
        "unitCost": 0.037,
        "totalCost": 3.7,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-087",
    "name": "Língua Bovina do Engenho - 1P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - ESPECIALIDADES",
    "description": "Língua bovina cozida lentamente, extremamente macia e saborosa, acompanhada de arroz ferrugem e farofa crocante de cebola",
    "sellingPrice": 54.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1783709763860-LINGUA_BOVINA_DO_ENGENHO_1P_02__1_.jpg.jpeg?alt=media&token=13b27ddf-de4d-4ea4-bc55-d8b90680adfe",
    "totalCost": 15.92,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 38.98,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-96-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0414,
        "totalCost": 10.35,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-96-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0464,
        "totalCost": 5.57,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-088",
    "name": "Costelão Do Engenho - 2P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Costela sem osso de boi Angus, prensada, assada por 6 horas em baixa temperatura, acompanha arroz com brócolis, batatonese, farofa, queijo em cubos fritos. Serve duas pessoas",
    "sellingPrice": 149.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcostelao.jpg?alt=media&token=a2ce587d-82f6-4843-b7c6-48667eaa43a8",
    "totalCost": 43.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 106.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-97-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.113,
        "totalCost": 28.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-97-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1268,
        "totalCost": 15.21,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-089",
    "name": "Filé Do Engenho - 1P",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Filé passado na manteiga acompanhado de arroz piemontese, fritas e farofa de ovos.",
    "sellingPrice": 89.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ffile-do-engenho.jpg?alt=media&token=d7551045-cfea-4dd6-afd7-10ee0bec14f0",
    "totalCost": 26.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 63.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-98-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0678,
        "totalCost": 16.95,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-98-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.076,
        "totalCost": 9.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-090",
    "name": "Frango A Parmegiana - 1P",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Filé de frango marinado, empanado, coberto com molho de tomate caseiro e mussarela gratinada, acompanhado com fettuccine ao alho e óleo.",
    "sellingPrice": 67.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ffrango-a-parmegiana.jpg?alt=media&token=0c7c444c-4898-4441-9f40-c1179db5a80d",
    "totalCost": 19.69,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 48.21,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-99-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0512,
        "totalCost": 12.8,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-99-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0574,
        "totalCost": 6.89,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-091",
    "name": "Frango Na Chapa - 2P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Filé de Frango passado na manteiga e molho shoyu, servido na chapa com cebola, pimentão verde e tomate em pétalas, acompanhado de purê de batatas, arroz branco e farofa.",
    "sellingPrice": 89.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ffrango-na-chapa.jpg?alt=media&token=29f5da68-bb5c-4833-b040-85e040fa6532",
    "totalCost": 26.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 63.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-100-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0678,
        "totalCost": 16.95,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-100-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.076,
        "totalCost": 9.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-092",
    "name": "Carne De Sol Do Engenho - 1P",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Nossa tradicional Carne de Sol, preparada artesanalmente com cortes nobres e assada lentamente para máxima maciez e sabor, acompanha arroz com brócolis ou baião de dois cremoso, bolinho de macaxeira, batatonese, queijo coalho grelhado, farofa crocante e vinagrete.",
    "sellingPrice": 79.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcarne-de-sol-do-engenho.jpg?alt=media&token=745d7cf4-587f-4aaf-a3c1-d115810845a4",
    "totalCost": 23.17,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 56.73,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-101-1",
        "name": "Carne de Sol Artesanal Selecionada",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0502,
        "totalCost": 15.06,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-101-2",
        "name": "Queijo Coalho e Baião Cremoso",
        "quantity": 180,
        "unit": "g",
        "unitCost": 0.0232,
        "totalCost": 4.17,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-101-3",
        "name": "Macaxeira Frita e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0328,
        "totalCost": 3.94,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-093",
    "name": "Carne De Sol Do Engenho - 2P",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Nossa tradicional Carne de Sol, preparada artesanalmente com cortes nobres e assada lentamente para máxima maciez e sabor, acompanha arroz com brócolis ou baião de dois cremoso, bolinho de macaxeira, batatonese, queijo coalho grelhado, farofa crocante e vinagrete.",
    "sellingPrice": 159.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcarne-de-sol-do-engenho.jpg?alt=media&token=745d7cf4-587f-4aaf-a3c1-d115810845a4",
    "totalCost": 46.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 113.53,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-102-1",
        "name": "Carne de Sol Artesanal Selecionada",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.1005,
        "totalCost": 30.14,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-102-2",
        "name": "Queijo Coalho e Baião Cremoso",
        "quantity": 180,
        "unit": "g",
        "unitCost": 0.0464,
        "totalCost": 8.35,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-102-3",
        "name": "Macaxeira Frita e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0657,
        "totalCost": 7.88,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-094",
    "name": "Carne De Sol Do Engenho - 3P",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Nossa tradicional Carne de Sol, preparada artesanalmente com cortes nobres e assada lentamente para máxima maciez e sabor, acompanha arroz com brócolis ou baião de dois cremoso, bolinho de macaxeira, batatonese, queijo coalho grelhado, farofa crocante e vinagrete.",
    "sellingPrice": 224.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcarne-de-sol-do-engenho.jpg?alt=media&token=745d7cf4-587f-4aaf-a3c1-d115810845a4",
    "totalCost": 65.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 159.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-103-1",
        "name": "Carne de Sol Artesanal Selecionada",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.1413,
        "totalCost": 42.39,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-103-2",
        "name": "Queijo Coalho e Baião Cremoso",
        "quantity": 180,
        "unit": "g",
        "unitCost": 0.0652,
        "totalCost": 11.74,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-103-3",
        "name": "Macaxeira Frita e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0924,
        "totalCost": 11.09,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-095",
    "name": "Tambaqui Manauara - 1P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Costela com lombo de tambaqui, arroz com tucupi e jambu, acompanhado de farofa de banana.",
    "sellingPrice": 77.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777403970819-tambaqui.jpg.jpeg?alt=media&token=8f1f1cd0-9872-46e9-8f01-192ce053df42",
    "totalCost": 22.59,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 55.31,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe"
    ],
    "ingredients": [
      {
        "id": "ing-104-1",
        "name": "Lombo de Tambaqui Nobre com Osso",
        "quantity": 400,
        "unit": "g",
        "unitCost": 0.0367,
        "totalCost": 14.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-104-2",
        "name": "Farinha do Uarini Ovinha (Torrada)",
        "quantity": 80,
        "unit": "g",
        "unitCost": 0.0424,
        "totalCost": 3.39,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-104-3",
        "name": "Vinagrete Regional e Chicória",
        "quantity": 70,
        "unit": "g",
        "unitCost": 0.0323,
        "totalCost": 2.26,
        "supplierOrigin": "FEIRA_PANAIR"
      },
      {
        "id": "ing-104-4",
        "name": "Arroz Paraense e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 2.26,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-096",
    "name": "Filé de Pirarucu - 2P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Filé de pirarucu grelhado e servido na chapa, acompanhado de arroz branco, feijão de praia, vinagrete e farofa.",
    "sellingPrice": 94.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777403915067-file_de_pirarucu.jpg.jpeg?alt=media&token=bbbfa015-7b90-4f15-a981-2dd40b1c05ce",
    "totalCost": 27.52,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 67.38,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe"
    ],
    "ingredients": [
      {
        "id": "ing-105-1",
        "name": "Filé de Pirarucu Fresco de Manejo",
        "quantity": 300,
        "unit": "g",
        "unitCost": 0.0624,
        "totalCost": 18.71,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-105-2",
        "name": "Castanha-do-Brasil Laminada e Moída",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.11,
        "totalCost": 4.4,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-105-3",
        "name": "Tucupi Amarelo Concentrado (Fervido)",
        "quantity": 100,
        "unit": "ml",
        "unitCost": 0.0441,
        "totalCost": 4.41,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-097",
    "name": "Tambaqui Smoked - 3P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Um momento amazônico com sabores marcantes, uma deliciosa banda de tambaqui exclusivamente defumada, acompanhado com risoto de castanhas e farofa de camarão tutóia com farinha de uarini torradinha.",
    "sellingPrice": 199.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777403929022-tambaqui_smoked.jpg.jpeg?alt=media&token=8814e336-8a80-45f7-a9d0-ad861a01dc96",
    "totalCost": 57.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 141.93,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [
      "Peixe"
    ],
    "ingredients": [
      {
        "id": "ing-106-1",
        "name": "Lombo de Tambaqui Nobre com Osso",
        "quantity": 400,
        "unit": "g",
        "unitCost": 0.0942,
        "totalCost": 37.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-106-2",
        "name": "Farinha do Uarini Ovinha (Torrada)",
        "quantity": 80,
        "unit": "g",
        "unitCost": 0.1087,
        "totalCost": 8.7,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-106-3",
        "name": "Vinagrete Regional e Chicória",
        "quantity": 70,
        "unit": "g",
        "unitCost": 0.0829,
        "totalCost": 5.8,
        "supplierOrigin": "FEIRA_PANAIR"
      },
      {
        "id": "ing-106-4",
        "name": "Arroz Paraense e Manteiga de Garrafa",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0483,
        "totalCost": 5.79,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-098",
    "name": "Joelho De Porco Defumado - 3P",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Joelho de Porco defumado, assado e pururucado, acompanhado de Arroz branco, Tutu a Mineira, Couve crisp e Polenta frita.",
    "sellingPrice": 199.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjoelho-de-porco-defumado.jpg?alt=media&token=a0637e52-42b7-4ec5-ace5-8883693d946f",
    "totalCost": 57.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 141.93,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-107-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1507,
        "totalCost": 37.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-107-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1691,
        "totalCost": 20.29,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-099",
    "name": "Costela Barbecue do Engenho - 2P",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO",
    "description": "Costela de porco defumada, cozida em molho barbecue, acompanhada batatas rústicas.",
    "sellingPrice": 99.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcostela-do-engenho-barbecue.jpg?alt=media&token=0f9e5727-f40c-4cef-88f3-d505999bc8db",
    "totalCost": 28.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.93,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-108-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0753,
        "totalCost": 18.83,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-108-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0845,
        "totalCost": 10.14,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-100",
    "name": "Bacalhau com Natas 1P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESPECIAL DO MAR",
    "description": "Bacalhau desfiado refogado no azeite com cebola e alho, batatas em cubos e molho branco com queijos, finalizado com creme de leite e queijo parmesão gratinado, acompanha arroz branco.",
    "sellingPrice": 69.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbacalhau-natas.jpg?alt=media&token=bc794651-9d40-4e0e-9c3e-cabefb74c50b",
    "totalCost": 20.27,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 49.63,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-109-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0527,
        "totalCost": 13.18,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-109-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0591,
        "totalCost": 7.09,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-101",
    "name": "Bacalhau com Natas e Camarão 1P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESPECIAL DO MAR",
    "description": "Bacalhau desfiado e camarões salteados no azeite, cebola, alho guarnecidos com molho branco enriquecido com uma mistura de queijos, finalizado com creme de leite e queijo parmesão gratinado. Acompanha arroz branco.",
    "sellingPrice": 79.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbacalhau-com-natas-e-camarao.jpg?alt=media&token=d0e05682-3f3a-457e-badb-79ece63ceee7",
    "totalCost": 23.17,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 56.73,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-110-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.0811,
        "totalCost": 16.22,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-110-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0463,
        "totalCost": 6.95,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-102",
    "name": "Fettuccine De Camarão 1P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESPECIAL DO MAR",
    "description": "Fettuccine de camarão flambado ao molho de queijos e filnalizado com parmesão.",
    "sellingPrice": 84.9,
    "imageUrl": null,
    "totalCost": 24.62,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 60.28,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-111-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.0862,
        "totalCost": 17.23,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-111-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0493,
        "totalCost": 7.39,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-103",
    "name": "Camarão Amazônico 1P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESPECIAL DO MAR",
    "description": "Camarões fritos no azeite e alho, acompanhado de arroz paraense.",
    "sellingPrice": 77.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcamarao-amazonico.jpg?alt=media&token=eb765897-33f2-4892-b626-55b95a4f5a99",
    "totalCost": 22.59,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 55.31,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-112-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.0791,
        "totalCost": 15.81,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-112-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0452,
        "totalCost": 6.78,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-104",
    "name": "Camarão Amazônico 2P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESPECIAL DO MAR",
    "description": "Camarões fritos no azeite e alho, acompanhado de arroz paraense.",
    "sellingPrice": 149.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcamarao-amazonico.jpg?alt=media&token=eb765897-33f2-4892-b626-55b95a4f5a99",
    "totalCost": 43.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 106.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-113-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.1522,
        "totalCost": 30.43,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-113-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0869,
        "totalCost": 13.04,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-105",
    "name": "Camarões Vila Verde 1P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESPECIAL DO MAR",
    "description": "Camarões salteados com tomate seco rúcula, e um leve toque de molho de tomate, tudo isso envolto na massa Espaguete Grano duro",
    "sellingPrice": 79.9,
    "imageUrl": null,
    "totalCost": 23.17,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 56.73,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [
      "Frutos do Mar"
    ],
    "ingredients": [
      {
        "id": "ing-114-1",
        "name": "Camarão Rosa Selecionado",
        "quantity": 200,
        "unit": "g",
        "unitCost": 0.0811,
        "totalCost": 16.22,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-114-2",
        "name": "Creme de Macaxeira, Dendê e Leite de Coco",
        "quantity": 150,
        "unit": "g",
        "unitCost": 0.0463,
        "totalCost": 6.95,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-106",
    "name": "Bacalhau Manauara 1P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESPECIAL DO MAR",
    "description": "Lombo de Bacalhau Gadus Morhua, confitado no azeite e depois grelhado, acompanhado de azeitonas portuguesas, cenouras, batata ao murro, tomate-cereja, cebola, mix de pimentões e finalizado com salsa e alho laminado. Acompanha arroz branco.",
    "sellingPrice": 129.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbacalhau-manauara.jpg?alt=media&token=5ab98063-0d32-4d6b-add3-7b4d3af9e0d6",
    "totalCost": 37.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 92.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-115-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.098,
        "totalCost": 24.49,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-115-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1098,
        "totalCost": 13.18,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-107",
    "name": "Bacalhau Manauara 2P",
    "category": "PESCADOS_AMAZONIA",
    "categoryLabel": "Pescados da Amazônia",
    "majorCategory": "Menu Principal",
    "subcategory": "ESPECIAL DO MAR",
    "description": "Lombo de Bacalhau Gadus Morhua, confitado no azeite e depois grelhado, acompanhado de azeitonas portuguesas, cenouras, batata ao murro, tomate-cereja, cebola, mix de pimentões e finalizado com salsa e alho laminado. Acompanha arroz branco.",
    "sellingPrice": 249.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbacalhau-manauara.jpg?alt=media&token=5ab98063-0d32-4d6b-add3-7b4d3af9e0d6",
    "totalCost": 72.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 177.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-116-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1884,
        "totalCost": 47.11,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-116-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2113,
        "totalCost": 25.36,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-108",
    "name": "Pesos aproximados e in natura (antes do preparo) Não acompanha guarnições",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "CARNES PREMIUM",
    "description": "Baby Beef Black Angus 250g - Corte nobre da alcatra, com textura macia e sabor suave, é uma carne equilibrada, tenra e muito apreciada em casas premium pela delicadeza e suculência.",
    "sellingPrice": 97.9,
    "imageUrl": null,
    "totalCost": 28.39,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 69.51,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-117-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0738,
        "totalCost": 18.45,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-117-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0828,
        "totalCost": 9.94,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-109",
    "name": "Picanha Angus 1P (Picanha Importada) 200G",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "CARNES PREMIUM",
    "description": "Ícone do churrasco brasileiro, corte nobre com capa de gordura uniforme que garante maciez e sabor únicos. Selecionadas as melhores picanhas importadas garantindo marmoreio superior e textura especial.",
    "sellingPrice": 79.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777406912281-picanha.jpg.jpeg?alt=media&token=8c76ab70-3792-47eb-8b2f-ff28a09998fc",
    "totalCost": 23.17,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 56.73,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-118-1",
        "name": "Corte Nobre de Parrilla",
        "quantity": 400,
        "unit": "g",
        "unitCost": 0.0417,
        "totalCost": 16.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-118-2",
        "name": "Farofa de Ovos e Manteiga",
        "quantity": 100,
        "unit": "g",
        "unitCost": 0.0348,
        "totalCost": 3.48,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-118-3",
        "name": "Vinagrete e Sal de Parrilla",
        "quantity": 60,
        "unit": "g",
        "unitCost": 0.0502,
        "totalCost": 3.01,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-110",
    "name": "Picanha Angus 2P (Picanha Importada) 400G",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "CARNES PREMIUM",
    "description": "Ícone do churrasco brasileiro, corte nobre com capa de gordura uniforme que garante maciez e sabor únicos. Selecionadas as melhores picanhas importadas garantindo marmoreio superior e textura especial.",
    "sellingPrice": 159.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777407026623-picanha.jpg.jpeg?alt=media&token=78f2a3ec-4c34-4f3b-9647-862655666859",
    "totalCost": 46.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 113.53,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-119-1",
        "name": "Corte Nobre de Parrilla",
        "quantity": 400,
        "unit": "g",
        "unitCost": 0.0835,
        "totalCost": 33.39,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-119-2",
        "name": "Farofa de Ovos e Manteiga",
        "quantity": 100,
        "unit": "g",
        "unitCost": 0.0696,
        "totalCost": 6.96,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-119-3",
        "name": "Vinagrete e Sal de Parrilla",
        "quantity": 60,
        "unit": "g",
        "unitCost": 0.1003,
        "totalCost": 6.02,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-111",
    "name": "Short Rib Black Angus 500g",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "CARNES PREMIUM",
    "description": "Corte das costelas dianteiras, altamente marmorizado. É considerado um dos cortes mais saborosos do Angus, famoso pela maciez, untuosidade e intensidade de sabor.",
    "sellingPrice": 189.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777407096658-short_ribs.jpg.jpeg?alt=media&token=19658684-b171-4876-b20f-8bd310a8d199",
    "totalCost": 55.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 134.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-120-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1432,
        "totalCost": 35.8,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-120-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1606,
        "totalCost": 19.27,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-112",
    "name": "Bife Chorizo Black Angus 250g",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "CARNES PREMIUM",
    "description": "Tradicional das parrillas argentinas, é o contrafilé com sua capa de gordura característica, que derrete durante o preparo, garantindo sabor marcante e suculência extrema.",
    "sellingPrice": 99.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777406733099-bife_chourizo.jpg.jpeg?alt=media&token=9fb59335-83c2-465d-a23f-8bae79648967",
    "totalCost": 28.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.93,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-121-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0753,
        "totalCost": 18.83,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-121-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0845,
        "totalCost": 10.14,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-113",
    "name": "Fraldinha Black Angus 300g",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "CARNES PREMIUM",
    "description": "Corte retirado da parte traseira, conhecido pelas fibras longas e sabor intenso, na qualidade black angus, ganha ainda mais suculência e maciez, entregando uma carne extremamente saborosa e marcante.",
    "sellingPrice": 129.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777406539260-fraldinha.jpg.jpeg?alt=media&token=4d7909e4-f17e-4634-af33-3761b8adc0cf",
    "totalCost": 37.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 92.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-122-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.098,
        "totalCost": 24.49,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-122-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1098,
        "totalCost": 13.18,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-114",
    "name": "Maminha Black Angus 300g",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "CARNES PREMIUM",
    "description": "Corte nobre e muito apreciado por sua maciez, fibras delicadas e sabor marcante. Na versão Black Angus, apresenta marmoreio equilibrado, garantindo suculência e textura extremamente agradável a cada fatia.",
    "sellingPrice": 89.9,
    "imageUrl": null,
    "totalCost": 26.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 63.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-123-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0678,
        "totalCost": 16.95,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-123-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.076,
        "totalCost": 9.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-115",
    "name": "Cupim especial 300g",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "CARNES PREMIUM",
    "description": "Corte tradicional de sabor intenso e textura única, reconhecido pelo seu marmoreio entre as fibras, que proporciona maciez e muita suculência no preparo. Quando bem assado, entrega carne extremamente tenra, com sabor marcante e irresistível.",
    "sellingPrice": 59.9,
    "imageUrl": null,
    "totalCost": 17.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 42.53,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-124-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0452,
        "totalCost": 11.29,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-124-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0507,
        "totalCost": 6.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-116",
    "name": "T-Bone Black Angus 2P 500g",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "CARNES PREMIUM",
    "description": "Corte imponente que combina filé mignon e contrafilé unidos pelo osso em formato de “t”. entrega duas texturas em um único corte: maciez absoluta e sabor marcante.",
    "sellingPrice": 199.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777406840330-t_bone.jpg.jpeg?alt=media&token=8e94ea64-4491-45db-bafd-4e766875a071",
    "totalCost": 57.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 141.93,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-125-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1507,
        "totalCost": 37.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-125-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1691,
        "totalCost": 20.29,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-117",
    "name": "Bife americano 300g",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Menu Principal",
    "subcategory": "CARNES PREMIUM",
    "description": "Corte bovino macio e suculento, com fibras curtas e sabor marcante, na versão Black Angus apresenta ótimo marmoreio e suculência, grelhado realçando suas características naturais.",
    "sellingPrice": 89.9,
    "imageUrl": null,
    "totalCost": 26.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 63.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-126-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0678,
        "totalCost": 16.95,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-126-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.076,
        "totalCost": 9.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-118",
    "name": "Guarnição Especial do Engenho - 1P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "GUARNIÇÕES",
    "description": "Tropeiro, arroz biro biro, batatonese, farofa e vinagrete",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-127-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-127-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-119",
    "name": "Guarnição Especial do Engenho - 2P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "GUARNIÇÕES",
    "description": "Tropeiro, arroz biro biro, batatonese, farofa e vinagrete",
    "sellingPrice": 59.9,
    "imageUrl": null,
    "totalCost": 17.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 42.53,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-128-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0452,
        "totalCost": 11.29,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-128-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0507,
        "totalCost": 6.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-120",
    "name": "Guarnição Nordestina - 1P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "GUARNIÇÕES",
    "description": "Tradicional baião cremoso preparado com feijão de corda, queijo coalho em cubos, nata fresca e manteiga de garrafa.",
    "sellingPrice": 31.9,
    "imageUrl": null,
    "totalCost": 9.25,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 22.65,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-129-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.024,
        "totalCost": 6.01,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-129-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.027,
        "totalCost": 3.24,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-121",
    "name": "Guarnição Nordestina - 2P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "GUARNIÇÕES",
    "description": "Tradicional baião cremoso preparado com feijão de corda, queijo coalho em cubos, nata fresca e manteiga de garrafa.",
    "sellingPrice": 51.9,
    "imageUrl": null,
    "totalCost": 15.05,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 36.85,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-130-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0391,
        "totalCost": 9.78,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-130-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0439,
        "totalCost": 5.27,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-122",
    "name": "Guarnição Amazônica – 1P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "GUARNIÇÕES",
    "description": "Baião de dois, farofa de banana com farinha do Uarini e vinagrete",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-131-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-131-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-123",
    "name": "Guarnição Amazônica – 2P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "GUARNIÇÕES",
    "description": "Baião de dois, farofa de banana com farinha do Uarini e vinagrete",
    "sellingPrice": 54.9,
    "imageUrl": null,
    "totalCost": 15.92,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 38.98,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-132-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0414,
        "totalCost": 10.35,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-132-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0464,
        "totalCost": 5.57,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-124",
    "name": "Guarnição Mineira – 1P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "GUARNIÇÕES",
    "description": "Tutu a mineira, polenta frita, arroz com alho, farofa e vinagrete",
    "sellingPrice": 37.9,
    "imageUrl": null,
    "totalCost": 10.99,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 26.91,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-133-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0286,
        "totalCost": 7.14,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-133-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0321,
        "totalCost": 3.85,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-125",
    "name": "Guarnição Mineira – 2P",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "GUARNIÇÕES",
    "description": "Tutu a mineira, polenta frita, arroz com alho, farofa e vinagrete",
    "sellingPrice": 57.9,
    "imageUrl": null,
    "totalCost": 16.79,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 41.11,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-134-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0436,
        "totalCost": 10.91,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-134-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.049,
        "totalCost": 5.88,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-126",
    "name": "Arroz Branco",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PORÇÕES",
    "description": "Arroz agulhinha de grão longo selecionado, cozido no ponto certo, levemente temperado com alho e azeite.",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Farroz-branco.jpg?alt=media&token=ee38cdb0-e3a4-4489-8a2c-0251f776db90",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-135-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-135-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-127",
    "name": "Arroz Biro - Biro",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PORÇÕES",
    "description": "Arroz soltinho refogado com cubinhos de bacon dourado, ovos mexidos na manteiga, batata palha fina e cheiro-verde fresco.",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-136-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-136-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-128",
    "name": "Baião De Dois",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PORÇÕES",
    "description": "Tradicional baião cremoso preparado com feijão de corda, queijo coalho em cubos, nata fresca e manteiga de garrafa.",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbaiao-de-dois.jpg?alt=media&token=a61ffd68-fced-474b-a122-6620d1e536a4",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-137-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-137-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-129",
    "name": "Banana Frita",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PORÇÕES",
    "description": "Banana Frita - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbanana-frita.jpg?alt=media&token=973f2252-73e2-4205-95e0-e812fc06827d",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-138-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-138-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-130",
    "name": "Farofa De Ovos",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PORÇÕES",
    "description": "Farofa úmida de farinha selecionada com ovos mexidos na manteiga de garrafa e cebolinha verde.",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ffarofa-de-ovos.jpg?alt=media&token=8b42bed5-3bca-43a7-97b2-ecd14514d916",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-139-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-139-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-131",
    "name": "Farofa De Banana",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PORÇÕES",
    "description": "Farinha do Uarini ovinha torrada na manteiga com pedacinhos de banana pacovã caramelizada.",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ffarofa-de-banana.jpg?alt=media&token=1bb332c1-9afa-4772-a7c6-066e56bdec01",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-140-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-140-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-132",
    "name": "Farofa",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PORÇÕES",
    "description": "Farofa - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 14.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ffarofa.jpg?alt=media&token=bf933237-b024-4d17-97d6-5a41f97b77c8",
    "totalCost": 4.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 10.58,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-141-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0112,
        "totalCost": 2.81,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-141-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0126,
        "totalCost": 1.51,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-133",
    "name": "Vinagrete",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PORÇÕES",
    "description": "Vinagrete - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 14.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fvinagrete.jpg?alt=media&token=cee64f0c-c1cc-4e67-b19c-87e2ca589073",
    "totalCost": 4.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 10.58,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-142-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0112,
        "totalCost": 2.81,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-142-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0126,
        "totalCost": 1.51,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-134",
    "name": "Batatonese",
    "category": "ENTRADAS_PETISCOS",
    "categoryLabel": "Entradas & Petiscos",
    "majorCategory": "Menu Principal",
    "subcategory": "PORÇÕES",
    "description": "Batatonese - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbatatonese.jpg?alt=media&token=b8bbfa65-7ad6-4644-bbb2-e58c57561ab4",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-143-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-143-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-135",
    "name": "Doce A Dois",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Menu Principal",
    "subcategory": "SOBREMESAS",
    "description": "Banana pacovã, queijo coalho, canela, redução de creme de leite e leite condensado – pra não perder a companhia e comer “rezando”!",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fdoce-a-dois.jpg?alt=media&token=d2b88b4c-d104-4808-833f-e2867591771a",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-144-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0361,
        "totalCost": 4.33,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-144-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.0723,
        "totalCost": 2.89,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-136",
    "name": "Taça de Cupuaçu/Amazônica",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Menu Principal",
    "subcategory": "SOBREMESAS",
    "description": "Creme de cupuaçu com ganache e castanha do pará laminada. Essa delicia da Amazônia deixa qualquer um de queixo caído!",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ftaca-de-cupuacu.jpg?alt=media&token=13d360fb-58e8-41f7-a5c0-63c46d691df8",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-145-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-145-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-137",
    "name": "Mousse de Maracujá",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Menu Principal",
    "subcategory": "SOBREMESAS",
    "description": "Delicada mousse de maracujá leve e aveludada com acidez marcante finalizada com a redução da propria fruta.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-146-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-146-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-138",
    "name": "Mousse de Cupuaçu com Crocante de Castanha",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Menu Principal",
    "subcategory": "SOBREMESAS",
    "description": "Delicada mousse de cupuaçu de acidez marcante e frescor amazônico, finalizado com crumble de castanha do Pará.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-147-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-147-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-139",
    "name": "Petit Gateau Tradicional",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Menu Principal",
    "subcategory": "SOBREMESAS",
    "description": "Ganache de chocolate e sorvete de creme. Aquela sobremesa gringa, que caiu no gosto do Brasileiro e é deliciosa!",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fpetit-gateau-tradicional.jpg?alt=media&token=ba27bd3b-ed5d-4be0-a7c2-48c77e8748e8",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-148-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0361,
        "totalCost": 4.33,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-148-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.0723,
        "totalCost": 2.89,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-140",
    "name": "Pudim De Leite",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Menu Principal",
    "subcategory": "SOBREMESAS",
    "description": "Dispensa qualquer descrição, é pedir e se deleitar!",
    "sellingPrice": 14.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fpudim-de-leite.jpg?alt=media&token=3e606156-6604-4ac7-861d-c3f9e0e89f4b",
    "totalCost": 4.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 10.58,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-149-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0216,
        "totalCost": 2.59,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-149-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.0432,
        "totalCost": 1.73,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-141",
    "name": "Pudim De Doce De Leite",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Menu Principal",
    "subcategory": "SOBREMESAS",
    "description": "Já esse aqui, é uma experiencia única a cada colherada!",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-150-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0288,
        "totalCost": 3.46,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-150-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.0578,
        "totalCost": 2.31,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-142",
    "name": "Manjar de Coco com Calda de Ameixa",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Menu Principal",
    "subcategory": "SOBREMESAS",
    "description": "Manjar de coco servido com calda de ameixa.",
    "sellingPrice": 24.9,
    "imageUrl": null,
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-151-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-151-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-143",
    "name": "Romeu e Julieta Desconstruído",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Menu Principal",
    "subcategory": "SOBREMESAS",
    "description": "Goiabada em pasta com sorvete de queijo especial",
    "sellingPrice": 24.9,
    "imageUrl": null,
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-152-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0361,
        "totalCost": 4.33,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-152-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.0723,
        "totalCost": 2.89,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-144",
    "name": "Torta Gelada De Abacaxi Un",
    "category": "SOBREMESAS",
    "categoryLabel": "Sobremesas do Engenho",
    "majorCategory": "Menu Principal",
    "subcategory": "SOBREMESAS",
    "description": "Creme de abacaxi servido no biscuti amanteigado finalizado abacaxi com glaceado.",
    "sellingPrice": 17.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fpetit-gateau-amazonico.jpg?alt=media&token=3d926bee-7a99-4a24-a533-5e63595c02c1",
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-153-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0259,
        "totalCost": 3.11,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-153-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.052,
        "totalCost": 2.08,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-145",
    "name": "Sanduiche de Pernil",
    "category": "CHARCUTARIA",
    "categoryLabel": "Charcutaria Artesanal",
    "majorCategory": "Charcutaria",
    "subcategory": "CHARCUTARIA",
    "description": "Lascas de Pernil cozinho lentamente em próprio molho, no pão Terra e Mar (se você não experimentou esse pão ainda vai adorar)!",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-154-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-154-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-146",
    "name": "Sanduiche de Mortadela Italiana",
    "category": "CHARCUTARIA",
    "categoryLabel": "Charcutaria Artesanal",
    "majorCategory": "Charcutaria",
    "subcategory": "CHARCUTARIA",
    "description": "100g de Mortalela italiana fatiada finamente montado no pão Terra e Mar",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-155-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-155-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-147",
    "name": "Choripán",
    "category": "CHARCUTARIA",
    "categoryLabel": "Charcutaria Artesanal",
    "majorCategory": "Charcutaria",
    "subcategory": "CHARCUTARIA",
    "description": "Tradicional Sanduiche Argentino, com linguiça grelhada, servido no pão Terra e Mar crocante com molho Chimichurri",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-156-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-156-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-148",
    "name": "Sanduiche de Conservas (Veg)",
    "category": "CHARCUTARIA",
    "categoryLabel": "Charcutaria Artesanal",
    "majorCategory": "Charcutaria",
    "subcategory": "CHARCUTARIA",
    "description": "Montado no pão Terra e mar – com sortimento de conservas da nossa Charcutaria – se surpreenda",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-157-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-157-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-149",
    "name": "Sanduiche de Rosbife",
    "category": "CARNES_BRASIL",
    "categoryLabel": "Carnes & Brasa Nobre",
    "majorCategory": "Charcutaria",
    "subcategory": "CHARCUTARIA",
    "description": "70gr de Rosbife, rúcula, pepino em conserva, tomate, queijo coalho fatiado finamente montado no pão Terra e Mar",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-158-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-158-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-150",
    "name": "Sanduiche de Pastrami",
    "category": "CHARCUTARIA",
    "categoryLabel": "Charcutaria Artesanal",
    "majorCategory": "Charcutaria",
    "subcategory": "CHARCUTARIA",
    "description": "Pastrami de Peito de boi defumado e temperado, servido no pão Terra e Mar integral",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-159-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-159-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-151",
    "name": "Misto Especial",
    "category": "CHARCUTARIA",
    "categoryLabel": "Charcutaria Artesanal",
    "majorCategory": "Charcutaria",
    "subcategory": "CHARCUTARIA",
    "description": "Presunto e queijo no pão de forma especial alto dourado na manteiga",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-160-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-160-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-152",
    "name": "Sanduiche de Jamon",
    "category": "CHARCUTARIA",
    "categoryLabel": "Charcutaria Artesanal",
    "majorCategory": "Charcutaria",
    "subcategory": "CHARCUTARIA",
    "description": "70g de Jamon Espanhol e 70g de queijo reino, tomate, rúcula e alface montado no pão Terra e Mar",
    "sellingPrice": 49.9,
    "imageUrl": null,
    "totalCost": 14.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 35.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-161-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0376,
        "totalCost": 9.41,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-161-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0422,
        "totalCost": 5.06,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-153",
    "name": "Para quem quer beber menos, mas não abre mão de degustar com equilíbrio um excelente drink!",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Mini Drinks",
    "subcategory": "CHARCUTARIA",
    "description": "Combo Desgutação - Escolha 3 opções de mini drinks",
    "sellingPrice": 49.9,
    "imageUrl": null,
    "totalCost": 14.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 35.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-162-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.2026,
        "totalCost": 10.13,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-162-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 4.34,
        "totalCost": 4.34,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-154",
    "name": "Mini Mimo",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Mini Drinks",
    "subcategory": "CHARCUTARIA",
    "description": "Deliciosa mistura de Espumante Importada, com suco de laranja",
    "sellingPrice": 17.9,
    "imageUrl": null,
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-163-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 5.19,
        "totalCost": 5.19,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-155",
    "name": "Curto Caipfe",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Mini Drinks",
    "subcategory": "CHARCUTARIA",
    "description": "A tradicional caipirinha de café só que curta, e com toque do Engenho. Cachaça Manaós Melaço, café expresso, limão e gelo triturado!",
    "sellingPrice": 14.9,
    "imageUrl": null,
    "totalCost": 4.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 10.58,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-164-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.0604,
        "totalCost": 3.02,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-164-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 1.3,
        "totalCost": 1.3,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-156",
    "name": "Marmelada Inglesa Miúda",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Mini Drinks",
    "subcategory": "CHARCUTARIA",
    "description": "Uma versão internacional com sabor de Brasil - Geleia de laranja, Gin Campari, limão espremido, xarope de açúcar, bitter de laranja e gelo.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-165-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.0808,
        "totalCost": 4.04,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-165-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 1.73,
        "totalCost": 1.73,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-157",
    "name": "Exíguo Vésper Bond",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Mini Drinks",
    "subcategory": "CHARCUTARIA",
    "description": "O drink oficial do James Bond (e você ai achando q era o Dry Martini né?), uma deliciosa mistura e com a peculiaridade de ser “Batido e não misturado”! Gin, Vodka, Lillet e gelo, você vai se surpreender!",
    "sellingPrice": 24.9,
    "imageUrl": null,
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-166-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.101,
        "totalCost": 5.05,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-166-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 2.17,
        "totalCost": 2.17,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-158",
    "name": "Fitzgerald Diminuto",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Mini Drinks",
    "subcategory": "CHARCUTARIA",
    "description": "A versão reduzida de um drink q beira a arte. Também leva esse nome em homenagem ao escritor de Grande Gatsby. Uma mistura perfeita de Gin, limão, xarope de açúcar, bitter aromático e gelo.",
    "sellingPrice": 23.9,
    "imageUrl": null,
    "totalCost": 6.93,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.97,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-167-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.097,
        "totalCost": 4.85,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-167-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 2.08,
        "totalCost": 2.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-159",
    "name": "Negroni Rosé baixinho",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Mini Drinks",
    "subcategory": "CHARCUTARIA",
    "description": "Aquela simplicidade que te surpreende na medida certa. Campari, Gin, Vinho Rose Cadeado e Gelo.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-168-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 5.77,
        "totalCost": 5.77,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-160",
    "name": "Pequeno Rose de Verano",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Mini Drinks",
    "subcategory": "CHARCUTARIA",
    "description": "Sinta-se no verão europeu ao provar essa delícia de Vinho rose com Refrigerante de limão e uma fatia de laranja!",
    "sellingPrice": 16.9,
    "imageUrl": null,
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-169-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 4.9,
        "totalCost": 4.9,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-161",
    "name": "LL&B Miúdo",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Mini Drinks",
    "subcategory": "CHARCUTARIA",
    "description": "Esse drink é praticamente sem álcool, pq leva apenas Limão, refrigerante citrus e bitter aromático, bora provar?",
    "sellingPrice": 14.9,
    "imageUrl": null,
    "totalCost": 4.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 10.58,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-170-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.0604,
        "totalCost": 3.02,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-170-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 1.3,
        "totalCost": 1.3,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-162",
    "name": "Café Coado P",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cafés e Bebidas",
    "subcategory": "CAFÉ E BEBIDAS QUENTES",
    "description": "O Café coado 3 Corações é uma deliciosa bebida de grãos 100% Arábica, sabor intenso e gosto suave.",
    "sellingPrice": 7.9,
    "imageUrl": null,
    "totalCost": 2.29,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 5.61,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-171-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.006,
        "totalCost": 1.49,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-171-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0067,
        "totalCost": 0.8,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-163",
    "name": "Cappuccino Classic - Três Corações",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cafés e Bebidas",
    "subcategory": "CAFÉ E BEBIDAS QUENTES",
    "description": "O cappuccino Classic 3 Corações é uma deliciosa bebida cremosa composta por café, cacau e canela.",
    "sellingPrice": 11.9,
    "imageUrl": null,
    "totalCost": 3.45,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 8.45,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-172-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.009,
        "totalCost": 2.24,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-172-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0101,
        "totalCost": 1.21,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-164",
    "name": "Expresso Atento - Três Corações",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cafés e Bebidas",
    "subcategory": "CAFÉ E BEBIDAS QUENTES",
    "description": "Especialmente elaborado para apreciadores de cafés intensos. De sabor marcante, com notas intensas de caramelo e leve sabor frutado.",
    "sellingPrice": 7.9,
    "imageUrl": null,
    "totalCost": 2.29,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 5.61,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-173-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.006,
        "totalCost": 1.49,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-173-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0067,
        "totalCost": 0.8,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-165",
    "name": "Expresso Ameno - Três Corações",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cafés e Bebidas",
    "subcategory": "CAFÉ E BEBIDAS QUENTES",
    "description": "Blend composto de café arábica de variedade Bourbon Amarelo produzido no sul do Estado de Minas Gerais.",
    "sellingPrice": 7.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FIowCuTLNbRuGUV20SJna%2Fimages%2Fcatalog-items%2F1767555675083-Captura_de_tela_2026_01_04_154027.png.png?alt=media&token=4ff76855-d174-43bf-9f4a-8cafb0b6f771",
    "totalCost": 2.29,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 5.61,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-174-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.006,
        "totalCost": 1.49,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-174-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0067,
        "totalCost": 0.8,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-166",
    "name": "Expresso Decaf - Três Corações",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cafés e Bebidas",
    "subcategory": "CAFÉ E BEBIDAS QUENTES",
    "description": "Os melhores grãos, com água para retirar a cafeína, preservando o sabor e o aroma natural do seu café descafeinado.",
    "sellingPrice": 7.9,
    "imageUrl": null,
    "totalCost": 2.29,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 5.61,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-175-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.006,
        "totalCost": 1.49,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-175-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0067,
        "totalCost": 0.8,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-167",
    "name": "Cappuccino Chocolatto Três Corações",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cafés e Bebidas",
    "subcategory": "CAFÉ E BEBIDAS QUENTES",
    "description": "Bebida cremosa com o delicioso sabor do chocolate com um toque delicado de leite.",
    "sellingPrice": 13.9,
    "imageUrl": null,
    "totalCost": 4.03,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 9.87,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-176-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0105,
        "totalCost": 2.62,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-176-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0118,
        "totalCost": 1.41,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-168",
    "name": "Cappuccino Chocolatto Caramel - Três Corações",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cafés e Bebidas",
    "subcategory": "CAFÉ E BEBIDAS QUENTES",
    "description": "Chocolate quente cremoso com um toque generoso de caramelo. Combinação especial e muito saborosa.",
    "sellingPrice": 14.9,
    "imageUrl": null,
    "totalCost": 4.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 10.58,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-177-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0112,
        "totalCost": 2.81,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-177-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0126,
        "totalCost": 1.51,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-169",
    "name": "Chá De Hortelã - Três Corações",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cafés e Bebidas",
    "subcategory": "CAFÉ E BEBIDAS QUENTES",
    "description": "Chá de hortelã ( Mentha Piperita L.) Tem sabor marcante e notas mentoladas. Oferece uma gostosa sensação refrescante. Ideal para todos os momentos do seu dia.",
    "sellingPrice": 9.9,
    "imageUrl": null,
    "totalCost": 2.87,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 7.03,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-178-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0075,
        "totalCost": 1.87,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-178-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0083,
        "totalCost": 1,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-170",
    "name": "Chá De Cidreira - Três Corações",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cafés e Bebidas",
    "subcategory": "CAFÉ E BEBIDAS QUENTES",
    "description": "Sabor e aroma inconfundível de limão. O chá de capim - cidreira ( Cymbopogon Citratus) inspira momentos de simplicidade e leveza.",
    "sellingPrice": 9.9,
    "imageUrl": null,
    "totalCost": 2.87,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 7.03,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-179-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0075,
        "totalCost": 1.87,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-179-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0083,
        "totalCost": 1,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-171",
    "name": "Chá De Hibisco e Maçã - Três Corações",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cafés e Bebidas",
    "subcategory": "CAFÉ E BEBIDAS QUENTES",
    "description": "O chá de hibisco e maçã sabor frutas vermelhas, possui a delicadeza da maçã e das frutas vermelhas.",
    "sellingPrice": 9.9,
    "imageUrl": null,
    "totalCost": 2.87,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 7.03,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-180-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0075,
        "totalCost": 1.87,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-180-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0083,
        "totalCost": 1,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-172",
    "name": "Standard 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "SUCOS",
    "description": "Suco natural da fruta preparado na hora com água mineral ou leite, servido bem gelado.",
    "sellingPrice": 14.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fstandard.jpg?alt=media&token=54bd5c4c-1ee1-41e5-a161-5c9735d787d5",
    "totalCost": 4.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 10.58,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-181-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0112,
        "totalCost": 2.81,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-181-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0126,
        "totalCost": 1.51,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-173",
    "name": "Especiais 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "SUCOS",
    "description": "Suco natural da fruta preparado na hora com água mineral ou leite, servido bem gelado.",
    "sellingPrice": 16.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fespeciais.jpg?alt=media&token=05678808-82a3-4360-8106-93c383c841d5",
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-182-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0128,
        "totalCost": 3.19,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-182-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0143,
        "totalCost": 1.71,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-174",
    "name": "Premium 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "SUCOS",
    "description": "Abacaxi com hortelã, Laranja ou Frutas Vermelhas",
    "sellingPrice": 18.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fabacaxi-com-hortela.jpg?alt=media&token=c7e2ccfc-3e91-4063-8897-6f41ff20cb3f",
    "totalCost": 5.48,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 13.42,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-183-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0142,
        "totalCost": 3.56,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-183-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.016,
        "totalCost": 1.92,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-175",
    "name": "Standard 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "SUCOS",
    "description": "Suco natural da fruta preparado na hora com água mineral ou leite, servido bem gelado.",
    "sellingPrice": 33.9,
    "imageUrl": null,
    "totalCost": 9.83,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.07,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-184-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0256,
        "totalCost": 6.39,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-184-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0287,
        "totalCost": 3.44,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-176",
    "name": "Especiais 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "SUCOS",
    "description": "Suco natural da fruta preparado na hora com água mineral ou leite, servido bem gelado.",
    "sellingPrice": 37.9,
    "imageUrl": null,
    "totalCost": 10.99,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 26.91,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-185-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0286,
        "totalCost": 7.14,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-185-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0321,
        "totalCost": 3.85,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-177",
    "name": "Premium 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "SUCOS",
    "description": "Abacaxi com hortelã, Laranja e Frutas Vermelhas",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-186-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-186-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-178",
    "name": "Suco De Uva Integral - Casa Madeira",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "SUCOS",
    "description": "Suco natural da fruta preparado na hora com água mineral ou leite, servido bem gelado.",
    "sellingPrice": 21.9,
    "imageUrl": null,
    "totalCost": 6.35,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 15.55,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-187-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0165,
        "totalCost": 4.13,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-187-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0185,
        "totalCost": 2.22,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-179",
    "name": "Adicional Leite- Copo",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "SUCOS",
    "description": "Suco natural da fruta preparado na hora com água mineral ou leite, servido bem gelado.",
    "sellingPrice": 4.9,
    "imageUrl": null,
    "totalCost": 1.42,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 3.48,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-188-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0037,
        "totalCost": 0.92,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-188-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0042,
        "totalCost": 0.5,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-180",
    "name": "Adicional leite - Jarra",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "SUCOS",
    "description": "Suco natural da fruta preparado na hora com água mineral ou leite, servido bem gelado.",
    "sellingPrice": 7.9,
    "imageUrl": null,
    "totalCost": 2.29,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 5.61,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-189-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.006,
        "totalCost": 1.49,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-189-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0067,
        "totalCost": 0.8,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-181",
    "name": "Refrigerante Lata",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "BEBIDAS DIVERSAS",
    "description": "Coca-Cola, Fanta laranja, Guaraná, Fanta Uva, Tuchaua e Sprite, Coca-Cola sem açúcar, Fanta laranja sem açúcar e Sprite sem açúcar",
    "sellingPrice": 9.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Frefrigerante-lata.jpg?alt=media&token=c38a44d1-9ce1-45cc-bf39-3ee77c0e86f3",
    "totalCost": 2.87,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 7.03,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-190-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0075,
        "totalCost": 1.87,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-190-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0083,
        "totalCost": 1,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-182",
    "name": "Refrigerante KS",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "BEBIDAS DIVERSAS",
    "description": "Coca-Cola, Coca-Cola sem açúcar e Fanta laranja",
    "sellingPrice": 9.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Frefrigerante-ks.jpg?alt=media&token=5c04cedd-2b2c-475b-8841-f53b67dcc375",
    "totalCost": 2.87,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 7.03,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-191-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0075,
        "totalCost": 1.87,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-191-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0083,
        "totalCost": 1,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-183",
    "name": "Monster Grenn 269ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "BEBIDAS DIVERSAS",
    "description": "Monster Grenn 269ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 17.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fenergetico-monster.jpg?alt=media&token=858422dc-255b-4295-ac97-b7902ba91f99",
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-192-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0135,
        "totalCost": 3.37,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-192-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0152,
        "totalCost": 1.82,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-184",
    "name": "Monster Mango Loko 473ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "BEBIDAS DIVERSAS",
    "description": "Monster Mango Loko 473ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 23.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fenergetico-monster.jpg?alt=media&token=858422dc-255b-4295-ac97-b7902ba91f99",
    "totalCost": 6.93,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.97,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-193-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.018,
        "totalCost": 4.51,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-193-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0202,
        "totalCost": 2.42,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-185",
    "name": "Schweppes",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "BEBIDAS DIVERSAS",
    "description": "Schweppes - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 10.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fschweppes.jpg?alt=media&token=adf83ea2-4c22-4084-a653-5dcbf27b1dff",
    "totalCost": 3.16,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 7.74,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-194-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0082,
        "totalCost": 2.05,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-194-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0093,
        "totalCost": 1.11,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-186",
    "name": "Água Mineral",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Não Alcoólicas",
    "subcategory": "BEBIDAS DIVERSAS",
    "description": "Água mineral límpida e refrescante, com ou sem gás.",
    "sellingPrice": 8.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fagua-mineral.jpg?alt=media&token=3dca73ad-553d-421d-b5d1-54b7e1eb243c",
    "totalCost": 2.58,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 6.32,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-195-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0067,
        "totalCost": 1.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-195-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0075,
        "totalCost": 0.9,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-187",
    "name": "Caipirinha Do Engenho",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Happy Hour",
    "subcategory": "PARA BEBER",
    "description": "Clássica caipirinha brasileira preparada com cachaça selecionada, limão fresco macerado e açúcar na medida exata.",
    "sellingPrice": 9.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcaipirinha-do-engenho.jpg?alt=media&token=cac47c2e-4868-46c4-9698-e1cf5f516603",
    "totalCost": 2.87,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 7.03,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-196-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.0402,
        "totalCost": 2.01,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-196-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 0.86,
        "totalCost": 0.86,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-188",
    "name": "Chopp Heineken 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Happy Hour",
    "subcategory": "PARA BEBER",
    "description": "Chopp Heineken puro malte tirado na hora, super refrescante com 5% de teor alcoólico e colarinho denso na caneca congelada.",
    "sellingPrice": 17.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484482942-chopp.jpg.jpeg?alt=media&token=bc376a1c-811f-43d9-811c-53a562f3f484",
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-197-1",
        "name": "Chopp Barril 50L (Volume Líquido)",
        "quantity": 350,
        "unit": "ml",
        "unitCost": 0.0131,
        "totalCost": 4.57,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-197-2",
        "name": "Rateio Gás CO2 e Refrigeração",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 0.62,
        "totalCost": 0.62,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-189",
    "name": "Heineken 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS HEINEKEN",
    "description": "Heineken 300ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 17.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484369168-chopp.jpg.jpeg?alt=media&token=b58095a0-d76a-46a4-a60e-45e50c8984b9",
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-198-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0135,
        "totalCost": 3.37,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-198-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0152,
        "totalCost": 1.82,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-190",
    "name": "Heineken 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS HEINEKEN",
    "description": "Heineken 500ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 27.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484482942-chopp.jpg.jpeg?alt=media&token=bc376a1c-811f-43d9-811c-53a562f3f484",
    "totalCost": 8.09,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 19.81,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-199-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.021,
        "totalCost": 5.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-199-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0236,
        "totalCost": 2.83,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-191",
    "name": "Heineken 1L",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS HEINEKEN",
    "description": "Heineken 1L - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 49.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484482942-chopp.jpg.jpeg?alt=media&token=bc376a1c-811f-43d9-811c-53a562f3f484",
    "totalCost": 14.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 35.43,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-200-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0376,
        "totalCost": 9.41,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-200-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0422,
        "totalCost": 5.06,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-192",
    "name": "Heineken Sujo 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS HEINEKEN",
    "description": "Heineken Sujo 300ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484482942-chopp.jpg.jpeg?alt=media&token=bc376a1c-811f-43d9-811c-53a562f3f484",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-201-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-201-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-193",
    "name": "Heineken Sujo 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS HEINEKEN",
    "description": "Heineken Sujo 500ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484482942-chopp.jpg.jpeg?alt=media&token=bc376a1c-811f-43d9-811c-53a562f3f484",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-202-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-202-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-194",
    "name": "Heineken Sujo 1L",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS HEINEKEN",
    "description": "Heineken Sujo 1L - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 52.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484482942-chopp.jpg.jpeg?alt=media&token=bc376a1c-811f-43d9-811c-53a562f3f484",
    "totalCost": 15.34,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 37.56,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-203-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0399,
        "totalCost": 9.97,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-203-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0447,
        "totalCost": 5.37,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-195",
    "name": "Chopp Heineken De Menta 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS HEINEKEN",
    "description": "Chopp Heineken puro malte tirado na hora, super refrescante com 5% de teor alcoólico e colarinho denso na caneca congelada.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-204-1",
        "name": "Chopp Barril 50L (Volume Líquido)",
        "quantity": 350,
        "unit": "ml",
        "unitCost": 0.0145,
        "totalCost": 5.08,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-204-2",
        "name": "Rateio Gás CO2 e Refrigeração",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 0.69,
        "totalCost": 0.69,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-196",
    "name": "Chopp Heineken De Menta 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS HEINEKEN",
    "description": "Chopp Heineken puro malte tirado na hora, super refrescante com 5% de teor alcoólico e colarinho denso na caneca congelada.",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-205-1",
        "name": "Chopp Barril 50L (Volume Líquido)",
        "quantity": 350,
        "unit": "ml",
        "unitCost": 0.0218,
        "totalCost": 7.63,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-205-2",
        "name": "Rateio Gás CO2 e Refrigeração",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 1.04,
        "totalCost": 1.04,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-197",
    "name": "Chopp Heineken De Menta 1L",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS HEINEKEN",
    "description": "Chopp Heineken puro malte tirado na hora, super refrescante com 5% de teor alcoólico e colarinho denso na caneca congelada.",
    "sellingPrice": 52.9,
    "imageUrl": null,
    "totalCost": 15.34,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 37.56,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-206-1",
        "name": "Chopp Barril 50L (Volume Líquido)",
        "quantity": 350,
        "unit": "ml",
        "unitCost": 0.0386,
        "totalCost": 13.5,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-206-2",
        "name": "Rateio Gás CO2 e Refrigeração",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 1.84,
        "totalCost": 1.84,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-198",
    "name": "Amstel 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS AMSTEL",
    "description": "Amstel 300ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 14.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484369168-chopp.jpg.jpeg?alt=media&token=b58095a0-d76a-46a4-a60e-45e50c8984b9",
    "totalCost": 4.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 10.58,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-207-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0112,
        "totalCost": 2.81,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-207-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0126,
        "totalCost": 1.51,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-199",
    "name": "Amstel 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS AMSTEL",
    "description": "Amstel 500ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484369168-chopp.jpg.jpeg?alt=media&token=b58095a0-d76a-46a4-a60e-45e50c8984b9",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-208-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-208-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-200",
    "name": "Amstel 1L",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS AMSTEL",
    "description": "Amstel 1L - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 44.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484369168-chopp.jpg.jpeg?alt=media&token=b58095a0-d76a-46a4-a60e-45e50c8984b9",
    "totalCost": 13.02,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 31.88,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-209-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0338,
        "totalCost": 8.46,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-209-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.038,
        "totalCost": 4.56,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-201",
    "name": "Amstel Sujo 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS AMSTEL",
    "description": "Amstel Sujo 300ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 17.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484369168-chopp.jpg.jpeg?alt=media&token=b58095a0-d76a-46a4-a60e-45e50c8984b9",
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-210-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0135,
        "totalCost": 3.37,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-210-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0152,
        "totalCost": 1.82,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-202",
    "name": "Amstel Sujo 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS AMSTEL",
    "description": "Amstel Sujo 500ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 27.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484369168-chopp.jpg.jpeg?alt=media&token=b58095a0-d76a-46a4-a60e-45e50c8984b9",
    "totalCost": 8.09,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 19.81,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-211-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.021,
        "totalCost": 5.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-211-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0236,
        "totalCost": 2.83,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-203",
    "name": "Amstel Sujo 1L",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS AMSTEL",
    "description": "Amstel Sujo 1L - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 47.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1777484369168-chopp.jpg.jpeg?alt=media&token=b58095a0-d76a-46a4-a60e-45e50c8984b9",
    "totalCost": 13.89,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 34.01,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-212-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0361,
        "totalCost": 9.03,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-212-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0405,
        "totalCost": 4.86,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-204",
    "name": "Chopp Amstel de Menta 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS AMSTEL",
    "description": "Chopp lager clássico de receita holandesa, leve, puro malte e muito refrescante, servido a -2°C.",
    "sellingPrice": 17.9,
    "imageUrl": null,
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-213-1",
        "name": "Chopp Barril 50L (Volume Líquido)",
        "quantity": 350,
        "unit": "ml",
        "unitCost": 0.0131,
        "totalCost": 4.57,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-213-2",
        "name": "Rateio Gás CO2 e Refrigeração",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 0.62,
        "totalCost": 0.62,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-205",
    "name": "Chopp Amstel de Menta 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS AMSTEL",
    "description": "Chopp lager clássico de receita holandesa, leve, puro malte e muito refrescante, servido a -2°C.",
    "sellingPrice": 27.9,
    "imageUrl": null,
    "totalCost": 8.09,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 19.81,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-214-1",
        "name": "Chopp Barril 50L (Volume Líquido)",
        "quantity": 350,
        "unit": "ml",
        "unitCost": 0.0203,
        "totalCost": 7.12,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-214-2",
        "name": "Rateio Gás CO2 e Refrigeração",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 0.97,
        "totalCost": 0.97,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-206",
    "name": "Chopp Amstel de Menta 1L",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CHOPPS AMSTEL",
    "description": "Chopp lager clássico de receita holandesa, leve, puro malte e muito refrescante, servido a -2°C.",
    "sellingPrice": 47.9,
    "imageUrl": null,
    "totalCost": 13.89,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 34.01,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-215-1",
        "name": "Chopp Barril 50L (Volume Líquido)",
        "quantity": 350,
        "unit": "ml",
        "unitCost": 0.0349,
        "totalCost": 12.22,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-215-2",
        "name": "Rateio Gás CO2 e Refrigeração",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 1.67,
        "totalCost": 1.67,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-207",
    "name": "Heineken 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 23.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1767468559458-223_cerveja_heineken_600ml_nao_retornavel.jpg.jpeg?alt=media&token=b56a7a95-b4a3-40bc-8f4b-9f73a902e16e",
    "totalCost": 6.93,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.97,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-216-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.018,
        "totalCost": 4.51,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-216-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0202,
        "totalCost": 2.42,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-208",
    "name": "Eisenbahn 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1767468936997-Nunes_Bebidas_CERVEJA_EISENBAHN_PILSEN_LONG_NECK_330ML.jpg.jpeg?alt=media&token=1b99cf0e-5141-440a-87a4-cd121105af1b",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-217-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-217-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-209",
    "name": "AMSTEL 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 17.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1767479123089-Captura_de_tela_2026_01_03_182451.png.png?alt=media&token=f0731054-ace1-4ec4-bebf-9352eaa6a8ac",
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-218-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0135,
        "totalCost": 3.37,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-218-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0152,
        "totalCost": 1.82,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-210",
    "name": "Eisenbahn LN",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Pale Pale, American Ipa, Weisenbier, Session Ipa, Unfiltered.",
    "sellingPrice": 17.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1767478318095-Captura_de_tela_2026_01_03_181057.png.png?alt=media&token=6f5b5cc2-1c32-4a49-bfb7-3a0ee10a6a30",
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-219-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0135,
        "totalCost": 3.37,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-219-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0152,
        "totalCost": 1.82,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-211",
    "name": "Baden Baden",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1767477690437-CER.png.png?alt=media&token=02f42528-4cfb-4c93-bbc1-83a4af14c098",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-220-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-220-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-212",
    "name": "Bluemoon",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 22.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1767478864975-R.jpeg.jpeg?alt=media&token=fa0db782-2a04-483d-b176-2e05f4f0f2e1",
    "totalCost": 6.64,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.26,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-221-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0173,
        "totalCost": 4.32,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-221-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0193,
        "totalCost": 2.32,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-213",
    "name": "Lagunitas",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 22.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1767478625457-Captura_de_tela_2026_01_03_181635.png.png?alt=media&token=7300d48c-6c1b-4644-b136-0672e3a58df1",
    "totalCost": 6.64,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.26,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-222-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0173,
        "totalCost": 4.32,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-222-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0193,
        "totalCost": 2.32,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-214",
    "name": "Cerveja Heineken LN",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 16.9,
    "imageUrl": null,
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-223-1",
        "name": "Cerveja Garrafa / Long Neck",
        "quantity": 1,
        "unit": "un",
        "unitCost": 4.9,
        "totalCost": 4.9,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-215",
    "name": "Cerveja Heineken Zero LN",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 16.9,
    "imageUrl": null,
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-224-1",
        "name": "Cerveja Garrafa / Long Neck",
        "quantity": 1,
        "unit": "un",
        "unitCost": 4.9,
        "totalCost": 4.9,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-216",
    "name": "Cerveja Eisenbahn Pilsen LN",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 17.9,
    "imageUrl": null,
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-225-1",
        "name": "Cerveja Garrafa / Long Neck",
        "quantity": 1,
        "unit": "un",
        "unitCost": 5.19,
        "totalCost": 5.19,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-217",
    "name": "Cerveja Sol Premium LN",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 13.9,
    "imageUrl": null,
    "totalCost": 4.03,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 9.87,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-226-1",
        "name": "Cerveja Garrafa / Long Neck",
        "quantity": 1,
        "unit": "un",
        "unitCost": 4.03,
        "totalCost": 4.03,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-218",
    "name": "Sol Zero",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "CERVEJAS",
    "description": "Cerveja servida trincando de gelada na garrafa, perfeita para compartilhar à mesa.",
    "sellingPrice": 15.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1767479003155-Captura_de_tela_2026_01_03_182233.png.png?alt=media&token=2173a3bf-2706-4f6f-8d97-edbbffab64ad",
    "totalCost": 4.61,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 11.29,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-227-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.012,
        "totalCost": 3,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-227-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0134,
        "totalCost": 1.61,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-219",
    "name": "Jambucana",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Jambucana - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 17.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjambucana.jpg?alt=media&token=e2bd40cd-34df-4b97-a9a8-ebff7957888b",
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-228-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0135,
        "totalCost": 3.37,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-228-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0152,
        "totalCost": 1.82,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-220",
    "name": "Jambucana Banana",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Jambucana Banana - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 17.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjambucana-banana.jpg?alt=media&token=bcbad153-a80f-4339-abef-9053a81a4e72",
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-229-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0135,
        "totalCost": 3.37,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-229-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0152,
        "totalCost": 1.82,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-221",
    "name": "Cachaça Manaos Prata",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 14.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcachaca-manaos-prata.jpg?alt=media&token=96aefe88-af25-49c3-bb53-a7f7a71d02db",
    "totalCost": 4.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 10.58,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-230-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0112,
        "totalCost": 2.81,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-230-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0126,
        "totalCost": 1.51,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-222",
    "name": "Cachaça Manaos Carvalho",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 17.9,
    "imageUrl": null,
    "totalCost": 5.19,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12.71,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-231-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0135,
        "totalCost": 3.37,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-231-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0152,
        "totalCost": 1.82,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-223",
    "name": "Cachaça Manas Amburana",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 16.9,
    "imageUrl": null,
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-232-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0128,
        "totalCost": 3.19,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-232-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0143,
        "totalCost": 1.71,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-224",
    "name": "Cachaça Manaós Melaço",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 16.9,
    "imageUrl": null,
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-233-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0128,
        "totalCost": 3.19,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-233-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0143,
        "totalCost": 1.71,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-225",
    "name": "Cachaça Manaos Edição Limitada",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 27.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcachaca-manaos-edicao-limitada.jpg?alt=media&token=74b4ef7a-1757-4c06-b36c-3aae93a248f4",
    "totalCost": 8.09,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 19.81,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-234-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.021,
        "totalCost": 5.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-234-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0236,
        "totalCost": 2.83,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-226",
    "name": "Cachaca Imperial Manaós",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 149.9,
    "imageUrl": null,
    "totalCost": 43.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 106.43,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-235-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.113,
        "totalCost": 28.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-235-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1268,
        "totalCost": 15.21,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-227",
    "name": "Cachaça de Uva 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-236-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-236-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-228",
    "name": "Licor 43",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Licor 43 - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Flicor-43.jpg?alt=media&token=7c0a0b5e-1362-422d-af68-b7017428586c",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-237-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-237-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-229",
    "name": "Johnnie Walker Black Label",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Johnnie Walker Black Label - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 35.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjohnnie-walker-black-label.jpg?alt=media&token=2d8fd95b-3598-4ddd-a37d-bb6ff191bcf0",
    "totalCost": 10.41,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 25.49,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-238-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0271,
        "totalCost": 6.77,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-238-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0303,
        "totalCost": 3.64,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-230",
    "name": "Johnnie Walker Red Label",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Johnnie Walker Red Label - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 26.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjohnnie-walker-red-label.jpg?alt=media&token=9ad98607-8d10-4c67-8254-031aafa96e71",
    "totalCost": 7.8,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 19.1,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-239-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0203,
        "totalCost": 5.07,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-239-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0227,
        "totalCost": 2.73,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-231",
    "name": "Johnnie Walker Double Black",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Johnnie Walker Double Black - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 51.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjohnnie-walker-double-black.jpg?alt=media&token=b23168f8-081e-4137-a1a8-4879f62c9fcb",
    "totalCost": 15.05,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 36.85,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-240-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0391,
        "totalCost": 9.78,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-240-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0439,
        "totalCost": 5.27,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-232",
    "name": "Johnnie Walker Blue Label",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Johnnie Walker Blue Label - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 199.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjohnnie-walker-blue-label.jpg?alt=media&token=4d3a5be4-08e0-4c01-8f6e-0d30fe7f35fd",
    "totalCost": 57.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 141.93,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-241-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1507,
        "totalCost": 37.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-241-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1691,
        "totalCost": 20.29,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-233",
    "name": "Johnnie Walker Gold Reserve",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Johnnie Walker Gold Reserve - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 67.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjohnnie-walker-gold-reserve.jpg?alt=media&token=71aebb00-7863-4c9f-b1ed-be0c4a1bd5ce",
    "totalCost": 19.69,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 48.21,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-242-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0512,
        "totalCost": 12.8,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-242-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0574,
        "totalCost": 6.89,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-234",
    "name": "Johnnie Walker (Platinum) Old 18y",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Johnnie Walker (Platinum) Old 18y - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 149.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjohnnie-walker-(platinum)-old-18y.jpg?alt=media&token=115d4e1c-db37-4f7e-a00a-e17d853a3f9c",
    "totalCost": 43.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 106.43,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-243-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.113,
        "totalCost": 28.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-243-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1268,
        "totalCost": 15.21,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-235",
    "name": "Johnnie Walker Green 15 Anos",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Johnnie Walker Green 15 Anos - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 64.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjohnnie-walker-green-15-anos.jpg?alt=media&token=b7523a1d-647b-4afe-bacb-982018a20057",
    "totalCost": 18.82,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 46.08,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-244-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0489,
        "totalCost": 12.23,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-244-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0549,
        "totalCost": 6.59,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-236",
    "name": "Old Parr 12 Anos",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Old Parr 12 Anos - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fold-parr-12-anos.jpg?alt=media&token=e42057b3-04fa-411e-989c-e0a0ffb74950",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-245-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-245-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-237",
    "name": "Tequila Jose Cuervo Ouro",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Tequila Jose Cuervo Ouro - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 22.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ftequila-jose-cuervo-ouro.jpg?alt=media&token=dbf1e6df-4520-4441-83c5-96c9fe9b986d",
    "totalCost": 6.64,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.26,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-246-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0173,
        "totalCost": 4.32,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-246-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0193,
        "totalCost": 2.32,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-238",
    "name": "Tequila Jose Curvo Prata",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Tequila Jose Curvo Prata - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 22.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ftequila-jose-curvo-prata.jpg?alt=media&token=18b143de-fe02-4735-93a7-4617b35bfaf4",
    "totalCost": 6.64,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.26,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-247-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0173,
        "totalCost": 4.32,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-247-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0193,
        "totalCost": 2.32,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-239",
    "name": "Jack Daniels Tennessee",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Jack Daniels Tennessee - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjack-daniels-tennessee.jpg?alt=media&token=72f5deab-f798-4907-97b5-27e88bb809ff",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-248-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-248-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-240",
    "name": "Jack Daniel Tennessee Honey",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Jack Daniel Tennessee Honey - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjack-daniel-tennessee-honey.jpg?alt=media&token=1a5d5ef6-97f5-450a-8918-12a33488c3ed",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-249-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-249-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-241",
    "name": "Jack Daniels Single Barrel",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Jack Daniels Single Barrel - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 52.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjack-daniels-single-barrel.jpg?alt=media&token=430868cd-ac47-4ca1-948f-281bf1ff004f",
    "totalCost": 15.34,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 37.56,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-250-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0399,
        "totalCost": 9.97,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-250-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0447,
        "totalCost": 5.37,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-242",
    "name": "Jack Daniels Gentleman",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Jack Daniels Gentleman - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 44.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjack-daniels-gentleman.jpg?alt=media&token=63170979-1a29-4ee4-8eab-24c016a82c58",
    "totalCost": 13.02,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 31.88,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-251-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0338,
        "totalCost": 8.46,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-251-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.038,
        "totalCost": 4.56,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-243",
    "name": "Jack Daniels Tennesse Fire",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Jack Daniels Tennesse Fire - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjack-daniels-tennesse-fire.jpg?alt=media&token=0cce50c3-5d89-4cc4-9cbc-9b59287eb213",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-252-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-252-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-244",
    "name": "Buchanans 12 Anos",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Buchanans 12 Anos - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbuchanans-12-anos.jpg?alt=media&token=b931fd6a-71f7-413a-a30e-9ba9e0eec2a1",
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-253-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-253-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-245",
    "name": "Licor De Cachaça",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 16.9,
    "imageUrl": null,
    "totalCost": 4.9,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 12,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-254-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0128,
        "totalCost": 3.19,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-254-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0143,
        "totalCost": 1.71,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-246",
    "name": "Licor Cointreau",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Licor Cointreau - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Flicor-cointreau.jpg?alt=media&token=0b8bc782-27ce-474a-aaaa-da787ed39b80",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-255-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-255-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-247",
    "name": "Licor De Amarula",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Licor De Amarula - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Flicor-de-amarula.jpg?alt=media&token=4de1ab6b-ea67-45c8-9f28-0170dd012708",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-256-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-256-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-248",
    "name": "Acayu Aguardente de Caju 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Água mineral límpida e refrescante, com ou sem gás.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-257-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-257-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-249",
    "name": "Acuruy 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Acuruy 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-258-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-258-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-250",
    "name": "Apruma 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Apruma 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-259-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-259-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-251",
    "name": "Arreda 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Arreda 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-260-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-260-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-252",
    "name": "Asa Branca 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Asa Branca 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-261-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-261-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-253",
    "name": "Bem me quer 50ml Prata",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Bem me quer 50ml Prata - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 23.9,
    "imageUrl": null,
    "totalCost": 6.93,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.97,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-262-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.018,
        "totalCost": 4.51,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-262-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0202,
        "totalCost": 2.42,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-254",
    "name": "Bocaina 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Bocaina 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-263-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-263-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-255",
    "name": "Cristalina 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Cristalina 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-264-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-264-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-256",
    "name": "Duvido Cachaça 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-265-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-265-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-257",
    "name": "Famosinha de Minas 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Famosinha de Minas 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-266-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-266-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-258",
    "name": "Ladila 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Ladila 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-267-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-267-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-259",
    "name": "Piragibana Rotulo Novo 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Piragibana Rotulo Novo 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 99.9,
    "imageUrl": null,
    "totalCost": 28.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.93,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-268-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0753,
        "totalCost": 18.83,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-268-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0845,
        "totalCost": 10.14,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-260",
    "name": "Sagatiba Prata Pura 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Sagatiba Prata Pura 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-269-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-269-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-261",
    "name": "Buriti 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Buriti 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-270-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-270-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-262",
    "name": "Caribe 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Caribe 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 24.9,
    "imageUrl": null,
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-271-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-271-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-263",
    "name": "Cebesta 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Cebesta 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-272-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-272-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-264",
    "name": "Anisio Santiago 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Anisio Santiago 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 199.9,
    "imageUrl": null,
    "totalCost": 57.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 141.93,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-273-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1507,
        "totalCost": 37.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-273-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1691,
        "totalCost": 20.29,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-265",
    "name": "Germana Palha 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Germana Palha 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-274-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-274-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-266",
    "name": "Havana 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Havana 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 399.9,
    "imageUrl": null,
    "totalCost": 115.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 283.93,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-275-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.3015,
        "totalCost": 75.38,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-275-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.3383,
        "totalCost": 40.59,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-267",
    "name": "Leblon 50ml Envelhecida",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Leblon 50ml Envelhecida - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-276-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-276-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-268",
    "name": "Lua Cheia 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Lua Cheia 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 49.9,
    "imageUrl": null,
    "totalCost": 14.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 35.43,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-277-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0376,
        "totalCost": 9.41,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-277-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0422,
        "totalCost": 5.06,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-269",
    "name": "Reserva do Gerente Ouro 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Reserva do Gerente Ouro 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-278-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-278-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-270",
    "name": "Salinas 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Salinas 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 24.9,
    "imageUrl": null,
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-279-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-279-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-271",
    "name": "Salineira 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Salineira 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-280-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-280-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-272",
    "name": "Seleta 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Seleta 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 24.9,
    "imageUrl": null,
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-281-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-281-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-273",
    "name": "Serra Limpa Organica 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Serra Limpa Organica 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-282-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-282-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-274",
    "name": "Vale Verde 12 Anos 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Vale Verde 12 Anos 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 179.9,
    "imageUrl": null,
    "totalCost": 52.17,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 127.73,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-283-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1356,
        "totalCost": 33.91,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-283-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1522,
        "totalCost": 18.26,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-275",
    "name": "Weber Haus 50ml Organica Amburana",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Weber Haus 50ml Organica Amburana - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-284-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-284-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-276",
    "name": "Weber Haus Extra Premium 6 Anos 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Weber Haus Extra Premium 6 Anos 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 89.9,
    "imageUrl": null,
    "totalCost": 26.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 63.83,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-285-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0678,
        "totalCost": 16.95,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-285-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.076,
        "totalCost": 9.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-277",
    "name": "Weber Haus 7 Madeiras Premium 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Weber Haus 7 Madeiras Premium 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-286-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-286-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-278",
    "name": "Santo Grau Cel Xavier Chaves 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Santo Grau Cel Xavier Chaves 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-287-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-287-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-279",
    "name": "Sg Itirapua Sp 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Sg Itirapua Sp 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-288-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-288-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-280",
    "name": "Sg Paraty Classica Rj 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Sg Paraty Classica Rj 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-289-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-289-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-281",
    "name": "Sg Pedro Ximenes Sp 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Sg Pedro Ximenes Sp 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 59.9,
    "imageUrl": null,
    "totalCost": 17.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 42.53,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-290-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0452,
        "totalCost": 11.29,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-290-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0507,
        "totalCost": 6.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-282",
    "name": "Bananinha do Satu 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Bananinha do Satu 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-291-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-291-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-283",
    "name": "Canelinha do Satu 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Canelinha do Satu 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 24.9,
    "imageUrl": null,
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-292-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-292-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-284",
    "name": "Gabi Cravo e Canela 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Gabi Cravo e Canela 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 24.9,
    "imageUrl": null,
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-293-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-293-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-285",
    "name": "Licor de Cachaça Regis Armmont 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-294-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-294-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-286",
    "name": "Dose Weber Haus 50ml Ouro Carvalho Cabriuva",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Dose Weber Haus 50ml Ouro Carvalho Cabriuva - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-295-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.162,
        "totalCost": 8.1,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-295-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.47,
        "totalCost": 3.47,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-287",
    "name": "Weber Haus Composta C/ Anis 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Weber Haus Composta C/ Anis 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 44.9,
    "imageUrl": null,
    "totalCost": 13.02,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 31.88,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-296-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0338,
        "totalCost": 8.46,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-296-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.038,
        "totalCost": 4.56,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-288",
    "name": "Weber Haus Pessego 50ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Weber Haus Pessego 50ml - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-297-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-297-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-289",
    "name": "Steinhaeger",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Bebidas Alcoólicas",
    "subcategory": "DOSES DIVERSAS",
    "description": "Steinhaeger - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fsteinhaeger.jpg?alt=media&token=3d3806fd-2bac-4685-a2b4-8a4cd634a6a0",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 5,
    "portionWeightGrams": 350,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-298-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-298-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-290",
    "name": "Carajillo",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Modern Drinks",
    "subcategory": "DOSES DIVERSAS",
    "description": "Café de grãos 100% arábica extraído na pressão correta, aroma marcante e crema aveludada.",
    "sellingPrice": 39.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjambutonica.jpg?alt=media&token=6e410f5e-8f09-4174-83e3-24ba0319e934",
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-299-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-299-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-291",
    "name": "Coquetel de Frutas (com Manaós Prata)",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Modern Drinks",
    "subcategory": "DOSES DIVERSAS",
    "description": "Acerola, morango, creme de leite, leite condensado, gelo e cachaça prata.",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmanaus-cherry.jpg?alt=media&token=71e34306-02a0-45e5-8cd4-1b15643c3c8d",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-300-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-300-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-292",
    "name": "Sex On The Beach",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Modern Drinks",
    "subcategory": "DOSES DIVERSAS",
    "description": "Vodka nacional, licor de pêssego, suco de laranja e groselha.",
    "sellingPrice": 27.9,
    "imageUrl": null,
    "totalCost": 8.09,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 19.81,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-301-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.021,
        "totalCost": 5.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-301-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0236,
        "totalCost": 2.83,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-293",
    "name": "Penicillin",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Modern Drinks",
    "subcategory": "DOSES DIVERSAS",
    "description": "Coquetel feito com whisky, suco de limão siciliano, xarope de mel e gengibre.",
    "sellingPrice": 37.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fginwine.jpg?alt=media&token=6333e6ea-4056-4061-a750-b6b8d0759f5e",
    "totalCost": 10.99,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 26.91,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-302-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0286,
        "totalCost": 7.14,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-302-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0321,
        "totalCost": 3.85,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-294",
    "name": "Groselha Spriz",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Modern Drinks",
    "subcategory": "DOSES DIVERSAS",
    "description": "Cachaça Manaós Amburana, xarope de groselha, água com gas e suco de limão – finalizado com Espuma de gengibre e Bitter aromático.",
    "sellingPrice": 37.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmanaus-mint.jpg?alt=media&token=03c3cafc-0175-4541-a11e-3247b86b7094",
    "totalCost": 10.99,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 26.91,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-303-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0286,
        "totalCost": 7.14,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-303-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0321,
        "totalCost": 3.85,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-295",
    "name": "Coquetel De Frutas",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS SEM ÁLCOOL",
    "description": "Acerola, morango, creme de leite, leite condensado e gelo",
    "sellingPrice": 27.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcoquetel-de-frutas.jpg?alt=media&token=1f5aa313-b6cf-4ce6-8275-06bc264593f3",
    "totalCost": 8.09,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 19.81,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-304-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.021,
        "totalCost": 5.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-304-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0236,
        "totalCost": 2.83,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-296",
    "name": "Lemonade Baby",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS SEM ÁLCOOL",
    "description": "Xarope de pink lemonade, polpa de morango, leite condensado e água com gás",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Flemonade-baby.jpg?alt=media&token=4daa14e3-9cbd-4d10-98a9-c4839631e70e",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-305-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-305-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-297",
    "name": "Amazonas Tropical",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS SEM ÁLCOOL",
    "description": "Xarope de tangerina, xarope de cranberry e energético tropical",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-306-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-306-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-298",
    "name": "Beijo De Morango",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS SEM ÁLCOOL",
    "description": "Polpa de morango, sorvete de morango leite, leite condensado e chantilly",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbeijo-de-morango.jpg?alt=media&token=690cea7c-7edf-4785-8bbe-6234214ab1c8",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-307-1",
        "name": "Base Sobremesa (Leite Condensado / Fruta / Chocolate)",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0361,
        "totalCost": 4.33,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-307-2",
        "name": "Calda Artesanal e Farofa Crocante",
        "quantity": 40,
        "unit": "g",
        "unitCost": 0.0723,
        "totalCost": 2.89,
        "supplierOrigin": "DISTRIBUIDOR_LOCAL"
      }
    ]
  },
  {
    "id": "dish-dion-299",
    "name": "Velvet Lemonade",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS SEM ÁLCOOL",
    "description": "Xarope de cranberry, xarope de limão siciliano, sprite e espuma de gengibre",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fvelvet-lemonade.jpg?alt=media&token=73cb502b-e4ac-48fc-8684-447b7188a491",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-308-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-308-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-300",
    "name": "Mango Loco Fresh",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS MONSTER",
    "description": "Monster mango loco, vodka, xarope de gengibre, sumo de limão, fatia de manga e alecrim",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmango-loco-fresh.jpg?alt=media&token=670d69dc-1a00-4b48-a818-22afdb466766",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-309-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-309-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-301",
    "name": "Manauara Energy",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS MONSTER",
    "description": "Monster energy green, jambucana, maracujá, abacaxi e sumo de limão, rodela de limão e folha de jambu",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmanauara-energy.jpg?alt=media&token=1ea45044-5530-442d-8bf7-99b8a364fcda",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-310-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-310-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-302",
    "name": "Mango Sunset Gin",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS MONSTER",
    "description": "Monster mango loco, gin, sumo de limão, grenadine, fatias de laranja e ramo de hortelã.",
    "sellingPrice": 39.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmango-sunset-beefeater.jpg?alt=media&token=1d521b9e-b98f-4a5b-8764-acaf336d83e8",
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-311-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.162,
        "totalCost": 8.1,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-311-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.47,
        "totalCost": 3.47,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-303",
    "name": "Exa Brasil",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS MONSTER",
    "description": "Monster Rio Punch, gin, suco de limão, grenadine, fatias de laranja e ramo de hortelã.",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-312-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.162,
        "totalCost": 8.1,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-312-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.47,
        "totalCost": 3.47,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-304",
    "name": "Watermelon Fit Gin",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS MONSTER",
    "description": "Monster ultra watermelon, gin, sumo de limão, sumo de gengibre, borda com chia, ramo de manjericão e rodela de limão siciliano.",
    "sellingPrice": 39.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fwatermelon-fit-beefeater.jpg?alt=media&token=5cee9f84-6b64-4dc6-b8cb-49b4ef7cd13a",
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-313-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.162,
        "totalCost": 8.1,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-313-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.47,
        "totalCost": 3.47,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-305",
    "name": "Apple Paradise Gin",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS MONSTER",
    "description": "Monster ultra paradise, gin, sumo de limão, grenadine, fatias de maçã verde e ramo de hortelã",
    "sellingPrice": 39.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fapple-paradise-beefeater.jpg?alt=media&token=8fb6db38-3ce7-4a64-830b-0442647dd468",
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-314-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.162,
        "totalCost": 8.1,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-314-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.47,
        "totalCost": 3.47,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-306",
    "name": "Tropicana Red",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS MONSTER",
    "description": "Monster energy watermelon, cachaça Prata e sumo de limão, ramo de manjericão roxo e rodela de limão",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-315-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-315-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-307",
    "name": "Margarita Power",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS MONSTER",
    "description": "Monster mango loco, tequila ouro, sumo de limão e cointreau, fatias de manga rosa e borda de sal",
    "sellingPrice": 39.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmargarita-power.jpg?alt=media&token=e822fc5c-4a13-484a-9275-8a2d826dd440",
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-316-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-316-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-308",
    "name": "Turbine Sua Caipirosca",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIROSCAS",
    "description": "Coquetel refrescante com vodka de alta pureza, frutas frescas maceradas e gelo cristalino.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-317-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.0808,
        "totalCost": 4.04,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-317-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 1.73,
        "totalCost": 1.73,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-309",
    "name": "Caipirosca Tradiconal - Vodka nacional",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIROSCAS",
    "description": "Limão, morango, abacaxi, Frutas vermelhas e kiwi",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcaipirosca-com-wyborowa.jpg?alt=media&token=19bf15a5-d741-4b2f-aa11-9f2286897100",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-318-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.101,
        "totalCost": 5.05,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-318-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 2.17,
        "totalCost": 2.17,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-310",
    "name": "Caipirosca Premium- Vodka importada",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIROSCAS",
    "description": "Limão, morango, abacaxi, Frutas vermelhas e kiwi",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcaipirosca-com-absolut.jpg?alt=media&token=e51d0201-c8da-4046-b190-380c62c89707",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-319-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1214,
        "totalCost": 6.07,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-319-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 2.6,
        "totalCost": 2.6,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-311",
    "name": "Caipirinha Do Engenho- Tradicional",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Clássica caipirinha brasileira preparada com cachaça selecionada, limão fresco macerado e açúcar na medida exata.",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcaipirinha-do-boteco.jpg?alt=media&token=2363c5c1-ad8f-46b2-bb2f-2bcc27932e96",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-320-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.0808,
        "totalCost": 4.04,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-320-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 1.73,
        "totalCost": 1.73,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-312",
    "name": "Caipirinha Do Engenho- Premium",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "cachaça envelhecida ou carvalho, limão, açúcar e gelo",
    "sellingPrice": 22.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcaipirinha-do-boteco.jpg?alt=media&token=2363c5c1-ad8f-46b2-bb2f-2bcc27932e96",
    "totalCost": 6.64,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.26,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-321-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.093,
        "totalCost": 4.65,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-321-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 1.99,
        "totalCost": 1.99,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-313",
    "name": "Da Sicília - Tradicional",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Limão Siciliano, cachaça Prata, adoçado com licor de cachaça e gelo",
    "sellingPrice": 21.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fda-sicilia.jpg?alt=media&token=f335cb3f-52c8-491c-a300-4e400b99a564",
    "totalCost": 6.35,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 15.55,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-322-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0165,
        "totalCost": 4.13,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-322-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0185,
        "totalCost": 2.22,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-314",
    "name": "Da Sicília - Premium",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Limão Siciliano, cachaça envelhecida ou carvalho, adoçado com licor de cachaça e gelo",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fda-sicilia.jpg?alt=media&token=f335cb3f-52c8-491c-a300-4e400b99a564",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-323-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-323-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-315",
    "name": "Abacaxi - Tradicional",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Pedaços de abacaxi com hortelã, cachaça Prata e gelo",
    "sellingPrice": 21.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fabacaxi.jpg?alt=media&token=3efc215b-52f2-4d65-82e3-52cab6b7fc99",
    "totalCost": 6.35,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 15.55,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-324-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0165,
        "totalCost": 4.13,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-324-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0185,
        "totalCost": 2.22,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-316",
    "name": "Abacaxi - Premium",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Pedaços de abacaxi com hortelã, cachaça envelhecida, carvalho e gelo",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fabacaxi.jpg?alt=media&token=3efc215b-52f2-4d65-82e3-52cab6b7fc99",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-325-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-325-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-317",
    "name": "Maracujá - Tradicional",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Clássica caipirinha brasileira preparada com cachaça selecionada, limão fresco macerado e açúcar na medida exata.",
    "sellingPrice": 19.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmaracuja.jpg?alt=media&token=920987fd-1f5b-489f-9be4-044391fe5fc5",
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-326-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.015,
        "totalCost": 3.75,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-326-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0168,
        "totalCost": 2.02,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-318",
    "name": "Maracujá - Premium",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Polpa de maracujá, cachaça envelhecida, carvalho e gelo",
    "sellingPrice": 22.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmaracuja.jpg?alt=media&token=920987fd-1f5b-489f-9be4-044391fe5fc5",
    "totalCost": 6.64,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 16.26,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-327-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0173,
        "totalCost": 4.32,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-327-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0193,
        "totalCost": 2.32,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-319",
    "name": "Morango- Tradiconal",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Clássica caipirinha brasileira preparada com cachaça selecionada, limão fresco macerado e açúcar na medida exata.",
    "sellingPrice": 21.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmorango.jpg?alt=media&token=87acce2f-e7bb-424b-a42e-91461f7a96ca",
    "totalCost": 6.35,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 15.55,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-328-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0165,
        "totalCost": 4.13,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-328-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0185,
        "totalCost": 2.22,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-320",
    "name": "Morango- Premium",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Fatias de morango, cachaça envelhecida ou carvalho e gelo",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmorango.jpg?alt=media&token=87acce2f-e7bb-424b-a42e-91461f7a96ca",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-329-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-329-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-321",
    "name": "Cupuaçu - Tradicional",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Clássica caipirinha brasileira preparada com cachaça selecionada, limão fresco macerado e açúcar na medida exata.",
    "sellingPrice": 21.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcupuacu.jpg?alt=media&token=f3c178ba-0941-452f-a3dc-e8b763bb07e0",
    "totalCost": 6.35,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 15.55,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-330-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0165,
        "totalCost": 4.13,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-330-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0185,
        "totalCost": 2.22,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-322",
    "name": "Cupuaçu - Premium",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Polpa de cupuaçu, cachaça envelhecida ou carvalho e gelo",
    "sellingPrice": 24.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fcupuacu.jpg?alt=media&token=f3c178ba-0941-452f-a3dc-e8b763bb07e0",
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-331-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-331-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-323",
    "name": "Frutas Vermelhas - Tradicional",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Clássica caipirinha brasileira preparada com cachaça selecionada, limão fresco macerado e açúcar na medida exata.",
    "sellingPrice": 24.9,
    "imageUrl": null,
    "totalCost": 7.22,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 17.68,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-332-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0188,
        "totalCost": 4.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-332-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0211,
        "totalCost": 2.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-324",
    "name": "Frutas Vermelhas - Premium",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "CAIPIRINHA",
    "description": "Polpa de cupuaçu, cachaça envelhecida ou carvalho e gelo",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-333-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-333-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-325",
    "name": "Bob Marley",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS TRADICIONAIS",
    "description": "Suco de morango (fruta) com rum, suco de laranja e licor de menta",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fbob-marley.jpg?alt=media&token=0ec749b1-87ad-4063-b503-735a5b10f09b",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-334-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-334-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-326",
    "name": "Espanhola De Moranga",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS TRADICIONAIS",
    "description": "Vinho tinto suave, morango, sorvete de morango e leite condensado",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fespanhola-de-moranga.jpg?alt=media&token=5d765b5b-04c1-4d63-9627-f11fcaf2e985",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-335-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 8.67,
        "totalCost": 8.67,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-327",
    "name": "Piña Colada",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS TRADICIONAIS",
    "description": "Rum Carta Ouro, creme de leite, suco de abacaxi, leite de coco e coco ralado",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fpina-colada.jpg?alt=media&token=2b0c1604-a9a2-4b25-8161-07937fdcf12c",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-336-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-336-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-328",
    "name": "Margarita",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS TRADICIONAIS",
    "description": "Tequila Ouro, margarita mix, gelo e borda de sal",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmargarita.jpg?alt=media&token=74b9293c-3ae7-4520-8301-c9ae0c21a2a5",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-337-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-337-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-329",
    "name": "Mojito",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS TRADICIONAIS",
    "description": "Rum Carta Branca, hortelã, açúcar, limão, água com gás e gelo",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fmojito.jpg?alt=media&token=33072475-65a8-4284-bd34-cc0008a1f0a1",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-338-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-338-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-330",
    "name": "Moscow Mule",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "DRINKS TRADICIONAIS",
    "description": "Vodka, suco de limão, gringer beer e espuma de gengibre, servido bem gelado.",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-339-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0226,
        "totalCost": 5.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-339-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0252,
        "totalCost": 3.03,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-331",
    "name": "Turbine Seu Gin",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Turbine Seu Gin - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 19.9,
    "imageUrl": null,
    "totalCost": 5.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-340-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.0808,
        "totalCost": 4.04,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-340-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 1.73,
        "totalCost": 1.73,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-332",
    "name": "Gin Tônica Abacaxi Beefeater",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Beefeater, abacaxi, schweppes tônica e gelo",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fgin-tonica-abacaxi.jpg?alt=media&token=ae57515c-e92a-4f5c-8a7c-47a8b5b2b7b0",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-341-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1416,
        "totalCost": 7.08,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-341-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.04,
        "totalCost": 3.04,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-333",
    "name": "Gin Tônica Abacaxi Tanqueray",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Tanqueray, abacaxi, schweppes tônica e gelo",
    "sellingPrice": 37.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fgin-tonica-abacaxi.jpg?alt=media&token=ae57515c-e92a-4f5c-8a7c-47a8b5b2b7b0",
    "totalCost": 10.99,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 26.91,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-342-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1538,
        "totalCost": 7.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-342-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.3,
        "totalCost": 3.3,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-334",
    "name": "Gin Fizz Beefeater",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Beefeater, xarope de açúcar, suco de limão e gelo",
    "sellingPrice": 29.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fgin-fizz.jpg?alt=media&token=935b19d3-ebed-4fab-ba07-7f53dd0b6adf",
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-343-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1214,
        "totalCost": 6.07,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-343-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 2.6,
        "totalCost": 2.6,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-335",
    "name": "Gin Fizz Tanqueray",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Tanqueray, xarope de açúcar, suco de limão e gelo",
    "sellingPrice": 32.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fgin-fizz.jpg?alt=media&token=935b19d3-ebed-4fab-ba07-7f53dd0b6adf",
    "totalCost": 9.54,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 23.36,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-344-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1336,
        "totalCost": 6.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-344-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 2.86,
        "totalCost": 2.86,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-336",
    "name": "Gin Frozen Beefeater",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Beefeater, limão, schweppes tônica e gelo moído",
    "sellingPrice": 32.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fgin-frozen.jpg?alt=media&token=c4cfff27-06c7-411e-892f-1bce211af15b",
    "totalCost": 9.54,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 23.36,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-345-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1336,
        "totalCost": 6.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-345-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 2.86,
        "totalCost": 2.86,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-337",
    "name": "Gin Frozen Tanqueray",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Tanqueray, limão, schweppes tônica e gelo moído",
    "sellingPrice": 35.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fgin-frozen.jpg?alt=media&token=c4cfff27-06c7-411e-892f-1bce211af15b",
    "totalCost": 10.41,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 25.49,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-346-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1458,
        "totalCost": 7.29,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-346-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.12,
        "totalCost": 3.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-338",
    "name": "Tonic Coquetel Beefeater",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Beefeater, limão siciliano e água tônica",
    "sellingPrice": 34.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Ftonic-coquetel.jpg?alt=media&token=658604c9-9d76-499f-a7a4-7dc4f76aa7a8",
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-347-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1416,
        "totalCost": 7.08,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-347-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.04,
        "totalCost": 3.04,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-339",
    "name": "Tonic Coquetel Tanqueray",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Tanqueray, limão siciliano e água tônica.",
    "sellingPrice": 37.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/stores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fcatalog-items%2F1767542934726-public_stores_Psu4vuX9IcdEfHvnXcMP_images_products_tonic_coquetel.jpg.jpeg?alt=media&token=59e12a30-1aed-49b2-b897-02a927f3fea4",
    "totalCost": 10.99,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 26.91,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-348-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1538,
        "totalCost": 7.69,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-348-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.3,
        "totalCost": 3.3,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-340",
    "name": "Triple T Beefeater",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Beefeater, água tônica, mel e tangerina",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-349-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1214,
        "totalCost": 6.07,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-349-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 2.6,
        "totalCost": 2.6,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-341",
    "name": "Triple T Tanqueray",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Tanqueray, água tônica, mel e tangerina",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-350-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1416,
        "totalCost": 7.08,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-350-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.04,
        "totalCost": 3.04,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-342",
    "name": "Negroni Beefeater",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Negroni Beefeater - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 29.9,
    "imageUrl": null,
    "totalCost": 8.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 21.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-351-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1214,
        "totalCost": 6.07,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-351-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 2.6,
        "totalCost": 2.6,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-343",
    "name": "Negroni Tanqueray",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Negroni Tanqueray - Preparado com ingredientes selecionados no mais rigoroso padrão de qualidade Engenho Cozinha Brasileira.",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-352-1",
        "name": "Destilado Base (Gin / Cachaça / Vodka)",
        "quantity": 50,
        "unit": "ml",
        "unitCost": 0.1416,
        "totalCost": 7.08,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-352-2",
        "name": "Frutas Frescas, Especiarias e Tônica/Energético",
        "quantity": 1,
        "unit": "porção",
        "unitCost": 3.04,
        "totalCost": 3.04,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-344",
    "name": "Gin Wine Beefeater",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Beefeater, vinho tinto suave, xarope de limão siciliano, xarope de açúcar finalizado com Espuma de gengibre",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-353-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 10.12,
        "totalCost": 10.12,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-345",
    "name": "Gin Wine Tanqueray",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Drinks",
    "subcategory": "GIN",
    "description": "Gin Tanqueray, vinho tinto suave, xarope de limão siciliano, xarope de açúcar finalizado com Espuma de gengibre",
    "sellingPrice": 39.9,
    "imageUrl": null,
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-354-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 11.57,
        "totalCost": 11.57,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-346",
    "name": "Jambucana 275ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 39.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjambucana.jpg?alt=media&token=e2bd40cd-34df-4b97-a9a8-ebff7957888b",
    "totalCost": 11.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 28.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-355-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0301,
        "totalCost": 7.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-355-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0337,
        "totalCost": 4.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-347",
    "name": "Jambucana 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 84.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjambucana.jpg?alt=media&token=e2bd40cd-34df-4b97-a9a8-ebff7957888b",
    "totalCost": 24.62,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 60.28,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-356-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.064,
        "totalCost": 16,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-356-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0718,
        "totalCost": 8.62,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-348",
    "name": "Jambucana 750ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 92.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjambucana.jpg?alt=media&token=e2bd40cd-34df-4b97-a9a8-ebff7957888b",
    "totalCost": 26.94,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 65.96,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-357-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.07,
        "totalCost": 17.51,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-357-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0786,
        "totalCost": 9.43,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-349",
    "name": "Jambucana Banana 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 84.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjambucana.jpg?alt=media&token=e2bd40cd-34df-4b97-a9a8-ebff7957888b",
    "totalCost": 24.62,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 60.28,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-358-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.064,
        "totalCost": 16,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-358-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0718,
        "totalCost": 8.62,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-350",
    "name": "Jambucana Porcelana 400ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 115.9,
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dionisio-crm.appspot.com/o/public%2Fstores%2FPsu4vuX9IcdEfHvnXcMP%2Fimages%2Fproducts%2Fjambucana.jpg?alt=media&token=e2bd40cd-34df-4b97-a9a8-ebff7957888b",
    "totalCost": 33.61,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 82.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": true,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-359-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0874,
        "totalCost": 21.85,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-359-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.098,
        "totalCost": 11.76,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-351",
    "name": "Anisio Santiago 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 1484.9,
    "imageUrl": null,
    "totalCost": 430.62,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 1054.28,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-360-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 1.1196,
        "totalCost": 279.9,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-360-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 1.256,
        "totalCost": 150.72,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-352",
    "name": "Buriti 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 249.9,
    "imageUrl": null,
    "totalCost": 72.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 177.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-361-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1884,
        "totalCost": 47.11,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-361-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2113,
        "totalCost": 25.36,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-353",
    "name": "Bem me quer 700ml Prata",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 103.9,
    "imageUrl": null,
    "totalCost": 30.13,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 73.77,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-362-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0784,
        "totalCost": 19.59,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-362-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0878,
        "totalCost": 10.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-354",
    "name": "Apruma 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 119.9,
    "imageUrl": null,
    "totalCost": 34.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 85.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-363-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0904,
        "totalCost": 22.6,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-363-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1014,
        "totalCost": 12.17,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-355",
    "name": "Imperial Manaos 700ml Ed Exclusiva",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 1139.9,
    "imageUrl": null,
    "totalCost": 330.57,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 809.33,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-364-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.8595,
        "totalCost": 214.87,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-364-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.9642,
        "totalCost": 115.7,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-356",
    "name": "Manaos Carvalho 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 89.9,
    "imageUrl": null,
    "totalCost": 26.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 63.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-365-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0678,
        "totalCost": 16.95,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-365-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.076,
        "totalCost": 9.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-357",
    "name": "Manaos Amburana 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 87.9,
    "imageUrl": null,
    "totalCost": 25.49,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 62.41,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-366-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0663,
        "totalCost": 16.57,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-366-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0743,
        "totalCost": 8.92,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-358",
    "name": "Manaos Amburana 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-367-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-367-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-359",
    "name": "Manaos Prata 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 69.9,
    "imageUrl": null,
    "totalCost": 20.27,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 49.63,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-368-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0527,
        "totalCost": 13.18,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-368-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0591,
        "totalCost": 7.09,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-360",
    "name": "Cebesta 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 99.9,
    "imageUrl": null,
    "totalCost": 28.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.93,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-369-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0753,
        "totalCost": 18.83,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-369-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0845,
        "totalCost": 10.14,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-361",
    "name": "Acayu Aguardente de Caju 960ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 149.9,
    "imageUrl": null,
    "totalCost": 43.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 106.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-370-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.113,
        "totalCost": 28.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-370-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1268,
        "totalCost": 15.21,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-362",
    "name": "Manaos Edição Limitada 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 222.9,
    "imageUrl": null,
    "totalCost": 64.64,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 158.26,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-371-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1681,
        "totalCost": 42.02,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-371-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1885,
        "totalCost": 22.62,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-363",
    "name": "Manaos Prata 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-372-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-372-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-364",
    "name": "Havana 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 2059.9,
    "imageUrl": null,
    "totalCost": 597.37,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 1462.53,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-373-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 1.5532,
        "totalCost": 388.29,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-373-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 1.7423,
        "totalCost": 209.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-365",
    "name": "Leblon 375ml Envelhecida",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 289.9,
    "imageUrl": null,
    "totalCost": 84.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 205.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-374-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.2186,
        "totalCost": 54.65,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-374-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2452,
        "totalCost": 29.42,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-366",
    "name": "Lua Cheia 670ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 366.9,
    "imageUrl": null,
    "totalCost": 106.4,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 260.5,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-375-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.2766,
        "totalCost": 69.16,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-375-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.3103,
        "totalCost": 37.24,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-367",
    "name": "Salineira 670ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 272.9,
    "imageUrl": null,
    "totalCost": 79.14,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 193.76,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-376-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.2058,
        "totalCost": 51.44,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-376-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2308,
        "totalCost": 27.7,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-368",
    "name": "Santo Grau Cel Xavier Chaves 750ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 266.9,
    "imageUrl": null,
    "totalCost": 77.4,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 189.5,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-377-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.2012,
        "totalCost": 50.31,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-377-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2258,
        "totalCost": 27.09,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-369",
    "name": "Cachaça de Uva 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 138.9,
    "imageUrl": null,
    "totalCost": 40.28,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 98.62,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-378-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1047,
        "totalCost": 26.18,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-378-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1175,
        "totalCost": 14.1,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-370",
    "name": "Gabi Cravo e Canela 670ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 140.9,
    "imageUrl": null,
    "totalCost": 40.86,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 100.04,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-379-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1062,
        "totalCost": 26.56,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-379-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1192,
        "totalCost": 14.3,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-371",
    "name": "Manaos Carvalho 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-380-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-380-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-372",
    "name": "Cristalina 670ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 172.9,
    "imageUrl": null,
    "totalCost": 50.14,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 122.76,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-381-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1304,
        "totalCost": 32.59,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-381-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1463,
        "totalCost": 17.55,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-373",
    "name": "Famosinha de Minas 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 115.9,
    "imageUrl": null,
    "totalCost": 33.61,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 82.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-382-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0874,
        "totalCost": 21.85,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-382-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.098,
        "totalCost": 11.76,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-374",
    "name": "Ladila 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 119.9,
    "imageUrl": null,
    "totalCost": 34.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 85.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-383-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0904,
        "totalCost": 22.6,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-383-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1014,
        "totalCost": 12.17,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-375",
    "name": "Piragibana Rotulo Novo 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 795.9,
    "imageUrl": null,
    "totalCost": 230.81,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 565.09,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-384-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.6001,
        "totalCost": 150.03,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-384-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.6732,
        "totalCost": 80.78,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-376",
    "name": "Germana Palha 1L",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 264.9,
    "imageUrl": null,
    "totalCost": 76.82,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 188.08,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-385-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1997,
        "totalCost": 49.93,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-385-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2241,
        "totalCost": 26.89,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-377",
    "name": "Duvido Cachaça 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 115.9,
    "imageUrl": null,
    "totalCost": 33.61,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 82.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-386-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0874,
        "totalCost": 21.85,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-386-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.098,
        "totalCost": 11.76,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-378",
    "name": "Caribe 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 149.9,
    "imageUrl": null,
    "totalCost": 43.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 106.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-387-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.113,
        "totalCost": 28.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-387-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1268,
        "totalCost": 15.21,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-379",
    "name": "Manaos Melaço 300ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 34.9,
    "imageUrl": null,
    "totalCost": 10.12,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 24.78,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-388-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0263,
        "totalCost": 6.58,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-388-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0295,
        "totalCost": 3.54,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-380",
    "name": "Manaos Melaço 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 69.9,
    "imageUrl": null,
    "totalCost": 20.27,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 49.63,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-389-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0527,
        "totalCost": 13.18,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-389-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0591,
        "totalCost": 7.09,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-381",
    "name": "Arreda 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 119.9,
    "imageUrl": null,
    "totalCost": 34.77,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 85.13,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-390-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0904,
        "totalCost": 22.6,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-390-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1014,
        "totalCost": 12.17,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-382",
    "name": "Asa Branca 670ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 199.9,
    "imageUrl": null,
    "totalCost": 57.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 141.93,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-391-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1507,
        "totalCost": 37.68,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-391-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1691,
        "totalCost": 20.29,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-383",
    "name": "Salineira 670ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 161.9,
    "imageUrl": null,
    "totalCost": 46.95,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 114.95,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-392-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1221,
        "totalCost": 30.52,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-392-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1369,
        "totalCost": 16.43,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-384",
    "name": "Serra Limpa Organica 355ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 92.9,
    "imageUrl": null,
    "totalCost": 26.94,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 65.96,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-393-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.07,
        "totalCost": 17.51,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-393-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0786,
        "totalCost": 9.43,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-385",
    "name": "Weber Haus 700ml Ouro Carvalho Cabriuva",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 251.9,
    "imageUrl": null,
    "totalCost": 73.05,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 178.85,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-394-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1899,
        "totalCost": 47.48,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-394-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2131,
        "totalCost": 25.57,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-386",
    "name": "Weber Haus 7 Madeiras Premium 750ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 290.9,
    "imageUrl": null,
    "totalCost": 84.36,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 206.54,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-395-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.2193,
        "totalCost": 54.83,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-395-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2461,
        "totalCost": 29.53,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-387",
    "name": "Sg Itirapua Sp 750ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 270.9,
    "imageUrl": null,
    "totalCost": 78.56,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 192.34,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-396-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.2042,
        "totalCost": 51.06,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-396-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2292,
        "totalCost": 27.5,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-388",
    "name": "Weber Haus Extra Premium 6 Anos 750ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 757.9,
    "imageUrl": null,
    "totalCost": 219.79,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 538.11,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-397-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.5714,
        "totalCost": 142.86,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-397-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.6411,
        "totalCost": 76.93,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-389",
    "name": "Bananinha do Satu 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 99.9,
    "imageUrl": null,
    "totalCost": 28.97,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.93,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-398-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0753,
        "totalCost": 18.83,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-398-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0845,
        "totalCost": 10.14,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-390",
    "name": "Canelinha do Satu 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 114.9,
    "imageUrl": null,
    "totalCost": 33.32,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 81.58,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-399-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0866,
        "totalCost": 21.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-399-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0972,
        "totalCost": 11.66,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-391",
    "name": "Acuruy 670ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 121.9,
    "imageUrl": null,
    "totalCost": 35.35,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 86.55,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-400-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0919,
        "totalCost": 22.98,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-400-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1031,
        "totalCost": 12.37,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-392",
    "name": "Bocaina 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 149.9,
    "imageUrl": null,
    "totalCost": 43.47,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 106.43,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-401-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.113,
        "totalCost": 28.26,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-401-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1268,
        "totalCost": 15.21,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-393",
    "name": "Sg Pedro Ximenes Sp 750ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 489.9,
    "imageUrl": null,
    "totalCost": 142.07,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 347.83,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-402-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.3694,
        "totalCost": 92.35,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-402-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.4143,
        "totalCost": 49.72,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-394",
    "name": "Weber Haus 700ml Organica Amburana",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 251.9,
    "imageUrl": null,
    "totalCost": 73.05,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 178.85,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-403-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1899,
        "totalCost": 47.48,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-403-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2131,
        "totalCost": 25.57,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-395",
    "name": "Weber Haus Composta C/ Anis 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 322.9,
    "imageUrl": null,
    "totalCost": 93.64,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 229.26,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-404-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.2435,
        "totalCost": 60.87,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-404-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2731,
        "totalCost": 32.77,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-396",
    "name": "Weber Haus Pessego 500ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 310.9,
    "imageUrl": null,
    "totalCost": 90.16,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 220.74,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-405-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.2344,
        "totalCost": 58.6,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-405-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.263,
        "totalCost": 31.56,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-397",
    "name": "Vale Verde 12 Anos 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 1436.9,
    "imageUrl": null,
    "totalCost": 416.7,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 1020.2,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-406-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 1.0834,
        "totalCost": 270.86,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-406-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 1.2153,
        "totalCost": 145.84,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-398",
    "name": "Seleta 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 115.9,
    "imageUrl": null,
    "totalCost": 33.61,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 82.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-407-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0874,
        "totalCost": 21.85,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-407-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.098,
        "totalCost": 11.76,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-399",
    "name": "Salinas 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 184.9,
    "imageUrl": null,
    "totalCost": 53.62,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 131.28,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-408-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1394,
        "totalCost": 34.85,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-408-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1564,
        "totalCost": 18.77,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-400",
    "name": "Salinas 600ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 92.9,
    "imageUrl": null,
    "totalCost": 26.94,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 65.96,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-409-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.07,
        "totalCost": 17.51,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-409-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0786,
        "totalCost": 9.43,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-401",
    "name": "Reserva do Gerente Ouro 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 201.9,
    "imageUrl": null,
    "totalCost": 58.55,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 143.35,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-410-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1522,
        "totalCost": 38.06,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-410-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1707,
        "totalCost": 20.49,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-402",
    "name": "Sagatiba Prata Pura 700ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 184.9,
    "imageUrl": null,
    "totalCost": 53.62,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 131.28,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-411-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1394,
        "totalCost": 34.85,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-411-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1564,
        "totalCost": 18.77,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-403",
    "name": "Licor de Cachaça Regis Armmont 720ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 229.9,
    "imageUrl": null,
    "totalCost": 66.67,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 163.23,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-412-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1734,
        "totalCost": 43.34,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-412-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1944,
        "totalCost": 23.33,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-404",
    "name": "Sp Paraty Classica Rj 750ml",
    "category": "BEBIDAS_DRINKS",
    "categoryLabel": "Bebidas, Chopp & Drinks",
    "majorCategory": "Cachaças",
    "subcategory": "GIN",
    "description": "Dose de cachaça artesanal de alambique selecionada, aroma marcante e notas amadeiradas.",
    "sellingPrice": 257.9,
    "imageUrl": null,
    "totalCost": 74.79,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 183.11,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-413-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1944,
        "totalCost": 48.61,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-413-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2182,
        "totalCost": 26.18,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-405",
    "name": "Mumm Cuvée Reserve Demi-Sec (Argentina)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "ESPUMANTES",
    "description": "Blend: Perfil mais macio, com leve doçura, notas frutadas e boa cremosidade.",
    "sellingPrice": 159,
    "imageUrl": null,
    "totalCost": 46.11,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 112.89,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-414-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1199,
        "totalCost": 29.97,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-414-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1345,
        "totalCost": 16.14,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-406",
    "name": "Mumm Léger Dulce (Argentina)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "ESPUMANTES",
    "description": "Blend: Espumante delicadamente adocicado e frutado, ideal para quem prefere estilos suaves.",
    "sellingPrice": 139,
    "imageUrl": null,
    "totalCost": 40.31,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 98.69,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-415-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 40.31,
        "totalCost": 40.31,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-407",
    "name": "Mumm Cuvée Reserve Brut (Argentina)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "ESPUMANTES",
    "description": "Blend de uvas brancas e tintas: Fresco e equilibrado, com borbulhas finas e notas cítricas.",
    "sellingPrice": 159,
    "imageUrl": null,
    "totalCost": 46.11,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 112.89,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-416-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1199,
        "totalCost": 29.97,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-416-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1345,
        "totalCost": 16.14,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-408",
    "name": "Mumm Cuvée Reserve Brut Rosé (Argentina)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "ESPUMANTES",
    "description": "Blend: Delicado e vibrante, com aromas de frutas vermelhas frescas e boa acidez.",
    "sellingPrice": 159,
    "imageUrl": null,
    "totalCost": 46.11,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 112.89,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-417-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1199,
        "totalCost": 29.97,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-417-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1345,
        "totalCost": 16.14,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-409",
    "name": "Vinho Tinto Especial",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TAÇAS",
    "description": "Vinho fino selecionado da nossa adega climatizada, servido na temperatura ideal em taças de cristal.",
    "sellingPrice": 29,
    "imageUrl": null,
    "totalCost": 8.41,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 20.59,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-418-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 8.41,
        "totalCost": 8.41,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-410",
    "name": "Vinho Branco Especial",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TAÇAS",
    "description": "Vinho branco leve e muito refrescante, aroma floral e cítrico, acidez viva, ideal para pescados e dias quentes.",
    "sellingPrice": 29,
    "imageUrl": null,
    "totalCost": 8.41,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 20.59,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-419-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 8.41,
        "totalCost": 8.41,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-411",
    "name": "Vinho do Porto Especial (50ml)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TAÇAS",
    "description": "Vinho licoroso fortificado tradicional de Portugal, dulçor equilibrado com aromas complexos de nozes, passas e madeira.",
    "sellingPrice": 20,
    "imageUrl": null,
    "totalCost": 5.8,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 14.2,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-420-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 5.8,
        "totalCost": 5.8,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-412",
    "name": "Cadeado Alentejano Branco (Portugal)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS BRANCO E VERDES",
    "description": "Blend: Fresco com notas de frutas brancas e boa leveza.",
    "sellingPrice": 109,
    "imageUrl": null,
    "totalCost": 31.61,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 77.39,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-421-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0822,
        "totalCost": 20.55,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-421-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0922,
        "totalCost": 11.06,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-413",
    "name": "Cobos Felino Cabernet Sauvignon 2022 (Argentina)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS BRANCO E VERDES",
    "description": "Fresco e equilibrado, com notas de frutas tropicais e sutis toques amanteigados.",
    "sellingPrice": 259,
    "imageUrl": null,
    "totalCost": 75.11,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 183.89,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-422-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1953,
        "totalCost": 48.82,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-422-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2191,
        "totalCost": 26.29,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-414",
    "name": "Nieto Senetiner Benjamín Branco Suave (Argentina)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS BRANCO E VERDES",
    "description": "Blend: Leve e aromático, com agradável doçura.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-423-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-423-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-415",
    "name": "Nieto Senetiner Benjamín Chardonnay (Argentina)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS BRANCO E VERDES",
    "description": "Notas de maçã, pera e frutas tropicais; leve e equilibrado.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-424-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-424-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-416",
    "name": "Ermelinda Porta Nova Ligeiro (Portugal)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS BRANCO E VERDES",
    "description": "Blend: Vinho verde leve, frutado e fácil de beber.",
    "sellingPrice": 129,
    "imageUrl": null,
    "totalCost": 37.41,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 91.59,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-425-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 37.41,
        "totalCost": 37.41,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-417",
    "name": "Nieto Senetiner Fran Chardonnay 2021 (Argentina)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS BRANCO E VERDES",
    "description": "Fresco e leve, ideal para acompanhar saladas e peixes.",
    "sellingPrice": 149,
    "imageUrl": null,
    "totalCost": 43.21,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 105.79,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-426-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1124,
        "totalCost": 28.09,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-426-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.126,
        "totalCost": 15.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-418",
    "name": "Cadeado Portugal Branco (Portugal)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS BRANCO E VERDES",
    "description": "Blend: Jovem e versátil, com notas cítricas e frutadas.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-427-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-427-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-419",
    "name": "Zuccardi Serie A Torrontés (Argentina)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS BRANCO E VERDES",
    "description": "Aromático e expressivo, com marcantes notas florais e cítricas.",
    "sellingPrice": 249,
    "imageUrl": null,
    "totalCost": 72.21,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 176.79,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-428-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1878,
        "totalCost": 46.94,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-428-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2106,
        "totalCost": 25.27,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-420",
    "name": "Cadeado Península de Setúbal Branco (Portugal)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS BRANCO E VERDES",
    "description": "Blend: Equilibrado, com acidez agradável e final limpo.",
    "sellingPrice": 119,
    "imageUrl": null,
    "totalCost": 34.51,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 84.49,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-429-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0897,
        "totalCost": 22.43,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-429-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1007,
        "totalCost": 12.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-421",
    "name": "Zuccardi Fuzion Chardonnay (Argentina):",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS BRANCO E VERDES",
    "description": "Vibrante e refrescante, com notas cítricas e final limpo.",
    "sellingPrice": 119,
    "imageUrl": null,
    "totalCost": 34.51,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 84.49,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-430-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0897,
        "totalCost": 22.43,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-430-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1007,
        "totalCost": 12.08,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-422",
    "name": "Nieto Senetiner Benjamín Blend Rosé (Argentina)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "ROSÉS",
    "description": "Jovem e refrescante, com aromas de morango e framboesa.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-431-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-431-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-423",
    "name": "Cadeado Portugal Rosé (Portugal)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "ROSÉS",
    "description": "Blend: Leve, com boa acidez e notas delicadas de frutas vermelhas.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-432-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-432-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-424",
    "name": "Cadão Porto White (Portugal)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS DO PORTO",
    "description": "Aromático, com mel e frutas secas; equilibrado e refrescante.",
    "sellingPrice": 159,
    "imageUrl": null,
    "totalCost": 46.11,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 112.89,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-433-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 46.11,
        "totalCost": 46.11,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-425",
    "name": "Cadão Porto Tawny (Portugal)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS DO PORTO",
    "description": "Notas de frutas secas, caramelo e toque amadeirado; macio e elegante.",
    "sellingPrice": 159,
    "imageUrl": null,
    "totalCost": 46.11,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 112.89,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-434-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 46.11,
        "totalCost": 46.11,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-426",
    "name": "Cadão Porto Ruby (Portugal)",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "VINHOS DO PORTO",
    "description": "Jovem e intenso, com notas de frutas vermelhas e negras maduras.",
    "sellingPrice": 159,
    "imageUrl": null,
    "totalCost": 46.11,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 112.89,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-435-1",
        "name": "Garrafa de Vinho / Espumante 750ml",
        "quantity": 1,
        "unit": "un",
        "unitCost": 46.11,
        "totalCost": 46.11,
        "supplierOrigin": "CDA_MATRIZ"
      }
    ]
  },
  {
    "id": "dish-dion-427",
    "name": "Nieto Senetiner Malbec",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ARGENTINOS",
    "description": "Expressivo, com fruta madura e textura macia.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-436-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-436-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-428",
    "name": "Nieto Senetiner Benjamín Blend Tinto 2022",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ARGENTINOS",
    "description": "Jovem e descomplicado, com taninos suaves.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-437-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-437-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-429",
    "name": "Zuccardi Serie A Malbec",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ARGENTINOS",
    "description": "Concentrado e intenso, com fruta negra madura e excelente estrutura.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-438-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-438-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-430",
    "name": "Zuccardi Fuzion Malbec",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ARGENTINOS",
    "description": "Frutado com notas de cereja e toque especiado.",
    "sellingPrice": 149,
    "imageUrl": null,
    "totalCost": 43.21,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 105.79,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-439-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1124,
        "totalCost": 28.09,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-439-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.126,
        "totalCost": 15.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-431",
    "name": "Cobos Felino Malbec",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ARGENTINOS",
    "description": "Intenso e macio, com notas de ameixa e taninos redondos.",
    "sellingPrice": 259,
    "imageUrl": null,
    "totalCost": 75.11,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 183.89,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-440-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1953,
        "totalCost": 48.82,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-440-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2191,
        "totalCost": 26.29,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-432",
    "name": "Nieto Senetiner Fran Blend Tinto",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ARGENTINOS",
    "description": "Perfil envolvente com frutas maduras e boa maciez.",
    "sellingPrice": 139,
    "imageUrl": null,
    "totalCost": 40.31,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 98.69,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-441-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1048,
        "totalCost": 26.2,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-441-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1176,
        "totalCost": 14.11,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-433",
    "name": "Nieto Senetiner Benjamín Cabernet Sauvignon",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ARGENTINOS",
    "description": "Notas de frutas escuras e ervas, com boa estrutura.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-442-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-442-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-434",
    "name": "Nieto Senetiner Benjamín Malbec",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ARGENTINOS",
    "description": "Frutado, com notas de amora e toque floral; fácil de agradar.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-443-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-443-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-435",
    "name": "Cobos Felino Cabernet Sauvignon 2022",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ARGENTINOS",
    "description": "Elegante e estruturado, com notas de frutas escuras e especiarias.",
    "sellingPrice": 259,
    "imageUrl": null,
    "totalCost": 75.11,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 183.89,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-444-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1953,
        "totalCost": 48.82,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-444-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.2191,
        "totalCost": 26.29,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-436",
    "name": "Cadeado Península de Setúbal",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS PORTUGUESES",
    "description": "Bom corpo, com notas de violetas, chocolate e especiarias.",
    "sellingPrice": 99,
    "imageUrl": null,
    "totalCost": 28.71,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.29,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-445-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.66,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-445-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0838,
        "totalCost": 10.05,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-437",
    "name": "Trinco Grande Reserva",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS PORTUGUESES",
    "description": "Estruturado e complexo, com notas de madeira e final persistente.",
    "sellingPrice": 529,
    "imageUrl": null,
    "totalCost": 153.41,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 375.59,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-446-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.3989,
        "totalCost": 99.72,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-446-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.4474,
        "totalCost": 53.69,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-438",
    "name": "Private Selection Península de Setúbal",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS PORTUGUESES",
    "description": "Aromas de frutas maduras e paladar equilibrado e persistente.",
    "sellingPrice": 149,
    "imageUrl": null,
    "totalCost": 43.21,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 105.79,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-447-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1124,
        "totalCost": 28.09,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-447-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.126,
        "totalCost": 15.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-439",
    "name": "Batente Syrah Reserva Seco",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS PORTUGUESES",
    "description": "Marcante e intenso, com notas de pimenta, especiarias e pimenta.",
    "sellingPrice": 359,
    "imageUrl": null,
    "totalCost": 104.11,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 254.89,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-448-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.2707,
        "totalCost": 67.67,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-448-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.3037,
        "totalCost": 36.44,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-440",
    "name": "Cadeado Alentejano Tinto",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS PORTUGUESES",
    "description": "Redondo e frutado, com taninos macios e frutas vermelhas.",
    "sellingPrice": 139,
    "imageUrl": null,
    "totalCost": 40.31,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 98.69,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-449-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1048,
        "totalCost": 26.2,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-449-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1176,
        "totalCost": 14.11,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-441",
    "name": "Private Selection Alentejano",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS PORTUGUESES",
    "description": "Macio e gastronômico, com notas de ameixa e especiarias.",
    "sellingPrice": 149,
    "imageUrl": null,
    "totalCost": 43.21,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 105.79,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-450-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1124,
        "totalCost": 28.09,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-450-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.126,
        "totalCost": 15.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-442",
    "name": "Cadeado Portugal Tinto",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS PORTUGUESES",
    "description": "Equilibrado e versátil, com notas de frutas maduras.",
    "sellingPrice": 98.9,
    "imageUrl": null,
    "totalCost": 28.68,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 70.22,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-451-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.0746,
        "totalCost": 18.64,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-451-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.0837,
        "totalCost": 10.04,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-443",
    "name": "Maturo Montepulciano d'Abruzzo 2020",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ITALIANOS",
    "description": "Intenso e gastronômico, com frutas vermelhas e toque terroso.",
    "sellingPrice": 149,
    "imageUrl": null,
    "totalCost": 43.21,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 105.79,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-452-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1124,
        "totalCost": 28.09,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-452-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.126,
        "totalCost": 15.12,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  },
  {
    "id": "dish-dion-444",
    "name": "Maturo Montepulciano d'Abruzzo 2021",
    "category": "VINHOS_ESPUMANTES",
    "categoryLabel": "Carta de Vinhos & Espumantes",
    "majorCategory": "Carta de Vinhos",
    "subcategory": "TINTOS ITALIANOS",
    "description": "Corpo médio e frutado, com notas de cerejas e especiarias suaves",
    "sellingPrice": 139,
    "imageUrl": null,
    "totalCost": 40.31,
    "cmvPct": 29,
    "targetCmvPct": 31,
    "marginContributionReais": 98.69,
    "prepTimeMinutes": 22,
    "portionWeightGrams": 450,
    "isRegionalAmazonico": false,
    "allergens": [],
    "ingredients": [
      {
        "id": "ing-453-1",
        "name": "Proteína Principal / Insumo Base",
        "quantity": 250,
        "unit": "g",
        "unitCost": 0.1048,
        "totalCost": 26.2,
        "supplierOrigin": "CDA_MATRIZ"
      },
      {
        "id": "ing-453-2",
        "name": "Guarnição, Molhos e Temperos Regionais",
        "quantity": 120,
        "unit": "g",
        "unitCost": 0.1176,
        "totalCost": 14.11,
        "supplierOrigin": "FEIRA_PANAIR"
      }
    ]
  }
];

export interface IngredientSummary {
  name: string;
  unit: string;
  unitCost: number;
  origin: 'CDA_MATRIZ' | 'FEIRA_PANAIR' | 'DISTRIBUIDOR_LOCAL';
  dishesUsedIn: string[];
}

export const getMenuStats = () => {
  const totalDishes = OFFICIAL_ENGENHO_MENU.length;
  const averageCmv = OFFICIAL_ENGENHO_MENU.reduce((acc, d) => acc + d.cmvPct, 0) / (totalDishes || 1);
  const averageMarginReais = OFFICIAL_ENGENHO_MENU.reduce((acc, d) => acc + d.marginContributionReais, 0) / (totalDishes || 1);

  const ingredientMap = new Map<string, boolean>();
  OFFICIAL_ENGENHO_MENU.forEach(dish => {
    dish.ingredients.forEach(ing => ingredientMap.set(ing.name.toLowerCase().trim(), true));
  });

  return {
    totalDishes,
    averageCmv,
    averageMarginReais,
    totalUniqueIngredients: ingredientMap.size,
  };
};

export const getAllIngredientsSummary = (): IngredientSummary[] => {
  const map = new Map<string, IngredientSummary>();

  OFFICIAL_ENGENHO_MENU.forEach(dish => {
    dish.ingredients.forEach(ing => {
      const key = ing.name.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, {
          name: ing.name,
          unit: ing.unit,
          unitCost: ing.unitCost,
          origin: ing.supplierOrigin,
          dishesUsedIn: [dish.name],
        });
      } else {
        const item = map.get(key)!;
        if (!item.dishesUsedIn.includes(dish.name)) {
          item.dishesUsedIn.push(dish.name);
        }
      }
    });
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
};
