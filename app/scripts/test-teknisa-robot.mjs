import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testTeknisaLogin() {
  console.log('Using browser executable:', EDGE_PATH);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Navigating to Teknisa login page...');
  await page.goto('https://retail.teknisa.com/login/#/login#authentication', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  console.log('Page loaded! Title:', await page.title());

  // Aguardar os inputs de id USER e PASSWORD
  await page.waitForSelector('#USER', { timeout: 15000 });
  await page.waitForSelector('#PASSWORD', { timeout: 15000 });

  const username = 'gestor.mns@engenhocorp.com';
  const password = '702007';

  // Preencher usuário
  await page.focus('#USER');
  await page.keyboard.type(username, { delay: 30 });
  console.log('Typed username into #USER!');

  // Preencher senha
  await page.focus('#PASSWORD');
  await page.keyboard.type(password, { delay: 30 });
  console.log('Typed password into #PASSWORD!');

  // Tirar print antes de enviar
  const artifactDir = 'C:\\Users\\phabr\\.gemini\\antigravity-ide\\brain\\08acac49-38b8-443d-b4cd-a2bdecb06d4c';
  await page.screenshot({ path: path.join(artifactDir, 'teknisa_pre_login.png') });
  console.log('Saved screenshot teknisa_pre_login.png');

  // Enviar formulário pressionando Enter no campo de senha ou clicando no botão de login
  console.log('Pressing Enter on password field to submit...');
  await page.keyboard.press('Enter');

  // Aguardar 12 segundos para a autenticação e carregamento dos módulos
  console.log('Waiting 12 seconds for login response...');
  await new Promise((r) => setTimeout(r, 12000));

  console.log('Current URL after login attempt:', page.url());
  console.log('Current Page Title:', await page.title());

  await page.screenshot({ path: path.join(artifactDir, 'teknisa_post_login.png') });
  console.log('Saved screenshot teknisa_post_login.png');

  // Coletar textos da tela
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 2000));
  console.log('--- Page text after login attempt ---:');
  console.log(bodyText);

  // Inspecionar menus ou links visíveis
  const linksAndMenus = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('a, button, li, .zh-menu-item, .menu-item, span'));
    return elements
      .map((el) => el.innerText.trim())
      .filter((txt) => txt.length > 2 && txt.length < 50 && !txt.includes('\n'))
      .slice(0, 40);
  });
  console.log('--- Discovered navigation elements ---:');
  console.log(linksAndMenus);

  await browser.close();
}

testTeknisaLogin().catch((err) => {
  console.error('Error during Teknisa login test:', err);
  process.exit(1);
});
