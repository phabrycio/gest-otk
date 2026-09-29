import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('Iniciando navegador para inspecionar Dionisio...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const interceptedData = [];

  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json') || url.includes('/api/')) {
      try {
        const text = await response.text();
        interceptedData.push({ url, text });
      } catch (e) {}
    }
  });

  console.log('Navegando para o cardápio...');
  await page.goto('https://m.odionisio.com/cozinha-brasileira-manaura-shopping/cardapio-engenho-cozinha-brasileira-manauara-shopping/view', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 4000));

  console.log(`Interceptadas ${interceptedData.length} requisições JSON`);
  fs.writeFileSync('dionisio-network.json', JSON.stringify(interceptedData, null, 2));

  // Also extract DOM data
  const domData = await page.evaluate(() => {
    const results = [];
    // Try to find sections, categories, products
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, [class*="category"], [class*="section"]'));
    
    // Look for all product cards or items
    const cards = Array.from(document.querySelectorAll('[class*="item"], [class*="product"], [class*="card"], li'));
    
    return {
      bodyText: document.body.innerText,
      title: document.title,
      headings: headings.map(h => ({ tag: h.tagName, text: h.innerText.trim(), class: h.className })),
      cardCount: cards.length
    };
  });

  fs.writeFileSync('dionisio-dom.json', JSON.stringify(domData, null, 2));
  console.log('Dados salvos! Fechando navegador...');
  await browser.close();
}

main().catch(err => {
  console.error('Erro no scraper:', err);
  process.exit(1);
});
