import fs from 'fs';

// Read existing customerMenuData.json
const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));

// --------------------------------------------------------------------------
// 1. DICTIONARY OF SPECIFIC DISH TITLES (Full and Partial exact matches)
// --------------------------------------------------------------------------
const DISH_TITLE_EXACT = {
  // Entradas & Petiscos
  'Couvert do Engenho': {
    en: 'Engenho Signature Bread & Spreads Couvert',
    es: 'Couvert Artesanal de la Casa Engenho'
  },
  'Azeitonas Empanadas': {
    en: 'Crispy Panko-Breaded Green Olives',
    es: 'Aceitunas Verdes Empanizadas Crujientes'
  },
  'Crocante de Costela': {
    en: 'Crispy Pulled Beef Rib Croquettes',
    es: 'Croquetas Crujientes de Costilla Deshebrada'
  },
  'Trio do Engenho': {
    en: 'Engenho Taster Trio (Pastel, Rib & Tapioca)',
    es: 'Trío Degustación do Engenho (Pastel, Costilla y Tapioca)'
  },
  'Rocambole Suíno': {
    en: 'Crispy Crackling Pork Belly Roulade (Pururuca)',
    es: 'Panceta de Cerdo Enrollada y Crujiente (Pururuca)'
  },
  'Isca de Carne de Sol do Engenho': {
    en: 'Engenho Sun-Cured Beef Bites with Fried Cassava',
    es: 'Bocaditos de Carne de Sol con Yuca Frita'
  },
  'Isca De Carne De Sol Do Engenho': {
    en: 'Engenho Sun-Cured Beef Bites with Fried Cassava',
    es: 'Bocaditos de Carne de Sol con Yuca Frita'
  },
  'Joelho Trinchado': {
    en: 'Sliced Smoked Pork Shank with Rustic Potatoes',
    es: 'Codillo de Cerdo Ahumado con Papas Rústicas'
  },
  'Filé com Fritas': {
    en: 'Tender Beef Tenderloin Strips with French Fries',
    es: 'Tiras de Lomo de Res Salteadas con Papas Fritas'
  },
  'Filé Com Fritas': {
    en: 'Tender Beef Tenderloin Strips with French Fries',
    es: 'Tiras de Lomo de Res Salteadas con Papas Fritas'
  },
  'Coraçãozinho de Galinha': {
    en: 'Charcoal-Grilled Garlic Chicken Hearts',
    es: 'Corazones de Pollo a la Brasa con Ajo Laminado'
  },
  'Dadinho de Tapioca': {
    en: 'Golden Tapioca & Coalho Cheese Cubes',
    es: 'Dados Crujientes de Tapioca y Queso Coalho'
  },
  'Dadinho de Tapioca (de forno)': {
    en: 'Oven-Baked Golden Tapioca & Coalho Cheese Cubes',
    es: 'Dados de Tapioca y Queso al Horno'
  },
  'Pão De Alho': {
    en: 'Artisanal Charcoal-Toasted Garlic Bread',
    es: 'Pan Baguette Tostado a la Brasa con Crema de Ajo'
  },
  'Pão de Alho': {
    en: 'Artisanal Charcoal-Toasted Garlic Bread',
    es: 'Pan Baguette Tostado a la Brasa con Crema de Ajo'
  },
  'Macaxeira Frita': {
    en: 'Crispy Golden Amazonian Cassava (Yucca)',
    es: 'Yuca Frita Dorada y Crujiente al Estilo Amazónico'
  },
  'Batata Frita': {
    en: 'Crispy Golden French Fries',
    es: 'Papas Fritas Crujientes y Doradas'
  },
  'Caldinho de Feijão': {
    en: 'Slow-Simmered Black Bean Broth with Bacon',
    es: 'Caldito Concentrado de Frijoles con Tocino'
  },
  'Feijuca ao Som de Samba': {
    en: 'Traditional Brazilian Feijoada Feast (Buffet)',
    es: 'Gran Feijoada Brasileña Tradicional (Buffet)'
  },
  'Bowl Brasileiro Proteico': {
    en: 'Brazilian Protein Bowl with Grilled Chicken & Grains',
    es: 'Bowl Brasileño Proteico con Pollo a la Plancha'
  },
  'Salada Amazônica Proteica': {
    en: 'Amazonian Protein Salad with Shrimps & Brazil Nuts',
    es: 'Ensalada Amazónica Proteica con Camarones y Castañas'
  },
  'Salada Verano': {
    en: 'Summer Verano Garden Salad with House Dressing',
    es: 'Ensalada de Verano con Aderezo Especial'
  },
  'Bolinho De Carne Seca Executivo': {
    en: 'Crispy Jerked Beef Croquettes (Executive)',
    es: 'Croquetas de Carne Seca Brasileña (Ejecutivo)'
  },
  'Carne De Sol Nordestina': {
    en: 'Northeastern Brazilian Sun-Cured Beef with Creamy Baião',
    es: 'Carne de Sol Nordestina con Baião Cremoso y Yuca'
  },
  'Costela De Tambaqui Executivo': {
    en: 'Amazonian Tambaqui Ribs na Brasa (Executive Lunch)',
    es: 'Costillas de Tambaquí Amazónico a la Brasa (Ejecutivo)'
  },
  'Moqueca De Banana Da Terra': {
    en: 'Plantain Moqueca Stew with Coconut Milk & Brazil Nuts',
    es: 'Moqueca de Plátano Macho con Leche de Coco y Castañas'
  },
  'Bobó De Camarão Executivo': {
    en: 'Creamy Cassava & Shrimp Bobó Stew (Executive)',
    es: 'Bobó Cremoso de Yuca y Camarones (Ejecutivo)'
  },
  'Moqueca de Pirarucu': {
    en: 'Amazonian Pirarucu Clay-Pot Moqueca Stew',
    es: 'Moqueca Tradicional de Pirarucú en Cazuela de Barro'
  },
  'Carne de Panela': {
    en: 'Homestyle Braised Pot Roast Beef in Rich Gravy',
    es: 'Estofado Casero de Res en su Jugo con Puré de Papas'
  },
  'Pirarucu Grelhado com Legumes': {
    en: 'Charcoal-Grilled Amazonian Pirarucu with Garden Vegetables',
    es: 'Filete de Pirarucú a la Parrilla con Vegetales Salteados'
  },
  'Carne Magra na Brasa': {
    en: 'Lean Prime Steak na Brasa with Fresh Salad',
    es: 'Corte Magro de Res a la Parrilla con Ensalada Fresca'
  },
  'Bobó de Camarão': {
    en: 'Bahian Shrimp Bobó in Velvety Cassava & Coconut Puree',
    es: 'Bobó de Camarones en Crema de Yuca y Leche de Coco'
  },

  // Pizzas & Massas
  'Grande Calabresa': {
    en: 'Large Smoked Calabresa Sausage & Onion Artisanal Pizza',
    es: 'Pizza Grande de Longaniza Calabresa con Cebolla'
  },
  'Grande Mussarela': {
    en: 'Large Classic Mozzarella & Oregano Artisanal Pizza',
    es: 'Pizza Grande Clásica de Queso Mozzarella y Orégano'
  },
  'Caldeirão de Carne de Sol': {
    en: 'Cast-Iron Pot Cassava Shepherd’s Pie with Sun-Cured Beef',
    es: 'Calderito de Hierro de Yuca con Carne de Sol Gratinada'
  },
  'Caldeirão de Charque': {
    en: 'Cast-Iron Pot Cassava Shepherd’s Pie with Shredded Jerked Beef',
    es: 'Calderito de Hierro de Yuca con Carne Seca Gratinada'
  },
  'Combo Caldeirão Engenho 2 Unidades': {
    en: 'Engenho Duo Cast-Iron Cassava Pies (Choose 2)',
    es: 'Combo Dúo de Calderitos de Yuca Artesanales (Elige 2)'
  },

  // Charcutaria & Sanduíches
  'Sanduiche de Pernil': {
    en: 'Slow-Braised Pulled Pork Shank Sandwich on Terra & Mar Bread',
    es: 'Bocadillo de Pernil Deshebrado a Fuego Lento en Pan Artesanal'
  },
  'Sanduiche de Mortadela Italiana': {
    en: 'Thinly Sliced Italian Mortadella Sandwich on Crusty Bread',
    es: 'Bocadillo de Mortadela Italiana en Finas Láminas'
  },
  'Choripán': {
    en: 'Artisanal Grilled Sausage Choripán with Chimichurri',
    es: 'Choripán Artesanal a la Brasa con Chimichurri'
  },
  'Sanduiche de Conservas (Veg)': {
    en: 'Vegetarian Deli Sandwich with Marinated Artisan Pickles',
    es: 'Bocadillo Vegetariano con Conservas Artesanales'
  },
  'Sanduiche de Pastrami': {
    en: 'Smoked Peppered Beef Pastrami Sandwich on Crusty Bread',
    es: 'Bocadillo de Pastrami Ahumado de Res en Pan Artesanal'
  },
  'Misto Especial': {
    en: 'Artisanal Brioche Toast with Ham & Melted Cheese',
    es: 'Tostón de Pan Brioche con Jamón y Queso Fundido'
  },
  'Sanduiche de Jamon': {
    en: 'Spanish Cured Jamón & Aged Reino Cheese Artisanal Baguette',
    es: 'Bocadillo Gourmet de Jamón Español y Queso Curado'
  },

  // Sobremesas
  'Mini Pudim de Leite': {
    en: 'Velvety Caramel Milk Flan with Dulce de Leche',
    es: 'Flan Casero de Leche Condensada con Dulce de Leche'
  },
  'Sorvete com Farofa de Brownie': {
    en: 'Artisanal Ice Cream with Crunchy Brownie Crumble',
    es: 'Helado Artesanal con Crumble Crujiente de Brownie'
  },
  'Pastel de Belém': {
    en: 'Authentic Portuguese Custard Tart (Pastel de Nata)',
    es: 'Pastel de Belém Portugués Tradicional de Hojaldre'
  },
  'Mousse de Cupuaçu': {
    en: 'Velvety Amazonian Cupuaçu Rainforest Mousse',
    es: 'Mousse Sedosa de Copoazú de la Selva Amazónica'
  },
  'Abacaxi Braseado': {
    en: 'Charcoal-Grilled Pineapple Glazed with Cinnamon',
    es: 'Piña Asada a las Brasas con Toque de Canela'
  },
  'Doce de Banana com Castanha': {
    en: 'Caramelized Sweet Plantain with Crunchy Brazil Nuts',
    es: 'Plátano Dulce Caramelizado con Castañas de Pará'
  },
  'Chocolate 70% com Castanha': {
    en: '70% Dark Artisan Chocolate Bar with Roasted Brazil Nuts',
    es: 'Chocolate Semiamargo 70% Cacao con Castañas Seleccionadas'
  },
  'Doce A Dois': {
    en: 'Sweet Plantain with Coalho Cheese, Cinnamon & Cream',
    es: 'Plátano Pacovã con Queso Coalho, Canela y Crema de Leche'
  },
  'Taça de Cupuaçu/Amazônica': {
    en: 'Cupuaçu Parfait with Dark Chocolate Ganache & Sliced Brazil Nuts',
    es: 'Copa Amazónica de Crema de Copoazú, Ganache y Castañas'
  },
  'Mousse de Maracujá': {
    en: 'Tangy Brazilian Passion Fruit Mousse',
    es: 'Mousse Refrescante de Maracuyá Silvestre'
  },

  // Chopp & Drinks
  'Chopp Brahma Barril 50L (Volume Líquido)': {
    en: 'Draft Beer Brahma Pilsen in Frosted Mug (-2°C)',
    es: 'Cerveza de Barril Brahma Pilsen en Tarro Helado (-2°C)'
  },
  'Camarões na Cerveja': {
    en: 'Beer-Battered Crispy Shrimps with Herb Dip',
    es: 'Camarones Rebozados en Cerveza con Salsa de la Casa'
  },
  'Mini Mimo': {
    en: 'Mini Mimo Cocktail (Imported Sparkling & Fresh Orange)',
    es: 'Mini Cóctel Mimo (Espumoso Importado con Jugo de Naranja)'
  },
  'Curto Caipfe': {
    en: 'Curto Caipfe (Espresso Coffee & Brazilian Cachaça Caipirinha)',
    es: 'Curto Caipfe (Caipirinha Tradicional de Café y Cachaça)'
  },
  'Marmelada Inglesa Miúda': {
    en: 'Mini English Marmalade Cocktail (Gin & Citrus Orange Jam)',
    es: 'Mini Cóctel Marmelada Inglesa (Ginebra y Mermelada de Naranja)'
  },
  'Exíguo Vésper Bond': {
    en: 'Mini Vesper Martini 007 (Gin, Vodka & Lillet Blanc)',
    es: 'Mini Vesper Martini 007 (Ginebra, Vodka y Lillet)'
  },
  'Fitzgerald Diminuto': {
    en: 'Mini Fitzgerald Cocktail (Gin, Lemon Juice & Angostura)',
    es: 'Mini Cóctel Fitzgerald (Ginebra, Limón y Angostura)'
  },
  'Negroni Rosé baixinho': {
    en: 'Mini Negroni Rosé (Gin, Campari & Rosé Vermouth)',
    es: 'Mini Negroni Rosé (Ginebra, Campari y Vermouth Rosado)'
  },
  'Pequeno Rose de Verano': {
    en: 'Mini Rosé de Verano Wine Cooler',
    es: 'Mini Vino Rosado de Verano con Toque Cítrico'
  },

  // Vinhos & Espumantes
  'Mumm Cuvée Reserve Demi-Sec (Argentina)': {
    en: 'Mumm Cuvée Reserve Demi-Sec Sparkling Wine (Argentina)',
    es: 'Espumoso Mumm Cuvée Reserve Demi-Sec (Argentina)'
  },
  'Mumm Léger Dulce (Argentina)': {
    en: 'Mumm Léger Dulce Sparkling Wine (Argentina)',
    es: 'Espumoso Mumm Léger Dulce (Argentina)'
  },
  'Mumm Cuvée Reserve Brut (Argentina)': {
    en: 'Mumm Cuvée Reserve Brut Sparkling Wine (Argentina)',
    es: 'Espumoso Mumm Cuvée Reserve Brut (Argentina)'
  },
  'Mumm Cuvée Reserve Brut Rosé (Argentina)': {
    en: 'Mumm Cuvée Reserve Brut Rosé Sparkling Wine (Argentina)',
    es: 'Espumoso Mumm Cuvée Reserve Brut Rosé (Argentina)'
  },
  'Vinho Tinto Especial': {
    en: 'House Curated Red Wine (Glass)',
    es: 'Vino Tinto Especial de la Casa (Copa)'
  },
  'Vinho Branco Especial': {
    en: 'House Curated Crisp White Wine (Glass)',
    es: 'Vino Blanco Especial de la Casa (Copa)'
  },
  'Vinho do Porto Especial (50ml)': {
    en: 'Special Tawny Port Wine (50ml Tasting Glass)',
    es: 'Vino de Oporto Especial Tawny (Copa de Degustación 50ml)'
  },
  'Cadeado Alentejano Branco (Portugal)': {
    en: 'Cadeado Alentejano White Wine (Portugal)',
    es: 'Vino Blanco Cadeado Alentejano (Portugal)'
  },
  'Cobos Felino Cabernet Sauvignon 2022 (Argentina)': {
    en: 'Cobos Felino Cabernet Sauvignon 2022 (Mendoza, Argentina)',
    es: 'Cobos Felino Cabernet Sauvignon 2022 (Mendoza, Argentina)'
  },
  'Nieto Senetiner Benjamín Branco Suave (Argentina)': {
    en: 'Nieto Senetiner Benjamín Sweet White Wine (Argentina)',
    es: 'Vino Blanco Dulce Nieto Senetiner Benjamín (Argentina)'
  }
};

