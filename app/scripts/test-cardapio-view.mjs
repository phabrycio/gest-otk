import puppeteer from 'puppeteer-core';
import fs from 'fs';

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

  // 1. Click unit Engenho Manauara
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.innerText.includes('Engenho Manauara'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 2. Type username & password
  await page.evaluate(() => {
    const userInp = document.querySelector('input[type="text"]') || document.querySelector('input');
    const passInp = document.querySelector('input[type="password"]');
    if (userInp) {
      userInp.value = 'rogerio';
      userInp.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (passInp) {
      passInp.value = '123456';
      passInp.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const btns = Array.from(document.querySelectorAll('button'));
    const submit = btns.find(b => b.innerText.includes('Entrar'));
    if (submit) submit.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // 3. Click "Suprimentos" in the sidebar
  const clickedSidebar = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('button, a, nav button'));
    const supBtn = all.find(b => b.innerText && (b.innerText.includes('Suprimentos') || b.innerText.includes('Estoque')));
    if (supBtn) {
      supBtn.click();
      return supBtn.innerText;
    }
    return null;
  });
  console.log('Sidebar clicado:', clickedSidebar);
  await new Promise(r => setTimeout(r, 1200));

  // 4. Click "Fichas" or "Fichas & CMV"
  const clickedFichas = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('button'));
    const fichasBtn = all.find(b => b.innerText && (b.innerText.includes('Fichas') || b.innerText.includes('CMV')));
    if (fichasBtn) {
      fichasBtn.click();
      return fichasBtn.innerText;
    }
    return null;
  });
  console.log('Subview clicado:', clickedFichas);
  await new Promise(r => setTimeout(r, 2000));

  // 5. Expand a dish
  await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll('h3'));
    if (headers[0]) {
      headers[0].parentElement?.parentElement?.click();
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'cardapio_engenho_view.png', fullPage: false });
  console.log('Screenshot salva com sucesso em cardapio_engenho_view.png');

  const stats = await page.evaluate(() => {
    const dishes = Array.from(document.querySelectorAll('h3')).map(h => h.innerText);
    const imgs = Array.from(document.querySelectorAll('img[src*="firebasestorage"]')).map(i => i.src);
    const categoryBtns = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(t => t.includes('Pratos') || t.includes('Executivo') || t.includes('Pescados') || t.includes('Carnes'));
    return {
      totalDishesOnScreen: dishes.length,
      sampleDishes: dishes.slice(0, 10),
      imagesCount: imgs.length,
      sampleImages: imgs.slice(0, 3),
      categories: categoryBtns
    };
  });
  console.log('Estatísticas finais da tela:', JSON.stringify(stats, null, 2));

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
