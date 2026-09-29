import fs from 'fs';

const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));
const foodItems = items.filter(i => {
  const num = parseInt(i.id.replace('dish-dion-', ''));
  return !isNaN(num) && num <= 150;
});

const report = foodItems.map(i => ({
  id: i.id,
  name_pt: i.name.pt,
  name_en: i.name.en,
  desc_pt: i.description.pt,
  desc_en: i.description.en,
  desc_es: i.description.es
}));

fs.writeFileSync('scripts/dion-150-food-report.json', JSON.stringify(report, null, 2));
console.log('Report written for', report.length, 'items');