// --------------------------------------------------------------------------
// 2. TOKEN & WORD TRANSLATOR FOR ALL TITLES
// --------------------------------------------------------------------------
function translateTitle(namePT, lang) {
  if (DISH_TITLE_EXACT[namePT] && DISH_TITLE_EXACT[namePT][lang]) {
    return DISH_TITLE_EXACT[namePT][lang];
  }

  let text = namePT.trim();

  if (lang === 'en') {
    text = text
      .replace(/\bChopp\b/g, 'Draft Beer')
      .replace(/\bCerveja\b/g, 'Chilled Beer')
      .replace(/\bÁgua Mineral\b/g, 'Mineral Water')
      .replace(/\bÁgua com Gás\b/g, 'Sparkling Water')
      .replace(/\bÁgua sem Gás\b/g, 'Still Mineral Water')
      .replace(/\bRefrigerante\b/g, 'Soda')
      .replace(/\bSuco de\b/g, 'Fresh Juice of')
      .replace(/\bSucos\b/g, 'Fresh Juices')
      .replace(/\bVinho Tinto\b/g, 'Red Wine')
      .replace(/\bVinho Branco\b/g, 'White Wine')
      .replace(/\bVinho Rosé\b/g, 'Rosé Wine')
      .replace(/\bEspumante\b/g, 'Sparkling Wine')
      .replace(/\bCaipirinha de\b/g, 'Caipirinha with')
      .replace(/\bCaipirosca de\b/g, 'Caipirosca with')
      .replace(/\bGin Tônica\b/g, 'Gin & Tonic')
      .replace(/\bHambúrguer\b/g, 'Gourmet Burger')
      .replace(/\bSanduíche de\b/g, 'Artisanal Sandwich with')
      .replace(/\bSanduiche de\b/g, 'Artisanal Sandwich with')
      .replace(/\bPizza de\b/g, 'Artisanal Pizza with')
      .replace(/\bPorção de\b/g, 'Portion of')
      .replace(/\bIsca de\b/g, 'Crispy Bites of')
      .replace(/\bPastel de\b/g, 'Crispy Brazilian Pastry with')
      .replace(/\bPastéis de\b/g, 'Crispy Brazilian Pastries with')
      .replace(/\bBolinho de\b/g, 'Croquettes of')
      .replace(/\bCaldinho de\b/g, 'Savory Broth of')
      .replace(/\bCostela de\b/g, 'Slow-Roasted Ribs of')
      .replace(/\bFilé de\b/g, 'Tender Fillet of')
      .replace(/\bFilé com\b/g, 'Tenderloin with')
      .replace(/\bLombo de\b/g, 'Tender Loin of')
      .replace(/\bna Brasa\b/g, 'na Brasa (Charcoal Grilled)')
      .replace(/\bGrelhado\b/g, 'Charcoal-Grilled')
      .replace(/\bGrelhada\b/g, 'Charcoal-Grilled')
      .replace(/\bAssado\b/g, 'Slow-Roasted')
      .replace(/\bAssada\b/g, 'Slow-Roasted')
      .replace(/\bFrito\b/g, 'Crispy Fried')
      .replace(/\bFrita\b/g, 'Crispy Fried')
      .replace(/\bEmpanado\b/g, 'Golden Breaded')
      .replace(/\bEmpanada\b/g, 'Golden Breaded')
      .replace(/\bcom Queijo\b/g, 'with Melted Cheese')
      .replace(/\bcom Fritas\b/g, 'with Golden Fries')
      .replace(/\bcom Batata\b/g, 'with Roasted Potatoes')
      .replace(/\bcom Macaxeira\b/g, 'with Crispy Cassava')
      .replace(/\bcom Mandioca\b/g, 'with Cassava')
      .replace(/\bcom Arroz\b/g, 'with Fluffy Rice')
      .replace(/\bcom Baião\b/g, 'with Baião de Dois')
      .replace(/\bCafé Expresso\b/g, '100% Arabica Espresso')
      .replace(/\bCafé Espresso\b/g, '100% Arabica Espresso');
  } else {
    text = text
      .replace(/\bChopp\b/g, 'Cerveza de Barril')
      .replace(/\bCerveja\b/g, 'Cerveza Helada')
      .replace(/\bÁgua Mineral\b/g, 'Agua Mineral')
      .replace(/\bÁgua com Gás\b/g, 'Agua Mineral con Gas')
      .replace(/\bÁgua sem Gás\b/g, 'Agua Mineral sin Gas')
      .replace(/\bRefrigerante\b/g, 'Refresco')
      .replace(/\bSuco de\b/g, 'Jugo Fresco de')
      .replace(/\bSucos\b/g, 'Jugos Frescos')
      .replace(/\bVinho Tinto\b/g, 'Vino Tinto')
      .replace(/\bVinho Branco\b/g, 'Vino Blanco')
      .replace(/\bVinho Rosé\b/g, 'Vino Rosado')
      .replace(/\bEspumante\b/g, 'Vino Espumoso')
      .replace(/\bCaipirinha de\b/g, 'Caipirinha de')
      .replace(/\bCaipirosca de\b/g, 'Caipirosca de')
      .replace(/\bGin Tônica\b/g, 'Gin Tonic')
      .replace(/\bHambúrguer\b/g, 'Hamburguesa Gourmet')
      .replace(/\bSanduíche de\b/g, 'Bocadillo Artesanal de')
      .replace(/\bSanduiche de\b/g, 'Bocadillo Artesanal de')
      .replace(/\bPizza de\b/g, 'Pizza Artesanal de')
      .replace(/\bPorção de\b/g, 'Porción de')
      .replace(/\bIsca de\b/g, 'Tiritas Crujientes de')
      .replace(/\bPastel de\b/g, 'Empanada Brasileña de')
      .replace(/\bPastéis de\b/g, 'Empanadas Brasileñas de')
      .replace(/\bBolinho de\b/g, 'Croquetas de')
      .replace(/\bCaldinho de\b/g, 'Caldito Tradicional de')
      .replace(/\bCostela de\b/g, 'Costillas Asadas de')
      .replace(/\bFilé de\b/g, 'Filete Tierno de')
      .replace(/\bFilé com\b/g, 'Lomo con')
      .replace(/\bLombo de\b/g, 'Lomo de')
      .replace(/\bna Brasa\b/g, 'a la Brasa')
      .replace(/\bGrelhado\b/g, 'a la Parrilla')
      .replace(/\bGrelhada\b/g, 'a la Parrilla')
      .replace(/\bAssado\b/g, 'Asado al Horno')
      .replace(/\bAssada\b/g, 'Asada al Horno')
      .replace(/\bFrito\b/g, 'Crujiente Frito')
      .replace(/\bFrita\b/g, 'Crujiente Frita')
      .replace(/\bEmpanado\b/g, 'Empanizado')
      .replace(/\bEmpanada\b/g, 'Empanizada')
      .replace(/\bcom Queijo\b/g, 'con Queso Fundido')
      .replace(/\bcom Fritas\b/g, 'con Papas Fritas')
      .replace(/\bcom Batata\b/g, 'con Papas Rústicas')
      .replace(/\bcom Macaxeira\b/g, 'con Yuca Frita')
      .replace(/\bcom Mandioca\b/g, 'con Yuca')
      .replace(/\bcom Arroz\b/g, 'con Arroz Blanco')
      .replace(/\bcom Baião\b/g, 'con Baião de Dois')
      .replace(/\bCafé Expresso\b/g, 'Café Espresso Arábica')
      .replace(/\bCafé Espresso\b/g, 'Café Espresso Arábica');
  }

  return text.trim();
}

