import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\phabr\\.gemini\\antigravity-ide\\brain\\08acac49-38b8-443d-b4cd-a2bdecb06d4c';

async function capture() {
  console.log('🚀 Iniciando Chrome via puppeteer-core para capturar screenshots da Fila de Espera...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Acessa app
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Se estiver na tela de seleção de unidade, seleciona Engenho Manauara
  const unitButton = await page.$('button');
  if (unitButton) {
    const text = await page.evaluate(el => el.textContent, unitButton);
    if (text.includes('Engenho Manauara') || text.includes('Manauara')) {
      await unitButton.click();
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Se estiver na tela de login, clica no operador Rogério (Donos) e clica em Entrar no Sistema
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const rogerioBtn = buttons.find(b => b.textContent && b.textContent.includes('Rogério'));
    if (rogerioBtn) rogerioBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const enterBtn = buttons.find(b => b.textContent && b.textContent.includes('Entrar no Sistema'));
    if (enterBtn) enterBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // 2. Navega para a aba 'Fila de Espera & Porta'
  await page.evaluate(() => {
    // Tenta clicar no botão da sidebar com 'Fila de Espera'
    const buttons = Array.from(document.querySelectorAll('button'));
    const filaBtn = buttons.find(b => b.textContent && b.textContent.includes('Fila de Espera'));
    if (filaBtn) filaBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 1: Visão Geral da Fila de Espera & Porta
  const shot1Path = path.join(ARTIFACTS_DIR, 'fila_espera_view.png');
  await page.screenshot({ path: shot1Path, fullPage: false });
  console.log('📸 Screenshot 1 salvo:', shot1Path);

  // 3. Clicar em "Liberar Mesa" ou "Chamar Fila" na Mesa 02 (2 pessoas) para disparar a Regra de Ouro
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    // Procura o botão Chamar Fila na Mesa 02
    const chamarBtns = buttons.filter(b => b.textContent && (b.textContent.includes('Chamar Fila') || b.textContent.includes('Liberar Mesa')));
    if (chamarBtns.length > 0) {
      chamarBtns[0].click();
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  // Confirmação no modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const confirmBtn = buttons.find(b => b.textContent && b.textContent.includes('Confirmar & Chamar'));
    if (confirmBtn) confirmBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 2: Alerta com Cronômetro Ativo de 2 Minutos
  const shot2Path = path.join(ARTIFACTS_DIR, 'fila_espera_timer_2min.png');
  await page.screenshot({ path: shot2Path, fullPage: false });
  console.log('📸 Screenshot 2 salvo:', shot2Path);

  // 4. Abrir Simulador de Celular do Cliente
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const phoneBtn = buttons.find(b => b.textContent && b.textContent.includes('Ver Celular do Cliente'));
    if (phoneBtn) phoneBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const shot3Path = path.join(ARTIFACTS_DIR, 'fila_espera_celular_preview.png');
  await page.screenshot({ path: shot3Path, fullPage: false });
  console.log('📸 Screenshot 3 salvo:', shot3Path);

  // Fechar simulador celular e abrir Modo TV / Telão
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const closeBtn = buttons.find(b => b.textContent && b.textContent.includes('Fechar Simulador'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tvBtn = buttons.find(b => b.textContent && b.textContent.includes('Modo Telão'));
    if (tvBtn) tvBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const shot4Path = path.join(ARTIFACTS_DIR, 'fila_espera_modo_tv.png');
  await page.screenshot({ path: shot4Path, fullPage: false });
  console.log('📸 Screenshot 4 salvo:', shot4Path);

  await browser.close();
  console.log('🎉 Todas as screenshots foram capturadas com sucesso!');
}

capture().catch(err => {
  console.error('❌ Erro ao capturar screenshots:', err);
  process.exit(1);
});
