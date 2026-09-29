import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function parseMenuHierarchical() {
  console.log('Iniciando parsing estruturado e hierárquico...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  await page.goto('https://m.odionisio.com/cozinha-brasileira-manaura-shopping/cardapio-engenho-cozinha-brasileira-manauara-shopping/view', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 4000));

  const data = await page.evaluate(() => {
    // 1. Build image map by alt text
    const imgMap = new Map();
    const allImages = Array.from(document.querySelectorAll('img'));
    for (const img of allImages) {
      const alt = (img.getAttribute('alt') || '').trim();
      if (alt && !alt.toLowerCase().includes('banner') && !alt.toLowerCase().includes('logo') && !alt.toLowerCase().includes('engenho cozinha')) {
        imgMap.set(alt.toLowerCase(), img.src);
      }
    }

    // 2. Iterate through all bands and sections in order of appearance
    const results = [];
    let currentBand = 'Menu Principal';

    // Find all elements that are either category-band or subcategory-section
    const elements = Array.from(document.querySelectorAll('.category-band-name, .subcategory-section'));

    for (const el of elements) {
      if (el.classList.contains('category-band-name')) {
        currentBand = el.innerText.trim();
        continue;
      }

      if (el.classList.contains('subcategory-section')) {
        const titleEl = el.querySelector('.subcategory-title');
        const subcategoryTitle = titleEl ? titleEl.innerText.trim() : 'Geral';

        // Now find all items inside this subcategory-section
        // Let's find all elements that have price pattern R$ XX,XX
        const allInSec = Array.from(el.querySelectorAll('*'));
        const priceEls = allInSec.filter(child => {
          return child.children.length === 0 && /^R\$\s*[\d\.,]+$/.test((child.textContent || '').trim());
        });

        for (const pEl of priceEls) {
          const priceRaw = (pEl.textContent || '').trim();
          const match = priceRaw.match(/R\$\s*([\d\.,]+)/);
          const price = match ? parseFloat(match[1].replace(/\./g, '').replace(',', '.')) : 0;

          // Find container
          let container = pEl.parentElement;
          for (let d = 0; d < 5; d++) {
            if (!container || container === el) break;
            const text = container.innerText.trim();
            const pCount = (text.match(/R\$\s*[\d\.,]+/g) || []).length;
            if (pCount === 1) break;
            container = container.parentElement;
          }

          if (!container) continue;

          const lines = container.innerText.split('\n').map(l => l.trim()).filter(Boolean);
          const nonPrice = lines.filter(l => !/^R\$\s*[\d\.,]+$/.test(l));

          let title = nonPrice[0] || '';
          let description = nonPrice.slice(1).join(' ');

          // In some cards, description might contain "Calorias: ... Valor proteico: ..."
          let calories = null;
          let protein = null;
          let fiber = null;

          const calMatch = description.match(/Calorias:\s*(\d+k?cal)/i);
          if (calMatch) calories = calMatch[1];
          const protMatch = description.match(/Valor\s*prote[ií]co:\s*([\d,\.]+g)/i);
          if (protMatch) protein = protMatch[1];
          const fibMatch = description.match(/Fibras?:\s*([\d,\.]+g)/i);
          if (fibMatch) fiber = fibMatch[1];

          // Check if there is an image in the container or by name
          let img = container.querySelector('img');
          let imageUrl = img ? img.src : null;
          if (!imageUrl && imgMap.has(title.toLowerCase())) {
            imageUrl = imgMap.get(title.toLowerCase());
          }

          results.push({
            majorCategory: currentBand,
            subcategory: subcategoryTitle,
            title,
            description,
            price,
            priceRaw,
            imageUrl,
            nutrition: (calories || protein || fiber) ? { calories, protein, fiber } : null
          });
        }
      }
    }

    return {
      total: results.length,
      items: results
    };
  });

  console.log(`Extração finalizada com ${data.total} itens mapeados hierarquicamente!`);
  fs.writeFileSync('dionisio-hierarchical.json', JSON.stringify(data, null, 2));

  await browser.close();
}

parseMenuHierarchical().catch(err => {
  console.error(err);
  process.exit(1);
});
