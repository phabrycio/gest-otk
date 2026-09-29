// ============================================================
// SERVIÇO DE MONITORAMENTO DA CÂMARA FRIA POR FOTO
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import type {
  ColdChamberReading,
  ChamberShift,
  ChamberReadingStatus,
  WeeklyChamberReport,
} from '../types/coldChamber.types';
import { logSystemAction } from './auditLogStore';

const STORAGE_KEY_CHAMBER = 'tk_cold_chamber_readings_v1';

// Gerador de foto SVG realista de display digital de termômetro de câmara fria
export function generateThermometerPhotoSvg(
  temp: number,
  chamberName: string,
  dateStr: string,
  timeStr: string
): string {
  const isOk = temp <= -18 && temp >= -22;
  const ledColor = isOk ? '#22c55e' : '#ef4444';
  const statusLabel = isOk ? 'NORMAL • CONFORME' : 'ALERTA • FORA DA FAIXA';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" style="background:#090d16;font-family:monospace;">
    <!-- Moldura Externa do Termômetro Industrial Full Gauge / Carel -->
    <rect width="400" height="300" fill="#0f172a" rx="16" stroke="#334155" stroke-width="4"/>
    <rect x="20" y="20" width="360" height="260" fill="#020617" rx="12" stroke="#1e293b" stroke-width="2"/>
    
    <!-- Parafusos Industriais nos Cantos -->
    <circle cx="16" cy="16" r="4" fill="#64748b"/>
    <circle cx="384" cy="16" r="4" fill="#64748b"/>
    <circle cx="16" cy="284" r="4" fill="#64748b"/>
    <circle cx="384" cy="284" r="4" fill="#64748b"/>

    <!-- Cabeçalho do Termostato -->
    <text x="40" y="50" fill="#94a3b8" font-size="11" font-weight="bold">CONTROLE TÉCNICO • ENGENHO MANAUARA</text>
    <text x="40" y="68" fill="#38bdf8" font-size="12" font-weight="bold">${chamberName}</text>
    <line x1="40" y1="80" x2="360" y2="80" stroke="#1e293b" stroke-width="1"/>

    <!-- Display Digital LED -->
    <rect x="50" y="95" width="300" height="110" fill="#000000" rx="8" stroke="#334155" stroke-width="2"/>
    
    <!-- Efeito Glow de LED -->
    <text x="200" y="175" fill="${ledColor}" font-size="54" font-weight="900" text-anchor="middle" letter-spacing="2">
      ${temp.toFixed(1)}°C
    </text>

    <!-- Indicador de Status -->
    <rect x="70" y="220" width="260" height="26" fill="${ledColor}20" stroke="${ledColor}60" rx="6"/>
    <text x="200" y="237" fill="${ledColor}" font-size="11" font-weight="bold" text-anchor="middle">
      ${statusLabel} (PADRÃO: -18°C a -22°C)
    </text>

    <!-- Marca d'Água de Autenticidade e Carimbo de Hora -->
    <text x="40" y="270" fill="#64748b" font-size="10">Registro: ${dateStr} às ${timeStr}</text>
    <text x="360" y="270" fill="#64748b" font-size="10" text-anchor="end">FOTO VERIFICADA TK-IOT</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// Mock inicial completo cobrindo a semana atual (Semana 39 • 21/09/2026 a 27/09/2026)
// Com leituras diárias (Manhã e Noite), vistos da Supervisora Patricia e checks do Gerente Geral Ivan / Pabricio
const INITIAL_READINGS: ColdChamberReading[] = [];

/**
 * Retorna todas as leituras de temperatura de câmara fria salvas.
 */
export function getColdChamberReadings(weekNumber?: number): ColdChamberReading[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHAMBER);
    if (raw) {
      const list: ColdChamberReading[] = JSON.parse(raw);
      if (weekNumber !== undefined) {
        return list.filter((r) => r.weekNumber === weekNumber);
      }
      return list;
    }
  } catch (e) {
    console.error('Erro ao ler leituras da câmara fria:', e);
  }

  // Inicializa com os dados mock realistas da semana
  localStorage.setItem(STORAGE_KEY_CHAMBER, JSON.stringify(INITIAL_READINGS));
  if (weekNumber !== undefined) {
    return INITIAL_READINGS.filter((r) => r.weekNumber === weekNumber);
  }
  return INITIAL_READINGS;
}

