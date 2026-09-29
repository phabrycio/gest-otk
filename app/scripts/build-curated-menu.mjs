import fs from 'fs';

// Read all items
const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));

// Subcategory dictionary
export const SUBCATEGORY_TRANSLATIONS = {
  'ESPECIAL DO MAR': { pt: 'Especial do Mar', en: 'Seafood Specials', es: 'Especialidades del Mar' },
  'PRATOS PRINCIPAIS - TRADICIONAIS DO ENGENHO': { pt: 'Pratos Tradicionais', en: 'Traditional House Mains', es: 'Platos Tradicionales' },
  'CHOPPS': { pt: 'Chopps Artesanais', en: 'Draft Beers', es: 'Cervezas de Barril' },
  'ENTRADAS': { pt: 'Entradas', en: 'Starters & Appetizers', es: 'Entradas' },
  'PRATOS PRINCIPAIS': { pt: 'Pratos Principais', en: 'Main Courses', es: 'Platos Principales' },
  'SOBREMESAS': { pt: 'Sobremesas', en: 'Artisanal Desserts', es: 'Postres Artesanales' },
  'BUFFET LIVRE': { pt: 'Buffet Livre', en: 'Open Buffet', es: 'Buffet Libre' },
  'PETISCOS ESPECIAIS DO ENGENHO': { pt: 'Petiscos Especiais', en: 'House Special Tapas', es: 'Tapas Especiales de la Casa' },
  'PETISCOS TRADICIONAIS DO ENGENHO': { pt: 'Petiscos Tradicionais', en: 'Traditional Brazilian Tapas', es: 'Tapas Tradicionales' },
  'COPINHOS DO ENGENHO': { pt: 'Copinhos Degustação', en: 'Tasting Shots & Mini Cocktails', es: 'Chupitos de Degustación' },
  'MINI PASTÉIS': { pt: 'Mini Pastéis', en: 'Crispy Mini Pastries', es: 'Mini Empanadas Crujientes' },
  'LINGUICINHAS': { pt: 'Linguicinhas na Brasa', en: 'Charcoal-Grilled Sausages', es: 'Embutidos a la Brasa' },
  'PIZZAS': { pt: 'Pizzas Artesanais', en: 'Artisanal Pizzas', es: 'Pizzas Artesanales' },
  'HAMBÚRGUERES': { pt: 'Hambúrgueres Gourmet', en: 'Gourmet Brioche Burgers', es: 'Hamburguesas Gourmet' },
  'SALADAS': { pt: 'Saladas Frescas', en: 'Fresh Salads', es: 'Ensaladas Frescas' },
  'PRATOS KIDS': { pt: 'Menu Infantil', en: 'Kids Menu', es: 'Menú Infantil' },
  'ESCONDIDINHOS DO ENGENHO': { pt: 'Escondidinhos Gratinados', en: 'Gratinated Cassava Pies', es: 'Escondidinhos Gratinados' },
  'PRATOS PRINCIPAIS - ESPECIALIDADES': { pt: 'Especialidades do Chef', en: 'Chef Specialties', es: 'Especialidades del Chef' },
  'CARNES PREMIUM': { pt: 'Carnes Nobres & Parrilla', en: 'Prime Charcoal Steaks', es: 'Cortes Nobles a la Brasa' },
  'GUARNIÇÕES': { pt: 'Guarnições & Acompanhamentos', en: 'Side Dishes', es: 'Guarniciones y Acompañamientos' },
  'PORÇÕES': { pt: 'Porções Extras', en: 'Sharing Portions', es: 'Porciones para Compartir' },
  'CHARCUTARIA': { pt: 'Charcutaria & Sanduíches', en: 'Charcuterie & Deli Sandwiches', es: 'Charcutería y Bocadillos' },
  'CAFÉ E BEBIDAS QUENTES': { pt: 'Cafés & Bebidas Quentes', en: 'Espresso & Hot Drinks', es: 'Café y Bebidas Calientes' },
  'SUCOS': { pt: 'Sucos Naturais da Fruta', en: 'Fresh Natural Juices', es: 'Jugos Naturales de Fruta' },
  'BEBIDAS DIVERSAS': { pt: 'Bebidas & Refrigerantes', en: 'Soft Drinks & Sodas', es: 'Refrescos y Bebidas' },
  'PARA BEBER': { pt: 'Bebidas Geladas', en: 'Chilled Beverages', es: 'Bebidas Frías' },
  'CHOPPS HEINEKEN': { pt: 'Chopp Heineken', en: 'Heineken Draft Beers', es: 'Cerveza Heineken de Barril' },
  'CHOPPS AMSTEL': { pt: 'Chopp Amstel', en: 'Amstel Draft Beers', es: 'Cerveza Amstel de Barril' },
  'CERVEJAS': { pt: 'Cervejas Long Neck', en: 'Bottled Beers', es: 'Cervezas Embotelladas' },
  'DOSES DIVERSAS': { pt: 'Doses & Destilados', en: 'Spirits & Premium Shots', es: 'Destilados y Licores' },
  'DRINKS SEM ÁLCOOL': { pt: 'Drinks Sem Álcool (Mocktails)', en: 'Mocktails (Non-Alcoholic)', es: 'Cócteles sin Alcohol (Mocktails)' },
  'DRINKS MONSTER': { pt: 'Drinks com Energético', en: 'Energy Cocktails', es: 'Cócteles con Energizante' },
  'CAIPIROSCAS': { pt: 'Caipiroscas de Vodka', en: 'Vodka Caipiroscas', es: 'Caipiroscas de Vodka' },
  'CAIPIRINHA': { pt: 'Caipirinhas Tradicionais', en: 'Brazilian Cachaça Caipirinhas', es: 'Caipirinhas Brasileñas' },
  'DRINKS TRADICIONAIS': { pt: 'Coquetelaria Clássica', en: 'Classic Cocktails', es: 'Coctelería Clásica' },
  'GIN': { pt: 'Drinks com Gin', en: 'Gin & Tonic Cocktails', es: 'Cócteles con Ginebra' },
  'ESPUMANTES': { pt: 'Espumantes', en: 'Sparkling Wines & Champagne', es: 'Vinos Espumosos y Cava' },
  'TAÇAS': { pt: 'Vinhos em Taça', en: 'Wines by the Glass', es: 'Vinos por Copa' },
  'VINHOS BRANCO E VERDES': { pt: 'Vinhos Brancos & Verdes', en: 'White & Vinho Verde Wines', es: 'Vinos Blancos y Verdes' },
  'ROSÉS': { pt: 'Vinhos Rosés', en: 'Rosé Wines', es: 'Vinos Rosados' },
  'VINHOS DO PORTO': { pt: 'Vinhos do Porto', en: 'Port Dessert Wines', es: 'Vinos de Oporto' },
  'TINTOS ARGENTINOS': { pt: 'Tintos Argentinos', en: 'Argentine Red Wines', es: 'Vinos Tintos Argentinos' },
  'TINTOS PORTUGUESES': { pt: 'Tintos Portugueses', en: 'Portuguese Red Wines', es: 'Vinos Tintos Portugueses' },
  'TINTOS ITALIANOS': { pt: 'Tintos Italianos', en: 'Italian Red Wines', es: 'Vinos Tintos Italianos' }
};

