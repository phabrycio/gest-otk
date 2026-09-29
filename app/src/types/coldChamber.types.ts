// ============================================================
// TIPOS: MONITORAMENTO DE TEMPERATURA DA CÂMARA FRIA POR FOTO
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

export type ChamberShift = 'MANHA_ABERTURA' | 'NOITE_FECHAMENTO';

export type ChamberReadingStatus =
  | 'PENDENTE_SUPERVISOR'    // Foto enviada, aguardando visto da supervisora
  | 'SUPERVISOR_OK'          // Supervisora deu OK, aguardando check do gerente
  | 'APROVADO_TOTAL';         // Supervisora e Gerente deram visto completo

export interface ColdChamberReading {
  id: string;                         // ex: "chm-20260921-am"
  chamberId: string;                  // "camara-congelados" | "camara-resfriados"
  chamberName: string;                // "Câmara Fria Principal (Congelados)"
  temperature: number;                // ex: -19.4 (°C)
  targetTempMin: number;              // -22 (°C)
  targetTempMax: number;              // -18 (°C)
  isConformant: boolean;              // true se entre targetTempMin e targetTempMax
  shift: ChamberShift;
  shiftLabel: string;                 // "Abertura (Manhã)" | "Fechamento (Noite)"
  readingDate: string;                // "2026-09-21"
  readingTime: string;                // "08:15"
  readingTimestamp: string;           // ISO timestamp
  weekNumber: number;                 // ex: 39
  weekLabel: string;                  // "Semana 39 • 21/09/2026 a 27/09/2026"
  photoUrl: string;                   // Imagem da foto do termômetro digital
  photoFileName?: string;

  // Responsável pela Leitura (Cozinha / Estoque)
  takenBy: {
    userId: string;
    userName: string;                 // ex: "Mádio (Chefe de Cozinha)"
    userRole: string;                 // "Chefe de Cozinha"
    loginId?: string;                 // "madio.cozinha"
  };

  // Nível 1: Visto do Supervisor (Patricia)
  supervisorCheck: {
    checked: boolean;
    checkedBy?: string;               // "Patricia (Supervisora)"
    checkedAt?: string;               // ISO
    formattedCheckedAt?: string;       // "21/09/2026 09:20"
    notes?: string;
  };

  // Nível 2: Check do Gerente Geral (Ivan / Pabricio)
  managerCheck: {
    checked: boolean;
    checkedBy?: string;               // "Ivan (Gerente Geral)" ou "Pabricio (Gerente em Treinamento)"
    checkedAt?: string;               // ISO
    formattedCheckedAt?: string;       // "21/09/2026 10:15"
    notes?: string;
  };

  status: ChamberReadingStatus;
  generalNotes?: string;
}

export interface WeeklyChamberReport {
  weekNumber: number;
  weekLabel: string;
  startDate: string;
  endDate: string;
  chamberName: string;
  targetTempRange: string;            // "-18°C a -22°C"
  totalReadings: number;
  conformantCount: number;
  divergentCount: number;
  supervisorSignedCount: number;
  managerSignedCount: number;
  isFullySigned: boolean;
  readings: ColdChamberReading[];
  signatures: {
    readerName: string;
    readerRole: string;
    supervisorName: string;
    supervisorRole: string;
    managerName: string;
    managerRole: string;
  };
}
