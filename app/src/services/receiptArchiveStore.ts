// ============================================================
// SERVIÃ‡O DE ARQUIVAMENTO FISCAL & RETENÃ‡ÃƒO DE NOTAS DE 3 MESES
// Tk GestÃ£o e Tecnologia â€¢ Unidade Engenho Manauara
// ============================================================

import JSZip from 'jszip';
import type { FiscalReceipt, ReceiptCategory, ReceiptMonthSummary } from '../types/receiptArchive.types';
import { logSystemAction } from './auditLogStore';

const STORAGE_KEY_RECEIPTS = 'tk_fiscal_receipts_v1';

// Helper para gerar um SVG de nota fiscal em Base64 com layout profissional
function generateMockReceiptSvg(
  receiptNumber: string,
  supplier: string,
  cnpj: string,
  amount: number,
  date: string,
  category: string
): string {
  const formattedAmount = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" style="background:#fff;font-family:sans-serif;">
    <rect width="400" height="520" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="8"/>
    <rect x="0" y="0" width="400" height="50" fill="#1e293b" rx="8"/>
    <text x="200" y="32" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">COMPROVANTE FISCAL â€¢ ENGENHO MANAUARA</text>
    <text x="20" y="80" fill="#64748b" font-size="11">FORNECEDOR / EMISSOR:</text>
    <text x="20" y="100" fill="#0f172a" font-size="14" font-weight="bold">${supplier}</text>
    <text x="20" y="120" fill="#64748b" font-size="11">CNPJ: ${cnpj}</text>
    <line x1="20" y1="135" x2="380" y2="135" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
    <text x="20" y="160" fill="#64748b" font-size="11">DOCUMENTO FISCAL (NF-e / RECIBO):</text>
    <text x="20" y="180" fill="#0284c7" font-size="15" font-weight="bold">NF #${receiptNumber}</text>
    <text x="20" y="210" fill="#64748b" font-size="11">CATEGORIA DE CUSTO:</text>
    <text x="20" y="230" fill="#0f172a" font-size="13">${category}</text>
    <text x="20" y="260" fill="#64748b" font-size="11">DATA DE EMISSÃƒO:</text>
    <text x="20" y="280" fill="#0f172a" font-size="13">${date}</text>
    <line x1="20" y1="300" x2="380" y2="300" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>
    <rect x="20" y="320" width="360" height="70" fill="#f1f5f9" rx="6" stroke="#e2e8f0"/>
    <text x="35" y="348" fill="#64748b" font-size="12">VALOR TOTAL DO DOCUMENTO:</text>
    <text x="35" y="375" fill="#16a34a" font-size="22" font-weight="bold">${formattedAmount}</text>
    <rect x="35" y="410" width="330" height="40" fill="#fef3c7" stroke="#f59e0b" rx="4"/>
    <text x="200" y="435" fill="#92400e" font-size="10" font-weight="bold" text-anchor="middle">ARMAZENAMENTO SUPABASE CLOUD â€¢ PERÃODO 90 DIAS</text>
    <text x="200" y="490" fill="#94a3b8" font-size="9" text-anchor="middle">AutenticaÃ§Ã£o Digital: TK-REC-${receiptNumber}-${date.replace(/-/g, '')}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// Sem dados iniciais â€” notas fiscais reais serÃ£o cadastradas pela operaÃ§Ã£o
const INITIAL_RECEIPTS: FiscalReceipt[] = [];

/**
 * Retorna todas as notas fiscais cadastradas.
 */
export function getFiscalReceipts(): FiscalReceipt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECEIPTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Erro ao ler notas fiscais:', e);
  }
  // Se nÃ£o existir, inicializa com o mock realista e salva
  localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(INITIAL_RECEIPTS));
  return INITIAL_RECEIPTS;
}

/**
 * Salva ou adiciona uma nova nota fiscal no sistema.
 */
