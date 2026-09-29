import fs from 'fs';

const raw = fs.readFileSync('./src/data/customerMenuData.json', 'utf8');
const data = JSON.parse(raw);

const foodCats = ['ENTRADAS_PETISCOS', 'CARNES_BRASIL', 'PESCADOS_AMAZONIA', 'MASSAS_RISOTOS', 'SOBREMESAS', 'CHARCUTARIA', 'EXECUTIVO'];
const foodItems = data.filter(i => foodCats.includes(i.category) && (
  i.description.en.includes('Delicately prepared using prime ingredients') ||
  i.description.en.includes('following the highest culinary standards') ||
  i.description.en.includes('Prepared with fresh artisanal ingredients')
));

console.log('Total food items needing genuine culinary translation:', foodItems.length);

const output = foodItems.map((i, idx) => ({
  index: idx + 1,
  id: i.id,
  category: i.category,
  subcategory: i.subcategory,
  name_pt: i.name.pt,
  name_en: i.name.en,
  name_es: i.name.es,
  desc_pt: i.description.pt
}));

fs.writeFileSync('./scripts/food-to-translate.json', JSON.stringify(output, null, 2));
console.log('Written to ./scripts/food-to-translate.json');
