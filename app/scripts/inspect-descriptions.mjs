import fs from 'fs';

const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));
console.log('Descriptions sample (first 25):');
items.slice(0, 25).forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.name.pt}] (${item.category} / ${item.subcategory})`);
  console.log(`   PT: ${item.description.pt}`);
});