export function addFiscalReceipt(
  receiptData: {
    receiptNumber: string;
    supplierName: string;
    cnpjOrCpf: string;
    category: ReceiptCategory;
    amount: number;
    issueDate: string;
    uploadedBy: string;
    imageUrl: string;
    fileName: string;
    notes?: string;
  }
): FiscalReceipt {
  const receipts = getFiscalReceipts();
  const issueDateObj = new Date(receiptData.issueDate || Date.now());
  const year = issueDateObj.getFullYear();
  const month = String(issueDateObj.getMonth() + 1).padStart(2, '0');
  const monthBucket = `${year}-${month}`;
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'MarÃ§o', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const monthLabel = `${monthNames[issueDateObj.getMonth()]} / ${year}`;

  const newReceipt: FiscalReceipt = {
    id: `rcpt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    receiptNumber: receiptData.receiptNumber.trim(),
    supplierName: receiptData.supplierName.trim(),
    cnpjOrCpf: receiptData.cnpjOrCpf.trim(),
    category: receiptData.category,
    amount: Number(receiptData.amount) || 0,
    issueDate: receiptData.issueDate,
    uploadDate: new Date().toISOString(),
    uploadedBy: receiptData.uploadedBy,
    restaurantId: 'rest-engenho-manauara',
    restaurantName: 'Engenho Manauara',
    imageUrl: receiptData.imageUrl || generateMockReceiptSvg(receiptData.receiptNumber, receiptData.supplierName, receiptData.cnpjOrCpf, receiptData.amount, receiptData.issueDate, receiptData.category),
    fileName: receiptData.fileName || `NF_${receiptData.receiptNumber}.png`,
    fileSizeKb: Math.round((receiptData.imageUrl.length * 0.75) / 1024) || 120,
    monthBucket,
    monthLabel,
    status: 'ONLINE_ATIVO',
    notes: receiptData.notes,
  };

  const updated = [newReceipt, ...receipts];
  localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(updated));

  // Notifica ouvintes locais
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('receipts-updated', { detail: newReceipt }));
  }

  // Log de auditoria
  logSystemAction({
    userId: 'user-op',
    userName: receiptData.uploadedBy,
    userRole: 'Operador / Gerente',
    action: 'INSERCAO_NOTA_FISCAL',
    actionLabel: 'Nova Nota Fiscal / Recibo',
    module: 'FINANCEIRO',
    description: `${receiptData.uploadedBy} inseriu a NF #${newReceipt.receiptNumber} (${newReceipt.supplierName}) no valor de R$ ${newReceipt.amount.toFixed(2)}.`,
    details: { receiptId: newReceipt.id, amount: newReceipt.amount, category: newReceipt.category },
    severity: 'SUCESSO',
  });

  return newReceipt;
}

/**
 * Agrupa as notas fiscais pelos meses e calcula o status de retenÃ§Ã£o (3 meses ativos + 4Âº mÃªs vencido).
 */
export function getMonthSummaries(): ReceiptMonthSummary[] {
  const receipts = getFiscalReceipts();

  // Agrupa por monthBucket
  const grouped: Record<string, FiscalReceipt[]> = {};
  receipts.forEach((r) => {
    if (!grouped[r.monthBucket]) {
      grouped[r.monthBucket] = [];
    }
    grouped[r.monthBucket].push(r);
  });

  // Ordena os meses decrescente (mais recente primeiro: 2026-09, 2026-08, 2026-07, 2026-06...)
  const sortedBuckets = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return sortedBuckets.map((bucket, index) => {
    const list = grouped[bucket];
    const totalAmount = list.reduce((acc, curr) => acc + curr.amount, 0);
    const totalSizeMb = list.reduce((acc, curr) => acc + (curr.fileSizeKb || 100), 0) / 1024;
    const monthLabel = list[0]?.monthLabel || bucket;

    // Regra: index 0 (mÃªs atual), index 1 (mÃªs -1), index 2 (mÃªs -2) -> RETIDOS ONLINE (3 meses)
    // index >= 3 -> 4Âº MÃŠS OU MAIS ANTIGO -> VENCIDO (> 90 dias)
    const isExpired4thMonth = index >= 3;

    // Se jÃ¡ foram todos expurgados
    const allPurged = list.every((r) => r.status === 'ARQUIVADO_LOCAL_EXPURGADO');
    const hasAnyOnlineImage = list.some((r) => r.status === 'ONLINE_ATIVO' && r.imageUrl && !r.imageUrl.startsWith('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhlZWViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM3OTFkMWQiIGZvbnQtc2l6ZT0iMTIiPkltYWdlbSBFeHB1cmdhZGEgZGEgTnV2ZW08L3RleHQ+PC9zdmc+'));

    let status: 'ONLINE_ATIVO' | 'PENDENTE_DOWNLOAD_EXPURGO' | 'ARQUIVADO_LOCAL' = 'ONLINE_ATIVO';
    if (isExpired4thMonth) {
      if (allPurged) {
        status = 'ARQUIVADO_LOCAL';
      } else {
        status = 'PENDENTE_DOWNLOAD_EXPURGO';
      }
    } else {
      status = 'ONLINE_ATIVO';
    }

    return {
      monthBucket: bucket,
      monthLabel,
      monthIndex: index,
      isExpired4thMonth,
      totalReceipts: list.length,
      totalAmount,
      totalSizeMb: Number(totalSizeMb.toFixed(2)),
      status,
      receipts: list,
    };
  });
}

