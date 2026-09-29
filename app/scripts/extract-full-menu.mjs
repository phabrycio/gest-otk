import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function extractFullMenu() {
  console.log('Iniciando extração completa do cardápio Dionísio...');
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

  // Wait a bit for all images and items to render
  await new Promise(r => setTimeout(r, 4000));

  const result = await page.evaluate(() => {
    // Strategy: Dionisio uses sections or headings for categories
    // And each item card has title, description, price, and image
    
    // Let's find all images that have alt (which is the dish title in Dionisio!)
    // And map them to their parent container
    const allImages = Array.from(document.querySelectorAll('img[alt]'));
    const imgMap = new Map();
    for (const img of allImages) {
      const alt = img.getAttribute('alt') || '';
      if (alt && !alt.toLowerCase().includes('banner') && !alt.toLowerCase().includes('logo') && !alt.toLowerCase().includes('engenho cozinha')) {
        imgMap.set(alt.trim().toLowerCase(), img.src);
      }
    }

    // Now let's traverse the body or headings to build the hierarchical menu:
    // Section -> Subcategory -> Items
    const bodyLines = document.body.innerText.split('\n').map(l => l.trim()).filter(Boolean);
    
    // Let's find all elements that represent product cards
    // In Dionisio, each product card contains a price formatted like 'R$ 54,90'
    const priceElements = Array.from(document.querySelectorAll('*')).filter(el => {
      return el.children.length === 0 && /^R\$\s*[\d\.,]+$/.test((el.textContent || '').trim());
    });

    const parsedItems = [];
    const seenTitles = new Set();

    for (const pEl of priceElements) {
      const priceRaw = (pEl.textContent || '').trim();
      const numMatch = priceRaw.match(/R\$\s*([\d\.,]+)/);
      const price = numMatch ? parseFloat(numMatch[1].replace('.', '').replace(',', '.')) : 0;

      // Find the card container (go up until we find an element containing title, desc, price)
      let container = pEl.parentElement;
      for (let depth = 0; depth < 5; depth++) {
        if (!container || container === document.body) break;
        // check if this container has an image or heading
        if (container.querySelector('img') || container.children.length >= 2) {
          // Check if parent also contains siblings or if container is the item box
          const text = container.innerText.trim();
          const pMatches = text.match(/R\$\s*[\d\.,]+/g) || [];
          if (pMatches.length === 1) {
            // Exactly one price in this container -> perfect item container!
            break;
          }
        }
        container = container.parentElement;
      }

      if (!container) continue;

      // Extract lines inside this container
      const containerLines = container.innerText.split('\n').map(l => l.trim()).filter(Boolean);
      // Filter out the price line itself
      const nonPriceLines = containerLines.filter(l => !/^R\$\s*[\d\.,]+$/.test(l));

      let title = '';
      let description = '';

      if (nonPriceLines.length === 1) {
        title = nonPriceLines[0];
      } else if (nonPriceLines.length >= 2) {
        title = nonPriceLines[0];
        description = nonPriceLines.slice(1).join(' - ');
      }

      // If title is uppercase header or section name, try adjusting
      if (!title || title.length > 80 && nonPriceLines.length > 1) {
        title = nonPriceLines[0].slice(0, 60);
      }

      // Check image in container
      const imgInContainer = container.querySelector('img');
      let imageUrl = imgInContainer ? imgInContainer.src : null;
      if (!imageUrl && imgMap.has(title.toLowerCase())) {
        imageUrl = imgMap.get(title.toLowerCase());
      }

      // Check if this container is inside a category section
      // Let's climb up to find preceding headings
      let category = 'Geral';
      let subcategory = '';

      let prev = container.previousElementSibling || container.parentElement?.previousElementSibling;
      let steps = 0;
      while (prev && steps < 15) {
        const text = prev.innerText ? prev.innerText.trim() : '';
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
          if (line === line.toUpperCase() && line.length > 2 && line.length < 50 && !line.includes('R$') && !line.includes('FECHAR') && !line.includes('CARRINHO')) {
            subcategory = line;
            break;
          }
        }
        if (subcategory) break;
        prev = prev.previousElementSibling;
        steps++;
      }

      const key = `${title}__${priceRaw}`;
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        parsedItems.push({
          title,
          description,
          price,
          priceRaw,
          imageUrl,
          subcategory,
          containerLines
        });
      }
    }

    return {
      totalFound: parsedItems.length,
      items: parsedItems,
      imgMapSize: imgMap.size
    };
  });

  console.log(`Extração finalizada: ${result.totalFound} itens encontrados! (Imagens mapeadas: ${result.imgMapSize})`);
  fs.writeFileSync('dionisio-full-extracted.json', JSON.stringify(result, null, 2));

  await browser.close();
}

extractFullMenu().catch(err => {
  console.error('Erro na extração completa:', err);
  process.exit(1);
});