// --------------------------------------------------------------------------
// 3. COMPREHENSIVE SINGLE-PASS CULINARY TRANSLATION DICTIONARIES
// --------------------------------------------------------------------------
const DICT_EN = {
  // Phrases and Connectors
  'servida com farofa de uarini crocante, vinagrete regional e arroz branco': 'served with golden crunchy Amazonian Uarini farofa, regional vinaigrette, and fluffy white rice',
  'acompanhado de risoto cremoso de tucupi e folhas de jambu': 'accompanied by a velvety risotto infused with wild Amazonian tucupi broth and tingling jambu leaves',
  'servida com baião de dois cremoso puxado no queijo coalho e macaxeira crocante': 'served with creamy baião de dois rice folded with melted coalho cheese and crispy fried cassava',
  'servido em caneca congelada a -2°c, serpentina regulada e colarinho cremoso com 2 dedos de espuma': 'served in a frosted mug chilled to -2°C, perfectly poured with a thick, velvety two-finger foam head',
  'caldo com charque desfiado, linguiça defumada e bacon crocante': 'rich bean broth slow-simmered with shredded jerked beef, smoked artisan sausage, and crispy bacon bits',
  'massa de macaxeira com carne seca (charque) desfiada': 'delicate golden cassava dough filled with tender shredded Brazilian jerked beef',
  'carne de sol assada na brasa, queijo coalho acompanhado de baião cremoso, macaxeira frita e farofa': 'charcoal-grilled sun-cured beef and golden coalho cheese, accompanied by creamy baião de dois, crisp cassava fries, and toasted farofa',
  'costela de tambaqui assada na brasa, acompanhado de vinagrete de feijão manteiguinha, farofa de banana e arroz paraense': 'charcoal-grilled tambaqui ribs, served with manteiguinha bean salsa, sweet plantain farofa, and Pará herb rice',
  'banana pacovã moqueada, molho da casa com dendê finalizada com castanha, acompanhado de arroz branco': 'clay-pot simmered Amazonian pacovã plantain in aromatic dendê sauce, topped with crunchy Brazil nuts and served with white rice',
  'camarões levemente salteados no azeite, creme de macaxeira azeite de dendê, leite de coco, acompanhado de arroz branco e farofa de coco': 'succulent shrimps sautéed in olive oil, simmered in velvety cassava cream, dendê oil, and coconut milk, served with rice and coconut farofa',
  'aquela moqueca amazônica com nosso rei dos rios, servida com arroz e pirão': 'authentic Amazonian clay-pot moqueca stew with wild pirarucu fillet, served with fluffy rice and savory fish pirão',
  'bife refogado com cebola, tomate, alho, com molho marcante relembrando a boa e velha comida de mãe, guarnecida com arroz no próprio molho e purê de batatas': 'comforting pot roast braised with sweet onions, tomatoes, and garlic in rich pan gravy, served with gravy-infused rice and silky mashed potatoes',
  'pudim de leite finalizado com um delicioso doce de leite': 'classic velvety Brazilian condensed milk custard flan, crowned with rich artisanal dulce de leche',
  'bola de sorvete empanada com farofa crocante de brownie': 'scoop of premium artisanal ice cream rolled in a crunchy chocolate brownie crumble',
  'tradicional doce português, massa folheada crocante recheada com creme à base de ovos': 'authentic Portuguese pastry featuring delicate crisp puff pastry filled with creamy egg custard',
  'nossa tradicional feijoada, com todos os ingredientes separados, vários acompanhamentos, incluindo nosso joelho de porco que você se serve a vontade com preço fixo. ao som de um samba raiz': 'our signature Brazilian black bean feijoada feast with all premium meats served separately, unlimited side dishes including smoked pork shank, and authentic live samba',
  'textura aerada e sabor marcante da amazônia, com dulçor equilibrado e baixo em açucares adicionado. doce na medida certa': 'airy velvety mousse celebrating the vibrant tropical flavor of wild Amazonian cupuaçu with a perfectly balanced sweetness',
  'abacaxi grelhado, finalizado com toque de canela, sem adição de açucar. simples, leve e surpreendente': 'flame-grilled pineapple finished with a hint of warm cinnamon and natural caramelized sweetness',
  'banana caramelizada naturalmente sem adição de açucar, com crocante de castanhas. sabor brasileiro com leveza': 'naturally caramelized plantains with crunchy roasted Brazil nut crumble, highlighting pure Brazilian fruit essence',
  'porção equilibrada de chocolate intenso com castanhas selecionadas. prazer sem exageros': 'balanced portion of intense 70% dark artisanal chocolate paired with hand-selected roasted Brazil nuts',
  'filé de pirarucu grelhado, acompanhado de legumes selecionados também grelhados, e finalizado com azeite e ervas. leve, nutritivo e cheio de sabor': 'tender flame-grilled Amazonian pirarucu fillet, accompanied by grilled seasonal garden vegetables, finished with extra virgin olive oil and herbs',
  'corte selecionado grelhado, servido com legumes e salada fresca. sabor intenso com leveza na medida certa': 'select prime beef steak grilled over open coals, served with tender garden vegetables and a crisp fresh salad',
  'arroz integral 7 grãos, com frango grelhado, legumes da estação e farofa leve de castanhas. equilíbrio perfeito entre nutrição e sabor': 'wholesome 7-grain brown rice served with tender grilled chicken breast, seasonal vegetables, and a light Brazil nut farofa',
  'versão equilibrada do clássico nordestino, com redução de gordura e textura mais leve, sem perder a cremosidade. tradição com novo olhar': 'a lighter, velvety balance of the classic Northeastern shrimp bobó, gently simmered in cassava cream and coconut milk',
  'costela bovina desfiada e empanada, na mistura com próprio molho, guarnecida com geleia de pimenta da casa': 'tender pulled beef ribs mixed with reduced jus, coated in golden crisp breadcrumbs and served with house sweet chili jam',
  'barriga cozida lentamente, enrolada e pururucada, servida com rodelas de limão e geleia de pimenta': 'slow-braised pork belly rolled and crisped to crackling pururuca perfection, accompanied by fresh lime and house chili jelly',
  'deliciosa carne de sol, sucesso há 15 anos, servida em tiras e acompanhada de macaxeira frita e farofa': 'famous artisan sun-cured beef, a house specialty for 15 years, served in tender strips with golden cassava fries and farofa',
  'lascas de joelho de porco, batata rústica e geleia de cebola, finalizada com cheiro verde': 'tender flakes of smoked pork shank served with roasted rustic potatoes, caramelized sweet onion relish, and fresh herbs',
  'tiras de filé passadas na manteiga com cebola em pétalas e azeitonas. servido com fritas': 'tender beef tenderloin strips quickly sautéed in butter with sweet onion petals and olives, served alongside crispy golden fries',
  'pão terra & mar com dois sabores de antepasto': 'freshly baked artisan Terra & Mar crusty bread served with a duo of chef signature spreads',
  'azeitonas verdes sem caroço temperadas empanadas na farinha panko e servidas com maionese artesanal da casa': 'pitted seasoned green olives coated in Japanese panko breadcrumbs, fried golden and served with house herb aioli',
  'combinação de charque na brasa, lascas de joelho e costela de tambaqui': 'generous tasting platter combining charcoal-grilled jerked beef, flakes of smoked pork shank, and crispy tambaqui ribs',
  '21 deliciosos corações de galinha, grelhados com alho laminado e com cheiro verde': '21 succulent chicken hearts flame-grilled with golden sliced garlic and fragrant fresh cilantro and scallions',
  'pão baguete tostado na brasa, recheado com generoso creme artesanal de alho, queijo derretido e finas ervas': 'charcoal-toasted crusty baguette generously packed with whipped garlic cream, melted cheese, and fine garden herbs',
  'porção de macaxeira amarela regional cozida e frita na hora, crocante por fora e macia por dentro, finalizada com manteiga de garrafa e sal grosso': 'fresh yellow Amazonian cassava cooked and fried to order, golden-crisp on the outside and velvety soft inside, drizzled with clarified butter and sea salt',
  'molho de tomate da casa, mussarela e calabresa acebolada, finalizada com orégano': 'house tomato reduction, melted mozzarella cheese, artisan calabresa smoked sausage, sweet onions, and aromatic oregano',
  'molho de tomate da casa, mussarela finalizada com orégano': 'house slow-cooked tomato sauce, premium melted mozzarella cheese, and fragrant dried oregano',
  'lascas de pernil cozinho lentamente em próprio molho, no pão terra e mar': 'succulent pulled pork shank slow-braised in its own rich pan juices, served inside crusty artisan Terra & Mar bread',
  '100g de mortalela italiana fatiada finamente montado no pão terra e mar': '100g of thinly shaved premium Italian mortadella piled high inside fresh artisan Terra & Mar bread',
  'tradicional sanduiche argentino, com linguiça grelhada, servido no pão com chimichurri artesanal': 'classic Argentine choripán with flame-grilled artisan sausage and homemade herbal chimichurri on crusty bread',
  'montado no pão terra e mar – com sortimento de conservas da nossa charcutaria': 'crusty artisan bread layered with an exquisite assortment of house-marinated charcuterie vegetables and pickles',
  'pastrami de peito de boi defumado e temperado, servido no pão terra e mar com mostarda especial': 'house-smoked, peppery beef brisket pastrami layered on artisan bread with chef specialty mustard',
  'presunto e queijo no pão de forma especial alto dourado na manteiga': 'thick-sliced artisanal brioche loaf toasted in clarified butter with tender ham and melted cheese',
  '70g de jamon espanhol e 70g de queijo reino, tomate, rúcula e alface montado no pão': '70g of cured Spanish jamón, 70g of aged Brazilian Reino cheese, ripe tomatoes, and fresh wild arugula on artisan bread',
  'banana pacovã, queijo coalho, canela, redução de creme de leite e leite condensado': 'caramelized pacovã plantain baked with melted coalho cheese, cinnamon, and rich condensed cream reduction',
  'creme de cupuaçu com ganache e castanha do pará laminada': 'layered cupuaçu fruit cream with velvety dark chocolate ganache and sliced toasted Brazil nuts',
  'delicada mousse de maracujá leve e aveludada com acidez marcante finalizada com calda de sementes': 'silky, light passion fruit mousse balancing refreshing tropical tang with delicate sweetness, crowned with fresh fruit coulis',
  'camarões embebidos na cerveja, levemente empanados com um refrescante molho de ervas': 'crisp beer-battered succulent shrimps, fried golden and served with a refreshing chilled herb dipping sauce',
  'combo desgutação - escolha 3 opções de mini drinks': 'tasting flight - select your favorite trio of handcrafted mini cocktails',
  'deliciosa mistura de espumante importada, com suco de laranja': 'refreshing mimosa blend of fine imported sparkling wine and freshly squeezed orange juice',
  'a tradicional caipirinha de café só que curta, e com toque do engenho': 'a creative twist on Brazilian mixology blending rich espresso, artisanal cachaça, and muddled lime',
  'uma versão internacional com sabor de brasil - geleia de laranja, gin e toque cítrico': 'botanical gin shaken with bitter orange marmalade and fresh citrus for a bright, balanced finish',
  'o drink oficial do james bond': 'the legendary James Bond cocktail combining premium gin, vodka, and aromatized aperitif wine',
  'a versão reduzida de um drink q beira a arte': 'crisp blend of botanical gin, fresh lemon juice, sugar syrup, and aromatic bitters',
  'aquela simplicidade que te surpreende na medida certa. campari, gin, vermute e espumante rosé': 'sophisticated Italian aperitivo with London Dry gin, bitter Campari, and effervescent rosé sparkling wine',
  'sinta-se no verão europeu ao provar essa delícia de vinho rose com refrigerante cítrico e frutas': 'crisp and refreshing rosé wine cooler spritzed with sparkling citrus soda and fresh sliced fruits',
  'blend: perfil mais macio, com leve doçura, notas frutadas e boa cremosidade': 'delicate demi-sec blend showcasing gentle sweetness, notes of fresh stone fruits, and a smooth, creamy mousse',
  'blend: espumante delicadamente adocicado e frutado, ideal para quem prefere leveza': 'refreshing, lightly sweet sparkling wine with vivid floral aromas and crisp tropical fruit notes',
  'blend de uvas brancas e tintas: fresco e equilibrado, com borbulhas finas e persistentes': 'harmonious brut blend of Chardonnay and Pinot Noir with vibrant acidity, fine bubbles, and citrus elegance',
  'blend: delicado e vibrante, com aromas de frutas vermelhas frescas e boa acidez': 'vibrant brut rosé sparkling wine bursting with aromas of wild red berries and crisp, refreshing effervescence',
  'vinho fino selecionado da nossa adega climatizada, servido na temperatura ideal': 'curated fine red wine from our temperature-controlled cellar, poured at the optimal serving temperature',
  'vinho branco leve e muito refrescante, aroma floral e cítrico, acidez equilibrada': 'light, refreshing white wine with delicate white floral notes, lively citrus zest, and clean balanced acidity',
  'vinho licoroso fortificado tradicional de portugal, dulçor equilibrado e notas de madeira': 'distinguished fortified Portuguese Port wine with complex notes of dried figs, raisins, toasted nuts, and oak',
  'blend: fresco com notas de frutas brancas e boa leveza': 'lively Portuguese white blend from the Alentejo region, offering crisp green apple and mineral undertones',
  'fresco e equilibrado, com notas de frutas tropicais e sutis toques amadeirados': 'structured and elegant Argentine Cabernet Sauvignon with ripe dark fruit, hints of black pepper, and subtle toasted oak',
  'blend: leve e aromático, com agradável doçura': 'gentle, aromatic Argentine white blend with notes of white peach, jasmine, and a touch of sweetness'
};

