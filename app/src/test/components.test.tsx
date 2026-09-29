import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '../App';

/**
 * Helper: faz login completo pelo novo fluxo multi-unidade
 * 1. Seleciona unidade "Engenho Manauara"
 * 2. Clica no operador "Phabrycio" para quick-login
 */
async function loginAsAdmin() {
  // Clica na unidade Engenho Manauara
  const unitButton = screen.getByRole('button', { name: /Engenho Manauara/i });
  fireEvent.click(unitButton);

  // Aguarda tela de login e clica no Rogério (Proprietário)
  await waitFor(() => {
    expect(screen.getByText(/Usuário de Acesso/i)).toBeTruthy();
  });

  const rogerioBtn = screen.getByRole('button', { name: /Rogério/i });
  fireEvent.click(rogerioBtn);

  // Aguarda dashboard carregar
  await waitFor(() => {
    expect(screen.getByText(/Visão de Dono & DRE/i)).toBeTruthy();
  });
}

describe('End-to-End Component & Feature Navigation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpa sessão para garantir que começa na seleção de unidade
    localStorage.clear();
  });

  const getNavTab = (labelRegex: RegExp) => {
    const nav = screen.getByRole('navigation');
    return within(nav).getByRole('button', { name: labelRegex });
  };

  it('renders the unit selection screen with Engenho Manauara', () => {
    render(<App />);

    // Deve mostrar a tela de seleção de unidade
    expect(screen.getByText(/Selecione a Unidade/i)).toBeTruthy();
    expect(screen.getAllByText(/Tk Gestão e Tecnologia/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Engenho Manauara/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Manauara Shopping/i)).toBeTruthy();
  });

  it('navigates from unit selection to login screen', async () => {
    render(<App />);

    const unitButton = screen.getByRole('button', { name: /Engenho Manauara/i });
    fireEvent.click(unitButton);

    // Deve ir para a tela de login
    await waitFor(() => {
      expect(screen.getByText(/Usuário de Acesso/i)).toBeTruthy();
    });

    // Verifica que a unidade está exibida no header do login
    expect(screen.getAllByText(/Engenho Manauara/i).length).toBeGreaterThanOrEqual(1);

    // Verifica que lista os operadores oficiais da unidade
    expect(screen.getAllByText(/Rogério/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Sidney/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Ivan/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Pabricio/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Patricia/i).length).toBeGreaterThanOrEqual(1);
  });

  it('can go back from login to unit selection', async () => {
    render(<App />);

    const unitButton = screen.getByRole('button', { name: /Engenho Manauara/i });
    fireEvent.click(unitButton);

    await waitFor(() => {
      expect(screen.getByText(/Usuário de Acesso/i)).toBeTruthy();
    });

    // Clica no botão de voltar
    const backButton = screen.getByRole('button', { name: /Trocar Unidade/i });
    fireEvent.click(backButton);

    // Deve voltar para seleção de unidade
    await waitFor(() => {
      expect(screen.getByText(/Selecione a Unidade/i)).toBeTruthy();
    });
  });

  it('authenticates via quick-login and shows dashboard', async () => {
    render(<App />);
    await loginAsAdmin();

    // Header elements
    expect(screen.getAllByText(/Tk Gestão/i).length).toBeGreaterThanOrEqual(1);

    // Default tab should be Gestão
    expect(screen.getByText(/Visão de Dono & DRE/i)).toBeTruthy();
    expect(screen.getByText(/Metas & Bônus/i)).toBeTruthy();
  });

  it('toggles shift between Almoço and Jantar via header button', async () => {
    render(<App />);
    await loginAsAdmin();

    const shiftButton = screen.getByTitle(/Alternar entre Turno de Almoço e Jantar/i);
    expect(shiftButton).toBeTruthy();
    const initialText = shiftButton.textContent;

    fireEvent.click(shiftButton);
    expect(shiftButton.textContent).not.toBe(initialText);

    fireEvent.click(shiftButton);
    expect(shiftButton.textContent).toBe(initialText);
  });

  it('navigates through sub-views of Gestão (DRE vs Metas vs Relatórios)', async () => {
    render(<App />);
    await loginAsAdmin();

    const metasButton = screen.getByRole('button', { name: /Metas & Bônus/i });
    fireEvent.click(metasButton);

    expect(screen.getByText(/Segurança Alimentos/i)).toBeTruthy();

    const dreButton = screen.getByRole('button', { name: /Visão de Dono & DRE/i });
    fireEvent.click(dreButton);
    expect(screen.getByText(/Cockpit Executivo & DRE/i)).toBeTruthy();

    // Testa a nova Central de Relatórios Executiva para Gerente e Dono
    const relatoriosButton = screen.getByRole('button', { name: /Relatórios & Metas/i });
    fireEvent.click(relatoriosButton);
    expect(screen.getAllByText(/Central de Relatórios & Inteligência/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Scorecard de Metas & Indicadores Globais/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Imprimir \/ PDF/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Exportar CSV/i })).toBeTruthy();

    // Navega pelas categorias de relatórios
    const vendasButton = screen.getByRole('button', { name: /Vendas & ABC/i });
    fireEvent.click(vendasButton);
    expect(screen.getByText(/Divisão de Vendas por Turno/i)).toBeTruthy();
    expect(screen.getByText(/Costela de Tambaqui Nobre na Brasa/i)).toBeTruthy();
  });

  it('navigates to Operação tab and exercises Salão, Rastreio and Checklists', async () => {
    render(<App />);
    await loginAsAdmin();

    const operacaoTabButton = getNavTab(/Salão & Mesas/i);
    fireEvent.click(operacaoTabButton);

    expect(screen.getByRole('button', { name: /Salão & Mesas \(Toast 86\)/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Rastreio & Câmera/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Checklists ANVISA/i })).toBeTruthy();

    const checksButton = screen.getByRole('button', { name: /Checklists ANVISA/i });
    fireEvent.click(checksButton);
    expect(screen.getByText(/Aferição Câmara Congelados/i)).toBeTruthy();

    const checkItems = screen.getAllByRole('checkbox');
    expect(checkItems.length).toBeGreaterThan(0);
    const firstCheck = checkItems[0];
    const initialChecked = firstCheck.getAttribute('aria-checked') === 'true';
    fireEvent.click(firstCheck);
    expect(firstCheck.getAttribute('aria-checked') === 'true').toBe(!initialChecked);

    const rastreioButton = screen.getByRole('button', { name: /Rastreio & Câmera/i });
    fireEvent.click(rastreioButton);
    expect(screen.getByText(/INCONSISTÊNCIA DETECTADA/i)).toBeTruthy();
  });

  it('navigates to Suprimentos tab and exercises Estoque, Hub CDA and Fichas Técnicas', async () => {
    render(<App />);
    await loginAsAdmin();

    const suprimentosTab = getNavTab(/Estoque & CDA/i);
    fireEvent.click(suprimentosTab);

    expect(screen.getByRole('button', { name: /Estoque Curva A & Perdas/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Hub CDA & Doca/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Fichas Técnicas & Cardápio/i })).toBeTruthy();

    const fichasButton = screen.getByRole('button', { name: /Fichas Técnicas & Cardápio/i });
    fireEvent.click(fichasButton);
    expect(screen.getAllByText(/Costela de Tambaqui na Brasa/i).length).toBeGreaterThan(0);

    const cdaButton = screen.getByRole('button', { name: /Hub CDA & Doca/i });
    fireEvent.click(cdaButton);
    expect(screen.getByText(/Hub CDA & Abastecimento/i)).toBeTruthy();
  }, 15000);

  it('navigates to Marketing & Reels tab and tests the visual player and scene navigation', async () => {
    render(<App />);
    await loginAsAdmin();

    const mktTab = getNavTab(/Mkt & Reels/i);
    fireEvent.click(mktTab);

    expect(screen.getByText(/Marketing & Reels Virais/i)).toBeTruthy();
    expect(screen.getByText(/ASMR Food Porn/i)).toBeTruthy();
    expect(screen.getByText(/Storytelling do Chef/i)).toBeTruthy();

    const nextButton = screen.getByRole('button', { name: /Próxima/i });
    expect(nextButton).toBeTruthy();
    fireEvent.click(nextButton);

    const prevButton = screen.getByRole('button', { name: /Anterior/i });
    expect(prevButton).toBeTruthy();
    fireEvent.click(prevButton);

    const technicalToggle = screen.getByRole('button', { name: /Ver Lentes e Câmera/i });
    fireEvent.click(technicalToggle);
    expect(screen.getByText(/Ocultar Detalhes de Lente/i)).toBeTruthy();

    const algoModalButton = screen.getByRole('button', { name: /Diretrizes do Algoritmo/i });
    fireEvent.click(algoModalButton);
    expect(screen.getByText(/Diretrizes do Algoritmo Instagram/i)).toBeTruthy();

    const closeAlgo = screen.getByRole('button', { name: /^Fechar$/i });
    fireEvent.click(closeAlgo);
  });

  it('navigates to Equipe & RH tab and verifies Onboarding and Escala', async () => {
    render(<App />);
    await loginAsAdmin();

    const equipeTab = getNavTab(/Equipe RH/i);
    fireEvent.click(equipeTab);

    expect(screen.getByText(/Onboarding Brigada & POPs/i)).toBeTruthy();
    expect(screen.getByText(/Escala & Briefing do Turno/i)).toBeTruthy();

    const escalaButton = screen.getByRole('button', { name: /Escala & Briefing do Turno/i });
    fireEvent.click(escalaButton);
    expect(screen.getByText(/Roteiro do Briefing Diário/i)).toBeTruthy();

    const copyButton = screen.getByRole('button', { name: /Copiar Texto/i });
    fireEvent.click(copyButton);
    expect(screen.getByText(/Copiado!/i)).toBeTruthy();
  });

  it('navigates to Copilot IA tab and can send a prompt', async () => {
    render(<App />);
    await loginAsAdmin();

    const copilotTab = getNavTab(/Assistente|Copilot/i);
    fireEvent.click(copilotTab);

    expect(screen.getByText(/IA Multimodal & Decisões Executivas/i)).toBeTruthy();

    const chatTabButton = screen.getByRole('button', { name: /Chat Consultivo IA/i });
    fireEvent.click(chatTabButton);

    const input = screen.getByPlaceholderText(/Pergunte ao Copilot/i);
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { value: 'Qual o status da meta de vendas?' } });

    const form = input.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Qual o status da meta de vendas?')).toBeTruthy();
    });
  });

  it('opens admin panel from unit selection screen', () => {
    render(<App />);

    const adminButton = screen.getByRole('button', { name: /Painel Administrativo/i });
    fireEvent.click(adminButton);

    // Deve mostrar o painel admin
    expect(screen.getAllByText(/Painel Administrativo/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Restaurantes/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Usuários/i).length).toBeGreaterThanOrEqual(1);

    // Deve listar o Engenho Manauara
    expect(screen.getAllByText(/Engenho Manauara/i).length).toBeGreaterThanOrEqual(1);

    // Botão de voltar
    const backButton = screen.getByRole('button', { name: /Voltar à Seleção de Unidade/i });
    fireEvent.click(backButton);

    // Deve voltar à seleção de unidade
    expect(screen.getByText(/Selecione a Unidade/i)).toBeTruthy();
  });
});