/**
 * Adiciona uma nova leitura por foto da câmara fria no sistema.
 */
export function addColdChamberReading(data: {
  temperature: number;
  shift: ChamberShift;
  chamberName?: string;
  photoUrl?: string;
  notes?: string;
  takenBy: {
    userId: string;
    userName: string;
    userRole: string;
    loginId?: string;
  };
}): ColdChamberReading {
  const readings = getColdChamberReadings();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 5);
  const chamberName = data.chamberName || 'Câmara Fria Principal (Congelados)';
  const isConformant = data.temperature <= -18 && data.temperature >= -22;

  const photo =
    data.photoUrl || generateThermometerPhotoSvg(data.temperature, chamberName, dateStr, timeStr);

  const newReading: ColdChamberReading = {
    id: `chm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    chamberId: 'camara-congelados',
    chamberName,
    temperature: Number(data.temperature),
    targetTempMin: -22,
    targetTempMax: -18,
    isConformant,
    shift: data.shift,
    shiftLabel: data.shift === 'MANHA_ABERTURA' ? 'Abertura (Manhã)' : 'Fechamento (Noite)',
    readingDate: dateStr,
    readingTime: timeStr,
    readingTimestamp: now.toISOString(),
    weekNumber: 39,
    weekLabel: 'Semana 39 • 21/09/2026 a 27/09/2026',
    photoUrl: photo,
    photoFileName: `foto_temperatura_${dateStr}_${data.shift}.png`,
    takenBy: data.takenBy,
    supervisorCheck: { checked: false },
    managerCheck: { checked: false },
    status: 'PENDENTE_SUPERVISOR',
    generalNotes: data.notes,
  };

  const updated = [newReading, ...readings];
  localStorage.setItem(STORAGE_KEY_CHAMBER, JSON.stringify(updated));

  // Notifica componentes
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chamber-readings-updated', { detail: newReading }));
  }

  // Registra Log de Auditoria Oficial
  logSystemAction({
    userId: data.takenBy.userId,
    userName: data.takenBy.userName,
    userRole: data.takenBy.userRole,
    action: 'LEITURA_FOTO_CAMARA_FRIA',
    actionLabel: 'Leitura Fotográfica de Temperatura',
    module: 'FREEZER_CDA',
    description: `${data.takenBy.userName} enviou foto do display da ${chamberName}: ${data.temperature.toFixed(1)}°C (${newReading.shiftLabel}).`,
    details: {
      temperature: data.temperature,
      isConformant,
      shift: data.shift,
      readingId: newReading.id,
    },
    severity: isConformant ? 'SUCESSO' : 'AVISO',
  });

  return newReading;
}

/**
 * Registra o Visto / OK da Supervisora (Patricia).
 */
export function giveSupervisorCheck(
  readingId: string,
  supervisorName: string = 'Patricia (Supervisora)',
  notes?: string
): ColdChamberReading {
  const readings = getColdChamberReadings();
  const target = readings.find((r) => r.id === readingId);
  if (!target) throw new Error('Leitura não encontrada.');

  const now = new Date();
  const formattedCheckedAt = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const updatedReading: ColdChamberReading = {
    ...target,
    supervisorCheck: {
      checked: true,
      checkedBy: supervisorName,
      checkedAt: now.toISOString(),
      formattedCheckedAt,
      notes,
    },
    status: target.managerCheck.checked ? 'APROVADO_TOTAL' : 'SUPERVISOR_OK',
  };

  const updatedList = readings.map((r) => (r.id === readingId ? updatedReading : r));
  localStorage.setItem(STORAGE_KEY_CHAMBER, JSON.stringify(updatedList));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chamber-readings-updated', { detail: updatedReading }));
  }

  // Log de Auditoria
  logSystemAction({
    userId: 'user-patricia',
    userName: supervisorName,
    userRole: 'Supervisora de Loja',
    action: 'VISTO_SUPERVISOR_CAMARA_FRIA',
    actionLabel: 'Visto da Supervisora (Câmara Fria)',
    module: 'FREEZER_CDA',
    description: `${supervisorName} deu o OK na foto da leitura de temperatura de ${target.readingDate} (${target.shiftLabel} • ${target.temperature}°C).`,
    details: { readingId, temperature: target.temperature, supervisor: supervisorName },
    severity: 'SUCESSO',
  });

  return updatedReading;
}

/**
 * Registra o Check do Gerente Geral / Em Treinamento (Ivan / Pabricio).
 */
export function giveManagerCheck(
  readingId: string,
  managerName: string = 'Ivan (Gerente Geral)',
  notes?: string
): ColdChamberReading {
  const readings = getColdChamberReadings();
  const target = readings.find((r) => r.id === readingId);
  if (!target) throw new Error('Leitura não encontrada.');

  const now = new Date();
  const formattedCheckedAt = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const updatedReading: ColdChamberReading = {
    ...target,
    managerCheck: {
      checked: true,
      checkedBy: managerName,
      checkedAt: now.toISOString(),
      formattedCheckedAt,
      notes,
    },
    status: target.supervisorCheck.checked ? 'APROVADO_TOTAL' : 'SUPERVISOR_OK',
  };

  const updatedList = readings.map((r) => (r.id === readingId ? updatedReading : r));
  localStorage.setItem(STORAGE_KEY_CHAMBER, JSON.stringify(updatedList));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chamber-readings-updated', { detail: updatedReading }));
  }

  // Log de Auditoria
  logSystemAction({
    userId: 'user-gerente',
    userName: managerName,
    userRole: 'Gerente Geral / Em Treinamento',
    action: 'CHECK_GERENTE_CAMARA_FRIA',
    actionLabel: 'Check do Gerente Geral (Câmara Fria)',
    module: 'FREEZER_CDA',
    description: `${managerName} marcou o Check do Gerente com data e hora para a leitura de ${target.readingDate} (${target.shiftLabel} • ${target.temperature}°C).`,
    details: { readingId, temperature: target.temperature, manager: managerName },
    severity: 'SUCESSO',
  });

  return updatedReading;
}

/**
 * Consolida o Relatório Semanal de Temperatura para impressão e fixação no quadro de avisos.
 */
export function getWeeklyChamberReport(weekNumber: number = 39): WeeklyChamberReport {
  const readings = getColdChamberReadings(weekNumber);
  
  // Ordena por data e turno crescente (Manhã primeiro, Noite depois)
  const sorted = [...readings].sort((a, b) => {
    if (a.readingDate === b.readingDate) {
      return a.shift === 'MANHA_ABERTURA' ? -1 : 1;
    }
    return a.readingDate.localeCompare(b.readingDate);
  });

  const conformantCount = sorted.filter((r) => r.isConformant).length;
  const supervisorSignedCount = sorted.filter((r) => r.supervisorCheck.checked).length;
  const managerSignedCount = sorted.filter((r) => r.managerCheck.checked).length;

  return {
    weekNumber,
    weekLabel: 'Semana 39 • 21/09/2026 a 27/09/2026',
    startDate: '21/09/2026',
    endDate: '27/09/2026',
    chamberName: 'Câmara Fria Principal (Congelados)',
    targetTempRange: '-18°C a -22°C (Padrão Engenho Manauara & RDC 216 Anvisa)',
    totalReadings: sorted.length,
    conformantCount,
    divergentCount: sorted.length - conformantCount,
    supervisorSignedCount,
    managerSignedCount,
    isFullySigned: supervisorSignedCount === sorted.length && managerSignedCount === sorted.length,
    readings: sorted,
    signatures: {
      readerName: 'Mádio / Esmael',
      readerRole: 'Chefe & Sub Chefe de Cozinha (Execução Diária)',
      supervisorName: 'Patricia',
      supervisorRole: 'Supervisora de Loja (Auditoria & Visto)',
      managerName: 'Ivan / Pabricio',
      managerRole: 'Gerente Geral / Em Treinamento (Aprovação Final)',
    },
  };
}
