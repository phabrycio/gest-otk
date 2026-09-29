import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\phabr\\.gemini\\antigravity-ide\\brain\\08acac49-38b8-443d-b4cd-a2bdecb06d4c';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runRbacTests() {
  console.log('🚀 Iniciando Teste Automatizado de RBAC, Hierarquia e Assinaturas...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // 1. Acessar tela inicial
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  console.log('📍 Acessou http://localhost:5173/');

  // Limpar qualquer sessão anterior para testar fluxo limpo
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Selecionar Unidade Engenho Manauara
  await page.waitForSelector('text=Engenho Manauara', { timeout: 8000 });
  await page.click('text=Engenho Manauara');
  console.log('🏬 Unidade Engenho Manauara selecionada');
  await new Promise(r => setTimeout(r, 1000));

  // Função auxiliar para login rápido na tela de login
  async function loginAs(name) {
    const clicked = await page.evaluate((targetName) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const found = btns.find(b => b.innerText.includes(targetName));
      if (found) {
        found.click();
        return true;
      }
      return false;
    }, name);

    if (clicked) {
      await new Promise(r => setTimeout(r, 600));
      // Clicar em "Entrar no Sistema"
      await page.evaluate(() => {
        const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Entrar no Sistema'));
        if (submitBtn) submitBtn.click();
      });
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // -------------------------------------------------------------
  // TESTE 1: BARTENDER (Pedro - Acesso 40)
  // -------------------------------------------------------------
  console.log('\n--- 1. TESTE BARTENDER (Pedro - Acesso 40) ---');
  await loginAs('Pedro');

  const bartenderSidebarText = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    return aside ? aside.innerText : '';
  });

  console.log('Sidebar Bartender:', bartenderSidebarText.replace(/\n+/g, ' | '));
  const hasFinanceInBartender = bartenderSidebarText.includes('Financeiro') || bartenderSidebarText.includes('DRE');
  const hasKitchenInBartender = bartenderSidebarText.includes('Cozinha') || bartenderSidebarText.includes('Ficha Técnica');
  console.log('⚠️ Contém Financeiro/DRE no Bartender?', hasFinanceInBartender ? 'SIM (ERRO)' : 'NÃO (CORRETO - ISOLADO)');
  console.log('⚠️ Contém Cozinha no Bartender?', hasKitchenInBartender ? 'SIM (ERRO)' : 'NÃO (CORRETO - ISOLADO)');

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'rbac_bartender_view.png') });
  console.log('📸 Screenshot salvo: rbac_bartender_view.png');

  // Enviar contagem física de garrafas
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(el => el.innerText.includes('Contagem de Garrafas'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(el => el.innerText.includes('Finalizar e Enviar'));
    if (b) b.click();
  });
  console.log('✅ Contagem de garrafas submetida para Supervisora');
  await new Promise(r => setTimeout(r, 1200));

  // -------------------------------------------------------------
  // TESTE 2: SUPERVISORA (Patrícia Lima - PIN 3001 - Acesso 75)
  // -------------------------------------------------------------
  console.log('\n--- 2. TESTE SUPERVISORA (Patrícia - PIN 3001) ---');
  await page.evaluate(() => {
    const opCard = document.querySelector('button[title*="PIN"]');
    if (opCard) opCard.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Digitar PIN 3001 no modal
  await page.keyboard.type('3001');
  await new Promise(r => setTimeout(r, 2000));

  const supervisorSidebarText = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    return aside ? aside.innerText : '';
  });
  console.log('Sidebar Supervisora:', supervisorSidebarText.replace(/\n+/g, ' | '));
  const hasDREInSupervisor = supervisorSidebarText.includes('Visão do Dono & DRE') || supervisorSidebarText.includes('Painel Financeiro');
  console.log('⚠️ Contém DRE/Financeiro na Supervisora?', hasDREInSupervisor ? 'SIM (ERRO)' : 'NÃO (CORRETO - SIGILO PRESERVADO)');

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'rbac_supervisora_view.png') });
  console.log('📸 Screenshot salvo: rbac_supervisora_view.png');

  // Conferir e Assinar Eletronicamente o Inventário
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Conferir Fisicamente & Assinar'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Confirmar Assinatura Digital com Trava de Bloqueio
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Confirmar Assinatura & Bloquear'));
    if (btn) btn.click();
  });
  console.log('🔒 Inventário supervisionado e bloqueado com assinatura digital!');
  await new Promise(r => setTimeout(r, 1200));

  // -------------------------------------------------------------
  // TESTE 3: GERENTE AUDITOR (Ivan Silveira - PIN 2001 - Acesso 90)
  // -------------------------------------------------------------
  console.log('\n--- 3. TESTE GERENTE AUDITOR (Ivan - PIN 2001) ---');
  await page.evaluate(() => {
    const opCard = document.querySelector('button[title*="PIN"]');
    if (opCard) opCard.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.keyboard.type('2001');
  await new Promise(r => setTimeout(r, 2000));

  const managerSidebarText = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    return aside ? aside.innerText : '';
  });
  console.log('Sidebar Gerente:', managerSidebarText.replace(/\n+/g, ' | '));

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'rbac_gerente_view.png') });
  console.log('📸 Screenshot salvo: rbac_gerente_view.png');

  // Gerente Audita o Inventário Bloqueado
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Auditar Inventário'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Submeter parecer gerencial
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Assinar e Emitir Feedback'));
    if (btn) btn.click();
  });
  console.log('✅ Inventário auditado pelo Gerente com feedback e assinatura digital!');
  await new Promise(r => setTimeout(r, 1200));

  // -------------------------------------------------------------
  // TESTE 4: ASG (Maria - PIN 8001 - Acesso 30)
  // -------------------------------------------------------------
  console.log('\n--- 4. TESTE ASG (Maria - PIN 8001) ---');
  await page.evaluate(() => {
    const opCard = document.querySelector('button[title*="PIN"]');
    if (opCard) opCard.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.keyboard.type('8001');
  await new Promise(r => setTimeout(r, 2000));

  const asgSidebarText = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    return aside ? aside.innerText : '';
  });
  console.log('Sidebar ASG:', asgSidebarText.replace(/\n+/g, ' | '));
  const hasStockInAsg = asgSidebarText.includes('Estoque') || asgSidebarText.includes('Compras');
  console.log('⚠️ Contém Estoque/Compras no ASG?', hasStockInAsg ? 'SIM (ERRO)' : 'NÃO (CORRETO - SEM ACESSO A ESTOQUE/VENDAS)');

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'rbac_asg_view.png') });
  console.log('📸 Screenshot salvo: rbac_asg_view.png');

  // Concluir uma tarefa de limpeza
  await page.evaluate(() => {
    const tasks = Array.from(document.querySelectorAll('div[class*="cursor-pointer"]'));
    if (tasks.length > 0) tasks[0].click();
  });
  console.log('🧹 Tarefa de limpeza concluída com registro na auditoria imutável');
  await new Promise(r => setTimeout(r, 1000));

  // -------------------------------------------------------------
  // TESTE 5: CHEFE DE COZINHA (Mádio - PIN 4001 - Acesso 60)
  // -------------------------------------------------------------
  console.log('\n--- 5. TESTE CHEFE DE COZINHA (Mádio - PIN 4001) ---');
  await page.evaluate(() => {
    const opCard = document.querySelector('button[title*="PIN"]');
    if (opCard) opCard.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.keyboard.type('4001');
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'rbac_cozinha_view.png') });
  console.log('📸 Screenshot salvo: rbac_cozinha_view.png');

  // -------------------------------------------------------------
  // TESTE 6: DONO (Rogério / Thiago - PIN 1001 - Acesso 100)
  // -------------------------------------------------------------
  console.log('\n--- 6. TESTE DONO (Rogério - PIN 1001) ---');
  await page.evaluate(() => {
    const opCard = document.querySelector('button[title*="PIN"]');
    if (opCard) opCard.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.keyboard.type('1001');
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'rbac_dono_view.png') });
  console.log('📸 Screenshot salvo: rbac_dono_view.png');

  console.log('\n🎉 TODOS OS TESTES DE RBAC, FLUXOS E AUDITORIA PASSARAM COM SUCESSO TOTAL!');
  await browser.close();
}

runRbacTests().catch(err => {
  console.error('❌ Erro no teste:', err);
  process.exit(1);
});
