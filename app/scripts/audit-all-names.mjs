import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));
const ptWords = [' De ', ' Do ', ' Da ', ' Dos ', ' Das ', ' Com ', ' Ao ', ' Na ', ' No ', ' Em ', ' Para ', ' E ', 'Isca', 'Crocante', 'Bolinho', 'Porção', 'Molho', 'Bife', 'Frango', 'Carne', 'Peixe', 'Queijo', 'Batata', 'Tradicional', 'Especial', 'Delicioso', 'Salada', 'Massa', 'Arroz', 'Feijão', 'Pastel', 'Pastéis', 'Costela', 'Costelinha'];

const badEn = [];

data.forEach(i => {
  const en = i.name.en;
  const hits = ptWords.filter(w => en.includes(w) && !en.startsWith('Tambaqui na Brasa') && !en.startsWith('Picanha na Brasa'));
  if (hits.length > 0) {
    badEn.push({
      id: i.id,
      pt: i.name.pt,
      en: i.name.en,
      hits
    });
  }
});

console.log('Total items with Portuguese words in English name:', badEn.length);
badEn.forEach(b => {
  console.log(`${b.id}: [PT: ${b.pt}] --> [EN: ${b.en}] (hits: ${b.hits.join(', ')})`);
});
