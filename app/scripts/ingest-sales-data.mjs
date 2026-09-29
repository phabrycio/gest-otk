import fs from 'fs';
import readline from 'readline';

const CSV_PATH = 'C:\\Users\\phabr\\OneDrive\\Desktop\\Vendas-Realizadas-Por-Caixa (2).csv';

// Known brands to recognize in Engenho's inventory
const KNOWN_BRANDS = [
  'HEINEKEN', 'AMSTEL', 'EISENBAHN', 'CORONA', 'STELLA ARTOIS', 'BUDWEISER', 'BRAHMA', 'SKOL',
  'COCA-COLA', 'COCA COLA', 'GUARANA ANTARCTICA', 'GUARANA', 'RED BULL', 'SCHWEPPES', 'MONIN',
  '3 CORACOES', 'TRES CORACOES', 'CHANDON', 'MIOLO', 'CASA VALDUGA', 'SALTON',
  'JOHNNIE WALKER', 'BLACK LABEL', 'RED LABEL', 'CHIVAS', 'JACK DANIELS', 'TANQUERAY', 'BOMBAY',
  'SMIRNOFF', 'ABSOLUT', 'BACARDI', 'CAMPARI', 'APEROL', 'SAGATIBA', 'SELETA', 'VALE VERDE',
  'PIRARUCU', 'TAMBAQUI', 'SEARA', 'FRIBINA', 'MINERVA', 'JBS', 'NESTLE', 'PIRACANJUBA', 'CATUPIRY'
];

// Thaw items that need advance defrosting from freezer/chamber to prep
const THAW_KEYWORDS = [
  { key: 'TAMBAQUI', label: 'Costela / Filé de Tambaqui', category: 'Peixes Regionais', prepDaysLead: 1, defrostHours: 18 },
  { key: 'PIRARUCU', label: 'Filé / Lombo de Pirarucu', category: 'Peixes Regionais', prepDaysLead: 1, defrostHours: 20 },
  { key: 'PICANHA', label: 'Picanha Bovina', category: 'Carnes Nobres', prepDaysLead: 1, defrostHours: 24 },
  { key: 'CARNE DE SOL', label: 'Carne de Sol de Alcatra', category: 'Carnes Nobres', prepDaysLead: 1, defrostHours: 16 },
  { key: 'COSTELA', label: 'Costela Suína / Bovina', category: 'Carnes Nobres', prepDaysLead: 1, defrostHours: 20 },
  { key: 'JOELHO', label: 'Joelho de Porco (Eisbein)', category: 'Carnes Nobres', prepDaysLead: 2, defrostHours: 24 },
  { key: 'FILE MIGNON', label: 'Filé Mignon Bovino', category: 'Carnes Nobres', prepDaysLead: 1, defrostHours: 16 },
  { key: 'FILE', label: 'Filé Bovino', category: 'Carnes Nobres', prepDaysLead: 1, defrostHours: 16 },
  { key: 'CAMARAO', label: 'Camarão Rosa / Cinza', category: 'Frutos do Mar', prepDaysLead: 1, defrostHours: 12 },
  { key: 'POLVO', label: 'Polvo Inteiro', category: 'Frutos do Mar', prepDaysLead: 1, defrostHours: 14 },
  { key: 'SALMAO', label: 'Salmão Fresco/Congelado', category: 'Peixes', prepDaysLead: 1, defrostHours: 12 },
  { key: 'CORACAO', label: 'Coração de Galinha', category: 'Aves', prepDaysLead: 1, defrostHours: 12 },
  { key: 'FRANGO', label: 'Frango / Sobrecoxa', category: 'Aves', prepDaysLead: 1, defrostHours: 14 },
  { key: 'QUEIJO COALHO', label: 'Queijo Coalho Grelhado', category: 'Laticínios', prepDaysLead: 1, defrostHours: 8 },
  { key: 'DADINHO', label: 'Dadinho de Tapioca', category: 'Petiscos', prepDaysLead: 1, defrostHours: 6 }
];

