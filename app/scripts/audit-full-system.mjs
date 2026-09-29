import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\phabr\\.gemini\\antigravity-ide\\brain\\08acac49-38b8-443d-b4cd-a2bdecb06d4c';
const PORT = 5199;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('1. Iniciando servidor vite preview na porta', PORT);
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    cwd: 'd:\\Gestão Engenho\\app',
  });

  server.stdout.on('data', (d) => console.log('[Vite Preview]', d.toString().trim()));
  server.stderr.on('data', (d) => console.error('[Vite Preview Err]', d.toString().trim()));

  // Espera o servidor subir
  await sleep(3000);

  console.log('2. Conectando Puppeteer ao Chrome:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const baseUrl = `http://localhost:${PORT}`;
    console.log('Navegando para', baseUrl);
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    await sleep(2000);

    // 1. Tela Inicial / Seleção de Unidade ou Login
    console.log('Verificando tela inicial...');
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Texto inicial:', bodyText.slice(0, 150));

    // Se estiver na tela de seleção de restaurante, clica no primeiro
    const unitButton = await page.$('button');
    if (unitButton) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const unitBtn = btns.find((b) => b.innerText.includes('Engenho') || b.innerText.includes('Entrar') || b.innerText.includes('Manauara'));
        if (unitBtn) unitBtn.click();
      });
      await sleep(1000);
    }

    // Se houver tela de login com PIN, clica no login rápido do Proprietário ou Pabricio
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const loginBtn = btns.find((b) => b.innerText.includes('Proprietário') || b.innerText.includes('Pabricio') || b.innerText.includes('Gerente') || b.innerText.includes('Acessar'));
      if (loginBtn) loginBtn.click();
    });
    await sleep(2000);

    // Limpa chave antiga vazia se existir no navegador para garantir cálculo limpo
    await page.evaluate(() => {
      localStorage.removeItem('tk_cash_sessions_v1');
    });

    // Auditoria de cada tela:
    const screens = [
      { id: 'gestao', name: '01_visao_dono_dre', label: 'Visão do Dono & DRE' },
      { id: 'inteligencia_vendas', name: '02_inteligencia_vendas', label: 'Inteligência de Vendas' },
      { id: 'financeiro', name: '03_painel_financeiro', label: 'Painel Financeiro' },
      { id: 'suprimentos', name: '04_estoque_teorico_cda', label: 'Estoque & Hub CDA' },
      { id: 'bar', name: '05_bar_chopp_destilados', label: 'Bar & Chopp' },
      { id: 'operacao', name: '06_salao_mesas', label: 'Salão & Mesas' },
      { id: 'cozinha_dashboard', name: '07_cozinha_kds', label: 'Ambiente da Cozinha' },
      { id: 'gerente_auditoria', name: '08_gerente_auditoria', label: 'Auditoria do Gerente' },
    ];

    for (const scr of screens) {
      console.log(`Auditorando tela: ${scr.label} (${scr.id})`);
      // Clica no botão da sidebar
      await page.evaluate((targetId) => {
        const btns = Array.from(document.querySelectorAll('button, a'));
        // Procura por data-tab ou pelo texto
        const sidebarBtn = btns.find((b) => b.getAttribute('data-tab') === targetId || b.innerText.includes(targetId));
        if (sidebarBtn) {
          sidebarBtn.click();
          return;
        }
        // Fallback: procura por texto de menu
        const labelMap = {
          gestao: 'Visão do Dono',
          inteligencia_vendas: 'Inteligência de Vendas',
          financeiro: 'Painel Financeiro',
          suprimentos: 'Estoque & CDA',
          bar: 'Bar & Chopeiras',
          operacao: 'Salão & Mesas',
          cozinha_dashboard: 'Painel da Cozinha',
          gerente_auditoria: 'Auditoria do Gerente',
        };
        const textTarget = labelMap[targetId];
        if (textTarget) {
          const match = btns.find((b) => b.innerText.includes(textTarget));
          if (match) match.click();
        }
      }, scr.id);

      await sleep(1500);

      // Se for suprimentos, clica na sub-aba ESTOQUE TEÓRICO para mostrar a tabela de estoque virtual
      if (scr.id === 'suprimentos') {
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const virtualBtn = btns.find((b) => b.innerText.includes('Estoque Teórico'));
          if (virtualBtn) virtualBtn.click();
        });
        await sleep(1000);
      }

      // Se for gerente_auditoria, clica na sub-aba INDICADORES
      if (scr.id === 'gerente_auditoria') {
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const indBtn = btns.find((b) => b.innerText.includes('Indicadores'));
          if (indBtn) indBtn.click();
        });
        await sleep(1000);
      }

      // Tira screenshot em alta resolução
      const shotPath = path.join(ARTIFACT_DIR, `audit_${scr.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`Screenshot salva em: ${shotPath}`);
    }

    // Agora testa a Carga / Importação no modal Teknisa para verificar responsividade imediata:
    console.log('Testando modal de importação Teknisa...');
    await page.evaluate(() => {
      const topBtns = Array.from(document.querySelectorAll('button'));
      const teknisaBtn = topBtns.find((b) => b.innerText.includes('Teknisa') || b.getAttribute('title')?.includes('Teknisa'));
      if (teknisaBtn) teknisaBtn.click();
    });
    await sleep(1500);

    // Tira print do modal aberto
    const modalShotPath = path.join(ARTIFACT_DIR, 'audit_09_teknisa_modal_aberto.png');
    await page.screenshot({ path: modalShotPath });
    console.log('Screenshot modal Teknisa salva em:', modalShotPath);

    // Clica em "Carga Manual de Planilhas"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const manualTab = btns.find((b) => b.innerText.includes('Carga Manual'));
      if (manualTab) manualTab.click();
    });
    await sleep(1000);

    // Clica em "Processar & Atualizar Base"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const processBtn = btns.find((b) => b.innerText.includes('Processar & Atualizar'));
      if (processBtn) processBtn.click();
    });
    await sleep(2500);

    // Print da tela após atualização do modal
    const afterUpdateShot = path.join(ARTIFACT_DIR, 'audit_10_apos_carga_central.png');
    await page.screenshot({ path: afterUpdateShot });
    console.log('Screenshot pós-carga salva em:', afterUpdateShot);

    console.log('AUDITORIA DE TELAS CONCLUÍDA COM SUCESSO TOTAL!');
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error('Erro na auditoria:', err);
  process.exit(1);
});
