import fs from 'fs';

const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));
const categories = {};

items.forEach(item => {
  if (!categories[item.category]) categories[item.category] = [];
  categories[item.category].push({
    id: item.id,
    namePT: item.name.pt,
    subcategory: item.subcategory,
    price: item.price,
    descPT: item.description.pt
  });
});

for (const [cat, list] of Object.entries(categories)) {
  console.log(`=== CATEGORY: ${cat} (${list.length} items) ===`);
  list.slice(0, 10).forEach(x => {
    console.log(`  - ${x.namePT} [${x.subcategory}]: ${x.descPT.slice(0, 70)}...`);
  });
}