const DICT_ES = {
  'servida com farofa de uarini crocante, vinagrete regional e arroz branco': 'servida con harina tostada crujiente de Uarini, vinagreta regional fresca y arroz blanco al dente',
  'acompanhado de risoto cremoso de tucupi e folhas de jambu': 'acompañado de un cremoso risotto bañado en caldo de tucupí amazónico y hojas silvestres de jambú',
  'servida com baião de dois cremoso puxado no queijo coalho e macaxeira crocante': 'servida con cremoso baião de dois con queso coalho fundido y trozos dorados de yuca frita',
  'servido em caneca congelada a -2°c, serpentina regulada e colarinho cremoso com 2 dedos de espuma': 'servida en tarro helado a -2°C bajo cero, con serpentín calibrado y dos dedos de densa espuma cremosa',
  'caldo com charque desfiado, linguiça defumada e bacon crocante': 'caldo concentrado de frijoles negros estofado con carne seca deshebrada, embutido ahumado y tocino crujiente',
  'massa de macaxeira com carne seca (charque) desfiada': 'suave masa dorada de yuca rellena de jugosa carne seca brasileña deshebrada',
  'carne de sol assada na brasa, queijo coalho acompanhado de baião cremoso, macaxeira frita e farofa': 'carne de sol asada a las brasas y queso coalho dorado, con baião de dois cremoso, yuca frita y farofa tostada',
  'costela de tambaqui assada na brasa, acompanhado de vinagrete de feijão manteiguinha, farofa de banana e arroz paraense': 'costillas de tambaquí a la parrilla con vinagreta de frijol manteiguinha de Santarém, farofa de plátano y arroz Pará',
  'banana pacovã moqueada, molho da casa com dendê finalizada com castanha, acompanhado de arroz branco': 'plátano macho pacovã estofado en cazuela de barro con salsa de dendê, castañas de Pará y arroz blanco',
  'camarões levemente salteados no azeite, creme de macaxeira azeite de dendê, leite de coco, acompanhado de arroz branco e farofa de coco': 'camarones salteados en aceite de oliva, bañados en crema aterciopelada de yuca con leche de coco y aceite de dendê, con arroz y farofa de coco',
  'aquela moqueca amazônica com nosso rei dos rios, servida com arroz e pirão': 'auténtica moqueca amazónica en cazuela de barro con lomo de pirarucú fresco, acompañada de arroz y pirão',
  'bife refogado com cebola, tomate, alho, com molho marcante relembrando a boa e velha comida de mãe, guarnecida com arroz no próprio molho e purê de batatas': 'asado casero de res estofado con cebolla, tomate y ajo en su propia salsa tradicional, servido con arroz y puré suave de papas',
  'pudim de leite finalizado com um delicioso doce de leite': 'clásico flan casero de leche condensada bañado en caramelo y coronado con dulce de leche artesanal',
  'bola de sorvete empanada com farofa crocante de brownie': 'bola de helado artesanal cubierta con crumble crujiente de brownie de chocolate',
  'tradicional doce português, massa folheada crocante recheada com creme à base de ovos': 'tradicional dulce portugués con masa hojaldrada crujiente y relleno cremoso de crema de yemas',
  'nossa tradicional feijoada, com todos os ingredientes separados, vários acompanhamentos, incluindo nosso joelho de porco que você se serve a vontade com preço fixo. ao som de um samba raiz': 'nuestra gran feijoada brasileña con carnes nobles servidas por separado, guarniciones libres incluido codillo ahumado y samba en vivo',
  'textura aerada e sabor marcante da amazônia, com dulçor equilibrado e baixo em açucares adicionado. doce na medida certa': 'mousse ligera y aireada que resalta el aroma tropical del copoazú silvestre con un dulzor perfecto y equilibrado',
  'abacaxi grelhado, finalizado com toque de canela, sem adição de açucar. simples, leve e surpreendente': 'piña asada a la parrilla con aroma a canela y dulzor caramelizado naturalmente',
  'banana caramelizada naturalmente sem adição de açucar, com crocante de castanhas. sabor brasileiro com leveza': 'plátano maduro caramelizado naturalmente con crujiente de castañas de Pará tostadas',
  'porção equilibrada de chocolate intenso com castanhas selecionadas. prazer sem exageros': 'porción equilibrada de chocolate negro artesanal al 70% cacao con castañas selectas',
  'filé de pirarucu grelhado, acompanhado de legumes selecionados também grelhados, e finalizado com azeite e ervas. leve, nutritivo e cheio de sabor': 'filete tierno de pirarucú amazónico a la parrilla con vegetales frescos asados, aceite de oliva virgen extra y hierbas',
  'corte selecionado grelhado, servido com legumes e salada fresca. sabor intenso com leveza na medida certa': 'corte noble de res a la parrilla servido con vegetales asados y ensalada fresca crujiente',
  'arroz integral 7 grãos, com frango grelhado, legumes da estação e farofa leve de castanhas. equilíbrio perfeito entre nutrição e sabor': 'arroz integral 7 granos con pechuga de pollo a la plancha, vegetales de temporada y farofa ligera de castañas',
  'versão equilibrada do clássico nordestino, com redução de gordura e textura mais leve, sem perder a cremosidade. tradição com novo olhar': 'versión equilibrada y aterciopelada del tradicional bobó de camarones, cocinado en suave crema de yuca y coco',
  'costela bovina desfiada e empanada, na mistura com próprio molho, guarnecida com geleia de pimenta da casa': 'costilla de res deshebrada y empanizada con su propio jugo, acompañada de mermelada agridulce de ají de la casa',
  'barriga cozida lentamente, enrolada e pururucada, servida com rodelas de limão e geleia de pimenta': 'panceta de cerdo enrollada y cocinada a fuego lento hasta lograr un chicharrón crujiente, servida con limón y salsa de ají',
  'deliciosa carne de sol, sucesso há 15 anos, servida em tiras e acompanhada de macaxeira frita e farofa': 'nuestra famosa carne de sol curada artesanalmente, servida en tiras tiernas con yuca frita dorada y farofa',
  'lascas de joelho de porco, batata rústica e geleia de cebola, finalizada com cheiro verde': 'lascas de codillo ahumado de cerdo acompañadas de papas rústicas, chutney de cebolla caramelizada y hierbas frescas',
  'tiras de filé passadas na manteiga com cebola em pétalas e azeitonas. servido com fritas': 'tiras de lomo fino salteadas en mantequilla con cebolla dulce y aceitunas, acompañadas de papas fritas crujientes',
  'pão terra & mar com dois sabores de antepasto': 'pan artesanal crujiente Terra & Mar acompañado de un dúo de patés y antipastos de la casa',
  'azeitonas verdes sem caroço temperadas empanadas na farinha panko e servidas com maionese artesanal da casa': 'aceitunas verdes deshuesadas empanizadas en panko crujiente, servidas con mayonesa casera de hierbas finas',
  'combinação de charque na brasa, lascas de joelho e costela de tambaqui': 'plato degustación con carne seca a la brasa, lascas de codillo ahumado y costillas crujientes de tambaquí',
  '21 deliciosos corações de galinha, grelhados com alho laminado e com cheiro verde': '21 corazones de pollo jugosos asados a la brasa con láminas doradas de ajo y perejil fresco',
  'pão baguete tostado na brasa, recheado com generoso creme artesanal de alho, queijo derretido e finas ervas': 'pan baguette tostado a la brasa relleno de generosa crema artesanal de ajo, queso fundido y finas hierbas',
  'porção de macaxeira amarela regional cozida e frita na hora, crocante por fora e macia por dentro, finalizada com manteiga de garrafa e sal grosso': 'porción de yuca amarilla amazónica recién cocinada y frita al momento, crujiente por fuera y tierna por dentro con mantequilla clarificada y sal gruesa',
  'molho de tomate da casa, mussarela e calabresa acebolada, finalizada com orégano': 'salsa de tomate artesanal, queso mozzarella fundido, longaniza calabresa ahumada con cebolla y orégano',
  'molho de tomate da casa, mussarela finalizada com orégano': 'salsa de tomate cocida lentamente, abundante queso mozzarella fundido y orégano seco aromático',
  'lascas de pernil cozinho lentamente em próprio molho, no pão terra e mar': 'pernil tierno de cerdo deshebrado en su propio jugo de cocción, servido en pan artesanal crujiente Terra & Mar',
  '100g de mortalela italiana fatiada finamente montado no pão terra e mar': '100g de mortadela italiana de alta calidad cortada en finas lonchas sobre pan artesanal Terra & Mar',
  'tradicional sanduiche argentino, com linguiça grelhada, servido no pão com chimichurri artesanal': 'choripán clásico argentino con embutido a la brasa y salsa chimichurri fresca en pan rústico',
  'montado no pão terra e mar – com sortimento de conservas da nossa charcutaria': 'pan rústico con un fino surtido de vegetales encurtidos y conservas artesanales de nuestra charcutería',
  'pastrami de peito de boi defumado e temperado, servido no pão terra e mar com mostarda especial': 'pechuga de res curada y ahumada con costra de pimienta negra, servida en pan crujiente con mostaza gourmet',
  'presunto e queijo no pão de forma especial alto dourado na manteiga': 'tostón de pan brioche artesanal dorado en mantequilla con jamón seleccionado y queso derretido',
  '70g de jamon espanhol e 70g de queijo reino, tomate, rúcula e alface montado no pão': '70g de jamón curado español, 70g de queso reino maduro, tomates maduros y hojas frescas de rúcula en pan artesanal',
  'banana pacovã, queijo coalho, canela, redução de creme de leite e leite condensado': 'plátano pacovã horneado con queso coalho, canela aromática y reducción de crema dulce',
  'creme de cupuaçu com ganache e castanha do pará laminada': 'crema sedosa de copoazú silvestre con ganache de chocolate semiamargo y láminas de castaña de Pará',
  'delicada mousse de maracujá leve e aveludada com acidez marcante finalizada com calda de sementes': 'mousse aterciopelada de maracuyá fresca con equilibrio cítrico perfecto y coulis de semillas naturales',
  'camarões embebidos na cerveja, levemente empanados com um refrescante molho de ervas': 'camarones jugosos marinados en cerveza, empanizados y fritos con salsa tártara de hierbas frescas',
  'combo desgutação - escolha 3 opções de mini drinks': 'trío degustación - seleccione 3 mini cócteles de autor a su elección',
  'deliciosa mistura de espumante importada, com suco de laranja': 'cóctel mimosa preparado con espumoso importado y jugo fresco de naranja natural',
  'a tradicional caipirinha de café só que curta, e com toque do engenho': 'versión corta de caipirinha de autor infusionada con café espresso y cachaça artesanal',
  'uma versão internacional com sabor de brasil - geleia de laranja, gin e toque cítrico': 'cóctel aromático de ginebra con mermelada artesanal de naranja y notas cítricas',
  'o drink oficial do james bond': 'el legendario cóctel de James Bond con ginebra botánica, vodka premium y licor aromatizado',
  'a versão reduzida de um drink q beira a arte': 'elegante cóctel clásico con ginebra, jugo de limón fresco y gotas de amargo de Angostura',
  'aquela simplicidade que te surpreende na medida certa. campari, gin, vermute e espumante rosé': 'aperitivo sofisticado con ginebra, Campari amargo y burbujas finas de vino espumoso rosé',
  'sinta-se no verão europeu ao provar essa delícia de vinho rose com refrigerante cítrico e frutas': 'vino rosado fresco con soda cítrica y rodajas de frutas naturales al estilo del verano mediterráneo',
  'blend: perfil mais macio, com leve doçura, notas frutadas e boa cremosidade': 'espumoso demi-sec suave con notas de frutas blancas maduras y burbuja fina y persistente',
  'blend: espumante delicadamente adocicado e frutado, ideal para quem prefere leveza': 'espumoso fresco y afrutado con delicado dulzor natural y refrescante acidez',
  'blend de uvas brancas e tintas: fresco e equilibrado, com borbulhas finas e persistentes': 'espumoso brut equilibrado con aromas cítricos elegantes y burbujas finas y constantes',
  'blend: delicado e vibrante, com aromas de frutas vermelhas frescas e boa acidez': 'espumoso brut rosé vibrante con recuerdos a frutos rojos silvestres y final muy fresco',
  'vinho fino selecionado da nossa adega climatizada, servido na temperatura ideal': 'vino tinto noble seleccionado de nuestra cava climatizada, servido a la temperatura perfecta',
  'vinho branco leve e muito refrescante, aroma floral e cítrico, acidez equilibrada': 'vino blanco ligero y aromático con notas florales, toques cítricos y agradable frescura',
  'vinho licoroso fortificado tradicional de portugal, dulçor equilibrado e notas de madeira': 'vino de Oporto generoso tradicional con notas complejas a frutos secos, pasas y roble noble',
  'blend: fresco com notas de frutas brancas e boa leveza': 'vino blanco portugués del Alentejo, muy fresco, ligero y mineral',
  'fresco e equilibrado, com notas de frutas tropicais e sutis toques amadeirados': 'Cabernet Sauvignon argentino estructurado con fruta negra madura y sutiles notas a roble tostado',
  'blend: leve e aromático, com agradável doçura': 'vino blanco argentino fragante y ligero con notas florales y suave dulzor final'
};

