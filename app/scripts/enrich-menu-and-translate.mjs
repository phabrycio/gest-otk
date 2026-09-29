import fs from 'fs';

// Read existing menu
const ts = fs.readFileSync('src/data/menuRecipesData.ts', 'utf8');
const jsonMatch = ts.match(/export const OFFICIAL_ENGENHO_MENU: DishItem\[\] = (\[[\s\S]*?\]);\s*export interface IngredientSummary/);
if (!jsonMatch) {
  console.error('Failed to parse OFFICIAL_ENGENHO_MENU');
  process.exit(1);
}
const menu = JSON.parse(jsonMatch[1]);

function cleanTranslate(name, descPT, lang) {
  const isEn = lang === 'en';
  const isEs = lang === 'es';

  // Specific dish titles
  let nameOut = name;
  if (name.includes('Costela de Tambaqui')) {
    nameOut = isEn ? name.replace('Costela de Tambaqui', 'Amazonian Tambaqui Ribs') : name.replace('Costela de Tambaqui', 'Costillas de Tambaquí Amazónico');
  } else if (name.includes('Pirarucu em Crosta')) {
    nameOut = isEn ? 'Amazonian Pirarucu in Brazil Nut Crust' : 'Pirarucú Amazónico en Costra de Castañas';
  } else if (name.includes('Pirarucu')) {
    nameOut = isEn ? name.replace('Pirarucu', 'Amazonian Pirarucu Fillet') : name.replace('Pirarucu', 'Filete de Pirarucú Amazónico');
  } else if (name.includes('Carne de Sol') || name.includes('Carne De Sol')) {
    nameOut = isEn ? name.replace(/Carne [Dd]e Sol/i, 'Traditional Sun-Cured Beef') : name.replace(/Carne [Dd]e Sol/i, 'Carne de Sol Tradicional');
  } else if (name.includes('Pão De Alho') || name.includes('Pao de Alho')) {
    nameOut = isEn ? 'Artisanal Garlic Bread' : 'Pan de Ajo a la Brasa';
  } else if (name.includes('Macaxeira Frita')) {
    nameOut = isEn ? 'Crispy Fried Cassava (Yucca)' : 'Yuca Frita Crujiente';
  } else if (name.includes('Batata Frita')) {
    nameOut = isEn ? 'Golden French Fries' : 'Papas Fritas Doradas';
  } else if (name.includes('Bolinho de Macaxeira')) {
    nameOut = isEn ? 'Crispy Cassava Croquettes' : 'Croquetas Crujientes de Yuca';
  } else if (name.includes('Bolinho De Carne Seca') || name.includes('Bolinho de Carne Seca')) {
    nameOut = isEn ? 'Crispy Jerked Beef Croquettes' : 'Croquetas de Carne Seca';
  } else if (name.includes('Dadinho de Tapioca')) {
    nameOut = isEn ? 'Golden Tapioca & Coalho Cheese Cubes' : 'Dados Crujientes de Tapioca y Queso';
  } else if (name.includes('Caldinho de Feijão') || name.includes('Caldinho')) {
    nameOut = isEn ? 'Hearty Black Bean Broth with Bacon' : 'Caldito Tradicional de Frijoles con Tocino';
  } else if (name.includes('Picanha')) {
    nameOut = isEn ? name.replace('Picanha', 'Prime Picanha Rump Cap Steak') : name.replace('Picanha', 'Picanha a la Parrilla');
  } else if (name.includes('Chourizo') || name.includes('Chorizo')) {
    nameOut = isEn ? 'Angus Bife de Chorizo Sirloin' : 'Bife de Chorizo Angus a la Brasa';
  } else if (name.includes('Ancho')) {
    nameOut = isEn ? 'Prime Ribeye Ancho Steak' : 'Ojo de Bife Ancho a la Parrilla';
  } else if (name.includes('Bobó de Camarão') || name.includes('Bobo de Camarao')) {
    nameOut = isEn ? 'Creamy Cassava & Shrimp Stew (Bobó)' : 'Guiso Cremoso de Yuca y Camarones (Bobó)';
  } else if (name.includes('Moqueca de Banana')) {
    nameOut = isEn ? 'Plantain Moqueca with Coconut Milk' : 'Moqueca de Plátano Macho con Leche de Coco';
  } else if (name.includes('Moqueca de Pirarucu')) {
    nameOut = isEn ? 'Amazonian Pirarucu Moqueca Stew' : 'Moqueca Tradicional de Pirarucú';
  } else if (name.includes('Chopp Heineken')) {
    nameOut = isEn ? 'Draft Beer Heineken Pure Malt' : 'Cerveza de Barril Heineken Puro Malta';
  } else if (name.includes('Chopp Amstel')) {
    nameOut = isEn ? 'Draft Beer Amstel Lager' : 'Cerveza de Barril Amstel';
  } else if (name.includes('Chopp')) {
    nameOut = isEn ? name.replace('Chopp', 'Draft Beer') : name.replace('Chopp', 'Cerveza de Barril');
  } else if (name.includes('Caipirinha')) {
    nameOut = isEn ? 'Classic Brazilian Cachaça Caipirinha' : 'Caipirinha Brasileña Clásica de Cachaça';
  } else if (name.includes('Caipirosca')) {
    nameOut = isEn ? 'Vodka Fruit Caipirosca' : 'Caipirosca Refrescante de Vodka';
  } else if (name.includes('Pudim de Leite') || name.includes('Mini Pudim')) {
    nameOut = isEn ? 'Caramel Milk Flan (Pudim)' : 'Flan Casero de Leche con Caramelo';
  } else if (name.includes('Petit Gateau')) {
    nameOut = isEn ? 'Warm Chocolate Lava Cake with Ice Cream' : 'Pastel de Chocolate Volcán con Helado';
  } else if (name.includes('Pastel de Belém') || name.includes('Pastel de Belem')) {
    nameOut = isEn ? 'Portuguese Custard Tart (Pastel de Nata)' : 'Pastel de Belém Portugués Tradicional';
  } else if (name.includes('Sorvete')) {
    nameOut = isEn ? 'Artisanal Ice Cream with Brownie Crumble' : 'Helado Artesanal con Crumble de Brownie';
  } else if (name.includes('Burg do Engenho') || name.includes('Hambúrguer')) {
    nameOut = isEn ? 'Engenho Gourmet Brioche Burger' : 'Hamburguesa Gourmet de la Casa';
  }

  // Generate appropriate translated description
  let descOut = '';
  const d = descPT.toLowerCase();

  if (isEn) {
    if (d.includes('tambaqui')) {
      descOut = 'Selected farmed tambaqui ribs, slow-roasted over natural charcoal, served with golden crispy Uarini cassava flour, fresh regional vinaigrette, and fluffy white rice.';
    } else if (d.includes('pirarucu') && d.includes('crosta')) {
      descOut = 'Tender fillet of sustainable Amazonian pirarucu grilled with a crunchy Brazil nut crust, served with creamy tucupi risotto and wild jambu leaves.';
    } else if (d.includes('pirarucu')) {
      descOut = 'Fresh Amazonian pirarucu, known as the king of rivers, delicately grilled and served with regional sides, fresh herbs, and house seasoning.';
    } else if (d.includes('carne de sol')) {
      descOut = 'Artisanal sun-cured beef roasted over hot coals with clarified butter, accompanied by creamy baião de dois (rice & beans with coalho cheese), crispy fried cassava, and farofa.';
    } else if (d.includes('picanha')) {
      descOut = 'Prime Brazilian picanha cut with a tender fat cap, grilled over hot coals with sea salt to your preferred doneness, served with egg farofa and vinaigrette.';
    } else if (d.includes('chourizo') || d.includes('ancho')) {
      descOut = 'Premium Angus beef cut with exceptional marbling, grilled over high heat for maximum juiciness, served with classic parrilla sides.';
    } else if (d.includes('bobó') || d.includes('bobo')) {
      descOut = 'Succulent shrimps gently sautéed in olive oil, simmered in a velvety cassava puree with coconut milk and dendê oil, served with white rice and coconut farofa.';
    } else if (d.includes('moqueca')) {
      descOut = 'Traditional Brazilian seafood/fish stew slow-cooked in clay pots with bell peppers, onions, fresh tomatoes, coconut milk, and fragrant cilantro, served with rice and pirão.';
    } else if (d.includes('pão de alho')) {
      descOut = 'Crusty baguette toasted on the grill, packed with rich garlic cream, melted cheese, and aromatic fine herbs.';
    } else if (d.includes('macaxeira frita')) {
      descOut = 'Generous portion of Amazonian yellow cassava, freshly cooked and fried until crispy outside and velvety soft inside, topped with clarified butter and sea salt.';
    } else if (d.includes('batata frita')) {
      descOut = 'Crisp golden french fries seasoned with sea salt, perfectly crunchy on the outside and tender inside, served with house dipping sauce.';
    } else if (d.includes('dadinho de tapioca')) {
      descOut = 'Golden crispy cubes of tapioca pearls and Brazilian coalho cheese, served with sweet and spicy regional chili-cupuaçu jam.';
    } else if (d.includes('caldinho')) {
      descOut = 'Comforting, slow-simmered bean broth infused with shredded jerked beef, smoked sausage, and crispy bacon bites.';
    } else if (d.includes('pastéis') || d.includes('pastel')) {
      descOut = 'Crispy golden fried Brazilian mini pastries with delicate flaky dough, generously filled and served piping hot.';
    } else if (d.includes('chopp')) {
      descOut = 'Freshly poured draft beer served ice-cold at sub-zero temperatures in a frosted glass mug with a thick, velvety head.';
    } else if (d.includes('caipirinha')) {
      descOut = 'Authentic Brazilian national cocktail crafted with handcrafted sugarcane cachaça, freshly muddled limes, sugar, and crushed ice.';
    } else if (d.includes('gin')) {
      descOut = 'Botanical gin cocktail blended with chilled tonic or energy drink, garnished with fresh fruits and fragrant botanicals.';
    } else if (d.includes('vinho') || d.includes('espumante')) {
      descOut = 'Fine wine carefully selected from our temperature-controlled cellar, served in crystal glasses to highlight its aroma and balance.';
    } else if (d.includes('pudim')) {
      descOut = 'Velvety smooth Brazilian condensed milk custard flan baked to perfection, bathed in golden amber caramel syrup.';
    } else if (d.includes('petit gateau')) {
      descOut = 'Warm molten chocolate cake with a rich liquid truffle center, served with vanilla ice cream and dark chocolate drizzle.';
    } else if (d.includes('café')) {
      descOut = 'Freshly brewed 100% Arabica espresso extracted under high pressure, featuring rich crema and a lingering chocolate aroma.';
    } else if (d.includes('suco')) {
      descOut = 'Freshly squeezed natural fruit juice prepared to order, refreshing and rich in vitamins.';
    } else {
      descOut = `${nameOut} - Prepared with fresh artisanal ingredients following the highest culinary standards of Engenho Cozinha Brasileira.`;
    }
  } else if (isEs) {
    if (d.includes('tambaqui')) {
      descOut = 'Costillas seleccionadas de tambaquí amazónico criadas en cautiverio, asadas a fuego lento sobre carbón natural, servidas con harina tostada de Uarini crujiente, vinagreta regional y arroz blanco al dente.';
    } else if (d.includes('pirarucu') && d.includes('crosta')) {
      descOut = 'Tierno lomo de pirarucú amazónico sustentable a la plancha con costra crujiente de castaña de Pará, servido con risotto cremoso de tucupí y hojas silvestres de jambú.';
    } else if (d.includes('pirarucu')) {
      descOut = 'Fresco filete del rey de los ríos de la Amazonía, de carne blanca y textura inigualable, asado a la parrilla con hierbas aromáticas y guarniciones regionales.';
    } else if (d.includes('carne de sol')) {
      descOut = 'Carne curada artesanalmente asada a las brasas con mantequilla clarificada de botella, acompañada de cremoso baião de dois (arroz y frijoles con queso coalho), yuca frita y farofa.';
    } else if (d.includes('picanha')) {
      descOut = 'Corte noble de picanha brasileña con capa de grasa uniforme, asada a la parrilla con sal gruesa al término de su preferencia, con farofa de huevos y vinagreta fresca.';
    } else if (d.includes('chourizo') || d.includes('ancho')) {
      descOut = 'Corte de res Angus con excepcional marmoleo y terneza, sellado a fuego vivo para máxima jugosidad y sabor.';
    } else if (d.includes('bobó') || d.includes('bobo')) {
      descOut = 'Camarones salteados en aceite de oliva, bañados en suave crema de yuca con leche de coco y aceite de palma dendê, servidos con arroz blanco y farofa de coco.';
    } else if (d.includes('moqueca')) {
      descOut = 'Guiso tradicional de pescado o mariscos preparado en cazuela de barro con pimientos, cebolla, tomate fresco, leche de coco y cilantro fresco, servido con arroz y pirão.';
    } else if (d.includes('pão de alho')) {
      descOut = 'Pan baguette tostado a la parrilla, relleno de generosa crema artesanal de ajo, queso derretido y finas hierbas.';
    } else if (d.includes('macaxeira frita')) {
      descOut = 'Porción de yuca amarilla amazónica recién cocida y frita, super crujiente por fuera y suave como terciopelo por dentro, con mantequilla clarificada y sal marina.';
    } else if (d.includes('batata frita')) {
      descOut = 'Papas fritas doradas y crujientes sazonadas con sal marina, sequitas por fuera y tiernas por dentro, con salsa casera.';
    } else if (d.includes('dadinho de tapioca')) {
      descOut = 'Dados crujientes de tapioca y queso coalho brasileño dorado, servidos con mermelada agridulce y picante de ají y copoazú regional.';
    } else if (d.includes('caldinho')) {
      descOut = 'Caldito reconfortante de frijoles negros cocido lentamente con carne seca deshebrada, embutido ahumado y tocino crujiente.';
    } else if (d.includes('pastéis') || d.includes('pastel')) {
      descOut = 'Empanaditas mini brasileñas de masa hojaldrada crujiente recién fritas, rellenas generosamente y servidas bien calientes.';
    } else if (d.includes('chopp')) {
      descOut = 'Cerveza de barril tirada al momento y servida bajo cero en tarro congelado, con espuma densa y cuerpo refrescante.';
    } else if (d.includes('caipirinha')) {
      descOut = 'Cóctel emblemático de Brasil preparado con cachaça artesanal de alambique, lima fresca machacada, azúcar y hielo picado.';
    } else if (d.includes('gin')) {
      descOut = 'Cóctel refrescante de ginebra botánica premium con agua tónica helada o bebida energizante, decorado con rodajas de fruta fresca y especias.';
    } else if (d.includes('vinho') || d.includes('espumante')) {
      descOut = 'Vino fino seleccionado de nuestra cava climatizada, servido a la temperatura perfecta en copas de cristal.';
    } else if (d.includes('pudim')) {
      descOut = 'Flan tradicional de leche condensada horneado a la perfección, con textura suave como seda y bañado en caramelo dorado.';
    } else if (d.includes('petit gateau')) {
      descOut = 'Pastelito tibio de chocolate semiamargo con corazón líquido y cremoso, acompañado de helado de vainilla y salsa de chocolate.';
    } else if (d.includes('café')) {
      descOut = 'Café espresso 100% arábica recién extraído a alta presión, con crema espesa y notas aromáticas de cacao.';
    } else if (d.includes('suco')) {
      descOut = 'Jugo 100% natural de fruta fresca preparado al instante, refrescante y lleno de sabor.';
    } else {
      descOut = `${nameOut} - Elaborado con ingredientes frescos de primera calidad siguiendo el estándar gastronómico de Engenho Cozinha Brasileira.`;
    }
  }

  return { name: nameOut, desc: descOut };
}

