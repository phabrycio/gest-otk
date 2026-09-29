import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));
const counts = {};

data.forEach(i => {
  const d = i.description.en;
  if (!counts[d]) counts[d] = { count: 0, sample: [] };
  counts[d].count++;
  if (counts[d].sample.length < 3) counts[d].sample.push(`${i.id}: ${i.name.pt}`);
});

const repeated = Object.entries(counts)
  .filter(([desc, info]) => info.count > 1)
  .sort((a,b) => b[1].count - a[1].count);

console.log('Repeated description count:', repeated.length);
repeated.forEach(([desc, info]) => {
  console.log(`[x${info.count}] ${desc.slice(0, 80)}...`);
  console.log(`    Samples: ${info.sample.join(' | ')}`);
});
