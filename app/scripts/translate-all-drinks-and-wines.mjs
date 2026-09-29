import fs from 'fs';

const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));

function formatDrinkTitle(name, lang) {
  const isEn = lang === 'en';

  // Heineken / Amstel Drafts
  if (/Heineken Sujo\s*(\d+[a-zA-Z]+)/i.test(name)) {
    const vol = name.match(/(\d+[a-zA-Z]+)/i)[1];
    return isEn
      ? `Heineken Draft with Salt & Lime Rim (${vol})`
      : `Chopp Heineken Escarchado con Sal y Lima (${vol})`;
  }
  if (/Amstel Sujo\s*(\d+[a-zA-Z]+)/i.test(name)) {
    const vol = name.match(/(\d+[a-zA-Z]+)/i)[1];
    return isEn
      ? `Amstel Lager Draft with Salt & Lime Rim (${vol})`
      : `Chopp Amstel Escarchado con Sal y Lima (${vol})`;
  }
  if (/Amstel\s*(\d+[a-zA-Z]+)/i.test(name)) {
    const vol = name.match(/(\d+[a-zA-Z]+)/i)[1];
    return isEn
      ? `Amstel Lager Draft in Frosted Mug (${vol})`
      : `Chopp Amstel Lager en Tarro Helado (${vol})`;
  }
  if (/Heineken\s*(\d+[a-zA-Z]+)/i.test(name)) {
    const vol = name.match(/(\d+[a-zA-Z]+)/i)[1];
    return isEn
      ? `Heineken Pure Malt Draft (${vol})`
      : `Chopp Heineken Puro Malta (${vol})`;
  }
  if (/Eisenbahn\s*(\d+[a-zA-Z]+|LN)/i.test(name)) {
    return isEn
      ? `Eisenbahn Pilsen Premium Beer (${name.replace('Eisenbahn', '').trim()})`
      : `Cerveza Eisenbahn Pilsen (${name.replace('Eisenbahn', '').trim()})`;
  }
  if (/Baden Baden/i.test(name)) {
    return isEn ? 'Baden Baden Artisanal Craft Beer (600ml)' : 'Cerveza Artesanal Baden Baden (600ml)';
  }
  if (/Bluemoon/i.test(name)) {
    return isEn ? 'Blue Moon Belgian White Wheat Ale (355ml)' : 'Cerveza de Trigo Blue Moon Belgian White (355ml)';
  }
  if (/Lagunitas/i.test(name)) {
    return isEn ? 'Lagunitas IPA Craft Beer (355ml)' : 'Cerveza Artesanal Lagunitas IPA (355ml)';
  }
  if (/Sol Zero/i.test(name)) {
    return isEn ? 'Sol Cero Non-Alcoholic Beer (330ml)' : 'Cerveza Sol Cero Sin Alcohol (330ml)';
  }

  // Fruit Caipirinhas & Caipiroscas
  if (/Caipirosca Tradiconal|Caipirosca Tradicional/i.test(name)) {
    return isEn ? 'Traditional Caipirosca (National Triple-Distilled Vodka)' : 'Caipirosca Tradicional (Vodka Brasileño Destilado)';
  }
  if (/Caipirosca Premium/i.test(name)) {
    return isEn ? 'Premium Caipirosca (Imported Vodka)' : 'Caipirosca Premium (Vodka Importado)';
  }
  if (/Caipirinha Do Engenho[\s\-]*Tradicional/i.test(name)) {
    return isEn ? 'House Engenho Caipirinha (Artisan Standard Cachaça)' : 'Caipirinha do Engenho (Cachaça Tradicional de Alambique)';
  }
  if (/Caipirinha Do Engenho[\s\-]*Premium/i.test(name)) {
    return isEn ? 'House Engenho Caipirinha (Barrel-Aged Gold Cachaça)' : 'Caipirinha do Engenho (Cachaça Noble Envejecida en Barrica)';
  }
  if (/Da Sicília/i.test(name)) {
    return isEn ? `Sicilian Lemon Caipirinha (${name.includes('Premium') ? 'Premium Vodka' : 'Cachaça'})` : `Caipirinha de Limón Siciliano (${name.includes('Premium') ? 'Vodka Premium' : 'Cachaça'})`;
  }
  if (/Abacaxi/i.test(name) && (name.includes('Tradicional') || name.includes('Premium'))) {
    return isEn ? `Fresh Pineapple Caipirinha (${name.includes('Premium') ? 'Premium Vodka' : 'Artisan Cachaça'})` : `Caipirinha de Piña Fresca (${name.includes('Premium') ? 'Vodka Premium' : 'Cachaça Artesanal'})`;
  }
  if (/Maracujá/i.test(name) && (name.includes('Tradicional') || name.includes('Premium'))) {
    return isEn ? `Fresh Passion Fruit Caipirinha (${name.includes('Premium') ? 'Premium Vodka' : 'Artisan Cachaça'})` : `Caipirinha de Maracuyá Fresca (${name.includes('Premium') ? 'Vodka Premium' : 'Cachaça Artesanal'})`;
  }
  if (/Morango/i.test(name) && (name.includes('Tradiconal') || name.includes('Tradicional') || name.includes('Premium'))) {
    return isEn ? `Fresh Strawberry Caipirinha (${name.includes('Premium') ? 'Premium Vodka' : 'Artisan Cachaça'})` : `Caipirinha de Fresa Fresca (${name.includes('Premium') ? 'Vodka Premium' : 'Cachaça Artesanal'})`;
  }
  if (/Cupuaçu/i.test(name) && (name.includes('Tradicional') || name.includes('Premium'))) {
    return isEn ? `Wild Amazonian Cupuaçu Caipirinha (${name.includes('Premium') ? 'Premium Vodka' : 'Artisan Cachaça'})` : `Caipirinha de Copoazú Amazónico (${name.includes('Premium') ? 'Vodka Premium' : 'Cachaça Artesanal'})`;
  }
  if (/Frutas Vermelhas/i.test(name) && (name.includes('Tradicional') || name.includes('Premium'))) {
    return isEn ? `Wild Red Berries Caipirinha (${name.includes('Premium') ? 'Premium Vodka' : 'Artisan Cachaça'})` : `Caipirinha de Frutos Rojos Silvestres (${name.includes('Premium') ? 'Vodka Premium' : 'Cachaça Artesanal'})`;
  }
  if (/Espanhola De Moranga|Espanhola/i.test(name)) {
    return isEn ? 'Espanhola Wine & Strawberry Cream Cocktail' : 'Cóctel Espanhola de Vino Tinto y Fresas con Leche Condensada';
  }
  if (/Bob Marley/i.test(name)) {
    return isEn ? 'Bob Marley Layered Tropical Rum Cocktail' : 'Cóctel Bob Marley Tropical de Tres Colores con Ron';
  }

  // Whiskeys & Tequilas & Liqueurs
  if (/Johnnie Walker/i.test(name)) {
    return isEn ? `${name} Scotch Whisky (Shot 50ml)` : `${name} Whisky Escocés (Copa 50ml)`;
  }
  if (/Old Parr/i.test(name)) {
    return isEn ? `${name} Blended Scotch Whisky (Shot 50ml)` : `${name} Whisky Escocés de Malta (Copa 50ml)`;
  }
  if (/Jack Daniels|Jack Daniel/i.test(name)) {
    return isEn ? `${name} Tennessee Whiskey (Shot 50ml)` : `${name} Whiskey de Tennessee (Copa 50ml)`;
  }
  if (/Buchanans/i.test(name)) {
    return isEn ? `${name} Deluxe Blended Scotch Whisky (Shot 50ml)` : `${name} Whisky Escocés Añejo (Copa 50ml)`;
  }
  if (/Tequila Jose Cuervo/i.test(name)) {
    return isEn ? `${name} 100% Blue Agave Tequila (Shot 50ml)` : `${name} Tequila de Agave Azul (Chupito 50ml)`;
  }
  if (/Licor 43/i.test(name)) {
    return isEn ? 'Licor 43 Spanish Herbal Citrus Liqueur (Shot 50ml)' : 'Licor 43 Español de Cítricos y Especias (Copa 50ml)';
  }
  if (/Licor Cointreau/i.test(name)) {
    return isEn ? 'Cointreau French Orange Liqueur (Shot 50ml)' : 'Licor Cointreau de Naranjas Dulces y Amargas (Copa 50ml)';
  }
  if (/Licor De Amarula/i.test(name)) {
    return isEn ? 'Amarula African Marula Fruit Cream Liqueur (Shot 50ml)' : 'Licor de Crema Amarula Marula Africana (Copa 50ml)';
  }
  if (/Steinhaeger/i.test(name)) {
    return isEn ? 'Doppel Steinhäger Juniper Spirit (Shot 50ml)' : 'Aguardiente Alemán de Enebro Steinhäger (Chupito 50ml)';
  }
  if (/Carajillo/i.test(name)) {
    return isEn ? 'Classic Carajillo 43 (Espresso & Licor 43 on Ice)' : 'Carajillo 43 Tradicional con Espresso y Hielo';
  }
  if (/Coquetel de Frutas/i.test(name)) {
    return isEn ? 'Tropical Mixed Fruit Cocktail with Brazilian Cachaça' : 'Cóctel Tropical de Frutas Frescas con Cachaça';
  }
  if (/Sex On The Beach/i.test(name)) {
    return isEn ? 'Sex on the Beach Cocktail (Vodka, Peach & Cranberry)' : 'Cóctel Sex on the Beach con Vodka, Melocotón y Arándanos';
  }
  if (/Penicillin/i.test(name)) {
    return isEn ? 'Penicillin Cocktail (Scotch, Lemon, Honey & Ginger)' : 'Cóctel Penicillin con Whisky Escocés, Limón, Miel y Jengibre';
  }
  if (/Groselha Spriz/i.test(name)) {
    return isEn ? 'Groselha Berry Spritz with Sparkling Wine' : 'Spritz de Frutos Rojos con Espumoso y Hielo';
  }
  if (/Margarita Power/i.test(name)) {
    return isEn ? 'Margarita Power Citrus Energy Cocktail' : 'Margarita Power con Cítricos y Toque Energizante';
  }
  if (/Turbine Sua Caipirosca/i.test(name)) {
    return isEn ? 'Customized Caipirosca (Choose Your Premium Vodka & Fruit)' : 'Personaliza tu Caipirosca (Elige tu Vodka y Fruta)';
  }
  if (/Turbine Seu Gin/i.test(name)) {
    return isEn ? 'Customized Gin & Tonic (Choose Your Gin & Botanicals)' : 'Personaliza tu Gin Tonic (Elige Ginebra y Especias)';
  }
  if (/Gin Fizz/i.test(name)) {
    return isEn ? `${name} (Botanical Gin, Lemon & Club Soda)` : `${name} con Jugo de Limón y Soda Efervescente`;
  }
  if (/Gin Frozen/i.test(name)) {
    return isEn ? `${name} (Frozen Botanical Slush with Tonic)` : `${name} Granizado Helado con Tónica`;
  }
  if (/Tonic Coquetel/i.test(name)) {
    return isEn ? `${name} (Classic Botanical Gin & Tonic)` : `${name} (Gin Tonic Botánico Clásico)`;
  }
  if (/Triple T/i.test(name)) {
    return isEn ? `${name} (Triple Citrus Infused Gin Tonic)` : `${name} (Gin Tonic con Triple Cítrico)`;
  }
  if (/Negroni/i.test(name)) {
    return isEn ? `${name} (Gin, Campari & Sweet Red Vermouth)` : `${name} (Ginebra, Campari y Vermut Rojo)`;
  }
  if (/Gin Wine/i.test(name)) {
    return isEn ? `${name} (Botanical Gin Spritz with Red Wine Float)` : `${name} (Ginebra con Toque de Vino Tinto)`;
  }

  // Cachaças (Amazonian & Minas Artisanal)
  if (/Jambucana/i.test(name)) {
    const vol = name.match(/(\d+[a-zA-Z]+)/i)?.[1] || '';
    return isEn
      ? `Jambucana (Wild Amazonian Jambu-Infused Cachaça ${vol})`
      : `Jambucana (Cachaça Amazónica con Jambú Eléctrico ${vol})`;
  }
  if (/Cachaça Manaos|Manaos|Cachaça Manas/i.test(name)) {
    return isEn
      ? `${name.replace(/Cachaça Manas/g, 'Cachaça Manaós')} (Artisanal Amazonian Rainforest Cachaça)`
      : `${name.replace(/Cachaça Manas/g, 'Cachaça Manaós')} (Cachaça Artesanal Amazónica)`;
  }
  if (/Santo Grau|Salinas|Seleta|Anisio Santiago|Havana|Leblon|Vale Verde|Weber Haus/i.test(name)) {
    return isEn
      ? `${name} (Artisanal Barrel-Aged Brazilian Cachaça)`
      : `${name} (Cachaça Brasileña Artesanal de Alambique)`;
  }
  if (/50ml/i.test(name)) {
    return isEn
      ? `${name.replace('50ml', '').trim()} (Artisanal Brazilian Cachaça Shot - 50ml)`
      : `${name.replace('50ml', '').trim()} (Chupito de Cachaça Artesanal - 50ml)`;
  }
  if (/700ml|600ml|670ml|750ml|1L/i.test(name)) {
    return isEn
      ? `${name} (Full Bottle Selection)`
      : `${name} (Botella Completa Seleccionada)`;
  }

  // Wines
  if (/Chardonnay|Torrontés|Malbec|Cabernet|Syrah|Montepulciano|Ruby|Tawny|White|Porto/i.test(name)) {
    return isEn
      ? `${name} Fine Wine`
      : `${name} Vino Fino Seleccionado`;
  }

  return isEn ? `${name} (House Selection)` : `${name} (Selección Especial)`;
}

// Update all items
let drinkCount = 0;
const processed = items.map((item) => {
  const namePT = item.name.pt;
  let nameEN = item.name.en;
  let nameES = item.name.es;

  if (nameEN === namePT) {
    nameEN = formatDrinkTitle(namePT, 'en');
    nameES = formatDrinkTitle(namePT, 'es');
    drinkCount++;
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

fs.writeFileSync('src/data/customerMenuData.json', JSON.stringify(processed, null, 2));
console.log(`Updated ${drinkCount} remaining drink/wine items!`);

// Final audit
let untranslated = 0;
processed.forEach(i => {
  if (i.name.pt === i.name.en) {
    untranslated++;
  }
});
console.log(`FINAL UNTRANSLATED TITLES COUNT: ${untranslated} out of ${processed.length}`);