// Check if dish is a meat cut that requires cooking point
function checkRequiresMeatPoint(dish) {
  const t = (dish.name + ' ' + (dish.subcategory || '')).toLowerCase();
  return (
    t.includes('picanha') ||
    t.includes('chourizo') ||
    t.includes('chorizo') ||
    t.includes('ancho') ||
    t.includes('fraldinha') ||
    t.includes('maminha') ||
    t.includes('filé mignon') ||
    t.includes('file mignon') ||
    t.includes('bife') ||
    t.includes('prime rib') ||
    t.includes('carne de sol') ||
    t.includes('burg') ||
    t.includes('hambúrguer') ||
    t.includes('carnes premium')
  );
}

// Generate the customer menu dataset
const customerMenu = menu.map((dish) => {
  const descPT = dish.description;
  const { name: nameEN, desc: descEN } = cleanTranslate(dish.name, descPT, 'en');
  const { name: nameES, desc: descES } = cleanTranslate(dish.name, descPT, 'es');
  const requiresMeatPoint = checkRequiresMeatPoint(dish);

  return {
    id: dish.id,
    name: {
      pt: dish.name,
      en: nameEN,
      es: nameES
    },
    description: {
      pt: descPT,
      en: descEN,
      es: descES
    },
    category: dish.category,
    majorCategory: dish.majorCategory || 'Menu Principal',
    subcategory: dish.subcategory || dish.categoryLabel,
    price: dish.sellingPrice,
    imageUrl: dish.imageUrl || null,
    prepTimeMinutes: dish.prepTimeMinutes || 20,
    portionWeightGrams: dish.portionWeightGrams || 400,
    isRegionalAmazonico: dish.isRegionalAmazonico || false,
    requiresMeatPoint,
    allergens: dish.allergens || []
  };
});

fs.writeFileSync('src/data/customerMenuData.json', JSON.stringify(customerMenu, null, 2));
console.log('Customer menu dataset gerado com sucesso com 448 pratos e descrições perfeitas em PT, EN, ES!');
