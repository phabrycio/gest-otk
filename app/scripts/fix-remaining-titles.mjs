import fs from 'fs';

const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));

const TITLE_FIXES = {
  "dish-03": {
    en: "Artisanal Sun-Cured Beef with Creamy Baião de Dois",
    es: "Carne de Sol Artesanal con Baião de Dois Cremoso"
  },
  "dish-dion-028": {
    en: "Engenho Signature Taster Trio (Jerked Beef, Pork Shank & Tambaqui Ribs)",
    es: "Trío Degustación do Engenho (Carne Seca, Codillo y Costillas de Tambaquí)"
  },
  "dish-dion-071": {
    en: "Kids Combo: Pick Your Protein & 3 Classic Sides",
    es: "Menú Infantil Combinado: Proteína y 3 Guarniciones a Elección"
  },
  "dish-dion-112": {
    en: "Prime Black Angus Striploin Sirloin Steak (Bife de Chorizo 250g)",
    es: "Bife de Chorizo Black Angus a las Brasas (250g)"
  },
  "dish-dion-195": {
    en: "Heineken Mint Draft Beer (300ml)",
    es: "Cerveza de Barril Heineken con Menta Fresca (300ml)"
  },
  "dish-dion-196": {
    en: "Heineken Mint Draft Beer (500ml)",
    es: "Cerveza de Barril Heineken con Menta Fresca (500ml)"
  },
  "dish-dion-197": {
    en: "Heineken Mint Draft Beer Pitcher (1L)",
    es: "Jarra de Cerveza Heineken con Menta Fresca (1L)"
  },
  "dish-dion-245": {
    en: "Artisanal Cachaça Cream Liqueur",
    es: "Licor Cremoso Artesanal de Cachaça"
  },
  "dish-dion-298": {
    en: "Strawberry Kiss Mocktail (Fresh Strawberry & Citrus Blend)",
    es: "Cóctel sin Alcohol Beso de Fresa con Cítricos"
  },
  "dish-dion-439": {
    es: "Vino Tinto Batente Syrah Reserva Seco"
  }
};

let count = 0;
const updated = items.map(item => {
  const fix = TITLE_FIXES[item.id];
  if (fix) {
    count++;
    return {
      ...item,
      name: {
        pt: item.name.pt,
        en: fix.en || item.name.en,
        es: fix.es || item.name.es
      }
    };
  }
  return item;
});

fs.writeFileSync('src/data/customerMenuData.json', JSON.stringify(updated, null, 2));
console.log(`Applied title fixes to ${count} items!`);
