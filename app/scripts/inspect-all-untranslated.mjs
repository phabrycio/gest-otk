import fs from 'fs';

const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));
const untranslated = items.filter(i => i.name.pt === i.name.en).map(i => ({ id: i.id, cat: i.category, sub: i.subcategory, name: i.name.pt }));

fs.writeFileSync('scripts/untranslated-titles.json', JSON.stringify(untranslated, null, 2));
console.log('Written', untranslated.length, 'untranslated items to scripts/untranslated-titles.json');
