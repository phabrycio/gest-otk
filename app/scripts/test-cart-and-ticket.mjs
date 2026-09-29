import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\phabr\\.gemini\\antigravity-ide\\brain\\08acac49-38b8-443d-b4cd-a2bdecb06d4c';

async function run() {
  console.log('=== TESTE FINAL DE DIGITAÇÃO DE MESA/NOME E COMANDA EM PORTUGUÊS ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 }
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/?menu=cliente', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Passo 0: Escolhe idioma English (🇺🇸)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const en = btns.find(b => b.textContent && b.textContent.includes('English'));
      if (en) en.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Passo 1: Next
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent && b.textContent.trim().toLowerCase() === 'next');
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Passo 2: Next
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent && b.textContent.trim().toLowerCase() === 'next');
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Passo 3: Start Exploring
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.textContent && b.textContent.includes('Start Exploring'));
      if (startBtn) startBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Filtra por Meats & Charcoal Grill
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const meatsBtn = btns.find(b => b.textContent && (b.textContent.includes('Meats') || b.textContent.includes('Grill')));
      if (meatsBtn) meatsBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Clica em Add to Order
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent && b.textContent.includes('Add to Order'));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Seleciona ponto: Rare (Mal Passado) para testar ponto diferente
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const rareBtn = btns.find(b => b.textContent && b.textContent.includes('Rare') && !b.textContent.includes('Medium'));
      if (rareBtn) rareBtn.click();
    });

    // Observação
    const noteArea = await page.$('textarea');
    if (noteArea) {
      await noteArea.type('Extra chimichurri sauce, please');
    }

    // Adiciona ao carrinho
    await page.evaluate(() => {
      const modal = document.querySelector('div[class*="fixed inset-0"]');
      if (modal) {
        const btns = Array.from(modal.querySelectorAll('button'));
        const confirmBtn = btns.find(b => b.textContent && b.textContent.includes('• R$'));
        if (confirmBtn) confirmBtn.click();
      }
    });
    await new Promise(r => setTimeout(r, 800));

    // Abre o carrinho
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cartBtn = btns.find(b => b.textContent && (b.textContent.includes('Cart') || b.textContent.includes('Your Order')));
      if (cartBtn) cartBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Digita com page.type nos campos do carrinho
    const inputs = await page.$$('div[class*="border-l"] input[type="text"]');
    if (inputs.length >= 2) {
      await inputs[0].type('Dr. Pierre Laurent');
      await inputs[1].type('Mesa 09');
    }
    await new Promise(r => setTimeout(r, 500));

    // Salva print final do carrinho
    const cartShot = path.join(ARTIFACT_DIR, 'customer_cart_preview.png');
    await page.screenshot({ path: cartShot });

    // Finaliza pedido
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const finalizeBtn = btns.find(b => b.textContent && (b.textContent.includes('Finalize') || b.textContent.includes('Call Waiter')));
      if (finalizeBtn) finalizeBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    // Salva print final da comanda
    const ticketShot = path.join(ARTIFACT_DIR, 'customer_waiter_ticket_preview.png');
    await page.screenshot({ path: ticketShot });

    const ticketText = await page.evaluate(() => {
      const modal = document.querySelector('div[class*="border-slate-200 font-mono"]');
      return modal ? modal.innerText : document.body.innerText;
    });

    console.log('====================================================');
    console.log('COMANDA FINAL GERADA PARA O ATENDENTE:');
    console.log(ticketText);
    console.log('====================================================');

    const passed = ticketText.includes('MESA: Mesa 09') &&
                   ticketText.includes('CLIENTE: Dr. Pierre Laurent') &&
                   ticketText.includes('➔ PONTO DA CARNE: MAL PASSADO') &&
                   ticketText.includes('➔ OBS: Extra chimichurri sauce, please') &&
                   ticketText.includes('TOTAL A LANÇAR:');

    console.log('RESULTADO FINAL:', passed ? '✅ SUCESSO ABSOLUTO (100% CONFORME SOLICITADO)' : '❌ Verifique');

  } catch (err) {
    console.error('Erro:', err);
  } finally {
    await browser.close();
  }
}

run();
