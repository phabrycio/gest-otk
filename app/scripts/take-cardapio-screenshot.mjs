import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

  // 1. Select unit
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Engenho Manauara'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 2. Click Rogério
  await page.evaluate(() => {
    const rogerioBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Rogério'));
    if (rogerioBtn) rogerioBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // 3. Click 'Estoque & CDA'
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
    const estoqueBtn = all.find(b => b.innerText.includes('Estoque & CDA'));
    if (estoqueBtn) estoqueBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // 4. Click 'Fichas'
  const clicked = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('button'));
    const fichasBtn = all.find(b => b.innerText.includes('Fichas') || b.innerText.includes('CMV'));
    if (fichasBtn) {
      fichasBtn.click();
      return fichasBtn.innerText;
    }
    return null;
  });
  console.log('Sub-tab clicada:', clicked);
  await new Promise(r => setTimeout(r, 2000));

  const screenshotPath = 'C:\\Users\\phabr\\.gemini\\antigravity-ide\\brain\\08acac49-38b8-443d-b4cd-a2bdecb06d4c\\cardapio_engenho_view.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Screenshot salva com sucesso em:', screenshotPath);

  const stats = await page.evaluate(() => {
    const h3List = Array.from(document.querySelectorAll('h3')).map(h => h.innerText);
    const categoryBtns = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(t => t.includes('Pratos') || t.includes('Executivo') || t.includes('Pescados') || t.includes('Carnes'));
    const imgList = Array.from(document.querySelectorAll('img[src*="firebasestorage"]')).map(i => i.src);
    return {
      totalDishesVisible: h3List.length,
      sampleDishes: h3List.slice(0, 10),
      categories: categoryBtns,
      photosCount: imgList.length
    };
  });
  console.log('Stats:', JSON.stringify(stats, null, 2));

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
