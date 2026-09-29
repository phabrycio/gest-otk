import fs from 'fs';

const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));

// Exact translation mappings for all titles that appeared in untranslated
const TITLE_MAP = {
  // Pescados da Amazônia
  'Pirarucu em Crosta de Castanha-do-Brasil': {
    en: 'Amazonian Pirarucu in Brazil Nut Crust',
    es: 'Lomo de Pirarucú Amazónico en Costra de Castañas'
  },
  'Pirarucu em Crosta de Castanha - 1P': {
    en: 'Amazonian Pirarucu in Brazil Nut Crust (Single Portion)',
    es: 'Lomo de Pirarucú en Costra de Castañas (1 Persona)'
  },
  'Carpaccio de Pirarucu': {
    en: 'Thinly Sliced Amazonian Pirarucu Carpaccio',
    es: 'Carpaccio Fino de Pirarucú Amazónico'
  },
  'Camarão De Montão': {
    en: 'Heaping Platter of Crispy Golden Shrimps',
    es: 'Fuente Generosa de Camarones Dorados y Crujientes'
  },
  'Bolinho De Bacalhau Tradicional': {
    en: 'Traditional Golden Salt Cod Fritters (6 pcs)',
    es: 'Buñuelos Tradicionales Dorados de Bacalao (6 uds)'
  },
  'Pirarucu Ribeirinho': {
    en: 'Riverbank-Style Charcoal-Grilled Pirarucu Fillet',
    es: 'Filete de Pirarucú a la Parrilla Estilo Ribereño'
  },
  'Mini Pasteis de Camarão': {
    en: 'Crispy Mini Pastries Filled with Sautéed Shrimps',
    es: 'Mini Empanaditas Crujientes de Camarones Salteados'
  },
  'Caldeirão de Bacalhau': {
    en: 'Cast-Iron Pot Gratin of Codfish & Creamy Cassava',
    es: 'Calderito Gratinado de Bacalao con Yuca Cremosa'
  },
  'Caldeirão de Camarão': {
    en: 'Cast-Iron Pot Gratin of Shrimps & Creamy Cassava',
    es: 'Calderito Gratinado de Camarones con Yuca Cremosa'
  },
  'Tambaqui Manauara - 1P': {
    en: 'Manauara Tambaqui Ribs na Brasa (Single Portion)',
    es: 'Costillas de Tambaquí Manauara a la Brasa (1 Persona)'
  },
  'Tambaqui Smoked - 3P': {
    en: 'Smoked Amazonian Tambaqui Ribs na Brasa (Serves 3)',
    es: 'Costillas Ahumadas de Tambaquí a la Brasa (Para 3 Personas)'
  },
  'Bacalhau com Natas 1P': {
    en: 'Traditional Codfish with Cream (Bacalhau com Natas)',
    es: 'Bacalao Tradicional con Nata Gratinado (1 Persona)'
  },
  'Bacalhau com Natas e Camarão 1P': {
    en: 'Gratinated Codfish & Shrimps in Rich Cream (1P)',
    es: 'Bacalao y Camarones con Nata Gratinados (1 Persona)'
  },
  'Fettuccine De Camarão 1P': {
    en: 'Artisanal Fettuccine with Sautéed Shrimps (1P)',
    es: 'Fettuccine Artesanal con Camarones Salteados (1 Persona)'
  },
  'Camarão Amazônico 1P': {
    en: 'Amazonian Shrimps in Tucupi & Jambu Sauce (1P)',
    es: 'Camarones Amazónicos en Salsa de Tucupí y Jambú (1P)'
  },
  'Camarão Amazônico 2P': {
    en: 'Amazonian Shrimps in Tucupi & Jambu Sauce (Serves 2)',
    es: 'Camarones Amazónicos en Salsa de Tucupí y Jambú (Para 2)'
  },
  'Camarões Vila Verde 1P': {
    en: 'Vila Verde Herb Garlic Shrimps with White Rice',
    es: 'Camarones al Ajillo Vila Verde con Arroz'
  },
  'Bacalhau Manauara 1P': {
    en: 'Manauara Codfish Loin with Cassava Puree (1P)',
    es: 'Lomo de Bacalao Manauara con Puré de Yuca (1P)'
  },
  'Bacalhau Manauara 2P': {
    en: 'Manauara Codfish Loin with Cassava Puree (Serves 2)',
    es: 'Lomo de Bacalao Manauara con Puré de Yuca (Para 2)'
  },

  // Entradas & Petiscos
  'Bolinho De Macaxeira': {
    en: 'Golden Crispy Cassava Croquettes',
    es: 'Croquetas Doradas Crujientes de Yuca'
  },
  'Meladinho De Minas': {
    en: 'Golden Coalho Cheese Cubes with Cane Molasses Dip',
    es: 'Dados de Queso Coalho Dorado con Melaza de Caña'
  },
  'Completa Do Engenho': {
    en: 'The Ultimate Engenho Charcoal Grill & Tapas Feast',
    es: 'Gran Banquete Completo a la Brasa do Engenho'
  },
  'Costelinha Do Engenho': {
    en: 'House Honey-Glazed Charcoal Pork Ribs',
    es: 'Costillitas de Cerdo Glaseadas a la Brasa do Engenho'
  },
  'Deliciosos copinhos que podem ser servidos individuais ou em combos com 3 sabores para compartilhar – Uma verdadeira delícia na sua mesa!': {
    en: 'Engenho Savory Tasting Cups (Individual or Trio Flight)',
    es: 'Chupitos Salados de Degustación do Engenho (Individual o Trío)'
  },
  'Copinho de Feijão': {
    en: 'Mini Tasting Cup: Slow-Simmered Black Bean Soup',
    es: 'Chupito de Degustación: Caldito de Frijoles con Tocino'
  },
  'Copinho de Abóbora': {
    en: 'Mini Tasting Cup: Velvety Pumpkin & Jerked Beef Cream',
    es: 'Chupito de Degustación: Crema de Calabaza y Carne Seca'
  },
  'Copinho Amazônico': {
    en: 'Mini Tasting Cup: Pirarucu in Tucupi & Jambu Cream',
    es: 'Chupito de Degustación: Pirarucú en Crema de Tucupí y Jambú'
  },
  'Copinho de Strogonoff': {
    en: 'Mini Tasting Cup: Creamy Beef Stroganoff with Shoestring Fries',
    es: 'Chupito de Degustación: Strogonoff de Res con Papas Hilo'
  },
  'Copinho de Vaca Atolada': {
    en: 'Mini Tasting Cup: Braised Beef Ribs & Cassava Soup',
    es: 'Chupito de Degustación: Costilla de Res Estofada con Yuca'
  },
  'Mini Pastel Queijo Coalho': {
    en: 'Crispy Mini Pastries Filled with Golden Coalho Cheese',
    es: 'Mini Empanadas Crujientes de Queso Coalho'
  },
  'Mini Pastel Carne De Sol': {
    en: 'Crispy Mini Pastries with Sun-Cured Beef & Cream',
    es: 'Mini Empanadas Crujientes de Carne de Sol'
  },
  'Linguicinha Picante': {
    en: 'Charcoal-Grilled Spicy Brazilian Sausage',
    es: 'Embutido Picante Artesanal a la Brasa'
  },
  'Linguicinha do Engenho': {
    en: 'Engenho Signature Artisanal Charcoal-Grilled Sausage',
    es: 'Embutido Especial de la Casa a la Brasa'
  },
  'Linguicinha Espiral do Pecado': {
    en: 'Spiral Artisanal Pork Sausage na Brasa with Herbs',
    es: 'Espiral de Longaniza de Cerdo a la Brasa con Finas Hierbas'
  },
  'Linguicinha Blumenau Defumada': {
    en: 'Smoked Blumenau Artisan Sausage na Brasa',
    es: 'Embutido Blumenau Ahumado a la Brasa'
  },
  'Duplo Cheddar': {
    en: 'Double Black Angus Burger with Melted Aged Cheddar & Bacon',
    es: 'Hamburguesa Doble Black Angus con Queso Cheddar y Tocino'
  },
  'Cheeseburguer': {
    en: 'Classic Black Angus Brioche Cheeseburger',
    es: 'Hamburguesa Clásica Black Angus con Queso en Pan Brioche'
  },
  'X-Manaós Costela': {
    en: 'X-Manaós Pulled Rib Burger with Tucupi Mayo & Coalho Cheese',
    es: 'Hamburguesa X-Manaós de Costilla Deshebrada y Queso Coalho'
  },
  'Salada Coleslaw': {
    en: 'Crisp Shaved Cabbage Coleslaw with Creamy Herb Dressing',
    es: 'Ensalada Coleslaw Crujiente con Aderezo Suave de la Casa'
  },
  'Salada Assustada': {
    en: 'Flash-Charred Crisp Garden Salad with House Vinaigrette',
    es: 'Ensalada Fresca Salteada a Fuego Vivo con Vinagreta'
  },
  'Salada Búfula': {
    en: 'Fresh Buffalo Mozzarella & Cherry Tomato Salad',
    es: 'Ensalada de Mozzarella de Búfala Fresca y Tomates Cherry'
  },
  'Salada Caesar': {
    en: 'Classic Caesar Salad with Parmesan & Herb Croutons',
    es: 'Ensalada César Clásica con Parmesano y Picatostes'
  },
  'Bolonhesa': {
    en: 'Slow-Cooked Prime Beef Bolognese Ragu',
    es: 'Pasta al Ragú Boloñesa Clásica de Res'
  },
  'Arroz de rabada com rúcula - 1P': {
    en: 'Braised Oxtail Rice with Fresh Wild Arugula (1P)',
    es: 'Arroz Meloso de Rabo de Toro con Rúcula Fresca (1P)'
  },
  'Ragu do Brasil - 2P': {
    en: 'Brazilian Braised Meat Ragu with Creamy Polenta (Serves 2)',
    es: 'Ragú Brasileño de Carne Estofada para Compartir (Para 2)'
  },
  'Supreme de Frango - 1P': {
    en: 'Pan-Seared Chicken Supreme Breast with Herb Butter (1P)',
    es: 'Suprema de Pollo Sellada a la Mantequilla de Hierbas (1P)'
  },
  'Língua Bovina do Engenho - 1P': {
    en: 'Slow-Braised Tender Beef Tongue in Red Wine Reduction (1P)',
    es: 'Lengua de Res Estofada en Reducción de Vino Tinto (1P)'
  },
  'Costelão Do Engenho - 2P': {
    en: 'Slow-Smoked Prime Beef Ribs na Brasa (Serves 2)',
    es: 'Costillar Noble de Res Asado a las Brasas (Para 2)'
  },
  'Frango Na Chapa - 2P': {
    en: 'Sizzling Flat-Top Grilled Chicken with Sweet Onions (Serves 2)',
    es: 'Pollo a la Plancha con Cebollas Caramelizadas (Para 2)'
  },
  'Guarnição Especial do Engenho - 1P': {
    en: 'Engenho Specialty Sides: Baião, Farofa & Fried Cassava (1P)',
    es: 'Guarnición Especial do Engenho: Baião, Farofa y Yuca Frita (1P)'
  },
  'Guarnição Especial do Engenho - 2P': {
    en: 'Engenho Specialty Sides (Serves 2)',
    es: 'Guarnición Especial do Engenho para Compartir (Para 2)'
  },
  'Guarnição Nordestina - 1P': {
    en: 'Northeastern Sides: Baião de Dois, Farofa & Fried Cassava (1P)',
    es: 'Guarnición Nordestina: Baião de Dois, Farofa y Yuca (1P)'
  },
  'Guarnição Nordestina - 2P': {
    en: 'Northeastern Sides (Serves 2)',
    es: 'Guarnición Nordestina para Compartir (Para 2)'
  },
  'Guarnição Amazônica – 1P': {
    en: 'Amazonian Sides: Pará Rice, Uarini Farofa & Plantain (1P)',
    es: 'Guarnición Amazónica: Arroz Pará, Farofa Uarini y Plátano (1P)'
  },
  'Guarnição Amazônica – 2P': {
    en: 'Amazonian Sides (Serves 2)',
    es: 'Guarnición Amazónica para Compartir (Para 2)'
  },
  'Guarnição Mineira – 1P': {
    en: 'Minas Sides: Tutu Beans, Sautéed Collard Greens & Rice (1P)',
    es: 'Guarnición Mineira: Frijol Tutu, Col Salteada y Arroz (1P)'
  },
  'Guarnição Mineira – 2P': {
    en: 'Minas Sides (Serves 2)',
    es: 'Guarnición Mineira para Compartir (Para 2)'
  },
  'Arroz Branco': {
    en: 'Portion of Fluffy White Steamed Rice',
    es: 'Porción de Arroz Blanco Suave'
  },
  'Arroz Biro - Biro': {
    en: 'Biro-Biro Steakhouse Rice (Scrambled Eggs, Bacon & Crispy Straw Potatoes)',
    es: 'Arroz Biro-Biro con Tocino, Huevos Revueltos y Papas Hilo'
  },
  'Baião De Dois': {
    en: 'Traditional Baião de Dois (Rice & Beans with Coalho Cheese)',
    es: 'Baião de Dois Típico (Arroz y Frijoles con Queso Coalho)'
  },
  'Farofa De Ovos': {
    en: 'Toasted Cassava Farofa with Scrambled Eggs & Scallions',
    es: 'Farofa Tostada de Yuca con Huevos y Cebollino'
  },
  'Farofa De Banana': {
    en: 'Sweet & Savory Golden Plantain Farofa',
    es: 'Farofa Tostada con Trozos de Plátano Dulce'
  },
  'Farofa': {
    en: 'House Seasoned Toasted Cassava Farofa',
    es: 'Farofa Tostada Tradicional de la Casa'
  },
  'Vinagrete': {
    en: 'Fresh Diced Tomato, Sweet Onion & Herb Vinaigrette',
    es: 'Vinagreta Fresca de Tomate, Cebolla y Finas Hierbas'
  },
  'Batatonese': {
    en: 'Homestyle Creamy Potato & Herb Salad (Batatonese)',
    es: 'Ensaladilla Rusa Casera de Papas con Mayonesa de Hierbas'
  },

  // Carnes Nobres & Churrasco
  'Grande Carne De Sol Grande': {
    en: 'Large Sun-Cured Beef na Brasa with Baião & Cassava (Sharing)',
    es: 'Gran Porción de Carne de Sol a la Brasa con Baião y Yuca'
  },
  'Todos nossos Hamburgueres são feitos artesanalmente pela Boutique de carne VPJ em São Paulo, com carne bovina Black Angus. Todos acompanham batata frita e molho extra': {
    en: 'Artisanal VPJ Black Angus Gourmet Burger Platter (with Fries)',
    es: 'Hamburguesa Gourmet VPJ Black Angus (con Papas Fritas)'
  },
  'Tiras de Filé Mignon': {
    en: 'Sautéed Beef Tenderloin Strips with Sweet Onions & Butter',
    es: 'Tiras de Lomo Fino Salteadas a la Mantequilla con Cebolla'
  },
  'Caldeirão de Picanha': {
    en: 'Cast-Iron Pot Gratinated Cassava Pie with Grilled Picanha',
    es: 'Calderito Gratinado de Yuca con Picanha a la Brasa'
  },
  'Prime Rib Suíno - 2P': {
    en: 'Prime Pork Ribeye Chop na Brasa with Roasted Sides (Serves 2)',
    es: 'Prime Rib de Cerdo a la Brasa con Guarniciones (Para 2)'
  },
  'Carbonara de Joelho - 1P': {
    en: 'Smoked Pork Shank Spaghetti Carbonara (1P)',
    es: 'Spaghetti a la Carbonara con Codillo Ahumado de Cerdo (1P)'
  },
  'Filé Do Engenho - 1P': {
    en: 'Beef Tenderloin Fillet do Engenho with Madeira Sauce & Rice (1P)',
    es: 'Filete de Lomo do Engenho en Salsa de Vino con Arroz (1P)'
  },
  'Frango A Parmegiana - 1P': {
    en: 'Crispy Breaded Chicken Breast Parmigiana with Pasta (1P)',
    es: 'Pechuga de Pollo a la Parmesana Gratinada con Pasta (1P)'
  },
  'Carne De Sol Do Engenho - 1P': {
    en: 'Sun-Cured Beef do Engenho with Baião de Dois (1P)',
    es: 'Carne de Sol do Engenho con Baião de Dois (1 Persona)'
  },
  'Carne De Sol Do Engenho - 2P': {
    en: 'Sun-Cured Beef do Engenho with Baião de Dois (Serves 2)',
    es: 'Carne de Sol do Engenho con Baião de Dois (Para 2 Personas)'
  },
  'Carne De Sol Do Engenho - 3P': {
    en: 'Sun-Cured Beef do Engenho with Baião de Dois (Serves 3)',
    es: 'Carne de Sol do Engenho con Baião de Dois (Para 3 Personas)'
  },
  'Joelho De Porco Defumado - 3P': {
    en: 'Slow-Smoked Whole Pork Shank with Sauerkraut & Potatoes (Serves 3)',
    es: 'Codillo Entero Ahumado de Cerdo con Papas Rústicas (Para 3)'
  },
  'Costela Barbecue do Engenho - 2P': {
    en: 'House Smoked Pork Ribs in Barbecue Glaze with Fries (Serves 2)',
    es: 'Costillar de Cerdo a la Barbacoa con Papas Fritas (Para 2)'
  },
  'Pesos aproximados e in natura (antes do preparo) Não acompanha guarnições': {
    en: 'A La Carte Prime Charcoal-Grilled Steaks Selection',
    es: 'Selección de Cortes Nobles a las Brasas a la Carta'
  },
  'Picanha Angus 1P (Picanha Importada) 200G': {
    en: 'Imported Black Angus Picanha Steak na Brasa (200g)',
    es: 'Picanha Black Angus Importada a la Brasa (200g)'
  },
  'Picanha Angus 2P (Picanha Importada) 400G': {
    en: 'Imported Black Angus Picanha Steak na Brasa (400g - Serves 2)',
    es: 'Picanha Black Angus Importada a la Brasa (400g - Para 2)'
  },
  'Short Rib Black Angus 500g': {
    en: 'Prime Black Angus Short Rib na Brasa (500g)',
    es: 'Costillar Short Rib Black Angus a la Parrilla (500g)'
  },
  'Bife Chorizo Black Angus 250g': {
    en: 'Prime Black Angus Bife de Chorizo Sirloin Steak (250g)',
    es: 'Bife de Chorizo Black Angus a las Brasas (250g)'
  },
  'Fraldinha Black Angus 300g': {
    en: 'Prime Black Angus Flank Steak (Fraldinha) na Brasa (300g)',
    es: 'Vacío (Fraldinha) Black Angus a la Parrilla (300g)'
  },
  'Maminha Black Angus 300g': {
    en: 'Prime Black Angus Tri-Tip Steak (Maminha) na Brasa (300g)',
    es: 'Colita de Cuadril (Maminha) Black Angus a la Brasa (300g)'
  },
  'Cupim especial 300g': {
    en: 'Slow-Roasted Beef Hump Steak (Cupim) na Brasa (300g)',
    es: 'Corte Especial de Morro Bovino (Cupim) a la Brasa (300g)'
  },
  'T-Bone Black Angus 2P 500g': {
    en: 'Prime Black Angus T-Bone Steak na Brasa (500g - Serves 2)',
    es: 'T-Bone Steak Black Angus a la Parrilla (500g - Para 2)'
  },
  'Bife americano 300g': {
    en: 'American Cut Prime Angus Strip Steak na Brasa (300g)',
    es: 'Bife Americano Black Angus a las Brasas (300g)'
  },

  // Sobremesas
  'Mousse de Cupuaçu com Crocante de Castanha': {
    en: 'Amazonian Cupuaçu Mousse with Roasted Brazil Nut Crunch',
    es: 'Mousse Sedosa de Copoazú con Crujiente de Castañas'
  },
  'Petit Gateau Tradicional': {
    en: 'Warm Molten Chocolate Lava Cake with Vanilla Gelato',
    es: 'Volcán de Chocolate Semiamargo Tibio con Helado de Vainilla'
  },
  'Pudim De Leite': {
    en: 'Classic Brazilian Caramel Milk Flan (Pudim)',
    es: 'Flan Casero Tradicional de Leche Condensada con Caramelo'
  },
  'Pudim De Doce De Leite': {
    en: 'Rich Dulce de Leche Custard Flan with Amber Caramel',
    es: 'Flan Cremoso de Dulce de Leche con Caramelo Dorado'
  },
  'Manjar de Coco com Calda de Ameixa': {
    en: 'Silky Coconut Blancmange with Sweet Black Plum Compote',
    es: 'Manjar Blanco de Coco con Dulce Almíbar de Ciruela'
  },
  'Romeu e Julieta Desconstruído': {
    en: 'Deconstructed Romeo & Juliet (Artisan Coalho Cheese & Guava Jam)',
    es: 'Romeo y Julieta Deconstruido (Queso Coalho y Dulce de Guayaba)'
  },
  'Torta Gelada De Abacaxi Un': {
    en: 'Chilled Coconut & Roasted Pineapple Layer Cake Slice',
    es: 'Tarta Helada Casera de Piña Asada y Coco'
  },

  // Massas & Escondidinhos
  'Deliciosas combinações “escondidas” no creme de macaxeira com queijo, uma mistura cremosa e uniforme que você já conhece. Porções bem servidas nos nossos caldeirõezinhos de ferro fundido, pra você se deliciar sozinho ou compartilhar – Todos acompanham arroz branco': {
    en: 'Artisanal Cast-Iron Gratinated Cassava Shepherd’s Pies (Choice of Fillings)',
    es: 'Calderitos de Yuca Gratinados en Hierro Fundido (Relleno a Elección)'
  },

  // Bebidas & Cafés
  'Para quem quer beber menos, mas não abre mão de degustar com equilíbrio um excelente drink!': {
    en: 'Low-ABV & Balanced Tasting Cocktails Selection',
    es: 'Selección de Cócteles Ligeros y Equilibrados'
  },
  'LL&B Miúdo': {
    en: 'Mini LL&B (Lemon, Lime & Angostura Bitters Spritzer)',
    es: 'Mini Cóctel Refrescante LL&B con Lima y Angostura'
  },
  'Café Coado P': {
    en: 'Fresh Drip Brew Coffee (Small)',
    es: 'Café Filtrado Tradicional al Momento (Pequeño)'
  },
  'Cappuccino Classic - Três Corações': {
    en: 'Classic Italian Cappuccino with Velvety Milk Foam',
    es: 'Cappuccino Clásico Italiano con Espuma Densa'
  },
  'Expresso Atento - Três Corações': {
    en: 'Intense Dark Roast Espresso - 100% Arabica',
    es: 'Café Espresso Intenso - 100% Arábica'
  },
  'Expresso Ameno - Três Corações': {
    en: 'Smooth Medium Roast Espresso - 100% Arabica',
    es: 'Café Espresso Suave y Aromático - 100% Arábica'
  },
  'Expresso Decaf - Três Corações': {
    en: 'Decaffeinated Premium Espresso - 100% Arabica',
    es: 'Café Espresso Descafeinado Premium - 100% Arábica'
  },
  'Cappuccino Chocolatto Três Corações': {
    en: 'Chocolate Cappuccino with Velvety Froth',
    es: 'Cappuccino con Chocolate Cremoso'
  },
  'Cappuccino Chocolatto Caramel - Três Corações': {
    en: 'Salted Caramel Chocolate Cappuccino',
    es: 'Cappuccino con Chocolate y Toque de Caramelo'
  },
  'Chá De Hortelã - Três Corações': {
    en: 'Fresh Moroccan Peppermint Herbal Tea',
    es: 'Infusión de Menta Fresca Digestiva'
  },
  'Chá De Cidreira - Três Corações': {
    en: 'Soothing Lemon Balm Herbal Infusion',
    es: 'Infusión Calmante de Hierbaluisa'
  },
  'Chá De Hibisco e Maçã - Três Corações': {
    en: 'Vibrant Hibiscus & Crisp Red Apple Tea',
    es: 'Infusión de Hibisco y Manzana Roja'
  },
  'Suco De Uva Integral - Casa Madeira': {
    en: 'Casa Madeira 100% Pure Whole Grape Juice (Zero Added Sugar)',
    es: 'Jugo 100% Puro Integral de Uva Casa Madeira'
  },
  'Adicional Leite- Copo': {
    en: 'Extra Cup of Steamed Whole Milk',
    es: 'Vaso Adicional de Leche Entera'
  },
  'Adicional leite - Jarra': {
    en: 'Extra Small Pitcher of Steamed Milk',
    es: 'Jarra Adicional de Leche Caliente'
  },
  'Monster Grenn 269ml': {
    en: 'Monster Energy Green Original (269ml)',
    es: 'Bebida Energizante Monster Green (269ml)'
  },
  'Monster Mango Loko 473ml': {
    en: 'Monster Energy Mango Loko (473ml)',
    es: 'Bebida Energizante Monster Mango Loko (473ml)'
  },
  'Schweppes': {
    en: 'Schweppes Sparkling Citrus Soda / Tonic',
    es: 'Schweppes Cítrico / Tónica con Gas'
  },
  'Água Mineral': {
    en: 'Chilled Natural Mineral Water (Bottle)',
    es: 'Agua Mineral Natural Helada (Botella)'
  },
  'Caipirinha Do Engenho': {
    en: 'Engenho Signature Artisanal Sugarcane Caipirinha',
    es: 'Caipirinha Especial de la Casa con Cachaça Artesanal'
  },
  'Heineken 300ml': {
    en: 'Heineken Draft Beer in Frosted Glass Mug (300ml)',
    es: 'Cerveza de Barril Heineken en Tarro Helado (300ml)'
  },
  'Heineken 500ml': {
    en: 'Heineken Draft Beer in Frosted Glass Pint (500ml)',
    es: 'Cerveza de Barril Heineken en Tarro Grande (500ml)'
  },
  'Heineken 1L': {
    en: 'Heineken Draft Beer Pitcher (1 Liter)',
    es: 'Jarra de Cerveza de Barril Heineken (1 Litro)'
  },
  'Heineken Sujo 300ml': {
    en: 'Heineken Draft Beer with Sea Salt & Fresh Lime Rim (300ml)',
    es: 'Cerveza Heineken Escarchada con Sal y Lima Fresca (300ml)'
  },
  'Standard 300ml': {
    en: 'Classic Caipirinha Selection (Standard Cachaça - 300ml)',
    es: 'Caipirinha Clásica Tradicional (300ml)'
  },
  'Especiais 300ml': {
    en: 'Special Aged Cachaça Caipirinha (300ml)',
    es: 'Caipirinha de Cachaça Especial Envejecida (300ml)'
  },
  'Premium 300ml': {
    en: 'Ultra-Premium Barrel-Aged Cachaça Caipirinha (300ml)',
    es: 'Caipirinha con Cachaça Premium de Barrica (300ml)'
  },
  'Standard 700ml': {
    en: 'Classic Caipirinha Pitcher (Standard Cachaça - 700ml)',
    es: 'Jarra de Caipirinha Clásica Tradicional (700ml)'
  },
  'Especiais 700ml': {
    en: 'Special Aged Cachaça Caipirinha Pitcher (700ml)',
    es: 'Jarra de Caipirinha con Cachaça Especial (700ml)'
  },
  'Premium 700ml': {
    en: 'Ultra-Premium Cachaça Caipirinha Pitcher (700ml)',
    es: 'Jarra de Caipirinha con Cachaça Premium de Barrica (700ml)'
  }
};