// Word translation rules for dish titles
const TITLE_REPLACEMENTS_EN = [
  [/Couvert do Engenho/gi, 'Engenho Signature Bread & Spreads Couvert'],
  [/Azeitonas Empanadas/gi, 'Crispy Panko Breaded Olives'],
  [/Crocante de Costela/gi, 'Crispy Pulled Beef Rib Croquettes'],
  [/Trio do Engenho/gi, 'Engenho Taster Trio (Pastel, Rib & Tapioca)'],
  [/Rocambole Suíno/gi, 'Crispy Crackling Pork Belly Roulade'],
  [/Isca de Carne de Sol/gi, 'Tender Sun-Cured Beef Strips with Cassava'],
  [/Isca De Carne De Sol Do Engenho/gi, 'Engenho Sun-Cured Beef Bites with Fried Cassava'],
  [/Joelho Trinchado/gi, 'Sliced Smoked Pork Shank with Rustic Potatoes'],
  [/Filé com Fritas|Filé Com Fritas/gi, 'Tender Beef Tenderloin Strips with French Fries'],
  [/Coraçãozinho de Galinha/gi, 'Charcoal-Grilled Garlic Chicken Hearts'],
  [/Dadinho de Tapioca/gi, 'Golden Tapioca & Coalho Cheese Cubes'],
  [/Pão de Alho|Pao De Alho/gi, 'Artisanal Charcoal-Toasted Garlic Bread'],
  [/Macaxeira Frita/gi, 'Crispy Golden Amazonian Cassava (Yucca)'],
  [/Batata Frita/gi, 'Golden Crispy French Fries'],
  [/Bolinho de Bacalhau/gi, 'Traditional Golden Salt Cod Fritters'],
  [/Bolinho de Carne Seca/gi, 'Crispy Jerked Beef Croquettes'],
  [/Bolinho de Macaxeira/gi, 'Golden Cassava Croquettes'],
  [/Pastel de Queijo|Pastéis de Queijo/gi, 'Crispy Brazilian Cheese Pastries'],
  [/Pastel de Carne|Pastéis de Carne/gi, 'Crispy Brazilian Minced Beef Pastries'],
  [/Pastel de Camarão|Pastéis de Camarão/gi, 'Crispy Brazilian Shrimp Pastries'],
  [/Caldinho de Feijão/gi, 'Slow-Simmered Black Bean Broth with Bacon'],
  [/Torresmo Pururuca/gi, 'Crisp Crackling Pork Belly (Pururuca)'],
  [/Calabresa Acebolada/gi, 'Sautéed Brazilian Smoked Sausage with Sweet Onions'],
  [/Queijo Coalho na Brasa/gi, 'Grilled Coalho Cheese Skewer with Honey & Pepper'],
  [/Costela de Tambaqui/gi, 'Amazonian Tambaqui Ribs na Brasa'],
  [/Pirarucu em Crosta/gi, 'Amazonian Pirarucu in Brazil Nut Crust'],
  [/Pirarucu Grelhado/gi, 'Charcoal-Grilled Amazonian Pirarucu Fillet'],
  [/Carpaccio de Pirarucu/gi, 'Thinly Sliced Amazonian Pirarucu Carpaccio'],
  [/Carne de Sol do Engenho/gi, 'Traditional Sun-Cured Beef do Engenho with Baião'],
  [/Picanha na Brasa/gi, 'Prime Charcoal-Grilled Picanha Steak'],
  [/Bife de Chorizo|Chourizo/gi, 'Angus Bife de Chorizo Sirloin Steak'],
  [/Bife Ancho/gi, 'Prime Angus Ribeye Ancho Steak'],
  [/Fraldinha na Brasa/gi, 'Tender Flank Steak (Fraldinha) na Brasa'],
  [/Filé Mignon ao Molho Madeira/gi, 'Beef Tenderloin in Rich Madeira Wine Sauce'],
  [/Moqueca de Pirarucu/gi, 'Amazonian Pirarucu Clay-Pot Moqueca Stew'],
  [/Moqueca de Camarão/gi, 'Bahian Shrimp Moqueca Stew in Clay Pot'],
  [/Bobó de Camarão/gi, 'Creamy Cassava & Shrimp Stew (Bobó)'],
  [/Escondidinho de Carne de Sol/gi, 'Gratinated Cassava Shepherd’s Pie with Sun-Cured Beef'],
  [/Escondidinho de Charque/gi, 'Gratinated Cassava Pie with Shredded Jerked Beef'],
  [/Caldeirão de Carne de Sol/gi, 'Cast-Iron Pot Cassava Stew with Sun-Cured Beef'],
  [/Caldeirão de Charque/gi, 'Cast-Iron Pot Cassava Stew with Jerked Beef'],
  [/Sanduiche de Pernil|Sanduíche de Pernil/gi, 'Slow-Roasted Pulled Pork Shank Sandwich'],
  [/Sanduiche de Mortadela|Sanduíche de Mortadela/gi, 'Thinly Sliced Italian Mortadella Sandwich'],
  [/Sanduiche de Pastrami|Sanduíche de Pastrami/gi, 'Smoked Peppered Beef Pastrami Sandwich'],
  [/Sanduiche de Jamon|Sanduíche de Jamon/gi, 'Spanish Jamón & Aged Cheese Crusty Baguette'],
  [/Choripán/gi, 'Artisanal Grilled Sausage Choripán with Chimichurri'],
  [/Misto Especial/gi, 'Artisanal Brioche Ham & Melted Cheese Toast'],
  [/Hambúrguer do Engenho|Burg do Engenho/gi, 'Engenho Signature Artisanal Beef Burger'],
  [/Mini Pudim de Leite|Pudim de Leite/gi, 'Velvety Caramel Milk Flan (Pudim)'],
  [/Sorvete com Farofa de Brownie/gi, 'Artisanal Ice Cream with Crunchy Brownie Crumbs'],
  [/Pastel de Belém/gi, 'Authentic Portuguese Custard Tart (Pastel de Nata)'],
  [/Mousse de Cupuaçu/gi, 'Velvety Amazonian Cupuaçu Rainforest Mousse'],
  [/Mousse de Maracujá/gi, 'Tangy Brazilian Passion Fruit Mousse'],
  [/Taça de Cupuaçu|Taça Amazônica/gi, 'Cupuaçu Cream Parfait with Chocolate Ganache & Brazil Nuts'],
  [/Doce de Banana com Castanha/gi, 'Caramelized Plantain with Crunchy Brazil Nuts'],
  [/Abacaxi Braseado/gi, 'Charcoal-Grilled Pineapple Glazed with Cinnamon'],
  [/Chopp Brahma/gi, 'Draft Beer Brahma Lager (Chilled at -2°C)'],
  [/Chopp Stella/gi, 'Draft Beer Stella Artois (Chilled at -2°C)'],
  [/Chopp Heineken/gi, 'Draft Beer Heineken Pure Malt (-2°C)'],
  [/Chopp Amstel/gi, 'Draft Beer Amstel Lager (-2°C)'],
  [/Caipirinha de Limão/gi, 'Classic Fresh Lime & Sugarcane Cachaça Caipirinha'],
  [/Caipirinha de Cachaça/gi, 'Traditional Brazilian Cachaça Caipirinha'],
  [/Caipirosca de Morango/gi, 'Fresh Strawberry & Premium Vodka Caipirosca'],
  [/Caipirosca de Limão/gi, 'Fresh Lime & Premium Vodka Caipirosca'],
  [/Caipirosca de Kiwi/gi, 'Fresh Kiwi & Premium Vodka Caipirosca'],
  [/Suco de Laranja/gi, 'Freshly Squeezed 100% Natural Orange Juice'],
  [/Suco de Cupuaçu/gi, 'Authentic Amazonian Cupuaçu Natural Juice'],
  [/Suco de Graviola/gi, 'Exotic Soursop (Graviola) Natural Juice'],
  [/Suco de Acerola/gi, 'Amazonian Acerola Cherry Natural Juice'],
  [/Café Expresso|Café Espresso/gi, '100% Arabica Freshly Pulled Espresso']
];