/**
 * Verifica se hÃ¡ algum 4Âº mÃªs (ou anterior) que atingiu a retenÃ§Ã£o de 90 dias
 * e precisa ser baixado para o computador local para liberar espaÃ§o no Supabase.
 */
export function getPending4thMonthAlert(): ReceiptMonthSummary | null {
  const summaries = getMonthSummaries();
  // Busca o primeiro mÃªs vencido que ainda tem imagens pendentes de expurgo
  const pending = summaries.find(
    (s) => s.isExpired4thMonth && s.status === 'PENDENTE_DOWNLOAD_EXPURGO'
  );
  return pending || null;
}

/**
 * Gera e dispara o download do arquivo compactado (.ZIP) com todas as notas fiscais do mÃªs
 * contendo o manifesto JSON, a planilha CSV e a pasta com as imagens.
 */
export async function downloadMonthReceiptsZip(
  monthBucket: string,
  managerName: string
): Promise<{ success: boolean; fileName: string; totalFiles: number }> {
  const receipts = getFiscalReceipts().filter((r) => r.monthBucket === monthBucket);
  if (receipts.length === 0) {
    throw new Error('Nenhuma nota fiscal encontrada para o mÃªs selecionado.');
  }

  const zip = new JSZip();
  const monthLabel = receipts[0]?.monthLabel || monthBucket;
  const safeBucket = monthBucket.replace('-', '_');

  // 1. Cria a pasta de imagens dentro do ZIP
  const imgFolder = zip.folder(`notas_engenho_${safeBucket}/imagens`);

  // Adiciona cada imagem
  receipts.forEach((r, idx) => {
    const filename = `${String(idx + 1).padStart(3, '0')}_NF_${r.receiptNumber}_${r.supplierName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    
    if (r.imageUrl && r.imageUrl.startsWith('data:image')) {
      const base64Data = r.imageUrl.split(',')[1];
      if (base64Data && imgFolder) {
        imgFolder.file(filename, base64Data, { base64: true });
      }
    } else {
      // Mock de imagem se nÃ£o tiver formato base64
      if (imgFolder) {
        imgFolder.file(filename, `Arquivo fiscal comprovante: ${r.receiptNumber}\nFornecedor: ${r.supplierName}\nValor: R$ ${r.amount.toFixed(2)}\nData: ${r.issueDate}`);
      }
    }
  });

  // 2. Cria planilha CSV para contabilidade
  const csvHeaders = 'ID,NUMERO_NF,FORNECEDOR,CNPJ_CPF,CATEGORIA,VALOR_RS,DATA_EMISSAO,DATA_UPLOAD,INSERIDO_POR,STATUS\n';
  const csvRows = receipts.map((r) => {
    return `"${r.id}","${r.receiptNumber}","${r.supplierName}","${r.cnpjOrCpf}","${r.category}","${r.amount.toFixed(2)}","${r.issueDate}","${r.uploadDate}","${r.uploadedBy}","${r.status}"`;
  }).join('\n');
  
  zip.file(`notas_engenho_${safeBucket}/relatorio_fiscal_${safeBucket}.csv`, '\uFEFF' + csvHeaders + csvRows);

  // 3. Manifesto JSON de auditoria
  const manifesto = {
    sistema: 'Tk GestÃ£o e Tecnologia - Engenho Manauara',
    finalidade: 'Backup Local Permanente de Notas Fiscais Vencidas (> 90 dias)',
    mesReferencia: monthLabel,
    monthBucket,
    dataGeracaoBackup: new Date().toISOString(),
    geradoPor: managerName,
    quantidadeTotalNotas: receipts.length,
    valorTotalFaturado: receipts.reduce((acc, c) => acc + c.amount, 0),
    politicaRetencaoOnline: '3 Meses (90 Dias). A partir do 4Âº mÃªs o download local Ã© obrigatÃ³rio para expurgo cloud.',
    notas: receipts.map((r) => ({
      id: r.id,
      numeroNF: r.receiptNumber,
      fornecedor: r.supplierName,
      cnpj: r.cnpjOrCpf,
      categoria: r.category,
      valor: r.amount,
      dataEmissao: r.issueDate,
    })),
  };

  zip.file(`notas_engenho_${safeBucket}/manifesto_auditoria_${safeBucket}.json`, JSON.stringify(manifesto, null, 2));

  // Gera o arquivo ZIP binÃ¡rio
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const downloadFileName = `NOTAS_FISCAIS_ENGENHO_${safeBucket}_${new Date().toISOString().slice(0, 10)}.zip`;

  // Dispara o download automÃ¡tico no browser se disponÃ­vel
  if (typeof document !== 'undefined' && document.body) {
    try {
      const link = document.createElement('a');
      link.href = typeof URL !== 'undefined' && URL.createObjectURL ? URL.createObjectURL(zipBlob) : '';
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (typeof URL !== 'undefined' && URL.revokeObjectURL && link.href) {
        URL.revokeObjectURL(link.href);
      }
    } catch (e) {
      console.warn('Download disparado em modo headless/teste');
    }
  }

  // Registra no log de auditoria
  logSystemAction({
    userId: 'user-manager',
    userName: managerName,
    userRole: 'Gerente Geral / Em Treinamento',
    action: 'BACKUP_LOCAL_NOTAS_ZIP',
    actionLabel: 'Download de Lote de Notas Fiscais (ZIP)',
    module: 'FINANCEIRO',
    description: `${managerName} realizou o download local do arquivo ZIP contendo ${receipts.length} notas fiscais do perÃ­odo ${monthLabel} para liberar espaÃ§o online.`,
    details: { monthBucket, totalReceipts: receipts.length, fileName: downloadFileName },
    severity: 'SUCESSO',
  });

  return {
    success: true,
    fileName: downloadFileName,
    totalFiles: receipts.length,
  };
}

/**
 * Realiza o expurgo das imagens online no sistema (Supabase/LocalStorage) para o mÃªs que foi
 * devidamente baixado para o computador local. MantÃ©m os metadados contÃ¡beis e remove os bytes pesados.
 */
export function confirmPurgeAndFreeOnlineStorage(
  monthBucket: string,
  managerName: string
): { purgedCount: number; freedKb: number } {
  const receipts = getFiscalReceipts();
  let purgedCount = 0;
  let freedKb = 0;

  const placeholderSvg = `data:image/svg+xml;base64,${btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" style="background:#f1f5f9;font-family:sans-serif;"><rect width="100%" height="100%" fill="#f1f5f9" stroke="#cbd5e1"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-size="13" font-weight="bold">ARQUIVADO NO COMPUTADOR LOCAL</text><text x="50%" y="68%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-size="10">Imagem expurgada da nuvem para liberar espaÃ§o Supabase</text></svg>'
  )}`;

  const updatedReceipts = receipts.map((r) => {
    if (r.monthBucket === monthBucket) {
      purgedCount += 1;
      freedKb += r.fileSizeKb || 120;
      return {
        ...r,
        imageUrl: placeholderSvg,
        status: 'ARQUIVADO_LOCAL_EXPURGADO' as const,
        localArchivedAt: new Date().toISOString(),
        localArchivedBy: managerName,
      };
    }
    return r;
  });

  localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(updatedReceipts));

  // Emite evento para atualizaÃ§Ã£o imediata dos componentes
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('receipts-updated', { detail: { monthBucket, purgedCount } }));
  }

  // Registra no Log de Auditoria
  logSystemAction({
    userId: 'user-manager',
    userName: managerName,
    userRole: 'Gerente Geral / Em Treinamento',
    action: 'EXPURGO_STORAGE_NOTAS',
    actionLabel: 'Expurgo Online de Imagens (LiberaÃ§Ã£o de Nuvem)',
    module: 'FINANCEIRO',
    description: `EXPURGO CONCLUÃDO: ${managerName} liberou ${(freedKb / 1024).toFixed(2)} MB de espaÃ§o no Supabase/Nuvem ao expurgar ${purgedCount} imagens do perÃ­odo ${monthBucket} apÃ³s download local confirmado.`,
    details: { monthBucket, purgedCount, freedMb: (freedKb / 1024).toFixed(2) },
    severity: 'AVISO',
  });

  return { purgedCount, freedKb };
}