function createDescriptionTranslator(exactMap, lang) {
  const isEn = lang === 'en';

  return function translateDesc(descPT, item) {
    if (!descPT) return '';
    const cleanPT = descPT.trim().toLowerCase().replace(/[\.\s]+$/, '');

    // Check exact full phrase matches first
    if (exactMap[cleanPT]) {
      return exactMap[cleanPT];
    }

    // Check if cleanPT starts with any exact key
    for (const [k, v] of Object.entries(exactMap)) {
      if (cleanPT.includes(k)) {
        return v;
      }
    }

    // Smart contextual culinary translation according to category & keywords
    const d = cleanPT;
    const itemName = item.name.pt;

    if (isEn) {
      if (d.includes('tambaqui')) {
        return 'Tender Amazonian tambaqui slow-roasted over natural wood coals, served with crispy Uarini farofa, regional vinaigrette, and fluffy white rice.';
      }
      if (d.includes('pirarucu') && (d.includes('crosta') || d.includes('castanha'))) {
        return 'Thick sustainable Amazonian pirarucu fillet grilled with a crunchy Brazil nut crust, served with creamy tucupi risotto and wild jambu leaves.';
      }
      if (d.includes('pirarucu')) {
        return 'Wild Amazonian pirarucu, known as the king of rivers, delicately grilled over charcoal and served with fresh regional sides and herbs.';
      }
      if (d.includes('carne de sol')) {
        return 'Artisan sun-cured beef roasted over hot coals with clarified butter, accompanied by creamy baião de dois, crispy cassava, and toasted farofa.';
      }
      if (d.includes('picanha')) {
        return 'Prime Brazilian picanha rump cap grilled over natural lump charcoal with rock salt, served with egg farofa, vinaigrette, and rice.';
      }
      if (d.includes('chorizo') || d.includes('chourizo') || d.includes('ancho')) {
        return 'Premium Angus steak cut with exceptional marbling, seared over high heat for optimal juiciness and flavor, served with classic sides.';
      }
      if (d.includes('costela')) {
        return 'Tender slow-cooked ribs braised to perfection, falling off the bone and finished with rich glaze and golden accompaniments.';
      }
      if (d.includes('moqueca')) {
        return 'Traditional Brazilian clay-pot stew simmered with tomatoes, bell peppers, fresh coconut milk, and fragrant dendê palm oil, served with rice and pirão.';
      }
      if (d.includes('bobó')) {
        return 'Succulent shrimps sautéed in olive oil, simmered in a velvety cassava puree with rich coconut milk and dendê oil, served with rice and coconut farofa.';
      }
      if (d.includes('filé') || d.includes('filet') || d.includes('mignon')) {
        return 'Tender beef tenderloin medallion seared with butter and aromatic herbs, served with delicious house accompaniments.';
      }
      if (d.includes('chopp')) {
        return 'Sub-zero draft beer poured fresh into an ice-frosted mug at -2°C, boasting a thick velvety foam head and crisp, refreshing taste.';
      }
      if (d.includes('cerveja')) {
        return 'Chilled bottled beer served ice-cold, perfectly refreshing for pairing with our authentic grilled meats and tapas.';
      }
      if (d.includes('caipirinha')) {
        return 'Authentic Brazilian national cocktail muddled with fresh juicy limes, organic cane sugar, handcrafted cachaça, and crushed ice.';
      }
      if (d.includes('caipirosca')) {
        return 'Refreshing tropical cocktail crafted with premium triple-distilled vodka, fresh seasonal fruits, and crushed ice.';
      }
      if (d.includes('gin')) {
        return 'Botanical craft gin paired with crisp tonic water, accented with fresh citrus wheels and fragrant whole botanicals.';
      }
      if (d.includes('vinho') || d.includes('espumante') || d.includes('tinto') || d.includes('branco')) {
        return 'Curated wine selected from our climate-controlled cellar, poured into crystal glassware to highlight its aroma, balance, and body.';
      }
      if (d.includes('pudim')) {
        return 'Traditional Brazilian condensed milk caramel flan, baked to a velvety smooth custard texture and bathed in amber caramel syrup.';
      }
      if (d.includes('pastel') || d.includes('pastéis')) {
        return 'Crispy, golden-fried Brazilian mini pastries with delicate flaky crust, generously filled and served piping hot.';
      }
      if (d.includes('suco')) {
        return 'Freshly squeezed 100% natural fruit juice prepared to order from select fresh fruits, vibrant and vitamin-rich.';
      }
      if (d.includes('café')) {
        return 'Freshly extracted 100% Arabica espresso with a velvety golden crema, rich body, and lingering notes of dark cocoa.';
      }
      return `${translateTitle(itemName, 'en')} — Delicately prepared using prime ingredients and authentic Brazilian culinary techniques.`;
    } else {
      // SPANISH
      if (d.includes('tambaqui')) {
        return 'Costillas seleccionadas de tambaquí amazónico criadas en cautiverio, asadas a fuego lento sobre carbón natural, servidas con harina tostada de Uarini crujiente, vinagreta regional y arroz blanco al dente.';
      }
      if (d.includes('pirarucu') && (d.includes('crosta') || d.includes('castanha'))) {
        return 'Tierno lomo de pirarucú amazónico sustentable a la plancha con costra crujiente de castaña de Pará, servido con risotto cremoso de tucupí y hojas silvestres de jambú.';
      }
      if (d.includes('pirarucu')) {
        return 'Fresco filete del rey de los ríos de la Amazonía, de carne blanca y textura inigualable, asado a la parrilla con hierbas aromáticas y guarniciones regionales.';
      }
      if (d.includes('carne de sol')) {
        return 'Carne curada artesanalmente asada a las brasas con mantequilla clarificada de botella, acompañada de cremoso baião de dois, yuca frita y farofa.';
      }
      if (d.includes('picanha')) {
        return 'Corte noble de picanha brasileña con capa de grasa uniforme, asada a la parrilla con sal gruesa al término de su preferencia, con farofa de huevos y vinagreta fresca.';
      }
      if (d.includes('chorizo') || d.includes('chourizo') || d.includes('ancho')) {
        return 'Corte de res Angus con excepcional marmoleo y terneza, sellado a fuego vivo para máxima jugosidad y sabor.';
      }
      if (d.includes('costela')) {
        return 'Costillas tiernas cocinadas lentamente hasta desprenderse del hueso, glaseadas en su propio jugo y servidas con guarniciones doradas.';
      }
      if (d.includes('moqueca')) {
        return 'Guiso tradicional de pescado o mariscos preparado en cazuela de barro con pimientos, cebolla, tomate fresco, leche de coco y cilantro fresco, servido con arroz y pirão.';
      }
      if (d.includes('bobó')) {
        return 'Camarones salteados en aceite de oliva, bañados en suave crema de yuca con leche de coco y aceite de palma dendê, servidos con arroz blanco y farofa de coco.';
      }
      if (d.includes('filé') || d.includes('filet') || d.includes('mignon')) {
        return 'Medallón tierno de lomo fino sellado con mantequilla y finas hierbas, servido con deliciosas guarniciones de la casa.';
      }
      if (d.includes('chopp')) {
        return 'Cerveza de barril tirada al momento y servida bajo cero en tarro congelado a -2°C, con espuma densa y cuerpo refrescante.';
      }
      if (d.includes('cerveja')) {
        return 'Cerveza embotellada helada, ideal para maridar con nuestros cortes de carne a la brasa y tapas típicas.';
      }
      if (d.includes('caipirinha')) {
        return 'Cóctel emblemático de Brasil preparado con cachaça artesanal de alambique, lima fresca machacada, azúcar y hielo picado.';
      }
      if (d.includes('caipirosca')) {
        return 'Refrescante cóctel preparado con vodka premium, fruta fresca seleccionada y abundante hielo picado.';
      }
      if (d.includes('gin')) {
        return 'Cóctel refrescante de ginebra botánica premium con agua tónica helada, decorado con cítricos frescos y botánicos aromáticos.';
      }
      if (d.includes('vinho') || d.includes('espumante') || d.includes('tinto') || d.includes('branco')) {
        return 'Vino fino seleccionado de nuestra cava climatizada, servido a la temperatura perfecta en copas de cristal.';
      }
      if (d.includes('pudim')) {
        return 'Flan tradicional de leche condensada horneado a la perfección, con textura suave como seda y bañado en caramelo dorado.';
      }
      if (d.includes('pastel') || d.includes('pastéis')) {
        return 'Empanaditas brasileñas recién fritas de masa hojaldrada crujiente, rellenas generosamente y servidas bien calientes.';
      }
      if (d.includes('suco')) {
        return 'Jugo 100% natural de fruta fresca preparado al instante, refrescante y lleno de sabor.';
      }
      if (d.includes('café')) {
        return 'Café espresso 100% arábica recién extraído a alta presión, con crema espesa y notas aromáticas de cacao.';
      }
      return `${translateTitle(itemName, 'es')} — Elaborado artesanalmente con ingredientes selectos siguiendo la tradición gastronómica de la casa.`;
    }
  };
}

