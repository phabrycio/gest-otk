import fs from 'fs';
import readline from 'readline';

const CSV_PATH = 'C:\\Users\\phabr\\OneDrive\\Desktop\\Vendas-Realizadas-Por-Caixa (2).csv';

// Map dishes in the POS to standardized recipe IDs
function mapDishToRecipeId(productName) {
  const n = productName.toUpperCase();
  if (n.includes('CARNE DE SOL') || n.includes('CARNE ASSADA DE PANELA')) return 'carne_de_sol';
  if (n.includes('JOELHO')) return 'joelho';
  if (n.includes('TAMBAQUI')) return 'costela_tambaqui';
  if (n.includes('PIRARUCU')) return 'pirarucu';
  if (n.includes('PICANHA')) return 'picanha';
  if (n.includes('FEIJOADA')) return 'feijoada';
  if (n.includes('CAMARAO') || n.includes('MOQUECA')) return 'camarao';
  if (n.includes('DADINHO')) return 'dadinho';
  if (n.includes('PASTEL') || n.includes('PASTEIS')) return 'pasteis';
  if (n.includes('HEINEKEN')) return 'chopp_heineken';
  if (n.includes('AMSTEL')) return 'chopp_amstel';
  if (n.includes('CAIPIRINHA') || n.includes('CAIPI')) return 'caipirinha';
  if (n.includes('PUDIM') || n.includes('CARTOLA') || n.includes('SOBREMESA')) return 'cartola';
  return null;
}

const dayMap = {
  0: 'DOMINGO',
  1: 'SEGUNDA',
  2: 'TERCA',
  3: 'QUARTA',
  4: 'QUINTA',
  5: 'SEXTA',
  6: 'SABADO'
};

const dayLabels = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira (Noite de Chopp)',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira (Pico Noturno)',
  SABADO: 'Sábado (Almoço & Jantar Máximo)',
  DOMINGO: 'Domingo Familiar (Almoço Nobre)'
};

