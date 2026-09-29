/**
 * scripts/generate-pwa-icons.mjs
 * Gera os ícones PNG do PWA (192×192 e 512×512) a partir do SVG de marca.
 * Usa apenas APIs nativas do Node.js + canvas via @napi-rs/canvas (sem dependências externas).
 * Execute com: node scripts/generate-pwa-icons.mjs
 */

import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

async function drawEngenhoIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const radius = size * 0.21;

  // --- Background: rounded rect with radial gradient ---
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.clip();

  const bgGrad = ctx.createRadialGradient(size * 0.4, size * 0.35, 0, size * 0.5, size * 0.5, size * 0.7);
  bgGrad.addColorStop(0, '#0d3b2d');
  bgGrad.addColorStop(1, '#051a12');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // --- Subtle amber glow ---
  const glowGrad = ctx.createRadialGradient(size * 0.5, size * 0.43, 0, size * 0.5, size * 0.43, size * 0.38);
  glowGrad.addColorStop(0, 'rgba(217,119,6,0.12)');
  glowGrad.addColorStop(1, 'rgba(217,119,6,0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, size, size);

  // --- Letter "E" in amber ---
  ctx.fillStyle = '#d97706';
  ctx.font = `bold ${Math.round(size * 0.565)}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('E', size * 0.502, size * 0.655);

  // --- "360" tagline in white ---
  ctx.fillStyle = 'rgba(255,255,255,0.87)';
  ctx.font = `bold ${Math.round(size * 0.14)}px Arial, sans-serif`;
  ctx.letterSpacing = `${Math.round(size * 0.012)}px`;
  ctx.fillText('360', size * 0.5, size * 0.845);

  // --- Amber underline accent ---
  ctx.fillStyle = 'rgba(217,119,6,0.55)';
  const lineW = size * 0.31;
  const lineH = Math.max(2, size * 0.006);
  ctx.fillRect((size - lineW) / 2, size * 0.862, lineW, lineH);

  return canvas.toBuffer('image/png');
}

async function main() {
  console.log('🎨 Gerando ícones PWA do Engenho Gestor 360...');

  for (const size of [192, 512]) {
    const buf = await drawEngenhoIcon(size);
    const outPath = resolve(publicDir, `icon-${size}x${size}.png`);
    writeFileSync(outPath, buf);
    console.log(`✅ Gerado: icon-${size}x${size}.png (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  console.log('🏁 Ícones PWA criados com sucesso!');
}

main().catch((e) => { console.error(e); process.exit(1); });