async function parseCSV() {
  console.log('Iniciando análise do arquivo de vendas:', CSV_PATH);
  const stream = fs.createReadStream(CSV_PATH, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let totalLines = 0;
  let parsedSales = 0;
  let skippedLines = 0;

  let grandTotalRevenue = 0;
  let grandTotalQty = 0;

  // Daily aggregations: date -> { revenue, qty, ordersCount: Set, items: Map(prodName -> {qty, rev}) }
  const dailyStats = new Map();
  // Hourly distribution: hour -> revenue
  const hourlyStats = new Array(24).fill(0);
  // Day of week distribution: 0..6 -> { revenue, orders, qty }
  const dowStats = [
    { day: 'Domingo', revenue: 0, orders: 0, count: 0 },
    { day: 'Segunda-feira', revenue: 0, orders: 0, count: 0 },
    { day: 'Terça-feira', revenue: 0, orders: 0, count: 0 },
    { day: 'Quarta-feira', revenue: 0, orders: 0, count: 0 },
    { day: 'Quinta-feira', revenue: 0, orders: 0, count: 0 },
    { day: 'Sexta-feira', revenue: 0, orders: 0, count: 0 },
    { day: 'Sábado', revenue: 0, orders: 0, count: 0 }
  ];

  // Product master: code -> { code, name, unit, totalQty, totalRevenue, minPrice, maxPrice, daysActive: Set, dailyAvg: 0 }
  const productsMap = new Map();
  // Payment methods: method -> { totalRevenue, count }
  const paymentsMap = new Map();
  // Waiters: name -> { revenue, itemsCount }
  const waitersMap = new Map();
  // Cashiers: name -> { revenue, itemsCount }
  const cashiersMap = new Map();
  // Brands: brandName -> { revenue, qty, products: Set }
  const brandsMap = new Map();

  for await (const line of rl) {
    totalLines++;
    if (!line.startsWith('"0104 MNS"')) {
      skippedLines++;
      continue;
    }

    const parts = line.split(';');
    if (parts.length < 14) {
      skippedLines++;
      continue;
    }

    // 0: Unidade ("0104 MNS")
    // 1: Caixa ("001 CAIXA 001 NFCE")
    const cashier = parts[1].replace(/^"|"$/g, '').trim();

    // 2: Details: "Nr: 0000191218 -  Data Venda: 01/07/2026 13:17:47 - Cupom: 000134383 - Mesa/Comanda: 0010"
    const details = parts[2].replace(/^"|"$/g, '').trim();
    const dateMatch = details.match(/Data Venda:\s*(\d{2}\/\d{2}\/\d{4})\s*(\d{2}):(\d{2}):(\d{2})/);
    if (!dateMatch) {
      skippedLines++;
      continue;
    }

    const dateStr = dateMatch[1]; // DD/MM/YYYY
    const hour = parseInt(dateMatch[2], 10);
    const orderMatch = details.match(/Nr:\s*(\d+)/);
    const orderId = orderMatch ? orderMatch[1] : `${dateStr}_${totalLines}`;
    const tableMatch = details.match(/Mesa\/Comanda:\s*([^-\n]+)/);
    const table = tableMatch ? tableMatch[1].trim() : 'BALCAO';

    // 4: Vendedor: "Vendedor: 0394  /  "
    const vendorRaw = parts[4].replace(/^"|"$/g, '').replace('Vendedor:', '').trim();

    // 5: Recebimento: "Recebimento: VISA CRÉDITO - R$: 188.58"
    const payRaw = parts[5].replace(/^"|"$/g, '').trim();
    const payMatch = payRaw.match(/Recebimento:\s*([^-\n]+)/);
    const payMethod = payMatch ? payMatch[1].trim().toUpperCase() : 'OUTROS';

    // 6: Código do Produto
    const prodCode = parts[6].replace(/^"|"$/g, '').trim();

    // 7: Produto
    const prodName = parts[7].replace(/^"|"$/g, '').trim();

    // 8: Quantidade
    const qty = parseFloat(parts[8].replace(',', '.')) || 0;

    // 9: Unidade
    const unit = parts[9].replace(/^"|"$/g, '').trim() || 'UN';

    // 10: Preço Unitário
    const unitPrice = parseFloat(parts[10].replace(',', '.')) || 0;

    // 11: Desconto
    const discount = parseFloat(parts[11].replace(',', '.')) || 0;

    // 12: Acréscimo
    const surcharge = parseFloat(parts[12].replace(',', '.')) || 0;

    // 13: Valor Total
    const totalVal = parseFloat(parts[13].replace(',', '.')) || 0;

    // Ignore service fees from food/drinks stats, or track separately
    const isServiceTax = prodName.toUpperCase().includes('TAXA DE SERVICO');

    parsedSales++;
    grandTotalRevenue += totalVal;
    if (!isServiceTax) grandTotalQty += qty;

    // Hourly
    if (hour >= 0 && hour < 24) {
      hourlyStats[hour] += totalVal;
    }

    // Day of week calculation from DD/MM/YYYY
    const [d, m, y] = dateStr.split('/').map(Number);
    const dt = new Date(y, m - 1, d);
    const dow = dt.getDay(); // 0 is Sunday
    if (!isNaN(dow)) {
      dowStats[dow].revenue += totalVal;
      dowStats[dow].count++;
    }

    // Daily aggregation
    if (!dailyStats.has(dateStr)) {
      dailyStats.set(dateStr, {
        date: dateStr,
        isoDate: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        revenue: 0,
        qty: 0,
        orders: new Set(),
        tables: new Set(),
        topItems: new Map()
      });
    }
    const dayObj = dailyStats.get(dateStr);
    dayObj.revenue += totalVal;
    dayObj.orders.add(orderId);
    dayObj.tables.add(table);
    if (!isServiceTax) {
      dayObj.qty += qty;
      dayObj.topItems.set(prodName, (dayObj.topItems.get(prodName) || 0) + qty);
    }

    // Cashier & Waiter stats
    if (cashier) {
      const cStat = cashiersMap.get(cashier) || { revenue: 0, count: 0 };
      cStat.revenue += totalVal;
      cStat.count++;
      cashiersMap.set(cashier, cStat);
    }
    if (vendorRaw) {
      const wStat = waitersMap.get(vendorRaw) || { revenue: 0, count: 0 };
      wStat.revenue += totalVal;
      wStat.count++;
      waitersMap.set(vendorRaw, wStat);
    }

    // Payments
    if (payMethod) {
      const pStat = paymentsMap.get(payMethod) || { revenue: 0, count: 0 };
      pStat.revenue += totalVal;
      pStat.count++;
      paymentsMap.set(payMethod, pStat);
    }

    // Product Master tracking (exclude pure tax)
    if (!isServiceTax && prodName) {
      if (!productsMap.has(prodCode)) {
        // Detect brand
        let foundBrand = 'ENGENHO / REGIONAL';
        const upper = prodName.toUpperCase();
        for (const b of KNOWN_BRANDS) {
          if (upper.includes(b)) {
            foundBrand = b;
            break;
          }
        }

        productsMap.set(prodCode, {
          code: prodCode,
          name: prodName,
          unit,
          brand: foundBrand,
          totalQty: 0,
          totalRevenue: 0,
          minPrice: unitPrice,
          maxPrice: unitPrice,
          activeDays: new Set(),
          weekdayQty: 0,
          weekendQty: 0
        });
      }

      const pData = productsMap.get(prodCode);
      pData.totalQty += qty;
      pData.totalRevenue += totalVal;
      pData.activeDays.add(dateStr);
      if (unitPrice > 0) {
        if (unitPrice < pData.minPrice || pData.minPrice === 0) pData.minPrice = unitPrice;
        if (unitPrice > pData.maxPrice) pData.maxPrice = unitPrice;
      }
      if (dow === 0 || dow === 5 || dow === 6) {
        pData.weekendQty += qty;
      } else {
        pData.weekdayQty += qty;
      }

      // Brand mapping
      if (pData.brand) {
        const bStat = brandsMap.get(pData.brand) || { revenue: 0, qty: 0, products: new Set() };
        bStat.revenue += totalVal;
        bStat.qty += qty;
        bStat.products.add(prodName);
        brandsMap.set(pData.brand, bStat);
      }
    }
  }

  const totalDays = dailyStats.size || 1;
  console.log(`\n==== RESULTADO DO PROCESSAMENTO ====`);
  console.log(`Linhas totais lidas: ${totalLines.toLocaleString()}`);
  console.log(`Linhas de vendas válidas: ${parsedSales.toLocaleString()}`);
  console.log(`Dias de operação analisados: ${totalDays}`);
  console.log(`Faturamento total registrado: R$ ${grandTotalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`Itens físicos vendidos: ${grandTotalQty.toLocaleString()}`);
  console.log(`Mix de produtos únicos: ${productsMap.size}`);

  // Calculate daily averages and stock metrics
  const productAnalytics = [];
  for (const [code, p] of productsMap.entries()) {
    const dailyAvg = p.totalQty / totalDays;
    const weekdayAvg = p.weekdayQty / (totalDays * (4 / 7));
    const weekendAvg = p.weekendQty / (totalDays * (3 / 7));
    const avgPrice = p.totalQty > 0 ? p.totalRevenue / p.totalQty : p.maxPrice;

    // Safety stock logic:
    // Lead time default = 3 days (CDA or local supplier delivery)
    // Safety buffer = 2 days of weekend peak
    const minStock = Math.ceil(dailyAvg * 3 + weekendAvg * 1.5);
    const idealStock = Math.ceil(dailyAvg * 14); // 2 weeks target
    const weeklyOrderNeed = Math.ceil(dailyAvg * 7);

    productAnalytics.push({
      code,
      name: p.name,
      brand: p.brand,
      unit: p.unit,
      totalQty: Math.round(p.totalQty * 100) / 100,
      totalRevenue: Math.round(p.totalRevenue * 100) / 100,
      avgPrice: Math.round(avgPrice * 100) / 100,
      dailyAvg: Math.round(dailyAvg * 100) / 100,
      weekdayAvg: Math.round(weekdayAvg * 100) / 100,
      weekendAvg: Math.round(weekendAvg * 100) / 100,
      minStock,
      idealStock,
      weeklyOrderNeed,
      activeDaysCount: p.activeDays.size
    });
  }

  // Sort by revenue
  productAnalytics.sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Identify Defrost / Kitchen Thaw items
  const thawRecommendations = [];
  for (const tk of THAW_KEYWORDS) {
    const matchingProducts = productAnalytics.filter(p => p.name.toUpperCase().includes(tk.key));
    const combinedDailyAvg = matchingProducts.reduce((acc, p) => acc + p.dailyAvg, 0);
    const combinedWeekendAvg = matchingProducts.reduce((acc, p) => acc + p.weekendAvg, 0);
    const combinedWeekdayAvg = matchingProducts.reduce((acc, p) => acc + p.weekdayAvg, 0);
    const totalRev = matchingProducts.reduce((acc, p) => acc + p.totalRevenue, 0);
    const totalQty = matchingProducts.reduce((acc, p) => acc + p.totalQty, 0);

    if (totalQty > 0) {
      thawRecommendations.push({
        keyword: tk.key,
        name: tk.label,
        category: tk.category,
        defrostHours: tk.defrostHours,
        prepDaysLead: tk.prepDaysLead,
        unit: matchingProducts[0]?.unit || 'KG/PORCAO',
        totalQtySold: Math.round(totalQty * 10) / 10,
        totalRevenue: Math.round(totalRev * 100) / 100,
        avgDailyThaw: Math.ceil(combinedDailyAvg * 1.1), // 10% safety buffer for daily kitchen prep
        weekdayThawQuota: Math.ceil(combinedWeekdayAvg * 1.05), // Mon-Thu
        weekendThawQuota: Math.ceil(combinedWeekendAvg * 1.15), // Fri-Sun peak
        minChamberStock: Math.ceil(combinedWeekendAvg * 3), // 3 days buffer
        matchedProducts: matchingProducts.map(p => ({ code: p.code, name: p.name, dailyAvg: p.dailyAvg }))
      });
    }
  }

  // Daily list formatted for charts
  const sortedDays = Array.from(dailyStats.values())
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
    .map(d => ({
      date: d.date,
      isoDate: d.isoDate,
      revenue: Math.round(d.revenue * 100) / 100,
      qty: Math.round(d.qty),
      ordersCount: d.orders.size,
      ticketMedio: d.orders.size > 0 ? Math.round((d.revenue / d.orders.size) * 100) / 100 : 0,
      topItem: Array.from(d.topItems.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    }));

  // Payment methods summary
  const paymentsSummary = Array.from(paymentsMap.entries())
    .map(([method, data]) => ({
      method,
      revenue: Math.round(data.revenue * 100) / 100,
      count: data.count,
      percentage: grandTotalRevenue > 0 ? Math.round((data.revenue / grandTotalRevenue) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Brands summary
  const brandsSummary = Array.from(brandsMap.entries())
    .map(([brand, data]) => ({
      brand,
      revenue: Math.round(data.revenue * 100) / 100,
      qty: Math.round(data.qty),
      productsCount: data.products.size,
      topItems: Array.from(data.products).slice(0, 5)
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Weekly Purchasing Order Recommendations (Top 50 high-velocity & critical items)
  const weeklyPurchasingList = productAnalytics
    .filter(p => p.dailyAvg > 0.3) // items sold regularly
    .slice(0, 60)
    .map(p => ({
      code: p.code,
      name: p.name,
      brand: p.brand,
      unit: p.unit,
      dailyAvg: p.dailyAvg,
      currentSafetyStock: p.minStock,
      recommendedOrderQty: p.weeklyOrderNeed,
      estimatedWeeklyCost: Math.round(p.weeklyOrderNeed * p.avgPrice * 100) / 100,
      avgPrice: p.avgPrice
    }));

  const fullAnalytics = {
    generatedAt: new Date().toISOString(),
    sourceFile: CSV_PATH,
    summary: {
      totalRevenue: Math.round(grandTotalRevenue * 100) / 100,
      totalItemsSold: Math.round(grandTotalQty),
      totalDays,
      dateRange: {
        firstDay: sortedDays[0]?.date,
        lastDay: sortedDays[sortedDays.length - 1]?.date
      },
      dailyAverageRevenue: Math.round((grandTotalRevenue / totalDays) * 100) / 100,
      dailyAverageOrders: Math.round(sortedDays.reduce((a, b) => a + b.ordersCount, 0) / totalDays),
      ticketMedioGlobal: Math.round((grandTotalRevenue / Math.max(1, sortedDays.reduce((a, b) => a + b.ordersCount, 0))) * 100) / 100
    },
    thawRecommendations,
    weeklyPurchasingList,
    topProductsByRevenue: productAnalytics.slice(0, 50),
    topProductsByVolume: [...productAnalytics].sort((a, b) => b.totalQty - a.totalQty).slice(0, 50),
    paymentsSummary,
    brandsSummary,
    dailyTrends: sortedDays,
    hourlyDistribution: hourlyStats.map((rev, hour) => ({
      hour: `${String(hour).padStart(2, '0')}:00`,
      revenue: Math.round(rev * 100) / 100
    })),
    dayOfWeekDistribution: dowStats.map(s => ({
      day: s.day,
      revenue: Math.round(s.revenue * 100) / 100,
      share: grandTotalRevenue > 0 ? Math.round((s.revenue / grandTotalRevenue) * 1000) / 10 : 0
    }))
  };

  // Write analytics to JSON for use across the application
  const outputPath = 'src/data/salesAnalyticsData.json';
  fs.writeFileSync(outputPath, JSON.stringify(fullAnalytics, null, 2), 'utf8');
  console.log(`\nDados consolidados com sucesso salvos em: ${outputPath}`);

  return fullAnalytics;
}

parseCSV().catch(console.error);