async function process12Weeks() {
  console.log('Extraindo histórico real de 12 semanas do CSV...');
  const stream = fs.createReadStream(CSV_PATH, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  // dateStr (DD/MM/YYYY) -> { dateStr, dow, revenue, orders: Set, dishes: Record<string, number> }
  const daysMap = new Map();
  // Waiter audit: waiter -> { gross, tax, orders: Set }
  const waitersMap = new Map();

  for await (const line of rl) {
    if (!line.startsWith('"0104 MNS"')) continue;
    const parts = line.split(';');
    if (parts.length < 14) continue;

    const details = parts[2].replace(/^"|"$/g, '');
    const dateMatch = details.match(/Data Venda:\s*(\d{2}\/\d{4}|\d{2}\/\d{2}\/\d{4})/);
    if (!dateMatch) continue;
    const dateStr = dateMatch[1];

    const orderMatch = details.match(/Nr:\s*(\d+)/);
    const orderId = orderMatch ? orderMatch[1] : '';

    const vendorRaw = parts[4].replace(/^"|"$/g, '').replace('Vendedor:', '').trim();
    const prodName = parts[7].replace(/^"|"$/g, '').trim();
    const qty = parseFloat(parts[8].replace(',', '.')) || 0;
    const totalVal = parseFloat(parts[13].replace(',', '.')) || 0;

    const isTax = prodName.includes('TAXA DE SERVICO');

    // Day grouping
    if (!daysMap.has(dateStr)) {
      const [d, m, y] = dateStr.split('/').map(Number);
      const dt = new Date(y, m - 1, d);
      daysMap.set(dateStr, {
        dateStr,
        isoDate: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        dow: dt.getDay(),
        revenue: 0,
        orders: new Set(),
        dishes: {}
      });
    }

    const dayObj = daysMap.get(dateStr);
    dayObj.revenue += totalVal;
    if (orderId) dayObj.orders.add(orderId);

    if (!isTax) {
      const recipeId = mapDishToRecipeId(prodName);
      if (recipeId) {
        dayObj.dishes[recipeId] = (dayObj.dishes[recipeId] || 0) + qty;
      }
    }

    // Waiter stats
    if (vendorRaw) {
      if (!waitersMap.has(vendorRaw)) {
        waitersMap.set(vendorRaw, { name: vendorRaw, gross: 0, tax: 0, orders: new Set() });
      }
      const w = waitersMap.get(vendorRaw);
      if (orderId) w.orders.add(orderId);
      if (isTax) {
        w.tax += totalVal;
      } else {
        w.gross += totalVal;
      }
    }
  }

  // Sort days by ISO date
  const sortedDays = Array.from(daysMap.values()).sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  // Build the 12-week structure for each day of week (take last 12 occurrences)
  const result12Weeks = {};

  ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'].forEach(dayKey => {
    result12Weeks[dayKey] = {
      dayName: dayKey,
      dayLabel: dayLabels[dayKey],
      historical12WeeksSales: []
    };
  });

  for (const day of sortedDays) {
    const dayKey = dayMap[day.dow];
    if (!dayKey) continue;
    result12Weeks[dayKey].historical12WeeksSales.push({
      date: day.dateStr,
      isoDate: day.isoDate,
      totalRevenue: Math.round(day.revenue),
      pax: Math.round(day.orders.size * 2.2), // Estimated 2.2 pax per table/command
      dishSales: Object.fromEntries(
        Object.entries(day.dishes).map(([k, v]) => [k, Math.round(v)])
      )
    });
  }

  // Trim to 12 most recent weeks and index 1..12
  for (const dayKey of Object.keys(result12Weeks)) {
    const list = result12Weeks[dayKey].historical12WeeksSales;
    const trimmed = list.slice(-12);
    result12Weeks[dayKey].historical12WeeksSales = trimmed.map((item, idx) => ({
      weekNumber: idx + 1,
      date: item.date,
      totalRevenue: item.totalRevenue,
      pax: item.pax,
      dishSales: item.dishSales
    }));
  }

  // Build Commissioner Audit from real data
  const commissionerAudits = [];
  const topWaiters = Array.from(waitersMap.values())
    .filter(w => w.gross > 5000)
    .sort((a, b) => b.gross - a.gross);

  const totalAllGross = topWaiters.reduce((a, b) => a + b.gross, 0);
  const totalAllTax = topWaiters.reduce((a, b) => a + b.tax, 0);
  const brigadeAvgRate = totalAllGross > 0 ? (totalAllTax / totalAllGross) * 100 : 9.5;

  topWaiters.forEach((w, idx) => {
    const theoretical10Pct = w.gross * 0.10;
    const cancelledTax = Math.max(0, theoretical10Pct - w.tax);
    const cancellationRate = theoretical10Pct > 0 ? (cancelledTax / theoretical10Pct) * 100 : 0;
    const isAnomaly = cancellationRate > 15;

    commissionerAudits.push({
      id: `comm-${idx + 1}`,
      name: w.name,
      role: 'Atendente / Comissário',
      tablesServedCount: w.orders.size,
      totalGrossSales: Math.round(w.gross * 100) / 100,
      serviceFee10PctGenerated: Math.round(w.tax * 100) / 100,
      serviceFee10PctCancelled: Math.round(cancelledTax * 100) / 100,
      cancellationRatePct: Math.round(cancellationRate * 10) / 10,
      brigadeAverageRatePct: Math.round((10 - brigadeAvgRate) * 10) / 10,
      riskStatus: cancellationRate > 20 ? 'ALERTA_DISCIPLINAR' : cancellationRate > 10 ? 'ATENCAO' : 'NORMAL',
      isAnomaly,
      auditReason: isAnomaly
        ? `Taxa de cancelamento de serviço de ${cancellationRate.toFixed(1)}% está acima do padrão da brigada.`
        : 'Operação dentro do desvio padrão seguro do restaurante.'
    });
  });

  // Save generated data to a JSON module
  const outputData = {
    weeklyHistory: result12Weeks,
    commissionerAudits
  };

  fs.writeFileSync('src/data/predictiveRealSalesData.json', JSON.stringify(outputData, null, 2), 'utf8');
  console.log('Histórico de 12 semanas e auditoria real salvos em: src/data/predictiveRealSalesData.json');
}

process12Weeks().catch(console.error);