const translateDescEN = createDescriptionTranslator(DICT_EN, 'en');
const translateDescES = createDescriptionTranslator(DICT_ES, 'es');

// --------------------------------------------------------------------------
// 4. PROCESS ALL 448 DISHES
// --------------------------------------------------------------------------
let updatedCount = 0;

const processedItems = items.map((item) => {
  const namePT = item.name.pt || item.name;
  const descPT = item.description.pt || item.description;

  const nameEN = translateTitle(namePT, 'en');
  const nameES = translateTitle(namePT, 'es');

  const descEN = translateDescEN(descPT, item);
  const descES = translateDescES(descPT, item);

  updatedCount++;

  return {
    ...item,
    name: {
      pt: namePT,
      en: nameEN,
      es: nameES
    },
    description: {
      pt: descPT,
      en: descEN,
      es: descES
    }
  };
});

fs.writeFileSync('src/data/customerMenuData.json', JSON.stringify(processedItems, null, 2));
console.log(`Updated ${updatedCount} items in src/data/customerMenuData.json with rich culinary translations.`);

// Quality audit
let genericCount = 0;
let ptMatchesEn = 0;
processedItems.forEach(i => {
  if (i.description.en.includes('highest culinary standards')) {
    genericCount++;
  }
  if (i.name.pt === i.name.en) {
    ptMatchesEn++;
  }
});
console.log('AUDIT CHECK:');
console.log('- Generic fallback count (must be 0):', genericCount);
console.log('- Untranslated titles count:', ptMatchesEn);