// Apply all mappings
let matchedCount = 0;
const updatedItems = items.map((item) => {
  const namePT = item.name.pt || item.name;
  let nameEN = item.name.en || namePT;
  let nameES = item.name.es || namePT;

  if (TITLE_MAP[namePT]) {
    nameEN = TITLE_MAP[namePT].en;
    nameES = TITLE_MAP[namePT].es;
    matchedCount++;
  } else if (nameEN === namePT) {
    // Systematic replacement if still untranslated
    nameEN = namePT
      .replace(/\bVinho Tinto\b/g, 'Red Wine')
      .replace(/\bVinho Branco\b/g, 'White Wine')
      .replace(/\bVinho Rosé\b/g, 'Rosé Wine')
      .replace(/\bEspumante\b/g, 'Sparkling Wine')
      .replace(/\bBlend Tinto\b/g, 'Red Blend Wine')
      .replace(/\bBlend Rosé\b/g, 'Rosé Blend Wine')
      .replace(/\bBranco Suave\b/g, 'Sweet White Wine')
      .replace(/\bBranco\b/g, 'White Wine')
      .replace(/\bSuave\b/g, 'Sweet')
      .replace(/\bSeco\b/g, 'Dry')
      .replace(/\bDoses Diversas\b/g, 'Curated Premium Shots')
      .replace(/\bChopp\b/g, 'Draft Beer')
      .replace(/\bCerveja\b/g, 'Beer')
      .replace(/\bSuco\b/g, 'Fresh Juice');

    nameES = namePT
      .replace(/\bVinho Tinto\b/g, 'Vino Tinto')
      .replace(/\bVinho Branco\b/g, 'Vino Blanco')
      .replace(/\bVinho Rosé\b/g, 'Vino Rosado')
      .replace(/\bEspumante\b/g, 'Vino Espumoso')
      .replace(/\bBlend Tinto\b/g, 'Coupage Tinto')
      .replace(/\bBlend Rosé\b/g, 'Coupage Rosado')
      .replace(/\bBranco Suave\b/g, 'Vino Blanco Dulce')
      .replace(/\bBranco\b/g, 'Vino Blanco')
      .replace(/\bSuave\b/g, 'Dulce')
      .replace(/\bSeco\b/g, 'Seco')
      .replace(/\bDoses Diversas\b/g, 'Chupitos y Licores')
      .replace(/\bChopp\b/g, 'Cerveza de Barril')
      .replace(/\bCerveja\b/g, 'Cerveza')
      .replace(/\bSuco\b/g, 'Jugo Fresco');
  }

  return {
    ...item,
    name: {
      pt: namePT,
      en: nameEN,
      es: nameES
    }
  };
});

fs.writeFileSync('src/data/customerMenuData.json', JSON.stringify(updatedItems, null, 2));
console.log(`Successfully mapped ${matchedCount} dishes to explicit EN/ES names!`);

// Quality audit
let untranslatedCount = 0;
updatedItems.forEach(i => {
  if (i.name.pt === i.name.en) {
    untranslatedCount++;
  }
});
console.log(`Remaining untranslated titles: ${untranslatedCount} / ${updatedItems.length}`);
if (untranslatedCount > 0) {
  console.log('Sample still untranslated:', updatedItems.filter(i => i.name.pt === i.name.en).map(i => i.name.pt).slice(0, 15));
}
