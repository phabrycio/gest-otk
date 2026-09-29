import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function inspectTeknisaResponses() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Capturar logs do console do navegador
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

  // Capturar requisições de rede e respostas
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('backend') || url.includes('login') || url.includes('auth')) {
      try {
        const status = res.status();
        const text = await res.text();
        console.log(`[NETWORK RESPONSE] ${status} ${url}`);
        console.log('Response body snippet:', text.slice(0, 500));
      } catch (e) {
        // stream pode já ter sido lido
      }
    }
  });

  console.log('Navigating to Teknisa login page...');
  await page.goto('https://retail.teknisa.com/login/#/login#authentication', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  await page.waitForSelector('#USER', { timeout: 15000 });
  await page.waitForSelector('#PASSWORD', { timeout: 15000 });

  const username = 'gestor.mns@engenhocorp.com';
  const password = '702007';

  await page.focus('#USER');
  await page.keyboard.type(username, { delay: 30 });

  await page.focus('#PASSWORD');
  await page.keyboard.type(password, { delay: 30 });

  // Procurar o botão exato "Enviar"
  console.log('Searching for "Enviar" button...');
  const buttons = await page.$$('button');
  let clicked = false;
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.innerText.trim(), btn);
    if (text.toLowerCase().includes('enviar') || text.toLowerCase().includes('entrar')) {
      console.log('Found button with text:', text);
      await btn.click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    console.log('Button not found, pressing Enter...');
    await page.keyboard.press('Enter');
  }

  console.log('Waiting 10 seconds to observe network and console...');
  await new Promise((r) => setTimeout(r, 10000));

  await browser.close();
}

inspectTeknisaResponses().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
