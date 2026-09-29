import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\phabr\\.gemini\\antigravity-ide\\brain\\08acac49-38b8-443d-b4cd-a2bdecb06d4c';

async function run() {
  console.log('--- TESTANDO FLUXO COMPLETO DO CARDÁPIO DIGITAL DO CLIENTE ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 960 }
  });

  try {
    const page = await browser.newPage();

    // 1. Acessa via link direto do cliente (?menu=cliente)
    console.log('1. Acessando http://localhost:5173/?menu=cliente ...');
    await page.goto('http://localhost:5173/?menu=cliente', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));

    // Salva print do Onboarding Inicial (Passo 1: Idioma)
    const onboardingShotPath = path.join(ARTIFACT_DIR, 'customer_menu_step1_language.png');
    await page.screenshot({ path: onboardingShotPath });
    console.log('Screenshot do Onboarding (Passo 1: Escolha do Idioma) salvo em:', onboardingShotPath);

    // 2. Escolhe idioma: English (EN)
    console.log('2. Escolhendo idioma English (EN)...');
    const buttons = await page.$$('button');
    let englishClicked = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('English')) {
        await btn.click();
        englishClicked = true;
        console.log('Botão English clicado!');
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    // Passo 2 do Onboarding: Como escolher produtos (agora em inglês)
    console.log('3. Avançando Onboarding Passo 2 (Como Navegar e Escolher Produtos)...');
    const step2Shot = path.join(ARTIFACT_DIR, 'customer_menu_step2_products_en.png');
    await page.screenshot({ path: step2Shot });

    // Clica em "Continue"
    const nextBtns = await page.$$('button');
    for (const btn of nextBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Continue') || text.includes('Continuar'))) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    // Passo 3 do Onboarding: Meat Doneness & Preferences
    console.log('4. Avançando Onboarding Passo 3 (Pontos de Carne & Preferências)...');
    const nextBtns3 = await page.$$('button');
    for (const btn of nextBtns3) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Continue') || text.includes('Continuar'))) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    // Passo 4 do Onboarding: Finalizar comanda em Português
    console.log('5. Finalizando Onboarding (Comanda do Garçom)...');
    const finishBtns = await page.$$('button');
    for (const btn of finishBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Start Exploring') || text.includes('Começar'))) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));

    // 6. Verifica pratos renderizados em Inglês
    console.log('6. Validando catálogo em Inglês...');
    const menuTitle = await page.$eval('h2', el => el.textContent).catch(() => '');
    console.log('Título principal:', menuTitle);

    const dishTitles = await page.$$eval('h3', els => els.map(e => e.textContent?.trim()).filter(Boolean));
    console.log('Exemplos de pratos em inglês na tela:', dishTitles.slice(0, 6));

    const menuEnShotPath = path.join(ARTIFACT_DIR, 'customer_menu_english_view.png');
    await page.screenshot({ path: menuEnShotPath });
    console.log('Screenshot do Cardápio em Inglês salvo em:', menuEnShotPath);

    // 7. Clica na categoria de Carnes / Parrilla (Grill & Meats)
    console.log('7. Filtrando por Meats & Charcoal Grill...');
    const catBtns = await page.$$('button');
    for (const btn of catBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Grill') || text.includes('Carnes'))) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));

    // 8. Clica no prato de carne para abrir o modal de Ponto de Carne
    console.log('8. Selecionando Picanha ou Bife na Parrilla para customizar...');
    const dishCards = await page.$$('div[class*="group cursor-pointer"]');
    if (dishCards.length > 0) {
      await dishCards[0].click();
      await new Promise(r => setTimeout(r, 600));
    }

    // Modal de Ponto de Carne
    console.log('9. Selecionando Ponto da Carne (Medium) e observações...');
    const modalButtons = await page.$$('button');
    for (const btn of modalButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Medium') && !text.includes('Rare') && !text.includes('Well')) {
        await btn.click();
        console.log('Ponto "Medium" selecionado!');
        break;
      }
    }

    const noteTextarea = await page.$('textarea');
    if (noteTextarea) {
      await noteTextarea.type('Extra chimichurri sauce and cassava farofa please');
    }

    // Adiciona ao carrinho
    const addToCartModalBtns = await page.$$('button');
    for (const btn of addToCartModalBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Add to Cart') || text.includes('Adicionar'))) {
        await btn.click();
        console.log('Prato adicionado com sucesso ao carrinho!');
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));

    // 10. Abre o carrinho clicando no botão flutuante
    console.log('10. Abrindo o Carrinho...');
    const cartButton = await page.$('button[class*="fixed bottom-6"]');
    if (cartButton) {
      await cartButton.click();
      await new Promise(r => setTimeout(r, 600));
    }

    // 11. Preenche Nome do Cliente e Número da Mesa
    console.log('11. Inserindo dados do cliente e mesa...');
    const textInputs = await page.$$('input[type="text"]');
    for (const input of textInputs) {
      const ph = await page.evaluate(el => el.placeholder, input);
      if (ph && (ph.includes('name') || ph.includes('nome'))) {
        await input.type('Dr. Pierre Dupont');
      } else if (ph && (ph.includes('Table') || ph.includes('Mesa') || ph.includes('14'))) {
        await input.type('Mesa 07');
      }
    }
    await new Promise(r => setTimeout(r, 500));

    const cartShot = path.join(ARTIFACT_DIR, 'customer_cart_view.png');
    await page.screenshot({ path: cartShot });
    console.log('Screenshot do Carrinho salvo em:', cartShot);

    // 12. Finaliza o Pedido e Chama o Atendente
    console.log('12. Clicando em Finalize & Call Waiter...');
    const finalizeBtns = await page.$$('button');
    for (const btn of finalizeBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Finalize') || text.includes('Call Waiter') || text.includes('Finalizar'))) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1200));

    // 13. Obtém o texto gerado na Comanda do Atendente
    console.log('13. Verificando o Ticket / Comanda gerada em Português...');
    const ticketElement = await page.$('pre');
    let ticketContent = '';
    if (ticketElement) {
      ticketContent = await page.evaluate(el => el.textContent, ticketElement);
    } else {
      ticketContent = await page.$eval('body', el => el.textContent);
    }

    console.log('================================================================');
    console.log('CONTEÚDO DA COMANDA PARA O GARÇOM (100% EM PORTUGUÊS):');
    console.log(ticketContent);
    console.log('================================================================');

    const ticketShotPath = path.join(ARTIFACT_DIR, 'customer_order_waiter_ticket_pt.png');
    await page.screenshot({ path: ticketShotPath });
    console.log('Screenshot da Comanda do Garçom salvo em:', ticketShotPath);

    const isPortuguese = ticketContent.includes('COMANDA PARA LANÇAMENTO NO SISTEMA') &&
                         ticketContent.includes('ENGENHO COZINHA BRASILEIRA') &&
                         ticketContent.includes('Mesa:') &&
                         ticketContent.includes('Cliente:');

    console.log('Validação do Ticket em Português:', isPortuguese ? '✅ 100% VÁLIDO E APROVADO' : '❌ NÃO IDENTIFICADO');

  } catch (err) {
    console.error('Erro na execução:', err);
  } finally {
    await browser.close();
    console.log('--- TESTE FINALIZADO ---');
  }
}

run();
