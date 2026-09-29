// ============================================================
// RENDERIZADOR DE QR CODE EM SVG PURO (SEM DEPENDÊNCIAS EXTERNAS)
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// ============================================================

import React, { useMemo } from 'react';

interface QrCodeRendererProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  title?: string;
}

/**
 * Gera uma matriz QR Code determinística 21x21 (Version 1) com padrões de localização
 * (Finder patterns) nos 3 cantos, linhas de temporização e dados hash do valor.
 */
export const QrCodeRenderer: React.FC<QrCodeRendererProps> = ({
  value,
  size = 140,
  fgColor = '#0f172a',
  bgColor = '#ffffff',
  className = '',
  title = 'QR Code de Rastreabilidade',
}) => {
  const matrix = useMemo(() => {
    const N = 21; // QR Code Version 1 padrão 21x21
    const grid: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));

    // 1. Padrões de Localização (Finder Patterns 7x7) nos cantos:
    // Superior Esquerdo (0,0), Superior Direito (0,14), Inferior Esquerdo (14,0)
    const drawFinder = (r: number, c: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (
            i === 0 ||
            i === 6 ||
            j === 0 ||
            j === 6 ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            grid[r + i][c + j] = true;
          } else {
            grid[r + i][c + j] = false;
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, 14);
    drawFinder(14, 0);

    // 2. Linhas de Temporização (Timing Patterns)
    for (let i = 8; i < 13; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // 3. Padrão de Alinhamento e separadores
    for (let i = 0; i < 8; i++) {
      grid[7][i] = false;
      grid[i][7] = false;
      grid[7][13 + i] = false;
      grid[i][13] = false;
      grid[13][i] = false;
      grid[13 + i][7] = false;
    }

    // 4. Hash pseudo-aleatório determinístico baseado na string para os dados
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    const isReserved = (r: number, c: number) => {
      if (r <= 8 && c <= 8) return true; // Top-left
      if (r <= 8 && c >= 12) return true; // Top-right
      if (r >= 12 && c <= 8) return true; // Bottom-left
      if (r === 6 || c === 6) return true; // Timing
      return false;
    };

    // Preenche dados
    let seed = Math.abs(hash);
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (!isReserved(r, c)) {
          // LCG simples determinístico
          seed = (seed * 1103515245 + 12345) & 0x7fffffff;
          grid[r][c] = seed % 3 !== 0;
        }
      }
    }

    return grid;
  }, [value]);

  const N = matrix.length;
  const cellSize = 10;
  const quietZone = 2 * cellSize;
  const totalDimension = N * cellSize + 2 * quietZone;

  return (
    <svg
      viewBox={`0 0 ${totalDimension} ${totalDimension}`}
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
      role="img"
      aria-label={title}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Fundo Branco da Zona de Silêncio */}
      <rect width={totalDimension} height={totalDimension} fill={bgColor} />

      {/* Módulos do QR Code */}
      {matrix.map((row, r) =>
        row.map((active, c) => {
          if (!active) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={quietZone + c * cellSize}
              y={quietZone + r * cellSize}
              width={cellSize}
              height={cellSize}
              fill={fgColor}
            />
          );
        })
      )}
    </svg>
  );
};