const TITLE_REPLACEMENTS_ES = [
  [/Couvert do Engenho/gi, 'Couvert Artesanal de la Casa Engenho'],
  [/Azeitonas Empanadas/gi, 'Aceitunas Verdes Empanizadas Crujientes'],
  [/Crocante de Costela/gi, 'Croquetas Crujientes de Costilla Deshebrada'],
  [/Trio do Engenho/gi, 'Trío Degustación do Engenho (Pastel, Costilla y Tapioca)'],
  [/Rocambole Suíno/gi, 'Panceta de Cerdo Enrollada y Crujiente (Pururuca)'],
  [/Isca de Carne de Sol/gi, 'Tiras Tiernas de Carne de Sol con Yuca Frita'],
  [/Isca De Carne De Sol Do Engenho/gi, 'Bocaditos de Carne de Sol con Yuca Frita'],
  [/Joelho Trinchado/gi, 'Codillo de Cerdo Ahumado con Papas Rústicas'],
  [/Filé com Fritas|Filé Com Fritas/gi, 'Tiras de Lomo de Res Salteadas con Papas Fritas'],
  [/Coraçãozinho de Galinha/gi, 'Corazones de Pollo a la Brasa con Ajo'],
  [/Dadinho de Tapioca/gi, 'Dados Crujientes de Tapioca y Queso Coalho'],
  [/Pão de Alho|Pao De Alho/gi, 'Pan Baguette Tostado a la Brasa con Crema de Ajo'],
  [/Macaxeira Frita/gi, 'Yuca Dorada y Crujiente al Estilo Amazónico'],
  [/Batata Frita/gi, 'Papas Fritas Crujientes y Doradas'],
  [/Bolinho de Bacalhau/gi, 'Buñuelos Tradicionales Dorados de Bacalao'],
  [/Bolinho de Carne Seca/gi, 'Croquetas Caseras de Carne Seca Brasileña'],
  [/Bolinho de Macaxeira/gi, 'Croquetas Crujientes de Yuca'],
  [/Pastel de Queijo|Pastéis de Queijo/gi, 'Empanadas Brasileñas de Queso Derretido'],
  [/Pastel de Carne|Pastéis de Carne/gi, 'Empanadas Brasileñas de Carne de Res'],
  [/Pastel de Camarão|Pastéis de Camarão/gi, 'Empanadas Brasileñas de Camarones Salteados'],
  [/Caldinho de Feijão/gi, 'Caldo Concentrado de Frijoles con Tocino'],
  [/Torresmo Pururuca/gi, 'Chicharrón de Cerdo Extra Crujiente (Pururuca)'],
  [/Calabresa Acebolada/gi, 'Longaniza Calabresa Brasileña con Cebolla Salteada'],
  [/Queijo Coalho na Brasa/gi, 'Brocheta de Queso Coalho a la Parrilla con Miel'],
  [/Costela de Tambaqui/gi, 'Costillas de Tambaquí Amazónico a la Brasa'],
  [/Pirarucu em Crosta/gi, 'Lomo de Pirarucú Amazónico en Costra de Castañas'],
  [/Pirarucu Grelhado/gi, 'Filete de Pirarucú Amazónico a la Parrilla'],
  [/Carpaccio de Pirarucu/gi, 'Carpaccio Fino de Pirarucú Amazónico'],
  [/Carne de Sol do Engenho/gi, 'Carne de Sol Típica con Cremoso Baião de Dois'],
  [/Picanha na Brasa/gi, 'Picanha Brasileña a las Brasas con Guarniciones'],
  [/Bife de Chorizo|Chourizo/gi, 'Bife de Chorizo Angus a la Parrilla'],
  [/Bife Ancho/gi, 'Ojo de Bife Ancho Angus a las Brasas'],
  [/Fraldinha na Brasa/gi, 'Corte de Vacío (Fraldinha) a la Parrilla'],
  [/Filé Mignon ao Molho Madeira/gi, 'Medallones de Lomo Fino en Salsa al Vino Madeira'],
  [/Moqueca de Pirarucu/gi, 'Moqueca Tradicional de Pirarucú en Cazuela de Barro'],
  [/Moqueca de Camarão/gi, 'Moqueca de Camarones en Cazuela de Barro'],
  [/Bobó de Camarão/gi, 'Guiso Cremoso de Yuca y Camarones (Bobó)'],
  [/Escondidinho de Carne de Sol/gi, 'Escondidinho Gratinado de Yuca con Carne de Sol'],
  [/Escondidinho de Charque/gi, 'Escondidinho Gratinado de Yuca con Carne Seca'],
  [/Caldeirão de Carne de Sol/gi, 'Calderito de Hierro de Yuca con Carne de Sol'],
  [/Caldeirão de Charque/gi, 'Calderito de Hierro de Yuca con Carne Seca'],
  [/Sanduiche de Pernil|Sanduíche de Pernil/gi, 'Bocadillo de Pernil Deshebrado a Fuego Lento'],
  [/Sanduiche de Mortadela|Sanduíche de Mortadela/gi, 'Bocadillo de Mortadela Italiana en Finas Láminas'],
  [/Sanduiche de Pastrami|Sanduíche de Pastrami/gi, 'Bocadillo de Pastrami Ahumado de Res'],
  [/Sanduiche de Jamon|Sanduíche de Jamon/gi, 'Bocadillo de Jamón Curado y Queso Maduro'],
  [/Choripán/gi, 'Choripán con Embutido a la Brasa y Chimichurri'],
  [/Misto Especial/gi, 'Tostón de Pan Brioche con Jamón y Queso Fundido'],
  [/Hambúrguer do Engenho|Burg do Engenho/gi, 'Hamburguesa Gourmet de la Casa Engenho'],
  [/Mini Pudim de Leite|Pudim de Leite/gi, 'Flan Casero de Leche Condensada con Caramelo'],
  [/Sorvete com Farofa de Brownie/gi, 'Helado Artesanal con Crumble Crujiente de Brownie'],
  [/Pastel de Belém/gi, 'Pastel de Belém Portugués Tradicional'],
  [/Mousse de Cupuaçu/gi, 'Mousse Sedosa de Copoazú de la Selva Amazónica'],
  [/Mousse de Maracujá/gi, 'Mousse Refrescante de Maracuyá Silvestre'],
  [/Taça de Cupuaçu|Taça Amazônica/gi, 'Copa Amazónica de Crema de Copoazú y Ganache'],
  [/Doce de Banana com Castanha/gi, 'Plátano Dulce Caramelizado con Castañas de Pará'],
  [/Abacaxi Braseado/gi, 'Piña Asada a las Brasas con Canela'],
  [/Chopp Brahma/gi, 'Cerveza de Barril Brahma Lager Helada (-2°C)'],
  [/Chopp Stella/gi, 'Cerveza de Barril Stella Artois (-2°C)'],
  [/Chopp Heineken/gi, 'Cerveza de Barril Heineken Puro Malta (-2°C)'],
  [/Chopp Amstel/gi, 'Cerveza de Barril Amstel Lager (-2°C)'],
  [/Caipirinha de Limão/gi, 'Caipirinha Clásica con Lima Fresca y Cachaça'],
  [/Caipirinha de Cachaça/gi, 'Caipirinha Brasileña Clásica de Cachaça'],
  [/Caipirosca de Morango/gi, 'Caipirosca de Fresa Fresca con Vodka Premium'],
  [/Caipirosca de Limão/gi, 'Caipirosca de Lima Fresca con Vodka Premium'],
  [/Caipirosca de Kiwi/gi, 'Caipirosca Refrescante de Kiwi con Vodka'],
  [/Suco de Laranja/gi, 'Jugo 100% Natural de Naranja Fresca'],
  [/Suco de Cupuaçu/gi, 'Jugo 100% Natural de Copoazú Amazónico'],
  [/Suco de Graviola/gi, 'Jugo Exótico 100% Natural de Guanábana'],
  [/Suco de Acerola/gi, 'Jugo Fresco 100% Natural de Acerola'],
  [/Café Expresso|Café Espresso/gi, 'Café Espresso 100% Arábica con Crema Densa']
];

