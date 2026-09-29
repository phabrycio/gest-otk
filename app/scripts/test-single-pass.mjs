const DICT_EN = {
  'filé de pirarucu grelhado': 'charcoal-grilled Amazonian pirarucu fillet',
  'filé de pirarucu': 'Amazonian pirarucu fillet',
  'pirarucu de manejo': 'sustainable Amazonian pirarucu',
  'pirarucu': 'wild Amazonian pirarucu',
  'tambaqui de cativeiro': 'farm-raised Amazonian tambaqui',
  'costela de tambaqui': 'Amazonian tambaqui ribs',
  'tambaqui': 'Amazonian tambaqui',
  'legumes selecionados também grelhados': 'flame-grilled garden vegetables',
  'legumes selecionados': 'select farm-fresh vegetables',
  'legumes grelhados': 'grilled seasonal vegetables',
  'legumes': 'seasonal vegetables',
  'azeite e ervas': 'extra virgin olive oil and fresh herbs',
  'acompanhado de': 'served with',
  'acompanhada de': 'served with',
  'acompanhados de': 'served with',
  'finalizado com': 'finished with',
  'finalizada com': 'finished with',
  'e finalizado com': 'and finished with',
  'e finalizada com': 'and finished with'
};

function createTranslator(dict) {
  // Sort keys by descending length so longest match wins
  const keys = Object.keys(dict).sort((a, b) => b.length - a.length);
  const escaped = keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'gi');

  return function translate(text) {
    return text.replace(regex, (matched) => {
      const lower = matched.toLowerCase();
      return dict[lower] || matched;
    });
  };
}

const translateEN = createTranslator(DICT_EN);
const test = 'Filé de pirarucu grelhado, acompanhado de legumes selecionados também grelhados, e finalizado com azeite e ervas.';
console.log('Result:', translateEN(test));