export function translateDishTitle(namePT, lang) {
  let res = namePT;
  const list = lang === 'en' ? TITLE_REPLACEMENTS_EN : TITLE_REPLACEMENTS_ES;
  for (const [pattern, rep] of list) {
    if (pattern.test(res)) {
      res = res.replace(pattern, rep);
      break;
    }
  }

  if (res === namePT) {
    // Systematic translation fallbacks for common terms
    if (lang === 'en') {
      res = res
        .replace(/\bFilé de\b/gi, 'Fillet of')
        .replace(/\bFilé com\b/gi, 'Tenderloin with')
        .replace(/\bCostela de\b/gi, 'Slow-Roasted Ribs of')
        .replace(/\bIsca de\b/gi, 'Crispy Bites of')
        .replace(/\bPastel de\b/gi, 'Brazilian Pastry with')
        .replace(/\bPastéis de\b/gi, 'Brazilian Pastries with')
        .replace(/\bBolinho de\b/gi, 'Croquettes of')
        .replace(/\bSalada de\b/gi, 'Fresh Salad of')
        .replace(/\bGrelhado\b/gi, 'Charcoal-Grilled')
        .replace(/\bna Brasa\b/gi, 'na Brasa (Charcoal Grilled)')
        .replace(/\bAssado\b/gi, 'Slow-Roasted')
        .replace(/\bFrito\b/gi, 'Crispy Fried')
        .replace(/\bEmpanado\b/gi, 'Golden Breaded')
        .replace(/\bcom Queijo\b/gi, 'with Melted Cheese')
        .replace(/\bcom Fritas\b/gi, 'with Golden Fries')
        .replace(/\bcom Batata\b/gi, 'with Potatoes')
        .replace(/\bcom Mandioca\b/gi, 'with Cassava')
        .replace(/\bcom Macaxeira\b/gi, 'with Cassava')
        .replace(/\bcom Arroz\b/gi, 'with Fluffy Rice')
        .replace(/\bVinho Tinto\b/gi, 'Red Wine')
        .replace(/\bVinho Branco\b/gi, 'White Wine')
        .replace(/\bVinho Rosé\b/gi, 'Rosé Wine')
        .replace(/\bEspumante\b/gi, 'Sparkling Wine')
        .replace(/\bÁgua Mineral\b/gi, 'Mineral Water')
        .replace(/\bÁgua com Gás\b/gi, 'Sparkling Mineral Water')
        .replace(/\bSuco de\b/gi, 'Fresh Juice of')
        .replace(/\bCerveja\b/gi, 'Chilled Beer')
        .replace(/\bDose de\b/gi, 'Shot of');
    } else {
      res = res
        .replace(/\bFilé de\b/gi, 'Filete de')
        .replace(/\bFilé com\b/gi, 'Lomo con')
        .replace(/\bCostela de\b/gi, 'Costillas de')
        .replace(/\bIsca de\b/gi, 'Tiritas de')
        .replace(/\bPastel de\b/gi, 'Empanada de')
        .replace(/\bPastéis de\b/gi, 'Empanadas de')
        .replace(/\bBolinho de\b/gi, 'Croquetas de')
        .replace(/\bSalada de\b/gi, 'Ensalada de')
        .replace(/\bGrelhado\b/gi, 'a la Parrilla')
        .replace(/\bna Brasa\b/gi, 'a la Brasa')
        .replace(/\bAssado\b/gi, 'Asado')
        .replace(/\bFrito\b/gi, 'Frito')
        .replace(/\bEmpanado\b/gi, 'Empanizado')
        .replace(/\bcom Queijo\b/gi, 'con Queso')
        .replace(/\bcom Fritas\b/gi, 'con Papas Fritas')
        .replace(/\bcom Batata\b/gi, 'con Papas')
        .replace(/\bcom Mandioca\b/gi, 'con Yuca')
        .replace(/\bcom Macaxeira\b/gi, 'con Yuca')
        .replace(/\bcom Arroz\b/gi, 'con Arroz')
        .replace(/\bVinho Tinto\b/gi, 'Vino Tinto')
        .replace(/\bVinho Branco\b/gi, 'Vino Blanco')
        .replace(/\bVinho Rosé\b/gi, 'Vino Rosado')
        .replace(/\bEspumante\b/gi, 'Vino Espumoso')
        .replace(/\bÁgua Mineral\b/gi, 'Agua Mineral')
        .replace(/\bÁgua com Gás\b/gi, 'Agua Mineral con Gas')
        .replace(/\bSuco de\b/gi, 'Jugo Fresco de')
        .replace(/\bCerveja\b/gi, 'Cerveza Helada')
        .replace(/\bDose de\b/gi, 'Copa / Chupito de');
    }
  }

  return res.trim();
}

console.log('Sample EN translated titles:');
['Couvert do Engenho', 'Azeitonas Empanadas', 'Crocante de Costela', 'Trio do Engenho', 'Costela de Tambaqui na Brasa', 'Filé com Fritas'].forEach(name => {
  console.log(`- ${name} -> EN: "${translateDishTitle(name, 'en')}" | ES: "${translateDishTitle(name, 'es')}"`);
});
